'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  Globe,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Download,
  Terminal,
  MousePointer,
  RotateCcw
} from 'lucide-react';

// --- EXPLODED HARDWARE BLUEPRINT STATE ---
const hardwareCallouts = [
  {
    id: 'tcs34725',
    title: 'TCS34725 Spectrograph',
    x: 60,
    y: 35,
    description: '10-band optical spectrograph capturing fluid light refraction to catalog colorimetric markers in real time.'
  },
  {
    id: 'probes',
    title: 'Biomarker Probes',
    x: 35,
    y: 55,
    description: 'High-precision platinum sensors mapping pH balance, Total Dissolved Solids (TDS), and fluid temperature.'
  },
  {
    id: 'gateway',
    title: 'UroLink Edge Gateway',
    x: 50,
    y: 80,
    description: 'Hardware encryption module transmitting telemetry logs over secure TLS tunnels within 3.2 seconds.'
  }
];

export default function LandingPage() {
  const [activeCallout, setActiveCallout] = useState('tcs34725');
  const [isTranslating, setIsTranslating] = useState(false);
  const [hydrationProgress, setHydrationProgress] = useState(0);

  // Animate the hydration score gauge slowly on load
  useEffect(() => {
    const timer = setTimeout(() => setHydrationProgress(82), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#090A0D] text-[#FAF9F6] overflow-x-hidden font-sans select-none selection:bg-primary/30 selection:text-white">
      {/* Tactile Texture Noise Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015] mix-blend-overlay"
        style={{ backgroundImage: 'var(--noise-overlay, none)' }}
      />

      {/* Fluid Ambient Radial Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: [0, 40, -30, 0],
            y: [0, -30, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-25%] left-1/3 w-[800px] h-[800px] bg-gradient-to-tr from-[#06b6d4]/10 to-transparent rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{
            scale: [1.1, 0.9, 1.05, 1.1],
            x: [0, -50, 20, 0],
            y: [0, 60, -40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[650px] h-[650px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-[120px]" 
        />
      </div>

      {/* --- SECTION I: THE GLASS RIBBON NAV --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#090A0D]/40 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex items-center justify-center rounded bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="text-[#090A0D] font-display font-extrabold text-[10px]">U</span>
            </div>
            <span className="font-display font-medium text-lg tracking-tight text-[#FAF9F6]">urosens</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm text-[#FAF9F6]/60">
            <Link href="#device" className="hover:text-[#FAF9F6] transition-colors duration-200">The Technology</Link>
            <Link href="#translate" className="hover:text-[#FAF9F6] transition-colors duration-200">Clinical Focus</Link>
            <Link href="#deployment" className="hover:text-[#FAF9F6] transition-colors duration-200">Enterprise</Link>
            <Link href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System" className="hover:text-[#FAF9F6] transition-colors duration-200" target="_blank">GitHub</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-1.5 rounded-full bg-[#FAF9F6] text-[#090A0D] text-xs font-semibold hover:bg-[#FAF9F6]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* --- SECTION II: HERO VIGNETTE --- */}
      <section className="relative z-10 min-h-screen flex items-center pt-24 pb-16 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-[10px] font-mono tracking-widest uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Fluid Telemetry System v2.0
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-[5.2rem] font-light leading-[1.05] text-[#FAF9F6] tracking-tighter"
            >
              The body tells its
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                story in liquid.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-base md:text-lg text-[#FAF9F6]/60 leading-relaxed font-light"
            >
              UroSense deploys non-invasive optical sensor arrays directly into transit, civic, and clinic infrastructure. Translating biological markers into secure, clinical-grade health telemetry in under sixty seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                href="/login"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
              >
                Explore the Portal
              </Link>
              <Link
                href="#device"
                className="px-8 py-3 rounded-full border border-white/10 text-[#FAF9F6] text-sm font-medium hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                The Technology <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right SVG 3D-Like Viewport */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="w-full max-w-[420px] aspect-square rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-3xl p-8 flex items-center justify-center relative overflow-hidden shadow-2xl">
              {/* Outer halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 opacity-60 rounded-3xl" />
              
              {/* Dynamic wellness ring simulation */}
              <div className="relative w-72 h-72 rounded-full border border-white/5 flex items-center justify-center">
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="url(#fluidGrad)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 110}
                    strokeDashoffset={2 * Math.PI * 110 * (1 - hydrationProgress / 100)}
                    strokeLinecap="round"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score representation */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[4rem] font-display font-light text-[#FAF9F6] tracking-tighter">
                    {hydrationProgress}%
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#FAF9F6]/40 uppercase mt-[-4px]">
                    hydration score
                  </span>
                  <span className="text-[11px] font-medium text-cyan-400 tracking-wide uppercase mt-2 bg-cyan-950/30 px-2.5 py-0.5 rounded-full border border-cyan-800/30">
                    Optimal
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- SECTION III: THE PHYSICAL DEVICE EXPLODED VIEW --- */}
      <section id="device" className="relative z-10 py-32 border-t border-white/5 bg-[#090A0D]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl mb-20 space-y-4">
            <h2 className="text-sm font-mono tracking-widest text-cyan-400 uppercase">Hardware-First Infrastructure</h2>
            <h3 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#FAF9F6]">
              Clinical diagnostics, hidden in plain sight.
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Diagram Column */}
            <div className="lg:col-span-7 flex justify-center relative">
              <div className="w-full max-w-[480px] aspect-[4/5] rounded-3xl border border-white/5 bg-neutral-950/40 p-8 relative flex items-center justify-center overflow-hidden">
                
                {/* SVG Blueprint grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Simulated Explorer Blueprint Device */}
                <svg viewBox="0 0 200 250" className="w-72 h-auto text-white/10 z-10 relative">
                  {/* Outer casing */}
                  <rect x="40" y="30" width="120" height="190" rx="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  
                  {/* Internal PCB and chambers */}
                  <rect x="55" y="45" width="90" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="100" cy="80" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M70,160 L130,160 M100,160 L100,200" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  
                  {/* Hotspots */}
                  {hardwareCallouts.map((callout) => (
                    <g 
                      key={callout.id} 
                      onClick={() => setActiveCallout(callout.id)}
                      className="cursor-pointer"
                    >
                      <circle 
                        cx={callout.x} 
                        cy={callout.y} 
                        r="8" 
                        fill={activeCallout === callout.id ? '#06b6d4' : '#1e293b'} 
                        className="transition-all duration-300"
                      />
                      <circle 
                        cx={callout.x} 
                        cy={callout.y} 
                        r="14" 
                        fill="none" 
                        stroke={activeCallout === callout.id ? '#06b6d4' : 'transparent'} 
                        strokeWidth="1.5"
                        className={`transition-all duration-300 ${activeCallout === callout.id ? 'animate-ping' : ''}`}
                      />
                    </g>
                  ))}
                </svg>

                {/* Callout Indicator Lines */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  {hardwareCallouts.map((callout) => (
                    activeCallout === callout.id && (
                      <motion.div 
                        key={callout.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0"
                      >
                        {/* Render simple pointer line */}
                        <div 
                          className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"
                          style={{ left: `${callout.x * 2.1}px`, top: `${callout.y * 2.1}px` }}
                        />
                      </motion.div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                {hardwareCallouts.map((callout) => (
                  <button
                    key={callout.id}
                    onClick={() => setActiveCallout(callout.id)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 block ${
                      activeCallout === callout.id
                        ? 'border-cyan-500/20 bg-cyan-950/10 shadow-[0_4px_30px_rgba(6,182,212,0.05)]'
                        : 'border-white/5 bg-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activeCallout === callout.id ? 'bg-cyan-400' : 'bg-white/20'}`} />
                      <h4 className="font-display font-medium text-base text-[#FAF9F6]">{callout.title}</h4>
                    </div>
                    <AnimatePresence mode="wait">
                      {activeCallout === callout.id && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-[#FAF9F6]/60 leading-relaxed mt-3 ml-5 font-light"
                        >
                          {callout.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- SECTION IV: THE HEALTH TRANSLATE --- */}
      <section id="translate" className="relative z-10 py-32 border-t border-white/5 bg-[#090A0D]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl mb-20 space-y-4">
            <h2 className="text-sm font-mono tracking-widest text-cyan-400 uppercase">Intelligence Translation</h2>
            <h3 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#FAF9F6]">
              From raw indicators to plain language.
            </h3>
            <p className="text-[#FAF9F6]/60 font-light max-w-xl">
              We translate clinical biochemistry into conversational guidance. UroSense AI synthesizes telemetry parameters into immediate daily guidelines, hydration scores, and anomaly warnings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Block: Raw Telemetry Stream */}
            <div className="rounded-3xl border border-white/5 bg-[#0F1116] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400/30">STREAM // 004</div>
              <div>
                <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-[#FAF9F6]/50">TELEMETRY INGEST MODULE</span>
                </div>
                <div className="font-mono text-xs text-white/70 space-y-2 leading-relaxed">
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
                className="mt-8 w-full py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-950/40 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isTranslating ? <RotateCcw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {isTranslating ? 'Reset Pipeline' : 'Run Translation Pipeline'}
              </button>
            </div>

            {/* Right Block: Clinician's AI Translate Card */}
            <div className="relative rounded-3xl border border-white/5 bg-[#0F1116] p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {!isTranslating ? (
                  <motion.div 
                    key="awaiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-16 text-center space-y-4"
                  >
                    <MousePointer className="w-8 h-8 text-[#FAF9F6]/20 animate-bounce" />
                    <h4 className="font-display font-medium text-base text-[#FAF9F6]">Awaiting Data Translation</h4>
                    <p className="text-xs text-[#FAF9F6]/40 max-w-xs font-light leading-relaxed">
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
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                        <span className="font-mono text-xs text-[#FAF9F6]/50">CLINICAL SUMMARY TRANSLATE</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">SECURE GENERATION</span>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Stylized Prescription Slip Card */}
                        <div className="p-6 rounded-2xl bg-[#FAF9F6] text-[#090A0D] shadow-2xl relative">
                          <div className="absolute top-4 right-4 text-[10px] font-mono text-[#090A0D]/30">UROSENSE Rx</div>
                          <h5 className="font-serif italic text-lg leading-relaxed text-[#090A0D]/90">
                            &ldquo;Urinalysis parameters show elevated metabolic concentration. pH levels indicate mild acidity. Hydration is caution-range (48%). Increase pure water consumption by 500ml over the next two hours.&rdquo;
                          </h5>
                        </div>

                        {/* Parameter list indicators */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="block text-[10px] font-mono text-[#FAF9F6]/40 uppercase mb-1">Hydration Index</span>
                            <span className="font-display text-lg font-light text-cyan-400">48% (Caution)</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="block text-[10px] font-mono text-[#FAF9F6]/40 uppercase mb-1">Acidity</span>
                            <span className="font-display text-lg font-light text-yellow-500">pH 5.4 (Low)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-[#FAF9F6]/40 font-light">Verified by UroLink Security</span>
                      <Link href="/login" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                        Go to user portal <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </section>

      {/* --- SECTION V: ENTERPRISE INFRASTRUCTURE --- */}
      <section id="deployment" className="relative z-10 py-32 border-t border-white/5 bg-[#090A0D]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl mb-20 space-y-4">
            <h2 className="text-sm font-mono tracking-widest text-cyan-400 uppercase">Civic Integration</h2>
            <h3 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#FAF9F6]">
              Engineered for high-volume environments.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <Globe className="w-6 h-6 text-cyan-400 mb-6" />
                <h4 className="font-display font-medium text-lg text-[#FAF9F6] mb-2">Transit Hubs</h4>
                <p className="text-xs text-[#FAF9F6]/60 leading-relaxed font-light">
                  Non-invasive wellness tracking deployed inside premium airport lounges, serving over 12,000 daily check-ins.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <Activity className="w-6 h-6 text-cyan-400 mb-6" />
                <h4 className="font-display font-medium text-lg text-[#FAF9F6] mb-2">Municipal Infrastructure</h4>
                <p className="text-xs text-[#FAF9F6]/60 leading-relaxed font-light">
                  Ambient public health nodes collecting anonymous city-wide hydration trends to optimize civic wellness policies.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <ShieldCheck className="w-6 h-6 text-cyan-400 mb-6" />
                <h4 className="font-display font-medium text-lg text-[#FAF9F6] mb-2">Clinic & Diagnostics</h4>
                <p className="text-xs text-[#FAF9F6]/60 leading-relaxed font-light">
                  Continuous outpatient monitoring pipelines keeping clinicians connected to kidney and recovery biomarkers.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- SECTION VI: INVESTOR NARRATIVE --- */}
      <section className="relative z-10 py-32 border-t border-white/5 bg-[#FAF9F6] text-[#090A0D]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xs font-mono tracking-widest text-[#090A0D]/50 uppercase">Clinical Vision</h2>
              <h3 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#090A0D]">
                Biomonitoring at scale.
              </h3>
              <p className="text-[#090A0D]/70 font-light max-w-xl leading-relaxed">
                UroSense represents a tectonic shift in preventive wellness. By turning a daily bathroom routine into an automated, touchless diagnostic checkpoint, we unlock high-density longitudinal data.
              </p>
              <div className="flex gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="px-6 py-2.5 rounded-full bg-[#090A0D] text-[#FAF9F6] text-xs font-semibold hover:bg-[#090A0D]/90 transition-all duration-200 flex items-center gap-2"
                >
                  Request Investor Prospectus <Download className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column Metrics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="border-l-2 border-[#090A0D]/10 pl-6 space-y-1">
                <span className="block font-mono text-[10px] text-[#090A0D]/50 uppercase">LATENCY</span>
                <span className="block font-display text-3xl font-light text-[#090A0D]">0.02s</span>
                <span className="block text-xs text-[#090A0D]/60 font-light">From hardware scan to cloud dashboard.</span>
              </div>
              <div className="border-l-2 border-[#090A0D]/10 pl-6 space-y-1">
                <span className="block font-mono text-[10px] text-[#090A0D]/50 uppercase">ONBOARDING</span>
                <span className="block font-display text-3xl font-light text-[#090A0D]">100%</span>
                <span className="block text-xs text-[#090A0D]/60 font-light">Completely touchless and non-invasive.</span>
              </div>
              <div className="border-l-2 border-[#090A0D]/10 pl-6 space-y-1">
                <span className="block font-mono text-[10px] text-[#090A0D]/50 uppercase">SECURITY</span>
                <span className="block font-display text-3xl font-light text-[#090A0D]">HIPAA</span>
                <span className="block text-xs text-[#090A0D]/60 font-light">End-to-end data encryption vaults.</span>
              </div>
              <div className="border-l-2 border-[#090A0D]/10 pl-6 space-y-1">
                <span className="block font-mono text-[10px] text-[#090A0D]/50 uppercase">PRECISION</span>
                <span className="block font-display text-3xl font-light text-[#090A0D]">10-Band</span>
                <span className="block text-xs text-[#090A0D]/60 font-light">Colorimetric spectrograph capabilities.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 bg-[#090A0D] px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#FAF9F6]/40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center rounded bg-gradient-to-tr from-cyan-400 to-blue-500">
              <span className="text-[#090A0D] font-display font-extrabold text-[8px]">U</span>
            </div>
            <span className="font-display font-medium text-sm tracking-tight text-[#FAF9F6]">urosens</span>
          </div>
          <p>© 2026 UroSense. Engineered by <a href="https://github.com/umeshpandeysh" className="text-cyan-400 hover:underline">umeshpandeysh</a>.</p>
          <div className="flex gap-8">
            <Link href="/login" className="hover:text-[#FAF9F6] transition-colors">Portal</Link>
            <Link href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System" className="hover:text-[#FAF9F6] transition-colors">GitHub</Link>
            <Link href="/admin/dashboard" className="hover:text-[#FAF9F6] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
