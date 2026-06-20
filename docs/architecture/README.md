# Architecture Documentation

This directory contains all UroSense architecture and design specifications from Phase 4 through Phase 18.

## Document Index

| Document | Phase | Description |
| :--- | :--- | :--- |
| [Design System](phase-04-design-system.md) | Phase 4 | Color tokens, typography, spacing system |
| [Landing Page Architecture](phase-05-landing-page.md) | Phase 5 | Marketing page structure and components |
| [Public Dashboard Architecture](phase-06-public-dashboard.md) | Phase 6 | Public health heatmap and analytics |
| [User Portal Architecture](phase-07-user-portal.md) | Phase 7 | Patient-facing portal design |
| [Admin Dashboard Architecture](phase-08-admin-dashboard.md) | Phase 8 | Admin console design |
| [Operations Dashboard Architecture](phase-09-operations.md) | Phase 9 | Technician/operator dashboard |
| [Smart Report Architecture](phase-10-smart-reports.md) | Phase 10 | PDF report engine and AI summaries |
| [Real-Time Analytics Pipeline](phase-11-realtime.md) | Phase 11 | Supabase Realtime + telemetry streaming |
| [Production Architecture & Roadmap](phase-12-production.md) | Phase 12 | Deployment architecture and roadmap |
| [Implementation Foundation](phase-13-foundation.md) | Phase 13 | Codebase structure, dependencies, env vars |
| [Design System Implementation](phase-16-design-system-impl.md) | Phase 16 | CSS tokens, Tailwind config, component specs |
| [Landing Page Implementation](phase-17-landing-page-impl.md) | Phase 17 | Full landing page code implementation |
| [User Portal Implementation](phase-18-user-portal-impl.md) | Phase 18 | Full portal code implementation |
| [Architecture Reconciliation Report](reconciliation-report.md) | Review | Cross-phase conflict analysis and resolutions |
| [Architecture Patch v1.1](patch-v1.1.md) | Patch | Final technical alignment decisions |

## Key Architecture Decisions

### Technology Stack (Final — from Patch v1.1)

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js 15 App Router + TypeScript 5 |
| Styling | TailwindCSS v3.4 (custom design tokens) |
| Auth | Supabase Auth (OTP for patients, MFA for admins) |
| Database | Supabase PostgreSQL |
| DB Client | `@supabase/ssr` + `@supabase/supabase-js` |
| Realtime | Supabase Realtime channels |
| State | TanStack Query + Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| IoT | ESP32 + Arduino |

### Resolved Conflicts (from Reconciliation Report)

1. **ORM**: Prisma removed → Supabase SDK only
2. **Auth**: NextAuth removed → Supabase Auth only
3. **Naming**: All tables in `snake_case`
4. **Tenancy**: `organizations` → `locations` → `devices` hierarchy
5. **Cohort floor**: Standardized at 50 screenings for public heatmaps

## Route Structure

```
/ ..................... Landing page (public)
/login ................ OTP phone input
/verify ............... OTP code entry
/dashboard ............ User health portal
/reports .............. Report listing
/reports/[id] ......... Report detail + PDF
/notifications ........ Notification inbox
/settings ............. User settings
/admin/dashboard ...... Admin overview
/admin/users .......... User management
/admin/devices ........ Device management
/admin/reports ........ Report management
/operations/dashboard . Ops overview
/operations/devices ... Device health cards
/operations/alerts .... Error + offline devices
/operations/maintenance Maintenance queue
/api/v1/telemetry ..... ESP32 POST endpoint
/api/v1/reports/[id] .. Report fetch
/api/v1/reports/[id]/pdf PDF download
/api/auth/signout ..... Sign-out POST
```
