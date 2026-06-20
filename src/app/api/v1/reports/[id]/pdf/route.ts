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

  const { data: reportData, error } = await supabase
    .from('reports')
    .select('id, title, pdf_url, verification_hash, status')
    .eq('id', id)
    .single();

  const report = reportData as { id: string; title: string; pdf_url: string | null; verification_hash: string | null; status: string } | null;

  if (error || !report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  if (!report.pdf_url) {
    return NextResponse.json(
      { error: 'PDF not yet generated', status: report.status },
      { status: 404 }
    );
  }

  // Redirect to the secure PDF URL (Supabase Storage signed URL)
  return NextResponse.redirect(report.pdf_url);
}
