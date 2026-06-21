-- ============================================================
-- UroSense — Migration 005: Additional Tables
-- Defines recommendations and audit_logs tables
-- ============================================================

-- ============================================================
-- RECOMMENDATIONS (Explicit table for user wellness targets)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sensor_reading_id UUID REFERENCES public.sensor_readings(id) ON DELETE SET NULL,
    category          VARCHAR(50) NOT NULL DEFAULT 'wellness', -- e.g., hydration, renal, nutrition
    title             VARCHAR(255) NOT NULL,
    description       TEXT NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_profile ON public.recommendations(profile_id);

-- ============================================================
-- AUDIT LOGS (Security and system transaction monitoring)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL, -- e.g., user_login, report_download, admin_export
    resource    VARCHAR(100) NOT NULL, -- e.g., reports, profiles, locations
    details     JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_profile_action ON public.audit_logs(profile_id, action);
