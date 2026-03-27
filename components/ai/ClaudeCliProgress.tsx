/**
 * Shows Claude CLI execution progress.
 * Polls GET /api/ai/claude-cli every 2 seconds.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface ClaudeCliProgressProps {
  isActive: boolean;
  onComplete: (output: string) => void;
  onError: (error: string) => void;
}

export default function ClaudeCliProgress({
  isActive,
  onComplete,
  onError,
}: ClaudeCliProgressProps) {
  const [progress, setProgress] = useState<{
    status: string;
    output: string;
    error?: string;
    permissionPrompt?: string;
    startedAt?: string;
    model?: string;
  } | null>(null);

  const stableOnComplete = useCallback(onComplete, []);
  const stableOnError = useCallback(onError, []);

  useEffect(() => {
    if (!isActive) {
      setProgress(null);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/ai/claude-cli');
        const data = await res.json();
        setProgress(data);

        if (data.status === 'completed' && data.output) {
          clearInterval(interval);
          stableOnComplete(data.output);
        }
        if (data.status === 'failed') {
          clearInterval(interval);
          stableOnError(data.error || 'Claude CLI failed');
        }
      } catch {
        // ignore poll errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, stableOnComplete, stableOnError]);

  if (!isActive || !progress) return null;

  return (
    <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
      {/* Status header */}
      <div className="flex items-center gap-2 mb-3">
        {progress.status === 'running' && (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm text-primary">
              Claude CLI processing... ({progress.model})
            </span>
          </>
        )}
        {progress.status === 'starting' && (
          <>
            <div className="animate-pulse h-4 w-4 bg-amber-500 rounded-full" />
            <span className="text-sm text-amber-500">
              Starting Claude CLI...
            </span>
          </>
        )}
        {progress.status === 'permission-required' && (
          <>
            <span className="text-lg">&#x26A0;&#xFE0F;</span>
            <span className="text-sm text-amber-500">
              Claude CLI needs permission
            </span>
          </>
        )}
        {progress.status === 'completed' && (
          <>
            <span className="text-lg">&#x2705;</span>
            <span className="text-sm text-green-500">Complete</span>
          </>
        )}
        {progress.status === 'failed' && (
          <>
            <span className="text-lg">&#x274C;</span>
            <span className="text-sm text-red-500">Failed</span>
          </>
        )}
      </div>

      {/* Permission prompt */}
      {progress.status === 'permission-required' && progress.permissionPrompt && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-3">
          <p className="text-sm text-amber-400 mb-2">
            Claude CLI needs permission in the terminal:
          </p>
          <pre className="text-xs text-amber-200 bg-background p-2 rounded">
            {progress.permissionPrompt}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            Go to your terminal and approve/deny the request.
          </p>
        </div>
      )}

      {/* Output preview */}
      {progress.output && progress.status === 'running' && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">
            Output preview ({progress.output.length} chars so far):
          </p>
          <pre className="text-xs text-muted-foreground bg-background p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap">
            {progress.output.substring(progress.output.length - 500)}
          </pre>
        </div>
      )}

      {/* Error */}
      {progress.status === 'failed' && progress.error && (
        <div className="text-sm text-red-500 mt-2">{progress.error}</div>
      )}

      {/* Elapsed time */}
      {progress.startedAt && progress.status === 'running' && (
        <ElapsedTime startedAt={progress.startedAt} />
      )}
    </div>
  );
}

function ElapsedTime({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="text-xs text-muted-foreground mt-2">Elapsed: {elapsed}s</div>
  );
}
