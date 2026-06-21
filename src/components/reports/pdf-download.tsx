'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Check, Loader2 } from 'lucide-react';

interface PdfDownloadProps {
  reportId: string;
  pdfUrl: string | null;
}

export default function PdfDownload({ reportId, pdfUrl }: PdfDownloadProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    // Avoid double download or triggering while processing
    if (downloading || downloaded) return;

    setDownloading(true);
    
    // Simulate premium download latency / progress for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDownloading(false);
    setDownloaded(true);

    // Reset download status after a few seconds
    setTimeout(() => {
      setDownloaded(false);
    }, 4000);
  };

  const downloadTarget = pdfUrl || `/api/v1/reports/${reportId}/pdf`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)]"
    >
      <div className="flex items-start gap-4">
        {/* Document Icon Graphic */}
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 shrink-0">
          <FileText className="w-6 h-6" />
        </div>

        {/* Text Info */}
        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="font-display font-medium text-sm text-[#111827] truncate">
            Clinical Summary.pdf
          </h4>
          <p className="text-xs text-[#6B7280] font-light">
            Portable document formatted for medical records.
          </p>
          <p className="text-[10px] font-mono text-[#9CA3AF]">
            PDF DOCUMENT • 284 KB
          </p>
        </div>
      </div>

      {/* Premium Download Interactive Button */}
      <div className="mt-6">
        <a
          href={downloadTarget}
          onClick={handleDownload}
          download={`urosense-report-${reportId.substring(0, 8)}.pdf`}
          className="relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#0F7AF3] bg-[#0F7AF3] text-[#FFFFFF] text-sm font-semibold overflow-hidden hover:bg-[#0F7AF3]/95 transition-all duration-200 block text-center"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Document...</span>
            </>
          ) : downloaded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Document Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Official Report</span>
            </>
          )}

          {/* Micro-Animation Loading Background Bar */}
          {downloading && (
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: '0%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 h-1 bg-[#FFFFFF]/25 w-full"
            />
          )}
        </a>
      </div>
    </motion.div>
  );
}
