/**
 * GET /api/automation-stats — Get latest stats for all suites
 * POST /api/automation-stats — Trigger a fresh collection for all suites
 */

import { NextResponse } from 'next/server';
import {
  loadSuiteConfigs,
  loadLatestSnapshot,
  saveSnapshot,
} from '@/lib/automation-stats/config';
import { collectSuiteStats } from '@/lib/automation-stats/collector';
import {
  updateCollectionProgress,
  resetCollectionProgress,
} from '@/lib/automation-stats/progress';

export const dynamic = 'force-dynamic';

export async function GET() {
  const suites = loadSuiteConfigs();
  const results = suites.map(suite => ({
    suite,
    stats: loadLatestSnapshot(suite.id),
  }));

  return NextResponse.json({ suites: results });
}

export async function POST() {
  const suites = loadSuiteConfigs();

  resetCollectionProgress();
  updateCollectionProgress({
    status: 'running',
    totalSuites: suites.length,
    message: 'Starting collection...',
  });

  // Run collection in background (non-blocking)
  (async () => {
    for (let i = 0; i < suites.length; i++) {
      const suite = suites[i];
      updateCollectionProgress({
        currentSuite: suite.name,
        message: `Collecting ${suite.name}...`,
      });

      try {
        const snapshot = await collectSuiteStats(suite, msg => {
          updateCollectionProgress({ message: msg });
        });
        saveSnapshot(snapshot);
        updateCollectionProgress({ completedSuites: i + 1 });
      } catch (err: unknown) {
        const e = err as Error;
        console.error(`[Stats] Failed to collect ${suite.name}:`, e.message);
        updateCollectionProgress({
          message: `Failed: ${suite.name} — ${e.message}`,
        });
      }
    }
    updateCollectionProgress({
      status: 'completed',
      message: 'All suites collected',
    });
  })().catch(err => {
    updateCollectionProgress({
      status: 'failed',
      message: (err as Error).message,
    });
  });

  return NextResponse.json({ started: true, totalSuites: suites.length });
}
