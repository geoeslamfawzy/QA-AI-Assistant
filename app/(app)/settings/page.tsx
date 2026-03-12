'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { IntegrationStatusRow } from '@/components/settings/IntegrationStatusRow';
import { BehaviorToggleRow } from '@/components/settings/BehaviorToggleRow';
import { TicketBrowser } from '@/components/context-sync/TicketBrowser';
import {
  Settings,
  Ticket,
  Palette,
  MessageSquare,
  RefreshCcw,
  Save,
  Loader2,
  Layers,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Sync status type
interface SyncStatus {
  lastSyncAt: string | null;
  lastSyncStatus: 'success' | 'failed' | 'running' | 'never';
  totalTicketsSynced: number;
  moduleCount: number;
  nextScheduledRun: string | null;
  errors: string[];
}

interface SyncHistoryEntry {
  timestamp: string;
  status: 'success' | 'failed';
  ticketCount: number;
  moduleCount: number;
  duration: number;
}

// Sync phase type
type SyncPhase =
  | 'idle'
  | 'fetching-list'
  | 'fetching-details'
  | 'building-context'
  | 'saving'
  | 'completed'
  | 'failed';

// Progress type for chunked sync with ticket-level details
interface SyncProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  phase: SyncPhase;
  currentBatch: number;
  totalBatches: number;
  ticketsProcessed: number;
  totalTickets: number;
  ticketIndexInBatch: number;
  ticketsInCurrentBatch: number;
  currentTicketKey?: string;
  currentTicketTitle?: string;
  modulesUpdated: number;
  currentModule?: string;
  conflictsResolved: number;
  percentComplete: number;
  startedAt?: string;
  estimatedTimeRemaining?: number;
  error?: string;
}

/**
 * Get human-readable description for the current sync phase.
 */
function getPhaseDescription(phase: SyncPhase): string {
  switch (phase) {
    case 'idle':
      return 'Idle';
    case 'fetching-list':
      return 'Fetching ticket list from Jira...';
    case 'fetching-details':
      return 'Fetching ticket details...';
    case 'building-context':
      return 'Building context documents...';
    case 'saving':
      return 'Saving files...';
    case 'completed':
      return 'Sync completed';
    case 'failed':
      return 'Sync failed';
    default:
      return 'Processing...';
  }
}

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

  // Gemini AI status
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [isCheckingGemini, setIsCheckingGemini] = useState(true);

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

  // Context Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingSyncStatus, setIsLoadingSyncStatus] = useState(true);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [canResume, setCanResume] = useState(false);

  // Fetch sync status on mount
  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        const response = await fetch('/api/context-sync/status');
        const data = await response.json();
        if (data.success) {
          setSyncStatus(data.status);
          setSyncHistory(data.history || []);

          // Check if already running
          if (data.status.lastSyncStatus === 'running') {
            setIsSyncing(true);
          }
        }

        // Also fetch progress to check for resume capability
        const progressRes = await fetch('/api/context-sync/progress');
        const progressData = await progressRes.json();
        if (progressData.success) {
          setSyncProgress(progressData.progress);
          setCanResume(progressData.canResume);
        }
      } catch (error) {
        console.error('Failed to fetch sync status:', error);
      } finally {
        setIsLoadingSyncStatus(false);
      }
    };

    fetchSyncStatus();
  }, []);

  // Fetch Gemini AI status on mount
  useEffect(() => {
    const fetchGeminiStatus = async () => {
      try {
        const response = await fetch('/api/ai/status');
        const data = await response.json();
        if (data.providers?.gemini) {
          setGeminiConnected(data.providers.gemini.connected ?? false);
        }
      } catch (error) {
        console.error('Failed to fetch Gemini status:', error);
      } finally {
        setIsCheckingGemini(false);
      }
    };

    fetchGeminiStatus();
  }, []);

  // Poll progress while syncing
  useEffect(() => {
    if (!isSyncing) return;

    const pollProgress = async () => {
      try {
        const response = await fetch('/api/context-sync/progress');
        const data = await response.json();

        if (data.success) {
          setSyncProgress(data.progress);

          // Check if sync completed or failed
          if (data.progress.status === 'completed' || data.progress.status === 'failed') {
            setIsSyncing(false);
            setCanResume(false);

            // Refresh status
            const statusRes = await fetch('/api/context-sync/status');
            const statusData = await statusRes.json();
            if (statusData.success) {
              setSyncStatus(statusData.status);
              setSyncHistory(statusData.history || []);
            }

            if (data.progress.status === 'completed') {
              toast.success(
                `Synced ${data.progress.ticketsProcessed} tickets to ${data.progress.modulesUpdated} modules`
              );
            } else if (data.progress.error) {
              toast.error(data.progress.error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll progress:', error);
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(pollProgress, 2000);

    // Initial poll
    pollProgress();

    return () => clearInterval(interval);
  }, [isSyncing]);

  // Handle context sync
  const handleContextSync = useCallback(async (
    dryRun: boolean = false,
    resume: boolean = false,
    mode: 'initial' | 'update' = 'update'
  ) => {
    // For initial sync (not dry run), show confirmation dialog
    if (mode === 'initial' && !dryRun) {
      const confirmed = window.confirm(
        'Full Rebuild will DELETE all existing module files and rebuild from scratch. This may take several minutes. Continue?'
      );
      if (!confirmed) return;
    }

    setIsSyncing(true);
    setSyncProgress({
      status: 'running',
      phase: 'fetching-list',
      currentBatch: 0,
      totalBatches: 0,
      ticketsProcessed: 0,
      totalTickets: 0,
      ticketIndexInBatch: 0,
      ticketsInCurrentBatch: 0,
      currentTicketKey: undefined,
      currentTicketTitle: undefined,
      modulesUpdated: 0,
      conflictsResolved: 0,
      percentComplete: 0,
    });

    try {
      // Start sync in background - the polling will handle progress updates
      const response = await fetch('/api/context-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun, resume, mode, waitForCompletion: dryRun }), // Only wait for dry run
      });
      const data = await response.json();

      if (dryRun) {
        // Dry run completes immediately
        setIsSyncing(false);
        if (data.success) {
          toast.success(
            `Preview: Would sync ${data.data.ticketsFetched} tickets to ${data.data.modulesGenerated} modules`
          );
        } else {
          toast.error(data.error || 'Preview failed');
        }
      }
      // For actual sync, the polling useEffect will handle completion
    } catch (error) {
      toast.error('Failed to start context sync');
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }, []);

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
              <IntegrationStatusRow
                icon={Sparkles}
                name="Google Gemini"
                description="Automatic context generation"
                connected={geminiConnected}
                isLoading={isCheckingGemini}
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

      {/* Full-width: Jira Context Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Database className="h-4 w-4 text-blue-500" />
            </div>
            Jira Context Sync
            {syncStatus && syncStatus.lastSyncAt && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                Last: {new Date(syncStatus.lastSyncAt).toLocaleDateString()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sync Jira tickets to build project context documents. Runs
            automatically every 2 weeks on the 1st and 15th.
          </p>

          {/* Status Grid */}
          {isLoadingSyncStatus ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading sync status...
            </div>
          ) : syncStatus ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Status
                </p>
                <div className="flex items-center gap-1.5">
                  {syncStatus.lastSyncStatus === 'success' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {syncStatus.lastSyncStatus === 'failed' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {syncStatus.lastSyncStatus === 'running' && (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  {syncStatus.lastSyncStatus === 'never' && (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium capitalize">
                    {syncStatus.lastSyncStatus}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Tickets
                </p>
                <p className="text-sm font-medium">
                  {syncStatus.totalTicketsSynced}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Modules
                </p>
                <p className="text-sm font-medium">{syncStatus.moduleCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Next Run
                </p>
                <p className="text-sm font-medium">
                  {syncStatus.nextScheduledRun
                    ? new Date(syncStatus.nextScheduledRun).toLocaleDateString()
                    : 'Not scheduled'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No sync status available
            </p>
          )}

          {/* Progress Bar with Ticket-Level Details */}
          {syncProgress && syncProgress.status === 'running' && (
            <div className="space-y-3 pt-2">
              {/* Phase indicator */}
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm font-medium">
                  {getPhaseDescription(syncProgress.phase)}
                </span>
              </div>

              {/* Current ticket card */}
              {syncProgress.currentTicketKey && (
                <div className="bg-muted/50 rounded-md p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {syncProgress.currentTicketKey}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Ticket {syncProgress.ticketIndexInBatch} of {syncProgress.ticketsInCurrentBatch} in batch
                    </span>
                  </div>
                  {syncProgress.currentTicketTitle && (
                    <p className="text-sm truncate">{syncProgress.currentTicketTitle}</p>
                  )}
                </div>
              )}

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Batch {syncProgress.currentBatch} of {syncProgress.totalBatches}
                  </span>
                  <span className="font-medium">{syncProgress.percentComplete}%</span>
                </div>
                <Progress value={syncProgress.percentComplete} className="h-2" />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  {syncProgress.ticketsProcessed} / {syncProgress.totalTickets} tickets
                </span>
                {syncProgress.modulesUpdated > 0 && (
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {syncProgress.modulesUpdated} modules
                  </span>
                )}
                {syncProgress.conflictsResolved > 0 && (
                  <span className="flex items-center gap-1">
                    <RefreshCcw className="h-3 w-3" />
                    {syncProgress.conflictsResolved} conflicts resolved
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sync Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {/* Full Rebuild button */}
            <Button
              variant="destructive"
              onClick={() => handleContextSync(false, false, 'initial')}
              disabled={isSyncing || syncStatus?.lastSyncStatus === 'running'}
              title="Deletes existing modules and rebuilds from ALL stories/improvements"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Full Rebuild
                </>
              )}
            </Button>

            {/* Update button */}
            <Button
              onClick={() => handleContextSync(false, false, 'update')}
              disabled={isSyncing || syncStatus?.lastSyncStatus === 'running'}
              title="Fetches recently completed tickets and merges into existing context"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Update (Last 2 Weeks)
                </>
              )}
            </Button>

            {/* Resume button (only when checkpoint exists) */}
            {canResume && !isSyncing && (
              <Button
                variant="secondary"
                onClick={() => handleContextSync(false, true, 'update')}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
          </div>

          {/* Button descriptions */}
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p><strong>Full Rebuild:</strong> Deletes all modules, fetches all non-cancelled stories/improvements, rebuilds from scratch.</p>
            <p><strong>Update:</strong> Fetches tickets completed in the last 2 weeks and merges into existing knowledge base.</p>
          </div>

          {/* Sync History */}
          {syncHistory.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Recent Sync History
              </p>
              <div className="space-y-1.5">
                {syncHistory.slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    {entry.status === 'success' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span>
                      {new Date(entry.timestamp).toLocaleDateString()}{' '}
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-muted-foreground/60">|</span>
                    <span>{entry.ticketCount} tickets</span>
                    <span className="text-muted-foreground/60">|</span>
                    <span>{entry.moduleCount} modules</span>
                    <span className="text-muted-foreground/60">|</span>
                    <span>{(entry.duration / 1000).toFixed(1)}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JQL Query Info */}
          <div className="pt-4 border-t border-border space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Full Rebuild Query
              </p>
              <code className="block text-xs bg-muted p-2 rounded-md font-mono text-muted-foreground overflow-x-auto">
                project = CMB AND type IN (Story, Improvement) AND &quot;squad[dropdown]&quot; = &quot;B2B &amp; B2C WebApp&quot; AND status != Cancelled ORDER BY created ASC
              </code>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Bi-Weekly Update Query
              </p>
              <code className="block text-xs bg-muted p-2 rounded-md font-mono text-muted-foreground overflow-x-auto">
                project = CMB AND issuetype IN (Improvement, Story) AND &quot;squad[dropdown]&quot; = &quot;B2B &amp; B2C WebApp&quot; AND updated &gt;= -2w AND status = Done ORDER BY updated ASC
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Runs automatically on the 1st and 15th of each month at 3 AM UTC
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full-width: Ticket Browser */}
      {syncStatus && syncStatus.totalTicketsSynced > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Ticket className="h-4 w-4 text-purple-500" />
              </div>
              Ticket Browser
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {syncStatus.totalTicketsSynced} tickets synced
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse all synced Jira tickets. Expand rows to see full details
              including acceptance criteria, labels, and Figma links.
            </p>
            <TicketBrowser showGenerateButton />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
