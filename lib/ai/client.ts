import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model configuration
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
export const DEFAULT_MAX_TOKENS = 8000;

/**
 * Create a message with the Claude API (non-streaming)
 */
export async function createMessage(params: {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  model?: string;
}): Promise<string> {
  const response = await anthropic.messages.create({
    model: params.model || DEFAULT_MODEL,
    max_tokens: params.maxTokens || DEFAULT_MAX_TOKENS,
    system: params.systemPrompt,
    messages: [
      {
        role: 'user',
        content: params.userMessage,
      },
    ],
  });

  // Extract text from the response
  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}

/**
 * Create a streaming message with the Claude API
 */
export async function createStreamingMessage(params: {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  model?: string;
}): Promise<AsyncIterable<string>> {
  const stream = anthropic.messages.stream({
    model: params.model || DEFAULT_MODEL,
    max_tokens: params.maxTokens || DEFAULT_MAX_TOKENS,
    system: params.systemPrompt,
    messages: [
      {
        role: 'user',
        content: params.userMessage,
      },
    ],
  });

  return streamToAsyncIterable(stream);
}

/**
 * Convert Anthropic stream to async iterable of text chunks
 */
async function* streamToAsyncIterable(
  stream: ReturnType<typeof anthropic.messages.stream>
): AsyncIterable<string> {
  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}

/**
 * Get the Anthropic client instance
 */
export function getAnthropicClient(): Anthropic {
  return anthropic;
}

/**
 * Estimate token count for a string (rough estimate)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Check if the API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
