'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';

interface ClaudeResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
  isLoading?: boolean;
  parseButtonText?: string;
}

export function ClaudeResponseInput({
  value,
  onChange,
  onParse,
  isLoading = false,
  parseButtonText = 'Parse & Review',
}: ClaudeResponseInputProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Claude's Response
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Paste Claude's analysis output below
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Copy the prompt above, paste it into Claude, then paste Claude's response here..."
          className="min-h-[200px] font-mono text-xs resize-none bg-input"
        />
        <Button
          onClick={onParse}
          disabled={!value.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              {parseButtonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
