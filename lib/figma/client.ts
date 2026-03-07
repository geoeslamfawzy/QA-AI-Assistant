/**
 * Figma REST API Client
 * Docs: https://www.figma.com/developers/api
 * Auth: Personal Access Token in X-Figma-Token header
 */

function getFigmaConfig(): { accessToken: string } | null {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token || token === '' || token.includes('REPLACE')) return null;
  return { accessToken: token };
}

export function isFigmaConfigured(): boolean {
  return getFigmaConfig() !== null;
}

async function figmaGet(path: string): Promise<any> {
  const config = getFigmaConfig();
  if (!config) throw new Error('Figma not configured. Add FIGMA_ACCESS_TOKEN to .env.local');

  const response = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': config.accessToken },
  });

  // Handle rate limiting — wait and retry once
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('retry-after') || '30', 10);
    const waitTime = Math.min(retryAfter, 60) * 1000;
    console.log(`[Figma] Rate limited. Waiting ${waitTime / 1000}s before retry...`);
    await new Promise((r) => setTimeout(r, waitTime));

    const retry = await fetch(`https://api.figma.com/v1${path}`, {
      headers: { 'X-Figma-Token': config.accessToken },
    });

    if (!retry.ok) {
      throw new Error(`Figma API rate limit. Please wait a moment and try again.`);
    }
    return retry.json();
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Figma API ${response.status}: ${text}`);
  }

  return response.json();
}

/**
 * Parse a Figma URL to extract file key and optional node ID.
 * Supports formats:
 *   https://www.figma.com/file/ABC123/FileName
 *   https://www.figma.com/design/ABC123/FileName
 *   https://www.figma.com/file/ABC123/FileName?node-id=1-2
 *   https://www.figma.com/proto/ABC123/FileName
 */
export function parseFigmaUrl(url: string): { fileKey: string; nodeId?: string } | null {
  const match = url.match(/figma\.com\/(file|design|proto|board)\/([a-zA-Z0-9]+)/);
  if (!match) return null;

  const fileKey = match[2];
  const nodeIdMatch = url.match(/node-id=([^&]+)/);
  const nodeId = nodeIdMatch ? decodeURIComponent(nodeIdMatch[1]) : undefined;

  return { fileKey, nodeId };
}

/**
 * Fetch file metadata and frames from Figma.
 */
export async function fetchFigmaFile(fileKey: string): Promise<{
  fileName: string;
  frames: { id: string; name: string; width: number; height: number; type: string }[];
}> {
  const data = await figmaGet(`/files/${fileKey}?depth=2`);

  const frames: { id: string; name: string; width: number; height: number; type: string }[] = [];

  function extractFrames(node: any) {
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      frames.push({
        id: node.id,
        name: node.name,
        width: Math.round(node.absoluteBoundingBox?.width || 0),
        height: Math.round(node.absoluteBoundingBox?.height || 0),
        type: node.type,
      });
    }
    if (node.children) {
      node.children.forEach(extractFrames);
    }
  }

  if (data.document) {
    extractFrames(data.document);
  }

  return {
    fileName: data.name || 'Untitled',
    frames,
  };
}

/**
 * Fetch specific nodes from a Figma file.
 */
export async function fetchFigmaNodes(fileKey: string, nodeIds: string[]): Promise<{
  nodes: { id: string; name: string; width: number; height: number; type: string }[];
}> {
  const ids = nodeIds.join(',');
  const data = await figmaGet(`/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`);

  const nodes = Object.entries(data.nodes || {}).map(([id, nodeData]: [string, any]) => {
    const doc = nodeData.document;
    return {
      id,
      name: doc?.name || 'Unknown',
      width: Math.round(doc?.absoluteBoundingBox?.width || 0),
      height: Math.round(doc?.absoluteBoundingBox?.height || 0),
      type: doc?.type || 'UNKNOWN',
    };
  });

  return { nodes };
}

/**
 * Get image thumbnails for specific nodes.
 */
export async function fetchFigmaImages(
  fileKey: string,
  nodeIds: string[],
  format: string = 'png',
  scale: number = 2
): Promise<Record<string, string>> {
  const ids = nodeIds.join(',');
  const data = await figmaGet(`/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=${format}&scale=${scale}`);
  return data.images || {};
}

/**
 * Test the Figma connection.
 */
export async function testFigmaConnection(): Promise<{
  connected: boolean;
  user?: string;
  error?: string;
}> {
  const config = getFigmaConfig();
  if (!config) {
    return { connected: false, error: 'FIGMA_ACCESS_TOKEN not set in .env.local' };
  }

  try {
    const data = await figmaGet('/me');
    return { connected: true, user: data.email || data.handle };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}
