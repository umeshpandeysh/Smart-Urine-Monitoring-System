import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  try {
    // 1. Fetch latest raw upload payload
    const { data: rawPayloads, error: rawErr } = await (supabase
      .from('raw_sensor_payloads') as any)
      .select('*')
      .order('received_at', { ascending: false })
      .limit(5);

    // 2. Fetch latest device upload logs with generated report info
    const { data: uploadLogs, error: logErr } = await (supabase
      .from('device_upload_logs') as any)
      .select(`
        *,
        reports:generated_report_id (
          id,
          overall_score,
          hydration_status,
          glucose_indicator,
          protein_indicator,
          uti_risk,
          recommendation
        )
      `)
      .order('received_at', { ascending: false })
      .limit(5);

    // 3. Fetch device health list
    const { data: health, error: healthErr } = await (supabase
      .from('device_health') as any)
      .select('*')
      .order('last_heartbeat', { ascending: false });

    return NextResponse.json({
      rawPayloads: rawPayloads || [],
      uploadLogs: uploadLogs || [],
      health: health || []
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
