/**
 * Claude Context Generation API Route.
 *
 * POST /api/context-sync/generate — Trigger Claude-powered context generation
 * GET /api/context-sync/generate — Get generation progress
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateAllContexts,
  getProgress,
  checkClaudeAvailability,
} from '@/lib/context-sync/claude-context-orchestrator';
import type {
  ContextGenerationProgress,
  ContextGenerationResult,
} from '@/lib/context-sync/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for Vercel

// ────────────────────────────────────
// POST — Trigger Context Generation
// ────────────────────────────────────

interface GenerateRequest {
  moduleSlug?: string;
  dryRun?: boolean;
  waitForCompletion?: boolean;
}

interface GenerateResponse {
  success: boolean;
  message?: string;
  result?: ContextGenerationResult;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateResponse>> {
  try {
    const body = (await request.json().catch(() => ({}))) as GenerateRequest;
    const { moduleSlug, dryRun, waitForCompletion } = body;

    console.log('[Generate API] POST request:', { moduleSlug, dryRun, waitForCompletion });

    // Check current progress - don't start if already running
    const currentProgress = await getProgress();
    if (currentProgress.status === 'running') {
      return NextResponse.json(
        {
          success: false,
          error: 'Context generation is already running. Wait for it to complete.',
        },
        { status: 409 }
      );
    }

    // Log Claude availability
    const claudeAvailable = checkClaudeAvailability();
    console.log(
      `[Generate API] Claude API: ${claudeAvailable ? 'available' : 'not configured (will use fallback)'}`
    );

    if (waitForCompletion) {
      // Synchronous: wait for completion and return result
      const result = await generateAllContexts({ moduleSlug, dryRun });

      return NextResponse.json({
        success: result.success,
        result,
        message: result.success
          ? `Generated context for ${result.modulesProcessed} modules`
          : 'Context generation failed',
      });
    } else {
      // Asynchronous: start in background and return immediately
      generateAllContexts({ moduleSlug, dryRun }).catch((err) =>
        console.error('[Generate API] Background error:', err)
      );

      return NextResponse.json({
        success: true,
        message: 'Context generation started. Poll GET /api/context-sync/generate for progress.',
      });
    }
  } catch (error) {
    console.error('[Generate API] POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────
// GET — Get Generation Progress
// ────────────────────────────────────

interface ProgressResponse {
  success: boolean;
  progress: ContextGenerationProgress;
  claudeAvailable: boolean;
}

export async function GET(): Promise<NextResponse<ProgressResponse>> {
  try {
    const progress = await getProgress();
    const claudeAvailable = checkClaudeAvailability();

    return NextResponse.json({
      success: true,
      progress,
      claudeAvailable,
    });
  } catch (error) {
    console.error('[Generate API] GET error:', error);
    return NextResponse.json(
      {
        success: false,
        progress: {
          status: 'idle',
          modulesProcessed: 0,
          totalModules: 0,
          percentComplete: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        },
        claudeAvailable: false,
      },
      { status: 500 }
    );
  }
}
