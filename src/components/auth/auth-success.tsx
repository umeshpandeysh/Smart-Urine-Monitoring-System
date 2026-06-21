'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function AuthSuccess() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center select-none animate-fadeIn">
      
      {/* Animated Success Ring and Checkmark */}
      <div className="relative flex items-center justify-center">
        {/* Soft glowing ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-20 h-20 rounded-full border-2 border-[#16A085]"
        />

        {/* Checkmark circle container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
          className="w-14 h-14 rounded-full bg-[#16A085] flex items-center justify-center shadow-[0_4px_16px_rgba(22,160,133,0.25)] border border-[#16A085]/10"
        >
          {/* Animated checkmark icon */}
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Check className="w-6 h-6 text-white stroke-[3px]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Texts */}
      <div className="space-y-2">
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-lg text-[#111827]"
        >
          Verification Complete
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs text-[#6B7280] font-light leading-relaxed max-w-[240px] mx-auto"
        >
          Successfully logged in. Preparing your secure dashboard baseline...
        </motion.p>
      </div>

      {/* Loading progress bar indicator */}
      <div className="w-36 h-1 bg-[#E5E7EB] rounded-full overflow-hidden relative">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '0%' }}
          transition={{ delay: 0.5, duration: 1.2, ease: 'easeInOut' }}
          className="absolute top-0 bottom-0 left-0 bg-[#16A085] w-full"
        />
      </div>

    </div>
  );
}
