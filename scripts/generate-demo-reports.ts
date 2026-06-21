import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ------------------------------------------------------------------------------
// Robust Env Loader (No dotenv dependency required)
// ------------------------------------------------------------------------------
function loadEnv() {
  const envPathLocal = path.resolve(process.cwd(), '.env.local');
  const envPathDefault = path.resolve(process.cwd(), '.env');
  const envPath = fs.existsSync(envPathLocal) ? envPathLocal : envPathDefault;

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      // Strip quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environmental variables.');
  process.exit(1);
}

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface SeedMetadata {
  profiles: {
    id: string;
    role: 'patient' | 'admin' | 'operator';
    risk_level: 'low' | 'medium' | 'high' | null;
    location_id: string | null;
    metadata: {
      age: number;
      gender: 'male' | 'female';
      profile_type: 'active_athlete' | 'office_worker' | 'elderly_monitored' | 'balanced_wellness';
      hydration_goal_ml: number;
      wellness_trend: 'improving' | 'stable' | 'fluctuating';
    };
  }[];
  devices: {
    id: string;
    location_id: string;
  }[];
}

// Helper to generate normal distributions (Box-Muller transform)
function randomNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); 
  while(v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Helper to generate a random hex string for verification hashes
function generateSHA256Hex(): string {
  return crypto.randomBytes(32).toString('hex');
}

async function main() {
  console.log('📊 Starting UroSense V2 Telemetry and Report Generation...');

  const metadataPath = path.resolve(process.cwd(), 'scripts/seed-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ Error: seed-metadata.json not found! Run scripts/seed-demo-data.ts first.');
    process.exit(1);
  }

  const metadata: SeedMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const patients = metadata.profiles.filter(p => p.role === 'patient');
  const devices = metadata.devices;

  if (patients.length === 0 || devices.length === 0) {
    console.error('❌ Error: Seed metadata contains no patients or devices. Re-run seed-demo-data.ts.');
    process.exit(1);
  }

  console.log(`👨‍⚕️ Loaded ${patients.length} patient profiles.`);
  console.log(`📟 Loaded ${devices.length} devices.`);

  const sensorReadingsToInsert: any[] = [];
  const reportsToInsert: any[] = [];
  const notificationsToInsert: any[] = [];
  const diaryEntriesToInsert: any[] = [];
  const intakeDetailsToInsert: any[] = [];
  const voidDetailsToInsert: any[] = [];
  const leakDetailsToInsert: any[] = [];

  const now = Date.now();
  const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;

  console.log('📈 Generating 5000+ Sensor Readings and Reports...');

  // Map devices by location to query easily
  const devicesByLocation = new Map<string, string[]>();
  devices.forEach(d => {
    if (!devicesByLocation.has(d.location_id)) {
      devicesByLocation.set(d.location_id, []);
    }
    devicesByLocation.get(d.location_id)!.push(d.id);
  });

  // Helper to resolve device for location or fallback
  const getDeviceForLocation = (locationId: string | null): string => {
    if (locationId && devicesByLocation.has(locationId)) {
      const list = devicesByLocation.get(locationId)!;
      return list[Math.floor(Math.random() * list.length)];
    }
    return devices[Math.floor(Math.random() * devices.length)].id;
  };

  // 1. Generate 5200 sensor readings + reports
  patients.forEach((patient, pIdx) => {
    // Generate between 10 and 13 readings per patient spread out over the last 60 days
    const numReadings = 10 + (pIdx % 4); 
    const profileType = patient.metadata?.profile_type || 'balanced_wellness';

    for (let rIdx = 0; rIdx < numReadings; rIdx++) {
      const readingId = crypto.randomUUID();
      const reportId = crypto.randomUUID();
      const deviceId = getDeviceForLocation(patient.location_id);
      
      // Distribute reading times over last 60 days
      const recordedAtTime = now - Math.floor(Math.random() * sixtyDaysInMs);
      const recordedAt = new Date(recordedAtTime).toISOString();

      let ph = 6.2;
      let tds = 300;
      let turbidity = 0.3;
      let temp = 36.2;
      let hydrationIndex = 80;
      let flowRate = 600;
      let totalVolume = 300;
      let colorR = 64000;
      let colorG = 62720;
      let colorB = 51200;

      // Adjust metrics based on profile category and wellness trends
      if (profileType === 'active_athlete') {
        ph = parseFloat(randomNormal(6.5, 0.3).toFixed(2));
        tds = parseFloat(randomNormal(250, 40).toFixed(2));
        turbidity = parseFloat(randomNormal(0.2, 0.1).toFixed(2));
        temp = parseFloat(randomNormal(36.1, 0.4).toFixed(2));
        hydrationIndex = parseFloat(randomNormal(88, 5).toFixed(1));
        flowRate = parseFloat(randomNormal(850, 100).toFixed(2));
        totalVolume = parseFloat(randomNormal(400, 50).toFixed(2));
        // Pale yellow/straw
        colorR = 64500; colorG = 63800; colorB = 56000;
      } else if (profileType === 'office_worker') {
        ph = parseFloat(randomNormal(5.8, 0.4).toFixed(2));
        tds = parseFloat(randomNormal(650, 120).toFixed(2));
        turbidity = parseFloat(randomNormal(0.8, 0.3).toFixed(2));
        temp = parseFloat(randomNormal(35.8, 0.5).toFixed(2));
        hydrationIndex = parseFloat(randomNormal(58, 8).toFixed(1));
        flowRate = parseFloat(randomNormal(600, 80).toFixed(2));
        totalVolume = parseFloat(randomNormal(220, 40).toFixed(2));
        // Darker yellow
        colorR = 62000; colorG = 58000; colorB = 40000;
      } else if (profileType === 'elderly_monitored') {
        // Higher clinical variation (some readings normal, some signs of infection/dehydration)
        const isSpike = rIdx === 0 && Math.random() < 0.4; // Simulate occasional UTI spike
        if (isSpike) {
          ph = parseFloat(randomNormal(8.1, 0.3).toFixed(2));
          tds = parseFloat(randomNormal(1100, 150).toFixed(2));
          turbidity = parseFloat(randomNormal(6.5, 1.5).toFixed(2)); // High turbidity
          temp = parseFloat(randomNormal(37.4, 0.3).toFixed(2)); // Slightly elevated temp
          hydrationIndex = parseFloat(randomNormal(38, 6).toFixed(1));
          flowRate = parseFloat(randomNormal(380, 50).toFixed(2));
          totalVolume = parseFloat(randomNormal(120, 30).toFixed(2));
          // Darker turbid orange/amber
          colorR = 58000; colorG = 42000; colorB = 22000;
        } else {
          ph = parseFloat(randomNormal(7.3, 0.4).toFixed(2));
          tds = parseFloat(randomNormal(520, 90).toFixed(2));
          turbidity = parseFloat(randomNormal(1.1, 0.4).toFixed(2));
          temp = parseFloat(randomNormal(36.3, 0.4).toFixed(2));
          hydrationIndex = parseFloat(randomNormal(64, 8).toFixed(1));
          flowRate = parseFloat(randomNormal(480, 70).toFixed(2));
          totalVolume = parseFloat(randomNormal(180, 30).toFixed(2));
          colorR = 63000; colorG = 60000; colorB = 46000;
        }
      } else { // balanced_wellness
        ph = parseFloat(randomNormal(6.2, 0.3).toFixed(2));
        tds = parseFloat(randomNormal(320, 60).toFixed(2));
        turbidity = parseFloat(randomNormal(0.35, 0.15).toFixed(2));
        temp = parseFloat(randomNormal(36.0, 0.4).toFixed(2));
        hydrationIndex = parseFloat(randomNormal(80, 6).toFixed(1));
        flowRate = parseFloat(randomNormal(720, 90).toFixed(2));
        totalVolume = parseFloat(randomNormal(310, 40).toFixed(2));
        colorR = 64000; colorG = 62700; colorB = 51200;
      }

      // Constraints check
      ph = Math.max(4.5, Math.min(9.0, ph));
      tds = Math.max(50, Math.min(2500, tds));
      turbidity = Math.max(0.05, Math.min(25.0, turbidity));
      hydrationIndex = Math.max(0, Math.min(100, hydrationIndex));

      sensorReadingsToInsert.push({
        id: readingId,
        device_id: deviceId,
        profile_id: patient.id,
        ph: ph,
        tds_ppm: tds,
        turbidity_ntu: turbidity,
        temperature_c: temp,
        flow_rate_ml_min: flowRate,
        total_volume_ml: totalVolume,
        color_r: colorR,
        color_g: colorG,
        color_b: colorB,
        hydration_index: hydrationIndex,
        recorded_at: recordedAt,
        created_at: recordedAt
      });

      // Generate reports linked to sensor readings
      let title = 'Wellness Biomarker Summary';
      let summary = 'Hydration and urinary biochemistry are in optimal ranges.';
      let aiSummary = 'Biomarkers are normal. Your hydration level indicates adequate water intake. pH is well within the healthy physiological range (6.0 - 6.8). Keep maintaining your daily hydration schedule.';

      if (hydrationIndex < 50) {
        title = 'Moderate Dehydration Alert';
        summary = 'Elevated solute concentration and reduced total void volume detected.';
        aiSummary = `Clinical systems indicate moderate dehydration. Urine TDS (${tds} ppm) is elevated and Hydration Index is low (${hydrationIndex}%). Please increase your fluid intake immediately. High solute concentration over long periods increases risk of kidney stones.`;
      } else if (ph > 7.6 && turbidity > 2.5) {
        title = 'Urinary Biomarker Warning';
        summary = 'Elevated pH and turbidity levels indicate potential clinical exception.';
        aiSummary = `Urinary telemetry shows alkaline pH (${ph}) coupled with high turbidity (${turbidity} NTU). This combination is highly correlated with bacterial metabolic activity (possible UTI). Suggest monitoring for physical symptoms and contacting your healthcare provider if symptoms persist.`;
      } else if (hydrationIndex > 88) {
        title = 'Optimal Hydration Report';
        summary = 'Excellent fluid homeostasis. Physical parameters are balanced.';
        aiSummary = `Homeostasis index looks fantastic! Hydration score is at ${hydrationIndex}%, reflecting excellent water volume regulation. Specific gravity indicators and pH (${ph}) suggest perfect metabolic balance. Continue with this fluid intake profile.`;
      }

      reportsToInsert.push({
        id: reportId,
        profile_id: patient.id,
        sensor_reading_id: readingId,
        title: title,
        summary: summary,
        ai_summary: aiSummary,
        status: 'complete' as const,
        pdf_url: `https://storage.urosense.com/reports/${reportId}.pdf`,
        verification_hash: generateSHA256Hex(),
        parameters: {
          ph: ph,
          tds: tds,
          turbidity: turbidity,
          temperature: temp,
          volume: totalVolume,
          flow_rate: flowRate,
          hydration_index: hydrationIndex
        },
        created_at: recordedAt,
        updated_at: recordedAt
      });
    }

    // 2. Generate 1-2 notifications per patient
    const notifCount = Math.random() < 0.4 ? 1 : 2;
    for (let nIdx = 0; nIdx < notifCount; nIdx++) {
      let type: 'info' | 'warning' | 'critical' | 'success' = 'success';
      let title = 'Daily Hydration Goal Achieved';
      let message = 'Congratulations! You reached your daily hydration goal of 2.5L.';
      
      if (patient.risk_level === 'high' && nIdx === 0) {
        type = 'critical';
        title = 'Clinical Exception Detected';
        message = 'Your latest urine analysis indicated high risk parameters. Please consult your clinician.';
      } else if (profileType === 'office_worker' && nIdx === 1) {
        type = 'warning';
        title = 'Dehydration Warning';
        message = 'Hydration index has dropped below 50% on consecutive readings. Drink water.';
      } else if (nIdx === 1) {
        type = 'info';
        title = 'Weekly Health Summary Available';
        message = 'Your weekly diagnostic summary is ready for download.';
      }

      notificationsToInsert.push({
        profile_id: patient.id,
        title: title,
        message: message,
        type: type,
        read: Math.random() < 0.7,
        action_url: `/dashboard/reports`,
        created_at: new Date(now - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // 3. Generate Bladder Diary Entries (For the first 60 patient profiles, generate 5 entries each)
    if (pIdx < 60) {
      const drinkTypes = ['Water', 'Coffee', 'Green Tea', 'Orange Juice', 'Coconut Water', 'Diet Soda'];
      const streams = ['NORMAL', 'WEAK', 'STRONG', 'INTERMITTENT'];
      const leakAcs = ['Coughing', 'Lifting heavy weights', 'Walking upstairs', 'Sudden posture change'];

      for (let dIdx = 0; dIdx < 5; dIdx++) {
        const diaryId = crypto.randomUUID();
        const diaryTime = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // within last 7 days
        const diaryType = dIdx === 0 ? 'INTAKE' as const : dIdx === 1 ? 'LEAK' as const : 'VOID' as const;
        const vol = diaryType === 'LEAK' ? null : diaryType === 'INTAKE' ? (200 + Math.floor(Math.random() * 400)) : (150 + Math.floor(Math.random() * 300));
        
        diaryEntriesToInsert.push({
          id: diaryId,
          profile_id: patient.id,
          recorded_at: new Date(diaryTime).toISOString(),
          type: diaryType,
          volume_ml: vol,
          notes: dIdx === 1 ? 'Slight leakage during exercise.' : dIdx === 0 ? 'Drank after morning jog.' : null,
          created_at: new Date(diaryTime).toISOString(),
          updated_at: new Date(diaryTime).toISOString()
        });

        if (diaryType === 'INTAKE') {
          const beverage = drinkTypes[dIdx % drinkTypes.length];
          intakeDetailsToInsert.push({
            diary_entry_id: diaryId,
            beverage_type: beverage,
            caffeine: beverage === 'Coffee' || beverage === 'Green Tea',
            alcohol: false
          });
        } else if (diaryType === 'VOID') {
          voidDetailsToInsert.push({
            diary_entry_id: diaryId,
            urgency: Math.floor(Math.random() * 3) + 1, // 1 to 3
            pain_scale: Math.random() < 0.1 ? 2 : 0,
            stream_strength: streams[dIdx % streams.length] as any,
            color: 'Straw Yellow'
          });
        } else if (diaryType === 'LEAK') {
          leakDetailsToInsert.push({
            diary_entry_id: diaryId,
            leak_urgency: 'ACTIVITY_INDUCED' as const,
            leak_severity: 'DROP' as const,
            activity: leakAcs[dIdx % leakAcs.length],
            pad_changed: false
          });
        }
      }
    }
  });

  // ------------------------------------------------------------------------------
  // 4. Batch Inserts to Database
  // ------------------------------------------------------------------------------
  console.log(`📤 Bulk inserting ${sensorReadingsToInsert.length} Sensor Readings...`);
  await bulkInsert('sensor_readings', sensorReadingsToInsert, 500);

  console.log(`📤 Bulk inserting ${reportsToInsert.length} Reports...`);
  await bulkInsert('reports', reportsToInsert, 500);

  console.log(`📤 Bulk inserting ${notificationsToInsert.length} Notifications...`);
  await bulkInsert('notifications', notificationsToInsert, 500);

  console.log(`📤 Bulk inserting ${diaryEntriesToInsert.length} Bladder Diary Entries...`);
  await bulkInsert('bladder_diary_entries', diaryEntriesToInsert, 500);

  console.log(`📤 Bulk inserting diary sub-details...`);
  await bulkInsert('intake_details', intakeDetailsToInsert, 250);
  await bulkInsert('void_details', voidDetailsToInsert, 250);
  await bulkInsert('leak_details', leakDetailsToInsert, 250);

  // Clean up references file
  try {
    fs.unlinkSync(metadataPath);
    console.log('🧹 Cleaned up temporary seed-metadata.json file.');
  } catch(e) {}

  console.log('🎉 UroSense V2 Demo Telemetry and Reports populated successfully.');
  console.log('💪 Database looks completely alive and highly production-grade!');
}

// Bulk insert helper in chunks to avoid URL size/packet size limits in postgres requests
async function bulkInsert(tableName: string, rows: any[], chunkSize = 200) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(tableName).insert(chunk);
    if (error) {
      console.error(`❌ Error seeding table ${tableName} in chunk [${i} - ${i + chunk.length}]:`, error.message);
      // Exit early to prevent database corruption if critical table fails
      if (tableName === 'sensor_readings' || tableName === 'reports') {
        process.exit(1);
      }
    }
  }
}

main().catch((err) => {
  console.error('❌ Error generating report data:', err);
  process.exit(1);
});
