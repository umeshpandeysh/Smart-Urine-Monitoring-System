import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
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
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('🚀 Starting UroSense Supabase Seeding...');

  // 1. Clear existing application data
  console.log('🧹 Cleaning old records...');
  await supabase.from('sensor_readings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('devices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('locations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Clean profiles
  await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Clean auth users with phone numbers ending in 9999 or 8888
  const { data: listData } = await supabase.auth.admin.listUsers();
  if (listData?.users) {
    for (const u of listData.users) {
      if (u.phone === '919999999999' || u.phone === '918888888888' || u.email?.includes('phone9999999999') || u.email?.includes('phone8888888888')) {
        console.log(`🗑️ Deleting test user ${u.phone || u.email}`);
        await supabase.auth.admin.deleteUser(u.id);
      }
    }
  }

  // 2. Create Auth Users
  console.log('👥 Creating Auth Users...');
  
  // Patient User
  const { data: patientAuth, error: pError } = await supabase.auth.admin.createUser({
    phone: '+919999999999',
    phone_confirm: true,
    email: 'phone9999999999@urosense-internal.dev',
    email_confirm: true,
    user_metadata: { name: 'Aarav Sharma', role: 'patient' }
  });
  if (pError) {
    console.error('Failed to create patient user:', pError.message);
    process.exit(1);
  }
  const patientId = patientAuth.user.id;

  // Admin User
  const { data: adminAuth, error: aError } = await supabase.auth.admin.createUser({
    phone: '+918888888888',
    phone_confirm: true,
    email: 'phone8888888888@urosense-internal.dev',
    email_confirm: true,
    user_metadata: { name: 'Dr. Priya Patel', role: 'admin' }
  });
  if (aError) {
    console.error('Failed to create admin user:', aError.message);
    process.exit(1);
  }
  const adminId = adminAuth.user.id;

  // Update profiles table names and roles (trigger auto-creates, we just update)
  await supabase.from('profiles').update({ name: 'Aarav Sharma', role: 'patient', phone: '+919999999999' }).eq('id', patientId);
  await supabase.from('profiles').update({ name: 'Dr. Priya Patel', role: 'admin', phone: '+918888888888' }).eq('id', adminId);

  console.log('✅ Created users and profiles.');

  // 3. Create Locations
  console.log('📍 Seeding Locations...');
  const { data: locations, error: locError } = await supabase.from('locations').insert([
    { location_name: 'Terminal 3 Departures Lounge', location_type: 'Airport', city: 'New Delhi', state: 'Delhi' },
    { location_name: 'OPD Block Ground Floor', location_type: 'Hospital', city: 'New Delhi', state: 'Delhi' },
    { location_name: 'GGSIPU Administration Block', location_type: 'Corporate', city: 'New Delhi', state: 'Delhi' },
    { location_name: 'IIT Delhi Academic Center', location_type: 'University', city: 'New Delhi', state: 'Delhi' }
  ]).select();

  if (locError || !locations) {
    console.error('Failed to seed locations:', locError?.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${locations.length} locations.`);

  // 4. Create Devices
  console.log('🔌 Seeding Devices...');
  const { data: devices, error: devError } = await supabase.from('devices').insert([
    { device_code: 'US-NOD-1001', location_id: locations[0].id, status: 'online', firmware_version: 'v1.2.0', last_seen: new Date().toISOString() },
    { device_code: 'US-NOD-1002', location_id: locations[1].id, status: 'online', firmware_version: 'v1.2.0', last_seen: new Date().toISOString() },
    { device_code: 'US-NOD-1003', location_id: locations[2].id, status: 'offline', firmware_version: 'v1.1.0', last_seen: new Date(Date.now() - 3 * 86400000).toISOString() },
    { device_code: 'US-NOD-1004', location_id: locations[3].id, status: 'online', firmware_version: 'v1.2.0', last_seen: new Date().toISOString() }
  ]).select();

  if (devError || !devices) {
    console.error('Failed to seed devices:', devError?.message);
    process.exit(1);
  }
  console.log(`✅ Seeded ${devices.length} devices.`);

  // 5. Create Reports & Readings (100+ reports for Patient Aarav Sharma)
  console.log('📊 Seeding 105 Reports & Sensor Readings for Aarav Sharma...');

  const reportsData = [];
  const readingsData = [];

  // Generate 105 reports spread over the last 100 days
  for (let i = 0; i < 105; i++) {
    const reportDate = new Date(Date.now() - (105 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const locIdx = i % locations.length;
    const devIdx = i % devices.length;

    // Generate realistic, randomized readings with variations
    let ph = 6.0 + (Math.random() * 1.6 - 0.8); // 5.2 to 7.6
    let tds = 250 + Math.floor(Math.random() * 550); // 250 to 800
    let turbidity = 0.5 + (Math.random() * 6.5); // 0.5 to 7.0
    let temperature = 36.4 + (Math.random() * 1.0 - 0.5); // 35.9 to 36.9
    let gasValue = 10 + Math.floor(Math.random() * 55); // 10 to 65

    // Enforce matching interpretation rules (clinical interpreter duplicate logic)
    const recommendations = [];
    
    let hydration_status = 'Optimal Hydration';
    if (tds > 700) {
      hydration_status = 'Severe Dehydration';
      recommendations.push('Severe hydration indicators flagged. Consume electrolyte fluids immediately.');
    } else if (tds > 450) {
      hydration_status = 'Mild Dehydration';
      recommendations.push('Mild hydration trace flagged. Incremental water intake recommended.');
    } else {
      recommendations.push('Hydration parameters are optimal. Maintain your current daily fluid intake.');
    }

    let glucose_indicator = 'Negative';
    if (gasValue > 50 && ph < 5.5) {
      glucose_indicator = 'Elevated';
      recommendations.push('Elevated wellness indicators for glucose. Follow-up screening or standard clinical consultation is advised.');
    } else if (gasValue > 30) {
      glucose_indicator = 'Trace';
      recommendations.push('Trace glucose indicators detected. Limit sugars and simple carbohydrates.');
    }

    let protein_indicator = 'Negative';
    if (turbidity > 6.0 && ph > 7.0) {
      protein_indicator = 'Elevated';
      recommendations.push('Elevated protein screening findings. Regular activity adjustment and standard checkup recommended.');
    } else if (turbidity > 3.0) {
      protein_indicator = 'Trace';
      recommendations.push('Trace protein indicators flagged. Monitor muscle strain and hydration levels.');
    }

    let uti_risk = 'Low';
    if (turbidity > 5.0 && gasValue > 40 && ph > 7.2) {
      uti_risk = 'High';
      recommendations.push('High UTI risk screening findings. Consult a primary healthcare professional for formal screening.');
    } else if (turbidity > 3.0 || gasValue > 25) {
      uti_risk = 'Medium';
      recommendations.push('Moderate UTI risk indicator. Consider drinking unsweetened cranberry juice.');
    }

    let kidneyStress = 'Low';
    if ((tds > 600 && ph < 5.2) || (ph > 8.0 && turbidity > 4.5)) {
      kidneyStress = 'High';
      recommendations.push('Kidney stress parameters flagged. Avoid high sodium.');
    } else if (tds > 400 || ph < 5.5 || ph > 7.8) {
      kidneyStress = 'Moderate';
      recommendations.push('Moderate kidney stress indicators.');
    }

    let score = 100;
    if (hydration_status === 'Severe Dehydration') score -= 25;
    else if (hydration_status === 'Mild Dehydration') score -= 10;
    if (glucose_indicator === 'Elevated') score -= 20;
    else if (glucose_indicator === 'Trace') score -= 5;
    if (protein_indicator === 'Elevated') score -= 15;
    else if (protein_indicator === 'Trace') score -= 5;
    if (uti_risk === 'High') score -= 20;
    else if (uti_risk === 'Medium') score -= 8;
    if (kidneyStress === 'High') score -= 15;
    else if (kidneyStress === 'Moderate') score -= 5;

    const overall_score = Math.max(10, Math.min(100, score));
    const reportId = crypto.randomUUID();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const retrievalUrl = `${appUrl}/report/${reportId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(retrievalUrl)}`;

    reportsData.push({
      id: reportId,
      user_id: patientId,
      device_id: devices[devIdx].id,
      location_id: locations[locIdx].id,
      report_date: reportDate,
      hydration_status,
      glucose_indicator,
      protein_indicator,
      uti_risk,
      overall_score,
      recommendation: recommendations.join(' '),
      generated_findings: {
        hydrationStatus: hydration_status,
        glucoseIndicator: glucose_indicator,
        proteinIndicator: protein_indicator,
        utiRisk: uti_risk,
        kidneyStress,
        overallScore: overall_score,
        recommendations
      },
      generated_recommendations: recommendations,
      pdf_url: `reports/${reportId}.pdf`,
      generated_pdf_url: `reports/${reportId}.pdf`,
      qr_code_url: qrCodeUrl,
      created_at: new Date(new Date(reportDate).getTime() + 10 * 3600 * 1000).toISOString() // 10:00 AM
    });

    readingsData.push({
      report_id: reportId,
      ph: parseFloat(ph.toFixed(2)),
      tds: parseFloat(tds.toFixed(2)),
      turbidity: parseFloat(turbidity.toFixed(2)),
      temperature: parseFloat(temperature.toFixed(2)),
      gas_value: parseFloat(gasValue.toFixed(2)),
      created_at: new Date(new Date(reportDate).getTime() + 10 * 3600 * 1000).toISOString()
    });
  }

  // Insert in batches of 20 to avoid payload limits
  for (let j = 0; j < reportsData.length; j += 20) {
    const batchR = reportsData.slice(j, j + 20);
    const batchS = readingsData.slice(j, j + 20);
    
    await supabase.from('reports').insert(batchR);
    await supabase.from('sensor_readings').insert(batchS);
  }

  console.log('✅ Seeded 105 reports and readings successfully.');
  console.log('🎉 Database seeding complete!');
}

main().catch((err) => {
  console.error('❌ Error seeding:', err);
  process.exit(1);
});
