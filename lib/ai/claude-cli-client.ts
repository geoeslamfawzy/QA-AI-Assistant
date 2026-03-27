/**
 * Claude CLI Client
 *
 * Calls Claude via the CLI tool (claude) installed on the machine.
 * Uses the user's existing Claude subscription — no API key needed.
 *
 * Prerequisites:
 * - Claude CLI installed: npm install -g @anthropic-ai/claude-code
 * - User logged in: claude login
 * - Available models: claude-haiku-4-5-20251001, claude-sonnet-4-6, claude-opus-4-6
 *
 * Tested working syntax:
 *   claude -p --model claude-haiku-4-5-20251001 "prompt"
 *   echo "prompt" | claude -p --model claude-haiku-4-5-20251001
 */

import { spawn } from 'child_process';

export type ClaudeModel = 'claude-opus-4-6' | 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001';

export interface ClaudeCliOptions {
  model?: ClaudeModel;
  maxTokens?: number;
  timeout?: number; // milliseconds, default 5 minutes
}

export interface ClaudeCliProgress {
  status:
    | 'idle'
    | 'starting'
    | 'running'
    | 'completed'
    | 'failed'
    | 'permission-required';
  output: string;
  permissionPrompt?: string;
  error?: string;
  startedAt?: string;
  model?: string;
}

// In-memory progress tracker
let currentProgress: ClaudeCliProgress = { status: 'idle', output: '' };

export function getClaudeCliProgress(): ClaudeCliProgress {
  return currentProgress;
}

export function resetClaudeCliProgress() {
  currentProgress = { status: 'idle', output: '' };
}

/**
 * Check if Claude CLI is installed and accessible.
 */
export async function isClaudeCliAvailable(): Promise<{
  available: boolean;
  version?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    const proc = spawn('claude', ['--version'], {
      timeout: 10000,
      shell: true,
    });

    let output = '';
    proc.stdout?.on('data', (data) => {
      output += data.toString();
    });
    proc.stderr?.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ available: true, version: output.trim() });
      } else {
        resolve({ available: false, error: output || 'Claude CLI not found' });
      }
    });

    proc.on('error', () => {
      resolve({
        available: false,
        error:
          'Claude CLI not installed. Install with: npm install -g @anthropic-ai/claude-code',
      });
    });
  });
}

/**
 * Call Claude CLI with a prompt.
 *
 * Always pipes the prompt via stdin to avoid shell argument length limits
 * and escaping issues. Uses -p (--print) for non-interactive mode.
 *
 * Includes explicit timeout with process kill.
 */
export async function callClaudeCli(
  prompt: string,
  options: ClaudeCliOptions = {}
): Promise<string> {
  const model = options.model || 'claude-sonnet-4-6';
  const timeout = options.timeout || 300000; // 5 minutes default

  return new Promise((resolve, reject) => {
    let settled = false;

    currentProgress = {
      status: 'starting',
      output: '',
      model,
      startedAt: new Date().toISOString(),
    };

    // Use -p (print mode) and --model
    // Do NOT pass the prompt as an argument — pipe via stdin instead
    const args = ['-p', '--model', model];

    console.log(`[Claude CLI] Starting with model: ${model}`);
    console.log(`[Claude CLI] Prompt length: ${prompt.length} chars`);

    const proc = spawn('claude', args, {
      // No shell: true — avoids shell escaping issues entirely
      // spawn will find 'claude' on PATH
      shell: false,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    // Explicit timeout with process kill
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      console.error('[Claude CLI] Timeout — killing process');
      proc.kill('SIGTERM');
      setTimeout(() => {
        try { proc.kill('SIGKILL'); } catch { /* already dead */ }
      }, 5000);
      currentProgress.status = 'failed';
      currentProgress.error = `Claude CLI timed out after ${Math.round(timeout / 1000)}s`;
      reject(new Error(currentProgress.error));
    }, timeout);

    proc.stdout?.on('data', (data) => {
      const chunk = data.toString();
      stdout += chunk;
      currentProgress.status = 'running';
      currentProgress.output = stdout;
    });

    proc.stderr?.on('data', (data) => {
      const chunk = data.toString();
      stderr += chunk;

      // Check if CLI is asking for permission
      if (
        chunk.toLowerCase().includes('permission') ||
        chunk.toLowerCase().includes('allow') ||
        chunk.toLowerCase().includes('approve') ||
        chunk.includes('y/n') ||
        chunk.includes('Y/N')
      ) {
        currentProgress.status = 'permission-required';
        currentProgress.permissionPrompt = chunk;
      }
    });

    // Write prompt to stdin, then close stdin to signal EOF
    proc.stdin?.write(prompt);
    proc.stdin?.end();

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;

      if (code === 0 && stdout.trim()) {
        currentProgress.status = 'completed';
        currentProgress.output = stdout;
        console.log(`[Claude CLI] Completed. Output: ${stdout.length} chars`);
        resolve(stdout.trim());
      } else {
        const error = stderr || `Claude CLI exited with code ${code}`;
        currentProgress.status = 'failed';
        currentProgress.error = error;
        console.error(`[Claude CLI] Failed:`, error);
        reject(new Error(error));
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;

      currentProgress.status = 'failed';
      currentProgress.error = err.message;

      // Common: spawn ENOENT means 'claude' not found on PATH without shell
      // Retry with shell: true for PATH resolution
      if (err.message.includes('ENOENT')) {
        console.log('[Claude CLI] Retrying with shell: true for PATH resolution...');
        callClaudeCliWithShell(prompt, options).then(resolve).catch(reject);
        return;
      }

      reject(new Error(`Claude CLI error: ${err.message}`));
    });
  });
}

/**
 * Fallback: call with shell: true if direct spawn can't find the binary.
 * Still pipes via stdin to avoid escaping issues.
 */
async function callClaudeCliWithShell(
  prompt: string,
  options: ClaudeCliOptions = {}
): Promise<string> {
  const model = options.model || 'claude-sonnet-4-6';
  const timeout = options.timeout || 300000;

  return new Promise((resolve, reject) => {
    let settled = false;

    const args = ['-p', '--model', model];

    const proc = spawn('claude', args, {
      shell: true,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      console.error('[Claude CLI] Shell fallback timeout — killing process');
      proc.kill('SIGTERM');
      setTimeout(() => {
        try { proc.kill('SIGKILL'); } catch { /* already dead */ }
      }, 5000);
      currentProgress.status = 'failed';
      currentProgress.error = `Claude CLI timed out after ${Math.round(timeout / 1000)}s`;
      reject(new Error(currentProgress.error));
    }, timeout);

    proc.stdout?.on('data', (data) => {
      const chunk = data.toString();
      stdout += chunk;
      currentProgress.status = 'running';
      currentProgress.output = stdout;
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Pipe prompt via stdin
    proc.stdin?.write(prompt);
    proc.stdin?.end();

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;

      if (code === 0 && stdout.trim()) {
        currentProgress.status = 'completed';
        currentProgress.output = stdout;
        console.log(`[Claude CLI] Shell fallback completed. Output: ${stdout.length} chars`);
        resolve(stdout.trim());
      } else {
        const error = stderr || `Exited with code ${code}`;
        currentProgress.status = 'failed';
        currentProgress.error = error;
        reject(new Error(error));
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      currentProgress.status = 'failed';
      currentProgress.error = err.message;
      reject(err);
    });
  });
}
