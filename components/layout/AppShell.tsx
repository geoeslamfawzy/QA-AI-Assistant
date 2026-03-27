'use client';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useJiraConnectionStatus } from '@/lib/hooks/use-connection-status';
import { useGeminiConnectionStatus } from '@/lib/hooks/use-gemini-status';
import { useClaudeCliConnectionStatus } from '@/lib/hooks/use-claude-cli-status';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const jiraStatus = useJiraConnectionStatus();
  const geminiStatus = useGeminiConnectionStatus();
  const claudeCliStatus = useClaudeCliConnectionStatus();

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
            connected: false, // Figma integration for future
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
