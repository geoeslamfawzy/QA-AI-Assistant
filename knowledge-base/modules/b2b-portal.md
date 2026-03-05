---
id: "b2b-portal"
title: "B2B Corporate Portal Module"
system: "B2B Corporate Portal"
type: "module"
tags: ["corporate", "portal", "module", "ride", "login", "sso", "pending", "country", "cashback", "status"]
dependencies: []
keywords: ["corporate", "portal", "module", "ride", "login", "sso", "pending", "country", "cashback", "status"]
related: ["ra-001"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# B2B Corporate Portal Module

## Purpose
A dedicated platform for external businesses (corporate clients) to manage employee transportation. Enables companies to configure ride programs, manage users/groups, track trips, handle payments, and manage referrals.

## Modules

### Authentication
- Login via: Google SSO, Email+Password, Phone Number
- Registration: 4-step flow (email → security → company profile → pending review)
- Country auto-detection from phone prefix

### Dashboard
- Onboarding progress indicator (1/3 steps)
- Cashback status widget
- Rides overview chart (14-day time series)
- Members and Groups snapshot
- Financial Overview (adapts: Prepaid wallet vs Postpaid budget)
- Referrals section

### Users & Groups
- User roles: Super Admin, Business Admin, Program Moderator, Rider
- Single Super Admin policy (enforced — see RA-001)
- Group management with member migration on deletion
- Bulk user invitation (email, phone, CSV upload)

### Programs
- Define ride eligibility: schedule, geo-fencing, budget limits, service types
- Deactivation requires group transfer first
- Deletion requires deactivation first
- Auto-approval vs manual approval toggle

### Book Rides
- Book for self, member, or guest
- Instant and scheduled trips
- Multi-stop support
- Repeat booking for scheduled trips
- Trip statuses: PENDING, ACCEPTED, DRIVER_ARRIVED, STARTED, FINISHED, CANCELLED variants, ADJUSTED

### Payments
- Prepaid: wallet balance + top-up
- Postpaid: budget limit + monthly invoices + Pay Due Budget
- Monthly invoice access

### Trips
- Full trip history with filters
- Export (max 31-day range, async email delivery)
- Re-booking from trip history

### Referrals
- B2B company-to-company referral
- Invite via link or email
- Pending vs Completed referral tracking
- Rules: Enterprise custom > Country default

### Business Challenge
- View active challenges (missions)
- Progress tracking per tier

### Gift Cards
- Purchase gift card vouchers for employees/guests
- Budget validation before purchase (wallet check)
- Voucher code issuance
- Revocation with refund to company wallet

### Support
- Searchable knowledge base
- Video training content
- Direct contact to Key Account Manager

## Cross-Module Dependencies
- Programs → Services Config (service availability)
- Payments → Wallet (balance deductions)
- Referrals → Wallet (reward credits)
- Gift Cards → Payments (deduction at purchase)
- Users → Auth (session management)
