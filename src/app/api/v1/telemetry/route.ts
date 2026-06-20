import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import type { TelemetryPayload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelemetryPayload;

    // Validate API key
    const apiKey = request.headers.get('x-api-key') ?? body.api_key;
    if (apiKey !== process.env.TELEMETRY_INGEST_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Verify device exists
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('id', body.device_id)
      .single();

    if (deviceError || !device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Insert sensor reading
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
      return NextResponse.json({ error: readingError.message }, { status: 500 });
    }

    // Update device last_seen_at and status
    await supabase
      .from('devices')
      // @ts-expect-error - Supabase type inference issue
      .update({
        last_seen_at: new Date().toISOString(),
        status: 'online',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .eq('id', body.device_id);

    // Insert device telemetry if provided
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
  } catch (error) {
    console.error('Telemetry ingestion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
