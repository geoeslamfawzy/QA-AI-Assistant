import { NextRequest, NextResponse } from 'next/server';
import { isJiraConfigured } from '@/lib/jira';
import {
  createRegressionDefect,
  type Environment,
  type Platform,
  type Priority,
} from '@/lib/jira/issue-creators/regression-defect';

/**
 * POST /api/jira/create-defect
 *
 * Create a Regression Defect in Jira.
 * Summary format: Regression - {ENV} - {Platform} - {Title}
 * Labels: Must include 'regression-testing'
 *
 * NOTE: This route does NOT accept a parentStoryKey.
 * Regression Defects are standalone issues.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'title is required' },
        { status: 400 }
      );
    }

    if (!body.description) {
      return NextResponse.json(
        { success: false, error: 'description is required' },
        { status: 400 }
      );
    }

    // Reject if parent story key is provided
    if (body.parentStoryKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Regression Defects cannot have a parent story. Use /api/jira/create-story-defect for defects attached to a story.',
        },
        { status: 400 }
      );
    }

    // Check if Jira is configured
    if (!isJiraConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Jira is not configured. Check .env.local has JIRA_EMAIL and JIRA_API_TOKEN with real values.',
          _isMock: true,
          debug: 'Visit /api/jira/debug to check env var status',
        },
        { status: 503 }
      );
    }

    // Map environment values
    const envMap: Record<string, Environment> = {
      preprod: 'preprod',
      'pre-prod': 'preprod',
      staging: 'staging',
      uat: 'UAT',
    };

    const rawEnv = (body.environment || 'preprod').toLowerCase();
    const environment: Environment = envMap[rawEnv] || 'preprod';

    // Map platform values
    const platformMap: Record<string, Platform> = {
      webapp: 'WebApp',
      web: 'WebApp',
      'mobile ios': 'Mobile iOS',
      ios: 'Mobile iOS',
      'mobile android': 'Mobile Android',
      android: 'Mobile Android',
      api: 'API',
      'super app': 'Super App',
      superapp: 'Super App',
    };

    const rawPlatform = (body.platform || 'WebApp').toLowerCase();
    const platform: Platform = platformMap[rawPlatform] || 'WebApp';

    // Map priority values to internal Priority type
    const priorityMap: Record<string, Priority> = {
      critical: 'critical',
      highest: 'critical',
      high: 'high',
      medium: 'medium',
      low: 'low',
      // P-level mappings
      p0: 'critical',
      p1: 'high',
      p2: 'medium',
      p3: 'low',
      // Handle full Jira priority names
      'p0 - critical': 'critical',
      'p1 - high': 'high',
      'p2 - medium': 'medium',
      'p3 - low': 'low',
    };

    const rawPriority = (body.priority || body.severity || 'medium').toLowerCase();
    const priority: Priority = priorityMap[rawPriority] || 'medium';

    const result = await createRegressionDefect({
      title: body.title,
      description: body.description,
      stepsToReproduce: body.stepsToReproduce || body.steps,
      expectedBehavior: body.expectedBehavior || body.expected,
      actualBehavior: body.actualBehavior || body.actual,
      environment,
      platform,
      priority,
      module: body.module,
      extraLabels: body.labels,
      preconditions: body.preconditions,
    });

    return NextResponse.json({
      success: true,
      issueKey: result.issueKey,
      url: result.url,
      type: 'Defect',
      labels: ['regression-testing', ...(body.labels || [])],
      _isMock: false,
    });
  } catch (error: unknown) {
    console.error('[Create Defect Error]', error);

    const message = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: message,
        _isMock: false,
      },
      { status: 500 }
    );
  }
}
