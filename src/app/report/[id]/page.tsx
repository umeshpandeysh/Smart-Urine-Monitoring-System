import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function QRReportRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login and instruct it to return back to the authenticated reports page
    redirect(`/login?redirect=/reports/${id}`);
  }

  // If already authenticated, redirect directly to the portal report view
  redirect(`/reports/${id}`);
}
