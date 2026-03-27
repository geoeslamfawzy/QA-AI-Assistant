/**
 * POST /api/chatbot/search-jira — Search Jira for info not in KB
 * GET  /api/chatbot/search-jira — Poll progress
 *
 * Body: { question: string, mode: "gemini"|"claude-cli", model?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  searchJiraIssues,
  fetchJiraTicket,
  isJiraConfigured,
  type JiraTicket,
} from '@/lib/jira/client';
import { callGemini, isGeminiConfigured } from '@/lib/ai/gemini-client';
import {
  callClaudeCli,
  isClaudeCliAvailable,
  resetClaudeCliProgress,
  type ClaudeModel,
} from '@/lib/ai/claude-cli-client';

export const dynamic = 'force-dynamic';

// In-memory progress tracker
let searchProgress = {
  status: 'idle' as
    | 'idle'
    | 'searching'
    | 'fetching'
    | 'analyzing'
    | 'completed'
    | 'failed',
  phase: '',
  totalTickets: 0,
  fetchedTickets: 0,
  currentTicket: '',
  answer: null as string | null,
  ticketRefs: [] as { key: string; title: string; url: string }[],
  error: null as string | null,
};

function resetProgress() {
  searchProgress = {
    status: 'idle',
    phase: '',
    totalTickets: 0,
    fetchedTickets: 0,
    currentTicket: '',
    answer: null,
    ticketRefs: [],
    error: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question, mode, model } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!isJiraConfigured()) {
      return NextResponse.json(
        { error: 'Jira not configured' },
        { status: 503 }
      );
    }

    resetProgress();
    searchProgress.status = 'searching';
    searchProgress.phase = 'Building search queries...';

    // Run in background
    performJiraSearch(question, mode || 'claude-cli', model).catch((err) => {
      searchProgress.status = 'failed';
      searchProgress.error = err.message;
    });

    return NextResponse.json({
      success: true,
      message:
        'Jira search started. Poll GET /api/chatbot/search-jira for progress.',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(searchProgress);
}

// ────────────────────────────────────
// SEARCH LOGIC
// ────────────────────────────────────

async function performJiraSearch(
  question: string,
  mode: string,
  model?: string
) {
  const domain = process.env.JIRA_DOMAIN;

  // Step 1: Extract keywords
  searchProgress.phase = 'Extracting keywords...';
  const keywords = extractKeywords(question);
  console.log(`[Chatbot Search] Keywords: ${keywords.join(', ')}`);

  // Step 2: Run JQL searches
  searchProgress.phase = 'Searching Jira...';
  const jqlQueries = buildSearchQueries(keywords);

  const allTicketKeys = new Set<string>();
  const searchResults: { key: string }[] = [];

  for (let qi = 0; qi < jqlQueries.length; qi++) {
    const jql = jqlQueries[qi];
    try {
      console.log(`[Chatbot Search] Query ${qi + 1}/${jqlQueries.length}: ${jql}`);
      const results = await searchJiraIssues(jql, {
        maxResults: 100,
        maxPages: 1,
      });
      console.log(`[Chatbot Search] Query ${qi + 1} returned ${results.length} tickets`);
      for (const r of results) {
        if (!allTicketKeys.has(r.ticketId)) {
          allTicketKeys.add(r.ticketId);
          searchResults.push({ key: r.ticketId });
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.warn(`[Chatbot Search] Query ${qi + 1} failed: ${e.message}`);
    }
  }

  searchProgress.totalTickets = searchResults.length;
  console.log(`[Chatbot Search] Total unique tickets found: ${allTicketKeys.size}`);
  console.log(`[Chatbot Search] Fetching full details for: ${searchResults.length} tickets`);

  if (searchResults.length === 0) {
    searchProgress.status = 'completed';
    searchProgress.answer = `I searched Jira for "${question}" but found no matching tickets. This topic may not have been documented in any user story or task.`;
    searchProgress.phase = 'No tickets found';
    return;
  }

  // Step 3: Fetch full details for ALL matching tickets
  searchProgress.status = 'fetching';
  searchProgress.phase = 'Fetching ticket details...';

  const fullTickets: JiraTicket[] = [];

  for (let i = 0; i < searchResults.length; i++) {
    const { key } = searchResults[i];
    searchProgress.currentTicket = key;
    searchProgress.fetchedTickets = i + 1;
    searchProgress.phase = `Fetching ${key} (${i + 1}/${searchResults.length})...`;

    try {
      const full = await fetchJiraTicket(key);
      if (full) {
        fullTickets.push(full);
        searchProgress.ticketRefs.push({
          key: full.ticketId,
          title: full.title,
          url: `https://${domain}/browse/${full.ticketId}`,
        });
      }
      await new Promise((r) => setTimeout(r, 200)); // Rate limit
    } catch (err: unknown) {
      const e = err as Error;
      console.warn(`[Chatbot Search] Failed to fetch ${key}: ${e.message}`);
    }
  }

  if (fullTickets.length === 0) {
    searchProgress.status = 'completed';
    searchProgress.answer =
      'Found tickets in Jira but could not fetch their details. Please try again.';
    return;
  }

  // Step 4: Send to AI
  searchProgress.status = 'analyzing';
  searchProgress.phase = `Analyzing ${fullTickets.length} tickets with AI...`;

  const analysisPrompt = buildAnalysisPrompt(question, fullTickets);

  try {
    let answer: string;

    if (mode === 'gemini' && isGeminiConfigured()) {
      answer = await callGemini(analysisPrompt);
    } else if (mode === 'claude-cli') {
      const { available } = await isClaudeCliAvailable();
      if (available) {
        resetClaudeCliProgress();
        answer = await callClaudeCli(analysisPrompt, {
          model: (model as ClaudeModel) || 'claude-sonnet-4-6',
        });
      } else {
        answer = buildManualAnswer(question, fullTickets);
      }
    } else {
      answer = buildManualAnswer(question, fullTickets);
    }

    searchProgress.status = 'completed';
    searchProgress.answer = answer;
    searchProgress.phase = 'Complete';
  } catch {
    searchProgress.status = 'completed';
    searchProgress.answer = buildManualAnswer(question, fullTickets);
    searchProgress.phase = 'Complete (AI failed, showing raw data)';
  }
}

function extractKeywords(question: string): string[] {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in',
    'with', 'to', 'for', 'of', 'how', 'what', 'when', 'where', 'why', 'who',
    'does', 'do', 'can', 'could', 'would', 'should', 'tell', 'me', 'about',
    'more', 'please', 'explain', 'describe', 'between', 'this', 'that',
    'there', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will',
    'be', 'i', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'mean',
    'means', 'work', 'works', 'use', 'used',
  ]);

  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

function buildSearchQueries(keywords: string[]): string[] {
  const project = process.env.JIRA_PROJECT_KEY || 'CMB';
  const queries: string[] = [];

  // Query 1: Full phrase in summary OR description
  const fullPhrase = keywords.join(' ');
  queries.push(
    `project = ${project} AND (summary ~ "${fullPhrase}" OR description ~ "${fullPhrase}") ORDER BY updated DESC`
  );

  // Query 2+: Individual keywords — each keyword in summary OR description
  if (keywords.length > 1) {
    for (const keyword of keywords) {
      queries.push(
        `project = ${project} AND (summary ~ "${keyword}" OR description ~ "${keyword}") ORDER BY updated DESC`
      );
    }
  }

  return queries;
}

function buildAnalysisPrompt(
  question: string,
  tickets: JiraTicket[]
): string {
  const ticketTexts = tickets
    .map((t) => {
      let text = `### ${t.ticketId}: ${t.title}\n`;
      text += `Status: ${t.status} | Created: ${(t.created || '').split('T')[0]}\n\n`;
      if (t.userStory) text += `${t.userStory.substring(0, 1000)}\n\n`;
      if (t.acceptanceCriteria?.length > 0) {
        text += `Acceptance Criteria:\n`;
        t.acceptanceCriteria.forEach((ac: string, i: number) => {
          text += `${i + 1}. ${ac}\n`;
        });
      }
      return text;
    })
    .join('\n---\n\n');

  return `You are a knowledgeable product assistant for Yassir Mobility.

## QUESTION
${question}

## CONTEXT — JIRA TICKETS FOUND
The following ${tickets.length} Jira tickets were found that may relate to the question.
Analyze them and answer the question.

RULES:
1. Answer ONLY based on what's in these tickets. Do NOT guess.
2. Reference specific ticket IDs in your answer (e.g., "According to ${tickets[0]?.ticketId}...")
3. If the tickets don't fully answer the question, say what you found and what's still unclear.
4. If multiple tickets describe the same thing differently, the NEWER ticket is the truth.
5. Be specific — mention field names, rules, values from the tickets.

## TICKETS

${ticketTexts}

Answer the question now, referencing ticket IDs.`;
}

function buildManualAnswer(question: string, tickets: JiraTicket[]): string {
  const lines = [
    `Based on a search of ${tickets.length} Jira tickets, here's what I found related to "${question}":\n`,
  ];

  for (const t of tickets.slice(0, 10)) {
    lines.push(`**${t.ticketId}: ${t.title}** (${t.status})`);
    if (t.userStory) {
      lines.push(t.userStory.substring(0, 300));
    }
    lines.push('');
  }

  lines.push(
    '\n_Note: This is raw ticket data. AI analysis was not available._'
  );
  return lines.join('\n');
}
