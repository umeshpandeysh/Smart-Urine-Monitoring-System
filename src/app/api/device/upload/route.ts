import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createReport } from '@/lib/reports/report-generator';

export async function POST(request: Request) {
  const supabase = createServiceClient();
  let payload: any;
  let logId: string | null = null;
  let targetDeviceId: string | null = null;

  try {
    payload = await request.json();

    // 0. Extract and validate Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header.' }, { status: 401 });
    }
    const apiKey = authHeader.substring(7).trim();

    const { data: keyRecord } = await (supabase
      .from('device_api_keys') as any)
      .select('device_id')
      .eq('api_key', apiKey)
      .single();

    if (!keyRecord) {
      return NextResponse.json({ error: 'Unauthorized: Invalid device API key.' }, { status: 401 });
    }

    const authorizedDeviceId = keyRecord.device_id;

    // 1. Resolve Device UUID from deviceId (could be device_code or UUID)
    const deviceIdInput = payload.deviceId || payload.deviceCode;
    if (!deviceIdInput) {
      throw new Error('Device identifier (deviceId or deviceCode) is required.');
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(deviceIdInput);
    let query = supabase.from('devices').select('id, location_id');
    if (isUuid) {
      query = query.or(`id.eq.${deviceIdInput},device_code.eq.${deviceIdInput}`);
    } else {
      query = query.eq('device_code', deviceIdInput);
    }
    const { data: deviceData } = await query.single();

    const device = deviceData as any;
    targetDeviceId = device?.id || null;
    const locationId = payload.locationId || device?.location_id;

    if (!targetDeviceId) {
      throw new Error('Device not found in system.');
    }

    if (targetDeviceId !== authorizedDeviceId) {
      return NextResponse.json({ error: 'Unauthorized: API key does not match the device ID.' }, { status: 403 });
    }

    // 1.5. Store the raw payload in raw_sensor_payloads
    await (supabase
      .from('raw_sensor_payloads') as any)
      .insert({
        device_id: targetDeviceId,
        raw_payload: payload
      });

    // 2. Insert into device_upload_logs before processing (pre-logging)
    const { data: logEntry } = await (supabase
      .from('device_upload_logs') as any)
      .insert({
        device_id: targetDeviceId,
        payload: payload,
        processing_status: 'pending'
      })
      .select()
      .single();

    logId = logEntry?.id || null;

    if (!locationId) {
      throw new Error('Location ID could not be determined. Please specify locationId.');
    }

    // 3. Resolve User UUID (by phone if provided, fallback to default seed patient Aarav Sharma)
    let targetUserId = payload.userId;
    if (!targetUserId) {
      const phoneInput = payload.phone || '+919999999999';
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phoneInput)
        .single();
      const profile = profileData as any;
      targetUserId = profile?.id;
    }

    if (!targetUserId) {
      throw new Error('No valid patient user profile found to link the report.');
    }

    // 4. Extract sensor metrics (support flat payload or nested sensors object)
    const ph = parseFloat(payload.ph !== undefined ? payload.ph : payload.sensors?.ph);
    const tds = parseFloat(payload.tds !== undefined ? payload.tds : payload.sensors?.tds_ppm);
    const turbidity = parseFloat(payload.turbidity !== undefined ? payload.turbidity : payload.sensors?.turbidity_ntu);
    const temperature = parseFloat(payload.temperature !== undefined ? payload.temperature : payload.sensors?.temperature_c);
    const gasValue = parseFloat(payload.gasValue !== undefined ? payload.gasValue : (payload.sensors?.gas_mq2_raw !== undefined ? payload.sensors?.gas_mq2_raw : payload.sensors?.gas_ratio));

    if (isNaN(ph) || isNaN(tds) || isNaN(turbidity) || isNaN(temperature) || isNaN(gasValue)) {
      throw new Error(`Invalid or missing sensor metrics in payload. Parsed values: pH=${ph}, TDS=${tds}, Turbidity=${turbidity}, Temp=${temperature}, Gas=${gasValue}`);
    }

    // 5. Run the Report Generation Pipeline
    const report: any = await createReport({
      userId: targetUserId,
      deviceId: targetDeviceId || '',
      locationId: locationId,
      ph,
      tds,
      turbidity,
      temperature,
      gasValue
    });

    // 6. Update upload log status to success
    if (logId) {
      await (supabase
        .from('device_upload_logs') as any)
        .update({
          processing_status: 'success',
          generated_report_id: report?.id
        })
        .eq('id', logId);
    }

    return NextResponse.json({
      success: true,
      reportId: report.id,
      findings: report.generated_findings,
      qrCodeUrl: report.qr_code_url,
      pdfUrl: report.generated_pdf_url
    });

  } catch (err: any) {
    console.error('Device Ingestion Pipeline crash:', err.message);

    // Update upload log status to error
    if (logId) {
      await (supabase
        .from('device_upload_logs') as any)
        .update({
          processing_status: 'error'
        })
        .eq('id', logId);
    }

    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
