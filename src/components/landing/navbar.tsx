'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/technology', label: 'Technology' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-300">
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-7xl px-6 md:px-8 py-3.5 flex items-center justify-between rounded-full border transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0B1B33]/80 border-white/10 shadow-[0_8px_32px_rgba(11,27,51,0.2)] backdrop-blur-md' 
            : 'bg-white/80 border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2563EB] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          <span className={`font-semibold text-lg tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-white' : 'text-[#0B1B33]'
          }`} style={{ fontFamily: 'var(--font-plus-jakarta), var(--font-manrope), sans-serif' }}>
            UroSense
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`relative py-1 transition-colors duration-300 group ${
                  scrolled 
                    ? (isActive ? 'text-white' : 'text-gray-300 hover:text-white')
                    : (isActive ? 'text-[#2563EB]' : 'text-gray-600 hover:text-[#0B1B33]')
                }`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {link.label}
                {/* Underline/Indicator hover animation */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#2563EB] transform transition-transform duration-300 origin-left ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            href="/admin-center" 
            className={`text-xs font-mono font-semibold border px-3.5 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] ${
              scrolled 
                ? 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                : 'border-gray-200 text-[#0B1B33] bg-white hover:bg-gray-50 shadow-sm'
            }`}
          >
            Admin Center
          </Link>
          <Link 
            href="/patient-portal" 
            className={`px-5 py-2 rounded-full text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              scrolled
                ? 'bg-white text-[#0B1B33] hover:bg-gray-50 shadow-white/5'
                : 'bg-[#0B1B33] text-white hover:bg-[#0B1B33]/90 shadow-blue-900/10'
            }`}
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Patient Portal
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden focus:outline-none p-1 rounded-full ${
            scrolled ? 'text-white hover:bg-white/10' : 'text-[#0B1B33] hover:bg-gray-100'
          }`}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={`absolute top-20 left-4 right-4 rounded-2xl border p-6 flex flex-col gap-5 shadow-xl lg:hidden ${
              scrolled 
                ? 'bg-[#0B1B33]/95 border-white/10 text-white backdrop-blur-md'
                : 'bg-white border-gray-100 text-[#0B1B33] backdrop-blur-md'
            }`}
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    scrolled ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-[#0B1B33]'
                  }`}
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className={`border-t pt-4 flex flex-col gap-3 ${
              scrolled ? 'border-white/10' : 'border-gray-100'
            }`}>
              <Link 
                href="/admin-center" 
                onClick={() => setIsOpen(false)}
                className={`w-full text-center text-xs font-mono font-semibold py-2.5 border rounded-xl transition-all ${
                  scrolled 
                    ? 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                    : 'border-gray-200 text-[#0B1B33] bg-white hover:bg-gray-50'
                }`}
              >
                Admin Center
              </Link>
              <Link 
                href="/patient-portal" 
                onClick={() => setIsOpen(false)}
                className={`w-full text-center text-xs font-semibold py-2.5 rounded-xl shadow-md ${
                  scrolled
                    ? 'bg-white text-[#0B1B33]'
                    : 'bg-[#0B1B33] text-white'
                }`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Patient Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
