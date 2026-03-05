'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BugSeveritySelector, type BugSeverity } from '@/components/defects/BugSeveritySelector';
import {
  Bug,
  AlertTriangle,
  FileText,
  Send,
  Loader2,
  Ticket,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

// ════════════════════════════════════════
// TYPES
// ════════════════════════════════════════

type IssueType = 'production-bug' | 'regression-defect' | 'story-defect';
type Platform = 'WebApp' | 'Mobile iOS' | 'Mobile Android' | 'API' | 'Super App';
type Environment = 'preprod' | 'staging' | 'UAT';

interface CreateResult {
  success: boolean;
  issueKey?: string;
  url?: string;
  type?: string;
  parentKey?: string;
  error?: string;
}

// ════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════

const MODULES = [
  'B2B Corporate Portal',
  'B2C Web Interface',
  'Admin Panel',
  'DashOps',
  'Pricing Engine',
  'Analytics',
  'Super App',
  'Driver App',
];

const PLATFORMS: Platform[] = ['WebApp', 'Mobile iOS', 'Mobile Android', 'API', 'Super App'];
const ENVIRONMENTS: Environment[] = ['preprod', 'staging', 'UAT'];

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════

export default function DefectsPage() {
  const [activeTab, setActiveTab] = useState<IssueType>('production-bug');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CreateResult | null>(null);

  // Production Bug form state
  const [bugTitle, setBugTitle] = useState('');
  const [bugPlatform, setBugPlatform] = useState<Platform>('WebApp');
  const [bugSeverity, setBugSeverity] = useState<BugSeverity>('medium');
  const [bugModule, setBugModule] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSteps, setBugSteps] = useState('');
  const [bugExpected, setBugExpected] = useState('');
  const [bugActual, setBugActual] = useState('');
  const [bugEnvironment, setBugEnvironment] = useState('');

  // Regression Defect form state
  const [regTitle, setRegTitle] = useState('');
  const [regEnvironment, setRegEnvironment] = useState<Environment>('preprod');
  const [regPlatform, setRegPlatform] = useState<Platform>('WebApp');
  const [regSeverity, setRegSeverity] = useState<BugSeverity>('medium');
  const [regModule, setRegModule] = useState('');
  const [regPreconditions, setRegPreconditions] = useState('');
  const [regDescription, setRegDescription] = useState('');
  const [regSteps, setRegSteps] = useState('');
  const [regExpected, setRegExpected] = useState('');
  const [regActual, setRegActual] = useState('');

  // Story Defect form state
  const [storyParentKey, setStoryParentKey] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storySeverity, setStorySeverity] = useState<BugSeverity>('medium');
  const [storyModule, setStoryModule] = useState('');
  const [storyPreconditions, setStoryPreconditions] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [storySteps, setStorySteps] = useState('');
  const [storyExpected, setStoryExpected] = useState('');
  const [storyActual, setStoryActual] = useState('');
  const [storyEnvironment, setStoryEnvironment] = useState('');

  // ────────────────────────────────────
  // HANDLERS
  // ────────────────────────────────────

  const handleCreateProductionBug = useCallback(async () => {
    if (!bugTitle.trim() || !bugDescription.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/jira/create-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bugTitle,
          description: bugDescription,
          stepsToReproduce: bugSteps,
          expectedBehavior: bugExpected,
          actualBehavior: bugActual,
          platform: bugPlatform,
          priority: bugSeverity,
          environment: bugEnvironment,
          module: bugModule,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(`Created bug: ${data.issueKey}`);
      } else {
        toast.error(data.error || 'Failed to create bug');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      setResult({ success: false, error: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [bugTitle, bugDescription, bugSteps, bugExpected, bugActual, bugPlatform, bugSeverity, bugEnvironment, bugModule]);

  const handleCreateRegressionDefect = useCallback(async () => {
    if (!regTitle.trim() || !regDescription.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/jira/create-defect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: regTitle,
          description: regDescription,
          stepsToReproduce: regSteps,
          expectedBehavior: regExpected,
          actualBehavior: regActual,
          environment: regEnvironment,
          platform: regPlatform,
          priority: regSeverity,
          module: regModule,
          preconditions: regPreconditions,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(`Created defect: ${data.issueKey}`);
      } else {
        toast.error(data.error || 'Failed to create defect');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      setResult({ success: false, error: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [regTitle, regDescription, regSteps, regExpected, regActual, regEnvironment, regPlatform, regSeverity, regModule, regPreconditions]);

  const handleCreateStoryDefect = useCallback(async () => {
    if (!storyParentKey.trim()) {
      toast.error('Parent story key is required');
      return;
    }
    if (!storyTitle.trim() || !storyDescription.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/jira/create-story-defect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: storyTitle,
          parentStoryKey: storyParentKey,
          description: storyDescription,
          stepsToReproduce: storySteps,
          expectedBehavior: storyExpected,
          actualBehavior: storyActual,
          priority: storySeverity,
          module: storyModule,
          environment: storyEnvironment,
          preconditions: storyPreconditions,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(`Created story defect: ${data.issueKey}`);
      } else {
        toast.error(data.error || 'Failed to create story defect');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      setResult({ success: false, error: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [storyParentKey, storyTitle, storyDescription, storySteps, storyExpected, storyActual, storySeverity, storyModule, storyEnvironment, storyPreconditions]);

  const handleReset = useCallback(() => {
    setResult(null);
    // Reset current tab's form
    if (activeTab === 'production-bug') {
      setBugTitle('');
      setBugDescription('');
      setBugSteps('');
      setBugExpected('');
      setBugActual('');
      setBugEnvironment('');
    } else if (activeTab === 'regression-defect') {
      setRegTitle('');
      setRegDescription('');
      setRegSteps('');
      setRegExpected('');
      setRegActual('');
      setRegPreconditions('');
    } else {
      setStoryParentKey('');
      setStoryTitle('');
      setStoryDescription('');
      setStorySteps('');
      setStoryExpected('');
      setStoryActual('');
      setStoryPreconditions('');
      setStoryEnvironment('');
    }
  }, [activeTab]);

  // ────────────────────────────────────
  // RENDER
  // ────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Report Issue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create bugs, defects, and story issues directly in Jira
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Issue Forms */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as IssueType); setResult(null); }}>
              <TabsList className="w-full">
                <TabsTrigger value="production-bug" className="flex-1 gap-1.5">
                  <Bug className="h-4 w-4 text-red-500" />
                  <span className="hidden sm:inline">Production Bug</span>
                  <span className="sm:hidden">Bug</span>
                </TabsTrigger>
                <TabsTrigger value="regression-defect" className="flex-1 gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="hidden sm:inline">Regression</span>
                  <span className="sm:hidden">Reg</span>
                </TabsTrigger>
                <TabsTrigger value="story-defect" className="flex-1 gap-1.5">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="hidden sm:inline">Story Defect</span>
                  <span className="sm:hidden">Story</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab}>
              {/* Production Bug Tab */}
              <TabsContent value="production-bug" className="mt-0 space-y-4">
                <div className="rounded-lg bg-red-500/10 p-3 text-sm">
                  <p className="font-medium text-red-600 dark:text-red-400">Production Bug</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Creates Bug with prefix: <code className="bg-muted px-1 rounded">[ALG] - {'{Platform}'} - PROD : {'{Title}'}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Title *</Label>
                  <Input
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    placeholder="Short descriptive title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Platform</Label>
                    <Select value={bugPlatform} onValueChange={(v) => setBugPlatform(v as Platform)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Module</Label>
                    <Select value={bugModule} onValueChange={setBugModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MODULES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Severity</Label>
                  <BugSeveritySelector value={bugSeverity} onChange={setBugSeverity} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Description *</Label>
                  <Textarea
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="Detailed description of the issue..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                  <Textarea
                    value={bugSteps}
                    onChange={(e) => setBugSteps(e.target.value)}
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                    className="min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                    <Textarea
                      value={bugExpected}
                      onChange={(e) => setBugExpected(e.target.value)}
                      placeholder="What should happen"
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                    <Textarea
                      value={bugActual}
                      onChange={(e) => setBugActual(e.target.value)}
                      placeholder="What actually happened"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Environment Details</Label>
                  <Input
                    value={bugEnvironment}
                    onChange={(e) => setBugEnvironment(e.target.value)}
                    placeholder="Browser, OS, device, etc."
                  />
                </div>

                <Button
                  onClick={handleCreateProductionBug}
                  disabled={isSubmitting || !bugTitle.trim() || !bugDescription.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Production Bug in Jira
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Regression Defect Tab */}
              <TabsContent value="regression-defect" className="mt-0 space-y-4">
                <div className="rounded-lg bg-amber-500/10 p-3 text-sm">
                  <p className="font-medium text-amber-600 dark:text-amber-400">Regression Defect</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Creates Defect with prefix: <code className="bg-muted px-1 rounded">Regression - {'{ENV}'} - {'{Platform}'} - {'{Title}'}</code>
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Auto-adds label: <code className="bg-muted px-1 rounded">regression-testing</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Title *</Label>
                  <Input
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    placeholder="Short descriptive title"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Environment</Label>
                    <Select value={regEnvironment} onValueChange={(v) => setRegEnvironment(v as Environment)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ENVIRONMENTS.map((e) => (
                          <SelectItem key={e} value={e}>{e.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Platform</Label>
                    <Select value={regPlatform} onValueChange={(v) => setRegPlatform(v as Platform)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Module</Label>
                    <Select value={regModule} onValueChange={setRegModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MODULES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Severity</Label>
                  <BugSeveritySelector value={regSeverity} onChange={setRegSeverity} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Preconditions</Label>
                  <Textarea
                    value={regPreconditions}
                    onChange={(e) => setRegPreconditions(e.target.value)}
                    placeholder="User is logged in, on page X, etc."
                    className="min-h-[50px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Description *</Label>
                  <Textarea
                    value={regDescription}
                    onChange={(e) => setRegDescription(e.target.value)}
                    placeholder="Detailed description of the defect..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                  <Textarea
                    value={regSteps}
                    onChange={(e) => setRegSteps(e.target.value)}
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                    className="min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                    <Textarea
                      value={regExpected}
                      onChange={(e) => setRegExpected(e.target.value)}
                      placeholder="What should happen"
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                    <Textarea
                      value={regActual}
                      onChange={(e) => setRegActual(e.target.value)}
                      placeholder="What actually happened"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateRegressionDefect}
                  disabled={isSubmitting || !regTitle.trim() || !regDescription.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Regression Defect in Jira
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Story Defect Tab */}
              <TabsContent value="story-defect" className="mt-0 space-y-4">
                <div className="rounded-lg bg-blue-500/10 p-3 text-sm">
                  <p className="font-medium text-blue-600 dark:text-blue-400">Story Defect</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Creates Story Defect sub-task attached to parent story. No prefix, no labels.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Parent Story Key *</Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={storyParentKey}
                      onChange={(e) => setStoryParentKey(e.target.value.toUpperCase())}
                      placeholder="e.g. CMB-12345"
                      className="pl-10 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Title * (no prefix)</Label>
                  <Input
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Clean descriptive title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Module</Label>
                    <Select value={storyModule} onValueChange={setStoryModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MODULES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Environment</Label>
                    <Input
                      value={storyEnvironment}
                      onChange={(e) => setStoryEnvironment(e.target.value)}
                      placeholder="e.g. Preprod"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Severity</Label>
                  <BugSeveritySelector value={storySeverity} onChange={setStorySeverity} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Preconditions</Label>
                  <Textarea
                    value={storyPreconditions}
                    onChange={(e) => setStoryPreconditions(e.target.value)}
                    placeholder="User is logged in, on page X, etc."
                    className="min-h-[50px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Description *</Label>
                  <Textarea
                    value={storyDescription}
                    onChange={(e) => setStoryDescription(e.target.value)}
                    placeholder="Detailed description of the defect..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                  <Textarea
                    value={storySteps}
                    onChange={(e) => setStorySteps(e.target.value)}
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                    className="min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                    <Textarea
                      value={storyExpected}
                      onChange={(e) => setStoryExpected(e.target.value)}
                      placeholder="What should happen"
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                    <Textarea
                      value={storyActual}
                      onChange={(e) => setStoryActual(e.target.value)}
                      placeholder="What actually happened"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateStoryDefect}
                  disabled={isSubmitting || !storyParentKey.trim() || !storyTitle.trim() || !storyDescription.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Story Defect in Jira
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right column: Result */}
        <div className="space-y-6">
          {!result && (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Info className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Ready to Create Issue
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                  Fill in the form on the left and click the create button to push the issue directly to Jira.
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {result.success ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      Issue Created Successfully
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                      Failed to Create Issue
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.success ? (
                  <>
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Issue Key</span>
                        <span className="font-mono font-semibold">{result.issueKey}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="font-medium">{result.type}</span>
                      </div>
                      {result.parentKey && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Parent Story</span>
                          <span className="font-mono">{result.parentKey}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in Jira
                        </a>
                      </Button>
                      <Button variant="outline" onClick={handleReset} className="flex-1">
                        Create Another
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-destructive/10 p-4">
                      <p className="text-sm text-destructive">{result.error}</p>
                    </div>
                    <Button variant="outline" onClick={() => setResult(null)} className="w-full">
                      Try Again
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
