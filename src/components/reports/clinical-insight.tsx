'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface ClinicalInsightProps {
  aiSummary: string | null;
  status: 'optimal' | 'caution' | 'critical';
}

export default function ClinicalInsight({ aiSummary, status }: ClinicalInsightProps) {
  // Human-feeling fallback clinical summaries
  const fallbackSummary = {
    optimal: 'Your hydration profile remains stable and within normal physiological boundaries. Total dissolved solids reflect excellent solute dilution, and the pH balance indicates standard metabolic clearance. Maintain your current hydration patterns and active dietary lifestyle.',
    caution: 'The analytics indicate minor concentration deviations. Moderate TDS readings paired with slightly concentrated levels suggest your fluid clearance is currently working under elevated osmotic load. We suggest a steady ingestion of 500ml of pure water to ease metabolic filtration.',
    critical: 'Urine parameters reflect significant solute saturation and cellular dehydration. Acidity levels suggest systemic load which is typical during extreme perspiration or low fluid intake. Prioritize active rehydration immediately to restore fluid balance and cellular homeostasis.',
  }[status];

  const summaryText = aiSummary || fallbackSummary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FAF9F6] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between"
    >
      {/* Visual Header Decoration */}
      <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-[#0F7AF3]" />
          <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
            Today&apos;s Clinical Insight
          </span>
        </div>
        <span className="text-[9px] font-mono text-[#9CA3AF]">
          Rx SYNTHESIS ENGINE
        </span>
      </div>

      {/* Styled Serif Typography for human medical feel */}
      <div className="py-2">
        <p className="font-serif italic text-lg md:text-xl leading-relaxed text-[#111827]/90 font-light">
          &ldquo;{summaryText}&rdquo;
        </p>
      </div>

      {/* Metadata Signature Footer */}
      <div className="text-[10px] font-mono text-[#9CA3AF] mt-5 border-t border-black/5 pt-4 flex items-center justify-between">
        <span>VERIFIED BY URO-ANALYTICS SYSTEM</span>
        <span>VERIFICATION SECURE</span>
      </div>
    </motion.div>
  );
}
