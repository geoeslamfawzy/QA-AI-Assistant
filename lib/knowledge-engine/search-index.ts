import MiniSearch from 'minisearch';
import type { ModuleContent, SearchResult } from '@/lib/types/knowledge-base';
import { readAllModules } from './file-reader';

interface IndexedDocument {
  id: string;
  title: string;
  system: string;
  type: string;
  content: string;
  keywords: string;
  tags: string;
  filePath: string;
  riskLevel: string;
}

let searchIndex: MiniSearch<IndexedDocument> | null = null;
let indexedModules: Map<string, ModuleContent> = new Map();

/**
 * Initialize or get the search index
 */
export async function getSearchIndex(): Promise<MiniSearch<IndexedDocument>> {
  if (searchIndex) {
    return searchIndex;
  }

  return rebuildSearchIndex();
}

/**
 * Rebuild the search index from scratch
 */
export async function rebuildSearchIndex(): Promise<MiniSearch<IndexedDocument>> {
  const modules = await readAllModules();

  // Create new index
  searchIndex = new MiniSearch<IndexedDocument>({
    fields: ['title', 'keywords', 'tags', 'content', 'system', 'type'],
    storeFields: ['title', 'system', 'type', 'filePath', 'riskLevel'],
    idField: 'id',
    searchOptions: {
      boost: { title: 3, keywords: 2.5, tags: 2, system: 1.5, type: 1.5, content: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  // Clear and rebuild module map
  indexedModules.clear();

  // Index all modules
  const documents: IndexedDocument[] = modules.map((module) => {
    indexedModules.set(module.id, module);

    return {
      id: module.id,
      title: module.frontmatter.title,
      system: module.frontmatter.system,
      type: module.frontmatter.type,
      content: module.content,
      keywords: (module.frontmatter.keywords || []).join(' '),
      tags: (module.frontmatter.tags || []).join(' '),
      filePath: module.filePath,
      riskLevel: module.frontmatter.risk_level || 'low',
    };
  });

  searchIndex.addAll(documents);

  console.log(`Search index rebuilt with ${documents.length} documents`);

  return searchIndex;
}

/**
 * Search the knowledge base
 */
export async function search(
  query: string,
  options?: {
    system?: string;
    type?: string;
    limit?: number;
  }
): Promise<SearchResult[]> {
  const index = await getSearchIndex();
  const limit = options?.limit || 10;

  // Build base search options
  let results = index.search(query, {
    boost: { title: 3, keywords: 2.5, tags: 2, content: 1 },
    fuzzy: 0.2,
    prefix: true,
  });

  // Apply filters if specified
  if (options?.system || options?.type) {
    results = results.filter((result) => {
      let match = true;

      if (options.system) {
        const system = (result as unknown as { system: string }).system;
        match = match && system?.toLowerCase().includes(options.system.toLowerCase());
      }

      if (options.type) {
        const type = (result as unknown as { type: string }).type;
        match = match && type === options.type;
      }

      return match;
    });
  }

  return results.slice(0, limit).map((result) => ({
    id: result.id,
    title: result.title,
    module: result.system,
    type: result.type,
    filePath: result.filePath,
    score: result.score,
    matches: result.terms,
  }));
}

/**
 * Get a module from the index cache
 */
export function getIndexedModule(id: string): ModuleContent | undefined {
  return indexedModules.get(id);
}

/**
 * Get all indexed modules
 */
export function getAllIndexedModules(): ModuleContent[] {
  return Array.from(indexedModules.values());
}

/**
 * Auto-suggest search terms
 */
export async function suggest(
  query: string,
  limit: number = 5
): Promise<string[]> {
  const index = await getSearchIndex();
  const results = index.autoSuggest(query, { fuzzy: 0.2 });

  return results.slice(0, limit).map((r) => r.suggestion);
}

/**
 * Search for modules by keyword match
 */
export async function searchByKeywords(
  keywords: string[],
  limit: number = 5
): Promise<SearchResult[]> {
  const query = keywords.join(' ');
  return search(query, { limit });
}

/**
 * Find modules related to a given module
 */
export async function findRelatedModules(
  moduleId: string,
  limit: number = 5
): Promise<SearchResult[]> {
  const module = indexedModules.get(moduleId);
  if (!module) return [];

  // Search using the module's keywords and tags
  const searchTerms = [
    ...(module.frontmatter.keywords || []),
    ...(module.frontmatter.tags || []),
  ].join(' ');

  const results = await search(searchTerms, { limit: limit + 1 });

  // Filter out the original module
  return results.filter((r) => r.id !== moduleId).slice(0, limit);
}

/**
 * Get index statistics
 */
export async function getIndexStats(): Promise<{
  documentCount: number;
  termCount: number;
  avgFieldLength: Record<string, number>;
}> {
  const index = await getSearchIndex();

  return {
    documentCount: index.documentCount,
    termCount: index.termCount,
    avgFieldLength: {
      title: 3,
      keywords: 8,
      content: 500,
    },
  };
}
