/**
 * Context Sync Cron API Route
 *
 * POST /api/cron/context-sync — Triggered by Vercel Cron
 * GET /api/cron/context-sync — Also supports GET for flexibility
 *
 * Schedule: 0 3 1,15 * * (3 AM UTC on 1st and 15th of each month)
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/context-sync",
 *     "schedule": "0 3 1,15 * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { runContextSync, isSyncRunning } from '@/lib/context-sync';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for Vercel

/**
 * Verify the request is from Vercel Cron or has valid auth.
 */
function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron requests include this header
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';

  // Also allow requests with a valid CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const hasValidSecret = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

  return isVercelCron || hasValidSecret;
}

/**
 * Run the sync operation.
 */
async function handleSync(request: NextRequest) {
  // Verify authorization
  if (!isAuthorized(request)) {
    console.warn('[Cron] Unauthorized request to context-sync cron');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if sync is already running
  if (await isSyncRunning()) {
    console.log('[Cron] Sync already in progress, skipping...');
    return NextResponse.json(
      {
        success: false,
        error: 'Sync already in progress',
        skipped: true,
      },
      { status: 200 } // Still return 200 to prevent Vercel from retrying
    );
  }

  console.log('[Cron] Starting scheduled context sync...');

  try {
    // Cron uses UPDATE_SYNC_JQL - only fetches recently completed tickets
    const result = await runContextSync({
      trigger: 'cron',
    });

    if (result.success) {
      console.log(
        `[Cron] Sync completed: ${result.ticketsFetched} tickets, ${result.modulesGenerated} modules`
      );
    } else {
      console.error('[Cron] Sync failed:', result.errors.join(', '));
    }

    return NextResponse.json({
      success: result.success,
      ticketsFetched: result.ticketsFetched,
      modulesGenerated: result.modulesGenerated,
      duration: result.duration,
      errors: result.errors,
    });
  } catch (error) {
    console.error('[Cron] Context sync error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/context-sync
 * Triggered by Vercel Cron.
 */
export async function POST(request: NextRequest) {
  return handleSync(request);
}

/**
 * GET /api/cron/context-sync
 * Also supports GET for flexibility and testing.
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}
