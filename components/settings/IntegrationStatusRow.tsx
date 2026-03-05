'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface IntegrationStatusRowProps {
  icon: LucideIcon;
  name: string;
  description: string;
  connected: boolean | null;
  isLoading?: boolean;
}

export function IntegrationStatusRow({
  icon: Icon,
  name,
  description,
  connected,
  isLoading = false,
}: IntegrationStatusRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : connected ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <Badge className="bg-green-dim text-green-500">Connected</Badge>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-muted-foreground">
              Not Connected
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
