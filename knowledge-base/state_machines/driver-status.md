---
id: "driver-status"
title: "Driver Status State Machine"
system: "Admin Panel"
type: "state_machine"
tags: ["driver", "status", "state", "machine", "trip"]
dependencies: []
keywords: ["driver", "status", "state", "machine", "trip"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Driver Status State Machine

## State Transition Diagram

```
[OFFLINE] ⇄ [ONLINE] ──► [AVAILABLE] ⇄ [ON_TRIP]
                              │
                              ▼
                         [UNAVAILABLE] ──► [AVAILABLE]
                              │
                              ▼
                          [OFFLINE]
```

## Full Transition Table

| From \ To     | OFFLINE | ONLINE | AVAILABLE | ON_TRIP | UNAVAILABLE |
|---------------|---------|--------|-----------|---------|-------------|
| OFFLINE       | —       | ✓      | ✗         | ✗       | ✗           |
| ONLINE        | ✓       | —      | ✓         | ✗       | ✗           |
| AVAILABLE     | ✓       | ✗      | —         | ✓       | ✓           |
| ON_TRIP       | ✗       | ✗      | ✓         | —       | ✗           |
| UNAVAILABLE   | ✓       | ✗      | ✓         | ✗       | —           |

## State Details

### OFFLINE
- Driver app closed, session expired, or device offline
- Cannot receive trip requests
- Transitions to ONLINE when driver opens app and authenticates

### ONLINE
- App is open and authenticated
- Driver has not yet enabled the "Ready to drive" toggle
- Cannot receive trip requests
- Transitions to AVAILABLE when ready toggle is activated

### AVAILABLE
- Driver is visible to the dispatch system
- Actively receives and can accept/decline trip requests
- Transitions to ON_TRIP when dispatch assigns and driver accepts a trip

### ON_TRIP
- Driver is actively executing a trip (from DRIVER_ASSIGNED through IN_PROGRESS)
- Cannot receive new trip requests
- Transitions to AVAILABLE automatically when trip reaches COMPLETED or CANCELLED
- **This transition must occur within 10 seconds of the trip terminal event**

### UNAVAILABLE
- Driver has manually paused (break, refueling, end of shift)
- Not visible to dispatch system
- Transitions back to AVAILABLE when driver re-enables, or to OFFLINE

## Coupling Rules with Trip States

| Trip State         | Required Driver Status   |
|--------------------|--------------------------|
| REQUESTED          | (driver not yet assigned) |
| DRIVER_ASSIGNED    | ON_TRIP                  |
| EN_ROUTE_PICKUP    | ON_TRIP                  |
| ARRIVED_AT_PICKUP  | ON_TRIP                  |
| IN_PROGRESS        | ON_TRIP                  |
| COMPLETED          | AVAILABLE (post-release) |
| CANCELLED          | AVAILABLE (post-release) |

Any divergence from this coupling table is a data consistency error and must trigger an alert.

## Automatic Transitions

- ON_TRIP → AVAILABLE is system-triggered, never driver-triggered
- AVAILABLE → UNAVAILABLE can be driver-triggered or system-triggered (document expiry, strike threshold)
- ONLINE → OFFLINE is triggered by session expiry (30 min inactivity timeout)
