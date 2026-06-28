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
  { 
    step: '01', color: '#2563EB', bg: '#EFF6FF', title: 'Locate Station', desc: 'Find a UroSense-enabled checkpoint at transit terminals, corporate centers, or healthcare facilities.',
    details: [
      '📍 Find any UroSense-enabled kiosk at transit hubs, offices, or clinics near you.',
      '💡 Did you know? Over 70% of early health indicators can be tracked through daily hydration signals!',
      '🚀 Enjoy 24/7 instant touchless access with zero queuing or waiting times.'
    ]
  },
  { 
    step: '02', color: '#0D9488', bg: '#F0FDFA', title: 'Submit Sample', desc: 'Use the system naturally. Built-in optoelectronic grids isolate and register a micro-volume sample touchlessly.',
    details: [
      '💧 Integrated optoelectronic sensors isolate micro-samples completely touchlessly.',
      '🧪 Fun Fact: Our self-cleaning fluidic pathways flush clean in under 800 milliseconds!',
      '🔒 Complete biological privacy with zero physical contact required.'
    ]
  },
  { 
    step: '03', color: '#7C3AED', bg: '#F5F3FF', title: 'Sensor Analysis', desc: 'Four solid-state biosensors evaluate pH, ionic density, temperature, and turbidity indexes within 3 seconds.',
    details: [
      '🔬 Solid-state biosensors evaluate pH, ionic density, and key biomarkers in 3 seconds.',
      '💡 Did you know? Optical spectrometry checks cellular turbidity faster than a heartbeat!',
      '⚡ Receive lab-grade biomarker analysis with instant metabolic scoring.'
    ]
  },
  { 
    step: '04', color: '#DB2777', bg: '#FDF2F8', title: 'Scan QR Code', desc: 'An ephemeral QR token is generated locally on the station display, ensuring direct and private linkage.',
    details: [
      '🔐 Ephemeral QR tokens link your test session directly to your smartphone.',
      '🛡️ Fun Fact: No personal medical data is ever stored on kiosk hardware!',
      '📲 Instant private retrieval without filling out tedious paperwork.'
    ]
  },
  { 
    step: '05', color: '#D97706', bg: '#FFFBEB', title: 'Secure OTP Verify', desc: 'Confirm biological ownership through encrypted mobile verification codes. No persistent data stays on the device.',
    details: [
      '📱 Confirm ownership with encrypted biological one-time verification codes.',
      '🔐 Did you know? Our zero-trust protocol wipes local memory instantly after verification!',
      '🛡️ Full HIPAA & DISHA compliant data security for complete peace of mind.'
    ]
  },
  { 
    step: '06', color: '#059669', bg: '#ECFDF5', title: 'Clinical Insights', desc: 'Instantly load your results translated into plain language metrics. Avoid clinical terminology jargon.',
    details: [
      '📊 Results are translated into clear, jargon-free health indicators.',
      '💡 Fun Fact: Color-coded baseline tracking makes understanding hydration effortless!',
      '📄 Export actionable PDF health summaries directly for doctor consultations.'
    ]
  },
  { 
    step: '07', color: '#6366F1', bg: '#EEF2FF', title: 'Track History', desc: 'Store your measurements securely inside your personal biological health journal. Sync to track baseline trends.',
    details: [
      '📈 Sync test results seamlessly into your private biological health journal.',
      '🧠 Did you know? Tracking metric trends over time helps catch wellness changes early!',
      '☁️ Full data ownership with instant cross-device backup and export controls.'
    ]
  },
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
    { name: 'Delhi (Primary Hub)', zone: 'North Central Hub', x: '38%', y: '28%', density: 'National Core (32 Stations)', status: 'Active Hub', isHub: true },
    { name: 'Jaipur', zone: 'North West Grid', x: '25%', y: '35%', density: 'Active Cell (12 Stations)', status: 'Active' },
    { name: 'Lucknow', zone: 'North East Grid', x: '53%', y: '36%', density: 'Active Cell (14 Stations)', status: 'Active' },
    { name: 'Ahmedabad', zone: 'West Grid', x: '15%', y: '50%', density: 'Active Integration (16 Stations)', status: 'Active' },
    { name: 'Mumbai', zone: 'West Grid', x: '20%', y: '64%', density: 'High Density (24 Stations)', status: 'Active' },
    { name: 'Hyderabad', zone: 'Central Grid', x: '50%', y: '67%', density: 'Active Integration (18 Stations)', status: 'Active' },
    { name: 'Bengaluru', zone: 'South Grid', x: '40%', y: '84%', density: 'High Density (22 Stations)', status: 'Active' },
    { name: 'Chennai', zone: 'South Grid', x: '60%', y: '87%', density: 'Expanding Coverage (15 Stations)', status: 'Active' },
    { name: 'Kolkata', zone: 'East Grid', x: '88%', y: '50%', density: 'Active Integration (14 Stations)', status: 'Active' },
    { name: 'Guwahati', zone: 'North East Hub', x: '93%', y: '34%', density: 'Regional Corridor (8 Stations)', status: 'Active' }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B33] overflow-x-hidden" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-20">

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24 border-b border-slate-100">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB0a 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
          <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-[#2563EB]/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-7 max-w-[640px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                Smart Urine Health Analysis
              </div>

              <h1 className="font-extrabold text-[#0F172A] tracking-tight leading-[1.12]" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Know Your Health<br />
                <span className="text-[#2563EB]">Before Symptoms</span><br />
                Appear
              </h1>

              <p className="text-[#475569] text-base md:text-lg leading-relaxed font-normal">
                UroSense is a smart urine analysis platform that helps detect hydration issues, glucose abnormalities, kidney stress indicators, and urinary health risks — within minutes, without a lab.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] shadow-md shadow-blue-500/15 transition-all duration-200 hover:-translate-y-0.5">
                  Access My Health Report <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-100">
                {[
                  { icon: CheckCircle2, text: 'Non-invasive & touchless' },
                  { icon: Shield, text: 'OTP-verified privacy' },
                  { icon: Heart, text: 'Clinically informed results' },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2 text-xs text-[#64748B] font-medium">
                    <t.icon className="w-4 h-4 text-[#0D9488] flex-shrink-0" />{t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — Doctor image + live report card */}
            <div className="relative flex flex-col gap-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                <Image
                  src="/hero-doctor.png"
                  alt="UroSense doctor reviewing patient health report"
                  width={640} height={480}
                  className="w-full h-80 object-cover object-top"
                  priority
                />
              </div>

              {/* Patient Friendly Live Result Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] animate-pulse" />
                    <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Live Analysis Result</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">US-NODE-01</span>
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
                    <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                      <p className="text-[11px] text-slate-500 font-medium leading-snug">{m.label}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-[#0F172A]">{m.value}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advanced Technical View Collapsible Accordion */}
                <div className="border-t border-slate-100 pt-3">
                  <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors py-1 focus:outline-none"
                  >
                    <span>Advanced Technical View</span>
                    {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAdvanced && (
                    <div className="grid grid-cols-4 gap-2 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] font-mono text-slate-500">
                      <div>
                        <p className="text-slate-400">TDS</p>
                        <p className="font-bold text-[#0F172A]">310 ppm</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Turbidity</p>
                        <p className="font-bold text-[#0F172A]">1.2 NTU</p>
                      </div>
                      <div>
                        <p className="text-slate-400">pH Level</p>
                        <p className="font-bold text-[#0F172A]">6.2 pH</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Temperature</p>
                        <p className="font-bold text-[#0F172A]">36.8 °C</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-center text-[11px] text-slate-400 pt-1">Report ready · Scan QR code to access</p>
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
              <h2 className="font-extrabold text-[#0B1B33] text-[28px] sm:text-[34px] md:text-[48px] leading-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
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
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
                <div className="space-y-5">
                  <span className="text-[0.85rem] font-mono text-[#2563EB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit block font-bold">STEP {STEPS[activeStep].step} DETAILS</span>
                  <div>
                    <h3 className="text-3xl md:text-[2.5rem] font-bold text-[#0B1B33] leading-[1.15]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {STEPS[activeStep].title}
                    </h3>
                    <p className="text-base md:text-[1.05rem] text-gray-600 leading-[1.7] font-normal mt-2.5">
                      {STEPS[activeStep].desc}
                    </p>
                  </div>

                  {/* Dynamic Educational Bullet Section */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <h4 className="text-[0.85rem] font-bold text-[#0B1B33] tracking-wider uppercase font-mono">
                      What happens in this step
                    </h4>
                    <ul className="space-y-2.5 list-none p-0 m-0">
                      {STEPS[activeStep].details?.map((item, i) => (
                        <li key={i} className="text-[0.98rem] md:text-[1rem] text-gray-700 font-normal leading-[1.7] flex items-start gap-3">
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHAT CAN UROSENSE DETECT
        ══════════════════════════════════════════════════ */}
        <section className="bg-white py-20 md:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold text-[#0D9488] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Detection Capabilities</span>
              <h2 className="font-extrabold text-[#0B1B33] text-[28px] sm:text-[34px] md:text-[48px] leading-tight tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                What Can UroSense Detect?
              </h2>
              <p className="text-gray-500 text-base leading-relaxed">
                Six critical biological health markers analysed in every scan — translated into plain language.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {DETECTS.map((d) => (
                <div key={d.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 transition-all duration-300 hover:shadow-md hover:border-blue-200 cursor-default flex flex-col justify-between h-full group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: d.bg }}>
                      <d.icon className="w-6 h-6" style={{ color: d.color }} />
                    </div>
                    <h3 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{d.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed pt-1">{d.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHERE UROSENSE IS AVAILABLE — REAL INDIA MAP
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#F8FAFC] py-24 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wider">Deployments</span>
              <h2 className="font-extrabold text-[#0B1B33] text-[28px] sm:text-[34px] md:text-[48px] leading-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                National Diagnostic Network
              </h2>
              <p className="text-gray-500 text-sm">
                Interactive map of active UroSense telemetry cells across public transit points and medical nodes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Spatial Map Display (7 Columns) */}
              <div className="lg:col-span-7 h-[460px] relative border border-gray-200/80 rounded-2xl bg-[#F8FAFC] overflow-hidden shadow-sm flex items-center justify-center p-8">
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#2563EB 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }} />
                
                {/* 55-60% Width Centered Container with Generous Whitespace */}
                <div className="w-full max-w-[220px] sm:max-w-[240px] h-[260px] sm:h-[280px] relative flex items-center justify-center">
                  {/* Approved Production India Map PNG Asset (Enhanced & High-DPI) */}
                  <Image 
                    src="/india-map.png" 
                    alt="Approved India Telemetry Map" 
                    fill
                    className="object-contain pointer-events-none drop-shadow-md" 
                    priority 
                  />

                  {/* Telemetry Circular Node Markers (Only City Markers, No Lines) */}
                  {locationsRoadmap.map((node, idx) => {
                    const isSelected = selectedMapNode === idx;
                    const isHub = node.isHub;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedMapNode(idx)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-20"
                        style={{ top: node.y, left: node.x }}
                      >
                        {isHub && <span className="absolute -inset-4 rounded-full bg-blue-600/30 animate-ping" />}
                        <span className={`absolute ${isHub ? '-inset-3.5' : '-inset-2.5'} rounded-full ${isSelected ? 'bg-blue-600/40 animate-pulse' : isHub ? 'bg-blue-500/20' : 'bg-transparent'}`} />
                        <span className={`rounded-full border-2 border-white shadow-xl block transition-transform duration-300 group-hover:scale-125 ${
                          isHub 
                            ? 'w-5 h-5 bg-[#2563EB] ring-4 ring-blue-400/50 scale-110 z-30' 
                            : isSelected 
                              ? 'w-4 h-4 bg-[#2563EB] scale-125 ring-2 ring-blue-300' 
                              : 'w-3.5 h-3.5 bg-blue-700'
                        }`} />
                      </button>
                    );
                  })}
                </div>
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1B33] via-[#0F284B] to-[#0B1B33] py-20 md:py-28 text-white border-t border-gray-800">
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8 z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
              Secure Telemetry Access
            </span>
            <h2 className="font-extrabold text-white text-3xl md:text-5xl leading-tight tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Ready to See Your Health Report?
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              Log in with your phone number to access your complete report history, track biological trends over time, and understand what your body is telling you.
            </p>
            <div className="flex justify-center pt-4">
              <Link href="/login" className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-extrabold text-base hover:from-[#1D4ED8] hover:to-[#1E40AF] shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                Access Patient Portal <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
