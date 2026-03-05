import { NextRequest, NextResponse } from 'next/server';
import {
  createMessage,
  CONTEXT_UPDATE_SYSTEM_PROMPT,
  buildPreviewUpdatePrompt,
  isApiKeyConfigured,
} from '@/lib/ai';
import { buildContext } from '@/lib/knowledge-engine';

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
    const { story } = body;

    if (!story || typeof story !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Story is required' },
        { status: 400 }
      );
    }

    // Build context from knowledge base
    const { context, modulesUsed } = await buildContext(story, {
      includeDependencies: true,
      includeRelated: true,
    });

    // Build the prompt
    const userMessage = buildPreviewUpdatePrompt(story, context);

    // Get preview from AI
    const response = await createMessage({
      systemPrompt: CONTEXT_UPDATE_SYSTEM_PROMPT,
      userMessage,
    });

    // Try to parse as JSON
    let preview = null;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        preview = JSON.parse(jsonMatch[0]);
      }
    } catch {
      return NextResponse.json({
        success: true,
        preview: null,
        rawResponse: response,
        context_used: modulesUsed,
      });
    }

    return NextResponse.json({
      success: true,
      preview,
      context_used: modulesUsed,
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
