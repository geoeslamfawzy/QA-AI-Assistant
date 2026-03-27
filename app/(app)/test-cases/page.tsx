'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PromptBlock } from '@/components/shared/PromptBlock';
import { ClaudeResponseInput } from '@/components/shared/ClaudeResponseInput';
import AIModeSelector, { type AIModeConfig } from '@/components/ai/AIModeSelector';
import ClaudeCliProgress from '@/components/ai/ClaudeCliProgress';
import {
  TestCaseConfigPanel,
  type TestCaseConfig,
} from '@/components/test-cases/TestCaseConfigPanel';
import {
  TestCaseTable,
  type ParsedTestCase,
} from '@/components/test-cases/TestCaseTable';
import {
  TestTubes,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  SkipForward,
  XCircle,
  ExternalLink,
  AlertCircle,
  Bot,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import type { PushTestCasesResponse, TestCasePushResult } from '@/lib/test-cases/types';

export default function TestCasesPage() {
  // Configuration state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState('');

  // Prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [promptTitle, setPromptTitle] = useState<string>('');

  // Response state
  const [claudeResponse, setClaudeResponse] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // AI mode state
  const [aiConfig, setAiConfig] = useState<AIModeConfig>({ mode: 'claude-cli' });
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Parsed results
  const [testCases, setTestCases] = useState<ParsedTestCase[]>([]);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Push state
  const [parentStoryKey, setParentStoryKey] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushResults, setPushResults] = useState<PushTestCasesResponse | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);

  // Generate prompt from configuration
  const handleGeneratePrompt = useCallback(async (config: TestCaseConfig) => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test-cases',
          ticketId: config.ticketId,
          format: config.format,
          coverage: config.coverage.filter((c) => c.active).map((c) => c.id),
          additionalCriteria: config.additionalCriteria,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      setGeneratedPrompt(data.prompt);
      setPromptTitle(
        config.ticketId
          ? `Test Cases for ${config.ticketId}`
          : 'Test Case Generation'
      );
      setCurrentTicketId(config.ticketId || '');
      setParentStoryKey(config.ticketId || '');
      // Clear previous response and results
      setClaudeResponse('');
      setTestCases([]);
      setSelectedIds([]);
      setPushResults(null);
      toast.success('Prompt generated! Copy it to Claude.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Parse Claude's response
  const handleParseResponse = useCallback(async () => {
    if (!claudeResponse.trim()) {
      toast.error("Please paste Claude's response");
      return;
    }

    setIsParsing(true);

    try {
      const response = await fetch('/api/prompts/parse-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test-cases',
          response: claudeResponse,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse response');
      }

      setTestCases(data.testCases);
      setSelectedIds(data.testCases.map((tc: ParsedTestCase) => tc.id));
      toast.success(`Parsed ${data.testCases.length} test cases`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsParsing(false);
    }
  }, [claudeResponse]);

  // Run AI generation (Claude CLI)
  const handleAIGenerate = useCallback(async () => {
    if (!generatedPrompt || aiConfig.mode === 'manual') return;

    setIsAIProcessing(true);

    try {
      if (aiConfig.mode === 'claude-cli') {
        const res = await fetch('/api/ai/claude-cli', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: generatedPrompt,
            model: aiConfig.model || 'claude-sonnet-4-6',
            feature: 'test-cases',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        // ClaudeCliProgress component handles polling and calls onComplete
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
      setIsAIProcessing(false);
    }
  }, [generatedPrompt, aiConfig]);

  // Handle AI completion — set response and auto-parse
  const handleAIComplete = useCallback(
    async (output: string) => {
      setClaudeResponse(output);
      setIsAIProcessing(false);

      // Auto-parse the response
      try {
        const response = await fetch('/api/prompts/parse-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'test-cases',
            response: output,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setTestCases(data.testCases);
          setSelectedIds(data.testCases.map((tc: ParsedTestCase) => tc.id));
          toast.success(`Parsed ${data.testCases.length} test cases`);
        } else {
          toast.error(data.error || 'Failed to parse AI response');
        }
      } catch {
        toast.error('Failed to parse response. You can paste it manually.');
      }
    },
    []
  );

  // Handle selection changes
  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // Push to Jira
  const handlePushToJira = useCallback(async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one test case to push');
      return;
    }

    setIsPushing(true);

    try {
      const selectedCases = testCases.filter((tc) => selectedIds.includes(tc.id));

      const response = await fetch('/api/test-cases/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCases: selectedCases,
          parentStoryKey: parentStoryKey.trim() || undefined,
        }),
      });

      const data: PushTestCasesResponse = await response.json();
      setPushResults(data);
      setShowResultsDialog(true);

      if (data._isMock) {
        toast.info(
          `Mock mode: ${data.summary.created} test cases would be created in Jira`,
          { description: 'Configure Jira credentials to push for real' }
        );
      } else if (data.success) {
        toast.success(
          `Pushed ${data.summary.created} test cases to Jira`,
          {
            description: data.summary.skipped > 0
              ? `${data.summary.skipped} skipped (already exist)`
              : undefined,
          }
        );
      } else {
        toast.warning(
          `Partial success: ${data.summary.created} created, ${data.summary.failed} failed`
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Push failed: ${message}`);
    } finally {
      setIsPushing(false);
    }
  }, [selectedIds, testCases, parentStoryKey]);

  // Reset state
  const handleReset = useCallback(() => {
    setGeneratedPrompt('');
    setPromptTitle('');
    setClaudeResponse('');
    setTestCases([]);
    setSelectedIds([]);
    setCurrentTicketId('');
    setParentStoryKey('');
    setPushResults(null);
  }, []);

  // Get status icon for push results
  const getStatusIcon = (status: TestCasePushResult['status']) => {
    switch (status) {
      case 'created':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'skipped':
        return <SkipForward className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Test Cases</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate comprehensive test cases from Jira stories using Claude
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Configuration */}
        <TestCaseConfigPanel
          onGenerate={handleGeneratePrompt}
          isLoading={isGenerating}
        />

        {/* Right column: Output */}
        <div className="space-y-6">
          {/* Empty state */}
          {!generatedPrompt && (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <TestTubes className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No Prompt Generated
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                  Configure your test case options on the left and click
                  &quot;Generate Test Case Prompt&quot; to begin.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Prompt Block */}
          {generatedPrompt && (
            <PromptBlock
              title={promptTitle}
              subtitle="Copy this prompt to Claude"
              content={generatedPrompt}
              onBack={handleReset}
              maxHeight="300px"
            />
          )}

          {/* AI Mode + Response */}
          {generatedPrompt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  Generate with AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AIModeSelector value={aiConfig} onChange={setAiConfig} />

                {/* Auto modes: show Generate button */}
                {aiConfig.mode !== 'manual' && (
                  <>
                    <Button
                      onClick={handleAIGenerate}
                      disabled={isAIProcessing}
                      className="w-full"
                    >
                      {isAIProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          {aiConfig.mode === 'gemini' ? (
                            <Zap className="mr-2 h-4 w-4" />
                          ) : (
                            <Bot className="mr-2 h-4 w-4" />
                          )}
                          Generate with {aiConfig.mode === 'gemini' ? 'Gemini' : 'Claude CLI'}
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

                {/* Manual mode: show paste textarea */}
                {aiConfig.mode === 'manual' && (
                  <ClaudeResponseInput
                    value={claudeResponse}
                    onChange={setClaudeResponse}
                    onParse={handleParseResponse}
                    isLoading={isParsing}
                    parseButtonText="Parse Test Cases"
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Test Case Table */}
      {testCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-dim">
                <TestTubes className="h-4 w-4 text-green-500" />
              </div>
              Generated Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TestCaseTable
              testCases={testCases}
              selectable={true}
              onSelectionChange={handleSelectionChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Push to Jira Section */}
      {testCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
                <Upload className="h-4 w-4 text-indigo-500" />
              </div>
              Push to Jira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Parent Story Input */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="parentStoryKey" className="text-xs text-muted-foreground">
                  Link to Parent Story (optional)
                </Label>
                <Input
                  id="parentStoryKey"
                  value={parentStoryKey}
                  onChange={(e) => setParentStoryKey(e.target.value)}
                  placeholder="e.g. CMB-32860"
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Test issues will be linked to this story in Jira
                </p>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handlePushToJira}
                  disabled={selectedIds.length === 0 || isPushing}
                  className="min-w-[180px] bg-indigo-600 hover:bg-indigo-700"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Pushing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Push {selectedIds.length} Test Cases
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{selectedIds.length}</span>
                {' '}of {testCases.length} test cases selected
              </p>
              {pushResults && !pushResults._isMock && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResultsDialog(true)}
                >
                  View Last Results
                </Button>
              )}
            </div>

            {/* Mock Mode Warning */}
            {pushResults?._isMock && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    Mock Mode Active
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Jira credentials not configured. Add JIRA_EMAIL and JIRA_API_TOKEN to .env.local to push for real.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Push Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Push Results
              {pushResults?._isMock && (
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  Mock
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {pushResults && (
            <div className="flex-1 overflow-hidden space-y-4">
              {/* Summary Badges */}
              <div className="flex gap-3">
                <Badge className="bg-green-dim text-green-600 dark:text-green-400 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {pushResults.summary.created} Created
                </Badge>
                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 gap-1">
                  <SkipForward className="h-3 w-3" />
                  {pushResults.summary.skipped} Skipped
                </Badge>
                <Badge className="bg-red-dim text-red-600 dark:text-red-400 gap-1">
                  <XCircle className="h-3 w-3" />
                  {pushResults.summary.failed} Failed
                </Badge>
              </div>

              {/* Parent Story Link */}
              {pushResults.parentStoryKey && (
                <p className="text-sm text-muted-foreground">
                  Linked to parent story:{' '}
                  <a
                    href={`https://yassir.atlassian.net/browse/${pushResults.parentStoryKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary hover:underline"
                  >
                    {pushResults.parentStoryKey}
                    <ExternalLink className="inline-block h-3 w-3 ml-1" />
                  </a>
                </p>
              )}

              {/* Results List */}
              <ScrollArea className="flex-1 max-h-[400px] pr-4">
                <div className="space-y-2">
                  {pushResults.results.map((result) => (
                    <div
                      key={result.testCaseId}
                      className="flex items-start justify-between p-3 rounded-md border bg-muted/30"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {getStatusIcon(result.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {result.title}
                          </p>
                          {result.reason && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {result.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      {result.jiraKey && (
                        <a
                          href={result.jiraUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-mono text-primary hover:underline shrink-0"
                        >
                          {result.jiraKey}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
