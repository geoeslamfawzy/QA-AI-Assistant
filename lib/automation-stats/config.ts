/**
 * Automation statistics configuration.
 *
 * Uses the XRAY JQL function `testSetTests()` to query tests
 * belonging to each configured Test Set.
 */

import * as fs from 'fs';
import * as path from 'path';

const CONFIG_PATH = path.resolve(
  process.cwd(),
  'knowledge-base/automation-stats-config.json'
);

export interface SuiteConfig {
  id: string;
  name: string;
  /** XRAY Test Set key (e.g., QATM-26668) */
  parentKey: string;
  parentUrl: string;
  color: string;
  automatedLabel: string;
  notAutomatedLabel: string;
}

export interface TestEntry {
  key: string;
  summary: string;
  url: string;
}

export interface StatsSnapshot {
  suiteId: string;
  date: string;
  total: number;
  automated: number;
  notAutomated: number;
  unlabeled: number;
  coveragePercent: number;
  automatedTests: TestEntry[];
  notAutomatedTests: TestEntry[];
  unlabeledTests: TestEntry[];
}

const DEFAULT_SUITES: SuiteConfig[] = [
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    parentKey: 'QATM-25917',
    parentUrl: 'https://yassir.atlassian.net/browse/QATM-25917',
    color: '#7C3AED',
    automatedLabel: 'Automated',
    notAutomatedLabel: 'To_Be_Automated',
  },
  {
    id: 'b2b-webapp',
    name: 'B2B Web App',
    parentKey: 'QATM-26668',
    parentUrl: 'https://yassir.atlassian.net/browse/QATM-26668',
    color: '#6D28D9',
    automatedLabel: 'Automated',
    notAutomatedLabel: 'To_Be_Automated',
  },
  {
    id: 'b2b-superapp',
    name: 'B2B Super App',
    parentKey: 'QATM-27731',
    parentUrl: 'https://yassir.atlassian.net/browse/QATM-27731',
    color: '#5B21B6',
    automatedLabel: 'Automated',
    notAutomatedLabel: 'To_Be_Automated',
  },
  {
    id: 'b2c-webapp',
    name: 'B2C WebApp',
    parentKey: 'QATM-28035',
    parentUrl: 'https://yassir.atlassian.net/browse/QATM-28035',
    color: '#8B5CF6',
    automatedLabel: 'Automated',
    notAutomatedLabel: 'To_Be_Automated',
  },
];

export function loadSuiteConfigs(): SuiteConfig[] {
  if (!fs.existsSync(CONFIG_PATH)) {
    saveSuiteConfigs(DEFAULT_SUITES);
    return DEFAULT_SUITES;
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    return DEFAULT_SUITES;
  }
}

export function saveSuiteConfigs(configs: SuiteConfig[]) {
  const dir = path.dirname(CONFIG_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2));
}

// Stats snapshots storage
const STATS_DIR = path.resolve(
  process.cwd(),
  'knowledge-base/automation-stats'
);

export function saveSnapshot(snapshot: StatsSnapshot) {
  fs.mkdirSync(STATS_DIR, { recursive: true });
  const file = path.join(
    STATS_DIR,
    `${snapshot.suiteId}-${snapshot.date}.json`
  );
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2));
}

export function loadLatestSnapshot(suiteId: string): StatsSnapshot | null {
  if (!fs.existsSync(STATS_DIR)) return null;
  const files = fs
    .readdirSync(STATS_DIR)
    .filter(f => f.startsWith(`${suiteId}-`) && f.endsWith('.json'))
    .sort()
    .reverse();
  if (files.length === 0) return null;
  try {
    return JSON.parse(
      fs.readFileSync(path.join(STATS_DIR, files[0]), 'utf-8')
    );
  } catch {
    return null;
  }
}

export function loadAllSnapshots(suiteId: string): StatsSnapshot[] {
  if (!fs.existsSync(STATS_DIR)) return [];
  return fs
    .readdirSync(STATS_DIR)
    .filter(f => f.startsWith(`${suiteId}-`) && f.endsWith('.json'))
    .sort()
    .map(f => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(STATS_DIR, f), 'utf-8')
        );
      } catch {
        return null;
      }
    })
    .filter((s): s is StatsSnapshot => s !== null);
}
