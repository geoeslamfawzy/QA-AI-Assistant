/**
 * Context Sync Status API Route
 *
 * GET /api/context-sync/status — Get detailed sync status
 */

import { NextResponse } from 'next/server';
import { getSyncStatus, getDefaultJQL } from '@/lib/context-sync';

export const dynamic = 'force-dynamic';

/**
 * GET /api/context-sync/status
 * Get detailed sync status including history.
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
      },
      history: status.syncHistory.slice(0, 10),
      config: {
        defaultJQL: getDefaultJQL(),
        cronSchedule: '0 3 1,15 * *', // 3 AM UTC on 1st and 15th
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
