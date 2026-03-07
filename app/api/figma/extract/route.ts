import { NextRequest, NextResponse } from 'next/server';
import {
  parseFigmaUrl,
  fetchFigmaFile,
  fetchFigmaNodes,
  fetchFigmaImages,
  isFigmaConfigured,
} from '@/lib/figma/client';

export async function POST(request: NextRequest) {
  try {
    const { url, figmaUrl, fileKey: providedFileKey, includeThumbnails = false } = await request.json();
    const figmaInput = url || figmaUrl;

    if (!isFigmaConfigured()) {
      return NextResponse.json(
        { error: 'Figma not configured. Add FIGMA_ACCESS_TOKEN to .env.local', _isMock: true },
        { status: 503 }
      );
    }

    // Parse the Figma URL to get file key
    let fileKey = providedFileKey;
    let nodeId: string | undefined;

    if (figmaInput) {
      const parsed = parseFigmaUrl(figmaInput);
      if (!parsed) {
        return NextResponse.json({ error: 'Invalid Figma URL' }, { status: 400 });
      }
      fileKey = parsed.fileKey;
      nodeId = parsed.nodeId;
    }

    if (!fileKey) {
      return NextResponse.json({ error: 'Figma URL or fileKey is required' }, { status: 400 });
    }

    // Fetch frames
    let frames;
    let fileName = 'Untitled';
    if (nodeId) {
      const nodeIds = nodeId.split(',');
      const result = await fetchFigmaNodes(fileKey, nodeIds);
      frames = result.nodes;
    } else {
      const result = await fetchFigmaFile(fileKey);
      frames = result.frames;
      fileName = result.fileName;
    }

    // Fetch thumbnails only when explicitly requested (reduces API calls)
    let thumbnails: Record<string, string> = {};
    if (includeThumbnails && frames.length > 0) {
      const frameIds = frames.slice(0, 20).map((f) => f.id); // Limit to 20
      try {
        thumbnails = await fetchFigmaImages(fileKey, frameIds);
      } catch {
        // Thumbnails are optional — don't fail if they can't be fetched
      }
    }

    // Merge thumbnails into frames
    const framesWithThumbnails = frames.map((f) => ({
      ...f,
      thumbnailUrl: thumbnails[f.id] || null,
    }));

    return NextResponse.json({
      success: true,
      fileKey,
      fileName,
      frames: framesWithThumbnails,
      _isMock: false,
    });
  } catch (error: any) {
    console.error('Error extracting Figma frames:', error);
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}
