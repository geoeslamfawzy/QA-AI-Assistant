// Knowledge Engine - Main exports

export {
  readModuleFile,
  readAllModules,
  readModuleById,
  readKnowledgeBaseMeta,
  getModulesBySystem,
  getModulesByType,
  listModuleIds,
  getModuleDependencies,
  getRelatedModules,
  readDirectoryModules,
  writeModuleContent,
  addChangeLogEntry,
  readChangeLog,
} from './file-reader';

export {
  getSearchIndex,
  rebuildSearchIndex,
  search,
  getIndexedModule,
  getAllIndexedModules,
  suggest,
  searchByKeywords,
  findRelatedModules,
  getIndexStats,
} from './search-index';

export {
  buildContext,
  buildModuleContext,
  getContextSummary,
} from './context-builder';

export {
  generateDiff,
  generateDiffSummary,
  applyDiffs,
  compareArrays,
  generateUnifiedDiff,
} from './diff-generator';
