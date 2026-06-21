'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BiomarkerTrackProps {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'caution' | 'critical';
  type: 'ph' | 'tds' | 'temperature' | 'turbidity';
}

const configMap = {
  ph: {
    min: 4.5,
    max: 8.5,
    healthyRange: '6.0 – 7.2 pH',
    description: 'Measures body acid-base balance.',
    segments: [
      { start: 0, end: 37.5, color: 'bg-[#C0392B]' }, // Acidic
      { start: 37.5, end: 67.5, color: 'bg-[#16A085]' }, // Optimal
      { start: 67.5, end: 100, color: 'bg-[#D97706]' }, // Alkaline
    ],
  },
  tds: {
    min: 0,
    max: 1500,
    healthyRange: '100 – 500 ppm',
    description: 'Density of solutes and hydration concentration.',
    segments: [
      { start: 0, end: 6.6, color: 'bg-[#D97706]' }, // Diluted
      { start: 6.6, end: 33.3, color: 'bg-[#16A085]' }, // Optimal
      { start: 33.3, end: 66.6, color: 'bg-[#D97706]' }, // Moderate concentration
      { start: 66.6, end: 100, color: 'bg-[#C0392B]' }, // Highly concentrated
    ],
  },
  temperature: {
    min: 30,
    max: 42,
    healthyRange: '35.5 – 38.0 °C',
    description: 'Indicates fresh metabolic telemetry accuracy.',
    segments: [
      { start: 0, end: 45.8, color: 'bg-[#D97706]' }, // Too Cool
      { start: 45.8, end: 66.6, color: 'bg-[#16A085]' }, // Body Temp
      { start: 66.6, end: 100, color: 'bg-[#C0392B]' }, // High Temp
    ],
  },
  turbidity: {
    min: 0,
    max: 10,
    healthyRange: '0.0 – 2.0 NTU',
    description: 'Clarity index indicating particulate presence.',
    segments: [
      { start: 0, end: 20, color: 'bg-[#16A085]' }, // Optimal
      { start: 20, end: 50, color: 'bg-[#D97706]' }, // Cloudy
      { start: 50, end: 100, color: 'bg-[#C0392B]' }, // High Turbidity
    ],
  },
};

export default function BiomarkerTrack({ name, value, unit, status, type }: BiomarkerTrackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = configMap[type];
  const { min, max, healthyRange, description, segments } = currentConfig;

  // Calculate needle position in percentage
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const statusLabel = {
    optimal: { text: 'Optimal', color: 'text-[#16A085] bg-[#16A085]/5 border-[#16A085]/20' },
    caution: { text: 'Caution', color: 'text-[#D97706] bg-[#D97706]/5 border-[#D97706]/20' },
    critical: { text: 'Attention', color: 'text-[#C0392B] bg-[#C0392B]/5 border-[#C0392B]/20' },
  }[status] || { text: 'Optimal', color: 'text-[#16A085] bg-[#16A085]/5 border-[#16A085]/20' };

  return (
    <div className="border-b border-[#E5E7EB]/60 last:border-b-0 py-4 first:pt-0 last:pb-0">
      
      {/* Clickable Header Row (min 44px touch target) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none min-h-[44px] gap-4 group"
      >
        <div className="space-y-0.5">
          <h4 className="text-sm font-medium text-[#111827] group-hover:text-[#0F7AF3] transition-colors">
            {name}
          </h4>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base font-semibold text-[#111827]">{value}</span>
            <span className="text-[10px] text-[#6B7280] font-light">{unit}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className={`font-mono text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border ${statusLabel.color}`}>
            {statusLabel.text}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-7 h-7 rounded-full bg-gray-50 border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] group-hover:text-[#111827] group-hover:border-[#9CA3AF] transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Details Container */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-4">
              
              <p className="text-xs text-[#6B7280] font-light leading-relaxed">
                {description}
              </p>

              {/* Target Range */}
              <div className="flex items-center justify-between text-[11px] border-t border-b border-[#E5E7EB]/40 py-2">
                <span className="text-[#9CA3AF] font-mono">CLINICAL TARGET RANGE</span>
                <span className="font-mono font-medium text-[#4B5563]">{healthyRange}</span>
              </div>

              {/* Track Bar with Animated Needle */}
              <div className="relative pt-4 pb-2">
                {/* Track Segments */}
                <div className="relative w-full h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden flex">
                  {segments.map((seg, idx) => (
                    <div
                      key={idx}
                      className={`h-full ${seg.color} opacity-80`}
                      style={{
                        width: `${seg.end - seg.start}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Animated Needle */}
                <div 
                  className="absolute top-2 w-full left-0 pointer-events-none"
                  style={{ height: '20px' }}
                >
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: `${percentage}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -ml-1 flex flex-col items-center pointer-events-none"
                    style={{ top: '-8px' }}
                  >
                    {/* Needle Triangle */}
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#111827]" />
                    {/* Vertical Marker Line */}
                    <div className="w-[2px] h-[10px] bg-[#111827] mt-[2px] shadow-sm" />
                  </motion.div>
                </div>
              </div>

              {/* Range Extremes Labeling */}
              <div className="flex items-center justify-between font-mono text-[9px] text-[#9CA3AF] pt-1">
                <span>MIN {min}</span>
                <span>MAX {max}</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
