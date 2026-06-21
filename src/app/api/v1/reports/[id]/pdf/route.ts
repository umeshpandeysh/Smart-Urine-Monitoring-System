import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // 1. Fetch requesting user profile information for RBAC verification
  const { data: profile, error: profileError } = (await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single()) as any;

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // 2. Fetch target report metadata
  const { data: report, error: reportError } = (await supabase
    .from('reports')
    .select('id, profile_id, pdf_url, status')
    .eq('id', id)
    .single()) as any;

  if (reportError || !report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // 3. Enforce RBAC checks: Only the report owner (patient) or an admin can access the PDF
  if (profile.role !== 'admin' && profile.id !== report.profile_id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!report.pdf_url) {
    return NextResponse.json(
      { error: 'PDF not yet generated', status: report.status },
      { status: 404 }
    );
  }

  // 4. Resolve filename from URL path to construct storage signed request
  const fileName = report.pdf_url.split('/').pop() || `${report.id}.pdf`;

  // 5. Generate secure expiring signed URL (valid for 60 seconds)
  const { data: signedData, error: signedError } = await supabase.storage
    .from('reports')
    .createSignedUrl(fileName, 60);

  if (signedError || !signedData?.signedUrl) {
    console.error('Failed to generate secure signed URL:', signedError);
    return NextResponse.json({ error: 'Failed to generate access link' }, { status: 500 });
  }

  // 6. Redirect to secure, expiring storage url
  return NextResponse.redirect(signedData.signedUrl);
}
