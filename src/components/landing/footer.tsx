'use client';

import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

const LINKS = {
  product: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Technology', href: '/technology' },
    { label: 'User Portal', href: '/patient-portal' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0B1B33] border-t border-white/5" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight"
                style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                UroSense
              </span>
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
              AI-powered urine health monitoring. Non-invasive, touchless, and instant — deployed at transit hubs, clinics, and smart cities.
            </p>
            <p className="text-[#475569] text-xs font-mono">
              Made in India 🇮🇳 · Clinical-Grade Wellness
            </p>
          </div>

          {/* Product Links */}
          <div>
            <p className="text-[#475569] text-[11px] font-mono uppercase tracking-widest mb-4">Product</p>
            <ul className="space-y-3">
              {LINKS.product.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#94A3B8] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-[#475569] text-[11px] font-mono uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-3">
              {LINKS.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#94A3B8] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="mt-10 pt-6 border-t border-white/5 text-[11px] text-[#475569] leading-relaxed">
          <p className="font-semibold text-slate-400 mb-1">Clinical Disclaimer</p>
          <p>UroSense provides non-invasive preventive wellness indicators and physiological trend tracking. Urinalysis metrics delivered via public checkpoints do not constitute formal medical diagnosis or laboratory consultation. Always consult a certified healthcare professional regarding physical symptoms.</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
          <p className="font-mono">© {new Date().getFullYear()} UroSense Platform. All rights reserved.</p>
          <a
            href="https://github.com/umeshpandeysh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#94A3B8] transition-colors duration-200"
          >
            Engineered by Umesh Pandey
          </a>
        </div>
      </div>
    </footer>
  );
}
