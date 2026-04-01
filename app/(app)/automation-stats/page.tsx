'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BarChart3,
  RefreshCw,
  Plus,
  X,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Trash2,
  Download,
  Pencil,
  SkipForward,
  XCircle,
} from 'lucide-react';
import { parseTestKeys } from '@/lib/automation-stats/parse-test-keys';

// ── Types ──

interface TestEntry {
  key: string;
  summary: string;
  url: string;
}

interface SuiteConfig {
  id: string;
  name: string;
  parentKey: string;
  parentUrl: string;
  color: string;
  automatedLabel: string;
  notAutomatedLabel: string;
}

interface StatsSnapshot {
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

interface SuiteResult {
  suite: SuiteConfig;
  stats: StatsSnapshot | null;
}

interface CollectionProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentSuite: string;
  completedSuites: number;
  totalSuites: number;
  message: string;
}

// ── Main Page ──

export default function AutomationStatsPage() {
  const [suiteResults, setSuiteResults] = useState<SuiteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<CollectionProgress | null>(null);
  const [showAddSuite, setShowAddSuite] = useState(false);
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [testListModal, setTestListModal] = useState<{
    title: string;
    tests: TestEntry[];
    type: 'automated' | 'not-automated' | 'unlabeled';
  } | null>(null);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/automation-stats');
      const data = await res.json();
      setSuiteResults(data.suites || []);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Poll progress while refreshing
  useEffect(() => {
    if (!refreshing) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/automation-stats/progress');
        const prog: CollectionProgress = await res.json();
        setProgress(prog);

        if (prog.status === 'completed' || prog.status === 'failed') {
          setRefreshing(false);
          if (pollRef.current) clearInterval(pollRef.current);
          // Re-fetch stats after collection completes
          fetchStats();
        }
      } catch {
        // ignore
      }
    }, 1500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refreshing, fetchStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setProgress({
      status: 'running',
      currentSuite: '',
      completedSuites: 0,
      totalSuites: suiteResults.length,
      message: 'Starting...',
    });

    try {
      await fetch('/api/automation-stats', { method: 'POST' });
    } catch (err) {
      console.error('Failed to trigger refresh:', err);
      setRefreshing(false);
    }
  };

  const handleDeleteSuite = async (id: string) => {
    try {
      await fetch('/api/automation-stats/suites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchStats();
    } catch (err) {
      console.error('Failed to delete suite:', err);
    }
  };

  // Summary stats
  const totalTests = suiteResults.reduce(
    (sum, r) => sum + (r.stats?.total || 0),
    0
  );
  const totalAutomated = suiteResults.reduce(
    (sum, r) => sum + (r.stats?.automated || 0),
    0
  );
  const overallCoverage =
    totalTests > 0
      ? Math.round((totalAutomated / totalTests) * 1000) / 10
      : 0;
  const lastUpdated = suiteResults.find(r => r.stats)?.stats?.date;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold text-foreground">
              Regression &amp; E2E Automation Overview
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {lastUpdated
              ? `Last updated: ${new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
              : 'No data collected yet'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabelDialog(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-secondary border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Update Labels
          </button>
          <button
            onClick={() => setShowAddSuite(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-secondary border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Suite
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Collecting...' : 'Refresh Stats'}
          </button>
        </div>
      </div>

      {/* Progress bar during collection */}
      {refreshing && progress && (
        <div className="bg-secondary border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              {progress.currentSuite
                ? `Collecting: ${progress.currentSuite}`
                : 'Starting...'}
            </span>
            <span className="text-muted-foreground">
              {progress.completedSuites}/{progress.totalSuites} suites
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progress.totalSuites > 0 ? (progress.completedSuites / progress.totalSuites) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress.message}</p>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && totalTests > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Total Test Cases
            </p>
            <p className="text-2xl font-bold text-foreground">{totalTests}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Automated
            </p>
            <p className="text-2xl font-bold text-emerald-400">
              {totalAutomated}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Overall Coverage
            </p>
            <p className="text-2xl font-bold text-purple-400">
              {overallCoverage}%
            </p>
          </div>
        </div>
      )}

      {/* Suite Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : suiteResults.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No test suites configured.</p>
          <button
            onClick={() => setShowAddSuite(true)}
            className="mt-3 text-purple-400 hover:text-purple-300 text-sm"
          >
            Add your first suite
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suiteResults.map(({ suite, stats }) => (
            <SuiteCard
              key={suite.id}
              suite={suite}
              stats={stats}
              onViewTests={(title, tests, type) =>
                setTestListModal({ title, tests, type })
              }
              onDelete={() => handleDeleteSuite(suite.id)}
            />
          ))}
        </div>
      )}

      {/* Test List Modal */}
      {testListModal && (
        <TestListModal
          title={testListModal.title}
          tests={testListModal.tests}
          type={testListModal.type}
          onClose={() => setTestListModal(null)}
        />
      )}

      {/* Add Suite Dialog */}
      {showAddSuite && (
        <AddSuiteDialog
          onClose={() => setShowAddSuite(false)}
          onAdded={() => {
            setShowAddSuite(false);
            fetchStats();
          }}
        />
      )}

      {/* Bulk Label Update Dialog */}
      {showLabelDialog && (
        <BulkLabelDialog onClose={() => setShowLabelDialog(false)} />
      )}
    </div>
  );
}

// ── Suite Card ──

function SuiteCard({
  suite,
  stats,
  onViewTests,
  onDelete,
}: {
  suite: SuiteConfig;
  stats: StatsSnapshot | null;
  onViewTests: (
    title: string,
    tests: TestEntry[],
    type: 'automated' | 'not-automated' | 'unlabeled'
  ) => void;
  onDelete: () => void;
}) {
  if (!stats) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">{suite.name}</h3>
          <button
            onClick={onDelete}
            className="text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          No data collected yet. Click &ldquo;Refresh Stats&rdquo; to collect.
        </p>
        <a
          href={suite.parentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1"
        >
          {suite.parentKey}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  }

  const { coveragePercent, total, automated, notAutomated, unlabeled } = stats;
  const riskInfo = getRiskInfo(coveragePercent);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{suite.name}</h3>
          <a
            href={suite.parentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
          >
            {suite.parentKey}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Coverage Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-2xl font-bold" style={{ color: suite.color }}>
            {coveragePercent}%
          </span>
          <span className="text-xs text-muted-foreground">
            {total} test cases
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{
              width: `${coveragePercent}%`,
              backgroundColor: suite.color,
            }}
          />
        </div>
      </div>

      {/* Counts — clickable */}
      <div className="space-y-1.5">
        <button
          onClick={() =>
            onViewTests(
              `Automated Tests — ${suite.name}`,
              stats.automatedTests,
              'automated'
            )
          }
          className="w-full flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted transition-colors text-left"
        >
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Automated
          </span>
          <span className="font-mono text-foreground">{automated}</span>
        </button>
        <button
          onClick={() =>
            onViewTests(
              `Not Automated — ${suite.name}`,
              stats.notAutomatedTests,
              'not-automated'
            )
          }
          className="w-full flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted transition-colors text-left"
        >
          <span className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Not Automated
          </span>
          <span className="font-mono text-foreground">{notAutomated}</span>
        </button>
        {unlabeled > 0 && (
          <button
            onClick={() =>
              onViewTests(
                `Unlabeled — ${suite.name}`,
                stats.unlabeledTests,
                'unlabeled'
              )
            }
            className="w-full flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted transition-colors text-left"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <Circle className="h-3.5 w-3.5" />
              Unlabeled
            </span>
            <span className="font-mono text-foreground">{unlabeled}</span>
          </button>
        )}
      </div>

      {/* Risk Label */}
      <div
        className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${riskInfo.className}`}
      >
        {riskInfo.icon}
        {riskInfo.label}
      </div>
    </div>
  );
}

// ── Test List Modal ──

function TestListModal({
  title,
  tests,
  type,
  onClose,
}: {
  title: string;
  tests: TestEntry[];
  type: 'automated' | 'not-automated' | 'unlabeled';
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = tests.filter(
    t =>
      t.key.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const header = 'Key,Summary,URL\n';
    const rows = tests
      .map(t => `"${t.key}","${t.summary.replace(/"/g, '""')}","${t.url}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-tests.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeColor =
    type === 'automated'
      ? 'text-emerald-400'
      : type === 'not-automated'
        ? 'text-amber-400'
        : 'text-muted-foreground';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className={`font-semibold ${typeColor}`}>{title}</h2>
            <p className="text-xs text-muted-foreground">
              {tests.length} test{tests.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by key or summary..."
              className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              {search ? 'No matching tests found.' : 'No tests in this category.'}
            </p>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(test => (
                <a
                  key={test.key}
                  href={test.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <span className="font-mono text-xs text-purple-400 shrink-0 w-24">
                    {test.key}
                  </span>
                  <span className="text-sm text-foreground truncate flex-1">
                    {test.summary}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Showing {filtered.length} of {tests.length} tests
          </span>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Suite Dialog ──

function AddSuiteDialog({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState('');
  const [parentKey, setParentKey] = useState('');
  const [automatedLabel, setAutomatedLabel] = useState('Automated');
  const [notAutomatedLabel, setNotAutomatedLabel] = useState('To_Be_Automated');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !parentKey.trim()) {
      setError('Name and Test Set key are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/automation-stats/suites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          parentKey,
          automatedLabel,
          notAutomatedLabel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add suite');
        setSubmitting(false);
        return;
      }

      onAdded();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Add New Test Suite</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Suite Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Driver App"
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Test Set Key <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={parentKey}
            onChange={e => setParentKey(e.target.value.toUpperCase())}
            placeholder="e.g., QATM-30000"
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-purple-500 uppercase"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The XRAY Test Set issue key containing the test cases
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Automated Label
            </label>
            <input
              type="text"
              value={automatedLabel}
              onChange={e => setAutomatedLabel(e.target.value)}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Not-Automated Label
            </label>
            <input
              type="text"
              value={notAutomatedLabel}
              onChange={e => setNotAutomatedLabel(e.target.value)}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Adding...
            </>
          ) : (
            'Add Suite'
          )}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ──

function getRiskInfo(coverage: number) {
  if (coverage >= 100) {
    return {
      label: 'Full coverage',
      className: 'bg-emerald-500/10 text-emerald-400',
      icon: <CheckCircle2 className="h-3 w-3" />,
    };
  }
  if (coverage >= 75) {
    return {
      label: 'Low risk',
      className: 'bg-emerald-500/10 text-emerald-400',
      icon: <CheckCircle2 className="h-3 w-3" />,
    };
  }
  if (coverage >= 50) {
    return {
      label: 'Medium risk',
      className: 'bg-yellow-500/10 text-yellow-400',
      icon: <AlertTriangle className="h-3 w-3" />,
    };
  }
  if (coverage >= 25) {
    return {
      label: 'Medium-High risk',
      className: 'bg-orange-500/10 text-orange-400',
      icon: <AlertTriangle className="h-3 w-3" />,
    };
  }
  return {
    label: 'High risk',
    className: 'bg-red-500/10 text-red-400',
    icon: <AlertTriangle className="h-3 w-3" />,
  };
}

// ── Bulk Label Update Dialog ──

interface LabelUpdateResult {
  key: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
}

function BulkLabelDialog({ onClose }: { onClose: () => void }) {
  const [labelInput, setLabelInput] = useState('');
  const [fromLabel, setFromLabel] = useState('To_Be_Automated');
  const [toLabel, setToLabel] = useState('Automated');
  const [parsedKeys, setParsedKeys] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResults, setUpdateResults] = useState<LabelUpdateResult[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [done, setDone] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Parse on input change
  useEffect(() => {
    setParsedKeys(parseTestKeys(labelInput));
  }, [labelInput]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleUpdate = async () => {
    if (parsedKeys.length === 0) return;
    setIsUpdating(true);
    setUpdateResults([]);
    setProcessed(0);
    setTotal(parsedKeys.length);
    setDone(false);

    await fetch('/api/automation-stats/update-labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issueKeys: parsedKeys,
        fromLabel,
        toLabel,
      }),
    });

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/automation-stats/update-labels');
        const data = await res.json();
        setProcessed(data.processed || 0);
        setTotal(data.total || 0);
        setCurrentKey(data.currentKey || '');
        setUpdateResults(data.results || []);

        if (data.status === 'completed' || data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setIsUpdating(false);
          setDone(true);
        }
      } catch {
        // ignore polling errors
      }
    }, 1000);
  };

  const successCount = updateResults.filter(r => r.status === 'success').length;
  const skippedCount = updateResults.filter(r => r.status === 'skipped').length;
  const failedCount = updateResults.filter(r => r.status === 'failed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Pencil className="h-4 w-4 text-purple-400" />
              Bulk Update Labels
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste test case URLs or IDs to update their labels
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Label config */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Remove label
              </label>
              <input
                type="text"
                value={fromLabel}
                onChange={e => setFromLabel(e.target.value)}
                disabled={isUpdating}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Add label
              </label>
              <input
                type="text"
                value={toLabel}
                onChange={e => setToLabel(e.target.value)}
                disabled={isUpdating}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Input area */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Test cases
            </label>
            <textarea
              value={labelInput}
              onChange={e => setLabelInput(e.target.value)}
              disabled={isUpdating}
              placeholder={
                'Paste URLs, IDs, or bullet list...\n\nhttps://yassir.atlassian.net/browse/QATM-26662\nQATM-26663, QATM-26664\n* QATM-26665'
              }
              rows={5}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground text-xs font-mono focus:outline-none focus:border-purple-500 disabled:opacity-50 resize-none"
            />
          </div>

          {/* Parsed preview */}
          {parsedKeys.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Parsed: <span className="text-foreground font-medium">{parsedKeys.length}</span> test case{parsedKeys.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {parsedKeys.map(key => (
                  <span
                    key={key}
                    className="bg-secondary border border-border px-2 py-0.5 rounded text-xs font-mono text-purple-400"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          {!done && (
            <button
              onClick={handleUpdate}
              disabled={isUpdating || parsedKeys.length === 0}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Updating...
                </>
              ) : (
                `Update ${parsedKeys.length} Test Case${parsedKeys.length !== 1 ? 's' : ''}`
              )}
            </button>
          )}

          {/* Progress */}
          {(isUpdating || done) && total > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {isUpdating && currentKey
                    ? `Processing: ${currentKey}`
                    : 'Complete'}
                </span>
                <span className="text-foreground font-mono">
                  {processed}/{total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${total > 0 ? (processed / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {updateResults.length > 0 && (
            <div className="space-y-1.5">
              {done && (
                <p className="text-xs text-muted-foreground">
                  Summary:{' '}
                  {successCount > 0 && (
                    <span className="text-emerald-400">{successCount} updated</span>
                  )}
                  {skippedCount > 0 && (
                    <span className="text-muted-foreground">
                      {successCount > 0 ? ', ' : ''}{skippedCount} skipped
                    </span>
                  )}
                  {failedCount > 0 && (
                    <span className="text-red-400">
                      {successCount > 0 || skippedCount > 0 ? ', ' : ''}{failedCount} failed
                    </span>
                  )}
                </p>
              )}
              <div className="max-h-48 overflow-y-auto space-y-0.5 rounded-lg border border-border bg-secondary p-2">
                {updateResults.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs py-0.5"
                  >
                    {r.status === 'success' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {r.status === 'skipped' && (
                      <SkipForward className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    {r.status === 'failed' && (
                      <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className="font-mono text-purple-400 shrink-0 w-24">
                      {r.key}
                    </span>
                    <span className="text-muted-foreground">{r.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {done && (
          <div className="p-3 border-t border-border">
            <button
              onClick={onClose}
              className="w-full py-2 bg-secondary border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
