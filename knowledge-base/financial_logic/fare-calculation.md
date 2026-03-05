---
id: "fare-calculation"
title: "Fare Calculation"
system: "B2B Corporate Portal"
type: "financial_logic"
tags: ["fare", "calculation", "trip", "surge", "card", "fee", "driver", "ride", "rider", "rule"]
dependencies: []
keywords: ["fare", "calculation", "trip", "surge", "card", "fee", "driver", "ride", "rider", "rule"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Fare Calculation

## Overview

Fares are calculated server-side at trip completion. The fare is determined by the vehicle class, trip distance, trip duration, and the surge multiplier recorded at request time.

## Rate Card

| Vehicle Class | Base Fare | Per km | Per min | Platform Fee | Driver Payout |
|---------------|-----------|--------|---------|--------------|---------------|
| Economy       | $2.00     | $0.50  | $0.10   | 20%          | 80%           |
| Comfort       | $3.00     | $0.75  | $0.15   | 20%          | 80%           |
| Premium       | $5.00     | $1.20  | $0.25   | 25%          | 75%           |

## Fare Formula

```
Ride Fare = (Base Fare + Distance Fare + Time Fare) × Surge Multiplier

Where:
  Distance Fare = distance_km × per_km_rate
  Time Fare     = duration_min × per_min_rate

Platform Fee   = Ride Fare × platform_fee_rate
Driver Payout  = Ride Fare × driver_payout_rate

Taxable Amount = Ride Fare + Cancellation Fee (if applicable)
Tax            = Taxable Amount × 0.08

Total Charged to Rider = Taxable Amount + Tax
```

## Important Rules

### Rule FC-001: Surge Scope
The surge multiplier applies **only** to (Base Fare + Distance Fare + Time Fare). It does NOT apply to platform fees, cancellation fees, taxes, or promotional discounts.

### Rule FC-002: Tax Rate
The VAT/tax rate is **8%** and applies to the ride fare plus any applicable cancellation fee. Platform fees are excluded from the taxable base (they are B2B).

### Rule FC-003: Minimum Fare
The minimum fare charged to a rider is **$3.50** (post-tax, for Economy). If the computed total is less, it is rounded up to the minimum.

### Rule FC-004: Fare Finalization Timing
The fare is finalized only when the trip transitions to COMPLETED. An in-progress trip must not be billed. Pre-authorization of the estimated fare is permitted but must be released and re-captured at the correct final amount.

### Rule FC-005: Rounding
All monetary values are rounded to the nearest cent (2 decimal places) at each calculation step before summing. This prevents floating-point drift.

### Rule FC-006: Driver Payout Timing
Driver earnings are credited to the driver wallet at trip completion (COMPLETED event), not at any earlier state. Earnings from cancelled trips (where no ride took place) are $0.00.

## Example Calculation

**Economy trip, 12.5 km, 20 min, 1.8× surge:**

```
Distance Fare  = 12.5 × $0.50  = $6.25
Time Fare      = 20   × $0.10  = $2.00
Base Fare                       = $2.00
                               ─────────
Pre-surge subtotal              = $10.25
× Surge (1.8×)                  = $18.45  ← Ride Fare

Platform Fee   = $18.45 × 20%  = $3.69
Driver Payout  = $18.45 × 80%  = $14.76
Tax            = $18.45 × 8%   = $1.48
                               ─────────
Total to Rider = $18.45 + $1.48 = $19.93
```
