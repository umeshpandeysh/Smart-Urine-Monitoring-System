'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AIHealthNarrativeProps {
  hydrationIndex: number | null;
}

export default function AIHealthNarrative({ hydrationIndex }: AIHealthNarrativeProps) {
  const score = hydrationIndex ?? 0;

  const narrative = 
    hydrationIndex === null
      ? 'Awaiting your first urinalysis checkpoint. Visit a UroSense diagnostics terminal to compile your baseline and generate your first health narrative.'
      : score >= 70
      ? 'Your hydration parameters indicate optimal fluid balance and active metabolic clearance. Continue maintaining your current intake sequence.'
      : score >= 40
      ? ' urinals show caution-level fluid concentration. Acidity levels suggest minor dehydration. Consuming an additional 500ml of pure water is recommended.'
      : 'Your telemetry indicators signal severe fluid depletion. Metabolic clearance is restricted. Prompt rehydration is advised to recover system baseline.';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[#E5E7EB] bg-[#FAF9F6] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0F7AF3]" />
          <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Today&apos;s Insight</span>
        </div>
        <span className="text-[9px] font-mono text-[#6B7280]/40">Rx SYSTEM</span>
      </div>

      <div className="py-2">
        <h5 className="font-serif italic text-lg leading-relaxed text-[#111827]/90">
          &ldquo;{narrative}&rdquo;
        </h5>
      </div>

      <div className="text-[10px] font-mono text-[#6B7280]/40 mt-4 border-t border-black/5 pt-3">
        Verified by UroLink Security Ingest
      </div>
    </motion.div>
  );
}
