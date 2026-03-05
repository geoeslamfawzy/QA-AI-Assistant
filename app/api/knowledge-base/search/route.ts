import { NextRequest, NextResponse } from 'next/server';
import { search, suggest } from '@/lib/knowledge-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, system, type, limit = 10 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const results = await search(query, { system, type, limit });

    return NextResponse.json({
      success: true,
      results,
      query,
    });
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter q is required' },
        { status: 400 }
      );
    }

    const suggestions = await suggest(query, limit);

    return NextResponse.json({
      success: true,
      suggestions,
      query,
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
