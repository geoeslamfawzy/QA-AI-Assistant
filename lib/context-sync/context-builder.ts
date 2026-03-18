/**
 * Context Builder for Context Sync Service.
 *
 * Builds markdown context documents from parsed tickets.
 * Outputs to knowledge-base/jira-context/ directory.
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { ModuleContext, ParsedTicket, OverriddenTicket } from './types';

// ────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────

const KB_BASE_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';
const CONTEXT_DIR = join(KB_BASE_DIR, 'jira-context');

// ────────────────────────────────────
// MODULE MARKDOWN GENERATION
// ────────────────────────────────────

/**
 * Build markdown content for a module's context document.
 */
export function buildModuleMarkdown(context: ModuleContext): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push('---');
  lines.push(`id: "jira-${context.moduleSlug}"`);
  lines.push(`title: "${context.moduleName}"`);
  lines.push(`system: "${extractSystem(context.moduleName)}"`);
  lines.push(`type: "jira_context"`);
  lines.push(`source: "auto-generated"`);
  lines.push(`tags: ${JSON.stringify(extractTags(context))}`);
  lines.push(`last_synced: "${context.lastUpdated.toISOString()}"`);
  lines.push(`ticket_count: ${context.tickets.length}`);
  lines.push(`active_ticket_count: ${context.activeTickets.length}`);
  lines.push('---');
  lines.push('');

  // Header
  lines.push(`# ${context.moduleName}`);
  lines.push('');
  lines.push(`> Auto-generated from ${context.tickets.length} Jira tickets.`);
  lines.push(`> Last synced: ${context.lastUpdated.toISOString()}`);
  lines.push(`> Active features: ${context.activeTickets.length}`);
  if (context.overriddenTickets.length > 0) {
    lines.push(`> Superseded: ${context.overriddenTickets.length}`);
  }
  lines.push('');

  // Reading guide for non-AI generated context
  lines.push('> **Reading Guide:** Tickets are shown oldest to newest.');
  lines.push('> If two tickets describe the same feature differently,');
  lines.push('> the LATER ticket (further down) is the current truth.');
  lines.push('');

  // Group active tickets by type
  const stories = context.activeTickets.filter((t) => t.type === 'Story');
  const tasks = context.activeTickets.filter((t) => t.type === 'Task');

  // User Stories section
  if (stories.length > 0) {
    lines.push('## User Stories');
    lines.push('');
    for (const story of stories) {
      lines.push(formatTicketSection(story));
    }
  }

  // Tasks section
  if (tasks.length > 0) {
    lines.push('## Tasks');
    lines.push('');
    for (const task of tasks) {
      lines.push(formatTicketSection(task));
    }
  }

  // Consolidated Acceptance Criteria
  const allAC = new Set<string>();
  for (const ticket of context.activeTickets) {
    ticket.acceptanceCriteria.forEach((ac) => allAC.add(ac));
  }

  if (allAC.size > 0) {
    lines.push('## Consolidated Acceptance Criteria');
    lines.push('');
    for (const ac of allAC) {
      lines.push(`- ${ac}`);
    }
    lines.push('');
  }

  // Superseded Features section (collapsed/noted)
  if (context.overriddenTickets.length > 0) {
    lines.push('## Superseded Features');
    lines.push('');
    lines.push('> These features were overridden by newer tickets.');
    lines.push('');
    for (const { ticket, overriddenBy } of context.overriddenTickets) {
      lines.push(`- ~~${ticket.ticketId}: ${ticket.title}~~ → Replaced by ${overriddenBy}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format a single ticket as a markdown section.
 */
function formatTicketSection(ticket: ParsedTicket): string {
  const lines: string[] = [];

  lines.push(`### ${ticket.ticketId}: ${ticket.title}`);
  lines.push('');
  lines.push(`**Status:** ${ticket.status} | **Priority:** ${ticket.priority}`);
  lines.push(`**Created:** ${ticket.created.toISOString().split('T')[0]}`);
  lines.push('');

  if (ticket.userStory && ticket.userStory.length > 10) {
    lines.push('**Description:**');
    // Limit description to prevent overly long files
    const desc = ticket.userStory.substring(0, 1000);
    lines.push(desc);
    if (ticket.userStory.length > 1000) {
      lines.push('...');
    }
    lines.push('');
  }

  if (ticket.acceptanceCriteria.length > 0) {
    lines.push('**Acceptance Criteria:**');
    for (const ac of ticket.acceptanceCriteria) {
      lines.push(`- ${ac}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

// ────────────────────────────────────
// INDEX GENERATION
// ────────────────────────────────────

/**
 * Build the main index markdown file.
 */
export function buildIndexMarkdown(
  modules: ModuleContext[],
  syncTimestamp: Date
): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push('---');
  lines.push('id: "jira-context-index"');
  lines.push('title: "Jira Context Index"');
  lines.push('type: "index"');
  lines.push(`last_synced: "${syncTimestamp.toISOString()}"`);
  lines.push('---');
  lines.push('');

  // Header
  lines.push('# Yassir Mobility — Jira Context');
  lines.push('');
  lines.push('> Auto-generated from Jira tickets. Do not edit manually.');
  lines.push(`> Last sync: ${syncTimestamp.toISOString()}`);

  // Count totals
  const totalTickets = modules.reduce((sum, m) => sum + m.tickets.length, 0);
  const totalActive = modules.reduce((sum, m) => sum + m.activeTickets.length, 0);

  lines.push(`> Total tickets processed: ${totalTickets}`);
  lines.push(`> Active features: ${totalActive}`);
  lines.push(`> Modules: ${modules.length}`);
  lines.push('');

  // Modules Overview
  lines.push('## Modules Overview');
  lines.push('');
  lines.push('| Module | Active | Total | Last Updated |');
  lines.push('|--------|--------|-------|--------------|');

  // Sort modules by ticket count (most active first)
  const sorted = [...modules].sort((a, b) => b.tickets.length - a.tickets.length);

  for (const mod of sorted) {
    const lastUpdated = mod.lastUpdated.toISOString().split('T')[0];
    lines.push(
      `| [${mod.moduleName}](./${mod.moduleSlug}.md) | ${mod.activeTickets.length} | ${mod.tickets.length} | ${lastUpdated} |`
    );
  }

  lines.push('');

  return lines.join('\n');
}

// ────────────────────────────────────
// FILE WRITING
// ────────────────────────────────────

/**
 * Write all module context files to disk.
 * Returns array of written file paths.
 */
export async function writeContextFiles(
  modules: ModuleContext[]
): Promise<string[]> {
  // Ensure directory exists
  await mkdir(CONTEXT_DIR, { recursive: true });

  const writtenFiles: string[] = [];
  const syncTimestamp = new Date();

  // Write each module file
  for (const module of modules) {
    const filename = `${module.moduleSlug}.md`;
    const filepath = join(CONTEXT_DIR, filename);
    const content = buildModuleMarkdown(module);

    await writeFile(filepath, content, 'utf-8');
    writtenFiles.push(filepath);
  }

  // Write index file
  const indexContent = buildIndexMarkdown(modules, syncTimestamp);
  const indexPath = join(CONTEXT_DIR, '_index.md');
  await writeFile(indexPath, indexContent, 'utf-8');
  writtenFiles.push(indexPath);

  console.log(`[Context Builder] Wrote ${writtenFiles.length} files to ${CONTEXT_DIR}`);

  return writtenFiles;
}

/**
 * Get the path to the jira-context directory.
 */
export function getContextDir(): string {
  return CONTEXT_DIR;
}

// ────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────

/**
 * Extract system name from module name.
 */
function extractSystem(moduleName: string): string {
  if (moduleName.includes('B2B Portal')) return 'B2B Corporate Portal';
  if (moduleName.includes('Admin Panel')) return 'Admin Panel';
  if (moduleName.includes('B2C WebApp')) return 'B2C WebApp';
  if (moduleName.includes('DashOps')) return 'DashOps';
  if (moduleName.includes('Pricing')) return 'Pricing Engine';
  if (moduleName.includes('Super App')) return 'Super App';
  if (moduleName.includes('Driver')) return 'Driver App';
  return 'Unknown';
}

/**
 * Extract tags from a module context.
 */
function extractTags(context: ModuleContext): string[] {
  const tags = new Set<string>(['jira-context', 'auto-generated']);

  // Add system tag
  const system = extractSystem(context.moduleName);
  tags.add(system.toLowerCase().replace(/\s+/g, '-'));

  // Add labels from tickets (limited to 5)
  let labelCount = 0;
  for (const ticket of context.activeTickets) {
    for (const label of ticket.labels) {
      if (labelCount < 5) {
        tags.add(label.toLowerCase());
        labelCount++;
      }
    }
  }

  return [...tags].slice(0, 10);
}
