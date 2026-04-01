/**
 * POST /api/automation-stats/update-labels — Start bulk label update
 * GET  /api/automation-stats/update-labels — Poll progress
 *
 * For each issue: remove fromLabel, add toLabel, update via PUT.
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JIRA_DOMAIN = process.env.JIRA_DOMAIN || 'yassir.atlassian.net';

interface UpdateResult {
  key: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
}

interface UpdateProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  total: number;
  processed: number;
  currentKey: string;
  results: UpdateResult[];
}

let progress: UpdateProgress = {
  status: 'idle',
  total: 0,
  processed: 0,
  currentKey: '',
  results: [],
};

export async function GET() {
  return NextResponse.json(progress);
}

export async function POST(request: NextRequest) {
  const { issueKeys, fromLabel, toLabel } = await request.json();

  if (!issueKeys || issueKeys.length === 0) {
    return NextResponse.json(
      { error: 'No issue keys provided' },
      { status: 400 }
    );
  }

  const from = fromLabel || 'To_be_automated';
  const to = toLabel || 'Automated';

  progress = {
    status: 'running',
    total: issueKeys.length,
    processed: 0,
    currentKey: '',
    results: [],
  };

  processLabelUpdates(issueKeys, from, to).catch(err => {
    progress.status = 'failed';
    progress.results.push({
      key: 'SYSTEM',
      status: 'failed',
      message: (err as Error).message,
    });
  });

  return NextResponse.json({ started: true, total: issueKeys.length });
}

async function processLabelUpdates(
  keys: string[],
  fromLabel: string,
  toLabel: string
) {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!email || !token) throw new Error('Jira not configured');

  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i].trim();
    if (!key) continue;

    progress.currentKey = key;
    progress.processed = i + 1;

    try {
      // Fetch current labels
      const issueRes = await fetch(
        `https://${JIRA_DOMAIN}/rest/api/3/issue/${key}?fields=labels`,
        { headers }
      );

      if (!issueRes.ok) {
        progress.results.push({
          key,
          status: 'failed',
          message: `Fetch failed: ${issueRes.status}`,
        });
        continue;
      }

      const issueData = await issueRes.json();
      const currentLabels: string[] = issueData.fields?.labels || [];

      // Already labelled correctly
      if (
        currentLabels.includes(toLabel) &&
        !currentLabels.includes(fromLabel)
      ) {
        progress.results.push({
          key,
          status: 'skipped',
          message: `Already has "${toLabel}"`,
        });
        continue;
      }

      // Build new labels
      const newLabels = currentLabels.filter(l => l !== fromLabel);
      if (!newLabels.includes(toLabel)) {
        newLabels.push(toLabel);
      }

      // Update
      const updateRes = await fetch(
        `https://${JIRA_DOMAIN}/rest/api/3/issue/${key}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ fields: { labels: newLabels } }),
        }
      );

      if (updateRes.ok || updateRes.status === 204) {
        const removedFrom = currentLabels.includes(fromLabel);
        progress.results.push({
          key,
          status: 'success',
          message: removedFrom
            ? `Removed "${fromLabel}", added "${toLabel}"`
            : `Added "${toLabel}"`,
        });
      } else {
        const errorText = await updateRes.text();
        progress.results.push({
          key,
          status: 'failed',
          message: `Update failed: ${updateRes.status} — ${errorText.substring(0, 100)}`,
        });
      }
    } catch (err: unknown) {
      progress.results.push({
        key,
        status: 'failed',
        message: (err as Error).message,
      });
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  progress.status = 'completed';
  progress.currentKey = '';
}
