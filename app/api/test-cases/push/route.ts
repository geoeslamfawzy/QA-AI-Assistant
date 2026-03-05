import { NextRequest, NextResponse } from 'next/server';
import { pushTestCasesToJira, validateTestCases } from '@/lib/test-cases/xray-service';
import type { BDDTestCase } from '@/lib/test-cases/types';

/**
 * POST /api/test-cases/push
 *
 * Push selected test cases to Jira as Test issues.
 *
 * Request body:
 * {
 *   testCases: BDDTestCase[],
 *   parentStoryKey?: string,
 *   projectKey?: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   results: TestCasePushResult[],
 *   summary: { total, created, skipped, failed },
 *   parentStoryKey?: string,
 *   _isMock: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testCases, parentStoryKey, projectKey } = body as {
      testCases: BDDTestCase[];
      parentStoryKey?: string;
      projectKey?: string;
    };

    // Validate required fields
    if (!testCases) {
      return NextResponse.json(
        {
          success: false,
          error: 'testCases array is required',
          results: [],
          summary: { total: 0, created: 0, skipped: 0, failed: 0 },
          _isMock: false,
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(testCases)) {
      return NextResponse.json(
        {
          success: false,
          error: 'testCases must be an array',
          results: [],
          summary: { total: 0, created: 0, skipped: 0, failed: 0 },
          _isMock: false,
        },
        { status: 400 }
      );
    }

    if (testCases.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'testCases array must not be empty',
          results: [],
          summary: { total: 0, created: 0, skipped: 0, failed: 0 },
          _isMock: false,
        },
        { status: 400 }
      );
    }

    // Validate test case structure
    const validation = validateTestCases(testCases);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${validation.errors.join('; ')}`,
          results: [],
          summary: { total: 0, created: 0, skipped: 0, failed: 0 },
          _isMock: false,
        },
        { status: 400 }
      );
    }

    // Push to Jira
    const result = await pushTestCasesToJira({
      testCases,
      parentStoryKey,
      projectKey,
    });

    // Determine HTTP status code based on results
    // 200 = all successful
    // 207 = partial success (Multi-Status)
    // 500 = all failed
    let httpStatus = 200;
    if (result.summary.failed > 0 && result.summary.created > 0) {
      httpStatus = 207; // Multi-Status (partial success)
    } else if (result.summary.failed > 0 && result.summary.created === 0) {
      httpStatus = 500; // All failed
    }

    return NextResponse.json(result, { status: httpStatus });
  } catch (error) {
    console.error('[Test Cases Push API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isConfigError = errorMessage.includes('not configured');

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        results: [],
        summary: { total: 0, created: 0, skipped: 0, failed: 0 },
        _isMock: isConfigError,
        debug: isConfigError ? 'Visit /api/jira/debug to check env var status' : undefined,
      },
      { status: isConfigError ? 503 : 500 }
    );
  }
}

/**
 * GET /api/test-cases/push
 *
 * Returns information about the push endpoint and Jira status.
 */
export async function GET() {
  const { checkJiraStatus } = await import('@/lib/test-cases/xray-service');
  const status = checkJiraStatus();

  return NextResponse.json({
    endpoint: '/api/test-cases/push',
    method: 'POST',
    jira: status,
    requestFormat: {
      testCases: 'BDDTestCase[] - Required',
      parentStoryKey: 'string - Optional, Jira issue key to link tests to',
      projectKey: 'string - Optional, defaults to JIRA_PROJECT_KEY env var',
    },
    responseFormat: {
      success: 'boolean',
      results: 'TestCasePushResult[]',
      summary: '{ total, created, skipped, failed }',
      parentStoryKey: 'string | undefined',
      _isMock: 'boolean - true if Jira is not configured',
    },
  });
}
