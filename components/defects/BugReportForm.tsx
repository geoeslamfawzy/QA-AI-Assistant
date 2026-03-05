'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BugSeveritySelector, type BugSeverity } from './BugSeveritySelector';
import { Bug, ArrowRight, Loader2, Ticket } from 'lucide-react';

export interface BugReportData {
  relatedTicket: string;
  module: string;
  severity: BugSeverity;
  actualBehavior: string;
  expectedBehavior: string;
  stepsToReproduce: string;
  browser: string;
  environment: string;
}

interface BugReportFormProps {
  onGenerate: (data: BugReportData) => void;
  isLoading?: boolean;
}

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

const browsers = [
  'Chrome',
  'Firefox',
  'Safari',
  'Edge',
  'Mobile Safari',
  'Chrome Mobile',
];

const environments = ['Production', 'Staging', 'QA', 'Development', 'Local'];

export function BugReportForm({ onGenerate, isLoading = false }: BugReportFormProps) {
  const [relatedTicket, setRelatedTicket] = useState('');
  const [module, setModule] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('medium');
  const [actualBehavior, setActualBehavior] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [browser, setBrowser] = useState('');
  const [environment, setEnvironment] = useState('');

  const handleGenerate = () => {
    onGenerate({
      relatedTicket,
      module,
      severity,
      actualBehavior,
      expectedBehavior,
      stepsToReproduce,
      browser,
      environment,
    });
  };

  const isValid = module && actualBehavior.trim() && expectedBehavior.trim();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-dim">
            <Bug className="h-4 w-4 text-red-500" />
          </div>
          Bug Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Related Ticket */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Related Jira Story (optional)
          </Label>
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={relatedTicket}
              onChange={(e) => setRelatedTicket(e.target.value)}
              placeholder="e.g. MOB-1248"
              className="pl-10 font-mono text-sm"
            />
          </div>
        </div>

        {/* Module */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Module</Label>
          <Select value={module} onValueChange={setModule}>
            <SelectTrigger>
              <SelectValue placeholder="Select module..." />
            </SelectTrigger>
            <SelectContent>
              {modules.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Severity</Label>
          <BugSeveritySelector
            value={severity}
            onChange={setSeverity}
            disabled={isLoading}
          />
        </div>

        {/* What happened */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            What happened? (Actual behavior)
          </Label>
          <Textarea
            value={actualBehavior}
            onChange={(e) => setActualBehavior(e.target.value)}
            placeholder="Describe the bug you observed..."
            className="min-h-[80px] text-sm"
          />
        </div>

        {/* Expected behavior */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Expected behavior
          </Label>
          <Textarea
            value={expectedBehavior}
            onChange={(e) => setExpectedBehavior(e.target.value)}
            placeholder="What should have happened instead?"
            className="min-h-[80px] text-sm"
          />
        </div>

        {/* Steps to reproduce */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Steps to reproduce (optional)
          </Label>
          <Textarea
            value={stepsToReproduce}
            onChange={(e) => setStepsToReproduce(e.target.value)}
            placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
            className="min-h-[80px] text-sm"
          />
        </div>

        {/* Environment */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Browser</Label>
            <Select value={browser} onValueChange={setBrowser}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {browsers.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Environment</Label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {environments.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!isValid || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Bug Report Prompt
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
