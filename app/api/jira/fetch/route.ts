import { NextRequest, NextResponse } from 'next/server';
import { fetchJiraTicket, isJiraConfigured, JiraAPIError } from '@/lib/jira';

export async function POST(request: NextRequest) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId || typeof ticketId !== 'string') {
      return NextResponse.json({ success: false, error: 'ticketId is required' }, { status: 400 });
    }

    const clean = ticketId.trim().toUpperCase();

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
      const ticket = await fetchJiraTicket(clean);

      if (!ticket) {
        return NextResponse.json(
          {
            success: false,
            error: `Ticket "${clean}" could not be fetched. It may not exist or there was an issue with the Jira API.`,
            _isMock: false,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        ticket,
        _isMock: false,
      });
    } catch (error) {
      console.error('[Jira Fetch Error]', error);

      // Handle specific Jira API errors
      if (error instanceof JiraAPIError) {
        if (error.status === 404) {
          return NextResponse.json(
            {
              success: false,
              error: `Ticket "${clean}" not found in Jira. Make sure it exists.`,
              _isMock: false,
            },
            { status: 404 }
          );
        }
        if (error.status === 401) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Jira authentication failed. Check JIRA_EMAIL and JIRA_API_TOKEN in .env.local',
              _isMock: false,
            },
            { status: 401 }
          );
        }
        if (error.status === 403) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Jira access denied. Your account may not have permission to view this ticket.',
              _isMock: false,
            },
            { status: 403 }
          );
        }
      }

      // For other errors, return the actual error - DO NOT fall through to mock
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch ticket from Jira',
          _isMock: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Jira Fetch Route Error]', error);
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
