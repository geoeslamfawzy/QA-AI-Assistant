'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IntegrationStatusRow } from '@/components/settings/IntegrationStatusRow';
import { BehaviorToggleRow } from '@/components/settings/BehaviorToggleRow';
import {
  Settings,
  Ticket,
  Palette,
  MessageSquare,
  RefreshCcw,
  Save,
  Loader2,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Module list
const modules = [
  'B2B Corporate Portal',
  'B2C Web Interface',
  'Admin Panel',
  'DashOps',
  'Pricing Engine',
  'Analytics',
  'Super App',
  'Driver App',
];

export default function SettingsPage() {
  // Integration status
  const [jiraConnected, setJiraConnected] = useState(false);
  const [figmaConnected, setFigmaConnected] = useState(false);
  const [isCheckingConnections, setIsCheckingConnections] = useState(false);

  // Jira credentials
  const [jiraDomain, setJiraDomain] = useState('');
  const [jiraApiToken, setJiraApiToken] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');

  // Figma credentials
  const [figmaAccessToken, setFigmaAccessToken] = useState('');

  // Behavior settings
  const [autoFetchFigma, setAutoFetchFigma] = useState(true);
  const [includeProjectContext, setIncludeProjectContext] = useState(true);
  const [autoTagComments, setAutoTagComments] = useState(true);
  const [includeScreenshots, setIncludeScreenshots] = useState(false);

  // Project scope
  const [activeModules, setActiveModules] = useState<string[]>([
    'B2B Corporate Portal',
    'B2C Web Interface',
    'Admin Panel',
  ]);

  // Save state
  const [isSaving, setIsSaving] = useState(false);

  const toggleModule = (module: string) => {
    setActiveModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const checkConnections = useCallback(async () => {
    setIsCheckingConnections(true);
    try {
      // Simulate connection check
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setJiraConnected(!!jiraDomain && !!jiraApiToken && !!jiraEmail);
      setFigmaConnected(!!figmaAccessToken);
      toast.success('Connections checked');
    } catch {
      toast.error('Failed to check connections');
    } finally {
      setIsCheckingConnections(false);
    }
  }, [jiraDomain, jiraApiToken, jiraEmail, figmaAccessToken]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira: {
            domain: jiraDomain,
            apiToken: jiraApiToken,
            email: jiraEmail,
          },
          figma: {
            accessToken: figmaAccessToken,
          },
          behavior: {
            autoFetchFigma,
            includeProjectContext,
            autoTagComments,
            includeScreenshots,
          },
          activeModules,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save settings');
      }

      toast.success('Settings saved successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [
    jiraDomain,
    jiraApiToken,
    jiraEmail,
    figmaAccessToken,
    autoFetchFigma,
    includeProjectContext,
    autoTagComments,
    includeScreenshots,
    activeModules,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure integrations, agent behavior, and project scope
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status rows */}
            <div className="space-y-3">
              <IntegrationStatusRow
                icon={Ticket}
                name="Jira Cloud"
                description="Fetch tickets and post comments"
                connected={jiraConnected}
                isLoading={isCheckingConnections}
              />
              <IntegrationStatusRow
                icon={Palette}
                name="Figma"
                description="Extract design frames"
                connected={figmaConnected}
                isLoading={isCheckingConnections}
              />
              <IntegrationStatusRow
                icon={MessageSquare}
                name="Claude (Manual)"
                description="Copy-paste workflow"
                connected={true}
              />
            </div>

            {/* Jira Credentials */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Jira Configuration
              </p>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Jira Domain
                </Label>
                <Input
                  value={jiraDomain}
                  onChange={(e) => setJiraDomain(e.target.value)}
                  placeholder="your-company.atlassian.net"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  API Token
                </Label>
                <Input
                  type="password"
                  value={jiraApiToken}
                  onChange={(e) => setJiraApiToken(e.target.value)}
                  placeholder="Enter your Jira API token"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={jiraEmail}
                  onChange={(e) => setJiraEmail(e.target.value)}
                  placeholder="your-email@company.com"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Figma Credentials */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Figma Configuration
              </p>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Access Token
                </Label>
                <Input
                  type="password"
                  value={figmaAccessToken}
                  onChange={(e) => setFigmaAccessToken(e.target.value)}
                  placeholder="Enter your Figma access token"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Check Connections */}
            <Button
              variant="outline"
              onClick={checkConnections}
              disabled={isCheckingConnections}
              className="w-full"
            >
              {isCheckingConnections ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Check Connections
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right: Agent Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-dim">
                <Settings className="h-4 w-4 text-cyan-500" />
              </div>
              Agent Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <BehaviorToggleRow
              id="auto-fetch-figma"
              label="Auto-fetch Figma from Jira links"
              description="Automatically extract Figma URLs found in Jira tickets"
              checked={autoFetchFigma}
              onCheckedChange={setAutoFetchFigma}
            />
            <BehaviorToggleRow
              id="include-project-context"
              label="Include project charter context"
              description="Add project charter and business rules to prompts"
              checked={includeProjectContext}
              onCheckedChange={setIncludeProjectContext}
            />
            <BehaviorToggleRow
              id="auto-tag-comments"
              label="Auto-tag posted comments"
              description="Add [QA AI Agent] tag to Jira comments"
              checked={autoTagComments}
              onCheckedChange={setAutoTagComments}
            />
            <BehaviorToggleRow
              id="include-screenshots"
              label="Include design screenshots"
              description="Attach Figma frame screenshots to prompts"
              checked={includeScreenshots}
              onCheckedChange={setIncludeScreenshots}
            />
          </CardContent>
        </Card>
      </div>

      {/* Full-width: Project Scope */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-dim">
              <Layers className="h-4 w-4 text-green-500" />
            </div>
            Project Scope
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {activeModules.length} of {modules.length} modules active
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Select which modules are included in the project context for
            analysis and prompt generation.
          </p>
          <div className="flex flex-wrap gap-2">
            {modules.map((module) => {
              const isActive = activeModules.includes(module);
              return (
                <button
                  key={module}
                  onClick={() => toggleModule(module)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                  )}
                >
                  {module}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
