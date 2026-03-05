// Test Case Types

export type TestCaseType =
  | 'POSITIVE'
  | 'NEGATIVE'
  | 'EDGE_CASE'
  | 'BOUNDARY'
  | 'REGRESSION'
  | 'ACCESSIBILITY'
  | 'PERFORMANCE';

export type TestPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TestStep {
  step: number;
  action: string;
  expected: string;
  data?: string;
}

export interface TestCase {
  id: string;
  title: string;
  type: TestCaseType;
  priority: TestPriority;
  module: string;
  preconditions: string[];
  steps: TestStep[];
  expected_result: string;
  traceability: string;
  automatable?: boolean;
  tags?: string[];
}

export interface TestDataSuggestion {
  field: string;
  valid_examples: string[];
  invalid_examples: string[];
  notes: string;
}

export interface CoverageSummary {
  positive: number;
  negative: number;
  edge_case: number;
  boundary: number;
  regression: number;
  accessibility?: number;
  performance?: number;
  total: number;
}

export interface TestSuiteResult {
  story_summary: string;
  preconditions: string[];
  test_data_suggestions: TestDataSuggestion[];
  test_cases: TestCase[];
  coverage_summary: CoverageSummary;
}

export interface TestGenerationOptions {
  includePositive?: boolean;
  includeNegative?: boolean;
  includeEdge?: boolean;
  includeBoundary?: boolean;
  includeRegression?: boolean;
  includeAccessibility?: boolean;
  includePerformance?: boolean;
  maxTestCases?: number;
}

export interface TestGenerationRequest {
  story: string;
  options?: TestGenerationOptions;
}

export interface TestGenerationResponse {
  success: boolean;
  result?: TestSuiteResult;
  error?: string;
  context_used?: string[];
}
