'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const hardwareNodes = [
  {
    id: 'spectrograph',
    title: 'TCS34725 Spectrograph',
    x: 60,
    y: 35,
    description: '10-band optical spectrograph capturing light refraction through fluid samples to catalog colorimetric health indices in real time.'
  },
  {
    id: 'probes',
    title: 'Biomarker Probes',
    x: 35,
    y: 55,
    description: 'Platinum-coated sensor array mapping pH balance, Total Dissolved Solids (TDS), and fluid temperature with clinical accuracy.'
  },
  {
    id: 'edge',
    title: 'UroLink Gateway',
    x: 50,
    y: 80,
    description: 'Secure local edge module encrypting telemetry records before transmission over TLS 1.3 channels within 3.2 seconds.'
  }
];

export default function HardwareShowcase() {
  const [activeNode, setActiveNode] = useState('spectrograph');

  return (
    <section id="technology" className="relative py-32 bg-[#FFFFFF] border-t border-black/5 text-[#1C1E21] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#0284c7] uppercase font-semibold">Hardware Architecture</span>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#1C1E21]">
            Clinical diagnostics, hidden in plain sight.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Blueprint Column */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[480px] aspect-[4/5] rounded-[2rem] border border-black/5 bg-[#FAF9F6] p-8 relative flex items-center justify-center overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
              {/* Technical Grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <svg viewBox="0 0 200 250" className="w-72 h-auto text-[#1C1E21]/10 relative z-10">
                {/* Casing Outline */}
                <rect x="40" y="30" width="120" height="190" rx="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
                
                {/* Casing internal details */}
                <rect x="55" y="45" width="90" height="70" rx="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="100" cy="80" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M70,165 L130,165 M100,165 L100,205" fill="none" stroke="currentColor" strokeWidth="1.2" />
                
                {/* Hotspots */}
                {hardwareNodes.map((node) => (
                  <g 
                    key={node.id} 
                    onClick={() => setActiveNode(node.id)}
                    className="cursor-pointer"
                  >
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r="8" 
                      fill={activeNode === node.id ? '#0284c7' : '#E5E7EB'} 
                      className="transition-all duration-300"
                    />
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r="14" 
                      fill="none" 
                      stroke={activeNode === node.id ? '#0284c7' : 'transparent'} 
                      strokeWidth="1.5"
                      className={`transition-all duration-300 ${activeNode === node.id ? 'animate-ping' : ''}`}
                    />
                  </g>
                ))}
              </svg>

              {/* Indicator glow for selected hotspot */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {hardwareNodes.map((node) => (
                  activeNode === node.id && (
                    <div 
                      key={node.id}
                      className="absolute w-2.5 h-2.5 rounded-full bg-[#0284c7] shadow-[0_0_12px_#0284c7]"
                      style={{ left: `${node.x * 2.15}px`, top: `${node.y * 2.15}px` }}
                    />
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Right Information Tabs Column */}
          <div className="lg:col-span-5 space-y-5">
            {hardwareNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 block ${
                  activeNode === node.id
                    ? 'border-black/5 bg-[#FAF9F6] shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                    : 'border-transparent bg-transparent hover:border-black/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activeNode === node.id ? 'bg-[#0284c7]' : 'bg-gray-300'}`} />
                  <h4 className="font-display font-medium text-base text-[#1C1E21]">{node.title}</h4>
                </div>
                <AnimatePresence mode="wait">
                  {activeNode === node.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-[#6E7680] leading-relaxed mt-3 ml-5 font-light"
                    >
                      {node.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
