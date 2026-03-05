// Knowledge Base Types

export type ModuleSystem = 'B2B Corporate Portal' | 'Admin Panel' | 'B2C WebApp';

export type ModuleType =
  | 'module'
  | 'atomic_rule'
  | 'state_machine'
  | 'cross_dependency'
  | 'financial_logic';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ModuleFrontmatter {
  id: string;
  title: string;
  system: ModuleSystem;
  type: ModuleType;
  tags: string[];
  dependencies: string[];
  keywords?: string[];
  related?: string[];
  version: string;
  last_updated: string;
  risk_level?: RiskLevel;
}

export interface ModuleContent {
  id: string;
  frontmatter: ModuleFrontmatter;
  content: string;
  filePath: string;
}

export interface BusinessRule {
  id: string;
  rule: string;
  module: string;
  context: string;
  enforcement: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BusinessRulesFile {
  module: string;
  rules: BusinessRule[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  aliases?: string[];
  module?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  module: string;
  type: ModuleType;
  filePath: string;
  score: number;
  matches?: string[];
}

export interface KnowledgeBaseStats {
  totalModules: number;
  totalRules: number;
  lastUpdated: string;
  version: string;
  bySystem: Record<ModuleSystem, number>;
  byType: Record<ModuleType, number>;
}

export interface KnowledgeBaseMeta {
  version: string;
  lastUpdated: string;
  moduleCount: number;
  ruleCount: number;
}
