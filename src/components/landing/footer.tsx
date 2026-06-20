'use client';

import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-[#E5E7EB] bg-[#FAFAF8] px-6 md:px-12 py-12 max-w-7xl mx-auto text-[#111827]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#6B7280]">
        
        {/* Brand details */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#0F7AF3] shadow-[0_2px_8px_rgba(15,122,243,0.2)]">
            <Activity className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-medium text-sm tracking-tight text-[#111827]">UroSense</span>
        </div>

        {/* Copyright */}
        <p className="font-light">
          © 2026 UroSense. Engineered by{' '}
          <a href="https://github.com/umeshpandeysh" className="text-[#0F7AF3] hover:underline font-semibold">
            umeshpandeysh
          </a>.
        </p>

        {/* Links */}
        <div className="flex gap-8">
          <Link href="/login" className="hover:text-[#111827] transition-colors font-medium">Portal</Link>
          <Link href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System" className="hover:text-[#111827] transition-colors font-medium">GitHub</Link>
          <Link href="/admin/dashboard" className="hover:text-[#111827] transition-colors font-medium">Admin</Link>
        </div>

      </div>
    </footer>
  );
}
