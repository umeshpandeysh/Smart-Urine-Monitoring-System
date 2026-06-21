'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { ArrowRight, QrCode, ClipboardList, Thermometer, UserCheck, Smartphone } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Use UroSense-Enabled Urinal',
      desc: 'Use the urinal naturally. The hardware is designed for zero-contact, touchless operations inside active public facilities or hospital clinics.',
      icon: <UserCheck className="w-6 h-6 text-[#175E54]" />,
      bg: 'bg-teal-50 border-teal-200/50'
    },
    {
      step: 'Step 2',
      title: 'Telemetry Sensors Analyze Sample',
      desc: 'Physical sensors (including pH, color metric, and solute density optical modules) immediately analyze key chemical biomarkers as the sample flows through the collector.',
      icon: <Thermometer className="w-6 h-6 text-[#0A2540]" />,
      bg: 'bg-blue-50 border-blue-200/50'
    },
    {
      step: 'Step 3',
      title: 'Secure Session QR Code Generated',
      desc: 'The urinal screen instantly generates a localized cryptographic QR code containing your secure sample session ID.',
      icon: <QrCode className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200/50'
    },
    {
      step: 'Step 4',
      title: 'Scan QR and Verify Phone OTP',
      desc: 'Scan the QR code with your mobile camera. It will direct you to a secure login page where you enter your phone number and verify via instant SMS OTP.',
      icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200/50'
    },
    {
      step: 'Step 5',
      title: 'Review Urinalysis Health Report',
      desc: 'View your detailed biomarker diagnostic sheet. Understand your hydration state, kidney load, metabolic metrics, and follow personalized clinical guidelines.',
      icon: <ClipboardList className="w-6 h-6 text-[#167041]" />,
      bg: 'bg-emerald-50 border-emerald-200/50'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFAF8] text-[#1B1F26] overflow-x-hidden font-sans select-none">
      <Navbar />

      <main className="relative z-10 pt-20 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#0A2540] border border-[#E5E7EB] bg-white px-3 py-1 rounded-full uppercase">
            Platform Workflow
          </span>
          <h1 className="font-section">The 5-Step Diagnostic Journey</h1>
          <p className="font-body text-[#6B7280] font-light">
            UroSense bridges physical telemetry sensors with cloud-based diagnostic report delivery. See how a sample is scanned, secured, and analyzed in seconds.
          </p>
        </div>

        {/* Visual Steps Stack */}
        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 md:p-8 rounded-3xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow duration-300"
            >
              {/* Number and Icon Badge */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${step.bg}`}>
                {step.icon}
              </div>

              {/* Content */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6B7280] uppercase tracking-wider">{step.step}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                  <h3 className="font-card text-lg md:text-xl">{step.title}</h3>
                </div>
                <p className="font-body text-sm text-[#6B7280] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8 max-w-xl mx-auto space-y-6">
          <p className="font-body text-sm text-[#6B7280] font-light">
            Ready to access your reports or configure a new device? Link your session or navigate directly to the dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/login"
              className="px-6 py-3 rounded-full bg-[#0A2540] text-white text-sm font-semibold hover:bg-[#0A2540]/90 shadow-sm transition-all duration-200 flex items-center gap-2 group"
            >
              <span>Access Patient Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link 
              href="/technology"
              className="px-6 py-3 rounded-full border border-[#E5E7EB] bg-white text-[#0A2540] text-sm font-semibold hover:bg-[#FAFAF8] transition-all duration-200"
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
