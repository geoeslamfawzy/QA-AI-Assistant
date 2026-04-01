'use client';

import { useEffect } from 'react';

/**
 * Global hook that intercepts fetch responses.
 * If any /api/jira call returns 401, clears the setup cookie
 * and redirects to the setup page.
 *
 * Mount this ONCE in the AppShell or root layout.
 */
export function useAuthCheck() {
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);

      if (response.status === 401) {
        const url =
          typeof args[0] === 'string'
            ? args[0]
            : args[0] instanceof Request
              ? args[0].url
              : '';

        // Only redirect on Jira API 401 errors (token expired)
        if (url.includes('/api/jira')) {
          console.warn(
            '[Auth] Jira 401 detected — redirecting to setup page'
          );
          document.cookie =
            'qa-agent-setup-complete=; path=/; max-age=0';
          window.location.href = '/setup';
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}
