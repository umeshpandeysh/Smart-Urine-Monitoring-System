import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  try {
    const { data: devices, error } = await (supabase
      .from('devices') as any)
      .select(`
        *,
        locations:location_id (
          location_name
        )
      `)
      .order('device_code', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(devices || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
