'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-black/5 bg-[#FAF9F6] px-6 md:px-12 py-12 max-w-7xl mx-auto text-[#1C1E21]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#6E7680]">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_2px_8px_rgba(2,132,199,0.2)]">
            <span className="text-white font-display font-extrabold text-[8px]">U</span>
          </div>
          <span className="font-display font-medium text-sm tracking-tight text-[#1C1E21]">urosens</span>
        </div>

        {/* Copyright */}
        <p className="font-light">
          © 2026 UroSense. Engineered by{' '}
          <a href="https://github.com/umeshpandeysh" className="text-[#0284c7] hover:underline font-semibold">
            umeshpandeysh
          </a>.
        </p>

        {/* Navigation Links */}
        <div className="flex gap-8">
          <Link href="/login" className="hover:text-[#1C1E21] transition-colors font-medium">Portal</Link>
          <Link href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System" className="hover:text-[#1C1E21] transition-colors font-medium">GitHub</Link>
          <Link href="/admin/dashboard" className="hover:text-[#1C1E21] transition-colors font-medium">Admin</Link>
        </div>

      </div>
    </footer>
  );
}
