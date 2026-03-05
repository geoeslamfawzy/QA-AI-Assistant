---
id: "challenge-rules"
title: "Challenge (Mission) Rules"
system: "B2B Corporate Portal"
type: "atomic_rule"
tags: ["challenge", "mission", "rules", "rule", "lifecycle", "constraint", "state", "validation", "country", "enterprise"]
dependencies: []
keywords: ["challenge", "mission", "rules", "rule", "lifecycle", "constraint", "state", "validation", "country", "enterprise"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Challenge (Mission) Rules

## Module: challenges
## Rule Type: lifecycle
## Risk Level: high

---

## Rule CH-001: Challenge Lifecycle States

Challenges follow a strictly controlled lifecycle:

```
Created → UPCOMING → ONGOING → COMPLETED | EXPIRED
```

**Key constraint**: Once a challenge transitions out of UPCOMING state, it is **permanently locked** for editing, deactivation, or deletion. This preserves financial integrity of the reward calculations.

Allowed actions by state:
- UPCOMING: Edit, Deactivate, Delete
- ONGOING: View only (locked)
- COMPLETED: View only (locked, rewards already calculated)
- EXPIRED: View only (locked)

## Rule CH-002: Challenge Date Constraints

- Challenges **cannot** be created with a start date in the past
- End date must be after start date (minimum duration: 1 day)
- **Overlap Rule**: A new challenge cannot have dates that intersect with any existing challenge targeting the same set of companies
- Date range validation must check all companies in the eligibility criteria, not just "All Enterprises"

## Rule CH-003: Challenge Eligibility Targeting

Admins must define exactly which companies can participate. Valid options:
- All enterprises (in the selected country)
- Prepaid enterprises only
- Postpaid enterprises only
- Manual selection from enterprise list

The eligibility set is locked once the challenge moves to ONGOING. No additions or removals allowed mid-challenge.

## Rule CH-004: Tier Configuration Logic (Sequential Progression)

Challenges use multi-tier reward structures with strict sequential rules:

- Up to **10 sequential criteria (levels)** per challenge
- **Sequential Rule**: If Criterion N ends at X trips → Criterion N+1 must start at X+1 trips (no gaps, no overlaps)
- Rewards are defined as a percentage (%) per tier
- **Cap**: Cumulative reward across all tiers cannot exceed **100% of the total invoice**
- Exceeding the 100% cap must be blocked at creation time with a validation error

## Rule CH-005: Reward Application

When a company completes a challenge tier:
- The discount percentage is applied to the corresponding monthly invoice
- Discount application must be logged in the Transaction tab audit
- Reward cannot be applied retroactively to already-paid invoices
- If a company completes multiple tiers → the applicable tier's reward applies (highest completed tier)

## Rule CH-006: Challenge Audit Trail

Each challenge must maintain:
- Activity Log with: Date, Editor (Admin email), Action (e.g., Updated Status, Created), and detailed log of changes
- Performance metrics: Total eligible enterprises vs enterprises that completed the challenge
- Old/New state tracking for every modification (e.g., Old: UPCOMING → New: ONGOING)

## Rule CH-007: Challenge Name Constraint

- Challenge Name: Maximum 30 characters
- Must be unique within the country scope for the given date range
- Names are used in audit logs and communications — must be human-readable

## Summary Matrix

| State | Edit | Delete | Deactivate | View |
|-------|------|--------|------------|------|
| UPCOMING | Yes | Yes | Yes | Yes |
| ONGOING | No | No | No | Yes |
| COMPLETED | No | No | No | Yes |
| EXPIRED | No | No | No | Yes |
