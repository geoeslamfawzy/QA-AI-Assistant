import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

// Default settings
const defaultSettings = {
  jira: {
    domain: '',
    apiToken: '',
    email: '',
  },
  figma: {
    accessToken: '',
  },
  behavior: {
    autoFetchFigma: true,
    includeProjectContext: true,
    autoTagComments: true,
    includeScreenshots: false,
  },
  activeModules: [
    'B2B Corporate Portal',
    'B2C Web Interface',
    'Admin Panel',
  ],
};

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return defaults
    return defaultSettings;
  }
}

async function writeSettings(settings: typeof defaultSettings) {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Merge with existing settings
    const currentSettings = await readSettings();
    const updatedSettings = {
      ...currentSettings,
      ...body,
      jira: {
        ...currentSettings.jira,
        ...(body.jira || {}),
      },
      figma: {
        ...currentSettings.figma,
        ...(body.figma || {}),
      },
      behavior: {
        ...currentSettings.behavior,
        ...(body.behavior || {}),
      },
    };

    await writeSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
