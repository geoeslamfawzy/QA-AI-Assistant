/**
 * Auto-collection: runs daily if last snapshot is older than today.
 * Called from the GET /api/automation-stats endpoint on page load.
 */

import { loadSuiteConfigs, loadLatestSnapshot, saveSnapshot } from './config';
import { collectSuiteStats } from './collector';

export async function runDailyCollectionIfNeeded(): Promise<boolean> {
  const suites = loadSuiteConfigs();
  if (suites.length === 0) return false;

  // Check if we already collected today
  const today = new Date().toISOString().split('T')[0];
  const firstSuiteStats = loadLatestSnapshot(suites[0].id);

  if (firstSuiteStats?.date === today) {
    return false;
  }

  console.log('[Stats Cron] Running daily collection...');

  for (const suite of suites) {
    try {
      const snapshot = await collectSuiteStats(suite, msg => {
        console.log(`[Stats Cron] ${suite.name}: ${msg}`);
      });
      saveSnapshot(snapshot);
      console.log(
        `[Stats Cron] ${suite.name}: ${snapshot.coveragePercent}% (${snapshot.automated}/${snapshot.total})`
      );
    } catch (err: unknown) {
      const e = err as Error;
      console.error(`[Stats Cron] ${suite.name} failed:`, e.message);
    }
  }

  return true;
}
