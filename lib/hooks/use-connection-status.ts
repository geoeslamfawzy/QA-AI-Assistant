'use client';

import { useState, useEffect, useCallback } from 'react';

export interface JiraConnectionStatus {
  configured: boolean;
  connected: boolean;
  isMock: boolean;
  domain?: string;
  projectKey?: string;
  user?: string;
  email?: string;
  error?: string;
  loading: boolean;
}

const CACHE_DURATION = 60000; // 1 minute cache

let cachedStatus: JiraConnectionStatus | null = null;
let lastFetchTime = 0;

export function useJiraConnectionStatus(): JiraConnectionStatus {
  const [status, setStatus] = useState<JiraConnectionStatus>(() => {
    // Return cached status if available and not expired
    if (cachedStatus && Date.now() - lastFetchTime < CACHE_DURATION) {
      return { ...cachedStatus, loading: false };
    }
    return {
      configured: false,
      connected: false,
      isMock: true,
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
      const response = await fetch('/api/jira/status');
      const data = await response.json();

      const newStatus: JiraConnectionStatus = {
        configured: data.configured ?? false,
        connected: data.connected ?? false,
        isMock: data._isMock ?? !data.connected,
        domain: data.domain,
        projectKey: data.projectKey,
        user: data.user,
        email: data.email,
        error: data.error,
        loading: false,
      };

      // Update cache
      cachedStatus = newStatus;
      lastFetchTime = Date.now();

      setStatus(newStatus);
    } catch (error) {
      const errorStatus: JiraConnectionStatus = {
        configured: false,
        connected: false,
        isMock: true,
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
 * Force refresh the connection status (bypasses cache)
 */
export function invalidateConnectionStatusCache(): void {
  cachedStatus = null;
  lastFetchTime = 0;
}
