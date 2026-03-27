/**
 * GET /api/ai/status — Check which AI providers are configured
 */

import { NextResponse } from 'next/server';
import {
  isGeminiConfigured,
  testGeminiConnection,
  GEMINI_MODEL,
} from '@/lib/ai/gemini-client';
import { isApiKeyConfigured } from '@/lib/ai/client';
import { isClaudeCliAvailable } from '@/lib/ai/claude-cli-client';

export const dynamic = 'force-dynamic';

// Cache connection test results for 60 seconds
let cachedGeminiStatus: {
  connected: boolean;
  error?: string;
  timestamp: number;
} | null = null;
const CACHE_DURATION_MS = 60000;

export async function GET() {
  const geminiConfigured = isGeminiConfigured();
  const anthropicConfigured = isApiKeyConfigured();

  let geminiStatus = {
    configured: geminiConfigured,
    connected: false,
    model: GEMINI_MODEL,
    freeKeyUrl: 'https://aistudio.google.com/apikey',
    error: geminiConfigured ? undefined : 'API key not configured',
  };

  // Test Gemini connection if configured (with caching)
  if (geminiConfigured) {
    const now = Date.now();
    if (
      cachedGeminiStatus &&
      now - cachedGeminiStatus.timestamp < CACHE_DURATION_MS
    ) {
      geminiStatus.connected = cachedGeminiStatus.connected;
      geminiStatus.error = cachedGeminiStatus.error;
    } else {
      const testResult = await testGeminiConnection();
      geminiStatus.connected = testResult.connected;
      geminiStatus.error = testResult.error;

      // Cache the result
      cachedGeminiStatus = {
        connected: testResult.connected,
        error: testResult.error,
        timestamp: now,
      };
    }
  }

  // Check Claude CLI availability
  const cliStatus = await isClaudeCliAvailable();

  return NextResponse.json({
    providers: {
      gemini: geminiStatus,
      anthropic: {
        configured: anthropicConfigured,
        connected: anthropicConfigured, // Assume connected if configured
        model: 'claude-sonnet-4-20250514',
        note: 'Used for story analysis and test generation',
      },
      claudeCli: {
        available: cliStatus.available,
        version: cliStatus.version,
        error: cliStatus.error,
        models: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6', 'claude-opus-4-6'],
        note: 'Uses existing Claude subscription — no extra fees',
      },
    },
  });
}
