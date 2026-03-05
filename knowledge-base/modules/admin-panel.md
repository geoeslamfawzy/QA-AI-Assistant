---
id: "admin-panel"
title: "Admin Panel System Module"
system: "Admin Panel"
type: "module"
tags: ["admin", "panel", "system", "module", "enterprise", "country", "payment", "status", "city", "commission"]
dependencies: []
keywords: ["admin", "panel", "system", "module", "enterprise", "country", "payment", "status", "city", "commission"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Admin Panel System Module

## Purpose
Internal management tool for Yassir Operations, Sales, and Support teams. Manages enterprise accounts, financial configuration, legal compliance, CRM, and system configuration.

## Architecture: Country-Isolated

All Admin Panel modules operate within the context of the selected **Country Selector** in the top navigation. Switching countries changes the data scope entirely.

## Modules

### Enterprises
- Master registry of all B2B clients
- CRUD operations (Create, Read, Update, Delete — Delete only if Inactive)
- Filtering: date, payment plan, status, city, sales rep
- Enterprise source indicators: Self-registered, Admin-created, Lead-converted

### Enterprise Details (7 Tabs)
1. **Enterprise Information**: Profile, commission %, discount/rebate config, legal info, enterprise type
2. **User Management**: All enterprise users, role management, Super Admin enforcement, OTP bypass
3. **Payments**: Budget/wallet management, top-up, invoice generation, payment status
4. **Transactions**: Full audit log of all financial and operational events
5. **Trips**: Trip history for enterprise's employees, export functionality
6. **Settings**: Enterprise lifecycle (Activate/Deactivate/Delete), referral assignment, cashback
7. **Referrals**: Enterprise-specific referral performance and rule configuration

### Review Legal Info
- Work queue for legal document validation
- Review → Accept or Reject legal submissions
- Documents: NIF, NIS, RC, AI certificates

### Manage Admins
- **All Administrators**: Full directory of internal Yassir employees with permission management
- **Sales Representatives**: Manage enterprise-to-rep assignments, deletion with enterprise reassignment
- **Inside Sales**: Restricted role for CRM-focused employees (see role rules)

### Country Reports
- Bulk invoice generation for all enterprises in a country
- Monthly Finance Reports export (CSV with detailed columns)
- Date-range reports for country-wide financial performance

### Leads Management (CRM)
- Lead pipeline: New → Attempted Contact → Contacted → Qualified → Open Deal → Won/Lost
- Lead capture with auto-detection (country from phone prefix)
- B2C exclusion filter
- Won → auto-creates Enterprise with sales rep attribution
- Assignment/reassignment with single or bulk options

### Services Config
- Country-scoped service catalog management
- Bulk enable/disable for all enterprises in country
- Per-enterprise granular toggle
- Usage metrics per service type

### Notifications
- Create and schedule in-app push notifications for B2B clients
- Target by: enterprise, city, payment plan, user role
- Instant or scheduled delivery
- Max 150 character content limit

### Global Referral Module
- Define country-level default referral rules
- Segmented by payment plan (Prepaid/Postpaid toggles)
- Statistics: total referrers, total enterprises

### Challenges
- Create time-bound incentive campaigns (missions)
- Tier-based reward structure (up to 10 tiers, cumulative cap ≤ 100%)
- Lifecycle: UPCOMING (editable) → ONGOING (locked) → COMPLETED/EXPIRED
- Cannot overlap dates with existing challenges for same target companies

### Yassir's Legal Info
- View Yassir's own legal documents (read-only for most admins)

### Gift Cards (Admin Panel)
- Create country-specific gift card templates
- Manage template lifecycle (Active → Inactive or Delete if unused)
- Usage reporting with trip-level audit trail
- Templates: country-locked, amount, theme/design

## Cross-Module Dependencies
- Leads → Enterprises (Won conversion)
- Enterprises → Payments (commission, billing)
- Challenges → Invoices (discount application)
- Services Config → Programs (service availability)
- Notifications → Enterprises (audience targeting)
- Admin Users → Auth (permission enforcement)
