import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile, writeFile, mkdir, stat, rename } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const KNOWLEDGE_BASE_PATH = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

interface ModuleData {
  slug: string;
  title: string;
  source: 'jira' | 'manual';
  content: string;
  rawContent: string;
  frontmatter: Record<string, unknown>;
  ticketCount?: number;
  activeTicketCount?: number;
  lastUpdated: string;
  lastSynced?: string;
  filePath: string;
}

async function findModule(slug: string): Promise<ModuleData | null> {
  // Search in jira-context first
  const jiraPath = join(KNOWLEDGE_BASE_PATH, 'jira-context', `${slug}.md`);
  try {
    const rawContent = await readFile(jiraPath, 'utf-8');
    const { data, content } = matter(rawContent);
    const fileStat = await stat(jiraPath);

    return {
      slug,
      title: data.title || slug,
      source: 'jira',
      content,
      rawContent,
      frontmatter: data,
      ticketCount: data.ticket_count,
      activeTicketCount: data.active_ticket_count,
      lastSynced: data.last_synced,
      lastUpdated: data.last_synced || fileStat.mtime.toISOString(),
      filePath: jiraPath,
    };
  } catch {
    // Not in jira-context, try modules
  }

  // Search in modules
  const modulePath = join(KNOWLEDGE_BASE_PATH, 'modules', `${slug}.md`);
  try {
    const rawContent = await readFile(modulePath, 'utf-8');
    const { data, content } = matter(rawContent);
    const fileStat = await stat(modulePath);

    return {
      slug,
      title: data.title || slug,
      source: 'manual',
      content,
      rawContent,
      frontmatter: data,
      lastUpdated: data.last_updated || fileStat.mtime.toISOString(),
      filePath: modulePath,
    };
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const module = await findModule(slug);

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      module,
    });
  } catch (err) {
    console.error('Error fetching module:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { content } = body;

    if (typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const module = await findModule(slug);

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    // Create backup before updating
    const backupDir = join(KNOWLEDGE_BASE_PATH, '.backups');
    await mkdir(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(backupDir, `${slug}-${timestamp}.md`);

    try {
      await writeFile(backupPath, module.rawContent, 'utf-8');
    } catch (err) {
      console.warn('Failed to create backup:', err);
    }

    // Write the new content
    await writeFile(module.filePath, content, 'utf-8');

    // Re-read the module to return updated data
    const updatedModule = await findModule(slug);

    return NextResponse.json({
      success: true,
      module: updatedModule,
      backupPath,
    });
  } catch (err) {
    console.error('Error updating module:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const module = await findModule(slug);

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of manual modules
    if (module.source === 'jira') {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete Jira-synced modules. They are managed by the sync process.',
        },
        { status: 403 }
      );
    }

    // Move to backups instead of permanent delete
    const backupDir = join(KNOWLEDGE_BASE_PATH, '.backups');
    await mkdir(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(backupDir, `${slug}-deleted-${timestamp}.md`);

    await rename(module.filePath, backupPath);

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
      backupPath,
    });
  } catch (err) {
    console.error('Error deleting module:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}
