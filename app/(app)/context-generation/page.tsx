'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PromptBlock } from '@/components/shared/PromptBlock';
import { ClaudeResponseInput } from '@/components/shared/ClaudeResponseInput';
import {
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  ArrowRight,
  Eye,
  Loader2,
  XCircle,
  Zap,
  Hand,
} from 'lucide-react';
import { toast } from 'sonner';

interface ModulePromptData {
  moduleName: string;
  slug: string;
  ticketCount: number;
  prompt: string;
  promptLength: number;
  hasExistingContext: boolean;
  status: 'pending' | 'completed';
  completedAt?: string;
}

interface Stats {
  totalModules: number;
  totalTickets: number;
  completed: number;
  pending: number;
}

interface AutoGenModuleStatus {
  name: string;
  slug: string;
  ticketCount: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

interface AutoGenProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  totalModules: number;
  processedModules: number;
  currentModule: string;
  currentModuleTickets: number;
  modules: AutoGenModuleStatus[];
  startedAt: string;
  estimatedTimeLeft?: string;
  errors: string[];
}

type WorkflowMode = 'list' | 'manual' | 'auto';

export default function ContextGenerationPage() {
  const [modules, setModules] = useState<ModulePromptData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<ModulePromptData | null>(null);
  const [claudeResponse, setClaudeResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewingModule, setViewingModule] = useState<ModulePromptData | null>(null);

  // Auto-generation state
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('list');
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoGenProgress, setAutoGenProgress] = useState<AutoGenProgress | null>(null);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState<boolean | null>(null);

  // Check Gemini status on mount
  useEffect(() => {
    const checkGemini = async () => {
      try {
        const res = await fetch('/api/ai/status');
        const data = await res.json();
        setIsGeminiConfigured(data.providers?.gemini?.configured ?? false);
      } catch {
        setIsGeminiConfigured(false);
      }
    };
    checkGemini();
  }, []);

  // Fetch modules on mount
  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/context-generation/generate-prompts');
      const data = await response.json();

      if (data.success) {
        setModules(data.modules);
        setStats(data.stats);
      } else {
        toast.error(data.error || 'Failed to load modules');
      }
    } catch {
      toast.error('Failed to fetch modules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Poll auto-generation progress
  useEffect(() => {
    if (!isAutoGenerating) return;

    const poll = async () => {
      try {
        const res = await fetch('/api/context-generation/auto');
        const data = await res.json();

        if (data.success && data.progress) {
          setAutoGenProgress(data.progress);

          // Check if completed or failed
          if (data.progress.status === 'completed') {
            setIsAutoGenerating(false);
            toast.success(
              `Generated context for ${data.progress.processedModules} modules`
            );
            fetchModules(); // Refresh module list
          } else if (data.progress.status === 'failed') {
            setIsAutoGenerating(false);
            toast.error('Auto-generation failed. Check errors above.');
            fetchModules();
          }
        }
      } catch {
        console.error('Failed to poll progress');
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(poll, 3000);
    poll(); // Initial poll

    return () => clearInterval(interval);
  }, [isAutoGenerating, fetchModules]);

  // Start manual workflow
  const handleStart = (mod: ModulePromptData) => {
    setActiveModule(mod);
    setClaudeResponse('');
    setSaveSuccess(false);
    setViewingModule(null);
    setWorkflowMode('manual');
  };

  // View a completed module's prompt
  const handleView = (mod: ModulePromptData) => {
    setViewingModule(mod);
    setActiveModule(null);
    setWorkflowMode('manual');
  };

  // Go back to module list
  const handleBack = () => {
    setActiveModule(null);
    setViewingModule(null);
    setClaudeResponse('');
    setSaveSuccess(false);
    setWorkflowMode('list');
  };

  // Save context (manual workflow)
  const handleSave = async () => {
    if (!activeModule || !claudeResponse.trim()) {
      toast.error("Please paste Claude's response first");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/context-generation/save-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: activeModule.slug,
          content: claudeResponse,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Context saved for ${activeModule.moduleName}`);
        setSaveSuccess(true);
        // Update local state
        setModules((prev) =>
          prev.map((m) =>
            m.slug === activeModule.slug
              ? { ...m, status: 'completed' as const, completedAt: new Date().toISOString() }
              : m
          )
        );
        // Update stats
        if (stats) {
          setStats({
            ...stats,
            completed: stats.completed + 1,
            pending: stats.pending - 1,
          });
        }
      } else {
        toast.error(data.error || 'Failed to save context');
      }
    } catch {
      toast.error('Failed to save context');
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to next pending module (manual workflow)
  const handleNext = () => {
    const next = modules.find(
      (m) => m.status === 'pending' && m.slug !== activeModule?.slug
    );
    if (next) {
      handleStart(next);
    } else {
      setActiveModule(null);
      setWorkflowMode('list');
      toast.success('All modules completed!');
    }
  };

  // Start auto-generation
  const handleAutoGenerate = async () => {
    if (!isGeminiConfigured) {
      toast.error('Gemini API key not configured. Add GEMINI_API_KEY to .env.local');
      return;
    }

    try {
      const response = await fetch('/api/context-generation/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skipCompleted: true }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAutoGenerating(true);
        setWorkflowMode('auto');
        toast.success('Auto-generation started');
      } else {
        toast.error(data.error || 'Failed to start auto-generation');
      }
    } catch {
      toast.error('Failed to start auto-generation');
    }
  };

  // Get status icon for module in auto-gen progress
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Auto-generation progress view
  if (workflowMode === 'auto' && (isAutoGenerating || autoGenProgress?.status === 'completed')) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={isAutoGenerating}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to List
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Auto-Generating Context</h1>
            <p className="text-sm text-muted-foreground">
              Using Google Gemini to generate context for all modules
            </p>
          </div>
          {isAutoGenerating && (
            <Badge className="bg-primary/10 text-primary border-primary/30">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Running
            </Badge>
          )}
          {autoGenProgress?.status === 'completed' && (
            <Badge className="bg-green-dim text-green-600 dark:text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>

        {/* Progress Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-6 space-y-4">
            {/* Current module */}
            {autoGenProgress?.currentModule && isAutoGenerating && (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">
                    Processing: {autoGenProgress.currentModule}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {autoGenProgress.currentModuleTickets} tickets
                  </p>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Module {autoGenProgress?.processedModules || 0} of{' '}
                  {autoGenProgress?.totalModules || 0}
                </span>
                <span className="font-medium">
                  {autoGenProgress?.totalModules
                    ? Math.round(
                        ((autoGenProgress.processedModules || 0) /
                          autoGenProgress.totalModules) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  autoGenProgress?.totalModules
                    ? ((autoGenProgress.processedModules || 0) /
                        autoGenProgress.totalModules) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>

            {/* Time estimate */}
            {autoGenProgress?.estimatedTimeLeft && isAutoGenerating && (
              <p className="text-sm text-muted-foreground">
                Estimated time remaining: {autoGenProgress.estimatedTimeLeft}
              </p>
            )}

            {/* Errors */}
            {autoGenProgress?.errors && autoGenProgress.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                  Errors ({autoGenProgress.errors.length})
                </p>
                <ul className="text-xs text-red-500 space-y-0.5">
                  {autoGenProgress.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module Status List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />
              Module Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {(autoGenProgress?.modules || []).map((mod) => (
                  <div
                    key={mod.slug}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(mod.status)}
                      <div>
                        <p className="font-medium text-sm">{mod.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {mod.ticketCount} tickets
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {mod.status === 'completed' && (
                        <Badge className="bg-green-dim text-green-600 dark:text-green-400">
                          Done
                        </Badge>
                      )}
                      {mod.status === 'generating' && (
                        <Badge className="bg-primary/10 text-primary">
                          Generating...
                        </Badge>
                      )}
                      {mod.status === 'failed' && (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                      {mod.status === 'pending' && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Done button */}
        {!isAutoGenerating && (
          <div className="flex justify-end">
            <Button onClick={handleBack}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Done
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Active module panel (manual workflow)
  if (activeModule) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to List
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{activeModule.moduleName}</h1>
            <p className="text-sm text-muted-foreground">
              {activeModule.ticketCount} tickets • {activeModule.promptLength.toLocaleString()} characters
            </p>
          </div>
          {activeModule.hasExistingContext && (
            <Badge variant="outline" className="text-amber-500 border-amber-500">
              Has Existing Context
            </Badge>
          )}
        </div>

        {/* Step 1: Prompt */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Step 1: Copy Prompt to Claude
          </h2>
          <PromptBlock
            title="Context Generation Prompt"
            subtitle={`${activeModule.ticketCount} tickets`}
            content={activeModule.prompt}
            maxHeight="350px"
          />
        </div>

        {/* Step 2: Paste Response */}
        {!saveSuccess && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Step 2: Paste Claude&apos;s Response
            </h2>
            <ClaudeResponseInput
              value={claudeResponse}
              onChange={setClaudeResponse}
              onParse={handleSave}
              isLoading={isSaving}
              parseButtonText="Save Context"
            />
          </div>
        )}

        {/* Step 3: Success */}
        {saveSuccess && (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400">
                      Context Saved Successfully
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Saved to modules/{activeModule.slug}.md •{' '}
                      {claudeResponse.length.toLocaleString()} characters
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack}>
                    Back to List
                  </Button>
                  {stats && stats.pending > 0 && (
                    <Button onClick={handleNext}>
                      Next Module
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Viewing mode for completed module (manual workflow)
  if (viewingModule) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to List
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{viewingModule.moduleName}</h1>
            <p className="text-sm text-muted-foreground">
              {viewingModule.ticketCount} tickets • Viewing prompt
            </p>
          </div>
          <Badge className="bg-green-dim text-green-600 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        </div>

        {/* Prompt */}
        <PromptBlock
          title="Context Generation Prompt"
          subtitle={`${viewingModule.ticketCount} tickets`}
          content={viewingModule.prompt}
          maxHeight="500px"
        />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleStart(viewingModule)}>
            Regenerate Context
          </Button>
        </div>
      </div>
    );
  }

  // Module list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Context Generation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate project context automatically or manually
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchModules}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Workflow Selection */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Auto Generate Card */}
        <Card
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            !isGeminiConfigured ? 'opacity-60' : ''
          }`}
          onClick={isGeminiConfigured ? handleAutoGenerate : undefined}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  Auto Generate
                  {isGeminiConfigured && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Uses Google Gemini AI (free) to automatically generate context for all modules
                </p>
                {!isGeminiConfigured && isGeminiConfigured !== null && (
                  <p className="text-xs text-amber-500 mt-2">
                    Add GEMINI_API_KEY to .env.local •{' '}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Get free key
                    </a>
                  </p>
                )}
                {isGeminiConfigured && (
                  <p className="text-xs text-green-500 mt-2">
                    Gemini configured • Click to start
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Card */}
        <Card className="cursor-pointer transition-all hover:border-primary/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                <Hand className="h-6 w-6 text-cyan-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Manual (Copy/Paste)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Copy prompts to claude.ai and paste responses back. No API key required.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Use the table below to work through modules one by one
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalModules}</p>
                  <p className="text-xs text-muted-foreground">Total Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalTickets}</p>
                  <p className="text-xs text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Module list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" />
            Modules (Manual Workflow)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Module</TableHead>
                  <TableHead className="text-center">Tickets</TableHead>
                  <TableHead className="text-center">Prompt Size</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod.slug}>
                    <TableCell>
                      <div className="font-medium">{mod.moduleName}</div>
                      <div className="text-xs text-muted-foreground">
                        {mod.slug}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{mod.ticketCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {(mod.promptLength / 1000).toFixed(1)}k
                    </TableCell>
                    <TableCell className="text-center">
                      {mod.status === 'completed' ? (
                        <Badge className="bg-green-dim text-green-600 dark:text-green-400">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Done
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {mod.status === 'completed' ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(mod)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStart(mod)}
                          >
                            Update
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleStart(mod)}>
                          Start
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
