import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth, getCurrentProfile } from '@/lib/auth/guards';
import { getReports } from '@/lib/supabase/queries';
import { FileText, Calendar, MapPin, Eye, Download, TrendingUp, ArrowRight, Activity } from 'lucide-react';

export const metadata: Metadata = { title: 'My Health Reports — UroSense' };

type RiskLevel = 'normal' | 'attention' | 'high';

function getRisk(status: string): RiskLevel {
  if (status === 'critical') return 'high';
  if (status === 'caution' || status === 'pending') return 'attention';
  return 'normal';
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const map = {
    normal:    { text: 'text-[#0D9488]', bg: 'bg-teal-50',  border: 'border-teal-200',  dot: 'bg-[#0D9488]', label: 'Normal' },
    attention: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Attention' },
    high:      { text: 'text-rose-600',  bg: 'bg-rose-50',  border: 'border-rose-200',  dot: 'bg-rose-500',  label: 'High Risk' },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map.text} ${map.bg} ${map.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${map.dot}`} />
      {map.label}
    </span>
  );
}

export default async function ReportsPage() {
  await requireAuth();
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  const reports = await getReports(profile.id, 1, 50);

  return (
    <div className="space-y-8 pb-20 md:pb-0" style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight">My Health Reports</h1>
          <p className="text-[#6B7280] mt-1 text-base">
            Complete history of your UroSense urinalysis scans.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
          <TrendingUp className="w-4 h-4" />
          {reports.length} report{reports.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {reports.length === 0 ? (
        /* Empty State */
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center space-y-5">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-[#2563EB]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0B1B33] mb-2">No scan results yet</h3>
            <p className="text-[#6B7280] max-w-md mx-auto leading-relaxed">
              Visit any UroSense-enabled urinal, use it normally, scan the QR code, and your health report will appear here automatically.
            </p>
          </div>
          <Link href="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] transition-colors">
            See How It Works <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Reports Table */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F8FAFC]">
                  {['Date', 'Time', 'Report', 'pH', 'TDS', 'Turbidity', 'Risk Score', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-[11px] font-mono text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => {
                  const rp = (r.parameters as any) || {};
                  const ph   = rp.ph?.value   ?? '—';
                  const tds  = rp.tds?.value  ?? '—';
                  const turb = rp.turbidity?.value ?? '—';
                  const risk = getRisk(r.status);
                  const score = { normal: 92, attention: 68, high: 41 }[risk];
                  const dt = new Date(r.created_at);
                  return (
                    <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="px-5 py-4 font-medium text-[#0B1B33] whitespace-nowrap">
                        {dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 max-w-[180px]">
                        <div>
                          <p className="font-semibold text-[#0B1B33] truncate group-hover:text-[#2563EB] transition-colors">{r.title}</p>
                          <p className="text-[11px] font-mono text-gray-400">ID: {r.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#0B1B33]">{ph}</td>
                      <td className="px-5 py-4 font-semibold text-[#0B1B33]">{tds}</td>
                      <td className="px-5 py-4 font-semibold text-[#0B1B33]">{turb}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 w-16 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${risk === 'normal' ? 'bg-[#0D9488]' : risk === 'attention' ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#0B1B33]">{score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><RiskBadge level={risk} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/reports/${r.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap">
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          {r.pdf_url && (
                            <a href={r.pdf_url} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#0B1B33] whitespace-nowrap">
                              <Download className="w-3.5 h-3.5" /> PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
