/**
 * POST /api/module-explorer/fetch
 *
 * Fetches all tickets matching a JQL query with full details.
 * Uses background processing with progress tracking.
 *
 * Body: { jql: "project = CMB AND ...", name: "Invoice Module" }
 * Returns: { success, status: 'started', totalTickets: N }
 *
 * Poll /api/module-explorer/progress for status updates.
 * Get results from /api/module-explorer/results when completed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchJiraIssues, fetchJiraTicket, isJiraConfigured } from '@/lib/jira/client';
import {
  startFetchProgress,
  updateFetchProgress,
  completeFetchProgress,
  failProgress,
  resetModuleExplorerProgress,
  addFetchedTicket,
  resetFetchedTickets,
  type ModuleExplorerTicket,
} from '@/lib/module-explorer/progress';

export async function POST(request: NextRequest) {
  try {
    const { jql, name } = await request.json();

    if (!jql || typeof jql !== 'string') {
      return NextResponse.json(
        { success: false, error: 'JQL query is required' },
        { status: 400 }
      );
    }

    if (!isJiraConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Jira is not configured. Add JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN to .env.local',
          _isMock: true,
        },
        { status: 503 }
      );
    }

    // Reset progress and ticket store
    resetModuleExplorerProgress();
    resetFetchedTickets();

    // Step 1: Search to get ticket keys (this is fast, we can await)
    console.log(`[Module Explorer] Executing JQL: ${jql.substring(0, 100)}...`);

    const searchResults = await searchJiraIssues(jql, {
      fields: ['summary', 'created'],
      maxResults: 100,
    });

    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json({
        success: true,
        status: 'completed',
        totalTickets: 0,
        query: jql,
        name: name || 'Custom Query',
      });
    }

    console.log(`[Module Explorer] Found ${searchResults.length} tickets. Starting background fetch...`);
    startFetchProgress(searchResults.length);

    // Step 2: Fetch full details in background (don't await)
    Promise.resolve().then(async () => {
      for (let i = 0; i < searchResults.length; i++) {
        const issue = searchResults[i];
        const ticketKey = issue.ticketId;

        try {
          updateFetchProgress(i + 1, ticketKey, issue.title);

          // Fetch full ticket details
          const fullTicket = await fetchJiraTicket(ticketKey);

          if (fullTicket) {
            const ticket: ModuleExplorerTicket = {
              key: fullTicket.ticketId,
              title: fullTicket.title,
              type: fullTicket.type,
              status: fullTicket.status,
              module: fullTicket.module,
              description: fullTicket.userStory || '',
              acceptanceCriteria: fullTicket.acceptanceCriteria || [],
              labels: fullTicket.labels || [],
              components: fullTicket.components || [],
              priority: fullTicket.priority,
              sprint: fullTicket.sprint || '',
              assignee: fullTicket.assignee || '',
              created: fullTicket.created,
              updated: fullTicket.updated,
              figmaLinks: fullTicket.figmaLinks || [],
            };
            addFetchedTicket(ticket);
          }

          // Rate limiting: 200ms between requests
          if (i < searchResults.length - 1) {
            await new Promise((r) => setTimeout(r, 200));
          }
        } catch (err: unknown) {
          const error = err as Error;
          console.warn(`[Module Explorer] Failed to fetch ${ticketKey}: ${error.message}`);
          // Continue with other tickets
        }
      }

      completeFetchProgress();
      console.log(`[Module Explorer] Background fetch completed.`);
    }).catch((err) => {
      console.error('[Module Explorer] Background fetch failed:', err);
      failProgress(err.message || 'Background fetch failed');
    });

    // Return immediately with started status
    return NextResponse.json({
      success: true,
      status: 'started',
      totalTickets: searchResults.length,
      query: jql,
      name: name || 'Custom Query',
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Module Explorer Fetch Error]', err);
    failProgress(err.message);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch tickets',
      },
      { status: 500 }
    );
  }
}
