---
id: "trip-driver-coupling"
title: "Trip–Driver Coupling and Cross-Module Dependencies"
system: "Admin Panel"
type: "cross_dependency"
tags: ["trip", "driver", "coupling", "cross", "module", "dependencies", "state", "status", "fare", "fee"]
dependencies: []
keywords: ["trip", "driver", "coupling", "cross", "module", "dependencies", "state", "status", "fare", "fee"]
related: ["them"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Trip–Driver Coupling and Cross-Module Dependencies

## Overview

The Trip Management and Driver Management modules are tightly coupled. A state change in one must trigger a corresponding state change in the other. This document defines the authoritative coupling rules and known failure modes.

## Coupling Contract

### Contract CDP-001: Assignment Atomicity
When a trip transitions from REQUESTED → DRIVER_ASSIGNED, the following must occur atomically (within the same database transaction or distributed saga step):
1. Trip state = DRIVER_ASSIGNED
2. Driver status = ON_TRIP
3. Vehicle status = RESERVED

If any step fails, all three must be rolled back.

### Contract CDP-002: Trip Completion Release
When a trip transitions to COMPLETED or CANCELLED, the following must occur within 10 seconds:
1. Driver status = AVAILABLE
2. Vehicle status = AVAILABLE
3. Fare finalization event emitted (for COMPLETED)
4. Cancellation fee event emitted (for CANCELLED, if applicable)

Failure to release within 30 seconds must trigger a reconciliation alert to the ops team.

### Contract CDP-003: Cancellation Fee Routing
When a rider-side cancellation fee ($5.00) is charged:
- $4.00 (80%) is routed to the driver's wallet
- $1.00 (20%) is retained as platform fee
- Tax ($0.40 = $5.00 × 8%) is remitted separately

### Contract CDP-004: Status Consistency Invariant
At any point in time, the following must be true:
- If `trip.state IN (DRIVER_ASSIGNED, EN_ROUTE_PICKUP, ARRIVED_AT_PICKUP, IN_PROGRESS)` → `driver.status = ON_TRIP`
- If `trip.state = IN_PROGRESS` → `vehicle.status = IN_USE`
- If `trip.state IN (COMPLETED, CANCELLED)` → `driver.status ≠ ON_TRIP`

Violations of this invariant indicate a missed event or a race condition between services.

## Known Failure Modes

### Failure Mode F-001: Orphaned ON_TRIP Status
**Symptom**: Driver is ON_TRIP but no active trip references them.
**Cause**: Trip COMPLETED/CANCELLED event was dropped (network failure, service crash).
**Resolution**: Reconciliation job (runs every 5 min) scans for drivers where status=ON_TRIP and last trip is in terminal state → auto-release to AVAILABLE.

### Failure Mode F-002: Double Assignment
**Symptom**: A driver is assigned to two trips simultaneously.
**Cause**: Race condition in the dispatch service; optimistic lock failure.
**Prevention**: Dispatch service must use a driver-level pessimistic lock during assignment.
**Detection**: Alert when `COUNT(active trips WHERE driver_id = X) > 1`.

### Failure Mode F-003: Fare Overcharge After Cancel
**Symptom**: Rider charged ride fare despite trip being cancelled before IN_PROGRESS.
**Cause**: Payments service processed a COMPLETED event for a trip that was later cancelled.
**Prevention**: Payments service must verify trip state via Trip API before finalizing fare.

## Financial Cross-Dependencies

| Event | Trip Module | Payments Module | Driver Wallet |
|-------|-------------|-----------------|---------------|
| COMPLETED | Fare finalized | Charge rider, remit tax | Credit driver payout |
| CANCELLED (post-arrival) | Fee calculated | Charge $5.00 fee | Credit $4.00 to driver |
| CANCELLED (free) | No action | Release pre-auth | No credit |
| DRIVER cancel | Trip re-queued | Release pre-auth | No credit |

## Testing Requirements

All integration tests for trip state transitions **must** verify:
1. The driver status in the Driver Management service matches the expected post-transition state
2. The vehicle status matches the expected post-transition state
3. The financial event was emitted with the correct amount
4. No orphaned ON_TRIP states exist after 60 seconds

Automated state consistency checks should run in staging on every deployment.
