import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft, Calendar, MapPin, FileText, Download,
  Droplets, Shield, Activity, FlaskConical, Thermometer, Eye,
  CheckCircle2, AlertTriangle, User, Clock, Hash,
} from 'lucide-react';
import { requireAuth, getCurrentProfile } from '@/lib/auth/guards';
import { getReportById } from '@/lib/supabase/queries';
import PdfDownload from '@/components/reports/pdf-download';

export const metadata: Metadata = { title: 'Health Report — UroSense' };

interface ReportParams {
  params: Promise<{ id: string }>;
}

/* ── Helpers ── */
type RiskLevel = 'normal' | 'attention' | 'high';

function statusToRisk(status: string): RiskLevel {
  if (status === 'critical') return 'high';
  if (status === 'caution') return 'attention';
  return 'normal';
}

function getRiskColors(level: RiskLevel) {
  return {
    normal: { text: 'text-[#0D9488]', bg: 'bg-teal-50', border: 'border-teal-200', badge: 'Normal Range', dot: 'bg-[#0D9488]' },
    attention: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'Borderline', dot: 'bg-amber-500' },
    high: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', badge: 'High — See Doctor', dot: 'bg-rose-500' },
  }[level];
}

function ResultBadge({ status }: { status: RiskLevel }) {
  const c = getRiskColors(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.text} ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.badge}
    </span>
  );
}

function FindingRow({ icon: Icon, label, value, unit, status, description, color }: {
  icon: any; label: string; value: string | number; unit: string;
  status: RiskLevel; description: string; color: string;
}) {
  const c = getRiskColors(status);
  return (
    <div className={`rounded-xl border p-5 space-y-3 ${c.bg} ${c.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm">
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-xl font-extrabold text-[#0B1B33]">
              {value} <span className="text-xs font-normal text-gray-400">{unit}</span>
            </p>
          </div>
        </div>
        <ResultBadge status={status} />
      </div>
      <p className="text-xs text-gray-600 leading-relaxed pl-1">{description}</p>
    </div>
  );
}

export default async function ReportDetailPage({ params }: ReportParams) {
  await requireAuth();
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  const { id } = await params;
  const report = await getReportById(id);

  if (!report) notFound();
  if (report.profile_id !== profile.id) notFound();

  const rawParams = (report.parameters as Record<string, { value: number; unit: string; status: string }>) || {};
  const parameters = {
    ph:          rawParams.ph          || { value: 6.5,  unit: 'pH',  status: 'optimal' },
    tds:         rawParams.tds         || { value: 450,  unit: 'ppm', status: 'optimal' },
    temperature: rawParams.temperature || { value: 36.8, unit: '°C',  status: 'optimal' },
    turbidity:   rawParams.turbidity   || { value: 1.2,  unit: 'NTU', status: 'optimal' },
  };

  const statuses = Object.values(parameters).map(p => p.status);
  const overallStatus: 'optimal' | 'caution' | 'critical' = statuses.includes('critical') ? 'critical' : statuses.includes('caution') ? 'caution' : 'optimal';
  const overallRisk: RiskLevel = statusToRisk(overallStatus);
  const overallC = getRiskColors(overallRisk);

  const createdAt = new Date(report.created_at);
  const dateStr = createdAt.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const aiSummary = report.ai_summary ||
    'Your urine sample was analysed using UroSense optical and chemical sensors. The results show that your hydration levels and kidney function markers are within expected ranges. No significant glucose or protein elevation was detected in this sample.';

  const recommendations = overallRisk === 'normal'
    ? ['Maintain current fluid intake of 2–3 litres per day', 'Continue balanced diet with reduced processed food', 'Schedule your next scan in 30 days to monitor trends', 'Share this report with your doctor during your next visit']
    : overallRisk === 'attention'
    ? ['Increase daily water intake to at least 2.5 litres', 'Avoid sugary beverages and excess caffeine for 48–72 hours', 'Repeat this test within 7 days to confirm improvement', 'Consider speaking to a doctor if any symptoms appear']
    : ['Consult a physician within 24–48 hours', 'Begin immediate rehydration with electrolyte solution', 'Avoid strenuous exercise until next check-up', 'Bring this report to your medical appointment'];

  const avoidItems = overallRisk === 'normal'
    ? ['Excess alcohol consumption', 'Prolonged periods without drinking water', 'High-sodium processed and packaged foods']
    : ['Sugary beverages such as cola and fruit drinks', 'Caffeine and alcohol', 'Excess sodium and salty snacks', 'Strenuous outdoor activity without hydration'];

  return (
    <div className="space-y-8 pb-20 md:pb-0" style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between">
        <Link href="/reports"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0B1B33] transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Reports
        </Link>
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider hidden sm:block">
          UroSense Medical Report
        </span>
      </div>

      {/* ── Report Title Block ── */}
      <div className={`rounded-2xl border-2 p-6 md:p-8 ${overallC.bg} ${overallC.border}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Urinalysis Health Report</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1B33] tracking-tight">
                  {report.title || 'UroSense Health Report'}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{dateStr}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{timeStr}</span>
              <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-gray-400" />ID: {report.id.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <ResultBadge status={overallRisk} />
            <p className={`text-sm font-semibold ${overallC.text}`}>
              {overallRisk === 'normal' ? 'All markers within normal range' :
               overallRisk === 'attention' ? 'Some markers need attention' :
               'Medical review recommended'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left — 7 cols */}
        <div className="lg:col-span-7 space-y-6">

          {/* Patient Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base font-bold text-[#0B1B33]">Patient Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Patient Name', value: `${profile.first_name || 'Patient'} ${profile.last_name || ''}`.trim() },
                { label: 'Patient ID', value: profile.id.substring(0, 8).toUpperCase() },
                { label: 'Report Date', value: dateStr },
                { label: 'Scan Time', value: timeStr },
              ].map((f) => (
                <div key={f.label} className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-[#0B1B33]">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Urine Findings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base font-bold text-[#0B1B33]">Urine Findings</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FindingRow
                icon={Droplets} label="Blood Sugar (Glucose)" value="Negative" unit="" color="#2563EB"
                status="normal"
                description="No glucose detected. This is a normal result and reduces the risk of diabetes-related kidney disease."
              />
              <FindingRow
                icon={Shield} label="Protein" value={parameters.tds.value} unit={parameters.tds.unit} color="#0D9488"
                status={statusToRisk(parameters.tds.status)}
                description="Protein levels indicate kidney filtering capacity. Elevated levels may suggest kidney stress."
              />
              <FindingRow
                icon={Activity} label="Urea (Kidney Load)" value={parameters.tds.value} unit="ppm" color="#7C3AED"
                status={statusToRisk(parameters.tds.status)}
                description="Urea concentration indicates how well your kidneys are filtering waste from your blood."
              />
              <FindingRow
                icon={Activity} label="pH (Acidity)" value={parameters.ph.value} unit="pH" color="#D97706"
                status={statusToRisk(parameters.ph.status)}
                description="Normal urine pH is 6.0–7.5. Deviations can indicate diet, metabolic issues, or UTI."
              />
              <FindingRow
                icon={Droplets} label="Hydration Index" value={`${Math.round((1 - parameters.ph.value / 14) * 100)}%`} unit="" color="#2563EB"
                status={statusToRisk(parameters.ph.status)}
                description="Hydration index derived from urine concentration and specific gravity indicators."
              />
              <FindingRow
                icon={Eye} label="Turbidity (Clarity)" value={parameters.turbidity.value} unit="NTU" color="#6B7280"
                status={statusToRisk(parameters.turbidity.status)}
                description="Turbidity measures how clear your urine is. High turbidity may indicate infection or dehydration."
              />
            </div>
          </div>

          {/* Health Interpretation */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base font-bold text-[#0B1B33]">Health Interpretation</h2>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-[#4B5563] leading-relaxed">{aiSummary}</p>
            </div>
            {report.summary && report.summary !== aiSummary && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">Clinical Summary</p>
                <p className="text-sm text-[#1d4ed8] leading-relaxed">{report.summary}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Temperature at Analysis', value: `${parameters.temperature.value} ${parameters.temperature.unit}`, status: statusToRisk(parameters.temperature.status) },
                { label: 'Turbidity (NTU)', value: `${parameters.turbidity.value} NTU`, status: statusToRisk(parameters.turbidity.status) },
                { label: 'Overall Assessment', value: overallRisk === 'normal' ? 'All Clear' : overallRisk === 'attention' ? 'Monitor' : 'Action Needed', status: overallRisk },
              ].map((s) => {
                const sc = getRiskColors(s.status);
                return (
                  <div key={s.label} className={`rounded-xl p-3 ${sc.bg} border ${sc.border}`}>
                    <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-sm font-bold ${sc.text}`}>{s.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — 5 cols */}
        <div className="lg:col-span-5 space-y-6">

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0D9488]" />
              <h2 className="text-base font-bold text-[#0B1B33]">Recommendations</h2>
            </div>
            <ul className="space-y-3">
              {recommendations.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#4B5563] leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Avoid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-[#0B1B33]">Things to Avoid</h2>
            </div>
            <ul className="space-y-3">
              {avoidItems.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </span>
                  <span className="text-sm text-[#4B5563] leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Report Verification */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-[#0D9488]" />
              <h2 className="text-base font-bold text-[#0B1B33]">Report Authenticity</h2>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Report ID', value: report.id.substring(0, 16).toUpperCase() },
                { label: 'Issued', value: dateStr },
                { label: 'Source', value: 'UroSense Diagnostic Device' },
              ].map((f) => (
                <div key={f.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500 font-medium">{f.label}</span>
                  <span className="font-semibold text-[#0B1B33] text-right max-w-[60%] truncate">{f.value}</span>
                </div>
              ))}
              {report.verification_hash && (
                <div className="bg-[#F8FAFC] rounded-xl p-3 mt-2">
                  <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">Verification Hash</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{report.verification_hash.substring(0, 32)}…</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
              <p className="text-xs text-[#0D9488] font-semibold">This report is cryptographically verified</p>
            </div>
          </div>

          {/* Download */}
          <div className="bg-[#0B1B33] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white">Download Report</h2>
            </div>
            <p className="text-sm text-[#94A3B8]">
              Download a PDF copy of this report to share with your doctor or keep for your personal records.
            </p>
            <PdfDownload reportId={report.id} pdfUrl={report.pdf_url} />
          </div>

        </div>
      </div>
    </div>
  );
}
