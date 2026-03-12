/**
 * POST /api/context-generation/auto — Start automatic generation
 * GET /api/context-generation/auto — Get progress
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  runAutoContextGeneration,
  getAutoGenProgress,
  isAutoGenRunning,
} from '@/lib/context-sync/auto-context-generator';
import { isGeminiConfigured } from '@/lib/ai/gemini-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Check if Gemini is configured
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Gemini API not configured. Add GEMINI_API_KEY to .env.local. Get a free key at https://aistudio.google.com/apikey',
      },
      { status: 503 }
    );
  }

  // Check if already running
  if (isAutoGenRunning()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Auto-generation is already running. Check progress with GET /api/context-generation/auto',
      },
      { status: 409 }
    );
  }

  // Start in background (don't await)
  runAutoContextGeneration().catch((err) =>
    console.error('[AutoGen] Background error:', err)
  );

  return NextResponse.json({
    success: true,
    message:
      'Automatic context generation started. Poll GET /api/context-generation/auto for progress.',
  });
}

export async function GET() {
  const progress = getAutoGenProgress();

  if (!progress) {
    return NextResponse.json({
      success: true,
      progress: {
        status: 'idle',
        totalModules: 0,
        processedModules: 0,
        currentModule: '',
        currentModuleTickets: 0,
        modules: [],
        startedAt: '',
        errors: [],
      },
    });
  }

  return NextResponse.json({
    success: true,
    progress,
    isRunning: isAutoGenRunning(),
  });
}
