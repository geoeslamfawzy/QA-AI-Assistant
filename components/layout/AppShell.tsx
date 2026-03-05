'use client';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useJiraConnectionStatus } from '@/lib/hooks/use-connection-status';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const jiraStatus = useJiraConnectionStatus();

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
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="overflow-auto p-6">{children}</main>
    </div>
  );
}
