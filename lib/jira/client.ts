/**
 * Jira Cloud REST API v3 Client
 *
 * Target: yassir.atlassian.net
 * Auth: Basic Auth (email + API token)
 * Docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
 */

// ────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────

export interface JiraConfig {
  domain: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

export function getJiraConfig(): JiraConfig | null {
  const domain = process.env.JIRA_DOMAIN;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const projectKey = process.env.JIRA_PROJECT_KEY || 'CMB';

  if (!domain || !email || !apiToken) return null;

  // Reject placeholder values that user forgot to replace
  if (email.includes('REPLACE') || apiToken.includes('REPLACE')) return null;

  return { domain, email, apiToken, projectKey };
}

export function isJiraConfigured(): boolean {
  return getJiraConfig() !== null;
}

function getAuthHeader(config: JiraConfig): string {
  const credentials = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');
  return `Basic ${credentials}`;
}

// ────────────────────────────────────
// TYPES
// ────────────────────────────────────

export interface JiraTicket {
  ticketId: string;
  title: string;
  status: string;
  type: string;
  sprint: string;
  assignee: string;
  reporter: string;
  userStory: string;
  acceptanceCriteria: string[];
  labels: string[];
  components: string[];
  module: string;
  priority: string;
  created: string;
  updated: string;
  figmaLinks: string[];
  attachments: { filename: string; url: string }[];
  _isMock: boolean;
}

export interface JiraComment {
  id: string;
  body: unknown;
  created: string;
  author: { displayName: string };
}

// ────────────────────────────────────
// ERROR HANDLING
// ────────────────────────────────────

export class JiraAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'JiraAPIError';
  }
}

// ────────────────────────────────────
// HTTP HELPERS
// ────────────────────────────────────

export async function jiraGet<T = unknown>(config: JiraConfig, path: string): Promise<T> {
  const url = `https://${config.domain}/rest/api/3${path}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getAuthHeader(config),
      Accept: 'application/json',
    },
    // Don't cache Jira responses
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new JiraAPIError(`Jira ${response.status}: ${text}`, response.status, text);
  }

  return response.json();
}

export async function jiraPost<T = unknown>(
  config: JiraConfig,
  path: string,
  body: unknown
): Promise<T> {
  const url = `https://${config.domain}/rest/api/3${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(config),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new JiraAPIError(`Jira ${response.status}: ${text}`, response.status, text);
  }

  // Handle empty responses (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return {} as T;
}

// ────────────────────────────────────
// ADF (Atlassian Document Format) PARSER
// ────────────────────────────────────

/**
 * Jira API v3 returns descriptions in Atlassian Document Format (ADF).
 * This function extracts readable plain text from ADF JSON.
 */
export function adfToText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node !== 'object') return '';

  const n = node as Record<string, unknown>;

  if (n.type === 'text') return (n.text as string) || '';

  if (n.type === 'hardBreak') return '\n';

  if (n.type === 'paragraph' || n.type === 'heading') {
    const inner = Array.isArray(n.content)
      ? (n.content as unknown[]).map(adfToText).join('')
      : '';
    return inner + '\n';
  }

  if (n.type === 'bulletList' || n.type === 'orderedList') {
    return (
      (Array.isArray(n.content)
        ? (n.content as unknown[])
            .map((item: unknown, i: number) => {
              const text = adfToText(item).trim();
              const prefix = n.type === 'orderedList' ? `${i + 1}. ` : '- ';
              return prefix + text;
            })
            .join('\n')
        : '') + '\n'
    );
  }

  if (n.type === 'listItem') {
    return Array.isArray(n.content)
      ? (n.content as unknown[]).map(adfToText).join('')
      : '';
  }

  if (n.type === 'codeBlock') {
    const inner = Array.isArray(n.content)
      ? (n.content as unknown[]).map(adfToText).join('')
      : '';
    return '```\n' + inner + '\n```\n';
  }

  if (n.type === 'blockquote') {
    const inner = Array.isArray(n.content)
      ? (n.content as unknown[]).map(adfToText).join('')
      : '';
    return (
      inner
        .split('\n')
        .map((l: string) => '> ' + l)
        .join('\n') + '\n'
    );
  }

  if (n.type === 'inlineCard' || n.type === 'blockCard') {
    const attrs = n.attrs as Record<string, unknown> | undefined;
    return (attrs?.url as string) || '';
  }

  if (n.type === 'mention') {
    const attrs = n.attrs as Record<string, unknown> | undefined;
    return '@' + ((attrs?.text as string) || 'someone');
  }

  // For doc, table, tableRow, tableCell, etc. — recurse into content
  if (Array.isArray(n.content)) {
    return (n.content as unknown[]).map(adfToText).join('');
  }

  return '';
}

/**
 * Extract acceptance criteria from description text.
 * Looks for common patterns like "Acceptance Criteria:", bullet lists, etc.
 */
export function extractAcceptanceCriteria(descText: string): string[] {
  const lines = descText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const criteria: string[] = [];
  let inACSection = false;

  for (const line of lines) {
    // Detect AC section headers (common patterns)
    const isACHeader =
      /^(acceptance\s*criteria|ac\s*:|ac\b|given\/when\/then|definition\s*of\s*done|dod)/i.test(
        line
      );
    if (isACHeader) {
      inACSection = true;
      continue;
    }

    if (inACSection) {
      // Stop at next section header
      if (
        /^(#{1,3}\s|description|summary|notes|technical|design|ui|ux)/i.test(line) &&
        criteria.length > 0
      ) {
        break;
      }
      const cleaned = line.replace(/^[-*\d.)]+\s*/, '').trim();
      if (cleaned.length > 3) {
        criteria.push(cleaned);
      }
    }
  }

  // Fallback: if no AC section found, collect all bullet points
  if (criteria.length === 0) {
    for (const line of lines) {
      if (/^[-*]\s+/.test(line)) {
        const cleaned = line.replace(/^[-*]+\s*/, '').trim();
        if (cleaned.length > 3) criteria.push(cleaned);
      }
    }
  }

  // Fallback 2: if still nothing, take numbered items
  if (criteria.length === 0) {
    for (const line of lines) {
      if (/^\d+[.)]\s+/.test(line)) {
        const cleaned = line.replace(/^\d+[.)]\s*/, '').trim();
        if (cleaned.length > 3) criteria.push(cleaned);
      }
    }
  }

  return criteria;
}

// ────────────────────────────────────
// FIGMA LINK EXTRACTION
// ────────────────────────────────────

export function extractFigmaLinks(text: string): string[] {
  const regex = /https?:\/\/(www\.)?figma\.com\/(file|proto|design|board)\/[^\s)\]"'<>]+/g;
  return [...new Set(text.match(regex) || [])];
}

// ────────────────────────────────────
// MODULE AUTO-DETECTION
// ────────────────────────────────────

export function detectModule(
  labels: string[],
  components: string[],
  title: string,
  description: string
): string {
  const text = [...labels, ...components, title, description.substring(0, 500)]
    .join(' ')
    .toLowerCase();

  const rules: [string, string[]][] = [
    ['B2B Portal — Login', ['login', 'auth', 'sign in', 'sso', 'registration', 'onboard']],
    ['B2B Portal — Dashboard', ['dashboard', 'home page', 'widget', 'landing']],
    ['B2B Portal — Users & Groups', ['users', 'groups', 'invite', 'members', 'team']],
    ['B2B Portal — Programs', ['program', 'ride schedule', 'geo-fence', 'geofenc']],
    [
      'B2B Portal — Book Rides',
      ['book ride', 'booking', 'multi-stop', 'ride request', 'scheduled ride'],
    ],
    [
      'B2B Portal — Payments',
      ['payment', 'prepaid', 'postpaid', 'wallet', 'top-up', 'invoice', 'budget'],
    ],
    ['B2B Portal — Trips', ['trips', 'trip history', 'ride history', 'export ride']],
    ['B2B Portal — Referrals', ['referral', 'refer']],
    ['B2B Portal — Business Challenge', ['challenge', 'gamification', 'badge', 'tier']],
    ['B2B Portal — Gift Cards', ['gift card', 'voucher', 'giftcard']],
    ['B2B Portal — Support', ['support', 'faq', 'help center', 'helpline']],
    ['B2B Portal — Account', ['account', 'profile', 'legal info', 'password']],
    ['Admin Panel — Enterprises', ['enterprise', 'admin panel', 'admin enterprise']],
    ['Admin Panel — Payments', ['admin payment', 'admin invoice', 'admin budget']],
    ['Admin Panel — Users', ['admin user', 'verify user', 'reinvite', 'admin rider']],
    ['B2C WebApp — Auth', ['b2c login', 'b2c auth', 'otp', 'phone verification', 'b2c register']],
    ['B2C WebApp — Ride Booking', ['b2c ride', 'b2c booking', 'web booking', 'b2c book']],
    ['B2C WebApp — Promotions', ['promo', 'promotion', 'coupon', 'promo code']],
  ];

  for (const [module, keywords] of rules) {
    if (keywords.some((kw) => text.includes(kw))) return module;
  }

  return 'Unknown Module';
}

// ────────────────────────────────────
// SPRINT EXTRACTION
// ────────────────────────────────────

interface JiraSprint {
  id: number;
  name: string;
  state: string;
}

export function extractSprint(fields: Record<string, unknown>): string {
  // Jira Software stores sprint in customfield_10020 (most common)
  // Try multiple common field IDs
  const sprintField =
    (fields.customfield_10020 as JiraSprint[] | undefined) ||
    (fields.customfield_10016 as JiraSprint[] | undefined) ||
    (fields.sprint as JiraSprint[] | undefined);

  if (!sprintField) return 'Backlog';

  if (Array.isArray(sprintField)) {
    const active = sprintField.find((s) => s.state === 'active');
    return (active || sprintField[sprintField.length - 1])?.name || 'Backlog';
  }

  if (typeof sprintField === 'object' && (sprintField as JiraSprint).name) {
    return (sprintField as JiraSprint).name;
  }

  return String(sprintField);
}

// ════════════════════════════════════
// PUBLIC API FUNCTIONS
// ════════════════════════════════════

interface JiraIssueFields {
  summary?: string;
  status?: { name: string };
  issuetype?: { name: string };
  priority?: { name: string };
  assignee?: { displayName: string };
  reporter?: { displayName: string };
  labels?: string[];
  components?: { name: string }[];
  description?: unknown;
  attachment?: { filename: string; content: string }[];
  created?: string;
  updated?: string;
  [key: string]: unknown;
}

interface JiraIssue {
  key: string;
  fields: JiraIssueFields;
}

/**
 * Fetch a single Jira ticket by ID.
 * Returns null if Jira is not configured (signals mock mode).
 * Throws on API/network errors.
 */
export async function fetchJiraTicket(ticketId: string): Promise<JiraTicket | null> {
  const config = getJiraConfig();
  if (!config) return null;

  const issue = await jiraGet<JiraIssue>(config, `/issue/${ticketId}`);
  const f = issue.fields;

  const descText = adfToText(f.description);
  const acceptanceCriteria = extractAcceptanceCriteria(descText);

  // Extract user story sentence
  const storyMatch = descText.match(
    /as\s+an?\s+.+?,?\s*i\s+want\s+.+?(so\s+that\s+.+?)?[.\n]/i
  );
  const userStory = storyMatch
    ? storyMatch[0].trim()
    : descText.split('\n').find((l: string) => l.trim().length > 10)?.trim() ||
      descText.substring(0, 300);

  const labels = (f.labels || []) as string[];
  const components = ((f.components || []) as { name: string }[]).map((c) => c.name);
  const figmaLinks = extractFigmaLinks(descText);

  return {
    ticketId: issue.key,
    title: f.summary || '',
    status: f.status?.name || 'Unknown',
    type: f.issuetype?.name || 'Story',
    sprint: extractSprint(f),
    assignee: f.assignee?.displayName || 'Unassigned',
    reporter: f.reporter?.displayName || 'Unknown',
    userStory,
    acceptanceCriteria,
    labels,
    components,
    module: detectModule(labels, components, f.summary || '', descText),
    priority: f.priority?.name || 'P2 - Medium',
    created: (f.created as string) || '',
    updated: (f.updated as string) || '',
    figmaLinks,
    attachments: ((f.attachment || []) as { filename: string; content: string }[]).map((a) => ({
      filename: a.filename,
      url: a.content,
    })),
    _isMock: false,
  };
}

/**
 * Post a comment to a Jira ticket.
 * Comments use Atlassian Document Format (ADF).
 */
export async function postJiraComment(
  ticketId: string,
  commentText: string,
  tagPrefix: string = '[QA-AI-Agent]'
): Promise<{ id: string }> {
  const config = getJiraConfig();
  if (!config)
    throw new Error(
      'Jira is not configured. Edit .env.local and add your JIRA_EMAIL and JIRA_API_TOKEN.'
    );

  // Build ADF body — split text into paragraphs
  const paragraphs = `${tagPrefix} ${commentText}`.split('\n\n').filter(Boolean);

  const adfContent = paragraphs.map((para) => ({
    type: 'paragraph' as const,
    content: [{ type: 'text' as const, text: para }],
  }));

  const result = await jiraPost<{ id: string }>(config, `/issue/${ticketId}/comment`, {
    body: {
      type: 'doc',
      version: 1,
      content: adfContent,
    },
  });

  return { id: result.id };
}

/**
 * Post multiple findings as separate comments to a Jira ticket.
 */
export async function postJiraComments(
  ticketId: string,
  comments: { title: string; body: string; type: string }[]
): Promise<{ success: boolean; postedCount: number; errors: string[] }> {
  const errors: string[] = [];
  let postedCount = 0;

  for (const comment of comments) {
    try {
      const text = `**${comment.type}: ${comment.title}**\n\n${comment.body}`;
      await postJiraComment(ticketId, text);
      postedCount++;
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      errors.push(`Failed "${comment.title}": ${message}`);
    }
  }

  return { success: errors.length === 0, postedCount, errors };
}

/**
 * Create a new Bug ticket in Jira.
 */
export async function createJiraBug(params: {
  summary: string;
  description: string;
  severity: string;
  labels?: string[];
  linkedTicketId?: string;
  projectKey?: string;
}): Promise<{ ticketId: string; url: string }> {
  const config = getJiraConfig();
  if (!config) throw new Error('Jira is not configured. Edit .env.local and add your credentials.');

  const project = params.projectKey || config.projectKey;

  const priorityMap: Record<string, string> = {
    // From UI severity buttons
    critical: 'P0 - Critical',
    high: 'P1 - High',
    medium: 'P2 - Medium',
    low: 'P3 - Low',
    // Direct P-level keys
    p0: 'P0 - Critical',
    p1: 'P1 - High',
    p2: 'P2 - Medium',
    p3: 'P3 - Low',
    // Fallbacks for old-style names
    highest: 'P0 - Critical',
    // Default if nothing matches
    none: 'No Priority',
  };

  // Build description in ADF
  const descParagraphs = params.description.split('\n\n').filter(Boolean);
  const adfContent = descParagraphs.map((para) => ({
    type: 'paragraph' as const,
    content: [{ type: 'text' as const, text: para }],
  }));

  const result = await jiraPost<{ key: string }>(config, '/issue', {
    fields: {
      project: { key: project },
      summary: params.summary,
      description: {
        type: 'doc',
        version: 1,
        content: adfContent,
      },
      issuetype: { name: 'Bug' },
      priority: { name: priorityMap[params.severity] || 'P2 - Medium' },
      labels: [...(params.labels || []), 'qa-ai-agent'],
    },
  });

  const ticketId = result.key;

  // Link to parent story if provided
  if (params.linkedTicketId) {
    try {
      await jiraPost(config, '/issueLink', {
        type: { name: 'Relates' },
        inwardIssue: { key: ticketId },
        outwardIssue: { key: params.linkedTicketId },
      });
    } catch {
      // Non-critical — bug was created, link just failed
    }
  }

  return {
    ticketId,
    url: `https://${config.domain}/browse/${ticketId}`,
  };
}

/**
 * Test the Jira connection. Returns status info.
 */
export async function testJiraConnection(): Promise<{
  connected: boolean;
  domain?: string;
  user?: string;
  email?: string;
  error?: string;
}> {
  const config = getJiraConfig();

  if (!config) {
    return {
      connected: false,
      error:
        'Jira credentials not found. Open .env.local and set JIRA_EMAIL and JIRA_API_TOKEN.',
    };
  }

  try {
    const me = await jiraGet<{ displayName: string; emailAddress: string }>(config, '/myself');
    return {
      connected: true,
      domain: config.domain,
      user: me.displayName,
      email: me.emailAddress,
    };
  } catch (err) {
    const error = err instanceof JiraAPIError ? err : new Error('Unknown error');
    let message = error.message;

    if (error instanceof JiraAPIError) {
      if (error.status === 401) {
        message =
          'Authentication failed. Your JIRA_API_TOKEN may be invalid or expired. Generate a new one at https://id.atlassian.com/manage-profile/security/api-tokens';
      }
      if (error.status === 403) {
        message =
          'Access denied. Your Jira account may not have permission to access this resource.';
      }
    }
    return { connected: false, domain: config.domain, error: message };
  }
}

// ════════════════════════════════════
// TEST ISSUE CREATION (XRAY)
// ════════════════════════════════════

import { getJiraPriority, getTestLabels, TEST_ISSUE_TYPE, TEST_LINK_TYPE, FALLBACK_LINK_TYPE, SQUAD_FIELD_ID, DEFAULT_SQUAD, DEFAULT_COMPONENTS } from './fields-config';

/**
 * Convert plain text to Atlassian Document Format (ADF).
 * Required for description fields in Jira REST API v3.
 */
export function textToADF(text: string): Record<string, unknown> {
  const lines = text.split('\n');
  const content: Record<string, unknown>[] = [];

  for (const line of lines) {
    if (line.trim()) {
      // Check if it's a heading (starts with h3. or **)
      if (line.startsWith('h3. ')) {
        content.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: line.replace('h3. ', '') }],
        });
      } else if (line.startsWith('**') && line.endsWith('**')) {
        content.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: line.replace(/\*\*/g, '') }],
        });
      } else if (line.startsWith('* ')) {
        // Bullet point - add as paragraph for simplicity
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: line }],
        });
      } else if (line.startsWith('# ')) {
        // Numbered item - add as paragraph
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: line.substring(2) }],
        });
      } else {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: line }],
        });
      }
    } else {
      // Empty line - add empty paragraph for spacing
      content.push({ type: 'paragraph', content: [] });
    }
  }

  return { type: 'doc', version: 1, content };
}

/**
 * Escape special characters in JQL summary search.
 */
function escapeJqlSummary(summary: string): string {
  return summary.replace(/["\\]/g, '\\$&');
}

/**
 * Create a Test issue in Jira (for XRAY integration).
 * Returns the created issue key and URL.
 */
export async function createTestIssue(params: {
  summary: string;
  description: string;
  priority: string;
  testType?: string;
  labels?: string[];
  projectKey?: string;
  customFields?: Record<string, unknown>;
}): Promise<{ ticketId: string; url: string }> {
  const config = getJiraConfig();
  if (!config) {
    throw new Error('Jira is not configured. Edit .env.local and add your credentials.');
  }

  const project = params.projectKey || config.projectKey;
  const jiraPriority = getJiraPriority(params.priority);
  const labels = getTestLabels(params.testType || 'functional', params.labels);

  // Build description in ADF
  const adfDescription = textToADF(params.description);

  const fields: Record<string, unknown> = {
    project: { key: project },
    summary: params.summary,
    description: adfDescription,
    issuetype: { name: TEST_ISSUE_TYPE },
    priority: { name: jiraPriority },
    labels,
    // Required fields for CMB project
    components: DEFAULT_COMPONENTS.map((name) => ({ name })),
    [SQUAD_FIELD_ID]: { value: DEFAULT_SQUAD },
    ...params.customFields,
  };

  try {
    const result = await jiraPost<{ key: string }>(config, '/issue', { fields });

    return {
      ticketId: result.key,
      url: `https://${config.domain}/browse/${result.key}`,
    };
  } catch (err) {
    // If priority field causes a 400 error, retry WITHOUT the priority field
    if (err instanceof JiraAPIError && err.status === 400) {
      const errorText = String(err.details || err.message).toLowerCase();
      if (errorText.includes('priority')) {
        console.warn('Priority field caused error, retrying without priority...');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { priority: _p, ...fieldsWithoutPriority } = fields;
        const result = await jiraPost<{ key: string }>(config, '/issue', {
          fields: fieldsWithoutPriority,
        });
        return {
          ticketId: result.key,
          url: `https://${config.domain}/browse/${result.key}`,
        };
      }
    }
    throw err;
  }
}

/**
 * Link two Jira issues together.
 * Used to link Test issues to their parent Story.
 */
export async function linkIssues(params: {
  inwardKey: string;
  outwardKey: string;
  linkType?: string;
}): Promise<void> {
  const config = getJiraConfig();
  if (!config) {
    throw new Error('Jira is not configured. Edit .env.local and add your credentials.');
  }

  const linkType = params.linkType || TEST_LINK_TYPE;

  try {
    await jiraPost(config, '/issueLink', {
      type: { name: linkType },
      inwardIssue: { key: params.inwardKey },
      outwardIssue: { key: params.outwardKey },
    });
  } catch (err) {
    // If the link type doesn't exist, try fallback
    if (err instanceof JiraAPIError && err.status === 400) {
      const errorText = String(err.details || err.message).toLowerCase();
      if (errorText.includes('link type') && linkType !== FALLBACK_LINK_TYPE) {
        console.warn(`Link type "${linkType}" not found, trying "${FALLBACK_LINK_TYPE}"...`);
        await jiraPost(config, '/issueLink', {
          type: { name: FALLBACK_LINK_TYPE },
          inwardIssue: { key: params.inwardKey },
          outwardIssue: { key: params.outwardKey },
        });
        return;
      }
    }
    throw err;
  }
}

/**
 * Search for an existing issue by exact summary match.
 * Used for deduplication before creating Test issues.
 */
export async function findIssueByExactSummary(params: {
  summary: string;
  projectKey?: string;
  issueType?: string;
}): Promise<{ key: string; url: string } | null> {
  const config = getJiraConfig();
  if (!config) {
    throw new Error('Jira is not configured. Edit .env.local and add your credentials.');
  }

  const project = params.projectKey || config.projectKey;
  const issueType = params.issueType || TEST_ISSUE_TYPE;
  const escapedSummary = escapeJqlSummary(params.summary);

  // JQL query for summary containing the exact text
  // Note: JQL ~ is a text search, we'll verify exact match in code
  const jql = `project = "${project}" AND issuetype = "${issueType}" AND summary ~ "\\"${escapedSummary}\\""`;

  try {
    const response = await jiraGet<{ issues: Array<{ key: string; fields: { summary: string } }> }>(
      config,
      `/search?jql=${encodeURIComponent(jql)}&maxResults=5&fields=summary`
    );

    if (response.issues && response.issues.length > 0) {
      // Verify exact match (JQL ~ is fuzzy)
      for (const issue of response.issues) {
        if (issue.fields.summary.trim().toLowerCase() === params.summary.trim().toLowerCase()) {
          return {
            key: issue.key,
            url: `https://${config.domain}/browse/${issue.key}`,
          };
        }
      }
    }

    return null;
  } catch (err) {
    // If search fails, log but don't block creation
    console.warn('Deduplication search failed:', err);
    return null;
  }
}

// ════════════════════════════════════
// GENERIC ISSUE CREATION
// ════════════════════════════════════

/**
 * Create any Jira issue with given fields.
 * This is a generic function used by all issue type creators.
 *
 * Handles smart retry logic:
 * 1. If priority field causes error, retry without it
 * 2. If custom fields cause error, retry without them (base fields only)
 */
export async function createJiraIssue(
  fields: Record<string, unknown>
): Promise<{ issueKey: string; url: string }> {
  const config = getJiraConfig();
  if (!config) {
    throw new Error(
      'Jira is not configured. Ensure .env.local has JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN set with real values, then restart the dev server.'
    );
  }

  try {
    const result = await jiraPost<{ key: string }>(config, '/issue', { fields });
    return {
      issueKey: result.key,
      url: `https://${config.domain}/browse/${result.key}`,
    };
  } catch (err) {
    if (!(err instanceof JiraAPIError) || err.status !== 400) {
      throw err;
    }

    const errorText = String(err.details || err.message).toLowerCase();

    // Retry 1: If priority caused error, retry without it
    if (fields.priority && errorText.includes('priority')) {
      console.warn('[Jira] Priority field caused error, retrying without priority...');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { priority: _p, ...fieldsWithoutPriority } = fields;
      try {
        const result = await jiraPost<{ key: string }>(config, '/issue', {
          fields: fieldsWithoutPriority,
        });
        return {
          issueKey: result.key,
          url: `https://${config.domain}/browse/${result.key}`,
        };
      } catch (retryErr) {
        // Continue to custom field retry
        if (!(retryErr instanceof JiraAPIError) || retryErr.status !== 400) {
          throw retryErr;
        }
      }
    }

    // Retry 2: If error mentions "Atlassian Document", convert string fields to ADF
    // This handles cases where fields need ADF format but received plain strings
    const ADF_FIELDS = ['environment', 'customfield_10388', 'customfield_10389', 'customfield_10390'];
    const originalErrorText = String(err.details || err.message);

    if (originalErrorText.includes('Atlassian Document') || originalErrorText.toLowerCase().includes('adf')) {
      console.warn('[Jira] ADF format error detected, converting fields to ADF...');

      const convertedFields: Record<string, unknown> = { ...fields };
      let conversionsApplied = 0;

      for (const fieldId of ADF_FIELDS) {
        const value = convertedFields[fieldId];
        if (typeof value === 'string') {
          console.warn(`[Jira] Converting ${fieldId} to ADF format`);
          convertedFields[fieldId] = textToADF(value);
          conversionsApplied++;
        }
      }

      if (conversionsApplied > 0) {
        try {
          const result = await jiraPost<{ key: string }>(config, '/issue', { fields: convertedFields });
          console.warn('[Jira] Success after ADF conversion');
          return {
            issueKey: result.key,
            url: `https://${config.domain}/browse/${result.key}`,
          };
        } catch (adfErr) {
          console.error('[Jira] Still failing after ADF conversion:', adfErr instanceof Error ? adfErr.message : String(adfErr));
          // Fall through to field removal as last resort
        }
      }
    }

    // Retry 3: Last resort - remove optional custom fields (keep required)
    // Squad (customfield_10513) is REQUIRED and must NOT be removed
    const REQUIRED_CUSTOM_FIELDS = ['customfield_10513']; // Squad

    const optionalCustomFieldKeys = Object.keys(fields).filter(
      (k) => k.startsWith('customfield_') && !REQUIRED_CUSTOM_FIELDS.includes(k)
    );

    if (optionalCustomFieldKeys.length > 0) {
      console.warn('[Jira] Got 400 error with custom fields, retrying without optional custom fields...');
      console.warn('[Jira] Error:', errorText.substring(0, 500));
      console.warn('[Jira] Removing optional custom fields:', optionalCustomFieldKeys.join(', '));
      console.warn('[Jira] Keeping required custom fields:', REQUIRED_CUSTOM_FIELDS.join(', '));

      // Build fields keeping required custom fields, removing optional ones
      // Also remove environment if it failed (system field, not customfield_)
      const baseFields: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(fields)) {
        // Skip optional custom fields
        if (k.startsWith('customfield_') && !REQUIRED_CUSTOM_FIELDS.includes(k)) {
          continue;
        }
        // Skip environment if it was likely the cause of the error
        if (k === 'environment' && originalErrorText.includes('environment')) {
          console.warn('[Jira] Also removing environment field due to error');
          continue;
        }
        baseFields[k] = v;
      }

      try {
        const result = await jiraPost<{ key: string }>(config, '/issue', { fields: baseFields });
        console.warn('[Jira] Success without optional custom fields. Some field IDs may need reconfiguration.');
        return {
          issueKey: result.key,
          url: `https://${config.domain}/browse/${result.key}`,
        };
      } catch (baseErr) {
        console.error('[Jira] Still failing with base fields:', baseErr instanceof Error ? baseErr.message : String(baseErr));
        throw baseErr;
      }
    }

    // No recovery possible, throw original error
    throw err;
  }
}
