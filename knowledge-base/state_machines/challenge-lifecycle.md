---
id: "challenge-lifecycle"
title: "Challenge Lifecycle State Machine"
system: "B2B Corporate Portal"
type: "state_machine"
tags: ["challenge", "lifecycle", "state", "machine", "rule", "admin", "trip", "enterprise", "discount", "invoice"]
dependencies: []
keywords: ["challenge", "lifecycle", "state", "machine", "rule", "admin", "trip", "enterprise", "discount", "invoice"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Challenge Lifecycle State Machine

## Module: challenges
## Rule Type: lifecycle
## Risk Level: high

---

## Challenge States

```
[Created] → UPCOMING → ONGOING → COMPLETED
                 ↓              ↓
             DISABLED       EXPIRED
```

## Valid Transitions

| From | To | Trigger | Modifiable? |
|------|----|---------|-------------|
| Created | UPCOMING | Start date in future | Yes |
| UPCOMING | ONGOING | Start date reached (automated) | Locked after ONGOING |
| UPCOMING | DISABLED | Admin manual action | Yes |
| ONGOING | COMPLETED | End date reached + criteria met | Locked |
| ONGOING | EXPIRED | End date reached + criteria not met | Locked |
| DISABLED | UPCOMING | Admin re-enables | Yes |

## Edit/Delete/Deactivate Permissions by State

| State | Edit | Delete | Deactivate |
|-------|------|--------|------------|
| UPCOMING | ✅ Yes | ✅ Yes | ✅ Yes |
| ONGOING | ❌ No | ❌ No | ❌ No |
| COMPLETED | ❌ No | ❌ No | ❌ No |
| EXPIRED | ❌ No | ❌ No | ❌ No |
| DISABLED | ✅ Yes | ✅ Yes | N/A |

Once a challenge transitions to ONGOING, it is **permanently locked** to preserve financial integrity.

## Tier Completion Logic

Within an ONGOING challenge:
- Enterprises are tracked against tier criteria (trip count thresholds)
- A tier is "completed" when the enterprise reaches the tier's trip count within the challenge duration
- Completing a tier earns the corresponding discount on the monthly invoice
- Incomplete tiers at challenge end = no reward for those tiers

## Date Validation Rules

- Cannot create a challenge starting in the past
- New challenge dates cannot overlap with an existing challenge for the same target companies
- Overlap check must consider the eligibility criteria intersection (e.g., "All Prepaid" overlaps with "All Enterprises")

Cross-reference: Rule CH-001 through CH-007 in [challenge-rules.md]
