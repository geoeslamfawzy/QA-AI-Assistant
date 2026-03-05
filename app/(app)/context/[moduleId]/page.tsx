'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  FileText,
  Loader2,
  Save,
  Sparkles,
  Eye,
  Code,
  History,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Edit3,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ModuleContent, ModuleFrontmatter } from '@/lib/types/knowledge-base';
import type { ContextUpdatePreview, DiffEntry, ChangeType } from '@/lib/types/change-log';

interface ModuleDetailPageProps {
  params: Promise<{ moduleId: string }>;
}

export default function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { moduleId } = use(params);
  const router = useRouter();

  const [module, setModule] = useState<ModuleContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [story, setStory] = useState('');
  const [changeType, setChangeType] = useState<ChangeType>('REVAMP');
  const [isGeneratingUpdate, setIsGeneratingUpdate] = useState(false);
  const [preview, setPreview] = useState<ContextUpdatePreview | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showDiffDialog, setShowDiffDialog] = useState(false);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/knowledge-base/${moduleId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch module');
      }

      setModule(data.module);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateUpdate = async () => {
    if (!story.trim()) {
      toast.error('Please enter a user story to generate updates');
      return;
    }

    setIsGeneratingUpdate(true);
    setPreview(null);

    try {
      const response = await fetch('/api/update-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, moduleId, changeType }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate update');
      }

      setPreview(data.preview);
      setShowDiffDialog(true);
      toast.success('Update preview generated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsGeneratingUpdate(false);
    }
  };

  const handleApplyUpdate = async () => {
    if (!preview) return;

    setIsApplying(true);

    try {
      const response = await fetch('/api/update-context', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          updatedContent: preview.updated_content,
          changeLogEntry: {
            changeType: preview.change_type,
            moduleName: module?.frontmatter.title,
            summary: preview.change_summary,
            sectionsAffected: preview.change_log_entry.sections_affected,
            diff: preview.diff_description,
            snapshotVersion: module?.frontmatter.version || '1.0',
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to apply update');
      }

      toast.success('Module updated successfully');
      setShowDiffDialog(false);
      setPreview(null);
      setStory('');
      fetchModule();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsApplying(false);
    }
  };

  const getDiffActionIcon = (action: string) => {
    switch (action) {
      case 'ADDED':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'REMOVED':
        return <Minus className="h-4 w-4 text-destructive" />;
      case 'MODIFIED':
        return <Edit3 className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getDiffActionColor = (action: string) => {
    switch (action) {
      case 'ADDED':
        return 'border-green-500/50 bg-green-500/10';
      case 'REMOVED':
        return 'border-destructive/50 bg-destructive/10';
      case 'MODIFIED':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-muted';
    }
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
            <Skeleton className="h-[400px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="space-y-6">
        <Link href="/context">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Context
          </Button>
        </Link>
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
          <Link href="/context">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{module.frontmatter.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-mono text-sm">{module.id}</span>
              <span>•</span>
              <span>{module.frontmatter.system}</span>
              <span>•</span>
              <span>v{module.frontmatter.version}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{module.frontmatter.type.replace(/_/g, ' ')}</Badge>
          {module.frontmatter.risk_level && (
            <Badge
              className={
                module.frontmatter.risk_level === 'critical' || module.frontmatter.risk_level === 'high'
                  ? 'bg-destructive text-destructive-foreground'
                  : module.frontmatter.risk_level === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-600'
                  : 'bg-green-500/20 text-green-600'
              }
            >
              {module.frontmatter.risk_level} risk
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Module Content
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="source">
                    <Code className="mr-2 h-4 w-4" />
                    Source
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {module.content.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) {
                          return (
                            <h1 key={i} className="text-xl font-bold mt-4 mb-2">
                              {line.replace('# ', '')}
                            </h1>
                          );
                        }
                        if (line.startsWith('## ')) {
                          return (
                            <h2 key={i} className="text-lg font-semibold mt-4 mb-2">
                              {line.replace('## ', '')}
                            </h2>
                          );
                        }
                        if (line.startsWith('### ')) {
                          return (
                            <h3 key={i} className="text-base font-medium mt-3 mb-1">
                              {line.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return (
                            <li key={i} className="text-sm ml-4">
                              {line.replace('- ', '')}
                            </li>
                          );
                        }
                        if (line.startsWith('> ')) {
                          return (
                            <blockquote
                              key={i}
                              className="border-l-4 border-primary pl-4 italic text-muted-foreground"
                            >
                              {line.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        if (line.trim() === '') {
                          return <br key={i} />;
                        }
                        return (
                          <p key={i} className="text-sm my-1">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="source">
                  <ScrollArea className="h-[500px]">
                    <pre className="rounded-md bg-muted p-4 text-xs font-mono overflow-x-auto">
                      {module.content}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Module Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {module.frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {module.frontmatter.dependencies.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Dependencies</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {module.frontmatter.dependencies.map((dep) => (
                      <Link key={dep} href={`/context/${dep}`}>
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-muted"
                        >
                          {dep}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">Last Updated</Label>
                <p className="text-sm">
                  {new Date(module.frontmatter.last_updated).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Update Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                AI Context Update
              </CardTitle>
              <CardDescription>
                Describe changes to apply to this module
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Change Type</Label>
                <Select
                  value={changeType}
                  onValueChange={(v) => setChangeType(v as ChangeType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW_FEATURE">New Feature</SelectItem>
                    <SelectItem value="REVAMP">Revamp</SelectItem>
                    <SelectItem value="REMOVAL">Removal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>User Story / Change Description</Label>
                <Textarea
                  placeholder="Describe the changes you want to apply..."
                  className="mt-1 min-h-[100px] text-sm"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleGenerateUpdate}
                disabled={isGeneratingUpdate || !story.trim()}
              >
                {isGeneratingUpdate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Update
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diff Preview Dialog */}
      <Dialog open={showDiffDialog} onOpenChange={setShowDiffDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Review Changes</DialogTitle>
            <DialogDescription>
              {preview?.change_summary}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {preview && (
              <div className="space-y-4">
                {/* Change Summary */}
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{preview.change_type.replace('_', ' ')}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {preview.diff_description.length} section(s) affected
                    </span>
                  </div>
                </div>

                {/* Diff Entries */}
                <div className="space-y-3">
                  <h4 className="font-medium">Changes</h4>
                  {preview.diff_description.map((diff, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-4 ${getDiffActionColor(
                        diff.action
                      )}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getDiffActionIcon(diff.action)}
                        <span className="font-medium">{diff.section}</span>
                        <Badge variant="outline" className="text-xs">
                          {diff.action}
                        </Badge>
                      </div>
                      {diff.before && (
                        <div className="mb-2">
                          <span className="text-xs text-muted-foreground">Before:</span>
                          <p className="text-sm bg-destructive/10 p-2 rounded mt-1 line-through">
                            {diff.before}
                          </p>
                        </div>
                      )}
                      {diff.after && (
                        <div>
                          <span className="text-xs text-muted-foreground">After:</span>
                          <p className="text-sm bg-green-500/10 p-2 rounded mt-1">
                            {diff.after}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* New Business Rules */}
                {preview.new_business_rules.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      New Business Rules
                    </h4>
                    {preview.new_business_rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="rounded-lg border border-green-500/50 bg-green-500/10 p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {rule.id}
                          </Badge>
                        </div>
                        <p className="text-sm">{rule.rule}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enforcement: {rule.enforcement}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDiffDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyUpdate} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Apply Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
