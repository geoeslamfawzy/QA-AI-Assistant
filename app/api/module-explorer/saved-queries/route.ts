/**
 * /api/module-explorer/saved-queries
 *
 * GET: List all saved queries
 * POST: Save a new query
 * DELETE: Delete a query by ID (via query param)
 *
 * Stores queries in knowledge-base/saved-queries.json
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const KB_DIR = process.env.KNOWLEDGE_BASE_PATH || './knowledge-base';
const QUERIES_FILE = path.join(KB_DIR, 'saved-queries.json');

export interface SavedQuery {
  id: string;
  name: string;
  jql: string;
  slug: string;
  lastRun: string;
  ticketCount: number;
  hasDocument: boolean;
}

/**
 * Load saved queries from file.
 */
function loadQueries(): SavedQuery[] {
  try {
    if (fs.existsSync(QUERIES_FILE)) {
      const data = fs.readFileSync(QUERIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Module Explorer] Failed to load saved queries:', err);
  }
  return [];
}

/**
 * Save queries to file.
 */
function saveQueries(queries: SavedQuery[]): void {
  fs.mkdirSync(KB_DIR, { recursive: true });
  fs.writeFileSync(QUERIES_FILE, JSON.stringify(queries, null, 2));
}

/**
 * Check if a module document exists.
 */
function checkDocumentExists(slug: string): boolean {
  const filePath = path.join(KB_DIR, 'modules', `${slug}.md`);
  return fs.existsSync(filePath);
}

/**
 * GET: List all saved queries
 */
export async function GET() {
  try {
    const queries = loadQueries();

    // Update hasDocument status for each query
    const updatedQueries = queries.map((q) => ({
      ...q,
      hasDocument: checkDocumentExists(q.slug),
    }));

    return NextResponse.json({
      success: true,
      queries: updatedQueries,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Module Explorer Saved Queries GET Error]', err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Save a new query or update existing
 */
export async function POST(request: NextRequest) {
  try {
    const { name, jql, slug, ticketCount } = await request.json();

    if (!name || !jql) {
      return NextResponse.json(
        { success: false, error: 'Name and JQL are required' },
        { status: 400 }
      );
    }

    const queries = loadQueries();

    // Generate slug if not provided
    const querySlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Check if query with same name exists
    const existingIndex = queries.findIndex(
      (q) => q.name.toLowerCase() === name.toLowerCase()
    );

    const newQuery: SavedQuery = {
      id: existingIndex >= 0 ? queries[existingIndex].id : `query-${Date.now()}`,
      name,
      jql,
      slug: querySlug,
      lastRun: new Date().toISOString(),
      ticketCount: ticketCount || 0,
      hasDocument: checkDocumentExists(querySlug),
    };

    if (existingIndex >= 0) {
      // Update existing
      queries[existingIndex] = newQuery;
    } else {
      // Add new
      queries.push(newQuery);
    }

    saveQueries(queries);

    return NextResponse.json({
      success: true,
      query: newQuery,
      updated: existingIndex >= 0,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Module Explorer Saved Queries POST Error]', err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a saved query by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Query ID is required' },
        { status: 400 }
      );
    }

    const queries = loadQueries();
    const filteredQueries = queries.filter((q) => q.id !== id);

    if (filteredQueries.length === queries.length) {
      return NextResponse.json(
        { success: false, error: 'Query not found' },
        { status: 404 }
      );
    }

    saveQueries(filteredQueries);

    return NextResponse.json({
      success: true,
      deleted: id,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Module Explorer Saved Queries DELETE Error]', err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
