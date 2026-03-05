---
id: "cancellation-rules"
title: "Cancellation Rules"
system: "B2B Corporate Portal"
type: "atomic_rule"
tags: ["cancellation", "rules", "fee", "trip", "rule", "rider", "cancel", "state", "driver", "payment"]
dependencies: []
keywords: ["cancellation", "rules", "fee", "trip", "rule", "rider", "cancel", "state", "driver", "payment"]
related: ["dm-003"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Cancellation Rules

## Overview

Cancellation rules govern when trips can be cancelled, who bears the cancellation fee, and how the fee is calculated. These rules apply to all trip types and vehicle classes.

## Rule CR-001: Free Cancellation Window

A rider may cancel a trip for free within 2 minutes of the DRIVER_ASSIGNED state being entered, regardless of driver location.

## Rule CR-002: Post-Arrival Cancellation Fee

If a rider cancels after the trip reaches ARRIVED_AT_PICKUP state (driver has arrived), a cancellation fee of **$5.00** is charged to the rider's payment method.

This fee is:
- Fixed regardless of vehicle class
- Not subject to surge multiplier
- Taxed at the standard 8% rate
- Paid to the driver as compensation for their time

## Rule CR-003: Driver-Initiated Cancellation

When a driver initiates a cancellation:
- **No fee is charged to the rider**
- The driver's cancellation count is incremented (see DM-003)
- The trip re-enters REQUESTED state for re-matching, OR the rider is offered a manual retry

## Rule CR-004: System-Initiated Cancellation

System cancellations (matching timeout, expired documents, connectivity loss) result in:
- No fee to rider
- No strike against driver (if driver connectivity issue)
- Full refund if pre-authorization was captured

## Rule CR-005: In-Progress Cancellation Prohibited

A trip in IN_PROGRESS state cannot be cancelled by the rider or driver through the app. Only system-level emergency cancellation (triggered by support) is permitted, which requires a supervisor override token.

## Rule CR-006: Cancellation Fee Waiver

The cancellation fee (CR-002) is automatically waived if:
1. The driver's ETA at the time of cancellation was > 15 minutes beyond the original estimate
2. The driver deviated more than 2 km from the optimal route to pickup
3. Rider submitted a waiver request that is approved by support within 48 hours

## Summary Matrix

| Scenario | Fee to Rider | Driver Strike |
|----------|-------------|---------------|
| Rider cancels within 2 min of assignment | $0 | No |
| Rider cancels after driver arrival | $5.00 | No |
| Driver cancels (any time) | $0 | Yes (count +1) |
| System cancel (timeout/doc) | $0 | No |
| System cancel (emergency, in-progress) | $0 | Depends |
