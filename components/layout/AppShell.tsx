'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useJiraConnectionStatus } from '@/lib/hooks/use-connection-status';
import { useGeminiConnectionStatus } from '@/lib/hooks/use-gemini-status';
import { useClaudeCliConnectionStatus } from '@/lib/hooks/use-claude-cli-status';
import { useAuthCheck } from '@/lib/hooks/useAuthCheck';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const jiraStatus = useJiraConnectionStatus();
  const geminiStatus = useGeminiConnectionStatus();
  const claudeCliStatus = useClaudeCliConnectionStatus();

  // Intercept 401 errors and redirect to setup
  useAuthCheck();

  // Check if setup is needed on mount
  useEffect(() => {
    fetch('/api/setup')
      .then((r) => r.json())
      .then((data) => {
        if (data.setupRequired) {
          router.replace('/setup');
        } else {
          // Set cookie for 24 hours so subsequent loads skip the check
          document.cookie =
            'qa-agent-setup-complete=true; path=/; max-age=86400';
          setReady(true);
        }
      })
      .catch(() => {
        // On error, let them through — don't block the app
        setReady(true);
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-[260px_1fr] grid-rows-[56px_1fr] overflow-hidden bg-background">
      {/* TopBar - spans full width */}
      <div className="col-span-2">
        <TopBar
          jiraStatus={{
            connected: jiraStatus.connected,
            isMock: jiraStatus.isMock,
            loading: jiraStatus.loading,
            domain: jiraStatus.domain,
            projectKey: jiraStatus.projectKey,
            user: jiraStatus.user,
            error: jiraStatus.error,
          }}
          figmaStatus={{
            connected: false,
            isMock: true,
          }}
          geminiStatus={{
            connected: geminiStatus.connected,
            loading: geminiStatus.loading,
            model: geminiStatus.model,
            error: geminiStatus.error,
          }}
          claudeCliStatus={{
            connected: claudeCliStatus.available,
            loading: claudeCliStatus.loading,
            version: claudeCliStatus.version,
            error: claudeCliStatus.error,
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="overflow-auto p-6">{children}</main>
    </div>
  );
}
