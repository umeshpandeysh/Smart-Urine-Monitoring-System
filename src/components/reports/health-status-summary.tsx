'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface HealthStatusSummaryProps {
  status: 'optimal' | 'caution' | 'critical';
}

export default function HealthStatusSummary({ status }: HealthStatusSummaryProps) {
  const config = {
    optimal: {
      label: 'Optimal Physiological Clearance',
      desc: 'All measured urine biomarkers exist within ideal physiological bands. Fluid homeostasis and metabolic excretion demonstrate normal, balanced functions. Current lifestyle parameters are supporting peak performance.',
      themeBg: 'bg-gradient-to-br from-[#16A085]/5 to-[#16A085]/10',
      themeText: 'text-[#16A085]',
      themeBorder: 'border-[#16A085]/15',
      icon: CheckCircle2,
      subStatus: 'Optimal Range'
    },
    caution: {
      label: 'Clinical Concentration Warning — Monitor',
      desc: 'Significant concentration variances detected across pH and TDS. Indications point toward dehydration or elevated metabolic waste concentration. Active rehydration sequence is recommended to restore regular balance.',
      themeBg: 'bg-gradient-to-br from-[#D97706]/5 to-[#D97706]/10',
      themeText: 'text-[#D97706]',
      themeBorder: 'border-[#D97706]/15',
      icon: AlertCircle,
      subStatus: 'Monitor Baseline'
    },
    critical: {
      label: 'Attention Required — Physiological Stress',
      desc: 'Severe biomarker parameters observed, indicating acute cellular dehydration or critical pH imbalance. High density parameters suggest severe fluid deficit. Recommend immediate fluid and electrolyte restoration.',
      themeBg: 'bg-gradient-to-br from-[#C0392B]/5 to-[#C0392B]/10',
      themeText: 'text-[#C0392B]',
      themeBorder: 'border-[#C0392B]/15',
      icon: ShieldAlert,
      subStatus: 'Attention Required'
    }
  }[status];

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border ${config.themeBorder} ${config.themeBg} p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.01)]`}
    >
      {/* Decorative Background Glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 ${
        status === 'optimal' ? 'bg-[#16A085]' : status === 'caution' ? 'bg-[#D97706]' : 'bg-[#C0392B]'
      }`} />

      <div className="relative flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
        
        {/* Dynamic Icon */}
        <div className={`p-3.5 rounded-2xl bg-white/90 border ${config.themeBorder} shadow-sm self-start shrink-0`}>
          <IconComponent className={`w-8 h-8 ${config.themeText}`} />
        </div>

        {/* Status Callout Details */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest text-[#6B7280] uppercase">
              PHYSIOLOGICAL STATUS
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${
              status === 'optimal' ? 'bg-[#16A085]' : status === 'caution' ? 'bg-[#D97706]' : 'bg-[#C0392B] animate-pulse'
            }`} />
            <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-[#6B7280]">
              {config.subStatus}
            </span>
          </div>

          <h2 className="font-display font-light text-3xl text-[#111827] tracking-tight">
            {config.label}
          </h2>

          <p className="text-sm text-[#4B5563] leading-relaxed font-light">
            {config.desc}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
