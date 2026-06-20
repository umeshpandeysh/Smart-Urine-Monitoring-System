# Contributing to UroSense

Thank you for your interest in contributing to **UroSense** — the AI-Powered Smart Urine Health Monitoring Ecosystem. Your contributions help make proactive health monitoring accessible to everyone.

Please take a moment to review this guide before submitting your first contribution.

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers via [security contact](SECURITY.md).

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before reporting a bug, please:
1. Check [existing issues](https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System/issues) to avoid duplicates.
2. Collect relevant context — browser console errors, server logs, firmware serial output.
3. Open a new issue using the **[Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)** template.

Include:
- UroSense version / git commit hash
- Layer affected: **Firmware**, **API**, **Dashboard**, **Database**
- Steps to reproduce, expected behavior, actual behavior
- Screenshots or serial monitor logs if applicable

### 💡 Suggesting Features

1. Open an issue using the **[Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml)** template.
2. Describe the problem your feature solves and your proposed solution.
3. Link to any related architecture documents in `docs/architecture/`.

### 🔧 Submitting Pull Requests

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Follow the coding standards below.
3. Ensure all tests pass locally:
   ```bash
   npm run type-check
   npm run lint
   npm run test
   ```
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(portal): add report download progress indicator
   fix(api): correct RLS policy for shared organization reports
   docs(hardware): update DS18B20 wiring table
   ```
5. Push your branch and open a PR using the **[PR Template](.github/PULL_REQUEST_TEMPLATE.md)**.
6. Request a review from a [CODEOWNER](CODEOWNERS).

---

## Development Setup

```bash
# Clone the repo
git clone https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System.git
cd Smart-Urine-Monitoring-System

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start local Supabase (requires Docker)
npx supabase start

# Seed demo data
npx tsx scripts/seed-demo-data.ts

# Start dev server
npm run dev
```

---

## Coding Standards

### TypeScript / Next.js

- Use TypeScript strict mode. All `any` types must be justified with a comment.
- Components go in `src/components/` and must be documented with JSDoc.
- API routes go in `src/app/api/` using Next.js 15 Route Handlers.
- All Supabase queries must use typed clients from `src/lib/supabase/`.
- Follow the RBAC pattern — always enforce role checks via `src/lib/auth/`.

### Firmware (ESP32 / Arduino)

- Use `camelCase` for variables and functions, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Every sensor must be self-contained in `firmware/esp32/sensors/`.
- Avoid blocking `delay()` — use `millis()` non-blocking patterns.
- Document all calibration constants with units and source references.

### Hardware

- Keep circuit diagrams as readable PDF/PNG/SVG in `hardware/circuit-diagrams/`.
- Maintain `hardware/bill-of-materials/bom.csv` with accurate MPNs and quantities.
- Document all pin connections in `docs/hardware/hardware-design.md`.

### Database

- All new tables require Row-Level Security (RLS) policies.
- Migrations go in `supabase/migrations/` and must be reversible.
- Never store PII in logs or error messages.

---

## Testing Requirements

| Test Type | Tool | Coverage Target |
| :--- | :--- | :--- |
| Unit / Integration | Vitest + RTL | >80% for `src/lib/` |
| API Integration | Vitest | All API routes |
| E2E | Playwright | Critical user journeys |
| Type Checking | TypeScript | Zero errors |
| Linting | ESLint | Zero warnings on new code |

---

## Commit & Branch Naming

| Branch Type | Pattern | Example |
| :--- | :--- | :--- |
| Feature | `feat/<scope>-<description>` | `feat/portal-report-filter` |
| Bug Fix | `fix/<scope>-<description>` | `fix/api-rls-policy` |
| Documentation | `docs/<description>` | `docs/hardware-wiring-update` |
| Firmware | `fw/<description>` | `fw/tcs34725-calibration` |
| Chore | `chore/<description>` | `chore/upgrade-next-15` |

---

## Need Help?

- Open a [Discussion](https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System/discussions) for general questions.
- Tag `@umeshpandeysh` in your issue for urgent matters.
- Review the [Architecture Documentation](docs/architecture/README.md) for deep system understanding.
