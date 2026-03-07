---
id: "jira-b2b-portal-programs"
title: "B2B Portal — Programs"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","b2b","craft_sync","crafttheme_mobility"]
last_synced: "2026-02-22T09:06:46.911Z"
ticket_count: 55
active_ticket_count: 44
---

# B2B Portal — Programs

> Auto-generated from 55 Jira tickets.
> Last synced: 2026-02-22T09:06:46.911Z
> Active features: 44
> Superseded: 11

## User Stories

### CMB-29386: Mobile Ride Justification

**Status:** To Do | **Priority:** No Priority
**Created:** 2025-09-02

**Description:**
As a rider who is part of a program with auto-dispatch feature disabled, I need to provide a reason for my trip when booking, so that my trip request is clear and provides my manager and other stakeholders with the necessary information to approve or reject the ride.

**Acceptance Criteria:**
- Scenario 01: Entering trip justification
- Given I am a rider on the "Book a Ride" screen.
- When I am booking an instant or booked for later trip.
- Then a required visible input field should be displayed, labeled "Ride Justification", it should have a character limit of 150 characters.
- Scenario 02: Justification is displayed on trips details on the history section
- Given I am a Business Rider
- When I view the details screen for the trip I requested with a ride justification.
- Then the justification text should be clearly displayed and remain unchanged.

---

### CMB-31160: [WEBAPP] Gift-Card Flow

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-10-20

**Description:**
As a Business Admin, I want a seamless and controlled experience within the WebApp to purchase giftcard templates, configure their usage programs, and track their utilization by my employees or customers, so that I can efficiently manage my company's transport benefits, incentives, and budget.

**Acceptance Criteria:**
- Scenario 01: Browsing Available Giftcard Templates
- As a Business Admin on the WebApp,
- When I navigate to the "Buy Giftcards" section,
- Then I should see a list of all giftcard templates available for my country, each displaying:
- The monetary amount of the giftcard.
- Its visual theme (e.g., Corporate, Holiday).
- A visually blurred voucher image to indicate it's a template, not an active voucher.
- Scenario 02: Enforcing Budget for Giftcard Purchases
- As a Business Admin on the WebApp,
- When I view the "Buy Giftcards" section,
- Then for each giftcard template:
- If my company's current budget is less than the giftcard's purchase price, the "Purchase" button should be disabled, clearly indicating "Insufficient Budget".
- If my company's current budget is equal to or greater than the giftcard's purchase price, the "Purchase" button should be enabled, allowing for purchase.
- Scenario 03: Purchasing a Giftcard Template and Initiating Coupon Setup
- As a Business Admin on the WebApp,
- When I click the "Purchase" button for an available giftcard template, and my budget is sufficient,
- Then the giftcard's purchase price is deducted from my company's budget.
- And I am immediately redirected to the "Coupon Setup" screen for that specific, newly purchased giftcard.
- Scenario 04: Configuring Giftcard Setup
- As a Business Admin on the WebApp,
- When I am on the "Coupon Setup" screen for a newly purchased giftcard,
- Then I should see a form allowing me to configure the following settings (all optional, with clear defaults):
- Start Date / End Date (DEFAULT: UNLIMITED)
- Start Time / End Time (Daily trip validity window, DEFAULT: UNLIMITED)
- Min Trip Price / Max Trip Price (Monetary limits per trip, DEFAULT: UNLIMITED)
- Percentage Discount (DEFAULT: 50%)
- Max Total Usage (Number of trips across the program's lifetime, DEFAULT: UNLIMITED)
- Max Usage Per Day (Daily limit on trips, DEFAULT: 1 trip per user)
- Pickup/Dropoff Locations (DEFAULT: ANYWHERE TO ANYWHERE)
- And upon clicking "Finalize Coupon Setup & Generate Coupon", the Coupon becomes active with the defined rules.
- Note : B2B Client can skip setting programs for giftcards, if that was the case then the Default settings should be applied.
- Scenario 05: Viewing Purchased Giftcard Programs
- As a Business Admin on the WebApp,
- When I navigate to the "My Giftcards" section,
- Then I should see a list of all giftcards that have been purchased, each displaying:
- The Original Monetary Value of the giftcard.
- The Current Remaining Value of the giftcard.
- The Voucher Code (blurred for security, but viewable on click).
- Start Date / End Date
- Start Time / End Time
- Min Trip Price / Max Trip Price
- Percentage Discount
- Max Total Usage
- Max Usage Per Day
- Pickup/Dropoff Locations
- And for each program, I should see options to "View Trips".
- Scenario 06: Viewing Trip Usage Log
- As a Business Admin on the WebApp,
- When I click "View Trips" for a specific giftcard in “My Giftcards” section,
- Then an overlay or detailed screen should appear, displaying a table of all trips paid by that giftcard, including:
- The Date and Time of the trip.
- The Amount Used from the giftcard's balance for that trip (Trip Price).
- Rider’s Phone Number of the user who took the trip (partially masked for privacy).
- Itinerary (Departure/Destination)
- Driver Details (Full name, rating, phone number, car infos)
- Scenario 07: Downloading Giftcard
- As a Business Admin on the WebApp,
- When I view a giftcard,
- Then I should see a prominent "Download Giftcard" button.
- And upon clicking this button, a printable PDF file is generated, which includes:
- The Voucher Code (unblurred).
- Pickup/Dropoff Locations
- Percentage Discount
- Start Date / End Date
- Start Time / End Time
- Min Trip Price / Max Trip Price
- Max Usage Per Day
- Scenario 08: Reverting Remaining Giftcard Value to Budget
- As a Business Admin on the WebApp,
- When I view an Active giftcard with a Current Remaining Value greater than zero,
- Then I should see a "Revert Value to Budget" button even if the end date of the giftcard has passed.
- Scenario 09: Confirmation for Reverting Giftcard Value
- As a Business Admin on the WebApp,
- When I click the "Revert Value to Budget" button,
- Then a confirmation dialog appears, stating that the giftcard will be immediately deactivated and all remaining usage will be blocked
- Scenario 10: Processing Giftcard Value Reversal
- As a Business Admin on the WebApp,
- When I confirm the action to "Revert Value to Budget",
- Then the giftcard's Current Remaining Value is instantly added back to my company's general budget.
- Scenario 11: Giftcard labeling After Reversal
- As a Business Admin on the WebApp,
- When the giftcard value reversal is processed,
- Then the giftcard label should be added "Reverted".
- Scenario 12: Disabling Voucher After Reversal
- As a Business Admin on the WebApp,
- When the giftcard value reversal is processed,
- Then the voucher code associated with that program is immediately disabled and cannot be used for future trips.
- Scenario 13: Logging Giftcard Reversal
- As a Business Admin on the WebApp,
- When a giftcard value reversal is processed,
- Then a log of this financial reversal is recorded in the AdminPanel's logs.
- Note : Following events should be added on this notion page
- Event Name

---

### CMB-29301: Program Section Re-design

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-08-31

**Description:**
As a webApp user, I want to see a redesigned and more intuitive Programs screen with clear actions and key information, so that I can efficiently manage our programs and quickly understand their status and user assignments without unnecessary clicks.

**Acceptance Criteria:**
- Scenario: Filtering and Viewing Programs
- Given I am on the Programs screen.
- Then the filter for programs should be a dropdown list containing the options: "Active," "Inactive," and "All."
- And the initial screen displayed should be the list of programs, not the analytics dashboard.
- Scenario: Actions Column
- Given I am viewing the list of programs.
- When a program is active.
- Then the "Action" column for that program should display a "De-activate" option and an "Edit" option.
- When a program is inactive.
- Then the "Action" column for that program should display an "Activate" option and a "Delete" option.
- Scenario: Viewing Program Details
- Given I am viewing the list of programs Then I clicked on any program on the list.
- Then a new, dedicated details screen for that program should be displayed.
- And this details screen should show the total number of riders assigned to the selected program.
- Scenario: Creating a New Program
- Given I am on the programs list screen and I click the "Create a New Program" button.
- Then a new input field should be added to the program creation form.
- And it should be a dropdown list that allows me to select one or more groups to assign to the new program.

---

### CMB-26718: Business Challenge WebApp Flow

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-06-22

**Description:**
As a webApp user (either superAdmins, Business Admins, Program Moderators), I want to clearly see my current challenges, understand their details, track my progress, and review past challenge performance so that I can stay motivated and informed about my potential earnings.

**Acceptance Criteria:**
- Scenario 01: Viewing Active Challenges
- As a webApp user,
- When I navigate to the Challenges section of the WebApp,
- Then I should see
- a display of my ongoing challenge with its goals.
- The upcoming challenges that will start the next week (the list should be updated daily by end of day to include newly created challenges if any)
- Scenario 02: Tracking Challenge Progress
- As a webApp user,
- When I am participating in a challenge,
- Then I should see
- a progress bar that accurately reflects my current progress towards the challenge goal in real-time on each finished trip.
- Finished Trips that are later-on Cancelled from dash-ops should not impact the progress of the challenge
- Scenario 03: Challenges History
- As a webApp user,
- When I view my challenge history,
- Then I should be able to see all my previous challenges
- Challenge Name
- Challenge Validity Date
- Reward (cash-back percentage earned)
- Status (Partially completed, Completed, Expired)
- Action (View Challenge Details)
- Scenario 04: Challenge Cash-Back Notification
- As a webApp user,
- When I complete a challenge (each time I complete a criterion of the challenge) and earned a cash-back percentage,
- Then the system should
- send me a notification by the end date of the challenge
- informing me that I gained X% from Y challenge (displaying the name of the challenge)
- and the cash-back will be processed by the end of the month on the invoice
- and on-click I should be redirected to the Challenge details screen.
- Scenario 05: Upcoming Challenge Notification
- As a webApp user,
- When I have an upcoming challenge,
- Then the system should send me a notification 7days before the start of the challenge and on click the notification I am redirected to the challenge details screen.
- Scenario 06: Add Banner on the Dashboards
- As a webApp user,
- When I am on the dashboard screen,
- Then I should see a banner that would redirect me to the challenge screen.
- Scenario 07: Challenge Disabled or Deleted from AdminPanel and a Notification has been Sent
- As a webApp user who received a notification 7 days before the upcoming challenge,
- When the challenge is disabled or deleted from adminPanel after the notification has been sent,
- Then when I click on the notification, I should be redirected to the challenges screen.
- Scenario 08: Challenge Disabled or Deleted from AdminPanel
- As a webApp user,
- When a challenge is disabled from adminPanel,
- Then I should no longer see it on the upcoming challenges list and on click on the notification
- Scenario 09: Upcoming Challenge Edited on AdminPanel
- As a webApp user,
- When an upcoming challenge is edited on adminPanel,
- Then I should see the updates reflected on webApp.
- Event Name

---

### CMB-10052: Chosen Time, Date Error 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-10-26

**Description:**
As a Business Rider using the Yassir for Business, I want the booking functionality to be responsive to the allowed days and time slots specified in my business program.

**Acceptance Criteria:**
- Scenario 1: Booking a Trip on a Restricted Day or Time Slot
- Given I am a Business Rider using Yassir for Business on the Yassir Go App,
- When I attempt to book a trip on a day or during a time slot that is not within the allowed days or time slots defined by my business program,
- Then I should find the "Request" button disabled, preventing me from proceeding with the booking.
- Scenario 2: Scheduling a Trip on a Restricted Day or Time Slot
- Given I am scheduling a trip to Yassir for Business on the Yassir Go App,
- When I select a date or time slot that falls outside the allowed days or time slots defined by my business program,
- Then I should receive an error message, indicating that I must choose another date or time slot that adheres to the program's parameters.
- Scenario 3: Booking a Trip Within Allowed Days and Time Slots
- Given I am a Business Rider using Yassir for Business on the Yassir Go App,,
- When I attempt to book a trip on a day and during a time slot that is within the allowed days and time slots defined by my business program,
- Then I should find the "Request" button enabled, allowing me to proceed with the booking.

---

### CMB-10048: Spending Allowance Error

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-10-26

**Description:**
As a Business Rider using the Yassir Go for Business, I want to receive an error message if I attempt to book a trip that exceeds the allowed spending limit defined by the Business Account Manager (BAM) for my business accounts program.

**Acceptance Criteria:**
- Scenario 1: Exceeding Allowed Limit
- Given that I am a Business Rider using Yassir for Business,
- When I attempt to book a trip that exceeds the cost limit set by the BAM for my business account,
- Then I should receive an error message informing me that the trip cost exceeds the allowed limit.
- Scenario 2: Informative Error Message
- Given that I receive an error message due to the cost limit exceeding,
- When I read the error message,
- Then it should clearly state that the trip cost exceeds the BAM-defined limit and provide guidance on the next steps.
- Scenario 3: Editing my trip locations
- Given that my trip cost exceeds the spending allowance for all services and service types
- When I get an error message on the estimation screen
- Then I need to find a CTA, to get back to modify the trip pickup and destination to ensure they align with the defined program parameters.
- Scenario 4: Different Services of the User Programs on of them is is less than the spending allowance and the other is higher
- Given that I have two services within my program
- When one of the services and its service type costs are more than the spending allowance, and then I have another service containing service types whose cost is less than the spending allowance
- Then I can only see the last service its cost estimation is less than the spending allowance
- The business account manager must have the option to cover a certain percentage of the trip cost
- The business account manager must have the option to cover the trip cost to a certain level
- The business account manager must have the option to set a spending allowance for all of the program members
- Spending Allowance can be more or less than the total left or initially allocated budget

---

### CMB-13290: How to create program?

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

---

### CMB-13270: Multi-Stops as Program Parameters

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

**Acceptance Criteria:**
- The user needs to be provided with a location searching option
- The user needs to be able to pin the location on a map
- The user needs to be able to enter 5 different stops in the trip
- The user Can leave these fields empty, but he needs to be warned, and the default value will be he can pick up and drop off from any locarion
- Users must have the option to be able to limit the trips to be from the defined pickup point to the drop-off point only
- Users must have the option to be able to limit the trips to be from the defined pickup point to any drop-off point
- Users must have the option to be able to limit the trips to be from any point to the defined drop-off point
- User needs to be able to choose the days and hours from a list
- User needs to be able to enter a custom set of  hours per every day
- The user Can leave these fields empty, but he needs to be warned. if he didn’t specify he will be allowed to request a trip at anytime
- User Can leave these fields empty, but he needs to be warned

---

### CMB-13268: Multi-Stops in Trip Booking 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-03-20

**Description:**
As a Business Account Manager, Program Moderator, or Business Admin using the Yassir for Business platform, I need to have the ability to add multiple Intermediate points to a trip. This feature enables me to plan and estimate the cost of a trip that involves multiple stops. whether I’m booking this trip for myself, someone else in my company, or a guest rider

**Acceptance Criteria:**
- Scenario 1: Adding Multiple stops
- Given that I am logged into the Yassir for Business platform,
- When I initiate the process of booking a trip,
- Then I should find an option to add multiple destinations to the trip.
- Scenario 2: Compliance with Program Location Parameters
- Given that I am adding multiple destinations to a trip,
- When selecting pickup and destination points,
- Then the chosen locations should comply with the program location parameters defined for the business. and no checks by the program will be applied to the intermediate stops
- Scenario 3: Calculation of Total Trip Cost
- Given that I have added multiple destinations to the trip,
- When I finalize the selection of locations,
- Then the system should calculate the total trip cost, considering all stops in the journey.
- How the ride cost is calculated in B2C:
- We consider the path between each of the two stops as a sub-trip, for example, a ride with 3 stops in between, then that means you have the following sub-trips:
- Pickup to stop 1.
- Stop 1 to Stop 2
- Stop 2 to stop 3
- stop 3 to the final destination each of those sub-trips is considered as a separate trip when it comes to pricing, so we calculate the pricing separately, and then we sum the price of all of them, then we check if eligible applied coupons or reductions, also we check if there's an added boost or not, then we calculate the final price to share.
- Scenario 4: Rearranging Stops
- When reviewing the trip, the trip entered points
- Then I should have the option to rearrange the sequence of stops as needed.
- Scenario 5: Trip Confirmation Screen
- When I proceed to request the trip,
- Then the trip confirmation screen should display all stops in the journey, providing a clear overview before confirming the booking.
- Scenario 6: If the trip stopped in an intermediate stop
- Given that as a Business rider on a multi-stop trip
- When the trip finished on an intermediate stop
- Then I need to get a refund, for the rest of the cost of the trip based on the new estimated cost value - the initially estimated cost value
- Scenario 7: Business Discounts
- Given as a Business I have a discount plan based on the number of trips
- When I book a multistop trip
- Then it should be calculated as one trip in the Business Discounts
- Scenario 8: Export Files link
- Given as an Admin on the Admin panel, or a BAM
- When I export the list of trips that contains multiple stops
- Then the table should contain if the trip is a multistop or not, and we should have columns for each intermediate stop, names intermediate stop number x
- Scenario 9: Number of Stops Limitation
- Given as a BAM Booking a multistop trip
- When I’m adding the multi-stops,
- Then I should find the plus button disabled when reaching out to a number of intermediate stops that hits the limit of the number of stops -Which is 3- we can book, based on the multi-stops configurations
- Event Name
- The web app should allow Business Account Managers to book scheduled trips for themselves or other Business Riders.
- The web app should verify if the trip booking complies with the program parameters, including locations, spending allowance, number of allowed trips per day, allowed days, and hours for booking trips.
- If the trip booking complies with the program parameters, the cost should be deducted from the budget.
- The web app should sync with the trip status throughout the trip lifecycle.
- If the trip is assigned, no changes should be made to the trip until it starts.
- If the trip starts and finishes, the web app should maintain the trip status and budget deduction.
- If the trip is canceled, the web app should refund the deducted amount to the budget.
- Scenario 1: Booking a scheduled trip for a Business Rider
- Given: I am a Business Account Manager using the Yassir Go for B2B web app
- When: I book a scheduled trip for myself or another Business Rider
- Then: The web app should verify if the trip booking complies with the program parameters
- Scenario 2: Deducting the cost from the budget
- Given: I am a Business Account Manager who has booked a trip that complies with the program parameters
- When: The trip is successfully booked
- Then: The cost should be deducted from the budget
- Scenario 3: Syncing with the trip status
- Given: I am a Business Account Manager who has booked a trip
- When: The trip status changes during the trip lifecycle
- Then: The web app should sync with the trip status and handle potential cancellations and budget refunds accordingly
- Scenario 4: Refunding the budget for a canceled trip
- Given: I am a Business Account Manager who has booked a trip that is later canceled
- When: The trip is canceled
- Then: The web app should refund the deducted amount to the budget

---

### CMB-154: Dev - BE: Program Purpose

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a first time logged in business account manager, I need to be able to provide information about the purpose of having this program as is it used for (Daily Commuting, Business Travels, Going for lunch breaks, and Item Delivery, ), so that I can get more pe

**Acceptance Criteria:**
- The user needs to be able to choose trip purpose from a list, not by entering a number, or textual information.
- Back and fourth from Office
- Campus Shuttle
- Late night
- Candidate interviews
- Customer Rides
- Emergency Rides
- Event
- Custom Travel Programme
- We need to provide other options
- The user needs to be able to skip this step

---

### CMB-157: Dev - BE: Program Naming

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- Names should start with letters
- Names fields needs to be limited to a number of characters

---

### CMB-156: Dev - BE: Setting Program Trip Work Rules

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a business account manager, I want to be able to define when the company riders can use the program on Weekdays, Custom time per day

**Acceptance Criteria:**
- User needs to be able to choose the days and hours from a list
- User needs to be able to enter a custom set of  hours per every day
- The user Can leave these fields empty, but he needs to be warned. if he didn’t specify he will be allowed to request a trip at anytime

---

### CMB-4188: Design- Trip Cost Estimation

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-16

**Description:**
As a business account manager, I want to be able to see the estimated cost of a trip based on the service I choose within the allowed services in the program I'm assigned to it, so that I can select the most cost-effective option for my business needs.

**Acceptance Criteria:**
- The user should be able to select a service option for the trip, such as standard or premium. as long as they are part of the program assigned to the BAM
- The app should show the estimated cost of the trip based on the selected service option.
- The estimate should be calculated in real-time and take into account any surge values
- The user should be able to change the selected service option and see the updated estimated cost.
- The Trip cost must be within the spending allowance of the program parameters
- Given *the user has opened the app and is logged in as a business account manager,
- When *the user selects the option to create a new trip,
- Then *the app should display a screen where the user can select a service option for the trip, and see the estimated cost based on the selected option.
- Given *the user has selected a service option for a trip,
- When *the user changes the selected service option,
- Then *the app should update the estimated cost based on the newly selected option.
- Given *the user has entered pickup and destination points for a trip and selected a service option,
- When *the trip cost exceeds the spending allowance or the number of trips per day.
- Then *the app should block him from booking the trip
- Given *the user has entered pickup and destination points for a trip and selected a service option,
- When *entered locations aren't according to the program rules
- Then *the app should block him from booking the trip

---

### CMB-4191: Design- Book for another Rider

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-16

**Description:**
As a Business Account Manager, I want to be able to book a trip for myself or any other business rider, so that I can ensure that the booking process checks the user's program and applies all relevant program rules.

**Acceptance Criteria:**
- The web app should allow the Business Account Manager to book a trip for themselves or for any other business rider
- The web app should check the user's program before booking the trip
- The web app should apply all relevant program rules to the booking:
- Time and Date
- Locations
- Services Allowed
- Spending Allowance
- Number of allowed trips per day for the user
- The web app should provide confirmation of the booking to the Business Account Manager and the rider
- The web app should provide a drop-down list of available business riders that the Business Account Manager can search and select from
- The web app should allow the Business Account Manager to search for a business rider by name and email
- By Default, the BAM is booking the trips for himself
- Scenario 1 - Booking a trip for myself:
- Given *I am a Business Account Manager And I want to book a trip for myself
- When *I enter my trip details And select myself from the drop-down list of available riders
- Then *the web app checks my program And applies all relevant program rules to the booking And provides confirmation of the booking to me
- Scenario 2 - Booking a trip for another business rider:
- Given *I am a Business Account Manager And I want to book a trip for another business rider
- When *I  select the rider from the drop-down list of available riders
- Then the web app checks the rider's program And applies all relevant program rules to the booking And provides confirmation of the booking to me and the rider
- Scenario 3 - Searching for a business rider:
- Given *I am a Business Account Manager And I want to book a trip for another business rider
- When *I click on the drop-down list of available riders And enter the name or ID of the rider I am searching for
- Then *the web app displays a list of matching riders And allows me to select the rider from the list And proceed with booking the trip for the selected rider

---

### CMB-195: Dev: BAM Password

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a non-logged-in or signed-up business account manager user, I want to be able to set up my password, so that I can secure my company program setup and payment method

**Acceptance Criteria:**
- The user needs to confirm on Password
- Forgotten password: User needs to have an option in case of forgetting his password

---

### CMB-169: Dev - BE: Creating More Program 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- I can assign multiple groups to the same program

---

### CMB-1802: Design: Delete User

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-11-16

**Description:**
As a business account manager, I need to be able to delete Riders, so that they are no longer part of the Business Program

---

### CMB-170: Dev - BE: Naming Programs

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a business account manager, I want to be able to give a different name to each program other than the default program, so that I can navigate between them easily

**Acceptance Criteria:**
- Each program must have a textual field for program name
- Names should start with letters
- Names fields need to be limited to a number of characters

---

### CMB-163: Dev - BE: Setting Program Service Types 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- The business account manager must have the option to choose more than one service type of the program

---

### CMB-1707: Dev BE: Delete User

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-11-07

**Description:**
As a business account manager, I need to be able to delete Riders, so that they are no longer part of the Business Program

---

### CMB-2535: Dev BE: Deleting a program

**Status:** Done | **Priority:** No Priority
**Created:** 2022-12-18

---

### CMB-1199: Design: Dispatching Request

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-10-09

**Description:**
As a logged in or signed up business account Rider, I want to be able to make sure that whenever I'm requesting an instant trip or scheduling it, I need to be sure that those trips are within the allowed program parameters as Time, and day parameters

**Acceptance Criteria:**
- When a Rider requests an instant or scheduled trip, the system should validate the trip against the program parameters mentioned above.
- If the trip does not meet any of the program parameters, the system should display an appropriate error message indicating the reason for the trip's rejection.
- If the trip meets all the program parameters, it should be successfully booked and processed.
- The validation of program parameters should happen in real time during the trip request process.
- Scenarios:
- Scenario 1: Trip Request within Program Parameters
- Given a logged-in business account Rider
- When the Rider requests a trip
- And the trip meets all the defined program parameters
- Then the trip should be successfully booked and processed
- Scenario 2: Trip Request Violating Program Parameters
- And the trip violates any of the defined program parameters
- Then the system should display an appropriate error message indicating the reason for the trip's rejection
- Scenario 3: Sufficient Budget
- And there is sufficient budget available in the program to cover the trip cost
- Scenario 4: Insufficient Budget
- And there is insufficient budget available in the program to cover the trip cost
- Then the system should display an appropriate error message indicating insufficient budget

---

### CMB-410: Dev - FE: BAM Password

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-08-23

**Description:**
As a non-logged-in or signed-up business account manager user, I want to be able to set up my password, so that I can secure my company program setup and payment method

**Acceptance Criteria:**
- The user needs to confirm on Password
- Forgotten password: User needs to have an option in case of forgetting his password

---

### CMB-1976: Dev FE: Implement program list search

**Status:** Done | **Priority:** No Priority
**Created:** 2022-11-22

---

### CMB-4179: Booking Trips

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-15

**Description:**
As a Business Account Manager, I want to be able to book a trip for myself or any other business rider, so that I can ensure that the booking process checks the user's program and applies all relevant program rules.

**Acceptance Criteria:**
- The web app should allow the Business Account Manager to book a trip for themselves or for any other business rider
- The web app should check the user's program before booking the trip
- The web app should apply all relevant program rules to the booking:
- Time and Date
- Locations
- Services Allowed
- Spending Allowance
- Number of allowed trips per day for the user
- The web app should provide confirmation of the booking to the Business Account Manager and the rider
- The web app should provide a drop-down list of available business riders that the Business Account Manager can search and select from
- The web app should allow the Business Account Manager to search for a business rider by name and email
- By Default, the BAM is booking the trips for himself
- Scenario 1 - Booking a trip for myself:
- Given *I am a Business Account Manager And I want to book a trip for myself
- When *I enter my trip details And select myself from the drop-down list of available riders
- Then *the web app checks my program And applies all relevant program rules to the booking And provides confirmation of the booking to me
- Scenario 2 - Booking a trip for another business rider:
- Given *I am a Business Account Manager And I want to book a trip for another business rider
- When *I  select the rider from the drop-down list of available riders
- Then the web app checks the rider's program And applies all relevant program rules to the booking And provides confirmation of the booking to me and the rider
- Scenario 3 - Searching for a business rider:
- Given *I am a Business Account Manager And I want to book a trip for another business rider
- When *I click on the drop-down list of available riders And enter the name or ID of the rider I am searching for
- Then *the web app displays a list of matching riders And allows me to select the rider from the list And proceed with booking the trip for the selected rider

---

### CMB-2118: BE: Program Details

**Status:** Done | **Priority:** No Priority
**Created:** 2022-11-29

---

### CMB-298: Design: Business Account Manager Password

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-08-10

**Description:**
As a non-logged-in or signed-up business account manager user, I want to be able to set up my password, so that I can secure my company program setup and payment method

**Acceptance Criteria:**
- The user needs to confirm on Password
- Forgotten password: User needs to have an option in case of forgetting his password

---

### CMB-9014: Price Visibility/ Hiding Exception 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-09-12

**Description:**
As a Business Account Manager (BAM), I want the ability to edit user permissions within the user lists to be able to give them exceptions when it comes to seeing the prices.

**Acceptance Criteria:**
- In the program settings, I should find a section for user permissions or access control.
- Within the user permissions section, I can select individual Business Riders or groups of Business Riders.
- For each selected user, I should be able to choose from the following options:
- Follow Program Rules: The default setting where Business Riders adhere to the program-defined pricing visibility rule.
- Hide Price: Business Riders cannot see trip prices, regardless of program rules.
- See Price Regardless of Rules: Business Riders can view trip prices, even if they contradict program rules.
- Admin and Business Account Manager can see the price of the trips on the Web App Regardless of the Program, and user exception rules
- Admins and BAMs will be following his rules program rules or exceptions made on the user list level
- When inviting a new user to the business he will be following the program rules by default
- When moving a Rider from one program to another if he’s following the program rules then he will follow the new program rules, if he has an exception then he will be following the rules defined for him
- Scenarios:
- Scenario 1: Editing User Permissions to see the price
- Given that I am a Business Account Manager logged into the web application,
- When I access the user list,
- Then I should find a user permissions edit button that allows me to select specific Pricing Visibility for the the user
- Scenario 2: Setting Users to Follow Program Rules
- Given that I am configuring user permissions within the program settings,
- When I select a user,
- Then I should have the option to set them to "Follow Program Rules."
- Scenario 3: Setting Users to Hide Price
- Given that I am configuring user permissions within the program settings,
- When I select a user,
- Then I should have the option to set them to "Hide Price."
- Scenario 4: Setting Users to See Price Regardless of Rules
- Given that I am configuring user permissions within the program settings,
- When I select a user,
- Then I should have the option to set them to "See Price Regardless of Rules."
- Scenario 5: Applying User Permissions
- Given that I have configured user permissions for specific Business Riders,
- When these users log into the web or mobile app and interact with trip pricing,
- Then their experience should align with the permissions I have set in the program settings. (Hidden, visible, or following the program rules)

---

### CMB-9732: Edit Back and Forth Button

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-16

**Description:**
As a Business Account Manager (BAM), I want the ability to designate trips as round trips while setting up a program in a convenient manner.

**Acceptance Criteria:**
- Scenario 1: Enabling Round Trip Option
- Given I am a Business Account Manager (BAM) setting up a program,
- When I am entering program details, including locations,
- Then I should see an option, such as a checkbox or toggle button, that allows me to designate trips as round trips.
- Scenario 2: Selecting Round Trip Option
- Given I am setting up a program and I see the round-trip option,
- When I enable the checkbox or toggle button to indicate that trips are round trips,
- Then the system should consider all trips within this program as round trips by default.
- Scenario 3: Proceeding Without Enabling Round Trip Option
- Given I am setting up a program,
- When I do not enable the round-trip option,
- Then the system should not consider trips within this program as round trips by default, and it should proceed with the setup without additional steps or pop-ups related to round trips.
- Scenario 4: Clear Indication
- Given I have enabled the round-trip option for a program,
- When I review the program details or locations,
- Then there should be a clear visual indication that trips within this program are designated as round trips, making it easy to distinguish from other programs.

---

### CMB-8912: Ride  Price Visibility on Program Level 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-09-06

**Description:**
As a Business Account Manager, I want the ability to configure the visibility of prices for business riders within a specific program.

**Acceptance Criteria:**
- When setting up or editing a program in the system, there is an option labeled "Price Visibility."
- The "Price Visibility" option provides two choices: "Visible" and "Hidden."
- If I select "Visible" for the price visibility:
- The prices of trips made under this program will be displayed to the business riders when they book a trip.
- Business riders will see the trip prices in the app or web interface during the trip booking process.
- If I select "Hidden" for the price visibility:
- The prices of trips made under this program will be kept hidden from the business riders.
- Business riders will not see the trip prices in the app or web interface during the trip booking process; instead, they may see a message indicating that prices are not visible.
- As an Admin or a BAM who is booking a trip for someone else in my company I need to be able to see the trip price, no matter what his pricing visibility is on the program or on the user exception level
- Scenarios:
- Scenario 1: Business Account Manager Sets Price Visibility to "Visible"
- Given that I am a Business Account Manager setting up a program,
- When I configure the price visibility option for the program as "Visible,"
- Then the system should display trip prices to the business riders when they book trips under this program.
- Scenario 2: Business Account Manager Sets Price Visibility to "Hidden"
- Given that I am a Business Account Manager setting up a program,
- When I configure the price visibility option for the program as "Hidden,"
- Then the system should hide trip prices from the business riders when they book trips under this program.
- Scenario 3: Business Rider Books a Trip Under a Program with Visible Prices
- Given that, a business rider is associated with a program where trip prices are set to "Visible,"
- When the business rider books a trip within this program,
- Then the system should display the trip price to the rider during the booking process.
- Scenario 4: Business Rider Books a Trip Under a Program with Hidden Prices
- Given that, a business rider is associated with a program where trip prices are set to "Hidden,"
- When the business rider books a trip within this program,
- Then the system should not display the trip price to the rider during the booking process; instead, it may show a message indicating that prices are not visible.
- Scenario 5: Business Account Manager Edits Price Visibility
- Given that I am a Business Account Manager who previously configured a program with a specific price visibility setting,
- When I edit the program and change the price visibility option,
- Then the system should apply the updated price visibility setting to all trips made under this program moving forward.
- Scenario 6: Business Rider Sees a Message for Hidden Prices
- Given that, a business rider is associated with a program where trip prices are set to "Hidden,"
- When the business rider attempts to book a trip within this program,
- Then the system should display a message to the rider during the booking process, indicating that prices are not visible for this program.
- Scenario 7: Default Price Visibility
- Given that I am a Business Account Manager setting up a new program without specifying the price visibility,
- Then the system should have a default behavior for price visibility, which is "Hidden"
- Scenario 8: Booking for someone else on Web App
- Given that, a BAM or an Admin Booking a trip for someone else, who hasn’t price visibility
- When I request the trip from the Web App
- Then I need to see the trip price regardless of that user's settings

---

### CMB-9331: Arabic version of Program Management 

**Status:** Done | **Priority:** No Priority
**Created:** 2023-09-27

**Description:**
As a Business Account Manager (BAM) using the B2B web application, I want the Program List and the main Programs page to be available in Arabic.

**Acceptance Criteria:**
- Given that I am on the Program List or the main Programs page of the B2B web application, I should find an option in the language settings that allows me to switch to Arabic.
- When I select the Arabic language option, all text, labels, and content on the Program List and the main Programs page should be presented in Arabic characters, including program names, descriptions, and any related details.
- The layout and design of the Program List and main Programs page should adapt to support right-to-left (RTL) text direction when the Arabic language is selected.
- Any action buttons, links, or interactions on these pages should also display labels and messages in Arabic when I'm using the Arabic language option.
- Scenarios:
- Scenario 1: Switching to Arabic Language for Program List
- Given: I am on the Program List page of the B2B web application.
- And: I access the language settings.
- When: I choose the Arabic language option.
- Then: All text on the Program List page, including program names and descriptions, should switch to Arabic, and the layout should support RTL.
- Scenario 2: Viewing Program Details in Arabic
- Given: I am on the main Programs page in Arabic mode.
- When: I click on a specific program to view its details.
- Then: The program details, including descriptions and any relevant information, are displayed in Arabic.
- Scenario 3: Interaction with Arabic Labels
- Given: I am on the Program List or main Programs page in Arabic mode.
- When: I perform actions such as creating a new program, editing an existing one, or managing program settings.
- Then: All action buttons, links, and labels related to program management should be displayed in Arabic, ensuring a seamless Arabic user experience.

---

### CMB-9691: User Exception on From the User Lists to have trip Approval 

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-10-13

**Description:**
As a Business Account Manager (BAM) or Business Admin, I want the ability to grant exceptions to specific Business Riders regarding trip approval permissions within a program.

**Acceptance Criteria:**
- Scenario 1: Granting an Exception for a Business Rider
- Given I am a Business Account Manager (BAM) or Business Admin,
- When I access the BAM web application and navigate to user management within a specific program,
- Then I should find an option to grant an exception for specific Business Riders regarding trip approval permissions.
- Scenario 2: Setting a Business Rider to Follow Program Settings (Default)
- Given I am managing user exceptions within a program,
- When I choose to leave a Business Rider's settings as default,
- Then this user will follow the program's default trip approval settings, whether it's auto-approval or manual approval based on the program settings.
- Scenario 3: Setting a Business Rider for Auto-Approval
- Given I am managing user exceptions within a program,
- When I choose to set a Business Rider for auto-approval,
- Then this user's trip requests will be automatically approved, regardless of the program's default settings.
- Scenario 4: Setting a Business Rider for Manual Approval
- Given I am managing user exceptions within a program,
- When I choose to set a Business Rider for manual approval,
- Then this user's trip requests will always require manual approval, regardless of the program's default settings.
- Scenario 5: Default Settings for Other Users
- Given I have granted exceptions to specific Business Riders,
- When other Business Riders within the same program request trips,
- Then they should follow the program's default trip approval settings, unless specific exceptions have been granted to them as well.
- Scenario 6: Valid Auto-Approval Time Limit
- Given I am configuring Users settings,
- When I set the approval duration time limit to a value between 1 minute (minimum) and 60 minutes (maximum),
- Then the system should accept the defined time limit. and any trip will expire if it exceeds this time limit, with Rider Canceled status

---

### CMB-13789: Detailed FAQ on Program Page

**Status:** Done | **Priority:** No Priority
**Created:** 2024-04-12

---

### CMB-12667: Enforce the Business Service Enablement on Prod for all active businesses and program

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-02-20

**Description:**
I want to create a script to enforce specific service settings for all business programs, ensuring consistency and accuracy.

**Acceptance Criteria:**
- Scenario 1: Enabling Business Classic and Business Comfort Services
- Given: The script is initiated.
- When: The script runs.
- Then: It should enable the Business Classic Service and Business Comfort Service for all business programs.
- Scenario 2: Disabling Classic and Comfort Services if Enabled
- Given: The script is initiated.
- When: The script runs.
- Then: It should disable the Business Classic Service and Business Comfort Service if they are currently enabled for any business program.
- Scenario 3: No Impact on Other Services
- Given: The script is initiated.
- When: The script runs.
- Then: It should not modify the settings of any other services apart from the Business Classic and Business Comfort Services. All other services should remain unchanged.

---

### CMB-13256: Book for a Guest User

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-20

**Description:**
As a Business Account Manager (BAM) (Or a Business Admin, Or a Program Moderator) using the Yassir for Business Web App, I require the capability to book trips for guest riders directly from the Booking screen.

**Acceptance Criteria:**
- Accessing Booking Screen:
- Given that I am logged into the Yassir for Business Web App as a BAM,
- When I navigate to the Booking screen,
- Then I should find options to book trips for both registered business riders and guest riders.
- Booking Trip for Guest Rider from Guest List: (Will not be considered in the scope of this story)
- Given that I am on the Booking screen,
- When I select to book a trip for a guest rider,
- Then I should be presented with a list of available guest riders from which I can choose.
- Booking Trip for Guest Rider by Adding Details:
- Given that I am on the Booking screen,
- When I choose to add a guest rider by entering their phone number and name,
- Then I should find input fields to enter the guest rider's phone number and name.
- Entering Trip Details:
- Given that I have selected or added a guest rider,
- When I proceed to enter trip details,
- Then I should find fields to input the pickup and destination locations, select the service, and specify the date and time for the trip in case it’s scheduled
- Program Parameter Checks for Guest Riders:
- Given that I am booking a trip for a guest rider,
- When I enter trip details,
- Then the system should not perform checks on program parameters such as locations, day and hour, service, spending allowance, or number of trips per day.
- Only the budget should be checked to ensure it is sufficient for the trip.
- Schedule Trips
- Given that I am booking a scheduled  trip for a guest rider,
- When I book the trip,
- Then the Guest Rider should Receive an SMS once the Driver starts going to the pickup point
- Confirmation Screen
- Given that I am booking a trip for a guest rider,
- When I enter trip details, and click on the request
- Then on the confirmation Screen, I need to see the guest Rider’s name and phone number
- Not Allowing Booking for a Business Rider as a Guest
- Given that I am booking a trip for a guest rider, Who’s already part of my business, and entering his phone number
- When I try to choose this guest Rider
- Then the system should give me an error informing me that this guest rider is already a business rider of my business
- A Guest User became a Business Rider in my business
- Given that I am booking a trip for a guest rider, Who became a business rider in my business
- When I try to choose this guest Rider from the list
- Then I should find this user removed from the guest list
- A Guest User with an international phone number
- Given that I am booking a trip for a guest rider, Who has an international phone number
- When I try to enter the phone number
- Then  I need to find the flag of all countries and it shouldn’t be restricted to Algeria, Morocco, Senegal, and Tunisia,  yet the default flag should be the same as the country flag

---

### CMB-13098: Program Tab Analytics

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-12

**Description:**
B2B_SC_ProgramMainScreenSessions

---

### CMB-19309: Zendesk Integration

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-05

**Description:**
As a Business Account Manager (BAM), Program Moderator, or Business Admin,

**Acceptance Criteria:**
- Scenario 1: Accessing the Chat Support Widget
- Given I am logged into the Yassir for Business web app as a BAM, Program Moderator, or Business Admin,
- When I navigate to any screen on the platform,
- Then I should see a chat support widget consistently attached to my screen.
- Scenario 2: Chat Widget Appearance and Accessibility
- Given I am on the Yassir for Business web app,
- When I look at the bottom right corner of my screen (or designated location),
- Then I should see the chat widget with the label or icon indicating "Support" or "Help."
- Scenario 3: Initiating Contact with B2B Support Team
- Given I need assistance while using the Yassir for Business web app,
- When I click on the chat support widget,
- Then a chat window should open, allowing me to type and submit my queries or support requests directly.
- Scenario 4: Dedicated B2B Support Form
- Given I have opened the chat support widget,
- When I submit a request through the chat,
- Then the form associated with the chat widget should be specifically routed to the B2B Support team using the "B2B" form that has been configured for the Yassir for Business platform.
- Scenario 5: Ticket Routing to Dedicated Team
- Given I have submitted a support request through the chat widget,
- When my request is received by the support team,
- Then the system should automatically route my ticket to the dedicated B2B Support team members who handle requests from the Yassir for Business platform.
- Scenario 6: Consistent Presence Across the Web App
- Given I am navigating between different sections or screens on the Yassir for Business web app,
- When I move to another page,
- Then the chat support widget should remain accessible and visible, allowing me to initiate a chat at any time without losing previous conversation history.

---

### CMB-18872: Removing Program Setup

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-10-22

**Description:**
As a Business Account Manager (BAM) registering my business for the first time,

**Acceptance Criteria:**
- Scenario 1: Immediate Redirection to Home Dashboard Activation Screen
- Given I am registering my business for the first time,
- When I finish entering my company information (e.g., company name, legal details),
- Then I should be redirected right away to the Home Dashboard activation screen.
- Scenario 2: Automatic Program Selection
- Given I am on the Home Dashboard activation screen,
- When I view the available program options,
- Then the "Unlimited" program should be pre-selected for me by default.
- Scenario 3: Configurable Program Setup for A/B Testing
- Given we are conducting A/B tests or require flexibility in program setup,
- When a specific country or business falls under the A/B test group,
- Then the program setup should be configurable, allowing other program options to be shown or a different default program to be applied.

---

## Consolidated Acceptance Criteria

- Scenario 01: Entering trip justification
- Given I am a rider on the "Book a Ride" screen.
- When I am booking an instant or booked for later trip.
- Then a required visible input field should be displayed, labeled "Ride Justification", it should have a character limit of 150 characters.
- Scenario 02: Justification is displayed on trips details on the history section
- Given I am a Business Rider
- When I view the details screen for the trip I requested with a ride justification.
- Then the justification text should be clearly displayed and remain unchanged.
- Scenario 01: Browsing Available Giftcard Templates
- As a Business Admin on the WebApp,
- When I navigate to the "Buy Giftcards" section,
- Then I should see a list of all giftcard templates available for my country, each displaying:
- The monetary amount of the giftcard.
- Its visual theme (e.g., Corporate, Holiday).
- A visually blurred voucher image to indicate it's a template, not an active voucher.
- Scenario 02: Enforcing Budget for Giftcard Purchases
- When I view the "Buy Giftcards" section,
- Then for each giftcard template:
- If my company's current budget is less than the giftcard's purchase price, the "Purchase" button should be disabled, clearly indicating "Insufficient Budget".
- If my company's current budget is equal to or greater than the giftcard's purchase price, the "Purchase" button should be enabled, allowing for purchase.
- Scenario 03: Purchasing a Giftcard Template and Initiating Coupon Setup
- When I click the "Purchase" button for an available giftcard template, and my budget is sufficient,
- Then the giftcard's purchase price is deducted from my company's budget.
- And I am immediately redirected to the "Coupon Setup" screen for that specific, newly purchased giftcard.
- Scenario 04: Configuring Giftcard Setup
- When I am on the "Coupon Setup" screen for a newly purchased giftcard,
- Then I should see a form allowing me to configure the following settings (all optional, with clear defaults):
- Start Date / End Date (DEFAULT: UNLIMITED)
- Start Time / End Time (Daily trip validity window, DEFAULT: UNLIMITED)
- Min Trip Price / Max Trip Price (Monetary limits per trip, DEFAULT: UNLIMITED)
- Percentage Discount (DEFAULT: 50%)
- Max Total Usage (Number of trips across the program's lifetime, DEFAULT: UNLIMITED)
- Max Usage Per Day (Daily limit on trips, DEFAULT: 1 trip per user)
- Pickup/Dropoff Locations (DEFAULT: ANYWHERE TO ANYWHERE)
- And upon clicking "Finalize Coupon Setup & Generate Coupon", the Coupon becomes active with the defined rules.
- Note : B2B Client can skip setting programs for giftcards, if that was the case then the Default settings should be applied.
- Scenario 05: Viewing Purchased Giftcard Programs
- When I navigate to the "My Giftcards" section,
- Then I should see a list of all giftcards that have been purchased, each displaying:
- The Original Monetary Value of the giftcard.
- The Current Remaining Value of the giftcard.
- The Voucher Code (blurred for security, but viewable on click).
- Start Date / End Date
- Start Time / End Time
- Min Trip Price / Max Trip Price
- Percentage Discount
- Max Total Usage
- Max Usage Per Day
- Pickup/Dropoff Locations
- And for each program, I should see options to "View Trips".
- Scenario 06: Viewing Trip Usage Log
- When I click "View Trips" for a specific giftcard in “My Giftcards” section,
- Then an overlay or detailed screen should appear, displaying a table of all trips paid by that giftcard, including:
- The Date and Time of the trip.
- The Amount Used from the giftcard's balance for that trip (Trip Price).
- Rider’s Phone Number of the user who took the trip (partially masked for privacy).
- Itinerary (Departure/Destination)
- Driver Details (Full name, rating, phone number, car infos)
- Scenario 07: Downloading Giftcard
- When I view a giftcard,
- Then I should see a prominent "Download Giftcard" button.
- And upon clicking this button, a printable PDF file is generated, which includes:
- The Voucher Code (unblurred).
- Scenario 08: Reverting Remaining Giftcard Value to Budget
- When I view an Active giftcard with a Current Remaining Value greater than zero,
- Then I should see a "Revert Value to Budget" button even if the end date of the giftcard has passed.
- Scenario 09: Confirmation for Reverting Giftcard Value
- When I click the "Revert Value to Budget" button,
- Then a confirmation dialog appears, stating that the giftcard will be immediately deactivated and all remaining usage will be blocked
- Scenario 10: Processing Giftcard Value Reversal
- When I confirm the action to "Revert Value to Budget",
- Then the giftcard's Current Remaining Value is instantly added back to my company's general budget.
- Scenario 11: Giftcard labeling After Reversal
- When the giftcard value reversal is processed,
- Then the giftcard label should be added "Reverted".
- Scenario 12: Disabling Voucher After Reversal
- Then the voucher code associated with that program is immediately disabled and cannot be used for future trips.
- Scenario 13: Logging Giftcard Reversal
- When a giftcard value reversal is processed,
- Then a log of this financial reversal is recorded in the AdminPanel's logs.
- Note : Following events should be added on this notion page
- Event Name
- Scenario: Filtering and Viewing Programs
- Given I am on the Programs screen.
- Then the filter for programs should be a dropdown list containing the options: "Active," "Inactive," and "All."
- And the initial screen displayed should be the list of programs, not the analytics dashboard.
- Scenario: Actions Column
- Given I am viewing the list of programs.
- When a program is active.
- Then the "Action" column for that program should display a "De-activate" option and an "Edit" option.
- When a program is inactive.
- Then the "Action" column for that program should display an "Activate" option and a "Delete" option.
- Scenario: Viewing Program Details
- Given I am viewing the list of programs Then I clicked on any program on the list.
- Then a new, dedicated details screen for that program should be displayed.
- And this details screen should show the total number of riders assigned to the selected program.
- Scenario: Creating a New Program
- Given I am on the programs list screen and I click the "Create a New Program" button.
- Then a new input field should be added to the program creation form.
- And it should be a dropdown list that allows me to select one or more groups to assign to the new program.
- Scenario 1: Changing Rider Role to Program Moderator
- Given I am a Business Account Manager (BAM) on the B2B Web App,
- When I navigate to the Rider Management section and select a Business Rider,
- Then I should find an option to change the Rider's role to allow become _Program Moderator_.
- Scenario 2: Rider Receives Email with Generated Password
- Given I have changed a Rider's role to enable web app booking,
- When I confirm the role change,
- Then the selected Rider should receive an email containing a generated password for web app access.
- Scenario 3: Admin has been downgraded to a Program Manager Receives Email without Generated Password
- Given I have changed an Admin's role to a program moderator
- Then the selected Admin should receive an email containing updates about the role, and he can keep using the same password to access the web app.
- Scenario 4: Rider Can Log in with Third-Party Tools
- When the Rider receives the email with the generated password,
- Then they should have the option to log in using third-party tools such as Google.
- Scenario 5: Program Parameters Applied
- When the Rider logs in to the web app,
- Then the program parameters (Location Timing, Service, Spending allowance, number of trips per day), except the price visibility and trip permissions, should be applied to their booking experience. And for the price must be visible for those users, and trip requests must be autonomous regardless of the program rules. on mobile app and web app
- Scenario 6: Book for another member on the same program
- Given I’m a program moderator
- When I try to book a trip for myself or someone else
- Then I need to be able to book the trip for myself, or anyone else assigned to the same program
- Scenario 7: Sections I can see
- Given I’m a program moderator on the web app
- When I access the web app
- Then I’ll have only access to the booking section, and the profile section _Change the password only and personal information, all other pages, are read only_. Any other sections on the Page will be read-only _Program, Groups, Users, Trip History, Payment Screen_
- Scenario 8: The program moderator moved from one program to another
- When I’m assigned to a new program
- Then I need to follow this new program rules and be able to book users in the same new program only,
- Scenario 9: The program moderator moved from one program to another
- When My current program is deactivated, and I’m assigned to a new program
- Scenario 10: The program moderator has been upgraded to a business admin
- When I’m upgraded to a be a business admin
- Then I need to receive an email containing instructions about how to use the platform as an admin, and I can use the same password to access the web app
- Scenario 01: Viewing Active Challenges
- As a webApp user,
- When I navigate to the Challenges section of the WebApp,
- Then I should see
- a display of my ongoing challenge with its goals.
- The upcoming challenges that will start the next week (the list should be updated daily by end of day to include newly created challenges if any)
- Scenario 02: Tracking Challenge Progress
- When I am participating in a challenge,
- a progress bar that accurately reflects my current progress towards the challenge goal in real-time on each finished trip.
- Finished Trips that are later-on Cancelled from dash-ops should not impact the progress of the challenge
- Scenario 03: Challenges History
- When I view my challenge history,
- Then I should be able to see all my previous challenges
- Challenge Name
- Challenge Validity Date
- Reward (cash-back percentage earned)
- Status (Partially completed, Completed, Expired)
- Action (View Challenge Details)
- Scenario 04: Challenge Cash-Back Notification
- When I complete a challenge (each time I complete a criterion of the challenge) and earned a cash-back percentage,
- Then the system should
- send me a notification by the end date of the challenge
- informing me that I gained X% from Y challenge (displaying the name of the challenge)
- and the cash-back will be processed by the end of the month on the invoice
- and on-click I should be redirected to the Challenge details screen.
- Scenario 05: Upcoming Challenge Notification
- When I have an upcoming challenge,
- Then the system should send me a notification 7days before the start of the challenge and on click the notification I am redirected to the challenge details screen.
- Scenario 06: Add Banner on the Dashboards
- When I am on the dashboard screen,
- Then I should see a banner that would redirect me to the challenge screen.
- Scenario 07: Challenge Disabled or Deleted from AdminPanel and a Notification has been Sent
- As a webApp user who received a notification 7 days before the upcoming challenge,
- When the challenge is disabled or deleted from adminPanel after the notification has been sent,
- Then when I click on the notification, I should be redirected to the challenges screen.
- Scenario 08: Challenge Disabled or Deleted from AdminPanel
- When a challenge is disabled from adminPanel,
- Then I should no longer see it on the upcoming challenges list and on click on the notification
- Scenario 09: Upcoming Challenge Edited on AdminPanel
- When an upcoming challenge is edited on adminPanel,
- Then I should see the updates reflected on webApp.
- Scenario 1: Booking a Trip on a Restricted Day or Time Slot
- Given I am a Business Rider using Yassir for Business on the Yassir Go App,
- When I attempt to book a trip on a day or during a time slot that is not within the allowed days or time slots defined by my business program,
- Then I should find the "Request" button disabled, preventing me from proceeding with the booking.
- Scenario 2: Scheduling a Trip on a Restricted Day or Time Slot
- Given I am scheduling a trip to Yassir for Business on the Yassir Go App,
- When I select a date or time slot that falls outside the allowed days or time slots defined by my business program,
- Then I should receive an error message, indicating that I must choose another date or time slot that adheres to the program's parameters.
- Scenario 3: Booking a Trip Within Allowed Days and Time Slots
- Given I am a Business Rider using Yassir for Business on the Yassir Go App,,
- When I attempt to book a trip on a day and during a time slot that is within the allowed days and time slots defined by my business program,
- Then I should find the "Request" button enabled, allowing me to proceed with the booking.
- Scenario 1: Exceeding Allowed Limit
- Given that I am a Business Rider using Yassir for Business,
- When I attempt to book a trip that exceeds the cost limit set by the BAM for my business account,
- Then I should receive an error message informing me that the trip cost exceeds the allowed limit.
- Scenario 2: Informative Error Message
- Given that I receive an error message due to the cost limit exceeding,
- When I read the error message,
- Then it should clearly state that the trip cost exceeds the BAM-defined limit and provide guidance on the next steps.
- Scenario 3: Editing my trip locations
- Given that my trip cost exceeds the spending allowance for all services and service types
- When I get an error message on the estimation screen
- Then I need to find a CTA, to get back to modify the trip pickup and destination to ensure they align with the defined program parameters.
- Scenario 4: Different Services of the User Programs on of them is is less than the spending allowance and the other is higher
- Given that I have two services within my program
- When one of the services and its service type costs are more than the spending allowance, and then I have another service containing service types whose cost is less than the spending allowance
- Then I can only see the last service its cost estimation is less than the spending allowance
- The business account manager must have the option to cover a certain percentage of the trip cost
- The business account manager must have the option to cover the trip cost to a certain level
- The business account manager must have the option to set a spending allowance for all of the program members
- Spending Allowance can be more or less than the total left or initially allocated budget
- The user needs to be provided with a location searching option
- The user needs to be able to pin the location on a map
- The user needs to be able to enter 5 different stops in the trip
- The user Can leave these fields empty, but he needs to be warned, and the default value will be he can pick up and drop off from any locarion
- Users must have the option to be able to limit the trips to be from the defined pickup point to the drop-off point only
- Users must have the option to be able to limit the trips to be from the defined pickup point to any drop-off point
- Users must have the option to be able to limit the trips to be from any point to the defined drop-off point
- User needs to be able to choose the days and hours from a list
- User needs to be able to enter a custom set of  hours per every day
- The user Can leave these fields empty, but he needs to be warned. if he didn’t specify he will be allowed to request a trip at anytime
- User Can leave these fields empty, but he needs to be warned
- Scenario 1: Adding Multiple stops
- Given that I am logged into the Yassir for Business platform,
- When I initiate the process of booking a trip,
- Then I should find an option to add multiple destinations to the trip.
- Scenario 2: Compliance with Program Location Parameters
- Given that I am adding multiple destinations to a trip,
- When selecting pickup and destination points,
- Then the chosen locations should comply with the program location parameters defined for the business. and no checks by the program will be applied to the intermediate stops
- Scenario 3: Calculation of Total Trip Cost
- Given that I have added multiple destinations to the trip,
- When I finalize the selection of locations,
- Then the system should calculate the total trip cost, considering all stops in the journey.
- How the ride cost is calculated in B2C:
- We consider the path between each of the two stops as a sub-trip, for example, a ride with 3 stops in between, then that means you have the following sub-trips:
- Pickup to stop 1.
- Stop 1 to Stop 2
- Stop 2 to stop 3
- stop 3 to the final destination each of those sub-trips is considered as a separate trip when it comes to pricing, so we calculate the pricing separately, and then we sum the price of all of them, then we check if eligible applied coupons or reductions, also we check if there's an added boost or not, then we calculate the final price to share.
- Scenario 4: Rearranging Stops
- When reviewing the trip, the trip entered points
- Then I should have the option to rearrange the sequence of stops as needed.
- Scenario 5: Trip Confirmation Screen
- When I proceed to request the trip,
- Then the trip confirmation screen should display all stops in the journey, providing a clear overview before confirming the booking.
- Scenario 6: If the trip stopped in an intermediate stop
- Given that as a Business rider on a multi-stop trip
- When the trip finished on an intermediate stop
- Then I need to get a refund, for the rest of the cost of the trip based on the new estimated cost value - the initially estimated cost value
- Scenario 7: Business Discounts
- Given as a Business I have a discount plan based on the number of trips
- When I book a multistop trip
- Then it should be calculated as one trip in the Business Discounts
- Scenario 8: Export Files link
- Given as an Admin on the Admin panel, or a BAM
- When I export the list of trips that contains multiple stops
- Then the table should contain if the trip is a multistop or not, and we should have columns for each intermediate stop, names intermediate stop number x
- Scenario 9: Number of Stops Limitation
- Given as a BAM Booking a multistop trip
- When I’m adding the multi-stops,
- Then I should find the plus button disabled when reaching out to a number of intermediate stops that hits the limit of the number of stops -Which is 3- we can book, based on the multi-stops configurations
- The web app should allow Business Account Managers to book scheduled trips for themselves or other Business Riders.
- The web app should verify if the trip booking complies with the program parameters, including locations, spending allowance, number of allowed trips per day, allowed days, and hours for booking trips.
- If the trip booking complies with the program parameters, the cost should be deducted from the budget.
- The web app should sync with the trip status throughout the trip lifecycle.
- If the trip is assigned, no changes should be made to the trip until it starts.
- If the trip starts and finishes, the web app should maintain the trip status and budget deduction.
- If the trip is canceled, the web app should refund the deducted amount to the budget.
- Scenario 1: Booking a scheduled trip for a Business Rider
- Given: I am a Business Account Manager using the Yassir Go for B2B web app
- When: I book a scheduled trip for myself or another Business Rider
- Then: The web app should verify if the trip booking complies with the program parameters
- Scenario 2: Deducting the cost from the budget
- Given: I am a Business Account Manager who has booked a trip that complies with the program parameters
- When: The trip is successfully booked
- Then: The cost should be deducted from the budget
- Scenario 3: Syncing with the trip status
- Given: I am a Business Account Manager who has booked a trip
- When: The trip status changes during the trip lifecycle
- Then: The web app should sync with the trip status and handle potential cancellations and budget refunds accordingly
- Scenario 4: Refunding the budget for a canceled trip
- Given: I am a Business Account Manager who has booked a trip that is later canceled
- When: The trip is canceled
- Then: The web app should refund the deducted amount to the budget
- The user needs to be able to choose trip purpose from a list, not by entering a number, or textual information.
- Back and fourth from Office
- Campus Shuttle
- Late night
- Candidate interviews
- Customer Rides
- Emergency Rides
- Event
- Custom Travel Programme
- We need to provide other options
- The user needs to be able to skip this step
- Names should start with letters
- Names fields needs to be limited to a number of characters
- The user should be able to select a service option for the trip, such as standard or premium. as long as they are part of the program assigned to the BAM
- The app should show the estimated cost of the trip based on the selected service option.
- The estimate should be calculated in real-time and take into account any surge values
- The user should be able to change the selected service option and see the updated estimated cost.
- The Trip cost must be within the spending allowance of the program parameters
- Given *the user has opened the app and is logged in as a business account manager,
- When *the user selects the option to create a new trip,
- Then *the app should display a screen where the user can select a service option for the trip, and see the estimated cost based on the selected option.
- Given *the user has selected a service option for a trip,
- When *the user changes the selected service option,
- Then *the app should update the estimated cost based on the newly selected option.
- Given *the user has entered pickup and destination points for a trip and selected a service option,
- When *the trip cost exceeds the spending allowance or the number of trips per day.
- Then *the app should block him from booking the trip
- When *entered locations aren't according to the program rules
- The web app should allow the Business Account Manager to book a trip for themselves or for any other business rider
- The web app should check the user's program before booking the trip
- The web app should apply all relevant program rules to the booking:
- Time and Date
- Locations
- Services Allowed
- Spending Allowance
- Number of allowed trips per day for the user
- The web app should provide confirmation of the booking to the Business Account Manager and the rider
- The web app should provide a drop-down list of available business riders that the Business Account Manager can search and select from
- The web app should allow the Business Account Manager to search for a business rider by name and email
- By Default, the BAM is booking the trips for himself
- Scenario 1 - Booking a trip for myself:
- Given *I am a Business Account Manager And I want to book a trip for myself
- When *I enter my trip details And select myself from the drop-down list of available riders
- Then *the web app checks my program And applies all relevant program rules to the booking And provides confirmation of the booking to me
- Scenario 2 - Booking a trip for another business rider:
- Given *I am a Business Account Manager And I want to book a trip for another business rider
- When *I  select the rider from the drop-down list of available riders
- Then the web app checks the rider's program And applies all relevant program rules to the booking And provides confirmation of the booking to me and the rider
- Scenario 3 - Searching for a business rider:
- When *I click on the drop-down list of available riders And enter the name or ID of the rider I am searching for
- Then *the web app displays a list of matching riders And allows me to select the rider from the list And proceed with booking the trip for the selected rider
- The user needs to confirm on Password
- Forgotten password: User needs to have an option in case of forgetting his password
- I can assign multiple groups to the same program
- Each program must have a textual field for program name
- Names fields need to be limited to a number of characters
- The business account manager must have the option to choose more than one service type of the program
- When a Rider requests an instant or scheduled trip, the system should validate the trip against the program parameters mentioned above.
- If the trip does not meet any of the program parameters, the system should display an appropriate error message indicating the reason for the trip's rejection.
- If the trip meets all the program parameters, it should be successfully booked and processed.
- The validation of program parameters should happen in real time during the trip request process.
- Scenarios:
- Scenario 1: Trip Request within Program Parameters
- Given a logged-in business account Rider
- When the Rider requests a trip
- And the trip meets all the defined program parameters
- Then the trip should be successfully booked and processed
- Scenario 2: Trip Request Violating Program Parameters
- And the trip violates any of the defined program parameters
- Then the system should display an appropriate error message indicating the reason for the trip's rejection
- Scenario 3: Sufficient Budget
- And there is sufficient budget available in the program to cover the trip cost
- Scenario 4: Insufficient Budget
- And there is insufficient budget available in the program to cover the trip cost
- Then the system should display an appropriate error message indicating insufficient budget
- In the program settings, I should find a section for user permissions or access control.
- Within the user permissions section, I can select individual Business Riders or groups of Business Riders.
- For each selected user, I should be able to choose from the following options:
- Follow Program Rules: The default setting where Business Riders adhere to the program-defined pricing visibility rule.
- Hide Price: Business Riders cannot see trip prices, regardless of program rules.
- See Price Regardless of Rules: Business Riders can view trip prices, even if they contradict program rules.
- Admin and Business Account Manager can see the price of the trips on the Web App Regardless of the Program, and user exception rules
- Admins and BAMs will be following his rules program rules or exceptions made on the user list level
- When inviting a new user to the business he will be following the program rules by default
- When moving a Rider from one program to another if he’s following the program rules then he will follow the new program rules, if he has an exception then he will be following the rules defined for him
- Scenario 1: Editing User Permissions to see the price
- Given that I am a Business Account Manager logged into the web application,
- When I access the user list,
- Then I should find a user permissions edit button that allows me to select specific Pricing Visibility for the the user
- Scenario 2: Setting Users to Follow Program Rules
- Given that I am configuring user permissions within the program settings,
- When I select a user,
- Then I should have the option to set them to "Follow Program Rules."
- Scenario 3: Setting Users to Hide Price
- Then I should have the option to set them to "Hide Price."
- Scenario 4: Setting Users to See Price Regardless of Rules
- Then I should have the option to set them to "See Price Regardless of Rules."
- Scenario 5: Applying User Permissions
- Given that I have configured user permissions for specific Business Riders,
- When these users log into the web or mobile app and interact with trip pricing,
- Then their experience should align with the permissions I have set in the program settings. (Hidden, visible, or following the program rules)
- Scenario 1: Enabling Round Trip Option
- Given I am a Business Account Manager (BAM) setting up a program,
- When I am entering program details, including locations,
- Then I should see an option, such as a checkbox or toggle button, that allows me to designate trips as round trips.
- Scenario 2: Selecting Round Trip Option
- Given I am setting up a program and I see the round-trip option,
- When I enable the checkbox or toggle button to indicate that trips are round trips,
- Then the system should consider all trips within this program as round trips by default.
- Scenario 3: Proceeding Without Enabling Round Trip Option
- Given I am setting up a program,
- When I do not enable the round-trip option,
- Then the system should not consider trips within this program as round trips by default, and it should proceed with the setup without additional steps or pop-ups related to round trips.
- Scenario 4: Clear Indication
- Given I have enabled the round-trip option for a program,
- When I review the program details or locations,
- Then there should be a clear visual indication that trips within this program are designated as round trips, making it easy to distinguish from other programs.
- When setting up or editing a program in the system, there is an option labeled "Price Visibility."
- The "Price Visibility" option provides two choices: "Visible" and "Hidden."
- If I select "Visible" for the price visibility:
- The prices of trips made under this program will be displayed to the business riders when they book a trip.
- Business riders will see the trip prices in the app or web interface during the trip booking process.
- If I select "Hidden" for the price visibility:
- The prices of trips made under this program will be kept hidden from the business riders.
- Business riders will not see the trip prices in the app or web interface during the trip booking process; instead, they may see a message indicating that prices are not visible.
- As an Admin or a BAM who is booking a trip for someone else in my company I need to be able to see the trip price, no matter what his pricing visibility is on the program or on the user exception level
- Scenario 1: Business Account Manager Sets Price Visibility to "Visible"
- Given that I am a Business Account Manager setting up a program,
- When I configure the price visibility option for the program as "Visible,"
- Then the system should display trip prices to the business riders when they book trips under this program.
- Scenario 2: Business Account Manager Sets Price Visibility to "Hidden"
- When I configure the price visibility option for the program as "Hidden,"
- Then the system should hide trip prices from the business riders when they book trips under this program.
- Scenario 3: Business Rider Books a Trip Under a Program with Visible Prices
- Given that, a business rider is associated with a program where trip prices are set to "Visible,"
- When the business rider books a trip within this program,
- Then the system should display the trip price to the rider during the booking process.
- Scenario 4: Business Rider Books a Trip Under a Program with Hidden Prices
- Given that, a business rider is associated with a program where trip prices are set to "Hidden,"
- Then the system should not display the trip price to the rider during the booking process; instead, it may show a message indicating that prices are not visible.
- Scenario 5: Business Account Manager Edits Price Visibility
- Given that I am a Business Account Manager who previously configured a program with a specific price visibility setting,
- When I edit the program and change the price visibility option,
- Then the system should apply the updated price visibility setting to all trips made under this program moving forward.
- Scenario 6: Business Rider Sees a Message for Hidden Prices
- When the business rider attempts to book a trip within this program,
- Then the system should display a message to the rider during the booking process, indicating that prices are not visible for this program.
- Scenario 7: Default Price Visibility
- Given that I am a Business Account Manager setting up a new program without specifying the price visibility,
- Then the system should have a default behavior for price visibility, which is "Hidden"
- Scenario 8: Booking for someone else on Web App
- Given that, a BAM or an Admin Booking a trip for someone else, who hasn’t price visibility
- When I request the trip from the Web App
- Then I need to see the trip price regardless of that user's settings
- Given that I am on the Program List or the main Programs page of the B2B web application, I should find an option in the language settings that allows me to switch to Arabic.
- When I select the Arabic language option, all text, labels, and content on the Program List and the main Programs page should be presented in Arabic characters, including program names, descriptions, and any related details.
- The layout and design of the Program List and main Programs page should adapt to support right-to-left (RTL) text direction when the Arabic language is selected.
- Any action buttons, links, or interactions on these pages should also display labels and messages in Arabic when I'm using the Arabic language option.
- Scenario 1: Switching to Arabic Language for Program List
- Given: I am on the Program List page of the B2B web application.
- And: I access the language settings.
- When: I choose the Arabic language option.
- Then: All text on the Program List page, including program names and descriptions, should switch to Arabic, and the layout should support RTL.
- Scenario 2: Viewing Program Details in Arabic
- Given: I am on the main Programs page in Arabic mode.
- When: I click on a specific program to view its details.
- Then: The program details, including descriptions and any relevant information, are displayed in Arabic.
- Scenario 3: Interaction with Arabic Labels
- Given: I am on the Program List or main Programs page in Arabic mode.
- When: I perform actions such as creating a new program, editing an existing one, or managing program settings.
- Then: All action buttons, links, and labels related to program management should be displayed in Arabic, ensuring a seamless Arabic user experience.
- Scenario 1: Granting an Exception for a Business Rider
- Given I am a Business Account Manager (BAM) or Business Admin,
- When I access the BAM web application and navigate to user management within a specific program,
- Then I should find an option to grant an exception for specific Business Riders regarding trip approval permissions.
- Scenario 2: Setting a Business Rider to Follow Program Settings (Default)
- Given I am managing user exceptions within a program,
- When I choose to leave a Business Rider's settings as default,
- Then this user will follow the program's default trip approval settings, whether it's auto-approval or manual approval based on the program settings.
- Scenario 3: Setting a Business Rider for Auto-Approval
- When I choose to set a Business Rider for auto-approval,
- Then this user's trip requests will be automatically approved, regardless of the program's default settings.
- Scenario 4: Setting a Business Rider for Manual Approval
- When I choose to set a Business Rider for manual approval,
- Then this user's trip requests will always require manual approval, regardless of the program's default settings.
- Scenario 5: Default Settings for Other Users
- Given I have granted exceptions to specific Business Riders,
- When other Business Riders within the same program request trips,
- Then they should follow the program's default trip approval settings, unless specific exceptions have been granted to them as well.
- Scenario 6: Valid Auto-Approval Time Limit
- Given I am configuring Users settings,
- When I set the approval duration time limit to a value between 1 minute (minimum) and 60 minutes (maximum),
- Then the system should accept the defined time limit. and any trip will expire if it exceeds this time limit, with Rider Canceled status
- Scenario 1: Enabling Business Classic and Business Comfort Services
- Given: The script is initiated.
- When: The script runs.
- Then: It should enable the Business Classic Service and Business Comfort Service for all business programs.
- Scenario 2: Disabling Classic and Comfort Services if Enabled
- Then: It should disable the Business Classic Service and Business Comfort Service if they are currently enabled for any business program.
- Scenario 3: No Impact on Other Services
- Then: It should not modify the settings of any other services apart from the Business Classic and Business Comfort Services. All other services should remain unchanged.
- Accessing Booking Screen:
- Given that I am logged into the Yassir for Business Web App as a BAM,
- When I navigate to the Booking screen,
- Then I should find options to book trips for both registered business riders and guest riders.
- Booking Trip for Guest Rider from Guest List: (Will not be considered in the scope of this story)
- Given that I am on the Booking screen,
- When I select to book a trip for a guest rider,
- Then I should be presented with a list of available guest riders from which I can choose.
- Booking Trip for Guest Rider by Adding Details:
- When I choose to add a guest rider by entering their phone number and name,
- Then I should find input fields to enter the guest rider's phone number and name.
- Entering Trip Details:
- Given that I have selected or added a guest rider,
- When I proceed to enter trip details,
- Then I should find fields to input the pickup and destination locations, select the service, and specify the date and time for the trip in case it’s scheduled
- Program Parameter Checks for Guest Riders:
- Given that I am booking a trip for a guest rider,
- When I enter trip details,
- Then the system should not perform checks on program parameters such as locations, day and hour, service, spending allowance, or number of trips per day.
- Only the budget should be checked to ensure it is sufficient for the trip.
- Schedule Trips
- Given that I am booking a scheduled  trip for a guest rider,
- When I book the trip,
- Then the Guest Rider should Receive an SMS once the Driver starts going to the pickup point
- Confirmation Screen
- When I enter trip details, and click on the request
- Then on the confirmation Screen, I need to see the guest Rider’s name and phone number
- Not Allowing Booking for a Business Rider as a Guest
- Given that I am booking a trip for a guest rider, Who’s already part of my business, and entering his phone number
- When I try to choose this guest Rider
- Then the system should give me an error informing me that this guest rider is already a business rider of my business
- A Guest User became a Business Rider in my business
- Given that I am booking a trip for a guest rider, Who became a business rider in my business
- When I try to choose this guest Rider from the list
- Then I should find this user removed from the guest list
- A Guest User with an international phone number
- Given that I am booking a trip for a guest rider, Who has an international phone number
- When I try to enter the phone number
- Then  I need to find the flag of all countries and it shouldn’t be restricted to Algeria, Morocco, Senegal, and Tunisia,  yet the default flag should be the same as the country flag
- Go to the One Program settings page;
- Start editing the program;
- Select custom time range;
- Click on the start and end time dropdowns
- Scenario 1: Accessing the Chat Support Widget
- Given I am logged into the Yassir for Business web app as a BAM, Program Moderator, or Business Admin,
- When I navigate to any screen on the platform,
- Then I should see a chat support widget consistently attached to my screen.
- Scenario 2: Chat Widget Appearance and Accessibility
- Given I am on the Yassir for Business web app,
- When I look at the bottom right corner of my screen (or designated location),
- Then I should see the chat widget with the label or icon indicating "Support" or "Help."
- Scenario 3: Initiating Contact with B2B Support Team
- Given I need assistance while using the Yassir for Business web app,
- When I click on the chat support widget,
- Then a chat window should open, allowing me to type and submit my queries or support requests directly.
- Scenario 4: Dedicated B2B Support Form
- Given I have opened the chat support widget,
- When I submit a request through the chat,
- Then the form associated with the chat widget should be specifically routed to the B2B Support team using the "B2B" form that has been configured for the Yassir for Business platform.
- Scenario 5: Ticket Routing to Dedicated Team
- Given I have submitted a support request through the chat widget,
- When my request is received by the support team,
- Then the system should automatically route my ticket to the dedicated B2B Support team members who handle requests from the Yassir for Business platform.
- Scenario 6: Consistent Presence Across the Web App
- Given I am navigating between different sections or screens on the Yassir for Business web app,
- When I move to another page,
- Then the chat support widget should remain accessible and visible, allowing me to initiate a chat at any time without losing previous conversation history.
- Scenario 1: Immediate Redirection to Home Dashboard Activation Screen
- Given I am registering my business for the first time,
- When I finish entering my company information (e.g., company name, legal details),
- Then I should be redirected right away to the Home Dashboard activation screen.
- Scenario 2: Automatic Program Selection
- Given I am on the Home Dashboard activation screen,
- When I view the available program options,
- Then the "Unlimited" program should be pre-selected for me by default.
- Scenario 3: Configurable Program Setup for A/B Testing
- Given we are conducting A/B tests or require flexibility in program setup,
- When a specific country or business falls under the A/B test group,
- Then the program setup should be configurable, allowing other program options to be shown or a different default program to be applied.

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-155: Dev - BE: Setting Program Trip Parameters ~~ → Replaced by CMB-13270
- ~~CMB-485: Dev - FE: Setting the program Spending allowance~~ → Replaced by CMB-10048
- ~~CMB-403: Dev - FE: Setting Program Trip Parameters~~ → Replaced by CMB-13270
- ~~CMB-405: Dev - FE: Program Naming~~ → Replaced by CMB-157
- ~~CMB-4721: Booking Scheduled Trip ~~ → Replaced by CMB-13268
- ~~CMB-283: Design: Program Purpose~~ → Replaced by CMB-154
- ~~CMB-560: Dev-BE: Dispatching Request~~ → Replaced by CMB-1199
- ~~CMB-563: Android - Dev-App: Dispatching Request~~ → Replaced by CMB-1199
- ~~CMB-921: Dev - BE: Setting the Program Spending allowance~~ → Replaced by CMB-10048
- ~~CMB-1151: Dev - BE: Program Purpose~~ → Replaced by CMB-154
- ~~CMB-9991: Program Moderator~~ → Replaced by CMB-22160
