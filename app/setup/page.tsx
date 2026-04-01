'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [setupReason, setSetupReason] = useState('');
  const [message, setMessage] = useState('');

  // Form state
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [jiraDomain, setJiraDomain] = useState('yassir.atlassian.net');
  const [projectKey, setProjectKey] = useState('CMB');
  const [figmaToken, setFigmaToken] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  // UI state
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check if setup is actually needed
  useEffect(() => {
    fetch('/api/setup')
      .then((r) => r.json())
      .then((data) => {
        if (!data.setupRequired) {
          router.replace('/dashboard');
          return;
        }
        setSetupReason(data.reason);
        setMessage(data.message);
        if (data.current) {
          if (data.current.email) setJiraEmail(data.current.email);
          if (data.current.projectKey) setProjectKey(data.current.projectKey);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSubmit = async () => {
    setErrors([]);
    setIsSubmitting(true);

    // Client-side validation
    const clientErrors: string[] = [];
    if (!jiraEmail.trim()) clientErrors.push('Jira email is required');
    if (!jiraToken.trim()) clientErrors.push('Jira API token is required');
    if (!projectKey.trim()) clientErrors.push('Project key is required');
    if (!jiraDomain.trim()) clientErrors.push('Jira domain is required');

    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jiraEmail,
          jiraToken,
          jiraDomain,
          projectKey,
          figmaToken,
          geminiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors(data.errors || ['Setup failed. Please try again.']);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setSuccessName(data.displayName || jiraEmail);
      setTimeout(() => router.push('/dashboard'), 4000);
    } catch (err: unknown) {
      const e = err as Error;
      setErrors([e.message]);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">&#x26A1;</span>
            <span className="text-purple-300 font-semibold">QA AI Agent</span>
            <span className="text-muted-foreground">&middot;</span>
            <span className="text-muted-foreground">Yassir Mobility</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {setupReason === 'token-expired'
              ? 'Session Expired'
              : 'Welcome'}
          </h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">&#x2705;</div>
            <h2 className="text-lg font-semibold text-emerald-400 mb-2">
              Setup Complete!
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              Welcome, <strong className="text-foreground">{successName}</strong>!
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Credentials saved. Please restart the dev server for changes to
              take effect.
            </p>
            <code className="bg-secondary text-foreground px-3 py-1.5 rounded text-sm font-mono">
              npm run dev
            </code>
            <p className="text-muted-foreground text-xs mt-4">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          /* Form */
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {errors.map((err, i) => (
                  <p key={i} className="text-sm text-red-400">
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* Token expired badge */}
            {setupReason === 'token-expired' && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-400">
                &#x26A0;&#xFE0F; Your Jira API token has expired. Enter a new
                one to continue.
              </div>
            )}

            {/* Jira Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Jira Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={jiraEmail}
                onChange={(e) => setJiraEmail(e.target.value)}
                placeholder="name@yassir.com"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Jira API Token */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-foreground">
                  Jira API Token <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowTokenHelp(!showTokenHelp)}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  How to get a token?
                </button>
              </div>
              <input
                type="password"
                value={jiraToken}
                onChange={(e) => setJiraToken(e.target.value)}
                placeholder="Enter your Jira API token"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              {showTokenHelp && (
                <div className="mt-2 p-3 bg-secondary rounded-lg border border-border text-xs text-muted-foreground space-y-1">
                  <p>
                    1. Go to{' '}
                    <a
                      href="https://id.atlassian.com/manage-profile/security/api-tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline"
                    >
                      Atlassian API Tokens
                    </a>
                  </p>
                  <p>2. Click &ldquo;Create API token&rdquo;</p>
                  <p>3. Give it a name (e.g., &ldquo;QA AI Agent&rdquo;)</p>
                  <p>4. Copy the token and paste it here</p>
                </div>
              )}
            </div>

            {/* Project Key */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Jira Project Key <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                placeholder="e.g., CMB"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 uppercase"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The project key from your Jira board URL (e.g., CMB from
                CMB-12345)
              </p>
            </div>

            {/* Advanced — Jira domain */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {showAdvanced ? '- Hide' : '+ Show'} advanced options
              </button>
              {showAdvanced && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Jira Domain
                  </label>
                  <input
                    type="text"
                    value={jiraDomain}
                    onChange={(e) => setJiraDomain(e.target.value)}
                    placeholder="your-org.atlassian.net"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Divider — Optional Fields */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Optional
              </p>
            </div>

            {/* Gemini Key */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Optional — for AI features"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Free key from{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {/* Figma Token */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Figma Access Token
              </label>
              <input
                type="password"
                value={figmaToken}
                onChange={(e) => setFigmaToken(e.target.value)}
                placeholder="Optional — for design reference"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get from{' '}
                <a
                  href="https://www.figma.com/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400"
                >
                  Figma Settings
                </a>{' '}
                &rarr; Personal access tokens
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Connecting to Jira...
                </>
              ) : (
                <>&#x1F517; Connect &amp; Set Up</>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your credentials are stored locally in{' '}
          <code className="bg-secondary px-1 py-0.5 rounded text-xs">
            .env.local
          </code>{' '}
          and never sent to external servers.
        </p>
      </div>
    </div>
  );
}
