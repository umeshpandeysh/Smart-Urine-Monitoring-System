'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import {
  ArrowRight, Activity,
  Droplets, Shield, CheckCircle2,
  FlaskConical, Heart, Eye, ChevronDown, ChevronUp
} from 'lucide-react';

/* ─── HOW IT WORKS — step data ─────────────────────────────────────────────── */
const STEPS = [
  {
    step: '01', color: '#2563EB', bg: '#EFF6FF', title: 'Locate Station',
    desc: 'Find the nearest UroSense-enabled checkpoint at transit terminals, corporate centres, or healthcare facilities.',
    details: [
      '📍 Available 24/7 at airports, metro stations, hospitals, and corporate parks nationwide.',
      '🗺️ Use the UroSense app or website to find the nearest active kiosk in real time.',
      '⚡ Zero queue, zero paperwork — just walk up and begin your touchless diagnostic.',
      '💡 Did you know? UroSense kiosks are placed where you already go — no lifestyle change needed.',
    ],
  },
  {
    step: '02', color: '#0D9488', bg: '#F0FDFA', title: 'Submit Sample',
    desc: 'Use the urinal naturally. Built-in optoelectronic sensors capture a micro-volume sample without any physical contact.',
    details: [
      '💧 Solid-state sensors isolate and register your sample automatically — completely touchless.',
      '🧹 Self-cleaning fluidic pathways reset in under 800 milliseconds between each session.',
      '🔒 No collection cups, no lab technicians, no waiting — privacy by design.',
      '💡 Did you know? The entire capture process is invisible to the user and takes under 3 seconds.',
    ],
  },
  {
    step: '03', color: '#7C3AED', bg: '#F5F3FF', title: 'Sensor Analysis',
    desc: 'Five solid-state biosensors simultaneously evaluate pH, TDS, turbidity, temperature, and colour within 3 seconds.',
    details: [
      '🔬 Medical-grade sensors measure five biomarkers simultaneously in a single pass.',
      '📊 Each reading is cross-referenced against calibrated clinical reference ranges.',
      '⚡ Analysis completes in under 3 seconds — faster than a standard blood pressure reading.',
      '💡 Did you know? Optical turbidity detection can identify early infection markers invisible to the naked eye.',
    ],
  },
  {
    step: '04', color: '#DB2777', bg: '#FDF2F8', title: 'Scan QR Code',
    desc: 'An ephemeral QR token is generated locally on the station display and links your session privately to your device.',
    details: [
      '🔐 Each QR token is cryptographically unique and expires within 90 seconds of generation.',
      '📵 No network data leaves the kiosk until you actively scan and verify.',
      '📲 Scan with any standard camera app — no special software required.',
      '💡 Did you know? Zero personal data is stored on kiosk hardware at any point.',
    ],
  },
  {
    step: '05', color: '#D97706', bg: '#FFFBEB', title: 'Secure OTP Verify',
    desc: 'Confirm your identity with an encrypted one-time code sent to your mobile. No persistent data remains on the device.',
    details: [
      '📱 A 6-digit OTP is delivered to your registered mobile number via encrypted SMS.',
      '🛡️ Zero-trust architecture wipes session data from local memory immediately after verification.',
      '🔐 Fully compliant with HIPAA and India\'s DISHA data security regulations.',
      '💡 Did you know? Even UroSense engineers cannot access your individual health session data.',
    ],
  },
  {
    step: '06', color: '#059669', bg: '#ECFDF5', title: 'Clinical Insights',
    desc: 'Your results appear instantly in plain language — no medical degree required to understand what your body is telling you.',
    details: [
      '📊 Six health indicators presented in simple, colour-coded, patient-friendly language.',
      '📈 Baseline comparisons show whether each reading has improved, worsened, or held steady.',
      '📄 One-tap PDF export formatted for sharing directly with your physician.',
      '💡 Did you know? UroSense converts complex biomarker data into just three actionable status levels.',
    ],
  },
  {
    step: '07', color: '#6366F1', bg: '#EEF2FF', title: 'Track History',
    desc: 'All your readings are stored securely in your personal health journal so you can monitor trends over time.',
    details: [
      '📅 Every scan is date-stamped and location-tagged for complete traceability.',
      '📉 Trend graphs reveal gradual changes that individual readings might miss.',
      '☁️ Full data ownership — export or delete your records at any time.',
      '💡 Did you know? Studies show tracking health metrics weekly increases early detection rates by up to 3×.',
    ],
  },
];

const DETECTS = [
  { icon: Droplets,     name: 'Blood Sugar',     color: '#2563EB', bg: '#EFF6FF', note: 'Glucose elevation flags diabetes or pre-diabetes risk' },
  { icon: Shield,       name: 'Protein Leakage', color: '#0D9488', bg: '#F0FDFA', note: 'Detects early kidney disease via protein filtration stress' },
  { icon: FlaskConical, name: 'Urea Levels',      color: '#7C3AED', bg: '#F5F3FF', note: 'Tracks kidney filtering efficiency and metabolic load' },
  { icon: Heart,        name: 'Kidney Stress',    color: '#DB2777', bg: '#FDF2F8', note: 'Combined TDS and turbidity patterns reveal renal load' },
  { icon: Eye,          name: 'Hydration Index',  color: '#D97706', bg: '#FFFBEB', note: 'Derived from urine concentration and colour spectrum' },
  { icon: Activity,     name: 'UTI Indicators',   color: '#059669', bg: '#ECFDF5', note: 'pH and turbidity patterns flag early infection risk' },
];

/* ─── India map: city positions expressed as % of a 472×528 image ─────────── *
 *  Coordinates calibrated to match real geography of the PNG asset.           *
 *  The image has ~15% whitespace padding on each side.                        *
 * ─────────────────────────────────────────────────────────────────────────── */
const MAP_NODES = [
  { name: 'Delhi (Primary Hub)', zone: 'North Central Hub',   x: '47%', y: '22%', density: 'National Core (32 stations)', isHub: true  },
  { name: 'Jaipur',              zone: 'North-West Grid',     x: '33%', y: '30%', density: 'Active Cell (12 stations)',    isHub: false },
  { name: 'Lucknow',             zone: 'North-East Grid',     x: '58%', y: '28%', density: 'Active Cell (14 stations)',    isHub: false },
  { name: 'Ahmedabad',           zone: 'West Grid',           x: '24%', y: '42%', density: 'Active Integration (16 stations)', isHub: false },
  { name: 'Mumbai',              zone: 'West Coast Hub',      x: '22%', y: '58%', density: 'High Density (24 stations)',   isHub: false },
  { name: 'Hyderabad',           zone: 'Deccan Grid',         x: '48%', y: '63%', density: 'Active Integration (18 stations)', isHub: false },
  { name: 'Bengaluru',           zone: 'South Grid',          x: '40%', y: '76%', density: 'High Density (22 stations)',   isHub: false },
  { name: 'Chennai',             zone: 'South-East Grid',     x: '56%', y: '80%', density: 'Expanding (15 stations)',      isHub: false },
  { name: 'Kolkata',             zone: 'East Grid',           x: '74%', y: '42%', density: 'Active Integration (14 stations)', isHub: false },
  { name: 'Guwahati',            zone: 'North-East Corridor', x: '80%', y: '26%', density: 'Regional Corridor (8 stations)', isHub: false },
];

export default function HomePage() {
  const [showAdvanced, setShowAdvanced]       = useState(false);
  const [activeStep, setActiveStep]           = useState(0);
  const [selectedNode, setSelectedNode]       = useState(0);

  return (
    <div
      className="min-h-screen bg-white text-[#0B1B33] overflow-x-hidden"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      <Navbar />
      <main className="pt-20">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24 border-b border-slate-100">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#2563EB0a 1px, transparent 1px)', backgroundSize: '36px 36px' }}
          />
          <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-[#2563EB]/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6 max-w-[640px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                Smart Urine Health Analysis
              </div>

              <h1
                className="font-extrabold text-[#0F172A] tracking-tight leading-[1.1]"
                style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
              >
                Know Your Health<br />
                <span className="text-[#2563EB]">Before Symptoms</span><br />
                Appear
              </h1>

              <p className="text-[#475569] text-base leading-relaxed max-w-[520px]">
                UroSense is a smart urine analysis platform that detects hydration issues, glucose abnormalities, kidney stress, and urinary health risks — within minutes, without a lab.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] shadow-md shadow-blue-500/15 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Access My Health Report <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-1 border-t border-slate-100">
                {[
                  { icon: CheckCircle2, text: 'Non-invasive & touchless' },
                  { icon: Shield,       text: 'OTP-verified privacy'      },
                  { icon: Heart,        text: 'Clinically informed results' },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2 text-xs text-[#64748B] font-medium">
                    <t.icon className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
                    {t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — doctor image + live result card */}
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                <Image
                  src="/hero-doctor.png"
                  alt="UroSense doctor reviewing a patient health report on a tablet"
                  width={640}
                  height={480}
                  className="w-full h-80 object-cover object-top"
                  priority
                />
              </div>

              {/* Live result card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] animate-pulse" />
                    <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Live Analysis Result</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">US-NODE-01</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Hydration Status',        value: 'Optimal' },
                    { label: 'UTI Risk',                value: 'Low'     },
                    { label: 'Urinary Acidity',         value: 'Normal'  },
                    { label: 'Kidney Stress',           value: 'Normal'  },
                    { label: 'Blood Sugar Indicator',   value: 'Normal'  },
                    { label: 'Protein Leakage Risk',    value: 'Low'     },
                  ].map(m => (
                    <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100">
                      <p className="text-[11px] text-slate-500 font-medium leading-snug">{m.label}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-[#0F172A]">{m.value}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                    aria-expanded={showAdvanced}
                  >
                    <span>Advanced Technical View</span>
                    {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAdvanced && (
                    <div className="grid grid-cols-4 gap-2 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] font-mono text-slate-500">
                      {[
                        { label: 'TDS',         value: '310 ppm' },
                        { label: 'Turbidity',   value: '1.2 NTU' },
                        { label: 'pH Level',    value: '6.2 pH'  },
                        { label: 'Temperature', value: '36.8 °C' },
                      ].map(p => (
                        <div key={p.label}>
                          <p className="text-slate-400">{p.label}</p>
                          <p className="font-bold text-[#0F172A] mt-0.5">{p.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-center text-[11px] text-slate-400">Report ready · Scan QR code to access</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="bg-[#F8FAFC] py-20 md:py-24 border-t border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-10">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">The Process</span>
              <h2
                className="font-extrabold text-[#0B1B33] leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
              >
                How UroSense Works
              </h2>
              <p className="text-[#475569] text-sm leading-relaxed">
                A seamless seven-step sequence — from sample capture to clinical insights — in under 60 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Step selector */}
              <div className="lg:col-span-5 flex flex-col gap-1.5">
                {STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                      activeStep === idx
                        ? 'border-[#2563EB] bg-white shadow-sm'
                        : 'border-transparent hover:bg-gray-100/60'
                    }`}
                    aria-pressed={activeStep === idx}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        activeStep === idx ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {s.step}
                    </span>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        activeStep === idx ? 'text-[#0B1B33]' : 'text-gray-500'
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Detail canvas */}
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="space-y-5">
                  <span
                    className="text-[11px] font-mono text-[#2563EB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit block font-bold"
                  >
                    Step {STEPS[activeStep].step}
                  </span>

                  <div>
                    <h3
                      className="text-xl font-bold text-[#0B1B33] leading-snug"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                    >
                      {STEPS[activeStep].title}
                    </h3>
                    <p className="text-[15px] text-[#475569] leading-relaxed mt-2">
                      {STEPS[activeStep].desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <p className="text-[11px] font-bold text-[#0B1B33] tracking-widest uppercase font-mono">
                      What happens in this step
                    </p>
                    <ul className="space-y-2 list-none p-0 m-0">
                      {STEPS[activeStep].details.map((item, i) => (
                        <li
                          key={i}
                          className="text-[14px] text-[#374151] leading-relaxed"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT CAN UROSENSE DETECT ─────────────────────────────────────── */}
        <section className="bg-white py-20 md:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold text-[#0D9488] uppercase tracking-widest bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 inline-block">
                Detection Capabilities
              </span>
              <h2
                className="font-extrabold text-[#0B1B33] leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
              >
                What Can UroSense Detect?
              </h2>
              <p className="text-[#475569] text-base leading-relaxed">
                Six critical biological health markers analysed in every scan — translated into plain language.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DETECTS.map(d => (
                <div
                  key={d.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3 transition-all duration-200 hover:shadow-md hover:border-blue-100 cursor-default group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: d.bg }}
                  >
                    <d.icon className="w-5 h-5" style={{ color: d.color }} />
                  </div>
                  <h3
                    className="font-bold text-[#0B1B33] text-base"
                    style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                  >
                    {d.name}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NATIONAL DIAGNOSTIC NETWORK — INDIA MAP ──────────────────────── */}
        <section className="bg-[#F8FAFC] py-20 md:py-24 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wider">Deployments</span>
              <h2
                className="font-extrabold text-[#0B1B33] leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
              >
                National Diagnostic Network
              </h2>
              <p className="text-[#475569] text-sm leading-relaxed">
                Active UroSense telemetry nodes across transit hubs, medical centres, and smart city deployments.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Map panel */}
              <div className="lg:col-span-7 h-[480px] relative border border-gray-200/80 rounded-2xl bg-[#F0F4FF] overflow-hidden shadow-sm flex items-center justify-center">
                {/* Subtle dot-grid background */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                {/* Map image + nodes — contained inside a proportional box */}
                <div
                  className="relative"
                  style={{ width: '260px', height: '292px' }}
                  aria-label="India telemetry network map"
                >
                  {/* Approved PNG asset — rendered at 2× for sharpness, displayed at half */}
                  <Image
                    src="/india-map.png"
                    alt="India telemetry map showing UroSense station network"
                    width={472}
                    height={528}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    style={{ imageRendering: 'crisp-edges' }}
                    priority
                    quality={100}
                  />

                  {/* City telemetry nodes */}
                  {MAP_NODES.map((node, idx) => {
                    const isSelected = selectedNode === idx;
                    const isHub      = node.isHub;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedNode(idx)}
                        title={node.name}
                        aria-label={`Select ${node.name} telemetry node`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-full flex items-center justify-center group z-10"
                        style={{
                          top: node.y,
                          left: node.x,
                          width: isHub ? '16px' : isSelected ? '14px' : '12px',
                          height: isHub ? '16px' : isSelected ? '14px' : '12px',
                        }}
                      >
                        {/* Static soft outer glow for Delhi or selected node */}
                        {(isHub || isSelected) && (
                          <span
                            className={`absolute rounded-full pointer-events-none ${
                              isHub ? '-inset-1 bg-[#2563EB]/25 ring-4 ring-[#2563EB]/20 shadow-md shadow-blue-500/30' : '-inset-0.5 bg-[#2563EB]/15'
                            }`}
                          />
                        )}
                        {/* Core Marker Dot */}
                        <span
                          className={`relative z-10 w-full h-full rounded-full border-2 border-white block transition-transform duration-200 group-hover:scale-125 ${
                            isHub
                              ? 'bg-[#2563EB] shadow-md shadow-blue-500/40'
                              : isSelected
                              ? 'bg-[#2563EB] shadow-sm'
                              : 'bg-[#3B82F6]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info panel */}
              <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                    Node Infrastructure
                  </span>
                  <div>
                    <h3
                      className="text-lg font-bold text-[#0B1B33]"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                    >
                      {MAP_NODES[selectedNode].name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{MAP_NODES[selectedNode].zone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-4 text-xs">
                    <div>
                      <p className="text-gray-400 font-mono text-[9px] uppercase">Telemetry State</p>
                      <p className="font-bold text-[#0D9488] mt-1">Operational</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-[9px] uppercase">Node Density</p>
                      <p className="font-bold text-[#0B1B33] mt-1 text-xs">{MAP_NODES[selectedNode].density}</p>
                    </div>
                  </div>

                  {/* All nodes list */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">All Active Nodes</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {MAP_NODES.map((n, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedNode(idx)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                            selectedNode === idx
                              ? 'bg-[#2563EB] text-white border-[#2563EB]'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                          }`}
                        >
                          {n.name.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 leading-relaxed font-mono">
                  All stations report continuous optical self-calibration every 15 minutes.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY EARLY DETECTION MATTERS ──────────────────────────────────── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-semibold text-[#0D9488] uppercase tracking-wider">Why It Matters</span>
                <h2
                  className="font-extrabold text-[#0B1B33] leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                >
                  Early Detection Saves Lives
                </h2>
                <p className="text-[#475569] text-sm leading-relaxed max-w-lg">
                  Most chronic conditions — kidney disease, diabetes, UTIs — show early signals in urine long before symptoms appear. Regular urinalysis gives you time to act before a condition becomes critical.
                </p>
                <ul className="space-y-3">
                  {[
                    'Kidney disease detected early is manageable in over 90% of cases',
                    'Dehydration is the most preventable cause of kidney stones',
                    'Early UTI detection prevents escalation to kidney infections',
                    'Routine urinalysis can flag pre-diabetes before blood tests',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-[#475569] text-sm leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { stat: '37%', label: 'of adults are chronically dehydrated without knowing it',              color: '#2563EB', bg: '#EFF6FF' },
                  { stat: '90%', label: 'of kidney disease cases are detected too late — routine screening helps', color: '#0D9488', bg: '#F0FDFA' },
                  { stat: '46%', label: 'of diabetes cases go undiagnosed — many detectable via urinalysis',     color: '#DB2777', bg: '#FDF2F8' },
                ].map(s => (
                  <div
                    key={s.stat}
                    className="rounded-2xl p-5 text-center space-y-2 border border-gray-100 shadow-sm"
                    style={{ background: s.bg }}
                  >
                    <p
                      className="font-extrabold"
                      style={{ fontSize: '2.25rem', color: s.color, fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                    >
                      {s.stat}
                    </p>
                    <p className="text-[#475569] text-xs leading-relaxed">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1B33] via-[#0F284B] to-[#0B1B33] py-20 md:py-28 text-white border-t border-gray-800">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8 z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
              Secure Telemetry Access
            </span>
            <h2
              className="font-extrabold text-white leading-tight"
              style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
            >
              Ready to See Your Health Report?
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-lg mx-auto">
              Log in with your phone number to access your complete report history, track biological trends over time, and understand what your body is telling you.
            </p>
            <div className="flex justify-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-extrabold text-base hover:from-[#1D4ED8] hover:to-[#1E40AF] shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-100"
              >
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
