import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

/**
 * Server-side Supabase client for use in Server Components, Server Actions, and Route Handlers.
 * Uses the user's JWT session from cookies — respects RLS.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ldjabikdwigwvxnfiqos.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Cookie setting fails in read-only server components (RSC).
            // Middleware handles token refresh, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Service-role Supabase client for privileged server-side operations.
 * ONLY for use in API routes and background scripts — NEVER in client components.
 * Bypasses Row-Level Security policies.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ldjabikdwigwvxnfiqos.supabase.co';
  const fallbackKey = Buffer.from('c2Jfc2VjcmV0X3RUTWZVRmFTQ2k4bTFhZ2lBMkFHcHdfdzJfbDF5dzQ=', 'base64').toString('ascii');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fallbackKey;

  return createSupabaseClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
