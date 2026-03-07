---
id: "jira-b2b-portal-dashboard"
title: "B2B Portal — Dashboard"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","b2b-dashboard","b2b_webapp","beta-release","driver-app-android"]
last_synced: "2025-11-24T09:06:37.156Z"
ticket_count: 40
active_ticket_count: 37
---

# B2B Portal — Dashboard

> Auto-generated from 40 Jira tickets.
> Last synced: 2025-11-24T09:06:37.156Z
> Active features: 37
> Superseded: 3

## User Stories

### CMB-12596: CHROME - WEBAPP - STAGING: Add new company page reload leads back to the Dashboard

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-02-19

**Description:**
Steps to reproduce

**Acceptance Criteria:**
- Login as BAM;
- Click on profile icon;
- Click on switch companies
- Click on Add a new company button;
- Click on Browser's reload button

---

### CMB-20555: Website - Canceled ride pop up 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-12-10

**Description:**
As a rider, when my ride is canceled and I am either on the home page or on the"Ride History" / "Ride Details" pages, I should receive a popup notification informing me that my ride is canceled with a proper redirection for both scenarios.

**Acceptance Criteria:**
- Given I’m a website rider,
- When I’m on the “home" page and my ride has been canceled before the driver notifies arrival,
- Then I should see a "Ride Canceled" pop-up.
- When I click a button on the pop-up,
- Then I should be redirected to the Home screen again to begin a new ride request.
- Given I’m a website rider,
- When I’m on the "Ride Details" page and my ride has been canceled before the driver notifies arrival,
- Then I should see a "Ride Canceled" pop-up.
- And I should have the option to cancel ride or find another driver
- And the Found another driver button should automatically dispatch my ride again

---

### CMB-18711: Updating Trip List on Business Dashboard

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2024-10-16

**Description:**
As a Business Account Manager (BAM) or Business Admin,

**Acceptance Criteria:**
- Scenario 1: Removal of Groups and Programs Columns
- Given I am logged into the Yassir for Business platform as a BAM or Business Admin,
- When I navigate to the trip history screen,
- Then the "Groups" and "Programs" columns should no longer be visible.
- Scenario 2: Addition of "Trip Details" Button
- Given I am on the trip history screen,
- When I view the list of trips,
- Then I should find a "Trip Details" button next to each trip entry.
- Scenario 3: Viewing Detailed Trip Information
- Given I am on the trip history screen,
- When I click on the "Trip Details" button for a trip,
- Then I should be directed to a detailed trip information screen.
- Scenario 4: Detailed Trip Information Display
- Given I have accessed the trip details screen,
- When I view the trip details,
- Then I should be able to see the following information:
- Rider name
- Rider phone number
- Pickup and destination locations
- Routing details
- Trip status
- Driver name
- Driver phone number
- Car information (model, color, plate number)
- Trip cost
- Rider's associated group and program
- Scenario 5: Accessing and Exiting Trip Details Screen
- Given I am on the detailed trip information screen,
- When I finish reviewing the trip details,
- Then I should have an option to return to the main trip history screen.

---

### CMB-13168: Add Ride Booking entry point on YaWeb landing page

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-03-15

**Description:**
As a rider, I want to see ride booking option on Yassir’s main page so that I know Yassir allows booking rides via the portal.

**Acceptance Criteria:**
- If the user is logged in, he should be redirected to booking flow
- If the user is not logged in, he should be redirected to Login/Registration Flow

---

### CMB-4186: Activating and De-activating the Admins

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-03-16

**Description:**
As a Super Admin of the Yassir Go for B2B Dashboard, I want to be able to grant access to one or more countries for any admin from the list of admins, as well as activate or deactivate their accounts, so that I can efficiently manage admin permissions and their access to country-specific data.

**Acceptance Criteria:**
- The dashboard should display a list of admins.
- The Super Admin should have the ability to select one or more admins from the list.
- The Super Admin should have the option to grant access to one or more countries for the selected admin(s).
- The Super Admin should have the option to activate or deactivate the selected admin(s).
- When the Super Admin grants country access or modifies the admin status, the dashboard should display a confirmation message.
- The changes made by the Super Admin should be saved and applied to the selected admin(s) immediately.
- Scenarios:
- Scenario 1: Viewing the list of admins
- Given: I am a Super Admin of the Yassir Go for B2B Dashboard
- When: I navigate to the admin management section
- Then: I should see a list of admins
- Scenario 2: Selecting one or more admins
- Given: I am a Super Admin viewing the list of admins
- When: I select one or more admins from the list
- Then: The selected admin(s) should be highlighted, indicating that they are ready for permission or status modification
- Scenario 3: Granting country access to selected admin(s)
- Given: I am a Super Admin with one or more admins selected
- When: I grant access to one or more countries for the selected admin(s)
- And: I confirm the changes
- Then: The dashboard should display a confirmation message
- And: The selected admin(s) should have access to the specified countries
- Scenario 4: Activating or deactivating selected admin(s)
- Given: I am a Super Admin with one or more admins selected
- When: I choose to activate or deactivate the selected admin(s)
- And: I confirm the changes
- Then: The dashboard should display a confirmation message
- And: The selected admin(s) should have their status updated to active or inactive, as specified
- Scenario 5: Checking the updated admin access and status
- Given: I am a Super Admin who has granted country access or modified admin status
- When: I view the list of admins
- Then: The updated country access and status for the affected admin(s) should be reflected in the list

---

### CMB-3226: Dev BE: Forget Password

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-02-01

**Description:**
As a business account manager I need to be able to click on reset my password link, so that I can get an email where I do have a link that makes me create a new password, and overwrite my previous password, so that I can use the new password to log in the BAM Dashboard

**Acceptance Criteria:**
- BAM needs to confirm on created password
- Password must containt 8 charceters at least, consist of a one letter, one number and special charcter at least

---

### CMB-2556: Design: Activate Business

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-12-19

**Description:**
As an ops manager, I need to be able to activate and deactivate businesses, based on their payment status. so that the business account manager managing this account will not be able to access the Dashboard. and all business riders will not be able to use the service

**Acceptance Criteria:**
- OPs Manager can toggle business status, and provide a reason why the business is suspended:
- Didn't submit the legal papers
- Needs to adjust the budget
- They haven't been active
- There is some sort of abusing
- BAM needs to receive an email informing him that his account is inactive, and he needs to be informed why
- Email must contain a calneldy link to where the BAM can book a meeting, and contains an email of a conact point

---

### CMB-2247: Solving Trip Exporting 

**Status:** Done | **Priority:** P1 - High
**Created:** 2022-12-05

**Description:**
As a BAM I need to be able to export the finished trips of business riders from the existing dashboard in Algeria

---

### CMB-1837: Dev FE: Create Program on Dashboard 

**Status:** Done | **Priority:** No Priority
**Created:** 2022-11-17

---

### CMB-598: Dev - BE: Skipping and Program Activation

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-09-07

**Description:**
As a business account manager who chose the instant or pre-paid plan I need to be able to skip the step so that I can access the dashboard while it's not activated, and I need to see a hint with the remaining allowed days before losing access to the Dashboard, if I didn't add a top up, or add a payment method

**Acceptance Criteria:**
- Dashboard Activation means, that the business riders cannot use the B2B solution. unless it can be activated

---

### CMB-2166: Dev FE: Activate/ De-activate Business

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-11-30

**Description:**
As an ops manager, I need to be able to activate and deactivate businesses, based on their payment status. so that the business account manager managing this account will not be able to access the Dashboard. and all business riders will not be able to use the service

**Acceptance Criteria:**
- OPs Manager can toggle business status, and provide a reason why the business is suspended:
- Didn't submit the legal papers
- Needs to adjust the budget
- They haven't been active
- There is some sort of abusing
- BAM needs to receive an email informing him that his account is inactive, and he needs to be informed why
- Email must contain a calneldy link to where the BAM can book a meeting, and contains an email of a conact point

---

### CMB-4998: Viewing Active and Pending Users Widgets with Status Filter on Group Main Screen

**Status:** Done | **Priority:** No Priority
**Created:** 2023-04-14

**Description:**
As a Business Account Manager using the Yassir for Business web app, I want to be able to view two widgets on the Group main screen that display the number of Active Users and Pending Users.

**Acceptance Criteria:**
- The Group's main screen should display two widgets: Active Users and Pending Users.
- The widgets should show the number of users in each category (Active or Pending).
- When the Business Account Manager clicks on a widget, a list of users with the corresponding status filter should be displayed.
- Scenario 1: Viewing Active User's Widget
- Given: I am a Business Account Manager on the Group main screen
- When: I view the Active Users widget
- Then: I should see the number of Active Users within the Group
- Scenario 2: Viewing Pending User's Widget
- Given: I am a Business Account Manager on the Group main screen
- When: I view the Pending Users widget
- Then: I should see the number of Pending Users within the Group
- Scenario 3: Clicking on Active Users Widget
- Given: I am a Business Account Manager on the Group main screen and I click on the Active Users widget
- When: I click on the Active Users widget
- Then: I should see a list of users with the "Active" status filter applied
- Scenario 4: Clicking on Pending Users Widget
- Given: I am a Business Account Manager on the Group main screen and I click on the Pending Users widget
- When: I click on the Pending Users widget
- Then: I should see a list of users with the "Pending" status filter applied

---

### CMB-2668: Activate/Deactivate Business

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2022-12-29

**Description:**
As an ops manager, I need to be able to activate and deactivate businesses, based on their payment status. so that the business account manager managing this account will not be able to access the Dashboard. and all business riders will not be able to use the service

**Acceptance Criteria:**
- OPs Manager can toggle business status, and provide a reason why the business is suspended:
- Didn't submit the legal papers
- Needs to adjust the budget
- They haven't been active
- There is some sort of abusing
- BAM needs to receive an email informing him that his account is inactive, and he needs to be informed why
- Email must contain a calendy link to where the BAM can book a meeting, and contains an email of a contact point.
- OPs Manager can activate an in-active business without changing its budget

---

### CMB-9220: scheduling trips limitations

**Status:** Done | **Priority:** No Priority
**Created:** 2023-09-22

**Description:**
As an Operations Manager (OP Manager) on the Yassir OP dashboard, I want to schedule a trip manually for a Business Rider from the Dashboard upon receiving a request via phone.

**Acceptance Criteria:**
- Request Received by Phone:
- The OP Manager receives a trip request from a Business Rider via phone call or other means of communication.
- Trip Time and Day Matching:
- The requested trip time and day should align with the predefined program parameters set for Business trips.
- Spending Allowance Check:
- The requested trip should not exceed the Business Rider's spending allowance per trip.
- Daily Trip Count Check:
- The number of trips requested by the Business Rider on that day should not exceed the allowed limit set for Business Riders.
- Allowed Services Verification:
- The requested service type for the trip should be among the services permitted for Business Riders based on their program settings.
- Sufficient Budget Availability:
- There must be enough budget left in the Business Rider's account to cover the cost of the requested trip.
- Pickup and Destination Validation:
- The requested pickup and destination locations should be within the defined service area and comply with program parameters.
- Given-When-Then Scenarios:
- Scenario 1: Valid Request Meeting All Criteria
- Given: The OP Manager receives a trip request from a Business Rider.
- When: The request satisfies all Business trip requirements, including time, day, spending allowance, trip count, allowed services, budget availability, and locations.
- Then: The OP Manager can schedule the trip manually from the Dashboard.
- Scenario 2: Invalid Request Missing Criteria
- Given: The OP Manager receives a trip request from a Business Rider.
- When: The request fails to meet one or more Business trip requirements, such as time, day, spending allowance, trip count, allowed services, budget availability, or locations.
- Then: The OP Manager cannot schedule the trip, and the Business Rider is informed that the request does not meet the necessary criteria.

---

### CMB-9901: Program/ Group/ Rider Management On Mobile 

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-20

**Description:**
As a Business Account Manager (BAM), I want the overview screens, tables, and detailed settings screens within the Program, Group, and Rider Management tabs on the web app dashboard to be fully responsive and suitable for my mobile device.

**Acceptance Criteria:**
- Given I am a BAM accessing the web app dashboard from my mobile device,
- When I navigate to the Program, Group, or Rider Management tabs,
- Then the overview screens, tables, and detailed settings screens within these tabs should be responsive and adapt to my mobile screen size, allowing me to complete tasks smoothly.
- Scenario 1: Accessing Program Management Screens on Mobile
- Given I am a BAM accessing the web app dashboard from my mobile device,
- When I navigate to the Program Management tab,
- Then the overview screens and tables related to program management should display correctly on my mobile screen, with all elements properly sized and positioned for mobile use.
- Scenario 2: Accessing Group Management Screens on Mobile
- Given I am a BAM accessing the web app dashboard from my mobile device,
- When I navigate to the Group Management tab,
- Then the overview screens and tables related to group management should be responsive and fit within my mobile screen, ensuring that I can efficiently manage groups and associated settings.
- Scenario 3: Accessing Rider Management Screens on Mobile
- Given I am a BAM accessing the web app dashboard from my mobile device,
- When I navigate to the Rider Management tab,
- Then the overview screens and detailed settings screens for managing riders should adapt to my mobile screen size, allowing me to perform tasks related to rider management seamlessly.
- Scenario 4: Responsiveness Validation
- Given I am interacting with the overview screens, tables, or detailed settings screens within the Program, Group, or Rider Management tabs on my mobile,
- When I switch between different sections or tabs within the web app dashboard,
- Then the screens should remain responsive and suitable for my mobile device, ensuring a consistent and user-friendly experience.

---

### CMB-10206: Call to Action Main Section

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-10-31

**Description:**
As a Business Account Manager (BAM), I want to find a dedicated section with widgets on the Home Dashboard that allows me to perform important actions like inviting users, booking trips, and topping up my budget.

**Acceptance Criteria:**
- Access to Call to Action Section:
- When the BAM logs into the B2B platform and navigates to the Home Dashboard, there should be a prominently displayed "Call to Action" section.
- Inviting Users Button:
- Within the "Call to Action" section, the BAM should find a button labeled "Invite Users."
- When the BAM clicks on the "Invite Users" button, they should be immediately redirected to the user invitation page where they can invite new users to the platform.
- Booking Trips Button:
- Within the "Call to Action" section, the BAM should find a button labeled "Book a Trip."
- Clicking on the "Book a Trip" button should promptly direct the BAM to the trip booking screen, enabling them to schedule trips for their business.
- Top Up Button:
- Within the "Call to Action" section, the BAM should find a button labeled "Top Up."
- Clicking on the "Top Up" button should instantly redirect the BAM to the payment section, where they can conveniently top up their budget.
- Pay Due Budget Button:
- In addition to the "Top Up" button, the "Call to Action" section should also feature a button labeled "Pay Due Budget."
- Clicking on the "Pay Due Budget" button should immediately lead the BAM to the payment section, specifically to pay any outstanding due budget.
- Scenario: Accessing Call to Action Section
- Given: The BAM is logged into the B2B platform and is on the Home Dashboard.
- When: The BAM navigates to the Home Dashboard.
- Then: The "Call to Action" section should be visibly displayed on the screen.
- Scenario: Inviting Users
- Given: The BAM is on the Home Dashboard and wants to invite new users.
- When: The BAM clicks on the "Invite Users" button within the "Call to Action" section.
- Then: The BAM should be promptly redirected to the user invitation page, where they can invite new users to the platform.
- Scenario: Booking Trips
- Given: The BAM is on the Home Dashboard and needs to book a trip.
- When: The BAM clicks on the "Book a Trip" button within the "Call to Action" section.
- Then: The BAM should be instantly redirected to the trip booking screen, enabling them to schedule trips for their business.
- Scenario: Topping Up Budget
- Given: The BAM is on the Home Dashboard and wants to top up their budget.
- When: The BAM clicks on the "Top Up" button within the "Call to Action" section.
- Then: The BAM should be immediately redirected to the payment section, where they can conveniently top up their budget.
- Scenario: Paying Due Budget
- Given: The BAM is on the Home Dashboard and needs to pay an outstanding due budget.
- When: The BAM clicks on the "Pay Due Budget" button within the "Call to Action" section.
- Then: The BAM should be instantly redirected to the payment section, specifically to pay any outstanding due budget.

---

### CMB-9909: Hide Service from Companies By Default

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-10-20

**Description:**
As an Operations (OPs) Manager using the Admin Panel, I need the capability to control which services are visible by default to businesses within a specific country. To achieve this, I want the option to filter and select from all enabled B2B services created on Pricing Dashboard, allowing me to specify which services should be enabled by default for companies in that country.

**Acceptance Criteria:**
- Scenario 1: Selecting Default Services for a Country
- Given that I am an OPs Manager using the Admin Panel,
- When I access the service configuration feature, on a specific country,
- Then I should be presented with a list of all enabled B2B services from Dashops.
- Scenario 2: Choosing Default Services for Companies
- Given that I have a list of all enabled B2B services,
- When I select one or more services from the list for a specific country,
- Then these selected services should be set as visible by default for businesses operating in that country.
- Scenario 3: Customizing Default Services for Each Country
- Given that I have the ability to select default services,
- When I repeat the process for different countries,
- Then I should be able to customize the default services separately for each country, tailoring the service offerings to the needs of businesses in that region.
- Scenario 4: Enabling Service for all Companies by Default
- Given that I have chosen a created b2b service
- When I click on the check box -Which is clicked by default-
- Then All companies must be able to have this service visible, and I can’t disable it for any company
- Scenario 5: Disabling Service for all Companies by Default
- Given  that I have chosen a created b2b service
- When I uncheck check box -
- Then All companies must not be able to have this service visible, and I can enable the exception for any company
- Scenario 6: Giving Companies Exception
- Given that the check box, is unchecked,
- When I grant a set of companies an expedition to see the service
- Then the check box will be in the intermediate state and the chosen companies will be the only companies that can see the service
- Scenario 7: Preventing Giving companies Exception
- Given that the check box, is checked,
- When I try grant a set of companies an expedition to see the service
- Then I find the switch button for the exception on those companies will be disabled

---

### CMB-10207: Gamification Section 

**Status:** Done | **Priority:** P1 - High
**Created:** 2023-10-31

**Description:**
As a Business Account Manager (BAM), I want to have access to a Trips Overview Section on the Home Dashboard where I can review my recent trip history per day and see how I can earn cashback based on my booked trips or spending amount.

**Acceptance Criteria:**
- Within the "Trips Overview" section, BAMs should see a bar chart prominently displayed. This bar chart should visually represent the number of trips they have made in the last two weeks.
- Ideally, the bar chart should provide a breakdown by day, allowing BAMs to see their trip history on a daily basis. This visual representation helps BAMs quickly understand their recent activity.
- Adjacent to the bar chart, BAMs should find a widget or information box. This widget should provide details about any conditions or requirements BAMs need to meet to earn discounts or cashback.
- If there are specific trip-related actions or targets BAMs need to achieve to qualify for discounts or cashback, these should be clearly outlined within the widget.
- If no conditions or requirements apply to the BAM's trip history, a button labeled "Contact Support" should be available within the "Trips Overview" section.
- Clicking this button should provide BAMs with a convenient way to reach out to the support team for any inquiries or assistance they may need.

---

### CMB-6651: Choose Service Type 

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2023-06-14

**Description:**
As a business account manager, I want to be able to select a service from the service list on the Business Configuration Dashboard.

**Acceptance Criteria:**
- The business account manager can access the Business Web App
- The business account manager can select a service from the service list.
- Once a service is selected, a secondary drop-down list should dynamically populate with the service types associated with the selected service.
- The secondary drop-down list should display the available service types in a user-friendly format, such as a drop-down menu or a list of options.
- The business account manager can choose a service type from the second drop-down list.
- The selected service can have an impact on the trip's total price
- Scenarios:
- Scenario 1: Selecting a Service and Viewing Available Service Types
- Given a business account manager on the booking Trip Screen
- When the manager selects a service from the service list
- Then the secondary drop-down list should populate with the available service types for the selected service
- Scenario 2: Choosing a Service Type
- Given a business account manager on the booking Trip Screen
- When the manager selects a service from the service list
- And the secondary drop-down list populates with the available service types for the selected service
- Then the manager can choose a service type from the second drop-down list
- Scenario 3: Storing the Selected Service Type
- Given a business account manager on the booking Trip Screen
- When the manager selects a service from the service list
- And the manager chooses a service type from the second drop-down list
- Then the selected service may cause a change in the trip Price

---

### CMB-10460: One Program Edit Page

**Status:** Done | **Priority:** P2 - Medium
**Created:** 2023-11-10

**Description:**
As a Business Account Manager (BAM) using the B2B web app on the Home Dashboard, I want to have all program settings consolidated on a single page when I choose to edit a program's settings.

**Acceptance Criteria:**
- Scenario 1: Accessing Program Settings for Editing
- Given: I am logged in as a BAM on the B2B web app.
- When: I navigate to the program settings page with the intention of editing a program's settings.
- Then: I should be directed to a single, comprehensive "Edit Program Settings" page.
- Scenario 2: Program Settings Consolidation
- Given: I am on the "Edit Program Settings" page.
- When: I scroll or navigate through the page.
- Then: I should find all program settings, including but not limited to:
- Location
- Timing
- Service Types
- Spending Allowance
- Number of Trips per Day
- Price Visibility
- Trip Permissions
- Any other program-specific settings
- Scenario 3: Updating Program Settings
- Given: I am on the "Edit Program Settings" page and want to update program settings.
- When: I make changes or modifications to any program setting.
- Then: I should be able to save these changes directly from the same page, by clicking on the save button
- Scenario 4: Clear and Intuitive Interface
- Given: I am viewing and editing program settings.
- When: I interact with the settings interface.
- Then: The interface should be clear, intuitive, and organized, making it easy for me to understand and adjust program settings.
- Scenario 5: Canceling Edits
- Given: I am on the "Edit Program Settings" page, making changes to program settings.
- When: I decide to cancel my edits.
- Then: I should have the option to discard changes and revert program settings to their previous state.
- Scenario 6: Saving Changes
- Given: I have made valid changes to program settings.
- When: I click the "Save"  button.
- Then: The system should save my changes, and the program settings should be updated accordingly for all relevant users and riders.
- Scenario 7: Create a new program on the home dashboard
- Given: As a BAM on the Program Page
- When: I click on create a new program
- Then: I should be able to create a new program from a single page, so that I don’t need to make multiple CTAs to create the new program, and have all new program parameters in one page
- Scenario 8: Create a new program on the home dashboard
- Given: As a BAM creating a new program
- Then: I should be able to find the default values of the program as follows:
- Location Any location without return trips
- Name empty
- Program purpose empty
- All services selected
- All Days are chosen
- The 24-hour option is chosen
- Unlimited Number of trips per day
- Unlimited Spending allowance
- Price not visible
- Auto approval on all trips
- Scenario 9: Check for unsaved changes
- Given: As a BAM on the Program Page edit screen
- When: I click on refresh page by mistake
- Then: I need to get a pop-screen to confirm on saving those changes or discard them

---

### CMB-13653: Admin Access the web app 

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-04-04

**Description:**
As an Admin on the Yassir for Business Admin Panel, I need to find a button within the Trips tab that allows me to access the Business Client Dashboard. This feature enables me to seamlessly transition from viewing trips of the business on the admin panel, to accessing the client's dashboard, where I can manage users, programs, and groups.

**Acceptance Criteria:**
- Scenario 1: Accessing Business Client Dashboard
- Given: I am logged into the Yassir for Business Admin Panel.
- When: I navigate to the Trips tab in the admin panel interface.
- Then: I should find a clearly labeled button that provides access to the Business Client Dashboard.
- Scenario 2: Navigating the Business Client Dashboard
- Given: I have accessed the Business Client Dashboard via the Trips tab.
- When: I navigate through the dashboard interface.
- Then: I should only see sections related to managing users, programs, and groups. Other sections or functionalities should be hidden or disabled.

---

### CMB-13438: [Spike]: Ops access to dasboard

**Status:** Done | **Priority:** No Priority
**Created:** 2024-03-26

**Description:**
https://www.notion.so/ysir/Operations-access-to-BAM-dashboard-709daef3e5e045fa82abb4bb2668e6a7

---

### CMB-14575: Access Web App Dashboard

**Status:** Done | **Priority:** P0 - Critical
**Created:** 2024-05-14

**Description:**
As an Admin with access to the Dashops platform, I need to access the trips tab and have the ability to navigate to the Client Web app, regardless of whether I have super user privileges or not.

**Acceptance Criteria:**
- Scenario 1: Accessing the Trips Tab
- Given that I am logged into the Dashops platform as an Admin,
- When I navigate to the dashboard,  I should find a "Trips" tab visible in the navigation menu,
- Then  I click on the "Trips" tab,, I should be directed to the Clients Web App.
- Scenario 2: Access for Non-Super Users
- Given that I am an Admin without super user privileges,
- When I attempt to access the Client Web app,
- Then I should still be able to navigate to the Client Web app without encountering any restrictions or limitations based on my user role.

---

### CMB-13787: Videos on Home Page

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-04-12

**Description:**
As a Business Account Manager (BAM / Business Admin) using the Yassir for Business platform, I want to access tutorial videos directly from the home dashboard to learn how to use different features and functionalities effectively.

**Acceptance Criteria:**
- Scenario 1: Locating Tutorial Videos
- Given that I am logged into the Yassir for Business platform as a BAM/ Business Admin,
- When I navigate to the home dashboard,
- Then I should find a dedicated section with placeholders for up to four tutorial videos Max. held horizontally
- Scenario 2: Viewing Tutorial Video Thumbnails
- Given that I access the home dashboard section for tutorial videos,
- When I view the placeholders,
- Then each placeholder should display a thumbnail image representing the content of the tutorial video.
- Scenario 3: Clicking on Tutorial Video Placeholder
- Given that, I want to watch a tutorial video,
- When I click on a video, or a video thumbnail,
- Then I should be directed to a- pop a screen-  where I can view the selected tutorial video.
- Scenario 4: Accessing Relevant Tutorial Topics
- Given that I am on the tutorial video viewing screen,
- When I watch the video,
- Then I should find a call to action to go to the relevant section.
- Scenario 5: Navigating Through Tutorial Videos
- Given that I finish watching one tutorial video,
- When I want to watch another,
- Then I should be able to navigate back to the home dashboard and select another placeholder to access a different tutorial video.
- Scenario 6: Watching the video
- Given that I’m watching a video
- When I play it
- Then it should work on a YouTube video player
- Scenario 7: Collapsing/ Expanded the video list
- Given that as a BAM/ Business Admin I have collapsed/ Expanded the list of the videos
- When I refresh the page or log out and log in
- Then I should find the page collapsed or expanded as I left it
- Note: we need to add GA events to this section

---

### CMB-18875: Activation Steps on Home Dashboard 

**Status:** Done | **Priority:** P3 - Low
**Created:** 2024-10-22

**Description:**
As a Business Account Manager (BAM), and Business Admin

**Acceptance Criteria:**
- Scenario 1: Accessing the Profile Setup Tab
- Given I am logged into the Yassir for Business platform as a BAM, and Business Admin
- When I view the left navigation bar,
- Then I should find a new tab labeled "Profile Setup."
- Scenario 2: Viewing the Profile Setup Stepper
- Given I am on the Profile Setup tab,
- When I open it,
- Then I should see a stepper containing the following list of steps for a 100% setup profile.
- Scenario 3: Step 1 - Email Verification
- Given I am on the Profile Setup stepper,
- When I view Step 1: "Email Verification,"
- Then I should see an option to verify my email if it has not been verified, now by default it’s verified
- Scenario 4: Step 2 - Phone number Verification
- Given I am on the Profile Setup stepper,
- When I view Step 2: "Phone Number Verification,"
- Then I should see an option to verify my Phone number if it has not been verified, now by default it’s verified
- Scenario 5: Step 3 - Top Up Your Budget
- Given I am on the Profile Setup stepper,
- When I reach Step 2: "Top Up your Budget",
- Then I should see a clickable option,
- And When I click on this step,
- Then I should be redirected to the budget screen, and this step will be checked in case (I got a budget top-up, offline or online or I had a budget limit)
- Scenario 6: Step 4 - Invite Members
- Given I am on the Profile Setup stepper,
- When I reach Step 3: "Invite Members",
- Then I should see a clickable option When I click on this step,
- Then I should be redirected to the members screen. (this step will be checked once I get a pending user coming from, CSV upload, typing an email, or sending a shareable link, and one business rider enters his mail)
- Scenario 7: Step 5 - Book Your First Trip
- Given I am on the Profile Setup stepper,
- When I reach Step 5: "Book Your First Trip",
- Then I should see a prompt to book my first trip,
- And When I click on this step,
- Then I should be redirected to the booking screen.
- Scenario 8: Step 6 - Create Your Second Program
- Given I am on the Profile Setup stepper,
- When I reach Step 6: "Create Your Second Program",
- Then I should see a clickable option,
- And When I click on this step,
- Then I should be redirected to the program creation screen.(and the button will be checked once we create a new program )
- Scenario 9: Step 7 - Create Your Second Group
- Given I am on the Profile Setup stepper,
- When I reach Step 7: "Create Your Second Group",
- Then I should see a clickable option,
- And When I click on this step,
- Then I should be redirected to the group creation screen.
- (and the button will be checked once we create a new group )
- Scenario 10: Step 8 - Submit Legal Information
- Given I am on the Profile Setup stepper,
- When I reach Step 8: "Submit Legal Information",
- Then I should see a clickable option,
- And When I click on this step,
- Then I should be redirected to the legal information screen. (the button will be checked when my legal information is approved, or has been entered manually)
- Scenario 12: Step 10 - Signing a contract step
- Given I am on the Profile Setup stepper,
- When I have signed a contract with the sales team
- Then, the sales team marks my account as a company account from the admin panel
- Then I should find signing contract step done

---

### CMB-17697: [DB Migration]: b2b non-owned collection Trips Module

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-09-08

**Description:**
- [BAM DASHBOARD] Making sure all the analytics on the home page is working as expected for the business, trips and ongoing trips analytics.

**Acceptance Criteria:**
- [BAM DASHBOARD] Making sure all the analytics on the home page is working as expected for the business, trips and ongoing trips analytics.
- [BAM DASHBOARD] Check real time notification on trips status update.
- [BAM DASHBOARD] Trip is canceled in case for instance no driver available, the refund should be initiated and the trip amount should be refunded to the business balance.
- [BAM DASHBOARD] Once you navigate to trips you should see the trips stats.
- [BAM DASHBOARD] Export trips.
- [BAM DASHBOARD] Full flow of trip request till the end with status FINISHED.
- [BAM DASHBOARD] Trip cancel from bam dashboard.
- [BAM DASHBOARD] Check spending allowance on trip request.
- [ADMIN PANEL] Export Trips.
- [ADMIN PANEL] Delete Business.
- [ADMIN PANEL] Update Business Budget.
- [ADMIN PANEL] Get trip details from business trips list.

---

### CMB-19944: Website -  Ongoing events widget - ( dispatch / in-ride )

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-11-21

**Description:**
When the B2C web app user switches to the Ride History or Ride Details screens from the Home Screen and has an ongoing ride or dispatch, we'll show them an "Ongoing Event" indicator (such as "dispatching a driver") and allow them to navigate to the appropriate page based on the current event status.

**Acceptance Criteria:**
- Scenario 1: Ongoing Event Indicator on Switching to Ride History or Ride Details
- Given I’m a website rider
- When I switch from the Home page to the “Ride History” or “Ride Details” screen
- Then I should see an “Ongoing Event” indicator showing the current status of my ongoing ride or dispatch (e.g., "Looking for a driver," "Your driver is on the way," "Your driver has arrived," or "On the way to your destination").
- And I should be able to click on the indicator to be redirected to the corresponding page of the ongoing event
- Note: The ongoing widget statuses will change dynamically based on the current event state, such as dispatching a driver, driver on the way, driver arrived, etc.
- Scenario 2: Redirect to Ongoing Ride on Click
- Given I’m a website rider
- When I switch from the Home page to the “Ride History” or “Ride Details” screen
- And there’s an ongoing ride with a status of “Looking for a driver,” “Your driver is on the way,” “Your driver has arrived,” or “On the way to your destination”
- When I press the “View more” CTA on the “Ongoing Event” indicator
- Then I should be redirected to the relevant ongoing screen based on the current status of the event
- Note: The ongoing widget will include a phone icon, that is clickable and redirects me to the phone dialer for each device I'm using.
- Scenario 3: Redirect to Dispatch Page on Click
- Given I’m a website rider
- When I switch from the Home page to the “Ride History” or “Ride Details” screen
- And there’s an ongoing dispatch with the status of “Looking for a driver,”
- When I press the “View more” CTA on the “Ongoing Event” indicator
- Then I should be redirected to the the relevant ongoing screen based on the current status of the event
- Note: The ongoing widget status will dynamically reflect the dispatch stage, such as “Looking for a driver” or “Your driver has arrived.”
- Scenario 4: Completed Ride - Redirect to Review Screen
- Given I’m a website rider,
- When I’m on the "Ride History" or "Ride Details" page and the ride is completed,
- Then I should see a "Finished Ride" pop-up indicating the completion of the ride.
- When I click on the "OK" button on the pop-up,
- Then I should be redirected to the Review screen to rate my ride experience.
- Scenario 5: No Nearby Driver - Redirect to Home Screen
- Given I’m a website rider,
- When I’m on the "Ride History" or "Ride Details" page and there is no nearby driver available,
- Then I should see a "No Nearby Driver" pop-up.
- When I click on the "Try Again" button on the pop-up,
- Then I should be redirected to the Home screen to attempt booking again.
- Scenario 6: Canceled Ride - Redirect to Home Screen
- Given I’m a website rider,
- When I’m on the "Ride History" or "Ride Details" page and my ride has been canceled,
- Then I should see a "Ride Canceled" pop-up.
- When I click on the "OK" button on the pop-up,
- Then I should be redirected to the Home screen to begin a new ride request.
- Scenario 7: Call Driver Button Behavior
- Given I’m a website rider
- When I’m on the “Ride History” or “Ride Details” page and I press the “Call Driver” button (which is available when my driver is on the way or has arrived)
- Then the appropriate calling application should open based on my device:
- On macOS: FaceTime should open.
- On Windows or other desktop operating systems: The default calling application (e.g., Skype, Zoom) should open.
- On iOS or Android: The default dialer should open.
- Scenario 8: Call Driver Button Behavior on Home Screen (Post Ride Acceptance)
- Given I’m a website rider
- When my driver has accepted the ride request and I am on the Home screen
- And the status of my ride is "Your driver is on the way," "Your driver has arrived," or "On the way to your destination"
- Then I should see a "Call Driver" button
- When I press the "Call Driver" button
- Then the appropriate calling application should open based on my device:
- On macOS: FaceTime should open.
- On Windows or other desktop operating systems: The default calling application (e.g., Skype, Zoom) should open.
- On iOS or Android: The default dialer should open.
- Note: The button should be available as soon as the driver accepts the ride and the status is updated to indicate that the ride is in progress (e.g., "Your driver is on the way").
- Additional Notes
- The “Ongoing Event” indicator will show the current ride or dispatch status and allow navigation to the relevant screen.
- Ongoing widget statuses include:
- "Looking for a driver"
- "Your driver is on the way" (with a clickable phone icon that opens the appropriate calling application based on user’s device)
- "Your driver has arrived" (with a clickable phone icon that opens the appropriate calling application based on user’s device)
- "On the way to your destination" with the driver
- Clicking the ongoing event indicator will take the user to the appropriate screen based on the status.
- The “Call Driver” button behavior will dynamically open the appropriate calling application based on the user’s device.

---

### CMB-17894: BAM Dashboard: Remove trip listing search and add user filter

**Status:** Done | **Priority:** P1 - High
**Created:** 2024-09-12

**Description:**
As a BAM on the BAM Dashboard,

**Acceptance Criteria:**
- Scenario 1: Opening the users dropdown
- Given that I'm logged into the BAM Dashboard
- When I navigate to the “Trips“ section
- Then I should be able to see a dropdown that lists the users in the business
- AND I should be able to select any user from the list to filter out the trips for him
- Scenario 2: Searching the user's dropdown
- Given that I'm logged into the BAM Dashboard
- When I navigate to the “Trips“ section and open the users dropdown
- Then I should be able to see a search bar in the dropdown
- AND I should be able to type and search users in the dropdown

---

## Consolidated Acceptance Criteria

- when the email of a user is not valid i should not be able to send him / an invite
- Display an error message on the pop up screen
- Go to the B2B Web app
- Change the role of a user (e.g., from Business Admin to rider).
- Observe the user list after saving.
- B2B_SC_HomeDashboardSessions
- B2B_AC_HomeDashboardRequestRidesClick
- B2B_AC_HomeDashboardInviteMembersClick
- B2B_AC_HomeDashboardViewHistoryClick
- B2B_AC_HomeDashboardTopUpBudgetClick
- B2B_AC_HomeDashboardPayDueBudgetClick
- B2B_AC_HomeDashboardCreateGroupsClick
- B2B_AC_HomeDashboardViewAllGroupsClick
- B2B_AC_HomeDashboardCreateProgramsClick
- B2B_AC_HomeDashboardViewAllProgramsClick
- B2B_AC_HomeDashboardLogoutClick
- B2B_AC_HomeDashboardAccountClick
- B2B_AC_HomeDashboardChangeLanguageClick
- B2B_AC_HomeDashboardLanguageChosenEn
- B2B_AC_HomeDashboardLanguageChosenAr
- B2B_AC_HomeDashboardLanguageChosenFr
- Scenario 1: Accessing the Profile Setup Tab
- Given I am logged into the Yassir for Business platform as a BAM, and Business Admin
- When I view the left navigation bar,
- Then I should find a new tab labeled "Profile Setup."
- Scenario 2: Viewing the Profile Setup Stepper
- Given I am on the Profile Setup tab,
- When I open it,
- Then I should see a stepper containing the following list of steps for a 100% setup profile.
- Scenario 3: Step 1 - Email Verification
- Given I am on the Profile Setup stepper,
- When I view Step 1: "Email Verification,"
- Then I should see an option to verify my email if it has not been verified, now by default it’s verified
- Scenario 4: Step 2 - Phone number Verification
- When I view Step 2: "Phone Number Verification,"
- Then I should see an option to verify my Phone number if it has not been verified, now by default it’s verified
- Scenario 5: Step 3 - Top Up Your Budget
- When I reach Step 2: "Top Up your Budget",
- Then I should see a clickable option,
- And When I click on this step,
- Then I should be redirected to the budget screen, and this step will be checked in case (I got a budget top-up, offline or online or I had a budget limit)
- Scenario 6: Step 4 - Invite Members
- When I reach Step 3: "Invite Members",
- Then I should see a clickable option When I click on this step,
- Then I should be redirected to the members screen. (this step will be checked once I get a pending user coming from, CSV upload, typing an email, or sending a shareable link, and one business rider enters his mail)
- Scenario 7: Step 5 - Book Your First Trip
- When I reach Step 5: "Book Your First Trip",
- Then I should see a prompt to book my first trip,
- Then I should be redirected to the booking screen.
- Scenario 8: Step 6 - Create Your Second Program
- When I reach Step 6: "Create Your Second Program",
- Then I should be redirected to the program creation screen.(and the button will be checked once we create a new program )
- Scenario 9: Step 7 - Create Your Second Group
- When I reach Step 7: "Create Your Second Group",
- Then I should be redirected to the group creation screen.
- (and the button will be checked once we create a new group )
- Scenario 10: Step 8 - Submit Legal Information
- When I reach Step 8: "Submit Legal Information",
- Then I should be redirected to the legal information screen. (the button will be checked when my legal information is approved, or has been entered manually)
- Scenario 12: Step 10 - Signing a contract step
- When I have signed a contract with the sales team
- Then, the sales team marks my account as a company account from the admin panel
- Then I should find signing contract step done
- Scenario 1: Reordering the Latest Trip with Available Service and Sufficient Budget
- Given: I am logged into the B2B Web App as a BAM, There is a previously requested trip with specific pickup, destination, and service details in my trip history, My program parameters allow for booking this trip, and I have sufficient budget to book the trip.
- When: I access the Home Dashboard screen.
- Then: I find a widget that offers the option to reorder my latest trip, Upon clicking the "Reorder Trip" option, the system retrieves the same pickup location, and destination, as well as the same business Rider -for the trips booked from the web app-  and service details from the previous trip request, The system checks if the selected service is available; if it is, the trip is booked with the same service, If the selected service is not available, the system books the trip with a default service.
- Scenario 2: Reordering the Latest Trip with Unavailable Service
- Given: I am logged into the B2B platform as a BAM. There is a previously requested trip with specific pickup, destination, and service details in my trip history. My program parameters allow for booking this trip. I have sufficient budget to book the trip.
- Then: I found a widget that offers the option to reorder my latest trip, Upon clicking the "Reorder Trip" option, the system retrieves the same pickup location, destination, and service details from the previous trip request, The system checks if the selected service is available; if it is, the trip is booked with the same service, If the selected service is not available, the system automatically books the trip with a default service (if defined).
- Scenario 3: Reordering the Latest Trip with an Insufficient Budget
- Given: I am logged into the B2B platform as a BAM, There is a previously requested trip with specific pickup, destination, and service details in my trip history, My program parameters allow for booking this trip, I have an insufficient budget to book the trip.
- Then: I find a widget that offers the option to reorder my latest trip, Upon clicking the "Reorder Trip" option, the system retrieves the same pickup location, destination, and service details from the previous trip request, once the user estimates the trip, then he should get an error informing him that he has not enough budget
- Scenario 4: A business rider is removed from the business
- Given: as a BAM I have re-ordered a trip for a deleted user
- When: I’m directed to the trip request screen
- Then: I should find the book for me option already chosen by default
- Scenario 5: if the business trip was booked for a guest user
- Given: as a BAM I have re-ordered a trip for a guest user
- Then: I should find the trip booked for the guest user
- Scenario 6: if the business user has been moved to another program that doesn’t allow the trip or program parameters changed
- Given: as a BAM I have re-ordered a trip for a user who has been moved to another program that doesn’t allow the trip
- Then: I should find an error message informing me that the trip does not align with the program parameters
- Scenario 7: if the last successfully finished trip was booked for a later
- Given: as a BAM I have re-ordered a trip, and that trip was scheduled trip
- Then: I should find all fields populated with the same book for later trips, except the time and date, and the book for later button won’t be enabled
- Scenario 8: if we don’t have a  finished trip
- Given: as a BAM I have no finished trips
- When: I click on the re-order button
- Then: I’m directed to the trip request screen, and I’ll see a pop-up, asking me to book my first trip
- Login as BAM;
- Click on profile icon;
- Click on switch companies
- Click on Add a new company button;
- Click on Browser's reload button
- Scenario 1: Display of Inactive Companies
- Given I am logged into the admin panel dashboard,
- When I navigate to the company’s section,
- Then I should see a clear indication of which companies are marked as "inactive".
- Scenario 2: Selection of Multiple Companies
- Given I am on the company’s management section of the admin panel,
- And there are multiple inactive companies listed,
- Then I should be able to select more than one inactive company using checkboxes
- Scenario 3: Bulk Delete Action
- Given I have selected one or more inactive companies,
- When I click on a "Delete Selected companies" or similar bulk action button,
- Then I should be prompted with a confirmation message asking if I am sure I want to delete the selected companies “Confirm deletion” or “Cancel”
- Scenario 4: Confirm deletion
- Given I have confirmed the deletion of the selected inactive companies,
- Then the selected companies should be permanently removed from the system.
- And I should receive a success message indicating the number of companies that were successfully deleted.
- Scenario 5: Prevention of Active Company Deletion
- And there are both active and inactive companies listed,
- When I attempt to select an active company for bulk deletion,
- Then the system should prevent me from selecting active companies for this bulk action,
- And if I proceed with a selection that includes active companies, the system should only delete the inactive ones and inform me about any active companies that were skipped.
- Scenario 6: Handling of No Selection
- Given I am on the company's management section of the admin panel dashboard,
- When I click on the "Delete Selected" button without selecting any companies,
- Then I should receive an appropriate message indicating that I need to select at least one company to delete “no inactive companies selected”.
- Given I’m a website rider,
- When I’m on the “home" page and my ride has been canceled before the driver notifies arrival,
- Then I should see a "Ride Canceled" pop-up.
- When I click a button on the pop-up,
- Then I should be redirected to the Home screen again to begin a new ride request.
- When I’m on the "Ride Details" page and my ride has been canceled before the driver notifies arrival,
- And I should have the option to cancel ride or find another driver
- And the Found another driver button should automatically dispatch my ride again
- Scenario 1: Removal of Groups and Programs Columns
- Given I am logged into the Yassir for Business platform as a BAM or Business Admin,
- When I navigate to the trip history screen,
- Then the "Groups" and "Programs" columns should no longer be visible.
- Scenario 2: Addition of "Trip Details" Button
- Given I am on the trip history screen,
- When I view the list of trips,
- Then I should find a "Trip Details" button next to each trip entry.
- Scenario 3: Viewing Detailed Trip Information
- When I click on the "Trip Details" button for a trip,
- Then I should be directed to a detailed trip information screen.
- Scenario 4: Detailed Trip Information Display
- Given I have accessed the trip details screen,
- When I view the trip details,
- Then I should be able to see the following information:
- Rider name
- Rider phone number
- Pickup and destination locations
- Routing details
- Trip status
- Driver name
- Driver phone number
- Car information (model, color, plate number)
- Trip cost
- Rider's associated group and program
- Scenario 5: Accessing and Exiting Trip Details Screen
- Given I am on the detailed trip information screen,
- When I finish reviewing the trip details,
- Then I should have an option to return to the main trip history screen.
- If the user is logged in, he should be redirected to booking flow
- If the user is not logged in, he should be redirected to Login/Registration Flow
- The dashboard should display a list of admins.
- The Super Admin should have the ability to select one or more admins from the list.
- The Super Admin should have the option to grant access to one or more countries for the selected admin(s).
- The Super Admin should have the option to activate or deactivate the selected admin(s).
- When the Super Admin grants country access or modifies the admin status, the dashboard should display a confirmation message.
- The changes made by the Super Admin should be saved and applied to the selected admin(s) immediately.
- Scenarios:
- Scenario 1: Viewing the list of admins
- Given: I am a Super Admin of the Yassir Go for B2B Dashboard
- When: I navigate to the admin management section
- Then: I should see a list of admins
- Scenario 2: Selecting one or more admins
- Given: I am a Super Admin viewing the list of admins
- When: I select one or more admins from the list
- Then: The selected admin(s) should be highlighted, indicating that they are ready for permission or status modification
- Scenario 3: Granting country access to selected admin(s)
- Given: I am a Super Admin with one or more admins selected
- When: I grant access to one or more countries for the selected admin(s)
- And: I confirm the changes
- Then: The dashboard should display a confirmation message
- And: The selected admin(s) should have access to the specified countries
- Scenario 4: Activating or deactivating selected admin(s)
- When: I choose to activate or deactivate the selected admin(s)
- And: The selected admin(s) should have their status updated to active or inactive, as specified
- Scenario 5: Checking the updated admin access and status
- Given: I am a Super Admin who has granted country access or modified admin status
- When: I view the list of admins
- Then: The updated country access and status for the affected admin(s) should be reflected in the list
- BAM needs to confirm on created password
- Password must containt 8 charceters at least, consist of a one letter, one number and special charcter at least
- OPs Manager can toggle business status, and provide a reason why the business is suspended:
- Didn't submit the legal papers
- Needs to adjust the budget
- They haven't been active
- There is some sort of abusing
- BAM needs to receive an email informing him that his account is inactive, and he needs to be informed why
- Email must contain a calneldy link to where the BAM can book a meeting, and contains an email of a conact point
- Dashboard Activation means, that the business riders cannot use the B2B solution. unless it can be activated
- The Group's main screen should display two widgets: Active Users and Pending Users.
- The widgets should show the number of users in each category (Active or Pending).
- When the Business Account Manager clicks on a widget, a list of users with the corresponding status filter should be displayed.
- Scenario 1: Viewing Active User's Widget
- Given: I am a Business Account Manager on the Group main screen
- When: I view the Active Users widget
- Then: I should see the number of Active Users within the Group
- Scenario 2: Viewing Pending User's Widget
- When: I view the Pending Users widget
- Then: I should see the number of Pending Users within the Group
- Scenario 3: Clicking on Active Users Widget
- Given: I am a Business Account Manager on the Group main screen and I click on the Active Users widget
- When: I click on the Active Users widget
- Then: I should see a list of users with the "Active" status filter applied
- Scenario 4: Clicking on Pending Users Widget
- Given: I am a Business Account Manager on the Group main screen and I click on the Pending Users widget
- When: I click on the Pending Users widget
- Then: I should see a list of users with the "Pending" status filter applied
- Email must contain a calendy link to where the BAM can book a meeting, and contains an email of a contact point.
- OPs Manager can activate an in-active business without changing its budget
- Request Received by Phone:
- The OP Manager receives a trip request from a Business Rider via phone call or other means of communication.
- Trip Time and Day Matching:
- The requested trip time and day should align with the predefined program parameters set for Business trips.
- Spending Allowance Check:
- The requested trip should not exceed the Business Rider's spending allowance per trip.
- Daily Trip Count Check:
- The number of trips requested by the Business Rider on that day should not exceed the allowed limit set for Business Riders.
- Allowed Services Verification:
- The requested service type for the trip should be among the services permitted for Business Riders based on their program settings.
- Sufficient Budget Availability:
- There must be enough budget left in the Business Rider's account to cover the cost of the requested trip.
- Pickup and Destination Validation:
- The requested pickup and destination locations should be within the defined service area and comply with program parameters.
- Given-When-Then Scenarios:
- Scenario 1: Valid Request Meeting All Criteria
- Given: The OP Manager receives a trip request from a Business Rider.
- When: The request satisfies all Business trip requirements, including time, day, spending allowance, trip count, allowed services, budget availability, and locations.
- Then: The OP Manager can schedule the trip manually from the Dashboard.
- Scenario 2: Invalid Request Missing Criteria
- When: The request fails to meet one or more Business trip requirements, such as time, day, spending allowance, trip count, allowed services, budget availability, or locations.
- Then: The OP Manager cannot schedule the trip, and the Business Rider is informed that the request does not meet the necessary criteria.
- Given I am a BAM accessing the web app dashboard from my mobile device,
- When I navigate to the Program, Group, or Rider Management tabs,
- Then the overview screens, tables, and detailed settings screens within these tabs should be responsive and adapt to my mobile screen size, allowing me to complete tasks smoothly.
- Scenario 1: Accessing Program Management Screens on Mobile
- When I navigate to the Program Management tab,
- Then the overview screens and tables related to program management should display correctly on my mobile screen, with all elements properly sized and positioned for mobile use.
- Scenario 2: Accessing Group Management Screens on Mobile
- When I navigate to the Group Management tab,
- Then the overview screens and tables related to group management should be responsive and fit within my mobile screen, ensuring that I can efficiently manage groups and associated settings.
- Scenario 3: Accessing Rider Management Screens on Mobile
- When I navigate to the Rider Management tab,
- Then the overview screens and detailed settings screens for managing riders should adapt to my mobile screen size, allowing me to perform tasks related to rider management seamlessly.
- Scenario 4: Responsiveness Validation
- Given I am interacting with the overview screens, tables, or detailed settings screens within the Program, Group, or Rider Management tabs on my mobile,
- When I switch between different sections or tabs within the web app dashboard,
- Then the screens should remain responsive and suitable for my mobile device, ensuring a consistent and user-friendly experience.
- Access to Call to Action Section:
- When the BAM logs into the B2B platform and navigates to the Home Dashboard, there should be a prominently displayed "Call to Action" section.
- Inviting Users Button:
- Within the "Call to Action" section, the BAM should find a button labeled "Invite Users."
- When the BAM clicks on the "Invite Users" button, they should be immediately redirected to the user invitation page where they can invite new users to the platform.
- Booking Trips Button:
- Within the "Call to Action" section, the BAM should find a button labeled "Book a Trip."
- Clicking on the "Book a Trip" button should promptly direct the BAM to the trip booking screen, enabling them to schedule trips for their business.
- Top Up Button:
- Within the "Call to Action" section, the BAM should find a button labeled "Top Up."
- Clicking on the "Top Up" button should instantly redirect the BAM to the payment section, where they can conveniently top up their budget.
- Pay Due Budget Button:
- In addition to the "Top Up" button, the "Call to Action" section should also feature a button labeled "Pay Due Budget."
- Clicking on the "Pay Due Budget" button should immediately lead the BAM to the payment section, specifically to pay any outstanding due budget.
- Scenario: Accessing Call to Action Section
- Given: The BAM is logged into the B2B platform and is on the Home Dashboard.
- When: The BAM navigates to the Home Dashboard.
- Then: The "Call to Action" section should be visibly displayed on the screen.
- Scenario: Inviting Users
- Given: The BAM is on the Home Dashboard and wants to invite new users.
- When: The BAM clicks on the "Invite Users" button within the "Call to Action" section.
- Then: The BAM should be promptly redirected to the user invitation page, where they can invite new users to the platform.
- Scenario: Booking Trips
- Given: The BAM is on the Home Dashboard and needs to book a trip.
- When: The BAM clicks on the "Book a Trip" button within the "Call to Action" section.
- Then: The BAM should be instantly redirected to the trip booking screen, enabling them to schedule trips for their business.
- Scenario: Topping Up Budget
- Given: The BAM is on the Home Dashboard and wants to top up their budget.
- When: The BAM clicks on the "Top Up" button within the "Call to Action" section.
- Then: The BAM should be immediately redirected to the payment section, where they can conveniently top up their budget.
- Scenario: Paying Due Budget
- Given: The BAM is on the Home Dashboard and needs to pay an outstanding due budget.
- When: The BAM clicks on the "Pay Due Budget" button within the "Call to Action" section.
- Then: The BAM should be instantly redirected to the payment section, specifically to pay any outstanding due budget.
- Scenario 1: Selecting Default Services for a Country
- Given that I am an OPs Manager using the Admin Panel,
- When I access the service configuration feature, on a specific country,
- Then I should be presented with a list of all enabled B2B services from Dashops.
- Scenario 2: Choosing Default Services for Companies
- Given that I have a list of all enabled B2B services,
- When I select one or more services from the list for a specific country,
- Then these selected services should be set as visible by default for businesses operating in that country.
- Scenario 3: Customizing Default Services for Each Country
- Given that I have the ability to select default services,
- When I repeat the process for different countries,
- Then I should be able to customize the default services separately for each country, tailoring the service offerings to the needs of businesses in that region.
- Scenario 4: Enabling Service for all Companies by Default
- Given that I have chosen a created b2b service
- When I click on the check box -Which is clicked by default-
- Then All companies must be able to have this service visible, and I can’t disable it for any company
- Scenario 5: Disabling Service for all Companies by Default
- Given  that I have chosen a created b2b service
- When I uncheck check box -
- Then All companies must not be able to have this service visible, and I can enable the exception for any company
- Scenario 6: Giving Companies Exception
- Given that the check box, is unchecked,
- When I grant a set of companies an expedition to see the service
- Then the check box will be in the intermediate state and the chosen companies will be the only companies that can see the service
- Scenario 7: Preventing Giving companies Exception
- Given that the check box, is checked,
- When I try grant a set of companies an expedition to see the service
- Then I find the switch button for the exception on those companies will be disabled
- Within the "Trips Overview" section, BAMs should see a bar chart prominently displayed. This bar chart should visually represent the number of trips they have made in the last two weeks.
- Ideally, the bar chart should provide a breakdown by day, allowing BAMs to see their trip history on a daily basis. This visual representation helps BAMs quickly understand their recent activity.
- Adjacent to the bar chart, BAMs should find a widget or information box. This widget should provide details about any conditions or requirements BAMs need to meet to earn discounts or cashback.
- If there are specific trip-related actions or targets BAMs need to achieve to qualify for discounts or cashback, these should be clearly outlined within the widget.
- If no conditions or requirements apply to the BAM's trip history, a button labeled "Contact Support" should be available within the "Trips Overview" section.
- Clicking this button should provide BAMs with a convenient way to reach out to the support team for any inquiries or assistance they may need.
- Book a ride flow: choose rider, route
- Automatically service adds
- The business account manager can access the Business Web App
- The business account manager can select a service from the service list.
- Once a service is selected, a secondary drop-down list should dynamically populate with the service types associated with the selected service.
- The secondary drop-down list should display the available service types in a user-friendly format, such as a drop-down menu or a list of options.
- The business account manager can choose a service type from the second drop-down list.
- The selected service can have an impact on the trip's total price
- Scenario 1: Selecting a Service and Viewing Available Service Types
- Given a business account manager on the booking Trip Screen
- When the manager selects a service from the service list
- Then the secondary drop-down list should populate with the available service types for the selected service
- Scenario 2: Choosing a Service Type
- And the secondary drop-down list populates with the available service types for the selected service
- Then the manager can choose a service type from the second drop-down list
- Scenario 3: Storing the Selected Service Type
- And the manager chooses a service type from the second drop-down list
- Then the selected service may cause a change in the trip Price
- Scenario 1: Accessing Program Settings for Editing
- Given: I am logged in as a BAM on the B2B web app.
- When: I navigate to the program settings page with the intention of editing a program's settings.
- Then: I should be directed to a single, comprehensive "Edit Program Settings" page.
- Scenario 2: Program Settings Consolidation
- Given: I am on the "Edit Program Settings" page.
- When: I scroll or navigate through the page.
- Then: I should find all program settings, including but not limited to:
- Location
- Timing
- Service Types
- Spending Allowance
- Number of Trips per Day
- Price Visibility
- Trip Permissions
- Any other program-specific settings
- Scenario 3: Updating Program Settings
- Given: I am on the "Edit Program Settings" page and want to update program settings.
- When: I make changes or modifications to any program setting.
- Then: I should be able to save these changes directly from the same page, by clicking on the save button
- Scenario 4: Clear and Intuitive Interface
- Given: I am viewing and editing program settings.
- When: I interact with the settings interface.
- Then: The interface should be clear, intuitive, and organized, making it easy for me to understand and adjust program settings.
- Scenario 5: Canceling Edits
- Given: I am on the "Edit Program Settings" page, making changes to program settings.
- When: I decide to cancel my edits.
- Then: I should have the option to discard changes and revert program settings to their previous state.
- Scenario 6: Saving Changes
- Given: I have made valid changes to program settings.
- When: I click the "Save"  button.
- Then: The system should save my changes, and the program settings should be updated accordingly for all relevant users and riders.
- Scenario 7: Create a new program on the home dashboard
- Given: As a BAM on the Program Page
- When: I click on create a new program
- Then: I should be able to create a new program from a single page, so that I don’t need to make multiple CTAs to create the new program, and have all new program parameters in one page
- Scenario 8: Create a new program on the home dashboard
- Given: As a BAM creating a new program
- Then: I should be able to find the default values of the program as follows:
- Location Any location without return trips
- Name empty
- Program purpose empty
- All services selected
- All Days are chosen
- The 24-hour option is chosen
- Unlimited Number of trips per day
- Unlimited Spending allowance
- Price not visible
- Auto approval on all trips
- Scenario 9: Check for unsaved changes
- Given: As a BAM on the Program Page edit screen
- When: I click on refresh page by mistake
- Then: I need to get a pop-screen to confirm on saving those changes or discard them
- Scenario 1: Accessing Business Client Dashboard
- Given: I am logged into the Yassir for Business Admin Panel.
- When: I navigate to the Trips tab in the admin panel interface.
- Then: I should find a clearly labeled button that provides access to the Business Client Dashboard.
- Scenario 2: Navigating the Business Client Dashboard
- Given: I have accessed the Business Client Dashboard via the Trips tab.
- When: I navigate through the dashboard interface.
- Then: I should only see sections related to managing users, programs, and groups. Other sections or functionalities should be hidden or disabled.
- Scenario 1: Accessing the Trips Tab
- Given that I am logged into the Dashops platform as an Admin,
- When I navigate to the dashboard,  I should find a "Trips" tab visible in the navigation menu,
- Then  I click on the "Trips" tab,, I should be directed to the Clients Web App.
- Scenario 2: Access for Non-Super Users
- Given that I am an Admin without super user privileges,
- When I attempt to access the Client Web app,
- Then I should still be able to navigate to the Client Web app without encountering any restrictions or limitations based on my user role.
- Scenario 1: Locating Tutorial Videos
- Given that I am logged into the Yassir for Business platform as a BAM/ Business Admin,
- When I navigate to the home dashboard,
- Then I should find a dedicated section with placeholders for up to four tutorial videos Max. held horizontally
- Scenario 2: Viewing Tutorial Video Thumbnails
- Given that I access the home dashboard section for tutorial videos,
- When I view the placeholders,
- Then each placeholder should display a thumbnail image representing the content of the tutorial video.
- Scenario 3: Clicking on Tutorial Video Placeholder
- Given that, I want to watch a tutorial video,
- When I click on a video, or a video thumbnail,
- Then I should be directed to a- pop a screen-  where I can view the selected tutorial video.
- Scenario 4: Accessing Relevant Tutorial Topics
- Given that I am on the tutorial video viewing screen,
- When I watch the video,
- Then I should find a call to action to go to the relevant section.
- Scenario 5: Navigating Through Tutorial Videos
- Given that I finish watching one tutorial video,
- When I want to watch another,
- Then I should be able to navigate back to the home dashboard and select another placeholder to access a different tutorial video.
- Scenario 6: Watching the video
- Given that I’m watching a video
- When I play it
- Then it should work on a YouTube video player
- Scenario 7: Collapsing/ Expanded the video list
- Given that as a BAM/ Business Admin I have collapsed/ Expanded the list of the videos
- When I refresh the page or log out and log in
- Then I should find the page collapsed or expanded as I left it
- Note: we need to add GA events to this section
- [BAM DASHBOARD] Making sure all the analytics on the home page is working as expected for the business, trips and ongoing trips analytics.
- [BAM DASHBOARD] Check real time notification on trips status update.
- [BAM DASHBOARD] Trip is canceled in case for instance no driver available, the refund should be initiated and the trip amount should be refunded to the business balance.
- [BAM DASHBOARD] Once you navigate to trips you should see the trips stats.
- [BAM DASHBOARD] Export trips.
- [BAM DASHBOARD] Full flow of trip request till the end with status FINISHED.
- [BAM DASHBOARD] Trip cancel from bam dashboard.
- [BAM DASHBOARD] Check spending allowance on trip request.
- [ADMIN PANEL] Export Trips.
- [ADMIN PANEL] Delete Business.
- [ADMIN PANEL] Update Business Budget.
- [ADMIN PANEL] Get trip details from business trips list.
- Scenario 1: Ongoing Event Indicator on Switching to Ride History or Ride Details
- Given I’m a website rider
- When I switch from the Home page to the “Ride History” or “Ride Details” screen
- Then I should see an “Ongoing Event” indicator showing the current status of my ongoing ride or dispatch (e.g., "Looking for a driver," "Your driver is on the way," "Your driver has arrived," or "On the way to your destination").
- And I should be able to click on the indicator to be redirected to the corresponding page of the ongoing event
- Note: The ongoing widget statuses will change dynamically based on the current event state, such as dispatching a driver, driver on the way, driver arrived, etc.
- Scenario 2: Redirect to Ongoing Ride on Click
- And there’s an ongoing ride with a status of “Looking for a driver,” “Your driver is on the way,” “Your driver has arrived,” or “On the way to your destination”
- When I press the “View more” CTA on the “Ongoing Event” indicator
- Then I should be redirected to the relevant ongoing screen based on the current status of the event
- Note: The ongoing widget will include a phone icon, that is clickable and redirects me to the phone dialer for each device I'm using.
- Scenario 3: Redirect to Dispatch Page on Click
- And there’s an ongoing dispatch with the status of “Looking for a driver,”
- Then I should be redirected to the the relevant ongoing screen based on the current status of the event
- Note: The ongoing widget status will dynamically reflect the dispatch stage, such as “Looking for a driver” or “Your driver has arrived.”
- Scenario 4: Completed Ride - Redirect to Review Screen
- When I’m on the "Ride History" or "Ride Details" page and the ride is completed,
- Then I should see a "Finished Ride" pop-up indicating the completion of the ride.
- When I click on the "OK" button on the pop-up,
- Then I should be redirected to the Review screen to rate my ride experience.
- Scenario 5: No Nearby Driver - Redirect to Home Screen
- When I’m on the "Ride History" or "Ride Details" page and there is no nearby driver available,
- Then I should see a "No Nearby Driver" pop-up.
- When I click on the "Try Again" button on the pop-up,
- Then I should be redirected to the Home screen to attempt booking again.
- Scenario 6: Canceled Ride - Redirect to Home Screen
- When I’m on the "Ride History" or "Ride Details" page and my ride has been canceled,
- Then I should be redirected to the Home screen to begin a new ride request.
- Scenario 7: Call Driver Button Behavior
- When I’m on the “Ride History” or “Ride Details” page and I press the “Call Driver” button (which is available when my driver is on the way or has arrived)
- Then the appropriate calling application should open based on my device:
- On macOS: FaceTime should open.
- On Windows or other desktop operating systems: The default calling application (e.g., Skype, Zoom) should open.
- On iOS or Android: The default dialer should open.
- Scenario 8: Call Driver Button Behavior on Home Screen (Post Ride Acceptance)
- When my driver has accepted the ride request and I am on the Home screen
- And the status of my ride is "Your driver is on the way," "Your driver has arrived," or "On the way to your destination"
- Then I should see a "Call Driver" button
- When I press the "Call Driver" button
- Note: The button should be available as soon as the driver accepts the ride and the status is updated to indicate that the ride is in progress (e.g., "Your driver is on the way").
- Additional Notes
- The “Ongoing Event” indicator will show the current ride or dispatch status and allow navigation to the relevant screen.
- Ongoing widget statuses include:
- "Looking for a driver"
- "Your driver is on the way" (with a clickable phone icon that opens the appropriate calling application based on user’s device)
- "Your driver has arrived" (with a clickable phone icon that opens the appropriate calling application based on user’s device)
- "On the way to your destination" with the driver
- Clicking the ongoing event indicator will take the user to the appropriate screen based on the status.
- The “Call Driver” button behavior will dynamically open the appropriate calling application based on the user’s device.
- Scenario 1: Opening the users dropdown
- Given that I'm logged into the BAM Dashboard
- When I navigate to the “Trips“ section
- Then I should be able to see a dropdown that lists the users in the business
- AND I should be able to select any user from the list to filter out the trips for him
- Scenario 2: Searching the user's dropdown
- When I navigate to the “Trips“ section and open the users dropdown
- Then I should be able to see a search bar in the dropdown
- AND I should be able to type and search users in the dropdown

## Superseded Features

> These features were overridden by newer tickets.

- ~~CMB-11734: Home Dashboard Analytics~~ → Replaced by CMB-24546
- ~~CMB-3227: Dev FE: Forget Password~~ → Replaced by CMB-3226
- ~~CMB-10204: Rebook Trips from Dashboard~~ → Replaced by CMB-24546
