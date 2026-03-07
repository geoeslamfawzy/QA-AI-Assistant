---
id: "jira-b2b-portal-account"
title: "B2B Portal — Account"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","beta-release","super-app-android","super-app-ios","b2b","crafttheme_mobility"]
last_synced: "2026-03-06T08:54:20.195Z"
ticket_count: 51
active_ticket_count: 45
---

# B2B Portal — Account

> Auto-generated from 51 Jira tickets.
> Last synced: 2026-03-06T08:54:20.195Z
> Active features: 45
> Superseded: 6

## User Stories

### CMB-33310: [WEBAPP] Favorite Addresses Sub-Menu

**Status:** To Do | **Priority:** P2 - Medium
**Created:** 2025-12-29

**Description:**
As a user, I want to manage and edit my saved addresses in the "My Account" section, so I can quickly select my frequently used locations for rides.

**Acceptance Criteria:**
- Scenario 01 : Viewing Saved Addresses
- Given I am logged in and navigate to "Account."
- When I view the "Saved Addresses" Sub-menu.
- Then  I should see :
- I should see a list displaying all my saved addresses, along with the address details.
- an empty state -in case no addresses have been added yet-
- And a button allowing me to add a new address,
- Scenario 02 : Adding a Saved Address from Sub-Menu
- Given I am in the "Saved Addresses" sub-menu
- When  I click "Add new address"
- Then I should be able to enter the address details (location (from a modal allowing me to search of choosing from the map), Building, Floor, Door and additional details.).
- And I provide a name for the address
- When I click "Save."
- Then the address should be added to my saved addresses list.
- And a confirmation message should be displayed (Home address updated successfully)
- Scenario 03 : Editing a Saved Address
- Given I am on saved addresses screen
- When I click edit
- Then the fields should become editable inline, And I should be able to save or cancel my changes
- If :
- The edits are saved : Then the address details should be updated in my saved addresses list And a confirmation pop up shows “Address updated successfully.
- I edits are not saved (user leaved the edit screen without saving) then the edits are ignored and values of the address should not change
- edits are canceled then the data should remain as they are without saving the edits
- Scenario 04 : Deleting a Saved Address
- Given I have a saved address in my list.
- When I click delete address
- And I confirm the removal by selecting “delete address”
- Then a pop up screen displays “ Are you sure you want to delete this address?”
- If I click on delete: Then address should be deleted from the saved addresses list
- If I click on “Go back”: Then I should be directed to the saved addresses screen.
- Scenario 05 : Address Validation
- Given I am adding or editing a saved address.
- When I input the data on the form.
- Then system should validate the following :
- 3 digits for the floor and the door
- another limitation for the location name (title) will be decided later
- Scenario 06 : Saved addresses in ride request
- Given I am in booking trip screen on webApp.
- When I click to input Pick-Up/ Drop-off input field
- Then My favorite addresses should be displayed the first on the dropdown addresses list
- Scenario 07 : Saved Addresses Synchronization
- Given I am on the B2B webapp
- When I add a saved address to my rider profile
- Then I should be able to see it when using my rider profile on riderApp (superApp), or B2C webApp
- Note : Following events should be added on this notion page
- Event

---

### CMB-33309: [WEBAPP] Merge Profile Details, Edit, Passwords And settings Sub-Menu

**Status:** To Do | **Priority:** P2 - Medium
**Created:** 2025-12-29

**Description:**
As a B2B WebApp user, I want to view and manage my personal information, company information, and password from a single profile screen, So that I can update my account details easily without navigating between multiple screens.

**Acceptance Criteria:**
- Scenario 01: Profile screen structure
- Given I am logged into the B2B platform
- When I navigate to Account > Profile
- Then I should see a single screen containing the following sections:
- Personal Information
- Company Information
- Editing Password
- Scenario 02: View and edit personal / company information
- Given I am on the Profile screen
- When I view the Personal Information section
- Then I should see my personal details in read-only mode
- And when I click on “Edit”, Then the fields should become editable inline, And I should be able to save or cancel my changes
- Scenario 05: Change password
- Given I am on the Profile screen
- When I navigate to the Login & Access section
- Then I should be able to:
- Enter my current password
- Enter a new password
- Confirm the new password
- And upon submission, the password should be updated if validation rules are met
- Scenario 06: Validation and feedback
- Given I update any profile information
- When the data is invalid or incomplete
- Then I should see clear inline error messages
- And when the update is successful, Then I should receive a confirmation message

---

### CMB-31381: [WEBAPP] Post-Signup Legal Information Upload

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-10-28

**Description:**
As a registered user, I want to be prompted to upload my legal documents right after signing up, so that my identity and business information can be verified by the admin.

**Acceptance Criteria:**
- Scenario 01 : Post-Signup Prompt
- Given a user has successfully completed the signup process,
- When the verification in progress screen appears,
- Then the system should display a button “Legal Document Upload” screen where the user can upload required documents including (depending on each country)
- Legal name *
- Legal billing address
- Headquarters
- Postal code
- And document upload for :
- NIF document
- NIS document
- RC document
- RC document 2(Optional)
- AI document
- And two additional input fields which will allow the user to upload a picture of their ID
- Scenario 02 : Skip Option
- Given a user is on the “Legal Document Upload” screen,
- When the user chooses to skip the upload,
- Then the system should allow them to proceed to their dashboard without uploading any documents.
- Scenario 03 : Later Upload Access
- Given a user skipped document upload during signup,
- When they log in again and access the verification screen (before account activation),
- Then they should see an option to upload their legal documents at any time.
- Scenario 04 : Successful Upload
- Given a user selects and uploads valid legal documents,
- When the upload is completed successfully,
- Then the system should confirm the upload and store the files securely, linking them to the user’s account.
- And I should no longer be able to re-upload different files (until the files are rejected)
- Scenario 05 : Admin Review Visibility
- Given a user has uploaded their legal documents,
- When an admin accesses the admin panel’s verification section,
- Then the uploaded documents and user details should be visible for review, approval, or rejection.
- Scenario 06 : Error Handling
- Given a user tries to upload an invalid file type or exceeds the size limit,
- When they attempt to submit the upload,
- Then the system should display a clear error message and prevent submission
- Scenario 07 : Notifiying Admins on AdminPanel
- Given a user uploaded his legal documents on webApp,
- When Admins login on adminPanel,
- Then they need to see a new notification listed on adminPanel (Business A submitted their legal information for review)
- Scenario 08 : Legal information Approval without Contract status=Pending on Verification Page
- Given a user uploaded his legal documents on webApp (post-signup upload),
- When Admins approves his legal information but a contract is not yet created on adminPanel,
- Then they need to see a banner informing them that their legal information have been approved but a contract is not yet created for them
- Scenario 09 : Legal information Approval with Contract Status=In Review on Verification Page
- When Admins approves his legal information and create a contract for the client on adminPanel,
- Then they need to see two buttons allowing them to upload signed contract and download the unsigned contract
- Scenario 10 : Signed Contract Submission
- Given a contract have been created (contract status= In review) on adminPanel,
- When user uploads successfully the signed contract,
- Then the file should reflect on adminPanel and the user need to see the file uploaded on webApp Verification screen
- Scenario 09 : Post-uploaded legal information Rejection on verification page
- When Admins rejects his legal information,
- Then they need to see a banner informing them that their legal information have been rejected along side the comment added by the admin, and they should see a button allowing them to re-upload their legal information
- Note : This notion page should be updated
- Event
- Scenario 1: Migration of Legal Information
- Given: I am a business user who has migrated from the old B2B platform to the new B2B platform.
- When: The migration process is initiated.
- Then: My legal information, including AI, RC, NIF, NIS, address, postal code, and city, should be migrated to the new platform.
- And: The migration should be done accurately without any loss of data.

---

### CMB-34368: Company legal information is misaligned and incorrectly formatted in the contract

**Status:** Done | **Priority:** P1 - High
**Created:** 2026-01-29

---

### CMB-31556: [ADMINPANEL] Reviewing Legal Documents on AdminPanel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-11-02

**Description:**
As an Admin on the Admin Panel, I need to view legal information that were uploaded from post-signup flow, so that I can edit, add, review, and approve or deny the legal information provided by clients.

**Acceptance Criteria:**
- Scenario 01: Viewing and Editing Legal Information
- Given that I have accessed the Legal Information tab,
- When I select a specific company,
- Then I should be able to view the legal information provided by the client,
- And I should have the option to edit, accept, or reject this information.
- Scenario 03: Editing legal information
- Given that a client has submitted their legal information,
- When I click on the editing Button
- Then I should be able to edit the legal information submitted by the client, by adding files, or removing it, or editing the fields right away
- And the legal information should be automatically approved, and the client should receive a notification and email that their legal information have been approved
- Scenario 04: Approving Legal Information
- Given that a client has submitted their legal information,
- When I review the provided details,
- Then I should have the option to approve the information,
- And the client should receive a notification of the approval.
- Scenario 05: Legal Information Upload Notification
- Given I am an admin on adminPanel and legal documents have been uploaded for a business,
- When I access the notification section,
- Then I should see the following information : legal documents for business X have been uploaded by : Y
- And :
- X = Business Name
- Y = BAM full name
- Scenario 06: Clicking on the Notification Displayed on adminPanel
- Given I am an admin on adminPanel,
- When I click on a notification dedicated for legal documents upload ,
- Then I should be redirected to the screen for ‘Review legal information’

---

### CMB-29520: B2B Leads Management

**Status:** Done | **Priority:** No Priority
**Created:** 2025-09-04

**Description:**
As an "Inside Sales" admin, I need to view and manage my assigned leads, so I can track all relevant information and convert them into business accounts.

**Acceptance Criteria:**
- Scenario: New leads from website/marketing campaign
- Given a user fills out a form on the 🔎 Yassir.com website or a marketing campaign landing page
- When the user submits the form.
- Then a new lead is created and listed on the Leads Management section.
- And a tag should be displayed on the lead's profile to identify its source (e.g., "Website" or "Marketing Campaign").
- Scenario: Labelling new leads
- Given the user submits the form.
- When a new lead is created and listed on the Leads Management section.
- Then a tag should be displayed on the lead's profile to identify its source
- Website
- Marketing Campaign.
- Scenario: Tracking lead statuses and transitions
- Given a lead is in a specific status (e.g., "New").
- When I take action on the lead,
- Then I should be able to update their status through defined stages described on this US
- And a log of the status change should be recorded and displayed.
- Scenario: Converting a lead into a business account
- Given I have a lead that has reached the "Open Deal" status and has been closed successfully.
- When I change the lead's status to "Won".
- Then the lead is automatically moved from the Leads Management section to the "Companies" section.
- And a clear identifier (e.g., a label or icon) is displayed on the company's profile to indicate that it was sourced from a lead and which admin gained the deal.
- Scenario: Filtering leads by city/name
- Given I am on the Leads Management dashboard.
- When I use the search bar.
- Then I should be able to search for leads by city or name.

---

### CMB-28833: Signup Screen Carousel Update

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-08-17

**Description:**
As a new user, I want to see a visual preview of the platform's features and design while I'm signing up, so that I can get an immediate sense of the web app's value and feel more confident about creating an account.

**Acceptance Criteria:**
- Scenario 01 : Initial display of the carousel
- Given I am on the signup screen.
- Then a horizontal carousel with three mockup images should be displayed next to the signup form. And three clickable dot indicators should be visible at the bottom of the carousel. And the first dot should be visually highlighted to indicate the active image.
- Scenario 02 : Carousel auto-scrolls
- Given I have not manually interacted with the carousel.
- When 5 seconds have passed.
- Then the carousel should automatically transition to the next image.
- Scenario 03 : Navigating with arrow buttons
- Given I am viewing an image in the carousel.
- When I click the left or right arrow button.
- Then the carousel should move to the next or previous image. And the active dot indicator should update to reflect the new image. And the 5-second auto-scroll timer should reset.
- Scenario 04 : Navigating with dot indicators
- Given I am viewing an image in the carousel.
- When I click on a dot indicator.
- Then the carousel should immediately transition to the image corresponding to the clicked dot. And the new dot should become visually highlighted. And the 5-second auto-scroll timer should reset.
- Scenario 05 : Responsive behavior
- Given I am viewing the signup page on a mobile device.
- When the screen size changes.
- Then the carousel and its contents should adapt gracefully to ensure full visibility and usability.
- Scenario 06 : Login and forget passwords Screen Update
- Given I am on the B2B platform.
- When I access the signin.
- Then the login and forget password page should be updated.
- Scenario 07 : Updating GA event accordingly
- Given the screens are up tp date.
- Then Ga event should be updated following the new screens.
- Note :
- Carousel Mockups : https://drive.google.com/drive/folders/1x8ghFutQm2JFlcEac0d6iDxjF4hWJG43?usp=sharing
- Text To be included on each Mockup : https://www.canva.com/design/DAGtso7UFYc/Lb1eFOrNN2AAwmUzcoQJXQ/edit?utm_content=DAGtso7UFYc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

---

### CMB-17183: CLONE - Password Protection Bypassed - stg-b2b-web.yassir.io

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-08-21

**Description:**
The Yassir B2B web application contains a vulnerability in its password change functionality that allows an attacker to bypass the current password requirement. Typically, when a user wishes to change their password, they must first validate their current password. This validation process generates a changePasswordToken, which is required to successfully update the password.

**Acceptance Criteria:**
- Navigate to the password change page at https://stg-b2b-web.yassir.io/dashboard/profile/change-password.
- Observe that the application requires the current password to generate a changePasswordToken.
- When the user submits the current password, the following POST request is made:
- This request validates the current password and, upon success, returns a changePasswordToken that is required for the subsequent password update.
- After the password is validated, a token is returned in the response:
- Instead of using the changePasswordToken, insert a valid JWT in both the Authorization header and in place of the changePasswordToken in the next request:
- The password will be changed successfully without needing to enter the current password.
- Token Validation: The changePasswordToken should be a unique, single-use token generated for each password change request. It must be securely stored server-side and validated against the user's session. The token should not be replaceable by a JWT or any other reusable token.
- Restrict JWT Usage: Ensure that JWTs are only used for authentication and authorization purposes and not as a substitute for other security tokens like the changePasswordToken.

---

### CMB-25975: Updating admin's access-Admin Panel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-05-26

**Description:**
As an admin on the admin panel, I want to be able to update the user's information field, as well as BAM information through the admin panel, so that I can ensure their contact information is accurate for communication and account recovery.

**Acceptance Criteria:**
- Scenario 1: Successful update of a user's phone number/Email
- Given I am logged in the admin panel
- And I navigate to the user’s management section
- And given the information field of the users is visible and editable.
- When I click on the “Edit” icon
- And I enter a valid new phone number in the "Phone Number" field.
- And I click the "Update" button.
- Then the user's phone number in the database is successfully updated to the new value.
- And a success message ("User’s information has been updated successfully") is displayed to me.
- And a record of this update, including my ID, timestamp, the user's ID, and the previous and new phone number, is logged in the audit log into the transactions table.
- Scenario 2: Attempt to update with an invalid phone number or email format.
- Given I am logged in as an administrator on the Yassir for Business admin panel and am editing a user's phone number.
- When I enter an invalid phone number format in the "Phone Number" field.
- And I click the "Update" button.
- Then a clear error message is displayed, indicating that the phone number format is incorrect “Please enter a valid phone number to proceed.”
- And the user's phone number is not updated.
- And a record of this failed attempt, including the invalid format, is logged in the transaction table.
- Scenario 3: Update Business Account Manager Phone Number
- As an administrator, I want to be able to update a business account manager's phone number through the admin panel so that I can ensure their contact information is accurate for internal communication and support.
- Given I am logged in the admin panel
- When I navigate to a specific business account manager's profile.
- Then the information field of the BAM should be visible and editable.
- When I enter a valid new phone number in the "Phone Number" field, email, or name
- And I click the "Save" or "Update" button.
- Then the business account manager's information in the database is successfully updated to the new value.
- And a success message ( "The user’s details have been updated successfully") is displayed to me.
- And a record of this update, including my ID, timestamp, the business account manager's ID, and the previous and new phone number, is logged in the transactions table.

---

### CMB-12773: CHROME - WEBAPP - STAGING: The user can use previous password to access webapp

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-02-26

---

### CMB-23264: B2C: My account setup on Yassir web panel

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-03-02

**Description:**
As a user, using the Yassir web panel to take a ride, I want a robust and intuitive profile section that allows me to manage my account, access personalized promotions, receive seamless support, and control my data privacy, so that I can have a seamless, secure, and rewarding experience while using Yassir's ride-hailing services directly from the website.

**Acceptance Criteria:**
- My Account section:
- Scenario 1:
- Given I am in Yassir ride on the Yassir website,
- When I click on the profile icon on the top right of the screen
- Then I should see the “My Account” section displayed in the dropdown menu
- When I click on the "My account" section.
- Then I should be redirected to a new page with the following tabs:
- A section for “Personal info”
- A section for “Saved addresses”
- Scenario 2: Enter my personal information
- When I can click on the personal information tab to enter my personal information
- And I click on the tab: Name, email address, phone number, date of birth or gender
- Then I should add the information on each tab
- If I click on the "Save” button
- Then my personal information should be added
- And a confirmation message should be displayed (Your personal information has been successfully updated)
- If I click on cancel
- Then my personal information is not updated
- Scenario 3: Edit personal information
- Given I click on the personal information tab
- And I want to modify (Name, email address, date of birth and gender)
- Then I should add the new information on each tab
- When I click on the "Edit” button
- Then my personal information should be updated with the new information
- And a confirmation message should be displayed (Your personal information has been successfully updated)
- Scenario 4: Validation Errors
- Given I am editing my personal information.
- When I enter an invalid email address or phone number.
- And I click "Edit"
- Then an error message should be displayed, asking me to try again
- And I can’t edit my information until I add the correct info.
- Discounts section:
- Given I am in Yassir ride on the Yassir website,
- When I click on the profile icon on the top right of the screen
- Then I should see the “Discounts” section displayed in the dropdown menu.
- When I click on “Discounts”
- Then a new tab appears that includes the discount list
- Support section :
- Given I am in Yassir ride on the Yassir website,
- When I click on the profile icon on the top right of the screen
- Then I should see the “Support” section displayed in the dropdown menu.
- When I click on “Support”
- Then I should be redirected to a new page.
- Data and privacy section:
- Given I am in Yassir ride on the Yassir website,
- When I click on the profile icon on the top right of the screen
- Then I should see the “Data & Privacy” section displayed in the dropdown menu.
- When I click on “Data & Privacy”
- Then I should be redirected to the Terms of Use page on the Yassir website
- Terms of use link: https://yassir.com/terms-of-use
- Logout section:
- Given I am on the Yassir ride on the Yassir website,
- When I click on the profile icon on the top right
- Then I should see the “Logout” button displayed in the dropdown menu
- When I click on the “Logout” button
- Then a confirmation screen should appear with the following:
- A clear message like: "Are you sure you want to log out?"
- Two buttons: "Logout" and "Cancel"
- And Given that I click on the "Logout" button,
- Then I should be logged out of my Yassir Web account and redirected to the login page.
- And Given that I click the "Cancel" button,
- Then the confirmation dialog should close, and I should remain logged into my Yassir Web account, returning to the page I was previously viewing.

---

### CMB-22547: Trip details overlay screen

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-02-10

**Description:**
As a business account manager using the Yassir for Business platform, I want to be able to view the details of each trip I make,  so that I can review my travel history, expenses, and routes

**Acceptance Criteria:**
- Scenario 1: Accessing Trip History
- Given that I am logged into the Yassir for Business platform,
- When I navigate to the trip history screen,
- Then I should be able to access a list of all past trips.
- Scenario 2: Displaying trip history
- Given that I am viewing my previous trips,
- When I click on a trip
- Then an overlay screen appears, displaying the trip details.
- If I ended a trip in one of the multi-stops
- Then the other stops should be strikethrough
- And a tag showing Final stop (Design in progress)
- Scenario 3: If the trip is completed
- Given I am logged in to the Yassir for Business platform,
- When I navigate to the trips section
- And I click on a completed trip in the history list list of trips
- Then an overlay screen appears, displaying the following completed trip details:
- A map showing the trip route (Start and end point)
- The status of the trip showing completed
- The date and time of the trip
- Service type and price
- Driver details (Driver name, car type, license plate etc…)
- Itinerary (Including the multi-stops)
- Rider name +(The program and group the user is attached to)
- Any relevant trip ID or reference number that should be included
- A request again button
- Close button, to close the tab
- Scenario 4: If the trip is pending:
- Given I am logged in and have a trip that is currently pending (not yet finished)
- When I navigate to the trips section
- And I click on the pending trip in the list
- Then an overlay screen appears, displaying the pending trip details.
- The overlay screen shows the following information:
- A map showing the pick-up location and the estimated time of arrival to the destination
- Any relevant trip ID or reference number that should be included
- The status of the trip is showing “Pending”
- The service type and price
- Driver details (Driver name, car type, car color, license plate, rating, contact information)
- Rider name with phone number + (The program and group the user is attached to)
- Date and time
- Itinerary including the multi-stops
- A button to cancel the trip
- A button to close the tab
- Scenario 5: If the ride was canceled for the following reasons
- If the rider canceled the trip:
- Given I am logged in and have a trip that was previously pending or in progress.
- When I cancel the trip
- Then the trip status is updated to "Canceled"
- If the driver is coming and the rider cancels:
- Given I am logged in and have a trip that is currently in progress (the driver is en route to pickup).
- When I cancel the trip
- And I received a confirmation message that the trip has been canceled.
- Then the canceled trip is displayed in the "Trips" section, clearly marked as canceled.
- If the coming driver cancels:
- Given I am logged in and have a trip that is currently in progress (the driver is en route to pickup).
- And the driver cancels the trip
- Then the trip status is updated to "Canceled"
- And I, as the rider, receive a notification in-app message that the trip has been canceled by the driver.
- If the trip was not accepted:
- Given I am logged in and have requested a trip.
- When the trip request is reviewed by a program moderator (and the platform requires moderator approval before approving a trip).
- And the moderator declines or does not accept the trip request.
- Then the trip status is updated to "Not Accepted" or "Declined"
- Scenario 6: If there is no driver nearby
- Given I am logged in and have requested a trip.
- And no drivers are found within a reasonable radius or timeframe.
- Then I, as the rider can see on the trip history that no drivers were available available.

---

### CMB-4187: Design- Enter Pickup and Destination

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-16

**Description:**
As a business account manager, I want to be able to enter pickup and destination points for a trip, so that I can get an estimate of the trip cost and plan accordingly.

**Acceptance Criteria:**
- The user should be able to enter pickup and destination points in the app.
- The app should show the estimated cost of the trip based on the entered points.
- The estimate should be calculated in real-time and take into account the distance and any applicable inflation and deflation values
- The user should also have the option to use a pin and map to select pickup and destination points.
- Scenarios:
- Given *the user has opened the app and is logged in as a business account manager,
- When *the user selects the option to create a new trip,
- Then *the app should display a screen where the user can enter the pickup and destination points, and see the estimated cost of the trip.
- Given *the user wants to use the pin and map to select pickup and destination points,
- When *the user selects the map option,
- Then *the app should display a map with pins that the user can use to select the pickup and destination points.
- Given *the user has entered pickup and destination points for a trip,
- When *the user checks the trip cost
- Then *the trip cost estimate must be made according to the price of the service chosen and apply all surge rules to it
- Given *the user has entered pickup and destination points for a trip and selected a service option,
- When *entered locations aren't according to the program rules
- Then *the app should block him from booking the trip

---

### CMB-1519: Dev - FE: rider invitation confirmation

**Status:** Done | **Priority:** No Priority
**Created:** 2022-10-27

**Description:**
As a Rider who have signed in using the link been sent to my email, I need to be able to receive an email on my inbox informing me that my account been made successfuly

---

### CMB-189: As a business account manager I need to be able to access my profile setting so that I can edit my name, phone number, business email, and company name

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- The user needs to be able to change:
- Business Email
- Password
- Phone Number
- Name
- Company Name
- This data can’t be changed or saved unless the user would submit and confirm on submitting
- For changing email address, we need to verify the new email the user entered
- For Changing Password we need to ask the user to enter his old password and to confirm on the new password

---

### CMB-5283: Cancel Pending Trip 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-04-26

**Description:**
As a Business Account Manager (BAM), I want to be able to cancel a trip when it is in any of those statuses PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED.

**Acceptance Criteria:**
- The trip can be canceled if it's in one of the following statuses for instant bookings: PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED.
- When the trip is canceled, the app should stop searching for a driver.
- The trip can be canceled if it's in one of the following statuses for scheduled trips: BOOK_ACCEPTED, BOOK_ASSIGNED, BOOK_CONFIRMED.
- The trip cannot be canceled once it has started.
- The trip should be removed from the Ongoing Trips list. when it’s canceled
- The canceled trip should appear in the Trips list as a canceled trip.
- The Budget must be refunded in case it was deducted
- Scenario 1: Canceling an instant trip in an eligible status
- Given that I am a BAM on the Book Rider screen, And I have selected an instant trip in one of the following statuses: PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED,
- When I click on the "Cancel Trip" button,
- Then the app should cancel the trip, refund the trip cost to the budget, and update the trip status to "canceled" in the Trips list.
- Scenario 2: Canceling a scheduled trip in an eligible status
- Given that I am a BAM on the Book Rider screen, And I have selected a scheduled trip in one of the following statuses: BOOK_ACCEPTED, BOOK_ASSIGNED, BOOK_CONFIRMED, PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED,
- When I click on the "Cancel Trip" button,
- Then the app should cancel the trip, refund the trip cost to the budget, and update the trip status to "canceled" in the Trips list.
- Scenario 3: Trying to cancel a non-pending trip
- Given that I am a BAM on the Book Rider screen,
- When I select a trip with the status  "STARTED" and try to click on the "Cancel Trip" button,
- Then the "Cancel Trip" button should be disabled, and I should not be able to cancel the trip.
- Scenario 4: Refunding the budget after canceling a pending trip
- Given that I am a BAM on the Book Rider screen, And I have selected a trip with any status BOOK_ACCEPTED, BOOK_ASSIGNED, BOOK_CONFIRMED, PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED, that has already deducted the trip cost from the budget,
- When I click on the "Cancel Trip" button,
- Then the app should stop searching for a driver, remove the trip from the Ongoing Trips list, add the trip to the Trips list as a canceled trip, and refund the trip cost to the budget.

---

### CMB-3225: BAM Logout

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-01

**Description:**
As a business account manager I need to be able to access my profile setting so that I can logout my account

**Acceptance Criteria:**
- User needs to confirm on logout

---

### CMB-3233: Dev BE: BAM Logout

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-01

**Description:**
As a business account manager I need to be able to access my profile setting so that I can logout my account

**Acceptance Criteria:**
- User needs to confirm on logout

---

### CMB-3232: Design: BAM Logout

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-01

**Description:**
As a business account manager I need to be able to access my profile setting so that I can logout my account

**Acceptance Criteria:**
- User needs to confirm on logout

---

### CMB-4720: Choosing a Language of Preference 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-04-06

**Description:**
As a Business Account Manager of the Yassir Go for B2B web app, I want to be able to select my language preference from my profile section, so that I can receive all reports and emails in my chosen language, with French being the default language preference.

**Acceptance Criteria:**
- The Business Account Manager's profile section should display a language preference selection option.
- The language preference selection option should provide choices for  English, and French.
- The default language preference should be set to French.
- When a Business Account Manager selects a language preference, all future reports and emails should be sent in the chosen language.
- The web app should save the selected language preference for the Business Account Manager's profile.
- Scenario 1: Viewing the language preference selection in the profile section
- Given: I am a Business Account Manager viewing my profile section in the Yassir Go for B2B web app
- When: I navigate to the language preference option
- Then: I should see choices for English, and French
- Scenario 2: Selecting a language preference for reports and emails
- Given: I am a Business Account Manager viewing the language preference selection in my profile section
- When: I choose a language preference
- Then: The web app should save my selection
- And: All future reports and emails should be sent to me in my chosen language
- Scenario 3: Default language preference for new Business Account Managers
- Given: I am a new Business Account Manager who has not yet selected a language preference
- When: I view the language preference selection in my profile section
- Then: The default language preference should be set to French
- Scenario 4: Verifying the language of received reports and emails
- Given: I am a Business Account Manager who has selected a language preference from my profile section
- When: I receive reports and emails from the Yassir Go for B2B web app
- Then: The reports and emails should be in my chosen language

---

### CMB-499: Design: Group Naming

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-08-30

**Description:**
As a business account manager, I want to be able to give a name to every group so that it would be easier for me to navigate between them

**Acceptance Criteria:**
- Names should start with letters
- Names fields need to be limited to a number of characters

---

### CMB-3723: FAQ

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-28

**Description:**
As a business account manager I need to be able to find FAQ section so that I can find help on my own so quickly

---

### CMB-6717: Add Admin Phone Number

**Status:** Done | **Priority:** No Priority
**Created:** 2023-06-19

**Description:**
As a Super Admin, I want to be able to add a phone number for an Admin on the Admins list, so that I can assign them as a Key Account Manager for the enterprises within the business they are working with.

**Acceptance Criteria:**
- The Super Admin can access the Admins list in the Admin Panel.
- The Super Admin can select a specific Admin from the list. A pop will show where he can write the admin his phone number
- The Super Admin can add a phone number for the selected Admin.
- The Super Admin can choose the country code key for the phone number.
- The phone number field accepts numerical input only.
- The phone number is saved and associated with the selected Admin's profile.
- Given-When-Then Scenarios:
- Scenario 1: Super Admin Accesses Admins List
- Given the Super Admin is logged into the Admin Panel
- When the Super Admin navigates to the Admins list
- Then the Super Admin can view the list of Admins
- Scenario 2: Super Admin Selects an Admin
- Given the Super, Admin is on the Admins list
- And there is at least one Admin on the list
- When the Super Admin selects a specific Admin
- Then the selected Admin's details are displayed
- Scenario 3: Super Admin Adds Phone Number for Admin
- Given the Super, Admin is on the selected Admin's details page
- When the Super Admin enters a phone number in the designated field
- And selects the country code key for the phone number
- And saves the changes
- Then the phone number is associated with the selected Admin's profile

---

### CMB-9573: Deduct Taxes if Enabled 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-09

**Description:**
As a Business Account Manager (BAM) with the Taxes option enabled by default, I want taxes to be deducted from each trip cost right after the trip is requested.

**Acceptance Criteria:**
- Given that I am a BAM with the Taxes option enabled when a trip is completed, the system should automatically calculate and deduct the appropriate taxes based on the country of operation.
- Given that I am estimating the cost of a trip, the system should include the applicable taxes in the estimated trip cost to provide an accurate budget projection.
- Given that I am generating invoices for trips, the invoice should accurately reflect the trip cost, including any applicable B2B taxes, and be exportable in a clear format for financial record-keeping.
- Scenario: Automatic Tax Deduction
- Given: I am a BAM with the Taxes option enabled.
- When: A trip is completed.
- Then: The system should automatically calculate and deduct the appropriate taxes based on the country of operation.
- Scenario: Including Taxes in Cost Estimates
- Given: I am estimating the cost of a trip.
- When: I calculate the estimated trip cost.
- Then: The system should include the applicable taxes in the estimated trip cost to provide an accurate budget projection.
- Scenario: Accurate Invoices with Taxes
- Given: I am generating invoices for trips.
- When: I generate an invoice for a completed trip.
- Then: The invoice should accurately reflect the trip cost, including any applicable taxes, and should be exportable in a clear format for financial record-keeping.

---

### CMB-9829: Register with an E-mail with Special Charcter 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-18

**Description:**
As a Business Account Manager (BAM) or Business Rider registering on the B2B Web App, I want the ability to use special characters in my email names without encountering any error messages.

**Acceptance Criteria:**
- Scenario 1: Registering with Email Including Special Characters
- Given I am a new user (BAM or Business Rider) registering on the B2B Web App,
- When I enter my email address with special characters in the name part (e.g., john.doe+business@example.com),
- Then the registration process should proceed without any error messages related to the email format.
- Scenario 2: Confirmation Email
- Given I have successfully registered with an email including special characters,
- When I receive a confirmation email for my registration,
- Then the email should display my registered email address correctly, including the special characters used in the name.
- Scenario 3: Logging In
- Given I have registered with an email containing special characters,
- When I log in to the B2B Web App using my registered email and password,
- Then I should be able to access my account without any issues or errors related to the email format.
- Scenario 4: User-Friendly Error Messages
- Given I enter an email address that doesn't follow email format rules (e.g., missing "@" symbol),
- When I submit my registration details,
- Then if there are any errors, the error messages should be user-friendly and clearly indicate the issue (e.g., "Invalid email format") without specifically targeting the use of special characters in the name.
- Scenario 5: Consistency in Handling Special Characters
- Given Special characters are allowed in email names during registration,
- When I use special characters in my email address,
- Then the system should treat email addresses with special characters consistently throughout the registration process, including confirmation emails and login.

---

### CMB-9947: Rebranding Emails

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-23

**Description:**
As a Business Account Manager (BAM), I want to receive all communication emails from Yassir rebranded with the new Yassir logo and colors.

**Acceptance Criteria:**
- Scenario 1: User Invitation Email
- Given that I am a BAM using the Yassir platform,
- When I receive an email invitation to join Yassir as a Business Rider or Admin,
- Then the email should display the new Yassir logo and use the updated Yassir brand colors.
- Scenario 2: Verification Email
- Given that I am a BAM or a Business Rider in the verification process,
- When I receive an email requiring verification of my account,
- Then the email should feature the new Yassir logo and utilize the revised Yassir brand colors.
- Scenario 3: Budget Alert Email
- Given that I have set budget alerts for my business account,
- When I receive an email alerting me about budget consumption or limits,
- Then the email should showcase the new Yassir logo and incorporate the updated Yassir brand colors.
- Scenario 4: Invoices Email
- Given that I receive an email containing invoices for my business trips,
- When I open the email to view and download the invoices,
- Then the email should include the new Yassir logo and adhere to the revised Yassir brand colors.
- Scenario 5: Consistency Across Emails
- Given that I interact with various Yassir emails,
- When I receive any other communication emails from Yassir (e.g., support, notifications),
- Then these emails should consistently feature the new Yassir logo and use the updated Yassir brand colors.

---

### CMB-8394: Forget Password Flow Arabic Version

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-08-16

**Description:**
As a business account manager (BAM), I want to be able to switch the language to Arabic while going through the "Forgot Password" flow.

**Acceptance Criteria:**
- Given that I am on the "Forgot Password" flow of the B2B web application, when I access the language switch buuton, I should find an option to switch to the Arabic language.
- Given that I am on the "Forgot Password" flow and I choose the Arabic language option, when I select it, the entire interface layout should transform to RTL, ensuring proper alignment and design adjustments.
- Given that I am on the "Forgot Password" flow and I choose the Arabic language option, when I encounter any displayed text, such as headings, labels, or instructions, the text should appear in Arabic characters and be aligned from right to left.
- Given that I am on the "Forgot Password" flow and I have switched to Arabic, when I enter any necessary information (e.g., email address) into input fields, the input text direction should be from left to right.
- Given that I am on the "Forgot Password" flow in Arabic mode, when I click on action buttons (e.g., "Reset Password," "Back to Login"), the button labels should be displayed in Arabic text.
- Scenarios:
- Scenario 1: Switching to Arabic Language
- Given: I am on the "Forgot Password" flow of the B2B web application
- And: I navigate to the language settings
- When: I choose the Arabic language option
- Then: The interface layout transforms to RTL and all displayed text switches to Arabic.
- Scenario 2: Viewing Arabic Text Display
- Given: I am on the "Forgot Password" flow in Arabic mode
- When: I encounter any displayed text, such as instructions or labels
- Then: The text should be in Arabic characters and aligned from right to left.
- Scenario 3: Entering Input Text
- Given: I am on the "Forgot Password" flow in Arabic mode
- When: I enter any required information (e.g., email address) into input fields
- Then: The input text direction should be from left to right
- Scenario 4: Interacting with Action Buttons
- Given: I am on the "Forgot Password" flow in Arabic mode
- When: I click on action buttons (e.g., "Reset Password," "Back to Login")
- Then: The button labels should be displayed in Arabic text.

---

### CMB-9735: Invitation VIA Link from main screen

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-10-16

**Description:**
As a Business Account Manager (BAM), I want the capability to generate a shareable invitation link that I can send to potential Business Riders.

**Acceptance Criteria:**
- Scenario 1: Generating an Invitation Link
- Given I am a BAM logged into the platform,
- When I navigate to the group management page and select a specific group,
- And I choose to invite riders to this group,
- Then I should find an option to generate a shareable invitation link.
- Scenario 2: Sharing the Invitation Link
- Given I have generated an invitation link,
- When I click on the link,
- Then it should be copied to my clipboard for easy sharing.
- Scenario 3: Non-Invited Rider Accesses the Link
- Given I am a potential Business Rider who receives the invitation link,
- When I open the link,
- Then I should be directed to a registration page where I can enter my information, including first name, last name, email address, and phone number so that I can have a business rider account
- Scenario 4: Providing User Information
- Given I am on the registration page after opening the link,
- When I enter my details as required,
- Then the system should use this information to create my Business Rider account and immediately add me to the specified business group.
- Scenario 6: Link Expiration Upon Successful Registration
- When a potential Business Rider successfully registers using the link and becomes a member of the specified group,
- Then the link should automatically expire.
- Scenario 7: Link Expiration After 72 Hours
- When the link remains unused for 72 hours after generation,
- Then the link should automatically expire, regardless of whether it has been used or not.
- Scenario 8: Regenerating New Links for Different Groups
- Given I have generated an invitation link for a group - Group X-
- When I try to generate a new link for a different group - Group Y-
- Then I need this newly generated link, to overwrite the previous link on the UI level, yet the already generated link won’t expire
- Scenario 9: Regenerating New Links for Same Group
- When I try to generate a new link for the same group - Group X-
- Then  I need this newly generated link, to overwrite the previous link on the UI level, yet the already generated link won’t expire until it finishes the 72H
- Scenario 10: Generating Links by Different Admins, and BAM
- Given A BAM have generated an invitation link for a group - Group X-
- When Another Admin tries to generate a new link for the same group - Group X-
- Then  I need this newly generated link, to be visible for the the only admin who created this link, and the other generated links will remain as it’s for the other users
- Scenario 11: Expiring The link when the Group is deleted
- When the BAM removed this group and migrated the user to a different group
- Then  The previously generated link should be expired
- Scenario 1: Choosing a Group from the Drop-Down List
- Given I am a Business Account Manager (BAM) on the Rider's invitation screen,
- When I access the drop-down list of groups within the business,
- Then I should see a list of all existing groups.
- Scenario 2: Selecting a Group for Invitations
- Given I have accessed the drop-down list of groups,
- When I choose a specific group from the list,
- Then any Business Riders I invite, whether by email, CSV file, or shareable link (It will be done on a different US), should be assigned to the selected group upon registration.
- Scenario 3: Default Group Selection
- Given I am on the Riders invitation screen,
- When I don't select a specific group from the drop-down list,
- Then any users I invite will be placed in the default group by default.

---

### CMB-10807: Add Negative Commission

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-11-27

**Description:**
As an Operations (OPs) Manager with access to the Admin panel, I need the ability to enter negative commission values when configuring a company's commission settings. This is necessary to ensure that the total trip cost, after applying commissions, can be less than the original trip price.

**Acceptance Criteria:**
- When configuring commission settings, the system should allow OP managers to enter negative commission values.
- The system should accept and store negative commission values without errors or warnings.
- Negative commissions should be applied appropriately to the total trip cost when calculating the final cost of trips associated with the company.
- OP managers should be able to update, modify, or remove negative commission values as needed for the company's commission settings.
- the values of negative commission can go up to -100%
- Scenario 1: Entering Negative Commission Value
- Given: I am logged into the Yassir Admin panel as an Operations (OPs) Manager.
- When: I navigate to the commission settings for a specific company.
- Then: I should be able to enter a negative commission value (e.g., -10%) into the designated field for that company.
- Scenario 2: Saving Negative Commission Value
- Given: I have entered a negative commission value for a company in the commission settings on the Yassir Admin panel.
- When: I click the "Save" or "Update" button to confirm the changes.
- Then: The system should accept and save the negative commission value without generating any errors.
- Scenario 3: Applying Negative Commission to Trip Cost
- Given: I have configured a negative commission value for a company in the Admin panel.
- And: A trip associated with that company is booked.
- When: The trip cost is calculated and commissions are applied.
- Then: The negative commission should reduce the total trip cost below the original trip price.
- Scenario 4: Updating Negative Commission Value
- Given: I have previously configured a negative commission value for a company in the Admin panel.
- When: I revisit the commission settings for that company and modify the negative commission value.
- Then: The system should allow me to update the negative commission value as needed.
- Scenario 5: Removing Negative Commission Value
- Given: I have previously configured a negative commission value for a company in the Admin panel.
- When: I revisit the commission settings for that company and remove the negative commission value (set it to 0%).
- Then: The system should accept the change and effectively remove the negative commission.By covering these scenarios, the system ensures that Operations Managers can effectively use negative commissions in the Admin panel while maintaining the integrity of financial calculations and reporting.

---

### CMB-9911: General Support Information

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-20

**Description:**
As an Operations (OP) Manager using the Admin Panel, I want the ability to access and set the general support information in the company settings details.

**Acceptance Criteria:**
- Scenario 1: Accessing General Support Information
- Given that I am logged into the Admin Panel as an OP Manager,
- When I navigate to the Company Setting tab within company details.
- Then I should find a dedicated tab or option labeled "Default Support Information."
- Support Email:
- team-cs-b2b-yassir@yassir.com
- +213 21999995

---

### CMB-11736: Track Password Screen

**Status:** Done | **Priority:** No Priority
**Created:** 2024-01-12

**Description:**
B2B_SC_SetupPasswordScreenSessions

---

### CMB-13285: Business Account Manager Fills his legal data in Algeria, Morocco, Senegal, and Tunisia 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-20

**Description:**
As a Business Account Manager (BAM) on the Yassir for Business web app,

**Acceptance Criteria:**
- Scenario 1: Accessing the Legal Information Section
- Given that I am logged into the Yassir for Business web app as a BAM,
- When I navigate to the settings menu,
- Then I should find a section labeled "Legal Information".
- Scenario 2: Adding Legal Information for Algeria
- Given that my business is located in Algeria,
- When I access the Legal Information section,
- Then I should be able to add the following fields:
- Legal Company Name
- Legal Billing Address
- Postal Code
- And I should be able to upload relevant documents.
- Scenario 3: Adding Legal Information for Senegal
- Given that my business is located in Senegal,
- When I access the Legal Information section,
- Then I should be able to add the following fields:
- Legal Company Name
- Legal Billing Address
- Postal Code
- NINEA
- Company ID
- Scenario 4: Adding Legal Information for Tunisia
- Given that my business is located in Tunisia,
- When I access the Legal Information section,
- Then I should be able to add the following fields:
- Legal Company Name
- Legal Billing Address
- Postal Code
- Tax Number
- Scenario 5: Adding Legal Information for Morocco
- Given that my business is located in Morocco,
- When I access the Legal Information section,
- Then I should be able to add the following fields:
- Legal Company Name
- Legal Billing Address
- Commercial Register
- Scenario 6: Submitting Legal Information for Approval
- Given that I have entered my company's legal information,
- When I click the "Submit" button,
- Then my legal information should be submitted to the Admins on the Admin Panel for approval or denial.
- Scenario 7: Admin Approval or Denial
- Given that I have submitted my legal information,
- When an Admin reviews my submission,
- Then they should be able to approve or deny it.
- And I should receive a notification about the status of my submission. as well as an email informing me about the status, and reason if rejection if any
- Scenario 8: Editing Legal information
- Given that I have submitted my legal information,
- When As a BAM I’m reviewing my legal information, and want to edit a few fields
- Then I should be back to the legal information submitting the screen
- And I should be able to add new information or remove submitted information and add them again
- Scenario 9: Submitting incomplete legal information
- Given that I have submitted my legal information, but I’m missing some fields
- When I click on Submit
- Then I should be able to save this data and wait for approval
- Additional Details:
- The Legal Information section should dynamically display the relevant fields based on the business's country.
- The document upload feature should support common file formats (PDF, JPEG, PNG).

---

### CMB-13099: Profile Section Events

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-12

**Description:**
B2B_SC_ChangePasswordScreenSessions

---

### CMB-13050: Delete Businesses

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-03-11

**Description:**
As an Admin on the admin panel of the business platform, I need to be able to remove an entire business from the settings screen inside the business details screen. This functionality allows for the efficient management of businesses within the platform, enabling me to remove businesses that are no longer active or relevant.

**Acceptance Criteria:**
- Scenario 1: Removing an Entire Business that is inactive
- Given: I am logged into the admin panel of the business platform.
- When: I navigate to the settings screen within the business details section.
- When: I click on the "Remove Business" button.
- Then: A confirmation prompt should appear, asking me to confirm the action. so that the Admin Can confirm or deny the delete action
- Scenario 2: Removing an Entire Business that is active
- Given: I am logged into the admin panel of the business platform.
- When: I navigate to the settings screen within the business details section. for an active business
- Then: I need to find the delete button as disabled
- Scenario 3: Removing an Entire Business with unsettled budget
- Given: I am logged into the admin panel of the business platform.
- When: I navigate to the settings screen within the business details section. for an in-active business, but with an unsettled remaining budget on prepaid, or due budget on postpaid
- Then: I need to find a popup message that will direct me to the payment tab to settle the page
- Scenario 4: a user part of one business and it’s removed
- Given: I am a business account manager, business Admin, or program moderator of a removed business
- When: I navigate to the web app and try to log in with my cred
- Then: I need to find a notification message informing me that the business no longer exists
- Scenario 5: a user is part of more than one business, and a business is removed
- Given: I am a business account manager of removed business
- When: I navigate to the web app and try to log in with my cred
- Then: I need to find that the list of businesses I’m part of doesn’t contain the business that was removed
- Scenario 6: a user is part of one business, and the business is removed, I try to log in with Google
- Given: I am a business account manager of removed business
- When: I navigate to the web app and try to log in with Google
- Then: I need to be directed to create a company flow and verify the phone number
- Scenario 7: As a deleted business inform all users by email
- Given: I am a business account manager, a business rider, a business admin, or a Program Moderator of a removed business
- When: the business is deleted
- Then: I need to receive an email informing me that the business I’m part of has been removed
- Scenario 8: All user's invitations get expired
- Given: I am an invited business rider via link or email
- When: the business is deleted
- Then: I need to find the invitation links on emails, as expired
- Note: the Admin has access to the settings Screen and Payment Tab
- Note in the pop-up that the business shouldn’t have any scheduled trips

---

### CMB-13075: [SPIKE] Delete Business

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-12

**Description:**
Title: Remove Entire Business from Admin Panel Settings

---

### CMB-19277: Create Business Account Manually

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-11-04

**Description:**
As an Admin on the B2B Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Accessing the Create New Business Button
- Given I am logged into the B2B Admin Panel as an Admin,
- When I navigate to the enterprise list screen,
- Then I should find a button labeled "Create New Business."
- Scenario 2: Opening the New Business Creation Pop-Up
- Given I am on the enterprise list screen,
- When I click on the "Create New Business" button,
- Then a pop-up should appear prompting me to enter details for creating a new business account.
- Scenario 3: Input Fields in the New Business Pop-Up
- Given I have opened the new business creation pop-up,
- When I view the form in the pop-up,
- Then I should find the following fields for input:
- Company Name
- Company Industry
- BAM Name
- BAM Title
- BAM Phone Number
- City of Headquarters
- Number of Employees
- BAM Email
- Scenario 4: Mandatory Fields Validation
- Given I am filling out the form in the new business creation pop-up,
- When I attempt to submit the form without filling in all mandatory fields (Company Name, BAM Name, BAM Phone Number, BAM Email),
- Then I should receive an error message indicating that these fields are required.
- Scenario 5: Creating a Business with Unlimited Program
- Given I have entered all required information and submitted the form,
- When I successfully create the business,
- Then the business should be created with an unlimited program by default.
- Scenario 6: Flagging the Business as Manually Created
- Given I have successfully created a new business through the admin panel,
- Then the business record should have a flag indicating that it was manually generated (as opposed to created through the registration flow).
- Scenario 7: BAM Notification Email
- Given I have created a new business,
- When the business creation is complete,
- Then an automated email should be sent to the BAM's provided email address,
- The email should inform the BAM about the creation of their company account on the B2B platform, and it will contain a link where he can set his password for the BAM
- Scenario 8: Activation Status of the Business
- Given I have created a new business, I manually
- When the BAM tries to log in
- Then he should get an activation screen or not, based on his country parameters. so his activation should be checked manually by the Admin on the Admin Panel

---

### CMB-21117: Informing the user to check their email

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-30

**Description:**
As a Business Account Manager trying to register my business for the first time,

**Acceptance Criteria:**
- Scenario 1: Entering Email for Registration
- Given I am on the business registration page,
- When I provide my email address,
- Then I should receive a notification indicating that a verification or notification email has been sent to me.
- Scenario 2: Displaying “Check Your Inbox” Page
- Given my email has been submitted,
- When the system sends a message to my email,
- Then I should be redirected to a page or modal within the registration flow that contains:
- A clear message telling me an email has been sent.
- A call to action prompted me to check my inbox.

---

### CMB-21116: Changing Country Flag of Arabic Language

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-30

**Description:**
As a Business Account Manager in Tunisia, Morocco, or Algeria,

**Acceptance Criteria:**
- Scenario 1: Selecting Arabic Language
- Given I am on the language selection screen,
- When I choose the Arabic language,
- Then the system should detect which country I am from (Tunisia, Morocco, or Algeria),
- And display my country’s flag alongside the Arabic language option.
- Scenario 2: Country-Specific Flag Display
- Given that I am a Business Account Manager in Tunisia, Morocco, or Algeria,
- When Arabic is selected,
- Then the displayed flag should specifically match my country:
- Tunisia’s flag for Tunisian users.
- Morocco’s flag for Moroccan users.
- Algeria’s flag for Algerian users.

---

## Consolidated Acceptance Criteria

- Scenario 01 : Viewing Saved Addresses
- Given I am logged in and navigate to "Account."
- When I view the "Saved Addresses" Sub-menu.
- Then  I should see :
- I should see a list displaying all my saved addresses, along with the address details.
- an empty state -in case no addresses have been added yet-
- And a button allowing me to add a new address,
- Scenario 02 : Adding a Saved Address from Sub-Menu
- Given I am in the "Saved Addresses" sub-menu
- When  I click "Add new address"
- Then I should be able to enter the address details (location (from a modal allowing me to search of choosing from the map), Building, Floor, Door and additional details.).
- And I provide a name for the address
- When I click "Save."
- Then the address should be added to my saved addresses list.
- And a confirmation message should be displayed (Home address updated successfully)
- Scenario 03 : Editing a Saved Address
- Given I am on saved addresses screen
- When I click edit
- Then the fields should become editable inline, And I should be able to save or cancel my changes
- If :
- The edits are saved : Then the address details should be updated in my saved addresses list And a confirmation pop up shows “Address updated successfully.
- I edits are not saved (user leaved the edit screen without saving) then the edits are ignored and values of the address should not change
- edits are canceled then the data should remain as they are without saving the edits
- Scenario 04 : Deleting a Saved Address
- Given I have a saved address in my list.
- When I click delete address
- And I confirm the removal by selecting “delete address”
- Then a pop up screen displays “ Are you sure you want to delete this address?”
- If I click on delete: Then address should be deleted from the saved addresses list
- If I click on “Go back”: Then I should be directed to the saved addresses screen.
- Scenario 05 : Address Validation
- Given I am adding or editing a saved address.
- When I input the data on the form.
- Then system should validate the following :
- 3 digits for the floor and the door
- another limitation for the location name (title) will be decided later
- Scenario 06 : Saved addresses in ride request
- Given I am in booking trip screen on webApp.
- When I click to input Pick-Up/ Drop-off input field
- Then My favorite addresses should be displayed the first on the dropdown addresses list
- Scenario 07 : Saved Addresses Synchronization
- Given I am on the B2B webapp
- When I add a saved address to my rider profile
- Then I should be able to see it when using my rider profile on riderApp (superApp), or B2C webApp
- Note : Following events should be added on this notion page
- Event
- Scenario 01: Profile screen structure
- Given I am logged into the B2B platform
- When I navigate to Account > Profile
- Then I should see a single screen containing the following sections:
- Personal Information
- Company Information
- Editing Password
- Scenario 02: View and edit personal / company information
- Given I am on the Profile screen
- When I view the Personal Information section
- Then I should see my personal details in read-only mode
- And when I click on “Edit”, Then the fields should become editable inline, And I should be able to save or cancel my changes
- Scenario 05: Change password
- When I navigate to the Login & Access section
- Then I should be able to:
- Enter my current password
- Enter a new password
- Confirm the new password
- And upon submission, the password should be updated if validation rules are met
- Scenario 06: Validation and feedback
- Given I update any profile information
- When the data is invalid or incomplete
- Then I should see clear inline error messages
- And when the update is successful, Then I should receive a confirmation message
- Scenario 01 : Post-Signup Prompt
- Given a user has successfully completed the signup process,
- When the verification in progress screen appears,
- Then the system should display a button “Legal Document Upload” screen where the user can upload required documents including (depending on each country)
- Legal name *
- Legal billing address
- Headquarters
- Postal code
- And document upload for :
- NIF document
- NIS document
- RC document
- RC document 2(Optional)
- AI document
- And two additional input fields which will allow the user to upload a picture of their ID
- Scenario 02 : Skip Option
- Given a user is on the “Legal Document Upload” screen,
- When the user chooses to skip the upload,
- Then the system should allow them to proceed to their dashboard without uploading any documents.
- Scenario 03 : Later Upload Access
- Given a user skipped document upload during signup,
- When they log in again and access the verification screen (before account activation),
- Then they should see an option to upload their legal documents at any time.
- Scenario 04 : Successful Upload
- Given a user selects and uploads valid legal documents,
- When the upload is completed successfully,
- Then the system should confirm the upload and store the files securely, linking them to the user’s account.
- And I should no longer be able to re-upload different files (until the files are rejected)
- Scenario 05 : Admin Review Visibility
- Given a user has uploaded their legal documents,
- When an admin accesses the admin panel’s verification section,
- Then the uploaded documents and user details should be visible for review, approval, or rejection.
- Scenario 06 : Error Handling
- Given a user tries to upload an invalid file type or exceeds the size limit,
- When they attempt to submit the upload,
- Then the system should display a clear error message and prevent submission
- Scenario 07 : Notifiying Admins on AdminPanel
- Given a user uploaded his legal documents on webApp,
- When Admins login on adminPanel,
- Then they need to see a new notification listed on adminPanel (Business A submitted their legal information for review)
- Scenario 08 : Legal information Approval without Contract status=Pending on Verification Page
- Given a user uploaded his legal documents on webApp (post-signup upload),
- When Admins approves his legal information but a contract is not yet created on adminPanel,
- Then they need to see a banner informing them that their legal information have been approved but a contract is not yet created for them
- Scenario 09 : Legal information Approval with Contract Status=In Review on Verification Page
- When Admins approves his legal information and create a contract for the client on adminPanel,
- Then they need to see two buttons allowing them to upload signed contract and download the unsigned contract
- Scenario 10 : Signed Contract Submission
- Given a contract have been created (contract status= In review) on adminPanel,
- When user uploads successfully the signed contract,
- Then the file should reflect on adminPanel and the user need to see the file uploaded on webApp Verification screen
- Scenario 09 : Post-uploaded legal information Rejection on verification page
- When Admins rejects his legal information,
- Then they need to see a banner informing them that their legal information have been rejected along side the comment added by the admin, and they should see a button allowing them to re-upload their legal information
- Note : This notion page should be updated
- Scenario 1: Migration of Legal Information
- Given: I am a business user who has migrated from the old B2B platform to the new B2B platform.
- When: The migration process is initiated.
- Then: My legal information, including AI, RC, NIF, NIS, address, postal code, and city, should be migrated to the new platform.
- And: The migration should be done accurately without any loss of data.
- Scenario 01: Viewing and Editing Legal Information
- Given that I have accessed the Legal Information tab,
- When I select a specific company,
- Then I should be able to view the legal information provided by the client,
- And I should have the option to edit, accept, or reject this information.
- Scenario 03: Editing legal information
- Given that a client has submitted their legal information,
- When I click on the editing Button
- Then I should be able to edit the legal information submitted by the client, by adding files, or removing it, or editing the fields right away
- And the legal information should be automatically approved, and the client should receive a notification and email that their legal information have been approved
- Scenario 04: Approving Legal Information
- When I review the provided details,
- Then I should have the option to approve the information,
- And the client should receive a notification of the approval.
- Scenario 05: Legal Information Upload Notification
- Given I am an admin on adminPanel and legal documents have been uploaded for a business,
- When I access the notification section,
- Then I should see the following information : legal documents for business X have been uploaded by : Y
- And :
- X = Business Name
- Y = BAM full name
- Scenario 06: Clicking on the Notification Displayed on adminPanel
- Given I am an admin on adminPanel,
- When I click on a notification dedicated for legal documents upload ,
- Then I should be redirected to the screen for ‘Review legal information’
- Scenario: New leads from website/marketing campaign
- Given a user fills out a form on the 🔎 Yassir.com website or a marketing campaign landing page
- When the user submits the form.
- Then a new lead is created and listed on the Leads Management section.
- And a tag should be displayed on the lead's profile to identify its source (e.g., "Website" or "Marketing Campaign").
- Scenario: Labelling new leads
- Given the user submits the form.
- When a new lead is created and listed on the Leads Management section.
- Then a tag should be displayed on the lead's profile to identify its source
- Website
- Marketing Campaign.
- Scenario: Tracking lead statuses and transitions
- Given a lead is in a specific status (e.g., "New").
- When I take action on the lead,
- Then I should be able to update their status through defined stages described on this US
- And a log of the status change should be recorded and displayed.
- Scenario: Converting a lead into a business account
- Given I have a lead that has reached the "Open Deal" status and has been closed successfully.
- When I change the lead's status to "Won".
- Then the lead is automatically moved from the Leads Management section to the "Companies" section.
- And a clear identifier (e.g., a label or icon) is displayed on the company's profile to indicate that it was sourced from a lead and which admin gained the deal.
- Scenario: Filtering leads by city/name
- Given I am on the Leads Management dashboard.
- When I use the search bar.
- Then I should be able to search for leads by city or name.
- Scenario 01 : Initial display of the carousel
- Given I am on the signup screen.
- Then a horizontal carousel with three mockup images should be displayed next to the signup form. And three clickable dot indicators should be visible at the bottom of the carousel. And the first dot should be visually highlighted to indicate the active image.
- Scenario 02 : Carousel auto-scrolls
- Given I have not manually interacted with the carousel.
- When 5 seconds have passed.
- Then the carousel should automatically transition to the next image.
- Scenario 03 : Navigating with arrow buttons
- Given I am viewing an image in the carousel.
- When I click the left or right arrow button.
- Then the carousel should move to the next or previous image. And the active dot indicator should update to reflect the new image. And the 5-second auto-scroll timer should reset.
- Scenario 04 : Navigating with dot indicators
- When I click on a dot indicator.
- Then the carousel should immediately transition to the image corresponding to the clicked dot. And the new dot should become visually highlighted. And the 5-second auto-scroll timer should reset.
- Scenario 05 : Responsive behavior
- Given I am viewing the signup page on a mobile device.
- When the screen size changes.
- Then the carousel and its contents should adapt gracefully to ensure full visibility and usability.
- Scenario 06 : Login and forget passwords Screen Update
- Given I am on the B2B platform.
- When I access the signin.
- Then the login and forget password page should be updated.
- Scenario 07 : Updating GA event accordingly
- Given the screens are up tp date.
- Then Ga event should be updated following the new screens.
- Note :
- Carousel Mockups : https://drive.google.com/drive/folders/1x8ghFutQm2JFlcEac0d6iDxjF4hWJG43?usp=sharing
- Text To be included on each Mockup : https://www.canva.com/design/DAGtso7UFYc/Lb1eFOrNN2AAwmUzcoQJXQ/edit?utm_content=DAGtso7UFYc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
- Navigate to the password change page at https://stg-b2b-web.yassir.io/dashboard/profile/change-password.
- Observe that the application requires the current password to generate a changePasswordToken.
- When the user submits the current password, the following POST request is made:
- This request validates the current password and, upon success, returns a changePasswordToken that is required for the subsequent password update.
- After the password is validated, a token is returned in the response:
- Instead of using the changePasswordToken, insert a valid JWT in both the Authorization header and in place of the changePasswordToken in the next request:
- The password will be changed successfully without needing to enter the current password.
- Token Validation: The changePasswordToken should be a unique, single-use token generated for each password change request. It must be securely stored server-side and validated against the user's session. The token should not be replaceable by a JWT or any other reusable token.
- Restrict JWT Usage: Ensure that JWTs are only used for authentication and authorization purposes and not as a substitute for other security tokens like the changePasswordToken.
- Scenario 1: Successful update of a user's phone number/Email
- Given I am logged in the admin panel
- And I navigate to the user’s management section
- And given the information field of the users is visible and editable.
- When I click on the “Edit” icon
- And I enter a valid new phone number in the "Phone Number" field.
- And I click the "Update" button.
- Then the user's phone number in the database is successfully updated to the new value.
- And a success message ("User’s information has been updated successfully") is displayed to me.
- And a record of this update, including my ID, timestamp, the user's ID, and the previous and new phone number, is logged in the audit log into the transactions table.
- Scenario 2: Attempt to update with an invalid phone number or email format.
- Given I am logged in as an administrator on the Yassir for Business admin panel and am editing a user's phone number.
- When I enter an invalid phone number format in the "Phone Number" field.
- Then a clear error message is displayed, indicating that the phone number format is incorrect “Please enter a valid phone number to proceed.”
- And the user's phone number is not updated.
- And a record of this failed attempt, including the invalid format, is logged in the transaction table.
- Scenario 3: Update Business Account Manager Phone Number
- As an administrator, I want to be able to update a business account manager's phone number through the admin panel so that I can ensure their contact information is accurate for internal communication and support.
- When I navigate to a specific business account manager's profile.
- Then the information field of the BAM should be visible and editable.
- When I enter a valid new phone number in the "Phone Number" field, email, or name
- And I click the "Save" or "Update" button.
- Then the business account manager's information in the database is successfully updated to the new value.
- And a success message ( "The user’s details have been updated successfully") is displayed to me.
- And a record of this update, including my ID, timestamp, the business account manager's ID, and the previous and new phone number, is logged in the transactions table.
- Scenario 1 (Viewing Saved Addresses):
- Given I am logged in and navigate to "My Account."
- When I view the "Saved Addresses" section.
- Then I should see a list of my saved addresses, displaying their names (e.g., "Home," "Work") and full address details.
- Scenario 2 (Adding a Saved Address):
- Given I am in the "Saved Addresses" section.
- When I click "Add new."
- And I enter the address details (street, Building, Floor, Door and additional details.).
- And I click "Save."
- Scenario 3 (Editing a Saved Address):
- When I select the address and click on the "Edit" button
- Then I modify the address details or the address name.
- And I click "Edit."
- Then the address details should be updated in my saved addresses list
- And a confirmation pop up shows “Home address updated successfully.”
- Scenario 4 (Deleting a Saved Address):
- When I select the address and click delete address
- Then a pop up screen displays “ Are you sure you want to delete “Home” address?”
- If I click on delete:
- Then address should be deleted from the saved addresses list
- If I click on “Go back”:
- Then I should be directed to the saved addresses screen.
- Scenario 5 (Address Validation):
- When I enter an invalid address format.
- Then the "Save" button should be disabled
- Scenario 6 (Favorite addresses in ride request):
- Given I am on the Yassir webapp
- When I enter my departure location
- Then I should see a dropdown showing my saved addresses
- When I select a saved address
- Then it will be added as my departure location
- My Account section:
- Scenario 1:
- Given I am in Yassir ride on the Yassir website,
- When I click on the profile icon on the top right of the screen
- Then I should see the “My Account” section displayed in the dropdown menu
- When I click on the "My account" section.
- Then I should be redirected to a new page with the following tabs:
- A section for “Personal info”
- A section for “Saved addresses”
- Scenario 2: Enter my personal information
- When I can click on the personal information tab to enter my personal information
- And I click on the tab: Name, email address, phone number, date of birth or gender
- Then I should add the information on each tab
- If I click on the "Save” button
- Then my personal information should be added
- And a confirmation message should be displayed (Your personal information has been successfully updated)
- If I click on cancel
- Then my personal information is not updated
- Scenario 3: Edit personal information
- Given I click on the personal information tab
- And I want to modify (Name, email address, date of birth and gender)
- Then I should add the new information on each tab
- When I click on the "Edit” button
- Then my personal information should be updated with the new information
- Scenario 4: Validation Errors
- Given I am editing my personal information.
- When I enter an invalid email address or phone number.
- And I click "Edit"
- Then an error message should be displayed, asking me to try again
- And I can’t edit my information until I add the correct info.
- Discounts section:
- Then I should see the “Discounts” section displayed in the dropdown menu.
- When I click on “Discounts”
- Then a new tab appears that includes the discount list
- Support section :
- Then I should see the “Support” section displayed in the dropdown menu.
- When I click on “Support”
- Then I should be redirected to a new page.
- Data and privacy section:
- Then I should see the “Data & Privacy” section displayed in the dropdown menu.
- When I click on “Data & Privacy”
- Then I should be redirected to the Terms of Use page on the Yassir website
- Terms of use link: https://yassir.com/terms-of-use
- Logout section:
- Given I am on the Yassir ride on the Yassir website,
- When I click on the profile icon on the top right
- Then I should see the “Logout” button displayed in the dropdown menu
- When I click on the “Logout” button
- Then a confirmation screen should appear with the following:
- A clear message like: "Are you sure you want to log out?"
- Two buttons: "Logout" and "Cancel"
- And Given that I click on the "Logout" button,
- Then I should be logged out of my Yassir Web account and redirected to the login page.
- And Given that I click the "Cancel" button,
- Then the confirmation dialog should close, and I should remain logged into my Yassir Web account, returning to the page I was previously viewing.
- Scenario 1: Accessing Trip History
- Given that I am logged into the Yassir for Business platform,
- When I navigate to the trip history screen,
- Then I should be able to access a list of all past trips.
- Scenario 2: Displaying trip history
- Given that I am viewing my previous trips,
- When I click on a trip
- Then an overlay screen appears, displaying the trip details.
- If I ended a trip in one of the multi-stops
- Then the other stops should be strikethrough
- And a tag showing Final stop (Design in progress)
- Scenario 3: If the trip is completed
- Given I am logged in to the Yassir for Business platform,
- When I navigate to the trips section
- And I click on a completed trip in the history list list of trips
- Then an overlay screen appears, displaying the following completed trip details:
- A map showing the trip route (Start and end point)
- The status of the trip showing completed
- The date and time of the trip
- Service type and price
- Driver details (Driver name, car type, license plate etc…)
- Itinerary (Including the multi-stops)
- Rider name +(The program and group the user is attached to)
- Any relevant trip ID or reference number that should be included
- A request again button
- Close button, to close the tab
- Scenario 4: If the trip is pending:
- Given I am logged in and have a trip that is currently pending (not yet finished)
- And I click on the pending trip in the list
- Then an overlay screen appears, displaying the pending trip details.
- The overlay screen shows the following information:
- A map showing the pick-up location and the estimated time of arrival to the destination
- The status of the trip is showing “Pending”
- The service type and price
- Driver details (Driver name, car type, car color, license plate, rating, contact information)
- Rider name with phone number + (The program and group the user is attached to)
- Date and time
- Itinerary including the multi-stops
- A button to cancel the trip
- A button to close the tab
- Scenario 5: If the ride was canceled for the following reasons
- If the rider canceled the trip:
- Given I am logged in and have a trip that was previously pending or in progress.
- When I cancel the trip
- Then the trip status is updated to "Canceled"
- If the driver is coming and the rider cancels:
- Given I am logged in and have a trip that is currently in progress (the driver is en route to pickup).
- And I received a confirmation message that the trip has been canceled.
- Then the canceled trip is displayed in the "Trips" section, clearly marked as canceled.
- If the coming driver cancels:
- And the driver cancels the trip
- And I, as the rider, receive a notification in-app message that the trip has been canceled by the driver.
- If the trip was not accepted:
- Given I am logged in and have requested a trip.
- When the trip request is reviewed by a program moderator (and the platform requires moderator approval before approving a trip).
- And the moderator declines or does not accept the trip request.
- Then the trip status is updated to "Not Accepted" or "Declined"
- Scenario 6: If there is no driver nearby
- And no drivers are found within a reasonable radius or timeframe.
- Then I, as the rider can see on the trip history that no drivers were available available.
- Increase the spacing between the fields to adjust the text
- Change label of upload files to upload file (since we can only upload one file)
- The user should be able to enter pickup and destination points in the app.
- The app should show the estimated cost of the trip based on the entered points.
- The estimate should be calculated in real-time and take into account the distance and any applicable inflation and deflation values
- The user should also have the option to use a pin and map to select pickup and destination points.
- Scenarios:
- Given *the user has opened the app and is logged in as a business account manager,
- When *the user selects the option to create a new trip,
- Then *the app should display a screen where the user can enter the pickup and destination points, and see the estimated cost of the trip.
- Given *the user wants to use the pin and map to select pickup and destination points,
- When *the user selects the map option,
- Then *the app should display a map with pins that the user can use to select the pickup and destination points.
- Given *the user has entered pickup and destination points for a trip,
- When *the user checks the trip cost
- Then *the trip cost estimate must be made according to the price of the service chosen and apply all surge rules to it
- Given *the user has entered pickup and destination points for a trip and selected a service option,
- When *entered locations aren't according to the program rules
- Then *the app should block him from booking the trip
- The user needs to be able to change:
- Business Email
- Password
- Phone Number
- Name
- Company Name
- This data can’t be changed or saved unless the user would submit and confirm on submitting
- For changing email address, we need to verify the new email the user entered
- For Changing Password we need to ask the user to enter his old password and to confirm on the new password
- The trip can be canceled if it's in one of the following statuses for instant bookings: PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED.
- When the trip is canceled, the app should stop searching for a driver.
- The trip can be canceled if it's in one of the following statuses for scheduled trips: BOOK_ACCEPTED, BOOK_ASSIGNED, BOOK_CONFIRMED.
- The trip cannot be canceled once it has started.
- The trip should be removed from the Ongoing Trips list. when it’s canceled
- The canceled trip should appear in the Trips list as a canceled trip.
- The Budget must be refunded in case it was deducted
- Scenario 1: Canceling an instant trip in an eligible status
- Given that I am a BAM on the Book Rider screen, And I have selected an instant trip in one of the following statuses: PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED,
- When I click on the "Cancel Trip" button,
- Then the app should cancel the trip, refund the trip cost to the budget, and update the trip status to "canceled" in the Trips list.
- Scenario 2: Canceling a scheduled trip in an eligible status
- Given that I am a BAM on the Book Rider screen, And I have selected a scheduled trip in one of the following statuses: BOOK_ACCEPTED, BOOK_ASSIGNED, BOOK_CONFIRMED, PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED,
- Scenario 3: Trying to cancel a non-pending trip
- Given that I am a BAM on the Book Rider screen,
- When I select a trip with the status  "STARTED" and try to click on the "Cancel Trip" button,
- Then the "Cancel Trip" button should be disabled, and I should not be able to cancel the trip.
- Scenario 4: Refunding the budget after canceling a pending trip
- Given that I am a BAM on the Book Rider screen, And I have selected a trip with any status BOOK_ACCEPTED, BOOK_ASSIGNED, BOOK_CONFIRMED, PENDING, ACCEPTED, DRIVER_COMING, DRIVER_ARRIVED, that has already deducted the trip cost from the budget,
- Then the app should stop searching for a driver, remove the trip from the Ongoing Trips list, add the trip to the Trips list as a canceled trip, and refund the trip cost to the budget.
- User needs to confirm on logout
- The Business Account Manager's profile section should display a language preference selection option.
- The language preference selection option should provide choices for  English, and French.
- The default language preference should be set to French.
- When a Business Account Manager selects a language preference, all future reports and emails should be sent in the chosen language.
- The web app should save the selected language preference for the Business Account Manager's profile.
- Scenario 1: Viewing the language preference selection in the profile section
- Given: I am a Business Account Manager viewing my profile section in the Yassir Go for B2B web app
- When: I navigate to the language preference option
- Then: I should see choices for English, and French
- Scenario 2: Selecting a language preference for reports and emails
- Given: I am a Business Account Manager viewing the language preference selection in my profile section
- When: I choose a language preference
- Then: The web app should save my selection
- And: All future reports and emails should be sent to me in my chosen language
- Scenario 3: Default language preference for new Business Account Managers
- Given: I am a new Business Account Manager who has not yet selected a language preference
- When: I view the language preference selection in my profile section
- Then: The default language preference should be set to French
- Scenario 4: Verifying the language of received reports and emails
- Given: I am a Business Account Manager who has selected a language preference from my profile section
- When: I receive reports and emails from the Yassir Go for B2B web app
- Then: The reports and emails should be in my chosen language
- Names should start with letters
- Names fields need to be limited to a number of characters
- The Super Admin can access the Admins list in the Admin Panel.
- The Super Admin can select a specific Admin from the list. A pop will show where he can write the admin his phone number
- The Super Admin can add a phone number for the selected Admin.
- The Super Admin can choose the country code key for the phone number.
- The phone number field accepts numerical input only.
- The phone number is saved and associated with the selected Admin's profile.
- Given-When-Then Scenarios:
- Scenario 1: Super Admin Accesses Admins List
- Given the Super Admin is logged into the Admin Panel
- When the Super Admin navigates to the Admins list
- Then the Super Admin can view the list of Admins
- Scenario 2: Super Admin Selects an Admin
- Given the Super, Admin is on the Admins list
- And there is at least one Admin on the list
- When the Super Admin selects a specific Admin
- Then the selected Admin's details are displayed
- Scenario 3: Super Admin Adds Phone Number for Admin
- Given the Super, Admin is on the selected Admin's details page
- When the Super Admin enters a phone number in the designated field
- And selects the country code key for the phone number
- And saves the changes
- Then the phone number is associated with the selected Admin's profile
- Given that I am a BAM with the Taxes option enabled when a trip is completed, the system should automatically calculate and deduct the appropriate taxes based on the country of operation.
- Given that I am estimating the cost of a trip, the system should include the applicable taxes in the estimated trip cost to provide an accurate budget projection.
- Given that I am generating invoices for trips, the invoice should accurately reflect the trip cost, including any applicable B2B taxes, and be exportable in a clear format for financial record-keeping.
- Scenario: Automatic Tax Deduction
- Given: I am a BAM with the Taxes option enabled.
- When: A trip is completed.
- Then: The system should automatically calculate and deduct the appropriate taxes based on the country of operation.
- Scenario: Including Taxes in Cost Estimates
- Given: I am estimating the cost of a trip.
- When: I calculate the estimated trip cost.
- Then: The system should include the applicable taxes in the estimated trip cost to provide an accurate budget projection.
- Scenario: Accurate Invoices with Taxes
- Given: I am generating invoices for trips.
- When: I generate an invoice for a completed trip.
- Then: The invoice should accurately reflect the trip cost, including any applicable taxes, and should be exportable in a clear format for financial record-keeping.
- Scenario 1: Registering with Email Including Special Characters
- Given I am a new user (BAM or Business Rider) registering on the B2B Web App,
- When I enter my email address with special characters in the name part (e.g., john.doe+business@example.com),
- Then the registration process should proceed without any error messages related to the email format.
- Scenario 2: Confirmation Email
- Given I have successfully registered with an email including special characters,
- When I receive a confirmation email for my registration,
- Then the email should display my registered email address correctly, including the special characters used in the name.
- Scenario 3: Logging In
- Given I have registered with an email containing special characters,
- When I log in to the B2B Web App using my registered email and password,
- Then I should be able to access my account without any issues or errors related to the email format.
- Scenario 4: User-Friendly Error Messages
- Given I enter an email address that doesn't follow email format rules (e.g., missing "@" symbol),
- When I submit my registration details,
- Then if there are any errors, the error messages should be user-friendly and clearly indicate the issue (e.g., "Invalid email format") without specifically targeting the use of special characters in the name.
- Scenario 5: Consistency in Handling Special Characters
- Given Special characters are allowed in email names during registration,
- When I use special characters in my email address,
- Then the system should treat email addresses with special characters consistently throughout the registration process, including confirmation emails and login.
- Scenario 1: User Invitation Email
- Given that I am a BAM using the Yassir platform,
- When I receive an email invitation to join Yassir as a Business Rider or Admin,
- Then the email should display the new Yassir logo and use the updated Yassir brand colors.
- Scenario 2: Verification Email
- Given that I am a BAM or a Business Rider in the verification process,
- When I receive an email requiring verification of my account,
- Then the email should feature the new Yassir logo and utilize the revised Yassir brand colors.
- Scenario 3: Budget Alert Email
- Given that I have set budget alerts for my business account,
- When I receive an email alerting me about budget consumption or limits,
- Then the email should showcase the new Yassir logo and incorporate the updated Yassir brand colors.
- Scenario 4: Invoices Email
- Given that I receive an email containing invoices for my business trips,
- When I open the email to view and download the invoices,
- Then the email should include the new Yassir logo and adhere to the revised Yassir brand colors.
- Scenario 5: Consistency Across Emails
- Given that I interact with various Yassir emails,
- When I receive any other communication emails from Yassir (e.g., support, notifications),
- Then these emails should consistently feature the new Yassir logo and use the updated Yassir brand colors.
- Given that I am on the "Forgot Password" flow of the B2B web application, when I access the language switch buuton, I should find an option to switch to the Arabic language.
- Given that I am on the "Forgot Password" flow and I choose the Arabic language option, when I select it, the entire interface layout should transform to RTL, ensuring proper alignment and design adjustments.
- Given that I am on the "Forgot Password" flow and I choose the Arabic language option, when I encounter any displayed text, such as headings, labels, or instructions, the text should appear in Arabic characters and be aligned from right to left.
- Given that I am on the "Forgot Password" flow and I have switched to Arabic, when I enter any necessary information (e.g., email address) into input fields, the input text direction should be from left to right.
- Given that I am on the "Forgot Password" flow in Arabic mode, when I click on action buttons (e.g., "Reset Password," "Back to Login"), the button labels should be displayed in Arabic text.
- Scenario 1: Switching to Arabic Language
- Given: I am on the "Forgot Password" flow of the B2B web application
- And: I navigate to the language settings
- When: I choose the Arabic language option
- Then: The interface layout transforms to RTL and all displayed text switches to Arabic.
- Scenario 2: Viewing Arabic Text Display
- Given: I am on the "Forgot Password" flow in Arabic mode
- When: I encounter any displayed text, such as instructions or labels
- Then: The text should be in Arabic characters and aligned from right to left.
- Scenario 3: Entering Input Text
- When: I enter any required information (e.g., email address) into input fields
- Then: The input text direction should be from left to right
- Scenario 4: Interacting with Action Buttons
- When: I click on action buttons (e.g., "Reset Password," "Back to Login")
- Then: The button labels should be displayed in Arabic text.
- Scenario 1: Generating an Invitation Link
- Given I am a BAM logged into the platform,
- When I navigate to the group management page and select a specific group,
- And I choose to invite riders to this group,
- Then I should find an option to generate a shareable invitation link.
- Scenario 2: Sharing the Invitation Link
- Given I have generated an invitation link,
- When I click on the link,
- Then it should be copied to my clipboard for easy sharing.
- Scenario 3: Non-Invited Rider Accesses the Link
- Given I am a potential Business Rider who receives the invitation link,
- When I open the link,
- Then I should be directed to a registration page where I can enter my information, including first name, last name, email address, and phone number so that I can have a business rider account
- Scenario 4: Providing User Information
- Given I am on the registration page after opening the link,
- When I enter my details as required,
- Then the system should use this information to create my Business Rider account and immediately add me to the specified business group.
- Scenario 6: Link Expiration Upon Successful Registration
- When a potential Business Rider successfully registers using the link and becomes a member of the specified group,
- Then the link should automatically expire.
- Scenario 7: Link Expiration After 72 Hours
- When the link remains unused for 72 hours after generation,
- Then the link should automatically expire, regardless of whether it has been used or not.
- Scenario 8: Regenerating New Links for Different Groups
- Given I have generated an invitation link for a group - Group X-
- When I try to generate a new link for a different group - Group Y-
- Then I need this newly generated link, to overwrite the previous link on the UI level, yet the already generated link won’t expire
- Scenario 9: Regenerating New Links for Same Group
- When I try to generate a new link for the same group - Group X-
- Then  I need this newly generated link, to overwrite the previous link on the UI level, yet the already generated link won’t expire until it finishes the 72H
- Scenario 10: Generating Links by Different Admins, and BAM
- Given A BAM have generated an invitation link for a group - Group X-
- When Another Admin tries to generate a new link for the same group - Group X-
- Then  I need this newly generated link, to be visible for the the only admin who created this link, and the other generated links will remain as it’s for the other users
- Scenario 11: Expiring The link when the Group is deleted
- When the BAM removed this group and migrated the user to a different group
- Then  The previously generated link should be expired
- Scenario 1: Choosing a Group from the Drop-Down List
- Given I am a Business Account Manager (BAM) on the Rider's invitation screen,
- When I access the drop-down list of groups within the business,
- Then I should see a list of all existing groups.
- Scenario 2: Selecting a Group for Invitations
- Given I have accessed the drop-down list of groups,
- When I choose a specific group from the list,
- Then any Business Riders I invite, whether by email, CSV file, or shareable link (It will be done on a different US), should be assigned to the selected group upon registration.
- Scenario 3: Default Group Selection
- Given I am on the Riders invitation screen,
- When I don't select a specific group from the drop-down list,
- Then any users I invite will be placed in the default group by default.
- When configuring commission settings, the system should allow OP managers to enter negative commission values.
- The system should accept and store negative commission values without errors or warnings.
- Negative commissions should be applied appropriately to the total trip cost when calculating the final cost of trips associated with the company.
- OP managers should be able to update, modify, or remove negative commission values as needed for the company's commission settings.
- the values of negative commission can go up to -100%
- Scenario 1: Entering Negative Commission Value
- Given: I am logged into the Yassir Admin panel as an Operations (OPs) Manager.
- When: I navigate to the commission settings for a specific company.
- Then: I should be able to enter a negative commission value (e.g., -10%) into the designated field for that company.
- Scenario 2: Saving Negative Commission Value
- Given: I have entered a negative commission value for a company in the commission settings on the Yassir Admin panel.
- When: I click the "Save" or "Update" button to confirm the changes.
- Then: The system should accept and save the negative commission value without generating any errors.
- Scenario 3: Applying Negative Commission to Trip Cost
- Given: I have configured a negative commission value for a company in the Admin panel.
- And: A trip associated with that company is booked.
- When: The trip cost is calculated and commissions are applied.
- Then: The negative commission should reduce the total trip cost below the original trip price.
- Scenario 4: Updating Negative Commission Value
- Given: I have previously configured a negative commission value for a company in the Admin panel.
- When: I revisit the commission settings for that company and modify the negative commission value.
- Then: The system should allow me to update the negative commission value as needed.
- Scenario 5: Removing Negative Commission Value
- When: I revisit the commission settings for that company and remove the negative commission value (set it to 0%).
- Then: The system should accept the change and effectively remove the negative commission.By covering these scenarios, the system ensures that Operations Managers can effectively use negative commissions in the Admin panel while maintaining the integrity of financial calculations and reporting.
- Scenario 1: Accessing General Support Information
- Given that I am logged into the Admin Panel as an OP Manager,
- When I navigate to the Company Setting tab within company details.
- Then I should find a dedicated tab or option labeled "Default Support Information."
- Support Email:
- team-cs-b2b-yassir@yassir.com
- +213 21999995
- Scenario 1: Accessing the Legal Information Section
- Given that I am logged into the Yassir for Business web app as a BAM,
- When I navigate to the settings menu,
- Then I should find a section labeled "Legal Information".
- Scenario 2: Adding Legal Information for Algeria
- Given that my business is located in Algeria,
- When I access the Legal Information section,
- Then I should be able to add the following fields:
- Legal Company Name
- Legal Billing Address
- Postal Code
- And I should be able to upload relevant documents.
- Scenario 3: Adding Legal Information for Senegal
- Given that my business is located in Senegal,
- NINEA
- Company ID
- Scenario 4: Adding Legal Information for Tunisia
- Given that my business is located in Tunisia,
- Tax Number
- Scenario 5: Adding Legal Information for Morocco
- Given that my business is located in Morocco,
- Commercial Register
- Scenario 6: Submitting Legal Information for Approval
- Given that I have entered my company's legal information,
- When I click the "Submit" button,
- Then my legal information should be submitted to the Admins on the Admin Panel for approval or denial.
- Scenario 7: Admin Approval or Denial
- Given that I have submitted my legal information,
- When an Admin reviews my submission,
- Then they should be able to approve or deny it.
- And I should receive a notification about the status of my submission. as well as an email informing me about the status, and reason if rejection if any
- Scenario 8: Editing Legal information
- When As a BAM I’m reviewing my legal information, and want to edit a few fields
- Then I should be back to the legal information submitting the screen
- And I should be able to add new information or remove submitted information and add them again
- Scenario 9: Submitting incomplete legal information
- Given that I have submitted my legal information, but I’m missing some fields
- When I click on Submit
- Then I should be able to save this data and wait for approval
- Additional Details:
- The Legal Information section should dynamically display the relevant fields based on the business's country.
- The document upload feature should support common file formats (PDF, JPEG, PNG).
- Scenario 1: Removing an Entire Business that is inactive
- Given: I am logged into the admin panel of the business platform.
- When: I navigate to the settings screen within the business details section.
- When: I click on the "Remove Business" button.
- Then: A confirmation prompt should appear, asking me to confirm the action. so that the Admin Can confirm or deny the delete action
- Scenario 2: Removing an Entire Business that is active
- When: I navigate to the settings screen within the business details section. for an active business
- Then: I need to find the delete button as disabled
- Scenario 3: Removing an Entire Business with unsettled budget
- When: I navigate to the settings screen within the business details section. for an in-active business, but with an unsettled remaining budget on prepaid, or due budget on postpaid
- Then: I need to find a popup message that will direct me to the payment tab to settle the page
- Scenario 4: a user part of one business and it’s removed
- Given: I am a business account manager, business Admin, or program moderator of a removed business
- When: I navigate to the web app and try to log in with my cred
- Then: I need to find a notification message informing me that the business no longer exists
- Scenario 5: a user is part of more than one business, and a business is removed
- Given: I am a business account manager of removed business
- Then: I need to find that the list of businesses I’m part of doesn’t contain the business that was removed
- Scenario 6: a user is part of one business, and the business is removed, I try to log in with Google
- When: I navigate to the web app and try to log in with Google
- Then: I need to be directed to create a company flow and verify the phone number
- Scenario 7: As a deleted business inform all users by email
- Given: I am a business account manager, a business rider, a business admin, or a Program Moderator of a removed business
- When: the business is deleted
- Then: I need to receive an email informing me that the business I’m part of has been removed
- Scenario 8: All user's invitations get expired
- Given: I am an invited business rider via link or email
- Then: I need to find the invitation links on emails, as expired
- Note: the Admin has access to the settings Screen and Payment Tab
- Note in the pop-up that the business shouldn’t have any scheduled trips
- Scenario 1: Accessing the Create New Business Button
- Given I am logged into the B2B Admin Panel as an Admin,
- When I navigate to the enterprise list screen,
- Then I should find a button labeled "Create New Business."
- Scenario 2: Opening the New Business Creation Pop-Up
- Given I am on the enterprise list screen,
- When I click on the "Create New Business" button,
- Then a pop-up should appear prompting me to enter details for creating a new business account.
- Scenario 3: Input Fields in the New Business Pop-Up
- Given I have opened the new business creation pop-up,
- When I view the form in the pop-up,
- Then I should find the following fields for input:
- Company Industry
- BAM Name
- BAM Title
- BAM Phone Number
- City of Headquarters
- Number of Employees
- BAM Email
- Scenario 4: Mandatory Fields Validation
- Given I am filling out the form in the new business creation pop-up,
- When I attempt to submit the form without filling in all mandatory fields (Company Name, BAM Name, BAM Phone Number, BAM Email),
- Then I should receive an error message indicating that these fields are required.
- Scenario 5: Creating a Business with Unlimited Program
- Given I have entered all required information and submitted the form,
- When I successfully create the business,
- Then the business should be created with an unlimited program by default.
- Scenario 6: Flagging the Business as Manually Created
- Given I have successfully created a new business through the admin panel,
- Then the business record should have a flag indicating that it was manually generated (as opposed to created through the registration flow).
- Scenario 7: BAM Notification Email
- Given I have created a new business,
- When the business creation is complete,
- Then an automated email should be sent to the BAM's provided email address,
- The email should inform the BAM about the creation of their company account on the B2B platform, and it will contain a link where he can set his password for the BAM
- Scenario 8: Activation Status of the Business
- Given I have created a new business, I manually
- When the BAM tries to log in
- Then he should get an activation screen or not, based on his country parameters. so his activation should be checked manually by the Admin on the Admin Panel
- Scenario 1: Entering Email for Registration
- Given I am on the business registration page,
- When I provide my email address,
- Then I should receive a notification indicating that a verification or notification email has been sent to me.
- Scenario 2: Displaying “Check Your Inbox” Page
- Given my email has been submitted,
- When the system sends a message to my email,
- Then I should be redirected to a page or modal within the registration flow that contains:
- A clear message telling me an email has been sent.
- A call to action prompted me to check my inbox.
- Scenario 1: Selecting Arabic Language
- Given I am on the language selection screen,
- When I choose the Arabic language,
- Then the system should detect which country I am from (Tunisia, Morocco, or Algeria),
- And display my country’s flag alongside the Arabic language option.
- Scenario 2: Country-Specific Flag Display
- Given that I am a Business Account Manager in Tunisia, Morocco, or Algeria,
- When Arabic is selected,
- Then the displayed flag should specifically match my country:
- Tunisia’s flag for Tunisian users.
- Morocco’s flag for Moroccan users.
- Algeria’s flag for Algerian users.

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-23856: Manage saved addresses~~ → Replaced by CMB-26661
- ~~CMB-11587: Choosing A business Profile on the Web App~~ → Replaced by CMB-189
- ~~CMB-10338: Resend a Business Rider invitation~~ → Replaced by CMB-1519
- ~~CMB-9892: Inviting to group from the main invitation screen ~~ → Replaced by CMB-9735
- ~~CMB-11737: Track Company Creation Screen~~ → Replaced by CMB-11736
- ~~CMB-13347: Map the legal information ~~ → Replaced by CMB-31381
