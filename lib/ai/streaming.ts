/**
 * Create a streaming text response for API routes
 */
export function createStreamingResponse(
  stream: AsyncIterable<string>
): Response {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          // Format as SSE
          const data = JSON.stringify({ text: chunk });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: errorMessage })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

/**
 * Create a JSON streaming response (for structured output)
 */
export function createJsonStreamingResponse(
  stream: AsyncIterable<string>
): Response {
  const encoder = new TextEncoder();
  let buffer = '';

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          buffer += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(encoder.encode(`\n\n{"error": "${errorMessage}"}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}

/**
 * Parse a streaming JSON response as it arrives
 * Returns partial JSON objects as they become available
 */
export async function* parseStreamingJson<T>(
  stream: AsyncIterable<string>
): AsyncGenerator<{ partial: string; complete: boolean; parsed?: T }> {
  let buffer = '';

  for await (const chunk of stream) {
    buffer += chunk;

    // Try to parse the buffer as JSON
    try {
      const parsed = JSON.parse(buffer) as T;
      yield { partial: buffer, complete: true, parsed };
    } catch {
      // Not yet valid JSON, yield the partial
      yield { partial: buffer, complete: false };
    }
  }
}

/**
 * Collect all chunks from a stream into a single string
 */
export async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let result = '';
  for await (const chunk of stream) {
    result += chunk;
  }
  return result;
}

/**
 * Parse SSE events from a fetch response
 */
export async function* parseSSEStream(
  response: Response
): AsyncGenerator<{ text?: string; error?: string; done: boolean }> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);

        if (data === '[DONE]') {
          yield { done: true };
          return;
        }

        try {
          const parsed = JSON.parse(data);
          yield { ...parsed, done: false };
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }
}
