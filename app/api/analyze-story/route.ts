import { NextRequest, NextResponse } from 'next/server';
import {
  createMessage,
  createStreamingMessage,
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalyzeStoryPrompt,
  createStreamingResponse,
  isApiKeyConfigured,
} from '@/lib/ai';
import { buildContext } from '@/lib/knowledge-engine';
import type { StoryAnalysisResult } from '@/lib/types/analysis';

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!isApiKeyConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { story, stream = false } = body;

    if (!story || typeof story !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Story is required' },
        { status: 400 }
      );
    }

    // Build context from knowledge base
    const { context, modulesUsed, tokenEstimate } = await buildContext(story);

    // Build the prompt
    const userMessage = buildAnalyzeStoryPrompt(story, context);

    if (stream) {
      // Streaming response
      const messageStream = await createStreamingMessage({
        systemPrompt: ANALYSIS_SYSTEM_PROMPT,
        userMessage,
      });

      return createStreamingResponse(messageStream);
    } else {
      // Non-streaming response
      const response = await createMessage({
        systemPrompt: ANALYSIS_SYSTEM_PROMPT,
        userMessage,
      });

      // Try to parse as JSON
      let result: StoryAnalysisResult | null = null;
      try {
        // Extract JSON from the response (it might have markdown code blocks)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]) as StoryAnalysisResult;
        }
      } catch {
        // If parsing fails, return the raw response
        return NextResponse.json({
          success: true,
          result: null,
          rawResponse: response,
          context_used: modulesUsed,
          token_estimate: tokenEstimate,
        });
      }

      return NextResponse.json({
        success: true,
        result,
        context_used: modulesUsed,
        token_estimate: tokenEstimate,
      });
    }
  } catch (error) {
    console.error('Error analyzing story:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
