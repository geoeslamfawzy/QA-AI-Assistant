/**
 * Collects automation statistics by querying Jira for test cases
 * using the XRAY `testSetTests()` JQL function.
 *
 * Uses the Jira Cloud `search/jql` POST endpoint with
 * `nextPageToken`-based pagination.
 */

import { SuiteConfig, StatsSnapshot, TestEntry } from './config';

const JIRA_DOMAIN = process.env.JIRA_DOMAIN || 'yassir.atlassian.net';

function getAuth(): string {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!email || !token) throw new Error('Jira not configured');
  return Buffer.from(`${email}:${token}`).toString('base64');
}

interface SearchResponse {
  issues: Array<{
    key: string;
    fields: {
      summary?: string;
      labels?: string[];
      issuetype?: { name: string };
    };
  }>;
  isLast: boolean;
  nextPageToken?: string;
}

async function jiraSearchPage(
  jql: string,
  maxResults: number,
  nextPageToken?: string
): Promise<SearchResponse> {
  const auth = getAuth();
  const body: Record<string, unknown> = {
    jql,
    maxResults,
    fields: ['summary', 'labels', 'issuetype'],
  };
  if (nextPageToken) body.nextPageToken = nextPageToken;

  const res = await fetch(
    `https://${JIRA_DOMAIN}/rest/api/3/search/jql`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira search ${res.status}: ${text}`);
  }

  return res.json();
}

/**
 * Fetch all issues matching a JQL query, paginating with nextPageToken.
 */
async function fetchAllIssues(
  jql: string,
  onProgress?: (msg: string) => void
): Promise<SearchResponse['issues']> {
  const allIssues: SearchResponse['issues'] = [];
  let nextPageToken: string | undefined;
  let page = 0;

  while (true) {
    page++;
    onProgress?.(`Fetching page ${page}...`);

    const data = await jiraSearchPage(jql, 100, nextPageToken);
    allIssues.push(...(data.issues || []));

    onProgress?.(`Found ${allIssues.length} tests so far...`);

    if (data.isLast || !data.nextPageToken) break;
    nextPageToken = data.nextPageToken;

    // Rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return allIssues;
}

/**
 * Collect stats for a single suite using the XRAY testSetTests() JQL function.
 */
export async function collectSuiteStats(
  suite: SuiteConfig,
  onProgress?: (msg: string) => void
): Promise<StatsSnapshot> {
  const today = new Date().toISOString().split('T')[0];
  const jql = `issue IN testSetTests("${suite.parentKey}") ORDER BY key ASC`;

  onProgress?.(
    `Querying test cases for ${suite.name} (${suite.parentKey})...`
  );
  console.log(`[Stats] JQL: ${jql}`);

  const allIssues = await fetchAllIssues(jql, onProgress);

  onProgress?.(
    `Classifying ${allIssues.length} tests for ${suite.name}...`
  );

  return classifyTests(suite, allIssues, today);
}

/**
 * Classify test cases by their labels.
 */
function classifyTests(
  suite: SuiteConfig,
  issues: SearchResponse['issues'],
  date: string
): StatsSnapshot {
  const automatedTests: TestEntry[] = [];
  const notAutomatedTests: TestEntry[] = [];
  const unlabeledTests: TestEntry[] = [];

  for (const issue of issues) {
    const labels: string[] = issue.fields?.labels || [];
    const summary = issue.fields?.summary || '';
    const key = issue.key;
    const url = `https://${JIRA_DOMAIN}/browse/${key}`;
    const entry: TestEntry = { key, summary, url };

    const hasAutomated = labels.some(l => {
      const lower = l.toLowerCase();
      return (
        lower === suite.automatedLabel.toLowerCase() ||
        lower === 'automated' ||
        lower === 'automated-test'
      );
    });

    const hasNotAutomated = labels.some(l => {
      const lower = l.toLowerCase();
      return (
        lower === suite.notAutomatedLabel.toLowerCase() ||
        lower === 'to_be_automated' ||
        lower === 'not-automated' ||
        lower === 'not_automated'
      );
    });

    if (hasAutomated) {
      automatedTests.push(entry);
    } else if (hasNotAutomated) {
      notAutomatedTests.push(entry);
    } else {
      unlabeledTests.push(entry);
    }
  }

  const total = issues.length;
  const automated = automatedTests.length;
  const coveragePercent =
    total > 0 ? Math.round((automated / total) * 1000) / 10 : 0;

  return {
    suiteId: suite.id,
    date,
    total,
    automated,
    notAutomated: notAutomatedTests.length,
    unlabeled: unlabeledTests.length,
    coveragePercent,
    automatedTests,
    notAutomatedTests,
    unlabeledTests,
  };
}
