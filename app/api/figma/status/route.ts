import { NextResponse } from 'next/server';
import { testFigmaConnection } from '@/lib/figma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await testFigmaConnection();
  return NextResponse.json(status);
}
