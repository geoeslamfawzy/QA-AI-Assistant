/**
 * Context Sync Service — Main Orchestration (Chunked Processing).
 *
 * Orchestrates the full sync process with chunked processing:
 * 1. Fetch ALL tickets from Jira using JQL (oldest → newest)
 * 2. Split tickets into batches of 50
 * 3. Process each batch: parse, group, resolve conflicts
 * 4. Save checkpoint after each batch for resume capability
 * 5. Write context files to knowledge-base/jira-context/
 * 6. Update sync state and progress for frontend polling
 */

import { searchJiraIssues, fetchJiraTicket, isJiraConfigured, type JiraTicket } from '@/lib/jira';
import { parseAndGroupTickets, parseTicket } from './ticket-parser';
import { resolveConflictsWithMerge, getConflictSummary } from './conflict-resolver';
import { writeContextFiles } from './context-builder';
import {
  markSyncStarted,
  markSyncCompleted,
  readSyncState,
  calculateNextScheduledRun,
  saveCheckpoint,
  loadCheckpoint,
  deleteCheckpoint,
  hasCheckpoint,
  updateProgress,
  getProgress,
  resetProgress,
  saveTicketsIndex,
  saveTicketsIndexIncremental,
} from './sync-state';
import type {
  SyncOptions,
  SyncResult,
  ModuleContext,
  SyncState,
  ConflictInfo,
  SyncCheckpoint,
  SyncProgress,
  ParsedTicket,
  SerializedModuleContext,
} from './types';

// ────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────

/** Default batch size for chunked processing */
const BATCH_SIZE = 50;

/** Knowledge base directory */
const KB_DIR = process.cwd() + '/knowledge-base';

/**
 * Query 1: Initial full sync — builds the entire knowledge base from scratch.
 * Excludes Cancelled tickets. Fetches ALL stories and improvements.
 * ORDER BY created ASC for oldest → newest processing.
 */
const INITIAL_SYNC_JQL = `project = CMB AND type IN (Story, Improvement) AND "squad[dropdown]" = "B2B & B2C WebApp" AND status != Cancelled ORDER BY created ASC`;

/**
 * Query 2: Bi-weekly update — only recently completed tickets.
 * Fetches tickets updated in the last 2 weeks with status = Done.
 * ORDER BY updated ASC for oldest → newest processing.
 */
const UPDATE_SYNC_JQL = `project = CMB AND issuetype IN (Improvement, Story) AND "squad[dropdown]" = "B2B & B2C WebApp" AND updated >= -2w AND status = Done ORDER BY updated ASC`;

/** @deprecated Use INITIAL_SYNC_JQL or UPDATE_SYNC_JQL based on trigger */
const DEFAULT_JQL = UPDATE_SYNC_JQL;

// ────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────

/**
 * Split an array into chunks of specified size.
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Sleep for specified milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert ModuleContext to serializable format (Dates → ISO strings).
 */
function serializeModuleContext(ctx: ModuleContext): SerializedModuleContext {
  return {
    moduleId: ctx.moduleId,
    moduleName: ctx.moduleName,
    moduleSlug: ctx.moduleSlug,
    tickets: ctx.tickets,
    activeTickets: ctx.activeTickets,
    overriddenTickets: ctx.overriddenTickets,
    lastUpdated: ctx.lastUpdated instanceof Date ? ctx.lastUpdated.toISOString() : ctx.lastUpdated,
  };
}

/**
 * Convert serialized ModuleContext back to normal format.
 */
function deserializeModuleContext(ctx: SerializedModuleContext): ModuleContext {
  return {
    ...ctx,
    lastUpdated: new Date(ctx.lastUpdated),
  };
}

/**
 * Delete existing module files for a clean slate initial sync.
 * Deletes all .md files from modules/ and jira-context/ directories,
 * as well as tickets-index.json and sync-checkpoint.json.
 */
function deleteExistingModules(): void {
  const fs = require('fs');
  const path = require('path');

  const dirsToClean = [
    path.join(KB_DIR, 'modules'),
    path.join(KB_DIR, 'jira-context'),
  ];

  for (const dir of dirsToClean) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        // Delete .md files except hidden files and index files
        if (file.endsWith('.md') && !file.startsWith('.') && !file.startsWith('_')) {
          fs.unlinkSync(path.join(dir, file));
          console.log(`[Context Sync] Deleted: ${path.basename(dir)}/${file}`);
        }
      }
    }
  }

  // Delete tickets-index.json to start fresh
  const indexPath = path.join(KB_DIR, 'tickets-index.json');
  if (fs.existsSync(indexPath)) {
    fs.unlinkSync(indexPath);
    console.log('[Context Sync] Deleted: tickets-index.json');
  }

  // Delete checkpoint if exists
  const checkpointPath = path.join(KB_DIR, 'sync-checkpoint.json');
  if (fs.existsSync(checkpointPath)) {
    fs.unlinkSync(checkpointPath);
    console.log('[Context Sync] Deleted: sync-checkpoint.json');
  }
}

/**
 * Build a ModuleContext from grouped ticket data.
 */
function buildModuleContext(
  slug: string,
  data: { name: string; tickets: ParsedTicket[] }
): ModuleContext {
  const { activeTickets, overriddenTickets } = resolveConflictsWithMerge(data.tickets);

  const lastUpdated = data.tickets.reduce((latest, t) => {
    return t.updated > latest ? t.updated : latest;
  }, data.tickets[0].updated);

  return {
    moduleId: `jira-${slug}`,
    moduleName: data.name,
    moduleSlug: slug,
    tickets: data.tickets,
    activeTickets,
    overriddenTickets,
    lastUpdated,
  };
}

// ────────────────────────────────────
// MAIN SYNC FUNCTION (CHUNKED)
// ────────────────────────────────────

/**
 * Run the full context sync pipeline with chunked processing.
 *
 * @param options - Sync options (JQL, dryRun, batchSize, resume)
 * @returns SyncResult with status, counts, and any errors
 */
export async function runContextSync(options?: SyncOptions): Promise<SyncResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const allConflicts: ConflictInfo[] = [];
  const batchSize = options?.batchSize || BATCH_SIZE;

  console.log('[Context Sync] Starting chunked sync...');

  // Select JQL based on trigger type
  let jql: string;
  let shouldDeleteExisting = false;

  if (options?.jql) {
    // Custom JQL provided - use it directly
    jql = options.jql;
  } else if (options?.trigger === 'manual-initial') {
    // Initial full sync - use INITIAL_SYNC_JQL and delete existing files
    jql = INITIAL_SYNC_JQL;
    shouldDeleteExisting = true;
  } else {
    // 'cron', 'manual-update', or undefined - use UPDATE_SYNC_JQL
    jql = UPDATE_SYNC_JQL;
  }

  const triggerType = options?.trigger || 'manual-update';
  console.log(`[Context Sync] Trigger: ${triggerType}, Delete existing: ${shouldDeleteExisting}`);

  // If initial sync, delete existing module files first
  if (shouldDeleteExisting && !options?.dryRun) {
    console.log('[Context Sync] Initial sync — deleting existing module files...');
    deleteExistingModules();
  }

  // Check for existing checkpoint
  const existingCheckpoint = await loadCheckpoint();
  const isResuming = existingCheckpoint !== null && options?.resume !== false;

  if (isResuming) {
    console.log(`[Context Sync] Resuming from batch ${existingCheckpoint!.batchNumber}/${existingCheckpoint!.totalBatches}`);
  }

  // Mark sync as started
  await markSyncStarted();

  try {
    // Check Jira configuration
    if (!isJiraConfigured()) {
      throw new Error(
        'Jira is not configured. Set JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN in your environment.'
      );
    }

    console.log(`[Context Sync] JQL: ${jql.substring(0, 100)}...`);

    // Initialize progress
    await updateProgress({
      status: 'running',
      phase: 'fetching-list',
      currentBatch: 0,
      totalBatches: 0,
      ticketsProcessed: 0,
      totalTickets: 0,
      ticketIndexInBatch: 0,
      ticketsInCurrentBatch: 0,
      currentTicketKey: undefined,
      currentTicketTitle: undefined,
      modulesUpdated: 0,
      conflictsResolved: 0,
      percentComplete: 0,
      startedAt: new Date().toISOString(),
    });

    // Fetch ALL tickets from Jira
    console.log('[Context Sync] Fetching all tickets from Jira...');
    const allTickets = await searchJiraIssues(jql, {
      maxResults: 100,
      maxPages: options?.maxTickets ? Math.ceil(options.maxTickets / 100) : 20,
    });

    console.log(`[Context Sync] Fetched ${allTickets.length} tickets from Jira`);

    // Update progress: done fetching list, now will fetch details
    await updateProgress({
      phase: 'fetching-details',
      totalTickets: allTickets.length,
    });

    if (allTickets.length === 0) {
      const duration = Date.now() - startTime;
      await markSyncCompleted(true, 0, 0, duration, ['No tickets found matching JQL query']);
      await updateProgress({
        status: 'completed',
        phase: 'completed',
        percentComplete: 100,
        ticketsProcessed: 0,
        totalTickets: 0,
      });

      return {
        success: true,
        ticketsFetched: 0,
        modulesGenerated: 0,
        filesWritten: [],
        conflicts: [],
        errors: ['No tickets found matching JQL query'],
        duration,
      };
    }

    // Split into batches
    const batches = chunkArray(allTickets, batchSize);
    const totalBatches = batches.length;

    console.log(`[Context Sync] Processing ${allTickets.length} tickets in ${totalBatches} batches of ${batchSize}`);

    // Determine starting point
    const startBatch = isResuming ? existingCheckpoint!.batchNumber : 0;

    // Initialize or restore module context map
    const moduleContextMap = new Map<string, ModuleContext>();

    if (isResuming && existingCheckpoint!.partialModuleContexts) {
      // Restore from checkpoint
      for (const serialized of existingCheckpoint!.partialModuleContexts) {
        moduleContextMap.set(serialized.moduleSlug, deserializeModuleContext(serialized));
      }
      console.log(`[Context Sync] Restored ${moduleContextMap.size} modules from checkpoint`);
    }

    // Update initial progress
    await updateProgress({
      totalBatches,
      totalTickets: allTickets.length,
      currentBatch: startBatch,
      ticketsProcessed: startBatch * batchSize,
      percentComplete: Math.round((startBatch / totalBatches) * 100),
    });

    // Process each batch
    for (let i = startBatch; i < totalBatches; i++) {
      const batch = batches[i];
      const batchNum = i + 1;

      console.log(`[Context Sync] Processing batch ${batchNum}/${totalBatches} (${batch.length} tickets)...`);

      // Fetch full details for each ticket using fetchJiraTicket (same as Analyze page)
      // This ensures we get properly parsed ADF descriptions and acceptance criteria
      const fetchedBatch: JiraTicket[] = [];
      for (let j = 0; j < batch.length; j++) {
        const issue = batch[j];
        const ticketIndex = i * batchSize + j + 1;

        try {
          // Update progress with current ticket details
          await updateProgress({
            phase: 'fetching-details',
            currentBatch: batchNum,
            ticketsProcessed: ticketIndex - 1,
            ticketIndexInBatch: j + 1,
            ticketsInCurrentBatch: batch.length,
            currentTicketKey: issue.ticketId,
            currentTicketTitle: issue.title || 'Loading...',
            percentComplete: Math.round(((ticketIndex - 1) / allTickets.length) * 100),
          });

          console.log(`[Context Sync] Fetching ${issue.ticketId} (${ticketIndex}/${allTickets.length})`);

          const fullTicket = await fetchJiraTicket(issue.ticketId);

          if (fullTicket) {
            fetchedBatch.push(fullTicket);
          } else {
            // Fallback to search result data if individual fetch fails
            fetchedBatch.push(issue);
            console.warn(`[Context Sync] Using search data for ${issue.ticketId} (fetch returned null)`);
          }

          // Rate limiting: 200ms between individual ticket fetches
          // Jira allows ~100 requests/minute, this keeps us under the limit
          await sleep(200);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.warn(`[Context Sync] Failed to fetch ${issue.ticketId}: ${errorMessage}`);

          // If rate limited (429), wait longer and retry once
          if (errorMessage.includes('429')) {
            console.log(`[Context Sync] Rate limited. Waiting 30s...`);
            await sleep(30000);
            try {
              const retry = await fetchJiraTicket(issue.ticketId);
              if (retry) {
                fetchedBatch.push(retry);
              } else {
                fetchedBatch.push(issue); // Fallback to search data
              }
            } catch {
              fetchedBatch.push(issue); // Fallback to search data
            }
          } else {
            fetchedBatch.push(issue); // Fallback to search data on other errors
          }
        }
      }

      // Parse and group fetched tickets in this batch
      const grouped = parseAndGroupTickets(fetchedBatch);

      // Merge into existing module contexts
      for (const [slug, data] of grouped) {
        const existing = moduleContextMap.get(slug);

        if (existing) {
          // Merge tickets into existing module
          existing.tickets.push(...data.tickets);

          // Re-resolve conflicts with merged tickets
          const resolved = resolveConflictsWithMerge(existing.tickets);
          existing.activeTickets = resolved.activeTickets;
          existing.overriddenTickets = resolved.overriddenTickets;

          // Update last updated date
          const lastUpdated = data.tickets.reduce((latest, t) => {
            return t.updated > latest ? t.updated : latest;
          }, existing.lastUpdated);
          existing.lastUpdated = lastUpdated;

          // Collect conflicts and update progress
          allConflicts.push(...resolved.conflicts);
          await updateProgress({ conflictsResolved: allConflicts.length });
        } else {
          // Create new module context
          const newContext = buildModuleContext(slug, data);
          moduleContextMap.set(slug, newContext);
        }
      }

      // Update modules count in progress
      await updateProgress({
        modulesUpdated: moduleContextMap.size,
        currentModule: Array.from(grouped.keys())[0] || undefined,
      });

      // Save checkpoint after each batch
      if (!options?.dryRun) {
        const serializedContexts = Array.from(moduleContextMap.values()).map(serializeModuleContext);

        await saveCheckpoint({
          batchNumber: batchNum,
          totalBatches,
          processedTicketIds: allTickets.slice(0, batchNum * batchSize).map((t) => t.ticketId),
          partialModuleContexts: serializedContexts,
          startedAt: isResuming ? existingCheckpoint!.startedAt : new Date().toISOString(),
        });

        // Save tickets index incrementally for live browser updates
        await saveTicketsIndexIncremental(moduleContextMap);
      }

      // Rate limit between batches
      if (i < totalBatches - 1) {
        await sleep(100);
      }
    }

    // Log conflict summary
    if (allConflicts.length > 0) {
      console.log(`[Context Sync] ${getConflictSummary(allConflicts)}`);
    }

    // Convert map to array for file writing
    const moduleContexts = Array.from(moduleContextMap.values());

    // Write files (unless dry run)
    let filesWritten: string[] = [];
    if (!options?.dryRun) {
      // Update progress to building-context phase
      await updateProgress({
        phase: 'building-context',
        currentModule: 'Building context files...',
        ticketsProcessed: allTickets.length,
        currentTicketKey: undefined,
        currentTicketTitle: undefined,
        percentComplete: 95,
      });

      console.log(`[Context Sync] Writing ${moduleContexts.length} module files...`);

      // Update progress to saving phase
      await updateProgress({
        phase: 'saving',
        currentModule: 'Writing files to disk...',
      });

      filesWritten = await writeContextFiles(moduleContexts);
      console.log(`[Context Sync] Wrote ${filesWritten.length} files`);

      // Save tickets index for the Ticket Browser UI
      await saveTicketsIndex(moduleContexts);

      // Clear checkpoint on success
      await deleteCheckpoint();
    } else {
      console.log('[Context Sync] Dry run - skipping file writes');
    }

    // Calculate duration and mark sync complete
    const duration = Date.now() - startTime;
    await markSyncCompleted(true, allTickets.length, moduleContexts.length, duration);

    // Update final progress
    await updateProgress({
      status: 'completed',
      phase: 'completed',
      percentComplete: 100,
      ticketsProcessed: allTickets.length,
      totalTickets: allTickets.length,
      modulesUpdated: moduleContexts.length,
      conflictsResolved: allConflicts.length,
      currentModule: undefined,
      currentTicketKey: undefined,
      currentTicketTitle: undefined,
    });

    console.log(`[Context Sync] Complete! ${moduleContexts.length} modules in ${duration}ms`);

    return {
      success: true,
      ticketsFetched: allTickets.length,
      modulesGenerated: moduleContexts.length,
      filesWritten,
      conflicts: allConflicts,
      errors: [],
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(errorMessage);

    console.error('[Context Sync] FAILED:', errorMessage);

    await markSyncCompleted(false, 0, 0, duration, errors);
    await updateProgress({
      status: 'failed',
      phase: 'failed',
      error: errorMessage,
      currentTicketKey: undefined,
      currentTicketTitle: undefined,
    });

    return {
      success: false,
      ticketsFetched: 0,
      modulesGenerated: 0,
      filesWritten: [],
      conflicts: [],
      errors,
      duration,
    };
  }
}

// ────────────────────────────────────
// STATUS & PROGRESS FUNCTIONS
// ────────────────────────────────────

/**
 * Get the current sync status.
 */
export async function getSyncStatus(): Promise<SyncState> {
  const state = await readSyncState();

  // Update next scheduled run if needed
  if (!state.nextScheduledRun || new Date(state.nextScheduledRun) < new Date()) {
    state.nextScheduledRun = calculateNextScheduledRun().toISOString();
  }

  return state;
}

/**
 * Get the current sync progress (for frontend polling).
 */
export async function getSyncProgress(): Promise<SyncProgress> {
  return getProgress();
}

/**
 * Check if a sync is currently running.
 */
export async function isSyncRunning(): Promise<boolean> {
  const state = await readSyncState();
  return state.lastSyncStatus === 'running';
}

/**
 * Check if a checkpoint exists for resuming.
 */
export async function canResume(): Promise<boolean> {
  return hasCheckpoint();
}

/**
 * Clear any existing checkpoint (to force fresh start).
 */
export async function clearCheckpoint(): Promise<void> {
  await deleteCheckpoint();
  await resetProgress();
}

/**
 * Get the default JQL query used for syncing.
 * @deprecated Use getInitialSyncJQL() or getUpdateSyncJQL() instead
 */
export function getDefaultJQL(): string {
  return UPDATE_SYNC_JQL;
}

/**
 * Get the JQL query for initial full sync.
 * Fetches all non-cancelled stories and improvements.
 */
export function getInitialSyncJQL(): string {
  return INITIAL_SYNC_JQL;
}

/**
 * Get the JQL query for bi-weekly update sync.
 * Fetches tickets updated in the last 2 weeks with status = Done.
 */
export function getUpdateSyncJQL(): string {
  return UPDATE_SYNC_JQL;
}
