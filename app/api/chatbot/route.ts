/**
 * POST /api/chatbot — Ask a question
 * Body: {
 *   question: "How does payment work?",
 *   mode: "gemini" | "claude-cli" | "manual",
 *   model: "claude-sonnet-4-6",
 *   history: [{ role, content, timestamp }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  buildChatbotPrompt,
  type ChatMessage,
} from '@/lib/chatbot/prompt-builder';
import { callGemini, isGeminiConfigured } from '@/lib/ai/gemini-client';
import {
  callClaudeCli,
  isClaudeCliAvailable,
  resetClaudeCliProgress,
} from '@/lib/ai/claude-cli-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { question, mode, model, history } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const { prompt, sources, hasContext } = buildChatbotPrompt(
      question,
      (history || []) as ChatMessage[]
    );

    // Manual mode — return the prompt for copy-paste
    if (mode === 'manual') {
      return NextResponse.json({
        success: true,
        mode: 'manual',
        prompt,
        sources,
        hasContext,
      });
    }

    // Gemini mode — call directly and return
    if (mode === 'gemini') {
      if (!isGeminiConfigured()) {
        return NextResponse.json(
          { error: 'Gemini not configured' },
          { status: 503 }
        );
      }
      const response = await callGemini(prompt);
      return NextResponse.json({
        success: true,
        mode: 'gemini',
        response,
        sources,
        hasContext,
      });
    }

    // Claude CLI mode — start in background
    if (mode === 'claude-cli') {
      const { available, error } = await isClaudeCliAvailable();
      if (!available) {
        return NextResponse.json(
          { error: error || 'Claude CLI not available' },
          { status: 503 }
        );
      }

      resetClaudeCliProgress();
      callClaudeCli(prompt, { model: model || 'claude-sonnet-4-6' }).catch(
        (err) => console.error('[Chatbot CLI]', err.message)
      );

      return NextResponse.json({
        success: true,
        mode: 'claude-cli',
        message: 'Processing. Poll GET /api/ai/claude-cli for progress.',
        sources,
        hasContext,
      });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
