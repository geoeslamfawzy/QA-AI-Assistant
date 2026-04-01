import { NextRequest, NextResponse } from 'next/server';
import { isJiraConfigured } from '@/lib/jira';
import { createStoryDefect, type Priority } from '@/lib/jira/issue-creators/story-defect';

/**
 * POST /api/jira/create-story-defect
 *
 * Create a Story Defect (sub-task) in Jira.
 * This is a sub-task that MUST be attached to a parent story.
 * Summary: Clean title only, NO prefix.
 * Labels: NONE.
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

    // Parent story key is REQUIRED for Story Defects
    if (!body.parentStoryKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'parentStoryKey is REQUIRED for Story Defects. This is a sub-task that must be attached to a user story.',
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

    const result = await createStoryDefect({
      title: body.title,
      parentStoryKey: body.parentStoryKey,
      description: body.description,
      stepsToReproduce: body.stepsToReproduce || body.steps,
      expectedBehavior: body.expectedBehavior || body.expected,
      actualBehavior: body.actualBehavior || body.actual,
      priority,
      module: body.module,
      environment: body.environment,
      preconditions: body.preconditions,
    });

    return NextResponse.json({
      success: true,
      issueKey: result.issueKey,
      url: result.url,
      type: 'Story Defect',
      parentKey: body.parentStoryKey,
      _isMock: false,
    });
  } catch (error: unknown) {
    console.error('[Create Story Defect Error]', error);

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
