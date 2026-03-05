/**
 * Test Case Types for XRAY/Jira Integration
 *
 * Supports both BDD format (Given/When/Then) and legacy format
 * for backwards compatibility with existing test case parsing.
 */

// ────────────────────────────────────
// TEST CASE TYPES
// ────────────────────────────────────

export type TestCasePriority = 'critical' | 'high' | 'medium' | 'low';

export type TestCaseType =
  | 'functional'
  | 'edge-case'
  | 'negative'
  | 'ui-ux'
  | 'performance'
  | 'security'
  | 'accessibility';

/**
 * Extended test case interface with BDD (Given/When/Then) fields.
 * Also includes legacy fields for backwards compatibility.
 */
export interface BDDTestCase {
  /** Unique identifier within the batch, e.g., "TC-001" */
  id: string;

  /** Test case title - should start with "Verify", "Validate", or "Test" */
  title: string;

  /** Test type category */
  type: TestCaseType;

  /** Priority level */
  priority: TestCasePriority;

  /** BDD Given section - preconditions/context setup */
  given: string[];

  /** BDD When section - actions/steps to perform */
  when: string[];

  /** BDD Then section - expected outcomes/verifications */
  then: string[];

  /** Legacy: Preconditions (maps to given) */
  preconditions: string[];

  /** Legacy: Test steps (maps to when) */
  steps: string[];

  /** Legacy: Expected result (maps to then[0]) */
  expectedResult: string;
}

/**
 * Test case with selection state for UI checkboxes.
 */
export interface SelectableTestCase extends BDDTestCase {
  /** Whether this test case is selected for push */
  selected: boolean;
}

// ────────────────────────────────────
// PUSH OPERATION TYPES
// ────────────────────────────────────

export type PushStatus = 'created' | 'skipped' | 'failed';

/**
 * Result for a single test case push operation.
 */
export interface TestCasePushResult {
  /** Original test case ID */
  testCaseId: string;

  /** Test case title */
  title: string;

  /** Push status */
  status: PushStatus;

  /** Jira issue key if created or found (e.g., "CMB-1234") */
  jiraKey?: string;

  /** Full URL to the Jira issue */
  jiraUrl?: string;

  /** Reason for skip/failure */
  reason?: string;

  /** Parent story key if linked */
  linkedTo?: string;
}

/**
 * Summary statistics for a push operation.
 */
export interface PushSummary {
  /** Total test cases processed */
  total: number;

  /** Successfully created in Jira */
  created: number;

  /** Skipped due to deduplication */
  skipped: number;

  /** Failed due to errors */
  failed: number;
}

/**
 * Complete response from push operation.
 */
export interface PushTestCasesResponse {
  /** Overall success (true if no failures) */
  success: boolean;

  /** Individual results per test case */
  results: TestCasePushResult[];

  /** Summary statistics */
  summary: PushSummary;

  /** Parent story key if provided */
  parentStoryKey?: string;

  /** Whether this is mock data (Jira not configured) */
  _isMock: boolean;
}

/**
 * Request payload for push API endpoint.
 */
export interface PushTestCasesRequest {
  /** Test cases to push */
  testCases: BDDTestCase[];

  /** Parent story to link tests to (optional) */
  parentStoryKey?: string;

  /** Target Jira project key (defaults to env config) */
  projectKey?: string;
}

// ────────────────────────────────────
// PARSED RESPONSE TYPES
// ────────────────────────────────────

/**
 * Coverage summary after parsing Claude's response.
 */
export interface CoverageSummary {
  total: number;
  byType: Partial<Record<TestCaseType, number>>;
}

/**
 * Response from parse API endpoint.
 */
export interface ParseTestCasesResponse {
  success: boolean;
  testCases: BDDTestCase[];
  coverageSummary: CoverageSummary;
  error?: string;
}
