/**
 * React hook for making AI calls with any provider.
 * Handles Gemini, Claude CLI, and Manual mode uniformly.
 */

import { useState, useCallback } from 'react';
import { type AIMode, type AIModeConfig } from '@/components/ai/AIModeSelector';

export interface AICallResult {
  isLoading: boolean;
  output: string | null;
  error: string | null;
  prompt: string | null;
  mode: AIMode | null;
  isManualMode: boolean;

  call: (prompt: string, config: AIModeConfig) => Promise<string | null>;
  setManualResponse: (response: string) => void;
  reset: () => void;
}

export function useAICall(): AICallResult {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [mode, setMode] = useState<AIMode | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setOutput(null);
    setError(null);
    setPrompt(null);
    setMode(null);
  }, []);

  const call = useCallback(
    async (promptText: string, config: AIModeConfig): Promise<string | null> => {
      reset();
      setMode(config.mode);

      if (config.mode === 'manual') {
        setPrompt(promptText);
        return null;
      }

      setIsLoading(true);

      try {
        if (config.mode === 'gemini') {
          // Call existing Gemini endpoints (context-generation or module-explorer handle this)
          // For direct Gemini calls, use the generation endpoints directly
          throw new Error(
            'Use the feature-specific Gemini endpoints (e.g. /api/context-generation/auto)'
          );
        } else if (config.mode === 'claude-cli') {
          // Start Claude CLI call
          const res = await fetch('/api/ai/claude-cli', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: promptText,
              model: config.model || 'claude-sonnet-4-6',
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          // Poll for completion
          return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
              try {
                const progressRes = await fetch('/api/ai/claude-cli');
                const progress = await progressRes.json();

                if (progress.status === 'completed') {
                  clearInterval(interval);
                  setOutput(progress.output);
                  setIsLoading(false);
                  resolve(progress.output);
                }
                if (progress.status === 'failed') {
                  clearInterval(interval);
                  const errMsg = progress.error || 'Claude CLI failed';
                  setError(errMsg);
                  setIsLoading(false);
                  reject(new Error(errMsg));
                }
              } catch (err: unknown) {
                clearInterval(interval);
                const errMsg = (err as Error).message;
                setError(errMsg);
                setIsLoading(false);
                reject(err);
              }
            }, 2000);
          });
        }
      } catch (err: unknown) {
        const errMsg = (err as Error).message;
        setError(errMsg);
        setIsLoading(false);
        return null;
      }

      return null;
    },
    [reset]
  );

  const setManualResponse = useCallback((response: string) => {
    setOutput(response);
    setPrompt(null);
  }, []);

  return {
    isLoading,
    output,
    error,
    prompt,
    mode,
    isManualMode: mode === 'manual',
    call,
    setManualResponse,
    reset,
  };
}
