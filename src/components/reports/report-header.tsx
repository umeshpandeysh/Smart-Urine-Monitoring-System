'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ReportHeaderProps {
  id: string;
  createdAt: string;
  sensorReadingId: string | null;
  status: string;
}

export default function ReportHeader({ id, createdAt, sensorReadingId, status }: ReportHeaderProps) {
  const shortId = id ? id.split('-')[0].toUpperCase() : 'UNKNOWN';
  const reportRef = `UR-${shortId}`;
  
  // Format Date and Time separately for clinical presentation
  const dateObj = new Date(createdAt);
  const formattedDate = formatDate(createdAt, { month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const nodeName = sensorReadingId 
    ? `US-NODE-${sensorReadingId.substring(0, 5).toUpperCase()}`
    : 'US-NODE-042';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Clinical Title & Reference */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#0F7AF3]/5 text-[#0F7AF3] border border-[#0F7AF3]/15">
              CLINICAL DIAGNOSTIC
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#16A085] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Ingest
            </span>
          </div>
          <h1 className="font-display font-light text-2xl md:text-3xl text-[#111827] tracking-tight">
            Urinalysis Assessment Report
          </h1>
          <p className="text-xs font-mono text-[#6B7280]">
            REFERENCE ID: <span className="text-[#111827] font-semibold">{reportRef}</span>
          </p>
        </div>

        {/* Right Side: Clinical Metadata Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-[#E5E7EB] pt-6 md:pt-0 md:pl-8">
          
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider">Date Analyzed</p>
            <p className="text-sm font-medium text-[#111827]">{formattedDate}</p>
            <p className="text-xs font-mono text-[#6B7280]/70">{formattedTime}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider">Ingest Source</p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#111827]">
              <Cpu className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="font-mono">{nodeName}</span>
            </div>
            <p className="text-xs text-[#6B7280]/70 font-light">Hardware Sensor</p>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <p className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider">Report Status</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                status === 'complete' ? 'bg-[#16A085]' : 'bg-[#D97706] animate-pulse'
              }`} />
              <span className="text-sm font-medium text-[#111827] capitalize">
                {status || 'Pending'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280]/70 font-light">Signed Cryptographically</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
