---
id: "jira-b2b-portal-login"
title: "B2B Portal — Login & Registration"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","regression-testing","crafttheme_mobility","craft_sync"]
last_synced: "2026-02-15T08:50:44.271Z"
ticket_count: 71
active_ticket_count: 54
---

# B2B Portal — Login & Registration

> Auto-generated from 71 Jira tickets.
> Last synced: 2026-02-15T08:50:44.271Z
> Active features: 54
> Superseded: 17

## User Stories

### CMB-33857: [WEBAPP] B2B Market Profile Integration

**Status:** To Do | **Priority:** P1 - High
**Created:** 2026-01-14

**Description:**
As a Business Account Manager (BAM) or Business Admin (BA) on ride hailing services webApp I need to be able to switch from my account for ride hailing services to my account in B2B market using one authentication token, in order to reduce the reduce login prompts.

**Acceptance Criteria:**
- Scenario 01 : Seamless access from B2B Market to Ride-Hailing
- As a B2B Market user
- When I am logged into the B2B Market and switch to the ride-hailing platform
- Then I should be authenticated automatically using the same session
- Scenario 02 : Session validity across platforms
- As a B2B user
- When my session expires on one platform
- Then my session should expire on the other platform as well, requiring re-authentication
- Scenario 03: Clear profile switching entry point
- As a B2B user
- When I am logged into either platform
- Then I should see a clear UI element allowing me to switch between Ride-Hailing and B2B Market
- Scenario 04 : Auto-create B2B Market account from Ride-Hailing signup
- As a new B2B ride-hailing user in Algeria
- When I successfully create an account on the ride-hailing web app
- Then a corresponding B2B Market account should be automatically created for me
- Scenario 05 : Migration of existing Algerian B2B Ride-Hailing users
- As a an existing B2B ride-hailing user in Algeria
- When the integration is launched
- Then a B2B Market profile should be created for me automatically
- Scenario 06 : Role-based permissions preserved across platforms
- As a B2B user with a specific role (BAM, BA, Program Moderator)
- When I switch between Ride-Hailing and B2B Market
- Then my permissions and access level should be consistent with my assigned role
- Scenario 07 : Inactive ride-hailing account access control
- As a B2B user with an inactive ride-hailing account
- When I attempt to access the B2B Market
- Then my access should follow the defined business rules (e.g., restricted or blocked)
- (Exact behavior to be finalized as part of the discussion.)
- Scenario 08 : Market-based access limitation
- As a B2B ride-hailing user outside Algeria or A Program Moderator on ride hailing services webApp
- Then I should not be able to see the switching profile UI
- Note : Following events should be added on this notion page
- Event Name

---

### CMB-13291: Display Onboarding Tooltips for WebApp Users

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-20

**Description:**
As a newly registered user accessing the web application on a desktop device,
I want to see helpful tooltips that guide me through the key features of the platform,

**Acceptance Criteria:**
- Scenario 1: Display Tooltips on WebApp
- Given the user logs in to the webApp on a desktop device for the first time,
- When the session starts,
- Then a sequence of tooltips should appear starting from Profile Setup and continue through:
- Inviting Users
- Booking Trips
- Topping Up Budget
- Creating Groups
- Creating Programs
- Contacting Support
- Scenario 2: Disable Tooltips After Repeated Dismissals
- Given the user closes a tooltip using the “X” button,
- When this dismissal happens three times across sessions,
- Then tooltips should no longer be displayed for that user.
- Scenario 3: Disable Button Clicks During Tooltip Display
- Given the tooltip sequence is active,
- When tooltips are being shown,
- Then all other button interactions on the page should be disabled until the sequence ends or is dismissed.
- Scenario 4: Tooltip Back Navigation
- Given the user is viewing a tooltip in the sequence (e.g., step 2 of 6),
- When they click the “Back” button,
- Then they should return to the previous tooltip and the step counter should update correctly (e.g., 1/6).
- Scenario 5: Do Not Show Tooltips on Mobile Devices
- Given the user logs in using a mobile device,
- When the app detects the device type (e.g., via user agent),
- Then the tooltip sequence should be skipped entirely.
- Event_name

---

### CMB-25562: Inviting users with phone number 

**Status:** Done | **Priority:** No Priority
**Created:** 2025-05-14

**Description:**
As a business admin on the wabapp, I want to be able to invite new team members to our platform by entering their phone number, So that we can easily and directly onboard individuals, even if we don't have their email address or they prefer mobile-first communication.

**Acceptance Criteria:**
- Given I am a Yassir business user
- When I navigate to the members tab on the webapp
- Then I can invite new users either by email or phone number
- When I click on “Phone number” section
- Then I can select the user I want to invite phone number
- When I click on send invite
- Then the invitation is send to the user
- We can verify the account phone number
- We can merge his account with Yassir Go Account, or in case he doesn't have an account create him an account and merge it with the business account
- Scenario 1: Input Detection for Login
- Given: I am on the login screen of the Yassir for Business platform.
- When: I enter my email or phone number in the input field, based on my choice in the tabs at the top
- Then: The system should detect whether the input is an email or phone number.
- And Then: The system should direct me to the next screen where I can proceed with one of the log in options (OTP, as other login options: magic link, or password).
- Scenario 2: Log in with OTP Message
- Given: I have entered my phone number on the login screen.
- When: I select the "Login with OTP" option,
- Then: The system should send an OTP message to my registered phone number.
- And When: I enter the correct OTP,
- Then: I should be logged into my account successfully.
- And When: I enter an incorrect OTP,
- Then: The system should display an error message and allow me to request a new OTP.
- Scenario 3: Log in with Magic Link
- Given: I have entered my email or phone number on the login screen.
- When: I select the "Login with Magic Link" option,
- Then: The system should send a magic link to my registered email, also the pop up should collapse and I should get a successful message
- And When: I click on the magic link,
- Then: I should be redirected to my account's home dashboard, logged in successfully.
- Scenario 4: Login with Password
- When: I select the "Login with Password" option,
- Then: The system should display a password input field.
- And When: I enter the correct password,
- And When: I enter an incorrect password,
- Then: The system should display an error message and allow me to retry.
- Scenario 5: Handling Invalid Inputs
- Given: I am on the login screen.
- When: I enter an invalid email or phone number format,
- Then: The system should display an error message indicating that the input is invalid and prompt me to correct it.
- Scenario 6: Remember Me Option (Optional)
- When: I select the "Remember Me" checkbox before logging in,
- Then: The system should remember my credentials for future logins (unless I log out).
- Scenario 7: Log in for unverified Phone number
- Given: I am on the login screen with the phone number
- When: I enter my unverified phone number
- Then: The system should send me an error message informing me that the phone number is unverified
- Event Name

---

### CMB-21426: GA Editing Registration Flow 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2025-01-09

**Description:**
As a product analyst,
I want to track Google Analytics (GA) events for key actions within the Profile Setup section,

---

### CMB-25560: Whatsaap authentification for B2B 

**Status:** Done | **Priority:** No Priority
**Created:** 2025-05-14

**Description:**
As a Yassir business user, I want to verify my phone number using WhatsApp OTP during the account creation process, the login with phone number process, and when inviting users using phone number, so that I can quickly and easily confirm my identity and proceed with setting up my business account.

---

### CMB-23474: B2C: One-time authentication on web panel

**Status:** Done | **Priority:** P1 - High
**Created:** 2025-03-05

**Description:**
As a Yassir Ride web user, I want to receive a one-time authentication code via SMS after entering my login credentials, so that I can securely access my account and do the authentication one time.

---

### CMB-13781: Driver Image on trip details

**Status:** Done | **Priority:** No Priority
**Created:** 2024-04-12

**Description:**
As a rider, I want to see the driver's image on the trip details screen, so I can easily remember who the driver was and associate a face with the trip.

---

### CMB-20536: B2C Team Experience (B2C WebApp)

**Status:** Done | **Priority:** No Priority
**Created:** 2024-12-09

**Description:**
As a user, I expect the B2C web app to check service availability, calculate ETA and price, and handle any errors if the service is unavailable. Whether I’m logged in or logged out, the app should respond accordingly, with the user redirected to the appropriate pages (authentication or estimation).

**Acceptance Criteria:**
- Scenario: Service Availability and Response (Logged-in User)
- Given the YA website has sent the user’s location and destination,
- When the B2C web app processes the request,
- Then if the user is logged in, it should check service availability and respond with ETA and price, if unavailable should display an error message indicating that the service is not available
- Scenario: Service Availability and Response (Logged-out User)
- Given the YA website has sent the user’s location and destination,
- When the B2C web app processes the request,
- Then if the user is logged out, it should first redirect them to the authentication portal,
- And once logged in, the B2C web app should check service availability and respond with ETA and price, if unavailable should display an error message indicating that the service is not available

---

### CMB-3953: Onboarding Payment Setup Fix

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-07

**Description:**
As a business account manager, I need to be able to choose between a prepaid payment plan, and a postpaid payment plan, so that when I click on booking a meeting and I move to the next step of inviting the users, my payment plan option should be recorded and reflected in my enterprise details page on the Admin panel

**Acceptance Criteria:**
- The Prepaid option should be chosen by default
- The business account manager can choose the post-paid plan, and switch between the two choices on this screen
- When Bam Clicks on Book a meeting, the value of the plan he chose must be recorded and reflected on his data, on the Admin panel enterprise details page
- Before continuing to the next screen user must book a meeting
- if BAM didn't book a meeting he should remain on this step
- Bam can get back to the previous step by clicking on the back button
- BAM can't skip this step
- BAM should get back to the onboarding screen when is done with booking the meeting

---

### CMB-194: Dev: BAM Verify Phone number with OTP

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a non-logged-in or signed up business account manager user, I want to be able to add my phone number and receive an OTP verification message so that I can log in or Sign up using my phone number

**Acceptance Criteria:**
- We can verify the account phone number
- We can merge his account with Yassir Go Account, or in case he doesn't have an account create him an account and merge it with the business account
- Scenario 1: Input Detection for Login
- Given: I am on the login screen of the Yassir for Business platform.
- When: I enter my email or phone number in the input field, based on my choice in the tabs at the top
- Then: The system should detect whether the input is an email or phone number.
- And Then: The system should direct me to the next screen where I can proceed with one of the log in options (OTP, as other login options: magic link, or password).
- Scenario 2: Log in with OTP Message
- Given: I have entered my phone number on the login screen.
- When: I select the "Login with OTP" option,
- Then: The system should send an OTP message to my registered phone number.
- And When: I enter the correct OTP,
- Then: I should be logged into my account successfully.
- And When: I enter an incorrect OTP,
- Then: The system should display an error message and allow me to request a new OTP.
- Scenario 3: Log in with Magic Link
- Given: I have entered my email or phone number on the login screen.
- When: I select the "Login with Magic Link" option,
- Then: The system should send a magic link to my registered email, also the pop up should collapse and I should get a successful message
- And When: I click on the magic link,
- Then: I should be redirected to my account's home dashboard, logged in successfully.
- Scenario 4: Login with Password
- When: I select the "Login with Password" option,
- Then: The system should display a password input field.
- And When: I enter the correct password,
- And When: I enter an incorrect password,
- Then: The system should display an error message and allow me to retry.
- Scenario 5: Handling Invalid Inputs
- Given: I am on the login screen.
- When: I enter an invalid email or phone number format,
- Then: The system should display an error message indicating that the input is invalid and prompt me to correct it.
- Scenario 6: Remember Me Option (Optional)
- When: I select the "Remember Me" checkbox before logging in,
- Then: The system should remember my credentials for future logins (unless I log out).
- Scenario 7: Log in for unverified Phone number
- Given: I am on the login screen with the phone number
- When: I enter my unverified phone number
- Then: The system should send me an error message informing me that the phone number is unverified
- Event Name

---

### CMB-193: Dev: BAM Email Verification

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As a non-logged-in or signed-up business account manager user, I want to be able to add my business email address and verify it using the magic link, so that I can create my password.

**Acceptance Criteria:**
- Can verify the business email account
- We can merge his account with Yassir Go Account, or in case he doesn't have an account create him an account and merge it with the business account

---

### CMB-4702: User Invitation Expired 

**Status:** Done | **Priority:** No Priority
**Created:** 2023-04-05

**Description:**
As a Business Account Manager of the Yassir Go for B2B web app, I want to be notified when a Business Rider's invitation link has expired and have the ability to resend an invitation from the users' invitation tab, so that I can efficiently manage Business Rider onboarding and ensure timely access to the platform.

**Acceptance Criteria:**
- The web app should display a list of Business Riders, including their status [Pending - Active - Expired].
- The invitation status of a Business Rider should be updated to "Expired" when their invitation link expires.
- The Business Account Manager should be able to view and manage the users' invitation tab.
- The users' invitation tab should provide an option to resend an invitation to a Business Rider with an expired invitation.
- When the Business Account Manager resends an invitation, the invitation status of the Business Rider should be updated to "Pending".
- The web app should display a confirmation message when an invitation has been successfully sent.
- Scenario 1: Viewing expired Business Rider invitations
- Given: I am a Business Account Manager of the Yassir Go for B2B web app
- When: I navigate to the Business Riders list (Users List)
- Then: I should see the invitation status of each Business Rider
- And: If a Business Rider's invitation link has expired, their status should be displayed as "Expired"
- Scenario 2: Resending an invitation to an expired Business Rider
- Given: I am a Business Account Manager viewing the users' invitation tab
- When: I select a Business Rider with an expired invitation
- And: I reinvite him from the invitation screen
- Then: The invitation status of the selected Business Rider should be updated to "Pending"
- And: The web app should display a confirmation message, indicating that the invitation has been successfully resent

---

### CMB-462: Dev - BE: Invitation by Email

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-08-29

**Description:**
As a business account manager, I want to be able to invite Company Riders to the programs via bulk emails so that they can receive a magic link to submit their info and start using the program

---

### CMB-3876: Activation Updates

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-06

**Description:**
As a business account manager whose account has been activated after the onboarding or activated after any de-activation event, I need to get an update email about my current status

**Acceptance Criteria:**
- Email Must Contain the:
- BAM first name
- Scenarios:
- Given: A business account manager who has finished the onboarding phase
- When: the OPs Manager Activate the enterprise account again
- Then:  I need to get an email, informing me about the activation of my account
- Given: A business account manager who has been de-activated for one of the de-activation reasons
- When: the OPs Manager Activate the enterprise account again
- Then:  I need to get an email, informing me about the activation of my account
- Email Template
- Dear [First Name],
- I'm pleased to inform you that your business account with us is now reactivated and fully functional.
- Please let us know if you encounter any issues while using our platform, and we'll be happy to assist you.
- Thank you for your patience and cooperation during this process.
- Best regards,
- Cher/Chère [Prénom],
- Nous avons le plaisir de vous informer que votre compte professionnel chez nous a été réactivé et est entièrement fonctionnel.
- N'hésitez pas à nous informer si vous rencontrez des problèmes lors de l'utilisation de notre plateforme et nous serons heureux de vous aider.
- Nous vous remercions de votre patience et de votre coopération pendant ce processus.
- Cordialement,

---

### CMB-161: Dev: B2B Rider Signup 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-07-29

**Description:**
As non logged in Business Rider and I have received an invitation by email, I want to be able to open the magic link that I have received, so that I can be directed to Yassir Go Business Web App, to provide my info and start using the service as a business Rider

**Acceptance Criteria:**
- Company Admin needs to be updated about how many Business Riders have joined the program

---

### CMB-3224: Changing Password

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-01

**Description:**
As a business account manager who have logged in, and finished my onboarding. I need to be able to access my profile setting so that I can set a new password

**Acceptance Criteria:**
- The user needs to be able to change:
- Password
- For Changing Password we need to ask the user to enter his old password and to confirm on the new password
- The new password, must contain at least 8 digits, contains a charcter, a number, and a sympol

---

### CMB-3223: Changing Personal Information

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-01

**Description:**
As a business account manager who has finished the onboarding, I'm logged in to the platform. I need to be able to access my profile setting so that I can edit my name and company name

**Acceptance Criteria:**
- to change:
- First Name
- Last Name
- Job Title
- Company Name
- Industry
- Company Size
- This data can’t be changed or saved unless the user would submit and confirm on submitting
- Business Email
- Phone Number
- Name
- For changing email address, we need to verify the new email the user entered

---

### CMB-4369: Enterprise Trips Table

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-03-28

**Description:**
As an Admin, I want to be able to view all the trips made by a business and the associated changes in the budget from a detailed trip view on the enterprise details page, so that I can effectively monitor and manage enterprise-related travel activities and expenses.

**Acceptance Criteria:**
- The Admin can access the enterprise details page for a specific business.
- The Admin can view a list of all trips made by the business.
- The detailed trip view should display relevant trip information, such as:
- Trip ID,
- Rider Name, and Email
- trip time, dates, (Sortable)
- pickup,
- destination,
- Rider Email,
- trip Cost.
- Is Trip Refunded or not
- Amount refunded
- How Much of the Budget is deducted
- Trips Status:
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
- RIDER_CANCELED it will be written (Canceled_RD)
- NO_DRIVER_AVAILABLE (Canceled NDA)
- DRIVER_COMING_CANCELED (Canceled DCC)
- DRIVER_COMING_RIDER_CANCELED (Canceled DCRC)
- DRIVER_ARRIVED_CANCELED (Canceled DC)
- DRIVER_ARRIVED_RIDER_CANCELED (Canceled DRC)
- Last made trip must be in the first row of the table by default
- Given-When-Then Scenarios:
- Scenario 1: Admin accesses the enterprise details page successfully
- Given: Admin is logged into the Admin Panel
- When: Admin navigates to the enterprise details page for a specific business
- Then: The enterprise details page is displayed and he can find the trips list
- Scenario 2: Admin views the list of trips for a business
- Given: Admin is on the enterprise details page
- When: Admin looks for the trip list
- Then: A list of trips made by the business is displayed with the following information:
- Trip ID,
- Rider Name, and Email
- trip time, dates, (Sortable)
- pickup,
- destination,
- Rider Email,
- trip Cost.
- Is Trip Refunded or not
- Amount refunded
- How Much of the Budget is deducted
- Trips Status:
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
- RIDER_CANCELED (Canceled RC)
- NO_DRIVER_AVAILABLE (Canceled NDA)
- DRIVER_COMING_CANCELED (Canceled DCC)
- DRIVER_COMING_RIDER_CANCELED  (Canceled DCRC)
- DRIVER_ARRIVED_CANCELED  (Canceled DC)
- DRIVER_ARRIVED_RIDER_CANCELED (Canceled DRC)

---

### CMB-2555: Design: Admin Login

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-12-19

**Description:**
As an Ops manager, I need to be able to log in using my Yassir Business Email, via google login so that I can manage the different business accounts

**Acceptance Criteria:**
- Admin will be able to log in with Google Account
- If an Admin doesn't have access to any countries, he will not see any data. but will find the person in charge to contact him
- Admin Must see only data in his market only unless permitted otherwise
- Admin needs to be able to choose the country from a drop-down list, and he will be able to see the permitted countries only
- The user will be directed to the dashboard once he logs in
- If the user didn’t complete his program set up and the group set up he needs to be directed to that page to complete the different program parameters
- Admin Must see only data in his market only, unless permitted other wise

---

### CMB-4719: Switching Between Languages 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-04-06

**Description:**
As a Business Account Manager of the Yassir Go for B2B web app, I want to be able to select my language during the onboarding process, and the whole B2B Dashboard using a button at the top of the page so that I can easily switch between English, and French, ensuring a smooth and personalized experience.

**Acceptance Criteria:**
- The onboarding page and the whole B2B web app should display a language selection button at the top of the page.
- The language selection button should provide options for English, and French.
- When a Business Account Manager selects a language preference, the content should be immediately displayed in the chosen language.
- The web app should remember the selected language preference throughout the onboarding process.
- The language preference should be saved for future sessions when the Business Account Manager logs in to the web app.
- The BAM’s preferences remain but on the current browser. if you log out, close the tab, and then open it again in the same browser, you will get the user’s saved language'
- The Language must be French by default.
- Scenario 1: Viewing the language selection button
- Given: I am a Business Account Manager going through the onboarding process, and the whole web app for the Yassir Go for B2B web app
- When: I view the onboarding page, Login Page, and Dashboard
- Then: I should see a language selection button at the top of the page
- Scenario 2: Selecting a language preference
- Given: I am a Business Account Manager viewing the language selection button
- When: I click on the language selection button
- Then: I should see options for English, and French
- Scenario 3: Changing the language
- Given: I am a Business Account Manager who has chosen a language preference from the language selection button
- When: I select a different language
- Then: The content should immediately update to display in the newly selected language
- Scenario 4: Retaining the language preference in future sessions
- Given: I am a Business Account Manager who has previously selected a language preference during the onboarding process
- When: I log in to the Yassir Go for B2B web app in future sessions
- Then: My language preference should be retained, and the web app should display content in my selected language

---

### CMB-5608: Adding invoice information

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-05-05

**Description:**
As an operations manager, Looking for enterprises. I want to have a dedicated tab on the enterprise details page where I can add various detailed fields about the company such as registration number, and legal entity address so that I can have easy access to this information and ensure that it is up-to-date and accurate.

**Acceptance Criteria:**
- The new tab should be named "Company Legal Details" and should be easily visible on the enterprise details page.
- All fields are empty by default, and they are optional
- We can send the invoice even if all or some fields are empty
- The tab should include the following fields, based on each country:
- Morocco Fields:
- Legal Company Name
- Legal Adress:
- Building Number/ Apt.
- First Line of Address
- Second Line of Adress
- City (Drop-Down List)
- Zip/ Postal Code (Numerical)
- ICE: Common Compay identifier
- IF: Tax Identification
- RC: Commercial Register
- TTC: is the pre-tax price + tax
- payment period (Monthly, Quarterly, Yearly):
- Monthly: if a business is created on 22, May. then the invoice will be sent will cover the period from 1, May → 31, May (By Default)
- Quarterly if a business is created on 22, May. then the invoice will be sent will cover the period from 1, Apr→ 30, June
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 2023
- The Tab must include a toggle button for applying taxes on this enterprise or not. it must be enabled by default.
- Taxes amount = 20%
- Algeria Fields:
- Legal Company Name
- Legal Company Adress
- Building Number/ Apt.
- First Line of Address
- Second Line of Adress
- City (Drop-Down List)
- Zip/ Postal Code (Numerical)
- Raison social
- NIF:
- NIS:
- payment period (Monthly, Quarterly, Yearly):
- Monthly: if a business is created on 22, May. then the invoice will be sent will cover the period from 1, May → 31, May (By Default)
- Quarterly if a business is created on 22, May. then the invoice will be sent will cover the period from 1, Apr→ 30, June
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 202
- The Tab must include a toggle button for applying taxes on this enterprise or not. it must be enabled by default.
- Taxes amount = 19%
- Senegal Field:
- Legal Company Name
- Legal Adress
- Building Number/ Apt.
- First Line of Address
- Second Line of Adress
- City (Drop-Down List)
- Zip/ Postal Code (Numerical)
- ID de la société
- NINEA
- payment period (Monthly, Quarterly, Yearly):
- Monthly: if a business is created on 22, May. then the invoice will be sent will cover the period from 1, May → 31, May (By Default)
- Quarterly if a business is created on 22, May. then the invoice will be sent will cover the period from 1, Apr→ 30, June
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 202
- The Tab must include a toggle button for applying taxes on this enterprise or not. it must be enabled by default.
- Taxes amount = 18%
- Tunisia:
- Legal Company name
- Legal billing address
- Building Number/ Apt.
- First Line of Address
- Second Line of Adress
- City (Drop-Down List)
- Zip/ Postal Code (Numerical)
- tax number
- payment terms (transfer, cheque)
- payment period (Monthly, Quarterly, Yearly):
- Monthly: if a business is created on 22, May. then the invoice will be sent will cover the period from 1, May → 31, May (By Default)
- Quarterly if a business is created on 22, May. then the invoice will be sent will cover the period from 1, Apr→ 30, June
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 202
- The Tab must include a toggle button for applying taxes on this enterprise or not. it must be enabled by default.
- Taxes amount = 19%
- All Fields except the Date and Zip Code filed must accept numbers and letters, for example, the address: 15, Steet Name,
- The user should be able to add or edit the information in each field.
- The user should be able to save and update the information in the fields.
- Scenarios:
- Scenario 1: Viewing and Entering Legal Details
- Given the operations manager is on the enterprise details page,
- When they navigate to the "Company Legal Details" tab,
- Then they should see the fields specific to each country and can enter or edit the information, for that enterprise
- Scenario 2: Toggling Taxes on/off
- Given the operations manager is on the "Company Legal Details" tab,
- When they toggle the taxes button to enable or disable tax application,
- Then the system should save the selected preference and update it accordingly. and it won’t appear on the invoice as added value
- Scenario 3: Selecting Payment Period
- Given the operations manager is on the "Company Legal Details" tab,
- When they select the payment period for the enterprise,(Monthly, Quarterly, Yearly)
- Then the system should calculate the trip costs been done in the duration and display the invoice coverage period based on the selected period and business creation date.
- And Duration is calculated this way
- Monthly: if a business is created on 22, May. then the invoice will be sent will cover the period from 1, May → 31, May (By Default)
- Quarterly if a business is created on 22, May. then the invoice will be sent will cover the period from 1, Apr→ 30, June
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 202
- Scenario 4: Saving and Updating Information
- Given the operations manager is on the "Company Legal Details" tab,
- When they save or update the information entered in the fields,
- Then the system should store the data and display it for that enterprise and overwrite any previous data.
- Scenario 5: Empty Fields and Invoice Link
- Given the operations manager is on the "Company Legal Details" tab,
- When they provide the invoice link for the paid amount, even if some fields are empty,
- Then the system should save the link and allow the invoice to be sent to the BAM, and all of the legal information will be empty according to its initial status
- Scenario 8: Cross-Country Legal Details
- Given the operations manager is managing legal details for multiple countries,
- When they switch between countries and choose different enterprises
- Then the system should dynamically display the corresponding legal fields for each country, ensuring accurate and country-specific information.
- Scenario 9: Zip Code Validation
- Given the operations manager is entering a zip code
- When they provide an invalid format or value, other than numerical value
- Then the system should validate the input and display an error message, prompting the user to enter the correct format or value.

---

### CMB-9895: Daily Commuting To Office Template

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-20

**Description:**
As a Business Account Manager (BAM), I want to be able to choose the "Commuting to Office" program during the onboarding process.

**Acceptance Criteria:**
- Scenario 1: Choosing the "Commuting to Office" Program
- Given I am a BAM in the onboarding process,
- When I reach the program setup step,
- Then I should find the option to select the "Commuting to Office" program.
- Scenario 2: Creating the Program
- Given I choose the "Commuting to Office" program,
- When I provide the office location (either by searching or using a map pop-up),
- Then the program should be created with the following parameters:
- Trip type: Round trips between the office and any location.
- Days allowed: Working days only.
- Hours allowed: Working hours only.
- Spending allowance: Unlimited.
- Number of trips allowed per user: 2 trips.
- All available services available for this company are enabled.
- Price is hidden for users by default.
- Trip permission is auto-approval by default
- Scenario 3: Direct Access to the Web App
- Given I choose the "Commuting to Office" program and it's created successfully,
- When I complete the onboarding process,
- Then I should be directly directed to the Web App main screen, ready to use the program.
- Scenario 4: Activation Step
- Given I choose the "Commuting to Office" program and it's created successfully,
- When I complete the onboarding process,
- Then if activation is required for the program, I should be guided through the activation steps to make it operational.

---

### CMB-9894: Unlimited Usage Program Template: Recommended

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-10-20

**Description:**
As a Business Account Manager (BAM) during the onboarding process, I want the option to choose between creating a custom program or selecting a program template.

**Acceptance Criteria:**
- Scenario 1: Choosing a Program Template
- Given I am a BAM in the onboarding process,
- When I reach the program setup step,
- Then I should see an option to choose a program template.
- Scenario 2: Selecting a Program Template
- Given I choose to select a program template,
- When I click on the template of my choice,
- Then a pre-defined program with default settings should be created, and I should proceed to the next onboarding steps. going to the dashboard, or waiting for activation
- Scenario 3: Creating a Custom Program
- Given I choose to create a custom program,
- When I continue with the onboarding process,
- Then I should go through the ordinary program creation flow where I can specify program details, including spending allowances, services, and other settings.
- Scenario 4: Informing About Editability
- Given I chose a program template,
- When the program is created from the template,
- Then I should receive a pop-up message to confirm my choice and inform me that I can edit this later on
- Scenario 5: Seeing program details
- Given I click on a program template see the details button
- When the list would expand,
- Then I should be able to see this program's parameters
- Scenario 6: Seeing program details
- Given I choose a program template
- When the Program is created
- Then the program name will be named after the template
- Scenario 7: Choosing the "Recommended" Program
- Given I am a BAM in the onboarding process,
- When I reach the program setup step,
- Then I should find the option to select the "Recommended" program.
- Scenario 8: Creating the "Premium" Program
- Given I choose the "Premium" program,
- Then the program should be created with the following parameters:
- Trip type: From any location to any location.
- Days allowed: Any day.
- Hours allowed: Any time.
- Spending allowance: Unlimited.
- Number of trips allowed per user: Unlimited.
- All available services are enabled _the services allowed for this company_.
- Price visible for users by default.
- The Users will have auto-approval
- Scenario 9: Completing Onboarding
- Given I choose the "Recommended" program and it's created successfully,
- When I complete the onboarding process,
- Then I should be ready to use the program with maximum flexibility for Riders, allowing them to request trips without limitations.

---

### CMB-9898: Login/ Signup with Google 

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-10-20

**Description:**
As a Business Account Manager (BAM)/ Business Admin, I want the ability to log in using my Google account on the login screen.

**Acceptance Criteria:**
- Scenario 1: Logging In with a Registered Google Account
- Given I am on the login screen of the B2B web application,
- When I choose the "Log in with Google" option, And I select my Google account,
- Then the system should check if my email is registered in the B2B system. If my email is registered, I should be automatically logged in to my B2B account without being required to enter my email and password.
- Scenario 2: Sign Up with Google Account
- Given I am on the login screen and my Google-linked email is not registered in the B2B system,
- When I choose the "Log in with Google" option, And I select my Google account, If my email isn’t registered,
- Then the system should guide me to the signup screen  of google to create an account So I Can verify my phone number and complete the necessary signup details,
- Scenario 3: Sign Up with Email, and Password After Signing up with Google
- Given I am on the login screen and my Google-linked email is registered
- When I choose the "Log in with Email and Password
- Then I get an error telling me to login with Google

---

### CMB-10942: OTP Number Flag

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-12-04

**Description:**
As a Business Account Manager (BAM) registering on the platform, I want the country flag of my current location to be pre-selected by default when I enter my phone number, so I don't have to manually change it.

**Acceptance Criteria:**
- Phone Number Entry Screen:
- When I reach the screen for entering my phone number during registration, I should see a field for the phone number input.
- Default Flag Selection:
- Next to the phone number input field, there should be a flag icon representing the country.
- The flag icon displayed should correspond to the country where I am currently located.
- If I am located in Tunisia, the Tunisian flag should be pre-selected by default.
- If I am located in Senegal, the Senegalese flag should be pre-selected by default.
- If I am located in Algeria, the Algerian flag should be pre-selected by default.
- If I am located in Morocco, the Moroccan flag should be pre-selected by default.
- Manual Flag Change (Optional):
- While the default flag should be based on my current location, I should have the option to manually change the flag if I intend to register with a phone number from a different country.

---

### CMB-10941: Edit Customer Persona Information

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-12-04

**Description:**
As a Business Account Manager (BAM), I want to complete my registration smoothly by providing my personal information and relevant business details in a single, user-friendly page.

**Acceptance Criteria:**
- Personal Information Entry:
- As a BAM, when I access the registration page, I should see a section for entering my personal details.
- The personal details section should include fields for my name and job title.
- Business-Related Questions:
- Below the personal details section, there should be a set of questions related to my business.
- These questions should include the industry I work in and the size of my company.
- The industry field should allow me to select from a list of industry options.
- The company size field should allow me to select from a list of company size ranges.
- Company Headquarters City Selection:
- After providing my personal information and answering business-related questions, I should see a field for entering my company's headquarters city.
- This field should be a drop-down list.
- The options in the drop-down list should be based on the country I entered when providing my phone number.
- Validation and Submission:
- The system should validate that all required fields are filled correctly.
- If any required field is missing or contains invalid data, the system should display clear error messages.
- Once all the required information is provided correctly, I should be able to submit my registration.

---

### CMB-8393: Login/Signup & Forget Password  Flow Arabic Version

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-08-16

**Description:**
As a business account manager (BAM), I want to have the ability to switch the language on the login screen to Arabic, so that the layout of the screen adjusts to support right-to-left (RTL) text direction.

**Acceptance Criteria:**
- Given that I am on the login screen of the B2B web application, when I navigate to the language switch, then I should find an option to switch to the Arabic language.
- Given that I am on the login screen and I choose the Arabic language option, when I select it, then the entire interface layout should transform to RTL, including text alignment, button placements, and overall design.
- Given that I am on the login screen and I choose the Arabic language option, when I view any displayed text, then it should be in Arabic characters and properly aligned from right to left.
- Given that I am on the login screen and I have switched to Arabic, when I enter text (e.g., username, password) into input fields, then the input text direction should be from left to right as it’s.
- Given that I am on the login screen in Arabic mode, when I click on any action buttons (e.g., "Login," "Forgot Password"), then the button labels should be displayed in Arabic text.
- Scenarios:
- Scenario 1: Switching to Arabic Language
- Given: I am on the login screen of the B2B web application
- And: I navigate to the language switch button
- When: I choose the Arabic language option
- Then: The interface layout transforms to RTL and all displayed text switches to Arabic.
- Scenario 2: Viewing Arabic Text Display
- Given: I am on the login screen in Arabic mode
- When: I view any displayed text, such as headings or labels
- Then: The text should be in Arabic characters and aligned from right to left.
- Scenario 3: Entering Input Text
- Given: I am on the login screen in Arabic mode
- When: I enter text (e.g., username, password) into input fields
- Then: The input text direction should be from left to right.
- Scenario 4: Interacting with Action Buttons
- Given: I am on the login screen in Arabic mode
- When: I click on action buttons (e.g., "Login," "Forgot Password")
- Then: The button labels should be displayed in Arabic text.

---

### CMB-9900: Onboarding Process On Mobile

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-20

**Description:**
As a Business Account Manager (BAM), I want the signup, login, and onboarding screens of the B2B web application to be fully responsive to the screen size of my mobile device.

**Acceptance Criteria:**
- Given I am a BAM accessing the B2B web application from my mobile device,
- When I open the signup, login, or onboarding screens,
- Then the layout and design of these screens should adapt seamlessly to my mobile screen size without any visual glitches.
- Scenario 1: Accessing Signup Screen on Mobile
- Given I am a BAM accessing the B2B web application from my mobile device,
- When I click on the "Signup" option,
- Then the signup screen should load and display correctly on my mobile screen, with all elements appropriately sized and positioned.
- Scenario 2: Accessing Login Screen on Mobile
- Given I am a BAM accessing the B2B web application from my mobile device,
- When I click on the "Login" option,
- Then the login screen should load and display correctly on my mobile screen, ensuring that input fields, buttons, and other interface elements are easily accessible and functional.
- Scenario 3: Accessing Onboarding Screen on Mobile
- Given I am a BAM accessing the B2B web application from my mobile device,
- When I proceed with the onboarding process,
- Then the onboarding screens should be responsive and provide a smooth experience on my mobile, allowing me to input information and navigate through the steps without encountering any technical issues or layout problems.
- Scenario 4: Responsiveness Validation
- Given I am on the signup, login, or onboarding screens from my mobile,
- When I resize my mobile screen or switch between portrait and landscape modes,
- Then the screens should continue to adapt and maintain their responsiveness, ensuring a consistent and glitch-free user experience.

---

### CMB-10766: Resend OTP on onboarding

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-11-24

**Description:**
As a Business Account Manager (BAM) or an invited Business Rider, I want to be able to request the resending of an OTP message if I didn't receive it or if the OTP message has expired.

**Acceptance Criteria:**
- The platform should provide an option to request the resending of an OTP message during the registration process.
- The option to request a new OTP should be available if the original OTP message is not received or has expired.  that can be activated only after 60 secs
- Clicking the "Resend OTP" option should trigger the system to send a new OTP message to the registered phone number.
- The new OTP should be valid and functional for the registration process.
- Scenario 1: Requesting Resend of OTP (BAM)
- Given: I am a BAM in the registration process, And: I haven't received the OTP message on my registered phone number.
- When: I click on the "Resend OTP" option.  that can be activated only after 60 secs
- Then: The system should initiate the sending of a new OTP message to my phone number.
- Scenario 2: Requesting Resend of OTP (Invited Business Rider)
- Given: I am an invited Business Rider in the registration process, And: I haven't received the OTP message on my registered phone number.
- When: I click on the "Resend OTP" option. that can be activated only after 60 seconds
- Then: The system should initiate the sending of a new OTP message to my phone number.
- Scenario 3: New OTP Received (BAM)
- Given: I am a BAM who requested the resend of OTP.
- When: I check my registered phone number for the OTP.
- Then: I should receive a new OTP message.
- Scenario 4: New OTP Received (Invited Business Rider)
- Given: I am an invited Business Rider who requested the resend of OTP.
- When: I check my registered phone number for the OTP.
- Then: I should receive a new OTP message.
- Scenario 5: Using the New OTP (BAM)
- Given: I am a BAM who received a new OTP message.
- When: I enter the new OTP during the registration process.
- Then: The system should accept the new OTP and allow me to proceed with the registration.
- Scenario 6: Using the New OTP (Invited Business Rider)
- Given: I am an invited Business Rider who received a new OTP message.
- When: I enter the new OTP during the registration process.
- Then: The system should accept the new OTP and allow me to proceed with the registration.
- Scenario 7: Expiry of Resent OTP
- Given: I have requested a resend of OTP.
- And: The resent OTP message has expired (usually after a certain time period).
- When: I attempt to use the expired OTP.
- Then: The system should display an error message indicating that the OTP has expired, and I should request a new one by clicking "Resend OTP."

---

### CMB-9245: Removing the Activation Step 

**Status:** Done | **Priority:** No Priority
**Created:** 2023-09-25

**Description:**
As a Business Account Manager (BAM) joining the Yassir platform, I want a seamless onboarding experience where my business account is automatically activated without requiring manual approval from an Ops Manager.

**Acceptance Criteria:**
- Onboarding Process:
- The BAM initiates the onboarding process by providing the necessary business information and preferences.
- Automatic Account Activation:
- Upon successful completion of the onboarding process, the BAM's business account is automatically activated without the need for manual approval from Ops Managers.
- Given-When-Then Scenarios:
- Scenario 1: Smooth Onboarding Experience
- Given: The BAM begins the onboarding process.
- When: The BAM completes the required steps of the onboarding process successfully.
- Then: The BAM's business account is instantly activated, and they gain immediate access to the platform's features.
- Scenario 2: No Manual Activation Required
- Given: The BAM finishes the onboarding process.
- When: The BAM's business account details are submitted and verified.
- Then: The BAM's account status changes to "Activated" automatically without any additional steps or manual approval from Ops Managers.
- During the onboarding process, the BAM enters the necessary information and preferences for their default program
- Dashboard Access:
- Upon completing the onboarding process, the BAM is directed to the Dashboard immediately.
- User Invitation Flexibility:
- The BAM is not obligated to invite additional users (Business Riders) as part of the onboarding process.
- Scenario 1: Seamless Onboarding to Dashboard
- Given: The BAM is going through the onboarding process.
- When: The BAM completes the required steps of the onboarding process.
- Then: The BAM is immediately granted access to the Dashboard without the need to invite additional users.
- Scenario 2: Invitation at a Later Time
- Given: The BAM has access to the Dashboard following onboarding.
- When: The BAM decides to invite other users to join and assist in managing the business at a later time.
- Then: The BAM can initiate user invitations independently, choosing when to invite additional users to the platform.
- Onboarding Registration:
- When registering for a Yassir Business Account, the BAM is guided through the onboarding process.
- Default Payment Plan Selection:
- The BAM is not required to manually select a payment plan during the onboarding process.
- Automatic Prepaid Plan Assignment:
- By default, the BAM's payment plan is set as "Prepaid" without any action required on their part.
- Ops Manager's Ability to Modify:
- Ops Managers have the capability to access the BAM's account settings and make adjustments to the payment plan if needed.
- Scenario 1: Seamless Onboarding for BAM
- When: The BAM completes the registration steps without being prompted to choose a payment plan.
- Then: The BAM's default payment plan is automatically set as "Prepaid."
- Scenario 2: Ops Manager Modifies Payment Plan
- Given: The BAM's default payment plan is "Prepaid."
- When: An Ops Manager accesses the BAM's account settings and decides to change the payment plan to another option (e.g., "Postpaid").
- Then: The payment plan is updated to the Ops Manager's choice, and the BAM is billed accordingly based on the modified payment plan.

---

### CMB-9677: Create a Company Onboarding Slack Bot

**Status:** Done | **Priority:** P3 - Low
**Created:** 2023-10-12

**Description:**
As a member of the product team, I want to set up a chatbot on our Slack channel that automatically notifies us whenever a new business is created in the production environment.

**Acceptance Criteria:**
- Scenario 1: New Business Creation Notification
- Given I am a member of the product team,
- When a new business is created in the production environment,
- Then the Slack chatbot should automatically send a notification to our designated Slack channel.
- Scenario 2: Notification Content
- Given a new business is created and a notification is sent to the Slack channel,
- When I view the notification,
- Then it should include the following information about the new business:
- Business Name
- Email Address of the Business Account Manager (BAM)
- The country associated with the business
- Scenario 3: Real-time Notifications
- Given a new business is created,
- When the notification is sent to the Slack channel,
- Then it should be delivered in real time to ensure timely awareness of the new business activity.

---

### CMB-12108: Filter Companies By Cities

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-01-29

**Description:**
As an Admin using the Admin Panel, I want the ability to filter companies based on the city provided by the Business Account Manager (BAM) during the onboarding process.

**Acceptance Criteria:**
- Scenario 1: Accessing the Company Filter
- Given: I am logged in as an Admin on the Admin Panel.
- When: I navigate to the section where a table of companies is displayed.
- Then: I should find a filter option labeled "City."
- Scenario 2: Filtering by City
- Given: I am viewing the table of companies.
- When: I select the "City" filter option.
- Then: I should see a dropdown or text input where I can enter or choose a city name.
- Scenario 3: Entering a City Name
- Given: I have access to the "City" filter.
- When: I enter the name of a city where one or more companies are located.
- Then: The table of companies should dynamically update to display only those companies that have the selected city in their information.
- Scenario 4: Clearing the Filter
- Given: I have applied a city filter.
- When: I wish to remove the filter and view all companies again.
- Then: There should be a clear option or an "All" choice in the city filter that restores the full list of companies.
- Scenario 5: Multiple Filters
- Given: I need to apply multiple filters for precise company selection.
- When: I have selected a city filter, and I want to further refine my search with other filters.
- Then: The system should allow me to combine city filters with other available filters, such as industry or company size.
- Scenario 6: Search Flexibility
- Given: I am entering a city name into the filter.
- When: I start typing the city name.
- Then: The system should provide suggestions or auto-complete options to help me quickly select the desired city.

---

### CMB-14537: Login Via Link 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-05-13

**Description:**
User Story:

**Acceptance Criteria:**
- Scenario 1: Requesting Magic Link
- Given that I am a Business Account Manager, Program Manager, or Business Admin,
- When I attempt to log in to the Yassir for Business platform,
- And I choose the option to log in with a magic link,
- Then the system should prompt me to enter my registered email address.
- Scenario 2: Sending Magic Link
- Given that I have entered my registered email address,
- When I click on the "Send Magic Link" button,
- Then the system should send a magic link to my email address.
- Scenario 3: Accessing the Platform
- Given that I have received the magic link in my email,
- When I click on the magic link,
- Then the link should direct me to the Yassir for Business platform.
- Scenario 4: Redirecting to Home Dashboard
- Given that I am logged in via the magic link,
- When I am redirected to the platform,
- Then I should be directed to the Home Dashboard.
- Scenario 5: Redirecting to the Last Step of Onboarding
- Given that I am in the process of onboarding,
- When I log in via the magic link, And I have not completed the onboarding process,
- Then the link should direct me to the last step of the onboarding process where I left off.
- Scenario 6: Expiration on the link after usage, or within 48 hours
- Given that I have logged in with a magic link
- When I log in via the magic link, or I didn’t use it for 48 hours
- Then I cannot reuse the link to log in again
- Scenario 7: If we tried to request log in with the magic link a couple of times
- Given that I requested this link more than one time
- When I receive the second link on the email
- Then the link on the previous email that was sent earlier we need to make sure it’s expired

---

### CMB-13303: B2B: Signup Page Redesign 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-20

**Description:**
As a user accessing the main page of the B2B platform,
I want to easily locate essential login and signup options,

**Acceptance Criteria:**
- Scenario 1: Logging with Email
- Given I am on the main login page  of the B2B platform,
- When I Log in with Email
- Then I should be directed to another tab where I can add my password, and I need to find a clear button for forgetting my password
- Scenario 2: Log in with Google
- Given I am on the main login page  of the B2B platform,
- When I Log in with Google
- Then I should be directed to the home dashboard directly
- Scenario 3: Sign up with Email
- Given I am on the main signup page  of the B2B platform,
- When I sign with an Email
- Then I should receive a link in my inbox as a magic link, to set up my password, and verify my phone number
- Scenario 4: Sign up with Google
- Given I am on the main signup page  of the B2B platform,
- When I sign up with Google
- Then I should be directed to verify the phone number screen
- Scenario 5: Forget Password Flow
- Given I am on the main login page  of the B2B platform,
- When I click on forget the password, I receive the link in my email
- Then I should set the password to the new designs page
- Scenario 6: Company Creation Screen
- Given I have signed up
- When I sign up with Google or Email and verify my phone number
- Then I should be directed to the Company creation screen that needs to be in the new designs
- Scenario 7: Mobile Responsive
- Given I have moved to the screen of login from the mobile
- When I check the login page
- Then I should find the pages responsive to the screen size
- Note Google Analytics Events: Should remain as it’s for all fields across different pages
- Note We need to use the feature flag, so that we can alternate between the current page design and the new designs

---

### CMB-12474: Business Invited Rider recevies invitation via link 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-02-14

**Description:**
As a Business Rider who has received an invitation link, I want to seamlessly complete my registration process to join a specific business.

**Acceptance Criteria:**
- Scenario 1: Accessing Registration Screen
- Given: I am a Business Rider who has received an invitation link.
- When: I click on the invitation link.
- Then: I should be directed to a registration screen where I can enter my email address.
- Scenario 2: Email Verification
- Given: I have entered my email address on the registration screen.
- When: I submit my email address.
- Then:
- If the email address is already associated with another business:
- I should receive a message informing me that I'm already registered with another business.
- I will not proceed with registration and will be directed to log in with my existing credentials.
- If the email address is not associated with any business:
- An email should be sent to the provided email address with a link to complete the registration process.
- I should receive a message informing me that an email has been sent to complete the registration process.
- Scenario 3: Completing Registration
- Given: I have received the registration email.
- When: I click on the registration link provided in the email.
- Then: I should be directed to a registration page where I can enter my phone number and complete the registration process.
- Scenario 4: Phone Number Verification
- Given: I am on the registration page to complete my registration.
- When: I enter my phone number and submit it.
- Then: My phone number should be verified, and I should be successfully registered as a Business Rider for the specific business.
- Scenario 5: Joining Multiple Businesses
- Given: I have completed registration for one business.
- When: I want to join another business later on.
- Then: The system should allow me to repeat the registration process using the same email address, and I should be able to join multiple businesses using the same account.

---

### CMB-15825: Login Page

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-07-02

**Description:**
Scenario 1: Login Page

---

### CMB-13174: Registration Page 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-15

**Description:**
As a rider, I should be able to register with Yassir via web app so that I can book the rides hassle free post registration

---

### CMB-11697: Map Search Field 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-01-11

**Description:**
As a Business Account Manager (BAM) or Business Admin or Program MODERATOR using the Yassir platform, I want the ability to easily find and select specific locations when adding pickup and destination points, whether it's during trip booking, program editing, or onboarding.

**Acceptance Criteria:**
- Scenario 1: Location Search and Pin Adjustment During Trip Booking
- Given: I am a BAM or Business Admin booking a trip.
- When: I need to add pickup and destination locations on the booking screen.
- Then: I should see a search bar within the map pop-up.
- And: I can enter text information related to the desired locations.
- And: Upon pressing "Enter" or a similar action, the map's pin should move to the specified location.
- And: I should have the ability to adjust the pin's placement on the map if needed.
- Scenario 2: Location Search and Pin Adjustment During Program Editing
- Given: I am a BAM or Business Admin editing a program.
- When: I am in the process of adding locations for the program.
- Then: I should see a search bar within the map pop-up.
- And: I can enter text information related to the desired locations.
- And: Upon pressing "Enter" or a similar action, the map's pin should move to the specified location.
- And: I should have the ability to fine-tune the pin's placement on the map if necessary.
- Scenario 3: Location Search and Pin Adjustment During Onboarding
- Given: I am a BAM or Business Admin in the onboarding process.
- When: I open the map pop-up to set specific locations.
- Then: I should see a search bar within the map interface.
- And: I can enter text information of the desired locations.
- And: Upon pressing "Enter" or a similar action, the map's pin should be adjusted to the specified location.
- And: I should be able to manually adjust the pin's placement on the map as needed.

---

### CMB-14926: Re-invite All Users of a Company In Bulk

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-05-26

**Description:**
As an admin, I want to send a bulk re-invitation from the adminPannel, to all users of a company whose status is pending, so that they can complete their onboarding process.

**Acceptance Criteria:**
- User selection
- Given there are users with a status "pending" in the selected company
- When the admin initiates the 'Re-invite All' process,
- Then only users with a status "pending" are selected for re-invitation,
- And active users are excluded from the process.
- Initiating Re-Invitation:
- Given the admin has selected a company,
- When the admin navigates to the “user management” section then, clicks the “Re-Invite All” button,
- Then the system starts the bulk re-invitation process for all pending users.
- And add a limitation of 10 mins
- Confirmation and Logging:
- Given the re-invitation emails have been sent,
- When the process completes,
- Then the system sends a confirmation email to the admin who performed the re-invitation in bulk action,
- And the system logs the re-invitation activity in the transactions section of the admin panel.
- Invitation Link Expiration:
- Given a user receives a re-invitation email,
- When the user does not complete their onboarding within 1 week,
- Then the re-invitation link will be deactivated.

---

### CMB-14927: Search Companies by Rider's Phone Number/Email Address

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-05-26

**Description:**
As an admin, I want to search for companies associated with a rider by entering their phone number, so that I can efficiently manage rider’s company.

**Acceptance Criteria:**
- Search Bar Functionality: dropdown to specify if the search id done by phone/email/company
- Given the admin is on the ‘Businesses’ page,
- When the admin views the search bar,
- Then the search bar should be self-explanatory,
- And it should indicate that the searche can be performed by both company name and rider phone number.
- Search by Phone Number:
- Given the admin inputs a rider's phone number or email address into the search bar,
- When the admin initiates the search,
- Then the system should validate the phone number and email is correct (country code and full phone number), and search for companies associated with the rider's phone number.
- Multiple Company Affiliations:
- Given the rider belongs to multiple companies,
- When the search is completed,
- Then the system should display a list of all companies that the rider belongs to.
- No Company Affiliation:
- Given the rider's phone number does not belong to any company,
- When the search is completed,
- Then the system should display a message informing the admin that the rider does not belong to any company.

---

### CMB-19892: [Website] - Send OTP on the login/sign up screen only for specific countries 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-20

**Description:**
On the B2C WebApp, we will send OTP after the user puts his phone number to login or sign up only for specific countries listed

---

## Consolidated Acceptance Criteria

- Scenario 01 : Seamless access from B2B Market to Ride-Hailing
- As a B2B Market user
- When I am logged into the B2B Market and switch to the ride-hailing platform
- Then I should be authenticated automatically using the same session
- Scenario 02 : Session validity across platforms
- As a B2B user
- When my session expires on one platform
- Then my session should expire on the other platform as well, requiring re-authentication
- Scenario 03: Clear profile switching entry point
- When I am logged into either platform
- Then I should see a clear UI element allowing me to switch between Ride-Hailing and B2B Market
- Scenario 04 : Auto-create B2B Market account from Ride-Hailing signup
- As a new B2B ride-hailing user in Algeria
- When I successfully create an account on the ride-hailing web app
- Then a corresponding B2B Market account should be automatically created for me
- Scenario 05 : Migration of existing Algerian B2B Ride-Hailing users
- As a an existing B2B ride-hailing user in Algeria
- When the integration is launched
- Then a B2B Market profile should be created for me automatically
- Scenario 06 : Role-based permissions preserved across platforms
- As a B2B user with a specific role (BAM, BA, Program Moderator)
- When I switch between Ride-Hailing and B2B Market
- Then my permissions and access level should be consistent with my assigned role
- Scenario 07 : Inactive ride-hailing account access control
- As a B2B user with an inactive ride-hailing account
- When I attempt to access the B2B Market
- Then my access should follow the defined business rules (e.g., restricted or blocked)
- (Exact behavior to be finalized as part of the discussion.)
- Scenario 08 : Market-based access limitation
- As a B2B ride-hailing user outside Algeria or A Program Moderator on ride hailing services webApp
- Then I should not be able to see the switching profile UI
- Note : Following events should be added on this notion page
- Event Name
- Scenario 1: Accessing Tutorial Video
- Given that I am a BAM navigating through the program setup process,
- When I reach the screen for selecting a program template or creating a custom program,
- Then I should find a prominently displayed option to watch a quick tutorial video.
- Scenario 2: Understanding Program Options
- Given that, I click on the tutorial video option,
- When the video starts playing,
- Then I should find a screen overlay where the video is played, without having a call to action to go to the section
- Scenario 3: The video disappears
- Given that, I click on Expand the program
- When the program settings are shown
- Then the video player is hidden
- Note we need to set Google Analytics events for clicking on the videos
- Note we need to set a feature flag for the videos
- Scenario 1: Display Tooltips on WebApp
- Given the user logs in to the webApp on a desktop device for the first time,
- When the session starts,
- Then a sequence of tooltips should appear starting from Profile Setup and continue through:
- Inviting Users
- Booking Trips
- Topping Up Budget
- Creating Groups
- Creating Programs
- Contacting Support
- Scenario 2: Disable Tooltips After Repeated Dismissals
- Given the user closes a tooltip using the “X” button,
- When this dismissal happens three times across sessions,
- Then tooltips should no longer be displayed for that user.
- Scenario 3: Disable Button Clicks During Tooltip Display
- Given the tooltip sequence is active,
- When tooltips are being shown,
- Then all other button interactions on the page should be disabled until the sequence ends or is dismissed.
- Scenario 4: Tooltip Back Navigation
- Given the user is viewing a tooltip in the sequence (e.g., step 2 of 6),
- When they click the “Back” button,
- Then they should return to the previous tooltip and the step counter should update correctly (e.g., 1/6).
- Scenario 5: Do Not Show Tooltips on Mobile Devices
- Given the user logs in using a mobile device,
- When the app detects the device type (e.g., via user agent),
- Then the tooltip sequence should be skipped entirely.
- Event_name
- Given I am a Yassir business user
- When I navigate to the members tab on the webapp
- Then I can invite new users either by email or phone number
- When I click on “Phone number” section
- Then I can select the user I want to invite phone number
- When I click on send invite
- Then the invitation is send to the user
- We can verify the account phone number
- We can merge his account with Yassir Go Account, or in case he doesn't have an account create him an account and merge it with the business account
- Scenario 1: Input Detection for Login
- Given: I am on the login screen of the Yassir for Business platform.
- When: I enter my email or phone number in the input field, based on my choice in the tabs at the top
- Then: The system should detect whether the input is an email or phone number.
- And Then: The system should direct me to the next screen where I can proceed with one of the log in options (OTP, as other login options: magic link, or password).
- Scenario 2: Log in with OTP Message
- Given: I have entered my phone number on the login screen.
- When: I select the "Login with OTP" option,
- Then: The system should send an OTP message to my registered phone number.
- And When: I enter the correct OTP,
- Then: I should be logged into my account successfully.
- And When: I enter an incorrect OTP,
- Then: The system should display an error message and allow me to request a new OTP.
- Scenario 3: Log in with Magic Link
- Given: I have entered my email or phone number on the login screen.
- When: I select the "Login with Magic Link" option,
- Then: The system should send a magic link to my registered email, also the pop up should collapse and I should get a successful message
- And When: I click on the magic link,
- Then: I should be redirected to my account's home dashboard, logged in successfully.
- Scenario 4: Login with Password
- When: I select the "Login with Password" option,
- Then: The system should display a password input field.
- And When: I enter the correct password,
- And When: I enter an incorrect password,
- Then: The system should display an error message and allow me to retry.
- Scenario 5: Handling Invalid Inputs
- Given: I am on the login screen.
- When: I enter an invalid email or phone number format,
- Then: The system should display an error message indicating that the input is invalid and prompt me to correct it.
- Scenario 6: Remember Me Option (Optional)
- When: I select the "Remember Me" checkbox before logging in,
- Then: The system should remember my credentials for future logins (unless I log out).
- Scenario 7: Log in for unverified Phone number
- Given: I am on the login screen with the phone number
- When: I enter my unverified phone number
- Then: The system should send me an error message informing me that the phone number is unverified
- Scenario 1: Choosing whatsaap authentification
- Given I am on the Yassir webapp
- When I  enter my phone number to login into my yassir account
- And I click “Continue”
- Then a pop-up message appears
- If I click on “Whatsaap”
- Then I should receive my 4 digits OTP on my Whatsapp messages
- If I click on “SMS message”
- Then I should receive my 4 digits OTP on my SMS messages
- Scenario 2: OTP confirmation
- Given I click on continue
- And I entered the correct OTP
- Then a confirmation message should be displayed: “The verification was successful.”
- Scenario 3: OTP error
- And I entered incorrect OTP
- Then the OTP turns red and an errors message is displayed: “The code you entered is invalid. Please try again”
- Scenario: Service Availability and Response (Logged-in User)
- Given the YA website has sent the user’s location and destination,
- When the B2C web app processes the request,
- Then if the user is logged in, it should check service availability and respond with ETA and price, if unavailable should display an error message indicating that the service is not available
- Scenario: Service Availability and Response (Logged-out User)
- Then if the user is logged out, it should first redirect them to the authentication portal,
- And once logged in, the B2C web app should check service availability and respond with ETA and price, if unavailable should display an error message indicating that the service is not available
- The Prepaid option should be chosen by default
- The business account manager can choose the post-paid plan, and switch between the two choices on this screen
- When Bam Clicks on Book a meeting, the value of the plan he chose must be recorded and reflected on his data, on the Admin panel enterprise details page
- Before continuing to the next screen user must book a meeting
- if BAM didn't book a meeting he should remain on this step
- Bam can get back to the previous step by clicking on the back button
- BAM can't skip this step
- BAM should get back to the onboarding screen when is done with booking the meeting
- Can verify the business email account
- The web app should display a list of Business Riders, including their status [Pending - Active - Expired].
- The invitation status of a Business Rider should be updated to "Expired" when their invitation link expires.
- The Business Account Manager should be able to view and manage the users' invitation tab.
- The users' invitation tab should provide an option to resend an invitation to a Business Rider with an expired invitation.
- When the Business Account Manager resends an invitation, the invitation status of the Business Rider should be updated to "Pending".
- The web app should display a confirmation message when an invitation has been successfully sent.
- Scenario 1: Viewing expired Business Rider invitations
- Given: I am a Business Account Manager of the Yassir Go for B2B web app
- When: I navigate to the Business Riders list (Users List)
- Then: I should see the invitation status of each Business Rider
- And: If a Business Rider's invitation link has expired, their status should be displayed as "Expired"
- Scenario 2: Resending an invitation to an expired Business Rider
- Given: I am a Business Account Manager viewing the users' invitation tab
- When: I select a Business Rider with an expired invitation
- And: I reinvite him from the invitation screen
- Then: The invitation status of the selected Business Rider should be updated to "Pending"
- And: The web app should display a confirmation message, indicating that the invitation has been successfully resent
- Email Must Contain the:
- BAM first name
- Scenarios:
- Given: A business account manager who has finished the onboarding phase
- When: the OPs Manager Activate the enterprise account again
- Then:  I need to get an email, informing me about the activation of my account
- Given: A business account manager who has been de-activated for one of the de-activation reasons
- Email Template
- Dear [First Name],
- I'm pleased to inform you that your business account with us is now reactivated and fully functional.
- Please let us know if you encounter any issues while using our platform, and we'll be happy to assist you.
- Thank you for your patience and cooperation during this process.
- Best regards,
- Cher/Chère [Prénom],
- Nous avons le plaisir de vous informer que votre compte professionnel chez nous a été réactivé et est entièrement fonctionnel.
- N'hésitez pas à nous informer si vous rencontrez des problèmes lors de l'utilisation de notre plateforme et nous serons heureux de vous aider.
- Nous vous remercions de votre patience et de votre coopération pendant ce processus.
- Cordialement,
- Company Admin needs to be updated about how many Business Riders have joined the program
- The user needs to be able to change:
- Password
- For Changing Password we need to ask the user to enter his old password and to confirm on the new password
- The new password, must contain at least 8 digits, contains a charcter, a number, and a sympol
- to change:
- First Name
- Last Name
- Job Title
- Company Name
- Industry
- Company Size
- This data can’t be changed or saved unless the user would submit and confirm on submitting
- Business Email
- Phone Number
- Name
- For changing email address, we need to verify the new email the user entered
- The Admin can access the enterprise details page for a specific business.
- The Admin can view a list of all trips made by the business.
- The detailed trip view should display relevant trip information, such as:
- Trip ID,
- Rider Name, and Email
- trip time, dates, (Sortable)
- pickup,
- destination,
- Rider Email,
- trip Cost.
- Is Trip Refunded or not
- Amount refunded
- How Much of the Budget is deducted
- Trips Status:
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
- RIDER_CANCELED it will be written (Canceled_RD)
- NO_DRIVER_AVAILABLE (Canceled NDA)
- DRIVER_COMING_CANCELED (Canceled DCC)
- DRIVER_COMING_RIDER_CANCELED (Canceled DCRC)
- DRIVER_ARRIVED_CANCELED (Canceled DC)
- DRIVER_ARRIVED_RIDER_CANCELED (Canceled DRC)
- Last made trip must be in the first row of the table by default
- Given-When-Then Scenarios:
- Scenario 1: Admin accesses the enterprise details page successfully
- Given: Admin is logged into the Admin Panel
- When: Admin navigates to the enterprise details page for a specific business
- Then: The enterprise details page is displayed and he can find the trips list
- Scenario 2: Admin views the list of trips for a business
- Given: Admin is on the enterprise details page
- When: Admin looks for the trip list
- Then: A list of trips made by the business is displayed with the following information:
- RIDER_CANCELED (Canceled RC)
- DRIVER_COMING_RIDER_CANCELED  (Canceled DCRC)
- DRIVER_ARRIVED_CANCELED  (Canceled DC)
- Admin will be able to log in with Google Account
- If an Admin doesn't have access to any countries, he will not see any data. but will find the person in charge to contact him
- Admin Must see only data in his market only unless permitted otherwise
- Admin needs to be able to choose the country from a drop-down list, and he will be able to see the permitted countries only
- The user will be directed to the dashboard once he logs in
- If the user didn’t complete his program set up and the group set up he needs to be directed to that page to complete the different program parameters
- Admin Must see only data in his market only, unless permitted other wise
- The onboarding page and the whole B2B web app should display a language selection button at the top of the page.
- The language selection button should provide options for English, and French.
- When a Business Account Manager selects a language preference, the content should be immediately displayed in the chosen language.
- The web app should remember the selected language preference throughout the onboarding process.
- The language preference should be saved for future sessions when the Business Account Manager logs in to the web app.
- The BAM’s preferences remain but on the current browser. if you log out, close the tab, and then open it again in the same browser, you will get the user’s saved language'
- The Language must be French by default.
- Scenario 1: Viewing the language selection button
- Given: I am a Business Account Manager going through the onboarding process, and the whole web app for the Yassir Go for B2B web app
- When: I view the onboarding page, Login Page, and Dashboard
- Then: I should see a language selection button at the top of the page
- Scenario 2: Selecting a language preference
- Given: I am a Business Account Manager viewing the language selection button
- When: I click on the language selection button
- Then: I should see options for English, and French
- Scenario 3: Changing the language
- Given: I am a Business Account Manager who has chosen a language preference from the language selection button
- When: I select a different language
- Then: The content should immediately update to display in the newly selected language
- Scenario 4: Retaining the language preference in future sessions
- Given: I am a Business Account Manager who has previously selected a language preference during the onboarding process
- When: I log in to the Yassir Go for B2B web app in future sessions
- Then: My language preference should be retained, and the web app should display content in my selected language
- The new tab should be named "Company Legal Details" and should be easily visible on the enterprise details page.
- All fields are empty by default, and they are optional
- We can send the invoice even if all or some fields are empty
- The tab should include the following fields, based on each country:
- Morocco Fields:
- Legal Company Name
- Legal Adress:
- Building Number/ Apt.
- First Line of Address
- Second Line of Adress
- City (Drop-Down List)
- Zip/ Postal Code (Numerical)
- ICE: Common Compay identifier
- IF: Tax Identification
- RC: Commercial Register
- TTC: is the pre-tax price + tax
- payment period (Monthly, Quarterly, Yearly):
- Monthly: if a business is created on 22, May. then the invoice will be sent will cover the period from 1, May → 31, May (By Default)
- Quarterly if a business is created on 22, May. then the invoice will be sent will cover the period from 1, Apr→ 30, June
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 2023
- The Tab must include a toggle button for applying taxes on this enterprise or not. it must be enabled by default.
- Taxes amount = 20%
- Algeria Fields:
- Legal Company Adress
- Raison social
- NIF:
- NIS:
- Yearly if a business is created on 22, May 2023. then the invoice will be sent will cover the period from 1, Jan, 2023→ 31, Dec 202
- Taxes amount = 19%
- Senegal Field:
- Legal Adress
- ID de la société
- NINEA
- Taxes amount = 18%
- Tunisia:
- Legal Company name
- Legal billing address
- tax number
- payment terms (transfer, cheque)
- All Fields except the Date and Zip Code filed must accept numbers and letters, for example, the address: 15, Steet Name,
- The user should be able to add or edit the information in each field.
- The user should be able to save and update the information in the fields.
- Scenario 1: Viewing and Entering Legal Details
- Given the operations manager is on the enterprise details page,
- When they navigate to the "Company Legal Details" tab,
- Then they should see the fields specific to each country and can enter or edit the information, for that enterprise
- Scenario 2: Toggling Taxes on/off
- Given the operations manager is on the "Company Legal Details" tab,
- When they toggle the taxes button to enable or disable tax application,
- Then the system should save the selected preference and update it accordingly. and it won’t appear on the invoice as added value
- Scenario 3: Selecting Payment Period
- When they select the payment period for the enterprise,(Monthly, Quarterly, Yearly)
- Then the system should calculate the trip costs been done in the duration and display the invoice coverage period based on the selected period and business creation date.
- And Duration is calculated this way
- Scenario 4: Saving and Updating Information
- When they save or update the information entered in the fields,
- Then the system should store the data and display it for that enterprise and overwrite any previous data.
- Scenario 5: Empty Fields and Invoice Link
- When they provide the invoice link for the paid amount, even if some fields are empty,
- Then the system should save the link and allow the invoice to be sent to the BAM, and all of the legal information will be empty according to its initial status
- Scenario 8: Cross-Country Legal Details
- Given the operations manager is managing legal details for multiple countries,
- When they switch between countries and choose different enterprises
- Then the system should dynamically display the corresponding legal fields for each country, ensuring accurate and country-specific information.
- Scenario 9: Zip Code Validation
- Given the operations manager is entering a zip code
- When they provide an invalid format or value, other than numerical value
- Then the system should validate the input and display an error message, prompting the user to enter the correct format or value.
- Scenario 1: Choosing the "Commuting to Office" Program
- Given I am a BAM in the onboarding process,
- When I reach the program setup step,
- Then I should find the option to select the "Commuting to Office" program.
- Scenario 2: Creating the Program
- Given I choose the "Commuting to Office" program,
- When I provide the office location (either by searching or using a map pop-up),
- Then the program should be created with the following parameters:
- Trip type: Round trips between the office and any location.
- Days allowed: Working days only.
- Hours allowed: Working hours only.
- Spending allowance: Unlimited.
- Number of trips allowed per user: 2 trips.
- All available services available for this company are enabled.
- Price is hidden for users by default.
- Trip permission is auto-approval by default
- Scenario 3: Direct Access to the Web App
- Given I choose the "Commuting to Office" program and it's created successfully,
- When I complete the onboarding process,
- Then I should be directly directed to the Web App main screen, ready to use the program.
- Scenario 4: Activation Step
- Then if activation is required for the program, I should be guided through the activation steps to make it operational.
- Scenario 1: Choosing a Program Template
- Then I should see an option to choose a program template.
- Scenario 2: Selecting a Program Template
- Given I choose to select a program template,
- When I click on the template of my choice,
- Then a pre-defined program with default settings should be created, and I should proceed to the next onboarding steps. going to the dashboard, or waiting for activation
- Scenario 3: Creating a Custom Program
- Given I choose to create a custom program,
- When I continue with the onboarding process,
- Then I should go through the ordinary program creation flow where I can specify program details, including spending allowances, services, and other settings.
- Scenario 4: Informing About Editability
- Given I chose a program template,
- When the program is created from the template,
- Then I should receive a pop-up message to confirm my choice and inform me that I can edit this later on
- Scenario 5: Seeing program details
- Given I click on a program template see the details button
- When the list would expand,
- Then I should be able to see this program's parameters
- Scenario 6: Seeing program details
- Given I choose a program template
- When the Program is created
- Then the program name will be named after the template
- Scenario 7: Choosing the "Recommended" Program
- Then I should find the option to select the "Recommended" program.
- Scenario 8: Creating the "Premium" Program
- Given I choose the "Premium" program,
- Trip type: From any location to any location.
- Days allowed: Any day.
- Hours allowed: Any time.
- Number of trips allowed per user: Unlimited.
- All available services are enabled _the services allowed for this company_.
- Price visible for users by default.
- The Users will have auto-approval
- Scenario 9: Completing Onboarding
- Given I choose the "Recommended" program and it's created successfully,
- Then I should be ready to use the program with maximum flexibility for Riders, allowing them to request trips without limitations.
- Scenario 1: Logging In with a Registered Google Account
- Given I am on the login screen of the B2B web application,
- When I choose the "Log in with Google" option, And I select my Google account,
- Then the system should check if my email is registered in the B2B system. If my email is registered, I should be automatically logged in to my B2B account without being required to enter my email and password.
- Scenario 2: Sign Up with Google Account
- Given I am on the login screen and my Google-linked email is not registered in the B2B system,
- When I choose the "Log in with Google" option, And I select my Google account, If my email isn’t registered,
- Then the system should guide me to the signup screen  of google to create an account So I Can verify my phone number and complete the necessary signup details,
- Scenario 3: Sign Up with Email, and Password After Signing up with Google
- Given I am on the login screen and my Google-linked email is registered
- When I choose the "Log in with Email and Password
- Then I get an error telling me to login with Google
- Phone Number Entry Screen:
- When I reach the screen for entering my phone number during registration, I should see a field for the phone number input.
- Default Flag Selection:
- Next to the phone number input field, there should be a flag icon representing the country.
- The flag icon displayed should correspond to the country where I am currently located.
- If I am located in Tunisia, the Tunisian flag should be pre-selected by default.
- If I am located in Senegal, the Senegalese flag should be pre-selected by default.
- If I am located in Algeria, the Algerian flag should be pre-selected by default.
- If I am located in Morocco, the Moroccan flag should be pre-selected by default.
- Manual Flag Change (Optional):
- While the default flag should be based on my current location, I should have the option to manually change the flag if I intend to register with a phone number from a different country.
- Personal Information Entry:
- As a BAM, when I access the registration page, I should see a section for entering my personal details.
- The personal details section should include fields for my name and job title.
- Business-Related Questions:
- Below the personal details section, there should be a set of questions related to my business.
- These questions should include the industry I work in and the size of my company.
- The industry field should allow me to select from a list of industry options.
- The company size field should allow me to select from a list of company size ranges.
- Company Headquarters City Selection:
- After providing my personal information and answering business-related questions, I should see a field for entering my company's headquarters city.
- This field should be a drop-down list.
- The options in the drop-down list should be based on the country I entered when providing my phone number.
- Validation and Submission:
- The system should validate that all required fields are filled correctly.
- If any required field is missing or contains invalid data, the system should display clear error messages.
- Once all the required information is provided correctly, I should be able to submit my registration.
- Given that I am on the login screen of the B2B web application, when I navigate to the language switch, then I should find an option to switch to the Arabic language.
- Given that I am on the login screen and I choose the Arabic language option, when I select it, then the entire interface layout should transform to RTL, including text alignment, button placements, and overall design.
- Given that I am on the login screen and I choose the Arabic language option, when I view any displayed text, then it should be in Arabic characters and properly aligned from right to left.
- Given that I am on the login screen and I have switched to Arabic, when I enter text (e.g., username, password) into input fields, then the input text direction should be from left to right as it’s.
- Given that I am on the login screen in Arabic mode, when I click on any action buttons (e.g., "Login," "Forgot Password"), then the button labels should be displayed in Arabic text.
- Scenario 1: Switching to Arabic Language
- Given: I am on the login screen of the B2B web application
- And: I navigate to the language switch button
- When: I choose the Arabic language option
- Then: The interface layout transforms to RTL and all displayed text switches to Arabic.
- Scenario 2: Viewing Arabic Text Display
- Given: I am on the login screen in Arabic mode
- When: I view any displayed text, such as headings or labels
- Then: The text should be in Arabic characters and aligned from right to left.
- Scenario 3: Entering Input Text
- When: I enter text (e.g., username, password) into input fields
- Then: The input text direction should be from left to right.
- Scenario 4: Interacting with Action Buttons
- When: I click on action buttons (e.g., "Login," "Forgot Password")
- Then: The button labels should be displayed in Arabic text.
- Given I am a BAM accessing the B2B web application from my mobile device,
- When I open the signup, login, or onboarding screens,
- Then the layout and design of these screens should adapt seamlessly to my mobile screen size without any visual glitches.
- Scenario 1: Accessing Signup Screen on Mobile
- When I click on the "Signup" option,
- Then the signup screen should load and display correctly on my mobile screen, with all elements appropriately sized and positioned.
- Scenario 2: Accessing Login Screen on Mobile
- When I click on the "Login" option,
- Then the login screen should load and display correctly on my mobile screen, ensuring that input fields, buttons, and other interface elements are easily accessible and functional.
- Scenario 3: Accessing Onboarding Screen on Mobile
- When I proceed with the onboarding process,
- Then the onboarding screens should be responsive and provide a smooth experience on my mobile, allowing me to input information and navigate through the steps without encountering any technical issues or layout problems.
- Scenario 4: Responsiveness Validation
- Given I am on the signup, login, or onboarding screens from my mobile,
- When I resize my mobile screen or switch between portrait and landscape modes,
- Then the screens should continue to adapt and maintain their responsiveness, ensuring a consistent and glitch-free user experience.
- The platform should provide an option to request the resending of an OTP message during the registration process.
- The option to request a new OTP should be available if the original OTP message is not received or has expired.  that can be activated only after 60 secs
- Clicking the "Resend OTP" option should trigger the system to send a new OTP message to the registered phone number.
- The new OTP should be valid and functional for the registration process.
- Scenario 1: Requesting Resend of OTP (BAM)
- Given: I am a BAM in the registration process, And: I haven't received the OTP message on my registered phone number.
- When: I click on the "Resend OTP" option.  that can be activated only after 60 secs
- Then: The system should initiate the sending of a new OTP message to my phone number.
- Scenario 2: Requesting Resend of OTP (Invited Business Rider)
- Given: I am an invited Business Rider in the registration process, And: I haven't received the OTP message on my registered phone number.
- When: I click on the "Resend OTP" option. that can be activated only after 60 seconds
- Scenario 3: New OTP Received (BAM)
- Given: I am a BAM who requested the resend of OTP.
- When: I check my registered phone number for the OTP.
- Then: I should receive a new OTP message.
- Scenario 4: New OTP Received (Invited Business Rider)
- Given: I am an invited Business Rider who requested the resend of OTP.
- Scenario 5: Using the New OTP (BAM)
- Given: I am a BAM who received a new OTP message.
- When: I enter the new OTP during the registration process.
- Then: The system should accept the new OTP and allow me to proceed with the registration.
- Scenario 6: Using the New OTP (Invited Business Rider)
- Given: I am an invited Business Rider who received a new OTP message.
- Scenario 7: Expiry of Resent OTP
- Given: I have requested a resend of OTP.
- And: The resent OTP message has expired (usually after a certain time period).
- When: I attempt to use the expired OTP.
- Then: The system should display an error message indicating that the OTP has expired, and I should request a new one by clicking "Resend OTP."
- Onboarding Process:
- The BAM initiates the onboarding process by providing the necessary business information and preferences.
- Automatic Account Activation:
- Upon successful completion of the onboarding process, the BAM's business account is automatically activated without the need for manual approval from Ops Managers.
- Scenario 1: Smooth Onboarding Experience
- Given: The BAM begins the onboarding process.
- When: The BAM completes the required steps of the onboarding process successfully.
- Then: The BAM's business account is instantly activated, and they gain immediate access to the platform's features.
- Scenario 2: No Manual Activation Required
- Given: The BAM finishes the onboarding process.
- When: The BAM's business account details are submitted and verified.
- Then: The BAM's account status changes to "Activated" automatically without any additional steps or manual approval from Ops Managers.
- During the onboarding process, the BAM enters the necessary information and preferences for their default program
- Dashboard Access:
- Upon completing the onboarding process, the BAM is directed to the Dashboard immediately.
- User Invitation Flexibility:
- The BAM is not obligated to invite additional users (Business Riders) as part of the onboarding process.
- Scenario 1: Seamless Onboarding to Dashboard
- Given: The BAM is going through the onboarding process.
- When: The BAM completes the required steps of the onboarding process.
- Then: The BAM is immediately granted access to the Dashboard without the need to invite additional users.
- Scenario 2: Invitation at a Later Time
- Given: The BAM has access to the Dashboard following onboarding.
- When: The BAM decides to invite other users to join and assist in managing the business at a later time.
- Then: The BAM can initiate user invitations independently, choosing when to invite additional users to the platform.
- Onboarding Registration:
- When registering for a Yassir Business Account, the BAM is guided through the onboarding process.
- Default Payment Plan Selection:
- The BAM is not required to manually select a payment plan during the onboarding process.
- Automatic Prepaid Plan Assignment:
- By default, the BAM's payment plan is set as "Prepaid" without any action required on their part.
- Ops Manager's Ability to Modify:
- Ops Managers have the capability to access the BAM's account settings and make adjustments to the payment plan if needed.
- Scenario 1: Seamless Onboarding for BAM
- When: The BAM completes the registration steps without being prompted to choose a payment plan.
- Then: The BAM's default payment plan is automatically set as "Prepaid."
- Scenario 2: Ops Manager Modifies Payment Plan
- Given: The BAM's default payment plan is "Prepaid."
- When: An Ops Manager accesses the BAM's account settings and decides to change the payment plan to another option (e.g., "Postpaid").
- Then: The payment plan is updated to the Ops Manager's choice, and the BAM is billed accordingly based on the modified payment plan.
- Scenario 1: New Business Creation Notification
- Given I am a member of the product team,
- When a new business is created in the production environment,
- Then the Slack chatbot should automatically send a notification to our designated Slack channel.
- Scenario 2: Notification Content
- Given a new business is created and a notification is sent to the Slack channel,
- When I view the notification,
- Then it should include the following information about the new business:
- Business Name
- Email Address of the Business Account Manager (BAM)
- The country associated with the business
- Scenario 3: Real-time Notifications
- Given a new business is created,
- When the notification is sent to the Slack channel,
- Then it should be delivered in real time to ensure timely awareness of the new business activity.
- Scenario 1: Accessing the Company Filter
- Given: I am logged in as an Admin on the Admin Panel.
- When: I navigate to the section where a table of companies is displayed.
- Then: I should find a filter option labeled "City."
- Scenario 2: Filtering by City
- Given: I am viewing the table of companies.
- When: I select the "City" filter option.
- Then: I should see a dropdown or text input where I can enter or choose a city name.
- Scenario 3: Entering a City Name
- Given: I have access to the "City" filter.
- When: I enter the name of a city where one or more companies are located.
- Then: The table of companies should dynamically update to display only those companies that have the selected city in their information.
- Scenario 4: Clearing the Filter
- Given: I have applied a city filter.
- When: I wish to remove the filter and view all companies again.
- Then: There should be a clear option or an "All" choice in the city filter that restores the full list of companies.
- Scenario 5: Multiple Filters
- Given: I need to apply multiple filters for precise company selection.
- When: I have selected a city filter, and I want to further refine my search with other filters.
- Then: The system should allow me to combine city filters with other available filters, such as industry or company size.
- Scenario 6: Search Flexibility
- Given: I am entering a city name into the filter.
- When: I start typing the city name.
- Then: The system should provide suggestions or auto-complete options to help me quickly select the desired city.
- Scenario 1: Requesting Magic Link
- Given that I am a Business Account Manager, Program Manager, or Business Admin,
- When I attempt to log in to the Yassir for Business platform,
- And I choose the option to log in with a magic link,
- Then the system should prompt me to enter my registered email address.
- Scenario 2: Sending Magic Link
- Given that I have entered my registered email address,
- When I click on the "Send Magic Link" button,
- Then the system should send a magic link to my email address.
- Scenario 3: Accessing the Platform
- Given that I have received the magic link in my email,
- When I click on the magic link,
- Then the link should direct me to the Yassir for Business platform.
- Scenario 4: Redirecting to Home Dashboard
- Given that I am logged in via the magic link,
- When I am redirected to the platform,
- Then I should be directed to the Home Dashboard.
- Scenario 5: Redirecting to the Last Step of Onboarding
- Given that I am in the process of onboarding,
- When I log in via the magic link, And I have not completed the onboarding process,
- Then the link should direct me to the last step of the onboarding process where I left off.
- Scenario 6: Expiration on the link after usage, or within 48 hours
- Given that I have logged in with a magic link
- When I log in via the magic link, or I didn’t use it for 48 hours
- Then I cannot reuse the link to log in again
- Scenario 7: If we tried to request log in with the magic link a couple of times
- Given that I requested this link more than one time
- When I receive the second link on the email
- Then the link on the previous email that was sent earlier we need to make sure it’s expired
- Update the signup and login pages as per the desktop design
- Make choose company page responsive
- Scenario 1: Logging with Email
- Given I am on the main login page  of the B2B platform,
- When I Log in with Email
- Then I should be directed to another tab where I can add my password, and I need to find a clear button for forgetting my password
- Scenario 2: Log in with Google
- When I Log in with Google
- Then I should be directed to the home dashboard directly
- Scenario 3: Sign up with Email
- Given I am on the main signup page  of the B2B platform,
- When I sign with an Email
- Then I should receive a link in my inbox as a magic link, to set up my password, and verify my phone number
- Scenario 4: Sign up with Google
- When I sign up with Google
- Then I should be directed to verify the phone number screen
- Scenario 5: Forget Password Flow
- When I click on forget the password, I receive the link in my email
- Then I should set the password to the new designs page
- Scenario 6: Company Creation Screen
- Given I have signed up
- When I sign up with Google or Email and verify my phone number
- Then I should be directed to the Company creation screen that needs to be in the new designs
- Scenario 7: Mobile Responsive
- Given I have moved to the screen of login from the mobile
- When I check the login page
- Then I should find the pages responsive to the screen size
- Note Google Analytics Events: Should remain as it’s for all fields across different pages
- Note We need to use the feature flag, so that we can alternate between the current page design and the new designs
- Scenario 1: Accessing Registration Screen
- Given: I am a Business Rider who has received an invitation link.
- When: I click on the invitation link.
- Then: I should be directed to a registration screen where I can enter my email address.
- Scenario 2: Email Verification
- Given: I have entered my email address on the registration screen.
- When: I submit my email address.
- Then:
- If the email address is already associated with another business:
- I should receive a message informing me that I'm already registered with another business.
- I will not proceed with registration and will be directed to log in with my existing credentials.
- If the email address is not associated with any business:
- An email should be sent to the provided email address with a link to complete the registration process.
- I should receive a message informing me that an email has been sent to complete the registration process.
- Scenario 3: Completing Registration
- Given: I have received the registration email.
- When: I click on the registration link provided in the email.
- Then: I should be directed to a registration page where I can enter my phone number and complete the registration process.
- Scenario 4: Phone Number Verification
- Given: I am on the registration page to complete my registration.
- When: I enter my phone number and submit it.
- Then: My phone number should be verified, and I should be successfully registered as a Business Rider for the specific business.
- Scenario 5: Joining Multiple Businesses
- Given: I have completed registration for one business.
- When: I want to join another business later on.
- Then: The system should allow me to repeat the registration process using the same email address, and I should be able to join multiple businesses using the same account.
- Scenario 1: Location Search and Pin Adjustment During Trip Booking
- Given: I am a BAM or Business Admin booking a trip.
- When: I need to add pickup and destination locations on the booking screen.
- Then: I should see a search bar within the map pop-up.
- And: I can enter text information related to the desired locations.
- And: Upon pressing "Enter" or a similar action, the map's pin should move to the specified location.
- And: I should have the ability to adjust the pin's placement on the map if needed.
- Scenario 2: Location Search and Pin Adjustment During Program Editing
- Given: I am a BAM or Business Admin editing a program.
- When: I am in the process of adding locations for the program.
- And: I should have the ability to fine-tune the pin's placement on the map if necessary.
- Scenario 3: Location Search and Pin Adjustment During Onboarding
- Given: I am a BAM or Business Admin in the onboarding process.
- When: I open the map pop-up to set specific locations.
- Then: I should see a search bar within the map interface.
- And: I can enter text information of the desired locations.
- And: Upon pressing "Enter" or a similar action, the map's pin should be adjusted to the specified location.
- And: I should be able to manually adjust the pin's placement on the map as needed.
- User selection
- Given there are users with a status "pending" in the selected company
- When the admin initiates the 'Re-invite All' process,
- Then only users with a status "pending" are selected for re-invitation,
- And active users are excluded from the process.
- Initiating Re-Invitation:
- Given the admin has selected a company,
- When the admin navigates to the “user management” section then, clicks the “Re-Invite All” button,
- Then the system starts the bulk re-invitation process for all pending users.
- And add a limitation of 10 mins
- Confirmation and Logging:
- Given the re-invitation emails have been sent,
- When the process completes,
- Then the system sends a confirmation email to the admin who performed the re-invitation in bulk action,
- And the system logs the re-invitation activity in the transactions section of the admin panel.
- Invitation Link Expiration:
- Given a user receives a re-invitation email,
- When the user does not complete their onboarding within 1 week,
- Then the re-invitation link will be deactivated.
- Search Bar Functionality: dropdown to specify if the search id done by phone/email/company
- Given the admin is on the ‘Businesses’ page,
- When the admin views the search bar,
- Then the search bar should be self-explanatory,
- And it should indicate that the searche can be performed by both company name and rider phone number.
- Search by Phone Number:
- Given the admin inputs a rider's phone number or email address into the search bar,
- When the admin initiates the search,
- Then the system should validate the phone number and email is correct (country code and full phone number), and search for companies associated with the rider's phone number.
- Multiple Company Affiliations:
- Given the rider belongs to multiple companies,
- When the search is completed,
- Then the system should display a list of all companies that the rider belongs to.
- No Company Affiliation:
- Given the rider's phone number does not belong to any company,
- Then the system should display a message informing the admin that the rider does not belong to any company.

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-159: Dev - FE: Invitation by Email ~~ → Replaced by CMB-462
- ~~CMB-3231: Dev BE: Changing Password~~ → Replaced by CMB-3224
- ~~CMB-3230: Design: Changing Password~~ → Replaced by CMB-3224
- ~~CMB-3228: Design: Changing Personal Information~~ → Replaced by CMB-3223
- ~~CMB-414: Dev - FE: Login as a business Admin~~ → Replaced by CMB-2555
- ~~CMB-415: Dev - FE: BAM Verify Phone number with OTP~~ → Replaced by CMB-25562
- ~~CMB-277: Dev: Login as a business Admin~~ → Replaced by CMB-2555
- ~~CMB-2161: Admin Login~~ → Replaced by CMB-2555
- ~~CMB-297: Design: Email Verification~~ → Replaced by CMB-193
- ~~CMB-299: Design: Verify Phone number with OTP~~ → Replaced by CMB-194
- ~~CMB-301: Design: Login as a business Admin~~ → Replaced by CMB-2555
- ~~CMB-2667: Dev BE: Admin Login~~ → Replaced by CMB-2555
- ~~CMB-9244: Removing the Invitation Step ~~ → Replaced by CMB-9245
- ~~CMB-9243: Removing the Payment plan step ~~ → Replaced by CMB-9245
- ~~CMB-14538: Login With Phone Number~~ → Replaced by CMB-25562
- ~~CMB-12288: User Personal information - to limit the City dropdown~~ → Replaced by CMB-3223
- ~~CMB-13865: Videos on Setting up on Program Screen~~ → Replaced by CMB-19074
