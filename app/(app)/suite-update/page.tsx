'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wrench,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Circle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { parseTestKeys } from '@/lib/automation-stats/parse-test-keys';

// ── Types ──

interface DeleteResult {
  key: string;
  status: 'deleted' | 'failed' | 'not-found';
  summary: string;
  message: string;
}

// ── Main Page ──

export default function SuiteUpdatePage() {
  const [input, setInput] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [results, setResults] = useState<DeleteResult[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [isDone, setIsDone] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const parsedKeys = useMemo(() => parseTestKeys(input), [input]);
  const isConfirmed = confirmText.toLowerCase().trim() === 'delete';
  const canDelete = parsedKeys.length > 0 && isConfirmed && !isDeleting;

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    setResults([]);
    setIsDone(false);
    setProcessed(0);
    setTotal(parsedKeys.length);

    await fetch('/api/suite-update/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueKeys: parsedKeys }),
    });

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/suite-update/bulk-delete');
        const data = await res.json();
        setProcessed(data.processed || 0);
        setTotal(data.total || 0);
        setCurrentKey(data.currentKey || '');
        setResults(data.results || []);

        if (data.status === 'completed' || data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setIsDeleting(false);
          setIsDone(true);
        }
      } catch {
        // ignore
      }
    }, 1000);
  };

  const handleReset = () => {
    setInput('');
    setConfirmText('');
    setResults([]);
    setIsDone(false);
    setProcessed(0);
    setTotal(0);
    setCurrentKey('');
  };

  const deletedCount = results.filter(r => r.status === 'deleted').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const notFoundCount = results.filter(r => r.status === 'not-found').length;

  const domain = 'yassir.atlassian.net';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Wrench className="h-6 w-6 text-purple-400" />
          <h1 className="text-xl font-bold text-foreground">Suite Update</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Tools for managing and maintaining test suites
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border">
        <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-purple-500 text-purple-400">
          <Trash2 className="h-3.5 w-3.5 inline mr-1.5" />
          Bulk Delete
        </button>
      </div>

      {/* Bulk Delete Content */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-1">
            <Trash2 className="h-4 w-4 text-red-400" />
            Bulk Delete Test Cases
          </h2>
          <p className="text-sm text-muted-foreground">
            Paste test case URLs or IDs to delete them from Jira.
          </p>
        </div>

        {/* Input area */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Test cases to delete
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isDeleting}
            placeholder={
              'Paste URLs, IDs, or bullet list...\n\nhttps://yassir.atlassian.net/browse/QATM-26662\nQATM-26663, QATM-26664\n* QATM-26665'
            }
            rows={6}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground text-xs font-mono focus:outline-none focus:border-purple-500 disabled:opacity-50 resize-none"
          />
        </div>

        {/* Parsed preview */}
        {parsedKeys.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Parsed:{' '}
              <span className="text-foreground font-medium">
                {parsedKeys.length}
              </span>{' '}
              test case{parsedKeys.length !== 1 ? 's' : ''}
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

        {/* Warning */}
        {parsedKeys.length > 0 && !isDone && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">Permanent Action</span>
            </div>
            <p className="text-xs text-red-300/80">
              Deleted test cases cannot be recovered. Make sure you have
              selected the correct items.
            </p>
          </div>
        )}

        {/* Confirmation */}
        {parsedKeys.length > 0 && !isDone && (
          <div>
            <label className="text-sm text-foreground mb-1.5 block">
              Type{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-red-400 font-mono text-xs">
                delete
              </code>{' '}
              to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              disabled={isDeleting}
              placeholder="Type delete to confirm"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50"
            />
          </div>
        )}

        {/* Delete button */}
        {!isDone && (
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete {parsedKeys.length} Test Case
                {parsedKeys.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        )}

        {/* Progress */}
        {(isDeleting || isDone) && total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {isDeleting && currentKey
                  ? `Deleting: ${currentKey}`
                  : 'Complete'}
              </span>
              <span className="text-foreground font-mono">
                {processed}/{total}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${total > 0 ? (processed / total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            {isDone && (
              <p className="text-xs text-muted-foreground">
                Summary:{' '}
                {deletedCount > 0 && (
                  <span className="text-emerald-400">
                    {deletedCount} deleted
                  </span>
                )}
                {notFoundCount > 0 && (
                  <span className="text-muted-foreground">
                    {deletedCount > 0 ? ', ' : ''}
                    {notFoundCount} not found
                  </span>
                )}
                {failedCount > 0 && (
                  <span className="text-red-400">
                    {deletedCount > 0 || notFoundCount > 0 ? ', ' : ''}
                    {failedCount} failed
                  </span>
                )}
              </p>
            )}

            <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-secondary divide-y divide-border">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 text-sm"
                >
                  {r.status === 'deleted' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  )}
                  {r.status === 'not-found' && (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  {r.status === 'failed' && (
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <a
                    href={`https://${domain}/browse/${r.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-purple-400 shrink-0 w-24 hover:underline inline-flex items-center gap-1"
                  >
                    {r.key}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  {r.summary && (
                    <span className="text-foreground truncate flex-1">
                      {r.summary}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground shrink-0">
                    {r.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        {isDone && (
          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}
