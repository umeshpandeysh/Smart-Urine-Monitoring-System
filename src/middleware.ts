import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create a default response to return if auth operations fail or are bypassed
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Validate Supabase environment variables before using them
    if (
      !supabaseUrl || 
      supabaseUrl.trim() === '' || 
      supabaseUrl === 'https://placeholder.supabase.co' ||
      !supabaseAnonKey || 
      supabaseAnonKey.trim() === '' || 
      supabaseAnonKey === 'placeholder-anon-key'
    ) {
      console.warn('Supabase env credentials missing or placeholder in middleware. Bypassing auth checks.');
      return response;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            try {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            } catch (cookieError) {
              console.error('Middleware cookie setAll error:', cookieError);
            }
          },
        },
      }
    );

    // Refresh session if expired (getUser matches session refresh behavior)
    const { data: { user } } = await supabase.auth.getUser();

    // Protected route groups
    const isPortalRoute =
      pathname.startsWith('/patient-portal') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/notifications') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/history') ||
      pathname.startsWith('/insights');

    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/admin-center');

    // Redirect unauthenticated users to login
    if ((isPortalRoute || isAdminRoute) && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      
      // Copy cookies to redirect response to prevent dropping refreshed session tokens
      try {
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, {
            path: cookie.path,
            domain: cookie.domain,
            maxAge: cookie.maxAge,
            expires: cookie.expires,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
          });
        });
      } catch (cookieCopyError) {
        console.error('Middleware redirect cookie copy error:', cookieCopyError);
      }
      return redirectResponse;
    }

    // Redirect authenticated users away from auth pages
    if (user && (pathname === '/login' || pathname === '/verify')) {
      const redirectResponse = NextResponse.redirect(new URL('/patient-portal', request.url));
      
      // Copy cookies to redirect response
      try {
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, {
            path: cookie.path,
            domain: cookie.domain,
            maxAge: cookie.maxAge,
            expires: cookie.expires,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
          });
        });
      } catch (cookieCopyError) {
        console.error('Middleware auth redirect cookie copy error:', cookieCopyError);
      }
      return redirectResponse;
    }

  } catch (error) {
    console.error('Middleware execution failed with exception:', error);
    // Bypassing middleware on exception to avoid MIDDLEWARE_INVOCATION_FAILED 500 error
    return NextResponse.next({
      request: { headers: request.headers },
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
