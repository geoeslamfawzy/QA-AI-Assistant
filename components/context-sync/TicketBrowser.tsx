'use client';

import { useState, useEffect, useCallback, Fragment, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  Loader2,
  ExternalLink,
  Calendar,
  Tag,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { IndexedTicket, ContextGenerationProgress, ModuleGenStatus } from '@/lib/context-sync/types';
import { ModuleOutputCard } from './ModuleOutputCard';

// ────────────────────────────────────
// TYPES
// ────────────────────────────────────

interface TicketsApiResponse {
  success: boolean;
  data?: {
    tickets: IndexedTicket[];
    pagination: {
      page: number;
      limit: number;
      totalTickets: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      modules: { slug: string; name: string; count: number }[];
      statuses: { status: string; count: number }[];
    };
    lastUpdated: string;
  };
  error?: string;
}

interface GenerateApiResponse {
  success: boolean;
  progress: ContextGenerationProgress;
  claudeAvailable: boolean;
}

interface TicketBrowserProps {
  /** Show the "Generate Context" button and progress UI */
  showGenerateButton?: boolean;
}

// ────────────────────────────────────
// STATUS BADGE CONFIGURATION
// ────────────────────────────────────

const statusConfig: Record<string, { dotColor: string; bgColor: string }> = {
  'To Do': { dotColor: 'bg-slate-500', bgColor: 'bg-slate-500/20 text-slate-500' },
  'In Progress': { dotColor: 'bg-blue-500', bgColor: 'bg-blue-500/20 text-blue-500' },
  'In Review': { dotColor: 'bg-amber-500', bgColor: 'bg-amber-500/20 text-amber-500' },
  Done: { dotColor: 'bg-green-500', bgColor: 'bg-green-500/20 text-green-500' },
  Blocked: { dotColor: 'bg-red-500', bgColor: 'bg-red-500/20 text-red-500' },
  Closed: { dotColor: 'bg-gray-500', bgColor: 'bg-gray-500/20 text-gray-500' },
};

const priorityConfig: Record<string, { dotColor: string }> = {
  Highest: { dotColor: 'bg-red-500' },
  High: { dotColor: 'bg-amber-500' },
  Medium: { dotColor: 'bg-yellow-500' },
  Low: { dotColor: 'bg-cyan-500' },
  Lowest: { dotColor: 'bg-slate-500' },
};

// ────────────────────────────────────
// COMPONENT
// ────────────────────────────────────

export function TicketBrowser({ showGenerateButton = false }: TicketBrowserProps) {
  // Data state
  const [tickets, setTickets] = useState<IndexedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  // Filter state
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filter options (from API)
  const [moduleOptions, setModuleOptions] = useState<
    { slug: string; name: string; count: number }[]
  >([]);
  const [statusOptions, setStatusOptions] = useState<
    { status: string; count: number }[]
  >([]);

  // Expansion state (like TestCaseTable)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Output viewer expansion state
  const [expandedOutputs, setExpandedOutputs] = useState<Set<string>>(new Set());

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] =
    useState<ContextGenerationProgress | null>(null);
  const [claudeAvailable, setClaudeAvailable] = useState(false);

  // ────────────────────────────────────
  // DEBOUNCE SEARCH
  // ────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ────────────────────────────────────
  // FETCH TICKETS
  // ────────────────────────────────────

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (moduleFilter) params.set('module', moduleFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const response = await fetch(`/api/context-sync/tickets?${params}`);
      const data: TicketsApiResponse = await response.json();

      if (data.success && data.data) {
        setTickets(data.data.tickets);
        setTotalPages(data.data.pagination.totalPages);
        setTotalTickets(data.data.pagination.totalTickets);
        setModuleOptions(data.data.filters.modules);
        setStatusOptions(data.data.filters.statuses);
      } else {
        setError(data.error || 'Failed to fetch tickets');
        setTickets([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, moduleFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ────────────────────────────────────
  // EXPANSION HANDLERS
  // ────────────────────────────────────

  const toggleExpand = useCallback((ticketId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(tickets.map((t) => t.ticketId)));
  }, [tickets]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const toggleOutputExpand = useCallback((moduleSlug: string) => {
    setExpandedOutputs((prev) => {
      const next = new Set(prev);
      if (next.has(moduleSlug)) {
        next.delete(moduleSlug);
      } else {
        next.add(moduleSlug);
      }
      return next;
    });
  }, []);

  // ────────────────────────────────────
  // CONTEXT GENERATION
  // ────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress({
      status: 'running',
      modulesProcessed: 0,
      totalModules: 0,
      percentComplete: 0,
      errors: [],
    });

    try {
      // Start generation
      const startRes = await fetch('/api/context-sync/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waitForCompletion: false }),
      });

      if (!startRes.ok) {
        const errData = await startRes.json();
        throw new Error(errData.error || 'Failed to start generation');
      }

      // Poll for progress
      const pollProgress = async () => {
        try {
          const res = await fetch('/api/context-sync/generate');
          const data: GenerateApiResponse = await res.json();

          if (data.success) {
            setGenerationProgress(data.progress);
            setClaudeAvailable(data.claudeAvailable);

            if (
              data.progress.status === 'completed' ||
              data.progress.status === 'failed'
            ) {
              setIsGenerating(false);

              if (data.progress.status === 'completed') {
                toast.success(
                  `Generated context for ${data.progress.modulesProcessed} modules`
                );
              } else if (data.progress.errors.length > 0) {
                toast.error(data.progress.errors[0]);
              }
              return;
            }
          }
        } catch (err) {
          console.error('Progress poll error:', err);
        }

        // Continue polling
        if (isGenerating) {
          setTimeout(pollProgress, 3000);
        }
      };

      // Start polling
      setTimeout(pollProgress, 1000);
    } catch (err) {
      setIsGenerating(false);
      toast.error(err instanceof Error ? err.message : 'Generation failed');
    }
  }, [isGenerating]);

  // Check initial Claude availability
  useEffect(() => {
    fetch('/api/context-sync/generate')
      .then((res) => res.json())
      .then((data: GenerateApiResponse) => {
        setClaudeAvailable(data.claudeAvailable);
        if (data.progress.status === 'running') {
          setIsGenerating(true);
          setGenerationProgress(data.progress);
        }
      })
      .catch(() => {});
  }, []);

  // ────────────────────────────────────
  // RENDER
  // ────────────────────────────────────

  if (error && tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Run a Jira sync to populate the ticket browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {totalTickets} tickets
            {expandedIds.size > 0 && (
              <span className="ml-1 text-primary">
                ({expandedIds.size} expanded)
              </span>
            )}
          </p>
          {tickets.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={expandedIds.size > 0 ? collapseAll : expandAll}
              className="text-xs text-muted-foreground"
            >
              {expandedIds.size > 0 ? 'Collapse All' : 'Expand All'}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        {/* Module filter */}
        <Select
          value={moduleFilter}
          onValueChange={(value) => {
            setModuleFilter(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {moduleOptions.map((m) => (
              <SelectItem key={m.slug} value={m.slug}>
                {m.name} ({m.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s.status} value={s.status}>
                {s.status} ({s.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="w-28 font-mono text-xs">Key</TableHead>
              <TableHead className="text-xs">Title</TableHead>
              <TableHead className="w-40 text-xs">Module</TableHead>
              <TableHead className="w-24 text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => {
                const isExpanded = expandedIds.has(ticket.ticketId);
                const status = statusConfig[ticket.status] || statusConfig['To Do'];
                const priority = priorityConfig[ticket.priority] || priorityConfig['Medium'];

                return (
                  <Fragment key={ticket.ticketId}>
                    <TableRow
                      className={cn(
                        'hover:bg-muted/50 cursor-pointer',
                        isExpanded && 'bg-muted/30'
                      )}
                      onClick={() => toggleExpand(ticket.ticketId)}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(ticket.ticketId);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400">
                        {ticket.ticketId}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium line-clamp-1">
                            {ticket.title}
                          </p>
                          {!isExpanded && ticket.userStory && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {ticket.userStory.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground truncate block">
                          {ticket.module}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full', status.dotColor)} />
                          <span className="text-xs text-muted-foreground">
                            {ticket.status}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="p-4">
                          <div className="space-y-4 text-sm">
                            {/* Description */}
                            {ticket.userStory && (
                              <div>
                                <p className="font-semibold text-foreground mb-1">
                                  Description
                                </p>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                  {ticket.userStory}
                                </p>
                              </div>
                            )}

                            {/* Acceptance Criteria */}
                            {ticket.acceptanceCriteria.length > 0 && (
                              <div>
                                <p className="font-semibold text-foreground mb-1">
                                  Acceptance Criteria
                                </p>
                                <ol className="list-decimal list-inside space-y-1">
                                  {ticket.acceptanceCriteria.map((ac, i) => (
                                    <li
                                      key={i}
                                      className="text-muted-foreground"
                                    >
                                      {ac}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-border">
                              {/* Priority */}
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Priority
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={cn(
                                      'h-2 w-2 rounded-full',
                                      priority.dotColor
                                    )}
                                  />
                                  <span className="text-sm">{ticket.priority}</span>
                                </div>
                              </div>

                              {/* Type */}
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Type
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {ticket.type}
                                </Badge>
                              </div>

                              {/* Created */}
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Created
                                </p>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(ticket.created).toLocaleDateString()}
                                </div>
                              </div>

                              {/* Sprint */}
                              {ticket.sprint && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Sprint
                                  </p>
                                  <span className="text-sm">{ticket.sprint}</span>
                                </div>
                              )}
                            </div>

                            {/* Labels */}
                            {ticket.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {ticket.labels.map((label) => (
                                  <Badge
                                    key={label}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Components */}
                            {ticket.components.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {ticket.components.map((comp) => (
                                  <Badge
                                    key={comp}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    <Layers className="h-3 w-3 mr-1" />
                                    {comp}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Figma Links */}
                            {ticket.figmaLinks.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Figma Links
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {ticket.figmaLinks.map((link, i) => (
                                    <a
                                      key={i}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Figma {i + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 50 + 1}-{Math.min(page * 50, totalTickets)} of{' '}
            {totalTickets}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Context Generation Section */}
      {showGenerateButton && (
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Context Generation</p>
              <p className="text-xs text-muted-foreground">
                Generate intelligent project context from tickets using Claude AI
              </p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || totalTickets === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Context
                </>
              )}
            </Button>
          </div>

          {!claudeAvailable && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ANTHROPIC_API_KEY not set. Will use template-based generation instead.
            </p>
          )}

          {/* Generation Progress */}
          {isGenerating && generationProgress && (
            <div className="space-y-3">
              {/* Overall progress */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {generationProgress.currentModule || 'Starting...'}
                </span>
                <span className="font-medium">
                  {generationProgress.percentComplete}%
                </span>
              </div>
              <Progress value={generationProgress.percentComplete} className="h-2" />

              {/* Per-module status list */}
              {generationProgress.modules && generationProgress.modules.length > 0 && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {generationProgress.modules.map((mod) => (
                    <div
                      key={mod.moduleSlug}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-md text-sm',
                        mod.status === 'completed' && 'bg-green-100 dark:bg-green-900/30',
                        mod.status === 'generating' && 'bg-blue-100 dark:bg-blue-900/30',
                        mod.status === 'failed' && 'bg-red-100 dark:bg-red-900/30',
                        mod.status === 'pending' && 'bg-slate-100 dark:bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {mod.status === 'generating' && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        {mod.status === 'completed' && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {mod.status === 'failed' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {mod.status === 'pending' && (
                          <Clock className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="font-medium">{mod.moduleName}</span>
                        <span className="text-xs text-muted-foreground">
                          ({mod.activeTicketCount} active)
                        </span>
                      </div>
                      {mod.error && (
                        <span className="text-xs text-red-500 truncate max-w-[200px]">
                          {mod.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Module {generationProgress.modulesProcessed} of{' '}
                {generationProgress.totalModules}
              </p>
            </div>
          )}

          {/* Generated Output Viewer */}
          {generationProgress?.modules?.some((m) => m.status === 'completed') && (
            <div className="space-y-2 pt-4 border-t border-border">
              <p className="text-sm font-medium">Generated Output</p>
              <p className="text-xs text-muted-foreground mb-2">
                Click to expand and view generated context content
              </p>
              <div className="space-y-2">
                {generationProgress.modules
                  .filter((m) => m.status === 'completed')
                  .map((mod) => (
                    <ModuleOutputCard
                      key={mod.moduleSlug}
                      module={mod}
                      isExpanded={expandedOutputs.has(mod.moduleSlug)}
                      onToggleExpand={() => toggleOutputExpand(mod.moduleSlug)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
