'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Database,
  Search,
  FileText,
  Layers,
  AlertTriangle,
  GitBranch,
  Calculator,
  ChevronRight,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ModuleListItem {
  id: string;
  title: string;
  system: string;
  type: string;
  tags: string[];
  dependencies: string[];
  risk_level?: string;
  version: string;
  last_updated: string;
  filePath: string;
}

interface KnowledgeBaseMeta {
  version: string;
  lastUpdated: string;
  moduleCount: number;
  ruleCount: number;
}

interface ContextSummary {
  totalModules: number;
  byType: Record<string, number>;
  bySystem: Record<string, number>;
}

export default function ContextPage() {
  const [modules, setModules] = useState<ModuleListItem[]>([]);
  const [meta, setMeta] = useState<KnowledgeBaseMeta | null>(null);
  const [summary, setSummary] = useState<ContextSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/knowledge-base');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch knowledge base');
      }

      setModules(data.modules || []);
      setMeta(data.meta || null);
      setSummary(data.summary || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module':
        return <FileText className="h-4 w-4" />;
      case 'atomic_rule':
        return <AlertTriangle className="h-4 w-4" />;
      case 'state_machine':
        return <Layers className="h-4 w-4" />;
      case 'cross_dependency':
        return <GitBranch className="h-4 w-4" />;
      case 'financial_logic':
        return <Calculator className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'module':
        return 'bg-blue-500/20 text-blue-600';
      case 'atomic_rule':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'state_machine':
        return 'bg-purple-500/20 text-purple-600';
      case 'cross_dependency':
        return 'bg-green-500/20 text-green-600';
      case 'financial_logic':
        return 'bg-orange-500/20 text-orange-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500/20 text-orange-600';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'low':
        return 'bg-green-500/20 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      !searchQuery ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = !selectedType || module.type === selectedType;
    const matchesSystem =
      !selectedSystem ||
      module.system.toLowerCase().includes(selectedSystem.toLowerCase());

    return matchesSearch && matchesType && matchesSystem;
  });

  const types = Array.from(new Set(modules.map((m) => m.type)));
  const systems = Array.from(new Set(modules.map((m) => m.system)));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Project Context Manager
            </CardTitle>
            <CardDescription>
              Browse and manage the Yassir Mobility knowledge base
            </CardDescription>
          </div>
          <Button variant="outline" onClick={fetchKnowledgeBase}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="text-2xl font-bold">{meta?.moduleCount || modules.length}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="text-2xl font-bold">{meta?.ruleCount || 0}</div>
              <div className="text-sm text-muted-foreground">Business Rules</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="text-2xl font-bold">v{meta?.version || '1.0.0'}</div>
              <div className="text-sm text-muted-foreground">Version</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="text-2xl font-bold">
                {meta?.lastUpdated
                  ? new Date(meta.lastUpdated).toLocaleDateString()
                  : '-'}
              </div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
            </div>
          </div>

          {/* Type Distribution */}
          {summary && (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-medium">By Type</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(summary.byType || {}).map(([type, count]) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={`cursor-pointer ${
                      selectedType === type ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() =>
                      setSelectedType(selectedType === type ? null : type)
                    }
                  >
                    {getTypeIcon(type)}
                    <span className="ml-1">
                      {type.replace(/_/g, ' ')}: {count}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Browser */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Modules</CardTitle>
          <CardDescription>
            Click a module to view and edit its content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search modules by name, ID, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {systems.map((system) => (
                <Badge
                  key={system}
                  variant={selectedSystem === system ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedSystem(selectedSystem === system ? null : system)
                  }
                >
                  {system}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Module List */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredModules.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No modules found matching your criteria
                </div>
              ) : (
                filteredModules.map((module) => (
                  <Link
                    key={module.id}
                    href={`/context/${module.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-md p-2 ${getTypeColor(module.type)}`}>
                          {getTypeIcon(module.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{module.title}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {module.id}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {module.system}
                            </Badge>
                            <Badge
                              className={`text-xs ${getTypeColor(module.type)}`}
                            >
                              {module.type.replace(/_/g, ' ')}
                            </Badge>
                            {module.risk_level && (
                              <Badge
                                className={`text-xs ${getRiskColor(
                                  module.risk_level
                                )}`}
                              >
                                {module.risk_level} risk
                              </Badge>
                            )}
                          </div>
                          {module.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {module.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-muted-foreground"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {module.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{module.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="text-sm text-muted-foreground">
            Showing {filteredModules.length} of {modules.length} modules
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
