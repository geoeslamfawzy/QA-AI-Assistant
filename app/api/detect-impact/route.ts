import { NextRequest, NextResponse } from 'next/server';
import {
  createMessage,
  createStreamingMessage,
  IMPACT_DETECTION_SYSTEM_PROMPT,
  buildDetectImpactPrompt,
  createStreamingResponse,
  isApiKeyConfigured,
} from '@/lib/ai';
import { buildContext } from '@/lib/knowledge-engine';
import type { ImpactAnalysisResult } from '@/lib/types/impact';

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

    // Build context from knowledge base - include dependencies
    const { context, modulesUsed, tokenEstimate } = await buildContext(story, {
      includeDependencies: true,
      includeRelated: true,
    });

    // Build the prompt
    const userMessage = buildDetectImpactPrompt(story, context);

    if (stream) {
      // Streaming response
      const messageStream = await createStreamingMessage({
        systemPrompt: IMPACT_DETECTION_SYSTEM_PROMPT,
        userMessage,
      });

      return createStreamingResponse(messageStream);
    } else {
      // Non-streaming response
      const response = await createMessage({
        systemPrompt: IMPACT_DETECTION_SYSTEM_PROMPT,
        userMessage,
      });

      // Try to parse as JSON
      let result: ImpactAnalysisResult | null = null;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]) as ImpactAnalysisResult;
        }
      } catch {
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
    console.error('Error detecting impact:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
