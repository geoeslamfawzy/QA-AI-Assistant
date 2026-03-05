export interface MockJiraTicket {
  ticketId: string;
  title: string;
  status: string;
  type: string;
  sprint: string;
  assignee: string;
  userStory: string;
  acceptanceCriteria: string[];
  module: string;
}

export const mockJiraTickets: Record<string, MockJiraTicket> = {
  'MOB-1248': {
    ticketId: 'MOB-1248',
    title: 'B2B Portal — Multi-stop Ride Booking',
    status: 'In Progress',
    type: 'Story',
    sprint: 'Sprint 14',
    assignee: 'Ahmed K.',
    userStory:
      'As a Business Admin, I want to book rides with multiple stops so that employees can complete errands during their commute.',
    acceptanceCriteria: [
      'Admin can add up to 3 intermediate stops when booking a ride',
      'Each stop should have a minimum wait time of 5 minutes',
      'Fare estimate should update dynamically when stops are added/removed',
      'Driver app should display all stops in the ride details',
      'Ride summary email should include all stop addresses',
    ],
    module: 'B2B Portal — Book Rides',
  },
  'MOB-1249': {
    ticketId: 'MOB-1249',
    title: 'B2C App — Scheduled Ride Reminders',
    status: 'To Do',
    type: 'Story',
    sprint: 'Sprint 14',
    assignee: 'Sara M.',
    userStory:
      'As a rider, I want to receive reminders before my scheduled ride so that I can be ready on time.',
    acceptanceCriteria: [
      'Push notification 30 minutes before scheduled pickup',
      'Push notification 10 minutes before scheduled pickup',
      'User can disable reminders in app settings',
      'Reminder should include ride details and driver ETA',
    ],
    module: 'B2C Super App — Rides',
  },
  'MOB-1250': {
    ticketId: 'MOB-1250',
    title: 'Admin Panel — Bulk User Import',
    status: 'In Review',
    type: 'Story',
    sprint: 'Sprint 13',
    assignee: 'Omar H.',
    userStory:
      'As a system administrator, I want to import users via CSV so that I can onboard large organizations quickly.',
    acceptanceCriteria: [
      'Support CSV file upload up to 10MB',
      'Validate email format and required fields before import',
      'Show progress bar during import',
      'Generate detailed report of successful and failed imports',
      'Send welcome emails to successfully imported users',
    ],
    module: 'Admin Panel — User Management',
  },
  'MOB-1251': {
    ticketId: 'MOB-1251',
    title: 'Driver App — Earnings Breakdown',
    status: 'In Progress',
    type: 'Story',
    sprint: 'Sprint 14',
    assignee: 'Karim F.',
    userStory:
      'As a driver, I want to see a detailed breakdown of my earnings so that I can understand my income sources.',
    acceptanceCriteria: [
      'Display daily, weekly, and monthly earning summaries',
      'Break down earnings by: base fare, tips, bonuses, promotions',
      'Show comparison with previous period',
      'Allow export of earnings data as PDF',
    ],
    module: 'Driver App — Earnings',
  },
  'MOB-1252': {
    ticketId: 'MOB-1252',
    title: 'Pricing Engine — Surge Pricing Algorithm',
    status: 'To Do',
    type: 'Story',
    sprint: 'Sprint 15',
    assignee: 'Youssef B.',
    userStory:
      'As the pricing system, I need to calculate surge multipliers based on real-time demand so that prices reflect market conditions.',
    acceptanceCriteria: [
      'Calculate surge based on driver supply and ride demand ratio',
      'Cap surge multiplier at 3.0x',
      'Apply surge only when ratio drops below 0.5',
      'Notify users of surge pricing before booking confirmation',
      'Log all surge calculations for audit purposes',
    ],
    module: 'Pricing Engine — Dynamic Pricing',
  },
};

export function getMockJiraTicket(ticketId: string): MockJiraTicket | null {
  // Normalize ticket ID (uppercase)
  const normalizedId = ticketId.toUpperCase();
  return mockJiraTickets[normalizedId] || null;
}

export function getAllMockTicketIds(): string[] {
  return Object.keys(mockJiraTickets);
}
