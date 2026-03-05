#!/usr/bin/env npx tsx

/**
 * Jira Issue Type Field Discovery Script
 *
 * Discovers which fields each issue type accepts and which are required.
 * This helps identify the correct field IDs for Bug, Defect, and Story Defect.
 *
 * Usage:
 *   npx tsx scripts/discover-issue-type-fields.ts
 *
 * Requirements:
 *   - .env.local must have JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('ERROR: .env.local not found in project root');
  process.exit(1);
}

const DOMAIN = process.env.JIRA_DOMAIN;
const EMAIL = process.env.JIRA_EMAIL;
const TOKEN = process.env.JIRA_API_TOKEN;
const PROJECT = process.env.JIRA_PROJECT_KEY || 'CMB';

if (!DOMAIN || !EMAIL || !TOKEN) {
  console.error('ERROR: JIRA_DOMAIN, JIRA_EMAIL, or JIRA_API_TOKEN not set in .env.local');
  process.exit(1);
}

const auth = Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64');

// Keywords to highlight as potentially relevant for bug/defect fields
const KEYWORDS = [
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
  'component',
  'severity',
  'browser',
  'device',
  'os',
  'version',
  'build',
  'affected',
];

interface FieldMeta {
  required: boolean;
  name: string;
  schema?: {
    type: string;
    custom?: string;
    customId?: number;
    items?: string;
  };
  allowedValues?: Array<{ value?: string; name?: string; id?: string }>;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`  API Error ${response.status}: ${await response.text()}`);
      return null;
    }

    return response.json();
  } catch (err) {
    console.error(`  Fetch error: ${err}`);
    return null;
  }
}

async function discoverIssueTypeFields(issueTypeName: string) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(` ISSUE TYPE: ${issueTypeName}`);
  console.log(`${'═'.repeat(80)}\n`);

  // Try the newer createmeta endpoint format first (Jira Cloud recent versions)
  const issueTypesUrl = `https://${DOMAIN}/rest/api/3/issue/createmeta/${PROJECT}/issuetypes`;
  const issueTypesData = await fetchJson<{ issueTypes?: Array<{ id: string; name: string }>; values?: Array<{ id: string; name: string }> }>(issueTypesUrl);

  if (!issueTypesData) {
    // Fallback to old endpoint
    const oldUrl = `https://${DOMAIN}/rest/api/3/issue/createmeta?projectKeys=${PROJECT}&issuetypeNames=${encodeURIComponent(issueTypeName)}&expand=projects.issuetypes.fields`;
    const oldData = await fetchJson<{ projects?: Array<{ issuetypes?: Array<{ fields?: Record<string, FieldMeta> }> }> }>(oldUrl);

    if (oldData?.projects?.[0]?.issuetypes?.[0]?.fields) {
      return printFields(oldData.projects[0].issuetypes[0].fields, issueTypeName);
    }

    console.log(`  ⚠ Could not discover fields for "${issueTypeName}".`);
    console.log(`  This issue type may not exist in project ${PROJECT}.`);
    return;
  }

  const issueTypes = issueTypesData.issueTypes || issueTypesData.values || [];
  const match = issueTypes.find(
    (it) => it.name.toLowerCase() === issueTypeName.toLowerCase()
  );

  if (!match) {
    console.log(`  ⚠ Issue type "${issueTypeName}" not found in project ${PROJECT}.`);
    console.log(`  Available types: ${issueTypes.map((t) => t.name).join(', ')}`);
    return;
  }

  // Fetch fields for this specific issue type
  const fieldsUrl = `https://${DOMAIN}/rest/api/3/issue/createmeta/${PROJECT}/issuetypes/${match.id}`;
  const fieldsData = await fetchJson<{ values?: Array<{ fieldId: string; required: boolean; name: string; schema?: { type: string } }> }>(fieldsUrl);

  if (!fieldsData?.values) {
    console.log(`  ⚠ Could not fetch fields for "${issueTypeName}" (ID: ${match.id}).`);
    return;
  }

  // Convert to the same format as old endpoint
  const fields: Record<string, FieldMeta> = {};
  for (const v of fieldsData.values) {
    fields[v.fieldId] = {
      required: v.required,
      name: v.name,
      schema: v.schema,
    };
  }

  printFields(fields, issueTypeName);
}

function printFields(fields: Record<string, FieldMeta>, issueTypeName: string) {
  const fieldEntries = Object.entries(fields);

  if (fieldEntries.length === 0) {
    console.log('  No fields found.');
    return;
  }

  const required = fieldEntries.filter(([_, v]) => v.required);
  const optional = fieldEntries.filter(([_, v]) => !v.required);

  // Print required fields
  console.log(`  REQUIRED FIELDS (${required.length}):`);
  console.log(`  ${'─'.repeat(76)}`);

  for (const [id, meta] of required) {
    const name = meta.name || id;
    const type = meta.schema?.type || 'unknown';
    const isRelevant = KEYWORDS.some((kw) => name.toLowerCase().includes(kw));
    const marker = isRelevant ? '>>>' : '   ';
    console.log(`  ${marker} ✱ ${id.padEnd(32)} ${name.padEnd(35)} ${type}`);
  }

  // Print optional fields, highlighting relevant ones
  console.log(`\n  OPTIONAL FIELDS (${optional.length}):`);
  console.log(`  ${'─'.repeat(76)}`);

  const relevantOptional: Array<[string, FieldMeta]> = [];
  const otherOptional: Array<[string, FieldMeta]> = [];

  for (const [id, meta] of optional) {
    const name = meta.name || id;
    const isRelevant = KEYWORDS.some((kw) => name.toLowerCase().includes(kw) || id.toLowerCase().includes(kw));
    if (isRelevant) {
      relevantOptional.push([id, meta]);
    } else {
      otherOptional.push([id, meta]);
    }
  }

  // Print relevant optional fields first (highlighted)
  for (const [id, meta] of relevantOptional) {
    const name = meta.name || id;
    const type = meta.schema?.type || 'unknown';
    console.log(`  >>> ${id.padEnd(32)} ${name.padEnd(35)} ${type}`);
  }

  // Print other optional fields
  for (const [id, meta] of otherOptional) {
    const name = meta.name || id;
    const type = meta.schema?.type || 'unknown';
    console.log(`      ${id.padEnd(32)} ${name.padEnd(35)} ${type}`);
  }

  console.log(`\n  Total: ${fieldEntries.length} fields (${required.length} required, ${optional.length} optional)`);

  // Print relevant fields summary
  if (relevantOptional.length > 0) {
    console.log(`\n  📝 POTENTIALLY RELEVANT FIELDS (marked with >>>):`);
    console.log(`  ${'─'.repeat(76)}`);
    for (const [id, meta] of relevantOptional) {
      const name = meta.name || id;
      const type = meta.schema?.type || 'unknown';
      console.log(`  ${id}`);
      console.log(`    Name: ${name}`);
      console.log(`    Type: ${type}`);
      if (meta.schema?.custom) {
        console.log(`    Custom: ${meta.schema.custom}`);
      }
      console.log('');
    }
  }
}

async function listAvailableIssueTypes() {
  console.log(`${'═'.repeat(80)}`);
  console.log(` AVAILABLE ISSUE TYPES IN PROJECT ${PROJECT}`);
  console.log(`${'═'.repeat(80)}\n`);

  // Try newer endpoint first
  const url = `https://${DOMAIN}/rest/api/3/issue/createmeta/${PROJECT}/issuetypes`;
  const data = await fetchJson<{ issueTypes?: Array<{ id: string; name: string; subtask?: boolean }>; values?: Array<{ id: string; name: string; subtask?: boolean }> }>(url);

  if (data) {
    const types = data.issueTypes || data.values || [];
    for (const t of types) {
      const sub = t.subtask ? ' (sub-task)' : '';
      console.log(`  • ${t.name}${sub}  [id: ${t.id}]`);
    }
    return;
  }

  // Fallback to old endpoint
  const url2 = `https://${DOMAIN}/rest/api/3/issue/createmeta?projectKeys=${PROJECT}`;
  const data2 = await fetchJson<{ projects?: Array<{ issuetypes?: Array<{ id: string; name: string; subtask?: boolean }> }> }>(url2);

  if (data2?.projects?.[0]?.issuetypes) {
    for (const t of data2.projects[0].issuetypes) {
      const sub = t.subtask ? ' (sub-task)' : '';
      console.log(`  • ${t.name}${sub}  [id: ${t.id}]`);
    }
  } else {
    console.log('  Could not fetch issue types list');
  }
}

async function main() {
  console.log('\n🔍 Jira Issue Type Field Discovery Tool\n');
  console.log(`📡 Jira Instance: ${DOMAIN}`);
  console.log(`📁 Project: ${PROJECT}`);
  console.log(`🔑 Discovering fields for issue types...\n`);

  // First list all available issue types
  await listAvailableIssueTypes();

  // Discover fields for each issue type we use
  await discoverIssueTypeFields('Bug');
  await discoverIssueTypeFields('Defect');
  await discoverIssueTypeFields('Story Defect');

  console.log(`\n${'═'.repeat(80)}`);
  console.log(' NEXT STEPS');
  console.log(`${'═'.repeat(80)}\n`);
  console.log('1. Look for fields marked with >>> that match:');
  console.log('   - Steps to Reproduce / Steps');
  console.log('   - Expected Results / Expected Behavior');
  console.log('   - Actual Results / Actual Behavior');
  console.log('   - Environment');
  console.log('   - Preconditions');
  console.log('   - Module / Platform');
  console.log('');
  console.log('2. Update lib/jira/fields-config.ts with the field IDs');
  console.log('');
  console.log('3. Note the field type (string, option, array, doc) for each field');
  console.log('');
  console.log('✅ Discovery complete!\n');
}

main().catch(console.error);
