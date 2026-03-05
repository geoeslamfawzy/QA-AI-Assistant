---
id: "enterprise-lifecycle-rules"
title: "Enterprise Lifecycle Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["enterprise", "lifecycle", "rules", "rule", "active", "validation", "status", "rider", "driver", "sso"]
dependencies: []
keywords: ["enterprise", "lifecycle", "rules", "rule", "active", "validation", "status", "rider", "driver", "sso"]
related: ["must"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Enterprise Lifecycle Rules

## Module: enterprise_management
## Rule Type: lifecycle
## Risk Level: critical

---

## Rule EL-001: Enterprise Deletion Restriction

**Only Inactive enterprises may be deleted.** Active companies are locked and cannot be deleted to preserve data integrity and prevent orphaning of active riders, drivers, trips, and billing records.

- Validation: System must check `status === 'Inactive'` before DELETE operation
- API must return HTTP 422 with `ACTIVE_ENTERPRISE_CANNOT_BE_DELETED` if attempted on Active account
- Soft-delete must be used to preserve audit trail; FK references must not be broken

## Rule EL-002: Enterprise Deactivation Cascade

When an enterprise is deactivated, the following must cascade **atomically or via guaranteed event queue**:

1. All active rider accounts under the enterprise → suspended (cannot book new trips)
2. All active driver/vehicle assignments → released
3. All SSO/login tokens for enterprise users → invalidated immediately
4. Active scheduled trips → cancelled or flagged for manual resolution
5. Billing cycle → paused or finalized depending on deactivation type (soft vs hard)

Failure to cascade any one item constitutes a CRITICAL data integrity violation.

## Rule EL-003: Enterprise Reactivation

A deactivated enterprise can be reactivated by clicking "Activate Enterprise." Upon reactivation:
- All sub-account suspensions tied to the enterprise deactivation must be lifted
- Billing cycle must resume from reactivation date (not backdated)
- A reactivation audit log entry must be written with actor, timestamp, and reason

## Rule EL-004: Enterprise Status Transition Matrix

Valid state transitions:
```
Pending/Inactive → Active        (Admin approval / reactivation)
Active           → Deactivated   (Admin action)
Deactivated      → Active        (Admin reactivation)
Deactivated      → Deleted       (Admin action — only if Inactive state confirmed)
```

ILLEGAL transitions:
- Active → Deleted (must deactivate first)
- Pending → Deleted (must reject and deactivate first)
- Any terminal deletion → any other state (permanent)

## Rule EL-005: Enterprise Source Tracking

Every enterprise must carry a `source` attribute indicating origin:
- `SELF_REGISTERED` — User registered via B2B Portal
- `ADMIN_CREATED` — Manually registered via Admin Panel
- `LEAD_CONVERTED` — Created from a Won lead (CRM → Enterprise pipeline)

The source indicator must be **immutable** after creation and displayed in the enterprise list grid.

## Rule EL-006: Enterprise Delete Audit Trail

All lifecycle events (Activation, Deactivation, Deletion, Reactivation) must be logged in the Transaction/Audit tab with:
- Actor (admin email or `SYSTEM_TASK_HANDLER`)
- Timestamp (UTC)
- Previous status → New status
- Reason/note (optional but recommended for deletions)

## Rule EL-007: Sales Rep Orphan Prevention

An enterprise cannot exist without an assigned Sales Representative when one was previously set. If the assigned Sales Rep is deleted:
- All their enterprises must be **immediately reassigned** to another rep or unassigned pool
- The system must block Sales Rep deletion until reassignment is confirmed
- Enterprises displaying "N/A" for Sales Rep are permissible only if never assigned

## Summary Matrix

| Action | Precondition | Effect | Reversible? |
|--------|-------------|--------|-------------|
| Activate | Status = Pending or Deactivated | Status = Active | Yes |
| Deactivate | Status = Active | Status = Deactivated | Yes |
| Delete | Status = Inactive/Deactivated | Permanent removal | No |
| Reassign Sales Rep | Any status | Sales Rep field updated | Yes |
