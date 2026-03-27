'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ConnectionStatusProps {
  service: 'jira' | 'figma' | 'gemini' | 'claude-cli';
  connected: boolean;
  isMock?: boolean;
  loading?: boolean;
  details?: {
    domain?: string;
    projectKey?: string;
    user?: string;
    model?: string;
    error?: string;
  };
}

export function ConnectionStatus({
  service,
  connected,
  isMock = false,
  loading = false,
  details,
}: ConnectionStatusProps) {
  const labels: Record<string, string> = {
    jira: 'Jira',
    figma: 'Figma',
    gemini: 'Gemini',
    'claude-cli': 'Claude CLI',
  };
  const label = labels[service] || service;

  // Determine status color and text
  let statusColor = 'bg-muted-foreground';
  let statusText = label;

  if (loading) {
    statusColor = 'bg-muted-foreground';
    statusText = label;
  } else if (connected) {
    statusColor = 'bg-green-500';
    statusText = `${label} Connected`;
  } else if (isMock) {
    statusColor = 'bg-amber-500';
    statusText = `${label} (Mock)`;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-default">
          <div className="relative flex h-2 w-2">
            {loading ? (
              <Loader2 className="h-2 w-2 animate-spin text-muted-foreground" />
            ) : (
              <>
                {connected && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                )}
                <span
                  className={cn(
                    'relative inline-flex h-2 w-2 rounded-full',
                    statusColor
                  )}
                />
              </>
            )}
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {statusText}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-1 text-xs">
          {loading ? (
            <p className="text-muted-foreground">Checking connection...</p>
          ) : connected ? (
            <>
              <p className="font-medium text-green-500">Connected</p>
              {details?.domain && (
                <p className="text-muted-foreground">
                  Domain: {details.domain}
                </p>
              )}
              {details?.projectKey && (
                <p className="text-muted-foreground">
                  Project: {details.projectKey}
                </p>
              )}
              {details?.user && (
                <p className="text-muted-foreground">User: {details.user}</p>
              )}
              {details?.model && (
                <p className="text-muted-foreground">Model: {details.model}</p>
              )}
            </>
          ) : isMock ? (
            <>
              <p className="font-medium text-amber-500">Mock Mode</p>
              <p className="text-muted-foreground">
                Using simulated data. Configure credentials in .env.local for
                real integration.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-muted-foreground">Not Configured</p>
              {details?.error && (
                <p className="text-red-400 break-words">{details.error}</p>
              )}
              {!details?.error && (
                <p className="text-muted-foreground">
                  Add credentials to .env.local to connect.
                </p>
              )}
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
