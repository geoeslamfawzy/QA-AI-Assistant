# B2B Portal — Programs

---
id: "jira-b2b-portal-programs"
title: "B2B Portal — Programs"
system: "B2B Corporate Portal"
type: "jira_context"
source: "auto-generated"
tags: ["jira-context","auto-generated","b2b-corporate-portal","b2b","craft_sync","crafttheme_mobility"]
last_synced: "2026-03-12T00:00:00.000Z"
ticket_count: 55
active_ticket_count: 44
---

## Overview

The **Programs** module in the B2B Corporate Portal allows Business Account Managers (BAMs), Business Admins, and Program Moderators to create, configure, and manage corporate ride programs for their employees. Programs define the rules under which business riders can book trips — including allowed locations, service types, schedules, spending allowances, price visibility, and trip approval workflows. The module also covers giftcard management, multi-stop trips, challenges, and cross-platform support features such as Arabic localization and Zendesk chat support.

---

## Features

---

### 1. Program Creation & Naming

**How it works:**
New businesses registering for the first time are immediately redirected to the Home Dashboard activation screen after entering their company information. No program setup wizard is shown. The **"Unlimited" program is pre-selected by default**. Program setup steps (purpose, trip parameters, work rules, etc.) that existed in early flows have been removed from the first-time registration path (superseded by CMB-18872).

For A/B testing or country-specific overrides, the default program shown can be configured per business/country.

**Business rules:**
- Program names must start with a letter.
- Program names are limited to a maximum number of characters (exact limit not specified in tickets; must be defined in design spec).
- Each program has a unique textual name field.
- Multiple groups can be assigned to the same program.
- When creating a new program from the programs list screen, a dropdown allows selecting one or more groups to assign to the new program.

**Program Purpose (legacy — available in program settings, not required at onboarding):**
Users can choose a trip purpose from a predefined list. This step is optional (skippable). Available options:
- Back and forth from Office
- Campus Shuttle
- Late Night
- Candidate Interviews
- Customer Rides
- Emergency Rides
- Event
- Custom Travel Programme
- Other options

---

### 2. Program Trip Parameters & Work Rules

**How it works:**
When setting up or editing a program, the BAM can define location restrictions, allowed days/hours, and service types.

**Location parameters:**
- Location search input and map pin are both available.
- Up to 5 stops can be defined (see Multi-Stops section for booking-time behavior).
- Fields can be left empty; the user is warned, and the default is **any pickup to any drop-off**.
- Three restriction modes are supported:
  - Defined pickup → defined drop-off only
  - Defined pickup → any drop-off
  - Any pickup → defined drop-off

**Schedule parameters:**
- Days and hours can be selected from a list or entered as a custom set per day.
- If left empty, users can request trips at any time (with a warning shown at setup).

**Service types:**
- The BAM can select one or more service types for the program.
- At least one service must remain selected — the Save Changes button is disabled if all services are unselected (CMB-13439).
- A script enforced that **Business Classic** and **Business Comfort** services are enabled for all business programs on production, while disabling the non-business Classic and Comfort if they were enabled (CMB-12667).

**Round Trip option:**
- A checkbox/toggle in program setup allows designating trips as round trips by default.
- If not enabled, trips are not considered round trips and no round-trip popup appears.
- A clear visual indicator shows when round trips are enabled (CMB-9732).

---

### 3. Spending Allowance

**How it works:**
The BAM sets a spending allowance at the program level. The system enforces this limit at booking time.

**Business rules:**
- Three coverage modes are available:
  - Cover a **percentage** of the trip cost.
  - Cover the trip cost up to a **fixed monetary amount**.
  - Set a **spending allowance for all program members** collectively.
- Spending allowance can be more or less than the total remaining or initially allocated budget.
- If a rider's trip cost exceeds the spending allowance:
  - An error message is shown stating the trip cost exceeds the BAM-defined limit with guidance on next steps.
  - A CTA is shown to go back and modify the pickup/destination.
  - If one service exceeds the allowance but another does not, only the services whose cost is within the allowance are shown to the rider.

---

### 4. Price Visibility

**How it works:**
BAMs can configure whether trip prices are visible to business riders within a program. This is set at program level and can be overridden per user.

**Program-level settings (CMB-8912):**
- **Visible**: Trip prices are shown to riders during booking.
- **Hidden**: Trip prices are hidden; a message is displayed indicating prices are not visible.
- **Default**: Hidden (if not specified at program setup).

**User-level exceptions (CMB-9014):**
Within the user list, BAMs can set individual exceptions:
- **Follow Program Rules** (default): Rider follows the program's price visibility setting.
- **Hide Price**: Rider never sees prices, regardless of program rules.
- **See Price Regardless of Rules**: Rider always sees prices, even if the program hides them.

**Override rules:**
- Admins and BAMs **always see trip prices** on the WebApp, regardless of program or user-level settings.
- Program Moderators **always see prices** on both mobile and WebApp, regardless of program rules.
- When a new user is invited to the business, they **follow program rules by default**.
- When a rider is moved to a new program:
  - If following program rules → they follow the new program's rules.
  - If they have a user-level exception → their exception is preserved.

---

### 5. Trip Approval & Auto-Dispatch

**How it works:**
Programs can be configured for auto-dispatch (automatic approval) or manual approval of trip requests.

**User-level exceptions (CMB-9691):**
BAMs and Business Admins can grant per-user exceptions:
- **Follow Program Settings** (default): User follows the program's default approval mode.
- **Auto-Approval**: User's trips are always auto-approved, regardless of program setting.
- **Manual Approval**: User's trips always require manual approval, regardless of program setting.

**Business rules:**
- The auto-approval time limit can be set between **1 minute (minimum)** and **60 minutes (maximum)**.
- Trips that exceed the approval time limit expire with a **Rider Canceled** status.
- Program Moderators are **always auto-approved** (autonomous trip requests), regardless of program rules.

**Ride Justification (CMB-29386 — Status: To Do):**
When a rider is part of a program with auto-dispatch **disabled**, they must provide a ride justification when booking:
- A required input field labeled **"Ride Justification"** is shown on the "Book a Ride" screen.
- Character limit: **150 characters**.
- Applies to both instant and booked-for-later trips.
- The justification text is displayed unchanged on the trip detail screen in the history section.

---

### 6. Trip Booking (BAM / Admin / Program Moderator)

**How it works:**
BAMs, Business Admins, and Program Moderators can book trips for themselves, other business riders in their program, or guest riders.

**Booking for self or another business rider (CMB-4179, CMB-4191):**
- By default, the BAM books for themselves.
- A searchable dropdown lists all available business riders (search by name or email).
- The system validates all program parameters before booking: time/date, locations, services, spending allowance, number of allowed trips per day.
- Confirmation is sent to both the BAM and the rider.

**Booking for a guest rider (CMB-13256):**
- Guest riders are added by entering their phone number and name directly on the booking screen.
- **Program parameter checks do NOT apply to guest riders** — only the budget is checked.
- International phone numbers are supported; all country flags are available (not restricted to DZ/MA/SN/TN), but the default flag matches the business's country.
- For scheduled guest trips, the guest rider receives an SMS when the driver starts heading to the pickup point.
- A business rider's phone number cannot be used to book them as a guest — an error is shown.
- If a guest rider later becomes a business rider, they are automatically removed from the guest list.

**Scheduled trips (CMB-4721):**
- Full program parameter validation applies.
- Cost is deducted from the budget upon booking.
- Trip status is synced throughout the lifecycle.
- If a trip is canceled, the deducted amount is refunded to the budget.
- No changes can be made to an assigned trip until it starts.

**Trip cost estimation (CMB-4188):**
- Estimated cost is calculated in real-time, including surge pricing.
- The user can change the selected service and see the updated estimate.
- If the trip cost exceeds the spending allowance or daily trip count, booking is blocked.
- If the selected locations don't comply with program location rules, booking is blocked.

---

### 7. Multi-Stop Trips (CMB-13268)

**How it works:**
BAMs, Program Moderators, and Business Admins can add up to **3 intermediate stops** to a trip (maximum enforced by the plus button being disabled at the limit).

**Business rules:**
- Only the **pickup and final destination** are checked against program location parameters. Intermediate stops are **not checked**.
- Total trip cost is the sum of each sub-trip cost (pickup→stop1, stop1→stop2, …, lastStop→destination), calculated separately and then summed, with applicable discounts applied at the end.
- Stops can be rearranged before confirming the trip.
- The confirmation screen shows all stops before the user confirms.
- If the trip ends at an intermediate stop, the rider receives a **refund** for the unfinished portion (new estimated cost minus initially estimated cost).
- Multi-stop trips count as **one trip** for business discount calculations.
- In exported trip reports, a column indicates whether the trip is a multi-stop trip, with separate columns for each intermediate stop labeled "Intermediate Stop N."

---

### 8. Program Moderator Role (CMB-9991, CMB-22160)

**How it works:**
A BAM can elevate a Business Rider to a Program Moderator, or downgrade a Business Admin to a Program Moderator.

**Role change behavior:**
- **Rider → Program Moderator**: The rider receives an email with a generated password and can also log in via Google or other third-party tools.
- **Admin → Program Moderator**: The admin receives an email about the role change and keeps their existing password.
- **Program Moderator → Business Admin**: The moderator receives an email with instructions for the admin role and keeps their existing password.

**Capabilities:**
- Can book trips for themselves or **any other rider in the same program only**.
- Prices are **always visible** to Program Moderators.
- Trip requests are **always auto-approved** (autonomous), regardless of program rules.
- Program parameters apply: location, timing, service, spending allowance, number of trips per day.

**Access restrictions:**
- Full access: **Booking section** and **Profile section** (password and personal info only).
- **Read-only**: Programs, Groups, Users, Trip History, Payment Screen.
- Notifications are scoped to their own program — moderators only see notifications for trips requested by riders in their program.

**Program reassignment:**
- When moved to a new program (active or replacing a deactivated one), the moderator follows the new program's rules and can only book riders in the new program.

---

### 9. Programs Screen — Redesign (CMB-29301)

**Current UI behavior:**
- The **initial screen is the program list**, not the analytics dashboard.
- Programs can be filtered by a **dropdown**: "Active," "Inactive," "All."
- **Actions column:**
  - Active program: "De-activate" and "Edit" options.
  - Inactive program: "Activate" and "Delete" options.
- Clicking a program opens a dedicated **details screen** showing the total number of riders assigned.
- The "Create a New Program" button opens a creation form that includes a **dropdown for assigning one or more groups** to the new program.

---

### 10. Challenges (CMB-26718)

**How it works:**
BAMs, Business Admins, and Program Moderators can view and track business challenges with cash-back rewards through the WebApp Challenges section.

**Active challenges view:**
- Shows the current ongoing challenge with its goals.
- Shows upcoming challenges starting the next week (list updated daily by end of day).

**Progress tracking:**
- A real-time progress bar updates on each completed trip.
- Trips that are later canceled by dash-ops do **not** impact challenge progress.

**Challenge history:**
Each past challenge displays: Challenge Name, Validity Date, Reward (cash-back %), Status (Partially Completed / Completed / Expired), and a "View Challenge Details" action.

**Notifications:**
- **Completion notification**: Sent at the end of the challenge date, stating the cash-back % earned from the challenge and informing that payout is processed in the end-of-month invoice. Click navigates to challenge details.
- **Upcoming challenge notification**: Sent **7 days before** the challenge starts. Click navigates to challenge details.
- If the challenge is deleted/disabled after the notification was sent, clicking the notification redirects to the Challenges screen (not an error).

**Dashboard banner:**
A banner on the main dashboard screen links directly to the Challenges section.

**Admin updates:**
- If an upcoming challenge is deleted/disabled in AdminPanel, it is removed from the upcoming challenges list.
- If an upcoming challenge is edited in AdminPanel, the changes are reflected in the WebApp.

---

### 11. Gift-Card Flow (CMB-31160)

**How it works:**
Business Admins can purchase giftcard templates, configure usage rules, track utilization, download, and revert unused value back to budget.

**Browsing & purchasing (Scenarios 01–03):**
- "Buy Giftcards" section lists all templates available for the company's country.
- Each template shows: monetary amount, visual theme, and a blurred voucher image.
- If the company budget is insufficient, the "Purchase" button is **disabled** with an "Insufficient Budget" indicator.
- On purchase, the price is **immediately deducted** from the company budget, and the user is redirected to the **Coupon Setup screen**.

**Coupon Setup (Scenario 04):**
All settings are optional and default to the values listed:

| Setting | Default |
|---|---|
| Start Date / End Date | UNLIMITED |
| Start Time / End Time | UNLIMITED |
| Min Trip Price / Max Trip Price | UNLIMITED |
| Percentage Discount | 50% |
| Max Total Usage | UNLIMITED |
| Max Usage Per Day | 1 trip per user |
| Pickup / Dropoff Locations | ANYWHERE TO ANYWHERE |

Setup can be skipped entirely — defaults are applied automatically. Clicking **"Finalize Coupon Setup & Generate Coupon"** activates the coupon with the defined rules.

**Viewing purchased giftcards (Scenario 05):**
In "My Giftcards," each giftcard shows: Original Value, Current Remaining Value, Voucher Code (blurred, visible on click), and all configured coupon settings. A "View Trips" option is available per giftcard.

**Trip usage log (Scenario 06):**
Clicking "View Trips" opens an overlay/table with: trip date & time, amount used, rider's partially masked phone number, itinerary (departure/destination), and driver details (full name, rating, phone number, car info).

**Downloading (Scenario 07):**
A "Download Giftcard" button generates a printable PDF containing: unblurred voucher code, pickup/dropoff locations, percentage discount, start/end date, start/end time, min/max trip price, and max usage per day.

**Reverting remaining value (Scenarios 08–13):**
- A **"Revert Value to Budget"** button is shown for any active giftcard with remaining value greater than zero — even if the end date has passed.
- Clicking it shows a confirmation dialog warning that the giftcard will be immediately deactivated and all remaining usage blocked.
- On confirmation: the remaining value is instantly added back to the company's general budget, the voucher code is disabled, and the giftcard is labeled **"Reverted"**.
- A financial reversal log is recorded in the AdminPanel.

---

### 12. Zendesk Chat Support Integration (CMB-19309)

**How it works:**
A chat support widget is persistently attached to all screens in the B2B WebApp for BAMs, Program Moderators, and Business Admins.

**Behavior:**
- The widget appears in the bottom-right corner (or designated location) with a "Support" or "Help" label/icon.
- Clicking opens a chat window for direct query submission.
- Submitted requests are routed to the **dedicated B2B Support team** via the "B2B" Zendesk form.
- The widget remains visible and accessible while navigating between pages, and previous conversation history is preserved.

---

### 13. Arabic Localization (CMB-9331)

The Program List and main Programs page are fully available in Arabic:
- All text, labels, program names, descriptions, and action buttons switch to Arabic when the Arabic language option is selected.
- Layout adapts to **RTL (right-to-left)** text direction.
- All program management actions (create, edit, manage) display Arabic labels in Arabic mode.

---

### 14. Trip Dispatching & Validation

**Real-time validation at booking:**
When a rider requests an instant or scheduled trip, the system validates the request against all program parameters in real time:
- Time and day constraints
- Location restrictions
- Allowed service types
- Spending allowance
- Daily trip count limit
- Budget availability

If any check fails, an appropriate error message is shown with the reason. If the budget is insufficient, a specific insufficient-budget error is shown.

**Day/time errors (CMB-10052):**
- If the rider tries to book on a restricted day/time for an **instant trip**: the "Request" button is **disabled**.
- If the rider selects a restricted day/time for a **scheduled trip**: an error message prompts them to choose a valid date/time.
- If the day/time is within allowed parameters: the "Request" button is **enabled**.

---

## Business Rules Summary

| Rule | Detail |
|---|---|
| Program name | Must start with a letter; character limit applies |
| Default price visibility | Hidden |
| Default trip approval for new users | Follow Program Rules |
| Default user exception (price) | Follow Program Rules |
| Program Moderator price visibility | Always visible |
| Program Moderator trip approval | Always auto-approved (autonomous) |
| Admin / BAM price visibility on WebApp | Always visible regardless of program rules |
| Guest rider parameter checks | Only budget is checked; all other program parameters are skipped |
| Multi-stop limit | Max 3 intermediate stops |
| Multi-stop program location check | Only pickup and final destination are checked; intermediate stops are exempt |
| Multi-stop trip for discount calculation | Counts as 1 trip |
| Auto-approval time limit | 1 minute minimum, 60 minutes maximum; expired requests = Rider Canceled |
| At least one service required | Save Changes is disabled if all services are unselected |
| Canceled trip budget refund | Full amount refunded to program budget |
| Giftcard default discount | 50% |
| Giftcard default daily usage | 1 trip per user |
| Giftcard revert | Available even after end date; disables voucher and labels giftcard "Reverted" |
| Challenge progress | Trips later canceled by dash-ops do NOT reduce challenge progress |
| Challenge upcoming notification lead time | 7 days before challenge start |
| Ride Justification character limit | 150 characters |
| Ride Justification requirement | Only applies to programs with auto-dispatch disabled |
| Business Classic & Business Comfort | Enforced as enabled for all business programs on production |

---

## Changelog

| Change | Replaced By | Ticket |
|---|---|---|
| Program setup wizard shown at first-time registration (purpose, parameters, work rules) | Removed. New businesses go directly to Home Dashboard activation. Unlimited program pre-selected. | CMB-18872 |
| Gift-card flow: Scenarios 08 (Revert Value) was truncated in existing context | Full revert flow added (Scenarios 08–13), including confirmation dialog, budget restoration, voucher disabling, "Reverted" label, and AdminPanel logging | CMB-31160 |
| Program Moderator notification scoping was broken (saw all company notifications) | Fixed: Moderators only receive notifications for trips in their own program | CMB-22160 |
| Program list landing page was analytics dashboard | Changed: landing page is now the program list; analytics dashboard no longer shown by default | CMB-29301 |
| Program filter was a set of tabs/buttons | Changed: filter is now a dropdown with "Active," "Inactive," "All" | CMB-29301 |
| Inactive programs had no distinct actions | Added: Inactive programs show "Activate" and "Delete"; Active programs show "De-activate" and "Edit" | CMB-29301 |
| Program creation did not include group assignment in the creation form | Added: Group assignment dropdown added to new program creation form | CMB-29301 |

---

## Tickets (55 tickets, oldest → newest)

### CMB-154: Dev - BE: Program Purpose
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Initial backend work for program purpose selection. Defined the list of trip purposes (Back and forth from Office, Campus Shuttle, Late Night, Candidate Interviews, Customer Rides, Emergency Rides, Event, Custom Travel Programme, Other). Step is skippable.

---

### CMB-155: Dev - BE: Setting Program Trip Parameters
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Backend for location parameters. Location search, map pin, up to 5 stops, three pickup/dropoff restriction modes, day/hour selection and custom hours per day. Empty fields allowed with warnings; defaults to any location and any time.

---

### CMB-156: Dev - BE: Setting Program Trip Work Rules
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Backend for schedule rules. Choose days/hours from a list or custom per day. Empty allowed with warning; default is any time.

---

### CMB-157: Dev - BE: Program Naming
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Program names must start with letters; limited to a character count.

---

### CMB-163: Dev - BE: Setting Program Service Types
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** BAM can select more than one service type per program.

---

### CMB-169: Dev - BE: Creating More Programs
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Multiple groups can be assigned to the same program.

---

### CMB-170: Dev - BE: Naming Programs
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Each program has a unique name field. Names start with a letter; limited by character count.

---

### CMB-195: Dev: BAM Password
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-07-29
**Summary:** Password setup for BAM. Requires password confirmation and includes a forgotten password option.

---

### CMB-283: Design: Program Purpose
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2022-08-09
**Summary:** Design spec for program purpose selection. Same options as CMB-154; step is skippable.

---

### CMB-298: Design: Business Account Manager Password
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-08-10
**Summary:** Design spec for BAM password setup with confirmation and forgot-password flow.

---

### CMB-403: Dev - FE: Setting Program Trip Parameters
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-08-23
**Summary:** Frontend for location parameters. Same rules as CMB-155: location search, map pin, 5 stops, empty fields allowed with warnings.

---

### CMB-405: Dev - FE: Program Naming
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-08-23
**Summary:** Frontend for program naming. Names start with letters; character-limited.

---

### CMB-410: Dev - FE: BAM Password
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-08-23
**Summary:** Frontend for BAM password setup. Confirmation field required; forgot password option included.

---

### CMB-485: Dev - FE: Setting the Program Spending Allowance
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-08-30
**Summary:** Frontend for spending allowance. Three modes: cover a percentage, cover up to a fixed amount, or set a collective allowance for all members. Allowance can exceed or be below allocated budget.

---

### CMB-560: Dev-BE: Dispatching Request
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2022-09-06
**Summary:** Backend ensures instant and scheduled trips comply with program parameters (time, day, remaining group budget) before dispatch.

---

### CMB-563: Android - Dev-App: Dispatching Request
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-09-06
**Summary:** Android app validates trips in real time against program parameters. Error messages shown for violations. Budget sufficiency checked separately.

---

### CMB-921: Dev - BE: Setting the Program Spending Allowance
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-09-29
**Summary:** Backend for program-level spending allowance for all members. Allowance can exceed or be below total budget.

---

### CMB-1151: Dev - BE: Program Purpose
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-10-09
**Summary:** Additional backend work for program purpose. Same purpose list as CMB-154; step remains skippable.

---

### CMB-1199: Design: Dispatching Request
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2022-10-09
**Summary:** Design for trip dispatch validation. Real-time parameter checking; error messages for violations; budget check scenarios.

---

### CMB-1707: Dev BE: Delete User
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-11-07
**Summary:** Backend for BAM to delete riders, removing them from the business program.

---

### CMB-1802: Design: Delete User
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2022-11-16
**Summary:** Design spec for rider deletion flow.

---

### CMB-1976: Dev FE: Implement Program List Search
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2022-11-22
**Summary:** Frontend search implementation for the program list.

---

### CMB-2118: BE: Program Details
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2022-11-29
**Summary:** Backend for retrieving and displaying program details.

---

### CMB-2535: Dev BE: Deleting a Program
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2022-12-18
**Summary:** Backend for program deletion.

---

### CMB-4179: Booking Trips
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2023-03-15
**Summary:** BAM can book trips for themselves or other business riders. Validates all program rules. Searchable rider dropdown (by name or email). By default, BAM books for themselves.

---

### CMB-4188: Design — Trip Cost Estimation
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2023-03-16
**Summary:** Real-time trip cost estimation including surge pricing. Booking blocked if trip exceeds spending allowance, daily limit, or location restrictions.

---

### CMB-4191: Design — Book for Another Rider
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2023-03-16
**Summary:** Design spec for booking on behalf of another business rider. Same rules as CMB-4179.

---

### CMB-4721: Booking Scheduled Trip
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2023-04-06
**Summary:** BAM can book scheduled trips for self or others. Full program parameter validation. Cost deducted on booking. Canceled trip refunds budget. Trip status synced throughout lifecycle.

---

### CMB-8912: Ride Price Visibility on Program Level
**Status:** Done | **Priority:** P0 - Critical | **Type:** Story
**Created:** 2023-09-06
**Summary:** Program-level price visibility toggle (Visible / Hidden). Default is Hidden. BAMs and Admins always see prices on WebApp. Moderators also always see prices.

---

### CMB-9014: Price Visibility / Hiding Exception
**Status:** Done | **Priority:** P0 - Critical | **Type:** Story
**Created:** 2023-09-12
**Summary:** Per-user price visibility exception: Follow Program Rules (default), Hide Price, See Price Regardless of Rules. Exceptions persist when moving between programs.

---

### CMB-9331: Arabic Version of Program Management
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2023-09-27
**Summary:** Full Arabic localization for Program List and main Programs page, including RTL layout support and Arabic labels for all actions.

---

### CMB-9691: User Exception for Trip Approval
**Status:** Done | **Priority:** P3 - Low | **Type:** Story
**Created:** 2023-10-13
**Summary:** Per-user trip approval exceptions: Follow Program Settings (default), Auto-Approval, Manual Approval. Auto-approval time limit: 1–60 minutes. Expired requests get Rider Canceled status.

---

### CMB-9732: Edit Back and Forth (Round Trip) Button
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2023-10-16
**Summary:** Round-trip toggle in program setup. If enabled, all trips in the program are round trips by default. Clear visual indicator shows when enabled.

---

### CMB-9991: Program Moderator
**Status:** Done | **Priority:** P0 - Critical | **Type:** Story
**Created:** 2023-10-24
**Summary:** BAM can assign riders the Program Moderator role. Moderators book for themselves or any rider in their program, always see prices, are always auto-approved. Access limited to Booking and Profile sections (read-only elsewhere). See Feature 8 for full details.

---

### CMB-10048: Spending Allowance Error
**Status:** Done | **Priority:** P3 - Low | **Type:** Story
**Created:** 2023-10-26
**Summary:** Error handling when trip cost exceeds spending allowance. CTA to edit locations. Only services within the allowance are shown. Three spending allowance modes confirmed.

---

### CMB-10052: Chosen Time / Date Error
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2023-10-26
**Summary:** For instant trips outside allowed time/day: Request button is disabled. For scheduled trips outside allowed time/day: error message shown. Within parameters: Request button is enabled.

---

### CMB-11873: Change Group UI Improvements
**Status:** Done | **Priority:** P3 - Low | **Type:** Improvement
**Created:** 2024-01-18
**Summary:** Bug fix — added missing "Change Program" tooltip on the action button.

---

### CMB-12667: Enforce Business Service Enablement on Prod
**Status:** Done | **Priority:** P0 - Critical | **Type:** Story
**Created:** 2024-02-20
**Summary:** Script to enforce Business Classic and Business Comfort services as enabled for all business programs on production, and disable non-business Classic/Comfort if previously enabled. Other services unaffected.

---

### CMB-13098: Program Tab Analytics
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2024-03-12
**Summary:** Analytics tracking for Program main screen sessions (B2B_SC_ProgramMainScreenSessions).

---

### CMB-13256: Book for a Guest User
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2024-03-20
**Summary:** BAMs, Admins, and Moderators can book trips for guest riders by entering their phone number and name. No program parameter checks apply to guests — only budget. International phone numbers supported. See Feature 6 for full details.

---

### CMB-13268: Multi-Stops in Trip Booking
**Status:** Done | **Priority:** P0 - Critical | **Type:** Story
**Created:** 2024-03-20
**Summary:** Up to 3 intermediate stops per trip. Program location checks apply only to pickup and final destination. Sub-trip pricing model. Rearrangeable stops. Refund if trip ends early at an intermediate stop. Counts as 1 trip for discounts. See Feature 7 for full details.

---

### CMB-13270: Multi-Stops as Program Parameters
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2024-03-20
**Summary:** Multi-stop location configuration in program settings. Up to 5 stops definable. Three pickup/dropoff restriction modes. Day/hour schedule rules. Empty fields allowed with warnings.

---

### CMB-13290: How to Create a Program?
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2024-03-20
**Summary:** Internal documentation/FAQ for program creation flow.

---

### CMB-13439: Inform User They Cannot Unselect All Services
**Status:** Done | **Priority:** P2 - Medium | **Type:** Improvement
**Created:** 2024-03-26
**Summary:** When the user tries to unselect all services for a program, the Save Changes button becomes disabled, preventing a program from having zero services.

---

### CMB-13789: Detailed FAQ on Program Page
**Status:** Done | **Priority:** No Priority | **Type:** Story
**Created:** 2024-04-12
**Summary:** FAQ content added to the Program page.

---

### CMB-13810: Custom Time Format Should Be hh:00
**Status:** Done | **Priority:** P2 - Medium | **Type:** Improvement
**Created:** 2024-04-15
**Summary:** Custom time range dropdowns on program settings page now show times in hh:00 format.

---

### CMB-17334: Field Collapses When Group's Assigned Program Has No Value
**Status:** Done | **Priority:** P2 - Medium | **Type:** Improvement
**Created:** 2024-08-26
**Summary:** Bug fix — field no longer collapses when the group's assigned program has no value.

---

### CMB-18872: Removing Program Setup
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2024-10-22
**Summary:** **Supersedes early onboarding flow.** First-time business registration now skips the program setup wizard entirely. User is redirected directly to the Home Dashboard activation screen. The "Unlimited" program is pre-selected by default. A/B test configuration supported per country/business.

---

### CMB-19071: UI Element Displayed on Menu Box for Program Moderators
**Status:** Done | **Priority:** P3 - Low | **Type:** Improvement
**Created:** 2024-10-28
**Summary:** Bug fix — corrected a UI element incorrectly displayed in the menu box for program moderators on the WebApp.

---

### CMB-19309: Zendesk Integration
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2024-11-05
**Summary:** Persistent Zendesk chat support widget on all WebApp screens for BAMs, Moderators, and Admins. Routed to the B2B Support team. Maintains conversation history across navigation. See Feature 12 for full details.

---

### CMB-22160: Program Moderator Notification Scoping Fix
**Status:** Done | **Priority:** P2 - Medium | **Type:** Improvement
**Created:** 2025-01-29
**Summary:** **Supersedes CMB-9991 notification behavior.** Fixed bug where Program Moderators saw notifications for trips outside their program. Moderators now only receive trip notifications for riders in their assigned program. Restates and confirms full Program Moderator role spec.

---

### CMB-26718: Business Challenge WebApp Flow
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2025-06-22
**Summary:** Challenges section for BAMs, Admins, and Moderators. Real-time progress tracking, challenge history, cash-back notifications, upcoming challenge alerts (7 days prior), and dashboard banner. Dash-ops cancellations do not affect progress. See Feature 10 for full details.

---

### CMB-29301: Program Section Re-design
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2025-08-31
**Summary:** **Supersedes previous Programs screen layout.** Landing page is now the program list (not analytics). Filter is a dropdown (Active / Inactive / All). Active programs: De-activate + Edit actions. Inactive programs: Activate + Delete actions. Program detail screen shows rider count. New program creation includes group assignment dropdown. See Feature 9 for full details.

---

### CMB-29386: Mobile Ride Justification
**Status:** To Do | **Priority:** No Priority | **Type:** Story
**Created:** 2025-09-02
**Summary:** Riders in programs with auto-dispatch disabled must enter a "Ride Justification" (max 150 characters) when booking. Justification is visible on the trip detail screen in history. **Not yet implemented.**

---

### CMB-31160: [WEBAPP] Gift-Card Flow
**Status:** Done | **Priority:** P1 - High | **Type:** Story
**Created:** 2025-10-20
**Summary:** Full giftcard lifecycle for Business Admins: browse templates, purchase (deducting from budget), configure coupon rules (all optional with defined defaults), view purchased giftcards and their trip usage logs, download printable PDF, and revert unused value back to company budget (with voucher disablement and "Reverted" labeling). AdminPanel logs all reversals. See Feature 11 for full details.