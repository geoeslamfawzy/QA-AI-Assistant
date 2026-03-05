---
id: "budget-management"
title: "Budget Management & Wallet Logic"
system: "Admin Panel"
type: "financial_logic"
tags: ["budget", "management", "wallet", "logic", "rule", "trip", "booking", "payment", "validation", "admin"]
dependencies: []
keywords: ["budget", "management", "wallet", "logic", "rule", "trip", "booking", "payment", "validation", "admin"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Budget Management & Wallet Logic

## Module: payments
## Rule Type: financial
## Risk Level: critical

---

## Prepaid Budget Model

In prepaid accounts, the **Wallet Balance** is the sole source of funds for trip deductions:

### Wallet Deduction Rules
1. Balance check is performed **atomically with deduction** — no two-step check-then-deduct
2. Insufficient balance → trip booking BLOCKED; error must specify remaining balance and shortfall
3. Balance must never go negative (no credit extension in prepaid mode)
4. Concurrent deductions (multiple riders booking simultaneously) must use pessimistic locking or optimistic concurrency with retry

### Top-Up Process
- Triggered by "Budget top-up" button (Prepaid accounts only)
- **Required inputs**: Amount + Proof of payment (PDF/Doc upload OR transaction link)
- Submission without proof → blocked with validation error
- Top-up reflects immediately in wallet balance upon Operations Admin confirmation
- Audit log entry: actor, amount, proof reference, timestamp, balance before/after

### Wallet Balance Display
- Must be updated in real-time across all active sessions (no stale balance display)
- Transaction tab must show: Budget (balance before trip), Budget After (balance after deduction), trip cost

## Postpaid Budget Model

In postpaid accounts, the **Budget Limit** is a credit line. Trips deduct from available credit:

### Budget Limit Rules
- Budget Limit = maximum credit the enterprise can consume before payment is required
- Monthly Budget = the sub-limit for the current billing month
- When Monthly Budget is reached → new trip bookings must be blocked even if Budget Limit has remaining credit
- "Pay Due Budget" button initiates payment reconciliation for the outstanding amount

### Budget Limit Changes
- Operations Admins can increase/decrease the Budget Limit via the Admin Panel
- Limit decreases that fall below current usage → must warn admin (cannot reduce below outstanding balance)
- All limit changes must be audit-logged

## Payment Plan Switch Financial Rules

**Prepaid → Postpaid**:
- Remaining wallet balance must be handled explicitly (options: retain as credit, refund, or convert to first payment)
- Outstanding balance handling must be defined in requirements — system must not make this decision silently

**Postpaid → Prepaid**:
- All outstanding "Pay Due Budget" amounts must be settled before plan switch is permitted
- Attempting switch with outstanding balance → blocked with "Please settle outstanding balance: [amount]" error

## Budget State in Trip Records

Each trip record in the Admin Panel must display:
- **Budget**: Wallet/credit balance BEFORE the trip was charged
- **Budget After**: Wallet/credit balance AFTER the trip was charged
- These values must be immutable after trip completion (point-in-time snapshot)

## Refund Routing

Refunds from cancelled trips must credit back to:
- **Prepaid**: The Company Wallet Balance (not to individual rider payment methods)
- **Postpaid**: A reduction of the outstanding due amount on the current invoice
- Refund amounts are visible in the Trips table (Refund? column)

## Critical Concurrency Risks

| Scenario | Risk | Guard Required |
|----------|------|---------------|
| 2 riders book simultaneously | Both see sufficient balance, both succeed → overdraw | Pessimistic lock on wallet record |
| Top-up and deduction race | Incorrect balance calculation | Serialized wallet mutations |
| Plan switch during active trip | Trip charged under wrong plan | Trip's plan locked at REQUESTED state |
| Monthly budget rollover at midnight | Race at boundary | Atomic rollover with lock |
