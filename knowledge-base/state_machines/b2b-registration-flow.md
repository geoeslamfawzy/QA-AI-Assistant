---
id: "b2b-registration-flow"
title: "B2B Registration State Machine"
system: "B2B Corporate Portal"
type: "state_machine"
tags: ["registration", "state", "machine", "rule", "lifecycle", "otp", "admin", "active", "validation", "country"]
dependencies: []
keywords: ["registration", "state", "machine", "rule", "lifecycle", "otp", "admin", "active", "validation", "country"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# B2B Registration State Machine

## Module: b2b_registration
## Rule Type: lifecycle
## Risk Level: high

---

## Registration Flow States

```
UNREGISTERED
     ↓ (email submitted + Magic Link sent)
EMAIL_VERIFICATION_PENDING
     ↓ (Magic Link clicked)
SECURITY_SETUP
     ↓ (password + phone OTP verified)
COMPANY_PROFILING
     ↓ ("Get Started" clicked)
PENDING_REVIEW          ← Account created (blocked from dashboard)
     ↓ (Admin: Activate)      ↓ (Admin: Reject)
   ACTIVE                  REJECTED
```

## State Transitions

| From | To | Trigger | Guard |
|------|----|---------|-------|
| UNREGISTERED | EMAIL_VERIFICATION_PENDING | Email submitted | Email must be unique |
| EMAIL_VERIFICATION_PENDING | SECURITY_SETUP | Magic Link clicked | Link valid + not expired |
| SECURITY_SETUP | COMPANY_PROFILING | Password set + OTP verified | Phone must be unique |
| COMPANY_PROFILING | PENDING_REVIEW | "Get Started" submitted | All required fields present |
| PENDING_REVIEW | ACTIVE | Ops Admin approves | N/A |
| PENDING_REVIEW | REJECTED | Ops Admin rejects | N/A |

## Access Control by State

| State | B2B Portal Access | Dashboard Access |
|-------|------------------|-----------------|
| UNREGISTERED | None | None |
| EMAIL_VERIFICATION_PENDING | Registration flow only | None |
| SECURITY_SETUP | Registration flow only | None |
| COMPANY_PROFILING | Registration flow only | None |
| PENDING_REVIEW | "Account under review" screen | Blocked |
| ACTIVE | Full access | Full dashboard |
| REJECTED | "Account rejected" message | Blocked |

## Key Validation Points

- **Email uniqueness**: Checked at UNREGISTERED → EMAIL_VERIFICATION_PENDING
- **Phone uniqueness**: Checked at SECURITY_SETUP (must not be linked to any existing business account)
- **Country auto-lock**: Applied at COMPANY_PROFILING using phone prefix from SECURITY_SETUP
- **Magic Link expiry**: Must be defined (e.g., 24h, 72h) — expired links require re-sending
- **OTP expiry**: Must be defined (e.g., 5 min, 10 min) — expired OTPs require resend

Cross-reference: Rule RW-001 through RW-007 in [registration-workflow-rules.md]
