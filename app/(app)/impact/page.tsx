'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  Radar,
  Loader2,
  Download,
  Copy,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Layers,
  Code,
  Layout,
  GitBranch,
  TestTubes,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ImpactAnalysisResult } from '@/lib/types/impact';

export default function ImpactPage() {
  const [story, setStory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ImpactAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetectImpact = async () => {
    if (!story.trim()) {
      toast.error('Please enter a user story or change description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/detect-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, stream: false }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Impact detection failed');
      }

      setResult(data.result);
      toast.success('Impact analysis complete');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impact-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as JSON');
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'LOW':
        return 'bg-green-500/20 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <AlertCircle className="h-4 w-4" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4" />;
      case 'LOW':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'LARGE':
        return 'bg-destructive/20 text-destructive';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'SMALL':
        return 'bg-green-500/20 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'NEW_FEATURE':
        return 'bg-blue-500/20 text-blue-600';
      case 'REVAMP':
        return 'bg-purple-500/20 text-purple-600';
      case 'REMOVAL':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactTypeColor = (type: string) => {
    switch (type) {
      case 'DIRECT':
        return 'bg-destructive/20 text-destructive';
      case 'INDIRECT':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'DEPENDENCY':
        return 'bg-blue-500/20 text-blue-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radar className="h-5 w-5" />
            Impact Detector
          </CardTitle>
          <CardDescription>
            Analyze the impact of changes on modules, APIs, UI pages, and business rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the change you want to analyze...

Example:
As a B2B Business Admin, I want to be able to set different cancellation policies per vehicle category so that premium vehicles have stricter penalties."
            className="min-h-[150px] font-mono text-sm"
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />

          <Button onClick={handleDetectImpact} disabled={isAnalyzing || !story.trim()}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Impact...
              </>
            ) : (
              <>
                <Radar className="mr-2 h-4 w-4" />
                Detect Impact
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Impact Analysis Results</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getChangeTypeColor(result.change_type)}>
                  {result.change_type.replace('_', ' ')}
                </Badge>
                <Badge className={getRiskColor(result.risk_level)}>
                  {getRiskIcon(result.risk_level)}
                  <span className="ml-1">{result.risk_level} RISK</span>
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyResult}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Justification */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{result.risk_justification}</p>
            </div>

            <Tabs defaultValue="modules" className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="modules" className="gap-1">
                  <Layers className="h-3 w-3" />
                  Modules ({result.affected_modules.length})
                </TabsTrigger>
                <TabsTrigger value="rules" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Rules ({result.affected_business_rules.length})
                </TabsTrigger>
                <TabsTrigger value="ui" className="gap-1">
                  <Layout className="h-3 w-3" />
                  UI ({result.affected_ui_pages.length})
                </TabsTrigger>
                <TabsTrigger value="api" className="gap-1">
                  <Code className="h-3 w-3" />
                  API ({result.affected_api_endpoints.length})
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="gap-1">
                  <GitBranch className="h-3 w-3" />
                  Chain ({result.dependency_chain.length})
                </TabsTrigger>
                <TabsTrigger value="effort" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Effort
                </TabsTrigger>
              </TabsList>

              {/* Affected Modules */}
              <TabsContent value="modules">
                <ScrollArea className="h-[400px]">
                  {result.affected_modules.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No modules directly affected</p>
                  ) : (
                    <div className="space-y-3">
                      {result.affected_modules.map((module, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{module.module_name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {module.system}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getImpactTypeColor(module.impact_type)}>
                                    {module.impact_type}
                                  </Badge>
                                  <Badge className={getRiskColor(module.risk)}>
                                    {module.risk}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {module.impact_description}
                              </p>
                              {module.changes_required.length > 0 && (
                                <div>
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Required Changes:
                                  </span>
                                  <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground">
                                    {module.changes_required.map((change, i) => (
                                      <li key={i}>{change}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              {/* Affected Business Rules */}
              <TabsContent value="rules">
                <ScrollArea className="h-[400px]">
                  {result.affected_business_rules.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No business rules affected</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Current Rule</TableHead>
                          <TableHead>Proposed Change</TableHead>
                          <TableHead>Breaking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.affected_business_rules.map((rule) => (
                          <TableRow key={rule.rule_id}>
                            <TableCell className="font-mono text-xs">
                              {rule.rule_id}
                            </TableCell>
                            <TableCell className="text-sm">{rule.current_rule}</TableCell>
                            <TableCell className="text-sm">{rule.proposed_change}</TableCell>
                            <TableCell>
                              {rule.breaking ? (
                                <Badge className="bg-destructive text-destructive-foreground">
                                  Breaking
                                </Badge>
                              ) : (
                                <Badge variant="outline">Non-breaking</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </TabsContent>

              {/* Affected UI Pages */}
              <TabsContent value="ui">
                <ScrollArea className="h-[400px]">
                  {result.affected_ui_pages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No UI pages affected</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead>Change Required</TableHead>
                          <TableHead>Effort</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.affected_ui_pages.map((page, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{page.page}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {page.change}
                            </TableCell>
                            <TableCell>
                              <Badge className={getEffortColor(page.effort)}>
                                {page.effort}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </TabsContent>

              {/* Affected API Endpoints */}
              <TabsContent value="api">
                <ScrollArea className="h-[400px]">
                  {result.affected_api_endpoints.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No API endpoints affected</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Endpoint</TableHead>
                          <TableHead>Change Required</TableHead>
                          <TableHead>Breaking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.affected_api_endpoints.map((endpoint, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs">{endpoint.endpoint}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {endpoint.change}
                            </TableCell>
                            <TableCell>
                              {endpoint.breaking_change ? (
                                <Badge className="bg-destructive text-destructive-foreground">
                                  Breaking
                                </Badge>
                              ) : (
                                <Badge variant="outline">Non-breaking</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </TabsContent>

              {/* Dependency Chain */}
              <TabsContent value="dependencies">
                <ScrollArea className="h-[400px]">
                  {result.dependency_chain.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No dependency chain detected</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {result.dependency_chain.map((dep, idx) => (
                          <div key={idx} className="flex items-center">
                            <Badge variant="outline" className="font-mono">
                              {dep}
                            </Badge>
                            {idx < result.dependency_chain.length - 1 && (
                              <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Regression Recommendations */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 font-medium">
                          <TestTubes className="h-4 w-4" />
                          Regression Test Recommendations
                        </h4>
                        {result.regression_test_recommendations.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No specific regression tests recommended
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {result.regression_test_recommendations.map((rec, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 rounded-lg border p-3"
                              >
                                <Badge className={getRiskColor(rec.priority)}>
                                  {rec.priority}
                                </Badge>
                                <div>
                                  <p className="font-medium text-sm">{rec.area}</p>
                                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              {/* Effort Estimate */}
              <TabsContent value="effort">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Frontend</p>
                            <p className="text-2xl font-bold">
                              {result.estimated_effort.frontend}
                            </p>
                          </div>
                          <Layout className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Backend</p>
                            <p className="text-2xl font-bold">
                              {result.estimated_effort.backend}
                            </p>
                          </div>
                          <Code className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Testing</p>
                            <p className="text-2xl font-bold">
                              {result.estimated_effort.testing}
                            </p>
                          </div>
                          <TestTubes className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Estimated Story Points
                          </p>
                          <p className="text-4xl font-bold text-primary">
                            {result.estimated_effort.total_story_points_estimate}
                          </p>
                        </div>
                        <TrendingUp className="h-12 w-12 text-primary/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
