import { NextRequest, NextResponse } from 'next/server';
import { isJiraConfigured } from '@/lib/jira';
import { createProductionBug, type Platform, type Priority } from '@/lib/jira/issue-creators/production-bug';

/**
 * POST /api/jira/create-bug
 *
 * Create a Production Bug in Jira.
 * Summary format: [ALG] - {Platform} - PROD : {Title}
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title && !body.summary) {
      return NextResponse.json(
        { success: false, error: 'title is required' },
        { status: 400 }
      );
    }

    if (!body.description && !body.formattedReport) {
      return NextResponse.json(
        { success: false, error: 'description is required' },
        { status: 400 }
      );
    }

    // Check if Jira is configured
    if (!isJiraConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Jira is not configured. Check .env.local has JIRA_EMAIL and JIRA_API_TOKEN with real values. Then restart the dev server.',
          _isMock: true,
          debug: 'Visit /api/jira/debug to check env var status',
        },
        { status: 503 }
      );
    }

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

    const result = await createProductionBug({
      title: body.title || body.summary,
      description: body.description || body.formattedReport,
      stepsToReproduce: body.stepsToReproduce || body.steps,
      expectedBehavior: body.expectedBehavior || body.expected,
      actualBehavior: body.actualBehavior || body.actual,
      platform,
      priority,
      environment: body.environment,
      labels: body.labels,
      module: body.module,
    });

    return NextResponse.json({
      success: true,
      issueKey: result.issueKey,
      ticketId: result.issueKey, // Backward compatibility
      url: result.url,
      ticketUrl: result.url, // Backward compatibility
      type: 'Bug',
      _isMock: false,
    });
  } catch (error: unknown) {
    console.error('[Create Bug Error]', error);

    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    const status = (error as any)?.status === 401 ? 401 : 500;

    return NextResponse.json(
      {
        success: false,
        error: status === 401
          ? 'Jira authentication failed. Your API token may have expired.'
          : message,
        _isMock: false,
      },
      { status }
    );
  }
}
