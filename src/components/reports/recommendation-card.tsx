'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Heart, Activity } from 'lucide-react';

interface RecommendationCardProps {
  type: 'hydration' | 'lifestyle' | 'followup';
  title: string;
  description: string;
}

export default function RecommendationCard({ type, title, description }: RecommendationCardProps) {
  const config = {
    hydration: {
      icon: Droplet,
      iconColor: 'text-[#0F7AF3]',
      bgColor: 'bg-[#0F7AF3]/5',
      borderColor: 'border-[#0F7AF3]/10',
      label: 'Hydration Protocol',
    },
    lifestyle: {
      icon: Heart,
      iconColor: 'text-[#E056FD]',
      bgColor: 'bg-[#E056FD]/5',
      borderColor: 'border-[#E056FD]/10',
      label: 'Lifestyle Alignment',
    },
    followup: {
      icon: Activity,
      iconColor: 'text-[#16A085]',
      bgColor: 'bg-[#16A085]/5',
      borderColor: 'border-[#16A085]/10',
      label: 'Diagnostic Sequence',
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`p-5 rounded-xl border ${config.borderColor} bg-[#FFFFFF] flex gap-4 transition-all duration-200`}
    >
      {/* Icon Area */}
      <div className={`p-2.5 rounded-lg ${config.bgColor} ${config.iconColor} self-start shrink-0`}>
        <IconComponent className="w-4 h-4" />
      </div>

      {/* Content Area */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#9CA3AF] tracking-wider uppercase">
            {config.label}
          </span>
        </div>
        <h4 className="font-display font-medium text-sm text-[#111827]">
          {title}
        </h4>
        <p className="text-xs text-[#6B7280] leading-relaxed font-light">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
