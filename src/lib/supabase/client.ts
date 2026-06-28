'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ldjabikdwigwvxnfiqos.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamFiaWtkd2lnd3Z4bmZpcW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzMwNTQsImV4cCI6MjA5NzU0OTA1NH0.ByP1P715ZwZfrWDsXTgeCwxhN76nY5K3dmjyltCJ2hA'
  );
}
