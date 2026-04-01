/**
 * POST /api/suite-update/bulk-delete — Start bulk deletion
 * GET  /api/suite-update/bulk-delete — Poll progress
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JIRA_DOMAIN = process.env.JIRA_DOMAIN || 'yassir.atlassian.net';

interface DeleteResult {
  key: string;
  status: 'deleted' | 'failed' | 'not-found';
  summary: string;
  message: string;
}

interface DeleteProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  total: number;
  processed: number;
  currentKey: string;
  results: DeleteResult[];
}

let progress: DeleteProgress = {
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
  const { issueKeys } = await request.json();

  if (!issueKeys || issueKeys.length === 0) {
    return NextResponse.json(
      { error: 'No issue keys provided' },
      { status: 400 }
    );
  }

  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!email || !token) {
    return NextResponse.json(
      { error: 'Jira not configured' },
      { status: 503 }
    );
  }

  progress = {
    status: 'running',
    total: issueKeys.length,
    processed: 0,
    currentKey: '',
    results: [],
  };

  processDeletes(issueKeys, email, token).catch(err => {
    progress.status = 'failed';
    progress.results.push({
      key: 'SYSTEM',
      status: 'failed',
      summary: '',
      message: (err as Error).message,
    });
  });

  return NextResponse.json({ started: true, total: issueKeys.length });
}

async function processDeletes(
  keys: string[],
  email: string,
  token: string
) {
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: 'application/json',
  };

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i].trim();
    if (!key) continue;

    progress.currentKey = key;
    progress.processed = i + 1;

    try {
      // Verify issue exists and get summary
      const fetchRes = await fetch(
        `https://${JIRA_DOMAIN}/rest/api/3/issue/${key}?fields=summary`,
        { headers }
      );

      if (!fetchRes.ok) {
        if (fetchRes.status === 404) {
          progress.results.push({
            key,
            status: 'not-found',
            summary: '',
            message: 'Issue not found in Jira',
          });
        } else {
          progress.results.push({
            key,
            status: 'failed',
            summary: '',
            message: `Fetch failed: ${fetchRes.status}`,
          });
        }
        continue;
      }

      const issueData = await fetchRes.json();
      const summary = issueData.fields?.summary || 'Unknown';

      // Delete the issue
      const deleteRes = await fetch(
        `https://${JIRA_DOMAIN}/rest/api/3/issue/${key}`,
        { method: 'DELETE', headers }
      );

      if (deleteRes.ok || deleteRes.status === 204) {
        progress.results.push({
          key,
          status: 'deleted',
          summary,
          message: 'Deleted successfully',
        });
      } else {
        const errorText = await deleteRes.text();
        progress.results.push({
          key,
          status: 'failed',
          summary,
          message: `Delete failed: ${deleteRes.status} — ${errorText.substring(0, 150)}`,
        });
      }
    } catch (err: unknown) {
      progress.results.push({
        key,
        status: 'failed',
        summary: '',
        message: (err as Error).message,
      });
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  progress.status = 'completed';
  progress.currentKey = '';
}
