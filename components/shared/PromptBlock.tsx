'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PromptBlockProps {
  title: string;
  subtitle?: string;
  content: string;
  onBack?: () => void;
  maxHeight?: string;
}

export function PromptBlock({
  title,
  subtitle,
  content,
  onBack,
  maxHeight = '400px',
}: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-accent-dim px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">— {subtitle}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 text-xs">
              <ChevronLeft className="mr-1 h-3 w-3" />
              Edit inputs
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3 w-3 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea style={{ maxHeight }} className="bg-background">
        <pre className="p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {content}
        </pre>
      </ScrollArea>
    </div>
  );
}
