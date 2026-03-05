import type { DiffEntry } from '@/lib/types/change-log';

/**
 * Simple line-by-line diff generation
 * For a more sophisticated diff, consider using a library like 'diff'
 */
export function generateDiff(
  originalContent: string,
  updatedContent: string
): DiffEntry[] {
  const originalLines = originalContent.split('\n');
  const updatedLines = updatedContent.split('\n');
  const diffs: DiffEntry[] = [];

  // Find sections (lines starting with ##)
  const sections = new Map<string, { original: string; updated: string }>();

  let currentSection = 'Header';
  let originalSectionContent: string[] = [];
  let updatedSectionContent: string[] = [];

  // Process original content
  for (const line of originalLines) {
    if (line.startsWith('## ')) {
      if (originalSectionContent.length > 0) {
        const existing = sections.get(currentSection) || { original: '', updated: '' };
        existing.original = originalSectionContent.join('\n');
        sections.set(currentSection, existing);
      }
      currentSection = line.replace('## ', '').trim();
      originalSectionContent = [];
    } else {
      originalSectionContent.push(line);
    }
  }
  // Don't forget the last section
  if (originalSectionContent.length > 0) {
    const existing = sections.get(currentSection) || { original: '', updated: '' };
    existing.original = originalSectionContent.join('\n');
    sections.set(currentSection, existing);
  }

  // Process updated content
  currentSection = 'Header';
  updatedSectionContent = [];

  for (const line of updatedLines) {
    if (line.startsWith('## ')) {
      if (updatedSectionContent.length > 0) {
        const existing = sections.get(currentSection) || { original: '', updated: '' };
        existing.updated = updatedSectionContent.join('\n');
        sections.set(currentSection, existing);
      }
      currentSection = line.replace('## ', '').trim();
      updatedSectionContent = [];
    } else {
      updatedSectionContent.push(line);
    }
  }
  if (updatedSectionContent.length > 0) {
    const existing = sections.get(currentSection) || { original: '', updated: '' };
    existing.updated = updatedSectionContent.join('\n');
    sections.set(currentSection, existing);
  }

  // Generate diffs for each section
  for (const [section, content] of sections) {
    const originalTrimmed = content.original.trim();
    const updatedTrimmed = content.updated.trim();

    if (originalTrimmed !== updatedTrimmed) {
      if (!originalTrimmed && updatedTrimmed) {
        diffs.push({
          section,
          action: 'ADDED',
          after: updatedTrimmed,
        });
      } else if (originalTrimmed && !updatedTrimmed) {
        diffs.push({
          section,
          action: 'REMOVED',
          before: originalTrimmed,
        });
      } else {
        diffs.push({
          section,
          action: 'MODIFIED',
          before: originalTrimmed,
          after: updatedTrimmed,
        });
      }
    }
  }

  return diffs;
}

/**
 * Generate a human-readable diff summary
 */
export function generateDiffSummary(diffs: DiffEntry[]): string {
  const summary: string[] = [];

  const added = diffs.filter(d => d.action === 'ADDED').length;
  const modified = diffs.filter(d => d.action === 'MODIFIED').length;
  const removed = diffs.filter(d => d.action === 'REMOVED').length;

  if (added > 0) summary.push(`${added} section(s) added`);
  if (modified > 0) summary.push(`${modified} section(s) modified`);
  if (removed > 0) summary.push(`${removed} section(s) removed`);

  if (summary.length === 0) {
    return 'No changes detected';
  }

  return summary.join(', ');
}

/**
 * Apply diffs to original content (for preview purposes)
 */
export function applyDiffs(
  originalContent: string,
  diffs: DiffEntry[]
): string {
  let result = originalContent;

  for (const diff of diffs) {
    switch (diff.action) {
      case 'ADDED':
        // Add new section at the end
        result += `\n\n## ${diff.section}\n\n${diff.after}`;
        break;

      case 'REMOVED':
        // Remove the section
        const removePattern = new RegExp(
          `## ${escapeRegex(diff.section)}[\\s\\S]*?(?=## |$)`,
          'g'
        );
        result = result.replace(removePattern, '');
        break;

      case 'MODIFIED':
        // Replace section content
        if (diff.before && diff.after) {
          result = result.replace(diff.before, diff.after);
        }
        break;
    }
  }

  // Clean up multiple newlines
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Compare two arrays and find differences
 */
export function compareArrays<T>(
  original: T[],
  updated: T[],
  keyFn: (item: T) => string
): {
  added: T[];
  removed: T[];
  unchanged: T[];
} {
  const originalKeys = new Set(original.map(keyFn));
  const updatedKeys = new Set(updated.map(keyFn));

  const added = updated.filter(item => !originalKeys.has(keyFn(item)));
  const removed = original.filter(item => !updatedKeys.has(keyFn(item)));
  const unchanged = original.filter(item => updatedKeys.has(keyFn(item)));

  return { added, removed, unchanged };
}

/**
 * Generate a unified diff format (for display)
 */
export function generateUnifiedDiff(
  original: string,
  updated: string,
  filename: string
): string {
  const originalLines = original.split('\n');
  const updatedLines = updated.split('\n');

  const lines: string[] = [
    `--- a/${filename}`,
    `+++ b/${filename}`,
  ];

  // Simple line-by-line comparison
  const maxLines = Math.max(originalLines.length, updatedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const origLine = originalLines[i] || '';
    const updLine = updatedLines[i] || '';

    if (origLine !== updLine) {
      if (origLine) lines.push(`- ${origLine}`);
      if (updLine) lines.push(`+ ${updLine}`);
    } else {
      lines.push(`  ${origLine}`);
    }
  }

  return lines.join('\n');
}
