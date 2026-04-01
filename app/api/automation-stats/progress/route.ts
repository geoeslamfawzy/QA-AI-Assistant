import { NextResponse } from 'next/server';
import { getCollectionProgress } from '@/lib/automation-stats/progress';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getCollectionProgress());
}
