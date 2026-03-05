/**
 * Jira Field Configuration for yassir.atlassian.net / CMB project
 *
 * Field IDs discovered via Jira REST API on 2024-03-02.
 * Run the discovery curl commands to update if field IDs change.
 */

// ════════════════════════════════════════════════════════════════
// PROJECT CONFIGURATION
// ════════════════════════════════════════════════════════════════

/** Main Jira project key */
export const PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'CMB';

/** XRAY project key (defaults to main project) */
export const XRAY_PROJECT_KEY = process.env.XRAY_PROJECT_KEY || PROJECT_KEY;

// ════════════════════════════════════════════════════════════════
// ISSUE TYPE NAMES
// ════════════════════════════════════════════════════════════════

export const BUG_TYPE = 'Bug';
export const DEFECT_TYPE = 'Defect';
export const STORY_DEFECT_TYPE = 'Story Defect';
export const TEST_ISSUE_TYPE = 'Test';

// ════════════════════════════════════════════════════════════════
// LINK TYPES
// ════════════════════════════════════════════════════════════════

export const TEST_LINK_TYPE = 'Tests';
export const FALLBACK_LINK_TYPE = 'Relates';

// ════════════════════════════════════════════════════════════════
// CUSTOM FIELD IDs — Discovered from Jira API
// ════════════════════════════════════════════════════════════════

/**
 * Field type definitions:
 * - 'string': Plain text value
 * - 'option': Single select → { value: "text" }
 * - 'array-option': Multi-select → [{ value: "text" }]
 */
export type FieldType = 'string' | 'option' | 'array-option' | 'adf';

/**
 * All custom field IDs for Bug/Defect issues.
 * Each field includes its ID and type for proper formatting.
 */
export const JIRA_FIELDS = {
  // ── Core Bug/Defect Fields ──
  // NOTE: These fields require ADF (Atlassian Document Format) in Jira Cloud API v3
  STEPS_TO_REPRODUCE: {
    id: 'customfield_10389',
    type: 'adf' as FieldType,
  },
  EXPECTED_RESULTS: {
    id: 'customfield_10390',
    type: 'adf' as FieldType,
  },
  ACTUAL_RESULTS: {
    id: 'customfield_10388',
    type: 'adf' as FieldType,
  },
  PRECONDITION: {
    id: 'customfield_10391',
    type: 'adf' as FieldType,
  },

  // ── Alternative naming (some issue types use these) ──
  EXPECTED_BEHAVIOR: {
    id: 'customfield_10374',
    type: 'string' as FieldType,
  },
  ACTUAL_BEHAVIOR: {
    id: 'customfield_10375',
    type: 'string' as FieldType,
  },

  // ── Environment & Platform ──
  // NOTE: Using system 'environment' field, NOT customfield_10518 (multiselect)
  // The system field is available on Bug, Defect, and Story Defect types
  // Requires ADF format in Jira Cloud API v3
  ENVIRONMENT: {
    id: 'environment',
    type: 'adf' as FieldType,
  },
  PLATFORM: {
    id: 'customfield_10368',
    type: 'array-option' as FieldType,
  },

  // ── Business Fields ──
  // NOTE: Using customfield_10383 (string) for Bug type, NOT customfield_10521 (select)
  // The Bug issue type has Business Impact as a text field
  BUSINESS_IMPACT: {
    id: 'customfield_10383',
    type: 'string' as FieldType,
  },
  VERSION: {
    id: 'customfield_10382',
    type: 'string' as FieldType,
  },
  COUNTRY: {
    id: 'customfield_10453',
    type: 'array-option' as FieldType,
  },
  REGION: {
    id: 'customfield_10454',
    type: 'string' as FieldType,
  },

  // ── Additional Info ──
  ADDITIONAL_INFO: {
    id: 'customfield_10456',
    type: 'string' as FieldType,
  },

  // ── Squad (required field) ──
  SQUAD: {
    id: 'customfield_10513',
    type: 'option' as FieldType,
  },
};

// ════════════════════════════════════════════════════════════════
// LEGACY EXPORTS (for backward compatibility)
// ════════════════════════════════════════════════════════════════

/** Squad field ID (required in CMB project) */
export const SQUAD_FIELD_ID = JIRA_FIELDS.SQUAD.id;

/** Default squad value */
export const DEFAULT_SQUAD = 'B2B & B2C WebApp';

/** Default components */
export const DEFAULT_COMPONENTS: string[] = ['B2B', 'B2C WebApp'];

// ════════════════════════════════════════════════════════════════
// XRAY CUSTOM FIELDS (for Test issues)
// ════════════════════════════════════════════════════════════════

export const XRAY_CUSTOM_FIELDS = {
  precondition: null as string | null,
  testSteps: null as string | null,
  expectedResults: null as string | null,
  testType: null as string | null,
};

// ════════════════════════════════════════════════════════════════
// PLATFORM VALUE MAPPING
// ════════════════════════════════════════════════════════════════

/**
 * Map our platform names to Jira's allowed Platform field values.
 *
 * Jira allowed values (customfield_10368): Android, iOS, Web
 * Our UI uses: WebApp, Mobile iOS, Mobile Android, API, Super App
 */
export const PLATFORM_VALUE_MAP: Record<string, string> = {
  // Map our names to Jira's allowed values
  'WebApp': 'Web',
  'Mobile iOS': 'iOS',
  'Mobile Android': 'Android',
  'API': 'Web',           // Fallback to Web for API
  'Super App': 'Android', // Fallback to Android for Super App
  // Direct mappings (in case already correct)
  'Web': 'Web',
  'iOS': 'iOS',
  'Android': 'Android',
};

/**
 * Get the Jira-compatible platform value.
 * Returns 'Web' as default if no mapping found.
 */
export function getJiraPlatformValue(platform: string): string {
  return PLATFORM_VALUE_MAP[platform] || 'Web';
}

// ════════════════════════════════════════════════════════════════
// PRIORITY MAPPING
// ════════════════════════════════════════════════════════════════

export const PRIORITY_MAP: Record<string, string> = {
  // From UI severity buttons
  critical: 'P0 - Critical',
  high: 'P1 - High',
  medium: 'P2 - Medium',
  low: 'P3 - Low',
  // Direct P-level keys
  p0: 'P0 - Critical',
  p1: 'P1 - High',
  p2: 'P2 - Medium',
  p3: 'P3 - Low',
  // Fallbacks for old-style names
  highest: 'P0 - Critical',
  // Default if nothing matches
  none: 'No Priority',
};

/**
 * Get Jira priority name from internal priority.
 */
export function getJiraPriority(priority: string): string {
  return PRIORITY_MAP[priority.toLowerCase()] || 'P2 - Medium';
}

// ════════════════════════════════════════════════════════════════
// LABELS CONFIGURATION
// ════════════════════════════════════════════════════════════════

export const DEFAULT_TEST_LABELS = ['qa-ai-agent', 'automated-test'];
export const REGRESSION_LABELS = ['regression-testing'];

export const TYPE_LABELS: Record<string, string> = {
  functional: 'functional-test',
  'edge-case': 'edge-case-test',
  negative: 'negative-test',
  'ui-ux': 'ui-ux-test',
  performance: 'performance-test',
  security: 'security-test',
  accessibility: 'a11y-test',
};

/**
 * Get all labels for a test case.
 */
export function getTestLabels(testType: string, additionalLabels: string[] = []): string[] {
  const labels = [...DEFAULT_TEST_LABELS];

  const typeLabel = TYPE_LABELS[testType];
  if (typeLabel) {
    labels.push(typeLabel);
  }

  labels.push(...additionalLabels);

  return [...new Set(labels)]; // Deduplicate
}

// ════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Get a field ID by key name.
 */
export function getFieldId(key: keyof typeof JIRA_FIELDS): string {
  return JIRA_FIELDS[key].id;
}

/**
 * Get a field type by key name.
 */
export function getFieldType(key: keyof typeof JIRA_FIELDS): FieldType {
  return JIRA_FIELDS[key].type;
}

// ════════════════════════════════════════════════════════════════
// CONFIGURATION INTERFACE (for getJiraFieldsConfig)
// ════════════════════════════════════════════════════════════════

export interface JiraFieldsConfig {
  projectKey: string;
  xrayProjectKey: string;
  testIssueType: string;
  testLinkType: string;
  fallbackLinkType: string;
  priorityMap: Record<string, string>;
  defaultLabels: string[];
  customFields: typeof XRAY_CUSTOM_FIELDS;
}

/**
 * Get the complete Jira fields configuration.
 */
export function getJiraFieldsConfig(): JiraFieldsConfig {
  return {
    projectKey: PROJECT_KEY,
    xrayProjectKey: XRAY_PROJECT_KEY,
    testIssueType: TEST_ISSUE_TYPE,
    testLinkType: TEST_LINK_TYPE,
    fallbackLinkType: FALLBACK_LINK_TYPE,
    priorityMap: PRIORITY_MAP,
    defaultLabels: DEFAULT_TEST_LABELS,
    customFields: XRAY_CUSTOM_FIELDS,
  };
}
