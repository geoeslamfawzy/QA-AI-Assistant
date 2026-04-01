# B2B Portal — Account

## Overview

The Account module within the B2B Corporate Portal provides business administrators with tools to manage their personal profile, company information, security credentials, application preferences, legal compliance documents, and saved addresses. It consolidates profile viewing, editing, password management, and settings into a unified interface. On the Admin Panel side, enterprise accounts can be classified into specific types (Enterprise, Test Account, Media) to support accurate operational reporting.

## Features

### Unified Profile Screen (Personal & Company Info + Password)

The Account section presents a single consolidated profile screen containing Personal Information, Company Information, and Password management — replacing the previously separate sub-menus.

**Screen Structure:**
- **Personal Information section** — displays user details (name, email, phone, job title) in read-only mode by default
- **Company Information section** — displays company details (company name, industry, company size) in read-only mode by default
- **Login & Access section** — password change functionality

**Viewing & Editing Personal/Company Information:**
- Fields are displayed in read-only mode initially
- Clicking "Edit" makes fields editable inline
- User can save or cancel changes
- On successful save, a confirmation message is displayed
- On invalid or incomplete data, clear inline error messages are shown

**Password Change:**
- User must enter current password
- User enters and confirms new password
- Password is updated upon submission if validation rules are met
- Appropriate success/error feedback is provided

**Editable Fields (from account management requirements):**
- Business Email (requires verification of the new email)
- Password (requires entering old password + confirming new password)
- Phone Number
- Name
- Company Name
- All changes require explicit submission and confirmation before saving

### Settings

- Allows the user to change the **Reports Language**
- Available options: **French** or **English**
- This language setting applies to draft future reports, emails, mail language, and company invoices sent to the business admin

### Legal Information

- Section for submitting and managing the company's legal documents
- Displays review status (e.g., "Under review")
- Users can edit or upload legal information

**Required Fields:**
- Legal name
- Legal billing address

**Other Editable Fields:**
- Headquarters
- Postal code
- NIF, NIS, RC, and AI numbers

**Document Upload:**
- Supports NIF, NIS, RC, and AI documents
- Maximum file size: 10 MB
- Accepted formats: PDF, JPEG, PNG

### Favorite Addresses (Saved Addresses Sub-Menu)

Allows users to manage frequently used locations for rides.

**Viewing Saved Addresses:**
- Displays a list of all saved addresses with details
- Shows an empty state if no addresses exist
- Includes a button to add a new address

**Adding a New Address:**
- Click "Add new address"
- Enter location (via modal with search or map selection), Building, Floor, Door, and additional details
- Provide a name/title for the address
- Click "Save" to add; confirmation message: "Home address updated successfully"

**Editing a Saved Address:**
- Click edit to make fields editable inline
- Save or cancel changes
- If saved: address updates, confirmation popup "Address updated successfully"
- If user leaves without saving: edits are ignored
- If cancelled: data remains unchanged

**Deleting a Saved Address:**
- Click delete → confirmation popup: "Are you sure you want to delete this address?"
- "Delete" confirms removal
- "Go back" returns to the saved addresses screen

**Validation Rules:**
- Floor and Door fields: maximum 3 digits
- Location name (title) character limit: TBD (to be decided later)

**Saved Addresses in Ride Booking:**
- When clicking Pick-Up or Drop-off input on the booking screen, favorite addresses appear first in the dropdown list

**Cross-Platform Synchronization:**
- Addresses saved on B2B WebApp are visible on the Super App (Rider App for Android/iOS) and B2C WebApp under the same rider profile

### Business Account Labeling (Admin Panel)

Enables operations teams to classify enterprise accounts for accurate reporting.

**Account Types Available:**
- **Enterprise** (default for all new accounts created via WebApp)
- **Test Account**
- **Media**

**Applicability:**
- Applies to self-registered accounts, manually created accounts on Admin Panel, and accounts migrated from Leads Management

**Test Account Behavior:**
- Excluded from monthly finance reports (not listed)
- Trips excluded from country trip export files

**Media Account Behavior:**
- NOT excluded from monthly finance reports or country trip export files (remains listed)
- A new column is added to monthly finance reports and country trip export files:
  - Column title: "Account Type"
  - Column values: Enterprise, Media

## Business Rules Summary

- Profile fields are read-only by default; editing requires explicit "Edit" action
- Email changes require verification of the new email address
- Password changes require entering the current/old password and confirming the new one
- All profile changes require explicit submission and user confirmation before persisting
- Saved address floor/door fields are limited to 3 digits
- Saved addresses sync across B2B WebApp, B2C WebApp, and Super App (rider profile)
- Default account type for new businesses: Enterprise
- Test Accounts are excluded from all financial reports and trip exports
- Media Accounts remain in reports but are distinguished via an "Account Type" column
- Account type classification applies regardless of account creation method (self-registration, manual, or lead migration)

## Changelog

- **CMB-33309**: Merged previously separate Profile Details, Edit Profile, Password, and Settings sub-menus into a single unified Profile screen under Account. The old multi-screen navigation is now obsolete.
- **CMB-36000**: Introduced three-tier account type classification (Enterprise, Test Account, Media) on the Admin Panel's Enterprise Information section, with reporting exclusion logic for Test Accounts and column tagging for Media accounts.
- **CMB-33310**: Added Favorite Addresses sub-menu with CRUD operations, validation, booking integration, and cross-platform sync.

## Tickets (oldest → newest)

### CMB-33309: [WEBAPP] Merge Profile Details, Edit, Passwords And settings Sub-Menu
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2025-12-29

**Description:**
As a B2B WebApp user, I want to view and manage my personal information, company information, and password from a single profile screen, so that I can update my account details easily without navigating between multiple screens.

**Acceptance Criteria:**
1. Scenario 01: Profile screen structure — single screen with Personal Information, Company Information, and Editing Password sections
2. Scenario 02: View and edit personal/company information — read-only by default, inline editing on "Edit" click, save or cancel
3. Scenario 05: Change password — enter current password, enter and confirm new password, update on valid submission
4. Scenario 06: Validation and feedback — inline error messages for invalid data, confirmation message on success

---

### CMB-36000: [ADMINPANEL] Business Account Labeling for Reporting
**Status:** Done | **Priority:** P2 - Medium | **Type:** Story
**Created:** 2026-03-09

**Description:**
As an operations user, I want to classify business accounts into specific types, so that country export reports reflect accurate operational data and distinguish special accounts such as test accounts and media partners.

**Acceptance Criteria:**
1. Scenario 01: Enterprise Information section shows three account types — Enterprise, Test Account, Media (applies to manual, self-registered, and migrated accounts)
2. Scenario 02: Default account type for new WebApp accounts = Enterprise
3. Scenario 03: Test Account — excluded from monthly finance reports and country trip export files
4. Scenario 04: Media Account — NOT excluded from reports; new "Account Type" column added with values Enterprise and Media