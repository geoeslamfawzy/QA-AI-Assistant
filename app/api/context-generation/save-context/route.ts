/**
 * POST /api/context-generation/save-context
 *
 * Saves Claude's response as a module context file.
 * Body: { slug: "b2b-portal-login", content: "# B2B Portal — Login\n..." }
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { join, dirname } from 'path';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, content } = body;

    // Validate input
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Module slug is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Sanitize slug to prevent path traversal
    const safeSlug = slug.replace(/[^a-z0-9-]/g, '');
    if (safeSlug !== slug) {
      return NextResponse.json(
        { success: false, error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    const modulesDir = join(KB_DIR, 'modules');
    const filePath = join(modulesDir, `${safeSlug}.md`);
    let backupPath: string | undefined;

    // 1. Create backup if file exists
    if (existsSync(filePath)) {
      const backupDir = join(modulesDir, '.backups');
      await mkdir(backupDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      backupPath = join(backupDir, `${safeSlug}-${timestamp}.md`);

      await copyFile(filePath, backupPath);
    }

    // 2. Ensure modules directory exists
    await mkdir(dirname(filePath), { recursive: true });

    // 3. Write new content
    await writeFile(filePath, content, 'utf-8');

    // 4. Update generation-status.json
    const statusPath = join(KB_DIR, 'generation-status.json');
    let status: GenerationStatus = { lastUpdated: '', modules: {} };

    if (existsSync(statusPath)) {
      const statusContent = await readFile(statusPath, 'utf-8');
      status = JSON.parse(statusContent);
    }

    status.lastUpdated = new Date().toISOString();
    status.modules[safeSlug] = {
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    await writeFile(statusPath, JSON.stringify(status, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      slug: safeSlug,
      filePath: `modules/${safeSlug}.md`,
      contentLength: content.length,
      backupPath: backupPath ? backupPath.replace(KB_DIR, '') : undefined,
    });
  } catch (error) {
    console.error('[Save Context API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
