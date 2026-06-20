'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Activity } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#E5E7EB] bg-[#FAFAF8]/90 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded bg-[#0F7AF3] shadow-[0_2px_8px_rgba(15,122,243,0.2)]">
            <Activity className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-medium text-lg tracking-tight text-[#111827]">UroSense</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-[#6B7280]">
          <div className="relative group">
            <button 
              onClick={() => toggleAccordion('solutions')}
              className="flex items-center gap-1 hover:text-[#111827] transition-colors focus:outline-none"
            >
              Solutions
              <motion.div
                animate={{ rotate: activeAccordion === 'solutions' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
            {/* Simple dropdown menu */}
            <AnimatePresence>
              {activeAccordion === 'solutions' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-3 w-56 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-lg p-3 space-y-1"
                >
                  <Link href="#ecosystem" onClick={() => setActiveAccordion(null)} className="block px-3 py-2 text-xs text-[#111827] hover:bg-[#FAFAF8] rounded-lg transition-colors">Airport Terminals</Link>
                  <Link href="#ecosystem" onClick={() => setActiveAccordion(null)} className="block px-3 py-2 text-xs text-[#111827] hover:bg-[#FAFAF8] rounded-lg transition-colors">Clinical Facilities</Link>
                  <Link href="#ecosystem" onClick={() => setActiveAccordion(null)} className="block px-3 py-2 text-xs text-[#111827] hover:bg-[#FAFAF8] rounded-lg transition-colors">Civic Spaces</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link href="#technology" className="hover:text-[#111827] transition-colors">Technology</Link>
          <Link href="#intelligence" className="hover:text-[#111827] transition-colors">About</Link>
          <Link href="#trust" className="hover:text-[#111827] transition-colors">Contact</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/login" 
            className="px-5 py-2 rounded-full bg-[#0F7AF3] text-white text-xs font-semibold hover:bg-[#0F7AF3]/95 shadow-[0_4px_12px_rgba(15,122,243,0.15)] transition-all duration-200"
          >
            Access Portal
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-[#111827] focus:outline-none p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#E5E7EB] bg-[#FAFAF8] px-6 py-6 space-y-4"
          >
            <div className="space-y-3">
              <button 
                onClick={() => toggleAccordion('solutions-mobile')}
                className="w-full flex items-center justify-between text-sm font-medium text-[#111827]"
              >
                Solutions
                <motion.div
                  animate={{ rotate: activeAccordion === 'solutions-mobile' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeAccordion === 'solutions-mobile' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 space-y-2 border-l border-[#E5E7EB] overflow-hidden"
                  >
                    <Link href="#ecosystem" onClick={() => setIsOpen(false)} className="block text-xs text-[#6B7280]">Airports</Link>
                    <Link href="#ecosystem" onClick={() => setIsOpen(false)} className="block text-xs text-[#6B7280]">Clinics</Link>
                    <Link href="#ecosystem" onClick={() => setIsOpen(false)} className="block text-xs text-[#6B7280]">Civic Areas</Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link href="#technology" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-[#111827]">Technology</Link>
              <Link href="#intelligence" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-[#111827]">About</Link>
              <Link href="#trust" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-[#111827]">Contact</Link>
            </div>
            <div className="border-t border-[#E5E7EB] pt-4 flex flex-col gap-3">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-center text-sm font-semibold text-[#111827] py-2"
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-center text-xs font-semibold bg-[#0F7AF3] text-white py-2.5 rounded-full shadow-md"
              >
                Access Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
