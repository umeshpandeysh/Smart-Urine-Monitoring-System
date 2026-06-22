import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError || !profile) {
      // Return a basic profile using user auth info if profile is missing
      return NextResponse.json({
        id: user.id,
        name: user.user_metadata?.name || 'New Patient',
        phone: user.phone || '',
        role: 'patient',
        created_at: user.created_at
      });
    }

    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
