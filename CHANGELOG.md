# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2026-06-20

### 🚀 Major Release — UroSense Cloud Platform

This release transforms the repository from a standalone ESP32 firmware project into a full-stack, cloud-native health monitoring ecosystem.

### Added

- **Next.js 15 Application** — Full App Router architecture with TypeScript 5 and TailwindCSS v3.4
- **Multi-Role Web Platform**:
  - User Portal (`/dashboard`, `/reports`, `/notifications`, `/settings`)
  - Admin Dashboard (`/admin/dashboard`, `/admin/users`, `/admin/devices`, `/admin/reports`)
  - Operations Center (`/operations/dashboard`, `/operations/devices`, `/operations/alerts`, `/operations/maintenance`)
- **Supabase Auth Integration** — Passwordless OTP authentication with JWT sessions
- **Row-Level Security** — Complete RLS policy set for all database tables
- **Database Schema** — 9-table PostgreSQL schema (organizations, locations, profiles, devices, sensor_readings, reports, notifications, device_telemetry, bladder_diary)
- **Telemetry API** — `POST /api/v1/telemetry` endpoint for ESP32 data ingestion
- **PDF Report API** — `GET /api/v1/reports/:id/pdf` with Supabase Storage integration
- **Landing Page** — Premium dark-mode marketing page with glassmorphism design
- **CI/CD Workflows** — GitHub Actions for lint, type-check, build, and Vercel deployment
- **GitHub Templates** — Bug report, feature request, and pull request templates
- **CODEOWNERS** — Automatic reviewer assignment
- **SECURITY.md** — Vulnerability disclosure policy and security architecture
- **Documentation** — Full architecture docs (Phases 4–18), API reference, deployment guide

### Changed

- **README.md** — Completely modernized with UroSense branding, architecture diagrams, and full setup guide
- **CONTRIBUTING.md** — Updated for Next.js + TypeScript + Supabase development workflow
- **.gitignore** — Extended with Next.js, Supabase, testing, and firmware artifact patterns

### Architecture Decisions (from Reconciliation Report + Patch v1.1)

- ✅ **Prisma removed** → Supabase SDK only
- ✅ **NextAuth removed** → Supabase Auth only
- ✅ **All tables in snake_case**
- ✅ **Organizations → Locations → Devices tenancy hierarchy**
- ✅ **UUID v4 primary keys** throughout

---

## [1.0.0-beta] — 2026-06-16

### Added

- **Firmware (ESP32)**:
  - Integrated sensor drivers for pH, TDS, turbidity, temperature (DS18B20), gas (MQ-2), water flow, and I2C color sensor (TCS34725).
  - Implemented non-blocking sensor collection loop.
  - Implemented 10-parameter urine strip color analysis engine.
  - Added WiFi connection manager with auto-reconnect.
  - Created REST API client for forwarding telemetry payloads to dashboard.
- **Hardware**:
  - Preliminary pinout assignments and schematic configuration.
  - Layer layout recommendations and design guidelines for PCB design.
  - CAD model suggestions and physical collection chamber design constraints.
  - Complete Bill of Materials (BOM) for prototype assembly.
- **Dashboard**:
  - Web UI mockup supporting real-time sensor streams and strip parameter graphs.
  - Node.js/Express backend API for ingesting ESP32 POST requests.
  - SQL Schema for PostgreSQL/SQLite database telemetry storage.
- **Documentation**:
  - System architecture, calibration guidelines, and future roadmap documents.
