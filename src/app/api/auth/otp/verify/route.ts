import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { verifyOtp } from '@/lib/auth/dev-otp-store';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ldjabikdwigwvxnfiqos.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamFiaWtkd2lnd3Z4bmZpcW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzMwNTQsImV4cCI6MjA5NzU0OTA1NH0.ByP1P715ZwZfrWDsXTgeCwxhN76nY5K3dmjyltCJ2hA';

// Normalise phone: strip leading + for Supabase storage format
function normalise(phone: string) {
  return phone.startsWith('+') ? phone : `+${phone}`;
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServiceClient } from '@/lib/supabase/server';

async function createDevBypassSession(phone: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: any;
} | null> {
  try {
    const serviceClient = createServiceClient();
    const phoneRaw = phone.replace(/^\+/, '');
    const internalEmail = `phone${phoneRaw}@gmail.com`;

    // 1. Check if user exists
    const { data: listData } = await serviceClient.auth.admin.listUsers();
    let user = listData?.users?.find((u) => u.phone === phoneRaw || u.email === internalEmail);

    if (!user) {
      const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        email: internalEmail,
        email_confirm: true,
        phone_confirm: true,
      });
      if (!createError && newUser?.user) {
        user = newUser.user;
      } else {
        const { data: fallbackUser } = await serviceClient.auth.admin.createUser({
          email: internalEmail,
          email_confirm: true,
        });
        if (fallbackUser?.user) user = fallbackUser.user;
      }
    }

    if (!user) return null;

    // 2. Generate magic link token for immediate session exchange
    const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
      type: 'magiclink',
      email: internalEmail,
    });

    if (linkError || !linkData?.properties?.email_otp) {
      console.error('[OTP] generateLink error:', linkError?.message);
      return null;
    }

    // 3. Exchange OTP via Supabase Auth client to retrieve session tokens
    const anonClient = createSupabaseClient(SUPABASE_URL, ANON_KEY);

    const { data: authData, error: verifyErr } = await anonClient.auth.verifyOtp({
      email: internalEmail,
      token: linkData.properties.email_otp,
      type: 'email',
    });

    if (verifyErr || !authData?.session) {
      console.error('[OTP] verifyOtp email session exchange error:', verifyErr?.message);
      return null;
    }

    return {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_in: authData.session.expires_in,
      user: { ...authData.user, phone: phone },
    };
  } catch (err: any) {
    console.error('[OTP] createDevBypassSession exception:', err.message);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone, token } = await request.json();

    if (!phone || !token || token.length !== 6) {
      return NextResponse.json(
        { error: 'Valid phone number and 6-digit OTP code are required' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalise(phone);

    // 1. Brute-force protection (max 5 per 5 min)
    const verifyLimit = await checkRateLimit(`verify_attempt:${normalizedPhone}`, 5, 300, 15);
    if (!verifyLimit.allowed) {
      return NextResponse.json(
        { error: `Account locked. Too many failed attempts. Try again in ${verifyLimit.reset} seconds.` },
        { status: 429 }
      );
    }

    const responseHeaders = new Headers();
    const cookieStore = await cookies();

    const supabase = createServerClient(
      SUPABASE_URL,
      ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: any[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                const updatedOptions = {
                  path: '/',
                  sameSite: 'lax' as const,
                  secure: process.env.NODE_ENV === 'production',
                  ...options,
                };
                cookieStore.set(name, value, updatedOptions);
                
                let cookieString = `${name}=${value}`;
                if (updatedOptions.path) cookieString += `; Path=${updatedOptions.path}`;
                if (updatedOptions.domain) cookieString += `; Domain=${updatedOptions.domain}`;
                if (updatedOptions.maxAge !== undefined) cookieString += `; Max-Age=${updatedOptions.maxAge}`;
                if (updatedOptions.expires) cookieString += `; Expires=${updatedOptions.expires.toUTCString()}`;
                if (updatedOptions.secure) cookieString += `; Secure`;
                if (updatedOptions.httpOnly) cookieString += `; HttpOnly`;
                if (updatedOptions.sameSite) cookieString += `; SameSite=${updatedOptions.sameSite}`;
                responseHeaders.append('Set-Cookie', cookieString);
              });
            } catch (e) {
              console.error('[OTP] Set-Cookie error:', e);
            }
          },
        },
      }
    );

    // 2. Try native Supabase phone OTP verification first
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token,
      type: 'sms',
    });

    if (!verifyError && verifyData?.session) {
      return NextResponse.json({
        success: true,
        user: verifyData.user,
        session: verifyData.session,
      }, {
        headers: responseHeaders
      });
    }

    // 3. Dev bypass: validate OTP from in-process store
    const result = verifyOtp(normalizedPhone, token);
    if (!result.valid) {
      console.warn(`[OTP] Verification failed for ${normalizedPhone}:`, result.reason);
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    // 4. OTP valid — create a real Supabase session via admin bypass
    console.log(`[OTP] Dev bypass verification success for ${normalizedPhone} — creating session...`);
    const sessionData = await createDevBypassSession(normalizedPhone);

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Verification failed. Please request a new code.' },
        { status: 400 }
      );
    }

    // 5. Set auth session via @supabase/ssr so middleware cookie format is correct
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
    });

    if (setSessionError) {
      console.error('[OTP] setSession error:', setSessionError.message);
    }

    console.log(`[OTP] Session set via supabase.auth.setSession for user ${sessionData.user?.id}`);

    return NextResponse.json({
      success: true,
      user: sessionData.user,
      session: {
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        expires_in: sessionData.expires_in,
      },
    }, {
      headers: responseHeaders
    });
  } catch (error: any) {
    console.error('[OTP] Verify route failure:', error.message);
    return NextResponse.json({ error: 'Verification error. Please check your network connection and try again.' }, { status: 400 });
  }
}
