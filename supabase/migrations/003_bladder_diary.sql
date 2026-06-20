-- ============================================================
-- UroSense — Migration 003: Bladder Diary Tables
-- Architecture Patch v1.1 Section 2.2 — Reintegration
-- ============================================================

CREATE TYPE diary_entry_type AS ENUM ('INTAKE', 'VOID', 'LEAK');
CREATE TYPE stream_strength_type AS ENUM ('WEAK', 'NORMAL', 'STRONG', 'INTERMITTENT');
CREATE TYPE leak_severity_type AS ENUM ('DROP', 'MODERATE', 'FLOOD');
CREATE TYPE leak_urgency_type AS ENUM ('SUDDEN', 'ACTIVITY_INDUCED', 'UNKNOWN');

-- Core diary entry
CREATE TABLE public.bladder_diary_entries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    type        diary_entry_type NOT NULL,
    volume_ml   INT CHECK (volume_ml > 0),
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diary_profile_recorded ON public.bladder_diary_entries (profile_id, recorded_at DESC);

-- Intake details
CREATE TABLE public.intake_details (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_entry_id UUID NOT NULL UNIQUE REFERENCES public.bladder_diary_entries(id) ON DELETE CASCADE,
    beverage_type  VARCHAR(100) NOT NULL,
    caffeine       BOOLEAN NOT NULL DEFAULT false,
    alcohol        BOOLEAN NOT NULL DEFAULT false
);

-- Void details
CREATE TABLE public.void_details (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_entry_id UUID NOT NULL UNIQUE REFERENCES public.bladder_diary_entries(id) ON DELETE CASCADE,
    urgency        INT CHECK (urgency BETWEEN 1 AND 5),
    pain_scale     INT DEFAULT 0 CHECK (pain_scale BETWEEN 0 AND 10),
    stream_strength stream_strength_type NOT NULL,
    color          VARCHAR(50)
);

-- Leak details
CREATE TABLE public.leak_details (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_entry_id UUID NOT NULL UNIQUE REFERENCES public.bladder_diary_entries(id) ON DELETE CASCADE,
    leak_urgency   leak_urgency_type NOT NULL,
    leak_severity  leak_severity_type NOT NULL,
    activity       VARCHAR(255),
    pad_changed    BOOLEAN NOT NULL DEFAULT false
);

-- Updated_at trigger
CREATE TRIGGER on_diary_entries_updated BEFORE UPDATE ON public.bladder_diary_entries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.bladder_diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.void_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leak_details ENABLE ROW LEVEL SECURITY;

-- Patients manage their own diary entries (Architecture Patch v1.1 Example)
CREATE POLICY "patient_diary_isolation" ON public.bladder_diary_entries
    FOR ALL USING (profile_id = public.get_profile_id());

CREATE POLICY "intake_details_own" ON public.intake_details
    FOR ALL USING (
        diary_entry_id IN (
            SELECT id FROM public.bladder_diary_entries
            WHERE profile_id = public.get_profile_id()
        )
    );

CREATE POLICY "void_details_own" ON public.void_details
    FOR ALL USING (
        diary_entry_id IN (
            SELECT id FROM public.bladder_diary_entries
            WHERE profile_id = public.get_profile_id()
        )
    );

CREATE POLICY "leak_details_own" ON public.leak_details
    FOR ALL USING (
        diary_entry_id IN (
            SELECT id FROM public.bladder_diary_entries
            WHERE profile_id = public.get_profile_id()
        )
    );

-- Admins can view all diary data
CREATE POLICY "diary_admin" ON public.bladder_diary_entries
    FOR SELECT USING (public.get_user_role() = 'admin');
