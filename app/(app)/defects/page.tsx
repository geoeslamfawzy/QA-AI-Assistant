'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BugSeveritySelector, type BugSeverity } from '@/components/defects/BugSeveritySelector';
import AIModeSelector, { type AIModeConfig } from '@/components/ai/AIModeSelector';
import ClaudeCliProgress from '@/components/ai/ClaudeCliProgress';
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
  Bot,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

// ════════════════════════════════════════
// TYPES
// ════════════════════════════════════════

type IssueType = 'production-bug' | 'regression-defect' | 'story-defect';
type Platform = 'WebApp' | 'Mobile iOS' | 'Mobile Android' | 'API' | 'Super App';
type Environment = 'preprod' | 'staging' | 'UAT';
type PageMode = 'ai-assisted' | 'manual-form';

interface CreateResult {
  success: boolean;
  issueKey?: string;
  url?: string;
  type?: string;
  parentKey?: string;
  error?: string;
}

interface AIGeneratedReport {
  title: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  priority: string;
  environment: string;
  platform: string;
  module: string;
  preconditions: string;
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
// PROMPT BUILDER
// ════════════════════════════════════════

function buildBugReportPrompt(
  description: string,
  bugType: string,
  platform: string,
  environment: string
): string {
  return `You are a senior QA engineer at Yassir Mobility. Generate a structured bug report from this description.

## User's Description
${description}

## Context
- Bug Type: ${bugType}
- Platform: ${platform}
- Environment: ${environment}

## Output Format
Return a JSON object with these fields:

\`\`\`json
{
  "title": "Short descriptive title",
  "stepsToReproduce": "Step-by-step reproduction:\\n1. Step one\\n2. Step two\\n3. Step three",
  "expectedBehavior": "What should happen",
  "actualBehavior": "What actually happens",
  "priority": "critical|high|medium|low",
  "environment": "${environment}",
  "platform": "${platform}",
  "module": "Detected module name",
  "preconditions": "Any preconditions needed"
}
\`\`\`

Rules:
- Write in B1 English — simple, clear, short statements
- Steps should be numbered and specific (include exact button names, field names)
- Title should follow this format based on bug type:
  - Production Bug: "[ALG] - {Platform} - PROD : {Title}"
  - Regression Defect: "Regression - {ENV} - {Platform} - {Title}"
  - Story Defect: "{Title}" (no prefix)
- Be specific about what was clicked, what page, what field
- Priority: estimate based on severity of the issue described
- Return ONLY the JSON block, no other text`;
}

// ════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════

export default function DefectsPage() {
  // Page mode
  const [pageMode, setPageMode] = useState<PageMode>('ai-assisted');

  const [activeTab, setActiveTab] = useState<IssueType>('production-bug');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CreateResult | null>(null);

  // ── AI-Assisted state ──
  const [aiConfig, setAiConfig] = useState<AIModeConfig>({ mode: 'claude-cli' });
  const [aiDescription, setAiDescription] = useState('');
  const [aiBugType, setAiBugType] = useState<IssueType>('production-bug');
  const [aiPlatform, setAiPlatform] = useState<Platform>('WebApp');
  const [aiEnvironment, setAiEnvironment] = useState('Production');
  const [aiParentStoryKey, setAiParentStoryKey] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiReport, setAiReport] = useState<AIGeneratedReport | null>(null);

  // AI-generated editable fields
  const [aiTitle, setAiTitle] = useState('');
  const [aiSteps, setAiSteps] = useState('');
  const [aiExpected, setAiExpected] = useState('');
  const [aiActual, setAiActual] = useState('');
  const [aiPriority, setAiPriority] = useState<BugSeverity>('medium');
  const [aiModule, setAiModule] = useState('');
  const [aiPreconditions, setAiPreconditions] = useState('');
  const [aiEnvDetail, setAiEnvDetail] = useState('');

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
  // AI HANDLERS
  // ────────────────────────────────────

  const handleAIGenerate = useCallback(async () => {
    if (!aiDescription.trim()) {
      toast.error('Please describe the issue first');
      return;
    }
    if (aiConfig.mode === 'manual') return;

    setIsAIProcessing(true);
    setAiReport(null);

    const bugTypeLabel =
      aiBugType === 'production-bug'
        ? 'Production Bug'
        : aiBugType === 'regression-defect'
          ? 'Regression Defect'
          : 'Story Defect';

    const prompt = buildBugReportPrompt(aiDescription, bugTypeLabel, aiPlatform, aiEnvironment);

    try {
      if (aiConfig.mode === 'claude-cli') {
        const res = await fetch('/api/ai/claude-cli', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            model: aiConfig.model || 'claude-sonnet-4-6',
            feature: 'bug-report',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        // ClaudeCliProgress handles polling
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      setIsAIProcessing(false);
    }
  }, [aiDescription, aiConfig, aiBugType, aiPlatform, aiEnvironment]);

  const parseAIOutput = useCallback((output: string) => {
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = output.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, output];
      const jsonStr = jsonMatch[1]?.trim() || output.trim();
      const parsed: AIGeneratedReport = JSON.parse(jsonStr);

      setAiReport(parsed);
      setAiTitle(parsed.title || '');
      setAiSteps(parsed.stepsToReproduce || '');
      setAiExpected(parsed.expectedBehavior || '');
      setAiActual(parsed.actualBehavior || '');
      setAiModule(parsed.module || '');
      setAiPreconditions(parsed.preconditions || '');
      setAiEnvDetail(parsed.environment || aiEnvironment);

      // Map priority
      const priorityMap: Record<string, BugSeverity> = {
        critical: 'critical',
        high: 'high',
        medium: 'medium',
        low: 'low',
      };
      setAiPriority(priorityMap[parsed.priority?.toLowerCase()] || 'medium');

      toast.success('Bug report generated! Review and edit before posting.');
    } catch {
      toast.error('Failed to parse AI response. Please try again.');
    }
  }, [aiEnvironment]);

  const handleAIComplete = useCallback(
    (output: string) => {
      setIsAIProcessing(false);
      parseAIOutput(output);
    },
    [parseAIOutput]
  );

  // Post AI-generated report to Jira
  const handlePostAIReport = useCallback(async () => {
    if (!aiTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      let endpoint = '/api/jira/create-bug';
      let body: Record<string, string> = {
        title: aiTitle,
        description: aiDescription,
        stepsToReproduce: aiSteps,
        expectedBehavior: aiExpected,
        actualBehavior: aiActual,
        platform: aiPlatform,
        priority: aiPriority,
        environment: aiEnvDetail,
        module: aiModule,
      };

      if (aiBugType === 'regression-defect') {
        endpoint = '/api/jira/create-defect';
        body.preconditions = aiPreconditions;
      } else if (aiBugType === 'story-defect') {
        endpoint = '/api/jira/create-story-defect';
        body.parentStoryKey = aiParentStoryKey;
        body.preconditions = aiPreconditions;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(`Created issue: ${data.issueKey}`);
      } else {
        toast.error(data.error || 'Failed to create issue');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      setResult({ success: false, error: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [aiTitle, aiDescription, aiSteps, aiExpected, aiActual, aiPlatform, aiPriority, aiEnvDetail, aiModule, aiBugType, aiParentStoryKey, aiPreconditions]);

  // ────────────────────────────────────
  // MANUAL FORM HANDLERS
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
    if (pageMode === 'ai-assisted') {
      setAiReport(null);
      setAiTitle('');
      setAiSteps('');
      setAiExpected('');
      setAiActual('');
      setAiModule('');
      setAiPreconditions('');
      setAiEnvDetail('');
      setAiDescription('');
    } else if (activeTab === 'production-bug') {
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
  }, [activeTab, pageMode]);

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

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={pageMode === 'ai-assisted' ? 'default' : 'outline'}
          onClick={() => { setPageMode('ai-assisted'); setResult(null); }}
          className="gap-2"
        >
          <Bot className="h-4 w-4" />
          AI-Assisted
        </Button>
        <Button
          variant={pageMode === 'manual-form' ? 'default' : 'outline'}
          onClick={() => { setPageMode('manual-form'); setResult(null); }}
          className="gap-2"
        >
          <PenLine className="h-4 w-4" />
          Manual Form
        </Button>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* AI-ASSISTED MODE                            */}
      {/* ═══════════════════════════════════════════ */}
      {pageMode === 'ai-assisted' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: AI Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                  </div>
                  AI-Assisted Bug Report
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe the issue in your own words and AI will generate a structured bug report.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Issue Description */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Describe the Issue *</Label>
                  <Textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="When I try to book a ride for a guest user on the B2B portal, the system shows a 500 error after clicking &quot;Confirm Booking&quot;. This happens only when the guest has an Algerian phone number starting with +213."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Bug Type */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Bug Type</Label>
                  <div className="flex gap-2">
                    {[
                      { id: 'production-bug' as IssueType, label: 'Production Bug', icon: Bug, color: 'text-red-500' },
                      { id: 'regression-defect' as IssueType, label: 'Regression', icon: AlertTriangle, color: 'text-amber-500' },
                      { id: 'story-defect' as IssueType, label: 'Story Defect', icon: FileText, color: 'text-blue-500' },
                    ].map((t) => (
                      <Button
                        key={t.id}
                        variant={aiBugType === t.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAiBugType(t.id)}
                        className="flex-1 gap-1.5"
                      >
                        <t.icon className={`h-3.5 w-3.5 ${aiBugType === t.id ? '' : t.color}`} />
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Story defect: parent key */}
                {aiBugType === 'story-defect' && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Parent Story Key *</Label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={aiParentStoryKey}
                        onChange={(e) => setAiParentStoryKey(e.target.value.toUpperCase())}
                        placeholder="e.g. CMB-12345"
                        className="pl-10 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Platform & Environment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Platform</Label>
                    <Select value={aiPlatform} onValueChange={(v) => setAiPlatform(v as Platform)}>
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
                    <Label className="text-xs text-muted-foreground">Environment</Label>
                    <Select value={aiEnvironment} onValueChange={setAiEnvironment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="preprod">Preprod</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="UAT">UAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* AI Mode Selector */}
                <AIModeSelector value={aiConfig} onChange={setAiConfig} />

                {/* Generate Button (auto modes) */}
                {aiConfig.mode !== 'manual' && (
                  <>
                    <Button
                      onClick={handleAIGenerate}
                      disabled={isAIProcessing || !aiDescription.trim()}
                      className="w-full"
                    >
                      {isAIProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Bug Report...
                        </>
                      ) : (
                        <>
                          <Bot className="mr-2 h-4 w-4" />
                          Generate Bug Report
                        </>
                      )}
                    </Button>

                    {/* Claude CLI Progress */}
                    {aiConfig.mode === 'claude-cli' && (
                      <ClaudeCliProgress
                        isActive={isAIProcessing}
                        onComplete={handleAIComplete}
                        onError={(error) => {
                          toast.error(error);
                          setIsAIProcessing(false);
                        }}
                      />
                    )}
                  </>
                )}

                {/* Manual mode hint */}
                {aiConfig.mode === 'manual' && (
                  <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    Use the Manual Form tab instead, or switch to Claude CLI / Gemini mode for AI-assisted generation.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Generated Report — Editable Fields */}
            {aiReport && (
              <Card className="border-violet-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                      <CheckCircle2 className="h-4 w-4 text-violet-500" />
                    </div>
                    Generated Report
                    <Badge variant="outline" className="ml-auto text-xs">Editable</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Review and edit all fields before posting to Jira.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Title *</Label>
                    <Input
                      value={aiTitle}
                      onChange={(e) => setAiTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Module</Label>
                      <Input
                        value={aiModule}
                        onChange={(e) => setAiModule(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Severity</Label>
                      <BugSeveritySelector value={aiPriority} onChange={setAiPriority} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Preconditions</Label>
                    <Textarea
                      value={aiPreconditions}
                      onChange={(e) => setAiPreconditions(e.target.value)}
                      className="min-h-[50px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                    <Textarea
                      value={aiSteps}
                      onChange={(e) => setAiSteps(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                      <Textarea
                        value={aiExpected}
                        onChange={(e) => setAiExpected(e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                      <Textarea
                        value={aiActual}
                        onChange={(e) => setAiActual(e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Environment Details</Label>
                    <Input
                      value={aiEnvDetail}
                      onChange={(e) => setAiEnvDetail(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handlePostAIReport}
                    disabled={isSubmitting || !aiTitle.trim()}
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
                        Post to Jira
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column: Result */}
          <div className="space-y-6">
            {!result && !aiReport && (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    AI-Assisted Bug Report
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                    Describe the issue in plain language on the left. AI will generate a complete, structured bug report for you to review and post.
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
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* MANUAL FORM MODE                            */}
      {/* ═══════════════════════════════════════════ */}
      {pageMode === 'manual-form' && (
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
                    <Input value={bugTitle} onChange={(e) => setBugTitle(e.target.value)} placeholder="Short descriptive title" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Platform</Label>
                      <Select value={bugPlatform} onValueChange={(v) => setBugPlatform(v as Platform)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{PLATFORMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Module</Label>
                      <Select value={bugModule} onValueChange={setBugModule}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>{MODULES.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Severity</Label>
                    <BugSeveritySelector value={bugSeverity} onChange={setBugSeverity} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Description *</Label>
                    <Textarea value={bugDescription} onChange={(e) => setBugDescription(e.target.value)} placeholder="Detailed description of the issue..." className="min-h-[80px]" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                    <Textarea value={bugSteps} onChange={(e) => setBugSteps(e.target.value)} placeholder={"1. Go to...\n2. Click on...\n3. Observe..."} className="min-h-[60px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                      <Textarea value={bugExpected} onChange={(e) => setBugExpected(e.target.value)} placeholder="What should happen" className="min-h-[60px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                      <Textarea value={bugActual} onChange={(e) => setBugActual(e.target.value)} placeholder="What actually happened" className="min-h-[60px]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Environment Details</Label>
                    <Input value={bugEnvironment} onChange={(e) => setBugEnvironment(e.target.value)} placeholder="Browser, OS, device, etc." />
                  </div>

                  <Button onClick={handleCreateProductionBug} disabled={isSubmitting || !bugTitle.trim() || !bugDescription.trim()} className="w-full">
                    {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : (<><Send className="mr-2 h-4 w-4" />Create Production Bug in Jira</>)}
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
                    <Input value={regTitle} onChange={(e) => setRegTitle(e.target.value)} placeholder="Short descriptive title" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Environment</Label>
                      <Select value={regEnvironment} onValueChange={(v) => setRegEnvironment(v as Environment)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{ENVIRONMENTS.map((e) => (<SelectItem key={e} value={e}>{e.toUpperCase()}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Platform</Label>
                      <Select value={regPlatform} onValueChange={(v) => setRegPlatform(v as Platform)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{PLATFORMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Module</Label>
                      <Select value={regModule} onValueChange={setRegModule}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>{MODULES.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Severity</Label>
                    <BugSeveritySelector value={regSeverity} onChange={setRegSeverity} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Preconditions</Label>
                    <Textarea value={regPreconditions} onChange={(e) => setRegPreconditions(e.target.value)} placeholder="User is logged in, on page X, etc." className="min-h-[50px]" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Description *</Label>
                    <Textarea value={regDescription} onChange={(e) => setRegDescription(e.target.value)} placeholder="Detailed description of the defect..." className="min-h-[80px]" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                    <Textarea value={regSteps} onChange={(e) => setRegSteps(e.target.value)} placeholder={"1. Go to...\n2. Click on...\n3. Observe..."} className="min-h-[60px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                      <Textarea value={regExpected} onChange={(e) => setRegExpected(e.target.value)} placeholder="What should happen" className="min-h-[60px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                      <Textarea value={regActual} onChange={(e) => setRegActual(e.target.value)} placeholder="What actually happened" className="min-h-[60px]" />
                    </div>
                  </div>

                  <Button onClick={handleCreateRegressionDefect} disabled={isSubmitting || !regTitle.trim() || !regDescription.trim()} className="w-full">
                    {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : (<><Send className="mr-2 h-4 w-4" />Create Regression Defect in Jira</>)}
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
                      <Input value={storyParentKey} onChange={(e) => setStoryParentKey(e.target.value.toUpperCase())} placeholder="e.g. CMB-12345" className="pl-10 font-mono" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Title * (no prefix)</Label>
                    <Input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} placeholder="Clean descriptive title" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Module</Label>
                      <Select value={storyModule} onValueChange={setStoryModule}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>{MODULES.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Environment</Label>
                      <Input value={storyEnvironment} onChange={(e) => setStoryEnvironment(e.target.value)} placeholder="e.g. Preprod" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Severity</Label>
                    <BugSeveritySelector value={storySeverity} onChange={setStorySeverity} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Preconditions</Label>
                    <Textarea value={storyPreconditions} onChange={(e) => setStoryPreconditions(e.target.value)} placeholder="User is logged in, on page X, etc." className="min-h-[50px]" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Description *</Label>
                    <Textarea value={storyDescription} onChange={(e) => setStoryDescription(e.target.value)} placeholder="Detailed description of the defect..." className="min-h-[80px]" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Steps to Reproduce</Label>
                    <Textarea value={storySteps} onChange={(e) => setStorySteps(e.target.value)} placeholder={"1. Go to...\n2. Click on...\n3. Observe..."} className="min-h-[60px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Expected Behavior</Label>
                      <Textarea value={storyExpected} onChange={(e) => setStoryExpected(e.target.value)} placeholder="What should happen" className="min-h-[60px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Actual Behavior</Label>
                      <Textarea value={storyActual} onChange={(e) => setStoryActual(e.target.value)} placeholder="What actually happened" className="min-h-[60px]" />
                    </div>
                  </div>

                  <Button onClick={handleCreateStoryDefect} disabled={isSubmitting || !storyParentKey.trim() || !storyTitle.trim() || !storyDescription.trim()} className="w-full">
                    {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : (<><Send className="mr-2 h-4 w-4" />Create Story Defect in Jira</>)}
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
      )}
    </div>
  );
}
