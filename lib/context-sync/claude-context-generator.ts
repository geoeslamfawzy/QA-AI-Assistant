/**
 * Claude-Powered Context Generator.
 *
 * Generates intelligent, structured context documents from grouped Jira tickets.
 * Key rule: NEWER tickets override OLDER ones (tickets are processed oldest-to-newest).
 *
 * Uses Claude API to synthesize ticket information into coherent module documentation.
 * Falls back to template-based generation when API key is not configured.
 */

import { createMessage, isApiKeyConfigured } from '@/lib/ai/client';
import { buildModuleMarkdown } from './context-builder';
import type { ModuleContext, GeneratedModuleContext, ParsedTicket } from './types';

// ────────────────────────────────────
// SYSTEM PROMPT
// ────────────────────────────────────

const SYSTEM_PROMPT = `You are a QA documentation expert for Yassir Mobility, a ride-hailing platform operating in North & West Africa.

Your task is to synthesize Jira tickets into comprehensive module context documents that QA engineers can use as reference for writing test cases.

## CRITICAL RULE — CONTRADICTION HANDLING

These tickets represent the FULL EVOLUTION of this module over time. They are sorted from OLDEST to NEWEST.

When you find tickets that CONTRADICT each other (different behavior for the same feature, different field names, different validation rules, different UI flow, etc.):
- The NEWER ticket ALWAYS wins and REPLACES the older information
- The older ticket's version is OBSOLETE — do NOT include it in the current state
- This is because newer tickets represent enhancements, revamps, or requirement changes
- Treat the full ticket list as a timeline: the latest version is the truth

Example: If CMB-100 (Jan 2025) says "Login uses email + password" but CMB-500 (Dec 2025) says "Login uses phone + OTP", then the current system uses phone + OTP. Do NOT mention the old email flow as current behavior.

## WRITING GUIDELINES

1. Write in present tense — describe how the system CURRENTLY works based on the latest tickets
2. Be specific — include field names, button labels, validation rules, business logic
3. Organize by feature/sub-feature, not by ticket number
4. Use clear headings and bullet points
5. Include any business rules, constraints, or edge cases mentioned in the tickets
6. If a ticket mentions specific UI elements (dropdowns, modals, toggles), include them
7. Write at a level that a QA engineer can use to write test cases
8. If a feature was completely removed or replaced by a newer ticket, do NOT include it in the "Current Features" section

## OUTPUT FORMAT

Write a Markdown document with this structure:

# [Module Name]

## Overview
(2-3 sentences describing what this module does)

## Key Features
- Feature 1: Brief description
- Feature 2: Brief description
- ...

## Detailed Features

### Feature Name 1
(Describe the feature based on the tickets)
- How it works
- Business rules
- Validation rules
- UI behavior

### Feature Name 2
...

## Business Rules Summary
(List all critical business rules and constraints)

## Edge Cases & Test Considerations
(Potential test scenarios, edge cases, error conditions to verify)

## Recent Changes
(If any features were replaced or significantly revamped, briefly note what changed)
`;

// ────────────────────────────────────
// PROMPT BUILDER
// ────────────────────────────────────

/**
 * Build the user prompt with ticket information for Claude.
 */
function buildUserPrompt(module: ModuleContext): string {
  // Sort tickets oldest first (so Claude sees the evolution)
  const sortedTickets = [...module.activeTickets].sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );

  const ticketsSummary = sortedTickets
    .map((t) => formatTicketForPrompt(t))
    .join('\n\n---\n\n');

  const supersededSection =
    module.overriddenTickets.length > 0
      ? `
## Superseded Tickets (for reference only)
${module.overriddenTickets
  .map((o) => `- ${o.ticket.ticketId}: ${o.ticket.title} → Replaced by ${o.overriddenBy}`)
  .join('\n')}
`
      : '';

  return `Generate a comprehensive QA context document for the "${module.moduleName}" module.

## Module Info
- Total Tickets: ${module.tickets.length}
- Active Tickets: ${module.activeTickets.length}
- Superseded: ${module.overriddenTickets.length}

## Active Tickets (sorted oldest to newest - NEWER overrides OLDER)

${ticketsSummary}
${supersededSection}

Generate the context document now, following the output structure exactly.
Ensure you consolidate similar features and resolve any contradictions by using the NEWER ticket's information.`;
}

/**
 * Build the user prompt for UPDATE mode with existing content.
 * Instructs Claude to merge new tickets into existing documentation.
 */
function buildUpdatePrompt(module: ModuleContext, existingContent: string): string {
  // Sort tickets oldest first (so Claude sees the evolution)
  const sortedTickets = [...module.activeTickets].sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );

  const ticketsSummary = sortedTickets
    .map((t) => formatTicketForPrompt(t))
    .join('\n\n---\n\n');

  // Truncate existing content if too long (keep first 8000 chars)
  const truncatedExisting = existingContent.length > 8000
    ? existingContent.substring(0, 8000) + '\n\n[... content truncated ...]'
    : existingContent;

  return `You are UPDATING an existing project context document for Yassir Mobility.

## Existing Context (current knowledge base)
${truncatedExisting}

## New Tickets to Integrate (recently completed)
These tickets represent new features, enhancements, or changes since the last update.
If they contradict the existing context, the new tickets OVERRIDE the old information.

${ticketsSummary}

## Task
Update the existing context document to incorporate the new ticket information.
- If a new ticket changes existing behavior, UPDATE that section
- If a new ticket adds new features, ADD a new section
- If a new ticket removes/deprecates something, REMOVE or mark it as deprecated
- Keep the same document structure (headings, sections)
- The output should be a complete, updated version of the context document
- Follow the same output format as before (Overview, Key Features, Detailed Features, Business Rules, Edge Cases, Recent Changes)`;
}

/**
 * Format a single ticket for the Claude prompt.
 */
function formatTicketForPrompt(ticket: ParsedTicket): string {
  const created =
    ticket.created instanceof Date
      ? ticket.created.toISOString().split('T')[0]
      : new Date(ticket.created).toISOString().split('T')[0];

  const acSection =
    ticket.acceptanceCriteria.length > 0
      ? `**Acceptance Criteria:**
${ticket.acceptanceCriteria.map((ac) => `- ${ac}`).join('\n')}`
      : 'No acceptance criteria specified';

  // Truncate very long descriptions to stay within context limits
  const description = (ticket.userStory || ticket.description || 'No description').substring(
    0,
    2000
  );

  return `### ${ticket.ticketId}: ${ticket.title}
**Status:** ${ticket.status} | **Priority:** ${ticket.priority} | **Created:** ${created}
**Type:** ${ticket.type}

${description}

${acSection}`;
}

// ────────────────────────────────────
// GENERATOR FUNCTIONS
// ────────────────────────────────────

/**
 * Check if Claude API is available for context generation.
 */
export function isClaudeAvailable(): boolean {
  return isApiKeyConfigured();
}

/**
 * Generate context for a single module using Claude.
 * Falls back to template-based generation if API key is not configured.
 *
 * @param module - The module context with tickets
 * @param existingContent - Optional existing markdown content for update mode
 */
export async function generateModuleContext(
  module: ModuleContext,
  existingContent?: string
): Promise<GeneratedModuleContext> {
  const usedAI = isClaudeAvailable();

  if (!usedAI) {
    // Fallback to template-based generation (existing buildModuleMarkdown)
    console.log(
      `[Context Gen] No API key - using template for ${module.moduleName}`
    );
    return {
      moduleSlug: module.moduleSlug,
      moduleName: module.moduleName,
      markdown: buildModuleMarkdown(module),
      ticketCount: module.tickets.length,
      activeCount: module.activeTickets.length,
      generatedAt: new Date().toISOString(),
      usedAI: false,
    };
  }

  const isUpdateMode = !!existingContent;
  console.log(
    `[Context Gen] Generating context for ${module.moduleName} with Claude (${isUpdateMode ? 'update' : 'initial'} mode)...`
  );

  try {
    // Use update prompt if existing content provided, otherwise initial prompt
    const userPrompt = existingContent
      ? buildUpdatePrompt(module, existingContent)
      : buildUserPrompt(module);

    const response = await createMessage({
      systemPrompt: SYSTEM_PROMPT,
      userMessage: userPrompt,
      maxTokens: 8000,
    });

    // Add frontmatter to Claude's response
    const frontmatter = buildFrontmatter(module);

    return {
      moduleSlug: module.moduleSlug,
      moduleName: module.moduleName,
      markdown: frontmatter + response,
      ticketCount: module.tickets.length,
      activeCount: module.activeTickets.length,
      generatedAt: new Date().toISOString(),
      usedAI: true,
    };
  } catch (error) {
    console.error(
      `[Context Gen] Claude API error for ${module.moduleName}:`,
      error
    );

    // Fallback to template on API error
    return {
      moduleSlug: module.moduleSlug,
      moduleName: module.moduleName,
      markdown: buildModuleMarkdown(module),
      ticketCount: module.tickets.length,
      activeCount: module.activeTickets.length,
      generatedAt: new Date().toISOString(),
      usedAI: false,
    };
  }
}

/**
 * Build YAML frontmatter for the generated markdown.
 */
function buildFrontmatter(module: ModuleContext): string {
  const lastUpdated =
    module.lastUpdated instanceof Date
      ? module.lastUpdated.toISOString()
      : new Date(module.lastUpdated).toISOString();

  return `---
id: "jira-${module.moduleSlug}"
title: "${module.moduleName}"
type: "ai_generated_context"
source: "claude-sonnet"
last_synced: "${new Date().toISOString()}"
last_updated: "${lastUpdated}"
ticket_count: ${module.tickets.length}
active_ticket_count: ${module.activeTickets.length}
---

`;
}
