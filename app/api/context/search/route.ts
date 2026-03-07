import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const KNOWLEDGE_BASE_PATH = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';

interface SearchResult {
  slug: string;
  title: string;
  source: 'jira' | 'manual';
  matches: string[];
  ticketCount?: number;
}

function extractSnippet(content: string, query: string, contextLength = 50): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) return '';

  const start = Math.max(0, index - contextLength);
  const end = Math.min(content.length, index + query.length + contextLength);

  let snippet = content.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}

async function searchInDirectory(
  directory: string,
  source: 'jira' | 'manual',
  query: string
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const dirPath = join(KNOWLEDGE_BASE_PATH, directory);
  const lowerQuery = query.toLowerCase();

  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      if (!file.endsWith('.md') || file.startsWith('_')) continue;

      const filePath = join(dirPath, file);
      const slug = file.replace('.md', '');

      try {
        const rawContent = await readFile(filePath, 'utf-8');
        const { data, content } = matter(rawContent);

        const title = data.title || slug;
        const fullContent = title + ' ' + content;
        const lowerFullContent = fullContent.toLowerCase();

        if (lowerFullContent.includes(lowerQuery)) {
          const matches: string[] = [];

          // Check title match
          if (title.toLowerCase().includes(lowerQuery)) {
            matches.push(`Title: ${title}`);
          }

          // Find content matches
          const lines = content.split('\n');
          for (const line of lines) {
            if (line.toLowerCase().includes(lowerQuery) && line.trim()) {
              const snippet = extractSnippet(line, query, 40);
              if (snippet && !matches.includes(snippet)) {
                matches.push(snippet);
                if (matches.length >= 3) break;
              }
            }
          }

          results.push({
            slug,
            title,
            source,
            matches: matches.slice(0, 3),
            ticketCount: source === 'jira' ? data.ticket_count : undefined,
          });
        }
      } catch (err) {
        console.error(`Error searching module ${file}:`, err);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        message: 'Query must be at least 2 characters',
      });
    }

    // Search in both directories
    const [jiraResults, manualResults] = await Promise.all([
      searchInDirectory('jira-context', 'jira', query),
      searchInDirectory('modules', 'manual', query),
    ]);

    const allResults = [...jiraResults, ...manualResults].sort((a, b) => {
      // Prioritize title matches
      const aHasTitleMatch = a.matches.some((m) => m.startsWith('Title:'));
      const bHasTitleMatch = b.matches.some((m) => m.startsWith('Title:'));

      if (aHasTitleMatch && !bHasTitleMatch) return -1;
      if (!aHasTitleMatch && bHasTitleMatch) return 1;

      return a.title.localeCompare(b.title);
    });

    return NextResponse.json({
      success: true,
      results: allResults,
      totalCount: allResults.length,
    });
  } catch (err) {
    console.error('Error searching context:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to search context' },
      { status: 500 }
    );
  }
}
