'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ClaudeCliConnectionStatus {
  available: boolean;
  version?: string;
  error?: string;
  loading: boolean;
}

const CACHE_DURATION = 60000; // 1 minute cache

let cachedStatus: ClaudeCliConnectionStatus | null = null;
let lastFetchTime = 0;

export function useClaudeCliConnectionStatus(): ClaudeCliConnectionStatus {
  const [status, setStatus] = useState<ClaudeCliConnectionStatus>(() => {
    if (cachedStatus && Date.now() - lastFetchTime < CACHE_DURATION) {
      return { ...cachedStatus, loading: false };
    }
    return {
      available: false,
      loading: true,
    };
  });

  const checkStatus = useCallback(async () => {
    if (cachedStatus && Date.now() - lastFetchTime < CACHE_DURATION) {
      setStatus({ ...cachedStatus, loading: false });
      return;
    }

    try {
      const response = await fetch('/api/ai/status');
      const data = await response.json();

      const claudeCli = data.providers?.claudeCli || {};
      const newStatus: ClaudeCliConnectionStatus = {
        available: claudeCli.available ?? false,
        version: claudeCli.version,
        error: claudeCli.error,
        loading: false,
      };

      cachedStatus = newStatus;
      lastFetchTime = Date.now();
      setStatus(newStatus);
    } catch {
      const errorStatus: ClaudeCliConnectionStatus = {
        available: false,
        error: 'Failed to check Claude CLI status',
        loading: false,
      };

      cachedStatus = errorStatus;
      lastFetchTime = Date.now();
      setStatus(errorStatus);
    }
  }, []);

  useEffect(() => {
    checkStatus();

    const interval = setInterval(checkStatus, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return status;
}
