---
id: "jira-b2b-portal-referrals"
title: "B2B Portal — Referrals"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal"]
last_synced: "2025-07-11T02:34:34.361Z"
ticket_count: 7
active_ticket_count: 5
---

# B2B Portal — Referrals

> Auto-generated from 7 Jira tickets.
> Last synced: 2025-07-11T02:34:34.361Z
> Active features: 5
> Superseded: 2

## User Stories

### CMB-26243: 2.0 Referral Reward for Businesses

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-06-03

**Description:**
As a BAM on the webApp (Business X), I want to receive a reward when my referral link leads to successful required actions performed by Business Y, so that I can benefit from referring other businesses.

**Acceptance Criteria:**
- Scenario 1: Accessing Referral Link
- Given I am a business representative (Business Y) accessing the referral link received (by Business X),
- When I click on the referral link,
- Then I should be redirected to the sign-up flow,
- And I should be identified as a referred business for the referring business.
- Scenario 2: Reward Calculation
- Given business Y accesses the referral link,
- When they finish a required action set on the reward rule,
- Then the reward for Business X should be calculated as:
- Reward 1=P%(discount percentage))×invoice while =< price limit, for post-paid businesses
- if Reward1>price limit then Reward1=price limit and proceed with the refund
- Reward 2=Free X number of trips while each trip =< price limit, for pre-paid businesses
- if trip price > trip price limit then no reward is processed
- if validity date =/= unlimited by time then process the reward until free trips count == 0
- Scenario 3: Updating Country Reward Rule
- Given I am an admin on the adminPanel,
- When I update the reward rule,
- Then the new rule should be applied on the new & old referrals
- Scenario 4: Updating Business Reward Rule during reward processing
- Given the system is processing a reward,
- When the admin updates the rule,
- Then the system should process the rewards based on the old rule
- Scenario 5: Updating Business X Budget Post-paid
- Given business Y made a required action,
- When the reward calculation is processed,
- Then the budget of business X should be updated by the end of month to Due budget= Due budget-Reward1
- Scenario 6: Notifying Business X
- Given Business Y completes a required action during the month,
- When reward is processed,
- Then the system should send an automatic notification on webApp :
- for pre-paid companies : an instant notification is sent on every free completed trip
- for post-paid companies : a montly notification is sent when refunding the % of the invoice (the value refunded should be displayed on the notification and should reflect the sum of all refund values by all referred businesses)
- Scenario 7: Reflecting the Reward on AdminPanel
- Given the reward for Business X is calculated,
- When the reward is issued,
- Then the system should reflect
- For post-paid businesses : the % applied in the transaction table on adminPanel.
- For pre-paid businesses : the trip price = 0 should only reflect on the trips table
- Scenario 8: Monthly amount spent of business X = 0 for post-paid businesses or business de-activated
- Given a required action has been processed by business Y
- When business X did not make any trips on the current month, or business X was de-activated
- Then the reward should be kept ON-HOLD until the invoice value is different than 0 or the business is activated again as long as the rule is still active, if rule was deleted then the reward is expired.
- Scenario 9: Business switched payment plans
- Given the Business X has changed its payment from postpaid to prepaid and vice versa
- When the changement of plan is confimed,
- Then the reward calculations rule applied should switch from postpaid to prepaid and vice versa
- note :
- the users invited should be active users ( finish their onboarding in order for the calculations to take place)
- refund calculations should be by the end of the month and one time reward
- In case the threshold was edited during the month the refund should be processed once the new threshold is met
- if the user has been invited and finished his onboarding then deleted then invited again then count of an onboarded user should not be incremented
- if the business is deleted then the referral link should be expired (we inform that the refferral link is no longer accessible and refferred businesses should be redirected to the sign up flow)
- Scenario 01: Access Company Referral Settings
- Given I am an admin with access to the "Business Referrals" tab on the adminPanel,
- When I navigate to the "Business Referrals" section under a specific company profile,
- Then I should see a toggle button allowing me to switch between “Country Settings” and “Company Rule”
- Scenario 02: Create Company Reward Rule
- Given I am an admin with access to the "Business Referrals" tab on the adminPanel and I have selected a company,
- When I switch to the “Company Rule” mode and click “Create Rule,”
- Then  I should see a form to fill depending on the payment plan:
- Required actions:
- Pre-paid: Budget Top-up, Users Onboarded, Trips Completion
- Post-paid: Amount Spent, Users Onboarded, Trips Completion
- Reward:
- Post-paid: Discount % on monthly spending
- Pre-paid: Number of free trips
- Completion Threshold
- Reward Price Limit
- Reward Validity Date (unlimited or time-limited)
- And the discount % should be between 0% and 100%.
- Scenario 03: Company Rule Overrides Country Rule
- Given a country referral reward rule exists,
- When the BAM accesses the invite section on the webApp,
- Then the system should display the company-specific rule instead of the country-level rule, And the referral history data should reset for that company from the moment the company rule is created, And the business reward should follow the country rule
- Scenario 04: Edit Company Rule
- Given a company-specific referral rule exists,
- When I click “Edit Rule,”
- Then I should be able to modify the rule’s parameters, And all updates should reflect both on the adminPanel and webApp instantly.
- Scenario 05: Delete Company Rule
- When I click “Delete Rule,”
- Then the company will fall back to the country rule if available,
- Else the invite section should be disabled on the webApp for that company, And no reward is processed
- Scenario 06: Reflecting Data on Invoice & Financial Report
- Given a company-level rule exists and is applied,
- When invoices and financial reports are generated,
- Then I should see:
- for pre-paid companies : they should follow the same structure and detail format as country-based reports (T2 Discount Value, T2 Discount )
- for post-paid : All free trips should be highlighted on the trips export files (dashops, adminPanel, webApp)
- Scenario 07: Company referrals history on adminPanel
- Given a new company-level rule is created for a business,
- When I view the referral overview under the “Company Referrals” tab,
- Then the referred businesses are listed on the history section.
- Scenario 08: Validation for Company Rule Creation
- Given I attempt to create a company rule,
- When required fields (e.g., required action, threshold, reward) are missing,
- Then I should see an error message prompting me to complete all required fields.
- Scenario 09: No Company Rule Exists
- Given no company-specific reward rule exists,
- When I view the “Company Referral Settings” tab,
- Then I should see an empty state screen prompting me to “Create First Company Reward Rule.”
- Scenario 10: Business Plan Change to Post-paid
- Given The country rule for pre-paid is budget topup and business X is pre-paid,
- When the payment plan for business Y to post-paid,
- Then the increase on the budget limit for business Y is considered as a budget top-up.
- Given the RA count of how many times the RA was performed is determined based on both threshold-based and non-threshold-based actions,
- When count = threshold,
- Reward=P%(discount percentage))×spending amount,
- where the spending amount is the total amount spent by Business X during that month once per business
- Scenario 3: Updating Business Reward Rule
- Then the new rule should be applied on the new referrals (& old rule should be applied on the old refferrals)
- Scenario 5: Updating Business Reward Rule during reward processing
- Scenario 6: Updating Business X Budget Pre-paid
- Then the budget of business X should be updated by the end of the month to Budget= budget+reward
- Scenario 7: Updating Business X Budget Post-paid
- Then the budget of business X should be updated instantly to Due budget= Due budget-reward
- Scenario 8: Notifying Business X
- Then the system should send an automatic notification on the webApp informing Business X that a reward (refund) had been added to their budget (once per month and the value refunded displayed on the notification should be = the sum of all refund values by all businesses)
- Scenario 9: Reflecting the Discount Amount on AdminPanel
- Then the system should reflect the discount applied in the transaction section on the adminPanel.
- Scenario 10: Monthly amount spent of business X = 0
- When business X did not make any trips on the current month,
- Then the reward should be kept until the monthly amount spent is different than 0
- the users invited should be active users ( finish their onboarding in order for the calculation sto take place)
- if the user has been invited then deleted then invited again the count should not be incremented
- if the business is deleted then the link should be expired (we inform that the refferral link is no longer accessible and refferred businesses should be redirected to the sign up flow)

---

### CMB-21055: Setting Up Reward Rules on AdminPanel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-12-25

**Description:**
As an admin on the adminPanel, I want to configure and manage reward rules based on specific actions taken by referred businesses so that I can create tailored benefits for the referring businesses.

**Acceptance Criteria:**
- Scenario 1: Access Business Referrals Section on AdminPanel
- Given I am an admin who has access to the business referrals tab on the adminPanel,
- When I navigate to the "Country Settings" section,
- Then I should see a new tab “Business Referrals."
- Scenario 2: Displaying Business Referrals Section on AdminPanel
- Given I am on the adminPanel,
- When I navigate to the Business Referrals tab,
- Then I should see a
- A referrals links history list.
- A section displaying the reward rule.
- A button labeled “Create Reward Rule” (if no rule exists).
- Scenario 3: Create Reward Rule
- Given I am superAdmin on the Business Referrals tab,
- When I click on "Create Rule,"
- Then I should see a screen with the following options for required actions on a drop-down list:
- Budget Top-up
- Users Invitation
- Number of Trips
- Amount Spent
- And an input field for the discount percentage applied on the monthly spending amount for business X.
- Scenario 4: Dynamic Threshold Field Behavior
- Given I am creating a reward rule,
- When I select Budget Top-up,
- Then the threshold field should not be visible.
- When I select Users Invitation, Number of Trips, or Amount Spent,
- Then the threshold field should appear to specify the required value.
- Scenario 5: Restriction on Multiple Rules
- Given there is already an existing reward rule for the country,
- When I view the Business Referrals tab,
- Then:
- The “Create Reward Rule” button should be disabled.
- On hovering over the button, a tooltip should display:
- "You can only have one reward rule per country. To modify, click Edit Rule."
- Scenario 6: View and Edit Existing Rule
- Given I have previously created reward rule,
- When I view the Business Referral section,
- Then I should see a list of existing rule with details such as:
- Required action
- Threshold (if applicable)
- Creation Date
- Amount of discount applied
- And I should have the option to edit or delete existing rule.
- Scenario 7: Edit Existing Rule
- Given a reward rule exists for the country,
- When I click "Edit Rule,"
- Then I should be able to modify the existing rule parameters (e.g., required actions, discount percentage, thresholds).
- Scenario 8: Delete Existing Rule
- Given a reward rule exists for the country,
- When I click "Delete,"
- Then the rule should be deleted and the create rule button should be enabled again and the default rule should be applied instead until the new rule is set
- Scenario 9: Validation for Rule Creation
- Given I am creating a new reward rule,
- When I attempt to save the rule without specifying all required fields (action, threshold, or reward),
- Then I should see an error message prompting me to complete the missing fields.
- Scenario 10: No Existing Rules
- Given there are no reward rules created yet,
- When I view the "Reward Rules" section,
- Then I should see an empty state screen with a prompt to create the first reward rule.
- Scenario 11: Referral Link Shared with No Reward Rule Set
- Given no reward rule has been set on the adminPanel,
- When a BAM shares a referral link from the webApp,
- Then the referral link should appear in the Referral History List on the adminPanel and a default rule should be applied.
- note :
- the percentage of the reward should be from 0 to 100 %
- the reward should be applied per country

---

### CMB-21054: Referrals Links History on AdminPanel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-12-25

**Description:**
As an admin on the AdminPanel, I want to view and manage the referral links history, so that I can maintain an organized and accurate record of referral activities.

**Acceptance Criteria:**
- A referrals links history list.
- A section for managing reward rules.
- A button labeled “Create Reward Rule” (if no rule exists) (only one rule per country).
- Referrer company name (business X name)
- BAM email
- Number of completed referrals (how many business finished required actions)
- Referrer company name (business X name)
- BAM email
- referral link
- Number of completed referrals (how many business finished required actions)
- List of every company that used the referral link (to sign-up or those who signed up and performed a required action)
- Status
- Pending : for companies that signed up without completing a required action
- Completed : for companies that signed up and completed a required action

---

### CMB-20894: Business Referrals Section on WebApp

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-12-20

**Description:**
As a BAM on the webApp, I want to have access to a Business Referrals section so that I can easily navigate to referral feature and generate referrals links (generate direct link or sending referrals links to user’s inboxes).

**Acceptance Criteria:**
- Scenario 1: Adding 'Business Referrals' Widget
- Given I am on the webApp,
- When I access the dashboard screen,
- Then I should see a new widget 'Business Referrals'.
- Scenario 2: Adding 'Business Referrals' on the navigation menu
- Given I am on the webApp,
- When I view the navigation menu,
- Then I should see a new ‘Business Referrals’ section.
- Scenario 3: Business Referrals Screen
- Given I am on the webApp,
- When I access the business referrals section either from the dashboard widget or on the navigation menu,
- Then I should see a screen that displays the referral link and also an overview with statistics
- Scenario 4: Referral Link Generation
- Given I am on the Business Referral screen,
- When I access the section for the referral link,
- Then I should see options for
- Copy link (for copying the link)
- Share link (for external application sharing)
- Scenario 5: Referral Link Sharing
- Given the BAM is on the referral link generation screen,
- When I click the "Share" button,
- Then an application menu should appear, And the user should be able to select an external application (e.g., WhatsApp, LinkedIn, Twitter),
- Scenario 6: Referral Link Sharing Successful Popup
- Given I am a BAM on the webApp (Business X),
- When I share the referral link or I copy the referral it,
- Then I should see a successful pop-up informing me that the copying was successful
- Scenario 7: Referral Screen Statistics Overview
- Given I am a BAM on webapp,
- When I access the business Referrals screen,
- Then I should see the statistics overview for the referral link statistics should include
- How many users are pending (users signed up but did not perform a required action yet)
- How many users used the link (how many users performed a required action)
- The sum of discounts business X gained from the referral links
- Event Name

---

## Consolidated Acceptance Criteria

- Scenario 1: Accessing Referral Link
- Given I am a business representative (Business Y) accessing the referral link received (by Business X),
- When I click on the referral link,
- Then I should be redirected to the sign-up flow,
- And I should be identified as a referred business for the referring business.
- Scenario 2: Reward Calculation
- Given business Y accesses the referral link,
- When they finish a required action set on the reward rule,
- Then the reward for Business X should be calculated as:
- Reward 1=P%(discount percentage))×invoice while =< price limit, for post-paid businesses
- if Reward1>price limit then Reward1=price limit and proceed with the refund
- Reward 2=Free X number of trips while each trip =< price limit, for pre-paid businesses
- if trip price > trip price limit then no reward is processed
- if validity date =/= unlimited by time then process the reward until free trips count == 0
- Scenario 3: Updating Country Reward Rule
- Given I am an admin on the adminPanel,
- When I update the reward rule,
- Then the new rule should be applied on the new & old referrals
- Scenario 4: Updating Business Reward Rule during reward processing
- Given the system is processing a reward,
- When the admin updates the rule,
- Then the system should process the rewards based on the old rule
- Scenario 5: Updating Business X Budget Post-paid
- Given business Y made a required action,
- When the reward calculation is processed,
- Then the budget of business X should be updated by the end of month to Due budget= Due budget-Reward1
- Scenario 6: Notifying Business X
- Given Business Y completes a required action during the month,
- When reward is processed,
- Then the system should send an automatic notification on webApp :
- for pre-paid companies : an instant notification is sent on every free completed trip
- for post-paid companies : a montly notification is sent when refunding the % of the invoice (the value refunded should be displayed on the notification and should reflect the sum of all refund values by all referred businesses)
- Scenario 7: Reflecting the Reward on AdminPanel
- Given the reward for Business X is calculated,
- When the reward is issued,
- Then the system should reflect
- For post-paid businesses : the % applied in the transaction table on adminPanel.
- For pre-paid businesses : the trip price = 0 should only reflect on the trips table
- Scenario 8: Monthly amount spent of business X = 0 for post-paid businesses or business de-activated
- Given a required action has been processed by business Y
- When business X did not make any trips on the current month, or business X was de-activated
- Then the reward should be kept ON-HOLD until the invoice value is different than 0 or the business is activated again as long as the rule is still active, if rule was deleted then the reward is expired.
- Scenario 9: Business switched payment plans
- Given the Business X has changed its payment from postpaid to prepaid and vice versa
- When the changement of plan is confimed,
- Then the reward calculations rule applied should switch from postpaid to prepaid and vice versa
- note :
- the users invited should be active users ( finish their onboarding in order for the calculations to take place)
- refund calculations should be by the end of the month and one time reward
- In case the threshold was edited during the month the refund should be processed once the new threshold is met
- if the user has been invited and finished his onboarding then deleted then invited again then count of an onboarded user should not be incremented
- if the business is deleted then the referral link should be expired (we inform that the refferral link is no longer accessible and refferred businesses should be redirected to the sign up flow)
- Scenario 01: Access Company Referral Settings
- Given I am an admin with access to the "Business Referrals" tab on the adminPanel,
- When I navigate to the "Business Referrals" section under a specific company profile,
- Then I should see a toggle button allowing me to switch between “Country Settings” and “Company Rule”
- Scenario 02: Create Company Reward Rule
- Given I am an admin with access to the "Business Referrals" tab on the adminPanel and I have selected a company,
- When I switch to the “Company Rule” mode and click “Create Rule,”
- Then  I should see a form to fill depending on the payment plan:
- Required actions:
- Pre-paid: Budget Top-up, Users Onboarded, Trips Completion
- Post-paid: Amount Spent, Users Onboarded, Trips Completion
- Reward:
- Post-paid: Discount % on monthly spending
- Pre-paid: Number of free trips
- Completion Threshold
- Reward Price Limit
- Reward Validity Date (unlimited or time-limited)
- And the discount % should be between 0% and 100%.
- Scenario 03: Company Rule Overrides Country Rule
- Given a country referral reward rule exists,
- When the BAM accesses the invite section on the webApp,
- Then the system should display the company-specific rule instead of the country-level rule, And the referral history data should reset for that company from the moment the company rule is created, And the business reward should follow the country rule
- Scenario 04: Edit Company Rule
- Given a company-specific referral rule exists,
- When I click “Edit Rule,”
- Then I should be able to modify the rule’s parameters, And all updates should reflect both on the adminPanel and webApp instantly.
- Scenario 05: Delete Company Rule
- When I click “Delete Rule,”
- Then the company will fall back to the country rule if available,
- Else the invite section should be disabled on the webApp for that company, And no reward is processed
- Scenario 06: Reflecting Data on Invoice & Financial Report
- Given a company-level rule exists and is applied,
- When invoices and financial reports are generated,
- Then I should see:
- for pre-paid companies : they should follow the same structure and detail format as country-based reports (T2 Discount Value, T2 Discount )
- for post-paid : All free trips should be highlighted on the trips export files (dashops, adminPanel, webApp)
- Scenario 07: Company referrals history on adminPanel
- Given a new company-level rule is created for a business,
- When I view the referral overview under the “Company Referrals” tab,
- Then the referred businesses are listed on the history section.
- Scenario 08: Validation for Company Rule Creation
- Given I attempt to create a company rule,
- When required fields (e.g., required action, threshold, reward) are missing,
- Then I should see an error message prompting me to complete all required fields.
- Scenario 09: No Company Rule Exists
- Given no company-specific reward rule exists,
- When I view the “Company Referral Settings” tab,
- Then I should see an empty state screen prompting me to “Create First Company Reward Rule.”
- Scenario 10: Business Plan Change to Post-paid
- Given The country rule for pre-paid is budget topup and business X is pre-paid,
- When the payment plan for business Y to post-paid,
- Then the increase on the budget limit for business Y is considered as a budget top-up.
- Given the RA count of how many times the RA was performed is determined based on both threshold-based and non-threshold-based actions,
- When count = threshold,
- Reward=P%(discount percentage))×spending amount,
- where the spending amount is the total amount spent by Business X during that month once per business
- Scenario 3: Updating Business Reward Rule
- Then the new rule should be applied on the new referrals (& old rule should be applied on the old refferrals)
- Scenario 5: Updating Business Reward Rule during reward processing
- Scenario 6: Updating Business X Budget Pre-paid
- Then the budget of business X should be updated by the end of the month to Budget= budget+reward
- Scenario 7: Updating Business X Budget Post-paid
- Then the budget of business X should be updated instantly to Due budget= Due budget-reward
- Scenario 8: Notifying Business X
- Then the system should send an automatic notification on the webApp informing Business X that a reward (refund) had been added to their budget (once per month and the value refunded displayed on the notification should be = the sum of all refund values by all businesses)
- Scenario 9: Reflecting the Discount Amount on AdminPanel
- Then the system should reflect the discount applied in the transaction section on the adminPanel.
- Scenario 10: Monthly amount spent of business X = 0
- When business X did not make any trips on the current month,
- Then the reward should be kept until the monthly amount spent is different than 0
- the users invited should be active users ( finish their onboarding in order for the calculation sto take place)
- if the user has been invited then deleted then invited again the count should not be incremented
- if the business is deleted then the link should be expired (we inform that the refferral link is no longer accessible and refferred businesses should be redirected to the sign up flow)
- Scenario 1: Access Business Referrals Section on AdminPanel
- Given I am an admin who has access to the business referrals tab on the adminPanel,
- When I navigate to the "Country Settings" section,
- Then I should see a new tab “Business Referrals."
- Scenario 2: Displaying Business Referrals Section on AdminPanel
- Given I am on the adminPanel,
- When I navigate to the Business Referrals tab,
- Then I should see a
- A referrals links history list.
- A section displaying the reward rule.
- A button labeled “Create Reward Rule” (if no rule exists).
- Scenario 3: Create Reward Rule
- Given I am superAdmin on the Business Referrals tab,
- When I click on "Create Rule,"
- Then I should see a screen with the following options for required actions on a drop-down list:
- Budget Top-up
- Users Invitation
- Number of Trips
- Amount Spent
- And an input field for the discount percentage applied on the monthly spending amount for business X.
- Scenario 4: Dynamic Threshold Field Behavior
- Given I am creating a reward rule,
- When I select Budget Top-up,
- Then the threshold field should not be visible.
- When I select Users Invitation, Number of Trips, or Amount Spent,
- Then the threshold field should appear to specify the required value.
- Scenario 5: Restriction on Multiple Rules
- Given there is already an existing reward rule for the country,
- When I view the Business Referrals tab,
- Then:
- The “Create Reward Rule” button should be disabled.
- On hovering over the button, a tooltip should display:
- "You can only have one reward rule per country. To modify, click Edit Rule."
- Scenario 6: View and Edit Existing Rule
- Given I have previously created reward rule,
- When I view the Business Referral section,
- Then I should see a list of existing rule with details such as:
- Required action
- Threshold (if applicable)
- Creation Date
- Amount of discount applied
- And I should have the option to edit or delete existing rule.
- Scenario 7: Edit Existing Rule
- Given a reward rule exists for the country,
- When I click "Edit Rule,"
- Then I should be able to modify the existing rule parameters (e.g., required actions, discount percentage, thresholds).
- Scenario 8: Delete Existing Rule
- When I click "Delete,"
- Then the rule should be deleted and the create rule button should be enabled again and the default rule should be applied instead until the new rule is set
- Scenario 9: Validation for Rule Creation
- Given I am creating a new reward rule,
- When I attempt to save the rule without specifying all required fields (action, threshold, or reward),
- Then I should see an error message prompting me to complete the missing fields.
- Scenario 10: No Existing Rules
- Given there are no reward rules created yet,
- When I view the "Reward Rules" section,
- Then I should see an empty state screen with a prompt to create the first reward rule.
- Scenario 11: Referral Link Shared with No Reward Rule Set
- Given no reward rule has been set on the adminPanel,
- When a BAM shares a referral link from the webApp,
- Then the referral link should appear in the Referral History List on the adminPanel and a default rule should be applied.
- the percentage of the reward should be from 0 to 100 %
- the reward should be applied per country
- A section for managing reward rules.
- A button labeled “Create Reward Rule” (if no rule exists) (only one rule per country).
- Referrer company name (business X name)
- BAM email
- Number of completed referrals (how many business finished required actions)
- referral link
- List of every company that used the referral link (to sign-up or those who signed up and performed a required action)
- Status
- Pending : for companies that signed up without completing a required action
- Completed : for companies that signed up and completed a required action
- Scenario 1: Adding 'Business Referrals' Widget
- Given I am on the webApp,
- When I access the dashboard screen,
- Then I should see a new widget 'Business Referrals'.
- Scenario 2: Adding 'Business Referrals' on the navigation menu
- When I view the navigation menu,
- Then I should see a new ‘Business Referrals’ section.
- Scenario 3: Business Referrals Screen
- When I access the business referrals section either from the dashboard widget or on the navigation menu,
- Then I should see a screen that displays the referral link and also an overview with statistics
- Scenario 4: Referral Link Generation
- Given I am on the Business Referral screen,
- When I access the section for the referral link,
- Then I should see options for
- Copy link (for copying the link)
- Share link (for external application sharing)
- Scenario 5: Referral Link Sharing
- Given the BAM is on the referral link generation screen,
- When I click the "Share" button,
- Then an application menu should appear, And the user should be able to select an external application (e.g., WhatsApp, LinkedIn, Twitter),
- Scenario 6: Referral Link Sharing Successful Popup
- Given I am a BAM on the webApp (Business X),
- When I share the referral link or I copy the referral it,
- Then I should see a successful pop-up informing me that the copying was successful
- Scenario 7: Referral Screen Statistics Overview
- Given I am a BAM on webapp,
- When I access the business Referrals screen,
- Then I should see the statistics overview for the referral link statistics should include
- How many users are pending (users signed up but did not perform a required action yet)
- How many users used the link (how many users performed a required action)
- The sum of discounts business X gained from the referral links
- Event Name

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-26750: Set Up Referral Reward Rules per Company~~ → Replaced by CMB-26243
- ~~CMB-20896: Referral Reward for Businesses~~ → Replaced by CMB-26243
