/**
 * Sync State Management for Context Sync Service.
 *
 * Persists sync state to knowledge-base/sync-state.json.
 */

import { readFile, writeFile, mkdir, unlink } from 'fs/promises';
import { join, dirname } from 'path';
import type {
  SyncState,
  SyncHistoryEntry,
  SyncCheckpoint,
  SyncProgress,
  ModuleContext,
  TicketsIndex,
  IndexedTicket,
  ContextGenerationProgress,
} from './types';

// ────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────

const KB_BASE_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';
const STATE_FILE = join(KB_BASE_DIR, 'sync-state.json');
const CHECKPOINT_FILE = join(KB_BASE_DIR, 'sync-checkpoint.json');
const PROGRESS_FILE = join(KB_BASE_DIR, 'sync-progress.json');
const TICKETS_INDEX_FILE = join(KB_BASE_DIR, 'tickets-index.json');
const GENERATION_PROGRESS_FILE = join(KB_BASE_DIR, 'generation-progress.json');
const MAX_HISTORY_ENTRIES = 50;

// ────────────────────────────────────
// DEFAULT STATE
// ────────────────────────────────────

const DEFAULT_STATE: SyncState = {
  lastSyncAt: null,
  lastSyncStatus: 'never',
  totalTicketsSynced: 0,
  moduleCount: 0,
  errors: [],
  nextScheduledRun: null,
  syncHistory: [],
};

// ────────────────────────────────────
// STATE OPERATIONS
// ────────────────────────────────────

/**
 * Read the current sync state from disk.
 * Returns default state if file doesn't exist or is invalid.
 */
export async function readSyncState(): Promise<SyncState> {
  try {
    const content = await readFile(STATE_FILE, 'utf-8');
    const state = JSON.parse(content) as SyncState;

    // Ensure all required fields exist
    return {
      ...DEFAULT_STATE,
      ...state,
    };
  } catch (error) {
    // File doesn't exist or is invalid
    return { ...DEFAULT_STATE };
  }
}

/**
 * Write sync state to disk.
 */
export async function writeSyncState(state: SyncState): Promise<void> {
  // Ensure directory exists
  await mkdir(dirname(STATE_FILE), { recursive: true });

  // Limit history entries
  if (state.syncHistory.length > MAX_HISTORY_ENTRIES) {
    state.syncHistory = state.syncHistory.slice(0, MAX_HISTORY_ENTRIES);
  }

  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Update sync state with partial values.
 * Returns the updated state.
 */
export async function updateSyncState(
  partial: Partial<SyncState>
): Promise<SyncState> {
  const current = await readSyncState();
  const updated = { ...current, ...partial };
  await writeSyncState(updated);
  return updated;
}

/**
 * Add a history entry to the sync state.
 */
export async function addSyncHistoryEntry(
  entry: SyncHistoryEntry
): Promise<void> {
  const state = await readSyncState();

  // Add new entry at the beginning
  state.syncHistory.unshift(entry);

  // Limit history
  if (state.syncHistory.length > MAX_HISTORY_ENTRIES) {
    state.syncHistory = state.syncHistory.slice(0, MAX_HISTORY_ENTRIES);
  }

  await writeSyncState(state);
}

/**
 * Mark sync as started (running).
 */
export async function markSyncStarted(): Promise<void> {
  await updateSyncState({
    lastSyncStatus: 'running',
  });
}

/**
 * Mark sync as completed (success or failed).
 */
export async function markSyncCompleted(
  success: boolean,
  ticketCount: number,
  moduleCount: number,
  duration: number,
  errors: string[] = []
): Promise<void> {
  const now = new Date().toISOString();

  // Calculate next scheduled run (2 weeks from now)
  const nextRun = new Date();
  nextRun.setDate(nextRun.getDate() + 14);

  // Create history entry
  const historyEntry: SyncHistoryEntry = {
    timestamp: now,
    status: success ? 'success' : 'failed',
    ticketCount,
    moduleCount,
    duration,
    errors,
  };

  const state = await readSyncState();

  // Update state
  state.lastSyncAt = now;
  state.lastSyncStatus = success ? 'success' : 'failed';
  state.totalTicketsSynced = ticketCount;
  state.moduleCount = moduleCount;
  state.errors = errors;
  state.nextScheduledRun = nextRun.toISOString();

  // Add history entry
  state.syncHistory.unshift(historyEntry);
  if (state.syncHistory.length > MAX_HISTORY_ENTRIES) {
    state.syncHistory = state.syncHistory.slice(0, MAX_HISTORY_ENTRIES);
  }

  await writeSyncState(state);
}

/**
 * Get the path to the state file.
 */
export function getStateFilePath(): string {
  return STATE_FILE;
}

/**
 * Calculate the next scheduled run date.
 * Runs on the 1st and 15th of each month at 3 AM UTC.
 */
export function calculateNextScheduledRun(): Date {
  const now = new Date();
  const day = now.getUTCDate();

  let nextRun: Date;

  if (day < 15) {
    // Next run is the 15th of this month
    nextRun = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 3, 0, 0));
  } else {
    // Next run is the 1st of next month
    nextRun = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 3, 0, 0));
  }

  // If the calculated date is in the past, move to next occurrence
  if (nextRun <= now) {
    if (nextRun.getUTCDate() === 15) {
      nextRun = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 3, 0, 0));
    } else {
      nextRun = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 15, 3, 0, 0));
    }
  }

  return nextRun;
}

// ────────────────────────────────────
// CHECKPOINT OPERATIONS
// ────────────────────────────────────

/**
 * Default progress state (idle, no active sync).
 */
const DEFAULT_PROGRESS: SyncProgress = {
  status: 'idle',
  phase: 'idle',
  currentBatch: 0,
  totalBatches: 0,
  ticketsProcessed: 0,
  totalTickets: 0,
  ticketIndexInBatch: 0,
  ticketsInCurrentBatch: 0,
  modulesUpdated: 0,
  conflictsResolved: 0,
  percentComplete: 0,
};

/**
 * Save checkpoint for resumable sync.
 * Called after each batch to allow recovery from interruption.
 */
export async function saveCheckpoint(checkpoint: SyncCheckpoint): Promise<void> {
  await mkdir(dirname(CHECKPOINT_FILE), { recursive: true });
  await writeFile(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf-8');
  console.log(`[Checkpoint] Saved batch ${checkpoint.batchNumber}/${checkpoint.totalBatches}`);
}

/**
 * Load existing checkpoint if one exists.
 * Returns null if no checkpoint or file is invalid.
 */
export async function loadCheckpoint(): Promise<SyncCheckpoint | null> {
  try {
    const content = await readFile(CHECKPOINT_FILE, 'utf-8');
    const checkpoint = JSON.parse(content) as SyncCheckpoint;
    console.log(`[Checkpoint] Loaded checkpoint at batch ${checkpoint.batchNumber}/${checkpoint.totalBatches}`);
    return checkpoint;
  } catch {
    return null;
  }
}

/**
 * Delete checkpoint file (called after successful sync completion).
 */
export async function deleteCheckpoint(): Promise<void> {
  try {
    await unlink(CHECKPOINT_FILE);
    console.log('[Checkpoint] Deleted checkpoint file');
  } catch {
    // File doesn't exist, ignore
  }
}

/**
 * Check if a checkpoint exists.
 */
export async function hasCheckpoint(): Promise<boolean> {
  try {
    await readFile(CHECKPOINT_FILE, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the checkpoint file path.
 */
export function getCheckpointFilePath(): string {
  return CHECKPOINT_FILE;
}

// ────────────────────────────────────
// PROGRESS OPERATIONS
// ────────────────────────────────────

/**
 * Update sync progress (for frontend polling).
 */
export async function updateProgress(partial: Partial<SyncProgress>): Promise<void> {
  const current = await getProgress();
  const updated = { ...current, ...partial };
  await mkdir(dirname(PROGRESS_FILE), { recursive: true });
  await writeFile(PROGRESS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}

/**
 * Get current sync progress.
 */
export async function getProgress(): Promise<SyncProgress> {
  try {
    const content = await readFile(PROGRESS_FILE, 'utf-8');
    return { ...DEFAULT_PROGRESS, ...JSON.parse(content) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Reset progress to idle state.
 */
export async function resetProgress(): Promise<void> {
  await updateProgress(DEFAULT_PROGRESS);
}

/**
 * Get the progress file path.
 */
export function getProgressFilePath(): string {
  return PROGRESS_FILE;
}

// ────────────────────────────────────
// TICKETS INDEX OPERATIONS
// ────────────────────────────────────

/**
 * Extract Figma links from ticket description.
 */
function extractFigmaLinks(text: string): string[] {
  if (!text) return [];
  const figmaRegex = /https?:\/\/(www\.)?figma\.com\/[^\s)>]+/gi;
  const matches = text.match(figmaRegex);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract sprint from ticket labels.
 */
function extractSprint(labels: string[]): string | undefined {
  const sprintLabel = labels.find(
    (l) => l.toLowerCase().startsWith('sprint') || l.match(/^\d+\.\d+/)
  );
  return sprintLabel;
}

/**
 * Save tickets index for the Ticket Browser UI.
 * Stores full ticket data in knowledge-base/tickets-index.json.
 */
export async function saveTicketsIndex(modules: ModuleContext[]): Promise<void> {
  const allTickets: IndexedTicket[] = [];

  for (const module of modules) {
    for (const ticket of module.tickets) {
      allTickets.push({
        ticketId: ticket.ticketId,
        title: ticket.title,
        module: module.moduleName,
        moduleSlug: module.moduleSlug,
        status: ticket.status,
        priority: ticket.priority,
        type: ticket.type,
        created: ticket.created instanceof Date ? ticket.created.toISOString() : ticket.created,
        updated: ticket.updated instanceof Date ? ticket.updated.toISOString() : ticket.updated,
        labels: ticket.labels,
        components: ticket.components,
        userStory: ticket.userStory,
        description: ticket.description,
        acceptanceCriteria: ticket.acceptanceCriteria,
        figmaLinks: extractFigmaLinks(ticket.userStory || ticket.description || ''),
        sprint: extractSprint(ticket.labels),
      });
    }
  }

  // Sort by created date ASC (oldest first, matching Jira sort)
  allTickets.sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );

  const index: TicketsIndex = {
    lastUpdated: new Date().toISOString(),
    totalTickets: allTickets.length,
    modules: [...new Set(modules.map((m) => m.moduleName))].sort(),
    tickets: allTickets,
  };

  await mkdir(dirname(TICKETS_INDEX_FILE), { recursive: true });
  await writeFile(TICKETS_INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

  console.log(`[Tickets Index] Saved ${allTickets.length} tickets to ${TICKETS_INDEX_FILE}`);
}

/**
 * Load tickets index from disk.
 * Returns null if file doesn't exist or is invalid.
 */
export async function loadTicketsIndex(): Promise<TicketsIndex | null> {
  try {
    const content = await readFile(TICKETS_INDEX_FILE, 'utf-8');
    return JSON.parse(content) as TicketsIndex;
  } catch {
    return null;
  }
}

/**
 * Get the tickets index file path.
 */
export function getTicketsIndexFilePath(): string {
  return TICKETS_INDEX_FILE;
}

/**
 * Save tickets index incrementally from a Map during batch processing.
 * Used during sync to allow live ticket listing before completion.
 */
export async function saveTicketsIndexIncremental(
  moduleContextMap: Map<string, ModuleContext>
): Promise<void> {
  const modules = Array.from(moduleContextMap.values());
  await saveTicketsIndex(modules);
}

// ────────────────────────────────────
// CONTEXT GENERATION PROGRESS OPERATIONS
// ────────────────────────────────────

/**
 * Default context generation progress state.
 */
const DEFAULT_GENERATION_PROGRESS: ContextGenerationProgress = {
  status: 'idle',
  modulesProcessed: 0,
  totalModules: 0,
  percentComplete: 0,
  errors: [],
};

/**
 * Update context generation progress (for frontend polling).
 */
export async function updateGenerationProgress(
  partial: Partial<ContextGenerationProgress>
): Promise<void> {
  const current = await getGenerationProgress();
  const updated = { ...current, ...partial };
  await mkdir(dirname(GENERATION_PROGRESS_FILE), { recursive: true });
  await writeFile(GENERATION_PROGRESS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}

/**
 * Get current context generation progress.
 */
export async function getGenerationProgress(): Promise<ContextGenerationProgress> {
  try {
    const content = await readFile(GENERATION_PROGRESS_FILE, 'utf-8');
    return { ...DEFAULT_GENERATION_PROGRESS, ...JSON.parse(content) };
  } catch {
    return { ...DEFAULT_GENERATION_PROGRESS };
  }
}

/**
 * Reset context generation progress to idle state.
 */
export async function resetGenerationProgress(): Promise<void> {
  await updateGenerationProgress(DEFAULT_GENERATION_PROGRESS);
}

/**
 * Get the generation progress file path.
 */
export function getGenerationProgressFilePath(): string {
  return GENERATION_PROGRESS_FILE;
}
