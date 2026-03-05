export interface MockFigmaFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnail?: string;
}

export interface MockFigmaFile {
  fileKey: string;
  fileName: string;
  frames: MockFigmaFrame[];
}

// Mock Figma files by URL patterns
export const mockFigmaFiles: Record<string, MockFigmaFile> = {
  'multi-stop-booking': {
    fileKey: 'abc123xyz',
    fileName: 'B2B Portal — Multi-stop Booking',
    frames: [
      {
        id: 'frame-1',
        name: 'Booking Form (Multi-stop)',
        width: 1440,
        height: 900,
      },
      {
        id: 'frame-2',
        name: 'Add Stop Modal',
        width: 480,
        height: 640,
      },
      {
        id: 'frame-3',
        name: 'Confirmation Popup',
        width: 480,
        height: 400,
      },
      {
        id: 'frame-4',
        name: 'Fare Breakdown Card',
        width: 360,
        height: 280,
      },
    ],
  },
  'ride-reminders': {
    fileKey: 'def456uvw',
    fileName: 'B2C App — Ride Reminders',
    frames: [
      {
        id: 'frame-1',
        name: 'Push Notification (30 min)',
        width: 375,
        height: 200,
      },
      {
        id: 'frame-2',
        name: 'Push Notification (10 min)',
        width: 375,
        height: 200,
      },
      {
        id: 'frame-3',
        name: 'Settings — Notification Preferences',
        width: 375,
        height: 812,
      },
    ],
  },
  'bulk-import': {
    fileKey: 'ghi789rst',
    fileName: 'Admin Panel — User Import',
    frames: [
      {
        id: 'frame-1',
        name: 'Upload Screen',
        width: 1440,
        height: 900,
      },
      {
        id: 'frame-2',
        name: 'Validation Errors',
        width: 1440,
        height: 900,
      },
      {
        id: 'frame-3',
        name: 'Import Progress',
        width: 480,
        height: 320,
      },
      {
        id: 'frame-4',
        name: 'Import Results',
        width: 1440,
        height: 900,
      },
    ],
  },
  'earnings-breakdown': {
    fileKey: 'jkl012mno',
    fileName: 'Driver App — Earnings',
    frames: [
      {
        id: 'frame-1',
        name: 'Earnings Dashboard',
        width: 375,
        height: 812,
      },
      {
        id: 'frame-2',
        name: 'Daily Breakdown',
        width: 375,
        height: 812,
      },
      {
        id: 'frame-3',
        name: 'Export Options',
        width: 375,
        height: 400,
      },
    ],
  },
  'surge-pricing': {
    fileKey: 'pqr345stu',
    fileName: 'Pricing Engine — Surge UI',
    frames: [
      {
        id: 'frame-1',
        name: 'Surge Notification (Rider)',
        width: 375,
        height: 600,
      },
      {
        id: 'frame-2',
        name: 'Surge Map Overlay',
        width: 375,
        height: 812,
      },
    ],
  },
};

export function extractMockFigmaFrames(figmaUrl: string): MockFigmaFrame[] {
  // Parse the URL to determine which mock file to return
  const urlLower = figmaUrl.toLowerCase();

  if (urlLower.includes('multi-stop') || urlLower.includes('booking')) {
    return mockFigmaFiles['multi-stop-booking'].frames;
  }

  if (urlLower.includes('reminder') || urlLower.includes('notification')) {
    return mockFigmaFiles['ride-reminders'].frames;
  }

  if (urlLower.includes('import') || urlLower.includes('bulk')) {
    return mockFigmaFiles['bulk-import'].frames;
  }

  if (urlLower.includes('earning') || urlLower.includes('driver')) {
    return mockFigmaFiles['earnings-breakdown'].frames;
  }

  if (urlLower.includes('surge') || urlLower.includes('pricing')) {
    return mockFigmaFiles['surge-pricing'].frames;
  }

  // Default: return generic frames
  return [
    {
      id: 'frame-1',
      name: 'Main Screen',
      width: 1440,
      height: 900,
    },
    {
      id: 'frame-2',
      name: 'Detail View',
      width: 1440,
      height: 900,
    },
    {
      id: 'frame-3',
      name: 'Mobile Variant',
      width: 375,
      height: 812,
    },
  ];
}
