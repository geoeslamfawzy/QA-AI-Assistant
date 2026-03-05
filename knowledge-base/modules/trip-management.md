---
id: "trip-management"
title: "Trip Management Module"
system: "B2B Corporate Portal"
type: "module"
tags: ["trip", "management", "module", "lifecycle", "ride", "rider", "driver", "state", "cancel", "fare"]
dependencies: []
keywords: ["trip", "management", "module", "lifecycle", "ride", "rider", "driver", "state", "cancel", "fare"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Trip Management Module

## Overview

The Trip Management module is the core orchestrator of the mobility platform. It controls the full lifecycle of a ride from a rider's initial request through completion or cancellation. All other modules (Driver Management, Payments, Notifications) are downstream consumers of trip events.

## Key Entities

| Entity  | Description |
|---------|-------------|
| Trip    | A single ride request with origin, destination, and assigned driver |
| Rider   | The customer requesting the ride |
| Driver  | The registered service provider fulfilling the ride |
| Vehicle | The physical asset associated with the driver |

## Trip Lifecycle

A trip progresses through the following states. Each state change emits a domain event consumed by downstream services.

```
REQUESTED → DRIVER_ASSIGNED → EN_ROUTE_PICKUP → ARRIVED_AT_PICKUP → IN_PROGRESS → COMPLETED
                                                                    ↘
All states except COMPLETED can transition → CANCELLED
```

### State Definitions

- **REQUESTED**: Rider has submitted a ride request; the matching engine is searching for a driver.
- **DRIVER_ASSIGNED**: A driver has accepted the request; ETA to pickup is computed.
- **EN_ROUTE_PICKUP**: Driver is navigating to the rider's pickup location.
- **ARRIVED_AT_PICKUP**: Driver has arrived at pickup; rider has 5 minutes to board before auto-cancel.
- **IN_PROGRESS**: Rider is in the vehicle; fare meter is active.
- **COMPLETED**: Driver has ended the trip at or near the dropoff location; fare is finalized.
- **CANCELLED**: Trip was cancelled by rider, driver, or system; cancellation fee rules apply.

## Business Rules

### Rule TM-001: Matching Timeout
If no driver accepts a REQUESTED trip within 5 minutes, the system auto-cancels with no fee charged.

### Rule TM-002: Pickup Wait Window
After reaching ARRIVED_AT_PICKUP, the driver must wait a minimum of 5 minutes before initiating a driver-side cancel. The rider is notified at T+2min and T+4min.

### Rule TM-003: Trip Immutability Post-Completion
A COMPLETED or CANCELLED trip cannot transition to any other state. Any such attempt must be rejected at the API layer with HTTP 422.

### Rule TM-004: Concurrent Trip Restriction
A rider may only have one active trip at a time (states: REQUESTED through IN_PROGRESS). A new request must be rejected if an active trip exists.

### Rule TM-005: Minimum Trip Distance
Trips with a planned distance under 0.5 km are rejected at request time.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /trips | Create a new trip request |
| GET  | /trips/{id} | Get trip details |
| PUT  | /trips/{id}/cancel | Cancel a trip |
| POST | /trips/{id}/start | Driver starts the trip (IN_PROGRESS) |
| POST | /trips/{id}/complete | Driver ends the trip |

## Events Emitted

| Event | Trigger | Consumers |
|-------|---------|-----------|
| trip.requested | REQUESTED state entered | Matching Engine, Notifications |
| trip.driver_assigned | DRIVER_ASSIGNED state entered | Notifications, Maps |
| trip.started | IN_PROGRESS state entered | Payments (meter start), Tracking |
| trip.completed | COMPLETED state entered | Payments (fare finalize), Ratings |
| trip.cancelled | CANCELLED state entered | Payments (refund/fee), Notifications |
