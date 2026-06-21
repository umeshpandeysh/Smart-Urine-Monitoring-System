'use client';

import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { HelpCircle, CheckCircle2, ShieldCheck, Heart, Info } from 'lucide-react';

export default function AboutPage() {
  const faqs = [
    {
      q: 'What is UroSense?',
      a: 'UroSense is a automated urine monitoring platform deployed inside standard public facilities and medical clinics. It provides secure, instant biological analysis to help you monitor wellness baseline markers without manual laboratory wait times.'
    },
    {
      q: 'What can it detect?',
      a: 'The system checks six core wellness metrics: Hydration index, urinary acidity (pH level), glucose spikes (indicating metabolic trends), protein leaks (kidney filtering efficiency), kidney load indicators (TDS levels), and turbidity indicators (flagging urinary tract health or infection risks).'
    },
    {
      q: 'How does it work?',
      a: 'Simply use the UroSense-enabled urinal system naturally. Inside the device, solid-state sensors evaluate physical and optical characteristics of the sample within 3 seconds. An ephemeral QR code is generated on-screen immediately for you to scan and access findings.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. UroSense uses a zero-persistent storage model. Diagnostic telemetry data is immediately encrypted via AES-256 protocols and linked directly to your session identifier. No biological profile or physical readings remain stored on the terminal hardware.'
    },
    {
      q: 'What happens after scanning?',
      a: 'Once you scan the QR token and complete the OTP mobile verification step, your biological values are securely added to your personal health journal database. You can review current assessments, compare past history timelines, download PDF reports, or choose to share the data directly with a physician.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-white text-[#0B1B33] overflow-x-hidden" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Simple Page Intro */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-mono text-[#2563EB] uppercase tracking-wider font-semibold">
            Product &amp; Clinical Information
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            About UroSense
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Understanding automated urinalysis baseline monitoring, patient diagnostic loops, and biometric privacy protocols.
          </p>
        </div>

        {/* Informational Sections */}
        <div className="space-y-10 divide-y divide-gray-100 pt-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`pt-8 ${idx === 0 ? 'border-t-0 pt-0' : ''} space-y-3`}>
              <h3 className="text-lg font-bold text-[#0B1B33] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                <HelpCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                {faq.q}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Clinical Disclaimer Block */}
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 flex gap-4 items-start">
          <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-gray-500 leading-relaxed">
            <p className="font-bold text-[#0B1B33]">Medical Disclaimer</p>
            <p>UroSense assessments represent physiological trends and biological baseline values for wellness tracking. Urinalysis metrics do not constitute formal diagnostic consultation or laboratory reports. Always contact your healthcare provider regarding physical symptoms or long-term concerns.</p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
