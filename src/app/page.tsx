'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import {
  ArrowRight, QrCode, Smartphone, FileText, Activity,
  Droplets, Shield, MapPin, CheckCircle2,
  FlaskConical, Heart, Eye, ChevronDown, ChevronUp
} from 'lucide-react';

/* ─── HOW IT WORKS — Apple-style process visualization data ──────────────── */
const STEPS = [
  { step: '01', color: '#2563EB', bg: '#EFF6FF', title: 'Locate Station', desc: 'Find a UroSense-enabled checkpoint at transit terminals, corporate centers, or healthcare facilities.' },
  { step: '02', color: '#0D9488', bg: '#F0FDFA', title: 'Submit Sample', desc: 'Use the system naturally. Built-in optoelectronic grids isolate and register a micro-volume sample touchlessly.' },
  { step: '03', color: '#7C3AED', bg: '#F5F3FF', title: 'Sensor Analysis', desc: 'Four solid-state biosensors evaluate pH, ionic density, temperature, and turbidity indexes within 3 seconds.' },
  { step: '04', color: '#DB2777', bg: '#FDF2F8', title: 'Scan QR Code', desc: 'An ephemeral QR token is generated locally on the station display, ensuring direct and private linkage.' },
  { step: '05', color: '#D97706', bg: '#FFFBEB', title: 'Secure OTP Verify', desc: 'Confirm biological ownership through encrypted mobile verification codes. No persistent data stays on the device.' },
  { step: '06', color: '#059669', bg: '#ECFDF5', title: 'Clinical Insights', desc: 'Instantly load your results translated into plain language metrics. Avoid clinical terminology jargon.' },
  { step: '07', color: '#6366F1', bg: '#EEF2FF', title: 'Track History', desc: 'Store your measurements securely inside your personal biological health journal. Sync to track baseline trends.' },
];

const DETECTS = [
  { icon: Droplets,    name: 'Blood Sugar',     color: '#2563EB', bg: '#EFF6FF', note: 'Flags glucose elevation indicating diabetes risk' },
  { icon: Shield,      name: 'Protein',         color: '#0D9488', bg: '#F0FDFA', note: 'Detects early kidney disease via protein leakage' },
  { icon: FlaskConical,name: 'Urea',            color: '#7C3AED', bg: '#F5F3FF', note: 'Measures kidney filtering efficiency' },
  { icon: Heart,       name: 'Kidney Stress',   color: '#DB2777', bg: '#FDF2F8', note: 'Combined TDS and turbidity pattern analysis' },
  { icon: Eye,         name: 'Hydration Level', color: '#D97706', bg: '#FFFBEB', note: 'Derived from urine concentration and colour' },
  { icon: Activity,    name: 'UTI Indicators',  color: '#059669', bg: '#ECFDF5', note: 'Turbidity and pH patterns flag infection risk' },
];

export default function HomePage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMapNode, setSelectedMapNode] = useState(0);

  const locationsRoadmap = [
    { name: 'New Delhi Node', zone: 'North Grid', x: '42%', y: '28%', density: 'High Density (14 Stations)', status: 'Active' },
    { name: 'Mumbai Terminal Node', zone: 'West Grid', x: '30%', y: '56%', density: 'High Density (22 Stations)', status: 'Active' },
    { name: 'Kolkata Hub Node', zone: 'East Grid', x: '72%', y: '42%', density: 'Active Integration (8 Stations)', status: 'Active' },
    { name: 'Hyderabad Tech Corridor', zone: 'Central Grid', x: '46%', y: '58%', density: 'Active Integration (10 Stations)', status: 'Active' },
    { name: 'Bengaluru Station Node', zone: 'South Grid', x: '40%', y: '74%', density: 'High Density (18 Stations)', status: 'Active' },
    { name: 'Chennai Central Node', zone: 'South Grid', x: '52%', y: '76%', density: 'Expanding Coverage (12 Stations)', status: 'Active' }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B33] overflow-x-hidden" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-20">

        {/* ══════════════════════════════════════════════════
            HERO
        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white py-12">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB12 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/20 text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Next-Gen Smart Urine Diagnostics
              </div>

              <h1 className="font-extrabold text-[#0B1B33]" style={{ fontSize: 'clamp(2.75rem, 6vw, 4.25rem)', lineHeight: 1.08, letterSpacing: '-0.03em', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Know Your Health<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">Before Symptoms</span><br />
                Appear.
              </h1>

              <p className="text-gray-600 max-w-lg leading-relaxed text-base md:text-lg">
                UroSense is an automated point-of-use diagnostic platform. Embedded medical sensors analyze hydration, metabolic markers, and renal load — delivering encrypted clinical insights in 60 seconds.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/login" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-bold text-base hover:from-[#1D4ED8] hover:to-[#1E40AF] shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]">
                  Access Health Journal <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/technology" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#0B1B33] font-bold text-base hover:bg-gray-50 transition-all duration-200">
                  Explore Hardware
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-3 border-t border-gray-100">
                {[
                  { icon: CheckCircle2, text: 'Touchless Telemetry' },
                  { icon: Shield, text: 'AES-256 OTP Privacy' },
                  { icon: Heart, text: 'Clinical Bio-Markers' },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2 text-xs text-gray-700 font-bold">
                    <t.icon className="w-4.5 h-4.5 text-[#0D9488] flex-shrink-0" />{t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Doctor image + live card */}
            <div className="relative flex flex-col gap-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                <Image
                  src="/hero-doctor.png"
                  alt="UroSense doctor reviewing patient health report"
                  width={640} height={480}
                  className="w-full h-80 object-cover object-top"
                  priority
                />
              </div>

              {/* Patient Friendly Live Result Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] animate-pulse" />
                    <span className="text-xs font-semibold text-[#0B1B33] uppercase tracking-wider">Live Analysis Result</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">US-NODE-01</span>
                </div>

                {/* Patient-Friendly Medical Findings */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Hydration Status', value: 'Optimal' },
                    { label: 'UTI Risk', value: 'Low' },
                    { label: 'Urinary Acidity', value: 'Normal' },
                    { label: 'Kidney Stress Indicator', value: 'Normal' },
                    { label: 'Blood Sugar Indicator', value: 'Normal' },
                    { label: 'Protein Leakage Risk', value: 'Low' },
                  ].map(m => (
                    <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3 border border-gray-50 flex flex-col justify-between">
                      <p className="text-[11px] text-gray-400 font-medium leading-snug">{m.label}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-[#0B1B33]">{m.value}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advanced Technical View Collapsible Accordion */}
                <div className="border-t border-gray-100 pt-3">
                  <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 hover:text-[#0B1B33] transition-colors py-1 focus:outline-none"
                  >
                    <span>Advanced Technical View</span>
                    {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAdvanced && (
                    <div className="grid grid-cols-4 gap-2 mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-[10px] font-mono text-gray-500">
                      <div>
                        <p className="text-gray-400">TDS</p>
                        <p className="font-bold text-[#0B1B33]">310 ppm</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Turbidity</p>
                        <p className="font-bold text-[#0B1B33]">1.2 NTU</p>
                      </div>
                      <div>
                        <p className="text-gray-400">pH Level</p>
                        <p className="font-bold text-[#0B1B33]">6.2 pH</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Temperature</p>
                        <p className="font-bold text-[#0B1B33]">36.8 °C</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-center text-[11px] text-gray-400 pt-1">Report ready · Scan QR code to access</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS — Apple-style Interactive Storytelling
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#F8FAFC] py-24 border-t border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">The Process</span>
              <h2 className="font-bold text-[#0B1B33] text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                How UroSense Works
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                A seamless sequence bridging biological metrics and clinical interpretation in under a minute.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Selector (Interactive Sidebar) */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                {STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 focus:outline-none ${
                      activeStep === idx 
                        ? 'border-[#2563EB] bg-white shadow-sm' 
                        : 'border-transparent bg-transparent hover:bg-gray-100/50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeStep === idx ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{s.step}</span>
                    <span className={`text-sm font-semibold transition-colors ${
                      activeStep === idx ? 'text-[#0B1B33]' : 'text-gray-500'
                    }`}>{s.title}</span>
                  </button>
                ))}
              </div>

              {/* Right: Apple Style Detailed Canvas */}
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-8 flex flex-col justify-between shadow-sm min-h-[300px]">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">STEP {STEPS[activeStep].step} DETAILS</span>
                  <h3 className="text-2xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                    {STEPS[activeStep].title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {STEPS[activeStep].desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STEPS[activeStep].color }} />
                  <span className="text-[11px] font-mono text-gray-400">Clinical validation pipeline active.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHAT CAN UROSENSE DETECT
        ══════════════════════════════════════════════════ */}
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-semibold text-[#0D9488] uppercase tracking-wider">Detection Capabilities</span>
              <h2 className="font-bold text-[#0B1B33]" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, letterSpacing: '-0.025em', fontFamily: 'var(--font-plus-jakarta), var(--font-manrope), sans-serif' }}>
                What Can UroSense Detect?
              </h2>
              <p className="text-gray-500 text-sm">
                Six critical health markers analysed in every scan — each explained in plain language.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DETECTS.map((d) => (
                <div key={d.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3 transition-all duration-300 hover:border-gray-300 cursor-default">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: d.bg }}>
                    <d.icon className="w-4.5 h-4.5" style={{ color: d.color }} />
                  </div>
                  <h3 className="font-bold text-[#0B1B33] text-sm">{d.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHERE UROSENSE IS AVAILABLE — REAL INDIA MAP
        {/* ══════════════════════════════════════════════════
            WHERE UROSENSE IS AVAILABLE — REAL INDIA MAP
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#0B1B33] py-24 border-t border-b border-gray-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-[#0D9488] uppercase tracking-widest bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/30">
                  Live Telemetry Grid
                </span>
                <h2 className="font-extrabold text-white text-3xl md:text-5xl tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  National Diagnostic Network
                </h2>
                <p className="text-gray-400 text-base">
                  Real-time telemetry sync across active UroSense terminals in India&apos;s major transport &amp; medical corridors.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">NETWORK STATUS: ONLINE (100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Spatial Map Display (7 Columns) */}
              <div className="lg:col-span-7 h-[440px] relative border border-blue-500/30 rounded-3xl bg-[#071324] overflow-hidden shadow-2xl flex items-center justify-center">
                {/* Tactical Radar Concentric Circles */}
                <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/10 pointer-events-none" />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-blue-500/15 pointer-events-none" />
                <div className="absolute w-[120px] h-[120px] rounded-full border border-blue-500/20 pointer-events-none" />

                {/* SVG India Abstract Contour */}
                <svg viewBox="0 0 200 200" className="w-[85%] h-[85%] opacity-30 absolute pointer-events-none">
                  <path d="M75,15 L95,12 L105,28 L115,40 L130,50 L155,58 L168,78 L150,95 L158,115 L135,122 L118,140 L102,172 L92,192 L82,168 L78,138 L68,118 L52,112 L38,102 L22,92 L28,72 L42,62 L48,42 Z" fill="#2563EB" stroke="#60A5FA" strokeWidth="1" />
                </svg>

                {/* Map Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {locationsRoadmap.map((loc, idx) => {
                    if (idx === 0) return null;
                    const prev = locationsRoadmap[idx - 1];
                    return (
                      <line 
                        key={idx}
                        x1={prev.x} y1={prev.y}
                        x2={loc.x} y2={loc.y}
                        stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 5" className="opacity-60 animate-pulse"
                      />
                    );
                  })}
                </svg>

                {/* Node Markers */}
                {locationsRoadmap.map((node, idx) => {
                  const isSelected = selectedMapNode === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedMapNode(idx)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-20"
                      style={{ top: node.y, left: node.x }}
                    >
                      <span className={`absolute -inset-3 rounded-full ${isSelected ? 'bg-cyan-400/50 animate-ping' : 'bg-blue-500/20'}`} />
                      <span className={`w-4 h-4 rounded-full border-2 border-white shadow-lg block transition-transform duration-300 group-hover:scale-150 ${
                        isSelected ? 'bg-cyan-400 scale-125 shadow-cyan-400/50' : 'bg-blue-600'
                      }`} />
                      <span className="absolute left-1/2 -translate-x-1/2 top-5 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300 font-bold whitespace-nowrap border border-cyan-500/30 opacity-90 group-hover:opacity-100 transition-opacity">
                        {node.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Node Specifications Summary Panel (5 Columns) */}
              <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">NODE INFRASTRUCTURE</span>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {locationsRoadmap[selectedMapNode].name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{locationsRoadmap[selectedMapNode].zone}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-4 my-4 text-xs">
                    <div>
                      <p className="text-gray-400 font-mono text-[9px] uppercase">Telemetry State</p>
                      <p className="font-bold text-[#0D9488] mt-1">Operational</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-[9px] uppercase">Node Density</p>
                      <p className="font-bold text-[#0B1B33] mt-1">{locationsRoadmap[selectedMapNode].density}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 leading-relaxed font-mono">
                  All active stations report continuous optical self-calibration and sensor state updates every 15 minutes.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHY EARLY DETECTION MATTERS
        ══════════════════════════════════════════════════ */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="text-xs font-semibold text-[#0D9488] uppercase tracking-wider">Why It Matters</span>
                <h2 className="font-bold text-[#0B1B33]" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, letterSpacing: '-0.025em', fontFamily: 'var(--font-plus-jakarta), var(--font-manrope), sans-serif' }}>
                  Early Detection Saves Lives
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Most chronic conditions — kidney disease, diabetes, UTIs — show early signals in urine long before symptoms appear. Regular urinalysis gives you time to act before a condition becomes serious.
                </p>
                <ul className="space-y-3">
                  {[
                    'Kidney disease detected early is manageable in over 90% of cases',
                    'Dehydration is the most preventable cause of kidney stones',
                    'Early UTI detection prevents escalation to kidney infections',
                    'Routine urinalysis can flag pre-diabetes before blood tests',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-xs leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { stat: '37%', label: 'of adults are chronically dehydrated without knowing it', color: '#2563EB', bg: '#EFF6FF' },
                  { stat: '90%', label: 'of kidney disease cases diagnosed too late due to no routine screening', color: '#0D9488', bg: '#F0FDFA' },
                  { stat: '46%', label: 'of diabetes cases go undiagnosed — many detectable via urine early', color: '#DB2777', bg: '#FDF2F8' },
                ].map(s => (
                  <div key={s.stat} className="rounded-xl p-5 text-center space-y-2 border border-gray-100 shadow-sm" style={{ background: s.bg }}>
                    <p className="font-extrabold" style={{ fontSize: '2.25rem', color: s.color, fontFamily: 'var(--font-plus-jakarta), var(--font-manrope), sans-serif' }}>{s.stat}</p>
                    <p className="text-gray-500 text-[10px] leading-relaxed">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#0B1B33] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <h2 className="font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', letterSpacing: '-0.025em', fontFamily: 'var(--font-plus-jakarta), var(--font-manrope), sans-serif' }}>
              Ready to See Your Health Report?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              Log in with your phone number to access your complete report history, track trends over time, and understand what your body is telling you.
            </p>
            <div className="flex justify-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1d4ed8] shadow-lg shadow-blue-900/30 transition-all duration-200 hover:-translate-y-0.5">
                Access Patient Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
