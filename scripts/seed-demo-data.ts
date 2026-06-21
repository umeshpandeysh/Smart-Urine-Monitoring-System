import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

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

// Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Demo Data Constants
const DEMO_ORGANIZATIONS = [
  { name: 'Delhi International Airport', slug: 'delhi-airport', type: 'airport' as const },
  { name: 'New Delhi Railway Station', slug: 'ndls-railway', type: 'corporate' as const },
  { name: 'AIIMS New Delhi', slug: 'aiims-delhi', type: 'hospital' as const },
  { name: 'GGSIPU Campus', slug: 'ggsipu-campus', type: 'corporate' as const },
  { name: 'Smart City Control Center', slug: 'smart-city-control', type: 'smart_city' as const },
];

const DEMO_LOCATIONS = [
  // Delhi Airport
  { orgSlug: 'delhi-airport', name: 'Terminal 3 Departures Lounge', city: 'New Delhi', country: 'India', lat: 28.5562, lng: 77.1000 },
  { orgSlug: 'delhi-airport', name: 'Terminal 3 Arrivals - Pier A', city: 'New Delhi', country: 'India', lat: 28.5565, lng: 77.1010 },
  { orgSlug: 'delhi-airport', name: 'Terminal 1 Departures Wing', city: 'New Delhi', country: 'India', lat: 28.5620, lng: 77.1180 },
  // Railway Station
  { orgSlug: 'ndls-railway', name: 'Platform 1 Executive Lounge', city: 'New Delhi', country: 'India', lat: 28.6418, lng: 77.2210 },
  { orgSlug: 'ndls-railway', name: 'Platform 16 Waiting Hall', city: 'New Delhi', country: 'India', lat: 28.6425, lng: 77.2225 },
  // AIIMS New Delhi
  { orgSlug: 'aiims-delhi', name: 'OPD Block Ground Floor', city: 'New Delhi', country: 'India', lat: 28.5672, lng: 77.2100 },
  { orgSlug: 'aiims-delhi', name: 'Nephrology Ward 4B', city: 'New Delhi', country: 'India', lat: 28.5675, lng: 77.2105 },
  { orgSlug: 'aiims-delhi', name: 'Emergency Triage Hall', city: 'New Delhi', country: 'India', lat: 28.5680, lng: 77.2110 },
  // GGSIPU Campus
  { orgSlug: 'ggsipu-campus', name: 'Block E Administration Toilet', city: 'New Delhi', country: 'India', lat: 28.5925, lng: 77.0205 },
  { orgSlug: 'ggsipu-campus', name: 'Girls Hostel A Block Lobby', city: 'New Delhi', country: 'India', lat: 28.5930, lng: 77.0210 },
  { orgSlug: 'ggsipu-campus', name: 'Boys Hostel B Block Lounge', city: 'New Delhi', country: 'India', lat: 28.5935, lng: 77.0215 },
  // Smart City Control Center
  { orgSlug: 'smart-city-control', name: 'Command Room Operator Rest Area', city: 'New Delhi', country: 'India', lat: 28.6304, lng: 77.2177 },
  { orgSlug: 'smart-city-control', name: 'General Visitor Restroom', city: 'New Delhi', country: 'India', lat: 28.6308, lng: 77.2185 },
];

const FIRMWARES = ['v1.0.0', 'v1.0.5', 'v1.1.0', 'v1.2.0-beta', 'v1.2.2'];
const DEVICE_MODELS = ['UroSense Node v1', 'UroSense Node v2-Pro', 'UroSense Edge Max'];
const DEVICE_STATUSES: ('online' | 'offline' | 'maintenance' | 'error')[] = ['online', 'offline', 'maintenance', 'error'];

async function main() {
  console.log('🚀 Starting UroSense V2 Demo Data Seed...');

  // ------------------------------------------------------------------------------
  // 1. Clean Existing Demo Data
  // ------------------------------------------------------------------------------
  console.log('🧹 Cleaning old demo data...');
  
  // Find organizations to clean
  const { data: oldOrgs } = await supabase
    .from('organizations')
    .select('id')
    .in('slug', DEMO_ORGANIZATIONS.map(o => o.slug));

  if (oldOrgs && oldOrgs.length > 0) {
    const orgIds = oldOrgs.map(o => o.id);
    const { error: deleteOrgsError } = await supabase
      .from('organizations')
      .delete()
      .in('id', orgIds);
    
    if (deleteOrgsError) {
      console.error('⚠️ Error deleting old organizations:', deleteOrgsError.message);
    } else {
      console.log(`✅ Cleaned ${orgIds.length} old organizations and cascading telemetry/devices.`);
    }
  }

  // Clean old users from auth.users (those with email matching patient_*@urosense.demo / operator_*@urosense.demo / admin_*@urosense.demo)
  console.log('🧹 Cleaning old demo users...');
  let hasMoreUsers = true;
  let page = 1;
  const usersToDelete: string[] = [];

  while (hasMoreUsers) {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
      page: page,
      perPage: 100
    });

    if (listError || !users || users.length === 0) {
      hasMoreUsers = false;
      break;
    }

    users.forEach(u => {
      if (u.email && u.email.endsWith('@urosense.demo')) {
        usersToDelete.push(u.id);
      }
    });

    if (users.length < 100) {
      hasMoreUsers = false;
    } else {
      page++;
    }
  }

  if (usersToDelete.length > 0) {
    console.log(`🗑️ Deleting ${usersToDelete.length} demo users...`);
    // Delete in parallel chunks of 10
    const chunkSize = 10;
    for (let i = 0; i < usersToDelete.length; i += chunkSize) {
      const chunk = usersToDelete.slice(i, i + chunkSize);
      await Promise.all(chunk.map(id => supabase.auth.admin.deleteUser(id)));
    }
    console.log('✅ Cleaned all old demo users.');
  }

  // ------------------------------------------------------------------------------
  // 2. Seed Organizations
  // ------------------------------------------------------------------------------
  console.log('🏢 Seeding Organizations...');
  const { data: seededOrgs, error: orgError } = await supabase
    .from('organizations')
    .insert(DEMO_ORGANIZATIONS)
    .select();

  if (orgError || !seededOrgs) {
    console.error('❌ Failed to seed organizations:', orgError?.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${seededOrgs.length} Organizations.`);

  const orgMap = new Map(seededOrgs.map(o => [o.slug, o.id]));

  // ------------------------------------------------------------------------------
  // 3. Seed Locations
  // ------------------------------------------------------------------------------
  console.log('📍 Seeding Locations...');
  const locationInserts = DEMO_LOCATIONS.map(loc => ({
    organization_id: orgMap.get(loc.orgSlug)!,
    name: loc.name,
    city: loc.city,
    country: loc.country,
    latitude: loc.lat,
    longitude: loc.lng,
    active_device_count: 0
  }));

  const { data: seededLocations, error: locError } = await supabase
    .from('locations')
    .insert(locationInserts)
    .select();

  if (locError || !seededLocations) {
    console.error('❌ Failed to seed locations:', locError?.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${seededLocations.length} Locations.`);

  // ------------------------------------------------------------------------------
  // 4. Seed Devices (50+ Devices)
  // ------------------------------------------------------------------------------
  console.log('🔌 Seeding 50+ Devices...');
  const devicesToInsert = [];
  const statusDist = ['online', 'online', 'online', 'online', 'offline', 'maintenance', 'error']; // heavily weighted online

  for (let i = 1; i <= 55; i++) {
    const loc = seededLocations[i % seededLocations.length];
    const serial = `US-NOD-${10000 + i}`;
    const model = DEVICE_MODELS[i % DEVICE_MODELS.length];
    const firmware = FIRMWARES[i % FIRMWARES.length];
    const status = statusDist[Math.floor(Math.random() * statusDist.length)] as 'online' | 'offline' | 'maintenance' | 'error';
    const battery = status === 'offline' && Math.random() < 0.4 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 80) + 20;

    devicesToInsert.push({
      location_id: loc.id,
      serial_number: serial,
      model: model,
      firmware_version: firmware,
      status: status,
      battery_level: battery,
      last_seen_at: status === 'online' ? new Date().toISOString() : new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
      metadata: {
        installation_date: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString().split('T')[0],
        last_maintenance_date: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString().split('T')[0],
        signal_strength_db: Math.floor(Math.random() * -40) - 40,
        hardware_revision: `rev_${i % 3 + 1}`
      }
    });
  }

  const { data: seededDevices, error: devError } = await supabase
    .from('devices')
    .insert(devicesToInsert)
    .select();

  if (devError || !seededDevices) {
    console.error('❌ Failed to seed devices:', devError?.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${seededDevices.length} Devices.`);

  // Update location active_device_count
  console.log('🔄 Updating Location active device counts...');
  for (const loc of seededLocations) {
    const count = seededDevices.filter(d => d.location_id === loc.id && d.status === 'online').length;
    await supabase
      .from('locations')
      .update({ active_device_count: count })
      .eq('id', loc.id);
  }
  console.log('✅ Active device counts synchronized.');

  // Seed Device Telemetry for these devices
  console.log('📉 Seeding device telemetry metrics...');
  const telemetryInserts = seededDevices.flatMap(dev => {
    return Array.from({ length: 3 }).map((_, telemetryIdx) => ({
      device_id: dev.id,
      cpu_temp: 35.5 + Math.random() * 12.0,
      wifi_rssi: Math.floor(Math.random() * -30) - 50,
      free_heap: 120000 + Math.floor(Math.random() * 40000),
      uptime_seconds: 3600 * (telemetryIdx + 1) + Math.floor(Math.random() * 1000),
      error_code: dev.status === 'error' ? 'ERR_SENSOR_CALIBRATION_FAIL' : null,
      recorded_at: new Date(Date.now() - telemetryIdx * 3600000).toISOString()
    }));
  });

  const { error: telemetryError } = await supabase
    .from('device_telemetry')
    .insert(telemetryInserts);

  if (telemetryError) {
    console.warn('⚠️ Telemetry insert warning:', telemetryError.message);
  } else {
    console.log(`✅ Seeded ${telemetryInserts.length} device telemetry logs.`);
  }

  // ------------------------------------------------------------------------------
  // 5. Seed Users (500+ Demo Users)
  // ------------------------------------------------------------------------------
  console.log('👥 Seeding 500+ Demo Users (Patients, Operators, Admins)...');

  // Let's create user profiles structure
  const usersToCreate = [];
  const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Ananya', 'Diya', 'Ira', 'Kiara', 'Myra', 'Rahul', 'Priya', 'Amit', 'Sunita', 'Rajesh', 'Neelam', 'Sanjay', 'Vikram', 'Rohan', 'Sneha', 'Kabir', 'Riya', 'Karan', 'Dev', 'Neha', 'Rohan', 'Asha', 'Vijay', 'Shweta', 'Nisha'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Nair', 'Kumar', 'Singh', 'Joshi', 'Mehta', 'Rao', 'Choudhury', 'Iyer', 'Pillai', 'Das', 'Sen', 'Banerjee', 'Chatterjee', 'Mishra', 'Trivedi', 'Dave', 'Shah', 'Yadav', 'Kapoor', 'Malhotra', 'Bhasin', 'Gill', 'Bahl', 'Johar', 'Bose'];
  
  // Create 515 demo users (500 patients, 10 operators, 5 admins)
  for (let i = 1; i <= 515; i++) {
    const role = i <= 5 ? ('admin' as const) : i <= 15 ? ('operator' as const) : ('patient' as const);
    const email = `${role}_${i}@urosense.demo`;
    const phone = `+9199999${(10000 + i).toString().substring(1)}`;

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Hydration behaviors, age groups
    const age = Math.floor(Math.random() * 62) + 18; // 18-80 years old
    const weight = Math.floor(Math.random() * 45) + 50; // 50-95 kg
    const riskLevel = age > 65 ? (Math.random() < 0.3 ? 'high' as const : 'medium' as const) : Math.random() < 0.1 ? 'medium' as const : 'low' as const;

    // Wellness profile categorization
    const profileTypes = ['active_athlete', 'office_worker', 'elderly_monitored', 'balanced_wellness'];
    const selectedProfileType = profileTypes[i % profileTypes.length];
    
    let hydrationGoal = 2500;
    let wellnessTrend = 'stable';
    if (selectedProfileType === 'active_athlete') {
      hydrationGoal = 3500;
      wellnessTrend = 'improving';
    } else if (selectedProfileType === 'office_worker') {
      hydrationGoal = 2000;
      wellnessTrend = 'fluctuating';
    } else if (selectedProfileType === 'elderly_monitored') {
      hydrationGoal = 1800;
      wellnessTrend = 'stable';
    }

    usersToCreate.push({
      email,
      phone,
      password: 'Password123!',
      firstName,
      lastName,
      role,
      weight,
      riskLevel,
      locationId: seededLocations[i % seededLocations.length].id,
      metadata: {
        age,
        gender: Math.random() < 0.5 ? 'male' : 'female',
        profile_type: selectedProfileType,
        hydration_goal_ml: hydrationGoal,
        wellness_trend: wellnessTrend,
        onboarding_completed: true,
        clinical_notes: role === 'patient' && riskLevel === 'high' ? 'Patient exhibits recurring low hydration scores and slightly elevated pH. Recommending increased fluid intake and renal evaluation.' : null
      }
    });
  }

  // Create users in GoTrue and update profiles
  console.log(`📤 Creating users in Supabase Auth in chunks...`);
  const createdProfiles = [];
  const chunkSize = 25;

  for (let i = 0; i < usersToCreate.length; i += chunkSize) {
    const chunk = usersToCreate.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(async (u) => {
        try {
          // Create in auth.users
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: u.email,
            phone: u.phone,
            password: u.password,
            email_confirm: true,
            phone_confirm: true,
          });

          if (authError || !authData.user) {
            // If email already exists, retrieve that user
            if (authError?.message.includes('already exists')) {
              // Wait, since we cleaned them up, this shouldn't happen, but let's handle just in case
              return { success: false, email: u.email, error: authError.message };
            }
            return { success: false, email: u.email, error: authError?.message };
          }

          // Trigger handles profile insert automatically. Let's update the newly created profile.
          const userId = authData.user.id;
          
          // Retry logic since the trigger might take a microsecond
          let updatedProfile = null;
          let retries = 3;
          while (retries > 0) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .update({
                first_name: u.firstName,
                last_name: u.lastName,
                role: u.role,
                weight_kg: u.weight,
                risk_level: u.riskLevel,
                location_id: u.locationId,
                metadata: u.metadata,
              })
              .eq('user_id', userId)
              .select()
              .single();

            if (!profileError && profileData) {
              updatedProfile = profileData;
              break;
            }
            retries--;
            await new Promise(r => setTimeout(r, 100)); // wait 100ms
          }

          return { success: !!updatedProfile, profile: updatedProfile, email: u.email };
        } catch (e: any) {
          return { success: false, email: u.email, error: e.message };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    createdProfiles.push(...results.filter(r => r.success).map(r => r.profile));
    console.log(`📦 Seeded batch [${i + 1} - ${Math.min(i + chunkSize, usersToCreate.length)}]: ${successCount} users registered successfully.`);
  }

  console.log(`✅ Finished seeding users. Created ${createdProfiles.length} active demo profiles.`);

  // Write seeded profiles and devices to a temp json in workspace so generate-demo-reports.ts can read it
  const seedMetadataPath = path.resolve(process.cwd(), 'scripts/seed-metadata.json');
  fs.writeFileSync(seedMetadataPath, JSON.stringify({
    profiles: createdProfiles.map(p => ({ id: p.id, role: p.role, risk_level: p.risk_level, location_id: p.location_id, metadata: p.metadata })),
    devices: seededDevices.map(d => ({ id: d.id, location_id: d.location_id }))
  }, null, 2));

  console.log(`💾 Saved metadata references to ${seedMetadataPath} for report generation script.`);
  console.log('🎉 Step 1 complete! Now run: npx tsx scripts/generate-demo-reports.ts');
}

main().catch((err) => {
  console.error('❌ Error during database seeding:', err);
  process.exit(1);
});
