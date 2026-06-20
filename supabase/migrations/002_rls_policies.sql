-- ============================================================
-- UroSense — Migration 002: Row Level Security Policies
-- Architecture Patch v1.1 Section 4 — Final RLS Policy Set
-- ============================================================

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinician_locations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper functions
-- ============================================================

-- Get current user's role from profiles
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role::TEXT FROM public.profiles
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current user's profile id
CREATE OR REPLACE FUNCTION public.get_profile_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM public.profiles
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES RLS
-- ============================================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
    FOR SELECT USING (public.get_user_role() = 'admin');

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE USING (public.get_user_role() = 'admin');

-- System inserts (from trigger) — no user needed
CREATE POLICY "profiles_insert_system" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- SENSOR READINGS RLS
-- ============================================================

-- Patients can only read their own readings
CREATE POLICY "readings_select_own" ON public.sensor_readings
    FOR SELECT USING (profile_id = public.get_profile_id());

-- Admins and operators can read all readings
CREATE POLICY "readings_select_admin_operator" ON public.sensor_readings
    FOR SELECT USING (public.get_user_role() IN ('admin', 'operator'));

-- Only service role can insert (via telemetry API)
CREATE POLICY "readings_insert_service" ON public.sensor_readings
    FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'operator'));

-- ============================================================
-- REPORTS RLS
-- ============================================================

-- Patients see only their own reports
CREATE POLICY "reports_select_own" ON public.reports
    FOR SELECT USING (profile_id = public.get_profile_id());

-- Admins see all reports
CREATE POLICY "reports_select_admin" ON public.reports
    FOR SELECT USING (public.get_user_role() = 'admin');

-- ============================================================
-- NOTIFICATIONS RLS
-- ============================================================

-- Users see only their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT USING (profile_id = public.get_profile_id());

CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE USING (profile_id = public.get_profile_id());

-- Service role inserts notifications
CREATE POLICY "notifications_insert_service" ON public.notifications
    FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'operator'));

-- ============================================================
-- DEVICES RLS
-- ============================================================

-- Admins and operators can view all devices
CREATE POLICY "devices_select_admin_operator" ON public.devices
    FOR SELECT USING (public.get_user_role() IN ('admin', 'operator'));

-- Admins can modify devices
CREATE POLICY "devices_modify_admin" ON public.devices
    FOR ALL USING (public.get_user_role() = 'admin');

-- ============================================================
-- ORGANIZATIONS + LOCATIONS RLS
-- ============================================================

-- Admins manage organizations
CREATE POLICY "organizations_admin" ON public.organizations
    FOR ALL USING (public.get_user_role() = 'admin');

-- Admins and operators view locations
CREATE POLICY "locations_select_admin_operator" ON public.locations
    FOR SELECT USING (public.get_user_role() IN ('admin', 'operator'));

CREATE POLICY "locations_modify_admin" ON public.locations
    FOR ALL USING (public.get_user_role() = 'admin');

-- ============================================================
-- DEVICE TELEMETRY RLS
-- ============================================================

CREATE POLICY "telemetry_select_admin_operator" ON public.device_telemetry
    FOR SELECT USING (public.get_user_role() IN ('admin', 'operator'));

CREATE POLICY "telemetry_insert_service" ON public.device_telemetry
    FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'operator'));

-- ============================================================
-- CLINICIAN LOCATIONS RLS
-- ============================================================

CREATE POLICY "clinician_locations_admin" ON public.clinician_locations
    FOR ALL USING (public.get_user_role() = 'admin');
