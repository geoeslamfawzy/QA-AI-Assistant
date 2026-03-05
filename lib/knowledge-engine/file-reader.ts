import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import matter from 'gray-matter';
import type { ModuleContent, ModuleFrontmatter, KnowledgeBaseMeta } from '@/lib/types/knowledge-base';
import type { ChangeLogEntry } from '@/lib/types/change-log';

const KNOWLEDGE_BASE_PATH = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

const DIRECTORIES = [
  'modules',
  'atomic_rules',
  'state_machines',
  'cross_dependencies',
  'financial_logic',
] as const;

/**
 * Read and parse a single markdown file with frontmatter
 */
export async function readModuleFile(filePath: string): Promise<ModuleContent> {
  const rawContent = await readFile(filePath, 'utf-8');
  const { data, content } = matter(rawContent);

  const frontmatter = data as ModuleFrontmatter;

  return {
    id: frontmatter.id,
    frontmatter,
    content,
    filePath,
  };
}

/**
 * Read all module files from a specific directory
 */
export async function readDirectoryModules(
  directory: string
): Promise<ModuleContent[]> {
  const dirPath = join(KNOWLEDGE_BASE_PATH, directory);
  const modules: ModuleContent[] = [];

  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = join(dirPath, file);
        const module = await readModuleFile(filePath);
        modules.push(module);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return modules;
}

/**
 * Read all knowledge base files
 */
export async function readAllModules(): Promise<ModuleContent[]> {
  const allModules: ModuleContent[] = [];

  for (const dir of DIRECTORIES) {
    const modules = await readDirectoryModules(dir);
    allModules.push(...modules);
  }

  return allModules;
}

/**
 * Read a specific module by ID
 */
export async function readModuleById(id: string): Promise<ModuleContent | null> {
  for (const dir of DIRECTORIES) {
    const dirPath = join(KNOWLEDGE_BASE_PATH, dir);

    try {
      const files = await readdir(dirPath);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = join(dirPath, file);
          const module = await readModuleFile(filePath);

          if (module.id === id) {
            return module;
          }
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Read knowledge base metadata
 */
export async function readKnowledgeBaseMeta(): Promise<KnowledgeBaseMeta> {
  const metaPath = join(KNOWLEDGE_BASE_PATH, 'meta.json');

  try {
    const content = await readFile(metaPath, 'utf-8');
    return JSON.parse(content) as KnowledgeBaseMeta;
  } catch {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      moduleCount: 0,
      ruleCount: 0,
    };
  }
}

/**
 * Get modules by system (B2B, Admin, B2C)
 */
export async function getModulesBySystem(
  system: string
): Promise<ModuleContent[]> {
  const allModules = await readAllModules();
  return allModules.filter(
    (m) => m.frontmatter.system.toLowerCase().includes(system.toLowerCase())
  );
}

/**
 * Get modules by type
 */
export async function getModulesByType(
  type: string
): Promise<ModuleContent[]> {
  const allModules = await readAllModules();
  return allModules.filter((m) => m.frontmatter.type === type);
}

/**
 * List all module IDs
 */
export async function listModuleIds(): Promise<string[]> {
  const allModules = await readAllModules();
  return allModules.map((m) => m.id);
}

/**
 * Get module dependencies (modules that this module depends on)
 */
export async function getModuleDependencies(
  moduleId: string
): Promise<ModuleContent[]> {
  const module = await readModuleById(moduleId);
  if (!module) return [];

  const dependencies: ModuleContent[] = [];
  const depIds = module.frontmatter.dependencies || [];

  for (const depId of depIds) {
    const dep = await readModuleById(depId);
    if (dep) {
      dependencies.push(dep);
    }
  }

  return dependencies;
}

/**
 * Get related modules
 */
export async function getRelatedModules(
  moduleId: string
): Promise<ModuleContent[]> {
  const module = await readModuleById(moduleId);
  if (!module) return [];

  const related: ModuleContent[] = [];
  const relatedIds = module.frontmatter.related || [];

  for (const relId of relatedIds) {
    const rel = await readModuleById(relId);
    if (rel) {
      related.push(rel);
    }
  }

  return related;
}

/**
 * Write module content to file
 */
export async function writeModuleContent(
  moduleId: string,
  content: string
): Promise<void> {
  const module = await readModuleById(moduleId);

  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }

  // Backup the current file before writing
  const backupDir = join(KNOWLEDGE_BASE_PATH, 'backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(backupDir, `${moduleId}-${timestamp}.md`);

  try {
    await mkdir(backupDir, { recursive: true });
    const currentContent = await readFile(module.filePath, 'utf-8');
    await writeFile(backupPath, currentContent, 'utf-8');
  } catch (error) {
    console.warn('Failed to create backup:', error);
  }

  // Write the new content
  await writeFile(module.filePath, content, 'utf-8');

  // Update meta.json last updated timestamp
  const metaPath = join(KNOWLEDGE_BASE_PATH, 'meta.json');
  try {
    const meta = await readKnowledgeBaseMeta();
    meta.lastUpdated = new Date().toISOString();
    await writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
  } catch {
    console.warn('Failed to update meta.json');
  }
}

/**
 * Add an entry to the change log
 */
export async function addChangeLogEntry(
  entry: Omit<ChangeLogEntry, 'id' | 'timestamp'>
): Promise<ChangeLogEntry> {
  const changeLogDir = join(process.cwd(), 'change-log');
  const logPath = join(changeLogDir, 'log.json');

  // Ensure directory exists
  await mkdir(changeLogDir, { recursive: true });

  // Read existing log
  let log: ChangeLogEntry[] = [];
  try {
    const content = await readFile(logPath, 'utf-8');
    log = JSON.parse(content);
  } catch {
    // File doesn't exist yet
  }

  // Create new entry
  const newEntry: ChangeLogEntry = {
    ...entry,
    id: `CL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  // Add to beginning of log
  log.unshift(newEntry);

  // Write back
  await writeFile(logPath, JSON.stringify(log, null, 2), 'utf-8');

  return newEntry;
}

/**
 * Read change log entries
 */
export async function readChangeLog(limit = 50): Promise<ChangeLogEntry[]> {
  const logPath = join(process.cwd(), 'change-log', 'log.json');

  try {
    const content = await readFile(logPath, 'utf-8');
    const log: ChangeLogEntry[] = JSON.parse(content);
    return log.slice(0, limit);
  } catch {
    return [];
  }
}
