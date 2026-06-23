import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { verifyOtp } from '@/lib/auth/dev-otp-store';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Normalise phone: strip leading + for Supabase storage format
function normalise(phone: string) {
  return phone.startsWith('+') ? phone : `+${phone}`;
}

async function adminFetch(path: string, opts: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
  });
}

async function createDevBypassSession(phone: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: any;
} | null> {
  // 1. Find user by phone (Supabase stores without leading +)
  const phoneRaw = phone.replace(/^\+/, '');
  const listRes = await adminFetch('/admin/users');
  const listData = await listRes.json();
  let user = listData?.users?.find((u: any) => u.phone === phoneRaw);

  // 2. Create user if not found
  if (!user) {
    const createRes = await adminFetch('/admin/users', {
      method: 'POST',
      body: JSON.stringify({ phone: phoneRaw, phone_confirm: true }),
    });
    const createData = await createRes.json();
    if (createData.error || !createData.id) {
      console.error('[OTP] Admin createUser error:', createData);
      return null;
    }
    user = createData;
  }

  // 3. Ensure the user has a confirmed email for password sign-in
  const internalEmail = `phone${phoneRaw}@urosense-internal.dev`;
  if (!user.email || user.email !== internalEmail) {
    await adminFetch(`/admin/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({ email: internalEmail, email_confirm: true }),
    });
  }

  // 4. Set a short-lived temporary password
  const tempPassword = `USdev_${user.id.replace(/-/g, '').substring(0, 12)}_bypass`;
  const pwRes = await adminFetch(`/admin/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify({ password: tempPassword }),
  });
  const pwData = await pwRes.json();
  if (pwData.error) {
    console.error('[OTP] Set password error:', pwData);
    return null;
  }

  // 5. Exchange email+password for a real JWT session
  const tokenRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: internalEmail, password: tempPassword }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('[OTP] Token exchange error:', tokenData);
    return null;
  }

  return {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_in: tokenData.expires_in,
    user: { ...tokenData.user, phone: phone },
  };
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
                cookieStore.set(name, value, options);
                
                let cookieString = `${name}=${encodeURIComponent(value)}`;
                if (options.path) cookieString += `; Path=${options.path}`;
                if (options.domain) cookieString += `; Domain=${options.domain}`;
                if (options.maxAge !== undefined) cookieString += `; Max-Age=${options.maxAge}`;
                if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
                if (options.secure) cookieString += `; Secure`;
                if (options.httpOnly) cookieString += `; HttpOnly`;
                if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;
                responseHeaders.append('Set-Cookie', cookieString);
              });
            } catch (e) {
              // Ignore
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
        { error: 'Session creation failed. Please try again.' },
        { status: 500 }
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
