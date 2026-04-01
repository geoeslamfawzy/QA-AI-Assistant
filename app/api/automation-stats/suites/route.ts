/**
 * GET /api/automation-stats/suites — List suite configs
 * POST /api/automation-stats/suites — Add a new suite
 * DELETE /api/automation-stats/suites — Remove a suite
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  loadSuiteConfigs,
  saveSuiteConfigs,
  SuiteConfig,
} from '@/lib/automation-stats/config';

export async function GET() {
  return NextResponse.json({ suites: loadSuiteConfigs() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, parentKey, color, automatedLabel, notAutomatedLabel } = body;

  if (!name || !parentKey) {
    return NextResponse.json(
      { error: 'name and parentKey are required' },
      { status: 400 }
    );
  }

  const suites = loadSuiteConfigs();
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  if (suites.some(s => s.id === id)) {
    return NextResponse.json(
      { error: `Suite "${name}" already exists` },
      { status: 409 }
    );
  }

  const domain = process.env.JIRA_DOMAIN || 'yassir.atlassian.net';

  const newSuite: SuiteConfig = {
    id,
    name,
    parentKey: parentKey.toUpperCase(),
    parentUrl: `https://${domain}/browse/${parentKey.toUpperCase()}`,
    color: color || '#7C3AED',
    automatedLabel: automatedLabel || 'Automated',
    notAutomatedLabel: notAutomatedLabel || 'To_Be_Automated',
  };

  suites.push(newSuite);
  saveSuiteConfigs(suites);

  return NextResponse.json({ success: true, suite: newSuite });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const suites = loadSuiteConfigs();
  const filtered = suites.filter(s => s.id !== id);

  if (filtered.length === suites.length) {
    return NextResponse.json({ error: 'Suite not found' }, { status: 404 });
  }

  saveSuiteConfigs(filtered);
  return NextResponse.json({ success: true });
}
