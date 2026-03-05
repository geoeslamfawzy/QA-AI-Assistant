import { NextRequest, NextResponse } from 'next/server';
import { readModuleById } from '@/lib/knowledge-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;

    if (!moduleId) {
      return NextResponse.json(
        { success: false, error: 'Module ID is required' },
        { status: 400 }
      );
    }

    const module = await readModuleById(moduleId);

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      module,
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
