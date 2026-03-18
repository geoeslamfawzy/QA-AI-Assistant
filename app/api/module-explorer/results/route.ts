/**
 * GET /api/module-explorer/results
 *
 * Returns the tickets fetched so far during an active fetch operation.
 * Tickets are sorted oldest first (for context building).
 */

import { NextResponse } from 'next/server';
import { getFetchedTickets } from '@/lib/module-explorer/progress';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tickets = getFetchedTickets();

  // Sort oldest first (for context building - newer tickets override older ones)
  const sorted = [...tickets].sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );

  return NextResponse.json({
    success: true,
    tickets: sorted,
    total: sorted.length,
  });
}
