'use client';

import { cn } from '@/lib/utils';

export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';

interface BugSeveritySelectorProps {
  value: BugSeverity;
  onChange: (severity: BugSeverity) => void;
  disabled?: boolean;
}

const severityOptions: { value: BugSeverity; label: string; color: string }[] = [
  {
    value: 'critical',
    label: 'P0 - Critical',
    color: 'bg-red-500 text-white hover:bg-red-600',
  },
  {
    value: 'high',
    label: 'P1 - High',
    color: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  {
    value: 'medium',
    label: 'P2 - Medium',
    color: 'bg-yellow-500 text-white hover:bg-yellow-600',
  },
  {
    value: 'low',
    label: 'P3 - Low',
    color: 'bg-cyan-500 text-white hover:bg-cyan-600',
  },
];

export function BugSeveritySelector({
  value,
  onChange,
  disabled = false,
}: BugSeveritySelectorProps) {
  return (
    <div className="flex gap-2">
      {severityOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={cn(
              'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              isSelected
                ? option.color
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
