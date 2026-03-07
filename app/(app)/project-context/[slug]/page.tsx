'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
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
  ArrowLeft,
  Eye,
  Pencil,
  Save,
  RotateCcw,
  Loader2,
  FileText,
  Zap,
  Clock,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Dynamically import Monaco to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ModuleData {
  slug: string;
  title: string;
  source: 'jira' | 'manual';
  content: string;
  rawContent: string;
  frontmatter: Record<string, unknown>;
  ticketCount?: number;
  activeTicketCount?: number;
  lastUpdated: string;
  lastSynced?: string;
  filePath: string;
}

interface ModuleEditorPageProps {
  params: Promise<{ slug: string }>;
}

export default function ModuleEditorPage({ params }: ModuleEditorPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [module, setModule] = useState<ModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [editContent, setEditContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const hasUnsavedChanges = editContent !== originalContent;

  const fetchModule = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/context/${slug}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch module');
      }

      setModule(data.module);
      setEditContent(data.module.rawContent);
      setOriginalContent(data.module.rawContent);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  // Warn about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!module) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/context/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save module');
      }

      setOriginalContent(editContent);
      setModule(data.module);
      toast.success('Module saved successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    setEditContent(originalContent);
    toast.info('Changes reverted');
  };

  const handleModeChange = (newMode: 'view' | 'edit') => {
    if (mode === 'edit' && hasUnsavedChanges && newMode === 'view') {
      // Optionally warn when switching from edit to view with unsaved changes
      // For now, just switch
    }
    setMode(newMode);
  };

  const handleNavigate = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowUnsavedDialog(true);
    } else {
      router.push(path);
    }
  };

  const confirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  };

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
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-1 h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-[500px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigate('/project-context')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project Context
        </Button>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span>{error || 'Module not found'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigate('/project-context')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <FileText className="h-6 w-6" />
              {module.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className={
                  module.source === 'jira'
                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                    : 'bg-green-500/10 text-green-600 border-green-500/30'
                }
              >
                {module.source === 'jira' ? (
                  <>
                    <Zap className="mr-1 h-3 w-3" />
                    Jira Context
                  </>
                ) : (
                  <>
                    <Pencil className="mr-1 h-3 w-3" />
                    Manual
                  </>
                )}
              </Badge>
              {module.ticketCount && (
                <span>
                  {module.activeTicketCount || module.ticketCount} tickets
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {module.lastSynced
                  ? `Synced ${formatDateTime(module.lastSynced)}`
                  : `Updated ${formatDate(module.lastUpdated)}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600">
              Unsaved changes
            </Badge>
          )}

          {/* Mode Toggle */}
          <div className="flex rounded-lg border p-1">
            <Button
              variant={mode === 'view' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('view')}
            >
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
            <Button
              variant={mode === 'edit' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('edit')}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </div>

          {/* Save/Revert Buttons */}
          {mode === 'edit' && (
            <>
              <Button
                variant="outline"
                onClick={handleRevert}
                disabled={!hasUnsavedChanges}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Revert
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">
            {mode === 'view' ? 'Module Content' : 'Edit Module'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mode === 'view' ? (
            <ScrollArea className="h-[600px]">
              <div className="prose prose-sm dark:prose-invert max-w-none p-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {module.content}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[600px]">
              <Editor
                height="100%"
                language="markdown"
                value={editContent}
                onChange={(value) => setEditContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  fontSize: 13,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  renderWhitespace: 'selection',
                  bracketPairColorization: { enabled: false },
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingNavigation(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation}>
              Leave without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
