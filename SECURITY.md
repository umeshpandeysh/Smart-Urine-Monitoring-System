# Security Policy

## Supported Versions

The following versions of UroSense are currently receiving security updates:

| Version | Supported |
| :--- | :--- |
| 2.x (current) | ✅ Active support |
| 1.x (legacy) | ⚠️ Critical fixes only |
| < 1.0 | ❌ End of life |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in UroSense, please report it responsibly:

### Option 1: GitHub Private Security Advisory (Preferred)

Use GitHub's built-in [Private Security Advisory](https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System/security/advisories/new) feature to submit a confidential report.

### Option 2: Email

Send a detailed report to the maintainer. Include:

- A clear description of the vulnerability
- The layer affected (Firmware, API, Database, Auth, Frontend)
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested mitigations

### Response Timeline

| Stage | Timeline |
| :--- | :--- |
| Initial acknowledgement | Within 48 hours |
| Severity assessment | Within 5 business days |
| Fix development (critical) | Within 14 days |
| Fix development (high) | Within 30 days |
| Public disclosure | After fix is released |

---

## Security Architecture

### Authentication
- OTP-based passwordless authentication via Supabase Auth
- JWT tokens with configurable expiry (default: 1 hour access, 7 days refresh)
- All tokens are `httpOnly` cookies — never stored in `localStorage`

### Authorization
- Role-Based Access Control (RBAC) with roles: `patient`, `admin`, `operator`
- Row-Level Security (RLS) enforced at the PostgreSQL database layer
- API route guards using `getServerSession()` on every protected endpoint
- Middleware-level route protection with role assertions

### Data Protection
- All data encrypted at rest (Supabase managed AES-256)
- All API traffic over TLS 1.3
- PII data access is audit-logged
- PDF reports are cryptographically signed with HMAC-SHA256

### Infrastructure
- Secrets managed via environment variables — never committed to git
- Service role keys are server-only and never exposed to the client
- CORS restricted to allowlisted origins in production
- Rate limiting on authentication endpoints

---

## Known Security Considerations

> [!IMPORTANT]
> **IoT Device Security**: ESP32 devices communicate over HTTP in development mode. In production deployments, always use HTTPS/TLS. Device API keys must be rotated quarterly.

> [!WARNING]
> **Shared Organization Data**: Users within the same organization may see aggregated anonymized data. Ensure proper organization scoping when deploying in multi-tenant environments.

---

## Security Best Practices for Deployments

1. **Never commit `.env.local`** — use Vercel/hosting environment variables
2. **Rotate Supabase `service_role` keys** every 90 days in production
3. **Enable Supabase MFA** on the dashboard for all admin accounts
4. **Review RLS policies** after every schema migration
5. **Monitor** Grafana dashboards for anomalous API call patterns
6. **Keep dependencies updated** — run `npm audit` weekly

---

## Acknowledgements

We appreciate responsible disclosure. Security researchers who report valid vulnerabilities will be credited in the release notes (with their permission).
