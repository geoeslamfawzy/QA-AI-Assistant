---
id: "jira-b2b-portal-challenge"
title: "B2B Portal — Business Challenge"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal"]
last_synced: "2025-10-22T07:44:45.119Z"
ticket_count: 3
active_ticket_count: 3
---

# B2B Portal — Business Challenge

> Auto-generated from 3 Jira tickets.
> Last synced: 2025-10-22T07:44:45.119Z
> Active features: 3

## User Stories

### CMB-27189: Handling Multiple Business Challenges

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-07-03

**Description:**
As a superAdmin, I want to prevent the creation of overlapping challenges (based on validity dates) for the same eligible businesses so that challenges remain mutually exclusive, and rewards are not duplicated.

**Acceptance Criteria:**
- Scenario 01: Prevent Challenge Overlap
- As a superAdmin on adminPanel I am creating a new challenge,
- When I select validity date range (Start Date to End Date)
- Then I should see the dates  that already have an ongoing or upcoming challenge within the same date range, disabled
- Scenario 02: Edit Challenge with New Overlapping Dates
- As a superAdmin on adminPanel I am editing an upcoming challenge,
- When I change its validity dates to overlap with another challenge,
- Then I should see the dates  that already have an ongoing or upcoming challenge within the same date range, disabled
- Scenario 03: Cash-back Processing for Multiple Challenges in the Same Billing Cycle
- As a system,
- When a business completes multiple challenges that qualify for cash-back within the same billing cycle,
- Then the total reward processed for that business should be the sum of the cash-back from all eligible completed challenges.

---

### CMB-26737: Business Challenge AdminPanel Flow

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-06-22

**Description:**
As a superAdmin, I want a comprehensive and intuitive AdminPanel to manage business challenges, including listing, viewing details, editing, adding, and filtering challenges, so that I can efficiently oversee and control all challenge-related operations.

**Acceptance Criteria:**
- Scenario 01: Viewing All Challenges List
- As a superAdmin on adminPanel,
- When I access the Challenge section,
- Then I should see a table of all existing challenges with the follwing columns
- name
- Start Date
- End Date
- Number of businesses who completed the challenge
- activation
- status
- Actions
- Scenario 02: Filtering Challenges List
- As an admin,
- When I am viewing the list of challenges,
- Then I should be able to
- filter challenges by
- status (upcoming, ongoing, completed)
- activation (enabled, disabled)
- Search by
- Company (included in the challenge)
- Challenge ID
- Scenario 03: Adding a New Challenge
- As a superAdmin,
- When I click on the add challenge button,
- Then I should see a form to create a new challenge where I am able to input:
- Challenge Name(REQUIRED) (should not exceed 30 characters)
- Elligible Companies (Select all or search by name, or per payment plan) (REQUIRED)
- Start Date (REQUIRED)
- End Date (REQUIRED) (End date cannot be before start date)
- Add a challenge segment (Finished trips interval & cash-back percentage gained)
- Add / Delete the last segment (if only one segment was created then we should not be able to delete it)
- Each challenge has minimum 1 segment, maximum 10
- Scenario 04: Viewing Challenge Details for Completed Challenges
- As an admin,
- When I click on a challenge in the list (click on view details on the actions column),
- Then a detailed screen should open, displaying:
- All segments (interval of finished trips, discount percentage)
- Activity log (date, editor, action, log (old and new value))
- note : we need to include the creation of the challenge on the logs as well
- status,
- Number of eligible businesses (on click we would display an overlay screen displaying the list of all elligible businesses for the challenge)
- Number of businesses who completed the challenge (on click we would display an overlay screen displaying the list of businesses that completed the challenge)
- Scenario 05: Viewing Challenge Details for Upcoming Challenges
- As an admin,
- When I click on a challenge in the list (click on view details on the actions column),
- Then a detailed screen should open, displaying:
- name
- Elligible companies
- Start Date
- End Date
- All segments (interval of finished trips, discount percentage)
- Edit options (Edit Challenge/ Edit Challenge)
- Disable/Enable toggle button (for upcoming challenges only)
- Activity log(date, editor, action, log (old and new value))
- note : we need to include the creation of the challenge on the logs as well
- Scenario 06: Editing/Deleting/Activating/De-activating Actions for Upcoming Challenges Only
- As a superAdmin,
- When a challenge is ongoing or completed,
- Then I should not be able to Edit/ Delete/ Enable/ Disable
- Scenario 07: Detailed Refund Display on Transaction Table
- As an admin on AdminPanel,
- When I view the transaction table of a company that have gained a cash-back,
- Then I should see detailed information for each challenge cash-back.
- Scenario 08: Read_Only View for admins
- As an admin on AdminPanel,
- When I view the challenge section,
- Then I need to have a Read_Only view for all challenge screens (I shouldn’t be able to create/edit/disable/enable challenges
- Scenario 09: Challenges Configuration per Country
- As a superAdmin on AdminPanel,
- When I set a Challenge,
- Then It should be applicable for the country I have access to only (based on phone number)
- Scenario 10: Logs for Editing Actions
- As a superAdmin on AdminPanel,
- When I edit a challenge,
- Then the action should be listed on the challenge details screen
- Scenario 11: Incrementing the Counter for Businesses that Completed the Challenge
- As a business,
- When I meet at least the first criterion for the challenge,
- Then I should be included in the counter for businesses that completed the challenge (even if I did not manage to complete all the criterions for the challenge)
- Scenario 12: Challenge Disabled while we reached the Start Date
- As a superAdmin on AdminPanel,
- When I disable a challenge and we reach its start date,
- Then
- status of the challenge should not move to ‘on-going' and keep it as 'On-hold’
- and a banner should be displayed for the superAdmin informing them that the date should be updated

---

## Consolidated Acceptance Criteria

- Scenario 01: Prevent Challenge Overlap
- As a superAdmin on adminPanel I am creating a new challenge,
- When I select validity date range (Start Date to End Date)
- Then I should see the dates  that already have an ongoing or upcoming challenge within the same date range, disabled
- Scenario 02: Edit Challenge with New Overlapping Dates
- As a superAdmin on adminPanel I am editing an upcoming challenge,
- When I change its validity dates to overlap with another challenge,
- Scenario 03: Cash-back Processing for Multiple Challenges in the Same Billing Cycle
- As a system,
- When a business completes multiple challenges that qualify for cash-back within the same billing cycle,
- Then the total reward processed for that business should be the sum of the cash-back from all eligible completed challenges.
- Scenario 01: Viewing All Challenges List
- As a superAdmin on adminPanel,
- When I access the Challenge section,
- Then I should see a table of all existing challenges with the follwing columns
- name
- Start Date
- End Date
- Number of businesses who completed the challenge
- activation
- status
- Actions
- Scenario 02: Filtering Challenges List
- As an admin,
- When I am viewing the list of challenges,
- Then I should be able to
- filter challenges by
- status (upcoming, ongoing, completed)
- activation (enabled, disabled)
- Search by
- Company (included in the challenge)
- Challenge ID
- Scenario 03: Adding a New Challenge
- As a superAdmin,
- When I click on the add challenge button,
- Then I should see a form to create a new challenge where I am able to input:
- Challenge Name(REQUIRED) (should not exceed 30 characters)
- Elligible Companies (Select all or search by name, or per payment plan) (REQUIRED)
- Start Date (REQUIRED)
- End Date (REQUIRED) (End date cannot be before start date)
- Add a challenge segment (Finished trips interval & cash-back percentage gained)
- Add / Delete the last segment (if only one segment was created then we should not be able to delete it)
- Each challenge has minimum 1 segment, maximum 10
- Scenario 04: Viewing Challenge Details for Completed Challenges
- When I click on a challenge in the list (click on view details on the actions column),
- Then a detailed screen should open, displaying:
- All segments (interval of finished trips, discount percentage)
- Activity log (date, editor, action, log (old and new value))
- note : we need to include the creation of the challenge on the logs as well
- status,
- Number of eligible businesses (on click we would display an overlay screen displaying the list of all elligible businesses for the challenge)
- Number of businesses who completed the challenge (on click we would display an overlay screen displaying the list of businesses that completed the challenge)
- Scenario 05: Viewing Challenge Details for Upcoming Challenges
- Elligible companies
- Edit options (Edit Challenge/ Edit Challenge)
- Disable/Enable toggle button (for upcoming challenges only)
- Activity log(date, editor, action, log (old and new value))
- Scenario 06: Editing/Deleting/Activating/De-activating Actions for Upcoming Challenges Only
- When a challenge is ongoing or completed,
- Then I should not be able to Edit/ Delete/ Enable/ Disable
- Scenario 07: Detailed Refund Display on Transaction Table
- As an admin on AdminPanel,
- When I view the transaction table of a company that have gained a cash-back,
- Then I should see detailed information for each challenge cash-back.
- Scenario 08: Read_Only View for admins
- When I view the challenge section,
- Then I need to have a Read_Only view for all challenge screens (I shouldn’t be able to create/edit/disable/enable challenges
- Scenario 09: Challenges Configuration per Country
- As a superAdmin on AdminPanel,
- When I set a Challenge,
- Then It should be applicable for the country I have access to only (based on phone number)
- Scenario 10: Logs for Editing Actions
- When I edit a challenge,
- Then the action should be listed on the challenge details screen
- Scenario 11: Incrementing the Counter for Businesses that Completed the Challenge
- As a business,
- When I meet at least the first criterion for the challenge,
- Then I should be included in the counter for businesses that completed the challenge (even if I did not manage to complete all the criterions for the challenge)
- Scenario 12: Challenge Disabled while we reached the Start Date
- When I disable a challenge and we reach its start date,
- Then
- status of the challenge should not move to ‘on-going' and keep it as 'On-hold’
- and a banner should be displayed for the superAdmin informing them that the date should be updated
