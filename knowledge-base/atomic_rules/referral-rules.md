---
id: "referral-rules"
title: "Referral System Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["referral", "system", "rules", "rule", "enterprise", "country", "active", "payment", "wallet", "trip"]
dependencies: []
keywords: ["referral", "system", "rules", "rule", "enterprise", "country", "active", "payment", "wallet", "trip"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Referral System Rules

## Module: referrals
## Rule Type: referral
## Risk Level: high

---

## Rule RF-001: Referral Rule Priority (Enterprise vs Country)

Referral reward rules follow a strict precedence hierarchy:

1. **Enterprise Custom Rule** — highest priority; applies only to the specific enterprise
2. **Country Rule** — fallback; applies to all enterprises without a custom rule

If an Enterprise Rule is **deleted**, the company automatically reverts to the Country Rule (if one is active). This reversion must be immediate and not require manual re-assignment.

## Rule RF-002: Payment Plan Rule Segmentation

Referral reward logic is **strictly divided by payment plan type** because the reward nature differs fundamentally:

- **Prepaid rule**: Rewards are typically wallet credits or free trip vouchers
- **Postpaid rule**: Rewards are typically discount percentages applied to invoices

An admin must explicitly select the correct payment plan context (Prepaid or Postpaid toggle) when creating or editing referral rules. Cross-contamination of rule types is a business logic error.

## Rule RF-003: Referral Trigger Conditions (B2B)

The trigger that qualifies a referral as "Completed" is configurable. Admins must select **exactly one** trigger condition per rule:

- `ONBOARDING_COMPLETE` — Referee activates their enterprise account
- `FIRST_RIDE_COMPLETE` — Referee's employees complete their first trip
- `SPEND_THRESHOLD` — Referee's account reaches a defined spend amount
- `TRIP_COUNT` — Referee's employees complete N trips

If no trigger is defined (no rule set), the referral remains perpetually Pending. System must warn admin if publishing a referral link without an active rule.

## Rule RF-004: Reward Structure Validation

Reward configurations must be validated against the following constraints:

**Free Trip Reward:**
- Business Rule: If trip cost > reward limit (e.g., Limit 2000 DZD, Trip 2500 DZD), the full trip CANNOT be claimed as free — it is a binary eligible/ineligible check, not a partial benefit

**Discount Reward:**
- The discount percentage applied is capped by the defined maximum amount
- Example: 10% discount with limit 100,000 DZD → if 10% of invoice = 120,000 DZD → discount capped at 100,000 DZD

## Rule RF-005: Payment Plan Switching Impact on Referrals

When an enterprise switches payment plans (Prepaid ↔ Postpaid):
- The applicable referral rule changes accordingly (Prepaid rule → Postpaid rule or vice versa)
- Active pending referrals must be evaluated against the NEW plan's rule at resolution time
- Referrers must be notified if the switch changes their reward type or eligibility

## Rule RF-006: Referral Link Uniqueness

Each enterprise has a unique referral link/code. This link:
- Cannot be reused by the same company (idempotent referral submission)
- Must be scoped to the enterprise level (not individual user level in B2B context)
- Must log timestamp of each click/submission for conversion funnel analysis

## Rule RF-007: Country Rule Scope

Global Referral Module (Admin Panel side menu) defines **country-level default rules**. These rules:
- Apply to ALL enterprises in the selected country that have no custom enterprise rule
- Are segmented by payment plan type (separate Prepaid and Postpaid configurations)
- Are not retroactively applied to enterprises that already completed referrals

## Rule RF-008: Completed vs Pending Referral Tracking

- **Pending Referrals**: Invited businesses that have not yet met the qualifying trigger
- **Completed Referrals**: Businesses that have fulfilled the trigger and earned the reward
- The count must be consistent across B2B Portal referral tab and Admin Panel enterprise referral tab
- Discrepancy between counts is a data integrity bug requiring investigation

## Summary Matrix

| Rule Level | Priority | Applies To | Requires |
|------------|---------|------------|---------|
| Enterprise Custom | 1 (highest) | Single enterprise | Admin creates custom rule |
| Country Default | 2 (fallback) | All enterprises without custom rule | Checkbox "Use country configuration" |
| No Rule | 3 | Enterprise with no rule | Referrals stay Pending indefinitely |
