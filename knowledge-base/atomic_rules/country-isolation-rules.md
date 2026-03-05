---
id: "country-isolation-rules"
title: "Country Isolation Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["country", "isolation", "rules", "rule", "admin", "enterprise", "gift", "card", "referral", "user"]
dependencies: []
keywords: ["country", "isolation", "rules", "rule", "admin", "enterprise", "gift", "card", "referral", "user"]
related: ["gc-001"]
version: "1.0"
last_updated: "2026-03-01"
risk_level: "low"
---

# Country Isolation Rules

## Module: admin_panel
## Rule Type: country
## Risk Level: critical

---

## Rule CI-001: Country Selector as Data Isolation Boundary

The Country Selector in the Admin Panel top navigation bar acts as the **primary data isolation boundary**. Switching countries changes the operational context for:
- Enterprise list (only enterprises from the selected country)
- Services Config (only services available in the selected country)
- Gift Card templates (only templates created for the selected country)
- Global Referral rules (only country-specific referral configurations)
- Country Reports (only financial data for the selected country)
- Notifications (audience filtered by selected country's enterprises)

**Critical**: API endpoints must enforce country scope server-side — the country selector is not merely a UI filter. A user with Algeria context cannot access Tunisia data even by manipulating API calls.

## Rule CI-002: B2B Registration Country Auto-Detection

During B2B user registration (Step 3: Company Profiling):
- Country is **automatically inferred** from the phone number prefix entered in Step 2
- Example: +213 prefix → Country locked to "Algeria"
- City dropdown filters to show **only cities belonging to the inferred country**
- Country field is locked (read-only) after auto-detection — users cannot change it
- This ensures company accounts are always correctly scoped to their operating region

## Rule CI-003: Gift Card Country Scoping

Gift card templates are strictly country-specific (see GC-001):
- Super Admins can only create templates for their own operating region
- B2B Admins can only purchase gift cards available in their company's registered country
- Using a gift card from Country X in Country Y is invalid and must be rejected at ride booking time

## Rule CI-004: Services Config Country Scoping

The Services Config module (Admin Panel) displays the service catalog filtered by the selected country:
- Service availability (Classic, Comfort, Premium, Ambulance, Cargo, etc.) varies by country
- Bulk actions ("Enable for all", "Disable for all") apply ONLY to enterprises in the currently selected country
- A service enabled for Algeria does not automatically become available in Senegal

## Rule CI-005: Admin Panel Employee Country Scope

Admin accounts can be scoped to specific countries:
- The "All Administrators" list can be filtered by assigned service areas (e.g., "Algeria")
- Sales Representatives can be filtered by Country (e.g., Algeria, Tunisia)
- An admin assigned to Algeria scope should not be able to manage Senegal enterprises without explicit permission expansion

## Rule CI-006: Finance Report Country Isolation

Country Reports (Monthly Finance Reports, Monthly Invoices bulk generation):
- All data is filtered by the Admin Panel's active Country Selector
- Bulk invoice generation creates invoices for all enterprises within the selected country only
- Finance report CSV export is country-scoped

## Rule CI-007: Notification Targeting Country Scope

When creating notifications in the Admin Panel:
- The enterprise audience is already pre-filtered by the active country context
- City filter within the notification wizard refers to cities within the selected country
- Sending a notification to "All Enterprises" targets all enterprises in the selected country — not globally

## Summary Matrix

| Module | Country-Scoped | Enforcement |
|--------|---------------|-------------|
| Enterprises list | Yes | API + UI |
| Services Config | Yes | API + UI |
| Gift Card templates | Yes | API + UI (country lock at creation) |
| Global Referral rules | Yes | API + UI |
| Notifications audience | Yes | API + UI |
| Country Reports | Yes | API + UI |
| Admin employees | Partial | UI filter |
| B2B registration | Yes | Phone prefix detection + lock |
