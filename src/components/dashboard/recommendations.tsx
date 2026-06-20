'use client';

import React from 'react';
import { Droplet, Activity, Heart } from 'lucide-react';

interface RecommendationsProps {
  hydrationIndex: number | null;
}

export default function Recommendations({ hydrationIndex }: RecommendationsProps) {
  const score = hydrationIndex ?? 0;

  const getRecommendations = () => {
    if (hydrationIndex === null) {
      return [
        { icon: Droplet, title: 'Hydration Target', desc: 'Maintain a baseline of 2.5L clean water intake daily.' },
        { icon: Activity, title: 'Physical Activity', desc: 'Scan at a checkpoint post-exercise to check sweat concentration.' },
        { icon: Heart, title: 'Biological Rhythm', desc: 'Set up your diagnostic scans at consistent morning hours.' }
      ];
    }
    if (score >= 70) {
      return [
        { icon: Droplet, title: 'Fluid Clearance', desc: 'Your current clearance rate is optimal. Maintain current consumption levels.' },
        { icon: Activity, title: 'Electrolyte Balance', desc: 'TDS parameters indicate stable mineral suspension.' },
        { icon: Heart, title: 'System Wellness', desc: 'Urinalysis signals regular metabolic function.' }
      ];
    }
    if (score >= 40) {
      return [
        { icon: Droplet, title: 'Active Hydration', desc: 'Consume 500ml water immediately to recover normal fluid density.' },
        { icon: Activity, title: 'Mineral Regulation', desc: 'TDS is elevated. Avoid caffeinated or sugary beverages for 4 hours.' },
        { icon: Heart, title: 'Rest Recovery', desc: 'Monitor baseline parameters during your next restroom check-in.' }
      ];
    }
    return [
      { icon: Droplet, title: 'Urgent Fluid Intake', desc: 'Drink 1L water with balanced electrolytes over the next hour.' },
      { icon: Activity, title: 'Concentration Warning', desc: 'High solute index detected. Restrict high-sodium meals.' },
      { icon: Heart, title: 'Metabolic Support', desc: 'Scan again within 3 hours to verify hydration recovery.' }
    ];
  };

  const list = getRecommendations();

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-6">
      <div>
        <span className="text-xs font-mono tracking-widest text-[#0F7AF3] uppercase font-semibold">Action Plan</span>
        <h4 className="font-display font-medium text-lg text-[#111827] mt-1">Recommendations</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-5 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] space-y-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <Icon className="w-4 h-4 text-[#0F7AF3]" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-[#111827]">{item.title}</h5>
                <p className="text-xs text-[#6B7280] font-light mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
