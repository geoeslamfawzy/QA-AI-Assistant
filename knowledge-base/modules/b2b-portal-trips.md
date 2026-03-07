---
id: "jira-b2b-portal-trips"
title: "B2B Portal — Trips"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","regression-testing","regression","craft_sync"]
last_synced: "2026-02-26T14:27:07.236Z"
ticket_count: 34
active_ticket_count: 26
---

# B2B Portal — Trips

> Auto-generated from 34 Jira tickets.
> Last synced: 2026-02-26T14:27:07.236Z
> Active features: 26
> Superseded: 8

## User Stories

### CMB-29542: B2B NDA Manual Dispatch

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-09-07

**Description:**
As an Operations Manager, I need a dedicated section to view and manually dispatch B2B trips that the automated dispatch system could not assign a driver to. This will allow me to quickly resolve "No Driver Available" issues, ensuring high service quality for our business clients.

**Acceptance Criteria:**
- Scenario 1: Trip is listed for manual dispatch
- Given a B2B trip is booked via the SuperApp or WebApp.
- When the trip remains unassigned after:
- 5 mins for production and pre-prod
- 3 minutes for staging
- Then a copy of the trip request is automatically listed in a new "Manual Dispatch" sub-menu on the Business section of the dashops.
- Scenario 2: Notification for the Operations Manager
- Given a new trip request is listed in the "Manual Dispatch" sub-menu.
- When an Operations Manager is logged into the dashops.
- Then a clear visual notification, such as a red dot, is displayed next to the "Manual Dispatch" sub-menu and on Business section to indicate a new, unassigned request.
- Scenario 3: Viewing and assigning a driver
- Given I am on the "Manual Dispatch" screen
- When I select an unassigned trip.
- Then I should see a duplicate of the trip details, including the rider's information and the destination, with the driver field left empty.
- And when I click on the driver input field, I should be able to input a driver phone number.
- Scenario 4: Assigning a trip to a driver which is on ongoing rides
- Given I inputted a valid driver’s phone number.
- When I confirm the assignment and the driver has already an ongoing ride.
- Then I should see an error informing me that the driver has already an ongoing ride.
- Scenario 4: Trip status update and driver notification
- Given I have successfully assigned a driver to a trip via manual dispatch.
- When I confirm the assignment.
- Then the trip status should automatically update from "Pending" to "Accepted."
- And the assigned driver should see the trip on their DriverApp with all the relevant trip information.
- Scenario 5: Post-Assignment Trip Management
- Given a driver has been manually assigned to a trip.
- When I view the trip in the "Manual Dispatch" screen.
- Then the trip should no longer be displayed in the list.
- And as an Operations Manager, I should no longer be able to manually change the trip's status or the assigned driver.

---

### CMB-34253: User cannot see trips; shows “Error fetching this list, please try again later”

**Status:** Done | **Priority:** P1 - High
**Created:** 2026-01-26

---

### CMB-10049: Number of Trips Limit Error 

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-10-26

**Description:**
As a Business Rider using the Yassir for Business platform, I want to receive an error message when I attempt to book a number of trips that exceeds the allowed limit per day, which is defined by the Business Account Manager (BAM) for my business account.

**Acceptance Criteria:**
- Scenario 1: Exceeding Allowed Daily Trips
- Given that I am a Business Rider using Yassir for Business,
- When I try to book trips that surpass the daily limit set by the BAM for my business account,
- Then I should receive an error message indicating that I've reached the daily limit for trip bookings.
- Scenario 2: Informative Error Message
- Given that I receive an error message due to reaching the daily trip limit,
- When I read the error message,
- Then it should clearly state that I cannot book additional trips on the same day due to the daily limit and provide guidance on the next steps.
- Scenario 3: Resolving the Issue
- Given that I've received the error message about reaching the daily limit,
- When I want to book more trips and believe it's necessary,
- Then I need to contact the BAM of my business profile to discuss the situation and potentially seek an increase in the daily limit or consider booking additional trips on the following day.

---

### CMB-13292: How to book Trips?

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

---

### CMB-13266: Schedule muliple trips per day 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

---

### CMB-1360: Dev BE: Listing Trips

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-18

**Description:**
As a business account manager, I need to be able to view all trips made in the company so that I can look for some trips details if needed

**Acceptance Criteria:**
- We need to find the Rider’s Name, Phone number, Email, Program Name, Pick up address, drop-off address, Cost, service type, time and Date, spending

---

### CMB-4178: Display ongoing trips

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-15

**Description:**
As a business account manager, I want to be able to view ongoing trips that have been booked from the web app, so that I can track the progress of these trips and ensure they are on schedule.

**Acceptance Criteria:**
- The user should be able to view trips that have been booked from the web app and not those booked from other sources.
- The ongoing Trip list must be updated every 40-45 secs
- The app should display the current location of the rider and the estimated time of arrival at the destination.
- The app should allow the user to view the route for the trip from pickup to destination.
- The app should display any updates to the estimated time of arrival as the trip progresses.
- The app should allow the user to view trip details, including pickup and destination points and Driver information.
- The app should see the Driver's Phone number
- Nice To Have: The Web App and the mobile app are synced with all the trip updates
- Driver information to be mentioned:
- Driver Name
- Driver Phone Number
- Pickup
- Destination
- Given the user has opened the app and is logged in as a business account manager,
- When the user has already an ongoing trip from the web app
- Then the app should display a screen where the user can view ongoing trips that have been requested from the web app and not those booked from other sources.
- Given the user has selected an ongoing trip,
- When the user views the trip route,
- Then the app should display the route for the ongoing trip from pickup to Destination
- When the user views the trip details,
- Then the app should display trip details, including pickup and destination points and Driver information.[Car Type, Phone number, Driver Name ]

---

### CMB-6187: Trip Queue 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-05-25

**Description:**
In the B2B Backend system, we want to listen to trips that have ended with the DRIVER_CANCELED

**Acceptance Criteria:**
- The B2B Backend should be able to listen to all trips with the
- NO_DRIVER_AVAILABLE
- DRIVER_COMING_CANCELED
- DRIVER_COMING_RIDER_CANCELED
- DRIVER_ARRIVED_CANCELED
- DRIVER_ARRIVED_RIDER_CANCELED
- BOOK_DECLINED
- A dedicated queue should be created to store these trips.
- The queue should contain relevant trip information such as the trip ID, Business Rider ID, and the payment amount.
- The backend system should be able to query the trip ID and retrieve the associated Business Rider and payment amount.
- The refunded amount should be added to the business budget.
- Scenario:
- Given that there is a b2b trip with the
- NO_DRIVER_AVAILABLE
- DRIVER_COMING_CANCELED
- DRIVER_COMING_RIDER_CANCELED
- DRIVER_ARRIVED_CANCELED
- DRIVER_ARRIVED_RIDER_CANCELED
- BOOK_DECLINED  status,
- When the trip ends and is marked with either of these statuses,
- Then the trip details should be added to the dedicated queue for further processing.
- And the B2B Backend should be able to retrieve the trip ID, Business Rider information, and payment amount from the queue. so the refund process can be initiated

---

### CMB-6737: Enterprise Trips Tab, Search, and Filter

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-06-20

**Description:**
As an Admin, I want to be able to filter and search trips on the enterprise details page, so that I can quickly find specific trips based on my desired criteria.

**Acceptance Criteria:**
- The Admin can apply filters to the trip list based on the selected start date and end date.
- The Admin can filter trips based on their status (e.g., pending, completed, Canceled (will include all canceled trips), ACCEPTED, DRIVER_ARRIVED, STARTED ).
- The Admin can search for trips by entering the rider's name or email in the search field.
- The Admin can search for trips by entering the trip ID in the search field.
- Admin Can apply more than one filter at the same time [Certain Date, Certain Status, then search among them]
- Given-When-Then Scenarios:
- Scenario 1: Admin applies filters by selecting a date range
- Given: Admin is on the trip list page
- When: Admin selects a start date and end date to filter the trips
- Then: Only the trips within the selected date range are displayed
- Scenario 2: Admin applies filters by selecting a trip status
- Given: Admin is on the trip list page
- When: Admin selects a specific trip status to filter the trips, or he can select more than one status
- Then: Only the trips with the selected status are displayed
- Scenario 3: Admin searches for trips by rider's name or email
- Given: Admin is on the trip list page
- When: Admin enters the rider's name or email in the search field
- Then: Only the trips associated with the entered rider's name or email are displayed
- Scenario 4: Admin searches for trips by trip ID
- Given: Admin is on the trip list page
- When: Admin enters the trip ID in the search field
- Then: The trip details matching the entered trip ID are displayed
- Scenario 5: Admin clears the applied filters
- Given: Admin is on the trip list page with applied filters
- When: Admin clicks on the "Clear Filters" button
- Then: All applied filters are cleared, and the full list of trips is displayed again.
- Scenario 6: Admin enters an invalid rider name or email in the search field
- Given: Admin is on the trip list page
- When: Admin enters an invalid or non-existent rider's name or email in the search field
- Then: No trips are displayed, and a message is shown indicating that no matching trips were found.
- Scenario 7: Admin enters an invalid trip ID in the search field
- Given: Admin is on the trip list page
- When: Admin enters an invalid or non-existent trip ID in the search field
- Then: No trip details are displayed, and a message is shown indicating that no matching trip was found.
- Scenario 8: Admin applies multiple filters together
- Given: Admin is on the trip list page
- When: Admin selects a trip status and enters a rider's name in the search field
- Then: Only the trips matching both the selected status and the rider's name are displayed.
- Scenario 9: Admin applies a filter and searches simultaneously
- Given: Admin is on the trip list page with a selected trip status
- When: Admin enters a rider's name in the search field
- Then: Only the trips matching both the selected status and the rider's name are displayed.

---

### CMB-9908: Export All Country B2B Trips 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-20

**Description:**
As an Operations (OP) Manager using the Admin Panel, I want the ability to export all trips created by businesses within a specific country over a defined duration, with a maximum limit of 31 days, so that I can analyze and manage trip data efficiently.

**Acceptance Criteria:**
- Scenario 1: Exporting All Trips for a Country Within a 31-Day Duration
- Given that I am an OP Manager using the Admin Panel,
- When I access the trip export feature,
- And I select a specific country from the available options,
- And I specify a duration of up to 31 days,
- Then I should be able to initiate the export process.
- Scenario 2: Receiving a CSV File with Comprehensive Trip Details
- Given that I have initiated the trip export process,
- When the export is complete,
- Then I should receive a CSV file containing comprehensive trip details, including but not limited to trip IDs, timestamps, starting and ending locations, rider and driver details, trip status, and pricing information, from all enterprises within the selected country.
- Scenario 3: Limiting Export Duration to 31 Days
- Given that I am specifying a duration for the trip export,
- When I enter a duration exceeding 31 days,
- Then the system should inform me that the duration exceeds the maximum allowed limit of 31 days and prompt me to adjust the duration accordingly.
- Scenario 1: Accessing the Country Configuration Settings Tab
- Given I am logged into the Admin panel as an Admin,
- When I navigate to the "Country Configuration Settings" tab,
- Then I should see options to export either the requested trips file or the finished trips file.
- Scenario 2: Exporting the Requested or Finished Trips File
- Given I am on the "Country Configuration Settings" tab,
- When I select the option to export either the requested trips file or the finished trips file,
- Then the system should generate the respective CSV file containing the details of the trips.
- Scenario 3: Receiving the Exported File on Slack
- Given I have successfully requested the export of the trips file (requested or finished),
- When the export process is completed,
- Then the CSV file should be sent directly to a pre-configured Slack channel or direct message for easy access.
- Scenario 4: Slack Notification for Export Failure
- Given there is an issue with exporting the trips file,
- When I click on the export button,
- Then I should receive an error message on Slack notifying me of the failure (e.g., "Export Failed: File generation error").
- Scenario 5: No Email Notification on Export Completion
- Given the trips file has been successfully exported,
- When the file is sent to Slack,
- Then I should not receive an email containing the exported file.
- Scenario 6: CSV File Format and Content
- Given the export has been successfully completed,
- When I receive the file on Slack,
- Then the file should be properly formatted as a CSV, and Excel Format and contain all relevant trip details, including trip ID, start and end locations, trip status, and any other necessary data.

---

### CMB-8918: Approving Trips for Riders

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-09-06

**Description:**
As a Business Account Manager (BAM), I want to be able to review and manage trips that are pending approval by Business Riders.

**Acceptance Criteria:**
- View List of Pending Trips:
- Given that I am logged into the BAM dashboard when I access the "Pending Trips" section,
- Then I should see a list of all trips that are currently pending approval.
- Trip Details:
- Given that I am viewing the list of pending trips,
- When I click on a specific trip entry,
- Then I should be able to view detailed information about that trip, including the rider's name, pickup and destination locations, requested time, and any relevant trip notes.
- Approve or Deny Trips:
- Given that I am viewing the details of a pending trip,
- When I review the trip information,
- Then I should have the option to either approve or deny the trip request.
- Provide Reason for Denial:
- Given that I choose to deny a trip,
- When I select the denial option,
- Then I should be prompted to provide a reason for the denial. This reason should be visible to the Business Rider.
- Confirmation Messages:
- Given that I approve or deny a trip,
- When my decision is processed,
- Then I should receive a confirmation message indicating the action was successful.
- Trip Status Update:
- When I make a decision,
- Then the trip status should be updated accordingly, and the Business Rider should be notified of the outcome.
- Scenario 1: Viewing List of Pending Trips
- Given: I am logged into the BAM dashboard.
- When: I access the "Pending Trips" section.
- Then: I should see a list of all trips that are currently pending approval.
- Scenario 2: Approving a Pending Trip
- Given: I am viewing the details of a pending trip.
- When: I review the trip information and choose to approve the trip.
- Then: The trip should be approved, and the Business Rider should be notified of the approval.
- Scenario 3: Denying a Pending Trip
- When: I review the trip information and choose to deny the trip.
- Then: I should be prompted to provide a reason for denial, and the Business Rider should be notified of the denial along with the provided reason.
- Scenario 4: Confirmation of Approval/Denial
- Given: I approve or deny a trip.
- When: My decision is processed.
- Then: I should receive a confirmation message indicating the action was successful.
- Scenario 5: Trip Status Update
- When: I make a decision.
- Then: The trip status should be updated accordingly, and the Business Rider should be notified of the outcome.
- Scenario 6: Valid Auto-Approval Time Limit
- Given I am configuring program settings,
- When I set the approval duration time limit to a value between 1 minute (minimum) and 60 minutes (maximum),
- Then the system should accept the defined time limit. and any trip will expire if it exceeds this time limit, with Rider Canceled status
- Scenario 1: Viewing Trip Details in the "All Trips" Section
- Given that I am logged into the Admin panel as an Ops Manager,
- When I navigate to the "All Trips" section,
- Then I should be able to see the following information for each trip:
- Rider Name
- Rider's Company (the company the Rider took the trip with)
- Guest Name (if applicable)
- Guest Phone Number (if applicable)
- Pickup and Destination locations
- Date and Hour of the trip  of requested at
- Trip ID
- Is booked
- Trip Price
- Budget before the trip
- Budget after the trip
- Trip Status (e.g., completed, canceled, pending)
- Refunded Status (if the trip has been refunded or not)
- Driver Phone Number
- Scenario 2: Viewing Trips with Guest Information
- Given that a Rider has booked a trip for a guest,
- When I view the trip details in the "All Trips" section,
- Then I should be able to see the guest’s name and phone number along with the Rider’s details for that trip.
- Scenario 3: Viewing and Tracking Budget Changes
- Given that I am viewing the trip details in the "All Trips" section,
- When I view the budget information for each trip,
- Then I should see:
- The budget amount before the trip
- The trip cost (Trip Price)
- The remaining budget after the trip (Budget after trip)
- Scenario 4: Viewing Refunded Trips
- Given that I am reviewing trip history in the "All Trips" section,
- When a trip has been refunded,
- Then the trip details should display whether the trip has been refunded and the amount refunded (if applicable).

---

### CMB-8914: Rider Can/ Cannot See Price when requesting trips from Mobile App 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-09-06

**Description:**
As a Business Rider, I want to be able to book trips from the mobile app.

**Acceptance Criteria:**
- The Business Rider can log in to the mobile app.
- If the Business Rider has the necessary permissions to view trip prices, they will see the trip price displayed when requesting (Instant, and scheduled requests)  a trip through the mobile app.
- If the Business Rider does not have permission to view trip prices, the trip price and estimation amount should be hidden during the trip request (Instant, and scheduled requests)  process in the mobile app.
- Regardless of the visibility of the trip price, the Business Rider should be able to successfully request (Instant, and scheduled requests)  trips through the mobile app.
- If the Business Rider is able to see the trip price, then when he clicks on the info icon, he needs to find the trip details including the price of the trip
- Scenarios:
- Scenario 1: Business Rider with Permission to View Trip Prices (Figma)
- Given: I am a Business Rider and I have the necessary permissions to view trip prices.
- When: I log in to the mobile app and proceed to book a trip.
- Then: I can see the trip price displayed during the booking process.
- And: I am able to confirm my trip booking with the visible price.
- Scenario 2: Business Rider without Permission to View Trip Prices (Figma)
- Given: I am a Business Rider, but I do not have permission to view trip prices.
- When: I log in to the mobile app and proceed to book a trip.
- Then: The trip price and estimation amount are hidden during the booking process.
- And: I am still able to successfully book trips through the mobile app, even though I cannot see the trip price.
- Scenario 3: Business Rider with Permission to View Trip Prices, clicking on the Info Icon (Figma)
- Given: I am a Business Rider, but I do not have permission to view trip prices.
- When: I log in to the mobile app and proceed to book a trip.
- Then: The trip price and estimation amount are hidden during the booking process.
- And: I am still able to successfully book trips through the mobile app, even though I cannot see the trip price.
- Note:
- Make sure to review the Price Estimation Issue
- The Attribute value is called: showPrice (boolean (true or false)), exists on the usersB2B collection

---

### CMB-10059: B2B Price Data on Dashops

**Status:** Done | **Priority:** No Priority
**Created:** 2023-10-26

**Description:**
As an Operations Manager (OPs Manager) using the DashOps platform, I want to access comprehensive price details for a B2B trip from the Trips tab.

**Acceptance Criteria:**
- From the Trips tab on the DashOps platform, the OPs Manager should be able to select a specific B2B trip to view its details.
- When viewing the trip details, a table should display the following price-related information:
- Base Cost
- Original Cost
- Estimated Cost
- Rider Pay
- Driver to Yassir
- Yassir to Driver
- Driver Benefit Net
- The table should also include information about discounts and payment methods:
- Discounted
- Coupon
- Payment Method
- Additionally, the table should provide data related to Yassir's commission and benefits:
- Yassir Commission
- Yassir Original Benefit
- Yassir Benefit Net Given-When-Then Scenarios:
- Scenario 1: Accessing Price Details for a B2B Trip
- Given: I am logged into the DashOps platform as an OPs Manager.
- When: I navigate to the Trips tab and select a specific B2B trip to view its details.
- Then: The platform displays a table with all the relevant price details, including base cost, original cost, estimated cost, rider pay, driver-to-Yassir, Yassir-to-driver, driver benefit net, discounted percentage, coupon details, payment method, Yassir commission percentage, Yassir original benefit, and Yassir benefit net.

---

### CMB-14042: Update Trips with 0 Cost

**Status:** Done | **Priority:** No Priority
**Created:** 2024-04-23

**Description:**
As an Admin on the Admin Panel, I need to be able to find all trips created on the old BtoB with the right amount consumed

**Acceptance Criteria:**
- Navigating to the Country Configuration System:
- Given that I am logged into the BtoB Admin panel,
- When I access the dashboard,
- Then I should locate and click on the "Country Configuration" tab from the navigation menu.
- Accessing Trip Export Options:
- Given that I have accessed the Country Configuration system,
- When I click on the "Trip Export" option,
- Then I should see a pop-up for choosing a date range.
- Choosing Date Range for Export:
- Given that I see the date range pop-up,
- When I am presented with options,
- Then I should have two options:
- Export requested trips within a chosen range.
- Export finished trips within a chosen range.
- Exporting Finished Trips:
- Given that I select the option to export finished trips within a chosen range,
- When I confirm the date range,
- Then I should receive a file containing all finished and adjusted trips within the selected range.
- The trip values must match the values in the invoices.
- Exporting Requested Trips:
- Given that I select the option to export requested trips within a chosen range,
- Then I should receive a file containing all trips created within the selected range regardless of whether they are finished or for any cancellation status, or scheduled.

---

### CMB-15416: Number of trips allowed per day, week, and month

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-06-11

**Description:**
As a Business Account Manager, Business Admin

**Acceptance Criteria:**
- Scenario 1: Setting Allowed Number of Trips:
- Given that I am logged into the Yassir for Business platform as a Business Account Manager,
- When I navigate to the program settings section,
- Then I should find an option to set the allowed number of trips for business riders.
- Scenario 2: Choosing Frequency and Limit:
- Given that I am on the program settings page,
- When I choose the frequency as "per week",
- Then I should be able to enter the allowed number of trips the user can take per week. and the slider should update its values accordingly:
- Min: 3, Max 50 Trips
- And when I choose the frequency as "per month",
- Then I should be able to enter the allowed number of trips the user can take per month. and the slider should update its values accordingly:
- Min: 10, Max 100 Trips
- And when I choose the frequency as "per day",
- Then I should be able to enter the allowed number of trips the user can take per day.
- the slider should update its values accordingly:
- Min: 1, Max 10 Trips
- Scenario 3: Saving Changes:
- Given that I have entered the allowed number of trips for business riders,
- When I have set the limits for any frequencies,
- Then I should be able to save these changes.
- The system should update the program settings accordingly.
- Scenario 4: Scheduled trips
- Given that I have Scheduled the trips on a certain date
- When the system checks the limit of the booked number of trips (Day, Week, Month)
- Then the system should check the date Planned for the trip
- Scenario 5: Error Screens
- Given that the user has exceeded the number of trips to be booked, or planned per (day, Week, or Month)
- When I click on the request Button
- Then I should get an error message informing me that I have exceeded my booking limit for that day
- Scenario 6: Unlimited number of trips enabled by default
- Given that as a BAM on the editing program screen, I try to change the allowed number of trips, I need to find a button (Checbox, or a Radio Button)
- When I check it
- Then I need it to be checked by default so that the users of this program can take an unlimited number of trips
- Scenario 7: Unlimited number of trip disabled
- Given that as a BAM on the editing program screen, I try to change the allowed number of trips, I need to find a button (Checbox, or a Radio Button)
- When I click on the button to make it disabled
- Then I should be able to change the number of trips sliders, to set a certain number of trips the users can take
- Note Week is defined based, on the following:
- Tunisia: Monday to Sunday
- Senegal: Monday to Sunday
- Algeria: Sunday, to Saturday
- Morocco: Sunday, to Saturday
- Note: We need to have a Google Analytics Event to be triggered in every time we choose one of the parameters:
- Day, Week, Month

---

### CMB-13253: Rebook from History List

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-03-20

**Description:**
As a Business Account Manager (BAM) using the Yassir for Business Web App, I want to have the ability to reorder historical trips easily.

**Acceptance Criteria:**
- Accessing Trip History List:
- Given that I am logged into the Yassir for Business Web App as a BAM,
- When I navigate to the trip history section,
- Then I should find a clear and intuitive interface displaying a list of historical trips.
- Locating Reorder Button:
- Upon viewing the trip history list,
- I should easily identify a "Reorder" button associated with each historical trip entry.
- Initiating Reorder Process:
- When I click on the "Reorder" button for a specific trip entry,
- Then I should be immediately redirected to the booking trip screen to initiate the reorder process.
- Pre-populated Information:
- Upon being redirected to the booking trip screen,
- I expect to see pre-populated information for the selected trip, including:
- The rider previously chosen for the trip.
- Pickup and destination fields already filled in based on the previous trip details.
- The service previously selected for the trip.
- Option to Request or Schedule Trip:
- When presented with the booking trip screen,
- I should be able to choose whether to request the trip immediately or schedule it for a later time.
- Handling Unavailable Services:
- If the service previously chosen for the trip is no longer available,
- The system should automatically select the first available service permitted for the user.
- Validation and Error Handling:
- The system should validate all pre-populated information to ensure accuracy and completeness.
- In case of any errors or missing information, appropriate error messages should be displayed, guiding me on how to proceed.
- Confirmation and Feedback:
- Upon successfully reordering the trip,
- I should receive a confirmation message confirming the reorder.
- The system should provide visual feedback to indicate that the reorder process was successful.

---

### CMB-20704: Website - Ride history : Empty state messages 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-15

**Description:**
As a B2C web app user,
I want to see appropriate messages and actions in the history tab

**Acceptance Criteria:**
- Scenario 1: Display "No Rides Message" in the "All" Tab
- Given the user has navigated to the history tab
- And the user has not taken any rides before
- When the user clicks on the "All" tab
- Then a message "No rides message" is displayed
- And a button "Request your first ride" is displayed.
- Scenario 2: Display "No Completed Rides" in the "Completed" Tab
- And the user has not completed any rides before
- When the user clicks on the "Completed" tab
- Then a message "No completed rides" is displayed
- And a button "Request ride" is displayed.
- Scenario 3: Display "No Scheduled Rides" in the "Scheduled" Tab
- And the user has not scheduled any rides before
- When the user clicks on the "Scheduled" tab
- Then a message "No scheduled rides" is displayed
- And a button "Schedule ride" is displayed.

---

### CMB-17507: Cancelation experience

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-09-02

**Description:**
As a rider, I should be allowed to cancel trips in the following cases

**Acceptance Criteria:**
- Searching for driver
- Driver assigned

---

### CMB-19800: Access trip details from Dashops for B2B trips for individual companies

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-11-19

**Description:**
As an admin on Dashops, I want to access detailed information for B2B trips

**Acceptance Criteria:**
- Scenario 1: Accessing trip details
- Given I am on the trips section,
- When I view the trip table,
- Then I should see a details button for each trip.
- Scenario 2: Displaying the trip details
- Given I am on the trips section,
- When I click the details button for a trip,
- Then I should be redirected to the trip details screen with all relevant trip information (trip details example).

---

### CMB-16673: Instant Trips On Web Portal  - OnRoad

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-07-31

**Description:**
As a rider, I should be allowed to request instant trips via portal so that I can book trips seamlessly

**Acceptance Criteria:**
- Scenario: Enable the Instant trip option on Web Portal
- Given I am on the Web Portal
- And I goto trip request page
- Then I should be able to see “Request now” button enabled
- Scenario: Searching for driver screen
- Given I am on the Estimation screen
- When I click on Request classic
- Then I should be able to see Searching for driver screen
- And it should have all the details in the screenshot below
- Looking for a driver header
- Itenary
- Price
- Help Center
- Cancel Trip option
- Need to have animation for the progress and search

---

### CMB-20874: Website - Mandatory Trip Rating/Review for Completed Rides

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-19

**Description:**
As a rider, in B2C WebApp,  when I complete a ride, I should be prompted to provide a mandatory rating or review. This can happen either via the "Home Screen" after completing the ride or on the "Ride History" or "Ride Details" pages. This ensures feedback is collected consistently for each trip.

**Acceptance Criteria:**
- Scenario 1: Rating a Completed Trip from the Home Screen
- Given
- I am a rider on the "Home Screen" ,
- When
- I have just completed a ride,
- Then
- I am redirected to the mandatory "Rate Your Trip" screen.
- When
- I provide a rating and submit,
- Then
- The rating is saved, and I am returned to the "Home Screen."
- Scenario 2: Rating a Completed Trip from the Ride History Page
- Given
- I am a rider on the "Ride History" page,
- I have a recently completed ride that was previously displayed as an "Ongoing Ride" widget,
- When
- The "Ongoing Ride" widget disappears after ride completion,
- Then
- I am redirected to the mandatory "Rate Your Trip" screen.
- When
- I provide a rating and submit,
- Then
- The rating is saved, and I am returned to the "Ride History" page.
- Scenario 3: Rating a Completed Trip from the Ride Details Page
- Given
- I am a rider on the "Ride Details" page for a recently completed trip,
- The trip was previously displayed as an "Ongoing Ride" widget,
- When
- The "Ongoing Ride" widget disappears after ride completion,
- Then
- I am redirected to the mandatory "Rate Your Trip" screen.
- When
- I provide a rating and submit,
- Then
- The rating is saved, and I am returned to the "Ride Details" page.
- Note :
- The rating process is mandatory and blocks further navigation until completed.

---

## Consolidated Acceptance Criteria

- Scenario 1: Trip is listed for manual dispatch
- Given a B2B trip is booked via the SuperApp or WebApp.
- When the trip remains unassigned after:
- 5 mins for production and pre-prod
- 3 minutes for staging
- Then a copy of the trip request is automatically listed in a new "Manual Dispatch" sub-menu on the Business section of the dashops.
- Scenario 2: Notification for the Operations Manager
- Given a new trip request is listed in the "Manual Dispatch" sub-menu.
- When an Operations Manager is logged into the dashops.
- Then a clear visual notification, such as a red dot, is displayed next to the "Manual Dispatch" sub-menu and on Business section to indicate a new, unassigned request.
- Scenario 3: Viewing and assigning a driver
- Given I am on the "Manual Dispatch" screen
- When I select an unassigned trip.
- Then I should see a duplicate of the trip details, including the rider's information and the destination, with the driver field left empty.
- And when I click on the driver input field, I should be able to input a driver phone number.
- Scenario 4: Assigning a trip to a driver which is on ongoing rides
- Given I inputted a valid driver’s phone number.
- When I confirm the assignment and the driver has already an ongoing ride.
- Then I should see an error informing me that the driver has already an ongoing ride.
- Scenario 4: Trip status update and driver notification
- Given I have successfully assigned a driver to a trip via manual dispatch.
- When I confirm the assignment.
- Then the trip status should automatically update from "Pending" to "Accepted."
- And the assigned driver should see the trip on their DriverApp with all the relevant trip information.
- Scenario 5: Post-Assignment Trip Management
- Given a driver has been manually assigned to a trip.
- When I view the trip in the "Manual Dispatch" screen.
- Then the trip should no longer be displayed in the list.
- And as an Operations Manager, I should no longer be able to manually change the trip's status or the assigned driver.
- Scenario 1: Exporting All Trips for a Country Within a 31-Day Duration
- Given that I am an OP Manager using the Admin Panel,
- When I access the trip export feature,
- And I select a specific country from the available options,
- And I specify a duration of up to 31 days,
- Then I should be able to initiate the export process.
- Scenario 2: Receiving a CSV File with Comprehensive Trip Details
- Given that I have initiated the trip export process,
- When the export is complete,
- Then I should receive a CSV file containing comprehensive trip details, including but not limited to trip IDs, timestamps, starting and ending locations, rider and driver details, trip status, and pricing information, from all enterprises within the selected country.
- Scenario 3: Limiting Export Duration to 31 Days
- Given that I am specifying a duration for the trip export,
- When I enter a duration exceeding 31 days,
- Then the system should inform me that the duration exceeds the maximum allowed limit of 31 days and prompt me to adjust the duration accordingly.
- Scenario 1: Accessing the Country Configuration Settings Tab
- Given I am logged into the Admin panel as an Admin,
- When I navigate to the "Country Configuration Settings" tab,
- Then I should see options to export either the requested trips file or the finished trips file.
- Scenario 2: Exporting the Requested or Finished Trips File
- Given I am on the "Country Configuration Settings" tab,
- When I select the option to export either the requested trips file or the finished trips file,
- Then the system should generate the respective CSV file containing the details of the trips.
- Scenario 3: Receiving the Exported File on Slack
- Given I have successfully requested the export of the trips file (requested or finished),
- When the export process is completed,
- Then the CSV file should be sent directly to a pre-configured Slack channel or direct message for easy access.
- Scenario 4: Slack Notification for Export Failure
- Given there is an issue with exporting the trips file,
- When I click on the export button,
- Then I should receive an error message on Slack notifying me of the failure (e.g., "Export Failed: File generation error").
- Scenario 5: No Email Notification on Export Completion
- Given the trips file has been successfully exported,
- When the file is sent to Slack,
- Then I should not receive an email containing the exported file.
- Scenario 6: CSV File Format and Content
- Given the export has been successfully completed,
- When I receive the file on Slack,
- Then the file should be properly formatted as a CSV, and Excel Format and contain all relevant trip details, including trip ID, start and end locations, trip status, and any other necessary data.
- The Business Account Manager should have access to the trip history list.
- The trip history list should include a search field for entering Rider Name.
- The Business Account Manager can enter the Rider’s Name in the search field.
- The trip history list should display only the trips that match the entered Rider Name.
- If no trips match the entered Rider Name, a message indicating no results should be displayed.
- Given-When-Then Scenarios:
- Scenario 1: Business Account Manager searches for trips by Rider Name
- Given: The Business Account Manager is on the trip history list.
- When: The Business Account Manager enters the Rider Name in the search field.
- Then: The trip history list updates dynamically, displaying only the trips made by the entered Rider Name.
- Scenario 2: Business Account Manager enters a partial Rider Name
- When: The Business Account Manager enters a partial Rider Name in the search field.
- Then: The trip history list updates dynamically, displaying only the trips that match the entered partial Rider Name.
- Scenario 3: Business Account Manager enters a full Rider Name
- When: The Business Account Manager enters a full Rider Name in the search field.
- Then: The trip history list updates dynamically, displaying only the trips that match the entered full Rider Name.
- Scenario 4: Business Account Manager enters a Rider Name with different case
- When: The Business Account Manager enters a Rider Name with different case (e.g., uppercase or lowercase) in the search field.
- Then: The search should be case-insensitive, and the trip history list updates dynamically, displaying the trips that match the entered Rider Name regardless of case.
- Scenario 5: Business Account Manager enters a Rider Name with no matching trips
- When: The Business Account Manager enters a Rider Name in the search field for which no matching trips exist.
- Then: A message indicating no results should be displayed, and the trip history list should be empty.
- Scenario 1: Exceeding Allowed Daily Trips
- Given that I am a Business Rider using Yassir for Business,
- When I try to book trips that surpass the daily limit set by the BAM for my business account,
- Then I should receive an error message indicating that I've reached the daily limit for trip bookings.
- Scenario 2: Informative Error Message
- Given that I receive an error message due to reaching the daily trip limit,
- When I read the error message,
- Then it should clearly state that I cannot book additional trips on the same day due to the daily limit and provide guidance on the next steps.
- Scenario 3: Resolving the Issue
- Given that I've received the error message about reaching the daily limit,
- When I want to book more trips and believe it's necessary,
- Then I need to contact the BAM of my business profile to discuss the situation and potentially seek an increase in the daily limit or consider booking additional trips on the following day.
- We need to find the Rider’s Name, Phone number, Email, Program Name, Pick up address, drop-off address, Cost, service type, time and Date, spending
- The user should be able to view trips that have been booked from the web app and not those booked from other sources.
- The ongoing Trip list must be updated every 40-45 secs
- The app should display the current location of the rider and the estimated time of arrival at the destination.
- The app should allow the user to view the route for the trip from pickup to destination.
- The app should display any updates to the estimated time of arrival as the trip progresses.
- The app should allow the user to view trip details, including pickup and destination points and Driver information.
- The app should see the Driver's Phone number
- Nice To Have: The Web App and the mobile app are synced with all the trip updates
- Driver information to be mentioned:
- Driver Name
- Driver Phone Number
- Pickup
- Destination
- Given the user has opened the app and is logged in as a business account manager,
- When the user has already an ongoing trip from the web app
- Then the app should display a screen where the user can view ongoing trips that have been requested from the web app and not those booked from other sources.
- Given the user has selected an ongoing trip,
- When the user views the trip route,
- Then the app should display the route for the ongoing trip from pickup to Destination
- When the user views the trip details,
- Then the app should display trip details, including pickup and destination points and Driver information.[Car Type, Phone number, Driver Name ]
- The B2B Backend should be able to listen to all trips with the
- NO_DRIVER_AVAILABLE
- DRIVER_COMING_CANCELED
- DRIVER_COMING_RIDER_CANCELED
- DRIVER_ARRIVED_CANCELED
- DRIVER_ARRIVED_RIDER_CANCELED
- BOOK_DECLINED
- A dedicated queue should be created to store these trips.
- The queue should contain relevant trip information such as the trip ID, Business Rider ID, and the payment amount.
- The backend system should be able to query the trip ID and retrieve the associated Business Rider and payment amount.
- The refunded amount should be added to the business budget.
- Scenario:
- Given that there is a b2b trip with the
- BOOK_DECLINED  status,
- When the trip ends and is marked with either of these statuses,
- Then the trip details should be added to the dedicated queue for further processing.
- And the B2B Backend should be able to retrieve the trip ID, Business Rider information, and payment amount from the queue. so the refund process can be initiated
- The Admin can apply filters to the trip list based on the selected start date and end date.
- The Admin can filter trips based on their status (e.g., pending, completed, Canceled (will include all canceled trips), ACCEPTED, DRIVER_ARRIVED, STARTED ).
- The Admin can search for trips by entering the rider's name or email in the search field.
- The Admin can search for trips by entering the trip ID in the search field.
- Admin Can apply more than one filter at the same time [Certain Date, Certain Status, then search among them]
- Scenario 1: Admin applies filters by selecting a date range
- Given: Admin is on the trip list page
- When: Admin selects a start date and end date to filter the trips
- Then: Only the trips within the selected date range are displayed
- Scenario 2: Admin applies filters by selecting a trip status
- When: Admin selects a specific trip status to filter the trips, or he can select more than one status
- Then: Only the trips with the selected status are displayed
- Scenario 3: Admin searches for trips by rider's name or email
- When: Admin enters the rider's name or email in the search field
- Then: Only the trips associated with the entered rider's name or email are displayed
- Scenario 4: Admin searches for trips by trip ID
- When: Admin enters the trip ID in the search field
- Then: The trip details matching the entered trip ID are displayed
- Scenario 5: Admin clears the applied filters
- Given: Admin is on the trip list page with applied filters
- When: Admin clicks on the "Clear Filters" button
- Then: All applied filters are cleared, and the full list of trips is displayed again.
- Scenario 6: Admin enters an invalid rider name or email in the search field
- When: Admin enters an invalid or non-existent rider's name or email in the search field
- Then: No trips are displayed, and a message is shown indicating that no matching trips were found.
- Scenario 7: Admin enters an invalid trip ID in the search field
- When: Admin enters an invalid or non-existent trip ID in the search field
- Then: No trip details are displayed, and a message is shown indicating that no matching trip was found.
- Scenario 8: Admin applies multiple filters together
- When: Admin selects a trip status and enters a rider's name in the search field
- Then: Only the trips matching both the selected status and the rider's name are displayed.
- Scenario 9: Admin applies a filter and searches simultaneously
- Given: Admin is on the trip list page with a selected trip status
- When: Admin enters a rider's name in the search field
- View List of Pending Trips:
- Given that I am logged into the BAM dashboard when I access the "Pending Trips" section,
- Then I should see a list of all trips that are currently pending approval.
- Trip Details:
- Given that I am viewing the list of pending trips,
- When I click on a specific trip entry,
- Then I should be able to view detailed information about that trip, including the rider's name, pickup and destination locations, requested time, and any relevant trip notes.
- Approve or Deny Trips:
- Given that I am viewing the details of a pending trip,
- When I review the trip information,
- Then I should have the option to either approve or deny the trip request.
- Provide Reason for Denial:
- Given that I choose to deny a trip,
- When I select the denial option,
- Then I should be prompted to provide a reason for the denial. This reason should be visible to the Business Rider.
- Confirmation Messages:
- Given that I approve or deny a trip,
- When my decision is processed,
- Then I should receive a confirmation message indicating the action was successful.
- Trip Status Update:
- When I make a decision,
- Then the trip status should be updated accordingly, and the Business Rider should be notified of the outcome.
- Scenario 1: Viewing List of Pending Trips
- Given: I am logged into the BAM dashboard.
- When: I access the "Pending Trips" section.
- Then: I should see a list of all trips that are currently pending approval.
- Scenario 2: Approving a Pending Trip
- Given: I am viewing the details of a pending trip.
- When: I review the trip information and choose to approve the trip.
- Then: The trip should be approved, and the Business Rider should be notified of the approval.
- Scenario 3: Denying a Pending Trip
- When: I review the trip information and choose to deny the trip.
- Then: I should be prompted to provide a reason for denial, and the Business Rider should be notified of the denial along with the provided reason.
- Scenario 4: Confirmation of Approval/Denial
- Given: I approve or deny a trip.
- When: My decision is processed.
- Then: I should receive a confirmation message indicating the action was successful.
- Scenario 5: Trip Status Update
- When: I make a decision.
- Then: The trip status should be updated accordingly, and the Business Rider should be notified of the outcome.
- Scenario 6: Valid Auto-Approval Time Limit
- Given I am configuring program settings,
- When I set the approval duration time limit to a value between 1 minute (minimum) and 60 minutes (maximum),
- Then the system should accept the defined time limit. and any trip will expire if it exceeds this time limit, with Rider Canceled status
- Scenario 1: Viewing Trip Details in the "All Trips" Section
- Given that I am logged into the Admin panel as an Ops Manager,
- When I navigate to the "All Trips" section,
- Then I should be able to see the following information for each trip:
- Rider Name
- Rider's Company (the company the Rider took the trip with)
- Guest Name (if applicable)
- Guest Phone Number (if applicable)
- Pickup and Destination locations
- Date and Hour of the trip  of requested at
- Trip ID
- Is booked
- Trip Price
- Budget before the trip
- Budget after the trip
- Trip Status (e.g., completed, canceled, pending)
- Refunded Status (if the trip has been refunded or not)
- Scenario 2: Viewing Trips with Guest Information
- Given that a Rider has booked a trip for a guest,
- When I view the trip details in the "All Trips" section,
- Then I should be able to see the guest’s name and phone number along with the Rider’s details for that trip.
- Scenario 3: Viewing and Tracking Budget Changes
- Given that I am viewing the trip details in the "All Trips" section,
- When I view the budget information for each trip,
- Then I should see:
- The budget amount before the trip
- The trip cost (Trip Price)
- The remaining budget after the trip (Budget after trip)
- Scenario 4: Viewing Refunded Trips
- Given that I am reviewing trip history in the "All Trips" section,
- When a trip has been refunded,
- Then the trip details should display whether the trip has been refunded and the amount refunded (if applicable).
- The Business Rider can log in to the mobile app.
- If the Business Rider has the necessary permissions to view trip prices, they will see the trip price displayed when requesting (Instant, and scheduled requests)  a trip through the mobile app.
- If the Business Rider does not have permission to view trip prices, the trip price and estimation amount should be hidden during the trip request (Instant, and scheduled requests)  process in the mobile app.
- Regardless of the visibility of the trip price, the Business Rider should be able to successfully request (Instant, and scheduled requests)  trips through the mobile app.
- If the Business Rider is able to see the trip price, then when he clicks on the info icon, he needs to find the trip details including the price of the trip
- Scenarios:
- Scenario 1: Business Rider with Permission to View Trip Prices (Figma)
- Given: I am a Business Rider and I have the necessary permissions to view trip prices.
- When: I log in to the mobile app and proceed to book a trip.
- Then: I can see the trip price displayed during the booking process.
- And: I am able to confirm my trip booking with the visible price.
- Scenario 2: Business Rider without Permission to View Trip Prices (Figma)
- Given: I am a Business Rider, but I do not have permission to view trip prices.
- Then: The trip price and estimation amount are hidden during the booking process.
- And: I am still able to successfully book trips through the mobile app, even though I cannot see the trip price.
- Scenario 3: Business Rider with Permission to View Trip Prices, clicking on the Info Icon (Figma)
- Note:
- Make sure to review the Price Estimation Issue
- The Attribute value is called: showPrice (boolean (true or false)), exists on the usersB2B collection
- From the Trips tab on the DashOps platform, the OPs Manager should be able to select a specific B2B trip to view its details.
- When viewing the trip details, a table should display the following price-related information:
- Base Cost
- Original Cost
- Estimated Cost
- Rider Pay
- Driver to Yassir
- Yassir to Driver
- Driver Benefit Net
- The table should also include information about discounts and payment methods:
- Discounted
- Coupon
- Payment Method
- Additionally, the table should provide data related to Yassir's commission and benefits:
- Yassir Commission
- Yassir Original Benefit
- Yassir Benefit Net Given-When-Then Scenarios:
- Scenario 1: Accessing Price Details for a B2B Trip
- Given: I am logged into the DashOps platform as an OPs Manager.
- When: I navigate to the Trips tab and select a specific B2B trip to view its details.
- Then: The platform displays a table with all the relevant price details, including base cost, original cost, estimated cost, rider pay, driver-to-Yassir, Yassir-to-driver, driver benefit net, discounted percentage, coupon details, payment method, Yassir commission percentage, Yassir original benefit, and Yassir benefit net.
- Navigating to the Country Configuration System:
- Given that I am logged into the BtoB Admin panel,
- When I access the dashboard,
- Then I should locate and click on the "Country Configuration" tab from the navigation menu.
- Accessing Trip Export Options:
- Given that I have accessed the Country Configuration system,
- When I click on the "Trip Export" option,
- Then I should see a pop-up for choosing a date range.
- Choosing Date Range for Export:
- Given that I see the date range pop-up,
- When I am presented with options,
- Then I should have two options:
- Export requested trips within a chosen range.
- Export finished trips within a chosen range.
- Exporting Finished Trips:
- Given that I select the option to export finished trips within a chosen range,
- When I confirm the date range,
- Then I should receive a file containing all finished and adjusted trips within the selected range.
- The trip values must match the values in the invoices.
- Exporting Requested Trips:
- Given that I select the option to export requested trips within a chosen range,
- Then I should receive a file containing all trips created within the selected range regardless of whether they are finished or for any cancellation status, or scheduled.
- Scenario 1: Setting Allowed Number of Trips:
- Given that I am logged into the Yassir for Business platform as a Business Account Manager,
- When I navigate to the program settings section,
- Then I should find an option to set the allowed number of trips for business riders.
- Scenario 2: Choosing Frequency and Limit:
- Given that I am on the program settings page,
- When I choose the frequency as "per week",
- Then I should be able to enter the allowed number of trips the user can take per week. and the slider should update its values accordingly:
- Min: 3, Max 50 Trips
- And when I choose the frequency as "per month",
- Then I should be able to enter the allowed number of trips the user can take per month. and the slider should update its values accordingly:
- Min: 10, Max 100 Trips
- And when I choose the frequency as "per day",
- Then I should be able to enter the allowed number of trips the user can take per day.
- the slider should update its values accordingly:
- Min: 1, Max 10 Trips
- Scenario 3: Saving Changes:
- Given that I have entered the allowed number of trips for business riders,
- When I have set the limits for any frequencies,
- Then I should be able to save these changes.
- The system should update the program settings accordingly.
- Scenario 4: Scheduled trips
- Given that I have Scheduled the trips on a certain date
- When the system checks the limit of the booked number of trips (Day, Week, Month)
- Then the system should check the date Planned for the trip
- Scenario 5: Error Screens
- Given that the user has exceeded the number of trips to be booked, or planned per (day, Week, or Month)
- When I click on the request Button
- Then I should get an error message informing me that I have exceeded my booking limit for that day
- Scenario 6: Unlimited number of trips enabled by default
- Given that as a BAM on the editing program screen, I try to change the allowed number of trips, I need to find a button (Checbox, or a Radio Button)
- When I check it
- Then I need it to be checked by default so that the users of this program can take an unlimited number of trips
- Scenario 7: Unlimited number of trip disabled
- When I click on the button to make it disabled
- Then I should be able to change the number of trips sliders, to set a certain number of trips the users can take
- Note Week is defined based, on the following:
- Tunisia: Monday to Sunday
- Senegal: Monday to Sunday
- Algeria: Sunday, to Saturday
- Morocco: Sunday, to Saturday
- Note: We need to have a Google Analytics Event to be triggered in every time we choose one of the parameters:
- Day, Week, Month
- Accessing Trip History List:
- Given that I am logged into the Yassir for Business Web App as a BAM,
- When I navigate to the trip history section,
- Then I should find a clear and intuitive interface displaying a list of historical trips.
- Locating Reorder Button:
- Upon viewing the trip history list,
- I should easily identify a "Reorder" button associated with each historical trip entry.
- Initiating Reorder Process:
- When I click on the "Reorder" button for a specific trip entry,
- Then I should be immediately redirected to the booking trip screen to initiate the reorder process.
- Pre-populated Information:
- Upon being redirected to the booking trip screen,
- I expect to see pre-populated information for the selected trip, including:
- The rider previously chosen for the trip.
- Pickup and destination fields already filled in based on the previous trip details.
- The service previously selected for the trip.
- Option to Request or Schedule Trip:
- When presented with the booking trip screen,
- I should be able to choose whether to request the trip immediately or schedule it for a later time.
- Handling Unavailable Services:
- If the service previously chosen for the trip is no longer available,
- The system should automatically select the first available service permitted for the user.
- Validation and Error Handling:
- The system should validate all pre-populated information to ensure accuracy and completeness.
- In case of any errors or missing information, appropriate error messages should be displayed, guiding me on how to proceed.
- Confirmation and Feedback:
- Upon successfully reordering the trip,
- I should receive a confirmation message confirming the reorder.
- The system should provide visual feedback to indicate that the reorder process was successful.
- Scenario 1: Display "No Rides Message" in the "All" Tab
- Given the user has navigated to the history tab
- And the user has not taken any rides before
- When the user clicks on the "All" tab
- Then a message "No rides message" is displayed
- And a button "Request your first ride" is displayed.
- Scenario 2: Display "No Completed Rides" in the "Completed" Tab
- And the user has not completed any rides before
- When the user clicks on the "Completed" tab
- Then a message "No completed rides" is displayed
- And a button "Request ride" is displayed.
- Scenario 3: Display "No Scheduled Rides" in the "Scheduled" Tab
- And the user has not scheduled any rides before
- When the user clicks on the "Scheduled" tab
- Then a message "No scheduled rides" is displayed
- And a button "Schedule ride" is displayed.
- Searching for driver
- Driver assigned
- Scenario 1: Accessing trip details
- Given I am on the trips section,
- When I view the trip table,
- Then I should see a details button for each trip.
- Scenario 2: Displaying the trip details
- When I click the details button for a trip,
- Then I should be redirected to the trip details screen with all relevant trip information (trip details example).
- Scenario: Enable the Instant trip option on Web Portal
- Given I am on the Web Portal
- And I goto trip request page
- Then I should be able to see “Request now” button enabled
- Scenario: Searching for driver screen
- Given I am on the Estimation screen
- When I click on Request classic
- Then I should be able to see Searching for driver screen
- And it should have all the details in the screenshot below
- Looking for a driver header
- Itenary
- Price
- Help Center
- Cancel Trip option
- Need to have animation for the progress and search
- Add relevant statuses in the trip status filter and them consistent in both webapp and admin panel
- Add Trip request expired and Trip request declined status in the trip status filter
- Remove unnecessary statuses like
- Rider Abandoned
- Driver Arrived Rider Cancelled (Not sure if rider can cancel the ride after driver has arrived) @@Ali Badawy
- Scenario 1: Rating a Completed Trip from the Home Screen
- Given
- I am a rider on the "Home Screen" ,
- When
- I have just completed a ride,
- Then
- I am redirected to the mandatory "Rate Your Trip" screen.
- I provide a rating and submit,
- The rating is saved, and I am returned to the "Home Screen."
- Scenario 2: Rating a Completed Trip from the Ride History Page
- I am a rider on the "Ride History" page,
- I have a recently completed ride that was previously displayed as an "Ongoing Ride" widget,
- The "Ongoing Ride" widget disappears after ride completion,
- The rating is saved, and I am returned to the "Ride History" page.
- Scenario 3: Rating a Completed Trip from the Ride Details Page
- I am a rider on the "Ride Details" page for a recently completed trip,
- The trip was previously displayed as an "Ongoing Ride" widget,
- The rating is saved, and I am returned to the "Ride Details" page.
- Note :
- The rating process is mandatory and blocks further navigation until completed.

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-20763: EDGE - WEBAPP - PROD : Include other statuses (ex: ADJUSTED) in the trips history on webApp and on the trips export file~~ → Replaced by CMB-34654
- ~~CMB-1366: Dev BE: Search Trips~~ → Replaced by CMB-23394
- ~~CMB-16273: Exporting trips update (Finished at trips, and Requested at trips)~~ → Replaced by CMB-14042
- ~~CMB-13102: Trips Screen Events~~ → Replaced by CMB-34654
- ~~CMB-18351: Review Riders Trips ~~ → Replaced by CMB-8918
- ~~CMB-19500: Export Trips File and Receive on Slack~~ → Replaced by CMB-9908
- ~~CMB-18397: Website - History~~ → Replaced by CMB-20704
- ~~CMB-20836: Website - Display Canceled Trips Only in "All" Tab on History Page~~ → Replaced by CMB-4178
