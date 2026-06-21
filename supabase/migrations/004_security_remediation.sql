-- ============================================================
-- UroSense — Migration 004: Security Remediation
-- Fixes Privilege Escalation, API Rate Limiting, 
-- Storage Leakage, and Device Ingestion Security.
-- ============================================================

-- ------------------------------------------------------------
-- 1. PRIVILEGE ESCALATION PREVENTION (Profile Role Trigger)
-- ------------------------------------------------------------

-- Trigger function to check role updates
CREATE OR REPLACE FUNCTION public.check_profile_role_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        -- Allow the change if there is no authenticated user (e.g. system trigger or database seeds)
        -- or if the authenticated user is an 'admin'
        IF auth.uid() IS NOT NULL AND (
            SELECT role::text FROM public.profiles
            WHERE user_id = auth.uid()
            LIMIT 1
        ) IS DISTINCT FROM 'admin' THEN
            RAISE EXCEPTION 'Unauthorized: Only administrators can modify profile roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to profiles
DROP TRIGGER IF EXISTS before_profile_role_update ON public.profiles;
CREATE TRIGGER before_profile_role_update
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_profile_role_change();

-- ------------------------------------------------------------
-- 2. OTP ENDPOINT PROTECTION (Rate Limits Table)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
    key               VARCHAR(255) PRIMARY KEY,
    request_count     INT NOT NULL DEFAULT 1,
    window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    blocked_until     TIMESTAMPTZ,
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limits (service role only)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 3. TELEMETRY SECURITY (Device-Specific Tokens)
-- ------------------------------------------------------------
ALTER TABLE public.devices 
    ADD COLUMN IF NOT EXISTS hashed_api_token VARCHAR(255),
    ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

-- Create index for faster device token queries
CREATE INDEX IF NOT EXISTS idx_devices_hashed_api_token ON public.devices (hashed_api_token) WHERE hashed_api_token IS NOT NULL;

-- ------------------------------------------------------------
-- 4. PDF DATA LEAKAGE (Private Storage Bucket & Storage RLS)
-- ------------------------------------------------------------

-- Ensure the private reports bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('reports', 'reports', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = false;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for reports bucket SELECT
DROP POLICY IF EXISTS "Allow authenticated users to read reports bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to read reports bucket" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'reports' AND (
            -- Admins can view all files in the bucket
            (
                SELECT role::text FROM public.profiles
                WHERE user_id = auth.uid()
                LIMIT 1
            ) = 'admin' OR
            -- Patients can view their own reports
            (
                name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$' AND
                (
                    SELECT profile_id FROM public.reports
                    WHERE id = regexp_replace(name, '\.pdf$', '')::uuid
                ) = (
                    SELECT id FROM public.profiles
                    WHERE user_id = auth.uid()
                    LIMIT 1
                )
            )
        )
    );
