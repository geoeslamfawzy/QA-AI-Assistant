'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Stepper, type Step } from '@/components/shared/Stepper';
import { PromptBlock } from '@/components/shared/PromptBlock';
import { ClaudeResponseInput } from '@/components/shared/ClaudeResponseInput';
import { JiraFetchCard, type JiraTicket } from '@/components/analyze/JiraFetchCard';
import { FigmaExtractCard, type FigmaFrame } from '@/components/analyze/FigmaExtractCard';
import {
  AnalysisOptionsCard,
  type AnalysisOptions,
} from '@/components/analyze/AnalysisOptionsCard';
import { FindingCard, type Finding } from '@/components/analyze/FindingCard';
import AIModeSelector, { type AIModeConfig } from '@/components/ai/AIModeSelector';
import ClaudeCliProgress from '@/components/ai/ClaudeCliProgress';
import { Database, FileText, Send, CheckCircle, Loader2, Bot, Zap } from 'lucide-react';
import { toast } from 'sonner';

const steps: Step[] = [
  {
    id: 'fetch',
    label: 'Fetch Data',
    description: 'Pull from Jira & Figma',
  },
  {
    id: 'generate',
    label: 'Generate Prompt',
    description: 'Copy prompt, paste response',
  },
  {
    id: 'review',
    label: 'Review & Post',
    description: 'Select findings, post to Jira',
  },
];

export default function AnalyzePage() {
  // Step management
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Fetch Data state
  const [jiraTicket, setJiraTicket] = useState<JiraTicket | null>(null);
  const [figmaFrames, setFigmaFrames] = useState<FigmaFrame[]>([]);
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>({
    ambiguity: true,
    testability: true,
    designGap: false,
    impactAnalysis: false,
  });

  // Step 2: Generate Prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [claudeResponse, setClaudeResponse] = useState('');
  const [isParsingResponse, setIsParsingResponse] = useState(false);

  // AI mode state
  const [aiConfig, setAiConfig] = useState<AIModeConfig>({ mode: 'claude-cli' });
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Step 3: Review & Post state
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFindings, setSelectedFindings] = useState<Set<string>>(new Set());
  const [isPostingToJira, setIsPostingToJira] = useState(false);

  // Handle Jira fetch success
  const handleJiraFetch = useCallback((ticket: JiraTicket) => {
    setJiraTicket(ticket);
    toast.success(`Fetched ticket: ${ticket.ticketId}`);
  }, []);

  // Handle Figma extraction success
  const handleFigmaExtract = useCallback((frames: FigmaFrame[]) => {
    setFigmaFrames(frames);
    toast.success(`Extracted ${frames.length} frames from Figma`);
  }, []);

  // Generate prompt based on fetched data and options
  const handleGeneratePrompt = useCallback(async () => {
    if (!jiraTicket) {
      toast.error('Please fetch a Jira ticket first');
      return;
    }

    setIsGeneratingPrompt(true);

    try {
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story-analysis',
          jiraTicket,
          figmaFrames,
          options: analysisOptions,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      setGeneratedPrompt(data.prompt);
      setCurrentStep(1); // Move to step 2
      toast.success('Prompt generated! Copy it to Claude.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsGeneratingPrompt(false);
    }
  }, [jiraTicket, figmaFrames, analysisOptions]);

  // Parse Claude's response
  const handleParseResponse = useCallback(async () => {
    if (!claudeResponse.trim()) {
      toast.error('Please paste Claude\'s response');
      return;
    }

    setIsParsingResponse(true);

    try {
      const response = await fetch('/api/prompts/parse-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story-analysis',
          response: claudeResponse,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to parse response');
      }

      setFindings(data.findings);
      // Auto-select all findings initially
      setSelectedFindings(new Set(data.findings.map((f: Finding) => f.id)));
      setCurrentStep(2); // Move to step 3
      toast.success(`Found ${data.findings.length} findings`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsParsingResponse(false);
    }
  }, [claudeResponse]);

  // Run AI analysis (Gemini or Claude CLI)
  const handleAIAnalyze = useCallback(async () => {
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
            feature: 'analyze-story',
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

  // Handle AI completion — set the response and auto-parse
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
            type: 'story-analysis',
            response: output,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFindings(data.findings);
          setSelectedFindings(new Set(data.findings.map((f: Finding) => f.id)));
          setCurrentStep(2);
          toast.success(`Found ${data.findings.length} findings`);
        } else {
          toast.error(data.error || 'Failed to parse AI response');
        }
      } catch {
        toast.error('Failed to parse response. You can paste it manually.');
      }
    },
    []
  );

  // Toggle finding selection
  const handleToggleFinding = useCallback((id: string) => {
    setSelectedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Post selected findings to Jira
  const handlePostToJira = useCallback(async () => {
    if (selectedFindings.size === 0) {
      toast.error('Please select at least one finding to post');
      return;
    }

    if (!jiraTicket) {
      toast.error('No Jira ticket associated');
      return;
    }

    setIsPostingToJira(true);

    try {
      const selectedFindingsList = findings.filter((f) =>
        selectedFindings.has(f.id)
      );

      const response = await fetch('/api/jira/post-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: jiraTicket.ticketId,
          findings: selectedFindingsList,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to post to Jira');
      }

      toast.success(`Posted ${selectedFindings.size} findings to ${jiraTicket.ticketId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsPostingToJira(false);
    }
  }, [jiraTicket, findings, selectedFindings]);

  // Handle step click
  const handleStepClick = useCallback((index: number) => {
    // Only allow going back, not skipping forward
    if (index < currentStep) {
      setCurrentStep(index);
    }
  }, [currentStep]);

  // Reset to start over
  const handleStartOver = useCallback(() => {
    setCurrentStep(0);
    setJiraTicket(null);
    setFigmaFrames([]);
    setGeneratedPrompt('');
    setClaudeResponse('');
    setFindings([]);
    setSelectedFindings(new Set());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyze Story</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetch story from Jira, extract designs from Figma, generate analysis
          prompt for Claude
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Step 1: Fetch Data */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <JiraFetchCard onFetch={handleJiraFetch} ticket={jiraTicket} />
            <FigmaExtractCard
              onExtract={handleFigmaExtract}
              frames={figmaFrames}
            />
          </div>
          <AnalysisOptionsCard
            options={analysisOptions}
            onOptionsChange={setAnalysisOptions}
            onGenerate={handleGeneratePrompt}
            isLoading={isGeneratingPrompt}
            disabled={!jiraTicket}
          />
        </div>
      )}

      {/* Step 2: Generate Prompt */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <PromptBlock
            title="Analysis Prompt"
            subtitle={jiraTicket ? `For ${jiraTicket.ticketId}: ${jiraTicket.title}` : ''}
            content={generatedPrompt}
            onBack={() => setCurrentStep(0)}
            maxHeight="400px"
          />

          {/* AI Mode Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                Analyze with AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AIModeSelector value={aiConfig} onChange={setAiConfig} />

              {/* Auto modes: show Analyze button */}
              {aiConfig.mode !== 'manual' && (
                <>
                  <Button
                    onClick={handleAIAnalyze}
                    disabled={isAIProcessing}
                    className="w-full"
                  >
                    {isAIProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        {aiConfig.mode === 'gemini' ? (
                          <Zap className="mr-2 h-4 w-4" />
                        ) : (
                          <Bot className="mr-2 h-4 w-4" />
                        )}
                        Analyze with {aiConfig.mode === 'gemini' ? 'Gemini' : 'Claude CLI'}
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
                  isLoading={isParsingResponse}
                  parseButtonText="Parse Findings"
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review & Post */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-dim">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  Review Findings
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select the findings you want to post to Jira. Click to
                  toggle selection.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedFindings.size} of {findings.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedFindings.size === findings.length) {
                      setSelectedFindings(new Set());
                    } else {
                      setSelectedFindings(new Set(findings.map((f) => f.id)));
                    }
                  }}
                >
                  {selectedFindings.size === findings.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {findings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Database className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      No findings to display. Go back and parse Claude&apos;s
                      response.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back to Step 2
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {findings.map((finding) => (
                      <FindingCard
                        key={finding.id}
                        finding={finding}
                        selected={selectedFindings.has(finding.id)}
                        onToggle={handleToggleFinding}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back to Prompt
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleStartOver}>
                Start Over
              </Button>
              <Button
                onClick={handlePostToJira}
                disabled={selectedFindings.size === 0 || isPostingToJira}
              >
                {isPostingToJira ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post {selectedFindings.size} to Jira
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
