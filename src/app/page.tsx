'use client';

import React from 'react';
import Hero from '@/components/landing/hero';
import HardwareShowcase from '@/components/landing/hardware-showcase';
import IntelligenceSection from '@/components/landing/intelligence-section';
import TrustSection from '@/components/landing/trust-section';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-[#1C1E21] overflow-x-hidden font-sans select-none selection:bg-[#0284c7]/20 selection:text-[#0284c7]">
      {/* Micro-texture noise overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.012] mix-blend-overlay"
        style={{ backgroundImage: 'var(--noise-overlay, none)' }}
      />

      {/* Main content sequence */}
      <main className="relative z-10">
        <Hero />
        <HardwareShowcase />
        <IntelligenceSection />
        <TrustSection />
        <Footer />
      </main>
    </div>
  );
}
