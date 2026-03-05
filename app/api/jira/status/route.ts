import { NextResponse } from 'next/server';
import { testJiraConnection, isJiraConfigured, getJiraConfig } from '@/lib/jira';

export const dynamic = 'force-dynamic'; // Never cache this

export async function GET() {
  try {
    // Check if Jira is configured
    if (!isJiraConfigured()) {
      return NextResponse.json({
        configured: false,
        connected: false,
        _isMock: true,
        message: 'Jira credentials not configured. Using mock data.',
      });
    }

    // Test the connection
    const status = await testJiraConnection();
    const config = getJiraConfig();

    return NextResponse.json({
      configured: true,
      connected: status.connected,
      _isMock: !status.connected,
      domain: config?.domain,
      projectKey: config?.projectKey,
      user: status.user,
      email: status.email,
      error: status.error,
    });
  } catch (error) {
    console.error('[Jira Status Error]', error);

    return NextResponse.json({
      configured: true,
      connected: false,
      _isMock: true,
      error: error instanceof Error ? error.message : 'Connection test failed',
    });
  }
}
