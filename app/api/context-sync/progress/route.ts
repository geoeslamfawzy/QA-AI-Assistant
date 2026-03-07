/**
 * Context Sync Progress API Route
 *
 * GET /api/context-sync/progress — Get real-time sync progress for frontend polling
 */

import { NextResponse } from 'next/server';
import { getSyncProgress, canResume } from '@/lib/context-sync';

export const dynamic = 'force-dynamic';

/**
 * GET /api/context-sync/progress
 * Get real-time sync progress for frontend polling.
 */
export async function GET() {
  try {
    const progress = await getSyncProgress();
    const hasCheckpoint = await canResume();

    return NextResponse.json({
      success: true,
      progress,
      canResume: hasCheckpoint,
    });
  } catch (error) {
    console.error('[API] Get sync progress error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
