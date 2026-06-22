import { createServiceClient } from '@/lib/supabase/server';
import { interpretReadings } from '../clinical/interpreter';
import { generateAndUploadPdf } from '../pdf/pdf-generator';
import { calibrateReadings } from '../calibration/calibrator';

export interface ReportGenerationInput {
  userId: string; // profile UUID
  deviceId: string; // devices UUID
  locationId: string; // locations UUID
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
  gasValue: number;
}

/**
 * Automates complete clinical report generation.
 * Maps sensor readings -> Clinical Interpreter -> PDF Upload -> DB insertion.
 */
export async function createReport(input: ReportGenerationInput) {
  const supabase = createServiceClient();

  // 1. Fetch Location details & Profile details for the PDF meta
  const { data: locationData } = await supabase
    .from('locations')
    .select('location_name')
    .eq('id', input.locationId)
    .single();

  const { data: deviceData } = await supabase
    .from('devices')
    .select('device_code')
    .eq('id', input.deviceId)
    .single();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('name, phone')
    .eq('id', input.userId)
    .single();

  const profile = profileData as any;
  const location = locationData as any;
  const device = deviceData as any;

  const patientName = profile?.name || 'Aarav Sharma';
  const phone = profile?.phone || 'N/A';
  const locationName = location?.location_name || 'Terminal 3 Departures Lounge';
  const deviceCode = device?.device_code || 'US-NOD-1001';

  // 1.5. Calibrate raw readings
  const calibrated = await calibrateReadings(input.deviceId, {
    ph: input.ph,
    tds: input.tds,
    turbidity: input.turbidity,
    temperature: input.temperature,
    gasValue: input.gasValue
  });

  // 1.6. Load clinical rules dynamically
  const { data: dbRules } = await (supabase
    .from('clinical_rules') as any)
    .select('rule_name, rule_value');

  const rules = (dbRules || []).reduce((acc: any, r: any) => {
    acc[r.rule_name] = r.rule_value;
    return acc;
  }, {});

  // 2. Perform clinical interpretation
  const interpretation = interpretReadings(calibrated, rules);

  // 3. Pre-insert the report in database to get a valid Report UUID
  const { data: reportRow, error: reportInsertErr } = await (supabase
    .from('reports') as any)
    .insert({
      user_id: input.userId,
      device_id: input.deviceId,
      location_id: input.locationId,
      report_date: new Date().toISOString().split('T')[0],
      hydration_status: interpretation.hydrationStatus,
      glucose_indicator: interpretation.glucoseIndicator,
      protein_indicator: interpretation.proteinIndicator,
      uti_risk: interpretation.utiRisk,
      overall_score: interpretation.overallScore,
      recommendation: interpretation.recommendations.join(' '),
      generated_findings: interpretation,
      generated_recommendations: interpretation.recommendations
    })
    .select()
    .single();

  if (reportInsertErr || !reportRow) {
    throw new Error(`Failed to insert initial report: ${reportInsertErr?.message}`);
  }

  const reportId = (reportRow as any).id;

  // 4. Create associated sensor readings record
  await (supabase.from('sensor_readings') as any).insert({
    report_id: reportId,
    ph: calibrated.ph,
    tds: calibrated.tds,
    turbidity: calibrated.turbidity,
    temperature: calibrated.temperature,
    gas_value: calibrated.gasValue
  });

  // 5. Generate secure PDF and upload to Supabase storage
  let pdfStoragePath = '';
  try {
    pdfStoragePath = await generateAndUploadPdf({
      reportId,
      patientName,
      phone,
      date: new Date().toLocaleDateString(),
      locationName,
      deviceCode,
      readings: {
        ph: calibrated.ph,
        tds: calibrated.tds,
        turbidity: calibrated.turbidity,
        temperature: calibrated.temperature,
        gasValue: calibrated.gasValue
      },
      interpretation
    });
  } catch (pdfErr: any) {
    console.error('PDF Generation pipeline failure:', pdfErr.message);
  }

  // 6. Define QR Retrieval link and public QR code image generation
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const retrievalUrl = `${appUrl}/report/${reportId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(retrievalUrl)}`;

  // 7. Update report metadata in database
  const { data: finalReport } = await (supabase
    .from('reports') as any)
    .update({
      pdf_url: pdfStoragePath,
      generated_pdf_url: pdfStoragePath,
      qr_code_url: qrCodeUrl
    })
    .eq('id', reportId)
    .select()
    .single();

  return finalReport;
}
