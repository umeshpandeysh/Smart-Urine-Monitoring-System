'use client';

import React from 'react';
import Link from 'next/link';
import type { Report } from '@/types';
import { formatDate } from '@/lib/utils';
import { ArrowRight, FileText } from 'lucide-react';

interface RecentReportsProps {
  reports: Report[];
}

export default function RecentReports({ reports }: RecentReportsProps) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[300px]">
      <div>
        <span className="text-xs font-mono tracking-widest text-[#0F7AF3] uppercase font-semibold">Diagnostic Records</span>
        <h4 className="font-display font-medium text-lg text-[#111827] mt-1">Recent Reports</h4>
      </div>

      <div className="flex-1 mt-6 space-y-3">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <span className="text-3xl mb-2">📄</span>
            <p className="text-xs text-[#6B7280] font-light">No health reports generated yet.</p>
          </div>
        ) : (
          reports.map((report) => (
            <Link 
              key={report.id}
              href={`/reports/${report.id}`}
              className="group p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0F7AF3] hover:shadow-[0_4px_16px_rgba(0,0,0,0.01)] transition-all duration-200 flex items-center justify-between block bg-[#FAFAF8]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#0F7AF3]" />
                </div>
                <div>
                  <h5 className="text-xs font-medium text-[#111827] leading-none">{report.title}</h5>
                  <span className="text-[10px] text-[#6B7280] font-light mt-1 block">{formatDate(report.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                  report.status === 'complete' ? 'text-[#16A085] bg-[#16A085]/5 border-[#16A085]/15' :
                  report.status === 'error' ? 'text-[#C0392B] bg-[#C0392B]/5 border-[#C0392B]/15' :
                  'text-[#D97706] bg-[#D97706]/5 border-[#D97706]/15'
                }`}>
                  {report.status}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#0F7AF3] group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </Link>
          ))
        )}
      </div>

      {reports.length > 0 && (
        <div className="pt-4 border-t border-gray-50 flex justify-end">
          <Link href="/reports" className="text-xs text-[#0F7AF3] font-semibold hover:underline flex items-center gap-1">
            View all reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
