'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0B1B33] border-t border-white/5 py-8 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <a
          href="https://github.com/umeshpandeysh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#94A3B8] hover:text-white transition-all duration-300 text-sm font-medium hover:tracking-wide tracking-normal"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Engineered by Umesh Pandey
        </a>
      </div>
    </footer>
  );
}
