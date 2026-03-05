'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings, ArrowRight, Loader2 } from 'lucide-react';

export interface AnalysisOptions {
  ambiguity: boolean;
  testability: boolean;
  designGap: boolean;
  impactAnalysis: boolean;
}

interface AnalysisOptionsCardProps {
  options: AnalysisOptions;
  onOptionsChange: (options: AnalysisOptions) => void;
  onGenerate: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const analysisTypes = [
  {
    id: 'ambiguity' as const,
    label: 'Ambiguity Analysis',
    description: 'Identify unclear, missing, or conflicting requirements',
  },
  {
    id: 'testability' as const,
    label: 'Testability Classification',
    description: 'Classify each AC as testable or non-testable',
  },
  {
    id: 'designGap' as const,
    label: 'Design vs Requirements Check',
    description: 'Cross-reference Figma screens with acceptance criteria',
  },
  {
    id: 'impactAnalysis' as const,
    label: 'Impact Analysis',
    description: 'Identify affected modules, APIs, and business rules',
  },
];

export function AnalysisOptionsCard({
  options,
  onOptionsChange,
  onGenerate,
  isLoading = false,
  disabled = false,
}: AnalysisOptionsCardProps) {
  const handleToggle = (id: keyof AnalysisOptions) => {
    onOptionsChange({ ...options, [id]: !options[id] });
  };

  const hasSelection = Object.values(options).some(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-dim">
            <Settings className="h-4 w-4 text-cyan-500" />
          </div>
          Analysis Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {analysisTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => !disabled && handleToggle(type.id)}
            >
              <Checkbox
                id={type.id}
                checked={options[type.id]}
                onCheckedChange={() => handleToggle(type.id)}
                disabled={disabled}
              />
              <div className="space-y-1">
                <Label
                  htmlFor={type.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {type.label}
                </Label>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onGenerate}
          disabled={!hasSelection || isLoading || disabled}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prompt...
            </>
          ) : (
            <>
              Generate Prompt
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
