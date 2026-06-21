'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function PopulationHealth() {
  
  // High-end medical regional metrics dataset
  const regions = [
    { name: 'Northeast Clinical Hub', population: 1450, wellnessScore: 84, status: 'Optimal', hydration: 78 },
    { name: 'Midwest Operations Node', population: 890, wellnessScore: 79, status: 'Nominal', hydration: 72 },
    { name: 'Southeast Regional Center', population: 1200, wellnessScore: 81, status: 'Optimal', hydration: 75 },
    { name: 'Western Diagnostics Node', population: 640, wellnessScore: 68, status: 'Attention Required', hydration: 58 },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] select-none">
      
      {/* Header Block */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-medium text-lg text-[#111827] tracking-tight">
            Population Health Analytics
          </h3>
          <p className="text-xs text-[#6B7280] font-light mt-0.5">
            Regional wellness baselines and aggregate urine telemetry indices.
          </p>
        </div>
        <span className="font-mono text-[9px] font-semibold text-[#6B7280] bg-[#FAFAF8] border border-[#E5E7EB] px-2.5 py-1 rounded">
          UPDATED REAL-TIME
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Interactive Bezier Trends (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-[#9CA3AF] uppercase">Macro Health Trends</span>
            <h4 className="font-display font-medium text-sm text-[#111827]">
              Aggregate Hydration & Wellness Curves
            </h4>
          </div>

          {/* Premium custom SVG gridless trend curves */}
          <div className="h-[180px] w-full relative border border-[#E5E7EB]/60 rounded-xl bg-[#FAFAF8]/50 overflow-hidden flex items-center justify-center">
            
            {/* Soft vertical guides */}
            <div className="absolute inset-0 flex justify-between px-6 pointer-events-none">
              <div className="w-[1px] h-full bg-[#E5E7EB]/40" />
              <div className="w-[1px] h-full bg-[#E5E7EB]/40" />
              <div className="w-[1px] h-full bg-[#E5E7EB]/40" />
              <div className="w-[1px] h-full bg-[#E5E7EB]/40" />
            </div>

            <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F7AF3" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0F7AF3" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area filled block under the curve */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                d="M 0,30 C 15,22 25,25 40,16 C 55,7 65,13 80,10 C 90,8 100,12 100,12 L 100,30 L 0,30 Z"
                fill="url(#trend-grad)"
              />

              {/* Smooth Bezier Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                d="M 0,30 C 15,22 25,25 40,16 C 55,7 65,13 80,10 C 90,8 100,12 100,12"
                fill="none"
                stroke="#0F7AF3"
                strokeWidth="1"
                strokeLinecap="round"
              />

              {/* Secondary Wellness Trend Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.0, delay: 0.2, ease: 'easeOut' }}
                d="M 0,25 C 20,28 35,15 50,18 C 65,21 80,8 100,6"
                fill="none"
                stroke="#16A085"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                strokeLinecap="round"
              />
            </svg>

            {/* Float Markers */}
            <div className="absolute top-8 left-[40%] flex flex-col items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F7AF3] shadow-sm animate-ping" />
              <span className="font-mono text-[8px] bg-white border border-[#E5E7EB] px-1 py-0.5 rounded shadow mt-1">
                74.2 Index
              </span>
            </div>

          </div>

          {/* Legend and Metrics Strip */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] border-t border-[#E5E7EB]/60 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-[2px] bg-[#0F7AF3]" />
                <span>HYDRATION BASELINE</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-[2px] bg-[#16A085] border-t border-dashed" />
                <span>WELLNESS EXCURSIONS</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[#16A085]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>STABLE SYNC</span>
            </div>
          </div>

        </div>

        {/* Right: Regional Statistics (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-[#E5E7EB]/80 rounded-2xl p-6 bg-[#FAFAF8]/30">
          
          <div className="space-y-4">
            <span className="font-mono text-[9px] text-[#9CA3AF] uppercase">Regional Baselines</span>
            <h4 className="font-display font-medium text-sm text-[#111827] mb-2">
              Diagnostic Node Excursions
            </h4>

            {/* Regional List */}
            <div className="space-y-3">
              {regions.map((r) => {
                const isCritical = r.status === 'Attention Required';
                
                return (
                  <div key={r.name} className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/40 last:border-0">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-[#111827]">{r.name}</p>
                      <p className="text-[10px] text-[#6B7280] font-light">
                        {r.population} users • {r.hydration}% Hydration
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block font-mono text-[9px] font-semibold px-2 py-0.5 rounded border ${
                        isCritical 
                          ? 'text-[#C0392B] bg-[#C0392B]/5 border-[#C0392B]/10' 
                          : 'text-[#4B5563] bg-white border-[#E5E7EB]'
                      }`}>
                        {r.wellnessScore}% Index
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
