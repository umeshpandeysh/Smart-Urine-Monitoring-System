import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { hashToken } from '@/lib/security/telemetry';
import type { TelemetryPayload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelemetryPayload;

    if (!body.device_id) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
    }

    // 1. Resolve client token from headers or request payload
    const apiKey = request.headers.get('x-api-key') ?? body.api_key;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing authentication credentials' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // 2. Fetch device telemetry credentials
    const { data: device, error: deviceError } = (await supabase
      .from('devices')
      .select('id, hashed_api_token, token_expires_at')
      .eq('id', body.device_id)
      .single()) as any;

    if (deviceError || !device) {
      return NextResponse.json({ error: 'Device not registered' }, { status: 404 });
    }

    // 3. Enforce device validation: Check if token exists on device
    if (!device.hashed_api_token) {
      return NextResponse.json({ error: 'Device credentials not initialized' }, { status: 401 });
    }

    // 4. Validate token expiration
    if (device.token_expires_at && new Date(device.token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Device credentials expired' }, { status: 401 });
    }

    // 5. Compare hashed incoming token with database record
    const incomingHashed = hashToken(apiKey);
    if (incomingHashed !== device.hashed_api_token) {
      return NextResponse.json({ error: 'Invalid authentication credentials' }, { status: 401 });
    }

    // 6. Insert sensor reading (authorized)
    const { data: reading, error: readingError } = await supabase
      .from('sensor_readings')
      .insert({
        device_id: body.device_id,
        ph: body.readings.ph,
        tds_ppm: body.readings.tds_ppm,
        turbidity_ntu: body.readings.turbidity_ntu,
        temperature_c: body.readings.temperature_c,
        flow_rate_ml_min: body.readings.flow_rate_ml_min,
        total_volume_ml: body.readings.total_volume_ml,
        color_r: body.readings.color_r,
        color_g: body.readings.color_g,
        color_b: body.readings.color_b,
        hydration_index: body.readings.hydration_index,
        recorded_at: body.recorded_at ?? new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .select()
      .single();

    if (readingError) {
      console.error('Failed to write telemetry data:', readingError.message);
      return NextResponse.json({ error: readingError.message }, { status: 500 });
    }

    // 7. Update device operational state
    await supabase
      .from('devices')
      // @ts-expect-error - Supabase type inference issue
      .update({
        last_seen_at: new Date().toISOString(),
        status: 'online',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .eq('id', body.device_id);

    // 8. Log hardware health metrics if present
    if (body.device_health) {
      await supabase.from('device_telemetry').insert({
        device_id: body.device_id,
        cpu_temp: body.device_health.cpu_temp,
        wifi_rssi: body.device_health.wifi_rssi,
        free_heap: body.device_health.free_heap,
        uptime_seconds: body.device_health.uptime_seconds,
        recorded_at: new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }

    return NextResponse.json(
      { success: true, reading_id: (reading as unknown as { id: string }).id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Telemetry ingestion failure:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
