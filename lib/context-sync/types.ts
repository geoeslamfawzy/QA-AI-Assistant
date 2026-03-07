/**
 * Type definitions for the Context Sync Service.
 *
 * This service syncs Jira tickets to build project context documents.
 */

// ────────────────────────────────────
// JIRA SEARCH TYPES
// ────────────────────────────────────

export interface JiraSearchResult {
  issues: JiraIssueRaw[];
  total: number;
  maxResults: number;
  startAt: number;
}

export interface JiraIssueRaw {
  key: string;
  fields: {
    summary: string;
    description: unknown; // ADF format
    status: { name: string };
    issuetype: { name: string };
    labels: string[];
    components: { name: string }[];
    created: string;
    updated: string;
    priority: { name: string };
    assignee?: { displayName: string };
    reporter?: { displayName: string };
  };
}

// ────────────────────────────────────
// PARSED TICKET TYPES
// ────────────────────────────────────

export interface ParsedTicket {
  ticketId: string;
  title: string;
  module: string;
  moduleSlug: string;
  userStory: string;
  description: string;
  acceptanceCriteria: string[];
  type: 'Task' | 'Story';
  status: string;
  priority: string;
  created: Date;
  updated: Date;
  labels: string[];
  components: string[];
}

// ────────────────────────────────────
// MODULE CONTEXT TYPES
// ────────────────────────────────────

export interface ModuleContext {
  moduleId: string;
  moduleName: string;
  moduleSlug: string;
  tickets: ParsedTicket[];
  activeTickets: ParsedTicket[];  // Non-overridden tickets
  overriddenTickets: OverriddenTicket[];
  lastUpdated: Date;
}

export interface OverriddenTicket {
  ticket: ParsedTicket;
  overriddenBy: string; // Key of the newer ticket
}

// ────────────────────────────────────
// SYNC STATE TYPES
// ────────────────────────────────────

export interface SyncState {
  lastSyncAt: string | null;
  lastSyncStatus: 'success' | 'failed' | 'running' | 'never';
  totalTicketsSynced: number;
  moduleCount: number;
  errors: string[];
  nextScheduledRun: string | null;
  syncHistory: SyncHistoryEntry[];
}

export interface SyncHistoryEntry {
  timestamp: string;
  status: 'success' | 'failed';
  ticketCount: number;
  moduleCount: number;
  duration: number;
  errors: string[];
}

// ────────────────────────────────────
// SYNC CHECKPOINT & PROGRESS TYPES
// ────────────────────────────────────

/**
 * Checkpoint for resumable sync operations.
 * Saved after each batch to allow resuming from interruption.
 */
export interface SyncCheckpoint {
  batchNumber: number;
  totalBatches: number;
  processedTicketIds: string[];
  nextPageToken?: string;
  /** Serialized module contexts (Map is not JSON-serializable) */
  partialModuleContexts: SerializedModuleContext[];
  startedAt: string;
}

/**
 * Serializable version of ModuleContext for checkpoint storage.
 */
export interface SerializedModuleContext {
  moduleId: string;
  moduleName: string;
  moduleSlug: string;
  tickets: ParsedTicket[];
  activeTickets: ParsedTicket[];
  overriddenTickets: OverriddenTicket[];
  lastUpdated: string; // ISO string instead of Date
}

/**
 * Sync operation phase for detailed progress tracking.
 */
export type SyncPhase =
  | 'idle'
  | 'fetching-list'
  | 'fetching-details'
  | 'building-context'
  | 'saving'
  | 'completed'
  | 'failed';

/**
 * Real-time progress tracking for the sync operation.
 * Used by frontend to display detailed progress bar with ticket-level info.
 */
export interface SyncProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  phase: SyncPhase;
  currentBatch: number;
  totalBatches: number;
  ticketsProcessed: number;
  totalTickets: number;
  ticketIndexInBatch: number;
  ticketsInCurrentBatch: number;
  currentTicketKey?: string;
  currentTicketTitle?: string;
  modulesUpdated: number;
  currentModule?: string;
  conflictsResolved: number;
  percentComplete: number;
  startedAt?: string;
  estimatedTimeRemaining?: number;
  error?: string;
}

// ────────────────────────────────────
// SYNC RESULT TYPES
// ────────────────────────────────────

export interface SyncResult {
  success: boolean;
  ticketsFetched: number;
  modulesGenerated: number;
  filesWritten: string[];
  conflicts: ConflictInfo[];
  errors: string[];
  duration: number;
}

export interface ConflictInfo {
  olderTicket: string;
  newerTicket: string;
  module: string;
  reason: string;
}

// ────────────────────────────────────
// SYNC OPTIONS
// ────────────────────────────────────

export interface SyncOptions {
  jql?: string;
  dryRun?: boolean;
  incremental?: boolean;
  maxTickets?: number;
  /** Resume from checkpoint if one exists */
  resume?: boolean;
  /** Batch size for chunked processing (default: 50) */
  batchSize?: number;
  /** Trigger type determines which JQL query to use and behavior */
  trigger?: 'cron' | 'manual-initial' | 'manual-update';
}

// ────────────────────────────────────
// MODULE DETECTION TYPES
// ────────────────────────────────────

export interface ModuleRule {
  name: string;
  slug: string;
  keywords: string[];
}

export interface DetectedModule {
  name: string;
  slug: string;
}

// ────────────────────────────────────
// TICKETS INDEX TYPES (for Ticket Browser)
// ────────────────────────────────────

/**
 * Individual ticket stored in the tickets index.
 * Contains full ticket data for browser display.
 */
export interface IndexedTicket {
  ticketId: string;
  title: string;
  module: string;
  moduleSlug: string;
  status: string;
  priority: string;
  type: 'Task' | 'Story';
  created: string;
  updated: string;
  labels: string[];
  components: string[];
  userStory: string;
  description: string;
  acceptanceCriteria: string[];
  figmaLinks: string[];
  sprint?: string;
}

/**
 * Tickets index stored in knowledge-base/tickets-index.json.
 * Used by the Ticket Browser UI for browsing all synced tickets.
 */
export interface TicketsIndex {
  lastUpdated: string;
  totalTickets: number;
  modules: string[];
  tickets: IndexedTicket[];
}

// ────────────────────────────────────
// CLAUDE CONTEXT GENERATION TYPES
// ────────────────────────────────────

/**
 * Status type for individual module during context generation.
 */
export type ModuleGenStatusType = 'pending' | 'generating' | 'completed' | 'failed';

/**
 * Per-module generation status for detailed progress tracking.
 */
export interface ModuleGenStatus {
  moduleName: string;
  moduleSlug: string;
  ticketCount: number;
  activeTicketCount: number;
  status: ModuleGenStatusType;
  error?: string;
  generatedContentPreview?: string;
  completedAt?: string;
}

/**
 * Progress tracking for Claude context generation.
 * Used by frontend to display generation progress.
 */
export interface ContextGenerationProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentModule?: string;
  modulesProcessed: number;
  totalModules: number;
  percentComplete: number;
  errors: string[];
  startedAt?: string;
  usedAI?: boolean;
  /** Per-module status list for detailed visual feedback */
  modules?: ModuleGenStatus[];
}

/**
 * Result of generating context for a single module.
 */
export interface GeneratedModuleContext {
  moduleSlug: string;
  moduleName: string;
  markdown: string;
  ticketCount: number;
  activeCount: number;
  generatedAt: string;
  usedAI: boolean;
}

/**
 * Result of the full context generation process.
 */
export interface ContextGenerationResult {
  success: boolean;
  modulesProcessed: number;
  filesWritten: string[];
  duration: number;
  usedAI: boolean;
  errors: string[];
}
