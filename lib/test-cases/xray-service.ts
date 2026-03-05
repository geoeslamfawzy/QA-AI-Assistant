/**
 * XRAY Test Service
 *
 * Creates Test issues in Jira for XRAY integration.
 * Handles deduplication, creation, and linking to parent stories.
 */

import {
  createTestIssue,
  linkIssues,
  findIssueByExactSummary,
  isJiraConfigured,
  getJiraConfig,
  XRAY_PROJECT_KEY,
  TEST_LINK_TYPE,
} from '@/lib/jira';

import { formatTestCaseForJira } from './formatter';
import type { BDDTestCase, TestCasePushResult, PushTestCasesResponse, PushSummary } from './types';

// ────────────────────────────────────
// TYPES
// ────────────────────────────────────

interface PushOptions {
  testCases: BDDTestCase[];
  parentStoryKey?: string;
  projectKey?: string;
}

// ────────────────────────────────────
// MAIN PUSH FUNCTION
// ────────────────────────────────────

/**
 * Push test cases to Jira as Test issues.
 *
 * Process for each test case:
 * 1. Check if a Test with the same summary already exists (deduplication)
 * 2. If exists → skip, add to "skipped" results
 * 3. If not exists → create Test issue in Jira
 * 4. Link the new Test to the parent Story
 *
 * @param options - Push configuration
 * @returns Detailed results for each test case
 * @throws Error if Jira is not configured
 */
export async function pushTestCasesToJira(options: PushOptions): Promise<PushTestCasesResponse> {
  const { testCases, parentStoryKey, projectKey } = options;

  // Throw error if Jira is not configured - NO mock fallback
  if (!isJiraConfigured()) {
    throw new Error(
      'Jira is not configured. Add JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN to .env.local and restart the dev server.'
    );
  }

  const config = getJiraConfig();
  const project = projectKey || XRAY_PROJECT_KEY || config?.projectKey || 'CMB';
  const results: TestCasePushResult[] = [];

  console.log(`[XRAY Service] Starting push of ${testCases.length} test cases to project ${project}`);

  for (const testCase of testCases) {
    try {
      // Step 1: Deduplication check
      console.log(`[XRAY Service] Checking for existing: "${testCase.title}"`);
      const existing = await findIssueByExactSummary({
        summary: testCase.title,
        projectKey: project,
        issueType: 'Test',
      });

      if (existing) {
        console.log(`[XRAY Service] Found existing: ${existing.key}`);
        results.push({
          testCaseId: testCase.id,
          title: testCase.title,
          status: 'skipped',
          jiraKey: existing.key,
          jiraUrl: existing.url,
          reason: `Test case already exists as ${existing.key}`,
        });
        continue;
      }

      // Step 2: Format description in BDD format
      const description = formatTestCaseForJira(testCase);

      // Step 3: Create Test issue
      console.log(`[XRAY Service] Creating Test issue: "${testCase.title}"`);
      const created = await createTestIssue({
        summary: testCase.title,
        description,
        priority: testCase.priority,
        testType: testCase.type,
        labels: [testCase.type],
        projectKey: project,
      });

      console.log(`[XRAY Service] Created: ${created.ticketId}`);

      // Step 4: Link to parent story if provided
      let linkedTo: string | undefined;
      if (parentStoryKey) {
        try {
          console.log(`[XRAY Service] Linking ${created.ticketId} to ${parentStoryKey}`);
          await linkIssues({
            inwardKey: created.ticketId,
            outwardKey: parentStoryKey,
            linkType: TEST_LINK_TYPE,
          });
          linkedTo = parentStoryKey;
        } catch (linkError) {
          console.warn(
            `[XRAY Service] Failed to link ${created.ticketId} to ${parentStoryKey}:`,
            linkError
          );
          // Continue - the test was created, linking is non-critical
        }
      }

      results.push({
        testCaseId: testCase.id,
        title: testCase.title,
        status: 'created',
        jiraKey: created.ticketId,
        jiraUrl: created.url,
        linkedTo,
      });

      // Rate limiting: small delay between API calls
      await new Promise((r) => setTimeout(r, 250));
    } catch (error) {
      console.error(`[XRAY Service] Failed to create "${testCase.title}":`, error);
      results.push({
        testCaseId: testCase.id,
        title: testCase.title,
        status: 'failed',
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Calculate summary
  const summary: PushSummary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    failed: results.filter((r) => r.status === 'failed').length,
  };

  console.log(
    `[XRAY Service] Push complete: ${summary.created} created, ${summary.skipped} skipped, ${summary.failed} failed`
  );

  return {
    success: summary.failed === 0,
    results,
    summary,
    parentStoryKey,
    _isMock: false,
  };
}

// ────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────

/**
 * Check if Jira is configured and return status.
 */
export function checkJiraStatus(): {
  configured: boolean;
  projectKey: string;
  message: string;
} {
  if (!isJiraConfigured()) {
    return {
      configured: false,
      projectKey: 'N/A',
      message:
        'Jira is not configured. Add JIRA_EMAIL and JIRA_API_TOKEN to .env.local to enable pushing test cases.',
    };
  }

  const config = getJiraConfig();
  return {
    configured: true,
    projectKey: config?.projectKey || 'CMB',
    message: 'Jira is configured and ready.',
  };
}

/**
 * Validate test cases before pushing.
 */
export function validateTestCases(testCases: BDDTestCase[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!testCases || testCases.length === 0) {
    errors.push('No test cases provided');
    return { valid: false, errors };
  }

  testCases.forEach((tc, index) => {
    if (!tc.title || tc.title.trim().length < 5) {
      errors.push(`Test case ${index + 1}: Title is too short or missing`);
    }

    if (!tc.given?.length && !tc.preconditions?.length) {
      errors.push(`Test case "${tc.title}": No preconditions (Given) provided`);
    }

    if (!tc.when?.length && !tc.steps?.length) {
      errors.push(`Test case "${tc.title}": No steps (When) provided`);
    }

    if (!tc.then?.length && !tc.expectedResult) {
      errors.push(`Test case "${tc.title}": No expected results (Then) provided`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
