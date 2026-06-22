import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateTrends } from '@/lib/analytics/trends';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all reports for the user
    const { data: reports, error: dbError } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('report_date', { ascending: true });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const trends = calculateTrends(reports || []);
    return NextResponse.json(trends);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
