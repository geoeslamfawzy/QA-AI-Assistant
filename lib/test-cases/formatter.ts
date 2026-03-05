/**
 * BDD Test Case Formatter
 *
 * Formats test cases in BDD (Given/When/Then) format for Jira descriptions.
 * Uses Jira wiki markup syntax for proper rendering.
 */

import type { BDDTestCase, TestCaseType } from './types';

// ────────────────────────────────────
// TYPE LABELS
// ────────────────────────────────────

const TYPE_LABELS: Record<TestCaseType, string> = {
  functional: 'Functional',
  'edge-case': 'Edge Case',
  negative: 'Negative',
  'ui-ux': 'UI/UX',
  performance: 'Performance',
  security: 'Security',
  accessibility: 'Accessibility',
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: 'P0 - Critical',
  high: 'P1 - High',
  medium: 'P2 - Medium',
  low: 'P3 - Low',
};

// ────────────────────────────────────
// MAIN FORMATTER
// ────────────────────────────────────

/**
 * Format a BDD test case as a Jira-compatible description.
 * Uses Jira wiki markup for proper rendering.
 */
export function formatTestCaseForJira(testCase: BDDTestCase): string {
  const sections: string[] = [];

  // Note: Type and Priority are NOT included here because they are already
  // shown as Jira issue fields (labels, priority field). No need to duplicate.

  // Given section (preconditions)
  const given = testCase.given.length > 0 ? testCase.given : testCase.preconditions;
  if (given.length > 0) {
    sections.push('h3. Given');
    given.forEach((condition) => {
      sections.push(`- ${condition}`);
    });
    sections.push('');
  }

  // When section (actions/steps)
  const when = testCase.when.length > 0 ? testCase.when : testCase.steps;
  if (when.length > 0) {
    sections.push('h3. When');
    when.forEach((action, index) => {
      sections.push(`# ${action}`);
    });
    sections.push('');
  }

  // Then section (expected results)
  const then =
    testCase.then.length > 0
      ? testCase.then
      : testCase.expectedResult
        ? [testCase.expectedResult]
        : [];
  if (then.length > 0) {
    sections.push('h3. Then');
    then.forEach((expectation) => {
      sections.push(`- ${expectation}`);
    });
  }

  return sections.join('\n');
}

/**
 * Format a BDD test case as plain text (for display in UI).
 */
export function formatTestCaseAsText(testCase: BDDTestCase): string {
  const sections: string[] = [];

  // Given section
  const given = testCase.given.length > 0 ? testCase.given : testCase.preconditions;
  if (given.length > 0) {
    sections.push('**Given:**');
    given.forEach((condition) => {
      sections.push(`  - ${condition}`);
      
    });
  }

  // When section
  const when = testCase.when.length > 0 ? testCase.when : testCase.steps;
  if (when.length > 0) {
    sections.push('**When:**');
    when.forEach((action, index) => {
      sections.push(`  ${index + 1}. ${action}`);
    });
  }

  // Then section
  const then =
    testCase.then.length > 0
      ? testCase.then
      : testCase.expectedResult
        ? [testCase.expectedResult]
        : [];
  if (then.length > 0) {
    sections.push('**Then:**');
    then.forEach((expectation) => {
      sections.push(`  - ${expectation}`);
    });
  }

  return sections.join('\n');
}

// ────────────────────────────────────
// LEGACY FORMAT CONVERSION
// ────────────────────────────────────

/**
 * Convert legacy format (preconditions/steps/expectedResult) to BDD format.
 */
export function convertToBDDFormat(testCase: {
  preconditions: string[];
  steps: string[];
  expectedResult: string;
}): { given: string[]; when: string[]; then: string[] } {
  return {
    given: testCase.preconditions,
    when: testCase.steps,
    then: testCase.expectedResult ? [testCase.expectedResult] : [],
  };
}

/**
 * Ensure a test case has BDD fields populated.
 * If BDD fields are empty, populate them from legacy fields.
 */
export function ensureBDDFields(testCase: Partial<BDDTestCase>): BDDTestCase {
  const given =
    testCase.given && testCase.given.length > 0
      ? testCase.given
      : testCase.preconditions || [];

  const when =
    testCase.when && testCase.when.length > 0 ? testCase.when : testCase.steps || [];

  const then =
    testCase.then && testCase.then.length > 0
      ? testCase.then
      : testCase.expectedResult
        ? [testCase.expectedResult]
        : [];

  return {
    id: testCase.id || `TC-${Date.now()}`,
    title: testCase.title || 'Untitled Test Case',
    type: testCase.type || 'functional',
    priority: testCase.priority || 'medium',
    given,
    when,
    then,
    preconditions: given,
    steps: when,
    expectedResult: then.join('; '),
  };
}

// ────────────────────────────────────
// TITLE VALIDATION
// ────────────────────────────────────

/**
 * Validates that a test case title follows the required format.
 * Must start with Verify, Validate, or Test.
 */
export function validateTestCaseTitle(title: string): {
  valid: boolean;
  suggestion?: string;
} {
  const trimmed = title.trim();
  const startsCorrectly = /^(Verify|Validate|Test)\b/i.test(trimmed);

  if (startsCorrectly) {
    return { valid: true };
  }

  // Generate a suggestion
  // Try to create a sensible prefix based on the title content
  const lowerTitle = trimmed.toLowerCase();

  if (
    lowerTitle.includes('check') ||
    lowerTitle.includes('ensure') ||
    lowerTitle.includes('confirm')
  ) {
    return {
      valid: false,
      suggestion: `Verify ${trimmed.replace(/^(check|ensure|confirm)\s*/i, '')}`,
    };
  }

  // Default suggestion
  return {
    valid: false,
    suggestion: `Verify ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`,
  };
}

/**
 * Auto-fix a test case title to start with Verify/Validate/Test.
 */
export function fixTestCaseTitle(title: string): string {
  const validation = validateTestCaseTitle(title);
  return validation.valid ? title : validation.suggestion || title;
}
