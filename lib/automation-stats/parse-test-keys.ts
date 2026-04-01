/**
 * Parses test case keys from various input formats:
 *
 * - URLs: https://yassir.atlassian.net/browse/QATM-26662
 * - Concatenated URLs (no spaces)
 * - Bullet lists: * QATM-26846 or - QATM-26846
 * - Plain keys: QATM-26846, QATM-26847
 * - Space/newline separated
 *
 * Returns unique array of keys.
 */
export function parseTestKeys(input: string): string[] {
  if (!input?.trim()) return [];

  const matches = input.match(/[A-Z]+-\d+/g);
  if (!matches || matches.length === 0) return [];

  return [...new Set(matches)];
}
