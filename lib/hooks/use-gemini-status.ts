'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GeminiConnectionStatus {
  configured: boolean;
  connected: boolean;
  model?: string;
  error?: string;
  loading: boolean;
}

const CACHE_DURATION = 60000; // 1 minute cache

let cachedStatus: GeminiConnectionStatus | null = null;
let lastFetchTime = 0;

export function useGeminiConnectionStatus(): GeminiConnectionStatus {
  const [status, setStatus] = useState<GeminiConnectionStatus>(() => {
    // Return cached status if available and not expired
    if (cachedStatus && Date.now() - lastFetchTime < CACHE_DURATION) {
      return { ...cachedStatus, loading: false };
    }
    return {
      configured: false,
      connected: false,
      loading: true,
    };
  });

  const checkStatus = useCallback(async () => {
    // Skip if we have a recent cached status
    if (cachedStatus && Date.now() - lastFetchTime < CACHE_DURATION) {
      setStatus({ ...cachedStatus, loading: false });
      return;
    }

    try {
      const response = await fetch('/api/ai/status');
      const data = await response.json();

      const gemini = data.providers?.gemini || {};
      const newStatus: GeminiConnectionStatus = {
        configured: gemini.configured ?? false,
        connected: gemini.connected ?? false,
        model: gemini.model,
        error: gemini.error,
        loading: false,
      };

      // Update cache
      cachedStatus = newStatus;
      lastFetchTime = Date.now();

      setStatus(newStatus);
    } catch {
      const errorStatus: GeminiConnectionStatus = {
        configured: false,
        connected: false,
        error: 'Failed to check connection status',
        loading: false,
      };

      cachedStatus = errorStatus;
      lastFetchTime = Date.now();

      setStatus(errorStatus);
    }
  }, []);

  useEffect(() => {
    checkStatus();

    // Refresh status periodically
    const interval = setInterval(checkStatus, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return status;
}

/**
 * Force refresh the Gemini connection status (bypasses cache)
 */
export function invalidateGeminiStatusCache(): void {
  cachedStatus = null;
  lastFetchTime = 0;
}
