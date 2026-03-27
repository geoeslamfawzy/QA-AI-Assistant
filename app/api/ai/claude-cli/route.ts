/**
 * POST /api/ai/claude-cli — Send prompt to Claude CLI
 * Body: { prompt: "...", model: "claude-sonnet-4-6", feature: "test-cases" }
 *
 * GET /api/ai/claude-cli — Get current progress
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  callClaudeCli,
  getClaudeCliProgress,
  resetClaudeCliProgress,
  isClaudeCliAvailable,
  type ClaudeModel,
} from '@/lib/ai/claude-cli-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, feature } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    // Check if CLI is available
    const { available, error: cliError } = await isClaudeCliAvailable();
    if (!available) {
      return NextResponse.json(
        {
          error: cliError || 'Claude CLI not available',
          installInstructions:
            'npm install -g @anthropic-ai/claude-code && claude login',
        },
        { status: 503 }
      );
    }

    const selectedModel: ClaudeModel = model || 'claude-sonnet-4-6';
    console.log(
      `[Claude CLI API] Feature: ${feature}, Model: ${selectedModel}, Prompt: ${prompt.length} chars`
    );

    resetClaudeCliProgress();

    // Start in background — FE polls GET for progress
    // callClaudeCli always pipes via stdin (safe for any prompt length)
    callClaudeCli(prompt, { model: selectedModel })
      .then((output) => {
        console.log(`[Claude CLI API] Completed: ${output.length} chars`);
      })
      .catch((err) => {
        console.error(`[Claude CLI API] Error:`, err.message);
      });

    return NextResponse.json({
      success: true,
      message: 'Claude CLI request started. Poll GET /api/ai/claude-cli for progress.',
      model: selectedModel,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const progress = getClaudeCliProgress();
  return NextResponse.json(progress);
}
