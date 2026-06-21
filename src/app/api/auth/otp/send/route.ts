import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { storeOtp } from '@/lib/auth/dev-otp-store';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 8) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    const normalizedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // 1. IP-based rate limiting (max 5 per 10 min)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const ipLimit = await checkRateLimit(`ip_otp:${ip}`, 5, 600, 15);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: `Too many requests from this device. Try again in ${ipLimit.reset} seconds.` },
        { status: 429 }
      );
    }

    // 2. Phone-level rate limiting (max 3 per 15 min)
    const phoneLimit = await checkRateLimit(`phone_otp:${normalizedPhone}`, 3, 900, 15);
    if (!phoneLimit.allowed) {
      return NextResponse.json(
        { error: `Too many OTP requests for this number. Try again in ${phoneLimit.reset} seconds.` },
        { status: 429 }
      );
    }

    // 3. Attempt native Supabase phone OTP
    const supabase = await createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });

    if (!otpError) {
      // Native SMS sent successfully
      return NextResponse.json({ success: true, mode: 'native' });
    }

    const isProviderError =
      otpError.message.toLowerCase().includes('phone provider') ||
      otpError.message.toLowerCase().includes('unsupported');

    if (!isProviderError) {
      // Real error (not a missing-provider issue) — surface it
      console.error('[OTP] Supabase send error:', otpError.message);
      return NextResponse.json({ error: otpError.message }, { status: 400 });
    }

    // 4. Dev bypass: no SMS provider configured — use admin API + in-process store
    console.warn('[OTP] No phone provider — using admin dev bypass for:', normalizedPhone);

    const serviceClient = createServiceClient();

    // Ensure the user exists in Supabase Auth
    const { data: listData, error: listError } = await serviceClient.auth.admin.listUsers();
    if (listError) {
      console.error('[OTP] Admin listUsers error:', listError.message);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const phoneRaw = normalizedPhone.replace(/^\+/, ''); // Supabase stores without leading +
    const existingUser = listData?.users?.find((u) => u.phone === phoneRaw);
    if (!existingUser) {
      const { error: createError } = await serviceClient.auth.admin.createUser({
        phone: normalizedPhone,
        phone_confirm: true,
      });
      if (createError) {
        console.error('[OTP] Admin createUser error:', createError.message);
        return NextResponse.json({ error: 'Failed to initialize user.' }, { status: 500 });
      }
    }

    // Generate OTP and store in-process (5 min TTL)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    storeOtp(normalizedPhone, otp);

    // Log OTP to server console — user reads it from terminal
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║  DEV OTP for ${normalizedPhone.padEnd(14)}  ║`);
    console.log(`║  Code: ${otp}                       ║`);
    console.log(`╚══════════════════════════════════════╝\n`);

    return NextResponse.json({ success: true, mode: 'dev-bypass' });
  } catch (error: any) {
    console.error('[OTP] Send route failure:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
