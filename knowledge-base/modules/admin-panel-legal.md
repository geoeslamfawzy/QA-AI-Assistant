---
id: "jira-admin-panel-legal"
title: "Admin Panel — Legal"
system: "Admin Panel"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","admin-panel"]
last_synced: "2026-02-11T18:19:30.198Z"
ticket_count: 3
active_ticket_count: 3
---

# Admin Panel — Legal

> Auto-generated from 3 Jira tickets.
> Last synced: 2026-02-11T18:19:30.198Z
> Active features: 3

## User Stories

### CMB-31982: [WEBAPP] Review/Upload Contract

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-11-12

**Description:**
As a superAdmin on the webApp, I need a dedicated section for contract where I can view my contract and upload a stamped copy (PDF file upload)

**Acceptance Criteria:**
- Scenario 01: Viewing Business Contract Section with Contract Status=Ongoing
- Given that I am a BAM on webApp with an active account, and a Contract is attached to my account
- When I access the contracts section,
- Then I should be able to see an overview of all information of the contract, including
- Start Date
- End Date
- Termination Date
- Renewal Type
- Duration
- Contract documents
- Unsigned Contract
- Signed Contract
- Avenant (only displayed if avenant have been created for the company, we should not display it otherwise)
- Scenario 02: Viewing Business Contract Section with Contract Status=Pending (contract not yet created)
- Given that I am a BAM on webApp,
- When A contract is not yet created for my business and my account is active,
- Then the buttons for downloading and submitting signed contract should be disabled,
- Scenario 03: Viewing Business Contract Section with Contract Status=In Review
- Given that I am a BAM on webApp,
- When A contract is created for my business and my account is active,
- Then the buttons for downloading and submitting signed contract should be enabled,
- Scenario 04: Termination Date Banner
- Given that I am a BAM on webApp,
- When The contract termination date is one month ahead,
- Then I should see a banner on webApp informing me that the contract termination date is one month ahead alongside the support contact overlay screen
- Scenario 05: Termination Date Notification
- Given that I am a BAM on webApp,
- When The contract termination date is one month ahead,
- Then I should receive a notification on webApp informing me that the contract termination date is one month ahead
- Note : we need to keep this notion page updated
- Event

---

### CMB-19387: [UNIFY B2X / B2C]: DashOps - Refactor from B2X or B2B to B2C

**Status:** Blocked | **Priority:** P1 - High
**Created:** 2024-11-06

---

### CMB-19898: [UNIFY B2X / B2C] Yassir Public Backend

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-20

**Description:**
The same that we did before on B2B regarding the estimate and request, it should work as expected on switching ON/OFF the feature flag

---

## Consolidated Acceptance Criteria

- Scenario 01: Viewing Business Contract Section with Contract Status=Ongoing
- Given that I am a BAM on webApp with an active account, and a Contract is attached to my account
- When I access the contracts section,
- Then I should be able to see an overview of all information of the contract, including
- Start Date
- End Date
- Termination Date
- Renewal Type
- Duration
- Contract documents
- Unsigned Contract
- Signed Contract
- Avenant (only displayed if avenant have been created for the company, we should not display it otherwise)
- Scenario 02: Viewing Business Contract Section with Contract Status=Pending (contract not yet created)
- Given that I am a BAM on webApp,
- When A contract is not yet created for my business and my account is active,
- Then the buttons for downloading and submitting signed contract should be disabled,
- Scenario 03: Viewing Business Contract Section with Contract Status=In Review
- When A contract is created for my business and my account is active,
- Then the buttons for downloading and submitting signed contract should be enabled,
- Scenario 04: Termination Date Banner
- When The contract termination date is one month ahead,
- Then I should see a banner on webApp informing me that the contract termination date is one month ahead alongside the support contact overlay screen
- Scenario 05: Termination Date Notification
- Then I should receive a notification on webApp informing me that the contract termination date is one month ahead
- Note : we need to keep this notion page updated
- Event
