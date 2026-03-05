---
id: "enterprise-lifecycle"
title: "Enterprise Lifecycle State Machine"
system: "B2B Corporate Portal"
type: "state_machine"
tags: ["enterprise", "lifecycle", "state", "machine", "rule", "admin", "active", "user", "referral", "trip"]
dependencies: []
keywords: ["enterprise", "lifecycle", "state", "machine", "rule", "admin", "active", "user", "referral", "trip"]
related: ["must"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Enterprise Lifecycle State Machine

## Module: enterprise_management
## Rule Type: lifecycle
## Risk Level: critical

---

## Enterprise States

```
PENDING_REVIEW
    ↓ (Admin: Activate)     ↓ (Admin: Reject)
  ACTIVE                REJECTED/INACTIVE
    ↓ (Admin: Deactivate)
  DEACTIVATED
    ↓ (Admin: Delete — only from DEACTIVATED)
  DELETED (terminal)
    ↑ (Admin: Reactivate)
  ACTIVE ← DEACTIVATED
```

## Valid Transitions

| From | To | Actor | Conditions |
|------|----|-------|-----------|
| PENDING_REVIEW | ACTIVE | Operations Admin | Review passed, billing configured |
| PENDING_REVIEW | REJECTED | Operations Admin | Review failed |
| ACTIVE | DEACTIVATED | Operations Admin | No conditions required |
| DEACTIVATED | ACTIVE | Operations Admin | Reactivation approved |
| DEACTIVATED | DELETED | Operations Admin | Permanent — irreversible |
| ACTIVE | DELETED | BLOCKED | Must deactivate first (EL-001) |

## State Effects

**PENDING_REVIEW**:
- User is blocked from B2B Portal dashboard
- Notification sent to Operations Team for review
- No billing activity

**ACTIVE**:
- Full B2B Portal access for all authorized users
- Trips can be booked and charged
- Billing cycles active
- Referral links active

**DEACTIVATED**:
- All enterprise users lose portal access (sessions invalidated)
- No new trip bookings permitted
- In-flight trips: grace period policy must be defined
- Billing cycle: paused or final invoice generated
- Data preserved for reactivation

**REJECTED**:
- User receives rejection notification
- Account exists but access blocked permanently (unless manually corrected)
- Can be converted back to ACTIVE only by explicit admin override

**DELETED** (terminal):
- Only reachable from DEACTIVATED state
- Permanent removal from system
- Audit trail preserved (soft delete or archive)
- All FK references must be handled (sales rep, riders, trips, invoices)

## Sub-Account Cascade Rules

When enterprise status changes, sub-accounts inherit:

| Enterprise State | Sub-Account Riders | Sub-Account Drivers | Fleet |
|-----------------|-------------------|--------------------|----|
| ACTIVE | Active | Active | Active |
| DEACTIVATED | Suspended | Released from assignments | Released |
| DELETED | Archived | Unlinked | Unlinked |

Cascade must be atomic (same transaction) or via guaranteed event queue with dead-letter handling.

## Lead-to-Enterprise State Entry Point

Enterprises created via Lead conversion (Won status) enter directly at ACTIVE state — they bypass the PENDING_REVIEW stage. This is because the Inside Sales qualification process serves as the review.

Cross-reference: See [lead-lifecycle.md] for the Lead state machine.
