import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { ArrowRight, QrCode, ClipboardList, Thermometer, UserCheck, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — UroSense',
  description: 'Learn the 5-step process behind UroSense: from touchless sample capture to instant health report delivery on your phone.',
};

const STEPS = [
  {
    step: 'Step 01',
    title: 'Use a UroSense-Enabled Terminal',
    desc: 'Use the urinal naturally. Hardware is designed for zero-contact, touchless operation at transit hubs, corporate parks, or healthcare facilities.',
    icon: UserCheck,
    color: '#0D9488',
    bg: '#F0FDFA',
    border: 'border-teal-200/60',
  },
  {
    step: 'Step 02',
    title: 'Sensors Capture Raw Biomarker Data',
    desc: 'Five solid-state sensors — pH, TDS, turbidity, temperature, and colour — simultaneously analyse key chemical biomarkers within 3 seconds.',
    icon: Thermometer,
    color: '#2563EB',
    bg: '#EFF6FF',
    border: 'border-blue-200/60',
  },
  {
    step: 'Step 03',
    title: 'Ephemeral QR Session Token Generated',
    desc: 'The terminal screen generates a cryptographic QR token containing your session ID. No personal data is stored on the kiosk hardware.',
    icon: QrCode,
    color: '#D97706',
    bg: '#FFFBEB',
    border: 'border-amber-200/60',
  },
  {
    step: 'Step 04',
    title: 'Scan QR & Verify Mobile OTP',
    desc: 'Scan the QR with your mobile camera. Enter your phone number, verify instantly via SMS OTP, and link the report to your private health journal.',
    icon: Smartphone,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: 'border-violet-200/60',
  },
  {
    step: 'Step 05',
    title: 'Review Your Health Report',
    desc: 'Instantly access a plain-language biomarker diagnostic report. Track hydration, kidney load, metabolic metrics, and follow personalised health guidance.',
    icon: ClipboardList,
    color: '#059669',
    bg: '#ECFDF5',
    border: 'border-emerald-200/60',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1B33]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />

      <main className="pt-28 pb-24 max-w-5xl mx-auto px-6 md:px-12 space-y-16">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block text-xs font-mono font-semibold tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase">
            Platform Workflow
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            The 5-Step Diagnostic Journey
          </h1>
          <p className="text-[#475569] text-base leading-relaxed">
            UroSense bridges physical sensor telemetry with cloud-based diagnostic report delivery — sample captured, secured, and analysed in under 60 seconds.
          </p>
        </div>

        {/* Steps Stack */}
        <div className="space-y-5">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`p-6 md:p-8 rounded-2xl border bg-white shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow duration-300 ${step.border}`}
              >
                {/* Icon Badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                  style={{ background: step.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: step.color }}>
                      {step.step}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                    <h2 className="font-bold text-[#0B1B33] text-base md:text-lg"
                      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-5 pt-4">
          <p className="text-[#475569] text-sm">
            Ready to see your health data? Log in or learn more about the sensor technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] shadow-md shadow-blue-500/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              Access Patient Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/technology"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 bg-white text-[#0B1B33] font-semibold text-sm hover:bg-gray-50 transition-all duration-200"
            >
              Technical Specifications
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
