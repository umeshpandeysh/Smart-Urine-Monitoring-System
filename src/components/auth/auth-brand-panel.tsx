'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AuthBrandPanel() {
  return (
    <div className="relative w-full h-full bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col justify-between p-12 overflow-hidden select-none">
      
      {/* Decorative Fluid Blobs in Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft blue blob 1 */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#0A2540]/5 blur-[80px]"
        />

        {/* Soft teal blob 2 */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-[#175E54]/5 blur-[100px]"
        />
      </div>

      {/* Brand Header */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0A2540] flex items-center justify-center shadow-sm">
            <span className="text-white font-display font-bold text-sm">U</span>
          </div>
          <span className="font-display font-bold text-lg text-[#0A2540] tracking-tight">
            UroSense
          </span>
        </Link>
      </div>

      {/* Hero Narrative Content */}
      <div className="relative z-10 max-w-md my-auto space-y-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#175E54] text-[10px] font-mono font-semibold uppercase tracking-wider border border-teal-200/50">
              <Sparkles className="w-3.5 h-3.5" />
              Preventative Urinary Diagnostics
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-semibold text-3xl text-[#0A2540] tracking-tight leading-[1.2]"
          >
            Access your secure health diagnostics
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-[#6B7280] font-light leading-relaxed max-w-sm"
          >
            Review automated biomarker scans, trace your clinical metrics, and download verified urinalysis reports.
          </motion.p>
        </div>

        {/* Medical Trust Checkpoints */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 pt-6 border-t border-[#E5E7EB]"
        >
          <div className="flex items-center gap-2.5 text-xs text-[#4B5563]">
            <ShieldCheck className="w-4 h-4 text-[#167041] shrink-0" />
            <span className="font-light">Secure Phone-OTP Account Access</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#4B5563]">
            <Heart className="w-4 h-4 text-[#175E54] shrink-0" />
            <span className="font-light">Clinical Patient-grade Reporting Guidelines</span>
          </div>
        </motion.div>
      </div>

      {/* Trust Signatures Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#9CA3AF] border-t border-[#E5E7EB]/60 pt-6">
        <span>DPDP COMPLIANT</span>
        <span>•</span>
        <span>HIPAA COMPLIANT</span>
        <span>•</span>
        <span>CLINICAL V3.0</span>
      </div>

    </div>
  );
}
