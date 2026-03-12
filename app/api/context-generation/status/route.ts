/**
 * GET /api/context-generation/status
 *
 * Returns the current generation status from generation-status.json.
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

interface GenerationStatus {
  lastUpdated: string;
  modules: {
    [slug: string]: {
      status: 'pending' | 'completed';
      completedAt?: string;
    };
  };
}

export async function GET() {
  try {
    const statusPath = join(KB_DIR, 'generation-status.json');

    if (!existsSync(statusPath)) {
      return NextResponse.json({
        success: true,
        status: {
          lastUpdated: null,
          modules: {},
        },
      });
    }

    const content = await readFile(statusPath, 'utf-8');
    const status: GenerationStatus = JSON.parse(content);

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('[Status API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
