import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST() {
  const responseHeaders = new Headers();
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  await supabase.auth.signOut();
  
  const redirectUrl = new URL('/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');
  return NextResponse.redirect(redirectUrl, {
    headers: responseHeaders,
  });
}
