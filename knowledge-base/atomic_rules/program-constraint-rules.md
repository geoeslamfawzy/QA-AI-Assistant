---
id: "program-constraint-rules"
title: "Program Constraint Rules"
system: "B2B Corporate Portal"
type: "atomic_rule"
tags: ["program", "constraint", "rules", "rule", "group", "active", "validation", "admin", "ride", "country"]
dependencies: []
keywords: ["program", "constraint", "rules", "rule", "group", "active", "validation", "admin", "ride", "country"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Program Constraint Rules

## Module: programs_groups
## Rule Type: role
## Risk Level: medium

---

## Rule PC-001: Program Deactivation Constraint (Group Transfer)

Before a program can be deactivated, **all assigned groups must be transferred to another active program**. The system must:
1. Block deactivation if any group is assigned to this program
2. Show a transfer dialog listing affected groups and available target programs
3. Only proceed with deactivation after all groups have been migrated

Attempting to deactivate a program with assigned groups must return an explicit validation error — not a silent failure.

## Rule PC-002: Program Deletion Restriction

Only **inactive** programs can be deleted. The mandatory sequence:
1. Deactivate the program first (triggers group transfer per PC-001)
2. Only then can deletion be executed

Active programs are permanently blocked from deletion. The UI must disable the delete action for active programs.

## Rule PC-003: Group Deletion Requires Member Migration

When deleting a group:
- If the group contains members (users), the admin must migrate all members to another existing group before deletion can proceed
- The system must display the count of affected users and a group selection dropdown for migration target
- Deletion without migration must be blocked with a clear error

## Rule PC-004: Program Scheduling Constraints

Programs define when employees are eligible to book rides:

**Frequency options** (mutually exclusive):
- Daily: All days
- Working Days: Blocks Friday and Saturday (North Africa weekend)
- Weekend: Only Friday and Saturday
- Custom: Admin selects specific days

**Time Range options** (mutually exclusive):
- Morning: 05:00–14:00
- Working Hours: 07:00–18:00
- Day: 00:00–24:00
- Custom: Admin-defined time range

Employees attempting to book outside the program's defined schedule must receive a clear rejection message — not a confusing "no drivers available" error.

## Rule PC-005: Geo-Fencing Validation

Programs can restrict ride departure and destination locations:
- Default: "Any location inside the country"
- If a departure is set (e.g., "Boufaric"), employees can ONLY book trips starting from that location
- Round trip toggle: if disabled, return trips from the configured departure are also blocked
- Geo-fence violations at booking time must return a specific error (not a generic failure)

## Rule PC-006: Budget and Ride Limit Enforcement

Programs enforce per-member financial and usage limits:
- **Ride limit**: Max trips per member (set by Day / Week / Month, or unlimited)
- **Budget per ride**: Max spend per trip (set by Trip / Day / Week / Month, or unlimited)

When a limit is reached:
- Booking attempt must be blocked with a specific limit-exceeded message
- The limit resets at the start of the next period (daily/weekly/monthly rollover)
- Rollover must be atomic — no ride booked in the boundary second between old and new period

## Rule PC-007: Ride Approval Flow

If the "Ride request auto-approval" toggle is **disabled** for a program:
- ALL rides booked by members of that program require manual Business Admin approval
- Unapproved rides appear in the "Ride Requests" tab (not in Ongoing/Upcoming)
- Business Admin must explicitly Approve or Reject each request
- If approved: ride proceeds normally
- If rejected: rider must be notified with reason

The approval step adds latency — this must be communicated clearly in UX (no false "ride booked" confirmation before approval).

## Rule PC-008: Service Availability in Programs

The services available to employees in a program are determined by:
1. The services enabled at the enterprise level (Services Config)
2. The services configured within the specific program settings

Most restrictive wins: If enterprise level blocks "Premium" and the program enables it, "Premium" must still be blocked. Program settings cannot override enterprise-level service restrictions.

## Summary Matrix

| Action | Precondition | Validation |
|--------|-------------|------------|
| Deactivate program | No active groups | Requires group transfer |
| Delete program | Program is inactive | Requires deactivation first |
| Delete group | No members | Requires member migration |
| Book outside schedule | Member of restricted program | Blocked with schedule error |
| Book outside geo-fence | Member of restricted program | Blocked with location error |
| Book over budget limit | Limit type exceeded | Blocked with limit error |
