#!/usr/bin/env npx tsx

/**
 * Jira Field Discovery Script
 *
 * Discovers custom field IDs and issue types in your Jira instance.
 * Useful for configuring XRAY Test fields.
 *
 * Usage:
 *   npx tsx scripts/discover-jira-fields.ts
 *
 * Requirements:
 *   - .env.local must have JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'CMB';

// ────────────────────────────────────
// TYPES
// ────────────────────────────────────

interface JiraField {
  id: string;
  name: string;
  custom: boolean;
  schema?: {
    type: string;
    custom?: string;
    customId?: number;
  };
}

interface JiraIssueType {
  id: string;
  name: string;
  subtask: boolean;
  description?: string;
}

interface JiraLinkType {
  id: string;
  name: string;
  inward: string;
  outward: string;
}

// ────────────────────────────────────
// HELPERS
// ────────────────────────────────────

function getAuthHeader(): string {
  return `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;
}

async function jiraGet<T>(path: string): Promise<T> {
  const url = `https://${JIRA_DOMAIN}/rest/api/3${path}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getAuthHeader(),
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Jira API error: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function printHeader(title: string): void {
  console.log('\n' + '═'.repeat(60));
  console.log(`  ${title}`);
  console.log('═'.repeat(60) + '\n');
}

function printTable(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] || '').length))
  );

  const separator = colWidths.map((w) => '─'.repeat(w + 2)).join('┼');
  const formatRow = (row: string[]) =>
    row.map((cell, i) => ` ${(cell || '').padEnd(colWidths[i])} `).join('│');

  console.log('┌' + separator.replace(/┼/g, '┬') + '┐');
  console.log('│' + formatRow(headers) + '│');
  console.log('├' + separator + '┤');
  rows.forEach((row) => console.log('│' + formatRow(row) + '│'));
  console.log('└' + separator.replace(/┼/g, '┴') + '┘');
}

// ────────────────────────────────────
// MAIN
// ────────────────────────────────────

async function main() {
  console.log('\n🔍 Jira Field Discovery Tool\n');

  // Validate configuration
  if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.error('❌ Missing Jira credentials in .env.local');
    console.error('   Required: JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN');
    process.exit(1);
  }

  console.log(`📡 Connecting to: ${JIRA_DOMAIN}`);
  console.log(`📁 Project: ${JIRA_PROJECT_KEY}`);

  // ────────────────────────────────────
  // 1. Test Connection
  // ────────────────────────────────────

  try {
    const myself = await jiraGet<{ displayName: string; emailAddress: string }>('/myself');
    console.log(`✅ Connected as: ${myself.displayName} (${myself.emailAddress})\n`);
  } catch (err) {
    console.error('❌ Failed to connect to Jira:', err);
    process.exit(1);
  }

  // ────────────────────────────────────
  // 2. Discover Issue Types
  // ────────────────────────────────────

  printHeader('Issue Types');

  try {
    const types = await jiraGet<JiraIssueType[]>('/issuetype');

    const testType = types.find((t) => t.name.toLowerCase() === 'test');
    if (testType) {
      console.log(`✅ Found "Test" issue type (ID: ${testType.id})\n`);
    } else {
      console.log('⚠️  No "Test" issue type found. Available types:\n');
    }

    const tableRows = types
      .filter((t) => !t.subtask)
      .map((t) => [t.id, t.name, t.description?.substring(0, 40) || '']);

    printTable(['ID', 'Name', 'Description'], tableRows);
  } catch (err) {
    console.error('Failed to fetch issue types:', err);
  }

  // ────────────────────────────────────
  // 3. Discover Link Types
  // ────────────────────────────────────

  printHeader('Issue Link Types');

  try {
    const response = await jiraGet<{ issueLinkTypes: JiraLinkType[] }>('/issueLinkType');

    const testLink = response.issueLinkTypes.find(
      (l) => l.name.toLowerCase().includes('test') || l.outward.toLowerCase().includes('test')
    );

    if (testLink) {
      console.log(`✅ Found Test link type: "${testLink.name}"\n`);
    } else {
      console.log('⚠️  No "Tests" link type found. Using "Relates" as fallback.\n');
    }

    const tableRows = response.issueLinkTypes.map((l) => [l.name, l.inward, l.outward]);

    printTable(['Name', 'Inward', 'Outward'], tableRows);
  } catch (err) {
    console.error('Failed to fetch link types:', err);
  }

  // ────────────────────────────────────
  // 4. Discover Custom Fields
  // ────────────────────────────────────

  printHeader('All Custom Fields (Bug/Defect Related)');

  try {
    const fields = await jiraGet<JiraField[]>('/field');

    // Keywords for bug/defect related fields
    const bugDefectKeywords = [
      'step',
      'reproduce',
      'expected',
      'actual',
      'result',
      'environment',
      'precondition',
      'module',
      'platform',
      'squad',
      'team',
      'severity',
      'browser',
      'device',
      'os',
      'version',
      'build',
      'affected',
    ];

    // XRAY-related keywords
    const xrayKeywords = ['test', 'xray', 'cucumber', 'gherkin', 'scenario'];

    // Combine all keywords
    const allKeywords = [...new Set([...bugDefectKeywords, ...xrayKeywords])];

    const relevantFields = fields.filter(
      (f) =>
        f.custom &&
        allKeywords.some((kw) => f.name.toLowerCase().includes(kw))
    );

    if (relevantFields.length > 0) {
      console.log('Found relevant custom fields:\n');

      // Sort by relevance (bug/defect fields first)
      const sortedFields = relevantFields.sort((a, b) => {
        const aIsBugRelated = bugDefectKeywords.some((kw) => a.name.toLowerCase().includes(kw));
        const bIsBugRelated = bugDefectKeywords.some((kw) => b.name.toLowerCase().includes(kw));
        if (aIsBugRelated && !bIsBugRelated) return -1;
        if (!aIsBugRelated && bIsBugRelated) return 1;
        return a.name.localeCompare(b.name);
      });

      const tableRows = sortedFields.map((f) => {
        const isBugRelated = bugDefectKeywords.some((kw) => f.name.toLowerCase().includes(kw));
        const marker = isBugRelated ? '>>>' : '   ';
        return [marker, f.id, f.name, f.schema?.type || 'unknown'];
      });

      printTable(['', 'Field ID', 'Name', 'Type'], tableRows);

      // Print detailed info for bug/defect related fields
      const bugDefectFields = relevantFields.filter((f) =>
        bugDefectKeywords.some((kw) => f.name.toLowerCase().includes(kw))
      );

      if (bugDefectFields.length > 0) {
        console.log('\n📝 BUG/DEFECT RELATED FIELDS (marked with >>>):\n');
        for (const f of bugDefectFields) {
          console.log(`  ${f.id}`);
          console.log(`    Name: ${f.name}`);
          console.log(`    Type: ${f.schema?.type || 'unknown'}`);
          if (f.schema?.custom) {
            console.log(`    Custom Type: ${f.schema.custom}`);
          }
          console.log('');
        }
      }
    } else {
      console.log('ℹ️  No relevant custom fields found.');
      console.log('   Fields will fall back to the description field.\n');
    }

    // Show how to update configuration
    console.log('\n📝 To use these fields, update lib/jira/fields-config.ts:\n');
    console.log('export const DEFECT_CUSTOM_FIELDS = {');

    const fieldMapping: Record<string, string> = {
      step: 'STEPS_TO_REPRODUCE',
      reproduce: 'STEPS_TO_REPRODUCE',
      expected: 'EXPECTED_RESULTS',
      actual: 'ACTUAL_RESULTS',
      environment: 'ENVIRONMENT',
      precondition: 'PRECONDITIONS',
      module: 'MODULE',
      platform: 'PLATFORM',
      squad: 'SQUAD',
      team: 'SQUAD',
    };

    const foundMappings: Record<string, { id: string; name: string; type: string }> = {};
    for (const f of relevantFields) {
      const nameLower = f.name.toLowerCase();
      for (const [keyword, configKey] of Object.entries(fieldMapping)) {
        if (nameLower.includes(keyword) && !foundMappings[configKey]) {
          foundMappings[configKey] = {
            id: f.id,
            name: f.name,
            type: f.schema?.type || 'string',
          };
        }
      }
    }

    const configKeys = [
      'STEPS_TO_REPRODUCE',
      'EXPECTED_RESULTS',
      'ACTUAL_RESULTS',
      'ENVIRONMENT',
      'PRECONDITIONS',
      'MODULE',
      'PLATFORM',
      'SQUAD',
    ];

    for (const key of configKeys) {
      if (foundMappings[key]) {
        console.log(`  ${key}: '${foundMappings[key].id}', // ${foundMappings[key].name} (${foundMappings[key].type})`);
      } else {
        console.log(`  ${key}: null, // Not found - will use description`);
      }
    }
    console.log('};');
  } catch (err) {
    console.error('Failed to fetch fields:', err);
  }

  // ────────────────────────────────────
  // 5. Discover Project Details
  // ────────────────────────────────────

  printHeader(`Project: ${JIRA_PROJECT_KEY}`);

  try {
    const project = await jiraGet<{
      key: string;
      name: string;
      projectTypeKey: string;
      issueTypes: JiraIssueType[];
    }>(`/project/${JIRA_PROJECT_KEY}`);

    console.log(`Name: ${project.name}`);
    console.log(`Type: ${project.projectTypeKey}`);
    console.log(`\nAvailable issue types in this project:\n`);

    const tableRows = project.issueTypes.map((t) => [t.name, t.subtask ? 'Subtask' : 'Standard']);

    printTable(['Issue Type', 'Kind'], tableRows);
  } catch (err) {
    console.error(`Failed to fetch project ${JIRA_PROJECT_KEY}:`, err);
  }

  // ────────────────────────────────────
  // 6. Summary
  // ────────────────────────────────────

  printHeader('Configuration Summary');

  console.log('Add these to your .env.local or lib/jira/fields-config.ts:\n');
  console.log(`JIRA_PROJECT_KEY=${JIRA_PROJECT_KEY}`);
  console.log(`XRAY_PROJECT_KEY=${JIRA_PROJECT_KEY}`);
  console.log(`TEST_ISSUE_TYPE=Test`);
  console.log(`TEST_LINK_TYPE=Tests`);

  console.log('\n✅ Discovery complete!\n');
}

// Run
main().catch(console.error);
