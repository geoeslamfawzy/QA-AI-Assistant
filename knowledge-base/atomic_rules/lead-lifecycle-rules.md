---
id: "lead-lifecycle-rules"
title: "Lead Lifecycle (CRM) Rules"
system: "B2C WebApp"
type: "atomic_rule"
tags: ["lead", "lifecycle", "rules", "rule", "admin", "enterprise", "status", "rider", "country", "city"]
dependencies: []
keywords: ["lead", "lifecycle", "rules", "rule", "admin", "enterprise", "status", "rider", "country", "city"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Lead Lifecycle (CRM) Rules

## Module: leads_management
## Rule Type: crm
## Risk Level: high

---

## Rule LL-001: Lead Pipeline Stages

Leads must progress through a strictly defined pipeline. Only forward progression through defined stages is permitted (no skipping, no backward transitions except explicit rejection):

```
New → Attempted Contact → Contacted → Qualified → Open Deal → Won | Lost
```

Each stage transition must be manually confirmed by the assigned Inside Sales rep or Operations Admin. Automated stage skipping is not permitted.

## Rule LL-002: Lead-to-Enterprise Conversion (Won Transition)

When a lead status is updated to **"Won"**:

1. **Automated action**: System moves the record from Leads module to Enterprises module
2. **Attribution lock**: The Inside Sales admin assigned at conversion is permanently recorded as the Sales Representative in the new enterprise's settings — **immutable after conversion**
3. **Source label**: The created Enterprise profile must display a "Sourced from a Lead" indicator (icon/badge)
4. **Irreversibility**: A Won lead cannot be re-opened or reverted to a previous stage

This conversion is a critical business event — any failure mid-conversion must roll back completely (no orphaned enterprise without lead, no lead marked Won without enterprise created).

## Rule LL-003: B2C Exclusion Filter

The Leads dashboard must apply a strict filter: **only B2B leads** (submitted via dedicated B2B contact forms) are displayed.

- Generic B2C Rider accounts are excluded from the leads pipeline
- This filter prevents pipeline contamination and quality degradation
- Filter must be enforced at the query level, not just in the UI layer
- Leads from B2C channels must be silently routed to a separate queue or discarded

## Rule LL-004: Lead Auto-Detection Rules

At lead capture (web form submission):
- **Country auto-detection**: Country field must automatically populate and **lock** based on the international dialing code in the Phone Number field (e.g., +213 → Algeria)
- The country cannot be manually overridden by the submitter after auto-detection
- **Mandatory fields**: First Name, Last Name, Email, Phone, Country, City, Company Name — all required for submission
- **Source tagging**: Every lead must be auto-tagged with its origin (e.g., "Lead from website", "Lead from marketing campaign")

## Rule LL-005: Lead Assignment and Reassignment

**Initial assignment**: Operations Admins can assign leads to Inside Sales reps from the dashboard.

**Reassignment logic** — when changing the assigned rep, system must enforce a choice:
- Option A: "Change for only this selected lead" (single transfer)
- Option B: "Reassign all leads linked to the previous sales rep to the new one" (bulk handover)

Both options must show a confirmation modal with the count of affected leads.

## Rule LL-006: Orphaned Lead Prevention (On Inside Sales Rep Deletion)

When an Inside Sales Rep is deleted (full system deletion):
- ALL leads currently assigned to that rep must **immediately revert to "Unassigned" (N/A)** status
- The system must not allow deletion until the admin has been informed of the affected lead count
- Historical lead records (Won/Lost) must retain the deleted rep's name for audit purposes (soft reference)

## Rule LL-007: Inside Sales Access Restriction

Inside Sales users have a restricted data view:
- Can only see leads **currently assigned to them** — not the full leads database
- Cannot access the full Enterprise directory unless granted separate elevated permissions
- Dashboard redirect: Upon login, Inside Sales users are redirected specifically to Leads Management
- Attempting to access Enterprises module without permission must return HTTP 403

## Rule LL-008: Legacy Data Handling

Leads created before the introduction of the "Inside Sales" role:
- Display an empty "Inside Sales" field (null/blank) — not an error
- Must be manually assigned to a rep if needed
- Must not be automatically assigned to any rep (no default assignment)

## Summary Matrix

| Transition | Actor | Automated Effect | Reversible? |
|------------|-------|-----------------|-------------|
| New → Attempted Contact | Inside Sales | None | Yes |
| Any → Won | Inside Sales / Admin | Create Enterprise, lock attribution | No |
| Any → Lost | Inside Sales / Admin | Lead archived | Reopen only by Admin |
| Rep deleted | System | All leads → Unassigned | Manual reassignment |
| Lead captured | System | Auto-detect country, tag source | Country lock |
