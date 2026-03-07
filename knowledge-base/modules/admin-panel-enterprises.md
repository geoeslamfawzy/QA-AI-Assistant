---
id: "jira-admin-panel-enterprises"
title: "Admin Panel — Enterprises"
system: "Admin Panel"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","admin-panel","b2b","improvement"]
last_synced: "2026-02-09T12:48:21.535Z"
ticket_count: 26
active_ticket_count: 20
---

# Admin Panel — Enterprises

> Auto-generated from 26 Jira tickets.
> Last synced: 2026-02-09T12:48:21.535Z
> Active features: 20
> Superseded: 6

## User Stories

### CMB-31790: Staging - Admin Panel updates and fixes

**Status:** Done | **Priority:** No Priority
**Created:** 2025-11-06

**Description:**
This involves making fixes and changes to update a few experiences on the admin panel.

**Acceptance Criteria:**
- The Skeleton Loader on the Company details page should be updated to represent the full page.
- The Access Dashboard button should be moved from the Trips tab to the main User management page for easier and faster access.
- The Trips table currently contains too many columns, making it cluttered. The following fields can be moved to a popup or detail view: —- Display the short ID on modal, remove guest, stops, Put both departure, destination on same line.
- The pickup address field on the trips details modal is not represented properly. This needs to be fixed
- When the Super Admin is giving an Admin access to the Admin panel:
- There is a "Phone Number" field.
- The "Phone Number" field is not marked as mandatory.
- The Super Admin can leave the "Phone Number" field empty if they choose to.
- The system allows saving the Admin Manager account with or without a phone number.
- Scenarios:
- Scenario 1: Super Admin Grants Access to Admin Manager Without Phone Number
- Given that I am a Super Admin,
- When I create or edit an Admin Manager account,
- And I do not provide a phone number for the Admin Manager,
- Then the system allows me to save the account without a phone number.
- Scenario 2: Super Admin Grants Access to Admin Manager with Phone Number
- And I provide a phone number for the Admin Manager,
- Then the system allows me to save the account with the provided phone number.
- Scenario 3: Admin Manager Account Created Without Phone Number
- Given that an Admin Manager account is created without a phone number,
- When the Admin Manager logs in or accesses the system,
- Then the system does not require or prompt the Admin Manager to enter a phone number during account setup.
- Scenario 4: Admin Manager Account Created with Phone Number
- Given that an Admin Manager account is created with a phone number,
- Then the system allows the Admin Manager to use the provided phone number as part of their account information.
- Scenario 5: Super Admin Edits Admin Manager Account to Add Phone Number
- When I edit an existing Admin Manager account to add a phone number,
- Then the system allows me to update the account with the phone number.
- Scenario 6: Super Admin Edits Admin Manager Account to Remove Phone Number
- When I edit an existing Admin Manager account to remove the phone number,
- Then the system allows me to update the account without a phone number.
- Scenario 7: Admin Manager Chooses to Add Phone Number
- When the Admin Manager accesses their account settings,
- And they choose to add a phone number,
- Then the system allows them to update their account with the provided phone number.
- Upon logging in, I am automatically redirected to the new BtoB Admin Panel.

---

### CMB-20848: View Restriction for Sales Rep on AdminPanel

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-12-18

**Description:**
As an admin or sales representative,
I want to see only the companies assigned to me when I log in to the admin panel,

**Acceptance Criteria:**
- Scenario 1: Restricting Enterprises List View
- Given a sales representative logs into the admin panel,
- When they access the "Companies" section,
- Then only the companies they are assigned to should be displayed.
- Scenario 2: Sales Representative has no enterprises assigned
- Given a sales representative logs into the admin panel,
- When they are not assigned to any company,
- Then an empty screen showing that they are not assigned to any company and that they need to contact their administrator.
- Scenario 3: AdminPanel View for Sales Representatives
- Given an admin on adminPanel changed the sales represenatives permissions (screens permissions)
- When the sales representative logs in,
- Then adminPanel view should be displayed according to the accesses granted for the sales rep by the admins on adminPanel.
- Scenario 4: Removing Sales representative’s permission on adminPanel
- Given an admin has changed the sales represenatives permission on the manage admins screen (By turning off the sales rep toggle button),
- When the sales representative logs in,
- Then the sales representative’s view is updated to reflect the permissions granted by the admin
- Scenario 5: Admin with full access
- Given an admin with full access logs in,
- When they view the "Entreprises" section,
- Then they should see all companies, regardless of sales rep assignment. And they should have the ability to manage sales reps assignments for any company

---

### CMB-4014: [Admin Panel ] User Activation and Deactivation

**Status:** Done | **Priority:** No Priority
**Created:** 2023-03-09

---

### CMB-9779: Migrate Businesses

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-17

**Description:**
As a Super Admin on the Ops Admin Panel, I want the ability to migrate businesses from the B2B V1 platform to the B2B V2 platform.

**Acceptance Criteria:**
- Scenario 1: Initiate Business Migration
- Given I am logged in as a Super Admin on the Ops the new Admin Panel,
- When I access the list of businesses created on B2B V1,
- Then I should find a "Migrate to B2B V2" button inside each business.
- Scenario 2: Migrate Business to B2B V2
- Given I initiate the migration of a business from B2B V1 to B2B V2,
- Then the following actions should occur:
- A default Program should be created for the migrated business with the following attributes:
- Unlimited spending allowance.
- An unlimited number of trips per day per user.
- All available services are enabled.
- Users can take trips from any location to any destination, at any time, on any day.
- The budget of the migrated business should reflect the new settings:
- If the business was prepaid on B2B V1, it should remain prepaid on B2B V2 with the same remaining budget amount.
- If the business was postpaid on B2B V1, the budget limit on B2B V2 should match the due budget of the business.
- If the business was prepaid on B2B V1, it should remain prepaid on B2B V2 and the ops manager should be prompted with a pop-up to allow him to enter to top up the budget
- If the business was postpaid on B2B V1, it should remain as post paid in B2B V2, and the OPs manager should be prompted with a pop-up to allow him to enter to top up the due budget and budget limit
- All Business Riders associated with the business on B2B V1 should be invited to B2B V2 with their mapped roles:
- Business Riders remain as Business Riders. (
- For The Guests who have no Emails, we can ignore them when Migrating
- Business Owners on B2B V1 become Business Account Managers (BAMs) on B2B V2.
- Other Admins and Super Admins on B2B V1 become Admins on B2B V2.
- In case there’s no business owner, we will assign one of the Super Admin
- Scenario 3: Business Owner and Admins Log In
- Given the migration is completed successfully,
- When the Business Owner or Admins from B2B V1 attempt to log in to B2B V2 with their existing email and password,
- Then they are prompted to enter their phone number for verification. Once verified, they are directed to the main Dashboard of B2B V2.
- Scenario 4: Business Riders' Onboarding
- Given the migration is completed successfully,
- When other Business Riders receive an email invitation to join B2B V2,
- Then they follow the invitation link, verify their phone numbers, and create an account on the Yassir Super App. Once the account is created, they can switch to their Business Profile on B2B V2.

---

### CMB-9969: Change BAM

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-23

**Description:**
As an Ops Manager on the Admin Panel, I want to access the "User Management" tab within a company's details so that I can view and manage all active Business Riders of that company.

**Acceptance Criteria:**
- Access to Company Details:
- When I enter a company's details from the Admin Panel, there should be a tab named "User Management" visible within the company details interface.
- User Listing:
- Upon navigating to the "User Management" tab, I should see a list of all active Business Riders associated with this company. The list should display their names, emails, and phone numbers.
- Edit Functionality:
- Next to each Business Rider's details, there should be an "Edit" button that allows me to make changes to their user roles.
- Role Transition:
- When I click the "Edit" button for a Business Rider, I should be redirected to a separate screen where I can modify their user role.
- Role Change Options:
- On the role modification screen, I should have the option to change the Business Rider's role to a Business Account Manager (BAM).
- Role Reassignment:
- Upon changing a Business Rider's role to BAM, the existing BAM of the company should automatically have their role switched to a regular Business Rider.
- Confirmation Prompt:
- When I make changes to a user's role, a confirmation prompt should appear to ensure that I intend to proceed with the role transition.
- Upgrading an Admin to a BAM
- When we assign an Admin to become a BAM, when he receives the email it doesn’t have to include a newly generated password, and he’s supposed to have the same permissions as a BAM instantly
- Upgrading a Rider to a BAM
- When we assign a Rider  to become a BAM, when he receives the email it must  include a newly generated password

---

### CMB-9988: Managing Admin Access

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-24

**Description:**
As a Super Admin using the B2B Admin Panel, I want the capability to restrict user access to specific sections of the Admin Panel.

**Acceptance Criteria:**
- Scenario 1: Managing Admin Access
- Given: I am logged into the B2B Admin Panel as a Super Admin.
- When: I access the Admin Management section and choose to edit an existing admin user.
- Then: I should find a toggle button labeled "Limited Access" or similar, which I can enable.
- Scenario 2: Enabling Limited Access
- Given: I have found the "Limited Access" toggle button on each feature for that admin.
- When: I enable the toggle button for the selected admin user.
- Then: The system should save this configuration, indicating that the admin now has limited access.
- Scenario 3: how the Admin will use the limited access on the enterprise details
- Given: I have enabled limited access for an admin user.
- When: I log in with the credentials of that admin user.
- Then: I should be able to access only the Enterprise Details main tab and should be restricted from accessing other tabs and functionalities.
- Scenario 4: Disabling Limited Access
- When: I access the Admin Management section and choose to edit the same admin user.
- Then: I should find the "Limited Access" toggle button, which I can disable on each feature
- Scenario 5: Confirming Full Access
- Given: I have disabled limited access for an admin user.
- Then: I should have full access to all tabs and functionalities within the Admin Panel.
- List of pages we need to give access to:
- Country configuration: Managing services
- Enterprises Tab:
- Company Tables Access Enabled by default
- Enterprise details:
- Legal information -Company Configuration-
- Trips Tab
- Payment Screen
- Settings Screen
- Users Lists
- Transaction Table
- Admins List
- Enterprise V1
- Scenario 6: Creating a new feature or a screen, Admin has access by default
- Given: We have created a new page or a tab
- When: the user has access to all pages by default
- Then: the user will have access to this newly created page
- Scenario 7: Creating a new feature or a screen, Admin has no access by default
- When: the user does not have access to all pages by default
- Then: the user will not have access to this newly created page
- Scenario 8: Super Admin has default access to all pages
- Given: I’m a super Admin
- When: I try to edit my access limitation
- Then: the Super Admin can’t limit his own access
- Scenario 9: Applying different limitations across all countries
- When: I try to edit another admin  access limitation
- Then: the Admin will have the same set of limitations and permissions across all markets he has access to
- Note: for all existing users the Access will be enabled by default, if we add new users it will be disabled by default
- Scenario 1: Viewing Rider Information
- Given that I am logged into the Admin panel as an Ops Manager,
- When I navigate to the Rider app and select a Rider,
- Then I should be able to view the following information for the selected Rider:
- Created at (the account created at, at the first)
- Rider Name
- Rider Email
- Rider Phone Number
- List of all Companies the Rider is a part of , separated by comma
- Dedicated Account Manager(s) for each company, separated by comma
- Rider Rating
- Validation, for each company, separated by a comma
- Scenario 2: Viewing Trips Conducted by Rider Across All Companies
- Given that I am viewing a Rider's profile in the Admin panel,
- When I click on a button that directs me to their trip history,
- Then I should be able to see a list of all trips conducted by this Rider across all the companies they are part of.

---

### CMB-13273: Lead Section on the Admin Panel 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-03-20

**Description:**
As an Operations Manager,

**Acceptance Criteria:**
- Scenario 1: Accessing the "Leads" Tab
- Given I am logged into the Admin Panel as an Operations Manager,
- When I navigate to the main navigation menu,
- Then I should find a "Leads" tab listed.
- Scenario 2: Viewing Business Leads
- Given I have access to the "Leads" tab,
- When I view the list of business leads,
- Then I should see users who signed up on the contact form of the YA web page and those who signed up on the platform without completing the company form.
- Scenario 3: Displaying Lead Information
- Given I am viewing a lead entry in the "Leads" tab,
- When I inspect the lead details,
- Then I should find the following information displayed for each lead:
- Name
- Email
- Phone Number
- Business Name
- Services Interested In
- Onboarding Status
- In the Details Section of the lead
- Title
- Business Size
- City
- Scenario 4: Handling Missing Information
- Given I view a lead entry with missing information,
- When I inspect the lead details,
- Then I should find any missing information represented by empty cells in the table. or no information placeholder
- Scenario 5: Editing Lead Information
- Given I view a lead entry in the "Leads" tab,
- When I click on the "See Details" button for that lead,
- Then I should be redirected to a Details of the lead management pop up. where I can view the LEad Details, and Edit the lead onboarding status
- Scenario 6: Default Lead Status
- Given a new Lead Entity is created
- When I open the Leads table
- Then I should see the lead Onboarding status as a prospect
- Scenario 7: Give Access
- Given I’m a new Admin
- When I gain access to the admin panel
- Then the super Admin Must grant me access to see the table of the leads, otherwise, I cannot access it
- Scenario 8: Different Lead Status
- Given I’m an Admin Changing the lead status
- When I click on the lead:
- Prospect
- Contacted
- Idle
- Deal Rejected
- Deal Closed
- Then as an admin, I can choose one of the statuses for the lead
- Scenario 9: Editing Lead Onboarding Status
- Given I click on the "Edit" button for a specific lead,
- When I am directed to the lead management pop-up,
- Then I should see options to modify the lead's onboarding status.
- Scenario 10: Selecting Onboarding Status Options
- Given I am on the lead management screen,
- When I review the available options,
- Then I should be able to choose from the following onboarding statuses:
- Business Lead Contacted
- Business Lead Prospect
- Business Lead Idle
- Business Lead Deal Closed
- Business Lead Deal Rejected
- Additional Information:
- The "Leads" tab serves as a centralized location for managing and tracking business leads.
- Accessing lead information enables effective follow-up and tailored solutions for potential clients.
- The edit and leads management page facilitates further interaction and customization of each lead's profile to enhance lead nurturing and conversion strategies.

---

### CMB-13286: Reflecting the Legal status changes details on the Transaction table

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-03-20

**Description:**
As an Admin on the Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Editing Legal Information
- Given that I am logged into the Admin Panel as an Admin,
- When I edit any legal information (e.g., Legal Company Name, Address, NIF, NIS, Tax ID) of a business,
- Then the changes should automatically be logged in the transaction table for that business.
- And the transaction entry should clearly show the field that was changed, the old value, and the new value, along with the timestamp of the change, who created this change, and we need to be able to have a preview links to attached papers
- Scenario 2: Approving Legal Information
- Given that I am logged into the Admin Panel as an Admin,
- When I approve any legal information submitted by a business,
- Then the approval action should be recorded in the transaction table of that business, indicating that legal information was approved, along with the timestamp and the name of the Admin who performed the action.and we need to be able to have a preview mode links to the attached papers
- Scenario 3: Rejecting Legal Information
- Given that I am logged into the Admin Panel as an Admin,
- When I reject legal information submitted by a business,
- Then the rejection action should be recorded in the transaction table, along with the specific legal information that was rejected, the timestamp, and who made the rejections. and we need to be able to have preview links to attached papers
- Scenario 4: Editing a document only without new value changes
- Given that I am logged into the Admin Panel as an Admin,
- When I have edited legal information document for a business
- Then the editing action should be recorded in the transaction table, along with the specific legal information document that was updated, the timestamp, and who made the editing. and we need to be able to have a preview link where we can see all docs, and links to attached papers

---

### CMB-16378: Notification Listing Management

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-07-22

**Description:**
As an OP Manager on the Admin Panel,

**Acceptance Criteria:**
- Navigating to the Country Configuration Tab:
- Given that I am logged into the Admin Panel,
- When I access the dashboard,
- Then I should locate and click on the "Country Configuration" tab from the navigation menu.
- Accessing the Notifications Tab:
- Given that I have accessed the Country Configuration tab,
- When I click on the "Notifications" tab,
- Then I should see a table displaying a list of notifications.
- Viewing the Notification Table:
- Given that I am in the Notifications tab,
- When I view the table,
- Then I should see the following columns:
- Notification Title
- Date of Sending
- Sent By (Admin Name)
- Status (Sent or Not Sent)
- Detailed Information for Each Notification:
- Given that notifications have been sent or scheduled,
- When I look at the table,
- Then I should be able to see the title, date, sender's name, and status for each notification listed.
- Sorting and Filtering:
- Given that the table may contain many notifications,
- When I need to find specific notifications,
- Then I should be able to filter the table by date, sender, or status to easily locate the information I need.
- Deleting a scheduled notification
- Given that the table may contain scheduled notifications,
- When I need to review the scheduled ones
- Then I should be able to find a button to delete those scheduled notification, and Notification should be hard deleted

---

### CMB-15775: Switching the registered entity from a user to a company and vice versa

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-01

**Description:**
As an Admin on the Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Default Radio Button State
- Given I am on the legal information page of a company,
- When I view the radio button for account type,
- Then it should be set to "individual" by default.
- Scenario 2: Switching to Individual Account Type
- Given I am on the legal information page of a company,
- When I switch the radio button to "Company,"
- Then the account type should change to the company,
- And the invoice format should switch to per month.
- Scenario 3: Switching Back to Individual Account Type
- Given I am on the legal information page of a company with the account type set to individual,
- When I switch the radio button back to "Account is treated as an Individual,"
- Then the account type should revert to the Individual,
- And the invoice format should switch back to per trip.
- Scenario 4: Invoice PDF Format Change
- Given an account type change from company to individual,
- When the next invoice is generated,
- Then the invoice PDF should reflect the new format suitable for individuals,
- And it should be sent per trip made.
- Scenario 5: Reflecting Changes in the Transaction Table
- Given a change in account type,
- When the account type is switched,
- Then this change should be logged in the transaction table,
- It should detail the change from company to individual or vice versa, who made the change, and the timestamp.
- Scenario 6: Previously created companies are treated as companies
- Given an existing company
- When I check their company details
- Then I should find this account type as a company

---

### CMB-13782: Extract Enterprises information from Company List

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-04-12

**Description:**
As an Admin on the BtoB Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Accessing the Enterprise Screen
- Given that I am logged into the BtoB Admin Panel as an Admin,
- When I navigate to the enterprise screen,
- Then I should find a button labeled "Download Company Details CSV".
- Scenario 2: Downloading the CSV File
- Given that I am on the enterprise screen of the BtoB Admin Panel,
- When I click on the "Export CSV" button,
- Then the system should generate and download a CSV file.
- Scenario 3: CSV File Content
- The CSV file should include the following details for each company:
- Company Name
- Company BAM (Business Account Manager) Name, Email, phone number
- Number of Programs
- Number of Groups
- Creation Date
- Onboarding Status (Onboarded, still onboarding)
- Company Dedicated Account Manager Assigned
- Payment Plan (Postpaid or prepaid)
- Budget Limit
- Due Budget
- Budget Left for the Business
- Status: Active or De-active
- File Title: Company List

---

### CMB-13869: Custom Notification Sending

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-04-16

**Description:**
As an Admin with access to send notifications in the Admin Panel,

**Acceptance Criteria:**
- Notification Composition:
- When I navigate to the designated tab for sending notifications,
- Then I should find a text editor where I can compose the content of the notification.
- The notification should only contain text, without any multimedia elements. 150 Characters Mac
- Inclusion of External Links:
- When composing the notification,
- Then I should have the option to include an external link.
- Upon clicking the notification, users should be directed to the specified webpage.
- Inclusion of Internal Links:
- When composing the notification,
- Then I should have the option to direct the user to a section on the web app
- Upon clicking the notification, users should be directed to that specified section.
- Business Selection:
- When selecting the recipients of the notification,
- Then I should have the option to choose individual businesses from a list. through filtering businesses based on criteria such as city, payment plan,
- I should also have the ability to choose businesses in bulk based on the selected filters.
- Targeting Criteria:
- When filtering businesses,
- Then I should be able to specify whether the notification is intended for Business Admins, Super Admins, or Program Moderators.
- Scheduling the Notification for later
- Given that as an Admin on the Admin Panel,
- When I have finished writing the Notification choose the companies and add the links
- Then I should find an option to save this notification to be sent later on with a max duration of 90 Days, or I can send it instantly

---

### CMB-16389: Monthly Finance Report

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-07-22

**Description:**
As an Admin on the Admin Panel,

**Acceptance Criteria:**
- Scenario 1: Accessing the Finance Report Export Option
- Given that I am logged into the Admin Panel,
- When it is the end of the month,
- Then I should be able to access the option to export a finance report from the appropriate section.
- Scenario 2: Exporting the Finance Report
- Given that I have chosen to export the finance report,
- When I initiate the export process,
- Then the exported report should include the following details for each company:
- Company Name: The name of the company.
- BAM Name: The name of the Business Account Manager.
- BAM Email: The email address of the Business Account Manager.
- BAM Phone Number: The phone number of the Business Account Manager.
- Invoice Reference: The reference number of the invoice.
- Discounts Applied: If any discounts were applied, they were displayed as both a percentage and a value.
- B2B Commissions, in Percentage not decimal and Value
- Date of the Invoice: The date when the invoice was issued.
- Client Payment Plan: The payment plan of the client (e.g., postpaid or prepaid).
- Company Commission: The commission rate for the company.
- Current Budget Left: The remaining budget for the company.
- Invoice duration: Monthly/ Quarterly/  Annually
- Invoice Amount
- Note: When we download the invoices of a certain month, we are only downloading the invoices generated in that month, regardless of the duration this invoice covered
- Scenario 2: Including the sales rep data in the previous finance reports
- Given that a sales rep was assigned during a month,
- When I export the finance report file,
- Then the data of the sales rep should be reflected on all the finance reports (for previous months).
- Scenario 3: Exporting the Finance Report
- COMPANY NAME, BAM NAME, BAM EMAIL, BAM PHONE NUMBER, BUDGET LEFT, INVOICE REF#, DISCOUNT APPLIED, DISCOUNT APPLIED %, DATE OF INVOICE, PAYMENT PLAN, INVOICE DURATION, INVOICE AMOUNT, Name of Sales representative, Email of the sales rep, phone number of the sales rep, the finished trips count per company per month

---

## Consolidated Acceptance Criteria

- AdminPanel side :
- Entreprises Table
- Business Contracts table
- Giftcards table
- Challenges
- Referrals breakdown
- Enterprises referred
- Leads Management
- Manage Admins
- Inside Sales
- Sales representatives
- WebApp Side
- Users and Groups list
- Program
- Trips table
- Business Challenge history table
- The Skeleton Loader on the Company details page should be updated to represent the full page.
- The Access Dashboard button should be moved from the Trips tab to the main User management page for easier and faster access.
- The Trips table currently contains too many columns, making it cluttered. The following fields can be moved to a popup or detail view: —- Display the short ID on modal, remove guest, stops, Put both departure, destination on same line.
- The pickup address field on the trips details modal is not represented properly. This needs to be fixed
- When the Super Admin is giving an Admin access to the Admin panel:
- There is a "Phone Number" field.
- The "Phone Number" field is not marked as mandatory.
- The Super Admin can leave the "Phone Number" field empty if they choose to.
- The system allows saving the Admin Manager account with or without a phone number.
- Scenarios:
- Scenario 1: Super Admin Grants Access to Admin Manager Without Phone Number
- Given that I am a Super Admin,
- When I create or edit an Admin Manager account,
- And I do not provide a phone number for the Admin Manager,
- Then the system allows me to save the account without a phone number.
- Scenario 2: Super Admin Grants Access to Admin Manager with Phone Number
- And I provide a phone number for the Admin Manager,
- Then the system allows me to save the account with the provided phone number.
- Scenario 3: Admin Manager Account Created Without Phone Number
- Given that an Admin Manager account is created without a phone number,
- When the Admin Manager logs in or accesses the system,
- Then the system does not require or prompt the Admin Manager to enter a phone number during account setup.
- Scenario 4: Admin Manager Account Created with Phone Number
- Given that an Admin Manager account is created with a phone number,
- Then the system allows the Admin Manager to use the provided phone number as part of their account information.
- Scenario 5: Super Admin Edits Admin Manager Account to Add Phone Number
- When I edit an existing Admin Manager account to add a phone number,
- Then the system allows me to update the account with the phone number.
- Scenario 6: Super Admin Edits Admin Manager Account to Remove Phone Number
- When I edit an existing Admin Manager account to remove the phone number,
- Then the system allows me to update the account without a phone number.
- Scenario 7: Admin Manager Chooses to Add Phone Number
- When the Admin Manager accesses their account settings,
- And they choose to add a phone number,
- Then the system allows them to update their account with the provided phone number.
- Upon logging in, I am automatically redirected to the new BtoB Admin Panel.
- Given that I am an admin on the admin panel
- When I navigate to the companies tab
- And I select the filter I need
- When I click on export companies
- Then I should only get the data selected on the filters
- Scenario 1: Restricting Enterprises List View
- Given a sales representative logs into the admin panel,
- When they access the "Companies" section,
- Then only the companies they are assigned to should be displayed.
- Scenario 2: Sales Representative has no enterprises assigned
- When they are not assigned to any company,
- Then an empty screen showing that they are not assigned to any company and that they need to contact their administrator.
- Scenario 3: AdminPanel View for Sales Representatives
- Given an admin on adminPanel changed the sales represenatives permissions (screens permissions)
- When the sales representative logs in,
- Then adminPanel view should be displayed according to the accesses granted for the sales rep by the admins on adminPanel.
- Scenario 4: Removing Sales representative’s permission on adminPanel
- Given an admin has changed the sales represenatives permission on the manage admins screen (By turning off the sales rep toggle button),
- Then the sales representative’s view is updated to reflect the permissions granted by the admin
- Scenario 5: Admin with full access
- Given an admin with full access logs in,
- When they view the "Entreprises" section,
- Then they should see all companies, regardless of sales rep assignment. And they should have the ability to manage sales reps assignments for any company
- Scenario 1: Accessing Company Details
- Given: I am logged in as an Admin on the Admin Panel.
- When: I navigate to the "Company Details" section for a specific business.
- Then: I should find a dedicated section displaying all relevant business information.
- Scenario 2: Company Information Display
- Given: I am viewing the Company Details section.
- When: I look at the company information.
- Then: I should see the following details:
- Company Name
- Size of the Company
- Industry to which the Company Belongs
- BAM Name (Business Account Manager)
- BAM Phone Number
- BAM Email Address
- City where the Company's Headquarters is Located
- Types of Users Registered on the Platform Associated with the Company
- Scenario 3: Changing the BAM
- When: I change the BAM with a different active user
- Then: I should see the following details updated for the new Business Admin:
- Scenario 4: Updating Company Information
- When: BAM updates the Company Information
- Then: I should see the following details updated based on the BAM choices:
- The city where the Company's Headquarters is Located
- Scenario 1: Accessing the Legal Information Tab
- Given that I am logged into the Admin Panel,
- When I navigate to the main company list,
- Then I should find a separate tab labeled "Legal Information".
- Scenario 2: Viewing and Editing Legal Information
- Given that I have accessed the Legal Information tab,
- When I select a specific company,
- Then I should be able to view the legal information provided by the client,
- And I should have the option to edit, accept, or reject this information.
- Scenario 3: Approving Legal Information
- Given that a client has submitted their legal information,
- When I review the provided details,
- Then I should have the option to approve the information,
- And the client should receive a notification of the approval.
- Scenario 4: Denying Legal Information
- Then I should have the option to deny the information,
- The client should receive a notification of the denial along with any feedback or required actions, and they should receive the rejection email with the reason
- Scenario 5: Tracking Submission Status
- Given that I am in the Legal Information tab,
- When I look at the list of companies,
- Then I should be able to see the status of their legal information submission (e.g., pending, approved, denied).
- Scenario 6: Editing legal information
- When I click on the editing Button
- Then I should be able to edit the legal information submitted by the client, by adding files, or removing it, or editing the fields right away
- Scenario 7: Notifying the Business account manager about rejection
- Given the Admin has rejected the legal information
- Then the BAM and the business Admins and PRogram Moderators should receive a push notification and email informing them about the rejection and includes the rejection reason
- Scenario 8: Notifying the Business account manager about accepting
- Given the Admin has been accepted the legal information
- Then the BAM and the business Admins and PRogram Moderators should receive a push notification and email informing them about the acceptance of the legal information
- Scenario 1: Initiate Business Migration
- Given I am logged in as a Super Admin on the Ops the new Admin Panel,
- When I access the list of businesses created on B2B V1,
- Then I should find a "Migrate to B2B V2" button inside each business.
- Scenario 2: Migrate Business to B2B V2
- Given I initiate the migration of a business from B2B V1 to B2B V2,
- Then the following actions should occur:
- A default Program should be created for the migrated business with the following attributes:
- Unlimited spending allowance.
- An unlimited number of trips per day per user.
- All available services are enabled.
- Users can take trips from any location to any destination, at any time, on any day.
- The budget of the migrated business should reflect the new settings:
- If the business was prepaid on B2B V1, it should remain prepaid on B2B V2 with the same remaining budget amount.
- If the business was postpaid on B2B V1, the budget limit on B2B V2 should match the due budget of the business.
- If the business was prepaid on B2B V1, it should remain prepaid on B2B V2 and the ops manager should be prompted with a pop-up to allow him to enter to top up the budget
- If the business was postpaid on B2B V1, it should remain as post paid in B2B V2, and the OPs manager should be prompted with a pop-up to allow him to enter to top up the due budget and budget limit
- All Business Riders associated with the business on B2B V1 should be invited to B2B V2 with their mapped roles:
- Business Riders remain as Business Riders. (
- For The Guests who have no Emails, we can ignore them when Migrating
- Business Owners on B2B V1 become Business Account Managers (BAMs) on B2B V2.
- Other Admins and Super Admins on B2B V1 become Admins on B2B V2.
- In case there’s no business owner, we will assign one of the Super Admin
- Scenario 3: Business Owner and Admins Log In
- Given the migration is completed successfully,
- When the Business Owner or Admins from B2B V1 attempt to log in to B2B V2 with their existing email and password,
- Then they are prompted to enter their phone number for verification. Once verified, they are directed to the main Dashboard of B2B V2.
- Scenario 4: Business Riders' Onboarding
- When other Business Riders receive an email invitation to join B2B V2,
- Then they follow the invitation link, verify their phone numbers, and create an account on the Yassir Super App. Once the account is created, they can switch to their Business Profile on B2B V2.
- Access to Company Details:
- When I enter a company's details from the Admin Panel, there should be a tab named "User Management" visible within the company details interface.
- User Listing:
- Upon navigating to the "User Management" tab, I should see a list of all active Business Riders associated with this company. The list should display their names, emails, and phone numbers.
- Edit Functionality:
- Next to each Business Rider's details, there should be an "Edit" button that allows me to make changes to their user roles.
- Role Transition:
- When I click the "Edit" button for a Business Rider, I should be redirected to a separate screen where I can modify their user role.
- Role Change Options:
- On the role modification screen, I should have the option to change the Business Rider's role to a Business Account Manager (BAM).
- Role Reassignment:
- Upon changing a Business Rider's role to BAM, the existing BAM of the company should automatically have their role switched to a regular Business Rider.
- Confirmation Prompt:
- When I make changes to a user's role, a confirmation prompt should appear to ensure that I intend to proceed with the role transition.
- Upgrading an Admin to a BAM
- When we assign an Admin to become a BAM, when he receives the email it doesn’t have to include a newly generated password, and he’s supposed to have the same permissions as a BAM instantly
- Upgrading a Rider to a BAM
- When we assign a Rider  to become a BAM, when he receives the email it must  include a newly generated password
- Scenario 1: Managing Admin Access
- Given: I am logged into the B2B Admin Panel as a Super Admin.
- When: I access the Admin Management section and choose to edit an existing admin user.
- Then: I should find a toggle button labeled "Limited Access" or similar, which I can enable.
- Scenario 2: Enabling Limited Access
- Given: I have found the "Limited Access" toggle button on each feature for that admin.
- When: I enable the toggle button for the selected admin user.
- Then: The system should save this configuration, indicating that the admin now has limited access.
- Scenario 3: how the Admin will use the limited access on the enterprise details
- Given: I have enabled limited access for an admin user.
- When: I log in with the credentials of that admin user.
- Then: I should be able to access only the Enterprise Details main tab and should be restricted from accessing other tabs and functionalities.
- Scenario 4: Disabling Limited Access
- When: I access the Admin Management section and choose to edit the same admin user.
- Then: I should find the "Limited Access" toggle button, which I can disable on each feature
- Scenario 5: Confirming Full Access
- Given: I have disabled limited access for an admin user.
- Then: I should have full access to all tabs and functionalities within the Admin Panel.
- List of pages we need to give access to:
- Country configuration: Managing services
- Enterprises Tab:
- Company Tables Access Enabled by default
- Enterprise details:
- Legal information -Company Configuration-
- Trips Tab
- Payment Screen
- Settings Screen
- Users Lists
- Transaction Table
- Admins List
- Enterprise V1
- Scenario 6: Creating a new feature or a screen, Admin has access by default
- Given: We have created a new page or a tab
- When: the user has access to all pages by default
- Then: the user will have access to this newly created page
- Scenario 7: Creating a new feature or a screen, Admin has no access by default
- When: the user does not have access to all pages by default
- Then: the user will not have access to this newly created page
- Scenario 8: Super Admin has default access to all pages
- Given: I’m a super Admin
- When: I try to edit my access limitation
- Then: the Super Admin can’t limit his own access
- Scenario 9: Applying different limitations across all countries
- When: I try to edit another admin  access limitation
- Then: the Admin will have the same set of limitations and permissions across all markets he has access to
- Note: for all existing users the Access will be enabled by default, if we add new users it will be disabled by default
- Scenario 1: Viewing Rider Information
- Given that I am logged into the Admin panel as an Ops Manager,
- When I navigate to the Rider app and select a Rider,
- Then I should be able to view the following information for the selected Rider:
- Created at (the account created at, at the first)
- Rider Name
- Rider Email
- Rider Phone Number
- List of all Companies the Rider is a part of , separated by comma
- Dedicated Account Manager(s) for each company, separated by comma
- Rider Rating
- Validation, for each company, separated by a comma
- Scenario 2: Viewing Trips Conducted by Rider Across All Companies
- Given that I am viewing a Rider's profile in the Admin panel,
- When I click on a button that directs me to their trip history,
- Then I should be able to see a list of all trips conducted by this Rider across all the companies they are part of.
- Scenario 1: Accessing the "Leads" Tab
- Given I am logged into the Admin Panel as an Operations Manager,
- When I navigate to the main navigation menu,
- Then I should find a "Leads" tab listed.
- Scenario 2: Viewing Business Leads
- Given I have access to the "Leads" tab,
- When I view the list of business leads,
- Then I should see users who signed up on the contact form of the YA web page and those who signed up on the platform without completing the company form.
- Scenario 3: Displaying Lead Information
- Given I am viewing a lead entry in the "Leads" tab,
- When I inspect the lead details,
- Then I should find the following information displayed for each lead:
- Name
- Email
- Phone Number
- Business Name
- Services Interested In
- Onboarding Status
- In the Details Section of the lead
- Title
- Business Size
- City
- Scenario 4: Handling Missing Information
- Given I view a lead entry with missing information,
- Then I should find any missing information represented by empty cells in the table. or no information placeholder
- Scenario 5: Editing Lead Information
- Given I view a lead entry in the "Leads" tab,
- When I click on the "See Details" button for that lead,
- Then I should be redirected to a Details of the lead management pop up. where I can view the LEad Details, and Edit the lead onboarding status
- Scenario 6: Default Lead Status
- Given a new Lead Entity is created
- When I open the Leads table
- Then I should see the lead Onboarding status as a prospect
- Scenario 7: Give Access
- Given I’m a new Admin
- When I gain access to the admin panel
- Then the super Admin Must grant me access to see the table of the leads, otherwise, I cannot access it
- Scenario 8: Different Lead Status
- Given I’m an Admin Changing the lead status
- When I click on the lead:
- Prospect
- Contacted
- Idle
- Deal Rejected
- Deal Closed
- Then as an admin, I can choose one of the statuses for the lead
- Scenario 9: Editing Lead Onboarding Status
- Given I click on the "Edit" button for a specific lead,
- When I am directed to the lead management pop-up,
- Then I should see options to modify the lead's onboarding status.
- Scenario 10: Selecting Onboarding Status Options
- Given I am on the lead management screen,
- When I review the available options,
- Then I should be able to choose from the following onboarding statuses:
- Business Lead Contacted
- Business Lead Prospect
- Business Lead Idle
- Business Lead Deal Closed
- Business Lead Deal Rejected
- Additional Information:
- The "Leads" tab serves as a centralized location for managing and tracking business leads.
- Accessing lead information enables effective follow-up and tailored solutions for potential clients.
- The edit and leads management page facilitates further interaction and customization of each lead's profile to enhance lead nurturing and conversion strategies.
- Scenario 1: Editing Legal Information
- Given that I am logged into the Admin Panel as an Admin,
- When I edit any legal information (e.g., Legal Company Name, Address, NIF, NIS, Tax ID) of a business,
- Then the changes should automatically be logged in the transaction table for that business.
- And the transaction entry should clearly show the field that was changed, the old value, and the new value, along with the timestamp of the change, who created this change, and we need to be able to have a preview links to attached papers
- Scenario 2: Approving Legal Information
- When I approve any legal information submitted by a business,
- Then the approval action should be recorded in the transaction table of that business, indicating that legal information was approved, along with the timestamp and the name of the Admin who performed the action.and we need to be able to have a preview mode links to the attached papers
- Scenario 3: Rejecting Legal Information
- When I reject legal information submitted by a business,
- Then the rejection action should be recorded in the transaction table, along with the specific legal information that was rejected, the timestamp, and who made the rejections. and we need to be able to have preview links to attached papers
- Scenario 4: Editing a document only without new value changes
- When I have edited legal information document for a business
- Then the editing action should be recorded in the transaction table, along with the specific legal information document that was updated, the timestamp, and who made the editing. and we need to be able to have a preview link where we can see all docs, and links to attached papers
- Navigating to the Country Configuration Tab:
- When I access the dashboard,
- Then I should locate and click on the "Country Configuration" tab from the navigation menu.
- Accessing the Notifications Tab:
- Given that I have accessed the Country Configuration tab,
- When I click on the "Notifications" tab,
- Then I should see a table displaying a list of notifications.
- Viewing the Notification Table:
- Given that I am in the Notifications tab,
- When I view the table,
- Then I should see the following columns:
- Notification Title
- Date of Sending
- Sent By (Admin Name)
- Status (Sent or Not Sent)
- Detailed Information for Each Notification:
- Given that notifications have been sent or scheduled,
- When I look at the table,
- Then I should be able to see the title, date, sender's name, and status for each notification listed.
- Sorting and Filtering:
- Given that the table may contain many notifications,
- When I need to find specific notifications,
- Then I should be able to filter the table by date, sender, or status to easily locate the information I need.
- Deleting a scheduled notification
- Given that the table may contain scheduled notifications,
- When I need to review the scheduled ones
- Then I should be able to find a button to delete those scheduled notification, and Notification should be hard deleted
- Scenario 1: Default Radio Button State
- Given I am on the legal information page of a company,
- When I view the radio button for account type,
- Then it should be set to "individual" by default.
- Scenario 2: Switching to Individual Account Type
- When I switch the radio button to "Company,"
- Then the account type should change to the company,
- And the invoice format should switch to per month.
- Scenario 3: Switching Back to Individual Account Type
- Given I am on the legal information page of a company with the account type set to individual,
- When I switch the radio button back to "Account is treated as an Individual,"
- Then the account type should revert to the Individual,
- And the invoice format should switch back to per trip.
- Scenario 4: Invoice PDF Format Change
- Given an account type change from company to individual,
- When the next invoice is generated,
- Then the invoice PDF should reflect the new format suitable for individuals,
- And it should be sent per trip made.
- Scenario 5: Reflecting Changes in the Transaction Table
- Given a change in account type,
- When the account type is switched,
- Then this change should be logged in the transaction table,
- It should detail the change from company to individual or vice versa, who made the change, and the timestamp.
- Scenario 6: Previously created companies are treated as companies
- Given an existing company
- When I check their company details
- Then I should find this account type as a company
- Scenario 1: Accessing the Enterprise Screen
- Given that I am logged into the BtoB Admin Panel as an Admin,
- When I navigate to the enterprise screen,
- Then I should find a button labeled "Download Company Details CSV".
- Scenario 2: Downloading the CSV File
- Given that I am on the enterprise screen of the BtoB Admin Panel,
- When I click on the "Export CSV" button,
- Then the system should generate and download a CSV file.
- Scenario 3: CSV File Content
- The CSV file should include the following details for each company:
- Company BAM (Business Account Manager) Name, Email, phone number
- Number of Programs
- Number of Groups
- Creation Date
- Onboarding Status (Onboarded, still onboarding)
- Company Dedicated Account Manager Assigned
- Payment Plan (Postpaid or prepaid)
- Budget Limit
- Due Budget
- Budget Left for the Business
- Status: Active or De-active
- File Title: Company List
- Notification Composition:
- When I navigate to the designated tab for sending notifications,
- Then I should find a text editor where I can compose the content of the notification.
- The notification should only contain text, without any multimedia elements. 150 Characters Mac
- Inclusion of External Links:
- When composing the notification,
- Then I should have the option to include an external link.
- Upon clicking the notification, users should be directed to the specified webpage.
- Inclusion of Internal Links:
- Then I should have the option to direct the user to a section on the web app
- Upon clicking the notification, users should be directed to that specified section.
- Business Selection:
- When selecting the recipients of the notification,
- Then I should have the option to choose individual businesses from a list. through filtering businesses based on criteria such as city, payment plan,
- I should also have the ability to choose businesses in bulk based on the selected filters.
- Targeting Criteria:
- When filtering businesses,
- Then I should be able to specify whether the notification is intended for Business Admins, Super Admins, or Program Moderators.
- Scheduling the Notification for later
- Given that as an Admin on the Admin Panel,
- When I have finished writing the Notification choose the companies and add the links
- Then I should find an option to save this notification to be sent later on with a max duration of 90 Days, or I can send it instantly
- Scenario 1: Accessing the Finance Report Export Option
- When it is the end of the month,
- Then I should be able to access the option to export a finance report from the appropriate section.
- Scenario 2: Exporting the Finance Report
- Given that I have chosen to export the finance report,
- When I initiate the export process,
- Then the exported report should include the following details for each company:
- Company Name: The name of the company.
- BAM Name: The name of the Business Account Manager.
- BAM Email: The email address of the Business Account Manager.
- BAM Phone Number: The phone number of the Business Account Manager.
- Invoice Reference: The reference number of the invoice.
- Discounts Applied: If any discounts were applied, they were displayed as both a percentage and a value.
- B2B Commissions, in Percentage not decimal and Value
- Date of the Invoice: The date when the invoice was issued.
- Client Payment Plan: The payment plan of the client (e.g., postpaid or prepaid).
- Company Commission: The commission rate for the company.
- Current Budget Left: The remaining budget for the company.
- Invoice duration: Monthly/ Quarterly/  Annually
- Invoice Amount
- Note: When we download the invoices of a certain month, we are only downloading the invoices generated in that month, regardless of the duration this invoice covered
- Scenario 2: Including the sales rep data in the previous finance reports
- Given that a sales rep was assigned during a month,
- When I export the finance report file,
- Then the data of the sales rep should be reflected on all the finance reports (for previous months).
- Scenario 3: Exporting the Finance Report
- COMPANY NAME, BAM NAME, BAM EMAIL, BAM PHONE NUMBER, BUDGET LEFT, INVOICE REF#, DISCOUNT APPLIED, DISCOUNT APPLIED %, DATE OF INVOICE, PAYMENT PLAN, INVOICE DURATION, INVOICE AMOUNT, Name of Sales representative, Email of the sales rep, phone number of the sales rep, the finished trips count per company per month

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-8946: Optional phone number for Admin on Admin Panel ~~ → Replaced by CMB-31790
- ~~CMB-12107: Company Details Page~~ → Replaced by CMB-21539
- ~~CMB-13288: Accepting or rejecting the legal details from the Admin panel ~~ → Replaced by CMB-21539
- ~~CMB-15519: Stopping the Admin Panel ~~ → Replaced by CMB-31790
- ~~CMB-18350: Manager Access to Rider Information on the Admin Panel~~ → Replaced by CMB-9988
- ~~CMB-20818: Updating Finance Report~~ → Replaced by CMB-16389
