---
id: "jira-uncategorized"
title: "Uncategorized"
system: "Unknown"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","unknown","b2b_webapp","b2b-admin-panel"]
last_synced: "2026-03-07T21:12:27.276Z"
ticket_count: 120
active_ticket_count: 97
---

# Uncategorized

> Auto-generated from 120 Jira tickets.
> Last synced: 2026-03-07T21:12:27.276Z
> Active features: 97
> Superseded: 23

## User Stories

### CMB-34061: Uploading a picture to the notification on adminPanel 

**Status:** To Do | **Priority:** No Priority
**Created:** 2026-01-20

**Description:**
and open it as an overlay screen whenever the notification is clicked

---

### CMB-33978: Test DOD

**Status:** In Test | **Priority:** P3 - Low
**Created:** 2026-01-19

**Description:**
This user story is for testing the DoD whenever we move a ticket from In test to DONE

---

### CMB-31665: Inside Sales View on AdminPanel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-11-04

**Description:**
As an inside sales logged in on adminPanel, I want to see all the leads assigned to me on the leads management section, ensuring proper role-based access and management.

---

### CMB-29503: B2B Leads Statuses Management

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-09-04

**Description:**
As an inside sales or a superAdmin on adminPanel, I need to easily update a lead’s status, so I can accurately track their progress through the sales pipeline.

**Acceptance Criteria:**
- Scenario: Lead's statusses
- Given I am on the Leads Management dashboard with an assigned lead.
- When I check the statusses
- Then  I should see the following statusses
- New,
- Attempted contact,
- Contacted,
- Qualified,
- Open Deal,
- Won,
- Lost,
- Unqualified,
- Bad Timing.
- Scenario: Updating a lead's status
- Given I am on the Leads Management dashboard with an assigned lead.
- When I attempt to change the status of the lead
- Then the flow should follow this logic
- Scenario: Status change is logged
- Given I have updated a lead's status.
- When I review the lead's details.
- Then a log of the status change, including the date and the user who made the change, should be recorded and displayed.

---

### CMB-29148: B2B WebApp Rate us Screen

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-08-26

**Description:**
As a user on the WebApp, I want to be prompted to rate my trip after it's completed, so that I can provide feedback on my experience and contribute to improving the service.

**Acceptance Criteria:**
- Scenario 1: The rating screen appears after a completed trip.
- Given a user has just completed a trip on the WebApp.
- When the trip status changes to "completed."
- Then a "Rate Us" screen is displayed.
- Scenario 2: The user can provide a star rating.
- Given the user is on the "Rate Us" screen.
- When they interact with the star rating component.
- Then they can select a rating from 1 to 5 stars.
- Scenario 3: The user can leave a comment.
- Given the user has selected a star rating.
- When they tap on the comment section.
- Then a text box appears where they can type a custom comment.
- Scenario 4: Pre-defined comments are displayed based on the star rating.
- Given a user has selected a star rating.
- When a specific number of stars is chosen (e.g., 5 stars).
- Then a set of pre-defined positive comments are displayed as suggestions (e.g., "Excellent service," "Friendly driver," "On time").
- Scenario 5: Pre-defined comments for a lower rating are displayed.
- Given a user has selected a lower star rating (e.g., 1 or 2 stars).
- When a lower number of stars is chosen.
- Then a set of pre-defined negative comments are displayed as suggestions (e.g., "Driver was late," "Uncomfortable ride," "Difficulty with navigation").
- Scenario 6: The user can submit their rating and comment.
- Given a user has provided a star rating and, optionally, a comment.
- When they tap the "Submit" button.
- Then the rating and comment are successfully submitted, and the screen is dismissed.
- Scenario 7: The rating screen is not intrusive.
- Given a user has completed a trip.
- When the rating screen is displayed.
- Then it is presented as a modal or pop-up that doesn't completely block the user from navigating the rest of the application.
- Scenario 8: Multiple Ongoing Trips
- Given a user has completed multiple trips.
- When rating screens are displayed for each trip.
- Then multiple rating screens (for each trip) should be displayed and stacked.
- And the user should be able to close all of the screens at once or one by one.
- Scenario 9: Rating Screen on Different Platforms
- Given a user has completed a trip on the webApp.
- When a rating have been submitted on the webApp
- Then the rating screen should be dismissed on the superApp And vice versa.

---

### CMB-27105: Updating Business User's Phone Number

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-07-02

**Description:**
As superAdmin on adminPanel, I want to update user’s Phone number from the AdminPanel, so that their contact information remains accurate across systems.

**Acceptance Criteria:**
- Phone number
- Email
- user’s status=pending (no trips can be done by the user)
- when clicking verify user’s button data should be pre-populated (first name, last name, position, role, email, phone number), the input fields should not be editable
- re-invite user button should be hidden for update requests
- user’s status=active (trips can be done by the user)
- data should be reflected on webApp, dashops, adminPanel, superApp
- Scenario 01: Edit User Screen
- Given I am a superAdmin on AdminPanel, and user’s status= active
- When I click on the editicon,
- Then a screen should be displaying :
- First name
- last name
- position
- role
- phone number
- email
- Scenario 02: Edit User’s info with no verification
- Given I am a superAdmin on AdminPanel,
- When I choose to update
- first name
- Then no verification process should be triggered and data should be synchronized on adminPanel/webApp/ dashops and user’s status should remain active.
- Scenario 03: Keeping the logs
- Given superAdmin has made updates for any user,
- When we check the transaction table
- Then the records the action should be reflected on the table with previous and new values and the admin who performed the action

---

### CMB-12525: CHROME - WEBAPP - STAGING: UI glitches on add a new company page

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-02-16

**Description:**
Steps to reproduce

**Acceptance Criteria:**
- Login a BAM
- Click on accounts dropdown
- Click on switch companies
- Click on add a new company
- Background image should be static
- scrolling should not show white spaces
- Browser back button should work
- Background image becomes animated when typing
- Scrolling up and down shows white spaces
- Browser back button does not work to go to previous screen
- Able to submit empty legal details
- No field validations in place

---

### CMB-19016: SonarQube Code Smells Fix

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-10-27

---

### CMB-24998: Enable export of Inactive businesses

**Status:** Need More Work | **Priority:** No Priority
**Created:** 2025-04-29

**Description:**
As an admin on the admin able, I want to have the ability to export inactive businesses, so that I can keep track of everything.

**Acceptance Criteria:**
- Given that I am an admin on the admin panel
- When I select “Status”
- And select “Inactive”
- Then companies are filtered to only Inactive businesses
- When I click on “Export companies” button
- Then on the export file I should get only Inactive businesses listed

---

### CMB-21423: GA User Submits Legal Documents

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-01-09

**Description:**
As a product analyst,
I want to track Google Analytics (GA) events for document submissions and edits (e.

---

### CMB-19145: Website - Error handling

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-10-30

**Description:**
As a Webapp user, I should see relevant error messages whenever:

**Acceptance Criteria:**
- Enter a location that not supported
- Estimation changes due to long wait time
- Enter same pick-up and destinations

---

### CMB-24799: [SPIKE] - Remove B2B unused code from Mobility Backend

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-04-24

---

### CMB-15221: Increase test coverage to 25% - B2B

**Status:** Done | **Priority:** No Priority
**Created:** 2024-06-04

**Description:**
Integrate jest and react testing libray in the project for unit testing

---

### CMB-19636: Add Rating Section in History Details page 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-11-14

---

### CMB-23567: Unit tests for nav section

**Status:** Done | **Priority:** No Priority
**Created:** 2025-03-09

---

### CMB-13296: Introduction Video on Home Screen

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

---

### CMB-18357: Instant trip request leave guard

**Status:** Done | **Priority:** No Priority
**Created:** 2024-10-02

---

### CMB-153: Dev-BE: User Persona

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- User needs to be able to choose headcounts, user persona, industry from a list, not by entering a number, or a textual information.
- We need to provide other options
- The user needs to be able to skip this step
- Flag the person who made the updates

---

### CMB-2295: Dev BE: Group Details

**Status:** Done | **Priority:** No Priority
**Created:** 2022-12-07

---

### CMB-996: Dev BE: User Searching

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-07

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- I can search by phone number, email, name, department
- If Business account manager entered a part of the query (as  the first name for example), he must receive all answers that matches this search query
- Search can be done across all groups at once, in case of no filtering applied

---

### CMB-1000: Dev FE: User Filtering

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-07

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- Filtering can be done across all groups at once
- I need to be able to apply nested filtering on Groups and departments and Vice versa (Ex. People in Group X and People in Department Y)

---

### CMB-178: Design User Sorting

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- Sort can be done across all groups at once, in case of no filtering applied

---

### CMB-1364: Dev BE: Filtering Data

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-18

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- User needs to be able to filter for user using nested filtering with departments and groups

---

### CMB-177: Design User Searching

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- I can search by phone number, email, name, department
- If Business account manager entered a part of the query (as  the first name for example), he must receive all answers that matches this search query
- Search can be done across all groups at once, in case of no filtering applied

---

### CMB-164: Dev - BE: Group Naming

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- Names should start with letters
- Names fields need to be limited to a number of characters

---

### CMB-1333: Dev - BE: Listing service types

**Status:** Done | **Priority:** No Priority
**Created:** 2022-10-13

---

### CMB-385: Update Yassir structure name in bills templates

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-08-22

**Description:**
As a B2B sales manager, I want the bills template to be update with the new information of Yassir company so that the generated bills for our B2B parteners get conform to the new business structure of Yassir

**Acceptance Criteria:**
- The following detail should appear on the template on the footer
- ORAN Adresse : N°34 Iot 388 ilot 142 Coop ibn rochd, cité point du jour, 1er étage, Oran
- Constantine Adresse : 48B, Rue Horchi Slimane centre commerciale smk supérieure ,Constantine
- EURL  YASSIR instead of SPA YASSIR
- Banque :  SOCIETE GENERALE ALGERIE Agence Sidi Yahia instead of BNP N° 027 00702 000092100156
- SGA N° 021 00001 113004758323 instead of BNP N° 027 00702 000092100156
- Tél : 021 99 99 95
- Capital social : 747659000 DZD
- You can find attached:
- Example of a bill => “bill.pdf”
- All the detail that should be updated is on the footer
- Feedback and update:
- We have two types of invoices “Avance” and “facture de consommation”
- For the invoices generated in production the template didn’t change
- Test has been done for “Facture de consommation”
- NEW requirement:
- In those invoice we also to update a ligne in the invoice and not on the footer only, I’ll attach a file “Invoice-update” with the line highleted
- This line has to be replaced by  SGA N° 021 00001 113004758323

---

### CMB-2557: Design: Delete Business

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-12-19

**Description:**
As an OPs Manager, I need to be able to delete business that is no longer active and sends them to email to inform them that their business is going to be deleted in a set number of days

**Acceptance Criteria:**
- OPs manager can't delete an account unless it's de-activated and has no budget
- BAM will lose access to the dashboard, as he is deleted
- BAM can create a new account from scratch
- B.Rider will lose access to the Business services
- B.Rider will  get an email informing them that hey have lost the access

---

### CMB-2559: Design: Managing Spending Allowance: Configuration

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-12-19

**Description:**
As an OPs manager I need to be able to change the minimum spending allowance for BAM to chose as a spending allowance per trip

**Acceptance Criteria:**
- Ops manager needs to be able to enter the minimum value of the bar, initially it's set to 0
- Ops manager needs to be able to enter the maximum value of the bar, initially it's set to unlimited

---

### CMB-210: Settle up FE project 

**Status:** Done | **Priority:** No Priority
**Created:** 2022-08-01

**Description:**
Tech Stack:

**Acceptance Criteria:**
- ReactJs

---

### CMB-212: Setting up backend frontend connexion

**Status:** Done | **Priority:** No Priority
**Created:** 2022-08-01

---

### CMB-211: Configure CI/ CD pipeline

**Status:** Done | **Priority:** No Priority
**Created:** 2022-08-01

---

### CMB-423: Merge rider & b2b user using one app service

**Status:** Done | **Priority:** No Priority
**Created:** 2022-08-24

---

### CMB-422: FE: Signup/Signin - final design

**Status:** Done | **Priority:** No Priority
**Created:** 2022-08-24

---

### CMB-1586: Dev BE: Trip Estimation - Update Public BE API

**Status:** Done | **Priority:** No Priority
**Created:** 2022-11-02

---

### CMB-232: Design - User Persona

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-08-03

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- User needs to be able to choose headcounts, user persona, and industry from a list, not by entering a number, or textual information.
- for user persona:
- Students
- Customers Guests
- Patients
- Customer Guests
- Employees or Staff
- Other
- Industry:
- Banking
- Retail
- Food and Beverage
- Agriculture
- Oils and Gas
- other
- We need to provide other options
- The user needs to be able to skip this step

---

### CMB-755: Design: User Persona

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-09-20

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- User needs to be able to choose headcounts, user persona, industry from a list, not by entering a number, or a textual information.
- We need to provide other options
- The user needs to be able to skip this step

---

### CMB-9780: User Can't register with an Existing phone number

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-17

**Description:**
As a new user attempting to register on the platform, I want to receive an error message if I try to use a phone number that is already registered in the system as a B2B Rider.

**Acceptance Criteria:**
- Scenario 1: Attempting to Register with an Already B2B Registered Phone Number
- Given I am a new user trying to register on the B2B platform,
- When I enter a phone number that is already associated with an existing account in the system,
- Then I should receive an error message indicating that the phone number is already registered.
- Scenario 2: Providing a Unique Phone Number
- Given I am a new user trying to register on the platform,
- When I enter a phone number that is not associated with any existing account,
- Then the registration process should proceed without any error messages related to the phone number.
- Scenario 3: Error Message Clarity
- Given I receive an error message for using an already registered phone number,
- When I read the error message,
- Then it should clearly state that the phone number is already associated with an existing account and provide guidance on the next steps, such as logging in or account recovery.
- Scenario 4: User-Friendly Language
- Given I receive an error message,
- When I read the message,
- Then it should be written in a user-friendly and easily understandable language to ensure I can take appropriate action.
- Scenario 5: Error Handling
- Given I encounter an error related to the phone number during registration,
- When I resolve the issue (e.g., by logging in or recovering my existing account),
- Then the system should guide me through the necessary steps to complete the registration or access my account.

---

### CMB-10046: GA integration on Web App

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-10-26

**Description:**
As a Product Manager responsible for the B2B Web App, I want to implement Google Analytics tracking to monitor and collect usage data.

**Acceptance Criteria:**
- Scenario 2: Tracking User Interactions
- Given that Google Analytics tracking is implemented,
- When users interact with the B2B Web App (e.g., logins, page views, button clicks, form submissions),
- Then the tracking system should record and transmit this data to Google Analytics.
- Scenario 3: Monitoring User Behavior
- Given that tracking is active,
- When I access the Google Analytics dashboard,
- Then I should be able to view and analyze user behavior data, including user journeys, session duration, and user demographics.
- Scenario 4: Identifying Drop-off Points
- Given that tracking is active,
- When I analyze user behavior data,
- Then I should be able to identify drop-off points or areas where users frequently exit the application, helping me focus on improving those specific parts of the app.
- Scenario 5: Gathering Insights for Improvements
- Given access to Google Analytics data,
- When I review user behavior patterns and interactions,
- Then I can gather valuable insights to inform product improvements, enhancements, and feature prioritization.

---

### CMB-7216: User Link Expiration

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-07-07

---

### CMB-11735: Group Screen

**Status:** Done | **Priority:** P3 - Low
**Created:** 2024-01-12

**Description:**
B2B_SC_GroupMainScreenSessions

---

### CMB-16224: Loading & Error States

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-15

**Description:**
Scenario: Loading and Error states for Estimation page

---

### CMB-15653: Automatic Notification Content - Web App

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-06-26

**Description:**
User Story:

**Acceptance Criteria:**
- Automatic Updates:
- Scenario 1: Trip Completion Notification
- Given that a trip is completed,
- When I receive the notification, I should see an indicator on the navigation bar. And When I click on the notification,
- Then I should be directed to the trip history screen to view the details of the completed trip. (if the trip is completed: Finished, The user trip has been canceled: Not Completed: Canceled By Rider, No Driver Available, Driver Coming Rider Canceled, Driver Coming Driver Cancels), the push notification should contain the trip ID
- Scenario 2: Budget Consumption Notification
- Given that the budget is about to finish (90% consumed),
- Then I should be directed to the payment screen to manage the budget.
- Scenario 3: Guest Trip Acceptance Notification on Instant
- Given that a guest trip is accepted by a driver,
- When I receive the notification, Then I should see an indicator on the navigation bar. And When I click on the notification,
- Then I should be directed to the booking screen to view the details of the accepted guest trip.
- Scenario 4: Guest Trip Acceptance Notification Confirming on scheduled
- Then I should be directed to the booking screen to view the details of the Confirmed guest trip.
- Scenario 5: Changing the Business Plan from Postpaid to prepaid
- Given As a BAM, PM, and BA
- When my Business is moved from one payment plan to another (Pre-paid to post-paid)
- Then I should find a push notification informing me about the change, and when I click on it, I should be directed to the payment page
- Scenario 6: Upgrading and Downgrading User Role
- When I get upgraded or downgraded from BA to BAM, to PM
- Then I should find a push notification informing me about the change in my role, and other Admins Role and I should be directed to the user list, if I became a Business Admin or a BAM or any other user got impacted, then the CTA is to refresh the page
- Scenario 7: Max Length of Push notification drop-down
- Given As a BAM, Program Moderator, or a Business Admin
- When I scroll down for push notifications over - 20+ -
- Then the notification list needs to load another chunk of notifications
- Scenario 8: Marking as read notification
- When I click on the notification icon,
- Then I should see that all notifications are marked as read
- Note we have to GA event
- Scenario 1: User Invitation Notification
- Given that a Business Rider accepts an invitation,
- When I receive the notification, I should see an indicator on the navigation bar When I click on the notification,
- Then I should be directed to the user list screen to view the accepted invitations.
- Scenario 2: Max Length of Push notification drop-down
- Scenario 3: Marking as read notification
- Scenario 5: Notification Language
- When I receive a notification
- Then I should see a notification in the language we are using on the interface of the web app (Ar, En, Fr)
- Scenario 6: Closing the Notification
- When I click on any place on the page
- Then push notification drop-down should be closed
- Scenario 7: Marking as read
- When I click on any notification, then I’m redirected to its page
- Then  notification should be marked as read

---

### CMB-15636: Reservation details

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-06-25

**Description:**
Description: As a rider, When i book a ride from web app, I should be able to see the reservation details so that I can see my trip details and find all the info.

**Acceptance Criteria:**
- Trip id
- Trip Status
- Itenary with map
- Date and Price details
- Driver and car details
- Need help header and details
- Cancel Ride option

---

### CMB-13198: Estimation Screen

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-18

**Description:**
As a rider, I want to see the Estimation after entering pick-up and destination details so that I can see the price I am paying for my ride.

**Acceptance Criteria:**
- We will split the page to 3 columns, to handle the responsiveness of the screen
- The columns will be displayed beside each others horizontally, if there is no enough room to display them all 3 , we stack them underneath each others vertically
- As a B2C WebApp user, when I enter pick-up and drop-off locations I should be able to see a loading state before redirecting me to the estimation screen

---

### CMB-12492: CHROME - WEBAPP - DEV: "Enter" key does not work on search bar to navigate to the location

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-02-14

---

### CMB-15255: Map View

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-06-05

**Description:**
As a rider, When I want to book a ride on web page, I should be able to see the map view so that I can see my locations.

---

### CMB-13346: Migrated Business Directed to user persona Screen

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-03-21

**Description:**
As a business user who has migrated from the old B2B platform to the new B2B platform, I want a seamless transition process to access the new platform without any hassle.

**Acceptance Criteria:**
- Scenario 1: Logging in with Previous Credentials
- Given: I am a business user who has migrated from the old B2B platform.
- When: I visit the login page of the new B2B platform.
- Then: I should be able to log in directly using my previous email and password.
- And: Upon successful authentication, I should be directed to the home dashboard screen.
- Scenario 2: Business Account Manager Adds the phone number
- Given: I have successfully logged in to the new B2B platform. using the email and password : I need to be
- Then: I should be directed to the screen to add and verify my phone Number, and verify it with the OTP message
- And: The switch to the business scope should be available at the super user on the mobile
- Scenario 3: Completion of Onboarding Process
- Given: I have logged in to the new B2B platform.
- When: I am directed to the home dashboard screen.
- Then: My onboarding process should be considered complete.
- And: I should have access to all features and functionalities of the platform.
- Scenario 4: I forgot my password
- Given: I have forgot my password on the old platfrom
- When: I request to reset my password using forget my password flow
- Then: I should receive an email with a link to reset my password

---

### CMB-16269: Events Tracking

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-17

**Description:**
Integrate WebApp with Google analytics

---

### CMB-12966: Not including path with ID

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-07

**Description:**
Implemented Google Analytics tracking within our React application to monitor user interactions effectively.

---

### CMB-13275: Lead Creation From the Self Serve Flow 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-03-20

**Description:**
As an Admin,

**Acceptance Criteria:**
- Scenario 1: Accessing Incomplete Business User Data
- Given I am logged into the Admin Panel,
- When I navigate to the "Leads" tab,
- Then I should find a subsection or filter option specifically for incomplete self-serve registrations.
- Scenario 2: Viewing Incomplete Business User Details
- Given I access the section for incomplete self-serve registrations, Completed entering and verifying phone number and emails
- When I view the list of users,
- Then I should see the following details for each user who did not complete the company creation step:
- Email Address
- Phone Number
- Timestamp of Registration
- Scenario 3: User Completing the company creation
- Given as a Business Lead I have completed the company details
- When We check the Business Information for that lead on the leads table
- Then I should see the following details for each user who did not complete the company creation step:
- Company Details
- Services: Mobility
- Status: Potential Client

---

### CMB-13276: Lead Management 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-20

**Description:**
As an Admin,

**Acceptance Criteria:**
- Scenario 1: Accessing Lead Management Options
- Given I am logged into the Admin Panel,
- When I navigate to the "Leads" section,
- Then I should find an "Edit" button next to each lead entry.
- Scenario 2: Editing Lead Onboarding Status
- Given I click on the "Edit" button for a specific lead,
- When I am directed to the lead management screen,
- Then I should see options to modify the lead's onboarding status.
- Scenario 3: Selecting Onboarding Status Options
- Given I am on the lead management screen,
- When I review the available options,
- Then I should be able to choose from the following onboarding statuses:
- Business Lead Contacted
- Business Lead Prospect
- Business Lead Idle
- Business Lead Deal Closed
- Business Lead Deal Rejected
- Scenario 4: Saving Changes
- Given I have selected the desired onboarding status for the lead,
- When I click the "Save" or "Update" button,
- Then the changes should be applied, and the lead's onboarding status should be updated accordingly.

---

### CMB-13656: Taxes not applied by default in Algeria

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-04-04

**Description:**
As an Admin of Yassir Go for Business, I need to ensure that taxes are not applied by default to new companies created on the platform in Algeria only. This change should be applied universally to all existing companies, any newly created businesses, and those migrated from the old BtoB platform to maintain consistency and alignment with business requirements.

**Acceptance Criteria:**
- Default Tax Exemption:
- When a new company is created on the Yassir Go for Business platform, taxes should not be applied by default to any transactions or services associated with that company.
- Universal Application:
- The default tax exemption setting should be applied to all existing companies currently registered on the platform.
- Any new companies created after implementing this change should also inherit the tax exemption by default.
- Migrated Businesses:
- Companies migrated from the old BtoB platform to the new Yassir Go for Business platform should have the tax exemption setting applied automatically during the migration process.
- Upon migration, all transactions and services associated with migrated businesses should reflect the default tax exemption status.

---

### CMB-13053: Business Lead Form

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-03-11

**Description:**
Title: Complete Form for Business Lead Contact

**Acceptance Criteria:**
- Scenario 1: Accessing the Form
- Given: I am a Business Lead interested in Yassir's services.
- When: I visit the Yassir website or platform.
- Then: I should be able to locate a "Contact Us" or "Get in Touch" section.
- Scenario 2: Entering Personal Information
- Given: I am accessing the contact form.
- When: I fill out the form.
- Then: I should see fields to enter my:
- name, Mandtory
- email address,Mandtory
- phone number, Mandtory
- Position
- country, Mandatory
- city. Mandatory
- Company Name Mandatory
- Company SizeMandtory
- Services I’m interested in: Mandatory
- Food Delivery
- Parcel Delivery
- E-Vouchers
- Mobility
- Scenario 3: Submission and Follow-Up
- Given: I have filled out all required fields in the contact form.
- When: I submit the form.
- Then: The information provided should be saved in the leads collection, to be reflected on the leads table later on
- And: I should receive an acknowledgment of my submission along with details on when to expect a response. as a notification, and an Email
- Scenario 4: Submission and Follow-Up
- Given: I have filled out all required fields in the contact form.
- When: I try to submit the form.
- Then: I need to find a captcha that verifies that the person filling the form is not a bot
- Scenario 5: Default Language
- Given: I have been directed to the form screen
- When: the form screen opens
- Then: I need to find the French language as a default language

---

### CMB-15517: Stopping the Client Apps

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-06-17

**Description:**
As a Business Rider accessing the old BtoB platform,
I want to seamlessly transition to the new BtoB Web App platform,

**Acceptance Criteria:**
- When accessing the web app, upon login, I am automatically redirected to the new BtoB Web App platform's login page.
- When attempting to log into the mobile app, I encounter an error instructing me to contact support for assistance.

---

### CMB-14803: Ride details - Search addresses component

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-05-22

**Description:**
As a Yassir Web App user, I want to see Ride details page so that I can enter the details to book trip

**Acceptance Criteria:**
- Scenario : Rider is on the enter pickup/ drop off locations screen in the B2C webapp.
- Given: I am on the B2C platform and viewing the address input screen for pickup and drop-off locations,
- When: I want to swap the pickup and drop-off addresses,
- Then: I should be able to toggle the two fields using a visible and accessible switch (button or icon), which instantly swaps the locations entered in both fields without losing any data.

---

### CMB-15647: Schedule Ride Button

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-06-25

**Description:**
Scenario: Schedule Ride Button

---

### CMB-12716: Add/update data-testid to intractable web elements for webapp - part 2

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-02-21

**Description:**
Multiple companies switching

---

### CMB-17001: Rating Experience

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-08-13

**Description:**
As a rider, I should be able to rate the drive after trip completion

---

### CMB-16888: Replace Aggregations and mapping

**Status:** Done | **Priority:** No Priority
**Created:** 2024-08-07

---

### CMB-16889: Replace direct access queries to non b2b owned collections

**Status:** Done | **Priority:** No Priority
**Created:** 2024-08-07

---

### CMB-21362: Display a "Something went wrong" UI when there's an internal server error (HTTP 500)

**Status:** Done | **Priority:** No Priority
**Created:** 2025-01-08

---

### CMB-18361: Skeleton loader for instant trip page 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-10-02

---

### CMB-16987: Ride Statuses

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-08-13

**Description:**
As a rider, I should be able to see the ride statuses on the web app.

---

### CMB-17294: [DB Migration]: Breakdown Complex Database Aggregation

**Status:** Done | **Priority:** No Priority
**Created:** 2024-08-25

**Description:**
https://www.notion.so/ysir/Refactoring-and-Breaking-up-complex-Aggregation-Migrating-DB-156774610f8f452c8f87de6dec1d33fc

---

### CMB-19174: Add Push notifications for manual trip requests handling

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-10-30

**Description:**
We need to add Push notifications for these trip requests -

**Acceptance Criteria:**
- Pending approval
- Expired trip request
- Rejected trip request

---

### CMB-17846: SPiKE | Animating the car

**Status:** Done | **Priority:** No Priority
**Created:** 2024-09-11

---

### CMB-19782: [Website] - add clear sign for current address in pickup and dropoff fields 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-19

**Description:**
We should have clear sign, to clear current location, just like it appears for other selected locations

---

### CMB-21352: Add alert banner when the user try to leave the rating page

**Status:** Done | **Priority:** No Priority
**Created:** 2025-01-07

**Description:**
figma link: https://www.figma.com/design/iA9hbyc6kkTqdXN0yqWMX5/Rider-Web-App---Handoff?node-id=7699-27402&t=ed9knKT9banIA58K-4

---

## Consolidated Acceptance Criteria

- On the country settings tab on adminPanel
- Create a new notification
- input notification details and click next
- on the companies dropdown list check one of the companies
- now try to uncheck it
- Scenario: Lead's statusses
- Given I am on the Leads Management dashboard with an assigned lead.
- When I check the statusses
- Then  I should see the following statusses
- New,
- Attempted contact,
- Contacted,
- Qualified,
- Open Deal,
- Won,
- Lost,
- Unqualified,
- Bad Timing.
- Scenario: Updating a lead's status
- When I attempt to change the status of the lead
- Then the flow should follow this logic
- Scenario: Status change is logged
- Given I have updated a lead's status.
- When I review the lead's details.
- Then a log of the status change, including the date and the user who made the change, should be recorded and displayed.
- Scenario 1: The rating screen appears after a completed trip.
- Given a user has just completed a trip on the WebApp.
- When the trip status changes to "completed."
- Then a "Rate Us" screen is displayed.
- Scenario 2: The user can provide a star rating.
- Given the user is on the "Rate Us" screen.
- When they interact with the star rating component.
- Then they can select a rating from 1 to 5 stars.
- Scenario 3: The user can leave a comment.
- Given the user has selected a star rating.
- When they tap on the comment section.
- Then a text box appears where they can type a custom comment.
- Scenario 4: Pre-defined comments are displayed based on the star rating.
- Given a user has selected a star rating.
- When a specific number of stars is chosen (e.g., 5 stars).
- Then a set of pre-defined positive comments are displayed as suggestions (e.g., "Excellent service," "Friendly driver," "On time").
- Scenario 5: Pre-defined comments for a lower rating are displayed.
- Given a user has selected a lower star rating (e.g., 1 or 2 stars).
- When a lower number of stars is chosen.
- Then a set of pre-defined negative comments are displayed as suggestions (e.g., "Driver was late," "Uncomfortable ride," "Difficulty with navigation").
- Scenario 6: The user can submit their rating and comment.
- Given a user has provided a star rating and, optionally, a comment.
- When they tap the "Submit" button.
- Then the rating and comment are successfully submitted, and the screen is dismissed.
- Scenario 7: The rating screen is not intrusive.
- Given a user has completed a trip.
- When the rating screen is displayed.
- Then it is presented as a modal or pop-up that doesn't completely block the user from navigating the rest of the application.
- Scenario 8: Multiple Ongoing Trips
- Given a user has completed multiple trips.
- When rating screens are displayed for each trip.
- Then multiple rating screens (for each trip) should be displayed and stacked.
- And the user should be able to close all of the screens at once or one by one.
- Scenario 9: Rating Screen on Different Platforms
- Given a user has completed a trip on the webApp.
- When a rating have been submitted on the webApp
- Then the rating screen should be dismissed on the superApp And vice versa.
- log out of webApp (if you are already logged in)
- switch the login method to phone number
- input an incorrect phone number
- check the error message displayed (incorrect email, instead of incorrect phone number)
- Phone number
- Email
- user’s status=pending (no trips can be done by the user)
- when clicking verify user’s button data should be pre-populated (first name, last name, position, role, email, phone number), the input fields should not be editable
- re-invite user button should be hidden for update requests
- user’s status=active (trips can be done by the user)
- data should be reflected on webApp, dashops, adminPanel, superApp
- Scenario 01: Edit User Screen
- Given I am a superAdmin on AdminPanel, and user’s status= active
- When I click on the editicon,
- Then a screen should be displaying :
- First name
- last name
- position
- role
- phone number
- email
- Scenario 02: Edit User’s info with no verification
- Given I am a superAdmin on AdminPanel,
- When I choose to update
- first name
- Then no verification process should be triggered and data should be synchronized on adminPanel/webApp/ dashops and user’s status should remain active.
- Scenario 03: Keeping the logs
- Given superAdmin has made updates for any user,
- When we check the transaction table
- Then the records the action should be reflected on the table with previous and new values and the admin who performed the action
- Login a BAM
- Click on accounts dropdown
- Click on switch companies
- Click on add a new company
- Background image should be static
- scrolling should not show white spaces
- Browser back button should work
- Background image becomes animated when typing
- Scrolling up and down shows white spaces
- Browser back button does not work to go to previous screen
- Able to submit empty legal details
- No field validations in place
- Given that I am an admin on the admin panel
- When I select “Status”
- And select “Inactive”
- Then companies are filtered to only Inactive businesses
- When I click on “Export companies” button
- Then on the export file I should get only Inactive businesses listed
- Enter a location that not supported
- Estimation changes due to long wait time
- Enter same pick-up and destinations
- all roles changement emails
- Account creation emails
- access revocation emails
- monthly report emails
- budget alerts emails
- password reset emails (password reset & password reset successfully emails)
- Business Deactivation email
- User needs to be able to choose headcounts, user persona, industry from a list, not by entering a number, or a textual information.
- We need to provide other options
- The user needs to be able to skip this step
- Flag the person who made the updates
- I can search by phone number, email, name, department
- If Business account manager entered a part of the query (as  the first name for example), he must receive all answers that matches this search query
- Search can be done across all groups at once, in case of no filtering applied
- Filtering can be done across all groups at once
- I need to be able to apply nested filtering on Groups and departments and Vice versa (Ex. People in Group X and People in Department Y)
- Sort can be done across all groups at once, in case of no filtering applied
- User needs to be able to filter for user using nested filtering with departments and groups
- Names should start with letters
- Names fields need to be limited to a number of characters
- The following detail should appear on the template on the footer
- ORAN Adresse : N°34 Iot 388 ilot 142 Coop ibn rochd, cité point du jour, 1er étage, Oran
- Constantine Adresse : 48B, Rue Horchi Slimane centre commerciale smk supérieure ,Constantine
- EURL  YASSIR instead of SPA YASSIR
- Banque :  SOCIETE GENERALE ALGERIE Agence Sidi Yahia instead of BNP N° 027 00702 000092100156
- SGA N° 021 00001 113004758323 instead of BNP N° 027 00702 000092100156
- Tél : 021 99 99 95
- Capital social : 747659000 DZD
- You can find attached:
- Example of a bill => “bill.pdf”
- All the detail that should be updated is on the footer
- Feedback and update:
- We have two types of invoices “Avance” and “facture de consommation”
- For the invoices generated in production the template didn’t change
- Test has been done for “Facture de consommation”
- NEW requirement:
- In those invoice we also to update a ligne in the invoice and not on the footer only, I’ll attach a file “Invoice-update” with the line highleted
- This line has to be replaced by  SGA N° 021 00001 113004758323
- OPs manager can't delete an account unless it's de-activated and has no budget
- BAM will lose access to the dashboard, as he is deleted
- BAM can create a new account from scratch
- B.Rider will lose access to the Business services
- B.Rider will  get an email informing them that hey have lost the access
- Ops manager needs to be able to enter the minimum value of the bar, initially it's set to 0
- Ops manager needs to be able to enter the maximum value of the bar, initially it's set to unlimited
- ReactJs
- User needs to be able to choose headcounts, user persona, and industry from a list, not by entering a number, or textual information.
- for user persona:
- Students
- Customers Guests
- Patients
- Customer Guests
- Employees or Staff
- Other
- Industry:
- Banking
- Retail
- Food and Beverage
- Agriculture
- Oils and Gas
- other
- Scenario 1: Attempting to Register with an Already B2B Registered Phone Number
- Given I am a new user trying to register on the B2B platform,
- When I enter a phone number that is already associated with an existing account in the system,
- Then I should receive an error message indicating that the phone number is already registered.
- Scenario 2: Providing a Unique Phone Number
- Given I am a new user trying to register on the platform,
- When I enter a phone number that is not associated with any existing account,
- Then the registration process should proceed without any error messages related to the phone number.
- Scenario 3: Error Message Clarity
- Given I receive an error message for using an already registered phone number,
- When I read the error message,
- Then it should clearly state that the phone number is already associated with an existing account and provide guidance on the next steps, such as logging in or account recovery.
- Scenario 4: User-Friendly Language
- Given I receive an error message,
- When I read the message,
- Then it should be written in a user-friendly and easily understandable language to ensure I can take appropriate action.
- Scenario 5: Error Handling
- Given I encounter an error related to the phone number during registration,
- When I resolve the issue (e.g., by logging in or recovering my existing account),
- Then the system should guide me through the necessary steps to complete the registration or access my account.
- Scenario 2: Tracking User Interactions
- Given that Google Analytics tracking is implemented,
- When users interact with the B2B Web App (e.g., logins, page views, button clicks, form submissions),
- Then the tracking system should record and transmit this data to Google Analytics.
- Scenario 3: Monitoring User Behavior
- Given that tracking is active,
- When I access the Google Analytics dashboard,
- Then I should be able to view and analyze user behavior data, including user journeys, session duration, and user demographics.
- Scenario 4: Identifying Drop-off Points
- When I analyze user behavior data,
- Then I should be able to identify drop-off points or areas where users frequently exit the application, helping me focus on improving those specific parts of the app.
- Scenario 5: Gathering Insights for Improvements
- Given access to Google Analytics data,
- When I review user behavior patterns and interactions,
- Then I can gather valuable insights to inform product improvements, enhancements, and feature prioritization.
- Go to the book rides section on the B2B webApp
- Proceed with providing data
- Click on book ride
- Observe the estimated time format on the trip details overlay
- Automatic Updates:
- Scenario 1: Trip Completion Notification
- Given that a trip is completed,
- When I receive the notification, I should see an indicator on the navigation bar. And When I click on the notification,
- Then I should be directed to the trip history screen to view the details of the completed trip. (if the trip is completed: Finished, The user trip has been canceled: Not Completed: Canceled By Rider, No Driver Available, Driver Coming Rider Canceled, Driver Coming Driver Cancels), the push notification should contain the trip ID
- Scenario 2: Budget Consumption Notification
- Given that the budget is about to finish (90% consumed),
- Then I should be directed to the payment screen to manage the budget.
- Scenario 3: Guest Trip Acceptance Notification on Instant
- Given that a guest trip is accepted by a driver,
- When I receive the notification, Then I should see an indicator on the navigation bar. And When I click on the notification,
- Then I should be directed to the booking screen to view the details of the accepted guest trip.
- Scenario 4: Guest Trip Acceptance Notification Confirming on scheduled
- Then I should be directed to the booking screen to view the details of the Confirmed guest trip.
- Scenario 5: Changing the Business Plan from Postpaid to prepaid
- Given As a BAM, PM, and BA
- When my Business is moved from one payment plan to another (Pre-paid to post-paid)
- Then I should find a push notification informing me about the change, and when I click on it, I should be directed to the payment page
- Scenario 6: Upgrading and Downgrading User Role
- When I get upgraded or downgraded from BA to BAM, to PM
- Then I should find a push notification informing me about the change in my role, and other Admins Role and I should be directed to the user list, if I became a Business Admin or a BAM or any other user got impacted, then the CTA is to refresh the page
- Scenario 7: Max Length of Push notification drop-down
- Given As a BAM, Program Moderator, or a Business Admin
- When I scroll down for push notifications over - 20+ -
- Then the notification list needs to load another chunk of notifications
- Scenario 8: Marking as read notification
- When I click on the notification icon,
- Then I should see that all notifications are marked as read
- Note we have to GA event
- Scenario 1: User Invitation Notification
- Given that a Business Rider accepts an invitation,
- When I receive the notification, I should see an indicator on the navigation bar When I click on the notification,
- Then I should be directed to the user list screen to view the accepted invitations.
- Scenario 2: Max Length of Push notification drop-down
- Scenario 3: Marking as read notification
- Scenario 5: Notification Language
- When I receive a notification
- Then I should see a notification in the language we are using on the interface of the web app (Ar, En, Fr)
- Scenario 6: Closing the Notification
- When I click on any place on the page
- Then push notification drop-down should be closed
- Scenario 7: Marking as read
- When I click on any notification, then I’m redirected to its page
- Then  notification should be marked as read
- Trip id
- Trip Status
- Itenary with map
- Date and Price details
- Driver and car details
- Need help header and details
- Cancel Ride option
- We will split the page to 3 columns, to handle the responsiveness of the screen
- The columns will be displayed beside each others horizontally, if there is no enough room to display them all 3 , we stack them underneath each others vertically
- As a B2C WebApp user, when I enter pick-up and drop-off locations I should be able to see a loading state before redirecting me to the estimation screen
- Scenario 1: Logging in with Previous Credentials
- Given: I am a business user who has migrated from the old B2B platform.
- When: I visit the login page of the new B2B platform.
- Then: I should be able to log in directly using my previous email and password.
- And: Upon successful authentication, I should be directed to the home dashboard screen.
- Scenario 2: Business Account Manager Adds the phone number
- Given: I have successfully logged in to the new B2B platform. using the email and password : I need to be
- Then: I should be directed to the screen to add and verify my phone Number, and verify it with the OTP message
- And: The switch to the business scope should be available at the super user on the mobile
- Scenario 3: Completion of Onboarding Process
- Given: I have logged in to the new B2B platform.
- When: I am directed to the home dashboard screen.
- Then: My onboarding process should be considered complete.
- And: I should have access to all features and functionalities of the platform.
- Scenario 4: I forgot my password
- Given: I have forgot my password on the old platfrom
- When: I request to reset my password using forget my password flow
- Then: I should receive an email with a link to reset my password
- Scenario 1: Accessing Incomplete Business User Data
- Given I am logged into the Admin Panel,
- When I navigate to the "Leads" tab,
- Then I should find a subsection or filter option specifically for incomplete self-serve registrations.
- Scenario 2: Viewing Incomplete Business User Details
- Given I access the section for incomplete self-serve registrations, Completed entering and verifying phone number and emails
- When I view the list of users,
- Then I should see the following details for each user who did not complete the company creation step:
- Email Address
- Phone Number
- Timestamp of Registration
- Scenario 3: User Completing the company creation
- Given as a Business Lead I have completed the company details
- When We check the Business Information for that lead on the leads table
- Company Details
- Services: Mobility
- Status: Potential Client
- Scenario 1: Accessing Lead Management Options
- When I navigate to the "Leads" section,
- Then I should find an "Edit" button next to each lead entry.
- Scenario 2: Editing Lead Onboarding Status
- Given I click on the "Edit" button for a specific lead,
- When I am directed to the lead management screen,
- Then I should see options to modify the lead's onboarding status.
- Scenario 3: Selecting Onboarding Status Options
- Given I am on the lead management screen,
- When I review the available options,
- Then I should be able to choose from the following onboarding statuses:
- Business Lead Contacted
- Business Lead Prospect
- Business Lead Idle
- Business Lead Deal Closed
- Business Lead Deal Rejected
- Scenario 4: Saving Changes
- Given I have selected the desired onboarding status for the lead,
- When I click the "Save" or "Update" button,
- Then the changes should be applied, and the lead's onboarding status should be updated accordingly.
- Default Tax Exemption:
- When a new company is created on the Yassir Go for Business platform, taxes should not be applied by default to any transactions or services associated with that company.
- Universal Application:
- The default tax exemption setting should be applied to all existing companies currently registered on the platform.
- Any new companies created after implementing this change should also inherit the tax exemption by default.
- Migrated Businesses:
- Companies migrated from the old BtoB platform to the new Yassir Go for Business platform should have the tax exemption setting applied automatically during the migration process.
- Upon migration, all transactions and services associated with migrated businesses should reflect the default tax exemption status.
- Scenario 1: Accessing the Form
- Given: I am a Business Lead interested in Yassir's services.
- When: I visit the Yassir website or platform.
- Then: I should be able to locate a "Contact Us" or "Get in Touch" section.
- Scenario 2: Entering Personal Information
- Given: I am accessing the contact form.
- When: I fill out the form.
- Then: I should see fields to enter my:
- name, Mandtory
- email address,Mandtory
- phone number, Mandtory
- Position
- country, Mandatory
- city. Mandatory
- Company Name Mandatory
- Company SizeMandtory
- Services I’m interested in: Mandatory
- Food Delivery
- Parcel Delivery
- E-Vouchers
- Mobility
- Scenario 3: Submission and Follow-Up
- Given: I have filled out all required fields in the contact form.
- When: I submit the form.
- Then: The information provided should be saved in the leads collection, to be reflected on the leads table later on
- And: I should receive an acknowledgment of my submission along with details on when to expect a response. as a notification, and an Email
- Scenario 4: Submission and Follow-Up
- When: I try to submit the form.
- Then: I need to find a captcha that verifies that the person filling the form is not a bot
- Scenario 5: Default Language
- Given: I have been directed to the form screen
- When: the form screen opens
- Then: I need to find the French language as a default language
- When accessing the web app, upon login, I am automatically redirected to the new BtoB Web App platform's login page.
- When attempting to log into the mobile app, I encounter an error instructing me to contact support for assistance.
- Scenario : Rider is on the enter pickup/ drop off locations screen in the B2C webapp.
- Given: I am on the B2C platform and viewing the address input screen for pickup and drop-off locations,
- When: I want to swap the pickup and drop-off addresses,
- Then: I should be able to toggle the two fields using a visible and accessible switch (button or icon), which instantly swaps the locations entered in both fields without losing any data.
- Pending approval
- Expired trip request
- Rejected trip request

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-34870: [ALG] [CHROME] [ADMINPANEL] [PROD]: Expired rule on adminpanel should display message ' refferal rule expired' ~~ → Replaced by CMB-34868
- ~~CMB-23154: EDGE - ADMINPANEL - PROD : Admin unable to uncheck the entreprises previously selected when sending a notification~~ → Replaced by CMB-35485
- ~~CMB-26713: Updating Business User's Data on AdminPanel~~ → Replaced by CMB-27105
- ~~CMB-21596: B2B - Reduce Code Smells below 30%~~ → Replaced by CMB-19016
- ~~CMB-23771: EDGE - WEBAPP - PROD : notification title not displayed on the notification received on webApp~~ → Replaced by CMB-29148
- ~~CMB-24434: EDGE - WEBAPP - PROD : update yassir office address in emails~~ → Replaced by CMB-24220
- ~~CMB-23160: EDGE - WEBAPP - PROD : No error message informing user that the email is part of another business~~ → Replaced by CMB-26786
- ~~CMB-22830: CHROME - WEBAPP - STAGING: Fix Polyline to Follow Real Roads Instead of Direct Line~~ → Replaced by CMB-12525
- ~~CMB-18394: UXW - Website Error Handling ~~ → Replaced by CMB-19145
- ~~CMB-10955: CHROME - WEBAPP - STAGING: Difficult selecting the date range, getting unselected then have to select again~~ → Replaced by CMB-12525
- ~~CMB-16223: Information on Service types when `i` icon is clicked~~ → Replaced by CMB-1333
- ~~CMB-13868: Automatic Notification Format - Web App~~ → Replaced by CMB-15653
- ~~CMB-15859: EDGE - WEBAPP - PROD :  No error displayed when pick-up and drop-off locations are the same~~ → Replaced by CMB-26786
- ~~CMB-19897: [Website] - show loading state after filling ride details locations before redirection to the estimation screen~~ → Replaced by CMB-13198
- ~~CMB-16890: Replace direct access queries to b2b owned collections from outsider systems~~ → Replaced by CMB-16889
- ~~CMB-19600: EDGE - WEBAPP - PROD : Menu allignement for arabic~~ → Replaced by CMB-22645
- ~~CMB-18396: Website - Leave Guard~~ → Replaced by CMB-18357
- ~~CMB-19935: [Website] - Add ability to switch locations in the ride details screen next to the (pick-up, drop-off) addresses fields~~ → Replaced by CMB-14803
- ~~CMB-19059: EDGE - ADMINPANEL - PROD : On hover button behaviour~~ → Replaced by CMB-35485
- ~~CMB-17064: CHROME - WEBAPP - STAGING: Legal Details | No field validations and character limit in place for input fields, can submit empty~~ → Replaced by CMB-12525
- ~~CMB-18133: UXW - Rating Experience~~ → Replaced by CMB-17001
- ~~CMB-18419: CHROME - WEBAPP - STAGING: Move Export businesses button to above tabs~~ → Replaced by CMB-12525
- ~~CMB-18422: CHROME - WEBAPP - STAGING: BAM, BA, PM does not receive rejection email if legal details are rejected~~ → Replaced by CMB-12525
