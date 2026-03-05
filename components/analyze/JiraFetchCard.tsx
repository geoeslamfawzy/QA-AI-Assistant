'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Ticket,
  Loader2,
  ArrowRight,
  User,
  Calendar,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export interface JiraTicket {
  ticketId: string;
  title: string;
  status: string;
  type: string;
  sprint: string;
  assignee: string;
  reporter?: string;
  userStory: string;
  acceptanceCriteria: string[];
  labels: string[];
  components?: string[];
  module: string;
  priority?: string;
  figmaLinks?: string[];
  _isMock?: boolean;
}

interface JiraFetchCardProps {
  ticket: JiraTicket | null;
  onFetch: (ticket: JiraTicket) => void;
}

export function JiraFetchCard({ ticket, onFetch }: JiraFetchCardProps) {
  const [ticketId, setTicketId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMockData, setIsMockData] = useState(false);

  const handleFetch = async () => {
    if (!ticketId.trim()) return;

    setIsLoading(true);
    setIsMockData(false);

    try {
      const response = await fetch('/api/jira/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticketId.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch ticket');
      }

      // Check if this is mock data
      const ticketData = data.ticket;
      if (data._isMock || ticketData._isMock) {
        setIsMockData(true);
        toast.info('Using demo data — Jira not configured');
      }

      onFetch(ticketData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
            <Ticket className="h-4 w-4 text-primary" />
          </div>
          Jira Story
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Ticket ID</Label>
          <div className="flex gap-2">
            <Input
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g. CMB-32860"
              className="font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            />
            <Button onClick={handleFetch} disabled={!ticketId.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Fetch
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mock data warning */}
        {isMockData && ticket && (
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs text-amber-600 dark:text-amber-400">
              Using demo data. To fetch real tickets, add your Jira credentials
              to .env.local and restart the server.
            </AlertDescription>
          </Alert>
        )}

        {/* Ticket Details */}
        {ticket && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-accent-dim text-primary hover:bg-accent-dim">
                {ticket.type}
              </Badge>
              <Badge className="bg-amber-dim text-amber-500 hover:bg-amber-dim">
                {ticket.status}
              </Badge>
              {ticket._isMock && (
                <Badge
                  variant="outline"
                  className="text-amber-500 border-amber-500"
                >
                  Mock Data
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm">{ticket.title}</h3>

            {/* User Story */}
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {ticket.userStory}
              </p>
            </div>

            {/* Acceptance Criteria */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Acceptance Criteria
              </p>
              <ul className="space-y-1">
                {ticket.acceptanceCriteria.map((ac, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-foreground"
                  >
                    <span className="text-primary">•</span>
                    {ac}
                  </li>
                ))}
              </ul>
            </div>

            {/* Figma links (if any) */}
            {ticket.figmaLinks && ticket.figmaLinks.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Figma Links
                </p>
                <ul className="space-y-1">
                  {ticket.figmaLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {ticket.sprint}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Layers className="mr-1 h-3 w-3" />
                {ticket.module}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <User className="mr-1 h-3 w-3" />
                {ticket.assignee}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
