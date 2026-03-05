import { NextResponse } from 'next/server';
import {
  readAllModules,
  readKnowledgeBaseMeta,
  getContextSummary,
} from '@/lib/knowledge-engine';

export async function GET() {
  try {
    const [modules, meta, summary] = await Promise.all([
      readAllModules(),
      readKnowledgeBaseMeta(),
      getContextSummary(),
    ]);

    // Transform modules for API response (without full content)
    const moduleList = modules.map((module) => ({
      id: module.id,
      title: module.frontmatter.title,
      system: module.frontmatter.system,
      type: module.frontmatter.type,
      tags: module.frontmatter.tags,
      dependencies: module.frontmatter.dependencies,
      risk_level: module.frontmatter.risk_level,
      version: module.frontmatter.version,
      last_updated: module.frontmatter.last_updated,
      filePath: module.filePath,
    }));

    return NextResponse.json({
      success: true,
      modules: moduleList,
      meta,
      summary,
    });
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
