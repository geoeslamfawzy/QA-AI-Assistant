---
id: "jira-b2b-portal-gift-cards"
title: "B2B Portal — Gift Cards"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal"]
last_synced: "2026-03-04T09:20:30.584Z"
ticket_count: 2
active_ticket_count: 2
---

# B2B Portal — Gift Cards

> Auto-generated from 2 Jira tickets.
> Last synced: 2026-03-04T09:20:30.584Z
> Active features: 2

## User Stories

### CMB-31226: Giftcard identification on the export files

**Status:** Blocked | **Priority:** P2 - Medium
**Created:** 2025-10-22

**Description:**
As an Admin (SuperAdmin or Business Admin),

**Acceptance Criteria:**
- This column should be empty if the trip was paid for using a standard payment method (not a giftcard).
- This column should display the unique Giftcard ID (voucher ID) if the trip was paid using a giftcard.
- This column should be empty if the trip was not paid for using a giftcard.
- This column should display the coupon percentage applied to the trip (e.g., 25%) if a giftcard was used.
- This column should be empty if the trip was not paid using a giftcard.
- This column should display the monetary value that was deducted from the giftcard's remaining balance to pay for the trip.

---

### CMB-31128: [ADMINPANEL] Giftcard Creation

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-10-19

**Description:**
The SuperAdmin needs a straightforward interface in the AdminPanel to create new digital giftcard templates. This process requires setting the core parameters that define the giftcard product sold to B2B clients, such as its value and visual design.

**Acceptance Criteria:**
- Scenario 01: Viewing All Giftcards Templates List
- As a SuperAdmin on AdminPanel,
- When I access the "Giftcard" section,
- Then I should see a table of all existing giftcard templates with the following columns:
- Name
- Amount (Monetary value)
- Theme (Visual design)
- Country Scope
- Purchased by (Total times this template has been bought by B2B clients)
- Activation (Active, Inactive)
- Actions (Delete/Deactivate)
- Scenario 02: Filtering Giftcard Templates List
- As a SuperAdmin,
- When I am viewing the list of giftcard templates,
- Then I should be able to:
- Filter templates by:
- Activation (Active, Inactive)
- Search by:
- Name
- Scenario 03: Creating a New Giftcard Template
- As a SuperAdmin,
- When I click on the "Create New Giftcard" button,
- Then I should see a form to create a new template where I am able to input:
- Monetary Amount (REQUIRED)
- Template Name (REQUIRED)
- Select Visual Theme (REQUIRED)
- Country (automatically set based on SuperAdmin's country of operation, non-editable).
- Validation: Attempting to save without Monetary Amount or Visual Theme should display an error.
- And the giftcard template should be available for purchase for all companies in that country
- Scenario 05: Enabling Delete Button for Unpurchased Giftcard Templates
- As a SuperAdmin,
- When I access a giftcard template with 0 purchases only delete button should be enabled,
- Then by deleting a giftcard template, I should be prompted with a confirmation dialog explaining that the template will be permanently removed from the system and the B2B WebApp.
- And upon confirmation, the template is permanently deleted from the system.
- Scenario 06: Enabling Deactivation Button for Purchased Giftcard Templates
- As a SuperAdmin,
- When I access a giftcard template that has 1 or more purchases only deactivation button should be enabled
- Then by deactivating a giftcard template, the template's status changes to "Inactive", it is removed from the B2B WebApp's "Giftcards" section (for newer purchases), but remains in the AdminPanel for historical reporting.
- And this action does not affect any existing, active programs purchased from this template (should only be invisible for clients who did not purchased it)
- Scenario 07: Viewing Detailed Gift-card Usage Report
- As a SuperAdmin on AdminPanel,
- When I click on the number displayed on “Purchased by“ column,
- Then I should see a list of all purchased giftcard instances (not templates) with columns including:
- Purchasing Business (Name, clickable to view business details)
- Giftcard ID (e.g., GC-1001, clickable to view template details)
- Total Trips Paid by this specific purchased giftcard program
- Remaining Value
- Actions (e.g., "View Trip Log")
- And when I click "View Trip Log" for a specific purchase, an overlay screen should display a detailed log of trips paid by that giftcard, including:
- User Phone Number (for audit purposes)
- Scenario 08: Country-Specific Giftcard Visibility
- As a SuperAdmin on AdminPanel,
- When I set a Giftcard Template,
- Then It should be applicable for the country I have access to only (e.g., "Algeria" if I am an Algerian SuperAdmin).
- And a Business Admin in Country Y should not see giftcards created by a SuperAdmin in Country X.
- Scenario 09: Logging of Admin Actions
- As a SuperAdmin on AdminPanel,
- When I perform an action on a giftcard template (e.g., Create, Deactivate),
- Then the action, along with the date, the SuperAdmin's identifier (editor), and relevant old/new values, should be recorded and displayed in the Activity Log for that specific giftcard template.

---

## Consolidated Acceptance Criteria

- This column should be empty if the trip was paid for using a standard payment method (not a giftcard).
- This column should display the unique Giftcard ID (voucher ID) if the trip was paid using a giftcard.
- This column should be empty if the trip was not paid for using a giftcard.
- This column should display the coupon percentage applied to the trip (e.g., 25%) if a giftcard was used.
- This column should be empty if the trip was not paid using a giftcard.
- This column should display the monetary value that was deducted from the giftcard's remaining balance to pay for the trip.
- Scenario 01: Viewing All Giftcards Templates List
- As a SuperAdmin on AdminPanel,
- When I access the "Giftcard" section,
- Then I should see a table of all existing giftcard templates with the following columns:
- Name
- Amount (Monetary value)
- Theme (Visual design)
- Country Scope
- Purchased by (Total times this template has been bought by B2B clients)
- Activation (Active, Inactive)
- Actions (Delete/Deactivate)
- Scenario 02: Filtering Giftcard Templates List
- As a SuperAdmin,
- When I am viewing the list of giftcard templates,
- Then I should be able to:
- Filter templates by:
- Search by:
- Scenario 03: Creating a New Giftcard Template
- When I click on the "Create New Giftcard" button,
- Then I should see a form to create a new template where I am able to input:
- Monetary Amount (REQUIRED)
- Template Name (REQUIRED)
- Select Visual Theme (REQUIRED)
- Country (automatically set based on SuperAdmin's country of operation, non-editable).
- Validation: Attempting to save without Monetary Amount or Visual Theme should display an error.
- And the giftcard template should be available for purchase for all companies in that country
- Scenario 05: Enabling Delete Button for Unpurchased Giftcard Templates
- When I access a giftcard template with 0 purchases only delete button should be enabled,
- Then by deleting a giftcard template, I should be prompted with a confirmation dialog explaining that the template will be permanently removed from the system and the B2B WebApp.
- And upon confirmation, the template is permanently deleted from the system.
- Scenario 06: Enabling Deactivation Button for Purchased Giftcard Templates
- When I access a giftcard template that has 1 or more purchases only deactivation button should be enabled
- Then by deactivating a giftcard template, the template's status changes to "Inactive", it is removed from the B2B WebApp's "Giftcards" section (for newer purchases), but remains in the AdminPanel for historical reporting.
- And this action does not affect any existing, active programs purchased from this template (should only be invisible for clients who did not purchased it)
- Scenario 07: Viewing Detailed Gift-card Usage Report
- When I click on the number displayed on “Purchased by“ column,
- Then I should see a list of all purchased giftcard instances (not templates) with columns including:
- Purchasing Business (Name, clickable to view business details)
- Giftcard ID (e.g., GC-1001, clickable to view template details)
- Total Trips Paid by this specific purchased giftcard program
- Remaining Value
- Actions (e.g., "View Trip Log")
- And when I click "View Trip Log" for a specific purchase, an overlay screen should display a detailed log of trips paid by that giftcard, including:
- User Phone Number (for audit purposes)
- Scenario 08: Country-Specific Giftcard Visibility
- When I set a Giftcard Template,
- Then It should be applicable for the country I have access to only (e.g., "Algeria" if I am an Algerian SuperAdmin).
- And a Business Admin in Country Y should not see giftcards created by a SuperAdmin in Country X.
- Scenario 09: Logging of Admin Actions
- When I perform an action on a giftcard template (e.g., Create, Deactivate),
- Then the action, along with the date, the SuperAdmin's identifier (editor), and relevant old/new values, should be recorded and displayed in the Activity Log for that specific giftcard template.
