---
id: "jira-driver-app"
title: "Driver App"
system: "Driver App"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","driver-app","beta-release","driver-app-android","driverapp"]
last_synced: "2026-02-26T14:25:10.789Z"
ticket_count: 8
active_ticket_count: 8
---

# Driver App

> Auto-generated from 8 Jira tickets.
> Last synced: 2026-02-26T14:25:10.789Z
> Active features: 8

## User Stories

### CMB-28653: Regression Testing on B2B WebApp Release 1.38

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2025-08-11

**Description:**
[QATM-22753] Android SuperApp MOB-Rides B2B + Driver Android - Jira

---

### CMB-23947: Set location on the map

**Status:** Done | **Priority:** No Priority
**Created:** 2025-03-23

**Description:**
As a user, I want to have the option to select my current location on the map when I am choosing my pick-up or drop-off location, so I can provide drivers with the exact location of my trip.

**Acceptance Criteria:**
- Scenario 1:
- Given I am on the yassir web panel
- And I want to take a ride
- When I am on the search bar to select my pick-up and drop-off location
- And I click on the tab
- Then I should see the “Select location on the map” button
- When I click on the “Select location on the map” button
- Then I should see a Pin on the map to mark my location
- And a sidebar showing the following:
- My actual address (The Pin by default will be set to my current location)
- ”Confirm pick-up/drop-off” button
- ”Cancel” button
- Scenario 2: Confirm the exact location (For my pickup or dropoff)
- When I drag the Pin on the map
- Then I should be able to set it to my desired location
- When I choose the exact location
- And I press “Confirm Pickup/destination” to confirm my exact location
- Then I will be directed to the previous screen (Pickup and destination) to search for a driver
- Scenario 3: Location not found
- Given I am choosing my desired location on the map
- If I select a location that is unclear or doesn’t exist
- Then I should see “Please choose a location” and “Location not found”

---

### CMB-6636: Detailed Trip View 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-06-13

**Description:**
As an Admin, I want to be able to view the detailed information of a selected trip, including trip status, ID, route, price, service type, driver details, pickup and destination points, map for route visualization, rider information, and date/time of the trip.

**Acceptance Criteria:**
- The OPs Manager should be able to select a specific trip from the trip list.
- The detailed trip view should display the following information:
- Trip status
- Trip ID
- Trip price
- Trip service type
- Driver name
- Driver phone number
- Driver rating
- Driver car type and color
- Pickup point
- Destination
- Map showing the route (polyline)
- Rider name
- Rider phone number
- Date and time of the trip
- Given-When-Then Scenarios:
- Scenario 1: OPs Manager selects a trip and views its details
- Given: The OPs Manager is logged into the Admin Panel
- When: The OPs Manager selects a specific trip from the trip list
- Then: The detailed trip view is displayed with all the relevant information mentioned in the acceptance criteria.

---

### CMB-19416: Real time driver location animated car

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-07

**Description:**
This ticket entitles the car icon animation on the map, to indicate the driver’s location.

---

### CMB-16688: No driver nearby

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-31

**Description:**
Scenario: No driver nearby

---

### CMB-16677: Driver & Price details

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-31

**Description:**
As a rider I should be able to see driver details like his rating so that I can make informed decisions about my trip

**Acceptance Criteria:**
- Ride cost
- Discount
- Reduction
- Taxes
- Total
- I understand button.

---

### CMB-16674: Driver Accepts the trip

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-31

**Description:**
Scenario: Driver accepts the trip

**Acceptance Criteria:**
- Driver & car details
- Driver name
- Itenary
- Price
- Help center
- Cancelation

---

## Consolidated Acceptance Criteria

- Scenario 1:
- Given I am on the yassir web panel
- And I want to take a ride
- When I am on the search bar to select my pick-up and drop-off location
- And I click on the tab
- Then I should see the “Select location on the map” button
- When I click on the “Select location on the map” button
- Then I should see a Pin on the map to mark my location
- And a sidebar showing the following:
- My actual address (The Pin by default will be set to my current location)
- ”Confirm pick-up/drop-off” button
- ”Cancel” button
- Scenario 2: Confirm the exact location (For my pickup or dropoff)
- When I drag the Pin on the map
- Then I should be able to set it to my desired location
- When I choose the exact location
- And I press “Confirm Pickup/destination” to confirm my exact location
- Then I will be directed to the previous screen (Pickup and destination) to search for a driver
- Scenario 3: Location not found
- Given I am choosing my desired location on the map
- If I select a location that is unclear or doesn’t exist
- Then I should see “Please choose a location” and “Location not found”
- The OPs Manager should be able to select a specific trip from the trip list.
- The detailed trip view should display the following information:
- Trip status
- Trip ID
- Trip price
- Trip service type
- Driver name
- Driver phone number
- Driver rating
- Driver car type and color
- Pickup point
- Destination
- Map showing the route (polyline)
- Rider name
- Rider phone number
- Date and time of the trip
- Given-When-Then Scenarios:
- Scenario 1: OPs Manager selects a trip and views its details
- Given: The OPs Manager is logged into the Admin Panel
- When: The OPs Manager selects a specific trip from the trip list
- Then: The detailed trip view is displayed with all the relevant information mentioned in the acceptance criteria.
- Ride cost
- Discount
- Reduction
- Taxes
- Total
- I understand button.
- Driver & car details
- Itenary
- Price
- Help center
- Cancelation
