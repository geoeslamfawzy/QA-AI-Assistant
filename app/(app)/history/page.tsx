'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  History,
  Search,
  Download,
  RefreshCcw,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface HistoryEntry {
  id: string;
  ticketId: string;
  module: string;
  type: 'analysis' | 'test-cases' | 'bug-report';
  findingsCount: number;
  postedToJira: boolean;
  date: string;
  summary: string;
}

// Mock history data
const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    ticketId: 'MOB-1248',
    module: 'B2B Portal — Book Rides',
    type: 'analysis',
    findingsCount: 5,
    postedToJira: true,
    date: '2024-01-15T10:30:00Z',
    summary: 'Multi-stop booking analysis',
  },
  {
    id: '2',
    ticketId: 'MOB-1245',
    module: 'Payments',
    type: 'test-cases',
    findingsCount: 12,
    postedToJira: true,
    date: '2024-01-15T09:15:00Z',
    summary: 'Payment flow test cases',
  },
  {
    id: '3',
    ticketId: 'MOB-1242',
    module: 'Users & Groups',
    type: 'bug-report',
    findingsCount: 1,
    postedToJira: false,
    date: '2024-01-14T16:45:00Z',
    summary: 'User profile update bug',
  },
  {
    id: '4',
    ticketId: 'MOB-1239',
    module: 'Programs',
    type: 'analysis',
    findingsCount: 3,
    postedToJira: true,
    date: '2024-01-14T14:20:00Z',
    summary: 'Program enrollment analysis',
  },
  {
    id: '5',
    ticketId: 'MOB-1236',
    module: 'Dashboard',
    type: 'test-cases',
    findingsCount: 8,
    postedToJira: true,
    date: '2024-01-13T11:00:00Z',
    summary: 'Dashboard widgets test cases',
  },
];

const modules = [
  'All Modules',
  'B2B Portal — Book Rides',
  'Payments',
  'Users & Groups',
  'Programs',
  'Dashboard',
  'Admin Panel',
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'analysis', label: 'Story Analysis' },
  { value: 'test-cases', label: 'Test Cases' },
  { value: 'bug-report', label: 'Bug Report' },
];

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('All Modules');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEntries(mockHistory);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEntries(mockHistory);
      setIsLoading(false);
      toast.success('History refreshed');
    }, 500);
  };

  const handleExport = () => {
    const csv = [
      ['Ticket', 'Module', 'Type', 'Findings', 'Posted to Jira', 'Date', 'Summary'],
      ...filteredEntries.map((e) => [
        e.ticketId,
        e.module,
        e.type,
        e.findingsCount.toString(),
        e.postedToJira ? 'Yes' : 'No',
        formatDate(e.date),
        e.summary,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qa-history.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as CSV');
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.module.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || entry.type === typeFilter;

    const matchesModule =
      moduleFilter === 'All Modules' || entry.module === moduleFilter;

    return matchesSearch && matchesType && matchesModule;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'analysis':
        return { label: 'Analysis', className: 'bg-accent-dim text-primary' };
      case 'test-cases':
        return { label: 'Test Cases', className: 'bg-green-dim text-green-500' };
      case 'bug-report':
        return { label: 'Bug Report', className: 'bg-red-dim text-red-500' };
      default:
        return { label: type, className: 'bg-muted text-muted-foreground' };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View past analyses, test cases, and bug reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ticket, module, or summary..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
              <History className="h-4 w-4 text-primary" />
            </div>
            Recent Activity
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {filteredEntries.length} entries
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {entries.length === 0
                  ? 'No history recorded yet'
                  : 'No entries match your filters'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-mono text-xs w-28">Ticket</TableHead>
                  <TableHead className="text-xs">Module</TableHead>
                  <TableHead className="text-xs w-28">Type</TableHead>
                  <TableHead className="text-xs w-24 text-center">Findings</TableHead>
                  <TableHead className="text-xs w-32">Posted to Jira</TableHead>
                  <TableHead className="text-xs w-32 text-right">Date</TableHead>
                  <TableHead className="text-xs w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const typeConfig = getTypeConfig(entry.type);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-sm text-primary">
                        {entry.ticketId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{entry.summary}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.module}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeConfig.className}>
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono text-sm">
                          {entry.findingsCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        {entry.postedToJira ? (
                          <Badge className="bg-green-dim text-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Posted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground text-right">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`https://yassir.atlassian.net/browse/${entry.ticketId}`}
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
