---
id: "jira-dashops"
title: "DashOps"
system: "DashOps"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","dashops"]
last_synced: "2025-08-27T12:40:28.202Z"
ticket_count: 6
active_ticket_count: 6
---

# DashOps

> Auto-generated from 6 Jira tickets.
> Last synced: 2025-08-27T12:40:28.202Z
> Active features: 6

## User Stories

### CMB-20868: Managing Trip Statuses for "Booked for Later" with Auto-Approval Disabled on dashops

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-12-19

**Description:**
As an admin on dashops,

**Acceptance Criteria:**
- Scenario 1: Managing booked for later trips statusses
- Given I am an admin on dashops on the booking section,
- When A user with auto approval feature is off books a trip for later,
- Then I should see the flag 'waiting for approval' and I should not be able to change the trip status from pending to other status (Book Assigned) unless the BAM approves the trip
- Scenario 2: BAM approves the booked for later trip
- Given I am an admin on dashops on the booking section,
- When the BAM approves the booked for later trip,
- Then I should not see the flag 'waiting for approval’ anymore and I should be able to change the trip status from pending to other statuses (Book assigned)
- Scenario 3: Timer Expires for booked for later trips
- Given I am an admin on dashops on the booking section,
- When the timer of the booked for later trip is expired (before the BAM approval),
- Then the new status (B2B EXPIRED) should be displayed and I cannot change the trip status anymore
- Scenario 4: Rider Cancels Booked For Later Trip
- Given a user has booked a trip for later,
- When the user cancels the trip before the BAM approves it,
- Then the trip status should update to "Rider Cancelled," and the flag 'waiting for approval' should no longer appear.

---

### CMB-14535: Change Spending allowance to be per Ride, day, week, month

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-05-13

**Description:**
User Story:

**Acceptance Criteria:**
- Scenario 1: Changing Spending Allowance Duration
- Given that I am logged in as a Business Account Manager,
- When I navigate to the program settings section on the Yassir for Business platform,
- And I locate the spending allowance parameter,
- Then I should have the option to select the duration for the spending allowance, such as per user per trip, day, week, or month.
- Scenario 2: Choosing the spending allowance duration and Limit:
- Given that I am on the program settings page,
- When I choose the Duration as "per week",
- Then I should be able to enter the maximum amount the user can spend per week. and the slider should update its values accordingly:
- Algeria: Min: 10000 DZ, Max 500K DZ
- Senegal: Min: 1000 CFA, Max 30K CFA
- Morocco: Min: 1000 MAD, Max 30K MAD
- Tunisia: Min: 50 TND, Max 5000 TND
- And when I choose the frequency as "per month",
- Then I should be able to enter the maximum amount the user can spend a month. and the slider should update its values accordingly:
- Algeria: Min: 10000 DZ, Max 1M DZ
- Senegal: Min: 5000 CFA, Max 100K CFA
- Morocco: Min: 5000 MAD, Max 100K MAD
- Tunisia: Min: 100 TND, Max 15000 TND
- And when I choose the frequency as "per day",
- Then I should be able to enter the maximum amount the user can spend daily. and the slider should update its values accordingly:
- the slider should update its values accordingly:
- Algeria: Min: 5000 DZ, Max 100K DZ
- Senegal: Min: 50 CFA, Max 10000 CFA
- Morocco: Min: 50 MAD, Max 10000 MAD
- Tunisia: Min: 20 TND, Max 1500 TND
- And when I choose the frequency as "per trip",
- Then I should be able to enter the maximum amount the user can spend per trip. and the slider should update its values accordingly:
- the slider should update its values accordingly:
- Algeria: Min: 1000 DZ, Max 80K DZ
- Senegal: Min: 15 CFA, Max 1000 CFA
- Morocco: Min: 15 MAD, Max 1000 MAD
- Tunisia: Min: 15 TND, Max 1000 TND
- Scenario 3: Saving Changes:
- Given that I have entered the allowed number of trips for business riders,
- When I have set the limits for each frequency,
- Then I should be able to save these changes.
- The system should update the program settings accordingly.
- Scenario 4: Scheduled trips
- Given that I have Scheduled the trips on a certain date
- When the system checks the limit of the booked number of trips (Day, Week, Month)
- Then the system should check the date Planned for the trip in case of week, month, day
- Scenario 5: Scheduled trips
- Given that I have Scheduled the trips on a certain date
- When the system checks the limit of the booked number of trips and we have already chosen the spending allowance per trip
- Then the system should check the spending allowance for the trip only regardless of the other booked trips
- Scenario 6: Error Screens
- Given that the user has exceeded the number of trips to be booked, or planned per (day, Week, or Month)
- When I click on the request Button
- Then I should get an error message informing me that I have exceeded my spending allowance limit for that day, week, month
- Scenario 7: Unlimited spending allowance  enabled by default
- Given that as a BAM on the editing program screen, I try to change the spending allowance of programs, I need to find a button (Checbox, or a Radio Button)
- When I check it
- Then I need it to be checked by default so that the users of this program can take trips with unlimited allowance
- Scenario 8: Unlimited spending allowance disabled
- Given that as a BAM on the editing program screen, I try to change the spending allowance of a program, I need to find a button (Checbox, or a Radio Button)
- When I click on the button to make it disabled
- Then I should be able to change the spending allowance sliders, to set a certain amount the users can spend
- Note Week is defined based, on the following:
- Tunisia: Monday to Sunday
- Senegal: Monday to Sunday
- Algeria: Sunday, to Saturday
- Morocco: Sunday, to Saturday
- Note: We need to have a Google Analytics Event to be triggered in every time we choose one of the parameters:
- Day, Week, Month

---

### CMB-18349: Update Dashops Company List 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-10-02

**Description:**
As an Admin on the Dashops who has access to the company list,

**Acceptance Criteria:**
- Scenario 1: Viewing Company List with Key Details
- Given that I am logged into the Dashops as an Admin,
- When I navigate to the company list,
- Then I should see the following details for each company:
- Company Name
- Business Account Manager (BAM) Name
- BAM Email
- BAM Phone Number
- Number of Active Users
- Payment Plan (Prepaid/Postpaid)
- Left Budget for Prepaid, or Budget Limit - Due Budget for Postpaid
- Dedicated Account Manager  Phone Number
- Company Status (Active/Inactive)
- Migrated or not to V2
- Scenario 2: Reflecting Changes in Company Status
- Given that a company's status is updated or the company is removed from the Admin panel,
- When I view the company list in Dashops,
- Then the company’s updated status (active/inactive) or removal should be reflected in the Dashops company list automatically.
- Scenario 3: Monitoring Payment Plan and Budget Information
- Given that I am reviewing a company's details in the Dashops panel,
- When I view a company's payment plan,
- Then I should see whether the company is on a prepaid or postpaid plan,
- And for prepaid companies, I should see the remaining budget,
- And for postpaid companies, I should see the budget limit - due budget amounts.
- Scenario 4: If a company is on V1
- Given We have a business created on V1,
- When I view this company's
- Then  we should see the company information as missing

---

### CMB-18708: Removing Finance section on Dashops

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-10-16

**Description:**
As an Admin on the Dashops platform,

**Acceptance Criteria:**
- Scenario 1: Removing the Finance and Payment Section from Main Panel
- Given that I am logged into the Dashops platform as an Admin,
- When I navigate to the main panel,
- Then the finance and payment section should no longer be visible or accessible in the main navigation panel.
- Scenario 2: Removing the Finance and Payment Section from the Enterprise List
- Given that I am viewing the enterprise list on the Dashops platform,
- When I access the details for a specific enterprise,
- Then the finance and payment section should no longer be available within the enterprise details page.

---

### CMB-20019: Flagging trip as waiting for approval 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-11-25

**Description:**
As an Admin on the Dashops platform,

**Acceptance Criteria:**
- Scenario 1: Identifying Instant Pending Trip Waiting for BAM Approval
- Given: I am logged in as an Admin on the Dashops platform.
- When: I view the instant trips table with pending trips.
- Then: I should see a tag labeled "Waiting for BAM Approval" for any trip that is pending due to BAM approval.
- And When: I click on the trip details of such a trip,
- Then: I should find a clear indication that the trip is pending due to BAM approval.
- Scenario 2: Identifying instant Pending Trip that isn’t waiting for BAM approval
- Given: I am logged in as an Admin on the Dashops platform.
- When: I view the trips table with pending trips.
- Then: I should see the instant trips pending and I can update their status normally without any changes to the instant trip flow
- Scenario 3:  Identifying scheduled for later Pending Trip that is waiting for BAM approval
- Given: I am logged in as an Admin on the Dashops platform.
- When: I view the scheduled trips table with pending trips.
- Then: I should see a tag labeled "Waiting for BAM Approval" for any trip that is pending due to BAM approval.
- And When: I click on the trip details of such a trip,
- Then: I should find a clear indication that the trip is pending due to BAM approval.
- Scenario 4: Identifying scheduled for later Pending Trip that isn’t waiting for BAM approval
- Given: I am logged in as an Admin on the Dashops platform.
- When: I view the trips table with pending trips.
- Then: I should see the scheduled trips pending and I can update their status normally without any changes to the scheduled trip flow

---

## Consolidated Acceptance Criteria

- Scenario 1: Managing booked for later trips statusses
- Given I am an admin on dashops on the booking section,
- When A user with auto approval feature is off books a trip for later,
- Then I should see the flag 'waiting for approval' and I should not be able to change the trip status from pending to other status (Book Assigned) unless the BAM approves the trip
- Scenario 2: BAM approves the booked for later trip
- When the BAM approves the booked for later trip,
- Then I should not see the flag 'waiting for approval’ anymore and I should be able to change the trip status from pending to other statuses (Book assigned)
- Scenario 3: Timer Expires for booked for later trips
- When the timer of the booked for later trip is expired (before the BAM approval),
- Then the new status (B2B EXPIRED) should be displayed and I cannot change the trip status anymore
- Scenario 4: Rider Cancels Booked For Later Trip
- Given a user has booked a trip for later,
- When the user cancels the trip before the BAM approves it,
- Then the trip status should update to "Rider Cancelled," and the flag 'waiting for approval' should no longer appear.
- Scenario 1: Changing Spending Allowance Duration
- Given that I am logged in as a Business Account Manager,
- When I navigate to the program settings section on the Yassir for Business platform,
- And I locate the spending allowance parameter,
- Then I should have the option to select the duration for the spending allowance, such as per user per trip, day, week, or month.
- Scenario 2: Choosing the spending allowance duration and Limit:
- Given that I am on the program settings page,
- When I choose the Duration as "per week",
- Then I should be able to enter the maximum amount the user can spend per week. and the slider should update its values accordingly:
- Algeria: Min: 10000 DZ, Max 500K DZ
- Senegal: Min: 1000 CFA, Max 30K CFA
- Morocco: Min: 1000 MAD, Max 30K MAD
- Tunisia: Min: 50 TND, Max 5000 TND
- And when I choose the frequency as "per month",
- Then I should be able to enter the maximum amount the user can spend a month. and the slider should update its values accordingly:
- Algeria: Min: 10000 DZ, Max 1M DZ
- Senegal: Min: 5000 CFA, Max 100K CFA
- Morocco: Min: 5000 MAD, Max 100K MAD
- Tunisia: Min: 100 TND, Max 15000 TND
- And when I choose the frequency as "per day",
- Then I should be able to enter the maximum amount the user can spend daily. and the slider should update its values accordingly:
- the slider should update its values accordingly:
- Algeria: Min: 5000 DZ, Max 100K DZ
- Senegal: Min: 50 CFA, Max 10000 CFA
- Morocco: Min: 50 MAD, Max 10000 MAD
- Tunisia: Min: 20 TND, Max 1500 TND
- And when I choose the frequency as "per trip",
- Then I should be able to enter the maximum amount the user can spend per trip. and the slider should update its values accordingly:
- Algeria: Min: 1000 DZ, Max 80K DZ
- Senegal: Min: 15 CFA, Max 1000 CFA
- Morocco: Min: 15 MAD, Max 1000 MAD
- Tunisia: Min: 15 TND, Max 1000 TND
- Scenario 3: Saving Changes:
- Given that I have entered the allowed number of trips for business riders,
- When I have set the limits for each frequency,
- Then I should be able to save these changes.
- The system should update the program settings accordingly.
- Scenario 4: Scheduled trips
- Given that I have Scheduled the trips on a certain date
- When the system checks the limit of the booked number of trips (Day, Week, Month)
- Then the system should check the date Planned for the trip in case of week, month, day
- Scenario 5: Scheduled trips
- When the system checks the limit of the booked number of trips and we have already chosen the spending allowance per trip
- Then the system should check the spending allowance for the trip only regardless of the other booked trips
- Scenario 6: Error Screens
- Given that the user has exceeded the number of trips to be booked, or planned per (day, Week, or Month)
- When I click on the request Button
- Then I should get an error message informing me that I have exceeded my spending allowance limit for that day, week, month
- Scenario 7: Unlimited spending allowance  enabled by default
- Given that as a BAM on the editing program screen, I try to change the spending allowance of programs, I need to find a button (Checbox, or a Radio Button)
- When I check it
- Then I need it to be checked by default so that the users of this program can take trips with unlimited allowance
- Scenario 8: Unlimited spending allowance disabled
- Given that as a BAM on the editing program screen, I try to change the spending allowance of a program, I need to find a button (Checbox, or a Radio Button)
- When I click on the button to make it disabled
- Then I should be able to change the spending allowance sliders, to set a certain amount the users can spend
- Note Week is defined based, on the following:
- Tunisia: Monday to Sunday
- Senegal: Monday to Sunday
- Algeria: Sunday, to Saturday
- Morocco: Sunday, to Saturday
- Note: We need to have a Google Analytics Event to be triggered in every time we choose one of the parameters:
- Day, Week, Month
- Scenario 1: Viewing Company List with Key Details
- Given that I am logged into the Dashops as an Admin,
- When I navigate to the company list,
- Then I should see the following details for each company:
- Company Name
- Business Account Manager (BAM) Name
- BAM Email
- BAM Phone Number
- Number of Active Users
- Payment Plan (Prepaid/Postpaid)
- Left Budget for Prepaid, or Budget Limit - Due Budget for Postpaid
- Dedicated Account Manager  Phone Number
- Company Status (Active/Inactive)
- Migrated or not to V2
- Scenario 2: Reflecting Changes in Company Status
- Given that a company's status is updated or the company is removed from the Admin panel,
- When I view the company list in Dashops,
- Then the company’s updated status (active/inactive) or removal should be reflected in the Dashops company list automatically.
- Scenario 3: Monitoring Payment Plan and Budget Information
- Given that I am reviewing a company's details in the Dashops panel,
- When I view a company's payment plan,
- Then I should see whether the company is on a prepaid or postpaid plan,
- And for prepaid companies, I should see the remaining budget,
- And for postpaid companies, I should see the budget limit - due budget amounts.
- Scenario 4: If a company is on V1
- Given We have a business created on V1,
- When I view this company's
- Then  we should see the company information as missing
- Scenario 1: Removing the Finance and Payment Section from Main Panel
- Given that I am logged into the Dashops platform as an Admin,
- When I navigate to the main panel,
- Then the finance and payment section should no longer be visible or accessible in the main navigation panel.
- Scenario 2: Removing the Finance and Payment Section from the Enterprise List
- Given that I am viewing the enterprise list on the Dashops platform,
- When I access the details for a specific enterprise,
- Then the finance and payment section should no longer be available within the enterprise details page.
- Scenario 1: Identifying Instant Pending Trip Waiting for BAM Approval
- Given: I am logged in as an Admin on the Dashops platform.
- When: I view the instant trips table with pending trips.
- Then: I should see a tag labeled "Waiting for BAM Approval" for any trip that is pending due to BAM approval.
- And When: I click on the trip details of such a trip,
- Then: I should find a clear indication that the trip is pending due to BAM approval.
- Scenario 2: Identifying instant Pending Trip that isn’t waiting for BAM approval
- When: I view the trips table with pending trips.
- Then: I should see the instant trips pending and I can update their status normally without any changes to the instant trip flow
- Scenario 3:  Identifying scheduled for later Pending Trip that is waiting for BAM approval
- When: I view the scheduled trips table with pending trips.
- Scenario 4: Identifying scheduled for later Pending Trip that isn’t waiting for BAM approval
- Then: I should see the scheduled trips pending and I can update their status normally without any changes to the scheduled trip flow
