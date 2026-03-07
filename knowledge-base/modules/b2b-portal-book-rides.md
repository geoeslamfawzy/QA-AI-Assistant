---
id: "jira-b2b-portal-book-rides"
title: "B2B Portal — Book Rides"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","regression-testing"]
last_synced: "2025-11-05T13:17:25.048Z"
ticket_count: 35
active_ticket_count: 31
---

# B2B Portal — Book Rides

> Auto-generated from 35 Jira tickets.
> Last synced: 2025-11-05T13:17:25.048Z
> Active features: 31
> Superseded: 4

## User Stories

### CMB-29385: WebApp Ride Justification 

**Status:** Done | **Priority:** No Priority
**Created:** 2025-09-02

**Description:**
As a rider, I need to provide a reason for my trip when booking, so that my trip request is clear and provides my manager and other stakeholders with the necessary information to approve or review the ride.

**Acceptance Criteria:**
- Scenario 01: Entering trip justification
- Given I am a rider on the "Book a Ride" screen.
- When I am booking an instant or booked for later trip.
- Then a visible input field should be displayed, labeled "Ride Justification", it should have a character limit of 150 characters.
- Scenario 02: Justification is displayed on trips details
- Given I am a Business Admin, BAM, Program Moderator, a rider have submitted a trip with a justification.
- When I view the details screen for that trip.
- Then the justification text should be clearly displayed and remain unchanged.
- Scenario 03: Justification is visible to stakeholders
- Given a trip is not auto-dispatched.
- When a Business Account Manager (BAM), Business Administrator (BA), or Program Manager (PM) reviews the trip request on their dashboard.
- Then the ride justification text should be prominently displayed in the trip request details.

---

### CMB-28700: [E2E Test] Book Rides - P1

**Status:** Done | **Priority:** No Priority
**Created:** 2025-08-12

---

### CMB-26870: B2C-Boost ride on web

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-06-25

**Description:**
As a Yassir web user, I want to be able to add a customizable monetary boost to my ride request when drivers are hard to find, so that I can increase my chances of getting a driver quickly and improve the reliability of finding a ride through the web application.

**Acceptance Criteria:**
- Scenario 1: Activating the Boost Feature and Selecting an Amount
- Given I am on the Yassir Web App, I have requested a trip
- When I see and click on the "Boost" button displayed on the estimation screen.
- Then a pop-up appears, presenting suggested boost amounts like "100 DA", "200 DA", "500 DA".
- And I see an additional option: "Custom” to add the amount I want.
- When I either select a suggested amount (e.g., "200 DA") OR I click "Custom" and enter a custom amount (e.g., "350 DA") into a new field.
- And I click a "Confirm" button.
- Then the chosen boost amount is immediately displayed on my trip details screen, and the estimated fare reflects this addition.
- Scenario 2: Modifying the Boost Amount After Initial Selection
- Given I have already added a boost amount to my current trip request, and it is displayed on the trip details screen.
- When I click on the associated "Modify" button.
- Then the boost amount selection interface reappears.
- When I select a new amount or enter a different custom amount.
- And I click "Confirm".
- Then the boost amount displayed on my trip details screen updates to the new amount, and the estimated fare adjusts accordingly.
- Scenario 3: Boost Deactivation When Changing Trip Service to Premium or for reservations
- Given I have an active boost added to my trip request.
- When I attempt to change the selected trip service (Premium) or for a booked trip
- Then, a pop-up message appears saying, "The boost feature is unavailable” or “Boost not allowed for reservations”
- And I am given two options: "Continue" and "Cancel".
- When I choose "Continue".
- Then the boost is removed from my trip request, and the service change proceeds.
- When I choose "Cancel".
- Then the service change is aborted, and the boost remains active on my original trip request.
- Scenario 4: Error handling for custom amount
- Given I select “Custom” to add the boost amount
- And I entered an amount that exceeds the price limit
- Then an error message is displayed “The amount must be between 50 and 200
- Scenario 5: Viewing the Boost Amount in Trip History
- Given I have completed a trip where a "Boost" was successfully applied.
- When I navigate to the "Trip History" section on the Yassir Web App.
- And I click on that specific completed trip to view its detailed price breakdown.
- Then I should clearly see a separate line item within the price details indicating "Boost Amount: +X DA", where X is the amount I added.
- Scenario 6: Boost feature when booking a trip for later
- Given I am on the Yassir Web App
- When I select my pickup and destination
- And select “Add date”  to schedule a trip
- Then the boost feature should be disabled in the trip request screen

---

### CMB-25981: Multi-stops for Yassir Webapp

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-05-26

**Description:**
As a Yassir user using the Yassir service from the webapp, I want to have the ability to add multiple Intermediate points to a trip.

**Acceptance Criteria:**
- Scenario 1: Adding Multiple stops
- Given that I am logged into the Yassir webapp,
- When I initiate the process of booking a trip,
- Then I should find an option to add multiple destinations to the trip.
- Scenario 2: Number of Stops Limitation
- Given I am a Yassir Webapp user of a multistop trip
- When I’m adding the multi-stops,
- Then I should find the plus button disabled when reaching out to a number of intermediate stops that hit the limit of the number of stops -Which is 2- we can book, based on the multi-stops configurations
- Scenario 3: Calculation of Total Trip Cost
- Given that I have added multiple destinations to the trip,
- When I finalize the selection of locations,
- Then the system should calculate the total trip cost, considering all stops in the journey.
- How the ride cost is calculated in B2C:
- We consider the path between each of the two stops as a sub-trip, for example, a ride with 3 stops in between, then that means you have the following sub-trips:
- Pickup to stop 1.
- Stop 1 to Stop 2
- stop 3 to the final destination, each of those sub-trips is considered as a separate trip when it comes to pricing, so we calculate the pricing separately, and then we sum the price of all of them, then we check if eligible applied coupons or reductions.
- Scenario 4: Rearranging Stops
- Given that I have added multiple destinations to the trip,
- When reviewing the trip, the trip entered points
- Then I should have the option to rearrange the sequence of stops as needed.
- Scenario 5: Trip Confirmation Screen
- Given that I have added multiple destinations to the trip,
- When I proceed to request the trip,
- Then the trip confirmation screen should display all stops in the journey, providing a clear overview before confirming the booking.
- Scenario 6: Ongoing ride
- Given Yassir Webapp user of a multistop trip
- When I’m taking a multi-stop ride
- Then the trip with all the stops should be displayed on trip details and the trip map
- Scenario 7: If the trip stopped at an intermediate stop
- Given that I am a rider on a multi-stop trip
- When the trip finished at an intermediate stop
- Then I should see a pop-up displayed “Your ride has ended at stop 1. The updated trip price is 840 DZD”.
- Then I need to get a refund for the rest of the cost of the trip based on the new estimated cost value, the initially estimated cost value
- Scenario 8: Multi-stops in trip history
- Given Yassir Webapp user of a multistop trip
- When I navigate to the ride history
- Then I should have the stops included in the trip history screen
- And if the trip ends at one of the stops,
- Then the other stops should be struck-through

---

### CMB-26365: Book a ride for someone else

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-06-10

**Description:**
As a Yassir web user, I want to have the ability to book instant rides for my family or friends and have them receive all the ride and tracking details, so that I can help arrange their transportation conveniently, even if they don't use the Yassir app themselves.

**Acceptance Criteria:**
- Scenario 1: Book for someone else
- Given I am taking a ride on the Yassir webapp
- When I select my pick-up location
- And pick-up location is not my current address
- Then a pop-up is displayed showing “Is this ride for someone else?”
- If I am taking a ride for someone else
- Then I should select the guest user from the list or add a new one manually
- If I select a user from the list
- Then the ride is added to this guest user
- And the guest user will get an SMS with all the ride details
- If I select “Myself”
- Then I should be redirected to the booking screen to finish my booking
- If I click on the “Someone else” button
- Then I should add a new guest manually
- Scenario 2: Adding a new guest user manually
- Given I am on the Yassie webapp screen
- When I select the ride “ Book for someone else”
- Then a pop-up is displayed with input fields:
- First name
- Last time
- Guest Phone number
- When I click on “Add rider”
- Then the ride is booked for this rider and the rider is added to the list
- Scenario 3: Guest SMS message
- Given that I requested a ride for a guest user
- When I click on confirm
- Then the guest user should get an SMS with all the trip details that include:
- Driver details (car type, license plate).
- Estimated Time of Arrival (ETA).
- Trip price (ex: 1061 DA (espèces))
- Scenario 4: Booked for someone else’s trip in the driver screen
- Given I booked a trip for someone else (Guest user)
- Then on the driver screen and ride history, the contact name (Guest user) should be displayed

---

### CMB-21768: Multi-stops trips refund

**Status:** Done | **Priority:** No Priority
**Created:** 2025-01-20

**Description:**
As a Business Rider on a multi-stop trip

**Acceptance Criteria:**
- Scenario 1: Early Termination on an Intermediate Stop (Refund Calculation)
- Given I am a Business Rider on a multi-stop trip,
- When the trip concludes at an intermediate stop (i.e., the rider does not complete all planned stops),
- Then the system should:
- Recalculate the final cost based on the distance/time traveled up to that intermediate stop,
- Refund the difference between the initially estimated cost and the new adjusted cost,
- Reflect this partial refund in the rider’s budget or payment account.

---

### CMB-23145: Trip details at an intermediate stop

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-02-25

**Description:**
As a rider, I want my trip history to clearly indicate when a multi-stop trip ended at an intermediate stop, rather than the originally planned final destination so that the rider has a clear trip history for his trip.

**Acceptance Criteria:**
- Scenario 1: Accessing Trip History
- Given that I am logged into the Yassir for Business platform,
- When I navigate to the trip history screen,
- Then I should be able to access a list of all past trips.
- Scenario 2: Viewing Multi-Stop Trips
- Given that I am on the trip history screen,
- When I select a multi-stop trip from the list,
- Then I should see all stops entered for that trip displayed sequentially.
- Scenario 3: If the trip stopped at an intermediate stop
- Given that I am on the trip history screen,
- If I ended a trip in one of the multi-stops
- Then the other stops should be strikethrough
- And a tag showing the Final stop
- And  I need to get a refund, for the rest of the cost of the trip based on the new estimated cost value - the initially estimated cost value
- Scenario 4: Multi-stops display on the map
- Given that the user can see the map
- If the user ends the trip in one of the stops
- Then it should be displayed and showed on the map

---

### CMB-21769: Multi-stop File export

**Status:** Done | **Priority:** No Priority
**Created:** 2025-01-20

**Description:**
As an Admin/BAM who needs to export trip data,

**Acceptance Criteria:**
- Scenario 1: Exporting Multi-Stop Trip Data (Admin/BAM)
- Given I am an Admin on the Admin panel or a Business Account Manager,
- When I export a list of trips (e.g., via a CSV file or similar format),
- Then the exported file should:
- Indicate whether each trip has multiple stops (a flag or indicator for multi-stop trips),
- Include additional columns for each intermediate stop (e.g., “Intermediate Stop #1,” “Intermediate Stop #2,” etc.),
- Capture details for each stop (location or name) so the trip route is fully documented.

---

### CMB-13269: Multi-Stops displayed as a history trip

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

**Description:**
As a Business Account Manager using the Yassir for Business platform, I need to view detailed trip information, including multi-stop trips, on the trip history screen. This feature enables me to track and review all stops entered for each trip.

**Acceptance Criteria:**
- Scenario 1: Accessing Trip History
- Given that I am logged into the Yassir for Business platform,
- When I navigate to the trip history screen,
- Then I should be able to access a list of all past trips.
- Scenario 2: Viewing Multi-Stop Trips
- Given that I am on the trip history screen,
- When I select a multi-stop trip from the list,
- Then I should see all stops entered for that trip displayed sequentially.
- Scenario 3: Displaying All Stops
- Given that I am viewing a multi-stop trip,
- When I review the trip details,
- Then I should find all stops, including pickup and destination points, listed in chronological order.

---

### CMB-5237: Display Ongoing Trip Details

**Status:** Done | **Priority:** No Priority
**Created:** 2023-04-25

**Description:**
As a Business Account Manager (BAM), when I am on the Book Rider screen, I want to be able to view detailed information about an ongoing trip by clicking on a "See Details" button, so that I can get insights into the driver's details, trip status, map, service type, trip cost, rider information, pickup and destination details, date and time, and ETA to drop off.

**Acceptance Criteria:**
- The Book Rider screen should display a list of ongoing trips.
- Each ongoing trip should have a "See Details" button.
- Clicking on the "See Details" button should display the following information:
- Driver details: name, phone number, car model, car color, and car plate number.
- Trip status: ongoing, or searching for a driver.
- Map: showing the route between the pickup and drop-off locations.
- The service type is chosen and the trip cost is.
- Rider information: name and phone number.
- Trip details: pickup and destination written.
- Date and time of the trip.
- ETA to drop off.
- Scenario 1: Viewing ongoing trip details
- Given that I am a BAM on the Book Rider screen,
- When I click on the "See Details" button for an ongoing trip,
- Then I should be able to view detailed information about the trip, including driver details, trip status, map, service type, trip cost, rider information, pickup and destination details, date and time, and ETA to drop off.
- Scenario 2: Viewing trip details for a trip in "searching for a driver" status
- Given that I am a BAM on the Book Rider screen,
- When I click on the "See Details" button for a trip that is in "searching for a driver" status,
- Then I should be able to view detailed information about the trip, excluding driver details (as the driver has not been assigned yet), but including trip status, map, service type, trip cost, rider information, pickup and destination details, date and time, and ETA to drop off (if available).

---

### CMB-1645: iOS - Dev App- Trip Estimation (Listing Services)

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-11-03

**Description:**
As a logged in or signed up business account Rider, I want to be able to choose what kind of trips I need to request (Business or Personal Trip), so that I can find all family services allowed and all parameters for booking the trips applied

**Acceptance Criteria:**
- User Can’t apply Promo Codes on Business Trips
- User can’t activate the business account outside the allowed time
- User can’t book a trip without the predefined pickup and drop off destination
- User can’t book a trip using a different allowed service
- User will need to pay the extra amount of money in case he has exceeded the spending allowance per trip
- User can instantly book the trip, or schedule the trip within the allowed time pickup time

---

### CMB-5457: Trip Status Booking from Business Web App

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-05-02

**Description:**
As a business account manager, I want to be able to view and track the status of a trip request on the Yassir Go for B2B web app, so that I can monitor the progress of the trip and ensure a smooth ride experience for my riders.

**Acceptance Criteria:**
- The business account manager should be able to see the trip status in real-time and track any changes that occur during the trip.
- The following trip statuses should be displayed:
- Pending:
- DRIVER_CANCELED_TIMEOUT
- DRIVER_CANCELED
- Pending
- ACCEPTED:
- DRIVER_ARRIVED
- STARTED
- Completed:
- Finished
- Canceled:
- RIDER_CANCELED
- NO_DRIVER_AVAILABLE
- DRIVER_COMING_CANCELED
- DRIVER_COMING_RIDER_CANCELED
- DRIVER_ARRIVED_CANCELED
- DRIVER_ARRIVED_RIDER_CANCELED
- For Canceled Trips and Completed Trips, they need to stay on the list for 45 Sec to 1:30, then they will be removed and will be only visible on the trip history table.
- The business account manager should also be able to view the trip history in the finished trip table, which includes its status
- The trip history table will include all booked trips from Mobile App, and Web App
- Given-When-Then Scenarios:
- Scenario 1: Viewing Trip Status in Real Time
- Given: A Business Account Manager has logged into the Yassir Go for B2B platform and submitted a trip request.
- When: The trip is in progress.
- Then: The Business Account Manager can view the real-time status update of the trip.
- Scenario 2: Displaying Trip as "Pending"
- Given: A trip has been requested by a Business Account Manager and is awaiting a driver.
- When: The s trip status is: PENDING, DRIVER_CANCELED_TIMEOUT, DRIVER_CANCELED, Pending
- Then: The trip status is displayed as "Pending".
- Scenario 3: Displaying Trip as "Accepted:
- Given: A driver has accepted the trip request
- When the s trip status is: ACCEPTED
- Then: The trip status is displayed as "ACCEPTED".
- Scenario 4: Displaying Trip as "Started:
- When the s trip status is: STARTED
- Then: The trip status is displayed as "STARTED".
- Scenario 5: Displaying Trip as "Cancelled"
- Given: The trip has been canceled by the rider, driver, or Yassir Go for the B2B platform as NDA.
- When:  the s trip status is: RIDER_CANCELED, NO_DRIVER_AVAILABLE, DRIVER_COMING_CANCELED, DRIVER_COMING_RIDER_CANCELED, DRIVER_ARRIVED_CANCELED, DRIVER_ARRIVED_RIDER_CANCELED
- Then: The trip status is displayed as "Cancelled". for one minute
- Scenario 6: Displaying Trip as "Completed"
- Given: The trip has been successfully completed.
- When: the s trip status is: FINISHED
- Then: The trip status is displayed as "Completed".
- Scenario 7: Listing Completed/ Canceled Trip for 45 Sec to 1:30 min
- Given: The trip has been successfully completed, or canceled, at the last minute
- When: the s trip status is listed on the ongoing trip list
- Then: The trip will be displayed for 45 Sec to 1:30 minutes only, then it will be pushed to the trips history table
- Given that I am designing the booking API,
- When I receive a request with the following inputs:
- Time and Date of the Trip
- Pickup Location and Destination
- If it’s a departure trip the destination is the Airport
- If it’s an arrival trip the the pickup is at the airport
- Rider Name
- Rider Phone Number (Phone number can be from anywhere)
- Rider Email as optional input
- As we have one client only with one service:
- Company ID (Will Be on the Company itself, already defined we don't need to receive it from the client)
- Service ID (Will Be on the Company itself, already defined we don't need to receive it from the client)
- Then the API should validate the inputs and ensure that all required fields are provided.
- If any required fields are missing or invalid, the API should respond with an appropriate error message.
- If the company has a sufficient budget for the trip, the API should deduct the trip amount from the company's budget.
- The API should create a trip booking for the specified company, with the details provided in the request.
- The booking should be made for later and should reflect in the Dashops Admin Panel as a BtoB Trip under the company's name and the name of the Business Account Manager (BAM) associated with the company.
- The trip should also appear in the BtoB Admin Panel as a Guest Trip and in the Client Web Portal as a Guest Trip.
- The API should handle any failures gracefully, such as insufficient budget, incorrect time and date format, or missing data, and respond with appropriate error messages.
- Pickup Location, Destination Errors
- Data and Time Errors (Based on service Limitations)
- Budget Errors
- The API should provide a successful response with the trip details, including the trip ID, once the booking is successfully completed.

---

### CMB-559: Dev BE: Listing Service

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-09-06

**Description:**
As a logged in or signed up business account Rider, I want to be able to choose what kind of trips I need to request (Business or Personal Trip), so that I can find all family services allowed and all parameters for booking the trips applied

**Acceptance Criteria:**
- User Can’t apply Promo Codes on Business Trips
- User can’t activate the business account outside the allowed time
- User can’t book a trip without the predefined pickup and drop off destination
- User can’t book a trip using a different allowed service
- User will need to pay the extra amount of money in case he has exceeded the spending allowance per trip
- User can instantly book the trip, or schedule the trip within the allowed time pickup time

---

### CMB-9902: Booking Trips/ Trips Listing/ Contact Support/ Payment/ Profile Section On Mobile

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-20

**Description:**
As a Business Account Manager (BAM), I want the Booking Trips, Trips Listing, Contact Support, Payment, and Profile sections of the web app to be fully responsive on mobile devices.

**Acceptance Criteria:**
- Given I am a BAM using the web app on my mobile device,
- When I access the Booking Trips, Trips Listing, Contact Support, Payment, or Profile sections,
- Then these sections should be responsive, fitting the mobile screen size, and allowing me to perform tasks smoothly.
- Scenario 1: Accessing Booking Trips on Mobile
- Given I am a BAM using the web app on my mobile device,
- When I navigate to the Booking Trips section,
- Then this section should display correctly on my mobile screen, enabling me to book trips for myself or others without any usability issues.
- Scenario 2: Accessing Trips Listing on Mobile
- Given I am a BAM using the web app on my mobile device,
- When I access the Trips Listing section,
- Then the section should be responsive on my mobile screen, presenting trip listings in an organized and user-friendly manner.
- Scenario 3: Contacting Support on Mobile
- Given I am a BAM using the web app on my mobile device,
- When I need to contact support from the Contact Support section,
- Then the Contact Support section should be fully responsive, allowing me to access support information and contact details seamlessly on my mobile phone.
- Scenario 4: Managing Payments on Mobile
- Given I am a BAM using the web app on my mobile device,
- When I navigate to the Payment section to review or make payments,
- Then the Payment section should be responsive on my mobile screen, enabling me to manage payments without any glitches.
- Scenario 5: Accessing Profile Section on Mobile
- Given I am a BAM using the web app on my mobile device,
- When I access the Profile section to review or edit my personal information,
- Then the Profile section should be responsive, allowing me to conveniently view and edit my profile details from my mobile phone.
- Scenario 6: Viewing Trips Listing and Exporting Trips on Mobile
- Given I am using the Trips Listing section on my mobile device,
- When I need to export trips or view trip details,
- Then the Trips Listing section should remain responsive, ensuring that I can view and export trip data without experiencing any issues on my mobile phone.

---

### CMB-10383: Enable trips scheduling before trip estimation

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-11-07

**Description:**
As a Business Account Manager (BAM), I want the ability to enable the trip-scheduling feature before listing estimated services for the trip, so I can book scheduled trips even if they are outside the allowed hours or days of booking.

**Acceptance Criteria:**
- The BAM should have an option to enable the trip-scheduling feature in the settings.
- When the trip-scheduling feature is enabled, the BAM should be able to schedule trips for riders even if they fall outside the allowed hours or days of booking.
- The BAM should have access to inflation values for trip estimation when confirming the booking of a trip.
- Scenario 1: Enabling Scheduled Trips Toggle
- Given: I am on the "Book Rides" screen, And: I have entered the pickup and destination locations. And: I have selected a user for the trip., All program location checks are completed.
- When: I look for the "Scheduled Trips" toggle.
- Then: I should find the "Scheduled Trips" toggle on the screen.
- Scenario 2: Enabling Scheduled Trips Outside Allowed Hours/Days
- Given: I am on the "Book Rides" screen, And: I have entered the pickup and destination locations, And: I have selected a user for the trip,: All program location checks are completed, And: The "Scheduled Trips" toggle is enabled.
- When: I attempt to schedule a trip while I’m outside the allowed hours or days.
- Then: The system should allow me to schedule the trip, regardless of the time or day restrictions.
- Scenario 3: Enabling Scheduled Trips Outside Allowed Hours/Days
- Given: I am on the "Book Rides" screen, And: I have entered the pickup and destination locations, And: I have selected a user for the trip,: All program location checks are completed, And: The "Scheduled Trips" toggle is enabled.
- When: I attempt to schedule a trip falls outside the allowed hours or days.
- Then: The system must not allow me to schedule the trip, Because of the time or day restrictions.
- Scenario 4: Estimated Trip Cost with Inflation Rates
- Given: I am on the "Book Rides" screen, And: I have, entered the pickup and destination locations, And: I have selected a user for the trip, And: All program location checks are completed, And: The "Scheduled Trips" toggle is enabled.
- When: I review the estimated trip cost.
- Then: The estimated trip cost should accurately reflect the inflation rates applied to scheduled trips.

---

### CMB-6652: Choose Family Service 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-06-14

**Description:**
As a business account manager, I want to be able to select a family service when booking a trip, so that I can view and choose from a filtered list of business services within that family service.

**Acceptance Criteria:**
- The business account manager is on the booking trip screen.
- The manager enters the pickup location and drop-off location for the trip.
- A drop-down menu or a list of family services is displayed for selection.
- Only family services that contain at least one business service are included in the drop-down menu or list.
- The manager can choose a family service from the filtered options.
- Once a family service is selected, the list of available services should be dynamically updated to only show business services within the chosen family service.
- Scenarios:
- Scenario 1: Selecting a Family Service and Viewing Business Services
- Given a business account manager on the booking trip screen
- When the manager enters the pickup and drop-off locations
- Then a drop-down menu or a list of family services is displayed
- And only family services with at least one business service are included in the options
- Scenario 2: Choosing a Family Service and Updating the Service List
- Given a business account manager on the booking trip screen
- When the manager enters the pickup and drop-off locations
- And a drop-down menu or a list of family services is displayed
- And only family services with at least one business service are included in the options
- Then the manager can choose a family service from the filtered options
- And the list of available services should be dynamically updated to only show business services within the chosen family service

---

### CMB-10053: Service Available Error 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-26

**Description:**
As a Business Rider using the Yassir Go for Business platform, I want to be informed when there are no services available for booking a trip.

**Acceptance Criteria:**
- Scenario 1: No Services Assigned to the Program
- Given I am a Business Rider using Yassir for Business,
- When I attempt to book a trip and no services have been assigned to my business program,
- Then I should receive a message informing me that no services are available and that I need to contact my Business Account Manager for further assistance.
- Scenario 2: Services Not Available in Geographic Location
- Given I am a Business Rider using Yassir for Business,
- When I try to book a trip, and the services assigned to my program do not operate in my current geographic location,
- Then I should find a message indicating that no service is available in my area, along with guidance to contact my Business Account Manager or select a different location if applicable.

---

### CMB-15642: Rides Activity

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-06-25

**Description:**
As a rider, when i am on the Web Portal and I click on Ride History, I should be able to see my trip activity so that I can see my current and past bookings

---

### CMB-13199: Add Date and Time Screen

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-18

**Description:**
As a rider, I should be able to add date and time so that I can schedule bookings in advance.

---

### CMB-13179: Ride details - Page header

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-15

**Description:**
As a rider, I should be able to book rides on the Booking page after successfully logging in to the Yassir account.

**Acceptance Criteria:**
- Yassir Banner
- Home Page tab
- Ride History tab
- Ride details section with Pick up, drop off sections
- Map view
- Estimation Page with service types
- Add date option

---

### CMB-19895: [Website] - Show the booking calendar in arabic language same as other languages ( from left to right )

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-20

**Description:**
- As a B2C user, im using the arabic language, when i try to book a ride, the calendar should be displayed just like it’s displayed in other languages, date section on the  left and time section on the right

**Acceptance Criteria:**
- As a B2C user, im using the arabic language, when i try to book a ride, the calendar should be displayed just like it’s displayed in other languages, date section on the  left and time section on the right

---

### CMB-19894: [Website] - Make the time appearing greyed before and after the service ( booking range ) 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-20

**Description:**
- As a B2c user, when I try to book a ride, and I am in the time/date component, I should see the time that doesn’t fall within the service selected booking range as greyed out, just like in the choosing date case.

**Acceptance Criteria:**
- As a B2c user, when I try to book a ride, and I am in the time/date component, I should see the time that doesn’t fall within the service selected booking range as greyed out, just like in the choosing date case.

---

### CMB-20550: Website - Notify Rider of No Nearby Drivers When Not on Ride Request Screen

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-10

**Description:**
As a rider, when there are no nearby drivers available and I am not on the"Ride History" or "Ride Details" pages, I should receive a popup notification informing me that no drivers are nearby. This ensures I am aware of the unavailability of drivers, even if I navigate away from the ride request screen.

**Acceptance Criteria:**
- No Nearby Driver - Redirect to Home Screen
- Given I’m a website rider,
- When I’m on the "Ride History" or "Ride Details" page and there is no nearby driver available,
- Then I should see a "No Nearby Driver" pop-up.
- When I click on the "Try Again" button on the pop-up,
- Then I should be redirected to the Home screen to attempt booking again.

---

### CMB-21433: GA Rebooking Trips on the WebApp

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-01-09

**Description:**
As a product analyst,
I want to track Google Analytics (GA) events for key rebooking actions on the WebApp,

---

### CMB-19596: Integration between Yaweb and B2C

**Status:** Done | **Priority:** No Priority
**Created:** 2024-11-13

**Description:**
Requesting rides form the Ya Web website and navigates to B2C web site to proceed with the ride request

---

### CMB-20448: Website - Disable selecting Date Option when the service type is "R" Only 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-08

**Description:**
As a B2C rider using the service booking system,
I want the date selection option to be disabled automatically when I select the "R" (Real-time) service type,

**Acceptance Criteria:**
- Date Picker Disabled:
- When a B2C rider selects a service of type "R," the date picker must automatically be disabled.
- No Interaction Allowed:
- The rider should not be able to click, select, or interact with the date picker when an "R" ride is selected.
- Enable for Other Service Types:
- The date picker should remain fully functional and interactive for all service types other than "R."
- Smooth Transition:
- Switching between "R" and other service types should enable or disable the date picker seamlessly without any errors or glitches.
- UI Feedback:
- The disabled state of the date picker should be visually distinct (e.g., grayed out or dimmed) to enhance user understanding and accessibility.

---

## Consolidated Acceptance Criteria

- Scenario 01: Entering trip justification
- Given I am a rider on the "Book a Ride" screen.
- When I am booking an instant or booked for later trip.
- Then a visible input field should be displayed, labeled "Ride Justification", it should have a character limit of 150 characters.
- Scenario 02: Justification is displayed on trips details
- Given I am a Business Admin, BAM, Program Moderator, a rider have submitted a trip with a justification.
- When I view the details screen for that trip.
- Then the justification text should be clearly displayed and remain unchanged.
- Scenario 03: Justification is visible to stakeholders
- Given a trip is not auto-dispatched.
- When a Business Account Manager (BAM), Business Administrator (BA), or Program Manager (PM) reviews the trip request on their dashboard.
- Then the ride justification text should be prominently displayed in the trip request details.
- Scenario 1: Activating the Boost Feature and Selecting an Amount
- Given I am on the Yassir Web App, I have requested a trip
- When I see and click on the "Boost" button displayed on the estimation screen.
- Then a pop-up appears, presenting suggested boost amounts like "100 DA", "200 DA", "500 DA".
- And I see an additional option: "Custom” to add the amount I want.
- When I either select a suggested amount (e.g., "200 DA") OR I click "Custom" and enter a custom amount (e.g., "350 DA") into a new field.
- And I click a "Confirm" button.
- Then the chosen boost amount is immediately displayed on my trip details screen, and the estimated fare reflects this addition.
- Scenario 2: Modifying the Boost Amount After Initial Selection
- Given I have already added a boost amount to my current trip request, and it is displayed on the trip details screen.
- When I click on the associated "Modify" button.
- Then the boost amount selection interface reappears.
- When I select a new amount or enter a different custom amount.
- And I click "Confirm".
- Then the boost amount displayed on my trip details screen updates to the new amount, and the estimated fare adjusts accordingly.
- Scenario 3: Boost Deactivation When Changing Trip Service to Premium or for reservations
- Given I have an active boost added to my trip request.
- When I attempt to change the selected trip service (Premium) or for a booked trip
- Then, a pop-up message appears saying, "The boost feature is unavailable” or “Boost not allowed for reservations”
- And I am given two options: "Continue" and "Cancel".
- When I choose "Continue".
- Then the boost is removed from my trip request, and the service change proceeds.
- When I choose "Cancel".
- Then the service change is aborted, and the boost remains active on my original trip request.
- Scenario 4: Error handling for custom amount
- Given I select “Custom” to add the boost amount
- And I entered an amount that exceeds the price limit
- Then an error message is displayed “The amount must be between 50 and 200
- Scenario 5: Viewing the Boost Amount in Trip History
- Given I have completed a trip where a "Boost" was successfully applied.
- When I navigate to the "Trip History" section on the Yassir Web App.
- And I click on that specific completed trip to view its detailed price breakdown.
- Then I should clearly see a separate line item within the price details indicating "Boost Amount: +X DA", where X is the amount I added.
- Scenario 6: Boost feature when booking a trip for later
- Given I am on the Yassir Web App
- When I select my pickup and destination
- And select “Add date”  to schedule a trip
- Then the boost feature should be disabled in the trip request screen
- Scenario 1: Adding Multiple stops
- Given that I am logged into the Yassir webapp,
- When I initiate the process of booking a trip,
- Then I should find an option to add multiple destinations to the trip.
- Scenario 2: Number of Stops Limitation
- Given I am a Yassir Webapp user of a multistop trip
- When I’m adding the multi-stops,
- Then I should find the plus button disabled when reaching out to a number of intermediate stops that hit the limit of the number of stops -Which is 2- we can book, based on the multi-stops configurations
- Scenario 3: Calculation of Total Trip Cost
- Given that I have added multiple destinations to the trip,
- When I finalize the selection of locations,
- Then the system should calculate the total trip cost, considering all stops in the journey.
- How the ride cost is calculated in B2C:
- We consider the path between each of the two stops as a sub-trip, for example, a ride with 3 stops in between, then that means you have the following sub-trips:
- Pickup to stop 1.
- Stop 1 to Stop 2
- stop 3 to the final destination, each of those sub-trips is considered as a separate trip when it comes to pricing, so we calculate the pricing separately, and then we sum the price of all of them, then we check if eligible applied coupons or reductions.
- Scenario 4: Rearranging Stops
- When reviewing the trip, the trip entered points
- Then I should have the option to rearrange the sequence of stops as needed.
- Scenario 5: Trip Confirmation Screen
- When I proceed to request the trip,
- Then the trip confirmation screen should display all stops in the journey, providing a clear overview before confirming the booking.
- Scenario 6: Ongoing ride
- Given Yassir Webapp user of a multistop trip
- When I’m taking a multi-stop ride
- Then the trip with all the stops should be displayed on trip details and the trip map
- Scenario 7: If the trip stopped at an intermediate stop
- Given that I am a rider on a multi-stop trip
- When the trip finished at an intermediate stop
- Then I should see a pop-up displayed “Your ride has ended at stop 1. The updated trip price is 840 DZD”.
- Then I need to get a refund for the rest of the cost of the trip based on the new estimated cost value, the initially estimated cost value
- Scenario 8: Multi-stops in trip history
- When I navigate to the ride history
- Then I should have the stops included in the trip history screen
- And if the trip ends at one of the stops,
- Then the other stops should be struck-through
- Scenario 1: Book for someone else
- Given I am taking a ride on the Yassir webapp
- When I select my pick-up location
- And pick-up location is not my current address
- Then a pop-up is displayed showing “Is this ride for someone else?”
- If I am taking a ride for someone else
- Then I should select the guest user from the list or add a new one manually
- If I select a user from the list
- Then the ride is added to this guest user
- And the guest user will get an SMS with all the ride details
- If I select “Myself”
- Then I should be redirected to the booking screen to finish my booking
- If I click on the “Someone else” button
- Then I should add a new guest manually
- Scenario 2: Adding a new guest user manually
- Given I am on the Yassie webapp screen
- When I select the ride “ Book for someone else”
- Then a pop-up is displayed with input fields:
- First name
- Last time
- Guest Phone number
- When I click on “Add rider”
- Then the ride is booked for this rider and the rider is added to the list
- Scenario 3: Guest SMS message
- Given that I requested a ride for a guest user
- When I click on confirm
- Then the guest user should get an SMS with all the trip details that include:
- Driver details (car type, license plate).
- Estimated Time of Arrival (ETA).
- Trip price (ex: 1061 DA (espèces))
- Scenario 4: Booked for someone else’s trip in the driver screen
- Given I booked a trip for someone else (Guest user)
- Then on the driver screen and ride history, the contact name (Guest user) should be displayed
- Scenario 1: Early Termination on an Intermediate Stop (Refund Calculation)
- Given I am a Business Rider on a multi-stop trip,
- When the trip concludes at an intermediate stop (i.e., the rider does not complete all planned stops),
- Then the system should:
- Recalculate the final cost based on the distance/time traveled up to that intermediate stop,
- Refund the difference between the initially estimated cost and the new adjusted cost,
- Reflect this partial refund in the rider’s budget or payment account.
- Scenario 1: Accessing Trip History
- Given that I am logged into the Yassir for Business platform,
- When I navigate to the trip history screen,
- Then I should be able to access a list of all past trips.
- Scenario 2: Viewing Multi-Stop Trips
- Given that I am on the trip history screen,
- When I select a multi-stop trip from the list,
- Then I should see all stops entered for that trip displayed sequentially.
- Scenario 3: If the trip stopped at an intermediate stop
- If I ended a trip in one of the multi-stops
- Then the other stops should be strikethrough
- And a tag showing the Final stop
- And  I need to get a refund, for the rest of the cost of the trip based on the new estimated cost value - the initially estimated cost value
- Scenario 4: Multi-stops display on the map
- Given that the user can see the map
- If the user ends the trip in one of the stops
- Then it should be displayed and showed on the map
- Scenario 1: Exporting Multi-Stop Trip Data (Admin/BAM)
- Given I am an Admin on the Admin panel or a Business Account Manager,
- When I export a list of trips (e.g., via a CSV file or similar format),
- Then the exported file should:
- Indicate whether each trip has multiple stops (a flag or indicator for multi-stop trips),
- Include additional columns for each intermediate stop (e.g., “Intermediate Stop #1,” “Intermediate Stop #2,” etc.),
- Capture details for each stop (location or name) so the trip route is fully documented.
- Scenario 3: Displaying All Stops
- Given that I am viewing a multi-stop trip,
- When I review the trip details,
- Then I should find all stops, including pickup and destination points, listed in chronological order.
- The Book Rider screen should display a list of ongoing trips.
- Each ongoing trip should have a "See Details" button.
- Clicking on the "See Details" button should display the following information:
- Driver details: name, phone number, car model, car color, and car plate number.
- Trip status: ongoing, or searching for a driver.
- Map: showing the route between the pickup and drop-off locations.
- The service type is chosen and the trip cost is.
- Rider information: name and phone number.
- Trip details: pickup and destination written.
- Date and time of the trip.
- ETA to drop off.
- Scenario 1: Viewing ongoing trip details
- Given that I am a BAM on the Book Rider screen,
- When I click on the "See Details" button for an ongoing trip,
- Then I should be able to view detailed information about the trip, including driver details, trip status, map, service type, trip cost, rider information, pickup and destination details, date and time, and ETA to drop off.
- Scenario 2: Viewing trip details for a trip in "searching for a driver" status
- When I click on the "See Details" button for a trip that is in "searching for a driver" status,
- Then I should be able to view detailed information about the trip, excluding driver details (as the driver has not been assigned yet), but including trip status, map, service type, trip cost, rider information, pickup and destination details, date and time, and ETA to drop off (if available).
- User Can’t apply Promo Codes on Business Trips
- User can’t activate the business account outside the allowed time
- User can’t book a trip without the predefined pickup and drop off destination
- User can’t book a trip using a different allowed service
- User will need to pay the extra amount of money in case he has exceeded the spending allowance per trip
- User can instantly book the trip, or schedule the trip within the allowed time pickup time
- The business account manager should be able to see the trip status in real-time and track any changes that occur during the trip.
- The following trip statuses should be displayed:
- Pending:
- DRIVER_CANCELED_TIMEOUT
- DRIVER_CANCELED
- Pending
- ACCEPTED:
- DRIVER_ARRIVED
- STARTED
- Completed:
- Finished
- Canceled:
- RIDER_CANCELED
- NO_DRIVER_AVAILABLE
- DRIVER_COMING_CANCELED
- DRIVER_COMING_RIDER_CANCELED
- DRIVER_ARRIVED_CANCELED
- DRIVER_ARRIVED_RIDER_CANCELED
- For Canceled Trips and Completed Trips, they need to stay on the list for 45 Sec to 1:30, then they will be removed and will be only visible on the trip history table.
- The business account manager should also be able to view the trip history in the finished trip table, which includes its status
- The trip history table will include all booked trips from Mobile App, and Web App
- Given-When-Then Scenarios:
- Scenario 1: Viewing Trip Status in Real Time
- Given: A Business Account Manager has logged into the Yassir Go for B2B platform and submitted a trip request.
- When: The trip is in progress.
- Then: The Business Account Manager can view the real-time status update of the trip.
- Scenario 2: Displaying Trip as "Pending"
- Given: A trip has been requested by a Business Account Manager and is awaiting a driver.
- When: The s trip status is: PENDING, DRIVER_CANCELED_TIMEOUT, DRIVER_CANCELED, Pending
- Then: The trip status is displayed as "Pending".
- Scenario 3: Displaying Trip as "Accepted:
- Given: A driver has accepted the trip request
- When the s trip status is: ACCEPTED
- Then: The trip status is displayed as "ACCEPTED".
- Scenario 4: Displaying Trip as "Started:
- When the s trip status is: STARTED
- Then: The trip status is displayed as "STARTED".
- Scenario 5: Displaying Trip as "Cancelled"
- Given: The trip has been canceled by the rider, driver, or Yassir Go for the B2B platform as NDA.
- When:  the s trip status is: RIDER_CANCELED, NO_DRIVER_AVAILABLE, DRIVER_COMING_CANCELED, DRIVER_COMING_RIDER_CANCELED, DRIVER_ARRIVED_CANCELED, DRIVER_ARRIVED_RIDER_CANCELED
- Then: The trip status is displayed as "Cancelled". for one minute
- Scenario 6: Displaying Trip as "Completed"
- Given: The trip has been successfully completed.
- When: the s trip status is: FINISHED
- Then: The trip status is displayed as "Completed".
- Scenario 7: Listing Completed/ Canceled Trip for 45 Sec to 1:30 min
- Given: The trip has been successfully completed, or canceled, at the last minute
- When: the s trip status is listed on the ongoing trip list
- Then: The trip will be displayed for 45 Sec to 1:30 minutes only, then it will be pushed to the trips history table
- Given that I am designing the booking API,
- When I receive a request with the following inputs:
- Time and Date of the Trip
- Pickup Location and Destination
- If it’s a departure trip the destination is the Airport
- If it’s an arrival trip the the pickup is at the airport
- Rider Name
- Rider Phone Number (Phone number can be from anywhere)
- Rider Email as optional input
- As we have one client only with one service:
- Company ID (Will Be on the Company itself, already defined we don't need to receive it from the client)
- Service ID (Will Be on the Company itself, already defined we don't need to receive it from the client)
- Then the API should validate the inputs and ensure that all required fields are provided.
- If any required fields are missing or invalid, the API should respond with an appropriate error message.
- If the company has a sufficient budget for the trip, the API should deduct the trip amount from the company's budget.
- The API should create a trip booking for the specified company, with the details provided in the request.
- The booking should be made for later and should reflect in the Dashops Admin Panel as a BtoB Trip under the company's name and the name of the Business Account Manager (BAM) associated with the company.
- The trip should also appear in the BtoB Admin Panel as a Guest Trip and in the Client Web Portal as a Guest Trip.
- The API should handle any failures gracefully, such as insufficient budget, incorrect time and date format, or missing data, and respond with appropriate error messages.
- Pickup Location, Destination Errors
- Data and Time Errors (Based on service Limitations)
- Budget Errors
- The API should provide a successful response with the trip details, including the trip ID, once the booking is successfully completed.
- Given I am a BAM using the web app on my mobile device,
- When I access the Booking Trips, Trips Listing, Contact Support, Payment, or Profile sections,
- Then these sections should be responsive, fitting the mobile screen size, and allowing me to perform tasks smoothly.
- Scenario 1: Accessing Booking Trips on Mobile
- When I navigate to the Booking Trips section,
- Then this section should display correctly on my mobile screen, enabling me to book trips for myself or others without any usability issues.
- Scenario 2: Accessing Trips Listing on Mobile
- When I access the Trips Listing section,
- Then the section should be responsive on my mobile screen, presenting trip listings in an organized and user-friendly manner.
- Scenario 3: Contacting Support on Mobile
- When I need to contact support from the Contact Support section,
- Then the Contact Support section should be fully responsive, allowing me to access support information and contact details seamlessly on my mobile phone.
- Scenario 4: Managing Payments on Mobile
- When I navigate to the Payment section to review or make payments,
- Then the Payment section should be responsive on my mobile screen, enabling me to manage payments without any glitches.
- Scenario 5: Accessing Profile Section on Mobile
- When I access the Profile section to review or edit my personal information,
- Then the Profile section should be responsive, allowing me to conveniently view and edit my profile details from my mobile phone.
- Scenario 6: Viewing Trips Listing and Exporting Trips on Mobile
- Given I am using the Trips Listing section on my mobile device,
- When I need to export trips or view trip details,
- Then the Trips Listing section should remain responsive, ensuring that I can view and export trip data without experiencing any issues on my mobile phone.
- The BAM should have an option to enable the trip-scheduling feature in the settings.
- When the trip-scheduling feature is enabled, the BAM should be able to schedule trips for riders even if they fall outside the allowed hours or days of booking.
- The BAM should have access to inflation values for trip estimation when confirming the booking of a trip.
- Scenario 1: Enabling Scheduled Trips Toggle
- Given: I am on the "Book Rides" screen, And: I have entered the pickup and destination locations. And: I have selected a user for the trip., All program location checks are completed.
- When: I look for the "Scheduled Trips" toggle.
- Then: I should find the "Scheduled Trips" toggle on the screen.
- Scenario 2: Enabling Scheduled Trips Outside Allowed Hours/Days
- Given: I am on the "Book Rides" screen, And: I have entered the pickup and destination locations, And: I have selected a user for the trip,: All program location checks are completed, And: The "Scheduled Trips" toggle is enabled.
- When: I attempt to schedule a trip while I’m outside the allowed hours or days.
- Then: The system should allow me to schedule the trip, regardless of the time or day restrictions.
- Scenario 3: Enabling Scheduled Trips Outside Allowed Hours/Days
- When: I attempt to schedule a trip falls outside the allowed hours or days.
- Then: The system must not allow me to schedule the trip, Because of the time or day restrictions.
- Scenario 4: Estimated Trip Cost with Inflation Rates
- Given: I am on the "Book Rides" screen, And: I have, entered the pickup and destination locations, And: I have selected a user for the trip, And: All program location checks are completed, And: The "Scheduled Trips" toggle is enabled.
- When: I review the estimated trip cost.
- Then: The estimated trip cost should accurately reflect the inflation rates applied to scheduled trips.
- The business account manager is on the booking trip screen.
- The manager enters the pickup location and drop-off location for the trip.
- A drop-down menu or a list of family services is displayed for selection.
- Only family services that contain at least one business service are included in the drop-down menu or list.
- The manager can choose a family service from the filtered options.
- Once a family service is selected, the list of available services should be dynamically updated to only show business services within the chosen family service.
- Scenarios:
- Scenario 1: Selecting a Family Service and Viewing Business Services
- Given a business account manager on the booking trip screen
- When the manager enters the pickup and drop-off locations
- Then a drop-down menu or a list of family services is displayed
- And only family services with at least one business service are included in the options
- Scenario 2: Choosing a Family Service and Updating the Service List
- And a drop-down menu or a list of family services is displayed
- Then the manager can choose a family service from the filtered options
- And the list of available services should be dynamically updated to only show business services within the chosen family service
- Scenario 1: No Services Assigned to the Program
- Given I am a Business Rider using Yassir for Business,
- When I attempt to book a trip and no services have been assigned to my business program,
- Then I should receive a message informing me that no services are available and that I need to contact my Business Account Manager for further assistance.
- Scenario 2: Services Not Available in Geographic Location
- When I try to book a trip, and the services assigned to my program do not operate in my current geographic location,
- Then I should find a message indicating that no service is available in my area, along with guidance to contact my Business Account Manager or select a different location if applicable.
- Yassir Banner
- Home Page tab
- Ride History tab
- Ride details section with Pick up, drop off sections
- Map view
- Estimation Page with service types
- Add date option
- As a B2C user, im using the arabic language, when i try to book a ride, the calendar should be displayed just like it’s displayed in other languages, date section on the  left and time section on the right
- As a B2c user, when I try to book a ride, and I am in the time/date component, I should see the time that doesn’t fall within the service selected booking range as greyed out, just like in the choosing date case.
- No Nearby Driver - Redirect to Home Screen
- Given I’m a website rider,
- When I’m on the "Ride History" or "Ride Details" page and there is no nearby driver available,
- Then I should see a "No Nearby Driver" pop-up.
- When I click on the "Try Again" button on the pop-up,
- Then I should be redirected to the Home screen to attempt booking again.
- Date Picker Disabled:
- When a B2C rider selects a service of type "R," the date picker must automatically be disabled.
- No Interaction Allowed:
- The rider should not be able to click, select, or interact with the date picker when an "R" ride is selected.
- Enable for Other Service Types:
- The date picker should remain fully functional and interactive for all service types other than "R."
- Smooth Transition:
- Switching between "R" and other service types should enable or disable the date picker seamlessly without any errors or glitches.
- UI Feedback:
- The disabled state of the date picker should be visually distinct (e.g., grayed out or dimmed) to enhance user understanding and accessibility.
- Log in to the Dashops platform.
- Navigate to the Booking section in the menu.
- Click on New Trip and create a “Booked for Later” trip for a B2B user.
- Complete the trip creation process and observe the trip label in the system.
- Navigate to the Trips section in the menu.
- Click on New Trip, select B2B Trip, and create another “Booked for Later” trip for the same B2B user.

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-14821: API for Booking the trip~~ → Replaced by CMB-5457
- ~~CMB-13349: CHROME - WEBAPP - PREPROD : Booking status should be aligned with dashops booking status~~ → Replaced by CMB-5457
- ~~CMB-13100: Book Rides analytics screen~~ → Replaced by CMB-28700
- ~~CMB-16593: EDGE - WEBAPP - PROD - Booking for later button disabled when user inputs the date and time manually ~~ → Replaced by CMB-13199
