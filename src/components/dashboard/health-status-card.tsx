'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

interface HealthStatusCardProps {
  hydrationIndex: number | null;
}

export default function HealthStatusCard({ hydrationIndex }: HealthStatusCardProps) {
  const score = hydrationIndex ?? 0;

  const status = 
    hydrationIndex === null ? 'unknown' :
    score >= 70 ? 'optimal' :
    score >= 40 ? 'caution' : 'critical';

  const config = {
    optimal: {
      title: 'System Optimal',
      desc: 'All measured metabolic indicators are within healthy parameters.',
      color: 'text-[#16A085]',
      bg: 'bg-[#16A085]/5',
      border: 'border-[#16A085]/20',
      icon: CheckCircle
    },
    caution: {
      title: 'Attention Reassured',
      desc: 'Slight metabolic concentration detected. Restoring fluid levels recommended.',
      color: 'text-[#D97706]',
      bg: 'bg-[#D97706]/5',
      border: 'border-[#D97706]/20',
      icon: AlertTriangle
    },
    critical: {
      title: 'Attention Required',
      desc: 'Telemetry parameters indicate significant fluid depletion. Rehydration advised.',
      color: 'text-[#C0392B]',
      bg: 'bg-[#C0392B]/5',
      border: 'border-[#C0392B]/20',
      icon: ShieldAlert
    },
    unknown: {
      title: 'Awaiting Diagnostic Scan',
      desc: 'Establish a new checkpoint baseline by scanning at a UroSense terminal.',
      color: 'text-[#6B7280]',
      bg: 'bg-gray-50',
      border: 'border-[#E5E7EB]',
      icon: AlertTriangle
    }
  }[status];

  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border ${config.border} ${config.bg} p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-start gap-4`}
    >
      <div className={`p-2 rounded-xl bg-white border ${config.border} shadow-[0_2px_8px_rgba(0,0,0,0.01)]`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div>
        <h4 className="font-display font-medium text-lg text-[#111827]">{config.title}</h4>
        <p className="text-xs text-[#6B7280] font-light mt-1 max-w-md leading-relaxed">{config.desc}</p>
      </div>
    </motion.div>
  );
}
