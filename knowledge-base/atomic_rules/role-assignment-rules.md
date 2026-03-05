---
id: "role-assignment-rules"
title: "Role Assignment & Permission Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["role", "assignment", "permission", "rules", "rule", "admin", "enterprise", "constraint", "rider", "state"]
dependencies: []
keywords: ["role", "assignment", "permission", "rules", "rule", "admin", "enterprise", "constraint", "rider", "state"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Role Assignment & Permission Rules

## Module: auth_enterprise
## Rule Type: role
## Risk Level: critical

---

## Rule RA-001: Single Super Admin Policy

An Enterprise account is **restricted to exactly one (1) Super Admin** at all times. This constraint is enforced server-side with an atomic check-and-swap operation — never trusted from the client.

- Database: Unique partial index on `(enterprise_id, role)` WHERE `role = 'SUPER_ADMIN'`
- API: Any attempt to create a second Super Admin must return HTTP 409 with `SUPER_ADMIN_ALREADY_EXISTS`
- Race condition: Concurrent promotions must use a row-level lock or compare-and-swap

## Rule RA-002: Super Admin Promotion Cascade

When a standard Rider is promoted to Super Admin:
1. The **existing Super Admin is automatically demoted to Rider** in the same atomic transaction
2. Both operations must succeed or both must fail (no partial state)
3. The previous Super Admin must receive notification of their demotion
4. All active sessions for both affected users must be invalidated immediately

## Rule RA-003: Super Admin Demotion Restriction

A current Super Admin **cannot be manually demoted to Rider directly**. The only valid path:
- Promote another user to Super Admin (which triggers automatic demotion per RA-002)
- The UI must disable the "Rider" option in the role dropdown when editing the current Super Admin

This prevents an enterprise from being left without a Super Admin.

## Rule RA-004: B2B Role Hierarchy

Within the B2B Portal, valid roles are:
```
Super Admin      → Full enterprise management access
Business Admin   → Can manage users, groups, programs, book rides
Program Moderator → Can approve/reject ride requests within their program
Rider            → Can book personal business trips only
```

Role assignment downgrade must explicitly revoke the previous role — not just add the new one on top.

## Rule RA-005: Inside Sales Role Designation

A user is only recognized as an "Inside Sales Representative" if the "Inside Sales representative" toggle is **explicitly enabled** in their Admin Profile. This is distinct from generic Admin status.

- Inside Sales users → restricted dashboard (Leads Management only)
- Inside Sales users → cannot access full Enterprise directory without separate permission
- Disabling the toggle: User remains a general Admin but loses Inside Sales status and lead access

## Rule RA-006: Admin Role Management

Deleting an Inside Sales Rep:
- Option A: Remove from Inside Sales list only (user remains generic Admin, retains other access)
- Option B: Full deletion from system (all their assigned leads → revert to Unassigned/N/A)

Both options require explicit confirmation. The system must surface the count of affected leads before confirmation.

## Rule RA-007: Session Invalidation on Role Change

Any role change (promotion, demotion, or permission toggle) must:
1. Invalidate all active sessions for the affected user **immediately** (synchronous, not async)
2. Force JWT/token refresh on next request
3. Clear any cached role/permission values in API gateways or CDN layers
4. Write audit log: actor, target user, old role, new role, timestamp

Gap risk: If invalidation is async, the user may continue with old permissions until token refresh.

## Rule RA-008: Permission Toggle Granularity

When the "Limited Access Mode" master toggle is disabled in Admin settings, granular module-level permissions become configurable per user:
- Each module (Enterprises, Reports, Leads, etc.) can be independently enabled/disabled
- Changes to granular permissions carry the same session invalidation requirement as role changes (RA-007)

## Summary Matrix

| Role | Create Users | Manage Enterprise | Book Rides | View Reports | Access Leads |
|------|-------------|------------------|------------|-------------|-------------|
| Super Admin | Yes | Yes | Yes | Yes | No (B2B portal) |
| Business Admin | Yes | Partial | Yes | Yes | No (B2B portal) |
| Program Moderator | No | No | Yes | Limited | No |
| Rider | No | No | Yes | No | No |
| Inside Sales (Admin Panel) | N/A | Read-only | N/A | Limited | Yes (own leads) |
| Sales Rep (Admin Panel) | N/A | Yes (assigned) | N/A | Yes | No |
