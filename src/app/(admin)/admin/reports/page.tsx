import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllReports } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Report Management' };

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await getAllReports(1, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">{reports.length} reports in the system</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Report</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No reports</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{report.title}</p>
                      {report.ai_summary && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">{report.ai_summary}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`capitalize text-xs font-medium ${
                        report.status === 'complete' ? 'text-health-optimal' :
                        report.status === 'error' ? 'text-health-critical' :
                        'text-health-caution'
                      }`}>{report.status}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {report.pdf_url ? (
                        <a
                          href={`/api/v1/reports/${report.id}/pdf`}
                          className="text-xs text-primary hover:underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
