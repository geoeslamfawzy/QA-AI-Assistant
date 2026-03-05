---
id: "leads-to-enterprise-conversion"
title: "Cross-Module: Leads → Enterprise Conversion"
system: "B2B Corporate Portal"
type: "cross_dependency"
tags: ["cross", "module", "leads", "enterprise", "conversion", "auth", "status", "active", "trip", "state"]
dependencies: []
keywords: ["cross", "module", "leads", "enterprise", "conversion", "auth", "status", "active", "trip", "state"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Cross-Module: Leads → Enterprise Conversion

## Dependencies: leads_management ↔ enterprise_management ↔ payments ↔ auth

---

## Trigger
Lead status transitions to **WON** in the Leads Management module.

## Side Effects (All Must Be Atomic)

1. **Enterprise created** in Enterprise module with status ACTIVE
2. **Sales rep attributed** permanently to the new enterprise (locked, immutable)
3. **"Sourced from Lead" badge** applied to enterprise profile
4. **Lead record archived** (no further editing from Leads module)
5. **Billing initialization** must occur (Prepaid/Postpaid plan must be configured before first trip)

## Required Checks in ACs

- Is the enterprise creation atomic with the WON transition? (partial state = critical bug)
- Is the attribution lock enforced in the database (not just application layer)?
- What happens if the Enterprise creation API fails? Does the lead remain WON with no enterprise?
- Is a rollback mechanism defined for failed conversions?
- Is the Sales Rep notified of the new enterprise assignment?
- Does the "Sourced from Lead" indicator appear in the enterprise list grid?

## Data Integrity Risks

- Lead marked WON but Enterprise creation fails → orphaned WON lead with no enterprise
- Duplicate enterprise created if WON event is delivered twice (webhook retry, double-click)
- Attribution assigned to wrong rep if rep is reassigned between WON submission and database write

## Affected Modules

`leads_management` → `enterprise_management` → `payments` → `auth` → `notifications`
