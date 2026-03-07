---
id: "jira-b2b-portal-users-groups"
title: "B2B Portal — Users & Groups"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","craft_sync","crafttheme_mobility"]
last_synced: "2026-02-15T11:04:58.427Z"
ticket_count: 104
active_ticket_count: 74
---

# B2B Portal — Users & Groups

> Auto-generated from 104 Jira tickets.
> Last synced: 2026-02-15T11:04:58.427Z
> Active features: 74
> Superseded: 30

## User Stories

### CMB-32859: [WEBAPP] Payment Section

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-12-14

**Description:**
As a superAdmin, Business Admin, I want the bank transfer payment section to be alligned with the current processes, and allows me to upload a payment receipt for the bank transfer that have been done in order to facilitate tracking of the bank transfer, and avoid offline contacts to the sales team.

**Acceptance Criteria:**
- Scenario 01 : Accessing Payment Section
- Given I am a superAdmin/ business admin on webApp
- When I click on the payment section
- Then I should see
- for post-paid companies :
- Invoices,
- Payment plan,
- monthly budget
- Budget/ due budget
- Pay Due Budget
- Payment Receipts
- for pre-paid companies :
- Remaining budget
- Topup budget
- Payment plan
- Invoices
- Payment Receipts
- Scenario 02 : Accessing Top-up / Pay Due Budget Section
- Given I am a superAdmin/ business admin on payment screen
- When I click on Pay due budget/ Topup-budget
- Then an Overlay Screen is displayed with two options
- Online Payment
- Bank Transfer
- Scenario 03 : Accessing Bank Transfer Option
- Given I am a superAdmin/ business admin on webApp
- When I choose the option bank transfer
- Then I should be able to see
- How to Banner to explain that after making a bank transfer the user should upload a payment recipts
- a button to allow me to upload a file (A picture or PDF file) as a proof of bank transfer payment
- Scenario 04 : Accessing Payment Receipts Section
- Given I am a superAdmin/ business admin on webApp
- When I click on payment receipts banner
- Then I should be able to see a list of all payment receipts for online or Bank transfers payments
- Scenario 05 : Payment Receipts Table
- Given I am a superAdmin/ business admin on webApp
- When I access the payment receipts section
- Then the table of the payment receipts should follow the following structure
- Payment Receipt Number
- Date
- Time
- Transaction amount
- Payment method (Satim, Dahabia, Bank Transfer/Cheque)
- Note : Following events should be added on this notion page
- Event

---

### CMB-33821: Parsing & Booked for Later Trip Creation

**Status:** To Do | **Priority:** P2 - Medium
**Created:** 2026-01-13

**Description:**
As a system, I need to parse each row of a valid bulk booking file and create scheduled (“booked for later”) trips so that each entry results in an individual ride. Each row must be validated independently to allow partial success. Invalid rows must not block valid trip creation and must be clearly reported and provided in a file that the user can download. This ensures accuracy and operational continuity.

**Acceptance Criteria:**
- Scenario 01 : Successful Parsing and Trip Creation
- As the system
- When a row contains valid phone number, pickup, dropoff, date, and time information
- Then a booked-for-later trip is created successfully
- Scenario 02 : Partial File Success
- As the system
- When a file contains both valid and invalid rows
- Then valid rows are processed and invalid rows are rejected with detailed error reasons and notification should be sent to the user to provide the user with a file which contains a list of unsuccessfully booked trips
- Scenario 03 : Rider Not Linked to Business
- As the system
- When a row contains a rider phone number not associated with the booking business
- Then the row is rejected and marked as a membership validation failure and the row should be added to the unsuccessful booked trips
- Scenario 04 : Invalid Date or Time
- As the system
- When a row contains a past date or an invalid time format
- Then the row is rejected and no trip is created and the row should be added to the unsuccessful booked trips with the reason ‘past date or time’
- Scenario 05 : Duplicate Trip Detection
- As the system
- When two rows contain identical rider, pickup, dropoff, date, and time
- Then the system flags the duplicate trip and the row should be added to the unsuccessful booked trips with reason : duplication
- Scenario 06 : Same rider, different location
- As the system
- When a row contains a rider phone number more than once with different pickup or dropoff and same time
- Then the row is rejected and mark and no trip is created and the row should be added to the unsuccessful booked trips with the reason 'same rider different location in the same time'
- Scenario 07 : Booking Service
- As the system
- When the trip is booked
- Then the service type should be the default one configured
- Algeria : Business Classic
- Tunisia : Business
- Marocco : Business classic
- Senegal : Classic
- Scenario 08 : Ops Visibility of Bulk-Booked Trips
- As an Ops manager
- When bulk booking trips are created
- Then they appear in the Ops dashboard with the same status as other booked-for-later trips and the standard booked for later trips flow should be applicable for the trips
- Scenario 09 : Phone number Parsing
- As the system
- When the phone number is in different format
- Then the system should
- if the phone number did not have any country code (phone number starts with 0) : it should be following the business country code
- if the phone number does not have any country code or 0 : it should be following the business country code (BAM)
- if the phone number contains spaces, dashes, or any special character : those should be removed by the system
- if the phone number contains a country code : then the trip should be booked for that specific number
- Scenario 10 : File Validation Process
- As a system
- When a file is uploaded we need to validate the file in two phases
- Then the phases can be
- when submission
- valid input fields (mandatory fields not null)
- If maximum trips have been exeeded (50 trips per file)
- the system should book the 50 rows, and reject only the rows which exceeds the 50th row
- Date format (format of the date dd/mm/yyyy, how far can we go book for (2 weeks))
- Time format (hh:mm) (24H format)
- when booking a trip (in the background)
- user is not part of the business
- wrong locations
- programs validations
- Scenario 11 : Unsuccessful Trips File
- As a system
- When there are some trips that were not successfully booked due to the second phase validation
- Then the system provided to the user we need to have an additionnal field 'Reason' besides all the columns of the file uploaded, and the reason column should contain an explanation why the trip have not been successfully booked

---

### CMB-33820: [WEBAPP] File Upload & Validation

**Status:** To Do | **Priority:** P2 - Medium
**Created:** 2026-01-13

**Description:**
As a B2B user, I want to upload a CSV or Excel file containing multiple trip requests so that I can schedule booked for later rides in bulk instead of creating them one by one.

**Acceptance Criteria:**
- Scenarion 01 : Valid File Upload
- As a B2B user
- When I upload a CSV or Excel file that follows the required template
- Then the system accepts the file and moves it to the parsing stage
- Scenarion 02 : File Format
- Then the file should contain the following columns
- Rider first name (NOT MANDATORY)
- Rider last name (NOT MANDATORY)
- Rider phone number( MANDATORY)
- Pickup location( MANDATORY)
- Dropoff location( MANDATORY)
- Date( MANDATORY)
- Time( MANDATORY)
- Scenarion 03 : Unsupported File Format
- When I upload a file with an unsupported format
- Then the system rejects the upload and displays an error message explaining the allowed formats
- Scenarion 04 : Missing or Invalid Columns
- When I upload a file with missing (the validation is done only on the mandatory fields)
- Then the system rejects the file and highlights the required structure
- Scenarion 05 : Empty File
- When I upload an empty file or a file with no data rows
- Then the system rejects the upload and informs me that the file contains no trips
- Scenarion 06 : File Row Limit Exceeded
- When I upload a file that exceeds 50 rows
- Then the system rejects the upload and displays a clear limitation message (the file should not exceed 50 rows)
- Note : Following events should be added on this notion page
- Event Name

---

### CMB-33772: [B2C] Mobile App Fallback Screen

**Status:** To Do | **Priority:** No Priority
**Created:** 2026-01-12

**Description:**
Implement a fallback screen that detects mobile users and encourages them to download the native mobile app instead of using the web version.

---

### CMB-13776: Connect Groups to Programs 

**Status:** Done | **Priority:** No Priority
**Created:** 2024-04-12

**Description:**
As a Business Account Manager (BAM), when I'm creating a new group, on the creation flow, I need to find it mandatory to connect the newly created group to a program so that we can't have a group without a program.

**Acceptance Criteria:**
- Scenario 1: Creating a New Group
- Given: I am logged in as a BAM on the Yassir for Business platform.
- When: I initiate the process of creating a new group.
- Then: I should be prompted to select a program to associate with the new group.
- Scenario 2: Selecting a Program
- Given: I am creating a new group and prompted to select a program.
- When: I attempt to proceed without selecting a program.
- Then: The system should prevent me from moving forward and display an error message indicating that selecting a program is mandatory.
- Scenario 3: Selecting a Program Successfully
- When: I select a program from the available options.
- Then: I should be able to proceed with creating the group without any errors.
- Scenario 4: Group Creation with Program Association
- Given: I have selected a program while creating a new group.
- When: I complete the group creation process.
- Then: The newly created group should be successfully associated with the selected program.
- Scenario 5: Group Creation Without Program Association
- Given: I attempt to create a new group without selecting a program.
- When: I try to proceed with group creation.
- Then: The system should prevent the creation of the group and display an error message instructing me to select a program before proceeding.
- No group can be assigned to two programs
- We can assign multiple groups to the same program
- Scenario 1: Accessing the create group flow
- Given the user is logged into the web app,
- When they navigate to the groups section and click on "create a program,"
- Then they should be prompted to fill in all mandatory fields, including the program field (dropdown list or create a new program).
- Scenario 2: Attempting to create a group without a program
- Given the user has entered a group name but left the program field empty,
- When they attempt to click "create,"
- Then the system should display an error message:
- "A program must be assigned to create a group."
- Scenario 3: Successfully creating a group with a program
- Given the user has filled in both the group name and the program field,
- When they click "create,"
- Then the group should be successfully created,
- And the program details should be reflected in the group settings page.
- Scenario 4: Assign unlinked groups (previously created) to default program
- Given there are groups that are not assigned to any program,
- Then the group should be assigned to the default program,

---

### CMB-29512: B2B Inside Sales Role Creation

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-09-04

**Description:**
As a super admin, I want to assign multiple enterprises to an iside sales in bulk, So that I can efficiently manage inside sales assignments from a single interface.

**Acceptance Criteria:**
- Scenario : New Tab Displaying Inside Sales Representatives list
- Given I am an admin on adminPanel,
- When I click on the "Manage Admins" screen,
- Then I should see a new tab "Inside Sales".
- Scenario : Making an Admin an “Inside Sales“
- Given I am on the "Manage Admins" screen,
- When I click the gear icon to edit,
- Then I should see a new toggle button "Inside Sales".
- Scenario : Navigating to "Inside Sales" tab
- Given I am on the "Manage Admins" screen,
- When I navigate to the "Inside Sales" tab,
- Then I should see a list of all inside sales along with the columns (Inside Sales name, Email, Phone number, Countries, Status, Actions (edit/delete)).
- And if no inside sales exist yet, an empty screen should be displayed with the message, "No inside sales are yet assigned."
- Scenario : Inside Sales Details Screen
- Given I am on the "Sales Representatives" tab,
- When I click gear on the actions column,
- Then a screen should appear displaying the details of the assigned leads.
- And the screen should include:
- Inside Sales Name
- Email
- Phone Number
- List of Assigned Leads
- Scenario 4: Redirect admins to lead details from the inside sales details screen
- Given I am on the inside sales details screen,
- When I click one of the leads the inside sales is assigned to,
- Then I should be redirected to the leads details screen for the specified lead.
- Scenario 5: Bulk Assignment of leads
- Given I am on the details screen for a sales representative,
- When I access the "Assigned Leads" field,
- Then I should see a drop-down list containing all leads listed by company name
- And the drop-down should allow me to:
- Search leads by name.
- Select multiple leads to assign to the inside sales.
- Uncheck leads to remove their assignment. (if the inside sales has previously assigned leads they should be checked on the list)
- Scenario 6: Saving Bulk Assignments
- Given I have updated the list of assigned leads,
- When I click "Save,"
- Then the updated assignments should be reflected in the inside sales’ details on the "Details Overlay Screen for the Inside Sales" and also reflected on the settings screen on the leads details section.
- Scenario 7: Validation
- Given I attempt to save without selecting any leads,
- When I click "Save,"
- Then the inside sales should be unassigned from all the Leads.
- Scenario 8: Saving The Logs
- Given I have assigned an inside sales in bulk,
- Then the activity should be saved in the logs section of each lead
- Scenario 9: Deleting Inside Sales
- Given I am on the "Inside Sales" tab,
- When I click delete icon on the actions column,
- Then a confirmation overlay screen should appear displaying a message informing the admin that the inside sales will be removed from the "Inside Sales " list and that he would be listed on the admins list. (by automatically turning off the switch button of sales rep)
- And a checkbox labeled "Also delete from Admins list" should be displayed. If the box is checked, the admin will also be removed from the "Admins" list upon confirmation and the assigned sales rep for the specific companies should be ==N/A.
- And the leads assigned to that inside sales that have been deleted should be unassigned
- Scenario 10: Assignment of Leads from the Leads Details Screen
- Given I am on the details screen for a Lead,
- When I click on “Assign Inside Sales“,
- Then I should see a drop-down list containing all the inside sales
- And the drop-down should allow me to:
- Search inside sales by name.
- Select only one lead to assign to the lead.
- Uncheck inside sales to remove their assignment.

---

### CMB-29517: B2B Leads Form

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-09-04

**Description:**
As a user interested in Yassir's business services, I want to fill out a contact form with all the necessary information, So that my request can be accurately routed to the right team.

**Acceptance Criteria:**
- Scenario 1: Form Display
- Given I land on a 🔎 Yassir.com business page
- When I access the Leads Form Page | Yassir Business.
- Then I should see the following fields displayed:
- First Name
- Last Name
- Email Address*
- Phone Number*
- Country* (auto-populated based on the phone number's country code)
- City*
- Services You are interested in* (with a dropdown list)
- Company Name*
- Company Size
- What is your position in the company?
- Platform Users (Who benefits)
- And the fields with an asterisk (*) should be marked as mandatory.
- Scenario 2: Services Dropdown Content
- Given I am on the leads form.
- When I click on the "Services You are interested in" dropdown.
- Then I should see the following options:
- Mobility
- Market for Business
- Giftcards
- Food for business
- Digital Communication
- Yassir Cash
- And I should be able to select one or multiple services.
- Scenario 3: Country Field Logic
- Given I am on the leads form.
- When I enter a phone number in the "Phone number" field.
- Then the "Country" field should automatically populate based on the country code of the phone number.
- Scenario 4: Form Submission
- Given I have filled out all the mandatory fields.
- When I click the "Submit" button.
- Then my information should be submitted, and a new lead should be created in the Leads Management section on adminPanel.
- And a confirmation message should be displayed, thanking me for my interest.

---

### CMB-29207: Groups/Users Section Redesign

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-08-27

**Description:**
As a BAM, I want a single, unified screen to manage all users and groups, so that I can efficiently perform my daily administrative tasks without needing to navigate between multiple, separate sections of the application.

**Acceptance Criteria:**
- Scenario 1: Initial User List View
- Given I am on the "Users & Groups" screen and the "Users" tab is selected.
- When I view the user list.
- Then I should see a table with columns for User Name, Phone, Group, Program, Email Address, Status, User Role, and Actions
- And statistics overview Active Users VS Pending Users VS Guests
- Scenario 2: Updating pagination default value
- Given I am on the "Users & Groups" screen with the user list displayed.
- Then the lines displayed should be 20 by default.
- Scenario 3: Opening the User Edit Modal
- Given I am on the "Users & Groups" screen with the user list displayed.
- When I click the "Edit" icon in the "Actions" column for a specific user.
- Then a modal window should appear on the same screen, pre-populated with the user's current information
- And two check-boxes one for auto-approval the other for price display
- Scenario 4: Saving User Changes
- Given I am in the "Edit User" modal.
- When I change the user's assigned group and click "Save".
- Then the modal should close, and the main user table should update instantly to reflect the new group assignment.
- Scenario 5: Viewing Group List
- Given I am on the "Users & Groups" screen.
- When I select the "Groups" tab.
- Then I should see a table with columns for Group Name, Assigned Program, Number of Riders, and Actions.
- Scenario 6: Viewing Riders in a Group
- Given I am on the "Users & Groups" screen with the group list displayed.
- When I click on the numerical value in the "Number of Riders" column for a specific group.
- Then a modal window should appear, displaying a list of all users assigned to that group.
- Scenario 7: Navigating to Group Details
- Given I am on the "Users" tab.
- When I click on a group name link in the "Group" column for a specific user.
- Then I should be redirected to the dedicated detail screen for that specific group.
- Scenario 8: Navigating to Program Details
- Given I am on the "Users" tab.
- When I click on a program name link in the "Program" column for a specific user.
- Then I should be redirected to the dedicated detail screen for that specific program.
- Scenario 9: Viewing Program-Specific Details When Reassigning a User
- Given I am in the "Edit User" modal.
- When I change or select a new group for the user.
- Then an overview section should appear, displaying the program's pickup/drop-off locations, whether the auto-approval feature is enabled for that program, and the allowed ride days and times.
- note : check low fidelity prototypes attached to the user story
- add the input field for progarm and the groups, groups input should be selectable

---

### CMB-13274: Lead Data CSV Export

**Status:** Done | **Priority:** P3 - Low
**Created:** 2024-03-20

**Description:**
As an Admin,

**Acceptance Criteria:**
- Scenario 1: Accessing Export Feature
- Given I am logged into the Admin Panel,
- When I navigate to the "Leads" tab,
- Then I should find an "Export" button prominently displayed on the page.
- Scenario 2: Exporting Business Leads Data
- Given: I click on the "Export" button,
- When I select the option to export as a CSV file,
- Then the system should generate and download a CSV file containing the information of all business leads.
- Scenario 3: CSV File Content
- Given I open the exported CSV file,
- Then I should find that the file contains the following fields for each lead:
- Name
- Email
- Phone Number
- Title
- Business Name
- Business Size
- Platform Users
- Services Chosen Separate it with a dash
- Registration Date (dd.mm.yyyy)
- Additional Information:
- Exporting lead information as a CSV file enables efficient offline access and sharing of data.
- The CSV file format ensures compatibility with various spreadsheet applications for easy viewing and manipulation of lead data.

---

### CMB-13654: Logging all Admin Actions on the web app

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-04-04

**Description:**
As an Admin on the Yassir for Business Admin Panel, I need any changes I make, such as inviting users or modifying program parameters or groups, to be reflected in each session on the transactions table with comma-separated values. This feature enhances transparency and accountability by highlighting all admin actions in the platform's transaction log.

**Acceptance Criteria:**
- Scenario 1: Making Admin Changes
- Given: I am logged into the Yassir for Business Admin Panel.
- When: I perform any administrative actions, such as inviting users, modifying program parameters, or managing groups.
- Then: The system should record these actions in the transactions table.
- Scenario 2: Displaying Changes in Transactions Table
- Given: I have made administrative changes in the Yassir for Business Admin Panel.
- When: I navigate to the transactions table.
- Then: I should see each administrative action listed with comma-separated values, clearly indicating the nature of the action taken, the affected user or group, and any relevant details.
- Scenario 3: Real-Time Updates
- Given: I am actively using the Yassir for Business Admin Panel.
- When: I make administrative changes during an active session.
- Then: The transactions table should update in real-time to reflect the latest admin actions, ensuring that all changes are promptly recorded and visible to users.

---

### CMB-13293: How to Manage Users?

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

---

### CMB-24997: Tunisia- Email notification for booked for later trips

**Status:** Done | **Priority:** No Priority
**Created:** 2025-04-29

**Description:**
As a Support Team member in Tunisia, I want to receive email notifications for any "booked for later" trips that are scheduled to occur outside of our standard work hours and weekends, so that we can proactively monitor and address any potential issues or provide timely support to users before these trips take place.

**Acceptance Criteria:**
- When a B2B user book a trip for later outside of work hours and during weekends
- Then the support team should get notified by email of those booked trips
- And should provide the necessary support
- List of people who will get notified:
- mayssa.seddik@yassir.com
- sarra.askri@yassir.com
- amine.benjdira@yassir.com
- Hours :
- Monday to Friday: 5PM to 00:00
- Saturday and Sunday: All day

---

### CMB-20850: Assign Sales Rep in Bulk

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-12-18

**Description:**
As an admin,
I want to assign multiple enterprises to a sales representative in bulk,

**Acceptance Criteria:**
- Scenario 1: New Tab Displaying Sales Representatives list
- Given I am an admin on adminPanel,
- When I click on the "Manage Admins" screen,
- Then I should see a new tab "Sales Representatives".
- Scenario 2: Navigating to "Sales Representatives" tab
- Given  I am on the "Manage Admins" screen,
- When I navigate to the "Sales Representatives" tab,
- Then I should see a list of all sales representatives along with the columns (Sales Representative name, Email, Phone number, Countries, Status, Actions). And if no sales representatives exist yet, an empty screen should be displayed with the message, "No sales representatives are yet assigned."
- Scenario 3: Sales Rep Details Screen
- Given I am on the "Sales Representatives" tab,
- When I click gear on the actions column,
- Then a screen should appear displaying the details of the selected sales representative. And the overlay should include:
- Sales Representative Name
- Email
- Phone Number
- List of Assigned Enterprises
- Scenario 4: Redirect admins to company details from the sales rep details screen
- Given  I am on the sales rep details screen,
- When I click one of the companies the sales rep is assigned to,
- Then I should be redirected to the entreprise’s information tab for the specified company.
- Scenario 5: Bulk Assignment of Enterprises
- Given I am on the details screen for a sales representative,
- When I access the "Assigned Enterprises" field,
- Then I should see a drop-down list containing all active enterprises. And the drop-down should allow me to:
- Search enterprises by name.
- Select multiple enterprises to assign to the sales representative.
- Uncheck enterprises to remove their assignment. (if the sales rep has previously assigned enterprises they should be checked on the list)
- Scenario 6: Saving Bulk Assignments
- Given I have updated the list of assigned enterprises,
- When I click "Save,"
- Then the updated assignments should be reflected in the sales representative's details on the "Details Overlay Screen for the Sales Rep" and also reflected on the settings screen on the Entreprises details section.
- Scenario 7: Validation
- Given I attempt to save without selecting any enterprises,
- When I click "Save,"
- Then the sales representative should be unassigned from all the companies.
- Scenario 8: Saving The Logs
- Given I have assigned a sales rep in bulk,
- Then the activity should be saved in the transaction table of each company the sales rep is assigned to
- Scenario 9: Deleting Sales Rep
- Given  I am on the "Sales Representatives" tab,
- When I click delete icon on the actions column,
- Then a confirmation overlay screen should appear displaying
- a message informing the admin that the sales rep will be removed from the "Sales Representatives" list and that he would be listed on the admins list. (by automatically turning off the switch button of sales rep)
- a checkbox labeled "Also delete from Admins list," If I the box is checked, the admin will also be removed from the "Admins" list upon confirmation and the assigned sales rep for the specific comapanies should be ==N/A

---

### CMB-13297: How to invite users video?

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

**Acceptance Criteria:**
- Scenario 1: Adding Non-Existing User Email
- Given: I am creating a new group as a BAM on the Yassir for Business platform.
- When: I add the email of a user who does not exist in the system.
- Then: The system should recognize the non-existing user and initiate the invitation process automatically.
- And: An invitation email should be sent to the provided email address.
- Scenario 2: Invitation Email Content
- Given: An invitation email is sent to the non-existing user.
- When: The user receives the invitation email.
- Then: The email should contain clear instructions on how to accept the invitation and become a business rider, the same as a regular invitation
- Scenario 3: User Accepts Invitation
- Given: The non-existing user receives the invitation email and follows the provided instructions.
- When: The user clicks on the invitation link and completes the registration process.
- Then: The user should be successfully added as a business rider in the specified group.and his status will be moved from pending to active user
- And: The user's information should be updated in the system, allowing them to access the Yassir for Business platform and utilize its features.

---

### CMB-13258: Managing Guest Users

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

**Acceptance Criteria:**
- Accessing Trips Tab:
- Given that I am logged into the Yassir for Business Admin platform,
- When I navigate to the enterprise details screen,
- Then I should find a "Trips" tab or section.
- Viewing Trips Booked for Guest Users:
- Given that I am on the "Trips" tab,
- When I review the list of trips,
- Then I should be able to identify trips booked specifically for guest users.
- The trips should display the following information:
- Booking made by the BAM's name.
- A flag or indicator confirming that the trip was made for a guest user.
- A column that contains the guest’s name, and phone number
- Exporting Trips Data with Guest User Flag:
- Given that I am viewing the list of trips on the enterprise details screen,
- When I choose to export the trip data as a CSV file,
- Then the exported CSV file should contain a column or field indicating whether each trip was made for a guest user.
- The flag should distinguish between trips made for guest users and those made for regular business users.
- Comprehensive Trip Data in CSV:
- Given that I export the trip data as a CSV file,
- When I open the CSV file,
- Then it should include all relevant trip details, such as:
- Trip ID
- Booking date and time
- Pickup location and destination
- BAM's name
- Guest user flag: Containing Guest Name, and phone number
- User-Friendly Export Process:
- Given that I initiate the export of trip data,
- When the export process is complete,
- Then I should be able to easily download and access the CSV file containing the trip data.
- Accessing BtoB Trips for Guest Users:
- Given that I am logged into Dashops,
- When I navigate to the section displaying BtoB trips,
- Then I should find an option to filter or view trips specifically booked for guest users.
- Identification of Booking User:
- Given that I am reviewing BtoB trips for guest users,
- When I select a trip,
- Then I should be able to identify the main Business Admin, BAM, or program moderator who booked the trip for the guest user.
- The booking user's name or identifier should be clearly displayed alongside the trip details.
- Clear Association with Booking User:
- Given that I am viewing trip details,
- When I review the information,
- Then I should easily recognize the association between the trip and the user who made the booking.
- This association should be prominently displayed to ensure clarity and facilitate further action if necessary.
- User-Friendly Interface:
- Given that I am navigating through BtoB trip details,
- When I interact with the interface,
- Then it should be intuitive and easy to navigate, allowing me to quickly locate and review trips booked for guest users.
- Given that I am logged in as a Business Account Manager,
- When I navigate to the main users' screen,
- Then I should find a widget specifically for guest users.
- Given that, I want to view the guest users' list,
- When I click on the guest users' widget,
- Then I should be directed to the users' list page, filtered to display only guest users.
- Given that I am viewing the guest users' list,
- When I review the users' table
- Then I should see a list of all guest users, including their names, email addresses (if available), and phone numbers.
- Given that I want to add a new guest user,
- When I click on the "Add New User" button,
- Then a pop-up should appear where I can enter the guest user's name, email, and phone number.
- Given that I want to delete a guest user from the list,
- When I select the delete option next to the guest user's information,
- Then the system should prompt me to confirm the deletion before removing the guest user from the list.
- Given that I want to edit a guest user's information,
- When I select the edit option next to the guest user's information,
- Then a pop-up or inline form should appear allowing me to update the user's name, email, and phone number.

---

### CMB-4898: Spending Allowance Update

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-04-11

**Description:**
As a Business Account Manager of the Yassir Go for B2B web app, I want to be able to define a spending allowance per trip for each program, so that all users with groups assigned to that program will not be able to book a trip if the estimated trip cost exceeds the spending allowance.

**Acceptance Criteria:**
- The web app should allow the Business Account Manager to define a spending allowance per trip for each program.
- Users with groups attached to a program should be restricted from booking a trip if the estimated trip cost exceeds the spending allowance.
- When attempting to book a trip that exceeds the spending allowance, users should receive a notification indicating that the trip cost exceeds the spending allowance.
- Scenario 1: Defining a spending allowance for a program
- Given: I am a Business Account Manager using the Yassir Go for B2B web app
- When: I define a spending allowance for a program
- Then: All users with groups attached to that program should be restricted from booking trips exceeding the spending allowance
- Scenario 2: Attempting to book a trip exceeding the spending allowance
- Given: I am a user with a group attached to a program with a defined spending allowance
- When: I attempt to book a trip with an estimated cost exceeding the spending allowance
- Then: I should receive a notification that the trip cost exceeds the spending allowance
- Scenario 3: Booking a trip within the spending allowance
- Given: I am a user with a group attached to a program with a defined spending allowance
- When: I attempt to book a trip with an estimated cost within the spending allowance
- Then: I should be able to successfully book the trip

---

### CMB-1515: Dev FE: Group Listing

**Status:** Done | **Priority:** No Priority
**Created:** 2022-10-27

**Description:**
As a business account manager I need to be able see all the group members listed, and see the number of Rider information as Email, Name, Phone Number, so that I can be able to manage the group Riders and move them from one group to another

**Acceptance Criteria:**
- Scenario 1: Inviting Non-Existing Users to the Group
- Given I am a BAM logged into the platform,
- When I navigate to the group management page and select a specific group,
- And I choose to invite riders to this group,
- Then I should be able to enter the email addresses of a non-existing users who I want to add to the group directly. so they will receive an email to register and will appear as a pending users
- Scenario 2: Moving Existing Users to the Group
- Given I am on the invite riders to the group screen and have entered the email addresses of existing users,
- When I initiate the invitation process,
- Then the selected users should be moved to the specified group immediately.
- Scenario 3: Inviting Users via CSV File
- Given I am on the invite riders to the group screen and choose to invite users via a CSV file,
- When I upload a CSV file containing email addresses,
- Then the system should process the file and check if the email addresses correspond to existing users.
- And Existing users should be moved to the specified group, while non-existing users should receive email invitations to join and become group members.

---

### CMB-994: Design: Moving Users

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-07

**Description:**
Acceptance Criteria:

**Acceptance Criteria:**
- User can change business rider group
- Business Rider can be in one group at a time only
- As a business account manager I need to be move users from group to another group, so that they can start using the service with the group conditions directly

---

### CMB-993: Dev BE: Removing, Editing Group members

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-07

**Description:**
As a business account manager I need to be able to manage groups so that I can remove, add, or edit groups parameters

**Acceptance Criteria:**
- BAM can’t remove a group that contains members, he needs to move to move them first to another Groups
- BAM can’t remove a group that contains members, he needs to move to move them first to another group
- Users can export users data
- Users can sort group members by name in Alphabetical order A->Z
- User can search
- Moving can be done in bulk
- Name
- Email
- Group Name
- Program Name
- Users can sort group members by name or department
- User can search users list
- Edits and removing can be done in bulk

---

### CMB-183: Dev FE: Editing Program Parameters 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a business account manager, I need to be able to edit program parameters so that all assigned groups to the program will be affected by the new parameters

**Acceptance Criteria:**
- User needs to be able to change pick up and drop off locations, and trip stops
- The user needs to be able to change the days, and times assigned for the trips
- User needs to be able to change the days, and time assigned for the trips

---

### CMB-182: Dev BE: Deactivating Programs 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a business account manager, I need to be able to deactivate programs so that all assigned groups will be returned to the default program

**Acceptance Criteria:**
- When deactivating a program, a popup should show up, alerting the user that there’s a certain number of Groups that will be affected. and the user will be able to choose  to which program those groups are associated

---

### CMB-3877: Reporting Email

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-06

**Description:**
As a business account manager, I want to receive a monthly email update that provides me with information about the number of trips made, the budget left and consumed, the number of users and their status, the number of programs, and groups on my account so that I can keep track of my account's performance.

**Acceptance Criteria:**
- The email must be sent to the account manager every month.
- The email must contain the following information:
- Number of trips made in the previous Month
- Number of active users
- Number of programs and groups on the account in total
- The email must contain the BAM name
- Email is sent on the first day of the month with the name of the previous month (for Example ‘Feb Updates’)
- Scenarios:
- Scenario 1: The account manager receives the monthly email update
- Given *the business account manager is registered on our platform
- When *the monthly update email is sent
- Then *the account manager should receive an email containing information about the number of trips made, the budget left and consumed, the number of users and their status, the number of programs, and the groups on the account.
- Email Template:
- Dear [First Name],
- We have some exciting news to share with you! Your business account has reached a milestone by hitting the following numbers:
- Riders: [insert number]
- Programs: [insert number]
- Groups: [insert number]
- Trips: [insert number]
- This is a great achievement and we are thrilled to have been a part of it. We understand the importance of having a seamless and efficient experience for your business operations, and we are committed to providing you with the best service possible.
- If you have any questions, please don't hesitate to contact us at [insert contact details]. Our team is always happy to help.
- Thank you for choosing us as your partner for your business needs. We look forward to continuing our successful partnership.
- Best regards,
- Cher/Chère [Prénom],
- Nous avons de bonnes nouvelles à vous annoncer ! Votre compte professionnel a atteint un jalon important en atteignant les nombres suivants :
- Passagers : [insérer le nombre]
- Programmes : [insérer le nombre]
- Groupes : [insérer le nombre]
- Voyages : [insérer le nombre]
- C'est une grande réussite et nous sommes ravis d'en avoir fait partie. Nous comprenons l'importance d'avoir une expérience de fonctionnement sans heurts et efficace pour votre entreprise, et nous nous engageons à vous fournir le meilleur service possible.
- Si vous avez besoin d'augmenter votre limite ou si vous avez des questions, n'hésitez pas à nous contacter à [insérer les coordonnées de contact]. Notre équipe est toujours heureuse de vous aider.
- Merci de nous avoir choisis comme partenaire pour vos besoins commerciaux. Nous sommes impatients de continuer notre partenariat fructueux.
- Cordialement,

---

### CMB-2302: Dev FE: Listing Users

**Status:** Done | **Priority:** No Priority
**Created:** 2022-12-07

---

### CMB-1805: Design: Change User Status

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-11-16

**Description:**
As a business account manager, I need to be able to Deactivate and Activate users, so that they can't use the service but their data are still saved

**Acceptance Criteria:**
- Rider needs toreceive an email informing him about activation and deactivation

---

### CMB-166: Dev - BE: Creating a new group 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a business account manager, I need to be able to choose and invite multiple members from default or any other groups to the new group so that I can set new parameters and terms of use for them

**Acceptance Criteria:**
- A Business Rider can be in one group only
- A group can be associated with one program only
- Every group will be associated with the default payment method
- We can set a different payment method for every group

---

### CMB-1705: Design: Filter Riders

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-11-07

**Description:**
As a business account manager, I need to be able to filter Riders, by their Groups, and Programs, so that I can list matching users only

---

### CMB-2388: Dev BE: Refactor Group Users Search

**Status:** Done | **Priority:** No Priority
**Created:** 2022-12-13

---

### CMB-3035: FE Dev: De-activation Screen

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-01-19

**Description:**
As a BAM who is waiting for an action from OPs Admins before using the services I need to be able to see a screen that is telling me that my business Dashboad is on temproray hold for now, as the OPs team is doing some checking, so that I can't take any actions on the screen. and get in contact with the suport team if needed

**Acceptance Criteria:**
- Given a BAM has chosen a Post Paid payment plan
- I need to find a screen telling me that you will be on hold till your meeting with the OPs team, and see an Email to get in contact with
- Given a BAM has chosen a Pre Paid payment plan, and offline Payment method
- Given a BAM whose account been de-activated by one of the OPs Admins
- I need to find a screen telling me that you will be on hold for a reason and please get in contact with the OPs Team

---

### CMB-3030: Changing Budget-Postpaid

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-01-19

**Description:**
As an OPs Manager for Yassir for Business, I need to be able to manage the organization's budget by setting a maximum limit that cannot be exceeded. Users should be able to see the remaining budget allowance when taking trips, and the balance should be automatically deducted from the initial credit made by an OPs Admin. The Ops Manager should be able to increase or decrease the budget spending limit.

**Acceptance Criteria:**
- The user should be able to view each business payment plan and method on the dashboard, including postpaid payment methods.
- If the payment method is postpaid, the user should be able to adjust the budget left by adding an additional amount to the account.
- The user should be able to change the Allowance if the payment method is postpaid.
- The user should be able to attach legal documents and bank transfer statements to the account for verification purposes.
- The Ops Manager should be able to decrease the budget spending limit as long as the new limit is equal to or greater than the previous budget spending limit and add balance minus the due budget.
- The Ops Manager should be able to increase the Budget Spending limit
- Scenario 1: Exhausted Budget Limit
- Given that a BAM is on a postpaid payment method and, OPS Manager has consumed the entire Allowance  limit,
- When the manager attempts to book a trip,
- Then the system should prevent the manager from booking the trip until the budget has been settled.
- Scenario 2: Reset Consumption Limit
- Given that a BAM is on a postpaid payment method and, OPS Manager has settled the entire consumed spending allowance,
- When the OPs manager adds the paid amount, that is equal to the whole amount consumed
- Then the system should reset the consumption limit to the maximum Allowance amount the manager can use (i.e., spending allowance to max limit).
- Scenario 3: Partially Settled Budget
- Given that a BAM is on a postpaid payment method and, OPS Manager has settled a percentage or part of the consumed spending allowance,
- When the OPs manager adds the paid amount, that is less than the whole amount consumed
- Then the system should add the amount paid to the budget to be used before the manager reaches the max spending allowance again
- Scenario 4: Increasing the spending allowance
- Given that an OPs Manager is on a postpaid payment method and wants to increase the spending allowance, whether he exhausted it fully or  not
- When The Ops Manager Increases the limit
- Then the system should increase the max spending allowance, and allow the business account manager to consume till he reaches this limit
- Scenario 5: Decreasing the spending allowance
- Given: An OPs Manager is on a postpaid payment method and wants to decrease the spending allowance
- When: The OPs Manager decreases the limit
- Then: The system should decrease the max spending allowance as long as the new limit is equal to or greater than the previous budget spending limit add balance minus the due budget, and allow the BAM to consume until they reach this new limit

---

### CMB-503: Design: Creating More Program

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-08-30

**Description:**
As a business account manager, I want to be able to create different Programs with different Parameters, so that I can assign different Groups to the different program

---

### CMB-2249: Dev BE: Users Stats Endpoint

**Status:** Done | **Priority:** No Priority
**Created:** 2022-12-05

---

### CMB-566: Dev - BE: Post Paid Plan

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-09-07

**Description:**
As a business account manager I need to be able to choose to pay by the end of the month, so that I need to be able to get in contact with the sales team, so I can organize a meeting and be able to sign contracts and activate the program

**Acceptance Criteria:**
- We need to be able to activate a different contact person in every country
- User needs to be able the available slots in the sales team calendar
- OPs team member must have the ability to activate the Dashboard from his to the BAM, and make it accessible for him
- BAM needs to be able to access the dashboard while it's not activated

---

### CMB-972: Dev - FE: Program Number of Trips

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-10-05

**Description:**
As a business account manager, I need to be able to set a number of trips that can be taken for each member on a weekly, and daily basis so that all group members can use the program fairly

**Acceptance Criteria:**
- The business account manager needs to be able to choose whether to set the number of trips on a Daily or weekly basis
- The business account manager needs to be able to enter an integer that represents the number of trips can be taken for every group members
- The business account manager needs to be able to choose whether to set the number of trips on a Daily basis.

---

### CMB-3722: Sending Email to support team

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-28

**Description:**
As a business account manager, I need to be able to find a point of contact person so that I can send an email to the account manager to get help regarding any problem I have

**Acceptance Criteria:**
- The email the person is the static generic support email
- BAM needs to find guidelines on how to create the email

---

### CMB-5018: Inviting another Business Account Manager 

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-04-14

**Description:**
As a Business Account Manager, I want to be able to change a user's role from Rider to another Admin within the Users list table of the web app.

**Acceptance Criteria:**
- The business account manager needs to be able to Locate and click on a button that allows updating the user role. from the table
- Change the user's role from Rider to Business Admin
- Send an email invitation to the Active Rider, that contains a randomly generated Password, and link to the registration screen
- Allow the invited user to gain equal access and permissions as the main Business Account Manager upon completion of the setup process.
- The New Business Admin will not be able to remove the BAM
- In the Table of the Business Riders, we need to be able to see every user role
- Only the Super Business Account Manager he’s the only one who can downgrade user access from a BAM to a Business Rider
- Scenario 1: Access the Users List Table and Update the User Role
- Given: I am a Business Account Manager
- When: I access the Users list table within the web app
- Then: I can locate a button that allows me to update the user role
- Scenario 2: Change User Role from Rider to Business Account Manager
- Given: I am a Business Account Manager and have accessed the Users list table
- When: I click on the button to update the user role for a specific Rider
- Then: I can change the user's role from Rider to another Business Account Manager
- Scenario 3: Send Email Invitation for Setup Process
- Given: I am a Business Account Manager and have changed a user's role from Rider to another Business Account Manager
- When: I send an email invitation to the user
- Then: The user receives the email that contains the randomly generated password, and the link to the registration page
- Scenario 4: Invited User Gains Equal Access and Permissions
- Given: A user has been invited to become a Business Account Manager and has completed the setup process
- When: The user logs in to their Business Account Manager account
- Then: They gain equal access and permissions as the main Business Account Manager
- Email Template
- Dear [User's Name],
- We are pleased to inform you that your role has been upgraded to Business Account Manager in our Yassir for Business platform. With this new role, you now have the ability to manage various aspects of our system, including:
- Programs
- Groups
- Payments
- Users
- To complete the setup process and activate your new role, please follow the instructions provided in the email invitation and register as a Business Account Manager using the link below:
- [Login Link]
- You can use this random generated password:---------- to login, don’t forget to update it later
- If you have any questions or need assistance, please don't hesitate to contact our support team.
- Best regards,
- [Your Name] [Your Title] Yassir for Business Team
- Cher(e) [Nom de l'utilisateur],
- Nous avons le plaisir de vous informer que votre rôle a été mis à jour en tant que Gestionnaire de Compte Entreprise sur notre plateforme Yassir pour les Entreprises. Avec ce nouveau rôle, vous avez désormais la possibilité de gérer différents aspects de notre système, notamment :
- Programmes
- Groupes
- Paiements
- Utilisateurs
- Pour finaliser le processus de configuration et activer votre nouveau rôle, veuillez suivre les instructions fournies dans l'invitation par e-mail et vous inscrire en tant que Gestionnaire de Compte Entreprise en utilisant le lien ci-dessous :
- [Lien de Connexion]
- Vous pouvez utiliser ce mot de passe généré aléatoirement : ---------- pour vous connecter, n'oubliez pas de le mettre à jour ultérieurement.
- Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à contacter notre équipe de support.
- Cordialement,
- [Votre Nom] [Votre Titre] Équipe Yassir pour les Entreprises
- عزيزي/عزيزتي [اسم المستخدم],
- يسرنا أن نبلغكم بأن قد تم ترقيتك إلى مدير حساب الشركة في منصتنا يسير للشركات. مع هذا الدور الجديد، تمتلكون الآن القدرة على إدارة جوانب مختلفة من نظامنا، بما في ذلك:
- البرامج
- المجموعات
- المدفوعات
- المستخدمين
- لإتمام عملية الإعداد وتفعيل دوركم الجديد، يُرجى اتباع التعليمات المقدمة في دعوة البريد الإلكتروني والتسجيل كمدير حساب الشركات باستخدام الرابط أدناه:
- [رابط تسجيل الدخول]
- يمكنكم استخدام كلمة المرور المولدة عشوائيًا هذه: ---------- لتسجيل الدخول، ولا تنسوا تحديثها لاحقًا.
- إذا كان لديكم أي استفسارات أو بحاجة إلى مساعدة، فلا تترددوا في التواصل مع فريق الدعم لدينا.
- مع خالص التحية،
- [اسمكم] [مسماكم الوظيفي] فريق ياسر للشركات

---

### CMB-2748: Design: Listing Admins

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-01-04

**Description:**
As a Super Admin, I need to be able to see a list of all signup OPs Admins on the admin panel so that We can remove access from unnecessary users, or grant them visibility access on some countries

**Acceptance Criteria:**
- I need to be able to see Admin Name, Email
- I need to be able to see the list of countries where he has access to it
- For Admin who doesn't have visibility on any of the markets their country list must be empty
- Super  Admin is able to grant or deny access for any Admin on any market
- I need to be able to delete a user from the list so that he can lose access to the Admin panel
- All changes the removed admin made, will not be affected by his removal
- Admins doesn't have edit access to this Dashboard, only view access

---

### CMB-604: Dev - BE: Choosing A payment Option  

**Status:** Done | **Priority:** No Priority
**Created:** 2022-09-08

**Description:**
As a business account manager, I need to be able to add at least one pre-paid payment method (Topping Up Some Amount, or Adding a credit card for instant payment) or chose the post-paid option and contact the sales team, in order to complete my setup, so that my info would be verified if needed, and I can start using the program, with other business Riders

---

### CMB-10202: Schedule Trips in Bulks

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-10-31

**Description:**
As a Business Account Manager (BAM) using the B2B web app, I need to be able to schedule a business trip, specify the details, and further, have the flexibility to repeat this trip for the upcoming week -7 Days Max, starting from my day-. It is essential that the system ensures alignment with the program parameters and business conditions to maintain compliance with our business rules, budget, and service limitation

**Acceptance Criteria:**
- The system allows me to schedule a business trip and repeat it for the upcoming week.
- The system checks if the scheduled trips align with program parameters and business conditions.
- The system books trips according to my budget, considering any limitations.
- If there are conflicts with program parameters, the system excludes those days and books trips for the remaining available days.
- I receive notifications for any conflicts, budget limitations, or excluded days.
- I can easily access and view all the scheduled trips, including pending ones, from the BAM dashboard.
- If we change the service we need to re-estimate all the trip cost
- If we are scheduling a trip on the last allowed day of the service to be scheduled, then I can’t be able to schedule the trip in bulk in the future.
- If the user has Clicked on the Schedule in Bulk Button, then The user needs to see two cards, including the first scheduled day, and the following scheduled day and if he clicked on the negative sign to remove one scheduled day, the schedule in bulks must be disabled
- Scenarios:
- Scenario 1: Scheduling a Single Trip
- Given: I am logged into the B2B platform as a BAM, and I have selected a business rider.
- When: I enter the trip details, including pickup location, destination, selected service, and the initial trip date.
- Then: The system validates the trip details.
- And: I have the option to repeat this trip for the upcoming week.
- Scenario 2: Repeating the Trip for the Upcoming Week
- Given: I have scheduled a single trip for a business rider.
- When: I choose to repeat this trip for the upcoming week.
- Then: The system checks if the trip aligns with the program parameters and business budget.
- And: It ensures that the selected days for repeating align with the allowed booking days, and we have a sufficient budget for the list of trips
- Scenario 3: Budget Allows Booking of All Upcoming Trips
- Given: The trip details align with program parameters, business conditions, and available booking days.
- And: My budget permits booking all the trips for the upcoming week.
- Then: The system books all the trips seamlessly without any limitations.
- Scenario 4: Budget Limits Booking for Upcoming Trips
- Given: The trip details align with program parameters, business conditions, and available booking days.
- And: My budget imposes limitations _sufficient budget for all trips_, allowing only a certain number of trips.
- When: I choose to repeat the trip for the upcoming week.
- Then: The system books the maximum number of trips possible, considering budget constraints.
- And: It starts booking from the nearest available date.
- Scenario 5: Conflicts with Program Parameters
- Given: The trip details conflict with certain program parameters or business conditions.
- When: I select to repeat the trip for the upcoming week.
- Then: The system identifies and excludes days within the upcoming week that conflict with program parameters or business conditions.
- And: It books the trip exclusively for the days without conflicts.
- Scenario 6: Viewing All Scheduled and Pending Trips
- Given: I have successfully scheduled one or more repeating business trips.
- When: At a later time, I want to review the trips' status.
- Then: I can conveniently access the B2B platform to view a comprehensive list of all scheduled trips, including those awaiting approval.
- Scenario 7: Viewing All Scheduled and Pending Trips
- Given that I am a user of the trip-scheduling service, And I have chosen the last allowed day to schedule a service,
- When I try to schedule the same trip in bulk for future dates,
- Then the system should prevent me from doing so, by disabling the schedule in Bulk Button
- Given that I am a user in the trip scheduling application, And I have accessed the feature to schedule trips,
- When I click on the "Schedule in Bulk" button,
- Then I should see two cards displayed on the screen, And these cards should include the first scheduled day and the following scheduled day.
- Given that I am a user in the trip scheduling application, And I have accessed the feature to schedule trips,
- When I click on the negative sign (-) on any of these cards to remove a scheduled day,
- Then the "Schedule in Bulk" feature must be disabled, And the system should visually indicate that bulk scheduling is no longer an option, And provide a prompt or message explaining why bulk scheduling has been disabled.

---

### CMB-10208: User Infographics Section

**Status:** Done | **Priority:** No Priority
**Created:** 2023-10-31

**Description:**
As a BAM (Business Account Manager) on the B2B platform, I want a section where I can monitor the status of users and have the ability to create new groups or programs, invite users, or contact support

**Acceptance Criteria:**
- BAMs should see a pie chart displaying the total number of users.
- The pie chart should include the percentage of active users versus pending users.
- Within the section, BAMs should find buttons for creating new groups, creating new programs, inviting users, and contacting support.
- Scenarios:
- Scenario 1: Accessing the Users and Groups Section
- Given that I am a logged-in BAM on the B2B platform,
- When I access the Home Dashboard screen,
- Then I should see a section labeled "Users and Groups."
- Scenario 2: Viewing the Total Number of Users
- Given that I am a BAM in the "Users and Groups" section,
- When I look at the bar chart,
- Then I should see a visual representation of the total number of users.
- Scenario 3: Checking Active versus Pending Users
- Given that I am a BAM viewing the "Users and Groups" section,
- When I examine the bar chart,
- Then I should also see the percentage of active users versus pending users.
- Scenario 4: Creating a New Group
- Given that I am a BAM in the "Users and Groups" section,
- When I want to create a new group,
- Then I should find a button labeled "Create New Group."
- And when I click on the "Create New Group" button,
- Then I should be redirected to a page where I can specify group details and create the group.
- Scenario 5: Creating a New Program
- Given that I am a BAM in the "Users and Groups" section,
- When I intend to create a new program,
- Then I should find a button labeled "Create New Program."
- And when I click on the "Create New Program" button,
- Then I should be redirected to a page where I can define program parameters and create the program.
- Scenario 6: Inviting Users
- Given that I am a BAM in the "Users and Groups" section,
- When I want to invite users to join the platform,
- Then I should find a button labeled "Invite Users."
- And when I click on the "Invite Users" button,
- Then I should be directed to a user invitation page where I can send invitations to potential users.
- Scenario 7: Contacting Support
- Given that I am a BAM in the "Users and Groups" section,
- When I need assistance or support,
- Then I should see a button labeled "Contact Support."
- And when I click on the "Contact Support" button,
- Then I should be redirected to a support contact page where I can reach out to the support team for help.

---

### CMB-8910: Business Riders Trip Permission from Program 

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-09-06

**Description:**
As a Business Account Manager (BAM), I want the ability to control whether users in a specific program can request trips without requiring manual approval from me or any Business Admin from the BAM web application.

**Acceptance Criteria:**
- Scenario 1: Enabling Auto-Approval for a Program
- Given I am a Business Account Manager (BAM),
- When I access the BAM web application and navigate to program settings,
- Then I should find an option to enable or disable auto-approval for the selected program.
- Scenario 2: Disabling Auto-Approval by Default
- Given I am configuring program settings,
- When I create a new program or access existing ones,
- Then the auto-approval feature should be disabled by default for all programs to maintain the current manual approval workflow.
- Scenario 3: Enabling Auto-Approval for a Specific Program
- Given I am configuring program settings,
- When I choose to enable auto-approval for a specific program,
- Then trip requests made by Business Riders within that program will be automatically approved without the need for manual intervention by me or any Business Admin.
- Scenario 4: Disabling Auto-Approval for a Specific Program
- Given I am configuring program settings,
- When I choose to disable auto-approval for a specific program,
- Then trip requests made by users within that program will require manual approval from me or any Business Admin before being confirmed.
- Scenario 5: Auto-Approval Status Indicator
- Given I am viewing a program's settings, from Program Overview Page
- When I look at the program details,
- Then there should be a clear indicator showing whether auto-approval is enabled or disabled for that program.
- Scenario 6: Valid Auto-Approval Time Limit
- Given I am configuring program settings,
- When I set the approval duration time limit to a value between 1 minute (minimum) and 60 minutes (maximum),
- Then the system should accept the defined time limit. and any trip will expire if it exceeds this time limit, with Rider Canceled status

---

### CMB-9332: Arabic Version of Group Management

**Status:** Done | **Priority:** No Priority
**Created:** 2023-09-27

**Description:**
As a Business Account Manager (BAM) using the B2B web application, I want to have the option to select Arabic as the language for the main Group page, the Group List, and all actions related to groups.

**Acceptance Criteria:**
- Given that I am on the main Group page or the Group List of the B2B web application, I should find a language selection option that allows me to switch to Arabic.
- When I select the Arabic language option, all text, labels, and content on the main Group page, the Group List, and any related actions should be displayed in Arabic characters. This includes group names, descriptions, and any relevant details.
- The layout and design of the main Group page and the Group List should adapt to support right-to-left (RTL) text direction when the Arabic language is chosen.
- Any action buttons, links, or interactions related to groups, such as creating a new group, editing existing groups, or managing group settings, should display labels and messages in Arabic when using the Arabic language option.
- Scenarios:
- Scenario 1: Switching to Arabic Language for Group Management
- Given: I am on the main Group page or the Group List of the B2B web application.
- And: I access the language settings.
- When: I choose the Arabic language option.
- Then: All text on the main Group page, the Group List, and group-related actions should switch to Arabic, and the layout should support RTL.
- Scenario 2: Viewing Group Details in Arabic
- Given: I am on the main Group page in Arabic mode.
- When: I click on a specific group to view its details.
- Then: The group details, including names, descriptions, and relevant information, are displayed in Arabic.
- Scenario 3: Interaction with Arabic Labels
- Given: I am on the main Group page or the Group List in Arabic mode.
- When: I perform actions such as creating a new group, editing an existing one, or managing group settings.
- Then: All action buttons, links, and labels related to group management should be displayed in Arabic, ensuring a seamless Arabic user experience for managing groups.

---

### CMB-9330: Arabic Version of Users List Screen

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-09-27

**Description:**
As a Business Account Manager (BAM) using the B2B web application, I want to have the option to switch the language on the Users List screen to Arabic.

**Acceptance Criteria:**
- Given that I am on the Users List screen of the B2B web application when I access the language settings, I should see an option to switch to Arabic.
- Given that I am on the Users List screen and I select the Arabic language option, the entire interface layout, including text alignment, button placements, and overall design, should transform to support right-to-left (RTL) text direction.
- Given that I am on the Users List screen and I have chosen the Arabic language option, all displayed text, including user names, role labels, and action buttons, should be presented in Arabic characters and be properly aligned from right to left.
- Given that I am on the Users List screen and using the Arabic language option, when I search for users or enter filter criteria into input fields, the input text direction should be from left to right.
- Given that I am on the Users List screen in Arabic mode when I perform actions like updating user information or changing roles, any confirmation or action buttons should display labels in Arabic text.
- Scenario 1: Accessing User Information
- Given that I am logged into the Yassir Go For Business Client web app as a Business Account Manager,
- When I navigate to the users list section,
- Then I should be able to view the phone number of each user listed.
- Scenario 2: Searching Users
- Given that I am on the users list section of the Yassir Go For Business Client web app as a Business Account Manager,
- When I use the search bar,
- And I enter at least 3 letters of a user's name, email, or phone number,
- Then the app should display all possible matching results that meet the search criteria.

---

### CMB-10457: CSV Template for inviting users

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-11-10

**Description:**
As a Business Account Manager (BAM) using the B2B web app, I want the ability to download a CSV template from the user invitation page.

**Acceptance Criteria:**
- Scenario 1: Accessing the User Invitation Page
- Given: I am logged in as a BAM on the B2B web app.
- When: I navigate to the user invitation page
- Then: I should find an option to "Download CSV Template" on the user invitation page.
- Scenario 2: CSV Template Content
- Given: I have downloaded the CSV template.
- When: I open the CSV template file.
- Then: I find one column with Email Examples of the users in the CSV file. name@company.com
- Scenario 3: When Downloading the
- Given: I’m downloading the CSV template.
- When: The CSV file is prepared.
- Then: I find the icon of download changed to a update status, and once the download preparation is done, I need to receive a notification

---

### CMB-8162: Export Trips from Admin Panel 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-08-08

**Description:**
As an Operations Manager (Ops Manager), I want to be able to export a list of trips that occurred within a specific duration in CSV format from the trips table in the enterprise details section of the admin panel.

**Acceptance Criteria:**
- Given that I am logged in as an Ops Manager,
- When I navigate to the enterprise details section of the admin panel and access the trips table,
- Then I should find a button labeled "Export Trips."
- Given that I am on the trips table within the enterprise details section,
- When I click on the "Export Trips" button,
- Then I should see fields where I can select the start date and end date for the duration of trips I want to export.
- Given that I have selected a valid start date and end date within a maximum range of 90 days,
- When I click on the "Export" button after choosing the duration,
- Then a CSV file containing trip data for the selected duration should be generated and sent to my email.
- Given that I have selected an invalid start date and end date (e.g., exceeding 90 days or start date later than the end date),
- When I try to click on the "Export" button,
- Then an error message should be displayed indicating that the selected duration is invalid.
- CSV File Columns:
- Trip UID
- Requested At
- Finished At
- Status
- Is Booked
- Cost
- Yassir Commission
- Added Commissions
- Discounts on Each Trip
- Discount Condition Met or Not
- Driver Gain
- Pickup
- Destination
- Driver Name
- Driver ID
- Driver Phone
- Rider Name
- Rider Phone
- Scenarios:
- Scenario 1: Exporting Trips for a Valid Duration
- Given: I am on the trips table in the enterprise details section and I want to export trip data
- When: I click on the "Export Trips" button and select a valid start date and end date within 90 days
- And: I click on the "Export" button in the export options pop-up
- Then: A CSV file containing trip data for the selected duration is generated and sent to my email.
- Scenario 2: Exporting Trips for an Invalid Duration
- When: I click on the "Export Trips" button and select an invalid start date and end date (e.g., exceeding 90 days)
- And: I try to click on the "Export" button in the export options pop-up
- Then: An error message is displayed indicating that the selected duration is invalid.
- Scenario 3: Exporting Trips with Start Date Later Than End Date
- When: I click on the "Export Trips" button and select a start date later than the end date
- Scenario 4: No Trips Found for the Selected Duration
- And: There are no trips found for the selected duration
- Then: A message is displayed informing me that no trips were found for the specified duration, and no CSV file is generated.
- Scenario 5: Exporting Trips with Empty Start Date or End Date
- When: I click on the "Export Trips" button and leave either the start date or end date field empty
- Then: An error message is displayed indicating that both start date and end date are required.
- Scenario 6: Exporting Trips with Start Date Equal to End Date
- When: I click on the "Export Trips" button and set the start date equal to the end date
- Scenario 7: Exporting Trips with Start Date in the Future
- When: I click on the "Export Trips" button and set the start date in the future
- Then: An error message is displayed indicating that the selected start date is in the future.
- Scenario 8: Exporting Trips with End Date in the Future
- When: I click on the "Export Trips" button and set the end date in the future
- Then: An error message is displayed indicating that the selected end date is in the future.
- Scenario 9: Exporting Trips with End Date Before Start Date
- When: I click on the "Export Trips" button and set the end date before the start date
- Then: An error message is displayed indicating that the end date cannot be before the start date.
- Scenario 10: Exporting Trips with Maximum Allowed Duration
- When: I click on the "Export Trips" button and select the maximum allowed duration of 90 days
- Then: A CSV file containing trip data for the selected 90-day duration is generated and sent to my email.
- Scenario 11: Exporting Trips with Valid Duration and Specific Columns
- When: I click on the "Export Trips" button, select a valid start date and end date, and choose specific columns to include in the export
- Then: A CSV file containing trip data for the selected duration and the chosen columns is generated and sent to my email.
- Given that I am logged in as a business account manager when I navigate to the trip list screen in the web application, then I should find a button labeled "Export Trips."
- Given that I am on the trip list screen and I click on the "Export Trips" button, when the export options pop up, then I should see a field where I can select the start date and end date for the duration of trips I want to export.
- Given that I have selected a valid start date and end date within a maximum range of 90 days, when I click on the "Export" button after selecting the duration, then a CSV file containing trip data for the selected duration should be generated and sent to my email
- Given that I have selected an invalid start date and end date (e.g., exceeding 90 days or start date later than the end date), when I try to click on the "Export" button,  should be disabled
- Given: I am on the trip list screen and I want to export trips data
- Then: A CSV file containing trip data for the selected duration is generated and sent to my email
- Then: the export button is disabled

---

### CMB-13788: Detailed FAQ on Users Page

**Status:** Done | **Priority:** P3 - Low
**Created:** 2024-04-12

**Description:**
As a Business Account Manager using the Yassir for Business Web App, I need to access a list of Frequently Asked Questions (FAQs) directly from the main user screen. This will facilitate easy access to information on how to invite users to the platform.

**Acceptance Criteria:**
- Scenario 1: Accessing the FAQs
- Given that I am logged into the Yassir for Business Web App as a Business Account Manager,
- When I navigate to the main user screen,
- Then I should find a clearly labeled section or button for accessing the FAQs.
- Scenario 2: Finding Information on Inviting Users
- Given that I have accessed the FAQs section,
- When I browse through the list of questions,
- Then I should find information specifically addressing how to invite users to the platform.
- Scenario 3: Clarity and Relevance
- Given that I view the FAQs,
- When I read the information on inviting users,
- Then the content should be clear, concise, and relevant to my needs as a Business Account Manager.
- Scenario 4: Number of questions
- Given that I view the FAQs, of the user's section
- When I check the user's FAQ
- Then the content section will be fixes number of questions 4 Questions
- Note: We need to integrate the feature flag for it, for each page
- We need to have google analytics events integrated

---

### CMB-11784: Change Admins in Bulk

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-01-15

**Description:**
User Story:

**Acceptance Criteria:**
- Scenario 1: Changing Dedicated Account Manager for All Companies
- Given that I am logged into the BtoB Admin Panel as an Admin,
- When I navigate to the enterprise details section, I locate the option to change the assigned Dedicated Account Manager, on settings page
- Then I should find a pop-up window that allows me to select the new Dedicated Account Manager. And I should see a checkbox option labeled "Apply to All Companies". When I check this option and confirm the change,
- Then the new Dedicated Account Manager should be applied to all companies that currently have the previous Dedicated Account Manager assigned.
- Scenario 2: Changing Dedicated Account Manager for Current Company Only
- Given that I am on the same pop-up window to change the Dedicated Account Manager,
- And I have unchecked the "Apply to All Companies" option,
- When I confirm the change,
- Then the new Dedicated Account Manager should only be assigned to the current company.
- Scenario 3: Cancelling the Change
- Given that I have initiated the process of changing the Dedicated Account Manager,
- When I decide to cancel the change,
- Then I should have the option to close the pop-up window without applying any changes.
- And the previously assigned Dedicated Account Manager should remain unchanged.
- Scenario 4: Changing from Dedicated Account Manager to Default
- Given that I have initiated the process of changing the Dedicated Account Manager, to default
- When I click on Update
- Then I should have the option to apply these changes to this company only or to all companies
- Scenario 5: Changing from Default to Dedicated Account Manager
- Given that I have initiated the process of changing the default values to a dedicated account manager
- Then the changes should be applied to this company only
- Scenario 6: Removing a Dedicated Account Manager
- Given that we have removed a dedicated manager whether by removing the Dedicated account manager, Changing his phone number to be in another country or removing his phone number
- When we confirm those changes
- Then the changes should be applied to all companies, that they will have the default customer support data
- Default Customer Support Data
- Algeria:
- Email: support.business@yassir.com
- Phone Number:
- Mobile Phone:
- 70435883
- 70405602
- Direct: 021 99 99 95
- Tunisia:
- Email: business@yassir.tn
- Phone number: Default: +216 31.322.000
- Access to Password Management:
- Given I am logged into the admin panel as any type of admin,
- When I navigate to the user management section,
- Then I should see an option to change the password for each user.
- Password Change Interface:
- Given I have selected a user,
- When I choose the option to change their password,
- Then I should be presented with a form to enter a new password.
- Password Validation:
- Given I have entered a new password,
- When I submit the change,
- Then the system should validate the new password according to the set password policies (e.g., minimum length, complexity).

---

### CMB-13265: Edit the Day, and hour of the scheduled trip in Bulk

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-03-20

**Description:**
As a Business Account Manager (BAM) using the Yassir for Business Web App, I need the ability to schedule trips in bulk with flexibility in adjusting the day and time for multiple trips simultaneously. This functionality enables efficient trip management by allowing me to organize trips according to specific scheduling preferences.

**Acceptance Criteria:**
- Accessing Bulk Trip Scheduling:
- Given that I am logged into the Yassir for Business Web App as a BAM,
- When I navigate to the trip scheduling section,
- Then I should find an option or button specifically for bulk trip scheduling.
- Initiating Bulk Trip Scheduling:
- Given that I have accessed the bulk trip scheduling feature,
- When I select the trips I wish to schedule in bulk,
- Then I should be able to proceed to the scheduling interface.
- Adjusting Day and Time for Scheduled Trips:
- Given that I am on the bulk trip scheduling interface,
- When I select multiple trips to schedule,
- Then I should find options to adjust the day and time for all selected trips simultaneously.
- Changing Scheduled Day:
- Given that I am adjusting the scheduling details for multiple trips,
- When I choose to change the scheduled day,
- Then all selected trips should reflect the new day selected.
- Modifying Scheduled Time:
- Given that I am adjusting the scheduling details for multiple trips,
- When I choose to change the scheduled time,
- Then all selected trips should update to reflect the new time chosen.
- Configuring Multiple Trips on the Same Day:
- Given that I am scheduling multiple trips on the same day,
- When I adjust the scheduling details,
- Then I should be able to set different times for each trip, allowing for flexibility in scheduling.
- Configuring Multiple Trips on Different Days:
- Given that I am scheduling multiple trips on different days,
- When I adjust the scheduling details,
- Then I should be able to set the same or different times for each trip as per my requirements.
- Validation and Error Handling:
- Given that I make changes to the bulk trip scheduling details,
- When I submit the scheduling request,
- Then the system should validate the input to ensure consistency and accuracy.
- If there are any errors or conflicts detected, appropriate error messages should be displayed, guiding me on how to resolve them.
- Confirmation and Feedback:
- Given that I have successfully scheduled multiple trips in bulk,
- When the scheduling process is completed,
- Then I should receive a confirmation message indicating the successful scheduling of all selected trips.
- Max Number of trips per day
- Given that I have booked two trips per day
- When the user tries to enter a third trip
- Then the adding trips button for the same day should be disabled

---

### CMB-14918: Download Invoices In Bulk

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-05-26

**Description:**
As an Admin (on the admin panel) I need to be able to download all the invoices of all companies in bulk for a specific month, by going to the country tab I need to be able to see a button with ‘Download All Invoices’ by clicking on it I should be able to choose a specific month, and finally receive on my inbox a CSV file that contains all the invoices of all companies, where each row in the CSV file should represent an individual invoice and include details such as the company name, BAM Name, Email, and Phone number.

**Acceptance Criteria:**
- Accessing the Country Settings screen
- Given, As an admin, I access the "Country Settings" page on the admin panel.
- When I navigate to the "Country Settings" page.
- Then, upon clicking the download button, I receive a CSV file containing the invoices in my email inbox after selecting the appropriate settings (month, year).
- Receiving the invoice file
- Given: I have received the CSV file in my inbox.
- When: I check the contents of the CSV file.
- Then: Each row in the CSV file corresponds to an individual invoice and includes comprehensive details such as the company name, BAM Name, Email, and Phone number, and the link for the invoice ensuring clarity and ease of reference.
- Quarterly and yearly invoices should be downloaded in overlapped cycles
- Given: we have businesses that have quarterly, and annual invoices
- When: I download the invoices for a certain month (Feb,)
- then I need to download all Q1 invoices, yearly invoices of companies which has this configuration only if those invoices were already generated

---

### CMB-13289: How to invite users?

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-20

---

### CMB-13097: Enforce Service Applying Bulk Action

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-12

**Description:**
As an OP Manager using the Yassir for Business Admin panel,

---

### CMB-14921: Password reset from the admin panel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-05-26

**Description:**
As an admin (on the adminPannel), I should have the ability to reset the B2B users (BAM, BA, Program Moderators) password directly from the adminPannel without the need to initiate the "forgot password" flow.

**Acceptance Criteria:**
- Resetting the password 1
- Given: I am logged into the adminPannel as an admin.
- When: I navigate to the user management section clicking on the edit icon of the user.
- Then:
- I should find an option to change the password for the specific B2B users (BAM, BA, Program Moderators) who have forgotten their password and are unable to proceed with the "forgot password" flow.
- Upon selecting the option to change password: I am presented with a form to input the user's new password with a confirmation button when clicked a verification on the password is done (if it is a strong password) and a pop-up shows to inform that the password has been successfully updated.
- Resetting the password 2
- Given: I am logged into the adminPannel as an admin.
- When: I navigate to the user management section clicking on the edit icon of the user.
- Then: i should see the call to action button in order to send the user an email with the setting password field

---

### CMB-13591: Admin Access to the client Web App

**Status:** Done | **Priority:** No Priority
**Created:** 2024-04-03

**Description:**
As an Admin on the Yassir for Business Admin panel, I need to find a button that allows me to access the client's web app. This functionality enables me to efficiently manage client programs, groups, and users. Additionally, I should be able to configure user permissions to restrict access to specific pages within the web app.

**Acceptance Criteria:**
- Scenario 1: Accessing Client's Web App
- Given: I am logged into the Yassir for Business Admin panel.
- When: I navigate to the dashboard or settings section of the admin panel.
- Then: I should find a clearly labeled button or link that provides access to the client's web app.
- Scenario 2: Managing Programs, Groups, and Users
- Given: I have accessed the client's web app via the admin panel.
- When: I navigate through the web app interface.
- Then: I should be able to manage client programs, create and edit groups, and add or remove users as necessary.
- Scenario 3: Limiting User Permissions
- Given: I am logged into the Yassir for Business Admin panel.
- When: I access the user management or permissions settings.
- Then: I should find options to configure user permissions, allowing me to restrict access to specific pages or functionalities within the client's web app.
- Scenario 4: Configuring Restricted Pages
- Given: I am configuring user permissions for a specific user or group.
- When: I select the pages or functionalities to restrict access to.
- Then: The system should allow me to save these configurations, ensuring that users only have access to authorized pages within the web app.

---

### CMB-13411: Change users permission on price visibility and trip permission, and group 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-25

**Description:**
As an Operations (OP) Administrator on the Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Accessing User Group Modification Feature
- Given I am logged into the Admin Panel,
- When I navigate to the user management section,
- Then I should find an option to modify the user's group settings.
- Scenario 2: Changing User Group with Program Visibility
- Given I am modifying a user's group settings on the Admin Panel,
- When I select a new group for the user,
- And view the associated program,
- Then the user's group should be updated accordingly, with the program information displayed.
- Scenario 3: Setting Price Visibility Rule
- Given I am modifying a user's group settings on the Admin Panel,
- When I choose to adjust their price visibility rule,
- And set it to follow the program rules,
- Then the user's access to price visibility should align with the rules defined by their program.
- Scenario 4: Changing Price Visibility Rule Individually
- Given I am modifying a user's group settings on the Admin Panel,
- When I choose to adjust their price visibility rule,
- And set it to always visible or always hidden,
- Then the user's access to price visibility should be updated accordingly, regardless of the program rules.
- Scenario 5: Setting Trip Permission Rule
- Given I am modifying a user's group settings on the Admin Panel,
- When I choose to adjust their trip permission rule,
- And set it to follow the program rules,
- Then the user's trip permission settings should adhere to the rules defined by their program.
- Scenario 6: Changing Trip Permission Rule Individually
- Given I am modifying a user's group settings on the Admin Panel,
- When I choose to adjust their trip permission rule,
- And set it to always auto-approve or always ask for permission,
- Then the user's trip permission settings should be updated accordingly, irrespective of the program rules.

---

### CMB-11994: User Page to manage user permissions from users list

**Status:** Done | **Priority:** No Priority
**Created:** 2024-01-24

**Description:**
As a Business Account Manager (BAM), I want the ability to change a user's role from the user management section.

**Acceptance Criteria:**
- Scenario 1: Changing User Role to Program Moderator
- Given: I am logged in as a Business Account Manager (BAM) on the Yassir platform.
- When: I navigate to the user management section and click on the edit button next to a user's profile.
- Then: I should be directed to a subpage where I can change the user's role to "Program Moderator."
- And: Upon saving the changes, the user's role should be updated to "Program Moderator."
- Scenario 2: Changing User Role to Business Rider
- Given: I am logged in as a Business Account Manager (BAM) on the Yassir platform.
- When: I access the user management section and select the edit button for a user.
- Then: I should be taken to a subpage that allows me to change the user's role to "Business Rider."
- And: After saving the changes, the user's role should be updated to "Business Rider."
- Scenario 3: Changing User Role to Business Admin
- Given: I am logged in as a Business Account Manager (BAM) using the Yassir platform.
- When: I go to the user management section and click the edit button next to a user's profile.
- Then: I should be directed to a subpage where I can modify the user's role to "Business Admin."
- And: After saving the changes, the user's role should be updated to "Business Admin."

---

### CMB-16388: Update Exported Trips CSV file 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-07-22

**Description:**
As an Admin on the Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Accessing the Country Configuration Tab
- Given that I am logged into the Admin Panel,
- When I go to the "Country Configuration" tab,
- Then I should be able to choose the option to export trip files for finished trips or requested trips.
- Scenario 2: Exporting Trip Files with Cost Breakdown
- Given that I have chosen to export trips (either finished or requested),
- When I export the trip files,
- Then the exported file should include the following cost breakdown fields:
- Cost: The total cost of the trip including commission (Rider Pay Value).
- Yassir Commission: The commission taken by Yassir from the driver, displayed as both a percentage and a value.
- Yassir B2B Commission: The B2B commission defined from the B2B Admin panel, displayed as both a value and a percentage.
- Majoration Field: Calculated as Cost * (1 - B2B Company Commission in percentage).
- Driver Gain Brut: Calculated as (Cost - Yassir Commission) - Driver Benefits net.
- Driver Benefit Tax: Displayed as both a value and a percentage.

---

### CMB-21435: GA Adding Guest User

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-01-09

**Description:**
As a product analyst,
I want to track Google Analytics (GA) events for actions related to guest users on the WebApp,

---

### CMB-18569: Verifying the users manually from admin panel

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-10-13

**Description:**
This is a minimal version from the story

**Acceptance Criteria:**
- Scenario 1: Approving a User Without OTP
- Given that a user has entered their phone number,
- When I click the "Verify" button for that user,
- Then  the Admin enters the Rider phone number and name, then system should bypass OTP validation
- Scenario 2: Assigning B2B Scope
- Given that I have approved a user,
- When the user is linked to the business,
- Then the system should assign the appropriate B2B scope and permissions to the user within the business.
- Scenario 3: Confirmation of User Approval
- Given that a user is successfully approved,
- Then I should see a confirmation message,
- And the user should appear as an active Business Rider in the business listing.
- Scenario 1: Displaying the Approve Button for All Users Invited to the business
- Given that I am logged into the Admin panel,
- When I navigate to the business details and access the user management section,
- Then I should find an "Approve" button next to every user that is listed with unverified phone number (no OTP verification).
- Scenario 2: Approving an Unverified phone number that was not previously saved
- Given that a user has not previously entered their phone number,
- When I click the "Approve" button for that user,
- Then as an admin I should be redirected to the onboarding process in order to input the phone number/full name/role on user’s behalf.
- Scenario 3: Creating a New Account for Users Without Existing Accounts
- Given that a user does not already have a Yassir account,
- Then the system should automatically create a new Yassir account for the user,
- And link the user to the business as a Business Rider.
- Scenario 4: Assigning B2B Scope
- Given that I have approved a user and finished his onboarding,
- Scenario 5: Confirmation of User Approval
- Then I should see a confirmation notification,
- Scenario 6: Handling Errors During Account Creation
- Given that there is an issue in creating a new B2C Yassir account for a user,
- When I attempt to approve the user,
- Then the system should display a clear error message and allow me to retry the process or flag the issue for resolution.
- Scenario 7: Attempt to approve a phone number that already has a B2B scope
- Given that a phone number is already has a B2B scope,
- Then the system should display a clear error message informing that the user has already been approved.

---

### CMB-20817: Assigning Sales Members per Company

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-12-17

**Description:**
As an admin on AdminPanel, I want to designate a Sales Representative from the "Manage Admins" screen and assign them to companies from the "Settings" tab, ensuring proper role-based access and management.

**Acceptance Criteria:**
- Scenario 1: Creating the new role 'Sales Representative'
- Given I am on the manage admin screen and I want to assign the new role to an admin on the list,
- When I click on the edit button,
- Then I should see a new field (toggle button) that would allow me set that admin as a sales representative.
- Scenario 2: Turning off sales rep toggle button
- Given I am on the manage admin screen (on the admins tab) and I want to revoke the sales rep role to an admin on the list,
- When I click on the edit button and turn off the sales rep toggle button and click confirm,
- Then
- the sales rep should be removed from the sales rep tab
- and now his new role should be admin and should be listed on the admins list
- and he should no longer have view restriction on the entreprises list (he should see the list of all companies)
- and the sales rep field on the entreprises setting tab that he is assigned to should be == N/A
- Scenario 3: Accessing enterprises settings screen
- Given I am on the details screen of a specific company,
- When I view the settings tab,
- Then I should see a new field (drop-down) that would allow me to assign a sales representative.
- Scenario 4: Assigning a Sales representative
- Given I am on the settings screen,
- When I click the drop-down,
- Then I should be able to see a list of all sales representatives, when save button is clicked, the sales rep is assigned to that company
- Scenario 5: Changing the Sales representative for a specific company
- Given I am on the settings screen and a sales rep is assigned to the company,
- When I change the sales rep and the save button is clicked,
- Then I should see a confirmation popup with two radio buttons: one to change the sales rep for only the selected company, and another to reassign all companies linked to the previous sales rep to the new one.
- Scenario 6: Previously Created Businesses Without a Sales Rep
- Given a company that was created before the introduction of the "Sales Rep" role,
- When an admin accesses the company details,
- Then the "Sales Rep" field should appear empty.
- Scenario 7: Filter Companies by Assigned Sales Rep
- Given as an admin on adminPanel I’m on the companies list,
- When an admin applies the "Sales Rep" filter in the company search,
- Then only companies assigned to the selected sales rep should be displayed.
- Scenario 8: Add a column to show if a sales rep is assigned
- Given as an admin on adminPanel,
- When I check the companies list,
- Then a new column is displayed to show the sales rep data.
- Scenario 9: Unassigning a Sales Representative
- Given I am an admin on the adminPanel,
- When I check the "Settings" tab of a specific company and attempt to unassign a sales rep,
- Then
- A confirmation model is displayed to inform the admin that this company will not have a sales rep assigned.
- A distinct CTA is used for unassigning sales rep (displayed once the company has a sales rep assigned).
- Bulk unassignment is restricted; assignments must be handled individually.

---

### CMB-19492: Export Business CSV File and Receive on Slack

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-11

**Description:**
As a  Admin on the B2B Admin Panel

**Acceptance Criteria:**
- Scenario 1: Exporting the Business CSV File
- Given I am logged into the Yassir for Business web app as a BAM,
- When I click the "Export" button from the enterprise list page,
- Then the system should generate the CSV file containing all the business details (company name, address, contact information, etc.).
- Scenario 2: Receiving the Exported File on Slack
- Given the export has been successfully completed,
- When the system generates the CSV file,
- Then the file should be automatically sent to a pre-configured Slack channel or direct message on Slack (depending on settings).
- Scenario 3: Slack Notification for Export Failure
- Given there is an issue with generating the CSV file,
- When I click on the "Export" button,
- Then I should receive an error message on Slack indicating the failure (e.g., "Export Failed: File generation error").
- Scenario 4: No Email Notification on Export Completion
- Given the export is successfully completed,
- When the CSV file is sent to Slack,
- Then I should not receive an email containing the exported file.
- Scenario 5: CSV File Format and Content
- Given the export is successful,
- When the file is received in Slack,
- Then the file should be properly formatted as a CSV, and Excel File format and include all relevant business details (company name, address, contact details, account history, etc.).

---

## Consolidated Acceptance Criteria

- Scenario 01 : Accessing Payment Section
- Given I am a superAdmin/ business admin on webApp
- When I click on the payment section
- Then I should see
- for post-paid companies :
- Invoices,
- Payment plan,
- monthly budget
- Budget/ due budget
- Pay Due Budget
- Payment Receipts
- for pre-paid companies :
- Remaining budget
- Topup budget
- Payment plan
- Invoices
- Scenario 02 : Accessing Top-up / Pay Due Budget Section
- Given I am a superAdmin/ business admin on payment screen
- When I click on Pay due budget/ Topup-budget
- Then an Overlay Screen is displayed with two options
- Online Payment
- Bank Transfer
- Scenario 03 : Accessing Bank Transfer Option
- When I choose the option bank transfer
- Then I should be able to see
- How to Banner to explain that after making a bank transfer the user should upload a payment recipts
- a button to allow me to upload a file (A picture or PDF file) as a proof of bank transfer payment
- Scenario 04 : Accessing Payment Receipts Section
- When I click on payment receipts banner
- Then I should be able to see a list of all payment receipts for online or Bank transfers payments
- Scenario 05 : Payment Receipts Table
- When I access the payment receipts section
- Then the table of the payment receipts should follow the following structure
- Payment Receipt Number
- Date
- Time
- Transaction amount
- Payment method (Satim, Dahabia, Bank Transfer/Cheque)
- Note : Following events should be added on this notion page
- Event
- Scenario 01 : Successful Parsing and Trip Creation
- As the system
- When a row contains valid phone number, pickup, dropoff, date, and time information
- Then a booked-for-later trip is created successfully
- Scenario 02 : Partial File Success
- When a file contains both valid and invalid rows
- Then valid rows are processed and invalid rows are rejected with detailed error reasons and notification should be sent to the user to provide the user with a file which contains a list of unsuccessfully booked trips
- Scenario 03 : Rider Not Linked to Business
- When a row contains a rider phone number not associated with the booking business
- Then the row is rejected and marked as a membership validation failure and the row should be added to the unsuccessful booked trips
- Scenario 04 : Invalid Date or Time
- When a row contains a past date or an invalid time format
- Then the row is rejected and no trip is created and the row should be added to the unsuccessful booked trips with the reason ‘past date or time’
- Scenario 05 : Duplicate Trip Detection
- When two rows contain identical rider, pickup, dropoff, date, and time
- Then the system flags the duplicate trip and the row should be added to the unsuccessful booked trips with reason : duplication
- Scenario 06 : Same rider, different location
- When a row contains a rider phone number more than once with different pickup or dropoff and same time
- Then the row is rejected and mark and no trip is created and the row should be added to the unsuccessful booked trips with the reason 'same rider different location in the same time'
- Scenario 07 : Booking Service
- When the trip is booked
- Then the service type should be the default one configured
- Algeria : Business Classic
- Tunisia : Business
- Marocco : Business classic
- Senegal : Classic
- Scenario 08 : Ops Visibility of Bulk-Booked Trips
- As an Ops manager
- When bulk booking trips are created
- Then they appear in the Ops dashboard with the same status as other booked-for-later trips and the standard booked for later trips flow should be applicable for the trips
- Scenario 09 : Phone number Parsing
- When the phone number is in different format
- Then the system should
- if the phone number did not have any country code (phone number starts with 0) : it should be following the business country code
- if the phone number does not have any country code or 0 : it should be following the business country code (BAM)
- if the phone number contains spaces, dashes, or any special character : those should be removed by the system
- if the phone number contains a country code : then the trip should be booked for that specific number
- Scenario 10 : File Validation Process
- As a system
- When a file is uploaded we need to validate the file in two phases
- Then the phases can be
- when submission
- valid input fields (mandatory fields not null)
- If maximum trips have been exeeded (50 trips per file)
- the system should book the 50 rows, and reject only the rows which exceeds the 50th row
- Date format (format of the date dd/mm/yyyy, how far can we go book for (2 weeks))
- Time format (hh:mm) (24H format)
- when booking a trip (in the background)
- user is not part of the business
- wrong locations
- programs validations
- Scenario 11 : Unsuccessful Trips File
- When there are some trips that were not successfully booked due to the second phase validation
- Then the system provided to the user we need to have an additionnal field 'Reason' besides all the columns of the file uploaded, and the reason column should contain an explanation why the trip have not been successfully booked
- Scenarion 01 : Valid File Upload
- As a B2B user
- When I upload a CSV or Excel file that follows the required template
- Then the system accepts the file and moves it to the parsing stage
- Scenarion 02 : File Format
- Then the file should contain the following columns
- Rider first name (NOT MANDATORY)
- Rider last name (NOT MANDATORY)
- Rider phone number( MANDATORY)
- Pickup location( MANDATORY)
- Dropoff location( MANDATORY)
- Date( MANDATORY)
- Time( MANDATORY)
- Scenarion 03 : Unsupported File Format
- When I upload a file with an unsupported format
- Then the system rejects the upload and displays an error message explaining the allowed formats
- Scenarion 04 : Missing or Invalid Columns
- When I upload a file with missing (the validation is done only on the mandatory fields)
- Then the system rejects the file and highlights the required structure
- Scenarion 05 : Empty File
- When I upload an empty file or a file with no data rows
- Then the system rejects the upload and informs me that the file contains no trips
- Scenarion 06 : File Row Limit Exceeded
- When I upload a file that exceeds 50 rows
- Then the system rejects the upload and displays a clear limitation message (the file should not exceed 50 rows)
- Event Name
- Scenario 1: Creating a New Group
- Given: I am logged in as a BAM on the Yassir for Business platform.
- When: I initiate the process of creating a new group.
- Then: I should be prompted to select a program to associate with the new group.
- Scenario 2: Selecting a Program
- Given: I am creating a new group and prompted to select a program.
- When: I attempt to proceed without selecting a program.
- Then: The system should prevent me from moving forward and display an error message indicating that selecting a program is mandatory.
- Scenario 3: Selecting a Program Successfully
- When: I select a program from the available options.
- Then: I should be able to proceed with creating the group without any errors.
- Scenario 4: Group Creation with Program Association
- Given: I have selected a program while creating a new group.
- When: I complete the group creation process.
- Then: The newly created group should be successfully associated with the selected program.
- Scenario 5: Group Creation Without Program Association
- Given: I attempt to create a new group without selecting a program.
- When: I try to proceed with group creation.
- Then: The system should prevent the creation of the group and display an error message instructing me to select a program before proceeding.
- No group can be assigned to two programs
- We can assign multiple groups to the same program
- Scenario 1: Accessing the create group flow
- Given the user is logged into the web app,
- When they navigate to the groups section and click on "create a program,"
- Then they should be prompted to fill in all mandatory fields, including the program field (dropdown list or create a new program).
- Scenario 2: Attempting to create a group without a program
- Given the user has entered a group name but left the program field empty,
- When they attempt to click "create,"
- Then the system should display an error message:
- "A program must be assigned to create a group."
- Scenario 3: Successfully creating a group with a program
- Given the user has filled in both the group name and the program field,
- When they click "create,"
- Then the group should be successfully created,
- And the program details should be reflected in the group settings page.
- Scenario 4: Assign unlinked groups (previously created) to default program
- Given there are groups that are not assigned to any program,
- Then the group should be assigned to the default program,
- Scenario : New Tab Displaying Inside Sales Representatives list
- Given I am an admin on adminPanel,
- When I click on the "Manage Admins" screen,
- Then I should see a new tab "Inside Sales".
- Scenario : Making an Admin an “Inside Sales“
- Given I am on the "Manage Admins" screen,
- When I click the gear icon to edit,
- Then I should see a new toggle button "Inside Sales".
- Scenario : Navigating to "Inside Sales" tab
- When I navigate to the "Inside Sales" tab,
- Then I should see a list of all inside sales along with the columns (Inside Sales name, Email, Phone number, Countries, Status, Actions (edit/delete)).
- And if no inside sales exist yet, an empty screen should be displayed with the message, "No inside sales are yet assigned."
- Scenario : Inside Sales Details Screen
- Given I am on the "Sales Representatives" tab,
- When I click gear on the actions column,
- Then a screen should appear displaying the details of the assigned leads.
- And the screen should include:
- Inside Sales Name
- Email
- Phone Number
- List of Assigned Leads
- Scenario 4: Redirect admins to lead details from the inside sales details screen
- Given I am on the inside sales details screen,
- When I click one of the leads the inside sales is assigned to,
- Then I should be redirected to the leads details screen for the specified lead.
- Scenario 5: Bulk Assignment of leads
- Given I am on the details screen for a sales representative,
- When I access the "Assigned Leads" field,
- Then I should see a drop-down list containing all leads listed by company name
- And the drop-down should allow me to:
- Search leads by name.
- Select multiple leads to assign to the inside sales.
- Uncheck leads to remove their assignment. (if the inside sales has previously assigned leads they should be checked on the list)
- Scenario 6: Saving Bulk Assignments
- Given I have updated the list of assigned leads,
- When I click "Save,"
- Then the updated assignments should be reflected in the inside sales’ details on the "Details Overlay Screen for the Inside Sales" and also reflected on the settings screen on the leads details section.
- Scenario 7: Validation
- Given I attempt to save without selecting any leads,
- Then the inside sales should be unassigned from all the Leads.
- Scenario 8: Saving The Logs
- Given I have assigned an inside sales in bulk,
- Then the activity should be saved in the logs section of each lead
- Scenario 9: Deleting Inside Sales
- Given I am on the "Inside Sales" tab,
- When I click delete icon on the actions column,
- Then a confirmation overlay screen should appear displaying a message informing the admin that the inside sales will be removed from the "Inside Sales " list and that he would be listed on the admins list. (by automatically turning off the switch button of sales rep)
- And a checkbox labeled "Also delete from Admins list" should be displayed. If the box is checked, the admin will also be removed from the "Admins" list upon confirmation and the assigned sales rep for the specific companies should be ==N/A.
- And the leads assigned to that inside sales that have been deleted should be unassigned
- Scenario 10: Assignment of Leads from the Leads Details Screen
- Given I am on the details screen for a Lead,
- When I click on “Assign Inside Sales“,
- Then I should see a drop-down list containing all the inside sales
- Search inside sales by name.
- Select only one lead to assign to the lead.
- Uncheck inside sales to remove their assignment.
- Scenario 1: Form Display
- Given I land on a 🔎 Yassir.com business page
- When I access the Leads Form Page | Yassir Business.
- Then I should see the following fields displayed:
- First Name
- Last Name
- Email Address*
- Phone Number*
- Country* (auto-populated based on the phone number's country code)
- City*
- Services You are interested in* (with a dropdown list)
- Company Name*
- Company Size
- What is your position in the company?
- Platform Users (Who benefits)
- And the fields with an asterisk (*) should be marked as mandatory.
- Scenario 2: Services Dropdown Content
- Given I am on the leads form.
- When I click on the "Services You are interested in" dropdown.
- Then I should see the following options:
- Mobility
- Market for Business
- Giftcards
- Food for business
- Digital Communication
- Yassir Cash
- And I should be able to select one or multiple services.
- Scenario 3: Country Field Logic
- When I enter a phone number in the "Phone number" field.
- Then the "Country" field should automatically populate based on the country code of the phone number.
- Scenario 4: Form Submission
- Given I have filled out all the mandatory fields.
- When I click the "Submit" button.
- Then my information should be submitted, and a new lead should be created in the Leads Management section on adminPanel.
- And a confirmation message should be displayed, thanking me for my interest.
- Scenario 1: Initial User List View
- Given I am on the "Users & Groups" screen and the "Users" tab is selected.
- When I view the user list.
- Then I should see a table with columns for User Name, Phone, Group, Program, Email Address, Status, User Role, and Actions
- And statistics overview Active Users VS Pending Users VS Guests
- Scenario 2: Updating pagination default value
- Given I am on the "Users & Groups" screen with the user list displayed.
- Then the lines displayed should be 20 by default.
- Scenario 3: Opening the User Edit Modal
- When I click the "Edit" icon in the "Actions" column for a specific user.
- Then a modal window should appear on the same screen, pre-populated with the user's current information
- And two check-boxes one for auto-approval the other for price display
- Scenario 4: Saving User Changes
- Given I am in the "Edit User" modal.
- When I change the user's assigned group and click "Save".
- Then the modal should close, and the main user table should update instantly to reflect the new group assignment.
- Scenario 5: Viewing Group List
- Given I am on the "Users & Groups" screen.
- When I select the "Groups" tab.
- Then I should see a table with columns for Group Name, Assigned Program, Number of Riders, and Actions.
- Scenario 6: Viewing Riders in a Group
- Given I am on the "Users & Groups" screen with the group list displayed.
- When I click on the numerical value in the "Number of Riders" column for a specific group.
- Then a modal window should appear, displaying a list of all users assigned to that group.
- Scenario 7: Navigating to Group Details
- Given I am on the "Users" tab.
- When I click on a group name link in the "Group" column for a specific user.
- Then I should be redirected to the dedicated detail screen for that specific group.
- Scenario 8: Navigating to Program Details
- When I click on a program name link in the "Program" column for a specific user.
- Then I should be redirected to the dedicated detail screen for that specific program.
- Scenario 9: Viewing Program-Specific Details When Reassigning a User
- When I change or select a new group for the user.
- Then an overview section should appear, displaying the program's pickup/drop-off locations, whether the auto-approval feature is enabled for that program, and the allowed ride days and times.
- note : check low fidelity prototypes attached to the user story
- add the input field for progarm and the groups, groups input should be selectable
- Scenario 1: Accessing Export Feature
- Given I am logged into the Admin Panel,
- When I navigate to the "Leads" tab,
- Then I should find an "Export" button prominently displayed on the page.
- Scenario 2: Exporting Business Leads Data
- Given: I click on the "Export" button,
- When I select the option to export as a CSV file,
- Then the system should generate and download a CSV file containing the information of all business leads.
- Scenario 3: CSV File Content
- Given I open the exported CSV file,
- Then I should find that the file contains the following fields for each lead:
- Name
- Title
- Business Name
- Business Size
- Platform Users
- Services Chosen Separate it with a dash
- Registration Date (dd.mm.yyyy)
- Additional Information:
- Exporting lead information as a CSV file enables efficient offline access and sharing of data.
- The CSV file format ensures compatibility with various spreadsheet applications for easy viewing and manipulation of lead data.
- Scenario 1: Making Admin Changes
- Given: I am logged into the Yassir for Business Admin Panel.
- When: I perform any administrative actions, such as inviting users, modifying program parameters, or managing groups.
- Then: The system should record these actions in the transactions table.
- Scenario 2: Displaying Changes in Transactions Table
- Given: I have made administrative changes in the Yassir for Business Admin Panel.
- When: I navigate to the transactions table.
- Then: I should see each administrative action listed with comma-separated values, clearly indicating the nature of the action taken, the affected user or group, and any relevant details.
- Scenario 3: Real-Time Updates
- Given: I am actively using the Yassir for Business Admin Panel.
- When: I make administrative changes during an active session.
- Then: The transactions table should update in real-time to reflect the latest admin actions, ensuring that all changes are promptly recorded and visible to users.
- When The BAM/BA/PM books for later in bulk
- If the threshold of the trips meets the referral reward rule
- Then all the trips that meet the criteria should be included in the free trips reward and the price should be strikethrough, and same logic applies on the history section
- When a B2B user book a trip for later outside of work hours and during weekends
- Then the support team should get notified by email of those booked trips
- And should provide the necessary support
- List of people who will get notified:
- mayssa.seddik@yassir.com
- sarra.askri@yassir.com
- amine.benjdira@yassir.com
- Hours :
- Monday to Friday: 5PM to 00:00
- Saturday and Sunday: All day
- BAM needs to see:
- Rider Email
- Rider Name
- Rider Phone Number
- Rider Group
- Rider Program
- Given that I am logged in as a business account manager when I navigate to the trip list screen in the web application, then I should find a button labeled "Export Trips."
- Given that I am on the trip list screen and I click on the "Export Trips" button, when the export options pop up, then I should see a field where I can select the start date and end date for the duration of trips I want to export.
- Given that I have selected a valid start date and end date within a maximum range of 90 days, when I click on the "Export" button after selecting the duration, then a CSV file containing trip data for the selected duration should be generated and sent to my email
- Given that I have selected an invalid start date and end date (e.g., exceeding 90 days or start date later than the end date), when I try to click on the "Export" button,  should be disabled
- Scenarios:
- Scenario 1: Exporting Trips for a Valid Duration
- Given: I am on the trip list screen and I want to export trips data
- When: I click on the "Export Trips" button and select a valid start date and end date within 90 days
- And: I click on the "Export" button in the export options pop-up
- Then: A CSV file containing trip data for the selected duration is generated and sent to my email
- Scenario 2: Exporting Trips for an Invalid Duration
- When: I click on the "Export Trips" button and select an invalid start date and end date (e.g., exceeding 90 days)
- And: I try to click on the "Export" button in the export options pop-up
- Then: the export button is disabled
- Scenario 3: Exporting Trips with Start Date Later Than End Date
- When: I click on the "Export Trips" button and select a start date later than the end date
- Then: An error message is displayed indicating that the selected duration is invalid.
- Scenario 1: New Tab Displaying Sales Representatives list
- Then I should see a new tab "Sales Representatives".
- Scenario 2: Navigating to "Sales Representatives" tab
- Given  I am on the "Manage Admins" screen,
- When I navigate to the "Sales Representatives" tab,
- Then I should see a list of all sales representatives along with the columns (Sales Representative name, Email, Phone number, Countries, Status, Actions). And if no sales representatives exist yet, an empty screen should be displayed with the message, "No sales representatives are yet assigned."
- Scenario 3: Sales Rep Details Screen
- Then a screen should appear displaying the details of the selected sales representative. And the overlay should include:
- Sales Representative Name
- List of Assigned Enterprises
- Scenario 4: Redirect admins to company details from the sales rep details screen
- Given  I am on the sales rep details screen,
- When I click one of the companies the sales rep is assigned to,
- Then I should be redirected to the entreprise’s information tab for the specified company.
- Scenario 5: Bulk Assignment of Enterprises
- When I access the "Assigned Enterprises" field,
- Then I should see a drop-down list containing all active enterprises. And the drop-down should allow me to:
- Search enterprises by name.
- Select multiple enterprises to assign to the sales representative.
- Uncheck enterprises to remove their assignment. (if the sales rep has previously assigned enterprises they should be checked on the list)
- Given I have updated the list of assigned enterprises,
- Then the updated assignments should be reflected in the sales representative's details on the "Details Overlay Screen for the Sales Rep" and also reflected on the settings screen on the Entreprises details section.
- Given I attempt to save without selecting any enterprises,
- Then the sales representative should be unassigned from all the companies.
- Given I have assigned a sales rep in bulk,
- Then the activity should be saved in the transaction table of each company the sales rep is assigned to
- Scenario 9: Deleting Sales Rep
- Given  I am on the "Sales Representatives" tab,
- Then a confirmation overlay screen should appear displaying
- a message informing the admin that the sales rep will be removed from the "Sales Representatives" list and that he would be listed on the admins list. (by automatically turning off the switch button of sales rep)
- a checkbox labeled "Also delete from Admins list," If I the box is checked, the admin will also be removed from the "Admins" list upon confirmation and the assigned sales rep for the specific comapanies should be ==N/A
- Scenario 1: Adding Non-Existing User Email
- Given: I am creating a new group as a BAM on the Yassir for Business platform.
- When: I add the email of a user who does not exist in the system.
- Then: The system should recognize the non-existing user and initiate the invitation process automatically.
- And: An invitation email should be sent to the provided email address.
- Scenario 2: Invitation Email Content
- Given: An invitation email is sent to the non-existing user.
- When: The user receives the invitation email.
- Then: The email should contain clear instructions on how to accept the invitation and become a business rider, the same as a regular invitation
- Scenario 3: User Accepts Invitation
- Given: The non-existing user receives the invitation email and follows the provided instructions.
- When: The user clicks on the invitation link and completes the registration process.
- Then: The user should be successfully added as a business rider in the specified group.and his status will be moved from pending to active user
- And: The user's information should be updated in the system, allowing them to access the Yassir for Business platform and utilize its features.
- Accessing Trips Tab:
- Given that I am logged into the Yassir for Business Admin platform,
- When I navigate to the enterprise details screen,
- Then I should find a "Trips" tab or section.
- Viewing Trips Booked for Guest Users:
- Given that I am on the "Trips" tab,
- When I review the list of trips,
- Then I should be able to identify trips booked specifically for guest users.
- The trips should display the following information:
- Booking made by the BAM's name.
- A flag or indicator confirming that the trip was made for a guest user.
- A column that contains the guest’s name, and phone number
- Exporting Trips Data with Guest User Flag:
- Given that I am viewing the list of trips on the enterprise details screen,
- When I choose to export the trip data as a CSV file,
- Then the exported CSV file should contain a column or field indicating whether each trip was made for a guest user.
- The flag should distinguish between trips made for guest users and those made for regular business users.
- Comprehensive Trip Data in CSV:
- Given that I export the trip data as a CSV file,
- When I open the CSV file,
- Then it should include all relevant trip details, such as:
- Trip ID
- Booking date and time
- Pickup location and destination
- BAM's name
- Guest user flag: Containing Guest Name, and phone number
- User-Friendly Export Process:
- Given that I initiate the export of trip data,
- When the export process is complete,
- Then I should be able to easily download and access the CSV file containing the trip data.
- Accessing BtoB Trips for Guest Users:
- Given that I am logged into Dashops,
- When I navigate to the section displaying BtoB trips,
- Then I should find an option to filter or view trips specifically booked for guest users.
- Identification of Booking User:
- Given that I am reviewing BtoB trips for guest users,
- When I select a trip,
- Then I should be able to identify the main Business Admin, BAM, or program moderator who booked the trip for the guest user.
- The booking user's name or identifier should be clearly displayed alongside the trip details.
- Clear Association with Booking User:
- Given that I am viewing trip details,
- When I review the information,
- Then I should easily recognize the association between the trip and the user who made the booking.
- This association should be prominently displayed to ensure clarity and facilitate further action if necessary.
- User-Friendly Interface:
- Given that I am navigating through BtoB trip details,
- When I interact with the interface,
- Then it should be intuitive and easy to navigate, allowing me to quickly locate and review trips booked for guest users.
- Given that I am logged in as a Business Account Manager,
- When I navigate to the main users' screen,
- Then I should find a widget specifically for guest users.
- Given that, I want to view the guest users' list,
- When I click on the guest users' widget,
- Then I should be directed to the users' list page, filtered to display only guest users.
- Given that I am viewing the guest users' list,
- When I review the users' table
- Then I should see a list of all guest users, including their names, email addresses (if available), and phone numbers.
- Given that I want to add a new guest user,
- When I click on the "Add New User" button,
- Then a pop-up should appear where I can enter the guest user's name, email, and phone number.
- Given that I want to delete a guest user from the list,
- When I select the delete option next to the guest user's information,
- Then the system should prompt me to confirm the deletion before removing the guest user from the list.
- Given that I want to edit a guest user's information,
- When I select the edit option next to the guest user's information,
- Then a pop-up or inline form should appear allowing me to update the user's name, email, and phone number.
- The web app should allow the Business Account Manager to define a spending allowance per trip for each program.
- Users with groups attached to a program should be restricted from booking a trip if the estimated trip cost exceeds the spending allowance.
- When attempting to book a trip that exceeds the spending allowance, users should receive a notification indicating that the trip cost exceeds the spending allowance.
- Scenario 1: Defining a spending allowance for a program
- Given: I am a Business Account Manager using the Yassir Go for B2B web app
- When: I define a spending allowance for a program
- Then: All users with groups attached to that program should be restricted from booking trips exceeding the spending allowance
- Scenario 2: Attempting to book a trip exceeding the spending allowance
- Given: I am a user with a group attached to a program with a defined spending allowance
- When: I attempt to book a trip with an estimated cost exceeding the spending allowance
- Then: I should receive a notification that the trip cost exceeds the spending allowance
- Scenario 3: Booking a trip within the spending allowance
- When: I attempt to book a trip with an estimated cost within the spending allowance
- Then: I should be able to successfully book the trip
- Scenario 1: Inviting Non-Existing Users to the Group
- Given I am a BAM logged into the platform,
- When I navigate to the group management page and select a specific group,
- And I choose to invite riders to this group,
- Then I should be able to enter the email addresses of a non-existing users who I want to add to the group directly. so they will receive an email to register and will appear as a pending users
- Scenario 2: Moving Existing Users to the Group
- Given I am on the invite riders to the group screen and have entered the email addresses of existing users,
- When I initiate the invitation process,
- Then the selected users should be moved to the specified group immediately.
- Scenario 3: Inviting Users via CSV File
- Given I am on the invite riders to the group screen and choose to invite users via a CSV file,
- When I upload a CSV file containing email addresses,
- Then the system should process the file and check if the email addresses correspond to existing users.
- And Existing users should be moved to the specified group, while non-existing users should receive email invitations to join and become group members.
- User can change business rider group
- Business Rider can be in one group at a time only
- As a business account manager I need to be move users from group to another group, so that they can start using the service with the group conditions directly
- BAM can’t remove a group that contains members, he needs to move to move them first to another Groups
- BAM can’t remove a group that contains members, he needs to move to move them first to another group
- Users can export users data
- Users can sort group members by name in Alphabetical order A->Z
- User can search
- Moving can be done in bulk
- Group Name
- Program Name
- Users can sort group members by name or department
- User can search users list
- Edits and removing can be done in bulk
- User needs to be able to change pick up and drop off locations, and trip stops
- The user needs to be able to change the days, and times assigned for the trips
- User needs to be able to change the days, and time assigned for the trips
- When deactivating a program, a popup should show up, alerting the user that there’s a certain number of Groups that will be affected. and the user will be able to choose  to which program those groups are associated
- The email must be sent to the account manager every month.
- The email must contain the following information:
- Number of trips made in the previous Month
- Number of active users
- Number of programs and groups on the account in total
- The email must contain the BAM name
- Email is sent on the first day of the month with the name of the previous month (for Example ‘Feb Updates’)
- Scenario 1: The account manager receives the monthly email update
- Given *the business account manager is registered on our platform
- When *the monthly update email is sent
- Then *the account manager should receive an email containing information about the number of trips made, the budget left and consumed, the number of users and their status, the number of programs, and the groups on the account.
- Email Template:
- Dear [First Name],
- We have some exciting news to share with you! Your business account has reached a milestone by hitting the following numbers:
- Riders: [insert number]
- Programs: [insert number]
- Groups: [insert number]
- Trips: [insert number]
- This is a great achievement and we are thrilled to have been a part of it. We understand the importance of having a seamless and efficient experience for your business operations, and we are committed to providing you with the best service possible.
- If you have any questions, please don't hesitate to contact us at [insert contact details]. Our team is always happy to help.
- Thank you for choosing us as your partner for your business needs. We look forward to continuing our successful partnership.
- Best regards,
- Cher/Chère [Prénom],
- Nous avons de bonnes nouvelles à vous annoncer ! Votre compte professionnel a atteint un jalon important en atteignant les nombres suivants :
- Passagers : [insérer le nombre]
- Programmes : [insérer le nombre]
- Groupes : [insérer le nombre]
- Voyages : [insérer le nombre]
- C'est une grande réussite et nous sommes ravis d'en avoir fait partie. Nous comprenons l'importance d'avoir une expérience de fonctionnement sans heurts et efficace pour votre entreprise, et nous nous engageons à vous fournir le meilleur service possible.
- Si vous avez besoin d'augmenter votre limite ou si vous avez des questions, n'hésitez pas à nous contacter à [insérer les coordonnées de contact]. Notre équipe est toujours heureuse de vous aider.
- Merci de nous avoir choisis comme partenaire pour vos besoins commerciaux. Nous sommes impatients de continuer notre partenariat fructueux.
- Cordialement,
- Rider needs toreceive an email informing him about activation and deactivation
- A Business Rider can be in one group only
- A group can be associated with one program only
- Every group will be associated with the default payment method
- We can set a different payment method for every group
- Given a BAM has chosen a Post Paid payment plan
- I need to find a screen telling me that you will be on hold till your meeting with the OPs team, and see an Email to get in contact with
- Given a BAM has chosen a Pre Paid payment plan, and offline Payment method
- Given a BAM whose account been de-activated by one of the OPs Admins
- I need to find a screen telling me that you will be on hold for a reason and please get in contact with the OPs Team
- The user should be able to view each business payment plan and method on the dashboard, including postpaid payment methods.
- If the payment method is postpaid, the user should be able to adjust the budget left by adding an additional amount to the account.
- The user should be able to change the Allowance if the payment method is postpaid.
- The user should be able to attach legal documents and bank transfer statements to the account for verification purposes.
- The Ops Manager should be able to decrease the budget spending limit as long as the new limit is equal to or greater than the previous budget spending limit and add balance minus the due budget.
- The Ops Manager should be able to increase the Budget Spending limit
- Scenario 1: Exhausted Budget Limit
- Given that a BAM is on a postpaid payment method and, OPS Manager has consumed the entire Allowance  limit,
- When the manager attempts to book a trip,
- Then the system should prevent the manager from booking the trip until the budget has been settled.
- Scenario 2: Reset Consumption Limit
- Given that a BAM is on a postpaid payment method and, OPS Manager has settled the entire consumed spending allowance,
- When the OPs manager adds the paid amount, that is equal to the whole amount consumed
- Then the system should reset the consumption limit to the maximum Allowance amount the manager can use (i.e., spending allowance to max limit).
- Scenario 3: Partially Settled Budget
- Given that a BAM is on a postpaid payment method and, OPS Manager has settled a percentage or part of the consumed spending allowance,
- When the OPs manager adds the paid amount, that is less than the whole amount consumed
- Then the system should add the amount paid to the budget to be used before the manager reaches the max spending allowance again
- Scenario 4: Increasing the spending allowance
- Given that an OPs Manager is on a postpaid payment method and wants to increase the spending allowance, whether he exhausted it fully or  not
- When The Ops Manager Increases the limit
- Then the system should increase the max spending allowance, and allow the business account manager to consume till he reaches this limit
- Scenario 5: Decreasing the spending allowance
- Given: An OPs Manager is on a postpaid payment method and wants to decrease the spending allowance
- When: The OPs Manager decreases the limit
- Then: The system should decrease the max spending allowance as long as the new limit is equal to or greater than the previous budget spending limit add balance minus the due budget, and allow the BAM to consume until they reach this new limit
- We need to be able to activate a different contact person in every country
- User needs to be able the available slots in the sales team calendar
- OPs team member must have the ability to activate the Dashboard from his to the BAM, and make it accessible for him
- BAM needs to be able to access the dashboard while it's not activated
- The business account manager needs to be able to choose whether to set the number of trips on a Daily or weekly basis
- The business account manager needs to be able to enter an integer that represents the number of trips can be taken for every group members
- The business account manager needs to be able to choose whether to set the number of trips on a Daily basis.
- The email the person is the static generic support email
- BAM needs to find guidelines on how to create the email
- The business account manager needs to be able to Locate and click on a button that allows updating the user role. from the table
- Change the user's role from Rider to Business Admin
- Send an email invitation to the Active Rider, that contains a randomly generated Password, and link to the registration screen
- Allow the invited user to gain equal access and permissions as the main Business Account Manager upon completion of the setup process.
- The New Business Admin will not be able to remove the BAM
- In the Table of the Business Riders, we need to be able to see every user role
- Only the Super Business Account Manager he’s the only one who can downgrade user access from a BAM to a Business Rider
- Scenario 1: Access the Users List Table and Update the User Role
- Given: I am a Business Account Manager
- When: I access the Users list table within the web app
- Then: I can locate a button that allows me to update the user role
- Scenario 2: Change User Role from Rider to Business Account Manager
- Given: I am a Business Account Manager and have accessed the Users list table
- When: I click on the button to update the user role for a specific Rider
- Then: I can change the user's role from Rider to another Business Account Manager
- Scenario 3: Send Email Invitation for Setup Process
- Given: I am a Business Account Manager and have changed a user's role from Rider to another Business Account Manager
- When: I send an email invitation to the user
- Then: The user receives the email that contains the randomly generated password, and the link to the registration page
- Scenario 4: Invited User Gains Equal Access and Permissions
- Given: A user has been invited to become a Business Account Manager and has completed the setup process
- When: The user logs in to their Business Account Manager account
- Then: They gain equal access and permissions as the main Business Account Manager
- Email Template
- Dear [User's Name],
- We are pleased to inform you that your role has been upgraded to Business Account Manager in our Yassir for Business platform. With this new role, you now have the ability to manage various aspects of our system, including:
- Programs
- Groups
- Payments
- Users
- To complete the setup process and activate your new role, please follow the instructions provided in the email invitation and register as a Business Account Manager using the link below:
- [Login Link]
- You can use this random generated password:---------- to login, don’t forget to update it later
- If you have any questions or need assistance, please don't hesitate to contact our support team.
- [Your Name] [Your Title] Yassir for Business Team
- Cher(e) [Nom de l'utilisateur],
- Nous avons le plaisir de vous informer que votre rôle a été mis à jour en tant que Gestionnaire de Compte Entreprise sur notre plateforme Yassir pour les Entreprises. Avec ce nouveau rôle, vous avez désormais la possibilité de gérer différents aspects de notre système, notamment :
- Programmes
- Groupes
- Paiements
- Utilisateurs
- Pour finaliser le processus de configuration et activer votre nouveau rôle, veuillez suivre les instructions fournies dans l'invitation par e-mail et vous inscrire en tant que Gestionnaire de Compte Entreprise en utilisant le lien ci-dessous :
- [Lien de Connexion]
- Vous pouvez utiliser ce mot de passe généré aléatoirement : ---------- pour vous connecter, n'oubliez pas de le mettre à jour ultérieurement.
- Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à contacter notre équipe de support.
- [Votre Nom] [Votre Titre] Équipe Yassir pour les Entreprises
- عزيزي/عزيزتي [اسم المستخدم],
- يسرنا أن نبلغكم بأن قد تم ترقيتك إلى مدير حساب الشركة في منصتنا يسير للشركات. مع هذا الدور الجديد، تمتلكون الآن القدرة على إدارة جوانب مختلفة من نظامنا، بما في ذلك:
- البرامج
- المجموعات
- المدفوعات
- المستخدمين
- لإتمام عملية الإعداد وتفعيل دوركم الجديد، يُرجى اتباع التعليمات المقدمة في دعوة البريد الإلكتروني والتسجيل كمدير حساب الشركات باستخدام الرابط أدناه:
- [رابط تسجيل الدخول]
- يمكنكم استخدام كلمة المرور المولدة عشوائيًا هذه: ---------- لتسجيل الدخول، ولا تنسوا تحديثها لاحقًا.
- إذا كان لديكم أي استفسارات أو بحاجة إلى مساعدة، فلا تترددوا في التواصل مع فريق الدعم لدينا.
- مع خالص التحية،
- [اسمكم] [مسماكم الوظيفي] فريق ياسر للشركات
- I need to be able to see Admin Name, Email
- I need to be able to see the list of countries where he has access to it
- For Admin who doesn't have visibility on any of the markets their country list must be empty
- Super  Admin is able to grant or deny access for any Admin on any market
- I need to be able to delete a user from the list so that he can lose access to the Admin panel
- All changes the removed admin made, will not be affected by his removal
- Admins doesn't have edit access to this Dashboard, only view access
- The system allows me to schedule a business trip and repeat it for the upcoming week.
- The system checks if the scheduled trips align with program parameters and business conditions.
- The system books trips according to my budget, considering any limitations.
- If there are conflicts with program parameters, the system excludes those days and books trips for the remaining available days.
- I receive notifications for any conflicts, budget limitations, or excluded days.
- I can easily access and view all the scheduled trips, including pending ones, from the BAM dashboard.
- If we change the service we need to re-estimate all the trip cost
- If we are scheduling a trip on the last allowed day of the service to be scheduled, then I can’t be able to schedule the trip in bulk in the future.
- If the user has Clicked on the Schedule in Bulk Button, then The user needs to see two cards, including the first scheduled day, and the following scheduled day and if he clicked on the negative sign to remove one scheduled day, the schedule in bulks must be disabled
- Scenario 1: Scheduling a Single Trip
- Given: I am logged into the B2B platform as a BAM, and I have selected a business rider.
- When: I enter the trip details, including pickup location, destination, selected service, and the initial trip date.
- Then: The system validates the trip details.
- And: I have the option to repeat this trip for the upcoming week.
- Scenario 2: Repeating the Trip for the Upcoming Week
- Given: I have scheduled a single trip for a business rider.
- When: I choose to repeat this trip for the upcoming week.
- Then: The system checks if the trip aligns with the program parameters and business budget.
- And: It ensures that the selected days for repeating align with the allowed booking days, and we have a sufficient budget for the list of trips
- Scenario 3: Budget Allows Booking of All Upcoming Trips
- Given: The trip details align with program parameters, business conditions, and available booking days.
- And: My budget permits booking all the trips for the upcoming week.
- Then: The system books all the trips seamlessly without any limitations.
- Scenario 4: Budget Limits Booking for Upcoming Trips
- And: My budget imposes limitations _sufficient budget for all trips_, allowing only a certain number of trips.
- When: I choose to repeat the trip for the upcoming week.
- Then: The system books the maximum number of trips possible, considering budget constraints.
- And: It starts booking from the nearest available date.
- Scenario 5: Conflicts with Program Parameters
- Given: The trip details conflict with certain program parameters or business conditions.
- When: I select to repeat the trip for the upcoming week.
- Then: The system identifies and excludes days within the upcoming week that conflict with program parameters or business conditions.
- And: It books the trip exclusively for the days without conflicts.
- Scenario 6: Viewing All Scheduled and Pending Trips
- Given: I have successfully scheduled one or more repeating business trips.
- When: At a later time, I want to review the trips' status.
- Then: I can conveniently access the B2B platform to view a comprehensive list of all scheduled trips, including those awaiting approval.
- Scenario 7: Viewing All Scheduled and Pending Trips
- Given that I am a user of the trip-scheduling service, And I have chosen the last allowed day to schedule a service,
- When I try to schedule the same trip in bulk for future dates,
- Then the system should prevent me from doing so, by disabling the schedule in Bulk Button
- Given that I am a user in the trip scheduling application, And I have accessed the feature to schedule trips,
- When I click on the "Schedule in Bulk" button,
- Then I should see two cards displayed on the screen, And these cards should include the first scheduled day and the following scheduled day.
- When I click on the negative sign (-) on any of these cards to remove a scheduled day,
- Then the "Schedule in Bulk" feature must be disabled, And the system should visually indicate that bulk scheduling is no longer an option, And provide a prompt or message explaining why bulk scheduling has been disabled.
- BAMs should see a pie chart displaying the total number of users.
- The pie chart should include the percentage of active users versus pending users.
- Within the section, BAMs should find buttons for creating new groups, creating new programs, inviting users, and contacting support.
- Scenario 1: Accessing the Users and Groups Section
- Given that I am a logged-in BAM on the B2B platform,
- When I access the Home Dashboard screen,
- Then I should see a section labeled "Users and Groups."
- Scenario 2: Viewing the Total Number of Users
- Given that I am a BAM in the "Users and Groups" section,
- When I look at the bar chart,
- Then I should see a visual representation of the total number of users.
- Scenario 3: Checking Active versus Pending Users
- Given that I am a BAM viewing the "Users and Groups" section,
- When I examine the bar chart,
- Then I should also see the percentage of active users versus pending users.
- Scenario 4: Creating a New Group
- When I want to create a new group,
- Then I should find a button labeled "Create New Group."
- And when I click on the "Create New Group" button,
- Then I should be redirected to a page where I can specify group details and create the group.
- Scenario 5: Creating a New Program
- When I intend to create a new program,
- Then I should find a button labeled "Create New Program."
- And when I click on the "Create New Program" button,
- Then I should be redirected to a page where I can define program parameters and create the program.
- Scenario 6: Inviting Users
- When I want to invite users to join the platform,
- Then I should find a button labeled "Invite Users."
- And when I click on the "Invite Users" button,
- Then I should be directed to a user invitation page where I can send invitations to potential users.
- Scenario 7: Contacting Support
- When I need assistance or support,
- Then I should see a button labeled "Contact Support."
- And when I click on the "Contact Support" button,
- Then I should be redirected to a support contact page where I can reach out to the support team for help.
- Scenario 1: Enabling Auto-Approval for a Program
- Given I am a Business Account Manager (BAM),
- When I access the BAM web application and navigate to program settings,
- Then I should find an option to enable or disable auto-approval for the selected program.
- Scenario 2: Disabling Auto-Approval by Default
- Given I am configuring program settings,
- When I create a new program or access existing ones,
- Then the auto-approval feature should be disabled by default for all programs to maintain the current manual approval workflow.
- Scenario 3: Enabling Auto-Approval for a Specific Program
- When I choose to enable auto-approval for a specific program,
- Then trip requests made by Business Riders within that program will be automatically approved without the need for manual intervention by me or any Business Admin.
- Scenario 4: Disabling Auto-Approval for a Specific Program
- When I choose to disable auto-approval for a specific program,
- Then trip requests made by users within that program will require manual approval from me or any Business Admin before being confirmed.
- Scenario 5: Auto-Approval Status Indicator
- Given I am viewing a program's settings, from Program Overview Page
- When I look at the program details,
- Then there should be a clear indicator showing whether auto-approval is enabled or disabled for that program.
- Scenario 6: Valid Auto-Approval Time Limit
- When I set the approval duration time limit to a value between 1 minute (minimum) and 60 minutes (maximum),
- Then the system should accept the defined time limit. and any trip will expire if it exceeds this time limit, with Rider Canceled status
- Given that I am on the main Group page or the Group List of the B2B web application, I should find a language selection option that allows me to switch to Arabic.
- When I select the Arabic language option, all text, labels, and content on the main Group page, the Group List, and any related actions should be displayed in Arabic characters. This includes group names, descriptions, and any relevant details.
- The layout and design of the main Group page and the Group List should adapt to support right-to-left (RTL) text direction when the Arabic language is chosen.
- Any action buttons, links, or interactions related to groups, such as creating a new group, editing existing groups, or managing group settings, should display labels and messages in Arabic when using the Arabic language option.
- Scenario 1: Switching to Arabic Language for Group Management
- Given: I am on the main Group page or the Group List of the B2B web application.
- And: I access the language settings.
- When: I choose the Arabic language option.
- Then: All text on the main Group page, the Group List, and group-related actions should switch to Arabic, and the layout should support RTL.
- Scenario 2: Viewing Group Details in Arabic
- Given: I am on the main Group page in Arabic mode.
- When: I click on a specific group to view its details.
- Then: The group details, including names, descriptions, and relevant information, are displayed in Arabic.
- Scenario 3: Interaction with Arabic Labels
- Given: I am on the main Group page or the Group List in Arabic mode.
- When: I perform actions such as creating a new group, editing an existing one, or managing group settings.
- Then: All action buttons, links, and labels related to group management should be displayed in Arabic, ensuring a seamless Arabic user experience for managing groups.
- Given that I am on the Users List screen of the B2B web application when I access the language settings, I should see an option to switch to Arabic.
- Given that I am on the Users List screen and I select the Arabic language option, the entire interface layout, including text alignment, button placements, and overall design, should transform to support right-to-left (RTL) text direction.
- Given that I am on the Users List screen and I have chosen the Arabic language option, all displayed text, including user names, role labels, and action buttons, should be presented in Arabic characters and be properly aligned from right to left.
- Given that I am on the Users List screen and using the Arabic language option, when I search for users or enter filter criteria into input fields, the input text direction should be from left to right.
- Given that I am on the Users List screen in Arabic mode when I perform actions like updating user information or changing roles, any confirmation or action buttons should display labels in Arabic text.
- Scenario 1: Accessing User Information
- Given that I am logged into the Yassir Go For Business Client web app as a Business Account Manager,
- When I navigate to the users list section,
- Then I should be able to view the phone number of each user listed.
- Scenario 2: Searching Users
- Given that I am on the users list section of the Yassir Go For Business Client web app as a Business Account Manager,
- When I use the search bar,
- And I enter at least 3 letters of a user's name, email, or phone number,
- Then the app should display all possible matching results that meet the search criteria.
- Scenario 1: Accessing the User Invitation Page
- Given: I am logged in as a BAM on the B2B web app.
- When: I navigate to the user invitation page
- Then: I should find an option to "Download CSV Template" on the user invitation page.
- Scenario 2: CSV Template Content
- Given: I have downloaded the CSV template.
- When: I open the CSV template file.
- Then: I find one column with Email Examples of the users in the CSV file. name@company.com
- Scenario 3: When Downloading the
- Given: I’m downloading the CSV template.
- When: The CSV file is prepared.
- Then: I find the icon of download changed to a update status, and once the download preparation is done, I need to receive a notification
- Given that I am logged in as an Ops Manager,
- When I navigate to the enterprise details section of the admin panel and access the trips table,
- Then I should find a button labeled "Export Trips."
- Given that I am on the trips table within the enterprise details section,
- When I click on the "Export Trips" button,
- Then I should see fields where I can select the start date and end date for the duration of trips I want to export.
- Given that I have selected a valid start date and end date within a maximum range of 90 days,
- When I click on the "Export" button after choosing the duration,
- Then a CSV file containing trip data for the selected duration should be generated and sent to my email.
- Given that I have selected an invalid start date and end date (e.g., exceeding 90 days or start date later than the end date),
- When I try to click on the "Export" button,
- Then an error message should be displayed indicating that the selected duration is invalid.
- CSV File Columns:
- Trip UID
- Requested At
- Finished At
- Status
- Is Booked
- Cost
- Yassir Commission
- Added Commissions
- Discounts on Each Trip
- Discount Condition Met or Not
- Driver Gain
- Pickup
- Destination
- Driver Name
- Driver ID
- Driver Phone
- Rider Phone
- Given: I am on the trips table in the enterprise details section and I want to export trip data
- Then: A CSV file containing trip data for the selected duration is generated and sent to my email.
- Scenario 4: No Trips Found for the Selected Duration
- And: There are no trips found for the selected duration
- Then: A message is displayed informing me that no trips were found for the specified duration, and no CSV file is generated.
- Scenario 5: Exporting Trips with Empty Start Date or End Date
- When: I click on the "Export Trips" button and leave either the start date or end date field empty
- Then: An error message is displayed indicating that both start date and end date are required.
- Scenario 6: Exporting Trips with Start Date Equal to End Date
- When: I click on the "Export Trips" button and set the start date equal to the end date
- Scenario 7: Exporting Trips with Start Date in the Future
- When: I click on the "Export Trips" button and set the start date in the future
- Then: An error message is displayed indicating that the selected start date is in the future.
- Scenario 8: Exporting Trips with End Date in the Future
- When: I click on the "Export Trips" button and set the end date in the future
- Then: An error message is displayed indicating that the selected end date is in the future.
- Scenario 9: Exporting Trips with End Date Before Start Date
- When: I click on the "Export Trips" button and set the end date before the start date
- Then: An error message is displayed indicating that the end date cannot be before the start date.
- Scenario 10: Exporting Trips with Maximum Allowed Duration
- When: I click on the "Export Trips" button and select the maximum allowed duration of 90 days
- Then: A CSV file containing trip data for the selected 90-day duration is generated and sent to my email.
- Scenario 11: Exporting Trips with Valid Duration and Specific Columns
- When: I click on the "Export Trips" button, select a valid start date and end date, and choose specific columns to include in the export
- Then: A CSV file containing trip data for the selected duration and the chosen columns is generated and sent to my email.
- Scenario 1: Accessing the FAQs
- Given that I am logged into the Yassir for Business Web App as a Business Account Manager,
- When I navigate to the main user screen,
- Then I should find a clearly labeled section or button for accessing the FAQs.
- Scenario 2: Finding Information on Inviting Users
- Given that I have accessed the FAQs section,
- When I browse through the list of questions,
- Then I should find information specifically addressing how to invite users to the platform.
- Scenario 3: Clarity and Relevance
- Given that I view the FAQs,
- When I read the information on inviting users,
- Then the content should be clear, concise, and relevant to my needs as a Business Account Manager.
- Scenario 4: Number of questions
- Given that I view the FAQs, of the user's section
- When I check the user's FAQ
- Then the content section will be fixes number of questions 4 Questions
- Note: We need to integrate the feature flag for it, for each page
- We need to have google analytics events integrated
- Scenario 1: Changing Dedicated Account Manager for All Companies
- Given that I am logged into the BtoB Admin Panel as an Admin,
- When I navigate to the enterprise details section, I locate the option to change the assigned Dedicated Account Manager, on settings page
- Then I should find a pop-up window that allows me to select the new Dedicated Account Manager. And I should see a checkbox option labeled "Apply to All Companies". When I check this option and confirm the change,
- Then the new Dedicated Account Manager should be applied to all companies that currently have the previous Dedicated Account Manager assigned.
- Scenario 2: Changing Dedicated Account Manager for Current Company Only
- Given that I am on the same pop-up window to change the Dedicated Account Manager,
- And I have unchecked the "Apply to All Companies" option,
- When I confirm the change,
- Then the new Dedicated Account Manager should only be assigned to the current company.
- Scenario 3: Cancelling the Change
- Given that I have initiated the process of changing the Dedicated Account Manager,
- When I decide to cancel the change,
- Then I should have the option to close the pop-up window without applying any changes.
- And the previously assigned Dedicated Account Manager should remain unchanged.
- Scenario 4: Changing from Dedicated Account Manager to Default
- Given that I have initiated the process of changing the Dedicated Account Manager, to default
- When I click on Update
- Then I should have the option to apply these changes to this company only or to all companies
- Scenario 5: Changing from Default to Dedicated Account Manager
- Given that I have initiated the process of changing the default values to a dedicated account manager
- Then the changes should be applied to this company only
- Scenario 6: Removing a Dedicated Account Manager
- Given that we have removed a dedicated manager whether by removing the Dedicated account manager, Changing his phone number to be in another country or removing his phone number
- When we confirm those changes
- Then the changes should be applied to all companies, that they will have the default customer support data
- Default Customer Support Data
- Algeria:
- Email: support.business@yassir.com
- Phone Number:
- Mobile Phone:
- 70435883
- 70405602
- Direct: 021 99 99 95
- Tunisia:
- Email: business@yassir.tn
- Phone number: Default: +216 31.322.000
- Access to Password Management:
- Given I am logged into the admin panel as any type of admin,
- When I navigate to the user management section,
- Then I should see an option to change the password for each user.
- Password Change Interface:
- Given I have selected a user,
- When I choose the option to change their password,
- Then I should be presented with a form to enter a new password.
- Password Validation:
- Given I have entered a new password,
- When I submit the change,
- Then the system should validate the new password according to the set password policies (e.g., minimum length, complexity).
- Accessing Bulk Trip Scheduling:
- Given that I am logged into the Yassir for Business Web App as a BAM,
- When I navigate to the trip scheduling section,
- Then I should find an option or button specifically for bulk trip scheduling.
- Initiating Bulk Trip Scheduling:
- Given that I have accessed the bulk trip scheduling feature,
- When I select the trips I wish to schedule in bulk,
- Then I should be able to proceed to the scheduling interface.
- Adjusting Day and Time for Scheduled Trips:
- Given that I am on the bulk trip scheduling interface,
- When I select multiple trips to schedule,
- Then I should find options to adjust the day and time for all selected trips simultaneously.
- Changing Scheduled Day:
- Given that I am adjusting the scheduling details for multiple trips,
- When I choose to change the scheduled day,
- Then all selected trips should reflect the new day selected.
- Modifying Scheduled Time:
- When I choose to change the scheduled time,
- Then all selected trips should update to reflect the new time chosen.
- Configuring Multiple Trips on the Same Day:
- Given that I am scheduling multiple trips on the same day,
- When I adjust the scheduling details,
- Then I should be able to set different times for each trip, allowing for flexibility in scheduling.
- Configuring Multiple Trips on Different Days:
- Given that I am scheduling multiple trips on different days,
- Then I should be able to set the same or different times for each trip as per my requirements.
- Validation and Error Handling:
- Given that I make changes to the bulk trip scheduling details,
- When I submit the scheduling request,
- Then the system should validate the input to ensure consistency and accuracy.
- If there are any errors or conflicts detected, appropriate error messages should be displayed, guiding me on how to resolve them.
- Confirmation and Feedback:
- Given that I have successfully scheduled multiple trips in bulk,
- When the scheduling process is completed,
- Then I should receive a confirmation message indicating the successful scheduling of all selected trips.
- Max Number of trips per day
- Given that I have booked two trips per day
- When the user tries to enter a third trip
- Then the adding trips button for the same day should be disabled
- Accessing the Country Settings screen
- Given, As an admin, I access the "Country Settings" page on the admin panel.
- When I navigate to the "Country Settings" page.
- Then, upon clicking the download button, I receive a CSV file containing the invoices in my email inbox after selecting the appropriate settings (month, year).
- Receiving the invoice file
- Given: I have received the CSV file in my inbox.
- When: I check the contents of the CSV file.
- Then: Each row in the CSV file corresponds to an individual invoice and includes comprehensive details such as the company name, BAM Name, Email, and Phone number, and the link for the invoice ensuring clarity and ease of reference.
- Quarterly and yearly invoices should be downloaded in overlapped cycles
- Given: we have businesses that have quarterly, and annual invoices
- When: I download the invoices for a certain month (Feb,)
- then I need to download all Q1 invoices, yearly invoices of companies which has this configuration only if those invoices were already generated
- Resetting the password 1
- Given: I am logged into the adminPannel as an admin.
- When: I navigate to the user management section clicking on the edit icon of the user.
- Then:
- I should find an option to change the password for the specific B2B users (BAM, BA, Program Moderators) who have forgotten their password and are unable to proceed with the "forgot password" flow.
- Upon selecting the option to change password: I am presented with a form to input the user's new password with a confirmation button when clicked a verification on the password is done (if it is a strong password) and a pop-up shows to inform that the password has been successfully updated.
- Resetting the password 2
- Then: i should see the call to action button in order to send the user an email with the setting password field
- Scenario 1: Accessing Client's Web App
- Given: I am logged into the Yassir for Business Admin panel.
- When: I navigate to the dashboard or settings section of the admin panel.
- Then: I should find a clearly labeled button or link that provides access to the client's web app.
- Scenario 2: Managing Programs, Groups, and Users
- Given: I have accessed the client's web app via the admin panel.
- When: I navigate through the web app interface.
- Then: I should be able to manage client programs, create and edit groups, and add or remove users as necessary.
- Scenario 3: Limiting User Permissions
- When: I access the user management or permissions settings.
- Then: I should find options to configure user permissions, allowing me to restrict access to specific pages or functionalities within the client's web app.
- Scenario 4: Configuring Restricted Pages
- Given: I am configuring user permissions for a specific user or group.
- When: I select the pages or functionalities to restrict access to.
- Then: The system should allow me to save these configurations, ensuring that users only have access to authorized pages within the web app.
- Behaviour: the expanded questions should also collapse
- Scenario 1: Accessing User Group Modification Feature
- Then I should find an option to modify the user's group settings.
- Scenario 2: Changing User Group with Program Visibility
- Given I am modifying a user's group settings on the Admin Panel,
- When I select a new group for the user,
- And view the associated program,
- Then the user's group should be updated accordingly, with the program information displayed.
- Scenario 3: Setting Price Visibility Rule
- When I choose to adjust their price visibility rule,
- And set it to follow the program rules,
- Then the user's access to price visibility should align with the rules defined by their program.
- Scenario 4: Changing Price Visibility Rule Individually
- And set it to always visible or always hidden,
- Then the user's access to price visibility should be updated accordingly, regardless of the program rules.
- Scenario 5: Setting Trip Permission Rule
- When I choose to adjust their trip permission rule,
- Then the user's trip permission settings should adhere to the rules defined by their program.
- Scenario 6: Changing Trip Permission Rule Individually
- And set it to always auto-approve or always ask for permission,
- Then the user's trip permission settings should be updated accordingly, irrespective of the program rules.
- Scenario 1: Changing User Role to Program Moderator
- Given: I am logged in as a Business Account Manager (BAM) on the Yassir platform.
- When: I navigate to the user management section and click on the edit button next to a user's profile.
- Then: I should be directed to a subpage where I can change the user's role to "Program Moderator."
- And: Upon saving the changes, the user's role should be updated to "Program Moderator."
- Scenario 2: Changing User Role to Business Rider
- When: I access the user management section and select the edit button for a user.
- Then: I should be taken to a subpage that allows me to change the user's role to "Business Rider."
- And: After saving the changes, the user's role should be updated to "Business Rider."
- Scenario 3: Changing User Role to Business Admin
- Given: I am logged in as a Business Account Manager (BAM) using the Yassir platform.
- When: I go to the user management section and click the edit button next to a user's profile.
- Then: I should be directed to a subpage where I can modify the user's role to "Business Admin."
- And: After saving the changes, the user's role should be updated to "Business Admin."
- Scenario 1: Accessing the Country Configuration Tab
- Given that I am logged into the Admin Panel,
- When I go to the "Country Configuration" tab,
- Then I should be able to choose the option to export trip files for finished trips or requested trips.
- Scenario 2: Exporting Trip Files with Cost Breakdown
- Given that I have chosen to export trips (either finished or requested),
- When I export the trip files,
- Then the exported file should include the following cost breakdown fields:
- Cost: The total cost of the trip including commission (Rider Pay Value).
- Yassir Commission: The commission taken by Yassir from the driver, displayed as both a percentage and a value.
- Yassir B2B Commission: The B2B commission defined from the B2B Admin panel, displayed as both a value and a percentage.
- Majoration Field: Calculated as Cost * (1 - B2B Company Commission in percentage).
- Driver Gain Brut: Calculated as (Cost - Yassir Commission) - Driver Benefits net.
- Driver Benefit Tax: Displayed as both a value and a percentage.
- On the webApp go to the programs page screen
- On the filter click on 'only inactive'
- Observe (a blank list displayed without any message for the user informing him that there isn’t an inactive program)
- Scenario 1: Approving a User Without OTP
- Given that a user has entered their phone number,
- When I click the "Verify" button for that user,
- Then  the Admin enters the Rider phone number and name, then system should bypass OTP validation
- Scenario 2: Assigning B2B Scope
- Given that I have approved a user,
- When the user is linked to the business,
- Then the system should assign the appropriate B2B scope and permissions to the user within the business.
- Scenario 3: Confirmation of User Approval
- Given that a user is successfully approved,
- Then I should see a confirmation message,
- And the user should appear as an active Business Rider in the business listing.
- Scenario 1: Displaying the Approve Button for All Users Invited to the business
- Given that I am logged into the Admin panel,
- When I navigate to the business details and access the user management section,
- Then I should find an "Approve" button next to every user that is listed with unverified phone number (no OTP verification).
- Scenario 2: Approving an Unverified phone number that was not previously saved
- Given that a user has not previously entered their phone number,
- When I click the "Approve" button for that user,
- Then as an admin I should be redirected to the onboarding process in order to input the phone number/full name/role on user’s behalf.
- Scenario 3: Creating a New Account for Users Without Existing Accounts
- Given that a user does not already have a Yassir account,
- Then the system should automatically create a new Yassir account for the user,
- And link the user to the business as a Business Rider.
- Scenario 4: Assigning B2B Scope
- Given that I have approved a user and finished his onboarding,
- Scenario 5: Confirmation of User Approval
- Then I should see a confirmation notification,
- Scenario 6: Handling Errors During Account Creation
- Given that there is an issue in creating a new B2C Yassir account for a user,
- When I attempt to approve the user,
- Then the system should display a clear error message and allow me to retry the process or flag the issue for resolution.
- Scenario 7: Attempt to approve a phone number that already has a B2B scope
- Given that a phone number is already has a B2B scope,
- Then the system should display a clear error message informing that the user has already been approved.
- Scenario 1: Creating the new role 'Sales Representative'
- Given I am on the manage admin screen and I want to assign the new role to an admin on the list,
- When I click on the edit button,
- Then I should see a new field (toggle button) that would allow me set that admin as a sales representative.
- Scenario 2: Turning off sales rep toggle button
- Given I am on the manage admin screen (on the admins tab) and I want to revoke the sales rep role to an admin on the list,
- When I click on the edit button and turn off the sales rep toggle button and click confirm,
- Then
- the sales rep should be removed from the sales rep tab
- and now his new role should be admin and should be listed on the admins list
- and he should no longer have view restriction on the entreprises list (he should see the list of all companies)
- and the sales rep field on the entreprises setting tab that he is assigned to should be == N/A
- Scenario 3: Accessing enterprises settings screen
- Given I am on the details screen of a specific company,
- When I view the settings tab,
- Then I should see a new field (drop-down) that would allow me to assign a sales representative.
- Scenario 4: Assigning a Sales representative
- Given I am on the settings screen,
- When I click the drop-down,
- Then I should be able to see a list of all sales representatives, when save button is clicked, the sales rep is assigned to that company
- Scenario 5: Changing the Sales representative for a specific company
- Given I am on the settings screen and a sales rep is assigned to the company,
- When I change the sales rep and the save button is clicked,
- Then I should see a confirmation popup with two radio buttons: one to change the sales rep for only the selected company, and another to reassign all companies linked to the previous sales rep to the new one.
- Scenario 6: Previously Created Businesses Without a Sales Rep
- Given a company that was created before the introduction of the "Sales Rep" role,
- When an admin accesses the company details,
- Then the "Sales Rep" field should appear empty.
- Scenario 7: Filter Companies by Assigned Sales Rep
- Given as an admin on adminPanel I’m on the companies list,
- When an admin applies the "Sales Rep" filter in the company search,
- Then only companies assigned to the selected sales rep should be displayed.
- Scenario 8: Add a column to show if a sales rep is assigned
- Given as an admin on adminPanel,
- When I check the companies list,
- Then a new column is displayed to show the sales rep data.
- Scenario 9: Unassigning a Sales Representative
- Given I am an admin on the adminPanel,
- When I check the "Settings" tab of a specific company and attempt to unassign a sales rep,
- A confirmation model is displayed to inform the admin that this company will not have a sales rep assigned.
- A distinct CTA is used for unassigning sales rep (displayed once the company has a sales rep assigned).
- Bulk unassignment is restricted; assignments must be handled individually.
- Scenario 1: Exporting the Business CSV File
- Given I am logged into the Yassir for Business web app as a BAM,
- When I click the "Export" button from the enterprise list page,
- Then the system should generate the CSV file containing all the business details (company name, address, contact information, etc.).
- Scenario 2: Receiving the Exported File on Slack
- Given the export has been successfully completed,
- When the system generates the CSV file,
- Then the file should be automatically sent to a pre-configured Slack channel or direct message on Slack (depending on settings).
- Scenario 3: Slack Notification for Export Failure
- Given there is an issue with generating the CSV file,
- When I click on the "Export" button,
- Then I should receive an error message on Slack indicating the failure (e.g., "Export Failed: File generation error").
- Scenario 4: No Email Notification on Export Completion
- Given the export is successfully completed,
- When the CSV file is sent to Slack,
- Then I should not receive an email containing the exported file.
- Scenario 5: CSV File Format and Content
- Given the export is successful,
- When the file is received in Slack,
- Then the file should be properly formatted as a CSV, and Excel File format and include all relevant business details (company name, address, contact details, account history, etc.).
- Adjust the platform users field width when we add multiple options
- not defined formatting should be changed to Not Defined (to have consistency)

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-1514: Dev BE: Group Listing~~ → Replaced by CMB-1515
- ~~CMB-992: Design: Removing, Editing Group members~~ → Replaced by CMB-993
- ~~CMB-181: Dev - BE: Matching Groups and Programs~~ → Replaced by CMB-13776
- ~~CMB-175: Dev FE: Removing, Editing Group ~~ → Replaced by CMB-993
- ~~CMB-174: Dev FE: Managing Group Members~~ → Replaced by CMB-993
- ~~CMB-168: Dev - BE: Moving Users to group~~ → Replaced by CMB-994
- ~~CMB-176: Dev BE: Moving Users~~ → Replaced by CMB-994
- ~~CMB-1794: Dev BE: Business Rider List~~ → Replaced by CMB-24433
- ~~CMB-779: Design: Deactivating Programs~~ → Replaced by CMB-182
- ~~CMB-776: Dev BE: Editing Program Parameters~~ → Replaced by CMB-183
- ~~CMB-778: Dev FE: Deactivating Programs~~ → Replaced by CMB-182
- ~~CMB-3032: De-activation Screen~~ → Replaced by CMB-3035
- ~~CMB-3596: BE Dev: De-activation Screen~~ → Replaced by CMB-3035
- ~~CMB-497: Design: Creating a new group~~ → Replaced by CMB-166
- ~~CMB-496: Dev - FE: Creating a new group~~ → Replaced by CMB-166
- ~~CMB-918: Dev - BE: Program Number of Trips~~ → Replaced by CMB-972
- ~~CMB-2189: Dev BE: Refactor Moving Users Between Groups~~ → Replaced by CMB-994
- ~~CMB-991: Dev BE: Managing Group Members~~ → Replaced by CMB-993
- ~~CMB-9736: Invitation to a group from group page~~ → Replaced by CMB-1515
- ~~CMB-8161: Export Trips from Web App ~~ → Replaced by CMB-23409
- ~~CMB-13260: Reviewing Guest Users information on Admin Panel ~~ → Replaced by CMB-13258
- ~~CMB-13262: Reviewing Guest Users Data on Dashops ~~ → Replaced by CMB-13258
- ~~CMB-13257: Showing Guest Users List~~ → Replaced by CMB-13258
- ~~CMB-13103: Users Screen Events~~ → Replaced by CMB-9330
- ~~CMB-15633: Users List update on the Web App~~ → Replaced by CMB-9330
- ~~CMB-13774: invite users to newly created groups~~ → Replaced by CMB-13297
- ~~CMB-16230: Enable Admins to Change Users Passwords~~ → Replaced by CMB-11784
- ~~CMB-19703: Prevent creation of groups without assigned programs~~ → Replaced by CMB-13776
- ~~CMB-19020: EDGE - WEBAPP - PROD : Upload another file than CSV for user invitation~~ → Replaced by CMB-33820
- ~~CMB-18037: Verifying the users manually~~ → Replaced by CMB-18569
