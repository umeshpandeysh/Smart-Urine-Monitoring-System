import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Activity, ArrowRight, CheckCircle2, FlaskConical, Thermometer, Eye, Droplets, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Technology — UroSense',
  description: 'Learn how UroSense sensors turn raw urine data into personalised health insights. pH, TDS, turbidity, temperature, and colour analysis explained.',
};

const SENSORS = [
  {
    icon: Activity,
    name: 'pH Sensor',
    color: '#2563EB',
    bg: '#EFF6FF',
    what: 'Measures the acidity or alkalinity of urine',
    range: 'Normal range: 6.0 – 7.5 pH',
    why: 'Urine pH indicates metabolic balance, infection risk, and dietary patterns. Values outside the normal range may suggest a UTI, kidney stones, or metabolic acidosis.',
    reading: 'Electrochemical ion-selective measurement',
  },
  {
    icon: FlaskConical,
    name: 'TDS Sensor',
    color: '#0D9488',
    bg: '#F0FDFA',
    what: 'Total Dissolved Solids — measures kidney load',
    range: 'Normal range: 200 – 800 ppm',
    why: 'TDS reflects the concentration of minerals, salts, and waste products your kidneys are filtering. High TDS may indicate dehydration or elevated kidney stress.',
    reading: 'Electrical conductivity measurement',
  },
  {
    icon: Eye,
    name: 'Turbidity Sensor',
    color: '#7C3AED',
    bg: '#F5F3FF',
    what: 'Measures how clear or cloudy the urine is',
    range: 'Normal range: 0 – 5 NTU',
    why: 'Cloudy urine can be a sign of bacterial infection, protein in the urine, or kidney disease. Clear urine generally indicates good hydration and kidney health.',
    reading: 'Optical light-scattering measurement',
  },
  {
    icon: Thermometer,
    name: 'Temperature Sensor',
    color: '#DB2777',
    bg: '#FDF2F8',
    what: 'Validates freshness and sample integrity',
    range: 'Expected: 32 – 38 °C',
    why: 'Temperature confirms that the sample is fresh and not contaminated or diluted. It also helps calibrate other sensor readings for accuracy.',
    reading: 'Infrared thermal detection',
  },
  {
    icon: Eye,
    name: 'Colour Sensor',
    color: '#D97706',
    bg: '#FFFBEB',
    what: 'Detects urine colour for hydration and health flags',
    range: 'Range: Pale yellow to dark amber',
    why: 'Urine colour is one of the most immediate signs of hydration. Very dark urine indicates dehydration; red or brown shades may suggest blood or kidney disease.',
    reading: 'RGB optical wavelength detection',
  },
];

const PIPELINE = [
  {
    step: '01',
    icon: Droplets,
    title: 'Urine Sample Captured',
    desc: 'When a patient uses the UroSense urinal, urine passes over an embedded sensor array. No collection, contact, or action is required.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    step: '02',
    icon: Zap,
    title: 'Sensors Read Raw Values',
    desc: 'Five sensors simultaneously capture pH, TDS, turbidity, temperature, and colour readings. This takes less than 3 seconds.',
    color: '#0D9488',
    bg: '#F0FDFA',
  },
  {
    step: '03',
    icon: Activity,
    title: 'Analysis Engine Interprets Data',
    desc: 'Raw sensor values are compared against clinical reference ranges. Each marker is classified as Normal, Borderline, or High Risk.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    step: '04',
    icon: Shield,
    title: 'Health Report Generated',
    desc: 'A plain-language report is created with each finding explained in patient-friendly terms — no medical degree required to understand it.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    step: '05',
    icon: CheckCircle2,
    title: 'Delivered to Your Phone',
    desc: 'Scan the QR code, verify with OTP, and your complete health report appears on your device — all in under 60 seconds.',
    color: '#DB2777',
    bg: '#FDF2F8',
  },
];

const DETECTABLE = [
  { name: 'Blood Sugar (Glucose)', icon: Activity, color: '#2563EB', bg: '#EFF6FF', note: 'Elevated glucose in urine may indicate diabetes or pre-diabetes' },
  { name: 'Protein', icon: Shield, color: '#0D9488', bg: '#F0FDFA', note: 'Protein leakage indicates early-stage kidney disease' },
  { name: 'Urea', icon: FlaskConical, color: '#7C3AED', bg: '#F5F3FF', note: 'Tracks kidney filtering efficiency and protein metabolism' },
  { name: 'Kidney Stress', icon: Activity, color: '#DB2777', bg: '#FDF2F8', note: 'Detected via combined TDS and turbidity markers' },
  { name: 'Hydration Level', icon: Droplets, color: '#D97706', bg: '#FFFBEB', note: 'Derived from urine concentration and colour indicators' },
  { name: 'UTI Indicators', icon: Eye, color: '#6B7280', bg: '#F8FAFC', note: 'Turbidity and pH patterns flag possible infection risk' },
];

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>
      <Navbar />
      <main className="pt-24 pb-20 space-y-24">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-sm font-semibold">
            <Zap className="w-4 h-4" /> How It Works
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1B33] tracking-tight leading-tight">
            Turning Urine into<br />
            <span className="text-[#2563EB]">Health Intelligence</span>
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">
            UroSense uses five embedded medical-grade sensors to analyse your urine at the point of use — no lab, no technician, no waiting. Here is how raw sensor data becomes a meaningful health report.
          </p>
        </section>

        {/* Analysis Pipeline */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono text-[#2563EB] uppercase tracking-wider">The Process</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight">
                Sensor → Analysis → Health Report
              </h2>
              <p className="text-[#6B7280] text-base max-w-xl mx-auto">
                Every UroSense analysis follows a precise five-step process from sample capture to report delivery.
              </p>
            </div>

            <div className="relative space-y-4">
              <div className="hidden md:block absolute left-[2.75rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#2563EB] to-[#DB2777]" />
              {PIPELINE.map((step, idx) => (
                <div key={idx} className="relative flex gap-6 md:gap-10 items-start">
                  <div
                    className="relative z-10 flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-md"
                    style={{ background: step.bg, borderColor: step.color + '30' }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.color }} />
                    <span className="text-[10px] font-bold mt-0.5" style={{ color: step.color }}>{step.step}</span>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                    style={{ borderLeft: `3px solid ${step.color}` }}>
                    <h3 className="font-bold text-[#0B1B33] text-base mb-1">{step.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sensors Section */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#0D9488] uppercase tracking-wider">The Hardware</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight">
              Five Sensors, One Complete Picture
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-base leading-relaxed">
              Each UroSense terminal contains five embedded sensors that work simultaneously to capture a comprehensive urinalysis in under 3 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SENSORS.map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    <s.icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1B33] text-base">{s.name}</h3>
                    <p className="text-xs font-mono text-gray-400">{s.reading}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#0B1B33]">{s.what}</p>
                  <p className="text-xs text-[#2563EB] font-semibold bg-blue-50 px-3 py-1 rounded-full w-fit">{s.range}</p>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{s.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What Can UroSense Detect */}
        <section className="bg-[#0B1B33] py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono text-[#0D9488] uppercase tracking-wider">Detection Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                What Can UroSense Detect?
              </h2>
              <p className="text-[#94A3B8] max-w-2xl mx-auto text-base leading-relaxed">
                UroSense analyses six critical health markers that provide an early window into kidney health, metabolic function, hydration, and infection risk.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DETECTABLE.map((d, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 hover:bg-white/10 transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: d.bg }}>
                    <d.icon className="w-5 h-5" style={{ color: d.color }} />
                  </div>
                  <h3 className="font-bold text-white text-base">{d.name}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Early Detection */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#DB2777] uppercase tracking-wider">The Stakes</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight">
              Why Early Detection Matters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stat: '37%', label: 'of adults are chronically dehydrated without knowing it', color: '#2563EB', bg: '#EFF6FF' },
              { stat: '90%', label: 'of kidney disease cases are detected late due to lack of routine screening', color: '#0D9488', bg: '#F0FDFA' },
              { stat: '46%', label: 'of diabetes cases are undiagnosed — many detectable via early urinalysis', color: '#DB2777', bg: '#FDF2F8' },
            ].map((s, idx) => (
              <div key={idx} className="rounded-2xl p-6 text-center space-y-2 border border-gray-100 shadow-sm" style={{ background: s.bg }}>
                <p className="text-5xl font-extrabold" style={{ color: s.color }}>{s.stat}</p>
                <p className="text-sm text-[#4B5563] leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-8 text-center space-y-4 border border-gray-100">
            <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
              Urine holds early biomarkers for over 20 chronic conditions. Routine urinalysis — at the same frequency as using a public restroom — could change how we approach preventive health.
              <strong className="text-[#0B1B33]"> UroSense makes this possible without any lifestyle change.</strong>
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
