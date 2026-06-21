'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Bell, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortalNavigationProps {
  initials: string;
  fullName: string;
  role: string;
}

export default function PortalNavigation({ initials, fullName, role }: PortalNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/patient-portal', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Sidebar — Desktop (64px width / expanded 256px on hover or fixed 256px) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#E5E7EB] bg-white fixed inset-y-0 left-0 z-20 select-none">
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-lg bg-[#0F7AF3] flex items-center justify-center shadow-[0_4px_12px_rgba(15,122,243,0.15)]">
            <span className="text-white font-display font-bold text-sm">U</span>
          </div>
          <span className="font-display font-semibold text-base text-[#111827] tracking-tight">
            UroSense
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'text-[#0F7AF3] bg-[#0F7AF3]/5'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-5 rounded-r-full bg-[#0F7AF3]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Signout Footer */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 p-1.5 rounded-xl bg-gray-50 border border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-lg bg-[#0F7AF3]/10 border border-[#0F7AF3]/15 flex items-center justify-center font-display font-medium text-xs text-[#0F7AF3] shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111827] truncate">
                {fullName}
              </p>
              <p className="text-[9px] font-mono text-[#9CA3AF] uppercase tracking-wider">
                {role}
              </p>
            </div>
          </div>

          <form action="/api/auth/signout" method="POST" className="mt-3">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-[#9CA3AF] hover:text-[#C0392B] hover:bg-red-50/50 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT PORTAL</span>
            </button>
          </form>
        </div>

      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-white/95 backdrop-blur sticky top-0 z-20">
        <Link href="/patient-portal" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F7AF3] flex items-center justify-center shadow-[0_2px_8px_rgba(15,122,243,0.1)]">
            <span className="text-white font-display font-bold text-xs">U</span>
          </div>
          <span className="font-display font-semibold text-sm text-[#111827] tracking-tight">
            UroSense
          </span>
        </Link>

        {/* User initials bubble on top right */}
        <div className="w-7 h-7 rounded-full bg-[#0F7AF3]/5 border border-[#0F7AF3]/10 flex items-center justify-center font-display font-semibold text-[10px] text-[#0F7AF3]">
          {initials}
        </div>
      </div>

      {/* Mobile Bottom Navigation (44px min touch height target grid) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#E5E7EB] bg-white/95 backdrop-blur-md z-30 pb-safe">
        <div className="grid grid-cols-4 gap-0 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2.5 px-1 min-h-[48px] transition-colors relative ${
                  isActive ? 'text-[#0F7AF3]' : 'text-[#9CA3AF]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute top-0 w-6 h-[2px] bg-[#0F7AF3] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-mono mt-1 tracking-wider uppercase font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
