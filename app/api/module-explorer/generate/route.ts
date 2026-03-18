/**
 * POST /api/module-explorer/generate
 *
 * Generates a module document from tickets using Gemini (auto) or returns prompt for Claude (manual).
 *
 * Body: {
 *   name: "Invoice Module",
 *   slug: "invoice-module",
 *   tickets: [...],
 *   mode: "auto" | "manual"
 * }
 *
 * mode "auto": calls Gemini and returns generated content
 * mode "manual": returns the prompt for copy-paste to Claude
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, isGeminiConfigured } from '@/lib/ai/gemini-client';
import * as fs from 'fs';
import * as path from 'path';
import type { ModuleExplorerTicket } from '@/lib/module-explorer/progress';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

export async function POST(request: NextRequest) {
  try {
    const { name, slug, tickets, mode } = await request.json();

    if (!tickets || tickets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No tickets provided' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Document name is required' },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildModuleExplorerPrompt(name, tickets);

    if (mode === 'manual') {
      // Return prompt for copy-paste to Claude
      return NextResponse.json({
        success: true,
        mode: 'manual',
        prompt,
        promptLength: prompt.length,
        ticketCount: tickets.length,
      });
    }

    // Auto mode — call Gemini
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Gemini not configured. Add GEMINI_API_KEY to .env.local or use manual mode. Get a free key at https://aistudio.google.com/apikey',
        },
        { status: 503 }
      );
    }

    console.log(
      `[Module Explorer] Generating document for "${name}" with ${tickets.length} tickets...`
    );

    const content = await callGemini(prompt);

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Gemini returned empty response' },
        { status: 500 }
      );
    }

    // Save to knowledge base
    const moduleSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const modulesDir = path.join(KB_DIR, 'modules');
    fs.mkdirSync(modulesDir, { recursive: true });

    const filePath = path.join(modulesDir, `${moduleSlug}.md`);

    // Backup existing file if it exists
    if (fs.existsSync(filePath)) {
      const backupDir = path.join(modulesDir, '.backups');
      fs.mkdirSync(backupDir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync(filePath, path.join(backupDir, `${moduleSlug}-${ts}.md`));
      console.log(`[Module Explorer] Backed up existing file: ${moduleSlug}-${ts}.md`);
    }

    fs.writeFileSync(filePath, content);
    console.log(`[Module Explorer] Saved document to: ${filePath}`);

    return NextResponse.json({
      success: true,
      mode: 'auto',
      content,
      contentLength: content.length,
      savedTo: `modules/${moduleSlug}.md`,
      slug: moduleSlug,
      ticketCount: tickets.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Module Explorer Generate Error]', err);

    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate document' },
      { status: 500 }
    );
  }
}

/**
 * Build the prompt for module document generation.
 * Tickets are sorted oldest→newest for proper contradiction handling.
 */
function buildModuleExplorerPrompt(name: string, tickets: ModuleExplorerTicket[]): string {
  // Ensure tickets are sorted oldest first
  const sorted = [...tickets].sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  );

  const ticketTexts = sorted
    .map((t) => {
      let text = `### ${t.key}: ${t.title}\n`;
      text += `Status: ${t.status} | Type: ${t.type} | Created: ${(t.created || '').split('T')[0]}\n\n`;

      if (t.description) {
        // Truncate very long descriptions
        const desc = t.description.length > 2000 ? t.description.substring(0, 2000) + '...' : t.description;
        text += `Description:\n${desc}\n\n`;
      }

      if (t.acceptanceCriteria && t.acceptanceCriteria.length > 0) {
        text += `Acceptance Criteria:\n`;
        t.acceptanceCriteria.forEach((ac: string, i: number) => {
          text += `${i + 1}. ${ac}\n`;
        });
        text += '\n';
      }

      return text;
    })
    .join('\n---\n\n');

  return `You are a technical documentation expert for Yassir Mobility, a ride-hailing platform in North & West Africa.

## TASK
Analyze these ${sorted.length} Jira tickets and generate a comprehensive module document for: "${name}"

This document will be used by QA engineers for:
- Writing regression test suites
- Understanding the current module behavior
- Analyzing feature coverage
- Planning testing activities

## CRITICAL RULE — CONTRADICTION HANDLING
Tickets are sorted OLDEST to NEWEST. When tickets CONTRADICT each other:
- The NEWER ticket ALWAYS wins and REPLACES the older information
- The older version is OBSOLETE
- Treat the ticket list as a timeline: the latest version = current truth

## OUTPUT FORMAT

# ${name}

## Overview
(What this module does, who uses it, why it exists)

## Features

### Feature 1
- How it works (step by step)
- Business rules and constraints
- Validation rules
- UI behavior and elements
- Edge cases

### Feature 2
...

## Business Rules Summary
(All rules, constraints, limits in a single list)

## Data Flow
(How data moves through this module — inputs, processing, outputs)

## Integration Points
(Connections to other modules or external systems)

## Testing Considerations
(Key areas to focus on for regression testing, known edge cases, historical bugs)

## Changelog
(What was replaced/revamped over time, with ticket references)

---

## Tickets to Analyze (${sorted.length} tickets, oldest → newest)

${ticketTexts}

Generate the document now. Be thorough, specific, and include concrete details (field names, button labels, validation rules, exact business logic). Focus on CURRENT behavior only.`;
}
