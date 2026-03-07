/**
 * Claude Context Generation Orchestrator.
 *
 * Coordinates context generation across all modules with progress tracking.
 * Handles rate limiting, error recovery, and file writing.
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generateModuleContext, isClaudeAvailable } from './claude-context-generator';
import {
  loadTicketsIndex,
  updateGenerationProgress,
  getGenerationProgress,
  resetGenerationProgress,
} from './sync-state';
import { parseAndGroupTickets } from './ticket-parser';
import { resolveConflictsWithMerge } from './conflict-resolver';
import type {
  ModuleContext,
  ContextGenerationProgress,
  ContextGenerationResult,
  ParsedTicket,
  ModuleGenStatus,
} from './types';
import type { JiraTicket } from '@/lib/jira';

// ────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────

const KB_BASE_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';
const MODULES_DIR = join(KB_BASE_DIR, 'modules');

// Rate limit delay between Claude API calls (2 seconds)
const API_RATE_LIMIT_MS = 2000;

// ────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────

/**
 * Sleep for specified milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build ModuleContext objects from the tickets index.
 * Groups tickets by module and resolves conflicts.
 */
async function buildModuleContextsFromIndex(): Promise<ModuleContext[]> {
  const index = await loadTicketsIndex();

  if (!index || index.tickets.length === 0) {
    return [];
  }

  // Convert indexed tickets to JiraTicket format for parsing
  const jiraTickets: JiraTicket[] = index.tickets.map((t) => ({
    ticketId: t.ticketId,
    title: t.title,
    status: t.status,
    type: t.type,
    sprint: t.sprint || '',
    assignee: '',
    reporter: '',
    userStory: t.userStory,
    acceptanceCriteria: t.acceptanceCriteria,
    labels: t.labels,
    components: t.components,
    module: t.module,
    priority: t.priority,
    created: t.created,
    updated: t.updated,
    figmaLinks: t.figmaLinks,
    attachments: [],
    _isMock: false,
  }));

  // Group tickets by module
  const grouped = parseAndGroupTickets(jiraTickets);

  // Build ModuleContext for each module
  const contexts: ModuleContext[] = [];

  for (const [slug, data] of grouped) {
    const { activeTickets, overriddenTickets } = resolveConflictsWithMerge(
      data.tickets
    );

    const lastUpdated = data.tickets.reduce((latest, t) => {
      const tDate = t.updated instanceof Date ? t.updated : new Date(t.updated);
      return tDate > latest ? tDate : latest;
    }, new Date(0));

    contexts.push({
      moduleId: `jira-${slug}`,
      moduleName: data.name,
      moduleSlug: slug,
      tickets: data.tickets,
      activeTickets,
      overriddenTickets,
      lastUpdated,
    });
  }

  // Sort by module name for consistent ordering
  contexts.sort((a, b) => a.moduleName.localeCompare(b.moduleName));

  return contexts;
}

// ────────────────────────────────────
// MAIN ORCHESTRATION
// ────────────────────────────────────

export interface GenerateOptions {
  /** Generate only for specific module slug */
  moduleSlug?: string;
  /** Preview without writing files */
  dryRun?: boolean;
}

/**
 * Generate context for all modules (or a specific module).
 */
export async function generateAllContexts(
  options?: GenerateOptions
): Promise<ContextGenerationResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const filesWritten: string[] = [];

  console.log('[Context Gen] Starting context generation...');

  try {
    // Build module contexts from tickets index
    const allModules = await buildModuleContextsFromIndex();

    if (allModules.length === 0) {
      return {
        success: false,
        modulesProcessed: 0,
        filesWritten: [],
        duration: Date.now() - startTime,
        usedAI: false,
        errors: ['No modules found. Run a Jira sync first.'],
      };
    }

    // Filter modules if specific slug provided
    const targetModules = options?.moduleSlug
      ? allModules.filter((m) => m.moduleSlug === options.moduleSlug)
      : allModules;

    if (targetModules.length === 0) {
      return {
        success: false,
        modulesProcessed: 0,
        filesWritten: [],
        duration: Date.now() - startTime,
        usedAI: false,
        errors: [`Module "${options?.moduleSlug}" not found.`],
      };
    }

    // Build per-module status array for detailed progress tracking
    const moduleStatuses: ModuleGenStatus[] = targetModules.map((m) => ({
      moduleName: m.moduleName,
      moduleSlug: m.moduleSlug,
      ticketCount: m.tickets.length,
      activeTicketCount: m.activeTickets.length,
      status: 'pending' as const,
    }));

    // Initialize progress with modules array
    await updateGenerationProgress({
      status: 'running',
      modulesProcessed: 0,
      totalModules: targetModules.length,
      percentComplete: 0,
      errors: [],
      startedAt: new Date().toISOString(),
      usedAI: isClaudeAvailable(),
      modules: moduleStatuses,
    });

    const usedAI = isClaudeAvailable();

    // Ensure output directory exists
    if (!options?.dryRun) {
      await mkdir(MODULES_DIR, { recursive: true });
    }

    // Process each module
    for (let i = 0; i < targetModules.length; i++) {
      const module = targetModules[i];

      // Update this module's status to 'generating'
      moduleStatuses[i].status = 'generating';

      await updateGenerationProgress({
        currentModule: module.moduleName,
        modulesProcessed: i,
        percentComplete: Math.round((i / targetModules.length) * 100),
        modules: moduleStatuses,
      });

      try {
        console.log(
          `[Context Gen] (${i + 1}/${targetModules.length}) ${module.moduleName} - ${module.activeTickets.length} active tickets`
        );

        const generated = await generateModuleContext(module);

        // Update module status to 'completed' with preview
        moduleStatuses[i].status = 'completed';
        moduleStatuses[i].completedAt = new Date().toISOString();
        moduleStatuses[i].generatedContentPreview = generated.markdown.substring(0, 200);

        if (!options?.dryRun) {
          const filepath = join(MODULES_DIR, `${module.moduleSlug}.md`);
          await writeFile(filepath, generated.markdown, 'utf-8');
          filesWritten.push(filepath);
          console.log(`[Context Gen] Wrote ${filepath}`);
        }

        // Update progress with completed module
        await updateGenerationProgress({
          modules: moduleStatuses,
        });

        // Rate limit between Claude API calls
        if (usedAI && i < targetModules.length - 1) {
          await sleep(API_RATE_LIMIT_MS);
        }
      } catch (error) {
        const errorMsg = `Failed to generate ${module.moduleName}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;

        // Update module status to 'failed'
        moduleStatuses[i].status = 'failed';
        moduleStatuses[i].error = error instanceof Error ? error.message : 'Unknown error';

        errors.push(errorMsg);
        console.error(`[Context Gen] ${errorMsg}`);

        // Update progress with failed module
        await updateGenerationProgress({
          modules: moduleStatuses,
        });
      }
    }

    // Build main index file
    if (!options?.dryRun && filesWritten.length > 0) {
      const indexPath = await writeMainIndex(targetModules);
      filesWritten.push(indexPath);
    }

    // Final progress update
    const finalStatus =
      errors.length === targetModules.length ? 'failed' : 'completed';

    await updateGenerationProgress({
      status: finalStatus,
      modulesProcessed: targetModules.length,
      percentComplete: 100,
      currentModule: undefined,
      errors,
      modules: moduleStatuses,
    });

    const duration = Date.now() - startTime;
    console.log(
      `[Context Gen] Completed in ${(duration / 1000).toFixed(1)}s - ${filesWritten.length} files written`
    );

    return {
      success: errors.length < targetModules.length,
      modulesProcessed: targetModules.length - errors.length,
      filesWritten,
      duration,
      usedAI,
      errors,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Context Gen] Fatal error:`, errorMsg);

    await updateGenerationProgress({
      status: 'failed',
      errors: [errorMsg],
    });

    return {
      success: false,
      modulesProcessed: 0,
      filesWritten: [],
      duration: Date.now() - startTime,
      usedAI: false,
      errors: [errorMsg],
    };
  }
}

/**
 * Write the main project-context.md index file.
 */
async function writeMainIndex(modules: ModuleContext[]): Promise<string> {
  const totalTickets = modules.reduce((sum, m) => sum + m.tickets.length, 0);
  const totalActive = modules.reduce((sum, m) => sum + m.activeTickets.length, 0);

  const lines: string[] = [];

  lines.push('---');
  lines.push('id: "project-context"');
  lines.push('title: "Yassir Mobility — Project Context"');
  lines.push('type: "index"');
  lines.push(`last_generated: "${new Date().toISOString()}"`);
  lines.push(`total_tickets: ${totalTickets}`);
  lines.push(`total_modules: ${modules.length}`);
  lines.push('---');
  lines.push('');
  lines.push('# Yassir Mobility — Project Context');
  lines.push('');
  lines.push('> Auto-generated from Jira tickets using AI analysis');
  lines.push(`> Last generated: ${new Date().toISOString()}`);
  lines.push(`> Total tickets analyzed: ${totalTickets}`);
  lines.push(`> Active features: ${totalActive}`);
  lines.push(`> Modules: ${modules.length}`);
  lines.push('');
  lines.push('## Modules');
  lines.push('');
  lines.push('| Module | Active | Total | Last Updated |');
  lines.push('|--------|--------|-------|--------------|');

  for (const mod of modules) {
    const lastUpdated =
      mod.lastUpdated instanceof Date
        ? mod.lastUpdated.toISOString().split('T')[0]
        : new Date(mod.lastUpdated).toISOString().split('T')[0];
    lines.push(
      `| [${mod.moduleName}](./${mod.moduleSlug}.md) | ${mod.activeTickets.length} | ${mod.tickets.length} | ${lastUpdated} |`
    );
  }

  lines.push('');

  const indexPath = join(MODULES_DIR, 'project-context.md');
  await writeFile(indexPath, lines.join('\n'), 'utf-8');
  console.log(`[Context Gen] Wrote index: ${indexPath}`);

  return indexPath;
}

// ────────────────────────────────────
// PROGRESS ACCESSORS
// ────────────────────────────────────

/**
 * Get the current context generation progress.
 */
export async function getProgress(): Promise<ContextGenerationProgress> {
  return getGenerationProgress();
}

/**
 * Reset progress to idle state.
 */
export async function resetProgress(): Promise<void> {
  return resetGenerationProgress();
}

/**
 * Check if Claude API is available.
 */
export function checkClaudeAvailability(): boolean {
  return isClaudeAvailable();
}
