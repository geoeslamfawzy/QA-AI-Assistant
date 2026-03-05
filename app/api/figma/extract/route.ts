import { NextRequest, NextResponse } from 'next/server';

// Mock Figma frames
const mockFrames = [
  {
    id: 'frame-1',
    name: 'Booking Form (Multi-stop)',
    width: 1440,
    height: 900,
    thumbnailUrl: null,
  },
  {
    id: 'frame-2',
    name: 'Add Stop Modal',
    width: 480,
    height: 640,
    thumbnailUrl: null,
  },
  {
    id: 'frame-3',
    name: 'Confirmation Popup',
    width: 480,
    height: 320,
    thumbnailUrl: null,
  },
  {
    id: 'frame-4',
    name: 'Ride Summary',
    width: 1440,
    height: 800,
    thumbnailUrl: null,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Figma URL is required' },
        { status: 400 }
      );
    }

    // Validate that it looks like a Figma URL
    if (!url.includes('figma.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Figma URL' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, this would:
    // 1. Parse the Figma file ID and node ID from the URL
    // 2. Authenticate with Figma API using stored access token
    // 3. Fetch the file/frame details
    // 4. Get thumbnail images for each frame

    // Return random subset of mock frames
    const frameCount = Math.floor(Math.random() * 3) + 2; // 2-4 frames
    const frames = mockFrames.slice(0, frameCount);

    return NextResponse.json({
      success: true,
      frames,
      fileId: 'mock-file-id',
      fileName: 'B2B Portal - Booking Flow',
    });
  } catch (error) {
    console.error('Error extracting Figma frames:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
