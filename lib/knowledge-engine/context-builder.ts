import type { ModuleContent } from '@/lib/types/knowledge-base';
import { search, getIndexedModule, getAllIndexedModules } from './search-index';
import { readModuleById, getModuleDependencies, getRelatedModules } from './file-reader';

// Approximate token counts (rough estimate: 1 token ≈ 4 characters)
const TOKEN_ESTIMATE_RATIO = 4;
const MAX_CONTEXT_TOKENS = 15000;

// Token budget allocation
const BUDGET = {
  moduleContext: 6000,
  searchResults: 5000,
  dependencies: 2500,
  atomicRules: 1500,
};

/**
 * Estimate token count for a string
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / TOKEN_ESTIMATE_RATIO);
}

/**
 * Extract keywords and module references from user story
 */
function extractKeywords(story: string): {
  keywords: string[];
  moduleRefs: string[];
} {
  // Common module-related terms
  const modulePatterns = [
    /b2b[-\s]?(portal|dashboard|users|groups|programs|payments|trips|referrals|challenge|gift)/gi,
    /admin[-\s]?(panel|enterprises?|users?|payments?|settings?)/gi,
    /b2c[-\s]?(webapp|ride|booking)/gi,
  ];

  const moduleRefs: string[] = [];
  modulePatterns.forEach((pattern) => {
    const matches = story.matchAll(pattern);
    for (const match of matches) {
      moduleRefs.push(match[0].toLowerCase().replace(/\s/g, '-'));
    }
  });

  // Extract general keywords
  const keywords = story
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)
    .filter((word) => {
      const stopWords = [
        'that', 'this', 'with', 'from', 'have', 'will', 'should', 'could',
        'would', 'when', 'then', 'than', 'into', 'also', 'been', 'being',
        'their', 'there', 'these', 'those', 'want', 'need', 'able', 'user',
      ];
      return !stopWords.includes(word);
    });

  return {
    keywords: [...new Set(keywords)].slice(0, 20),
    moduleRefs: [...new Set(moduleRefs)],
  };
}

/**
 * Format a module for context injection
 */
function formatModuleForContext(module: ModuleContent): string {
  return `
<module id="${module.id}" title="${module.frontmatter.title}" system="${module.frontmatter.system}">
${module.content}
</module>
`.trim();
}

/**
 * Build context for AI prompts
 */
export async function buildContext(
  userStory: string,
  options?: {
    maxTokens?: number;
    includeRelated?: boolean;
    includeDependencies?: boolean;
  }
): Promise<{
  context: string;
  modulesUsed: string[];
  tokenEstimate: number;
}> {
  const maxTokens = options?.maxTokens || MAX_CONTEXT_TOKENS;
  const includeRelated = options?.includeRelated ?? true;
  const includeDependencies = options?.includeDependencies ?? true;

  const contextParts: string[] = [];
  const modulesUsed: Set<string> = new Set();
  let totalTokens = 0;

  // Extract keywords and module references from user story
  const { keywords, moduleRefs } = extractKeywords(userStory);

  // Stage 1: Direct module matches (highest priority)
  const directModules: ModuleContent[] = [];
  for (const ref of moduleRefs) {
    const module = await readModuleById(ref);
    if (module && !modulesUsed.has(module.id)) {
      const formatted = formatModuleForContext(module);
      const tokens = estimateTokens(formatted);

      if (totalTokens + tokens <= BUDGET.moduleContext) {
        directModules.push(module);
        modulesUsed.add(module.id);
        totalTokens += tokens;
      }
    }
  }

  // Stage 2: Semantic search results
  const searchQuery = keywords.join(' ');
  const searchResults = await search(searchQuery, { limit: 10 });

  const searchModules: ModuleContent[] = [];
  for (const result of searchResults) {
    if (!modulesUsed.has(result.id)) {
      const module = getIndexedModule(result.id);
      if (module) {
        const formatted = formatModuleForContext(module);
        const tokens = estimateTokens(formatted);

        if (totalTokens + tokens <= BUDGET.moduleContext + BUDGET.searchResults) {
          searchModules.push(module);
          modulesUsed.add(module.id);
          totalTokens += tokens;
        }
      }
    }
  }

  // Stage 3: Dependencies of found modules
  const dependencyModules: ModuleContent[] = [];
  if (includeDependencies) {
    const foundModuleIds = [...modulesUsed];
    for (const moduleId of foundModuleIds) {
      const deps = await getModuleDependencies(moduleId);
      for (const dep of deps) {
        if (!modulesUsed.has(dep.id)) {
          const formatted = formatModuleForContext(dep);
          const tokens = estimateTokens(formatted);

          if (totalTokens + tokens <= maxTokens - BUDGET.atomicRules) {
            dependencyModules.push(dep);
            modulesUsed.add(dep.id);
            totalTokens += tokens;
          }
        }
      }
    }
  }

  // Stage 4: Related modules
  const relatedModules: ModuleContent[] = [];
  if (includeRelated) {
    const foundModuleIds = [...modulesUsed];
    for (const moduleId of foundModuleIds) {
      const related = await getRelatedModules(moduleId);
      for (const rel of related) {
        if (!modulesUsed.has(rel.id)) {
          const formatted = formatModuleForContext(rel);
          const tokens = estimateTokens(formatted);

          if (totalTokens + tokens <= maxTokens) {
            relatedModules.push(rel);
            modulesUsed.add(rel.id);
            totalTokens += tokens;
          }
        }
      }
    }
  }

  // Build the context string
  const allModules = [...directModules, ...searchModules, ...dependencyModules, ...relatedModules];

  if (allModules.length > 0) {
    contextParts.push('<project_context>');

    // Add modules by priority
    for (const module of allModules) {
      contextParts.push(formatModuleForContext(module));
    }

    contextParts.push('</project_context>');
  }

  const context = contextParts.join('\n\n');

  return {
    context,
    modulesUsed: Array.from(modulesUsed),
    tokenEstimate: totalTokens,
  };
}

/**
 * Build context for a specific module
 */
export async function buildModuleContext(
  moduleId: string
): Promise<{
  context: string;
  modulesUsed: string[];
  tokenEstimate: number;
}> {
  const contextParts: string[] = [];
  const modulesUsed: Set<string> = new Set();
  let totalTokens = 0;

  const module = await readModuleById(moduleId);
  if (!module) {
    return { context: '', modulesUsed: [], tokenEstimate: 0 };
  }

  contextParts.push('<project_context>');

  // Add the main module
  const mainFormatted = formatModuleForContext(module);
  contextParts.push(mainFormatted);
  modulesUsed.add(module.id);
  totalTokens += estimateTokens(mainFormatted);

  // Add dependencies
  const deps = await getModuleDependencies(moduleId);
  for (const dep of deps) {
    const formatted = formatModuleForContext(dep);
    const tokens = estimateTokens(formatted);

    if (totalTokens + tokens <= MAX_CONTEXT_TOKENS) {
      contextParts.push(formatted);
      modulesUsed.add(dep.id);
      totalTokens += tokens;
    }
  }

  // Add related
  const related = await getRelatedModules(moduleId);
  for (const rel of related) {
    if (!modulesUsed.has(rel.id)) {
      const formatted = formatModuleForContext(rel);
      const tokens = estimateTokens(formatted);

      if (totalTokens + tokens <= MAX_CONTEXT_TOKENS) {
        contextParts.push(formatted);
        modulesUsed.add(rel.id);
        totalTokens += tokens;
      }
    }
  }

  contextParts.push('</project_context>');

  return {
    context: contextParts.join('\n\n'),
    modulesUsed: Array.from(modulesUsed),
    tokenEstimate: totalTokens,
  };
}

/**
 * Get a summary of available context
 */
export async function getContextSummary(): Promise<{
  totalModules: number;
  bySystem: Record<string, number>;
  byType: Record<string, number>;
  totalEstimatedTokens: number;
}> {
  const modules = getAllIndexedModules();

  const bySystem: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let totalTokens = 0;

  for (const module of modules) {
    const system = module.frontmatter.system;
    const type = module.frontmatter.type;

    bySystem[system] = (bySystem[system] || 0) + 1;
    byType[type] = (byType[type] || 0) + 1;
    totalTokens += estimateTokens(module.content);
  }

  return {
    totalModules: modules.length,
    bySystem,
    byType,
    totalEstimatedTokens: totalTokens,
  };
}
