'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BookOpen,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderSync,
  Clock,
  FileText,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ContextModule {
  slug: string;
  title: string;
  source: 'jira' | 'manual';
  ticketCount?: number;
  activeTicketCount?: number;
  lastUpdated: string;
  lastSynced?: string;
  filePath: string;
}

interface ContextStats {
  totalModules: number;
  jiraModules: number;
  manualModules: number;
  totalTickets: number;
  lastSync: string | null;
}

interface SyncProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentBatch: number;
  totalBatches: number;
  ticketsProcessed: number;
  totalTickets: number;
  percentComplete: number;
  currentModule?: string;
  error?: string;
}

type FilterType = 'all' | 'jira' | 'manual';

export default function ProjectContextPage() {
  const [modules, setModules] = useState<ContextModule[]>([]);
  const [stats, setStats] = useState<ContextStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);

  // Add module dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Delete confirmation
  const [moduleToDelete, setModuleToDelete] = useState<ContextModule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchModules = useCallback(async () => {
    try {
      const response = await fetch('/api/context');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch modules');
      }

      setModules(data.modules || []);
      setStats(data.stats || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Poll sync progress
  useEffect(() => {
    if (!isSyncing) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/context-sync/progress');
        const data = await response.json();

        if (data.success && data.progress) {
          setSyncProgress(data.progress);

          if (data.progress.status === 'completed') {
            setIsSyncing(false);
            toast.success('Sync completed successfully');
            fetchModules();
          } else if (data.progress.status === 'failed') {
            setIsSyncing(false);
            toast.error(data.progress.error || 'Sync failed');
          }
        }
      } catch {
        // Ignore polling errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isSyncing, fetchModules]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress({
      status: 'running',
      currentBatch: 0,
      totalBatches: 0,
      ticketsProcessed: 0,
      totalTickets: 0,
      percentComplete: 0,
    });

    try {
      const response = await fetch('/api/context-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incremental: true }),
      });

      const data = await response.json();

      if (!data.success && data.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start sync';
      toast.error(message);
      setIsSyncing(false);
      setSyncProgress(null);
    }
  };

  const handleCreateModule = async () => {
    if (!newModuleName.trim()) {
      toast.error('Module name is required');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newModuleName,
          description: newModuleDescription,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create module');
      }

      toast.success('Module created successfully');
      setShowAddDialog(false);
      setNewModuleName('');
      setNewModuleDescription('');
      fetchModules();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/context/${moduleToDelete.slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete module');
      }

      toast.success('Module deleted successfully');
      setModuleToDelete(null);
      fetchModules();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      !searchQuery ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'jira' && module.source === 'jira') ||
      (filterType === 'manual' && module.source === 'manual');

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                Project Context
              </CardTitle>
              <CardDescription className="mt-1">
                Knowledge base built from{' '}
                <span className="font-medium text-foreground">
                  {stats?.totalTickets || 0} Jira tickets
                </span>{' '}
                across{' '}
                <span className="font-medium text-foreground">
                  {stats?.jiraModules || 0} modules
                </span>
                {stats?.lastSync && (
                  <>
                    {' '}
                    <span className="text-muted-foreground">
                      Last synced: {formatDateTime(stats.lastSync)}
                    </span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <FolderSync className="mr-2 h-4 w-4" />
                    Sync from Jira
                  </>
                )}
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Sync Progress */}
        {isSyncing && syncProgress && (
          <CardContent className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {syncProgress.currentModule
                    ? `Processing: ${syncProgress.currentModule}`
                    : 'Starting sync...'}
                </span>
                <span className="font-medium">
                  {syncProgress.percentComplete}%
                </span>
              </div>
              <Progress value={syncProgress.percentComplete} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {syncProgress.ticketsProcessed} / {syncProgress.totalTickets || '?'} tickets processed
                {syncProgress.totalBatches > 0 && (
                  <> (Batch {syncProgress.currentBatch} of {syncProgress.totalBatches})</>
                )}
              </p>
            </div>
          </CardContent>
        )}

        <CardContent className={isSyncing ? '' : 'border-t pt-4'}>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Modules</span>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats?.totalModules || 0}</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">From Jira</span>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats?.jiraModules || 0}</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Manual</span>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats?.manualModules || 0}</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Tickets</span>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats?.totalTickets || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Browser */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Modules</CardTitle>
              <CardDescription>
                Click a module to view and edit its content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterType === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'jira' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterType('jira')}
              >
                Jira
              </Button>
              <Button
                variant={filterType === 'manual' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterType('manual')}
              >
                Manual
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Module Table */}
          <ScrollArea className="h-[500px] rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[40%]">Module</TableHead>
                  <TableHead className="w-[15%]">Source</TableHead>
                  <TableHead className="w-[15%] text-center">Tickets</TableHead>
                  <TableHead className="w-[20%]">Last Updated</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="text-muted-foreground">
                        {searchQuery || filterType !== 'all'
                          ? 'No modules found matching your criteria'
                          : 'No modules yet. Click "Add Module" to create one.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((module) => (
                    <TableRow
                      key={module.slug}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <Link
                          href={`/project-context/${module.slug}`}
                          className="block"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{module.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {module.slug}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            module.source === 'jira'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                              : 'bg-green-500/10 text-green-600 border-green-500/30'
                          }
                        >
                          {module.source === 'jira' ? 'Jira' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {module.ticketCount ? (
                          <span className="font-mono text-sm">
                            {module.activeTicketCount || module.ticketCount}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(module.lastUpdated)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/project-context/${module.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          {module.source === 'manual' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setModuleToDelete(module);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="text-sm text-muted-foreground">
            Showing {filteredModules.length} of {modules.length} modules
          </div>
        </CardContent>
      </Card>

      {/* Add Module Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
            <DialogDescription>
              Create a new module in the knowledge base. This will be a manual
              module that you can edit directly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="module-name">
                Module Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="module-name"
                placeholder="e.g., Payment Gateway"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
              />
              {newModuleName && (
                <p className="text-xs text-muted-foreground">
                  Slug: <span className="font-mono">{generateSlug(newModuleName)}</span>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-description">Description (optional)</Label>
              <Textarea
                id="module-description"
                placeholder="Brief description of this module..."
                value={newModuleDescription}
                onChange={(e) => setNewModuleDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setNewModuleName('');
                setNewModuleDescription('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateModule} disabled={isCreating || !newModuleName.trim()}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Module'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!moduleToDelete} onOpenChange={(open) => !open && setModuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{moduleToDelete?.title}"? This action
              cannot be undone, but a backup will be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
