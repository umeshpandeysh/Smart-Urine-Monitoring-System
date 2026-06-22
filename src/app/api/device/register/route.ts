import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createServiceClient();
  try {
    const payload = await request.json();
    const { deviceCode, locationId, firmwareVersion } = payload;

    if (!deviceCode) {
      return NextResponse.json({ error: 'deviceCode is required' }, { status: 400 });
    }

    // 1. Insert device details
    const { data: device, error: devErr } = await (supabase
      .from('devices') as any)
      .insert({
        device_code: deviceCode,
        location_id: locationId || null,
        status: 'online',
        firmware_version: firmwareVersion || 'v1.0.0',
        last_seen: new Date().toISOString()
      })
      .select()
      .single();

    if (devErr || !device) {
      return NextResponse.json({ error: devErr?.message || 'Failed to register device' }, { status: 500 });
    }

    const deviceId = (device as any).id;

    // 2. Generate a secure random API key for the device
    const apiKey = `uro_key_${crypto.randomUUID().replace(/-/g, '')}`;
    const { error: keyErr } = await (supabase
      .from('device_api_keys') as any)
      .insert({
        device_id: deviceId,
        api_key: apiKey
      });

    if (keyErr) {
      return NextResponse.json({ error: keyErr.message }, { status: 500 });
    }

    // 3. Create default device_health entry
    await (supabase
      .from('device_health') as any)
      .insert({
        device_id: deviceId,
        last_upload: new Date().toISOString(),
        sensor_status: { ph: 'ok', tds: 'ok', turbidity: 'ok', temp: 'ok', gas: 'ok' },
        battery_level: 100,
        firmware_version: firmwareVersion || 'v1.0.0',
        signal_strength: -45,
        status: 'online'
      });

    return NextResponse.json({
      success: true,
      deviceId: deviceId,
      deviceCode: deviceCode,
      apiKey: apiKey
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
