---
id: "lead-lifecycle"
title: "Lead Lifecycle (CRM) State Machine"
system: "B2B Corporate Portal"
type: "state_machine"
tags: ["lead", "lifecycle", "state", "machine", "rule", "enterprise", "active", "status", "admin"]
dependencies: []
keywords: ["lead", "lifecycle", "state", "machine", "rule", "enterprise", "active", "status", "admin"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "low"
---

# Lead Lifecycle (CRM) State Machine

## Module: leads_management
## Rule Type: crm
## Risk Level: high

---

## Lead States

```
NEW
  ↓
ATTEMPTED_CONTACT
  ↓
CONTACTED
  ↓
QUALIFIED
  ↓
OPEN_DEAL
  ↓         ↓
WON        LOST (terminal)
  ↓
→ [Creates Enterprise in ACTIVE state]
```

## Valid Transitions

| From | To | Actor | Effect |
|------|----|-------|--------|
| NEW | ATTEMPTED_CONTACT | Inside Sales | Status update only |
| ATTEMPTED_CONTACT | CONTACTED | Inside Sales | Status update only |
| CONTACTED | QUALIFIED | Inside Sales | Status update only |
| QUALIFIED | OPEN_DEAL | Inside Sales | Status update only |
| OPEN_DEAL | WON | Inside Sales / Admin | Triggers Enterprise creation |
| OPEN_DEAL | LOST | Inside Sales / Admin | Lead archived |
| Any (except WON/LOST) | LOST | Admin override | Lead archived |
| LOST | Reopen | Admin only | Returns to last active stage |

**No stage skipping permitted.** Example: NEW → WON directly is illegal. System must enforce sequential progression.

## WON State Automated Actions

When status transitions to WON:
1. Create Enterprise record in ACTIVE state
2. Assign the Inside Sales rep as the Enterprise's Sales Representative (permanent attribution)
3. Add "Sourced from Lead" badge to Enterprise profile
4. Lock lead attribution (immutable after conversion)
5. Archive the lead record (no further editing permitted)

All 5 steps must be **atomic** — if Enterprise creation fails, the WON transition must roll back.

## State-Actor Matrix

| State | Inside Sales Can Act | Operations Admin Can Act | System Can Act |
|-------|---------------------|-------------------------|----------------|
| NEW | Yes | Yes | Source tagging at capture |
| ATTEMPTED_CONTACT | Yes | Yes | None |
| CONTACTED | Yes | Yes | None |
| QUALIFIED | Yes | Yes | None |
| OPEN_DEAL | Yes | Yes | None |
| WON | View only | View only | Enterprise creation |
| LOST | View only | Reopen | None |

## Data Isolation Constraints

- Inside Sales reps can only view/edit leads assigned to them
- Unassigned leads (N/A) are visible to Operations Admins only
- Rep deletion → all their leads revert to Unassigned (no data deletion, just reassignment)

Cross-reference: Rule LL-001 through LL-008 in [lead-lifecycle-rules.md]
