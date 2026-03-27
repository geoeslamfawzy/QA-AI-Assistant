/**
 * POST /api/chatbot/update-kb — Update knowledge base with discovered info
 *
 * Creates a dedicated discovery file for each topic.
 * Distills the raw AI answer into compact business rules before saving.
 *
 * Body: {
 *   question: "what is adjusted trips",
 *   answer: "Based on CMB-1234...",
 *   ticketRefs: [{ key, title, url }],
 *   moduleName: "auto-detect" or specific module slug,
 *   mode: "gemini" | "claude-cli",
 *   model: "claude-sonnet-4-6"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

export async function POST(request: NextRequest) {
  try {
    const { question, answer, ticketRefs, moduleName, mode, model } =
      await request.json();

    if (!answer?.trim()) {
      return NextResponse.json(
        { error: 'Answer content is required' },
        { status: 400 }
      );
    }

    const modulesDir = path.join(KB_DIR, 'modules');
    fs.mkdirSync(modulesDir, { recursive: true });

    // Determine target — always create a dedicated discovery file
    let targetSlug = moduleName;
    if (!targetSlug || targetSlug === 'auto-detect') {
      targetSlug = buildDiscoverySlug(question);
    }

    const targetFile = path.join(modulesDir, `${targetSlug}.md`);

    // Distill the raw answer into compact business rules
    console.log(
      `[KB Update] Distilling answer for "${question}" (${answer.length} chars)...`
    );
    const distilled = await distillBusinessRules(
      question,
      answer,
      mode || 'claude-cli',
      model
    );
    console.log(`[KB Update] Distilled to ${distilled.length} chars`);

    // Build compact file
    const timestamp = new Date().toISOString().split('T')[0];
    const ticketList = (ticketRefs || [])
      .map((t: { key: string }) => t.key)
      .join(', ');

    const newContent = `# ${question}\n\n> Discovered from Jira on ${timestamp}\n> Source tickets: ${ticketList || 'N/A'}\n\n${distilled}\n`;

    if (fs.existsSync(targetFile)) {
      // Backup existing file before overwriting
      const backupDir = path.join(modulesDir, '.backups');
      fs.mkdirSync(backupDir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync(
        targetFile,
        path.join(backupDir, `${targetSlug}-${ts}.md`)
      );
    }

    // Always write a clean dedicated file for this discovery
    fs.writeFileSync(targetFile, newContent);
    console.log(`[KB Update] Saved to ${targetSlug}.md`);

    return NextResponse.json({
      success: true,
      slug: targetSlug,
      file: `modules/${targetSlug}.md`,
      isNewModule: true,
      message: `Knowledge base updated: ${targetSlug}.md`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ────────────────────────────────────
// SLUG BUILDER
// ────────────────────────────────────

/**
 * Build a discovery-specific slug from the question.
 * Creates files like: discovery-adjusted-trips.md
 */
function buildDiscoverySlug(question: string): string {
  const slug = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    // Strip leading question words
    .replace(
      /^(what|how|why|when|where|who|is|are|does|do|can|could|would|tell|me|about|the|a|an)-*/g,
      ''
    )
    .replace(/^-+/, '')
    .substring(0, 50)
    .replace(/-$/, '');

  if (slug.length < 3) return 'chatbot-discoveries';

  return `discovery-${slug}`;
}

// ────────────────────────────────────
// DISTILLATION
// ────────────────────────────────────

async function distillBusinessRules(
  question: string,
  rawAnswer: string,
  mode: string,
  model?: string
): Promise<string> {
  const distillPrompt = `You are a technical documentation writer.

Below is a raw answer about "${question}" from a Jira ticket analysis.

Extract ONLY the useful business rules, facts, and behaviors. Remove all filler text, explanations of what was searched, disclaimers, and verbose descriptions.

Format as compact bullet points:
- Each bullet = one fact, rule, or behavior
- Use specific field names, values, and conditions
- No introductions, no conclusions, no "based on tickets" phrases
- Maximum 10-15 bullets
- If something is unclear or unconfirmed, prefix with "[Unconfirmed]"

Example output:
- Adjusted trips have a negative monetary value in invoices
- Adjusted trip invoices are tracked separately from regular invoices
- The ADJUSTED status appears after a post-billing price correction

RAW ANSWER:
${rawAnswer}

Extract the business rules now. Bullets only, no other text.`;

  try {
    if (mode === 'gemini') {
      const { callGemini, isGeminiConfigured } = await import(
        '@/lib/ai/gemini-client'
      );
      if (isGeminiConfigured()) {
        return await callGemini(distillPrompt);
      }
    }

    if (mode === 'claude-cli') {
      const { callClaudeCli, isClaudeCliAvailable } = await import(
        '@/lib/ai/claude-cli-client'
      );
      const { available } = await isClaudeCliAvailable();
      if (available) {
        return await callClaudeCli(distillPrompt, {
          model:
            (model as
              | 'claude-opus-4-6'
              | 'claude-sonnet-4-6'
              | 'claude-haiku-4-5-20251001') ||
            'claude-haiku-4-5-20251001',
        });
      }
    }
  } catch (err) {
    console.warn(
      '[KB Update] AI distillation failed, using fallback:',
      (err as Error).message
    );
  }

  // Fallback: simple extraction without AI
  return extractBulletsFromText(rawAnswer);
}

/**
 * Non-AI fallback — extract lines that look like facts/rules.
 */
function extractBulletsFromText(text: string): string {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const bullets: string[] = [];

  for (const line of lines) {
    if (
      line.startsWith('-') ||
      line.startsWith('\u2022') ||
      line.startsWith('*')
    ) {
      const clean = line.replace(/^[-\u2022*]\s*/, '').trim();
      const stripped = clean.replace(/\*\*/g, '');
      if (stripped.length > 10 && stripped.length < 200) {
        bullets.push(`- ${stripped}`);
      }
    }
  }

  if (bullets.length === 0) {
    const sentences = text
      .split(/[.!?]\s+/)
      .filter((s) => s.trim().length > 20);
    return sentences
      .slice(0, 5)
      .map((s) => `- ${s.trim()}`)
      .join('\n');
  }

  return bullets.join('\n');
}
