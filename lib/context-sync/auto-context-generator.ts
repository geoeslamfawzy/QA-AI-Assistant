/**
 * Automatic Context Generation Pipeline
 *
 * Processes all modules sequentially using Gemini API.
 * No manual intervention needed.
 *
 * Flow:
 * 1. Load all tickets from tickets-index.json
 * 2. Group by module (oldest → newest within each)
 * 3. For each module, build prompt and call Gemini
 * 4. Save response as module context file
 * 5. Rate limit: wait 5 seconds between modules (stay under 15 RPM)
 * 6. Report progress throughout
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  createRateLimitedGeminiClient,
  isGeminiConfigured,
  GEMINI_RATE_LIMIT_DELAY_MS,
} from '../ai/gemini-client';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

// Max tickets per prompt to stay within context limits
// Gemini has 1M context, so we can be generous
const MAX_TICKETS_PER_PROMPT = 60;

export interface AutoGenModuleStatus {
  name: string;
  slug: string;
  ticketCount: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
  contentPreview?: string;
  savedAt?: string;
}

export interface AutoGenProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  totalModules: number;
  processedModules: number;
  currentModule: string;
  currentModuleTickets: number;
  modules: AutoGenModuleStatus[];
  startedAt: string;
  estimatedTimeLeft?: string;
  errors: string[];
}

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

// In-memory progress (for polling)
let autoGenProgress: AutoGenProgress | null = null;
let isRunning = false;

export function getAutoGenProgress(): AutoGenProgress | null {
  return autoGenProgress;
}

export function isAutoGenRunning(): boolean {
  return isRunning;
}

/**
 * Run automatic context generation for all modules.
 */
export async function runAutoContextGeneration(): Promise<AutoGenProgress> {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API not configured. Add GEMINI_API_KEY to .env.local');
  }

  if (isRunning) {
    throw new Error('Auto-generation is already running');
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    // Load tickets
    const indexPath = path.join(KB_DIR, 'tickets-index.json');
    if (!fs.existsSync(indexPath)) {
      throw new Error('No tickets found. Run a Jira sync first.');
    }
    const allTickets: Ticket[] = JSON.parse(fs.readFileSync(indexPath, 'utf-8')).tickets || JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    // Handle both formats: array directly or { tickets: [...] }
    const ticketArray = Array.isArray(allTickets) ? allTickets : [];

    // Group by module
    const moduleMap = new Map<
      string,
      { name: string; slug: string; tickets: Ticket[] }
    >();
    for (const t of ticketArray) {
      const mod = t.module || 'Uncategorized';
      const slug =
        t.moduleSlug ||
        mod
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      if (!moduleMap.has(slug)) {
        moduleMap.set(slug, { name: mod, slug, tickets: [] });
      }
      moduleMap.get(slug)!.tickets.push(t);
    }

    // Sort tickets within each module: oldest first
    for (const mod of moduleMap.values()) {
      mod.tickets.sort(
        (a, b) =>
          new Date(a.created).getTime() - new Date(b.created).getTime()
      );
    }

    const moduleList = Array.from(moduleMap.values());

    // Initialize progress
    autoGenProgress = {
      status: 'running',
      totalModules: moduleList.length,
      processedModules: 0,
      currentModule: '',
      currentModuleTickets: 0,
      modules: moduleList.map((m) => ({
        name: m.name,
        slug: m.slug,
        ticketCount: m.tickets.length,
        status: 'pending' as const,
      })),
      startedAt: new Date().toISOString(),
      errors: [],
    };

    const modulesDir = path.join(KB_DIR, 'modules');
    fs.mkdirSync(modulesDir, { recursive: true });

    console.log(
      `[AutoGen] Starting automatic context generation for ${moduleList.length} modules...`
    );
    console.log(`[AutoGen] Using Gemini 2.0 Flash (free tier)`);
    console.log(
      `[AutoGen] Rate limit: 1 request every ${GEMINI_RATE_LIMIT_DELAY_MS / 1000}s`
    );

    // Create rate-limited client
    const geminiClient = createRateLimitedGeminiClient();

    for (let i = 0; i < moduleList.length; i++) {
      const mod = moduleList[i];
      autoGenProgress.currentModule = mod.name;
      autoGenProgress.currentModuleTickets = mod.tickets.length;
      autoGenProgress.modules[i].status = 'generating';

      // Estimate time left
      const elapsed = Date.now() - startTime;
      const avgPerModule =
        i > 0 ? elapsed / i : GEMINI_RATE_LIMIT_DELAY_MS + 5000;
      const remaining = (moduleList.length - i) * avgPerModule;
      autoGenProgress.estimatedTimeLeft = formatDuration(remaining);

      console.log(
        `[AutoGen] (${i + 1}/${moduleList.length}) ${mod.name} — ${mod.tickets.length} tickets`
      );

      try {
        // Build prompt
        const prompt = buildModulePrompt(mod.name, mod.tickets);

        // Call Gemini with rate limiting
        const generatedContent = await geminiClient.generate(prompt);

        // Save to file
        const filePath = path.join(modulesDir, `${mod.slug}.md`);

        // Backup existing
        if (fs.existsSync(filePath)) {
          const backupDir = path.join(modulesDir, '.backups');
          fs.mkdirSync(backupDir, { recursive: true });
          const ts = new Date().toISOString().replace(/[:.]/g, '-');
          fs.copyFileSync(filePath, path.join(backupDir, `${mod.slug}-${ts}.md`));
        }

        fs.writeFileSync(filePath, generatedContent);

        // Update progress
        autoGenProgress.modules[i].status = 'completed';
        autoGenProgress.modules[i].contentPreview = generatedContent.substring(
          0,
          200
        );
        autoGenProgress.modules[i].savedAt = new Date().toISOString();
        autoGenProgress.processedModules = i + 1;

        console.log(
          `[AutoGen] ✅ ${mod.name} — ${generatedContent.length} chars saved`
        );

        // Save generation status persistently
        saveGenerationStatus(autoGenProgress.modules);
      } catch (err: unknown) {
        const error = err as Error;
        console.error(`[AutoGen] ❌ ${mod.name}: ${error.message}`);
        autoGenProgress.modules[i].status = 'failed';
        autoGenProgress.modules[i].error = error.message;
        autoGenProgress.errors.push(`${mod.name}: ${error.message}`);
        autoGenProgress.processedModules = i + 1;
      }
    }

    // Build main project-context.md index
    buildMainContextIndex(moduleList);

    autoGenProgress.status = 'completed';
    autoGenProgress.currentModule = '';
    const totalTime = Date.now() - startTime;
    console.log(
      `[AutoGen] ✅ Complete! ${moduleList.length} modules in ${formatDuration(totalTime)}`
    );

    return autoGenProgress;
  } catch (err: unknown) {
    const error = err as Error;
    if (autoGenProgress) {
      autoGenProgress.status = 'failed';
      autoGenProgress.errors.push(error.message);
    }
    throw err;
  } finally {
    isRunning = false;
  }
}

function buildModulePrompt(moduleName: string, tickets: Ticket[]): string {
  // If too many tickets, take the most recent ones (they're the most relevant)
  let selectedTickets = tickets;
  if (tickets.length > MAX_TICKETS_PER_PROMPT) {
    // Keep oldest 10 (for historical context) + newest (MAX - 10)
    const oldest = tickets.slice(0, 10);
    const newest = tickets.slice(-(MAX_TICKETS_PER_PROMPT - 10));
    selectedTickets = [...oldest, ...newest];
    console.log(
      `[AutoGen] ${moduleName}: truncated from ${tickets.length} to ${selectedTickets.length} tickets`
    );
  }

  const ticketTexts = selectedTickets
    .map((t) => {
      let text = `### ${t.ticketId}: ${t.title}\n`;
      text += `Status: ${t.status} | Created: ${(t.created || '').split('T')[0]}\n\n`;

      const description = t.description || t.userStory || '';
      if (description) {
        text += `Description:\n${description.substring(0, 1500)}\n\n`;
      }

      if (t.acceptanceCriteria && t.acceptanceCriteria.length > 0) {
        text += `Acceptance Criteria:\n`;
        t.acceptanceCriteria.forEach((ac: string, i: number) => {
          text += `${i + 1}. ${ac}\n`;
        });
      }

      return text;
    })
    .join('\n---\n\n');

  // Check for existing context (update mode)
  const modulesDir = path.join(KB_DIR, 'modules');
  const slug = moduleName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const existingPath = path.join(modulesDir, `${slug}.md`);
  let existingContent = '';
  try {
    if (fs.existsSync(existingPath)) {
      existingContent = fs.readFileSync(existingPath, 'utf-8');
    }
  } catch {
    // Ignore read errors
  }

  const updateSection = existingContent
    ? `
## EXISTING CONTEXT (update this with new ticket info)
${existingContent.substring(0, 6000)}

Update the above context with the ticket information below. If new tickets contradict existing content, the NEW tickets override.
`
    : '';

  return `You are a technical documentation expert for Yassir Mobility, a ride-hailing platform in North & West Africa (Algeria, Tunisia, Morocco, Senegal).

## CRITICAL RULE — CONTRADICTION HANDLING
These ${selectedTickets.length} tickets represent the FULL EVOLUTION of the "${moduleName}" module. They are sorted OLDEST to NEWEST.

When tickets CONTRADICT each other:
- The NEWER ticket ALWAYS wins and REPLACES the older information
- The older version is OBSOLETE — do NOT include it as current behavior
- Newer tickets = enhancements, revamps, requirement changes
- The latest ticket = the truth

Example: If old ticket says "Login uses email+password" but newer says "Login uses phone+OTP", current system = phone+OTP ONLY. Do NOT mention email+password as current.
${updateSection}
## OUTPUT FORMAT
Write a Markdown document:

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
(What was replaced/revamped, with ticket keys)

## Tickets Analyzed (${selectedTickets.length} tickets, oldest → newest)

${ticketTexts}

Generate the context document now. Be thorough and specific. Focus on CURRENT behavior only.`;
}

function buildMainContextIndex(
  modules: { name: string; slug: string; tickets: Ticket[] }[]
): void {
  const lines = [
    '# Yassir Mobility — Project Context',
    '',
    '> Auto-generated using Google Gemini from Jira tickets',
    `> Generated: ${new Date().toISOString()}`,
    `> Modules: ${modules.length}`,
    `> Total tickets: ${modules.reduce((s, m) => s + m.tickets.length, 0)}`,
    '',
    '## Modules',
    '',
  ];

  for (const mod of modules.sort((a, b) => b.tickets.length - a.tickets.length)) {
    lines.push(
      `- [${mod.name}](modules/${mod.slug}.md) — ${mod.tickets.length} tickets`
    );
  }

  fs.writeFileSync(path.join(KB_DIR, 'project-context.md'), lines.join('\n'));
}

function saveGenerationStatus(modules: AutoGenModuleStatus[]): void {
  const statusPath = path.join(KB_DIR, 'generation-status.json');
  const status: Record<string, { status: string; savedAt?: string; error?: string }> = {};
  for (const m of modules) {
    status[m.slug] = {
      status: m.status,
      savedAt: m.savedAt,
      error: m.error,
    };
  }
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (minutes > 0) return `${minutes}m ${remainingSecs}s`;
  return `${seconds}s`;
}
