/**
 * Jira Cloud Integration Module
 *
 * Provides functions for interacting with Jira Cloud REST API v3.
 * Includes authentication, ticket fetching, comment posting, bug creation,
 * and Test issue creation for XRAY integration.
 */

export {
  // Configuration
  getJiraConfig,
  isJiraConfigured,

  // Core API functions
  fetchJiraTicket,
  postJiraComment,
  postJiraComments,
  createJiraBug,
  testJiraConnection,

  // Test issue functions (XRAY)
  createTestIssue,
  linkIssues,
  findIssueByExactSummary,
  textToADF,

  // Generic issue creation
  createJiraIssue,

  // HTTP helpers (for advanced usage)
  jiraGet,
  jiraPost,

  // Utilities
  adfToText,
  extractAcceptanceCriteria,
  extractFigmaLinks,
  detectModule,
  extractSprint,

  // Error class
  JiraAPIError,
} from './client';

// Re-export types
export type { JiraConfig, JiraTicket, JiraComment } from './client';

// Re-export field configuration
export {
  PROJECT_KEY,
  XRAY_PROJECT_KEY,
  TEST_ISSUE_TYPE,
  TEST_LINK_TYPE,
  PRIORITY_MAP,
  DEFAULT_TEST_LABELS,
  getJiraPriority,
  getTestLabels,
  getJiraFieldsConfig,
} from './fields-config';

export type { JiraFieldsConfig } from './fields-config';

// Issue creators for different defect types
export { createProductionBug } from './issue-creators/production-bug';
export type { ProductionBugParams, Platform as BugPlatform } from './issue-creators/production-bug';

export { createRegressionDefect } from './issue-creators/regression-defect';
export type {
  RegressionDefectParams,
  Environment as DefectEnvironment,
} from './issue-creators/regression-defect';

export { createStoryDefect } from './issue-creators/story-defect';
export type { StoryDefectParams } from './issue-creators/story-defect';
