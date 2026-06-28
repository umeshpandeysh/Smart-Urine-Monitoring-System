import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Copies refreshed session cookies from an existing response to a target redirect response.
 */
function attachCookiesToRedirect(sourceResponse: NextResponse, redirectResponse: NextResponse): NextResponse {
  try {
    sourceResponse.cookies.getAll().forEach(cookie => {
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
    console.error('[Middleware] Cookie propagation to redirect response failed:', cookieCopyError);
  }
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protected route definitions
  const isPortalRoute =
    pathname.startsWith('/patient-portal') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/insights');

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/admin-center');
  const isProtectedRoute = isPortalRoute || isAdminRoute;

  // Create default baseline response
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ldjabikdwigwvxnfiqos.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamFiaWtkd2lnd3Z4bmZpcW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzMwNTQsImV4cCI6MjA5NzU0OTA1NH0.ByP1P715ZwZfrWDsXTgeCwxhN76nY5K3dmjyltCJ2hA';

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
              console.error('[Middleware] Cookie setAll error:', cookieError);
            }
          },
        },
      }
    );

    // Refresh auth session securely
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Redirect unauthenticated users away from protected healthcare / admin routes
    if (isProtectedRoute && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      return attachCookiesToRedirect(response, redirectResponse);
    }

    // 2. Redirect authenticated users away from auth login / verify pages
    if (user && (pathname === '/login' || pathname === '/verify')) {
      const redirectTarget = searchParams.get('redirect');
      let targetUrl = (redirectTarget && redirectTarget.startsWith('/')) 
        ? redirectTarget 
        : null;

      if (!targetUrl) {
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        targetUrl = userRole === 'admin' ? '/admin-center' : '/patient-portal';
      }
      
      const redirectResponse = NextResponse.redirect(new URL(targetUrl, request.url));
      return attachCookiesToRedirect(response, redirectResponse);
    }

  } catch (error) {
    console.error('[Middleware] Unhandled execution exception:', error);
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'auth_exception');
      return attachCookiesToRedirect(response, NextResponse.redirect(loginUrl));
    }
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

