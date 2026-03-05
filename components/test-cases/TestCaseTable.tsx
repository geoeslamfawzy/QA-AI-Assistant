'use client';

import { useState, useMemo, useCallback, useEffect, Fragment } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { BDDTestCase, TestCasePriority, TestCaseType } from '@/lib/test-cases/types';

// Re-export types for backwards compatibility
export type { TestCasePriority, TestCaseType };

// Extended interface for parsed test cases with BDD fields
export interface ParsedTestCase extends BDDTestCase {}

interface TestCaseTableProps {
  testCases: ParsedTestCase[];
  /** Enable selection mode with checkboxes */
  selectable?: boolean;
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Initial selected IDs */
  initialSelectedIds?: string[];
}

const priorityConfig: Record<TestCasePriority, { label: string; dotColor: string; bgColor: string }> = {
  critical: {
    label: 'P0 - Critical',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-dim text-red-500',
  },
  high: {
    label: 'P1 - High',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-dim text-amber-500',
  },
  medium: {
    label: 'P2 - Medium',
    dotColor: 'bg-yellow-500',
    bgColor: 'bg-yellow-500/20 text-yellow-500',
  },
  low: {
    label: 'P3 - Low',
    dotColor: 'bg-cyan-500',
    bgColor: 'bg-cyan-dim text-cyan-500',
  },
};

const typeConfig: Record<TestCaseType, { label: string; className: string }> = {
  functional: {
    label: 'Functional',
    className: 'bg-green-dim text-green-500',
  },
  'edge-case': {
    label: 'Edge Case',
    className: 'bg-purple-500/20 text-purple-500',
  },
  negative: {
    label: 'Negative',
    className: 'bg-red-dim text-red-500',
  },
  'ui-ux': {
    label: 'UI/UX',
    className: 'bg-pink-dim text-pink-500',
  },
  performance: {
    label: 'Performance',
    className: 'bg-blue-500/20 text-blue-500',
  },
  security: {
    label: 'Security',
    className: 'bg-amber-dim text-amber-500',
  },
  accessibility: {
    label: 'A11y',
    className: 'bg-cyan-dim text-cyan-500',
  },
};

export function TestCaseTable({
  testCases,
  selectable = true,
  onSelectionChange,
  initialSelectedIds,
}: TestCaseTableProps) {
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds || testCases.map((tc) => tc.id))
  );

  // Expansion state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Update selection when testCases change
  useEffect(() => {
    if (!initialSelectedIds) {
      setSelectedIds(new Set(testCases.map((tc) => tc.id)));
    }
  }, [testCases, initialSelectedIds]);

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(Array.from(selectedIds));
  }, [selectedIds, onSelectionChange]);

  // Selection handlers
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(testCases.map((tc) => tc.id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [testCases]
  );

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  // Expansion handlers
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(testCases.map((tc) => tc.id)));
  }, [testCases]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // Computed values
  const allSelected = useMemo(
    () => testCases.length > 0 && selectedIds.size === testCases.length,
    [testCases.length, selectedIds.size]
  );

  const someSelected = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < testCases.length,
    [selectedIds.size, testCases.length]
  );

  // Export handlers
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(testCases, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as JSON');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Type', 'Priority', 'Given', 'When', 'Then'];
    const rows = testCases.map((tc) => [
      tc.id,
      tc.title,
      tc.type,
      tc.priority,
      (tc.given || tc.preconditions || []).join('; '),
      (tc.when || tc.steps || []).join('; '),
      (tc.then || [tc.expectedResult]).filter(Boolean).join('; '),
    ]);
    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as CSV');
  };

  const handleCopyAll = () => {
    const text = testCases
      .map((tc) => {
        const given = tc.given || tc.preconditions || [];
        const when = tc.when || tc.steps || [];
        const then = tc.then || [tc.expectedResult].filter(Boolean);
        return `${tc.id}: ${tc.title}
Type: ${tc.type} | Priority: ${tc.priority}

Given:
${given.map((g) => `  - ${g}`).join('\n')}

When:
${when.map((w, i) => `  ${i + 1}. ${w}`).join('\n')}

Then:
${then.map((t) => `  - ${t}`).join('\n')}`;
      })
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Copied all test cases to clipboard');
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {testCases.length} test cases
            {selectable && selectedIds.size > 0 && (
              <span className="ml-1 text-primary">
                ({selectedIds.size} selected)
              </span>
            )}
          </p>
          {expandedIds.size > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="text-xs text-muted-foreground"
            >
              Collapse All
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={expandAll}
              className="text-xs text-muted-foreground"
            >
              Expand All
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            <Copy className="mr-2 h-3 w-3" />
            Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <Download className="mr-2 h-3 w-3" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-3 w-3" />
            CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    // @ts-expect-error - indeterminate is valid but not typed
                    indeterminate={someSelected || undefined}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all test cases"
                  />
                </TableHead>
              )}
              <TableHead className="w-8"></TableHead>
              <TableHead className="w-24 font-mono text-xs">ID</TableHead>
              <TableHead className="text-xs">Title</TableHead>
              <TableHead className="w-28 text-xs">Type</TableHead>
              <TableHead className="w-24 text-xs">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((tc) => {
              const priorityInfo = priorityConfig[tc.priority] || priorityConfig.medium;
              const typeInfo = typeConfig[tc.type] || typeConfig.functional;
              const isExpanded = expandedIds.has(tc.id);
              const isSelected = selectedIds.has(tc.id);

              // Get BDD content
              const given = tc.given || tc.preconditions || [];
              const when = tc.when || tc.steps || [];
              const then = tc.then || [tc.expectedResult].filter(Boolean);

              return (
                <Fragment key={tc.id}>
                  <TableRow
                    className={cn(
                      'hover:bg-muted/50',
                      isSelected && selectable && 'bg-primary/5'
                    )}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectOne(tc.id, checked as boolean)
                          }
                          aria-label={`Select ${tc.title}`}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleExpand(tc.id)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {tc.id}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{tc.title}</p>
                        {!isExpanded && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {then[0] || tc.expectedResult}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', typeInfo.className)}>
                        {typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn('h-2 w-2 rounded-full', priorityInfo.dotColor)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {priorityInfo.label}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded BDD Details */}
                  {isExpanded && (
                    <TableRow key={`${tc.id}-details`} className="bg-muted/30">
                      <TableCell
                        colSpan={selectable ? 6 : 5}
                        className="p-4"
                      >
                        <div className="space-y-4 text-sm">
                          {/* Given Section */}
                          {given.length > 0 && (
                            <div>
                              <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                                Given (Preconditions):
                              </p>
                              <ul className="ml-4 space-y-0.5">
                                {given.map((item, i) => (
                                  <li key={i} className="text-muted-foreground">
                                    - {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* When Section */}
                          {when.length > 0 && (
                            <div>
                              <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                When (Steps):
                              </p>
                              <ol className="ml-4 space-y-0.5 list-decimal list-inside">
                                {when.map((item, i) => (
                                  <li key={i} className="text-muted-foreground">
                                    {item}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Then Section */}
                          {then.length > 0 && (
                            <div>
                              <p className="font-semibold text-purple-600 dark:text-purple-400 mb-1">
                                Then (Expected Results):
                              </p>
                              <ul className="ml-4 space-y-0.5">
                                {then.map((item, i) => (
                                  <li key={i} className="text-muted-foreground">
                                    - {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
