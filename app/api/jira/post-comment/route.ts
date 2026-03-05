import { NextRequest, NextResponse } from 'next/server';
import { postJiraComments, isJiraConfigured, getJiraConfig } from '@/lib/jira';

interface Finding {
  title: string;
  description?: string;
  body?: string;
  type?: string;
  severity?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, findings, comments } = body;

    // Support both old format (findings) and new format (comments)
    const items: Finding[] = comments || findings;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one finding/comment is required' },
        { status: 400 }
      );
    }

    // Check if Jira is configured - return 503 if not
    if (!isJiraConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Jira is not configured. Check .env.local has JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN with real values. Then restart the dev server.',
          _isMock: true,
          debug: 'Visit /api/jira/debug to check env var status',
        },
        { status: 503 }
      );
    }

    // Call real Jira - NO mock fallback
    try {
      // Convert findings to comment format
      const formattedComments = items.map((f) => ({
        title: f.title || 'Finding',
        body: f.body || f.description || '',
        type: f.type || f.severity || 'INFO',
      }));

      const result = await postJiraComments(ticketId, formattedComments);
      const config = getJiraConfig();

      return NextResponse.json({
        success: result.success,
        commentId: `batch-${Date.now()}`,
        postedCount: result.postedCount,
        errors: result.errors,
        message: result.success
          ? `Successfully posted ${result.postedCount} findings to ${ticketId}`
          : `Posted ${result.postedCount} findings with ${result.errors.length} errors`,
        ticketUrl: `https://${config?.domain}/browse/${ticketId}`,
        _isMock: false,
      });
    } catch (error) {
      console.error('[Jira Post Comment Error]', error);

      // Return the actual error - DO NOT fall through to mock
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to post comments to Jira',
          _isMock: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Jira Post Comment Route Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        _isMock: false,
      },
      { status: 500 }
    );
  }
}
