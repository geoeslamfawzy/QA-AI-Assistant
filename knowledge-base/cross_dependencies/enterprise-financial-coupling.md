---
id: "enterprise-financial-coupling"
title: "Cross-Module: Enterprise ↔ Financial Systems"
system: "B2B Corporate Portal"
type: "cross_dependency"
tags: ["cross", "module", "enterprise", "financial", "systems", "wallet", "payment", "budget", "limit", "trip"]
dependencies: []
keywords: ["cross", "module", "enterprise", "financial", "systems", "wallet", "payment", "budget", "limit", "trip"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Cross-Module: Enterprise ↔ Financial Systems

## Dependencies: enterprise_management ↔ payments ↔ wallet ↔ invoicing

---

## Key Coupling Points

### 1. Enterprise Activation → Billing Initialization
When an enterprise is activated:
- Payment plan (Prepaid/Postpaid) must be configured
- For Prepaid: Wallet record created with zero balance
- For Postpaid: Budget Limit record created
- First trip booking must be blocked until billing is configured

### 2. Commission Rate → Trip Pricing
- Commission % stored on the enterprise record
- Applied at trip fare calculation time
- Rate changes affect only NEW trips (locked at REQUESTED state)

### 3. Enterprise Deactivation → Billing Freeze
When an enterprise is deactivated:
- Prepaid: Wallet deductions paused; balance preserved
- Postpaid: Invoice generation finalized for current period or paused
- Outstanding invoices remain due (deactivation doesn't cancel debt)

### 4. Enterprise Deletion → Financial Record Archival
- All transaction records must be preserved even after enterprise deletion
- FK to enterprise_id must use soft-delete pattern (NULL-safe or archived reference)
- Historical invoices must remain accessible for audit/tax purposes

## Required Checks in ACs

- Is billing configured before first trip is permitted?
- Is commission rate locked at trip REQUESTED time?
- Are invoices preserved after enterprise deletion?
- Is wallet balance handled during plan switch?

## Data Integrity Risks

- Enterprise deleted while invoice is being processed → payment orphaned
- Commission rate updated mid-trip → wrong fare charged
- Wallet deduction race during enterprise deactivation → negative balance
- Budget limit reduction below current usage → trips fail unexpectedly

## Affected Modules

`enterprise_management` ↔ `payments` ↔ `invoicing` ↔ `trip_management`
