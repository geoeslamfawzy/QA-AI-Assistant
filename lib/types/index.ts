// Analysis types
export type {
  ChangeClassification,
  Relevance,
  Severity,
  MissingCategory,
  AffectedModule,
  CompletenessBreakdown,
  Ambiguity,
  MissingRequirement,
  ContextConflict,
  RelatedFeature,
  StoryAnalysisResult,
  AnalysisRequest,
  AnalysisResponse,
} from './analysis';

// Test case types
export type {
  TestCaseType,
  TestPriority,
  TestStep,
  TestCase,
  TestDataSuggestion,
  CoverageSummary,
  TestSuiteResult,
  TestGenerationOptions,
  TestGenerationRequest,
  TestGenerationResponse,
} from './test-case';

// Impact detection types
export type {
  ChangeType as ImpactChangeType,
  RiskLevel,
  ImpactType,
  EffortLevel,
  ImpactAffectedModule,
  AffectedBusinessRule,
  AffectedUIPage,
  AffectedAPIEndpoint,
  RegressionRecommendation,
  EffortEstimate,
  ImpactAnalysisResult,
  ImpactDetectionRequest,
  ImpactDetectionResponse,
} from './impact';

// Change log types
export type {
  ChangeAction,
  ChangeStatus,
  ChangeType,
  DiffEntry,
  NewBusinessRule,
  ChangeLogEntry,
  ContextUpdatePreview,
  ContextUpdateRequest,
  ContextUpdateResponse,
  ApplyContextUpdateRequest,
  ChangeLogFilters,
} from './change-log';

// Knowledge base types
export type {
  ModuleSystem,
  ModuleType,
  RiskLevel as KBRiskLevel,
  ModuleFrontmatter,
  ModuleContent,
  BusinessRule,
  BusinessRulesFile,
  GlossaryTerm,
  SearchResult,
  KnowledgeBaseStats,
  KnowledgeBaseMeta,
} from './knowledge-base';
