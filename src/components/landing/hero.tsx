'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Shield } from 'lucide-react';

export default function Hero() {
  const [hydrationScore, setHydrationScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setHydrationScore(82), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FAFAF8] text-[#111827] px-6 md:px-12 pt-28 pb-16 overflow-hidden">
      {/* Soft gradient background element */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-[#0F7AF3]/5 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Copy block */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E5E7EB] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.01)] text-[#0F7AF3] text-[10px] font-mono tracking-widest uppercase font-semibold"
          >
            <Shield className="w-3.5 h-3.5" />
            Ambient Biological Telemetry
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-[5.4rem] font-light leading-[1.05] tracking-tighter text-[#111827]"
          >
            Your health, in
            <br />
            <span className="text-[#0F7AF3]">real-time fluid intelligence.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-base md:text-lg text-[#6B7280] leading-relaxed font-light"
          >
            Premium health monitoring powered by ambient biological telemetry. UroSense automatically reads kidney biomarkers and physiological indicators to keep you aligned with your daily metabolic recovery.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full bg-[#0F7AF3] text-white text-sm font-semibold hover:bg-[#0F7AF3]/95 shadow-[0_4px_20px_rgba(15,122,243,0.12)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-center"
            >
              Access Portal
            </Link>
            <Link
              href="#technology"
              className="px-8 py-3.5 rounded-full border border-[#E5E7EB] bg-white text-[#111827] text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:bg-[#FAFAF8] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Technology <ChevronRight className="w-4 h-4 text-[#0F7AF3]" />
            </Link>
          </motion.div>
        </div>

        {/* Right Fluid Index Ring Viewport */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex items-center justify-center"
        >
          <div className="w-full max-w-[390px] aspect-square rounded-[2rem] border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-8 flex items-center justify-center relative">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="104"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="104"
                  stroke="#0F7AF3"
                  strokeWidth="9"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 104}
                  strokeDashoffset={2 * Math.PI * 104 * (1 - hydrationScore / 100)}
                  strokeLinecap="round"
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </svg>

              {/* Monospace score output */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-6xl font-display font-light text-[#111827] tracking-tighter">
                  {hydrationScore}%
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#6B7280] uppercase mt-0.5">
                  hydration index
                </span>
                <span className="text-[11px] font-semibold text-[#16A085] tracking-wide uppercase mt-2 bg-[#16A085]/5 px-3 py-0.5 rounded-full border border-[#16A085]/10">
                  Optimal
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
