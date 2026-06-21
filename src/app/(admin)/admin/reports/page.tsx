import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllReports } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldCheck, Download } from 'lucide-react';

export const metadata: Metadata = { title: 'Report Management' };

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await getAllReports(1, 50);

  const completeCount = reports.filter((r) => r.status === 'complete').length;
  const pendingCount = reports.filter((r) => r.status === 'pending' || r.status === 'processing').length;

  return (
    <div className="space-y-8 pb-20 md:pb-0 select-none">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div className="space-y-1">
          <Link
            href="/admin/dashboard"
            className="group flex items-center gap-1.5 text-xs font-mono text-[#9CA3AF] hover:text-[#111827] transition-colors mb-2"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>BACK TO OVERVIEW</span>
          </Link>
          <h1 className="font-display text-3xl font-light text-[#111827] tracking-tight">
            Clinical Report Registry
          </h1>
          <p className="text-xs text-[#6B7280] font-light">
            Audit generated PDF diagnostics, check signatures, and verify compliance state.
          </p>
        </div>

        {/* Dynamic metrics strip */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-[#6B7280]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#16A085]/5 border border-[#16A085]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A085]" />
            <span>{completeCount} COMPLETE</span>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D97706]/5 border border-[#D97706]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span>{pendingCount} PROCESSING</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const shortHash = report.verification_hash
            ? report.verification_hash.substring(0, 12).toUpperCase()
            : 'URO-ING-PRV';

          return (
            <div
              key={report.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#0F7AF3]/35 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              
              {/* Report Information */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-500 border border-red-100 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-medium text-sm text-[#111827] line-clamp-1">
                        {report.title}
                      </h4>
                      <p className="text-[10px] text-[#6B7280] font-light mt-0.5">
                        {formatDate(report.created_at)}
                      </p>
                    </div>
                  </div>

                  <span className={`font-mono text-[9px] font-semibold px-2 py-0.5 rounded border ${
                    report.status === 'complete'
                      ? 'text-[#16A085] bg-[#16A085]/5 border-[#16A085]/10'
                      : 'text-[#D97706] bg-[#D97706]/5 border-[#D97706]/10'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>

                {report.ai_summary && (
                  <p className="text-xs text-[#6B7280] font-light leading-relaxed line-clamp-2">
                    {report.ai_summary}
                  </p>
                )}
              </div>

              {/* Action Buttons & Signature verification */}
              <div className="border-t border-[#E5E7EB]/60 pt-4 flex items-center justify-between text-[10px] font-mono">
                
                {/* Cryptographic verification signature */}
                <div className="flex items-center gap-1 text-[#16A085]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SIGN: {shortHash}</span>
                </div>

                {/* PDF Downloader link */}
                {report.pdf_url ? (
                  <a
                    href={`/api/v1/reports/${report.id}/pdf`}
                    download
                    className="flex items-center gap-1 text-[#0F7AF3] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD</span>
                  </a>
                ) : (
                  <span className="text-[#9CA3AF]">PENDING GENERATION</span>
                )}

              </div>

            </div>
          );
        })}

        {reports.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3 border border-dashed border-[#E5E7EB] rounded-2xl">
            <p className="text-3xl">📄</p>
            <h4 className="font-display font-medium text-base text-[#111827]">
              No clinical reports generated
            </h4>
            <p className="text-xs text-[#6B7280] font-light max-w-xs mx-auto">
              Urinalysis diagnostic sessions have not compile any records yet.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
