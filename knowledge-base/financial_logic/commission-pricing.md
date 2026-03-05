---
id: "commission-pricing"
title: "Commission & B2B Pricing Logic"
system: "Admin Panel"
type: "financial_logic"
tags: ["commission", "pricing", "logic", "rule", "trip", "fare", "enterprise", "admin", "state", "discount"]
dependencies: []
keywords: ["commission", "pricing", "logic", "rule", "trip", "fare", "enterprise", "admin", "state", "discount"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Commission & B2B Pricing Logic

## Module: payments
## Rule Type: financial
## Risk Level: high

---

## Commission Model

The B2B pricing model applies a commission markup on top of standard trip fares:

**Formula**: `Final B2B Price = Base Trip Price × (1 + Commission%)`

Example: Base fare = 100 DZD, Commission = 19% → B2B price = 119 DZD

### Default Commission Rate
- Global default: **19%**
- Overridable per enterprise via "Set Commission" button in the Admin Panel
- Enterprise-specific commission overrides the global default

### Commission Change Rules
- Commission changes apply to **NEW trips only** — never retroactively to in-flight or completed trips
- A trip's commission rate is locked at the REQUESTED state
- All commission rate changes must be audit-logged: actor email, old rate, new rate, effective timestamp

## Discount & Rebate Rules

Enterprises may receive automated discounts based on usage thresholds (configured per enterprise):

**Display**: Current rule shown as "20% • 20,000 DZD" format (percentage • threshold)

- Discount activates when the enterprise's trip spend reaches the configured threshold in a billing period
- Discount is applied as a credit against the monthly invoice (not a cash refund)
- Discount caps apply (see Challenge rules for tier-based discount caps)

## Cashback Configuration

- Cashback is a percentage rebate for high-volume enterprise clients
- Rate examples: 5%, 10%, etc.
- Applied as wallet credit or invoice deduction (implementation-specific)
- Not self-service: enterprise must contact Yassir support to configure cashback eligibility
- Contact channel: "Contact support" button in the B2B Dashboard's Cashback Widget

## VAT Handling

- VAT amounts are tracked separately in the Transaction audit log
- Events logged: "VAT amount deducted", "VAT amount added", "VAT amount refunded"
- VAT calculation must be based on the post-commission B2B price (not the base fare)
- Country-specific VAT rates may apply (Algeria, Tunisia, Senegal, Morocco may differ)

## Invoice Breakdown Structure

Monthly invoices must include:
1. Trip line items (date, origin/destination, service type, base fare, commission, B2B price)
2. Platform development fees
3. Driver service fees
4. Discount/cashback applied (if any)
5. VAT line (amount, rate)
6. Total due

Email delivery: Subject "Yassir Business Invoice" to registered Super Admin.
