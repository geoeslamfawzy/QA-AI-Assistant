---
id: "surge-pricing-rules"
title: "Surge Pricing Rules"
system: "B2B Corporate Portal"
type: "atomic_rule"
tags: ["surge", "pricing", "rules", "driver", "fare", "rule", "ride", "rider", "trip", "booking"]
dependencies: []
keywords: ["surge", "pricing", "rules", "driver", "fare", "rule", "ride", "rider", "trip", "booking"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Surge Pricing Rules

## Overview

Surge pricing dynamically adjusts fares when demand exceeds driver supply in a geographic zone. The surge multiplier is applied to the meter fare (base + distance + time) but not to fixed fees or taxes.

## Rule SP-001: Surge Activation Threshold

Surge pricing is activated when the demand-to-supply ratio in a zone exceeds **1.5** (i.e., 1.5 ride requests per available driver). The activation is evaluated every 60 seconds per zone.

## Rule SP-002: Surge Multiplier Bounds

- **Minimum**: 1.0× (no surge — standard pricing)
- **Maximum**: 5.0× (hard platform cap, enforced server-side)

No request may carry a surge multiplier outside this range. Any value exceeding 5.0× must be rejected at fare calculation time.

## Rule SP-003: Surge Multiplier Steps

Surge multipliers are rounded to the nearest 0.1× step (e.g., 1.3×, 1.8×, 2.4×). Intermediate values are not permitted.

## Rule SP-004: Rider Notification Requirement

Before a rider can confirm a trip under surge pricing:
1. The surge multiplier must be **explicitly displayed** on the booking screen
2. The rider must **actively confirm** the fare (not just the surge banner)
3. The confirmation must be logged with a timestamp and the surge value shown

Failure to obtain explicit confirmation invalidates the surge charge — the ride must be priced at 1.0× if the rider disputes non-disclosure.

## Rule SP-005: Surge Does Not Apply To

The following are **never** multiplied by the surge factor:
- Platform fee
- Cancellation fee
- Taxes
- Promotional discounts

Surge applies **only** to the ride fare = baseFare + distanceFare + timeFare.

## Rule SP-006: Geographic Zone Granularity

Surge zones are defined at the hexagonal grid level (H3 resolution 8, approx. 0.74 km²). A trip's surge multiplier is determined by the pickup zone at the time of the REQUESTED state. Zone changes during the trip do not retroactively adjust the fare.

## Rule SP-007: Surge History Logging

Every trip must log the surge multiplier applied and the zone demand/supply ratio at request time for audit and dispute resolution purposes.
