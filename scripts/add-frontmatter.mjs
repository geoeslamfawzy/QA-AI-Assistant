import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename, dirname } from 'path';

const KB_PATH = './knowledge-base';

// File type mappings
const typeMap = {
  modules: 'module',
  atomic_rules: 'atomic_rule',
  state_machines: 'state_machine',
  cross_dependencies: 'cross_dependency',
  financial_logic: 'financial_logic',
};

// System mappings based on content
function inferSystem(content, id) {
  if (id.includes('b2b') || content.includes('B2B Corporate Portal')) {
    return 'B2B Corporate Portal';
  }
  if (id.includes('admin') || content.includes('Admin Panel')) {
    return 'Admin Panel';
  }
  if (id.includes('b2c') || content.includes('B2C')) {
    return 'B2C WebApp';
  }
  if (id.includes('driver')) {
    return 'Admin Panel';
  }
  if (id.includes('trip')) {
    return 'B2B Corporate Portal';
  }
  return 'B2B Corporate Portal';
}

// Extract keywords from content
function extractKeywords(content, title) {
  const words = content.toLowerCase().split(/\W+/);
  const keywordCandidates = new Set();

  // Add words from title
  title.toLowerCase().split(/\W+/).forEach(w => {
    if (w.length > 3) keywordCandidates.add(w);
  });

  // Common QA-relevant terms
  const relevantTerms = [
    'trip', 'ride', 'driver', 'rider', 'booking', 'payment', 'wallet', 'budget',
    'enterprise', 'admin', 'user', 'group', 'program', 'cancel', 'refund',
    'invoice', 'commission', 'discount', 'cashback', 'referral', 'challenge',
    'gift', 'card', 'status', 'state', 'lifecycle', 'pending', 'active',
    'validation', 'rule', 'constraint', 'limit', 'fee', 'fare', 'surge',
    'auth', 'login', 'register', 'otp', 'sso', 'country', 'city'
  ];

  words.forEach(w => {
    if (relevantTerms.includes(w)) keywordCandidates.add(w);
  });

  return Array.from(keywordCandidates).slice(0, 10);
}

// Extract related modules from content
function extractRelated(content) {
  const related = [];
  const patterns = [
    /see ([A-Z]{2,3}-\d{3})/gi,
    /\(([a-z-]+) module\)/gi,
    /references? ([a-z-]+)/gi,
  ];

  patterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && !related.includes(match[1].toLowerCase())) {
        related.push(match[1].toLowerCase());
      }
    }
  });

  return related.slice(0, 5);
}

// Determine risk level
function inferRiskLevel(content, type) {
  const lowRisk = ['financial', 'commission'];
  const highRisk = ['cancel', 'payment', 'auth', 'security'];
  const criticalRisk = ['delete', 'remove', 'destroy'];

  const lowerContent = content.toLowerCase();

  if (criticalRisk.some(term => lowerContent.includes(term))) return 'high';
  if (highRisk.some(term => lowerContent.includes(term))) return 'high';
  if (type === 'atomic_rule') return 'medium';
  return 'low';
}

async function processFile(filePath, type) {
  const content = await readFile(filePath, 'utf-8');

  // Check if file already has frontmatter
  if (content.startsWith('---')) {
    console.log(`Skipping ${filePath} - already has frontmatter`);
    return;
  }

  const fileName = basename(filePath, '.md');
  const id = fileName;

  // Extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : fileName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const system = inferSystem(content, id);
  const keywords = extractKeywords(content, title);
  const related = extractRelated(content);
  const riskLevel = inferRiskLevel(content, type);

  const frontmatter = `---
id: "${id}"
title: "${title}"
system: "${system}"
type: "${typeMap[type] || 'module'}"
tags: [${keywords.map(k => `"${k}"`).join(', ')}]
dependencies: []
keywords: [${keywords.map(k => `"${k}"`).join(', ')}]
related: [${related.map(r => `"${r}"`).join(', ')}]
version: "1.0"
last_updated: "${new Date().toISOString().split('T')[0]}"
risk_level: "${riskLevel}"
---

`;

  const newContent = frontmatter + content;
  await writeFile(filePath, newContent, 'utf-8');
  console.log(`Processed: ${filePath}`);
}

async function processDirectory(dir) {
  const type = basename(dir);

  try {
    const files = await readdir(dir);

    for (const file of files) {
      if (file.endsWith('.md')) {
        await processFile(join(dir, file), type);
      }
    }
  } catch (err) {
    console.error(`Error processing ${dir}:`, err.message);
  }
}

async function main() {
  const dirs = ['modules', 'atomic_rules', 'state_machines', 'cross_dependencies', 'financial_logic'];

  for (const dir of dirs) {
    const fullPath = join(KB_PATH, dir);
    console.log(`\nProcessing ${fullPath}...`);
    await processDirectory(fullPath);
  }

  console.log('\nFrontmatter added to all files!');
}

main().catch(console.error);
