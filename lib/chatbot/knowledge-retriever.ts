/**
 * Retrieves relevant knowledge base content for a user question.
 *
 * Scoring strategy (phrase-first):
 * 1. Exact phrase match in heading → 500 pts
 * 2. Exact phrase match in module name → 300 pts
 * 3. Exact phrase match in content → 200 pts
 * 4. All key words present → 50 pts
 * 5. Individual word matches → 1-5 pts each (capped)
 */

import * as fs from 'fs';
import * as path from 'path';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

interface ModuleDoc {
  name: string;
  slug: string;
  content: string;
  source: string;
}

interface RetrievalResult {
  relevantDocs: {
    name: string;
    slug: string;
    content: string;
    score: number;
  }[];
  totalModulesSearched: number;
  hasRelevantContent: boolean;
}

/**
 * Load all module documents from the knowledge base.
 */
function loadAllModules(): ModuleDoc[] {
  const modules: ModuleDoc[] = [];
  const dirs = [
    { dir: path.join(KB_DIR, 'modules'), source: 'modules' },
    { dir: path.join(KB_DIR, 'jira-context'), source: 'jira-context' },
  ];

  const seen = new Set<string>();

  for (const { dir, source } of dirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && !f.startsWith('.'));
    for (const file of files) {
      const slug = file.replace('.md', '');
      if (seen.has(slug)) continue;
      seen.add(slug);

      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const nameMatch = content.match(/^#\s+(.+)$/m);
      const name = nameMatch ? nameMatch[1] : slug.replace(/-/g, ' ');

      modules.push({ name, slug, content, source });
    }
  }

  // Also load the main project-context.md if it exists
  const mainPath = path.join(KB_DIR, 'project-context.md');
  if (fs.existsSync(mainPath)) {
    modules.push({
      name: 'Project Overview',
      slug: 'project-overview',
      content: fs.readFileSync(mainPath, 'utf-8'),
      source: 'main',
    });
  }

  return modules;
}

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in',
  'with', 'to', 'for', 'of', 'how', 'what', 'when', 'where', 'why', 'who',
  'does', 'do', 'can', 'could', 'would', 'should', 'tell', 'me', 'about',
  'more', 'please', 'explain', 'describe', 'between', 'this', 'that',
  'there', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 'be',
  'i', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'mean', 'means',
  'work', 'works', 'use', 'used',
]);

/**
 * Extract the core phrase from a question by stripping question words.
 * "what is adjusted trips" → "adjusted trips"
 * "how does invoice generation work" → "invoice generation"
 */
function extractCorePhrase(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(
      /^(what|how|why|when|where|who|is|are|does|do|can|could|would|tell|me|about|the|a|an)\s+/g,
      ''
    )
    .replace(
      /\s+(is|are|mean|means|work|works|used|for|in|the|a|an)$/g,
      ''
    )
    .trim();
}

/**
 * Score a module's relevance to a question.
 * Phrase matches score much higher than individual word matches.
 */
function scoreRelevance(
  question: string,
  moduleContent: string,
  moduleName: string
): number {
  const questionLower = question.toLowerCase().trim();
  const contentLower = moduleContent.toLowerCase();
  const nameLower = moduleName.toLowerCase();

  let score = 0;

  // ── HIGHEST PRIORITY: Exact phrase match ──
  const corePhrase = extractCorePhrase(questionLower);

  if (corePhrase.length > 3) {
    // Phrase in headings (strongest signal)
    const headings = moduleContent.match(/^#{1,4}\s+(.+)$/gm) || [];
    for (const heading of headings) {
      const headingText = heading.replace(/^#{1,4}\s+/, '').toLowerCase();
      if (headingText.includes(corePhrase)) {
        score += 500;
      }
    }

    // Phrase in module name / filename
    if (nameLower.includes(corePhrase)) {
      score += 300;
    }

    // Phrase in content body
    if (contentLower.includes(corePhrase)) {
      score += 200;
    }
  }

  // ── HIGH PRIORITY: All key words present together ──
  const questionWords = questionLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (questionWords.length >= 2) {
    const allPresent = questionWords.every((w) => contentLower.includes(w));
    if (allPresent) {
      score += 50;
    }
  }

  // ── MEDIUM PRIORITY: Individual word matches (capped) ──
  for (const word of questionWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = contentLower.match(regex);
    if (matches) {
      score += Math.min(matches.length, 5);
    }
    if (nameLower.includes(word)) {
      score += 10;
    }
  }

  // ── LOW PRIORITY: Domain term bonus ──
  const domainTerms = [
    'invoice', 'payment', 'booking', 'ride', 'trip', 'driver', 'rider',
    'program', 'group', 'user', 'admin', 'enterprise', 'referral',
    'challenge', 'gift card', 'voucher', 'budget', 'wallet', 'prepaid',
    'postpaid', 'commission', 'discount', 'cashback', 'login',
    'registration', 'profile', 'legal', 'support', 'faq',
  ];

  for (const term of domainTerms) {
    if (questionLower.includes(term) && contentLower.includes(term)) {
      score += 8;
    }
  }

  return score;
}

/**
 * Retrieve the most relevant knowledge base content for a question.
 */
export function retrieveRelevantContext(
  question: string,
  maxDocs: number = 5
): RetrievalResult {
  const modules = loadAllModules();

  if (modules.length === 0) {
    return {
      relevantDocs: [],
      totalModulesSearched: 0,
      hasRelevantContent: false,
    };
  }

  const scored = modules.map((mod) => ({
    name: mod.name,
    slug: mod.slug,
    content: mod.content,
    score: scoreRelevance(question, mod.content, mod.name),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Minimum relevance threshold
  const relevant = scored.filter((d) => d.score > 5).slice(0, maxDocs);

  // If top result dominates (3x higher than second), return only it
  // Prevents mixing unrelated modules
  if (
    relevant.length > 1 &&
    relevant[0].score > relevant[1].score * 3
  ) {
    const top = relevant[0];
    return {
      relevantDocs: [
        {
          ...top,
          content:
            top.content.length > 8000
              ? top.content.substring(0, 8000) + '\n\n... (truncated)'
              : top.content,
        },
      ],
      totalModulesSearched: modules.length,
      hasRelevantContent: true,
    };
  }

  // Truncate content to fit in prompt (max ~8000 chars per doc)
  const truncated = relevant.map((d) => ({
    ...d,
    content:
      d.content.length > 8000
        ? d.content.substring(0, 8000) + '\n\n... (truncated)'
        : d.content,
  }));

  return {
    relevantDocs: truncated,
    totalModulesSearched: modules.length,
    hasRelevantContent: relevant.length > 0,
  };
}

/**
 * Get list of all available modules (for suggested questions).
 */
export function getAvailableModules(): { name: string; slug: string }[] {
  return loadAllModules().map((m) => ({ name: m.name, slug: m.slug }));
}
