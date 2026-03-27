'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import ClaudeCliProgress from '@/components/ai/ClaudeCliProgress';
import {
  FolderSearch,
  Search,
  Loader2,
  ChevronDown,
  ChevronRight,
  Zap,
  Hand,
  Bot,
  Copy,
  Check,
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  Trash2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

// ────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────

interface Ticket {
  key: string;
  title: string;
  type: string;
  status: string;
  module: string;
  description: string;
  acceptanceCriteria: string[];
  labels: string[];
  components: string[];
  priority: string;
  sprint: string;
  assignee: string;
  created: string;
  updated: string;
  figmaLinks: string[];
}

interface SavedQuery {
  id: string;
  name: string;
  jql: string;
  slug: string;
  lastRun: string;
  ticketCount: number;
  hasDocument: boolean;
}

// ────────────────────────────────────────────────────────────────
// QUERY TEMPLATES
// ────────────────────────────────────────────────────────────────

const QUERY_TEMPLATES = [
  {
    name: 'Invoice & Billing',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "invoice" OR description ~ "billing" OR description ~ "facture" OR summary ~ "invoice") ORDER BY updated DESC',
  },
  {
    name: 'Payments',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "payment" OR description ~ "prepaid" OR description ~ "postpaid" OR description ~ "wallet" OR description ~ "budget" OR summary ~ "payment") ORDER BY updated DESC',
  },
  {
    name: 'Book Rides',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "book ride" OR description ~ "booking" OR description ~ "multi-stop" OR description ~ "scheduled ride" OR summary ~ "ride" OR summary ~ "booking") ORDER BY updated DESC',
  },
  {
    name: 'Login & Auth',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "login" OR description ~ "auth" OR description ~ "SSO" OR description ~ "OTP" OR description ~ "registration" OR summary ~ "login" OR summary ~ "auth") ORDER BY updated DESC',
  },
  {
    name: 'Programs',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "program" OR description ~ "geofence" OR description ~ "ride schedule" OR summary ~ "program") ORDER BY updated DESC',
  },
  {
    name: 'Users & Groups',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "users" OR description ~ "groups" OR description ~ "invite" OR description ~ "members" OR summary ~ "users" OR summary ~ "groups") ORDER BY updated DESC',
  },
  {
    name: 'Referrals',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "referral" OR summary ~ "referral") ORDER BY updated DESC',
  },
  {
    name: 'Gift Cards',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "gift card" OR description ~ "voucher" OR summary ~ "gift card") ORDER BY updated DESC',
  },
  {
    name: 'Business Challenge',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "challenge" OR description ~ "badge" OR description ~ "tier" OR description ~ "gamification" OR summary ~ "challenge") ORDER BY updated DESC',
  },
  {
    name: 'Trips & History',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "trips" OR description ~ "trip history" OR description ~ "ride history" OR description ~ "export rides" OR summary ~ "trips") ORDER BY updated DESC',
  },
  {
    name: 'Admin Panel',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "admin panel" OR description ~ "enterprise" OR description ~ "admin" OR summary ~ "admin") ORDER BY updated DESC',
  },
  {
    name: 'B2C WebApp',
    jql: 'project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND (description ~ "B2C" OR description ~ "web app" OR summary ~ "B2C" OR summary ~ "[WEBAPP]") ORDER BY updated DESC',
  },
];

// ────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────

export default function ModuleExplorerPage() {
  // Query state
  const [jqlQuery, setJqlQuery] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentSlug, setDocumentSlug] = useState('');

  // Fetch state
  const [isFetching, setIsFetching] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fetchDuration, setFetchDuration] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState('');

  // Generate state
  const [generationMode, setGenerationMode] = useState<'auto' | 'claude-cli' | 'manual'>('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [claudeResponse, setClaudeResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Claude CLI state
  const [isClaudeCliAvailable, setIsClaudeCliAvailable] = useState<boolean | null>(null);
  const [isClaudeCliRunning, setIsClaudeCliRunning] = useState(false);
  const [claudeCliModel, setClaudeCliModel] = useState('claude-sonnet-4-6');

  // Document preview state
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [savedSlug, setSavedSlug] = useState('');

  // Saved queries state
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);

  // Copy state
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedDocument, setCopiedDocument] = useState(false);

  // Gemini availability
  const [isGeminiAvailable, setIsGeminiAvailable] = useState<boolean | null>(null);

  // Fetch progress state
  const [fetchProgress, setFetchProgress] = useState<{
    status: string;
    totalTickets: number;
    fetchedTickets: number;
    currentTicketKey: string;
    currentTicketTitle: string;
  } | null>(null);

  // ────────────────────────────────────────────────────────────────
  // EFFECTS
  // ────────────────────────────────────────────────────────────────

  // Check AI availability on mount
  useEffect(() => {
    const checkAiStatus = async () => {
      try {
        const res = await fetch('/api/ai/status');
        const data = await res.json();
        setIsGeminiAvailable(data.providers?.gemini?.configured ?? false);
        setIsClaudeCliAvailable(data.providers?.claudeCli?.available ?? false);
      } catch {
        setIsGeminiAvailable(false);
        setIsClaudeCliAvailable(false);
      }
    };
    checkAiStatus();
  }, []);

  // Load saved queries on mount
  const loadSavedQueries = useCallback(async () => {
    setIsLoadingQueries(true);
    try {
      const res = await fetch('/api/module-explorer/saved-queries');
      const data = await res.json();
      if (data.success) {
        setSavedQueries(data.queries || []);
      }
    } catch {
      console.warn('Failed to load saved queries');
    } finally {
      setIsLoadingQueries(false);
    }
  }, []);

  useEffect(() => {
    loadSavedQueries();
  }, [loadSavedQueries]);

  // Auto-generate slug from name
  useEffect(() => {
    if (documentName) {
      const slug = documentName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setDocumentSlug(slug);
    }
  }, [documentName]);

  // Poll fetch progress
  useEffect(() => {
    if (!isFetching) {
      setFetchProgress(null);
      return;
    }

    const pollProgress = async () => {
      try {
        const res = await fetch('/api/module-explorer/progress');
        const data = await res.json();
        setFetchProgress(data);

        if (data.status === 'completed') {
          // Fetch final results
          const resultsRes = await fetch('/api/module-explorer/results');
          const results = await resultsRes.json();

          if (results.success && results.tickets) {
            setTickets(results.tickets);
            toast.success(`Found ${results.tickets.length} tickets`);

            // Save query for future use
            if (results.tickets.length > 0) {
              await fetch('/api/module-explorer/saved-queries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: documentName || 'Custom Query',
                  jql: jqlQuery,
                  slug: documentSlug,
                  ticketCount: results.tickets.length,
                }),
              });
              loadSavedQueries();
            }
          }
          setIsFetching(false);
        } else if (data.status === 'failed') {
          toast.error(data.error || 'Failed to fetch tickets');
          setIsFetching(false);
        }
      } catch {
        console.error('Failed to poll progress');
      }
    };

    const interval = setInterval(pollProgress, 1000);
    pollProgress(); // Initial poll

    return () => clearInterval(interval);
  }, [isFetching, documentName, jqlQuery, documentSlug, loadSavedQueries]);

  // ────────────────────────────────────────────────────────────────
  // HANDLERS
  // ────────────────────────────────────────────────────────────────

  const handleTemplateClick = (template: typeof QUERY_TEMPLATES[0]) => {
    setJqlQuery(template.jql);
    setDocumentName(template.name);
    toast.info(`Loaded template: ${template.name}`);
  };

  const handleSavedQueryClick = (query: SavedQuery) => {
    setJqlQuery(query.jql);
    setDocumentName(query.name);
    setDocumentSlug(query.slug);
    toast.info(`Loaded query: ${query.name}`);
  };

  const handleDeleteQuery = async (id: string) => {
    try {
      const res = await fetch(`/api/module-explorer/saved-queries?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSavedQueries((prev) => prev.filter((q) => q.id !== id));
        toast.success('Query deleted');
      } else {
        toast.error(data.error || 'Failed to delete query');
      }
    } catch {
      toast.error('Failed to delete query');
    }
  };

  const handleFetchTickets = async () => {
    if (!jqlQuery.trim()) {
      toast.error('Please enter a JQL query');
      return;
    }

    setIsFetching(true);
    setTickets([]);
    setGeneratedDocument('');
    setGeneratedPrompt('');
    setFetchProgress(null);

    try {
      const res = await fetch('/api/module-explorer/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jql: jqlQuery,
          name: documentName || 'Custom Query',
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to fetch tickets');
        setIsFetching(false);
        return;
      }

      // For immediate completion (0 tickets)
      if (data.status === 'completed' && data.totalTickets === 0) {
        toast.warning('No tickets found for this query');
        setIsFetching(false);
        return;
      }

      // Background fetch started - polling effect will handle the rest
      toast.info(`Starting to fetch ${data.totalTickets} tickets...`);
    } catch {
      toast.error('Failed to fetch tickets');
      setIsFetching(false);
    }
  };

  const handleGenerateDocument = async () => {
    if (tickets.length === 0) {
      toast.error('No tickets to generate document from');
      return;
    }

    if (!documentName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/module-explorer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: documentName,
          slug: documentSlug,
          tickets,
          mode: generationMode,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to generate document');
        return;
      }

      if (generationMode === 'manual') {
        setGeneratedPrompt(data.prompt || '');
        toast.success('Prompt generated! Copy it to Claude.');
      } else {
        setGeneratedDocument(data.content || '');
        setSavedSlug(data.slug || documentSlug);
        toast.success(`Document generated and saved to ${data.savedTo}`);
      }
    } catch {
      toast.error('Failed to generate document');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClaudeCliGenerate = async () => {
    if (tickets.length === 0) {
      toast.error('No tickets to generate document from');
      return;
    }
    if (!documentName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    setIsGenerating(true);

    try {
      // First, get the prompt from the generate endpoint in manual mode
      const res = await fetch('/api/module-explorer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: documentName,
          slug: documentSlug,
          tickets,
          mode: 'manual', // Get prompt only
        }),
      });

      const data = await res.json();
      if (!data.success || !data.prompt) {
        toast.error(data.error || 'Failed to generate prompt');
        setIsGenerating(false);
        return;
      }

      // Now send to Claude CLI
      setIsClaudeCliRunning(true);
      const cliRes = await fetch('/api/ai/claude-cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.prompt,
          model: claudeCliModel,
          feature: 'module-explorer',
        }),
      });

      const cliData = await cliRes.json();
      if (!cliRes.ok) {
        throw new Error(cliData.error);
      }

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const progressRes = await fetch('/api/ai/claude-cli');
          const progress = await progressRes.json();

          if (progress.status === 'completed') {
            clearInterval(pollInterval);
            setIsClaudeCliRunning(false);

            // Save the document
            const saveRes = await fetch('/api/module-explorer/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                slug: documentSlug,
                name: documentName,
                content: progress.output,
              }),
            });

            const saveData = await saveRes.json();
            if (saveData.success) {
              setGeneratedDocument(progress.output);
              setSavedSlug(saveData.slug || documentSlug);
              toast.success(`Document generated and saved to ${saveData.savedTo}`);
            } else {
              toast.error(saveData.error || 'Failed to save document');
            }
            setIsGenerating(false);
          } else if (progress.status === 'failed') {
            clearInterval(pollInterval);
            setIsClaudeCliRunning(false);
            setIsGenerating(false);
            toast.error(progress.error || 'Claude CLI failed');
          }
        } catch {
          // ignore poll errors
        }
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setIsClaudeCliRunning(false);
      setIsGenerating(false);
      toast.error(error.message || 'Failed to generate with Claude CLI');
    }
  };

  const handleSaveManualResponse = async () => {
    if (!claudeResponse.trim()) {
      toast.error('Please paste Claude\'s response');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/module-explorer/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: documentSlug,
          name: documentName,
          content: claudeResponse,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to save document');
        return;
      }

      setGeneratedDocument(claudeResponse);
      setSavedSlug(data.slug);
      setClaudeResponse('');
      setGeneratedPrompt('');
      toast.success(`Document saved to ${data.savedTo}`);
    } catch {
      toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyDocument = async () => {
    await navigator.clipboard.writeText(generatedDocument);
    setCopiedDocument(true);
    toast.success('Document copied to clipboard');
    setTimeout(() => setCopiedDocument(false), 2000);
  };

  const handleExportDocument = () => {
    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${savedSlug || documentSlug || 'module'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document exported');
  };

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Filter tickets by search
  const filteredTickets = tickets.filter((t) => {
    if (!searchFilter) return true;
    const search = searchFilter.toLowerCase();
    return (
      t.key.toLowerCase().includes(search) ||
      t.title.toLowerCase().includes(search) ||
      t.status.toLowerCase().includes(search)
    );
  });

  // ────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderSearch className="h-6 w-6" />
          Module Explorer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetch tickets with a custom JQL query and build a focused module document
          for regression, analysis, or test planning.
        </p>
      </div>

      {/* Saved Queries */}
      {savedQueries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedQueries.map((query) => (
                <div
                  key={query.id}
                  className="group flex items-center gap-1 rounded-lg border bg-background px-3 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => handleSavedQueryClick(query)}
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{query.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {query.ticketCount} tickets
                      {query.hasDocument && ' • Has document'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuery(query.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section A: Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Query Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* JQL Query */}
          <div className="space-y-2">
            <Label htmlFor="jql">JQL Query</Label>
            <Textarea
              id="jql"
              placeholder='project = CMB AND "squad[dropdown]" = "B2B & B2C WebApp" AND description ~ "invoice" ORDER BY updated DESC'
              value={jqlQuery}
              onChange={(e) => setJqlQuery(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
          </div>

          {/* Document Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                placeholder="Invoice Module"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (auto-generated)</Label>
              <Input
                id="slug"
                value={documentSlug}
                onChange={(e) => setDocumentSlug(e.target.value)}
                className="text-muted-foreground"
              />
            </div>
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {QUERY_TEMPLATES.map((template) => (
                <Badge
                  key={template.name}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted px-3 py-1"
                  onClick={() => handleTemplateClick(template)}
                >
                  {template.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Fetch Button */}
          <Button
            onClick={handleFetchTickets}
            disabled={isFetching || !jqlQuery.trim()}
            className="w-full sm:w-auto"
          >
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Fetch Tickets
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Section B: Fetch Progress */}
      {isFetching && fetchProgress && fetchProgress.status === 'fetching' && (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Fetching ticket details...</span>
                <span className="text-muted-foreground">
                  {fetchProgress.totalTickets > 0
                    ? Math.round((fetchProgress.fetchedTickets / fetchProgress.totalTickets) * 100)
                    : 0}%
                </span>
              </div>
              <Progress
                value={
                  fetchProgress.totalTickets > 0
                    ? (fetchProgress.fetchedTickets / fetchProgress.totalTickets) * 100
                    : 0
                }
                className="h-2"
              />
              {fetchProgress.currentTicketKey && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono">{fetchProgress.currentTicketKey}</span>
                  <span className="truncate max-w-[300px]">— {fetchProgress.currentTicketTitle}</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Ticket {fetchProgress.fetchedTickets} of {fetchProgress.totalTickets}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section B: Results Table */}
      {tickets.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Query Results — {tickets.length} tickets found
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                <Clock className="inline h-3 w-3 mr-1" />
                {(fetchDuration / 1000).toFixed(1)}s
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Filter */}
            <div className="mb-4">
              <Input
                placeholder="Search tickets..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {/* Table */}
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="w-[120px]">Key</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <Collapsible key={ticket.key} open={expandedRows.has(ticket.key)}>
                      <CollapsibleTrigger asChild>
                        <TableRow
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => toggleRow(ticket.key)}
                        >
                          <TableCell>
                            {expandedRows.has(ticket.key) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {ticket.key}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {ticket.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {ticket.created?.split('T')[0]}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 p-4">
                            <div className="space-y-3">
                              {ticket.description && (
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Description</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {ticket.description.substring(0, 500)}
                                    {ticket.description.length > 500 && '...'}
                                  </p>
                                </div>
                              )}
                              {ticket.acceptanceCriteria?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-1">
                                    Acceptance Criteria
                                  </h4>
                                  <ul className="text-sm text-muted-foreground list-disc pl-5">
                                    {ticket.acceptanceCriteria.slice(0, 5).map((ac, i) => (
                                      <li key={i}>{ac}</li>
                                    ))}
                                    {ticket.acceptanceCriteria.length > 5 && (
                                      <li className="text-muted-foreground/70">
                                        +{ticket.acceptanceCriteria.length - 5} more...
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </p>
          </CardContent>
        </Card>
      )}

      {/* Section C: Generate Document */}
      {tickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Module Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a consolidated document from the {tickets.length} fetched tickets.
              The document will describe the current state of this module based on all
              ticket data (newest tickets override older ones).
            </p>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={generationMode === 'auto' ? 'default' : 'outline'}
                onClick={() => setGenerationMode('auto')}
                disabled={!isGeminiAvailable}
                className="flex-1 sm:flex-none"
              >
                <Zap className="mr-2 h-4 w-4" />
                Gemini
                {!isGeminiAvailable && ' (N/A)'}
              </Button>
              <Button
                variant={generationMode === 'claude-cli' ? 'default' : 'outline'}
                onClick={() => setGenerationMode('claude-cli')}
                disabled={!isClaudeCliAvailable}
                className="flex-1 sm:flex-none"
              >
                <Bot className="mr-2 h-4 w-4" />
                Claude CLI
                {!isClaudeCliAvailable && ' (N/A)'}
              </Button>
              <Button
                variant={generationMode === 'manual' ? 'default' : 'outline'}
                onClick={() => setGenerationMode('manual')}
                className="flex-1 sm:flex-none"
              >
                <Hand className="mr-2 h-4 w-4" />
                Manual
              </Button>
            </div>

            {/* Auto Mode */}
            {generationMode === 'auto' && (
              <Button
                onClick={handleGenerateDocument}
                disabled={isGenerating || !documentName.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate with Gemini
                  </>
                )}
              </Button>
            )}

            {/* Claude CLI Mode */}
            {generationMode === 'claude-cli' && (
              <div className="space-y-4">
                {/* Model selector */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Claude Model
                  </label>
                  <select
                    value={claudeCliModel}
                    onChange={(e) => setClaudeCliModel(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground"
                  >
                    <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 — Fastest, lightweight tasks</option>
                    <option value="claude-sonnet-4-6">Claude Sonnet 4.6 — Fast, good quality</option>
                    <option value="claude-opus-4-6">Claude Opus 4.6 — Best quality, slower</option>
                  </select>
                </div>

                <Button
                  onClick={handleClaudeCliGenerate}
                  disabled={isGenerating || !documentName.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate with Claude CLI
                    </>
                  )}
                </Button>

                {/* Claude CLI Progress */}
                <ClaudeCliProgress
                  isActive={isClaudeCliRunning}
                  onComplete={() => {}}
                  onError={(error) => toast.error(error)}
                />
              </div>
            )}

            {/* Manual Mode */}
            {generationMode === 'manual' && (
              <div className="space-y-4">
                {!generatedPrompt ? (
                  <Button
                    onClick={handleGenerateDocument}
                    disabled={isGenerating || !documentName.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Building prompt...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    {/* Step 1: Copy Prompt */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Step 1: Copy this prompt to Claude</Label>
                        <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                          {copiedPrompt ? (
                            <Check className="mr-2 h-4 w-4" />
                          ) : (
                            <Copy className="mr-2 h-4 w-4" />
                          )}
                          {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                        </Button>
                      </div>
                      <div className="rounded-lg bg-muted p-4 max-h-[200px] overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {generatedPrompt.substring(0, 500)}...
                        </pre>
                        <p className="text-xs text-muted-foreground mt-2">
                          {generatedPrompt.length.toLocaleString()} characters
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Paste Response */}
                    <div className="space-y-2">
                      <Label>Step 2: Paste Claude&apos;s response</Label>
                      <Textarea
                        placeholder="Paste the generated document here..."
                        value={claudeResponse}
                        onChange={(e) => setClaudeResponse(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      <Button
                        onClick={handleSaveManualResponse}
                        disabled={isSaving || !claudeResponse.trim()}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Document
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section D: Document Preview */}
      {generatedDocument && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Document Generated — {documentName}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {generatedDocument.length.toLocaleString()} characters •{' '}
                {tickets.length} tickets analyzed • Saved to knowledge-base
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Preview */}
            <ScrollArea className="h-[400px] rounded-lg border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generatedDocument}
                </pre>
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleCopyDocument}>
                {copiedDocument ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copiedDocument ? 'Copied!' : 'Copy Document'}
              </Button>
              <Button variant="outline" onClick={handleExportDocument}>
                <Download className="mr-2 h-4 w-4" />
                Export as MD
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.open(`/project-context`, '_blank');
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View in Project Context
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setGeneratedDocument('');
                  setGeneratedPrompt('');
                  setClaudeResponse('');
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading skeleton for initial load */}
      {isLoadingQueries && savedQueries.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
