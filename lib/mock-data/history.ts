export type HistoryItemType = 'story-analysis' | 'test-cases' | 'bug-report';
export type HistoryItemStatus = 'draft' | 'posted' | 'pending';

export interface HistoryItem {
  id: string;
  ticketId: string;
  ticketTitle: string;
  module: string;
  type: HistoryItemType;
  findingsCount: number;
  status: HistoryItemStatus;
  createdAt: string;
  updatedAt: string;
}

export const mockHistoryItems: HistoryItem[] = [
  {
    id: 'hist-001',
    ticketId: 'MOB-1248',
    ticketTitle: 'B2B Portal — Multi-stop Ride Booking',
    module: 'B2B Portal',
    type: 'story-analysis',
    findingsCount: 4,
    status: 'posted',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
  },
  {
    id: 'hist-002',
    ticketId: 'MOB-1248',
    ticketTitle: 'B2B Portal — Multi-stop Ride Booking',
    module: 'B2B Portal',
    type: 'test-cases',
    findingsCount: 12,
    status: 'posted',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'hist-003',
    ticketId: 'MOB-1249',
    ticketTitle: 'B2C App — Scheduled Ride Reminders',
    module: 'B2C Super App',
    type: 'story-analysis',
    findingsCount: 2,
    status: 'draft',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 'hist-004',
    ticketId: 'MOB-1250',
    ticketTitle: 'Admin Panel — Bulk User Import',
    module: 'Admin Panel',
    type: 'story-analysis',
    findingsCount: 5,
    status: 'posted',
    createdAt: '2024-01-14T16:20:00Z',
    updatedAt: '2024-01-14T17:00:00Z',
  },
  {
    id: 'hist-005',
    ticketId: 'MOB-1250',
    ticketTitle: 'Admin Panel — Bulk User Import',
    module: 'Admin Panel',
    type: 'test-cases',
    findingsCount: 8,
    status: 'pending',
    createdAt: '2024-01-14T17:30:00Z',
    updatedAt: '2024-01-14T17:30:00Z',
  },
  {
    id: 'hist-006',
    ticketId: 'MOB-1251',
    ticketTitle: 'Driver App — Earnings Breakdown',
    module: 'Driver App',
    type: 'bug-report',
    findingsCount: 1,
    status: 'posted',
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-17T11:15:00Z',
  },
  {
    id: 'hist-007',
    ticketId: 'MOB-1252',
    ticketTitle: 'Pricing Engine — Surge Pricing Algorithm',
    module: 'Pricing Engine',
    type: 'story-analysis',
    findingsCount: 6,
    status: 'draft',
    createdAt: '2024-01-17T14:00:00Z',
    updatedAt: '2024-01-17T14:00:00Z',
  },
  {
    id: 'hist-008',
    ticketId: 'MOB-1243',
    ticketTitle: 'B2B Portal — Employee Ride History',
    module: 'B2B Portal',
    type: 'test-cases',
    findingsCount: 15,
    status: 'posted',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
  },
  {
    id: 'hist-009',
    ticketId: 'MOB-1240',
    ticketTitle: 'Super App — Payment Method Management',
    module: 'B2C Super App',
    type: 'story-analysis',
    findingsCount: 3,
    status: 'posted',
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-10T10:45:00Z',
  },
  {
    id: 'hist-010',
    ticketId: 'MOB-1238',
    ticketTitle: 'Analytics — Driver Performance Dashboard',
    module: 'Analytics',
    type: 'bug-report',
    findingsCount: 1,
    status: 'posted',
    createdAt: '2024-01-09T15:00:00Z',
    updatedAt: '2024-01-09T15:20:00Z',
  },
];

export function getMockHistory(filters?: {
  type?: HistoryItemType;
  module?: string;
  search?: string;
}): HistoryItem[] {
  let items = [...mockHistoryItems];

  if (filters?.type) {
    items = items.filter((item) => item.type === filters.type);
  }

  if (filters?.module) {
    items = items.filter((item) =>
      item.module.toLowerCase().includes(filters.module!.toLowerCase())
    );
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.ticketId.toLowerCase().includes(searchLower) ||
        item.ticketTitle.toLowerCase().includes(searchLower)
    );
  }

  // Sort by updatedAt descending
  items.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return items;
}

export function getHistoryStats() {
  return {
    totalStories: mockHistoryItems.filter((i) => i.type === 'story-analysis')
      .length,
    totalTestCases: mockHistoryItems
      .filter((i) => i.type === 'test-cases')
      .reduce((sum, i) => sum + i.findingsCount, 0),
    totalBugReports: mockHistoryItems.filter((i) => i.type === 'bug-report')
      .length,
    postedToJira: mockHistoryItems.filter((i) => i.status === 'posted').length,
  };
}
