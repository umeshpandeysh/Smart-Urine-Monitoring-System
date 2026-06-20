'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, RotateCcw, ArrowRight, MousePointer } from 'lucide-react';
import Link from 'next/link';

export default function IntelligenceSection() {
  const [isTranslating, setIsTranslating] = useState(false);

  return (
    <section id="translate" className="relative py-32 bg-[#FAF9F6] border-t border-black/5 text-[#1C1E21]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#0284c7] uppercase font-semibold">Diagnostic Interface</span>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#1C1E21]">
            From raw indicators to plain language.
          </h2>
          <p className="text-[#6E7680] font-light max-w-xl">
            We translate clinical biochemistry into conversational guidance. UroSense AI synthesizes telemetry parameters into immediate daily guidelines, hydration scores, and anomaly warnings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Block: Raw Telemetry Stream Terminal */}
          <div className="rounded-[2rem] border border-black/5 bg-[#1C1E21] p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden text-[#FAF9F6]">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400/20">STREAM // 004</div>
            <div>
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[10px] text-white/50 tracking-wider">TELEMETRY INGEST MODULE</span>
              </div>
              <div className="font-mono text-xs text-white/70 space-y-2.5 leading-relaxed">
                <p className="text-white/30">&gt; INITIALIZING CORE INGEST LINK...</p>
                <p>&gt; CONNECTED // NODE_ID: <span className="text-cyan-400">US-ESP-98001</span></p>
                <p>&gt; PH_VALUE: <span className="text-yellow-400">5.40</span> [WARNING: BELOW_BASELINE]</p>
                <p>&gt; TDS_LEVEL: <span className="text-cyan-400">420 ppm</span> [NORMAL]</p>
                <p>&gt; TURBIDITY: <span className="text-cyan-400">0.82 NTU</span> [STABLE]</p>
                <p>&gt; COLOR_RGB: <span className="text-cyan-400">232, 192, 70</span> [CAUTION_CONCENTRATION]</p>
                <p>&gt; TEMP_C: <span className="text-cyan-400">36.8</span> C</p>
                <p className="text-white/30">&gt; ENCRYPTING PACKETS via TLS_AES_256_GCM...</p>
              </div>
            </div>
            <button 
              onClick={() => setIsTranslating(!isTranslating)}
              className="mt-8 w-full py-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-950/40 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isTranslating ? <RotateCcw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {isTranslating ? 'Reset Pipeline' : 'Run Translation Pipeline'}
            </button>
          </div>

          {/* Right Block: Clinician's AI Translate Card */}
          <div className="rounded-[2rem] border border-black/5 bg-[#FFFFFF] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between min-h-[340px]">
            
            <AnimatePresence mode="wait">
              {!isTranslating ? (
                <motion.div 
                  key="awaiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full py-16 text-center space-y-4"
                >
                  <MousePointer className="w-6 h-6 text-gray-300 animate-bounce" />
                  <h4 className="font-display font-medium text-base text-[#1C1E21]">Awaiting Data Translation</h4>
                  <p className="text-xs text-[#6E7680] max-w-xs font-light leading-relaxed">
                    Click the run button on the telemetry stream to translate raw biochemical diagnostics.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="translated"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-4">
                      <span className="font-mono text-[10px] text-[#6E7680] tracking-wider font-semibold">CLINICAL SUMMARY</span>
                      <span className="text-[10px] font-mono text-[#0284c7] bg-[#0284c7]/5 px-2.5 py-0.5 rounded border border-[#0284c7]/10">SECURE GENERATION</span>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Stylized Prescription Slip Card */}
                      <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-black/5 text-[#1C1E21] shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative">
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#6E7680]/30">UROSENSE Rx</div>
                        <h5 className="font-serif italic text-lg leading-relaxed text-[#1C1E21]/90">
                          &ldquo;Urinalysis parameters show elevated metabolic concentration. pH levels indicate mild acidity. Hydration is caution-range (48%). Increase pure water consumption by 500ml over the next two hours.&rdquo;
                        </h5>
                      </div>

                      {/* Parameter list indicators */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5">
                          <span className="block text-[10px] font-mono text-[#6E7680] uppercase mb-1">Hydration Index</span>
                          <span className="font-display text-base text-[#0284c7] font-semibold">48% (Caution)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-black/5">
                          <span className="block text-[10px] font-mono text-[#6E7680] uppercase mb-1">Acidity</span>
                          <span className="font-display text-base text-yellow-600 font-semibold">pH 5.4 (Low)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                    <span className="text-xs text-[#6E7680] font-light">Verified by UroLink Security</span>
                    <Link href="/login" className="text-xs text-[#0284c7] font-semibold hover:underline flex items-center gap-1">
                      Go to portal <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
