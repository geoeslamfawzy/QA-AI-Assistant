'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  Copy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ModuleGenStatus } from '@/lib/context-sync/types';

// ────────────────────────────────────
// TYPES
// ────────────────────────────────────

interface ModuleOutputCardProps {
  module: ModuleGenStatus;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface ModuleContent {
  slug: string;
  title: string;
  content: string;
  rawContent: string;
  lastUpdated: string;
}

// ────────────────────────────────────
// COMPONENT
// ────────────────────────────────────

export function ModuleOutputCard({
  module,
  isExpanded = false,
  onToggleExpand,
}: ModuleOutputCardProps) {
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch content when expanded and module is completed
  useEffect(() => {
    if (isExpanded && module.status === 'completed' && !content && !isLoading) {
      fetchContent();
    }
  }, [isExpanded, module.status]);

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/context/${module.moduleSlug}`);
      const data = await response.json();
      if (data.success && data.module) {
        setContent(data.module);
      } else {
        setError(data.error || 'Failed to load content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content.content);
      setCopied(true);
      toast.success('Content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy content');
    }
  };

  const canExpand = module.status === 'completed';

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Header */}
      <button
        onClick={canExpand ? onToggleExpand : undefined}
        className={cn(
          'w-full flex items-center justify-between p-3 text-left transition-colors',
          canExpand && 'hover:bg-muted/50 cursor-pointer',
          !canExpand && 'cursor-default opacity-75'
        )}
        disabled={!canExpand}
      >
        <div className="flex items-center gap-2">
          {canExpand && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          )}
          {module.status === 'completed' ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : module.status === 'failed' ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : (
            <FileText className="h-4 w-4 text-primary" />
          )}
          <span className="font-medium text-sm">{module.moduleName}</span>
          <span className="text-xs text-muted-foreground">
            ({module.activeTicketCount} active tickets)
          </span>
        </div>
        {module.status === 'completed' && !isExpanded && (
          <a
            href={`/project-context/${module.moduleSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {module.status === 'failed' && (
          <span className="text-xs text-red-500 truncate max-w-[200px]">
            {module.error}
          </span>
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading content...</span>
            </div>
          ) : error ? (
            <div className="text-sm text-red-500 py-4">{error}</div>
          ) : content ? (
            <div className="space-y-3">
              {/* Preview of generated content */}
              <div className="max-h-64 overflow-y-auto rounded-md bg-background border border-border">
                <pre className="text-xs p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed text-muted-foreground">
                  {content.content.substring(0, 1500)}
                  {content.content.length > 1500 && (
                    <span className="text-blue-500">
                      {'\n\n'}... [Content truncated. Open in Editor to see full content]
                    </span>
                  )}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Last updated: {new Date(content.lastUpdated).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyContent}
                    className="h-7 text-xs"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/project-context/${module.moduleSlug}`, '_blank')}
                    className="h-7 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open in Editor
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-4">
              {module.generatedContentPreview || 'No content preview available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
