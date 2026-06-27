import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST() {
  const responseHeaders = new Headers();
  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ldjabikdwigwvxnfiqos.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamFiaWtkd2lnd3Z4bmZpcW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzMwNTQsImV4cCI6MjA5NzU0OTA1NH0.ByP1P715ZwZfrWDsXTgeCwxhN76nY5K3dmjyltCJ2hA';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
            console.error('[Signout] Set-Cookie error:', e);
          }
        },
      },
    }
  );

  await supabase.auth.signOut();
  
  const redirectUrl = new URL('/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');
  return NextResponse.redirect(redirectUrl, {
    headers: responseHeaders,
  });
}
