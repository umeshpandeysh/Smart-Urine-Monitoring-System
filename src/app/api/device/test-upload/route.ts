import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createReport } from '@/lib/reports/report-generator';

export async function POST(request: Request) {
  const supabase = createServiceClient();
  try {
    const payload = await request.json();
    const { deviceId, locationId, ph, tds, turbidity, temperature, gasValue, phone } = payload;

    // 1. Resolve Device ID UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(deviceId);
    let query = supabase.from('devices').select('id, location_id');
    if (isUuid) {
      query = query.or(`id.eq.${deviceId},device_code.eq.${deviceId}`);
    } else {
      query = query.eq('device_code', deviceId);
    }
    const { data: deviceData } = await query.single();

    const device = deviceData as any;
    const targetDeviceId = device?.id;
    const targetLocationId = locationId || device?.location_id;

    if (!targetDeviceId || !targetLocationId) {
      return NextResponse.json({ error: 'Device or Location not found in system.' }, { status: 400 });
    }

    // 2. Resolve User ID (by phone or fallback to Aarav Sharma)
    let targetUserId = payload.userId;
    if (!targetUserId) {
      const targetPhone = phone || '+919999999999';
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', targetPhone)
        .single();
      const profile = profileData as any;
      targetUserId = profile?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Patient profile not found.' }, { status: 400 });
    }

    // 3. Extract sensor metrics (support flat payload or nested sensors object)
    const phVal = parseFloat(ph !== undefined ? ph : payload.sensors?.ph);
    const tdsVal = parseFloat(tds !== undefined ? tds : payload.sensors?.tds_ppm);
    const turbidityVal = parseFloat(turbidity !== undefined ? turbidity : payload.sensors?.turbidity_ntu);
    const temperatureVal = parseFloat(temperature !== undefined ? temperature : payload.sensors?.temperature_c);
    const gasVal = parseFloat(gasValue !== undefined ? gasValue : (payload.sensors?.gas_mq2_raw !== undefined ? payload.sensors?.gas_mq2_raw : payload.sensors?.gas_ratio));

    // 4. Trigger orchestrator
    const report = await createReport({
      userId: targetUserId,
      deviceId: targetDeviceId,
      locationId: targetLocationId,
      ph: isNaN(phVal) ? 6.5 : phVal,
      tds: isNaN(tdsVal) ? 350 : tdsVal,
      turbidity: isNaN(turbidityVal) ? 1.5 : turbidityVal,
      temperature: isNaN(temperatureVal) ? 36.6 : temperatureVal,
      gasValue: isNaN(gasVal) ? 20 : gasVal
    });

    // 3.5. Record raw payload
    await (supabase
      .from('raw_sensor_payloads') as any)
      .insert({
        device_id: targetDeviceId,
        raw_payload: payload
      });

    // 4. Record a success test log in device_upload_logs
    await (supabase
      .from('device_upload_logs') as any)
      .insert({
        device_id: targetDeviceId,
        payload: payload,
        processing_status: 'success',
        generated_report_id: report.id
      });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      findings: report.generated_findings,
      pdfUrl: report.generated_pdf_url,
      qrCodeUrl: report.qr_code_url
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
