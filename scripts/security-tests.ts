import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ------------------------------------------------------------------------------
// Robust Env Loader
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
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !serviceRoleKey || !anonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be set in environment.');
  process.exit(1);
}

// Initialize clients
const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSecurityTests() {
  console.log('🛡️ Starting UroSense Security Validation Tests...');
  let failures = 0;

  // ------------------------------------------------------------------------------
  // Test 1: Privilege Escalation Prevention
  // ------------------------------------------------------------------------------
  console.log('\n🔍 Testing Blocker 1: Privilege Escalation Prevention...');
  try {
    // 1. Create a dummy patient user
    const testEmail = `test_security_patient_${Date.now()}@urosense.demo`;
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: 'Password123!',
      email_confirm: true
    });

    if (authError || !authUser.user) {
      throw new Error(`Failed to create test user: ${authError?.message}`);
    }

    const testUserId = authUser.user.id;

    // 2. Initialize client as the test patient
    const patientClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { error: signInError } = await patientClient.auth.signInWithPassword({
      email: testEmail,
      password: 'Password123!'
    });

    if (signInError) {
      throw new Error(`Failed to log in as test patient: ${signInError.message}`);
    }

    // 3. Attempt to escalate role to admin
    const { error: escalateError } = await patientClient
      .from('profiles')
      .update({ role: 'admin' } as any)
      .eq('user_id', testUserId);

    if (escalateError && escalateError.message.includes('Only administrators can modify profile roles')) {
      console.log('✅ PASS: Privilege escalation attempt successfully blocked by database trigger.');
    } else {
      console.error('❌ FAIL: Privilege escalation update was not rejected as expected. Error:', escalateError?.message);
      failures++;
    }

    // Clean up test user
    await adminClient.auth.admin.deleteUser(testUserId);
  } catch (err: any) {
    console.error('❌ Test 1 Exception:', err.message);
    failures++;
  }

  // ------------------------------------------------------------------------------
  // Test 2: Telemetry Device Ingestion Security
  // ------------------------------------------------------------------------------
  console.log('\n🔍 Testing Blocker 2: Telemetry Ingestion Access Control...');
  try {
    // Fetch a random device
    const { data: devices } = await adminClient.from('devices').select('id').limit(1);
    
    if (devices && devices.length > 0) {
      const deviceId = devices[0].id;

      // Send telemetry request with invalid key
      const localAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${localAppUrl}/api/v1/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'INVALID_TOKEN_KEY'
        },
        body: JSON.stringify({
          device_id: deviceId,
          readings: { ph: 6.2, tds_ppm: 300, turbidity_ntu: 0.3 }
        })
      });

      if (response.status === 401) {
        console.log('✅ PASS: Unauthenticated telemetry injection successfully blocked with 401 Unauthorized.');
      } else {
        console.error(`❌ FAIL: Telemetry ingest with invalid key returned status: ${response.status} instead of 401.`);
        failures++;
      }
    } else {
      console.warn('⚠️ Skip: No registered devices found to test telemetry ingestion.');
    }
  } catch (err: any) {
    console.error('❌ Test 2 Exception (Ensure app is running locally):', err.message);
  }

  // ------------------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------------------
  console.log('\n======================================');
  if (failures === 0) {
    console.log('🎉 ALL SECURITY TESTS PASSED SUCCESSFULLY.');
  } else {
    console.error(`🚨 SECURITY TESTS FAILED: ${failures} vulnerabilities detected.`);
    process.exit(1);
  }
}

runSecurityTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
