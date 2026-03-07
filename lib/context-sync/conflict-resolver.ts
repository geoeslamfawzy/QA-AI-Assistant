/**
 * Conflict Resolver for Context Sync Service.
 *
 * Resolves conflicts when multiple tickets describe the same feature.
 * Strategy: The NEWER ticket always wins (it's an enhancement/revamp).
 */

import type { ParsedTicket, ConflictInfo, OverriddenTicket } from './types';

// ────────────────────────────────────
// CONFLICT RESOLUTION
// ────────────────────────────────────

export interface ResolvedModule {
  activeTickets: ParsedTicket[];
  overriddenTickets: OverriddenTicket[];
  conflicts: ConflictInfo[];
}

/**
 * Resolve conflicts within a module's tickets.
 * Returns active tickets (non-overridden) and a list of overridden tickets.
 *
 * Strategy:
 * 1. Normalize ticket titles for comparison
 * 2. Group tickets by similar titles
 * 3. For each group, keep the most recently updated ticket
 * 4. Optionally merge acceptance criteria from all versions
 */
export function resolveConflicts(tickets: ParsedTicket[]): ResolvedModule {
  // Sort by updated date DESC (newest first)
  const sorted = [...tickets].sort(
    (a, b) => b.updated.getTime() - a.updated.getTime()
  );

  const activeTickets: ParsedTicket[] = [];
  const overriddenTickets: OverriddenTicket[] = [];
  const conflicts: ConflictInfo[] = [];

  // Track seen normalized titles -> ticket key
  const seenTitles = new Map<string, string>();

  for (const ticket of sorted) {
    const normalizedTitle = normalizeTitle(ticket.title);

    // Check if a newer ticket already covers this feature
    const existingKey = findSimilarFeature(normalizedTitle, seenTitles);

    if (existingKey) {
      // This ticket is overridden by a newer one
      overriddenTickets.push({
        ticket,
        overriddenBy: existingKey,
      });

      conflicts.push({
        olderTicket: ticket.ticketId,
        newerTicket: existingKey,
        module: ticket.module,
        reason: `Similar title: "${ticket.title}" overridden by newer ticket`,
      });
    } else {
      // This is the newest ticket for this feature
      seenTitles.set(normalizedTitle, ticket.ticketId);
      activeTickets.push(ticket);
    }
  }

  return { activeTickets, overriddenTickets, conflicts };
}

/**
 * Resolve conflicts and merge acceptance criteria from overridden tickets.
 * This creates a richer context by including AC from all versions.
 */
export function resolveConflictsWithMerge(tickets: ParsedTicket[]): ResolvedModule {
  const result = resolveConflicts(tickets);

  // Build a map of ticket ID -> overridden tickets
  const overriddenByTicket = new Map<string, ParsedTicket[]>();
  for (const { ticket, overriddenBy } of result.overriddenTickets) {
    if (!overriddenByTicket.has(overriddenBy)) {
      overriddenByTicket.set(overriddenBy, []);
    }
    overriddenByTicket.get(overriddenBy)!.push(ticket);
  }

  // Merge AC from overridden tickets into active tickets
  for (const activeTicket of result.activeTickets) {
    const overridden = overriddenByTicket.get(activeTicket.ticketId) || [];

    if (overridden.length > 0) {
      // Collect unique AC from all versions
      const allAC = new Set<string>(activeTicket.acceptanceCriteria);
      for (const oldTicket of overridden) {
        oldTicket.acceptanceCriteria.forEach((ac) => allAC.add(ac));
      }
      activeTicket.acceptanceCriteria = [...allAC];
    }
  }

  return result;
}

// ────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────

/**
 * Normalize a ticket title for comparison.
 * Removes common prefixes, brackets, and normalizes whitespace.
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/^\[.*?\]\s*/, '') // Remove [WEBAPP], [B2B], etc.
    .replace(/^(feat|fix|update|improve|revamp|enhance|add|remove|refactor):\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find a similar feature title in the seen titles map.
 * Uses word overlap to detect related features.
 *
 * @param normalizedTitle - The normalized title to check
 * @param seenTitles - Map of normalized titles to ticket keys
 * @returns The key of the similar ticket, or null if none found
 */
function findSimilarFeature(
  normalizedTitle: string,
  seenTitles: Map<string, string>
): string | null {
  const words = extractSignificantWords(normalizedTitle);
  if (words.length === 0) return null;

  for (const [existingTitle, existingKey] of seenTitles) {
    const existingWords = extractSignificantWords(existingTitle);

    // Calculate word overlap percentage
    const overlap = words.filter((w) => existingWords.includes(w)).length;
    const minWords = Math.min(words.length, existingWords.length);

    // If 60%+ words overlap, consider it the same feature
    const overlapRatio = overlap / minWords;
    if (overlapRatio >= 0.6 && overlap >= 2) {
      return existingKey;
    }
  }

  return null;
}

/**
 * Extract significant words from a title (words > 3 chars, excluding common words).
 */
function extractSignificantWords(text: string): string[] {
  const stopWords = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'this',
    'that',
    'when',
    'user',
    'should',
    'able',
    'page',
    'button',
    'form',
  ]);

  return text
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));
}

/**
 * Get a summary of conflicts for logging/display.
 */
export function getConflictSummary(conflicts: ConflictInfo[]): string {
  if (conflicts.length === 0) {
    return 'No conflicts detected.';
  }

  const lines = [`${conflicts.length} conflict(s) resolved:`];
  for (const c of conflicts.slice(0, 10)) {
    lines.push(`  - ${c.olderTicket} → ${c.newerTicket} (${c.module})`);
  }

  if (conflicts.length > 10) {
    lines.push(`  ... and ${conflicts.length - 10} more`);
  }

  return lines.join('\n');
}
