'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FindingType = 'ambiguity' | 'testability' | 'design-gap' | 'impact';

export interface Finding {
  id: string;
  type: FindingType;
  severity: FindingSeverity;
  title: string;
  description: string;
  suggestion?: string;
}

interface FindingCardProps {
  finding: Finding;
  selected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
}

const severityConfig: Record<FindingSeverity, { label: string; className: string }> = {
  critical: {
    label: 'P0 - Critical',
    className: 'bg-red-dim text-red-500',
  },
  high: {
    label: 'P1 - High',
    className: 'bg-amber-dim text-amber-500',
  },
  medium: {
    label: 'P2 - Medium',
    className: 'bg-yellow-500/20 text-yellow-500',
  },
  low: {
    label: 'P3 - Low',
    className: 'bg-cyan-dim text-cyan-500',
  },
};

const typeConfig: Record<FindingType, { label: string; className: string }> = {
  ambiguity: {
    label: 'Ambiguity',
    className: 'bg-purple-500/20 text-purple-500',
  },
  testability: {
    label: 'Testability',
    className: 'bg-blue-500/20 text-blue-500',
  },
  'design-gap': {
    label: 'Design Gap',
    className: 'bg-pink-dim text-pink-500',
  },
  impact: {
    label: 'Impact',
    className: 'bg-accent-dim text-primary',
  },
};

export function FindingCard({
  finding,
  selected,
  onToggle,
  disabled = false,
}: FindingCardProps) {
  const severityInfo = severityConfig[finding.severity];
  const typeInfo = typeConfig[finding.type];

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200',
        selected
          ? 'border-green-500 bg-green-dim'
          : 'border-border hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onToggle(finding.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={severityInfo.className}>{severityInfo.label}</Badge>
              <Badge className={typeInfo.className}>{typeInfo.label}</Badge>
            </div>
            <h4 className="font-medium text-sm text-foreground">{finding.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {finding.description}
            </p>
            {finding.suggestion && (
              <div className="mt-2 rounded-md bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Suggestion: </span>
                  {finding.suggestion}
                </p>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {selected ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
