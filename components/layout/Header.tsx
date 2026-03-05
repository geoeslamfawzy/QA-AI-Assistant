'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw, Database, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Overview of QA activities and knowledge base health',
  },
  '/analyze': {
    title: 'Story Analyzer',
    description:
      'Analyze user stories for completeness, ambiguity, and missing requirements',
  },
  '/test-cases': {
    title: 'Test Case Generator',
    description:
      'Generate comprehensive test cases from user stories',
  },
  '/impact': {
    title: 'Impact Detector',
    description: 'Detect how changes affect the existing system',
  },
  '/context': {
    title: 'Project Context',
    description: 'Browse and manage the knowledge base',
  },
  '/history': {
    title: 'Change Log',
    description: 'Track all modifications to the project context',
  },
  '/settings': {
    title: 'Settings',
    description: 'Configure the QA AI Agent',
  },
};

function getBreadcrumbs(pathname: string): string[] {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part) =>
    part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
  );
}

export function Header() {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageInfo = pageTitles[pathname] || {
    title: 'QA AI Agent',
    description: '',
  };
  const breadcrumbs = getBreadcrumbs(pathname);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Implement index refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side - Breadcrumbs and title */}
      <div className="flex flex-col gap-0.5">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>QA AI Agent</span>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'text-foreground font-medium'
                    : ''
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        {/* Page title */}
        <h1 className="text-lg font-semibold text-foreground">
          {pageInfo.title}
        </h1>
      </div>

      {/* Right side - Status and actions */}
      <div className="flex items-center gap-4">
        {/* Knowledge base status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">28 modules</span>
              <Badge variant="secondary" className="text-xs">
                v1.0
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Knowledge base: 28 modules indexed</p>
            <p className="text-xs text-muted-foreground">Last updated: just now</p>
          </TooltipContent>
        </Tooltip>

        {/* Refresh button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span className="ml-2 hidden sm:inline">Rebuild Index</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rebuild the search index</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
