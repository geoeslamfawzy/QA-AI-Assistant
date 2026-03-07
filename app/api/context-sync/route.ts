/**
 * Context Sync API Route
 *
 * POST /api/context-sync — Trigger a manual context sync
 * GET /api/context-sync — Get sync status (redirects to /status)
 */

import { NextRequest, NextResponse } from 'next/server';
import { runContextSync, getSyncStatus, isSyncRunning, getInitialSyncJQL, getUpdateSyncJQL } from '@/lib/context-sync';

export const dynamic = 'force-dynamic';

/**
 * POST /api/context-sync
 * Trigger a manual context sync.
 *
 * Body:
 * - dryRun?: boolean — Preview only, don't write files
 * - jql?: string — Custom JQL query (optional)
 * - resume?: boolean — Resume from checkpoint if available
 * - waitForCompletion?: boolean — If false, start sync in background and return immediately (default: true)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if sync is already running
    if (await isSyncRunning()) {
      return NextResponse.json(
        {
          success: false,
          error: 'A sync is already in progress. Please wait for it to complete.',
        },
        { status: 409 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const dryRun = body.dryRun === true;
    const jql = body.jql || undefined;
    const resume = body.resume === true;
    const waitForCompletion = body.waitForCompletion !== false; // Default: true for backward compatibility

    // Mode parameter: 'initial' = full clean sync, 'update' = incremental merge
    const mode = body.mode || 'update';
    const trigger = mode === 'initial' ? 'manual-initial' : 'manual-update';

    console.log(`[API] Context sync triggered (mode: ${mode}, dryRun: ${dryRun}, waitForCompletion: ${waitForCompletion})`);

    if (waitForCompletion || dryRun) {
      // Run synchronously and wait for result
      const result = await runContextSync({
        dryRun,
        jql,
        resume,
        trigger,
      });

      return NextResponse.json({
        success: result.success,
        data: {
          ticketsFetched: result.ticketsFetched,
          modulesGenerated: result.modulesGenerated,
          filesWritten: result.filesWritten.length,
          conflictsResolved: result.conflicts.length,
          duration: result.duration,
          errors: result.errors,
        },
      });
    } else {
      // Start sync in background (don't await) for UI usage
      runContextSync({
        dryRun,
        jql,
        resume,
        trigger,
      }).catch((error) => {
        console.error('[API] Background sync error:', error);
      });

      return NextResponse.json({
        success: true,
        message: 'Sync started in background. Poll /api/context-sync/progress for updates.',
        data: {
          status: 'running',
        },
      });
    }
  } catch (error) {
    console.error('[API] Context sync error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/context-sync
 * Get current sync status and configuration.
 */
export async function GET() {
  try {
    const status = await getSyncStatus();

    return NextResponse.json({
      success: true,
      status: {
        lastSyncAt: status.lastSyncAt,
        lastSyncStatus: status.lastSyncStatus,
        totalTicketsSynced: status.totalTicketsSynced,
        moduleCount: status.moduleCount,
        nextScheduledRun: status.nextScheduledRun,
        errors: status.errors,
        recentHistory: status.syncHistory.slice(0, 5),
      },
      config: {
        initialSyncJQL: getInitialSyncJQL(),
        updateSyncJQL: getUpdateSyncJQL(),
        cronSchedule: '0 3 1,15 * *',
      },
    });
  } catch (error) {
    console.error('[API] Get sync status error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
