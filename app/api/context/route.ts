import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const KNOWLEDGE_BASE_PATH = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

interface ContextModule {
  slug: string;
  title: string;
  source: 'jira' | 'manual';
  ticketCount?: number;
  activeTicketCount?: number;
  lastUpdated: string;
  lastSynced?: string;
  filePath: string;
}

interface SyncState {
  lastSyncAt: string;
  totalTicketsSynced: number;
  moduleCount: number;
}

interface ContextStats {
  totalModules: number;
  jiraModules: number;
  manualModules: number;
  totalTickets: number;
  lastSync: string | null;
}

async function getSyncState(): Promise<SyncState | null> {
  try {
    const syncStatePath = join(KNOWLEDGE_BASE_PATH, 'sync-state.json');
    const content = await readFile(syncStatePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function readModulesFromDirectory(
  directory: string,
  source: 'jira' | 'manual'
): Promise<ContextModule[]> {
  const modules: ContextModule[] = [];
  const dirPath = join(KNOWLEDGE_BASE_PATH, directory);

  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      if (!file.endsWith('.md') || file.startsWith('_')) continue;

      const filePath = join(dirPath, file);
      const slug = file.replace('.md', '');

      try {
        const rawContent = await readFile(filePath, 'utf-8');
        const { data } = matter(rawContent);
        const fileStat = await stat(filePath);

        const module: ContextModule = {
          slug,
          title: data.title || slug,
          source,
          filePath,
          lastUpdated: data.last_updated || data.last_synced || fileStat.mtime.toISOString(),
        };

        if (source === 'jira') {
          module.ticketCount = data.ticket_count;
          module.activeTicketCount = data.active_ticket_count;
          module.lastSynced = data.last_synced;
        }

        modules.push(module);
      } catch (err) {
        console.error(`Error reading module ${file}:`, err);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }

  return modules;
}

export async function GET() {
  try {
    // Read modules from both directories
    const jiraModules = await readModulesFromDirectory('jira-context', 'jira');
    const manualModules = await readModulesFromDirectory('modules', 'manual');

    // Deduplicate: jira-context takes precedence over modules
    // This prevents duplicate React keys when the same slug exists in both directories
    const jiraSlugs = new Set(jiraModules.map((m) => m.slug));
    const uniqueManualModules = manualModules.filter((m) => !jiraSlugs.has(m.slug));

    const allModules = [...jiraModules, ...uniqueManualModules].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    // Get sync state for stats
    const syncState = await getSyncState();

    const stats: ContextStats = {
      totalModules: allModules.length,
      jiraModules: jiraModules.length,
      manualModules: manualModules.length,
      totalTickets: syncState?.totalTicketsSynced || 0,
      lastSync: syncState?.lastSyncAt || null,
    };

    return NextResponse.json({
      success: true,
      modules: allModules,
      stats,
    });
  } catch (err) {
    console.error('Error fetching context modules:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch context modules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Module name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Invalid module name' },
        { status: 400 }
      );
    }

    const modulesDir = join(KNOWLEDGE_BASE_PATH, 'modules');
    const filePath = join(modulesDir, `${slug}.md`);

    // Check if file already exists
    try {
      await stat(filePath);
      return NextResponse.json(
        { success: false, error: 'A module with this name already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, which is what we want
    }

    // Ensure modules directory exists
    await mkdir(modulesDir, { recursive: true });

    // Create module content
    const now = new Date().toISOString();
    const dateStr = now.split('T')[0];

    const content = `---
id: "${slug}"
title: "${name.trim()}"
system: "Custom"
type: "module"
tags: ["manual"]
dependencies: []
keywords: []
related: []
version: "1.0"
last_updated: "${dateStr}"
risk_level: "low"
---

# ${name.trim()}

> Manually created on ${dateStr}

${description ? `## Description\n\n${description.trim()}\n\n` : ''}## Features

(Add features here)

## Business Rules

(Add business rules here)
`;

    await writeFile(filePath, content, 'utf-8');

    const newModule: ContextModule = {
      slug,
      title: name.trim(),
      source: 'manual',
      filePath,
      lastUpdated: now,
    };

    return NextResponse.json({
      success: true,
      module: newModule,
    });
  } catch (err) {
    console.error('Error creating module:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
