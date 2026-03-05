---
id: "gift-card-rules"
title: "Gift Card Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["gift", "card", "rules", "rule", "country", "admin", "budget", "wallet", "validation", "lifecycle"]
dependencies: []
keywords: ["gift", "card", "rules", "rule", "country", "admin", "budget", "wallet", "validation", "lifecycle"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Gift Card Rules

## Module: gift_cards
## Rule Type: financial
## Risk Level: critical

---

## Rule GC-001: Country Isolation for Gift Card Templates

Gift card templates are **strictly country-specific**. A Business Admin in Country Y cannot see, purchase, or apply gift card templates created for Country X.

- Templates must be tagged with `country_code` at creation time
- Template creation: Country field is automatically locked to the Super Admin's operating region
- API filters must enforce country scope on all template listing endpoints
- Cross-country template access is a CRITICAL security/isolation violation

## Rule GC-002: Budget (Wallet) Validation Before Purchase

Before a B2B Admin can complete a gift card purchase:

1. System must check the company's **current Wallet Balance** against the Gift Card price
2. **Rule**: If Wallet Balance < Gift Card price → purchase must be blocked with clear error (never silently fail or partial-deduct)
3. The check must be atomic with the deduction — not a two-step check-then-deduct (TOCTOU vulnerability)
4. Insufficient balance error must suggest top-up action with remaining shortfall amount displayed

## Rule GC-003: Gift Card Template Lifecycle (Delete vs Deactivate)

**Deactivation** (for templates with at least 1 purchase):
- Condition: `purchases_count >= 1`
- Effect: Template removed from B2B WebApp storefront (no new purchases)
- Effect: Existing purchased cards remain valid and usable for rides
- Effect: Template remains in Admin Panel for historical reporting
- Cannot be permanently deleted while purchased cards exist

**Deletion** (for templates with zero purchases):
- Condition: `purchases_count == 0` exactly
- Effect: Template permanently removed from system (irreversible)
- Must show confirmation dialog before execution

Attempting deletion when `purchases_count >= 1` must return an error directing admin to Deactivate instead.

## Rule GC-004: Gift Card Scope Restrictions

B2B Admins can configure restrictions on issued gift cards:
- Service type restrictions (e.g., only valid for Classic service)
- Geographic restrictions (e.g., only valid within a specific city)
- Expiry date
- "Use default settings" option bypasses granular configuration

These restrictions must be evaluated at **ride booking confirmation time**, not just at gift card redemption time.

## Rule GC-005: Wallet Impact on Gift Card Purchase

When a B2B Admin purchases a gift card:
- The gift card value is deducted from the **Company Wallet Balance** immediately upon purchase
- The deduction must be reflected in the Transaction tab audit log
- Refund path: If gift card is revoked/cancelled by admin, remaining balance must be credited back to the Company's main Wallet Balance (not to individual user wallets)
- Revocation audit: Gift Card status changes to `Deactivated/Reverted`; voucher code becomes invalid

## Rule GC-006: Gift Card Audit Trail

Every gift card must maintain:
- Purchase record: Business, Gift Card ID, purchase date, amount, admin actor
- Usage log: Each trip paid by the card (User Phone, trip details, amount deducted, remaining balance)
- Admin action log: Created, Deactivated, Revoked (with Editor ID and timestamps)

The Usage Report (trip log overlay) must be accessible from the admin panel for dispute resolution.

## Rule GC-007: Gift Card Recipient Experience (B2C/Employee Layer)

When an employee receives and uses a gift card voucher code:
- Redemption must validate: code validity, expiry, country match, service type restrictions
- Partial usage: If trip cost < gift card value → residual balance remains on the card for future use
- If trip cost > gift card value → the shortfall must be covered by the rider's primary payment method (hybrid payment)
- Double-redemption prevention: Code becomes single-use per trip segment

## Summary Matrix

| Action | Condition | Actor | Effect |
|--------|-----------|-------|--------|
| Create Template | Super Admin operating | Admin Panel | Template visible in B2B store |
| Purchase | Wallet ≥ price | B2B Admin | Deduct wallet, issue voucher code |
| Deactivate Template | purchases ≥ 1 | Admin Panel | Remove from store, existing valid |
| Delete Template | purchases = 0 | Admin Panel | Permanently removed |
| Revoke Issued Card | Any state | Admin Panel | Remaining balance → Company wallet |
