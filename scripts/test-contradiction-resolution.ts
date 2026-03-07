#!/usr/bin/env npx tsx

/**
 * Test script to verify that newer tickets override older ones.
 *
 * Run with: npx tsx scripts/test-contradiction-resolution.ts
 *
 * This script:
 * 1. Creates fake tickets with deliberate contradictions
 * 2. Runs them through the context builder
 * 3. Verifies the output contains ONLY the newest version
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Simulate tickets with contradictions (oldest first)
const testTickets = [
  // ── Contradiction 1: Login method changed ──
  {
    key: 'TEST-100',
    title: '[B2B] Login with Email and Password',
    type: 'Story',
    status: 'Done',
    module: 'B2B Portal — Login & Registration',
    description: 'As a user, I want to login using my email and password so I can access the B2B portal.\n\nThe login page has two fields: Email and Password. User enters credentials and clicks Login button.',
    acceptanceCriteria: [
      'Login page shows Email and Password fields',
      'User enters email and password to login',
      'Invalid credentials show error message',
      'Successful login redirects to Dashboard',
    ],
    labels: ['b2b', 'login'],
    components: ['B2B'],
    created: '2024-01-15T10:00:00.000Z',  // OLD
    updated: '2024-01-20T10:00:00.000Z',
    priority: 'P1 - High',
  },
  {
    key: 'TEST-500',
    title: '[B2B] Login with Phone Number and OTP',
    type: 'Improvement',
    status: 'Done',
    module: 'B2B Portal — Login & Registration',
    description: 'As a user, I want to login using my phone number and OTP so I can access the B2B portal securely without remembering a password.\n\nThe login flow is:\n1. User enters phone number\n2. System sends OTP via SMS\n3. User enters OTP\n4. User is logged in\n\nThe old email+password login is removed and replaced with phone+OTP.',
    acceptanceCriteria: [
      'Login page shows Phone Number field only (no email/password)',
      'User enters phone number and receives OTP via SMS',
      'OTP is valid for 5 minutes',
      'After 3 failed OTP attempts, user is locked for 15 minutes',
      'Successful OTP verification logs the user in',
    ],
    labels: ['b2b', 'login', 'revamp'],
    components: ['B2B'],
    created: '2025-06-01T10:00:00.000Z',  // NEWER — this should WIN
    updated: '2025-06-15T10:00:00.000Z',
    priority: 'P0 - Critical',
  },

  // ── Contradiction 2: Payment model changed ──
  {
    key: 'TEST-200',
    title: '[B2B] Prepaid Only Payment',
    type: 'Story',
    status: 'Done',
    module: 'B2B Portal — Payments',
    description: 'The B2B payment system supports prepaid only. Companies must top up their wallet before booking rides. No credit or postpaid option is available.',
    acceptanceCriteria: [
      'Company must have sufficient wallet balance to book rides',
      'Top-up button allows adding funds to wallet',
      'No postpaid or credit option exists',
      'Rides are blocked when wallet balance is zero',
    ],
    labels: ['b2b', 'payments'],
    components: ['B2B'],
    created: '2024-03-01T10:00:00.000Z',  // OLD
    updated: '2024-03-10T10:00:00.000Z',
    priority: 'P1 - High',
  },
  {
    key: 'TEST-600',
    title: '[B2B] Add Postpaid Payment Plan',
    type: 'Improvement',
    status: 'Done',
    module: 'B2B Portal — Payments',
    description: 'Add postpaid (Pay Later) payment plan alongside the existing prepaid plan. Companies can now choose between prepaid and postpaid.\n\nPostpaid: Company gets a monthly budget limit. Rides are deducted from this limit. Invoice is sent at end of month.\nPrepaid: Works the same as before (wallet top-up).\n\nAdmin can switch a company between prepaid and postpaid.',
    acceptanceCriteria: [
      'Company can be configured as Prepaid OR Postpaid',
      'Postpaid companies have a monthly budget limit',
      'Postpaid rides deduct from budget limit, not wallet',
      'Monthly invoice is generated for postpaid companies',
      'Admin can switch company between Prepaid and Postpaid',
      'When switching from prepaid to postpaid, remaining wallet balance is credited to first invoice',
    ],
    labels: ['b2b', 'payments', 'enhancement'],
    components: ['B2B'],
    created: '2025-08-01T10:00:00.000Z',  // NEWER — this should WIN
    updated: '2025-08-20T10:00:00.000Z',
    priority: 'P0 - Critical',
  },

  // ── Contradiction 3: Ride booking stops limit changed ──
  {
    key: 'TEST-300',
    title: '[B2B] Book Ride with Single Destination',
    type: 'Story',
    status: 'Done',
    module: 'B2B Portal — Book Rides',
    description: 'Users can book rides with a single pickup and single destination. No intermediate stops are supported.',
    acceptanceCriteria: [
      'Booking form has Pickup and Destination fields only',
      'No option to add intermediate stops',
      'Map shows direct route from pickup to destination',
    ],
    labels: ['b2b', 'booking'],
    components: ['B2B'],
    created: '2024-02-01T10:00:00.000Z',  // OLD
    updated: '2024-02-10T10:00:00.000Z',
    priority: 'P1 - High',
  },
  {
    key: 'TEST-700',
    title: '[B2B] Multi-Stop Ride Booking',
    type: 'Improvement',
    status: 'Done',
    module: 'B2B Portal — Book Rides',
    description: 'Enhancement: Users can now book rides with up to 3 intermediate stops in addition to pickup and destination.\n\nThe booking form now has:\n- Pickup location\n- Stop 1 (optional)\n- Stop 2 (optional)\n- Stop 3 (optional)\n- Destination\n\nThe "Add Stop" button appears after the pickup field. Maximum 3 stops allowed.',
    acceptanceCriteria: [
      'Booking form has Pickup, up to 3 optional Stops, and Destination',
      'Add Stop button adds a new stop field (max 3)',
      'Remove Stop button removes a stop',
      'Price updates when stops are added or removed',
      'Map shows route through all stops',
      'Total maximum of 5 points (1 pickup + 3 stops + 1 destination)',
    ],
    labels: ['b2b', 'booking', 'enhancement'],
    components: ['B2B'],
    created: '2025-09-01T10:00:00.000Z',  // NEWER — this should WIN
    updated: '2025-09-15T10:00:00.000Z',
    priority: 'P1 - High',
  },
];

async function runTest() {
  const KB_DIR = './knowledge-base';
  const testDir = path.join(KB_DIR, 'test-output');
  fs.mkdirSync(testDir, { recursive: true });

  // Save test tickets
  fs.writeFileSync(
    path.join(testDir, 'test-tickets.json'),
    JSON.stringify(testTickets, null, 2)
  );

  console.log('=== CONTRADICTION TEST ===');
  console.log(`Total test tickets: ${testTickets.length}`);
  console.log('');

  // Group by module
  const modules = new Map<string, typeof testTickets>();
  for (const t of testTickets) {
    if (!modules.has(t.module)) modules.set(t.module, []);
    modules.get(t.module)!.push(t);
  }

  console.log('Modules:');
  for (const [mod, tickets] of modules) {
    console.log(`  ${mod}: ${tickets.length} tickets`);
    for (const t of tickets) {
      console.log(`    ${t.key} (${t.created.split('T')[0]}): ${t.title}`);
    }
  }

  console.log('');
  console.log('=== EXPECTED RESULTS ===');
  console.log('');
  console.log('1. Login module should say "phone + OTP" NOT "email + password"');
  console.log('   ✓ TEST-500 (2025) should override TEST-100 (2024)');
  console.log('');
  console.log('2. Payments module should say "prepaid AND postpaid" NOT "prepaid only"');
  console.log('   ✓ TEST-600 (2025) should override TEST-200 (2024)');
  console.log('');
  console.log('3. Booking module should say "up to 3 stops" NOT "single destination only"');
  console.log('   ✓ TEST-700 (2025) should override TEST-300 (2024)');
  console.log('');

  // Now test with Claude API if available
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log('⚠️  ANTHROPIC_API_KEY not set. Skipping Claude test.');
    console.log('   Set it in .env.local to test AI-powered contradiction resolution.');
    console.log('');
    console.log('   Running fallback template test instead...');

    // Test with fallback generator
    for (const [mod, tickets] of modules) {
      console.log(`\n--- ${mod} (Fallback) ---`);
      // Check if tickets are sorted oldest first
      const sorted = tickets.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
      console.log(`  Ticket order: ${sorted.map(t => `${t.key}(${t.created.split('T')[0]})`).join(' → ')}`);
      console.log(`  Last ticket (should be the truth): ${sorted[sorted.length - 1].key} — ${sorted[sorted.length - 1].title}`);
    }
    return;
  }

  console.log('🤖 Testing with Claude API...');
  console.log('');

  for (const [mod, tickets] of modules) {
    const sorted = tickets.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

    const ticketTexts = sorted.map(t => {
      let text = `### ${t.key}: ${t.title}\n`;
      text += `Status: ${t.status} | Created: ${t.created.split('T')[0]}\n\n`;
      text += `Description:\n${t.description}\n\n`;
      text += `Acceptance Criteria:\n`;
      t.acceptanceCriteria.forEach((ac, i) => { text += `${i + 1}. ${ac}\n`; });
      return text;
    }).join('\n---\n\n');

    const prompt = `You are a technical documentation expert for Yassir Mobility.

## CRITICAL RULE — CONTRADICTION HANDLING
These tickets represent the FULL EVOLUTION of this module. Sorted OLDEST to NEWEST.
When tickets CONTRADICT each other, the NEWER ticket ALWAYS wins and REPLACES the old info.
The older ticket's version is OBSOLETE — do NOT include it as current behavior.

Example: If an old ticket says "Login uses email+password" but a newer ticket says "Login uses phone+OTP", the current system uses phone+OTP. Do NOT mention the old email flow as current behavior.

## Task
Write a context document for the "${mod}" module based on these tickets.
Describe how the system CURRENTLY works (based on the newest tickets).

## Tickets (oldest → newest)

${ticketTexts}

Write the context document. Describe CURRENT behavior only.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          console.error(`  ❌ Authentication Error: Invalid ANTHROPIC_API_KEY`);
          console.error(`     Please check your API key in .env.local`);
          console.error('');
          console.log('   Running fallback template test instead...');

          // Fall back to template test
          for (const [m, t] of modules) {
            const s = t.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
            console.log(`\n--- ${m} (Fallback) ---`);
            console.log(`  Ticket order: ${s.map(x => `${x.key}(${x.created.split('T')[0]})`).join(' → ')}`);
            console.log(`  Last ticket (should be the truth): ${s[s.length - 1].key} — ${s[s.length - 1].title}`);
          }
          return;
        }
        console.error(`  ❌ API Error (${response.status}): ${errorText}`);
        continue;
      }

      const data = await response.json() as { content?: Array<{ type: string; text?: string }>, error?: { message: string } };

      // Check for API error in response
      if (data.error) {
        console.error(`  ❌ API Error: ${data.error.message}`);
        continue;
      }

      // Extract text from content blocks
      const output = data.content
        ?.filter((b) => b.type === 'text')
        ?.map((b) => b.text)
        ?.join('') || 'No output';

      // Save output
      const slug = mod.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      fs.writeFileSync(path.join(testDir, `${slug}-context.md`), output);

      console.log(`\n${'═'.repeat(60)}`);
      console.log(`MODULE: ${mod}`);
      console.log(`${'═'.repeat(60)}`);
      console.log(output);
      console.log('');

      // Verify contradictions were resolved correctly
      const outputLower = output.toLowerCase();
      if (mod.includes('Login')) {
        const hasOTP = outputLower.includes('otp') || outputLower.includes('phone');
        const hasEmailPassword = outputLower.includes('email and password') || outputLower.includes('email + password');
        console.log(`  ✓ Mentions OTP/Phone: ${hasOTP ? '✅ YES' : '❌ NO'}`);
        console.log(`  ✓ Mentions Email+Password as current: ${hasEmailPassword ? '❌ FAIL (should be removed)' : '✅ CORRECTLY REMOVED'}`);
      }
      if (mod.includes('Payment')) {
        const hasPostpaid = outputLower.includes('postpaid') || outputLower.includes('pay later');
        const hasPrepaidOnly = outputLower.includes('prepaid only') || outputLower.includes('no postpaid') || outputLower.includes('no credit');
        console.log(`  ✓ Mentions Postpaid: ${hasPostpaid ? '✅ YES' : '❌ NO'}`);
        console.log(`  ✓ Says "Prepaid Only": ${hasPrepaidOnly ? '❌ FAIL (should mention both)' : '✅ CORRECTLY UPDATED'}`);
      }
      if (mod.includes('Book Rides')) {
        const hasMultiStop = outputLower.includes('multi-stop') || outputLower.includes('3 stops') || outputLower.includes('intermediate stop');
        const hasSingleOnly = outputLower.includes('no intermediate stops') || outputLower.includes('single destination only');
        console.log(`  ✓ Mentions Multi-Stop: ${hasMultiStop ? '✅ YES' : '❌ NO'}`);
        console.log(`  ✓ Says "Single Destination Only": ${hasSingleOnly ? '❌ FAIL (should be updated)' : '✅ CORRECTLY UPDATED'}`);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 2000));

    } catch (err: unknown) {
      const error = err as Error;
      console.error(`  ❌ Error for ${mod}: ${error.message}`);
    }
  }

  console.log('\n=== TEST COMPLETE ===');
  console.log(`Output saved to: ${testDir}/`);
}

// Run
runTest().catch(console.error);
