import { NextRequest, NextResponse } from 'next/server';
import {
  createMessage,
  createStreamingMessage,
  TEST_GENERATION_SYSTEM_PROMPT,
  buildGenerateTestsPrompt,
  createStreamingResponse,
  isApiKeyConfigured,
  type TestGenerationConfig,
} from '@/lib/ai';
import { buildContext } from '@/lib/knowledge-engine';
import type { TestSuiteResult } from '@/lib/types/test-case';

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
    const { story, options, stream = false } = body as {
      story: string;
      options?: TestGenerationConfig;
      stream?: boolean;
    };

    if (!story || typeof story !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Story is required' },
        { status: 400 }
      );
    }

    // Build context from knowledge base
    const { context, modulesUsed, tokenEstimate } = await buildContext(story);

    // Build the prompt
    const userMessage = buildGenerateTestsPrompt(story, context, options);

    if (stream) {
      // Streaming response
      const messageStream = await createStreamingMessage({
        systemPrompt: TEST_GENERATION_SYSTEM_PROMPT,
        userMessage,
      });

      return createStreamingResponse(messageStream);
    } else {
      // Non-streaming response
      const response = await createMessage({
        systemPrompt: TEST_GENERATION_SYSTEM_PROMPT,
        userMessage,
      });

      // Try to parse as JSON
      let result: TestSuiteResult | null = null;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]) as TestSuiteResult;
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
    console.error('Error generating tests:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
