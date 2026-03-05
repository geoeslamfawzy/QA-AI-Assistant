---
id: "payment-plan-rules"
title: "Payment Plan Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["payment", "plan", "rules", "rule", "wallet", "booking", "trip", "budget", "limit", "state"]
dependencies: []
keywords: ["payment", "plan", "rules", "rule", "wallet", "booking", "trip", "budget", "limit", "state"]
related: ["rf-005"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Payment Plan Rules

## Module: payments
## Rule Type: financial
## Risk Level: critical

---

## Rule PP-001: Payment Plan Types

The platform supports exactly two payment plan models:

**Prepaid:**
- Company pre-loads a Wallet Balance
- Trips deduct from the wallet at booking/completion
- Insufficient balance → trip booking blocked
- UI shows: "Current Wallet Balance" + "Top Up Budget" action
- Budget top-up requires: payment amount + payment document/transaction link (mandatory)

**Postpaid (Pay Later):**
- Company operates against a Budget Limit (credit line)
- Monthly invoices are generated at billing cycle end
- UI shows: "Budget" (limit) + "Monthly budget" + "Pay Due Budget" action
- Top-up option is NOT available in postpaid mode
- Budget Limit can be set/modified by Operations Admins

## Rule PP-002: Payment Plan Switch Atomicity

When switching between Prepaid and Postpaid:
1. The switch must be atomic — no trips should be processed in an intermediate state
2. **Prepaid → Postpaid**: Remaining wallet balance handling must be defined (retain, refund, or convert)
3. **Postpaid → Prepaid**: Outstanding due budget must be settled before switch is permitted
4. The referral rule must switch to the corresponding plan's rule (see RF-005)
5. Active ongoing trips must honor the plan at time of REQUESTED state — not at completion

## Rule PP-003: Commission Calculation

The B2B commission markup is applied on top of standard trip fares:
- **Formula**: Final B2B Price = Base Trip Price × (1 + Commission%)
- **Default commission**: 19%
- Commission is per-enterprise configurable (Override via "Set Commission" button)
- Commission changes apply to NEW trips only — not retroactively to in-flight or past trips
- Commission rate changes must be audit-logged with: actor, old rate, new rate, effective datetime

## Rule PP-004: Budget Limit vs Wallet Balance

| Field | Prepaid | Postpaid |
|-------|---------|---------|
| Current Wallet Balance | Visible | Not applicable |
| Budget (Limit) | Not applicable | Visible (credit line) |
| Monthly Budget | Not applicable | Visible (monthly cap) |
| Top-up action | Available | Blocked |
| Pay Due Budget | Not applicable | Available |
| Invoice generation | Monthly (for records) | Monthly (for collection) |

## Rule PP-005: Invoice Generation Rules

Monthly invoices are auto-generated at billing cycle end. Manual generation is also supported (Admin Panel → Payments tab):
- Delivery: Email to registered Super Admin with subject "Yassir Business Invoice"
- Format: PDF with service breakdown (Platform dev fees vs Driver service fees)
- Invoice must include: VAT line, Commission line, Discount/Cashback applied, total due
- Bulk invoice generation (Country Reports module) generates all invoices for a country in batch

## Rule PP-006: Budget Top-Up Validation

Prepaid accounts require admin-validated top-ups:
- Mandatory: Payment amount (DZD value)
- Mandatory: Proof of payment (PDF/Doc upload) OR transaction link
- Submission without proof must be blocked with a clear validation error
- Top-up reflects immediately in wallet balance upon admin confirmation
- All top-ups logged in Transaction tab: actor, amount, proof reference, timestamp

## Rule PP-007: Cashback / Rebate Configuration

Cashback is a percentage rebate on usage thresholds:
- Purpose: Incentivize high-volume enterprise clients
- Display: B2B Dashboard shows current cashback percentage (e.g., "5%") or "-" if not configured
- Contact path: "Contact support" for cashback eligibility (not self-service)
- Cashback must be applied as a credit (not a refund) to the company's wallet or invoice reduction

## Rule PP-008: Export Date Range Constraint

When exporting trip data from the Admin Panel:
- Date range must NOT exceed 31 days
- Exceeding this limit must return a validation error, not a silent truncation
- Delivery is asynchronous via email — not instant download
- Email subject: "Yassir Exported Trips Sheet For [Company Name]"

## Summary Matrix

| Financial Event | Prepaid Effect | Postpaid Effect | Audit Required |
|----------------|----------------|-----------------|----------------|
| Trip completion | Wallet deduction | Budget usage increment | Yes |
| Top-up | Wallet credit | Not applicable | Yes |
| Invoice generated | Record only | Collection trigger | Yes |
| Commission change | Future trips only | Future trips only | Yes |
| Budget limit change | Not applicable | Immediate effect | Yes |
| Plan switch | Complex (settle first) | Complex (settle first) | Yes |
