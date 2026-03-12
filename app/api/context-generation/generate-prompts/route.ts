/**
 * GET /api/context-generation/generate-prompts
 *
 * Returns a list of modules with their prompts ready to copy to Claude.
 * Each prompt contains all tickets for that module (oldest → newest).
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

interface Ticket {
  ticketId: string;
  title: string;
  module: string;
  moduleSlug: string;
  status: string;
  priority: string;
  type: string;
  created: string;
  updated: string;
  description: string;
  userStory?: string;
  acceptanceCriteria: string[];
  labels: string[];
  components: string[];
}

interface TicketsIndex {
  lastUpdated: string;
  totalTickets: number;
  modules: string[];
  tickets: Ticket[];
}

interface GenerationStatus {
  lastUpdated: string;
  modules: {
    [slug: string]: {
      status: 'pending' | 'completed';
      completedAt?: string;
    };
  };
}

export async function GET() {
  try {
    // 1. Read tickets-index.json
    const indexPath = join(KB_DIR, 'tickets-index.json');
    if (!existsSync(indexPath)) {
      return NextResponse.json(
        { success: false, error: 'No tickets found. Run a Jira sync first.' },
        { status: 400 }
      );
    }

    const indexContent = await readFile(indexPath, 'utf-8');
    const ticketsIndex: TicketsIndex = JSON.parse(indexContent);

    // 2. Read persisted status
    const statusPath = join(KB_DIR, 'generation-status.json');
    let status: GenerationStatus = { lastUpdated: '', modules: {} };
    if (existsSync(statusPath)) {
      const statusContent = await readFile(statusPath, 'utf-8');
      status = JSON.parse(statusContent);
    }

    // 3. Group tickets by module
    const moduleTickets = new Map<string, Ticket[]>();
    for (const ticket of ticketsIndex.tickets) {
      const slug = ticket.moduleSlug;
      if (!moduleTickets.has(slug)) {
        moduleTickets.set(slug, []);
      }
      moduleTickets.get(slug)!.push(ticket);
    }

    // 4. Build prompts for each module
    const modules = [];
    let completed = 0;
    let pending = 0;

    for (const [slug, tickets] of moduleTickets) {
      // Sort tickets oldest to newest
      const sortedTickets = [...tickets].sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );

      const moduleName = sortedTickets[0]?.module || slug;

      // Check existing context files
      const modulesPath = join(KB_DIR, 'modules', `${slug}.md`);
      const jiraContextPath = join(KB_DIR, 'jira-context', `${slug}.md`);
      const hasExistingContext = existsSync(modulesPath) || existsSync(jiraContextPath);

      // Read existing content for update mode
      let existingContent = '';
      if (existsSync(modulesPath)) {
        existingContent = await readFile(modulesPath, 'utf-8');
      } else if (existsSync(jiraContextPath)) {
        existingContent = await readFile(jiraContextPath, 'utf-8');
      }

      // Get persisted status or default to pending
      const moduleStatus = status.modules[slug]?.status || 'pending';
      if (moduleStatus === 'completed') completed++;
      else pending++;

      // Build prompt
      const prompt = buildModulePrompt(moduleName, sortedTickets, existingContent);

      modules.push({
        moduleName,
        slug,
        ticketCount: tickets.length,
        prompt,
        promptLength: prompt.length,
        hasExistingContext,
        status: moduleStatus,
        completedAt: status.modules[slug]?.completedAt,
      });
    }

    // Sort: pending first, then by ticket count descending
    modules.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      return b.ticketCount - a.ticketCount;
    });

    return NextResponse.json({
      success: true,
      modules,
      stats: {
        totalModules: modules.length,
        totalTickets: ticketsIndex.totalTickets,
        completed,
        pending,
      },
    });
  } catch (error) {
    console.error('[Generate Prompts API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function buildModulePrompt(
  moduleName: string,
  tickets: Ticket[],
  existingContent: string
): string {
  // Build ticket content for the prompt
  const ticketTexts = tickets
    .map((t) => {
      let text = `### ${t.ticketId}: ${t.title}\n`;
      text += `**Status:** ${t.status} | **Priority:** ${t.priority} | **Type:** ${t.type}\n`;
      text += `**Created:** ${(t.created || '').split('T')[0]}\n\n`;

      const description = t.description || t.userStory || '';
      if (description) {
        text += `**Description:**\n${description.substring(0, 2000)}\n\n`;
      }

      if (t.acceptanceCriteria && t.acceptanceCriteria.length > 0) {
        text += `**Acceptance Criteria:**\n`;
        t.acceptanceCriteria.forEach((ac, i) => {
          text += `${i + 1}. ${ac}\n`;
        });
      }

      return text;
    })
    .join('\n---\n\n');

  const updateSection = existingContent
    ? `
## EXISTING CONTEXT (current knowledge base — update this)
${existingContent.substring(0, 6000)}

## TASK
Update the existing context above with the new ticket information below.
If new tickets contradict the existing context, the new tickets WIN — update the relevant sections.
`
    : `
## TASK
Generate a comprehensive context document for this module based on the tickets below.
`;

  return `You are a technical documentation expert for Yassir Mobility, a ride-hailing platform operating in North & West Africa (Algeria, Tunisia, Morocco, Senegal).

## CRITICAL RULE — CONTRADICTION HANDLING
These tickets represent the FULL EVOLUTION of the "${moduleName}" module. They are sorted from OLDEST to NEWEST.

When you find tickets that CONTRADICT each other:
- The NEWER ticket ALWAYS wins and REPLACES the older information
- The older ticket's version is OBSOLETE — do NOT include it as current behavior
- Newer tickets represent enhancements, revamps, or requirement changes
- Treat the ticket list as a timeline: the latest version is the truth

Example: If an old ticket says "Login uses email+password" but a newer one says "Login uses phone+OTP", the current system uses phone+OTP ONLY.
${updateSection}
## OUTPUT FORMAT
Write a Markdown document with this structure:

# ${moduleName}

## Overview
(2-3 sentences about what this module does)

## Features

### Feature Name 1
- How it works
- Business rules
- Validation rules
- UI behavior

### Feature Name 2
...

## Business Rules Summary
(All constraints and rules)

## Changelog
(Brief notes on what was replaced/revamped, referencing ticket keys)

## Tickets (${tickets.length} tickets, oldest → newest)

${ticketTexts}

Generate the context document now. Be thorough, specific, and focus on CURRENT behavior only.`;
}
