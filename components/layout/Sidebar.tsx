'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Search,
  TestTubes,
  Bug,
  History,
  FileText,
  Settings,
} from 'lucide-react';

const workflowNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Analyze Story',
    href: '/analyze',
    icon: Search,
    badge: 3, // Example count
  },
  {
    name: 'Test Cases',
    href: '/test-cases',
    icon: TestTubes,
  },
  {
    name: 'Report Defect',
    href: '/defects',
    icon: Bug,
  },
];

const managementNavigation = [
  {
    name: 'History',
    href: '/history',
    icon: History,
  },
  {
    name: 'Prompt Templates',
    href: '/templates',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-border bg-sidebar">
      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        {/* Workflow Section */}
        <div className="px-4 mb-6">
          <h3 className="section-label mb-3 px-3">Workflow</h3>
          <nav className="flex flex-col gap-1">
            {workflowNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground active-indicator'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Management Section */}
        <div className="px-4">
          <h3 className="section-label mb-3 px-3">Management</h3>
          <nav className="flex flex-col gap-1">
            {managementNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground active-indicator'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      {/* Footer - User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          {/* Avatar with gradient */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500">
            <span className="text-xs font-bold text-white">EF</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-foreground">
              Eslam Fawzy
            </span>
            <span className="text-[11px] text-muted-foreground">QA Lead</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
