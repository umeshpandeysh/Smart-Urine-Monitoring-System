'use client';

import React from 'react';
import { ShieldCheck, Lock, Download } from 'lucide-react';
import Link from 'next/link';

export default function TrustSection() {
  return (
    <section className="relative py-32 bg-[#FFFFFF] border-t border-black/5 text-[#1C1E21]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Description */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono tracking-widest text-[#0284c7] uppercase font-semibold">Clinical Vision & Trust</span>
            <h3 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#1C1E21]">
              Biomonitoring at scale.
            </h3>
            <p className="text-[#6E7680] font-light max-w-xl leading-relaxed">
              UroSense represents a shift in preventive diagnostics. By integrating automated checkpoints into daily routines, we capture stable biomarker sequences. Built to meet clinical compliance and strict data privacy requirements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1E21]">HIPAA Compliant Vaults</h4>
                  <p className="text-xs text-[#6E7680] font-light mt-1">End-to-end data encryption protects patient biological telemetry at rest and in transit.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1E21]">Cryptographic Signatures</h4>
                  <p className="text-xs text-[#6E7680] font-light mt-1">Every generated urinalysis report is cryptographically signed and verifiable via secure SHA-256 hashes.</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1E21] text-[#FAF9F6] text-xs font-semibold hover:bg-[#1C1E21]/90 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-200"
              >
                Request Investment Deck <Download className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column Metrics Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="border-l-2 border-black/5 pl-6 space-y-1">
              <span className="block font-mono text-[10px] text-[#6E7680] uppercase tracking-wider font-semibold">LATENCY</span>
              <span className="block font-display text-4xl font-light text-[#1C1E21]">0.02s</span>
              <span className="block text-xs text-[#6E7680] font-light">From hardware scan to secure user dashboard.</span>
            </div>
            <div className="border-l-2 border-black/5 pl-6 space-y-1">
              <span className="block font-mono text-[10px] text-[#6E7680] uppercase tracking-wider font-semibold">ONBOARDING</span>
              <span className="block font-display text-4xl font-light text-[#1C1E21]">100%</span>
              <span className="block text-xs text-[#6E7680] font-light">Completely touchless, passive checkpoint design.</span>
            </div>
            <div className="border-l-2 border-black/5 pl-6 space-y-1">
              <span className="block font-mono text-[10px] text-[#6E7680] uppercase tracking-wider font-semibold">STANDARDS</span>
              <span className="block font-display text-4xl font-light text-[#1C1E21]">SOC2</span>
              <span className="block text-xs text-[#6E7680] font-light">Security audits verifying operational controls.</span>
            </div>
            <div className="border-l-2 border-black/5 pl-6 space-y-1">
              <span className="block font-mono text-[10px] text-[#6E7680] uppercase tracking-wider font-semibold">PRECISION</span>
              <span className="block font-display text-4xl font-light text-[#1C1E21]">10-Band</span>
              <span className="block text-xs text-[#6E7680] font-light">Spectrograph resolution reading sample parameters.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
