import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  try {
    const { data: healthData, error } = await (supabase
      .from('device_health') as any)
      .select(`
        *,
        devices:device_id (
          device_code,
          locations:location_id (
            location_name
          )
        )
      `)
      .order('last_upload', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(healthData || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createServiceClient();
  try {
    const payload = await request.json();
    const { deviceId, status, batteryLevel, signalStrength, sensorStatus, firmwareVersion } = payload;

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    // Upsert device health status
    const { data, error } = await (supabase
      .from('device_health') as any)
      .upsert({
        device_id: deviceId,
        last_upload: new Date().toISOString(),
        status: status || 'online',
        battery_level: batteryLevel !== undefined ? Number(batteryLevel) : 100,
        signal_strength: signalStrength !== undefined ? Number(signalStrength) : -50,
        sensor_status: sensorStatus || { ph: 'ok', tds: 'ok', turbidity: 'ok', temp: 'ok', gas: 'ok' },
        firmware_version: firmwareVersion || 'v1.0.0'
      }, { onConflict: 'device_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
