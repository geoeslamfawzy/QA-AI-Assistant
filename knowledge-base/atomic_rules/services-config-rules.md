---
id: "services-config-rules"
title: "Services Configuration Rules"
system: "Admin Panel"
type: "atomic_rule"
tags: ["services", "configuration", "rules", "rule", "country", "admin", "enterprise", "program", "active", "rider"]
dependencies: []
keywords: ["services", "configuration", "rules", "rule", "country", "admin", "enterprise", "program", "active", "rider"]
related: []
version: "1.0"
last_updated: "2026-03-01"
risk_level: "high"
---

# Services Configuration Rules

## Module: services_config
## Rule Type: country
## Risk Level: high

---

## Rule SC-001: Service Availability is Country-Scoped

All service availability configurations are strictly bound to the country selected in the Admin Panel's Country Selector. Service changes in Algeria do NOT affect Senegal, Tunisia, or Morocco.

## Rule SC-002: Bulk Service Actions

Two bulk operations are available at the country level:
- **"Disable service for all"**: Immediately revokes access to the service type for ALL enterprises in the country
- **"Enable service for all"**: Immediately grants access to the service type for ALL enterprises in the country

These bulk actions are irreversible in a single click — they must be preceded by a confirmation dialog showing the count of affected enterprises.

## Rule SC-003: Per-Enterprise Service Toggle

Granular per-enterprise control allows enabling/disabling specific services for individual companies:
- The toggle acts independently of the country-wide default
- An enterprise with a service disabled at the country level cannot have it re-enabled at the enterprise level via Services Config (country level takes precedence for disablements)
- The "Enable by default" setting determines whether new enterprises automatically inherit a service

## Rule SC-004: Service-Program Consistency

Services available within a Program are further restricted by what the enterprise has enabled at the Services Config level:
- A service disabled at enterprise level → unavailable in all programs of that enterprise
- A service enabled at enterprise level → can be selectively enabled/disabled within each program
- This creates a two-layer permission model: Enterprise (Services Config) → Program (service selection)

## Rule SC-005: Service Change Impact on Active Trips

When a service is disabled for an enterprise (via bulk or individual toggle):
- **In-flight trips** of that service type must be honored until completion
- **Scheduled future trips** of the now-disabled service must be cancelled with notification to the rider and admin
- **New bookings** of the disabled service type must be blocked immediately

## Summary Matrix

| Action | Scope | Requires Confirmation | In-Flight Impact |
|--------|-------|----------------------|-----------------|
| Disable for all | Country | Yes | Honor existing, block new |
| Enable for all | Country | Yes | Immediate access |
| Toggle per enterprise | Single enterprise | No | Honor existing, block new |
| Program service config | Per program | No | Immediate for new bookings |
