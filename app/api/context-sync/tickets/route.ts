/**
 * Tickets API Route for the Ticket Browser.
 *
 * GET /api/context-sync/tickets — Get paginated tickets with filtering
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 50, max: 100)
 * - module: string (filter by module slug)
 * - status: string (filter by status)
 * - search: string (search in title, ticketId)
 * - sortBy: 'created' | 'updated' | 'title' (default: 'created')
 * - sortOrder: 'asc' | 'desc' (default: 'asc')
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadTicketsIndex } from '@/lib/context-sync/sync-state';
import type { IndexedTicket } from '@/lib/context-sync/types';

export const dynamic = 'force-dynamic';

interface TicketsResponse {
  success: boolean;
  data?: {
    tickets: IndexedTicket[];
    pagination: {
      page: number;
      limit: number;
      totalTickets: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      modules: { slug: string; name: string; count: number }[];
      statuses: { status: string; count: number }[];
    };
    lastUpdated: string;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<TicketsResponse>> {
  try {
    const index = await loadTicketsIndex();

    if (!index) {
      return NextResponse.json(
        {
          success: false,
          error: 'No tickets index found. Run a Jira sync first.',
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const moduleFilter = searchParams.get('module') || '';
    const statusFilter = searchParams.get('status') || '';
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const sortBy = searchParams.get('sortBy') || 'created';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let filtered = [...index.tickets];

    // Apply module filter
    if (moduleFilter) {
      filtered = filtered.filter((t) => t.moduleSlug === moduleFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (t) => t.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search filter (search in ticketId and title)
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(search) ||
          t.title.toLowerCase().includes(search) ||
          (t.userStory && t.userStory.toLowerCase().includes(search))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: string;
      let bVal: string;

      switch (sortBy) {
        case 'updated':
          aVal = a.updated;
          bVal = b.updated;
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'created':
        default:
          aVal = a.created;
          bVal = b.created;
          break;
      }

      const cmp = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    // Calculate pagination
    const totalTickets = filtered.length;
    const totalPages = Math.ceil(totalTickets / limit);
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    // Build filter options with CASCADING counts
    // Status counts: calculated from tickets AFTER module filter is applied
    // Module counts: calculated from tickets AFTER status filter is applied

    // Apply module filter only (for status counts)
    let ticketsForStatusCounts = [...index.tickets];
    if (moduleFilter) {
      ticketsForStatusCounts = ticketsForStatusCounts.filter((t) => t.moduleSlug === moduleFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      ticketsForStatusCounts = ticketsForStatusCounts.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          (t.userStory && t.userStory.toLowerCase().includes(q))
      );
    }

    // Apply status filter only (for module counts)
    let ticketsForModuleCounts = [...index.tickets];
    if (statusFilter) {
      ticketsForModuleCounts = ticketsForModuleCounts.filter(
        (t) => t.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      ticketsForModuleCounts = ticketsForModuleCounts.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          (t.userStory && t.userStory.toLowerCase().includes(q))
      );
    }

    // Calculate module counts (from status-filtered set)
    const moduleMap = new Map<string, { name: string; count: number }>();
    for (const t of ticketsForModuleCounts) {
      if (!moduleMap.has(t.moduleSlug)) {
        moduleMap.set(t.moduleSlug, { name: t.module, count: 0 });
      }
      moduleMap.get(t.moduleSlug)!.count++;
    }

    // Calculate status counts (from module-filtered set)
    const statusMap = new Map<string, number>();
    for (const t of ticketsForStatusCounts) {
      statusMap.set(t.status, (statusMap.get(t.status) || 0) + 1);
    }

    const modules = Array.from(moduleMap.entries())
      .map(([slug, data]) => ({ slug, name: data.name, count: data.count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const statuses = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: {
        tickets: paginated,
        pagination: {
          page,
          limit,
          totalTickets,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters: {
          modules,
          statuses,
        },
        lastUpdated: index.lastUpdated,
      },
    });
  } catch (error) {
    console.error('[Tickets API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
