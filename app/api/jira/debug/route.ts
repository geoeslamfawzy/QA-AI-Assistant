import { NextResponse } from 'next/server';
import { isJiraConfigured, getJiraConfig } from '@/lib/jira';

export const dynamic = 'force-dynamic';

/**
 * GET /api/jira/debug
 *
 * Diagnostic endpoint to check if Jira environment variables are loaded.
 * Use this to troubleshoot mock mode issues.
 */
export async function GET() {
  const config = getJiraConfig();

  return NextResponse.json({
    isConfigured: isJiraConfigured(),
    hasJiraDomain: !!process.env.JIRA_DOMAIN,
    jiraDomain: process.env.JIRA_DOMAIN || 'NOT SET',
    hasJiraEmail: !!process.env.JIRA_EMAIL,
    jiraEmailPreview: process.env.JIRA_EMAIL
      ? process.env.JIRA_EMAIL.substring(0, 5) + '***'
      : 'NOT SET',
    hasJiraToken: !!process.env.JIRA_API_TOKEN,
    jiraTokenLength: process.env.JIRA_API_TOKEN?.length || 0,
    projectKey: process.env.JIRA_PROJECT_KEY || 'NOT SET',
    configObject: config
      ? {
          domain: config.domain,
          projectKey: config.projectKey,
        }
      : null,
    envNote:
      'If values show NOT SET, your .env.local is not being loaded. Restart the dev server after creating/editing .env.local.',
  });
}
