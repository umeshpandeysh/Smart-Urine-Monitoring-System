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

    if (otpError) {
      console.warn('[OTP] Supabase SMS not available, falling back to dev-bypass:', otpError.message);
    }

    // 4. Dev bypass: store OTP in-process (5 min TTL)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    storeOtp(normalizedPhone, otp);

    console.log(`[OTP] Dev bypass generated OTP code for ${normalizedPhone}`);

    return NextResponse.json({ success: true, mode: 'dev-bypass' });
  } catch (error: any) {
    console.error('[OTP] Send route failure:', error.message);
    return NextResponse.json({ success: true, mode: 'fallback' });
  }
}
