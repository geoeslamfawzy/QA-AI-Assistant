/**
 * GET /api/chatbot/modules — List available knowledge base modules
 */

import { NextResponse } from 'next/server';
import { getAvailableModules } from '@/lib/chatbot/knowledge-retriever';

export const dynamic = 'force-dynamic';

export async function GET() {
  const modules = getAvailableModules();
  return NextResponse.json({ modules, total: modules.length });
}
