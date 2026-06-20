'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HydrationRingProps {
  hydrationIndex: number | null;
}

export default function HydrationRing({ hydrationIndex }: HydrationRingProps) {
  const [progress, setProgress] = useState(0);
  const score = hydrationIndex ?? 0;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const color = 
    hydrationIndex === null ? '#6B7280' :
    score >= 70 ? '#16A085' :
    score >= 40 ? '#D97706' : '#C0392B';

  const label = 
    hydrationIndex === null ? 'Awaiting Scan' :
    score >= 70 ? 'Optimal' :
    score >= 40 ? 'Caution' : 'Critical';

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="92"
            stroke="#F3F4F6"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="112"
            cy="112"
            r="92"
            stroke={color}
            strokeWidth="9"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 92}
            strokeDashoffset={2 * Math.PI * 92 * (1 - progress / 100)}
            strokeLinecap="round"
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Dynamic value overlay */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-light text-[#111827] tracking-tighter">
            {hydrationIndex !== null ? `${progress}%` : '—'}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#6B7280] uppercase mt-0.5">
            hydration score
          </span>
          {hydrationIndex !== null && (
            <span 
              className="text-[10px] font-semibold tracking-wide uppercase mt-2 px-2.5 py-0.5 rounded-full border"
              style={{ color, borderColor: `${color}20`, backgroundColor: `${color}05` }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
