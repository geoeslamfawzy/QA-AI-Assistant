/**
 * Context Sync Module
 *
 * Syncs Jira tickets to build project context documents.
 * Runs every 2 weeks via cron or manually from the UI.
 */

// Main sync service
export {
  runContextSync,
  getSyncStatus,
  getSyncProgress,
  isSyncRunning,
  canResume,
  clearCheckpoint,
  getDefaultJQL,
  getInitialSyncJQL,
  getUpdateSyncJQL,
} from './sync-service';

// Ticket parsing
export { parseTicket, parseAndGroupTickets, detectModuleWithSlug, getModuleRules } from './ticket-parser';

// Conflict resolution
export { resolveConflicts, resolveConflictsWithMerge, getConflictSummary } from './conflict-resolver';

// Context building
export { buildModuleMarkdown, buildIndexMarkdown, writeContextFiles, getContextDir } from './context-builder';

// Sync state management
export {
  readSyncState,
  writeSyncState,
  updateSyncState,
  addSyncHistoryEntry,
  markSyncStarted,
  markSyncCompleted,
  getStateFilePath,
  calculateNextScheduledRun,
  // Checkpoint functions
  saveCheckpoint,
  loadCheckpoint,
  deleteCheckpoint,
  hasCheckpoint,
  getCheckpointFilePath,
  // Progress functions
  updateProgress,
  getProgress,
  resetProgress,
  getProgressFilePath,
} from './sync-state';

// Types
export type {
  ParsedTicket,
  ModuleContext,
  SyncState,
  SyncHistoryEntry,
  SyncResult,
  SyncOptions,
  ConflictInfo,
  OverriddenTicket,
  DetectedModule,
  ModuleRule,
  // Checkpoint & Progress types
  SyncCheckpoint,
  SyncProgress,
  SerializedModuleContext,
} from './types';
