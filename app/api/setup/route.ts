/**
 * GET /api/setup — Check if setup is needed
 * POST /api/setup — Save credentials to .env.local
 *
 * Setup is needed when:
 * 1. .env.local doesn't exist
 * 2. JIRA_EMAIL or JIRA_API_TOKEN contain placeholder values
 * 3. Jira connection test fails (token expired)
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');

const ENV_TEMPLATE = `# ═══════════════════════════════════════════════════════════
# QA AI Agent — Environment Configuration
# ═══════════════════════════════════════════════════════════

# ── Jira Cloud ──
JIRA_DOMAIN=yassir.atlassian.net
JIRA_EMAIL={{JIRA_EMAIL}}
JIRA_API_TOKEN={{JIRA_API_TOKEN}}
JIRA_PROJECT_KEY={{JIRA_PROJECT_KEY}}

# ── XRAY Test Project (test cases go here) ──
XRAY_PROJECT_KEY=QATM

# ── Google Gemini AI (free) ──
GEMINI_API_KEY={{GEMINI_API_KEY}}

# ── Figma (optional) ──
FIGMA_ACCESS_TOKEN={{FIGMA_ACCESS_TOKEN}}

# ── Anthropic Claude API (optional) ──
ANTHROPIC_API_KEY=

# ── App Config ──
NEXT_PUBLIC_APP_NAME=QA AI Agent
KNOWLEDGE_BASE_PATH=./knowledge-base
CHANGE_LOG_PATH=./change-log
`;

// ────────────────────────────────────
// GET — Check if setup is needed
// ────────────────────────────────────

export async function GET() {
  try {
    // Check 1: Does .env.local exist?
    if (!fs.existsSync(ENV_PATH)) {
      return NextResponse.json({
        setupRequired: true,
        reason: 'no-env-file',
        message: 'Welcome! Please set up your credentials to get started.',
      });
    }

    // Check 2: Do credentials have placeholder values?
    const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    const email = extractEnvValue(envContent, 'JIRA_EMAIL');
    const token = extractEnvValue(envContent, 'JIRA_API_TOKEN');
    const projectKey = extractEnvValue(envContent, 'JIRA_PROJECT_KEY');

    if (
      !email ||
      !token ||
      !projectKey ||
      email.includes('REPLACE') ||
      token.includes('REPLACE') ||
      projectKey.includes('REPLACE')
    ) {
      return NextResponse.json({
        setupRequired: true,
        reason: 'placeholder-values',
        message: 'Credentials not configured. Please enter your details.',
        current: {
          email: email?.includes('REPLACE') ? '' : email || '',
          projectKey: projectKey?.includes('REPLACE') ? '' : projectKey || '',
          hasGeminiKey: !!(
            extractEnvValue(envContent, 'GEMINI_API_KEY') &&
            !extractEnvValue(envContent, 'GEMINI_API_KEY')?.includes('REPLACE')
          ),
          hasFigmaToken: !!extractEnvValue(envContent, 'FIGMA_ACCESS_TOKEN'),
        },
      });
    }

    // Check 3: Test Jira connection
    const jiraOk = await testJiraCredentials(email, token);
    if (!jiraOk.valid) {
      return NextResponse.json({
        setupRequired: true,
        reason: 'token-expired',
        message:
          jiraOk.error ||
          'Jira token expired or invalid. Please re-enter your credentials.',
        current: {
          email,
          projectKey,
          hasGeminiKey: !!(
            extractEnvValue(envContent, 'GEMINI_API_KEY') &&
            !extractEnvValue(envContent, 'GEMINI_API_KEY')?.includes('REPLACE')
          ),
          hasFigmaToken: !!extractEnvValue(envContent, 'FIGMA_ACCESS_TOKEN'),
        },
      });
    }

    // All good — no setup needed
    return NextResponse.json({
      setupRequired: false,
      user: {
        email,
        projectKey,
        displayName: jiraOk.displayName,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      setupRequired: true,
      reason: 'error',
      message: err.message,
    });
  }
}

// ────────────────────────────────────
// POST — Save credentials to .env.local
// ────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jiraEmail,
      jiraToken,
      jiraDomain,
      projectKey,
      figmaToken,
      geminiKey,
    } = body;

    // Validate required fields
    const errors: string[] = [];
    if (!jiraEmail?.trim()) errors.push('Jira email is required');
    if (!jiraToken?.trim()) errors.push('Jira API token is required');
    if (!projectKey?.trim()) errors.push('Project key is required');

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Test Jira credentials before saving
    const domain = jiraDomain?.trim() || 'yassir.atlassian.net';
    const jiraTest = await testJiraCredentials(jiraEmail.trim(), jiraToken.trim(), domain);
    if (!jiraTest.valid) {
      return NextResponse.json(
        {
          success: false,
          errors: [
            `Jira authentication failed: ${jiraTest.error}. Please check your email and API token.`,
          ],
        },
        { status: 401 }
      );
    }

    // Build .env.local content
    let envContent: string;

    if (fs.existsSync(ENV_PATH)) {
      // Update existing file — replace only the credential values
      envContent = fs.readFileSync(ENV_PATH, 'utf-8');
      envContent = setEnvValue(envContent, 'JIRA_DOMAIN', domain);
      envContent = setEnvValue(envContent, 'JIRA_EMAIL', jiraEmail.trim());
      envContent = setEnvValue(
        envContent,
        'JIRA_API_TOKEN',
        jiraToken.trim()
      );
      envContent = setEnvValue(
        envContent,
        'JIRA_PROJECT_KEY',
        projectKey.trim().toUpperCase()
      );

      if (figmaToken?.trim()) {
        envContent = setEnvValue(
          envContent,
          'FIGMA_ACCESS_TOKEN',
          figmaToken.trim()
        );
      }
      if (geminiKey?.trim()) {
        envContent = setEnvValue(
          envContent,
          'GEMINI_API_KEY',
          geminiKey.trim()
        );
      }
    } else {
      // Create new file from template
      envContent = ENV_TEMPLATE.replace('{{JIRA_EMAIL}}', jiraEmail.trim())
        .replace('{{JIRA_API_TOKEN}}', jiraToken.trim())
        .replace('{{JIRA_PROJECT_KEY}}', projectKey.trim().toUpperCase())
        .replace('{{GEMINI_API_KEY}}', geminiKey?.trim() || '')
        .replace('{{FIGMA_ACCESS_TOKEN}}', figmaToken?.trim() || '');

      // Also set JIRA_DOMAIN if custom
      if (domain !== 'yassir.atlassian.net') {
        envContent = envContent.replace(
          'JIRA_DOMAIN=yassir.atlassian.net',
          `JIRA_DOMAIN=${domain}`
        );
      }
    }

    // Write .env.local
    fs.writeFileSync(ENV_PATH, envContent);
    console.log('[Setup] Credentials saved to .env.local');

    return NextResponse.json({
      success: true,
      message: `Setup complete! Welcome, ${jiraTest.displayName}.`,
      displayName: jiraTest.displayName,
      needsRestart: true,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, errors: [err.message] },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────
// Helpers
// ────────────────────────────────────

function extractEnvValue(content: string, key: string): string | null {
  const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!match) return null;
  const value = match[1].trim();
  return value || null;
}

function setEnvValue(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  }
  // Key doesn't exist — append it
  return content.trimEnd() + `\n${key}=${value}\n`;
}

async function testJiraCredentials(
  email: string,
  token: string,
  domain: string = 'yassir.atlassian.net'
): Promise<{
  valid: boolean;
  displayName?: string;
  error?: string;
}> {
  try {
    const auth = Buffer.from(`${email}:${token}`).toString('base64');
    const response = await fetch(
      `https://${domain}/rest/api/3/myself`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, error: 'Invalid email or API token' };
      }
      if (response.status === 403) {
        return {
          valid: false,
          error: 'Access denied — check your Jira permissions',
        };
      }
      return { valid: false, error: `Jira returned ${response.status}` };
    }

    const data = await response.json();
    return { valid: true, displayName: data.displayName || email };
  } catch (err: unknown) {
    const e = err as Error;
    return { valid: false, error: `Connection failed: ${e.message}` };
  }
}
