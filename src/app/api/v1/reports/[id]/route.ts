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

  const { data: report, error } = await supabase
    .from('reports')
    .select('*, sensor_readings(*)')
    .eq('id', id)
    .single();

  if (error || !report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json({ data: report });
}
