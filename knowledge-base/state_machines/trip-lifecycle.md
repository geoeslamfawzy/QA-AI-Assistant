---
id: "trip-lifecycle"
title: "Trip Lifecycle State Machine"
system: "B2B Corporate Portal"
type: "state_machine"
tags: ["trip", "lifecycle", "state", "machine", "cancel", "rider", "payment", "active", "fee", "driver"]
dependencies: []
keywords: ["trip", "lifecycle", "state", "machine", "cancel", "rider", "payment", "active", "fee", "driver"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Trip Lifecycle State Machine

## State Transition Diagram

```
                     ┌─────────────────────────────────────────┐
                     │                                         │ (all states)
                     ▼                                         │
[REQUESTED] ──► [DRIVER_ASSIGNED] ──► [EN_ROUTE_PICKUP] ──► [ARRIVED_AT_PICKUP] ──► [IN_PROGRESS] ──► [COMPLETED]
                                                                                                ↓
                                                                                           (no cancel)
                     └──────────────────────────────────────────────────────────────► [CANCELLED]
```

## State Details

### REQUESTED
- **Entry condition**: Rider submits a valid trip request; payment method pre-authorized
- **Active processes**: Dispatch matching algorithm runs every 5 seconds
- **Timeout**: 5 minutes → auto-transition to CANCELLED (system cancel, no fee)
- **Exit transitions**: `DRIVER_ASSIGNED` (driver accepts), `CANCELLED`

### DRIVER_ASSIGNED
- **Entry condition**: Driver accepts the request; match is confirmed by dispatch
- **Active processes**: Driver ETA computed and pushed to rider; driver navigation started
- **Timeout**: None (driver must either start trip or cancel)
- **Free cancel window**: Rider has 2 minutes to cancel for free (Rule CR-001)
- **Exit transitions**: `EN_ROUTE_PICKUP` (driver app confirms navigation start), `CANCELLED`

### EN_ROUTE_PICKUP
- **Entry condition**: Driver has started navigation to pickup
- **Active processes**: Real-time ETA updates every 30 seconds; rider tracking active
- **Timeout**: None
- **Exit transitions**: `ARRIVED_AT_PICKUP` (driver marks arrival within 200m geofence), `CANCELLED`

### ARRIVED_AT_PICKUP
- **Entry condition**: Driver enters the 200m pickup geofence
- **Active processes**: Rider notified; 5-minute wait timer starts
- **Timeout**: 5 minutes → driver may initiate cancel; system sends rider final warning at T+4min
- **Exit transitions**: `IN_PROGRESS` (driver starts trip), `CANCELLED`
- **Fee trigger**: Rider cancellation from this state incurs $5.00 fee (Rule CR-002)

### IN_PROGRESS
- **Entry condition**: Driver taps "Start Trip"; rider confirmed in vehicle
- **Active processes**: Fare meter running; GPS tracking active; ETA to destination computed
- **Cancellation**: NOT possible via app (Rule CR-005); requires support escalation
- **Exit transitions**: `COMPLETED` only

### COMPLETED
- **Entry condition**: Driver taps "End Trip" within 500m of destination geofence
- **Active processes**: Fare finalized; driver earnings credited; rating prompts sent
- **Terminal state**: No further transitions permitted
- **Post-completion**: Receipts sent; driver status → AVAILABLE; vehicle status → AVAILABLE

### CANCELLED
- **Entry condition**: Any non-IN_PROGRESS state when cancellation is triggered
- **Active processes**: Refund initiated if pre-auth captured; cancellation fee charged if applicable
- **Terminal state**: No further transitions permitted
- **Post-cancellation**: Driver status → AVAILABLE (unless driver-initiated strike applies)

## Invariants

1. `COMPLETED` and `CANCELLED` are terminal — no outgoing transitions.
2. `IN_PROGRESS` cannot transition to `CANCELLED` via rider/driver action.
3. Only one trip per rider can be in a non-terminal state at any time.
4. State transitions are atomic; partial updates must be rolled back.
5. Every state transition must be logged with actor (rider/driver/system), timestamp, and reason.
