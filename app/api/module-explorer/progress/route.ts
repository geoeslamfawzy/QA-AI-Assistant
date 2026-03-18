/**
 * GET /api/module-explorer/progress
 *
 * Returns the progress of ticket fetching (for live updates).
 */

import { NextResponse } from 'next/server';
import { getModuleExplorerProgress } from '@/lib/module-explorer/progress';

export const dynamic = 'force-dynamic';

export async function GET() {
  const progress = getModuleExplorerProgress();

  if (!progress) {
    return NextResponse.json({ status: 'idle' });
  }

  return NextResponse.json(progress);
}
