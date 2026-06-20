'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Activity } from 'lucide-react';

export default function Hero() {
  const [hydrationScore, setHydrationScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setHydrationScore(84), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FAF9F6] text-[#1C1E21] px-6 md:px-12 pt-24 pb-16 overflow-hidden">
      {/* Background Soft Shadows and Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#0284c7]/5 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Typography Block */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00000008] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-[#0284c7] text-[10px] font-mono tracking-widest uppercase font-semibold"
          >
            <Activity className="w-3.5 h-3.5" />
            Biological Telemetry System v2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-[5.4rem] font-light leading-[1.05] tracking-tighter text-[#1C1E21]"
          >
            The body tells its
            <br />
            <span className="text-[#0284c7]">story in liquid.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-base md:text-lg text-[#6E7680] leading-relaxed font-light"
          >
            UroSense integrates non-invasive biomonitoring arrays into public and clinical infrastructure, translating daily urine markers into plain-language clinical insights. Secure, automated, and completed in under sixty seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full bg-[#0284c7] text-[#FFFFFF] text-sm font-semibold hover:bg-[#0284c7]/95 shadow-[0_4px_24px_rgba(2,132,199,0.15)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-center"
            >
              Access the Portal
            </Link>
            <Link
              href="#technology"
              className="px-8 py-3.5 rounded-full border border-black/5 bg-[#FFFFFF] text-[#1C1E21] text-sm font-semibold shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:bg-[#FAF9F6] transition-all duration-200 flex items-center justify-center gap-2"
            >
              The Technology <ChevronRight className="w-4 h-4 text-[#0284c7]" />
            </Link>
          </motion.div>
        </div>

        {/* Right Fluid Gauge Viewport */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex items-center justify-center"
        >
          <div className="w-full max-w-[390px] aspect-square rounded-[2rem] border border-black/5 bg-[#FFFFFF] shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-8 flex items-center justify-center relative">
            
            {/* SVG Ring representation */}
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
                  stroke="#0284c7"
                  strokeWidth="9"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 104}
                  strokeDashoffset={2 * Math.PI * 104 * (1 - hydrationScore / 100)}
                  strokeLinecap="round"
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </svg>

              {/* Text readout */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-6xl font-display font-light text-[#1C1E21] tracking-tighter">
                  {hydrationScore}%
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#6E7680] uppercase mt-0.5">
                  hydration score
                </span>
                <span className="text-[11px] font-semibold text-[#0284c7] tracking-wide uppercase mt-2 bg-[#0284c7]/5 px-3 py-0.5 rounded-full border border-[#0284c7]/10">
                  optimal
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
