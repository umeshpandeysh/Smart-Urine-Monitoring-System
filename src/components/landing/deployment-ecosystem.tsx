'use client';

import React from 'react';
import { Globe, Building2, GraduationCap } from 'lucide-react';

const ecosystems = [
  {
    icon: Globe,
    title: 'Airports & Transit',
    description: 'Ambient diagnostic checkpoints integrated into high-volume airport lounges, delivering anonymous checkpoint telemetry.'
  },
  {
    icon: Building2,
    title: 'Hospitals & Clinics',
    description: 'Continuous metabolic feedback loops connecting recovery and kidney biomarkers directly to clinical dashboards.'
  },
  {
    icon: GraduationCap,
    title: 'Universities & Corporate',
    description: 'Corporate wellness screening and campus diagnostics programs helping establish hydration baseline trends.'
  },
  {
    icon: Building2, // fallback or generic icon
    title: 'Smart Cities',
    description: 'Anonymized civic biomonitoring arrays compiling macro-level hydration indices to optimize public health initiatives.'
  }
];

export default function DeploymentEcosystem() {
  return (
    <section id="ecosystem" className="relative py-32 bg-white border-t border-[#E5E7EB] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#0F7AF3] uppercase font-semibold">Scale & Deployment</span>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#111827]">
            Integrating with modern infrastructure.
          </h2>
          <p className="text-[#6B7280] font-light max-w-xl">
            UroSense is built to deploy inside critical enterprise endpoints, providing scalable biological intelligence without disrupting daily routines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecosystems.map((eco) => {
            const Icon = eco.icon;
            return (
              <div 
                key={eco.title} 
                className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.01)] transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.01)] mb-6">
                    <Icon className="w-5 h-5 text-[#0F7AF3]" />
                  </div>
                  <h4 className="font-display font-medium text-base text-[#111827] mb-2">{eco.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light">{eco.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
