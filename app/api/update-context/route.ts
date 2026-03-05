import { NextRequest, NextResponse } from 'next/server';
import {
  createMessage,
  CONTEXT_UPDATE_SYSTEM_PROMPT,
  buildUpdateContextPrompt,
  isApiKeyConfigured,
} from '@/lib/ai';
import { readModuleById, writeModuleContent, addChangeLogEntry } from '@/lib/knowledge-engine';
import type { ContextUpdatePreview } from '@/lib/types/change-log';

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
    const { story, moduleId, changeType = 'REVAMP' } = body;

    if (!story || typeof story !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Story is required' },
        { status: 400 }
      );
    }

    if (!moduleId || typeof moduleId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Module ID is required' },
        { status: 400 }
      );
    }

    // Read the current module content
    const module = await readModuleById(moduleId);

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    // Build the prompt with full module content
    const fullContent = `---
id: ${module.frontmatter.id}
title: ${module.frontmatter.title}
system: ${module.frontmatter.system}
type: ${module.frontmatter.type}
tags: [${module.frontmatter.tags.join(', ')}]
dependencies: [${module.frontmatter.dependencies.join(', ')}]
version: "${module.frontmatter.version}"
last_updated: "${module.frontmatter.last_updated}"
---

${module.content}`;

    const userMessage = buildUpdateContextPrompt(story, fullContent, changeType);

    // Get update from AI
    const response = await createMessage({
      systemPrompt: CONTEXT_UPDATE_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 8000,
    });

    // Try to parse as JSON
    let preview: ContextUpdatePreview | null = null;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        preview = JSON.parse(jsonMatch[0]) as ContextUpdatePreview;
      }
    } catch {
      return NextResponse.json({
        success: true,
        preview: null,
        rawResponse: response,
      });
    }

    return NextResponse.json({
      success: true,
      preview,
      currentContent: fullContent,
    });
  } catch (error) {
    console.error('Error generating context update:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, updatedContent, changeLogEntry } = body;

    if (!moduleId || !updatedContent) {
      return NextResponse.json(
        { success: false, error: 'Module ID and updated content are required' },
        { status: 400 }
      );
    }

    // Write the updated content
    await writeModuleContent(moduleId, updatedContent);

    // Add change log entry if provided
    if (changeLogEntry) {
      await addChangeLogEntry({
        ...changeLogEntry,
        moduleId,
        status: 'APPLIED',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Module updated successfully',
    });
  } catch (error) {
    console.error('Error applying context update:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
