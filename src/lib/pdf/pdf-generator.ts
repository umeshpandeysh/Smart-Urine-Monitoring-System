import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createServiceClient } from '@/lib/supabase/server';

export interface PdfReportData {
  reportId: string;
  patientName: string;
  phone: string;
  date: string;
  locationName: string;
  deviceCode: string;
  readings: {
    ph: number;
    tds: number;
    turbidity: number;
    temperature: number;
    gasValue: number;
  };
  interpretation: {
    hydrationStatus: string;
    glucoseIndicator: string;
    proteinIndicator: string;
    utiRisk: string;
    kidneyStress: string;
    overallScore: number;
    recommendations: string[];
  };
}

/**
 * Generates a professional PDF report using pdf-lib,
 * uploads it to Supabase storage bucket 'reports',
 * and returns the storage path/URL.
 */
export async function generateAndUploadPdf(data: PdfReportData): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.276, 841.89]); // A4 Size
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;

  // Header Background Accent
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: rgb(0.043, 0.106, 0.2), // Dark Slate #0B1B33
  });

  // Logo / Title text
  page.drawText('UroSense Health Screening Report', {
    x: 35,
    y: height - 60,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Automated Urine Analytics & Biomarker Screening', {
    x: 35,
    y: height - 80,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.8, 0.8),
  });

  y = height - 130;

  // Patient / Report details block
  page.drawText(`Report ID: ${data.reportId}`, { x: 35, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`Date: ${data.date}`, { x: width / 2, y, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

  y -= 18;
  page.drawText(`Patient: ${data.patientName}`, { x: 35, y, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(`Location: ${data.locationName}`, { x: width / 2, y, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

  y -= 18;
  page.drawText(`Phone: ${data.phone}`, { x: 35, y, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(`Device Node: ${data.deviceCode}`, { x: width / 2, y, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

  y -= 30;

  // Divider Line
  page.drawLine({
    start: { x: 35, y },
    end: { x: width - 35, y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });

  y -= 25;

  // 1. Overall Score
  page.drawText('Overall Wellness Score', { x: 35, y, size: 14, font: fontBold, color: rgb(0.043, 0.106, 0.2) });
  y -= 30;

  page.drawRectangle({
    x: 35,
    y,
    width: 140,
    height: 45,
    color: rgb(0.95, 0.97, 1.0),
    borderColor: rgb(0.145, 0.388, 0.92), // Blue border
    borderWidth: 1.5,
  });

  page.drawText(`${data.interpretation.overallScore}`, {
    x: 65,
    y: y + 12,
    size: 24,
    font: fontBold,
    color: rgb(0.145, 0.388, 0.92),
  });

  page.drawText('/ 100', {
    x: 115,
    y: y + 14,
    size: 11,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Score description next to it
  const scoreMsg = data.interpretation.overallScore >= 85
    ? 'Excellent overall hydration & metabolic indicator values.'
    : data.interpretation.overallScore >= 70
    ? 'Moderate indicator parameters. General wellness check advised.'
    : 'Lower scoring parameters. Action suggested for hydration and standard screening.';

  page.drawText(scoreMsg, {
    x: 195,
    y: y + 20,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  y -= 35;

  // 2. Health Indicators Table
  page.drawText('Health Indicators & Screening Findings', { x: 35, y, size: 12, font: fontBold, color: rgb(0.043, 0.106, 0.2) });
  y -= 15;

  const tableHeaders = ['Indicator Name', 'Interpretation Status / Finding', 'Sensor Values'];
  const tableData = [
    ['Hydration Status', data.interpretation.hydrationStatus, `TDS: ${data.readings.tds} ppm`],
    ['Glucose Indicator', data.interpretation.glucoseIndicator, `Gas: ${data.readings.gasValue} mV`],
    ['Protein Indicator', data.interpretation.proteinIndicator, `Turbidity: ${data.readings.turbidity} NTU`],
    ['UTI Risk', data.interpretation.utiRisk, `pH: ${data.readings.ph}`],
    ['Kidney Stress Indicator', data.interpretation.kidneyStress, `Temp: ${data.readings.temperature} C`],
  ];

  // Draw table header
  page.drawRectangle({
    x: 35,
    y: y - 18,
    width: width - 70,
    height: 18,
    color: rgb(0.95, 0.95, 0.95),
  });

  page.drawText(tableHeaders[0], { x: 45, y: y - 13, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(tableHeaders[1], { x: 220, y: y - 13, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(tableHeaders[2], { x: 440, y: y - 13, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

  y -= 18;

  for (const row of tableData) {
    y -= 20;
    // Row background border
    page.drawLine({ start: { x: 35, y }, end: { x: width - 35, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });

    page.drawText(row[0], { x: 45, y: y + 5, size: 9, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(row[1], { x: 220, y: y + 5, size: 9, font: fontBold, color: rgb(0.2, 0.4, 0.2) });
    page.drawText(row[2], { x: 440, y: y + 5, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  }

  y -= 30;

  // 3. Recommendations Block
  page.drawText('Wellness Recommendations', { x: 35, y, size: 12, font: fontBold, color: rgb(0.043, 0.106, 0.2) });
  y -= 15;

  for (const rec of data.interpretation.recommendations) {
    y -= 18;
    page.drawText('•', { x: 45, y, size: 10, font: fontBold, color: rgb(0.145, 0.388, 0.92) });
    page.drawText(rec, {
      x: 58,
      y,
      size: 9,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Footer Disclaimer
  y = 60;
  page.drawRectangle({
    x: 35,
    y: 35,
    width: width - 70,
    height: 45,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 0.5,
  });

  page.drawText('IMPORTANT DISCLAIMER: This document represents a wellness screening report.', {
    x: 45,
    y: 65,
    size: 7.5,
    font: fontBold,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText('UroSense does NOT provide official medical diagnosis or clinical confirmations. Please share these findings with', {
    x: 45,
    y: 53,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText('your qualified health professional or clinician for proper diagnosis and medical evaluation.', {
    x: 45,
    y: 41,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  const pdfBytes = await pdfDoc.save();

  // Upload to Supabase Storage Bucket 'reports'
  const supabase = createServiceClient();
  const fileName = `${data.reportId}.pdf`;

  // Upsert the generated PDF
  const { error: uploadError } = await supabase.storage
    .from('reports')
    .upload(fileName, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload PDF: ${uploadError.message}`);
  }

  // Return local storage representation format
  return `reports/${fileName}`;
}
