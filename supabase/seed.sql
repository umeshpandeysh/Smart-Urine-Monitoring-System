-- ============================================================
-- UroSense V2 — Database Seed File
-- Populates demo organizations, locations, devices, users,
-- sensor readings, reports, and bladder diary telemetry.
-- ============================================================

-- Clean existing demo data
DELETE FROM public.organizations WHERE slug IN ('delhi-airport', 'ndls-railway', 'aiims-delhi', 'ggsipu-campus', 'smart-city-control');
DELETE FROM auth.users WHERE email LIKE '%@urosense.demo';

-- ------------------------------------------------------------
-- 1. SEED ORGANIZATIONS
-- ------------------------------------------------------------
INSERT INTO public.organizations (name, slug, type) VALUES
('Delhi International Airport', 'delhi-airport', 'airport'),
('New Delhi Railway Station', 'ndls-railway', 'corporate'),
('AIIMS New Delhi', 'aiims-delhi', 'hospital'),
('GGSIPU Campus', 'ggsipu-campus', 'corporate'),
('Smart City Control Center', 'smart-city-control', 'smart_city');

-- ------------------------------------------------------------
-- 2. SEED LOCATIONS
-- ------------------------------------------------------------
INSERT INTO public.locations (organization_id, name, city, country, latitude, longitude)
SELECT id, 'Terminal 3 Departures Lounge', 'New Delhi', 'India', 28.5562, 77.1000 FROM public.organizations WHERE slug = 'delhi-airport' UNION ALL
SELECT id, 'Terminal 3 Arrivals - Pier A', 'New Delhi', 'India', 28.5565, 77.1010 FROM public.organizations WHERE slug = 'delhi-airport' UNION ALL
SELECT id, 'Terminal 1 Departures Wing', 'New Delhi', 'India', 28.5620, 77.1180 FROM public.organizations WHERE slug = 'delhi-airport' UNION ALL
SELECT id, 'Platform 1 Executive Lounge', 'New Delhi', 'India', 28.6418, 77.2210 FROM public.organizations WHERE slug = 'ndls-railway' UNION ALL
SELECT id, 'Platform 16 Waiting Hall', 'New Delhi', 'India', 28.6425, 77.2225 FROM public.organizations WHERE slug = 'ndls-railway' UNION ALL
SELECT id, 'OPD Block Ground Floor', 'New Delhi', 'India', 28.5672, 77.2100 FROM public.organizations WHERE slug = 'aiims-delhi' UNION ALL
SELECT id, 'Nephrology Ward 4B', 'New Delhi', 'India', 28.5675, 77.2105 FROM public.organizations WHERE slug = 'aiims-delhi' UNION ALL
SELECT id, 'Emergency Triage Hall', 'New Delhi', 'India', 28.5680, 77.2110 FROM public.organizations WHERE slug = 'aiims-delhi' UNION ALL
SELECT id, 'Block E Administration Toilet', 'New Delhi', 'India', 28.5925, 77.0205 FROM public.organizations WHERE slug = 'ggsipu-campus' UNION ALL
SELECT id, 'Girls Hostel A Block Lobby', 'New Delhi', 'India', 28.5930, 77.0210 FROM public.organizations WHERE slug = 'ggsipu-campus' UNION ALL
SELECT id, 'Boys Hostel B Block Lounge', 'New Delhi', 'India', 28.5935, 77.0215 FROM public.organizations WHERE slug = 'ggsipu-campus' UNION ALL
SELECT id, 'Command Room Operator Rest Area', 'New Delhi', 'India', 28.6304, 77.2177 FROM public.organizations WHERE slug = 'smart-city-control' UNION ALL
SELECT id, 'General Visitor Restroom', 'New Delhi', 'India', 28.6308, 77.2185 FROM public.organizations WHERE slug = 'smart-city-control';

-- ------------------------------------------------------------
-- 3. SEED DEVICES (50+ Devices)
-- ------------------------------------------------------------
DO $$
DECLARE
    loc_record RECORD;
    i INT := 1;
    status_arr TEXT[] := ARRAY['online', 'online', 'online', 'online', 'offline', 'maintenance', 'error'];
    model_arr TEXT[] := ARRAY['UroSense Node v1', 'UroSense Node v2-Pro', 'UroSense Edge Max'];
    firmware_arr TEXT[] := ARRAY['v1.0.0', 'v1.0.5', 'v1.1.0', 'v1.2.0-beta', 'v1.2.2'];
    dev_status device_status;
    battery INT;
BEGIN
    FOR loc_record IN SELECT id FROM public.locations LOOP
        FOR k IN 1..4 LOOP -- 4 devices per location, totaling 52 devices
            dev_status := status_arr[1 + (i % array_length(status_arr, 1))]::device_status;
            IF dev_status = 'offline' AND random() < 0.4 THEN
                battery := floor(random() * 5);
            ELSE
                battery := floor(random() * 80) + 20;
            END IF;

            INSERT INTO public.devices (location_id, serial_number, model, firmware_version, status, battery_level, last_seen_at, metadata)
            VALUES (
                loc_record.id,
                'US-NOD-' || (10000 + i),
                model_arr[1 + (i % array_length(model_arr, 1))],
                firmware_arr[1 + (i % array_length(firmware_arr, 1))],
                dev_status,
                battery,
                CASE WHEN dev_status = 'online' THEN now() ELSE now() - (random() * 5 || ' days')::interval END,
                jsonb_build_object(
                    'installation_date', (now() - (random() * 365 || ' days')::interval)::date,
                    'last_maintenance_date', (now() - (random() * 90 || ' days')::interval)::date,
                    'signal_strength_db', -40 - floor(random() * 40),
                    'hardware_revision', 'rev_' || (1 + (i % 3))
                )
            );
            i := i + 1;
        END LOOP;
    END LOOP;
END $$;

-- ------------------------------------------------------------
-- 4. UPDATE LOCATION ACTIVE DEVICE COUNT
-- ------------------------------------------------------------
UPDATE public.locations l
SET active_device_count = (
    SELECT COUNT(*) 
    FROM public.devices d 
    WHERE d.location_id = l.id AND d.status = 'online'
);

-- ------------------------------------------------------------
-- 5. SEED USERS & PROFILES (500+ Users)
-- ------------------------------------------------------------
DO $$
DECLARE
    i INT;
    temp_user_id UUID;
    first_names TEXT[] := ARRAY['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Ananya', 'Diya', 'Ira', 'Kiara', 'Myra', 'Rahul', 'Priya', 'Amit', 'Sunita', 'Rajesh', 'Neelam', 'Sanjay', 'Vikram', 'Rohan', 'Sneha', 'Kabir', 'Riya', 'Karan', 'Dev', 'Neha', 'Rohan', 'Asha', 'Vijay', 'Shweta', 'Nisha'];
    last_names TEXT[] := ARRAY['Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Nair', 'Kumar', 'Singh', 'Joshi', 'Mehta', 'Rao', 'Choudhury', 'Iyer', 'Pillai', 'Das', 'Sen', 'Banerjee', 'Chatterjee', 'Mishra', 'Trivedi', 'Dave', 'Shah', 'Yadav', 'Kapoor', 'Malhotra', 'Bhasin', 'Gill', 'Bahl', 'Johar', 'Bose'];
    role_val user_role;
    email_val TEXT;
    phone_val TEXT;
    f_name TEXT;
    l_name TEXT;
    age_val INT;
    weight_val NUMERIC;
    risk_val risk_level;
    loc_id UUID;
    prof_type TEXT;
    hyd_goal INT;
    well_trend TEXT;
BEGIN
    FOR i IN 1..515 LOOP
        IF i <= 5 THEN
            role_val := 'admin'::user_role;
            prof_type := 'balanced_wellness';
            hyd_goal := 2500;
            well_trend := 'stable';
        ELSIF i <= 15 THEN
            role_val := 'operator'::user_role;
            prof_type := 'balanced_wellness';
            hyd_goal := 2500;
            well_trend := 'stable';
        ELSE
            role_val := 'patient'::user_role;
            IF i % 4 = 0 THEN
                prof_type := 'active_athlete';
                hyd_goal := 3500;
                well_trend := 'improving';
            ELSIF i % 4 = 1 THEN
                prof_type := 'office_worker';
                hyd_goal := 2000;
                well_trend := 'fluctuating';
            ELSIF i % 4 = 2 THEN
                prof_type := 'elderly_monitored';
                hyd_goal := 1800;
                well_trend := 'stable';
            ELSE
                prof_type := 'balanced_wellness';
                hyd_goal := 2500;
                well_trend := 'stable';
            END IF;
        END IF;

        email_val := role_val::text || '_' || i || '@urosense.demo';
        phone_val := '+9199999' || substring((10000 + i)::text from 2);
        f_name := first_names[1 + floor(random() * array_length(first_names, 1))];
        l_name := last_names[1 + floor(random() * array_length(last_names, 1))];
        age_val := 18 + floor(random() * 62);
        weight_val := (50 + floor(random() * 45))::numeric(5,2);
        
        IF age_val > 65 THEN
            IF random() < 0.3 THEN
                risk_val := 'high'::risk_level;
            ELSE
                risk_val := 'medium'::risk_level;
            END IF;
        ELSIF random() < 0.1 THEN
            risk_val := 'medium'::risk_level;
        ELSE
            risk_val := 'low'::risk_level;
        END IF;

        -- Select a random location
        SELECT id INTO loc_id FROM public.locations ORDER BY random() LIMIT 1;
        
        -- Insert user into auth.users (trigger handles profile insert)
        temp_user_id := gen_random_uuid();
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, phone, phone_confirmed_at)
        VALUES (
            temp_user_id,
            email_val,
            crypt('Password123!', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            jsonb_build_object('first_name', f_name, 'last_name', l_name),
            'authenticated',
            'authenticated',
            now() - (random() * 90 || ' days')::interval,
            now(),
            phone_val,
            now()
        );

        -- Update the profile that was created by the trigger
        UPDATE public.profiles
        SET
            first_name = f_name,
            last_name = l_name,
            role = role_val,
            weight_kg = weight_val,
            risk_level = risk_val,
            location_id = loc_id,
            metadata = jsonb_build_object(
                'age', age_val,
                'gender', CASE WHEN random() < 0.5 THEN 'male' ELSE 'female' END,
                'profile_type', prof_type,
                'hydration_goal_ml', hyd_goal,
                'wellness_trend', well_trend,
                'onboarding_completed', true,
                'clinical_notes', CASE WHEN role_val = 'patient' AND risk_val = 'high' THEN 'Elevated base parameters. Recommend frequent checks.' ELSE NULL END
            )
        WHERE user_id = temp_user_id;
    END LOOP;
END $$;

-- ------------------------------------------------------------
-- 6. SEED DEVICE TELEMETRY LOGS
-- ------------------------------------------------------------
INSERT INTO public.device_telemetry (device_id, cpu_temp, wifi_rssi, free_heap, uptime_seconds, error_code, recorded_at)
SELECT 
    d.id,
    (35.0 + random() * 10.0)::numeric(5,2),
    -50 - floor(random() * 30),
    120000 + floor(random() * 40000),
    3600 * i + floor(random() * 100),
    CASE WHEN d.status = 'error' THEN 'ERR_SENSOR_CALIBRATION_FAIL' ELSE NULL END,
    now() - (i || ' hours')::interval
FROM public.devices d
CROSS JOIN generate_series(1, 3) i;

-- ------------------------------------------------------------
-- 7. SEED SENSOR READINGS & REPORTS (5000+ Records)
-- ------------------------------------------------------------
DO $$
DECLARE
    patient_record RECORD;
    dev_id UUID;
    reading_id UUID;
    report_id UUID;
    recorded_time TIMESTAMPTZ;
    i INT;
    num_readings INT;
    
    ph NUMERIC;
    tds NUMERIC;
    turbidity NUMERIC;
    temp NUMERIC;
    hydration NUMERIC;
    flow_rate NUMERIC;
    volume NUMERIC;
    color_r INT;
    color_g INT;
    color_b INT;
    
    rep_title TEXT;
    rep_sum TEXT;
    rep_ai TEXT;
    p_type TEXT;
BEGIN
    FOR patient_record IN SELECT id, location_id, metadata FROM public.profiles WHERE role = 'patient' LOOP
        num_readings := 10 + floor(random() * 3)::int; -- 10 to 12 readings
        p_type := COALESCE(patient_record.metadata->>'profile_type', 'balanced_wellness');

        FOR i IN 1..num_readings LOOP
            reading_id := gen_random_uuid();
            report_id := gen_random_uuid();
            
            -- Resolve device for patient's location or fallback
            SELECT id INTO dev_id FROM public.devices WHERE location_id = patient_record.location_id ORDER BY random() LIMIT 1;
            IF dev_id IS NULL THEN
                SELECT id INTO dev_id FROM public.devices ORDER BY random() LIMIT 1;
            END IF;

            recorded_time := now() - (random() * 60 || ' days')::interval;

            -- Distribute values based on profile types
            IF p_type = 'active_athlete' THEN
                ph := (6.5 + (random() - 0.5) * 0.6)::numeric(4,2);
                tds := (250 + (random() - 0.5) * 80)::numeric(8,2);
                turbidity := (0.2 + random() * 0.3)::numeric(8,2);
                temp := (36.1 + (random() - 0.5) * 0.8)::numeric(5,2);
                hydration := (88 + (random() - 0.5) * 10)::numeric(5,2);
                flow_rate := (850 + (random() - 0.5) * 200)::numeric(8,2);
                volume := (400 + (random() - 0.5) * 100)::numeric(8,2);
                color_r := 64500; color_g := 63800; color_b := 56000;
            ELSIF p_type = 'office_worker' THEN
                ph := (5.8 + (random() - 0.5) * 0.8)::numeric(4,2);
                tds := (650 + (random() - 0.5) * 240)::numeric(8,2);
                turbidity := (0.8 + random() * 0.8)::numeric(8,2);
                temp := (35.8 + (random() - 0.5) * 1.0)::numeric(5,2);
                hydration := (58 + (random() - 0.5) * 16)::numeric(5,2);
                flow_rate := (600 + (random() - 0.5) * 160)::numeric(8,2);
                volume := (220 + (random() - 0.5) * 80)::numeric(8,2);
                color_r := 62000; color_g := 58000; color_b := 40000;
            ELSIF p_type = 'elderly_monitored' THEN
                -- Occasionally generate spike
                IF random() < 0.25 THEN
                    ph := (8.1 + (random() - 0.5) * 0.6)::numeric(4,2);
                    tds := (1100 + (random() - 0.5) * 300)::numeric(8,2);
                    turbidity := (6.5 + random() * 3.0)::numeric(8,2);
                    temp := (37.4 + (random() - 0.5) * 0.6)::numeric(5,2);
                    hydration := (38 + (random() - 0.5) * 12)::numeric(5,2);
                    flow_rate := (380 + (random() - 0.5) * 100)::numeric(8,2);
                    volume := (120 + (random() - 0.5) * 60)::numeric(8,2);
                    color_r := 58000; color_g := 42000; color_b := 22000;
                ELSE
                    ph := (7.3 + (random() - 0.5) * 0.8)::numeric(4,2);
                    tds := (520 + (random() - 0.5) * 180)::numeric(8,2);
                    turbidity := (1.1 + random() * 0.8)::numeric(8,2);
                    temp := (36.3 + (random() - 0.5) * 0.8)::numeric(5,2);
                    hydration := (64 + (random() - 0.5) * 16)::numeric(5,2);
                    flow_rate := (480 + (random() - 0.5) * 140)::numeric(8,2);
                    volume := (180 + (random() - 0.5) * 60)::numeric(8,2);
                    color_r := 63000; color_g := 60000; color_b := 46000;
                END IF;
            ELSE -- balanced_wellness
                ph := (6.2 + (random() - 0.5) * 0.6)::numeric(4,2);
                tds := (320 + (random() - 0.5) * 120)::numeric(8,2);
                turbidity := (0.35 + random() * 0.3)::numeric(8,2);
                temp := (36.0 + (random() - 0.5) * 0.8)::numeric(5,2);
                hydration := (80 + (random() - 0.5) * 12)::numeric(5,2);
                flow_rate := (720 + (random() - 0.5) * 180)::numeric(8,2);
                volume := (310 + (random() - 0.5) * 80)::numeric(8,2);
                color_r := 64000; color_g := 62700; color_b := 51200;
            END IF;

            -- Range limits
            ph := LEAST(9.00, GREATEST(4.50, ph));
            tds := LEAST(2500.00, GREATEST(50.00, tds));
            turbidity := LEAST(25.00, GREATEST(0.05, turbidity));
            hydration := LEAST(100.00, GREATEST(0.00, hydration));

            -- Insert sensor reading
            INSERT INTO public.sensor_readings (id, device_id, profile_id, ph, tds_ppm, turbidity_ntu, temperature_c, flow_rate_ml_min, total_volume_ml, color_r, color_g, color_b, hydration_index, recorded_at, created_at)
            VALUES (reading_id, dev_id, patient_record.id, ph, tds, turbidity, temp, flow_rate, volume, color_r, color_g, color_b, hydration, recorded_time, recorded_time);

            -- Determine report details
            IF hydration < 50 THEN
                rep_title := 'Moderate Dehydration Alert';
                rep_sum := 'Elevated solute concentration and reduced total void volume detected.';
                rep_ai := 'Clinical systems indicate moderate dehydration. Urine TDS (' || tds || ' ppm) is elevated and Hydration Index is low (' || hydration || '%). Please increase your fluid intake immediately. High solute concentration over long periods increases risk of kidney stones.';
            ELSIF ph > 7.6 AND turbidity > 2.5 THEN
                rep_title := 'Urinary Biomarker Warning';
                rep_sum := 'Elevated pH and turbidity levels indicate potential clinical exception.';
                rep_ai := 'Urinary telemetry shows alkaline pH (' || ph || ') coupled with high turbidity (' || turbidity || ' NTU). This combination is highly correlated with bacterial metabolic activity (possible UTI). Suggest monitoring for physical symptoms and contacting your healthcare provider if symptoms persist.';
            ELSIF hydration > 88 THEN
                rep_title := 'Optimal Hydration Report';
                rep_sum := 'Excellent fluid homeostasis. Physical parameters are balanced.';
                rep_ai := 'Homeostasis index looks fantastic! Hydration score is at ' || hydration || '%, reflecting excellent water volume regulation. Specific gravity indicators and pH (' || ph || ') suggest perfect metabolic balance. Continue with this fluid intake profile.';
            ELSE
                rep_title := 'Wellness Biomarker Summary';
                rep_sum := 'Hydration and urinary biochemistry are in optimal ranges.';
                rep_ai := 'Biomarkers are normal. Your hydration level indicates adequate water intake. pH is well within the healthy physiological range (6.0 - 6.8). Keep maintaining your daily hydration schedule.';
            END IF;

            -- Insert report
            INSERT INTO public.reports (id, profile_id, sensor_reading_id, title, summary, ai_summary, status, pdf_url, verification_hash, parameters, created_at, updated_at)
            VALUES (
                report_id,
                patient_record.id,
                reading_id,
                rep_title,
                rep_sum,
                rep_ai,
                'complete'::report_status,
                'https://storage.urosense.com/reports/' || report_id || '.pdf',
                encode(digest(report_id::text || random()::text, 'sha256'), 'hex'),
                jsonb_build_object(
                    'ph', ph,
                    'tds', tds,
                    'turbidity', turbidity,
                    'temperature', temp,
                    'volume', volume,
                    'flow_rate', flow_rate,
                    'hydration_index', hydration
                ),
                recorded_time,
                recorded_time
            );
        END LOOP;
    END LOOP;
END $$;

-- ------------------------------------------------------------
-- 8. SEED NOTIFICATIONS (1000+ Records)
-- ------------------------------------------------------------
INSERT INTO public.notifications (profile_id, title, message, type, read, action_url, created_at)
SELECT 
    p.id,
    CASE 
        WHEN p.risk_level = 'high' AND random() < 0.5 THEN 'Clinical Exception Alert'
        WHEN random() < 0.3 THEN 'Dehydration Warning'
        WHEN random() < 0.6 THEN 'Weekly Wellness Summary'
        ELSE 'Daily Hydration Goal Reached'
    END,
    CASE 
        WHEN p.risk_level = 'high' AND random() < 0.5 THEN 'Latest diagnostic telemetry indicates elevated indicators. Access your clinical report.'
        WHEN random() < 0.3 THEN 'Hydration levels fell below 50% target yesterday. Remember to drink 2.5L of water.'
        WHEN random() < 0.6 THEN 'Your diagnostic PDF export for the past 7 days is ready for download.'
        ELSE 'Great job! You achieved your configured daily hydration goal of 2.5L.'
    END,
    CASE 
        WHEN p.risk_level = 'high' AND random() < 0.5 THEN 'critical'::notification_type
        WHEN random() < 0.3 THEN 'warning'::notification_type
        WHEN random() < 0.6 THEN 'info'::notification_type
        ELSE 'success'::notification_type
    END,
    random() < 0.7,
    '/dashboard/reports',
    now() - (random() * 5 || ' days')::interval
FROM public.profiles p
CROSS JOIN generate_series(1, 2);

-- ------------------------------------------------------------
-- 9. SEED BLADDER DIARY & DETAILS (300+ Records)
-- ------------------------------------------------------------
DO $$
DECLARE
    patient_record RECORD;
    diary_id UUID;
    recorded_time TIMESTAMPTZ;
    drink_types TEXT[] := ARRAY['Water', 'Coffee', 'Green Tea', 'Orange Juice', 'Coconut Water', 'Diet Soda'];
    streams TEXT[] := ARRAY['NORMAL', 'WEAK', 'STRONG', 'INTERMITTENT'];
    leak_acs TEXT[] := ARRAY['Coughing', 'Lifting heavy weights', 'Walking upstairs', 'Sudden posture change'];
    i INT;
    vol INT;
BEGIN
    FOR patient_record IN SELECT id FROM public.profiles WHERE role = 'patient' LIMIT 60 LOOP
        FOR i IN 0..4 LOOP
            diary_id := gen_random_uuid();
            recorded_time := now() - (random() * 7 || ' days')::interval;
            vol := CASE WHEN i = 1 THEN NULL WHEN i = 0 THEN 200 + floor(random() * 400) ELSE 150 + floor(random() * 300) END;

            INSERT INTO public.bladder_diary_entries (id, profile_id, recorded_at, type, volume_ml, notes, created_at, updated_at)
            VALUES (
                diary_id,
                patient_record.id,
                recorded_time,
                CASE WHEN i = 0 THEN 'INTAKE'::diary_entry_type WHEN i = 1 THEN 'LEAK'::diary_entry_type ELSE 'VOID'::diary_entry_type END,
                vol,
                CASE WHEN i = 1 THEN 'Slight leakage during exercise.' WHEN i = 0 THEN 'Drank after jog.' ELSE NULL END,
                recorded_time,
                recorded_time
            );

            IF i = 0 THEN
                INSERT INTO public.intake_details (diary_entry_id, beverage_type, caffeine, alcohol)
                VALUES (
                    diary_id,
                    drink_types[1 + (i % array_length(drink_types, 1))],
                    drink_types[1 + (i % array_length(drink_types, 1))] IN ('Coffee', 'Green Tea'),
                    false
                );
            ELSIF i = 1 THEN
                INSERT INTO public.leak_details (diary_entry_id, leak_urgency, leak_severity, activity, pad_changed)
                VALUES (
                    diary_id,
                    'ACTIVITY_INDUCED'::leak_urgency_type,
                    'DROP'::leak_severity_type,
                    leak_acs[1 + (i % array_length(leak_acs, 1))],
                    false
                );
            ELSE
                INSERT INTO public.void_details (diary_entry_id, urgency, pain_scale, stream_strength, color)
                VALUES (
                    diary_id,
                    1 + floor(random() * 3)::int,
                    CASE WHEN random() < 0.1 THEN 2 ELSE 0 END,
                    streams[1 + (i % array_length(streams, 1))]::stream_strength_type,
                    'Straw Yellow'
                );
            END IF;
        END LOOP;
    END LOOP;
END $$;
