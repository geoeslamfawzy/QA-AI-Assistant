// Impact Detection Types

export type ChangeType = 'NEW_FEATURE' | 'REVAMP' | 'REMOVAL';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ImpactType = 'DIRECT' | 'INDIRECT' | 'DEPENDENCY';

export type EffortLevel = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface ImpactAffectedModule {
  module_id: string;
  module_name: string;
  system: string;
  impact_type: ImpactType;
  impact_description: string;
  risk: RiskLevel;
  changes_required: string[];
}

export interface AffectedBusinessRule {
  rule_id: string;
  current_rule: string;
  proposed_change: string;
  breaking: boolean;
}

export interface AffectedUIPage {
  page: string;
  change: string;
  effort: EffortLevel;
}

export interface AffectedAPIEndpoint {
  endpoint: string;
  change: string;
  breaking_change: boolean;
}

export interface RegressionRecommendation {
  area: string;
  reason: string;
  priority: RiskLevel;
}

export interface EffortEstimate {
  frontend: EffortLevel;
  backend: EffortLevel;
  testing: EffortLevel;
  total_story_points_estimate: number;
}

export interface ImpactAnalysisResult {
  change_type: ChangeType;
  risk_level: RiskLevel;
  risk_justification: string;
  affected_modules: ImpactAffectedModule[];
  affected_business_rules: AffectedBusinessRule[];
  affected_ui_pages: AffectedUIPage[];
  affected_api_endpoints: AffectedAPIEndpoint[];
  dependency_chain: string[];
  regression_test_recommendations: RegressionRecommendation[];
  estimated_effort: EffortEstimate;
}

export interface ImpactDetectionRequest {
  story: string;
  options?: {
    includeEffortEstimate?: boolean;
    includeRegressionSuggestions?: boolean;
  };
}

export interface ImpactDetectionResponse {
  success: boolean;
  result?: ImpactAnalysisResult;
  error?: string;
  context_used?: string[];
}
