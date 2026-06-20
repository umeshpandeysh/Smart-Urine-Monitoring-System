'use client';

import React from 'react';
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import HardwareShowcase from '@/components/landing/hardware-showcase';
import HealthIntelligence from '@/components/landing/health-intelligence';
import DeploymentEcosystem from '@/components/landing/deployment-ecosystem';
import TrustCompliance from '@/components/landing/trust-compliance';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FAFAF8] text-[#111827] overflow-x-hidden font-sans select-none selection:bg-[#0F7AF3]/20 selection:text-[#0F7AF3]">
      {/* Micro-texture noise overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.012] mix-blend-overlay"
        style={{ backgroundImage: 'var(--noise-overlay, none)' }}
      />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <HardwareShowcase />
        <HealthIntelligence />
        <DeploymentEcosystem />
        <TrustCompliance />
        <Footer />
      </main>
    </div>
  );
}
