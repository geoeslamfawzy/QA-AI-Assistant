---
id: "driver-management"
title: "Driver Management Module"
system: "Admin Panel"
type: "module"
tags: ["driver", "management", "module", "trip", "status", "active", "rule", "ride", "fare", "wallet"]
dependencies: []
keywords: ["driver", "management", "module", "trip", "status", "active", "rule", "ride", "fare", "wallet"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Driver Management Module

## Overview

The Driver Management module handles driver onboarding, real-time availability, trip assignment, earnings tracking, and performance ratings. It maintains driver status as the authoritative source of truth for dispatch decisions.

## Driver Status Machine

```
OFFLINE → ONLINE → AVAILABLE ⇄ ON_TRIP
                 ↘ UNAVAILABLE → AVAILABLE
                              ↘ OFFLINE
```

| Status | Description |
|--------|-------------|
| OFFLINE | Driver app is closed or connectivity lost |
| ONLINE | Driver app open but not yet ready to accept trips |
| AVAILABLE | Driver is actively accepting trip requests |
| ON_TRIP | Driver is executing an active trip (DRIVER_ASSIGNED through IN_PROGRESS) |
| UNAVAILABLE | Driver has manually paused (break, end of shift) |

## Business Rules

### Rule DM-001: Single Active Trip
A driver cannot be assigned a second trip while in ON_TRIP status. The dispatch system must check driver status before assignment.

### Rule DM-002: Status Auto-Release
When a trip reaches COMPLETED or CANCELLED, the driver's status must be automatically set to AVAILABLE within 10 seconds. A failure to do so within 30 seconds triggers an alert.

### Rule DM-003: Cancellation Strike System
Three driver-initiated cancellations within a 24-hour period will automatically set the driver to UNAVAILABLE for 1 hour.

### Rule DM-004: Earnings Calculation
Driver earnings = Ride fare × Driver payout rate (see Financial Logic). Earnings are credited to the driver's wallet at trip completion, not during IN_PROGRESS.

### Rule DM-005: Rating Eligibility
Ratings can only be submitted within 24 hours of trip completion. Ratings from trips that ended in CANCELLED are not permitted.

### Rule DM-006: Document Expiry
Drivers with expired vehicle registration or insurance are automatically set to UNAVAILABLE. This check runs daily at 00:00 UTC.

## Earnings & Payouts

Earnings accumulate in a driver wallet. Drivers may request payouts that are processed within 1–2 business days. Minimum payout threshold is $10.00.

### Payout Rate by Vehicle Class
- Economy: 80% of ride fare
- Comfort: 80% of ride fare
- Premium: 75% of ride fare

The platform retains the remainder as the platform fee (see Financial Logic module).

## Ratings

Drivers are rated on a 1–5 star scale. A rolling 90-day average below 4.2 triggers a performance improvement notice. Below 3.8 for 30 consecutive days results in temporary suspension.
