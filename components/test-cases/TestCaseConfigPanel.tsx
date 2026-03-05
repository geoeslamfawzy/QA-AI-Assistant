'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TestTubes, ArrowRight, Loader2, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TestFormat = 'standard' | 'bdd' | 'exploratory';

export interface CoverageOption {
  id: string;
  label: string;
  active: boolean;
}

export interface TestCaseConfig {
  ticketId: string;
  format: TestFormat;
  coverage: CoverageOption[];
  additionalCriteria: string;
}

interface TestCaseConfigPanelProps {
  onGenerate: (config: TestCaseConfig) => void;
  isLoading?: boolean;
}

const defaultCoverageOptions: CoverageOption[] = [
  { id: 'functional', label: 'Functional', active: true },
  { id: 'edge-cases', label: 'Edge Cases', active: true },
  { id: 'negative', label: 'Negative', active: true },
  { id: 'ui-ux', label: 'UI/UX', active: false },
  { id: 'performance', label: 'Performance', active: false },
  { id: 'security', label: 'Security', active: false },
  { id: 'accessibility', label: 'Accessibility', active: false },
];

export function TestCaseConfigPanel({
  onGenerate,
  isLoading = false,
}: TestCaseConfigPanelProps) {
  const [ticketId, setTicketId] = useState('');
  const [format, setFormat] = useState<TestFormat>('standard');
  const [coverage, setCoverage] = useState<CoverageOption[]>(defaultCoverageOptions);
  const [additionalCriteria, setAdditionalCriteria] = useState('');

  const toggleCoverage = (id: string) => {
    setCoverage((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, active: !opt.active } : opt
      )
    );
  };

  const handleGenerate = () => {
    onGenerate({
      ticketId,
      format,
      coverage,
      additionalCriteria,
    });
  };

  const hasAnyCoverage = coverage.some((c) => c.active);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-dim">
            <TestTubes className="h-4 w-4 text-green-500" />
          </div>
          Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jira Ticket */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Jira Ticket (optional)
          </Label>
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g. MOB-1248"
              className="pl-10 font-mono text-sm"
            />
          </div>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Test Case Format
          </Label>
          <Select value={format} onValueChange={(v) => setFormat(v as TestFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Format</SelectItem>
              <SelectItem value="bdd">BDD Gherkin</SelectItem>
              <SelectItem value="exploratory">Exploratory Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Coverage Options */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Coverage Types
          </Label>
          <div className="flex flex-wrap gap-2">
            {coverage.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleCoverage(opt.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  opt.active
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Criteria */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Additional Criteria (optional)
          </Label>
          <Textarea
            value={additionalCriteria}
            onChange={(e) => setAdditionalCriteria(e.target.value)}
            placeholder="Any specific test scenarios or edge cases to include..."
            className="min-h-[100px] text-sm"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!hasAnyCoverage || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Test Case Prompt
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
