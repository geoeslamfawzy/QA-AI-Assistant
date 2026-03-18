/**
 * POST /api/module-explorer/save
 *
 * Saves a manually-generated document (from Claude copy-paste).
 *
 * Body: { slug: "invoice-module", name: "Invoice Module", content: "# Invoice..." }
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

export async function POST(request: NextRequest) {
  try {
    const { slug, name, content } = await request.json();

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Document name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const moduleSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const modulesDir = path.join(KB_DIR, 'modules');
    fs.mkdirSync(modulesDir, { recursive: true });

    const filePath = path.join(modulesDir, `${moduleSlug}.md`);

    // Backup existing file if it exists
    if (fs.existsSync(filePath)) {
      const backupDir = path.join(modulesDir, '.backups');
      fs.mkdirSync(backupDir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync(filePath, path.join(backupDir, `${moduleSlug}-${ts}.md`));
      console.log(`[Module Explorer] Backed up existing file: ${moduleSlug}-${ts}.md`);
    }

    fs.writeFileSync(filePath, content.trim());
    console.log(`[Module Explorer] Saved document to: ${filePath}`);

    return NextResponse.json({
      success: true,
      slug: moduleSlug,
      savedTo: `modules/${moduleSlug}.md`,
      contentLength: content.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Module Explorer Save Error]', err);

    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save document' },
      { status: 500 }
    );
  }
}
