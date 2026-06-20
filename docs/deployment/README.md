# Deployment Guide

## Prerequisites

- Node.js 20+, npm 10+
- [Vercel account](https://vercel.com)
- [Supabase account](https://supabase.com)
- GitHub repository connected to Vercel

---

## Step 1 — Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Run migrations:
   ```bash
   npx supabase db push
   ```
   Or run SQL files manually in the Supabase SQL editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_bladder_diary.sql`
4. Enable **Phone Auth** in Supabase Auth settings (requires Twilio)

---

## Step 2 — Local Development

```bash
# Clone repo
git clone https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System.git
cd Smart-Urine-Monitoring-System

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start dev server
npm run dev
# Open http://localhost:3000
```

---

## Step 3 — Vercel Deployment

1. Connect your GitHub repo to Vercel
2. Add all environment variables from `.env.example` in Vercel Dashboard → Settings → Environment Variables
3. Set **Framework Preset** to `Next.js`
4. Deploy:
   ```bash
   vercel --prod
   ```

### Required Environment Variables in Vercel

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server only) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production domain |
| `TELEMETRY_INGEST_API_KEY` | ✅ | Shared secret for ESP32 devices |
| `OPENAI_API_KEY` | ⚠️ | For AI report generation |
| `TWILIO_ACCOUNT_SID` | ⚠️ | For SMS OTP |
| `TWILIO_AUTH_TOKEN` | ⚠️ | For SMS OTP |
| `TWILIO_SENDER_NUMBER` | ⚠️ | For SMS OTP |

---

## Step 4 — ESP32 Firmware

1. Open `firmware/esp32/config.h`
2. Set `BACKEND_API_URL` to your deployed URL:
   ```cpp
   #define BACKEND_API_URL "https://your-domain.vercel.app/api/v1/telemetry"
   #define DEVICE_API_KEY "your-TELEMETRY_INGEST_API_KEY"
   ```
3. Flash to your ESP32 via Arduino IDE or PlatformIO

---

## CI/CD Pipeline

GitHub Actions workflows in `.github/workflows/`:

- **`ci.yml`** — Runs on every PR: lint, type-check, build
- **`deploy.yml`** — Deploys to Vercel on push to `main`

---

## Monitoring

- Application health: Vercel Dashboard analytics
- Error tracking: Sentry (set `SENTRY_DSN`)
- Database: Supabase Dashboard → Reports → Database metrics
