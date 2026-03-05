// Change Log Types

export type ChangeAction = 'ADDED' | 'MODIFIED' | 'REMOVED';

export type ChangeStatus = 'APPLIED' | 'PENDING_REVIEW' | 'REVERTED';

export type ChangeType = 'NEW_FEATURE' | 'REVAMP' | 'REMOVAL';

export interface DiffEntry {
  section: string;
  action: ChangeAction;
  before?: string;
  after?: string;
}

export interface NewBusinessRule {
  id: string;
  rule: string;
  module: string;
  enforcement: string;
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  storyId?: string;
  changeType: ChangeType;
  moduleId: string;
  moduleName: string;
  summary: string;
  sectionsAffected: string[];
  status: ChangeStatus;
  diff: DiffEntry[];
  snapshotVersion: string;
  author?: string;
}

export interface ContextUpdatePreview {
  module_id: string;
  change_summary: string;
  change_type: ChangeType;
  updated_content: string;
  diff_description: DiffEntry[];
  new_business_rules: NewBusinessRule[];
  removed_business_rules: string[];
  modified_business_rules: string[];
  change_log_entry: {
    story_id?: string;
    change_type: ChangeType;
    module: string;
    summary: string;
    sections_affected: string[];
  };
}

export interface ContextUpdateRequest {
  story: string;
  moduleId: string;
  changeType: ChangeType;
}

export interface ContextUpdateResponse {
  success: boolean;
  preview?: ContextUpdatePreview;
  error?: string;
}

export interface ApplyContextUpdateRequest {
  moduleId: string;
  updatedContent: string;
  changeLogEntry: Omit<ChangeLogEntry, 'id' | 'timestamp' | 'status'>;
}

export interface ChangeLogFilters {
  changeType?: ChangeType;
  moduleId?: string;
  startDate?: string;
  endDate?: string;
  status?: ChangeStatus;
}
