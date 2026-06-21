'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AuthBrandPanel from './auth-brand-panel';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] flex overflow-hidden">
      
      {/* Left: Brand Showcase Panel (60% width) - Hidden on Mobile */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[62%] h-screen sticky top-0">
        <AuthBrandPanel />
      </div>

      {/* Right: Auth Forms Container (40% width) */}
      <div className="w-full lg:w-[40%] xl:w-[38%] min-h-screen flex flex-col justify-center px-6 py-12 md:px-12 bg-[#FAFAF8] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm mx-auto space-y-8"
        >
          {children}
        </motion.div>
      </div>

    </div>
  );
}
