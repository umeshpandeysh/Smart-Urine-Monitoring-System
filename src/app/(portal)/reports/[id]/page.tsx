import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/guards';
import { getReportById } from '@/lib/supabase/queries';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Report Detail' };

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) notFound();

  const parameters = report.parameters as Record<string, { value: number; unit: string; status: string }> | null;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/reports" className="hover:text-foreground transition-colors">Reports</Link>
        <span>/</span>
        <span className="text-foreground truncate">{report.title}</span>
      </div>

      {/* Report header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{report.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{formatDateTime(report.created_at)}</p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize shrink-0 ${
              report.status === 'complete'
                ? 'text-health-optimal bg-health-optimal/10 border-health-optimal/30'
                : report.status === 'pending'
                ? 'text-health-caution bg-health-caution/10 border-health-caution/30'
                : 'text-muted-foreground bg-muted border-border'
            }`}
          >
            {report.status}
          </span>
        </div>

        {/* AI Summary */}
        {report.ai_summary && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              🧠 AI Health Summary
            </p>
            <p className="text-sm text-foreground leading-relaxed">{report.ai_summary}</p>
          </div>
        )}
      </div>

      {/* Sensor Parameters */}
      {parameters && Object.keys(parameters).length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Biomarker Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(parameters).map(([key, param]) => (
              <div
                key={key}
                className={`p-4 rounded-xl border ${
                  param.status === 'optimal'
                    ? 'bg-health-optimal/5 border-health-optimal/20'
                    : param.status === 'caution'
                    ? 'bg-health-caution/5 border-health-caution/20'
                    : 'bg-health-critical/5 border-health-critical/20'
                }`}
              >
                <p className="text-xs text-muted-foreground capitalize mb-1">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="font-mono font-bold text-lg text-foreground">
                  {param.value}
                  <span className="text-xs font-normal text-muted-foreground ml-1">{param.unit}</span>
                </p>
                <p
                  className={`text-xs font-medium mt-1 capitalize ${
                    param.status === 'optimal'
                      ? 'text-health-optimal'
                      : param.status === 'caution'
                      ? 'text-health-caution'
                      : 'text-health-critical'
                  }`}
                >
                  {param.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Download */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Clinical PDF Report</h2>
        {report.pdf_url ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/api/v1/reports/${report.id}/pdf`}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
              download
            >
              <span>⬇</span> Download PDF
            </a>
            {report.verification_hash && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted border border-border text-xs font-mono text-muted-foreground truncate">
                <span className="text-health-optimal shrink-0">✓</span>
                <span className="truncate">Verified: {report.verification_hash.slice(0, 16)}...</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {report.status === 'processing'
              ? 'PDF is being generated...'
              : 'PDF report not yet available.'}
          </p>
        )}
      </div>
    </div>
  );
}
