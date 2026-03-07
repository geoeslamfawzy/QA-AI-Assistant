/**
 * Ticket Parser for Context Sync Service.
 *
 * Parses JiraTicket objects into ParsedTicket format and groups them by module.
 */

import type { JiraTicket } from '@/lib/jira';
import type { ParsedTicket, DetectedModule, ModuleRule } from './types';

// ────────────────────────────────────
// MODULE DETECTION RULES
// ────────────────────────────────────

/**
 * Enhanced module detection rules with slugs.
 * Extends the rules from lib/jira/client.ts with file-safe slugs.
 */
const MODULE_RULES: ModuleRule[] = [
  // B2B Portal modules
  {
    name: 'B2B Portal — Login & Registration',
    slug: 'b2b-portal-login',
    keywords: ['login', 'auth', 'sign in', 'sso', 'registration', 'onboard', 'magic link', 'otp'],
  },
  {
    name: 'B2B Portal — Dashboard',
    slug: 'b2b-portal-dashboard',
    keywords: ['dashboard', 'home page', 'widget', 'landing', 'quick stats'],
  },
  {
    name: 'B2B Portal — Users & Groups',
    slug: 'b2b-portal-users-groups',
    keywords: ['users', 'groups', 'invite', 'members', 'team', 'csv', 'bulk'],
  },
  {
    name: 'B2B Portal — Programs',
    slug: 'b2b-portal-programs',
    keywords: ['program', 'ride schedule', 'geo-fence', 'geofenc', 'frequency', 'permissions'],
  },
  {
    name: 'B2B Portal — Book Rides',
    slug: 'b2b-portal-book-rides',
    keywords: ['book ride', 'booking', 'multi-stop', 'ride request', 'scheduled ride', 'instant ride'],
  },
  {
    name: 'B2B Portal — Payments',
    slug: 'b2b-portal-payments',
    keywords: ['payment', 'prepaid', 'postpaid', 'wallet', 'top-up', 'invoice', 'budget'],
  },
  {
    name: 'B2B Portal — Trips',
    slug: 'b2b-portal-trips',
    keywords: ['trips', 'trip history', 'ride history', 'export ride'],
  },
  {
    name: 'B2B Portal — Account',
    slug: 'b2b-portal-account',
    keywords: ['account', 'profile', 'legal info', 'password', 'settings', 'saved address', 'favorite address'],
  },
  {
    name: 'B2B Portal — Referrals',
    slug: 'b2b-portal-referrals',
    keywords: ['referral', 'refer'],
  },
  {
    name: 'B2B Portal — Business Challenge',
    slug: 'b2b-portal-challenge',
    keywords: ['challenge', 'gamification', 'badge', 'tier'],
  },
  {
    name: 'B2B Portal — Gift Cards',
    slug: 'b2b-portal-gift-cards',
    keywords: ['gift card', 'voucher', 'giftcard'],
  },
  {
    name: 'B2B Portal — Support',
    slug: 'b2b-portal-support',
    keywords: ['support', 'faq', 'help center', 'helpline', 'tutorial'],
  },

  // Admin Panel modules
  {
    name: 'Admin Panel — Enterprises',
    slug: 'admin-panel-enterprises',
    keywords: ['enterprise', 'admin panel', 'admin enterprise', 'onboard'],
  },
  {
    name: 'Admin Panel — Payments',
    slug: 'admin-panel-payments',
    keywords: ['admin payment', 'admin invoice', 'admin budget', 'commission'],
  },
  {
    name: 'Admin Panel — Users',
    slug: 'admin-panel-users',
    keywords: ['admin user', 'verify user', 'reinvite', 'admin rider'],
  },
  {
    name: 'Admin Panel — Legal',
    slug: 'admin-panel-legal',
    keywords: ['legal info', 'review legal', 'nif', 'nis', 'contract'],
  },
  {
    name: 'Admin Panel — Settings',
    slug: 'admin-panel-settings',
    keywords: ['admin setting', 'deactivate enterprise', 'sales rep'],
  },

  // B2C WebApp modules
  {
    name: 'B2C WebApp — Auth',
    slug: 'b2c-webapp-auth',
    keywords: ['b2c login', 'b2c auth', 'phone verification', 'b2c register'],
  },
  {
    name: 'B2C WebApp — Ride Booking',
    slug: 'b2c-webapp-booking',
    keywords: ['b2c ride', 'b2c booking', 'web booking', 'b2c book'],
  },
  {
    name: 'B2C WebApp — Promotions',
    slug: 'b2c-webapp-promotions',
    keywords: ['promo', 'promotion', 'coupon', 'promo code'],
  },
  {
    name: 'B2C WebApp — Ride History',
    slug: 'b2c-webapp-ride-history',
    keywords: ['b2c ride history', 'b2c trip'],
  },
  {
    name: 'B2C WebApp — Support',
    slug: 'b2c-webapp-support',
    keywords: ['b2c support', 'helpline'],
  },

  // Other systems
  {
    name: 'Pricing & Promotions Engine',
    slug: 'pricing-engine',
    keywords: ['pricing', 'dynamic pricing', 'fare', 'surge'],
  },
  {
    name: 'DashOps',
    slug: 'dashops',
    keywords: ['dashops', 'operational dashboard', 'command center'],
  },
  {
    name: 'Super App — Mobile',
    slug: 'super-app-mobile',
    keywords: ['super app', 'mobile app', 'rider app'],
  },
  {
    name: 'Driver App',
    slug: 'driver-app',
    keywords: ['driver app', 'driver'],
  },
];

// ────────────────────────────────────
// MODULE DETECTION
// ────────────────────────────────────

/**
 * Detect which module a ticket belongs to based on its content.
 * Returns both the module name and a file-safe slug.
 */
export function detectModuleWithSlug(ticket: {
  title: string;
  description: string;
  labels: string[];
  components: string[];
}): DetectedModule {
  const text = [
    ...ticket.labels,
    ...ticket.components,
    ticket.title,
    ticket.description.substring(0, 500),
  ]
    .join(' ')
    .toLowerCase();

  for (const rule of MODULE_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return { name: rule.name, slug: rule.slug };
    }
  }

  return { name: 'Uncategorized', slug: 'uncategorized' };
}

// ────────────────────────────────────
// TICKET PARSING
// ────────────────────────────────────

/**
 * Parse a JiraTicket into a ParsedTicket for context generation.
 */
export function parseTicket(ticket: JiraTicket): ParsedTicket {
  // Get module with slug
  const module = detectModuleWithSlug({
    title: ticket.title,
    description: ticket.userStory,
    labels: ticket.labels,
    components: ticket.components,
  });

  return {
    ticketId: ticket.ticketId,
    title: ticket.title,
    module: module.name,
    moduleSlug: module.slug,
    userStory: ticket.userStory,
    description: ticket.userStory, // userStory contains the parsed description
    acceptanceCriteria: ticket.acceptanceCriteria,
    type: ticket.type as 'Task' | 'Story',
    status: ticket.status,
    priority: ticket.priority,
    created: new Date(ticket.created),
    updated: new Date(ticket.updated),
    labels: ticket.labels,
    components: ticket.components,
  };
}

/**
 * Parse multiple tickets and group them by module.
 * Returns a Map where keys are module slugs and values are arrays of tickets.
 */
export function parseAndGroupTickets(
  tickets: JiraTicket[]
): Map<string, { name: string; slug: string; tickets: ParsedTicket[] }> {
  const moduleMap = new Map<string, { name: string; slug: string; tickets: ParsedTicket[] }>();

  for (const ticket of tickets) {
    const parsed = parseTicket(ticket);

    if (!moduleMap.has(parsed.moduleSlug)) {
      moduleMap.set(parsed.moduleSlug, {
        name: parsed.module,
        slug: parsed.moduleSlug,
        tickets: [],
      });
    }

    moduleMap.get(parsed.moduleSlug)!.tickets.push(parsed);
  }

  return moduleMap;
}

/**
 * Get all available module rules.
 * Useful for UI display or validation.
 */
export function getModuleRules(): ModuleRule[] {
  return MODULE_RULES;
}
