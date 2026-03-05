// Story Analysis Types

export type ChangeClassification =
  | 'NEW_FEATURE'
  | 'REVAMP'
  | 'REMOVAL'
  | 'BUG_FIX'
  | 'ENHANCEMENT';

export type Relevance = 'PRIMARY' | 'SECONDARY' | 'INDIRECT';

export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

export type MissingCategory =
  | 'ERROR_HANDLING'
  | 'VALIDATION'
  | 'SECURITY'
  | 'PERFORMANCE'
  | 'ACCESSIBILITY'
  | 'I18N'
  | 'BUSINESS_RULE';

export interface AffectedModule {
  module_id: string;
  module_name: string;
  system: string;
  relevance: Relevance;
}

export interface CompletenessBreakdown {
  has_clear_goal: boolean;
  has_acceptance_criteria: boolean;
  has_user_role: boolean;
  has_preconditions: boolean;
  has_error_scenarios: boolean;
  has_edge_cases: boolean;
  has_data_requirements: boolean;
  has_ui_specification: boolean;
}

export interface Ambiguity {
  id: string;
  text: string;
  severity: Severity;
  suggestion: string;
}

export interface MissingRequirement {
  id: string;
  description: string;
  category: MissingCategory;
  suggested_addition: string;
}

export interface ContextConflict {
  id: string;
  story_says: string;
  context_says: string;
  recommendation: string;
}

export interface RelatedFeature {
  module: string;
  feature: string;
  note: string;
}

export interface StoryAnalysisResult {
  summary: string;
  classification: ChangeClassification;
  affected_modules: AffectedModule[];
  completeness_score: number;
  completeness_breakdown: CompletenessBreakdown;
  ambiguities: Ambiguity[];
  missing_requirements: MissingRequirement[];
  context_conflicts: ContextConflict[];
  suggested_improvements: string[];
  related_existing_features: RelatedFeature[];
}

export interface AnalysisRequest {
  story: string;
  options?: {
    includeRelatedFeatures?: boolean;
    checkBusinessRules?: boolean;
  };
}

export interface AnalysisResponse {
  success: boolean;
  result?: StoryAnalysisResult;
  error?: string;
  context_used?: string[];
}
