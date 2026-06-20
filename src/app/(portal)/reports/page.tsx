import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth/guards';
import { getReports } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Reports' };

export default async function ReportsPage() {
  const user = await requireAuth();
  const reports = await getReports(user.id, 1, 20);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Health Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your AI-generated urinalysis reports with downloadable PDFs.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">📊</p>
          <p className="font-display text-xl font-semibold text-foreground mb-2">No reports yet</p>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Reports are automatically generated after each diagnostic session at a UroSense node.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const statusColor = {
              complete: 'text-health-optimal bg-health-optimal/10 border-health-optimal/30',
              pending: 'text-health-caution bg-health-caution/10 border-health-caution/30',
              processing: 'text-primary bg-primary/10 border-primary/30',
              error: 'text-health-critical bg-health-critical/10 border-health-critical/30',
            }[report.status];

            return (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="glass rounded-xl p-5 flex items-center justify-between card-hover block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-lg">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(report.created_at)}
                    </p>
                    {report.ai_summary && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-xs">
                        {report.ai_summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusColor}`}
                  >
                    {report.status}
                  </span>
                  {report.pdf_url && (
                    <span className="text-xs text-primary">PDF ↓</span>
                  )}
                  <span className="text-muted-foreground">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
