import { create } from 'zustand';
import type { JiraTicket } from './use-jira-store';
import type { FigmaFrame } from './use-figma-store';

export type FindingType = 'ambiguity' | 'testability' | 'design-gap' | 'impact';
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Finding {
  id: string;
  type: FindingType;
  severity: FindingSeverity;
  title: string;
  description: string;
  suggestion?: string;
}

export interface AnalysisOptions {
  ambiguity: boolean;
  testability: boolean;
  designGap: boolean;
  impactAnalysis: boolean;
}

interface AnalyzeState {
  // Step management
  currentStep: number;

  // Step 1: Data
  ticket: JiraTicket | null;
  frames: FigmaFrame[];
  options: AnalysisOptions;

  // Step 2: Prompt
  generatedPrompt: string;
  claudeResponse: string;

  // Step 3: Review
  findings: Finding[];
  selectedFindings: Set<string>;

  // Loading states
  isGeneratingPrompt: boolean;
  isParsingResponse: boolean;
  isPostingToJira: boolean;

  // Errors
  error: string | null;
}

interface AnalyzeActions {
  // Step navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1: Data
  setTicket: (ticket: JiraTicket | null) => void;
  setFrames: (frames: FigmaFrame[]) => void;
  setOptions: (options: AnalysisOptions) => void;

  // Step 2: Prompt
  generatePrompt: () => Promise<void>;
  setClaudeResponse: (response: string) => void;
  parseResponse: () => Promise<void>;

  // Step 3: Review
  toggleFinding: (findingId: string) => void;
  selectAllFindings: () => void;
  deselectAllFindings: () => void;
  postToJira: () => Promise<void>;

  // Reset
  reset: () => void;
}

type AnalyzeStore = AnalyzeState & AnalyzeActions;

const initialState: AnalyzeState = {
  currentStep: 0,
  ticket: null,
  frames: [],
  options: {
    ambiguity: true,
    testability: true,
    designGap: true,
    impactAnalysis: false,
  },
  generatedPrompt: '',
  claudeResponse: '',
  findings: [],
  selectedFindings: new Set(),
  isGeneratingPrompt: false,
  isParsingResponse: false,
  isPostingToJira: false,
  error: null,
};

export const useAnalyzeStore = create<AnalyzeStore>((set, get) => ({
  ...initialState,

  // Step navigation
  setStep: (step: number) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 2) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  // Step 1: Data
  setTicket: (ticket) => set({ ticket }),
  setFrames: (frames) => set({ frames }),
  setOptions: (options) => set({ options }),

  // Step 2: Prompt
  generatePrompt: async () => {
    const { ticket, frames, options } = get();

    if (!ticket) {
      set({ error: 'Please fetch a Jira ticket first' });
      return;
    }

    set({ isGeneratingPrompt: true, error: null });

    try {
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story-analysis',
          ticketId: ticket.ticketId,
          options: {
            ambiguity: options.ambiguity,
            testability: options.testability,
            designGap: options.designGap,
            impactAnalysis: options.impactAnalysis,
          },
          figmaFrames: frames.map((f) => f.name),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      set({
        generatedPrompt: data.prompt,
        isGeneratingPrompt: false,
        currentStep: 1,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isGeneratingPrompt: false,
      });
    }
  },

  setClaudeResponse: (response) => set({ claudeResponse: response }),

  parseResponse: async () => {
    const { claudeResponse } = get();

    if (!claudeResponse.trim()) {
      set({ error: "Please paste Claude's response" });
      return;
    }

    set({ isParsingResponse: true, error: null });

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

      // Select all findings by default
      const allFindingIds = new Set<string>(data.findings.map((f: Finding) => f.id));

      set({
        findings: data.findings,
        selectedFindings: allFindingIds,
        isParsingResponse: false,
        currentStep: 2,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isParsingResponse: false,
      });
    }
  },

  // Step 3: Review
  toggleFinding: (findingId) =>
    set((state) => {
      const newSelected = new Set(state.selectedFindings);
      if (newSelected.has(findingId)) {
        newSelected.delete(findingId);
      } else {
        newSelected.add(findingId);
      }
      return { selectedFindings: newSelected };
    }),

  selectAllFindings: () =>
    set((state) => ({
      selectedFindings: new Set(state.findings.map((f) => f.id)),
    })),

  deselectAllFindings: () => set({ selectedFindings: new Set() }),

  postToJira: async () => {
    const { ticket, findings, selectedFindings } = get();

    if (!ticket) {
      set({ error: 'No ticket selected' });
      return;
    }

    if (selectedFindings.size === 0) {
      set({ error: 'Please select at least one finding to post' });
      return;
    }

    set({ isPostingToJira: true, error: null });

    try {
      const selectedFindingsArray = findings.filter((f) =>
        selectedFindings.has(f.id)
      );

      const response = await fetch('/api/jira/post-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          findings: selectedFindingsArray,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to post to Jira');
      }

      set({ isPostingToJira: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isPostingToJira: false,
      });
    }
  },

  // Reset
  reset: () => set(initialState),
}));
