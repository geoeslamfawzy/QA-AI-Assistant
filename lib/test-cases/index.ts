/**
 * Test Cases Module
 *
 * Provides types, formatters, and services for test case generation
 * and Jira/XRAY integration.
 */

// Types
export type {
  TestCasePriority,
  TestCaseType,
  BDDTestCase,
  SelectableTestCase,
  PushStatus,
  TestCasePushResult,
  PushSummary,
  PushTestCasesResponse,
  PushTestCasesRequest,
  CoverageSummary,
  ParseTestCasesResponse,
} from './types';

// Formatter functions
export {
  formatTestCaseForJira,
  formatTestCaseAsText,
  convertToBDDFormat,
  ensureBDDFields,
  validateTestCaseTitle,
  fixTestCaseTitle,
} from './formatter';

// XRAY Service
export {
  pushTestCasesToJira,
  checkJiraStatus,
  validateTestCases,
} from './xray-service';
