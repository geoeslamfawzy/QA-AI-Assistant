/**
 * In-memory progress tracker for Module Explorer operations.
 *
 * Tracks the progress of ticket fetching and document generation.
 */

export interface ModuleExplorerProgress {
  status: 'idle' | 'fetching' | 'generating' | 'completed' | 'failed';
  phase: 'searching' | 'fetching-details' | 'generating-doc' | 'saving' | 'done';
  totalTickets: number;
  fetchedTickets: number;
  currentTicketKey: string;
  currentTicketTitle: string;
  startedAt?: string;
  error?: string;
}

let progress: ModuleExplorerProgress | null = null;

/**
 * Get the current progress state.
 */
export function getModuleExplorerProgress(): ModuleExplorerProgress | null {
  return progress;
}

/**
 * Update progress with partial values.
 */
export function updateModuleExplorerProgress(update: Partial<ModuleExplorerProgress>): void {
  if (!progress) {
    progress = {
      status: 'idle',
      phase: 'searching',
      totalTickets: 0,
      fetchedTickets: 0,
      currentTicketKey: '',
      currentTicketTitle: '',
    };
  }
  Object.assign(progress, update);
}

/**
 * Reset progress to idle state.
 */
export function resetModuleExplorerProgress(): void {
  progress = null;
}

/**
 * Initialize progress for a new fetch operation.
 */
export function startFetchProgress(totalTickets: number): void {
  progress = {
    status: 'fetching',
    phase: 'searching',
    totalTickets,
    fetchedTickets: 0,
    currentTicketKey: '',
    currentTicketTitle: '',
    startedAt: new Date().toISOString(),
  };
}

/**
 * Update progress for ticket fetch.
 */
export function updateFetchProgress(
  fetchedTickets: number,
  currentTicketKey: string,
  currentTicketTitle: string
): void {
  if (progress) {
    progress.fetchedTickets = fetchedTickets;
    progress.currentTicketKey = currentTicketKey;
    progress.currentTicketTitle = currentTicketTitle;
    progress.phase = 'fetching-details';
  }
}

/**
 * Mark fetch as complete.
 */
export function completeFetchProgress(): void {
  if (progress) {
    progress.status = 'completed';
    progress.phase = 'done';
  }
}

/**
 * Mark progress as failed.
 */
export function failProgress(error: string): void {
  if (progress) {
    progress.status = 'failed';
    progress.error = error;
  }
}

// ────────────────────────────────────────────────────────────────
// TICKET STORAGE (for background fetch)
// ────────────────────────────────────────────────────────────────

export interface ModuleExplorerTicket {
  key: string;
  title: string;
  type: string;
  status: string;
  module: string;
  description: string;
  acceptanceCriteria: string[];
  labels: string[];
  components: string[];
  priority: string;
  sprint: string;
  assignee: string;
  created: string;
  updated: string;
  figmaLinks: string[];
}

let fetchedTickets: ModuleExplorerTicket[] = [];

/**
 * Add a fetched ticket to the in-memory store.
 */
export function addFetchedTicket(ticket: ModuleExplorerTicket): void {
  fetchedTickets.push(ticket);
}

/**
 * Get all fetched tickets so far.
 */
export function getFetchedTickets(): ModuleExplorerTicket[] {
  return fetchedTickets;
}

/**
 * Reset the fetched tickets store.
 */
export function resetFetchedTickets(): void {
  fetchedTickets = [];
}
