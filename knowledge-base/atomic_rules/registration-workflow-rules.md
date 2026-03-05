---
id: "registration-workflow-rules"
title: "B2B Registration Workflow Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["registration", "workflow", "rules", "rule", "lifecycle", "otp", "admin", "pending", "status", "active"]
dependencies: []
keywords: ["registration", "workflow", "rules", "rule", "lifecycle", "otp", "admin", "pending", "status", "active"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# B2B Registration Workflow Rules

## Module: b2b_registration
## Rule Type: lifecycle
## Risk Level: high

---

## Rule RW-001: Multi-Step Registration Flow

B2B registration follows a strict 4-step sequential flow. Steps cannot be skipped or reordered:

```
Step 1: Email Verification (Magic Link)
  ↓
Step 2: Security & Contact Verification (Password + OTP)
  ↓
Step 3: Company Profiling (Admin details + Business metadata)
  ↓
Step 4: Account Submission → Pending/Inactive status
  ↓
Admin Panel Review → Active | Rejected
```

## Rule RW-002: Email Uniqueness Validation

At Step 1 (Email Verification):
- System must check if the email is **already registered** before sending a Magic Link
- Duplicate email must return an explicit error: "This email is already associated with an account"
- The Magic Link must expire after a defined TTL (time-to-live — must be specified in requirements)
- Clicking the link twice (replay) must invalidate the first session

## Rule RW-003: Phone Number Uniqueness and Prefix Rules

At Step 2 (Security & Contact Verification):
- Phone number must be **unique** — already linked to an existing business account triggers an error
- OTP sent via SMS to validate ownership
- OTP expiry time must be defined and communicated to the user
- Country is **automatically inferred** from the phone prefix (e.g., +213 → Algeria) — locks Step 3 country field

## Rule RW-004: Account Created as Pending

Upon successful completion of Step 4 ("Get Started" button):
- Account is created with status **"Pending/Inactive"**
- User is **blocked from accessing the B2B Portal dashboard** until status changes to Active
- A notification is triggered in the Admin Panel for the Operations Team to review

If the user logs in while Pending, they must see a clear "Account pending review" screen — not a broken dashboard or 403 error.

## Rule RW-005: Activation and Rejection Rules

The Operations Team reviews the submitted company details and takes one of two actions:
- **Activate**: Status changes to Active; user receives email/SMS confirmation and gains dashboard access
- **Reject**: Status remains Inactive; user should receive rejection notification with next steps

No partial activation is permitted. The transition must be atomic.

## Rule RW-006: Authentication Methods

Users can log in using:
1. Google SSO (Single Sign-On)
2. Standard Email & Password
3. Phone Number (with OTP)

New user navigation: A "Create Account" button must be prominently available for users without an account, redirecting to the registration flow.

## Rule RW-007: Profile Completeness Indicator

After activation, the B2B Dashboard shows an onboarding completion indicator:
- "1/3 Steps completed" progress bar (conditional visibility while setup is incomplete)
- Steps tracked: Update details, Set up team (Users & Groups), Sign contract (Legal Info)
- The indicator must disappear once all 3 steps are marked complete
- Incomplete profile must not block core functionality (ride booking still permitted)

## Summary Matrix

| Step | Key Validation | Blocker If Failed |
|------|---------------|------------------|
| Email entry | Email uniqueness | Cannot send Magic Link |
| Magic Link click | Link validity/TTL | Cannot proceed to Step 2 |
| Password + Phone | Phone uniqueness + OTP | Cannot proceed to Step 3 |
| Company profiling | Country auto-detect | Country mismatch risk |
| Submit | All fields valid | Account stays in draft |
| Admin review | Operations team action | User stuck in Pending |
