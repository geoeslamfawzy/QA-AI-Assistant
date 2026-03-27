/**
 * GET /api/ai/claude-cli/test — Quick test of Claude CLI
 * Sends a simple prompt and returns the result with timing.
 */

import { NextResponse } from 'next/server';
import { isClaudeCliAvailable, callClaudeCli } from '@/lib/ai/claude-cli-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Step 1: Check availability
  const available = await isClaudeCliAvailable();
  if (!available.available) {
    return NextResponse.json({
      success: false,
      available: false,
      error: available.error,
    });
  }

  // Step 2: Run a quick test
  try {
    const start = Date.now();
    const response = await callClaudeCli(
      'Reply with exactly this JSON and nothing else: {"status": "ok", "message": "Claude CLI working"}',
      { model: 'claude-haiku-4-5-20251001', timeout: 60000 }
    );
    const duration = Date.now() - start;

    return NextResponse.json({
      success: true,
      available: true,
      version: available.version,
      response,
      duration: `${duration}ms`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({
      success: false,
      available: true,
      version: available.version,
      error: error.message,
    });
  }
}
