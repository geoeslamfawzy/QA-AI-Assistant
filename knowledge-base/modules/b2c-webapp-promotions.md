---
id: "jira-b2c-webapp-promotions"
title: "B2C WebApp — Promotions"
system: "B2C WebApp"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2c-webapp"]
last_synced: "2025-06-21T21:38:43.183Z"
ticket_count: 4
active_ticket_count: 4
---

# B2C WebApp — Promotions

> Auto-generated from 4 Jira tickets.
> Last synced: 2025-06-21T21:38:43.183Z
> Active features: 4

## User Stories

### CMB-23723: Discounts display in Pre-ride

**Status:** Done | **Priority:** No Priority
**Created:** 2025-03-16

**Description:**
As a user, I want to see relevant promotions displayed before confirming my ride, so I can easily understand and take advantage of applicable discounts and offers.

**Acceptance Criteria:**
- Scenario 1: Pre-Ride Promotion Display:
- Given I have entered my pickup and destination locations
- And I have an activated promo code
- When the app displays the estimated price
- Then I should see the estimated price struck through and the new price displayed.
- Scenario 2 (If no promo code is activated):
- Given I am on the yassir webapp
- When I navigate to the discounts tab
- And I click on “Apply/Add Promo code” tab
- Then I should see a pop-up screen to add a promo code “You have no saved promo codes”
- When I click on “Add  promo code” button
- And I enter the correct promo code and click “confirm”
- Then the promo code should be activated
- And a confirmation message is displayed
- And the promo code will be applied to my next ride.
- Scenario 3 (Deactivate a promo code):
- Given I am on the yassir webpanel
- When I click on the “details” button
- Then I should see a pop-up screen of all the available promo codes
- When I click the "Deactivate" button
- Then the promo code should be deactivated
- And won’t be applied to my next ride
- Scenario 4 (Error handling):
- Given I am on the yassir webapp
- And I have an activated promo code
- If the minimum price to apply the promo code is not met
- Or the promo code is not applied in that location
- Or promotion couldn’t be applied for whatever reason
- Then I should see a pop-up message “Promotion not applied”
- When I click the “continue without promotion” button
- Then the estimated price will be applied without any discount

---

### CMB-23725: Discounts Section on Yassir Webapp

**Status:** Done | **Priority:** No Priority
**Created:** 2025-03-16

**Description:**
As a user of Yassir Rides on the webapp, I want a dedicated "Promo Codes" section, where I can easily view, add, and manage my available promo codes, so I can quickly access and utilize discounts and offers.

**Acceptance Criteria:**
- Scenario 1 (Accessing the Promo Codes Section):
- Given I am logged into Yassir on Yaweb
- When I navigate to my profile.
- Then I should see a clearly labeled "Discounts" section.
- When I click on the discounts section
- Then I should see a new section related to discounts
- Scenario 2 (Viewing Promo Codes section):
- Given I am in the "Promo Codes" section.
- Then I should see these two tabs:
- “My promo codes”: A list of the available promo codes
- When I click on the “My Promo code tab”
- Then I should see the list of my promo codes
- If I have no promo code available
- Then I should see an error message “ No promo code found”
- If I click on “Add promo code”
- Then it will lead me to the “Add promo code” tab.
- “Add promo code ”: A tab to enter a promo code
- When I click on the “Add promo code”
- Then I should see a new tab to insert a promo code
- Valid Promo Code:
- Given I am in the "Discounts" section.
- When I enter a valid promo code in the input field.
- And I click "Add."
- Then the tab turns green with a checkmark
- And I should see “Promo code added” below the tab
- And the promo code should be added to my list of promotions.
- Invalid Promo Code:
- Given I am in the "Discounts" section
- When I enter an invalid promo code in the input field
- And I click "Add"
- Then the tab turns red
- And a clear error message should be displayed indicating “Please check the entered code”.
- Promo Code already exists:
- Given I am in the "Discounts" section.
- When I enter a promo code in the input field that I have already added
- And I click "Add."
- Then it will redirect me to the same promo code that I already added
- Promo Code Expired:
- Given I am in the "Discounts" section
- When I enter an expired promo code in the input field
- And I click "Add"
- Then an error message below the tab should be displayed stating that Promo code you entered in incorrect or no longer valid.
- Promo Code Already Used:
- Given I am in the "Discounts" section.
- When I enter a promo code that I have already used in the input field.
- And I click "Add."
- Then a message should be displayed stating that The Promo code you entered in incorrect or no longer valid.

---

### CMB-23726: Promo code details screen

**Status:** Done | **Priority:** No Priority
**Created:** 2025-03-16

**Description:**
As a user, I want to see detailed information about a discount, including terms and conditions, and availability (Expiration date), so that I understand the offer fully.

**Acceptance Criteria:**
- Scenario 1:
- Given I am viewing the list of discounts.
- When I click on a specific promotion.
- Then I should see a detailed description of the promotion, including:
- Promo code percentage %
- Promo [Code]
- Time availability
- Terms and conditions
- Expiration date and time
- Activate/Deactivate button
- Scenario 2: Activate the promo code
- Given I am viewing the promo code details screen
- When I activate the promo code
- Then I should see a message in the discount information tab (Applied to your ride)
- When I click on “Use now button”
- Then I should be redirected to the initial page to take a ride
- If I click deactivate
- Then the promo code should be deactivated
- Scenario 2: Exit the promo code information tab
- If I want to exit the promo code information tab
- Then I should click on the exit button on the top right of the screen
- Then I will be redirected to the list of promotions on the webapp.

---

## Consolidated Acceptance Criteria

- Scenario 1: Pre-Ride Promotion Display:
- Given I have entered my pickup and destination locations
- And I have an activated promo code
- When the app displays the estimated price
- Then I should see the estimated price struck through and the new price displayed.
- Scenario 2 (If no promo code is activated):
- Given I am on the yassir webapp
- When I navigate to the discounts tab
- And I click on “Apply/Add Promo code” tab
- Then I should see a pop-up screen to add a promo code “You have no saved promo codes”
- When I click on “Add  promo code” button
- And I enter the correct promo code and click “confirm”
- Then the promo code should be activated
- And a confirmation message is displayed
- And the promo code will be applied to my next ride.
- Scenario 3 (Deactivate a promo code):
- Given I am on the yassir webpanel
- When I click on the “details” button
- Then I should see a pop-up screen of all the available promo codes
- When I click the "Deactivate" button
- Then the promo code should be deactivated
- And won’t be applied to my next ride
- Scenario 4 (Error handling):
- If the minimum price to apply the promo code is not met
- Or the promo code is not applied in that location
- Or promotion couldn’t be applied for whatever reason
- Then I should see a pop-up message “Promotion not applied”
- When I click the “continue without promotion” button
- Then the estimated price will be applied without any discount
- Scenario 1 (Accessing the Promo Codes Section):
- Given I am logged into Yassir on Yaweb
- When I navigate to my profile.
- Then I should see a clearly labeled "Discounts" section.
- When I click on the discounts section
- Then I should see a new section related to discounts
- Scenario 2 (Viewing Promo Codes section):
- Given I am in the "Promo Codes" section.
- Then I should see these two tabs:
- “My promo codes”: A list of the available promo codes
- When I click on the “My Promo code tab”
- Then I should see the list of my promo codes
- If I have no promo code available
- Then I should see an error message “ No promo code found”
- If I click on “Add promo code”
- Then it will lead me to the “Add promo code” tab.
- “Add promo code ”: A tab to enter a promo code
- When I click on the “Add promo code”
- Then I should see a new tab to insert a promo code
- Valid Promo Code:
- Given I am in the "Discounts" section.
- When I enter a valid promo code in the input field.
- And I click "Add."
- Then the tab turns green with a checkmark
- And I should see “Promo code added” below the tab
- And the promo code should be added to my list of promotions.
- Invalid Promo Code:
- Given I am in the "Discounts" section
- When I enter an invalid promo code in the input field
- And I click "Add"
- Then the tab turns red
- And a clear error message should be displayed indicating “Please check the entered code”.
- Promo Code already exists:
- When I enter a promo code in the input field that I have already added
- Then it will redirect me to the same promo code that I already added
- Promo Code Expired:
- When I enter an expired promo code in the input field
- Then an error message below the tab should be displayed stating that Promo code you entered in incorrect or no longer valid.
- Promo Code Already Used:
- When I enter a promo code that I have already used in the input field.
- Then a message should be displayed stating that The Promo code you entered in incorrect or no longer valid.
- Scenario 1:
- Given I am viewing the list of discounts.
- When I click on a specific promotion.
- Then I should see a detailed description of the promotion, including:
- Promo code percentage %
- Promo [Code]
- Time availability
- Terms and conditions
- Expiration date and time
- Activate/Deactivate button
- Scenario 2: Activate the promo code
- Given I am viewing the promo code details screen
- When I activate the promo code
- Then I should see a message in the discount information tab (Applied to your ride)
- When I click on “Use now button”
- Then I should be redirected to the initial page to take a ride
- If I click deactivate
- Scenario 2: Exit the promo code information tab
- If I want to exit the promo code information tab
- Then I should click on the exit button on the top right of the screen
- Then I will be redirected to the list of promotions on the webapp.
