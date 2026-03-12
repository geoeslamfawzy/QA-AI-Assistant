/**
 * Google Gemini API Client
 *
 * Uses the free tier of Gemini 2.0 Flash.
 * Docs: https://ai.google.dev/gemini-api/docs
 *
 * Free limits:
 * - 15 RPM (requests per minute)
 * - 1,500 RPD (requests per day)
 * - 1M token context window
 */

export const GEMINI_MODEL = 'gemini-2.0-flash';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_MAX_OUTPUT_TOKENS = 8192;
export const GEMINI_RATE_LIMIT_DELAY_MS = 5000; // 5 seconds between calls

export interface GeminiConfig {
  apiKey: string;
}

export interface GeminiResponse {
  text: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/**
 * Get Gemini configuration from environment.
 */
function getGeminiConfig(): GeminiConfig | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === '' || apiKey.includes('your-key')) {
    return null;
  }
  return { apiKey };
}

/**
 * Check if Gemini API key is configured.
 */
export function isGeminiConfigured(): boolean {
  return getGeminiConfig() !== null;
}

/**
 * Call Gemini API to generate text.
 * Handles rate limiting with automatic retry.
 */
export async function callGemini(
  prompt: string,
  maxRetries: number = 3
): Promise<string> {
  const config = getGeminiConfig();
  if (!config) {
    throw new Error(
      'Gemini API not configured. Add GEMINI_API_KEY to .env.local. Get a free key at https://aistudio.google.com/apikey'
    );
  }

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${config.apiKey}`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
            temperature: 0.3, // Low temperature for factual documentation
          },
        }),
      });

      if (response.status === 429) {
        // Rate limited — wait and retry
        const waitTime = Math.min(15 * (attempt + 1), 60); // 15s, 30s, 45s, 60s
        console.log(
          `[Gemini] Rate limited. Waiting ${waitTime}s before retry ${attempt + 1}/${maxRetries}...`
        );
        await new Promise((r) => setTimeout(r, waitTime * 1000));
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API ${response.status}: ${errText}`);
      }

      const data = await response.json();

      // Extract text from response
      const text =
        data.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text)
          ?.join('') || '';

      if (!text) {
        throw new Error('Gemini returned empty response');
      }

      return text;
    } catch (err: unknown) {
      const error = err as Error;
      if (attempt === maxRetries) throw err;
      if (!error.message?.includes('429')) throw err; // Only retry on rate limits
    }
  }

  throw new Error('Gemini API: max retries exceeded');
}

/**
 * Create a message with Gemini API (structured response).
 */
export async function createGeminiMessage(params: {
  systemPrompt?: string;
  userMessage: string;
  maxTokens?: number;
}): Promise<GeminiResponse> {
  // Combine system prompt and user message for Gemini
  // Gemini doesn't have a separate system prompt like Claude
  const fullPrompt = params.systemPrompt
    ? `${params.systemPrompt}\n\n${params.userMessage}`
    : params.userMessage;

  const text = await callGemini(fullPrompt);

  return {
    text,
    // Token counts not easily available without parsing response metadata
  };
}

/**
 * Test the Gemini connection.
 */
export async function testGeminiConnection(): Promise<{
  connected: boolean;
  model?: string;
  error?: string;
}> {
  if (!isGeminiConfigured()) {
    return {
      connected: false,
      error: 'API key not configured',
    };
  }

  try {
    const response = await callGemini(
      'Reply with exactly: "Gemini connected successfully"'
    );
    return {
      connected: response.toLowerCase().includes('connected'),
      model: GEMINI_MODEL,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      connected: false,
      model: GEMINI_MODEL,
      error: error.message,
    };
  }
}

/**
 * Rate-limited Gemini client for sequential operations.
 */
export class RateLimitedGeminiClient {
  private lastCallTime = 0;
  private delayMs: number;

  constructor(delayMs: number = GEMINI_RATE_LIMIT_DELAY_MS) {
    this.delayMs = delayMs;
  }

  /**
   * Wait for rate limit delay since last call.
   */
  async waitForRateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastCallTime;
    if (this.lastCallTime > 0 && elapsed < this.delayMs) {
      const waitTime = this.delayMs - elapsed;
      console.log(`[Gemini] Rate limiting: waiting ${waitTime}ms...`);
      await new Promise((r) => setTimeout(r, waitTime));
    }
  }

  /**
   * Generate content with rate limiting.
   */
  async generate(prompt: string, maxRetries: number = 3): Promise<string> {
    await this.waitForRateLimit();
    this.lastCallTime = Date.now();
    return callGemini(prompt, maxRetries);
  }

  /**
   * Get time since last API call.
   */
  getLastCallTime(): number {
    return this.lastCallTime;
  }
}

/**
 * Create a rate-limited Gemini client instance.
 */
export function createRateLimitedGeminiClient(
  delayMs?: number
): RateLimitedGeminiClient {
  return new RateLimitedGeminiClient(delayMs);
}
