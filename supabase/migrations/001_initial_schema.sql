-- ============================================================
-- UroSense — Migration 001: Initial Schema
-- Version: 2.0.0 | Architecture Patch v1.1 + Phase 18 MVP
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('patient', 'admin', 'operator');
CREATE TYPE device_status AS ENUM ('online', 'offline', 'maintenance', 'error');
CREATE TYPE report_status AS ENUM ('pending', 'processing', 'complete', 'error');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'critical', 'success');
CREATE TYPE organization_type AS ENUM ('hospital', 'airport', 'smart_city', 'corporate');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

-- ============================================================
-- ORGANIZATIONS (Top-tier tenant)
-- ============================================================

CREATE TABLE public.organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    type        organization_type NOT NULL DEFAULT 'smart_city',
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- LOCATIONS (Second-tier tenant — specific deployment sites)
-- ============================================================

CREATE TABLE public.locations (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id      UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name                 VARCHAR(255) NOT NULL,
    address              TEXT,
    city                 VARCHAR(100),
    country              VARCHAR(100),
    latitude             DECIMAL(9,6),
    longitude            DECIMAL(9,6),
    active_device_count  INT NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PROFILES (Users linked to Supabase Auth users)
-- ============================================================

CREATE TABLE public.profiles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    role        user_role NOT NULL DEFAULT 'patient',
    weight_kg   DECIMAL(5,2),
    timezone    VARCHAR(50) NOT NULL DEFAULT 'UTC',
    risk_level  risk_level,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DEVICES (IoT ESP32 nodes)
-- ============================================================

CREATE TABLE public.devices (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id      UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    serial_number    VARCHAR(100) UNIQUE NOT NULL,
    model            VARCHAR(100) NOT NULL DEFAULT 'UroSense Node v1',
    firmware_version VARCHAR(20),
    status           device_status NOT NULL DEFAULT 'offline',
    battery_level    INT CHECK (battery_level BETWEEN 0 AND 100),
    last_seen_at     TIMESTAMPTZ,
    metadata         JSONB,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SENSOR READINGS (Core biomarker telemetry from ESP32)
-- ============================================================

CREATE TABLE public.sensor_readings (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id        UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    profile_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Physical parameters
    ph               DECIMAL(4,2) CHECK (ph BETWEEN 0 AND 14),
    tds_ppm          DECIMAL(8,2) CHECK (tds_ppm >= 0),
    turbidity_ntu    DECIMAL(8,2) CHECK (turbidity_ntu >= 0),
    temperature_c    DECIMAL(5,2),
    flow_rate_ml_min DECIMAL(8,2) CHECK (flow_rate_ml_min >= 0),
    total_volume_ml  DECIMAL(8,2) CHECK (total_volume_ml >= 0),
    -- Colorimetric strip readings (TCS34725)
    color_r          INT CHECK (color_r BETWEEN 0 AND 65535),
    color_g          INT CHECK (color_g BETWEEN 0 AND 65535),
    color_b          INT CHECK (color_b BETWEEN 0 AND 65535),
    -- Computed
    hydration_index  DECIMAL(5,2) CHECK (hydration_index BETWEEN 0 AND 100),
    recorded_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for time-series queries
CREATE INDEX idx_sensor_readings_device_recorded ON public.sensor_readings (device_id, recorded_at DESC);
CREATE INDEX idx_sensor_readings_profile_recorded ON public.sensor_readings (profile_id, recorded_at DESC) WHERE profile_id IS NOT NULL;

-- ============================================================
-- REPORTS (AI-generated health reports with PDF)
-- ============================================================

CREATE TABLE public.reports (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sensor_reading_id UUID REFERENCES public.sensor_readings(id) ON DELETE SET NULL,
    title             VARCHAR(255) NOT NULL,
    summary           TEXT,
    ai_summary        TEXT,
    status            report_status NOT NULL DEFAULT 'pending',
    pdf_url           TEXT,
    verification_hash VARCHAR(64),
    parameters        JSONB,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_profile_created ON public.reports (profile_id, created_at DESC);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    type        notification_type NOT NULL DEFAULT 'info',
    read        BOOLEAN NOT NULL DEFAULT false,
    action_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_profile_read ON public.notifications (profile_id, read, created_at DESC);

-- ============================================================
-- DEVICE TELEMETRY (Hardware health metrics)
-- ============================================================

CREATE TABLE public.device_telemetry (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id       UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    cpu_temp        DECIMAL(5,2),
    wifi_rssi       INT,
    free_heap       INT,
    uptime_seconds  BIGINT,
    error_code      VARCHAR(50),
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_device_telemetry_device_recorded ON public.device_telemetry (device_id, recorded_at DESC);

-- ============================================================
-- CLINICIAN <-> LOCATION MAPPING (from Architecture Patch v1.1)
-- ============================================================

CREATE TABLE public.clinician_locations (
    clinician_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    location_id  UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    PRIMARY KEY (clinician_id, location_id)
);

-- ============================================================
-- Auto-update trigger for updated_at columns
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_organizations_updated BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_locations_updated BEFORE UPDATE ON public.locations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_devices_updated BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_reports_updated BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Auto-create profile on user signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, role)
    VALUES (NEW.id, 'patient');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
