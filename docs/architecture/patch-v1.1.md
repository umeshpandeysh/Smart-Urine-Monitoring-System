# UroSense Architecture Patch v1.1
*System Specification Patch — Technical Alignment & Database Standardization*

## Executive Summary
This document establishes **Architecture Patch v1.1** for the **UroSense** platform. It reconciles conflicting architecture decisions identified in the *Architecture Reconciliation Report*, standardizing the database access layers, authentication engines, naming conventions, multi-tenant scopes, and privacy thresholds across all design phases (Phases 1 through 13).

---

# 1. Technical Stack Consolidation

### 1.1 Removal of Prisma ORM
- **Specification**: Prisma ORM is completely removed from the UroSense architecture.
- **Affected Components**: 
  - Delete `prisma/` directory, `prisma/schema.prisma` configuration, and the `@/lib/db.ts` cached PrismaClient singleton.
  - Remove `prisma` and `@prisma/client` dependencies from `package.json`.
- **Reasoning**: Eliminating Prisma simplifies the database access layer, reduces dependencies, and prevents synchronization conflicts with Supabase's native PostgreSQL features.

### 1.2 Standardization on Supabase SDK
- **Specification**: All database operations (transactional, analytical, real-time, and storage) will use the official **Supabase JavaScript SDK (`@supabase/supabase-js` and `@supabase/ssr`)**.
- **Usage**:
  - Server-side routes and actions use the Supabase SSR client:
    ```typescript
    import { createServerClient } from '@supabase/ssr'
    ```
  - Client components use the browser client:
    ```typescript
    import { createBrowserClient } from '@supabase/ssr'
    ```
  - Type safety is enforced using auto-generated database types:
    ```typescript
    import { Database } from '@/types/database.types'
    ```

### 1.3 Standardization on Supabase Auth
- **Specification**: Supabase Auth replaces NextAuth.js as the sole authentication provider.
- **Affected Components**:
  - Remove `next-auth` from `package.json` dependencies.
  - Delete `src/app/api/auth/[...nextauth]` routes.
  - Update `src/app/middleware.ts` to verify JWT session tokens using the Supabase Server client.
- **Authentication Methods**:
  - *Patients / Public Users*: Passwordless OTP verification via SMS (Twilio).
  - *Clinicians / Operators / Admins*: Email and password authentication with mandatory Multi-Factor Authentication (MFA) using TOTP (authenticator apps).

---

# 2. Database & Schema Alignment

### 2.1 Database Naming Standard (snake_case)
All database tables, columns, indexes, and schemas must use **snake_case**.
- *Example mappings from Phase 1 to Phase 2/13*:
  - `PatientProfile` $\rightarrow$ `profiles`
  - `BladderDiaryEntry` $\rightarrow$ `bladder_diary_entries`
  - `IntakeDetail` $\rightarrow$ `intake_details`
  - `VoidDetail` $\rightarrow$ `void_details`
  - `LeakDetail` $\rightarrow$ `leak_details`

### 2.2 Reintegration of Manual Bladder Diary Tables
The manual bladder diary tables from Phase 1 are reintegrated into the Phase 2 database schema:

```sql
-- Re-integrating Manual Bladder Diary Tables
CREATE TYPE diary_entry_type AS ENUM ('INTAKE', 'VOID', 'LEAK');
CREATE TYPE stream_strength_type AS ENUM ('WEAK', 'NORMAL', 'STRONG', 'INTERMITTENT');
CREATE TYPE leak_severity_type AS ENUM ('DROP', 'MODERATE', 'FLOOD');
CREATE TYPE leak_urgency_type AS ENUM ('SUDDEN', 'ACTIVITY_INDUCED', 'UNKNOWN');

CREATE TABLE public.bladder_diary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    type diary_entry_type NOT NULL,
    volume_ml INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.intake_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_entry_id UUID NOT NULL UNIQUE REFERENCES public.bladder_diary_entries(id) ON DELETE CASCADE,
    beverage_type VARCHAR(100) NOT NULL,
    caffeine BOOLEAN NOT NULL DEFAULT false,
    alcohol BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.void_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_entry_id UUID NOT NULL UNIQUE REFERENCES public.bladder_diary_entries(id) ON DELETE CASCADE,
    urgency INT CHECK (urgency BETWEEN 1 AND 5),
    pain_scale INT DEFAULT 0 CHECK (pain_scale BETWEEN 0 AND 10),
    stream_strength stream_strength_type NOT NULL,
    color VARCHAR(50)
);

CREATE TABLE public.leak_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_entry_id UUID NOT NULL UNIQUE REFERENCES public.bladder_diary_entries(id) ON DELETE CASCADE,
    leak_urgency leak_urgency_type NOT NULL,
    leak_severity leak_severity_type NOT NULL,
    activity VARCHAR(255),
    pad_changed BOOLEAN NOT NULL DEFAULT false
);
```

### 2.3 UUID v4 Standardization
- **Specification**: All tables (operational, analytical, and security schemas) must use cryptographically secure `UUID v4` values for primary keys.
- **Foreign Keys**: Must match `UUID` types exactly, enforcing `ON DELETE CASCADE` for detail tables, and `ON DELETE RESTRICT` for primary clinical records.

---

# 3. Domain Model & Threshold Alignments

### 3.1 Tenant Model Integration
The multi-tenancy model is standardized to isolate clinical and corporate sectors using a unified hierarchy:
- **`organizations`** (Top-Tier Tenant): Represents a hospital group, corporate entity, or smart city municipal division.
- **`locations`** (Second-Tier Tenant): Represents specific physical locations (e.g., "Airport Terminal 2 North", "Metropolitan Health Clinic").
- **Clinical vs. Public Scope**:
  - Deployed devices contain a `location_id` reference.
  - Clinician profiles are mapped to location rosters:
    ```sql
    CREATE TABLE public.clinician_locations (
        clinician_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
        PRIMARY KEY (clinician_id, location_id)
    );
    ```

### 3.2 Anonymization & Heatmap Thresholds
- **Specification**: The minimum cohort size is standardized at **50 active screenings** to display heatmap coordinates on public dashboards.
- **Enforcement**: Flink and Postgres aggregation pipelines omit geographic markers if:
  $$\text{Active Screenings}_{\text{Location, Hour}} < 50$$

### 3.3 Biomarker Payload Encryption
To resolve inconsistencies between plaintext telemetry columns and encryption requirements:
- Raw physical telemetry (`device_telemetry` and `sensor_readings`) is stored as plaintext during the 30-day active processing window.
- Post-processing, the Triton AI engine encrypts the biomarker details into a single ciphertext block (`biomarker_payload`) using the user's data encryption key (DEK). The raw waveforms are then deleted.

---

# 4. Core Access & Authentication Strategies

## 4.1 Final Database Access Strategy
- **Authentication-Based Access**: The application backend uses the client's JWT session to query Supabase, letting Postgres Row-Level Security (RLS) policies enforce security boundaries.
- **Service Role Exception**: Services that require bypass access (like background aggregation workers or AI classification queues) use the `SUPABASE_SERVICE_ROLE_KEY` over secure, internal VPC connections.
- **Row-Level Security (RLS) Policy Example**:
  ```sql
  -- Restricting patient access to their own profile entries
  ALTER TABLE public.bladder_diary_entries ENABLE ROW LEVEL SECURITY;

  CREATE POLICY patient_diary_isolation ON public.bladder_diary_entries
      FOR ALL
      USING (profile_id = auth.uid());
  ```

## 4.2 Final Authentication Strategy
- **Client Identity**: Managed via Supabase Auth. Browser clients authenticate via OTP, receiving a JWT session token.
- **Server Verification**: The JWT is decoded in Next.js middleware and API route handlers using the server client, injecting the `auth.uid()` identity and user roles into database queries.
- **MFA Enforcement**: Administrators and operators must configure TOTP. If a user has MFA configured but has not completed the challenge, the session JWT claims will lack the `aal2` (Authenticator Assurance Level 2) flag, blocking access to administrative APIs.
