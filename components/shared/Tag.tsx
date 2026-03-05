'use client';

import { cn } from '@/lib/utils';

type TagVariant = 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'indigo' | 'cyan' | 'pink';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  green: 'bg-green-dim text-green-500 border-green-500/30',
  amber: 'bg-amber-dim text-amber-500 border-amber-500/30',
  red: 'bg-red-dim text-red-500 border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  gray: 'bg-muted text-muted-foreground border-border',
  indigo: 'bg-accent-dim text-primary border-primary/30',
  cyan: 'bg-cyan-dim text-cyan-500 border-cyan-500/30',
  pink: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
};

export function Tag({ children, variant = 'gray', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
