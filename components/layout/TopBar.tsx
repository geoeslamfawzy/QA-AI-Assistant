'use client';

import { Zap } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { TooltipProvider } from '@/components/ui/tooltip';

export interface JiraStatus {
  connected: boolean;
  isMock?: boolean;
  loading?: boolean;
  domain?: string;
  projectKey?: string;
  user?: string;
  error?: string;
}

export interface FigmaStatus {
  connected: boolean;
  isMock?: boolean;
  loading?: boolean;
}

export interface GeminiStatus {
  connected: boolean;
  loading?: boolean;
  model?: string;
  error?: string;
}

export interface ClaudeCliStatus {
  connected: boolean;
  loading?: boolean;
  version?: string;
  error?: string;
}

interface TopBarProps {
  jiraStatus?: JiraStatus;
  figmaStatus?: FigmaStatus;
  geminiStatus?: GeminiStatus;
  claudeCliStatus?: ClaudeCliStatus;
}

export function TopBar({ jiraStatus, figmaStatus, geminiStatus, claudeCliStatus }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border bg-secondary flex items-center justify-between px-6">
      {/* Left side - Logo and brand */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>

        {/* Brand name */}
        <span className="font-mono font-bold text-sm text-foreground">
          QA AI Agent
        </span>

        {/* Separator */}
        <span className="text-muted-foreground">•</span>

        {/* Project badge */}
        <span className="inline-flex items-center rounded-full bg-accent-dim px-3 py-1 text-xs font-medium text-primary">
          Yassir Mobility
        </span>
      </div>

      {/* Right side - Connection status */}
      <TooltipProvider>
        <div className="flex items-center gap-4">
          <ConnectionStatus
            service="jira"
            connected={jiraStatus?.connected ?? false}
            isMock={jiraStatus?.isMock ?? true}
            loading={jiraStatus?.loading ?? false}
            details={{
              domain: jiraStatus?.domain,
              projectKey: jiraStatus?.projectKey,
              user: jiraStatus?.user,
              error: jiraStatus?.error,
            }}
          />

          {/* Separator */}
          <span className="text-muted-foreground text-xs">•</span>

          <ConnectionStatus
            service="figma"
            connected={figmaStatus?.connected ?? false}
            isMock={figmaStatus?.isMock ?? true}
            loading={figmaStatus?.loading ?? false}
          />

          {/* Separator */}
          <span className="text-muted-foreground text-xs">•</span>

          <ConnectionStatus
            service="gemini"
            connected={geminiStatus?.connected ?? false}
            loading={geminiStatus?.loading ?? false}
            details={{
              model: geminiStatus?.model,
              error: geminiStatus?.error,
            }}
          />

          {/* Separator */}
          <span className="text-muted-foreground text-xs">&bull;</span>

          <ConnectionStatus
            service="claude-cli"
            connected={claudeCliStatus?.connected ?? false}
            loading={claudeCliStatus?.loading ?? false}
            details={{
              model: claudeCliStatus?.version,
              error: claudeCliStatus?.error,
            }}
          />
        </div>
      </TooltipProvider>
    </header>
  );
}
