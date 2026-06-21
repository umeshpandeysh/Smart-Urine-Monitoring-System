'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Profile } from '@/types';

interface UserManagementProps {
  profiles: Profile[];
}

export default function UserManagement({ profiles }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'patient' | 'operator' | 'admin'>('all');

  // Filter profiles based on search and role
  const filteredProfiles = profiles.filter((p) => {
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || (p.timezone && p.timezone.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRiskStyle = (risk: string | null) => {
    const r = (risk === 'high' || risk === 'medium' || risk === 'low') ? risk : 'low';
    const config = {
      high: { dot: 'bg-[#C0392B] animate-pulse', label: 'High Risk', text: 'text-[#C0392B]' },
      medium: { dot: 'bg-[#D97706]', label: 'Elevated Risk', text: 'text-[#D97706]' },
      low: { dot: 'bg-[#16A085]', label: 'Nominal Risk', text: 'text-[#16A085]' },
    };
    return config[r];
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] select-none space-y-6">
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB]/60 pb-5">
        <div>
          <h3 className="font-display font-medium text-lg text-[#111827] tracking-tight">
            User Operations Control
          </h3>
          <p className="text-xs text-[#6B7280] font-light mt-0.5">
            Trace population enrollment, timezone mappings, and dynamic health risk profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] font-semibold text-[#6B7280]">
            {filteredProfiles.length} PROFILES LOADED
          </span>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        
        {/* Search Input */}
        <div className="relative flex-1 flex items-center rounded-xl border border-[#E5E7EB] px-3.5 bg-[#FAFAF8]/40 focus-within:ring-2 focus-within:ring-[#0F7AF3]/20 focus-within:border-[#0F7AF3] transition-all duration-200">
          <Search className="w-4 h-4 text-[#9CA3AF] mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search by username, location index, or timezone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 bg-transparent border-0 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
          />
        </div>

        {/* Filters Panel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#9CA3AF] mr-1 shrink-0" />
          {(['all', 'patient', 'operator', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono capitalize transition-all duration-200 shrink-0 ${
                roleFilter === role
                  ? 'bg-[#111827] border-[#111827] text-white'
                  : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#9CA3AF]'
              }`}
            >
              {role}s
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <AnimatePresence mode="popLayout">
          {filteredProfiles.map((p, idx) => {
            const risk = getRiskStyle(p.risk_level);
            const initials = `${p.first_name?.[0] || 'U'}${p.last_name?.[0] || 'P'}`.toUpperCase();
            
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#0F7AF3]/30 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between space-y-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-all duration-200"
              >
                
                {/* Profile Identity Card */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    
                    {/* Avatar bubble */}
                    <div className="w-10 h-10 rounded-xl bg-gray-100 border border-[#E5E7EB] flex items-center justify-center font-display font-medium text-xs text-[#4B5563] shrink-0">
                      {initials}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-display font-medium text-sm text-[#111827] tracking-tight">
                        {p.first_name || 'UroSense'} {p.last_name || 'Patient'}
                      </h4>
                      <p className="text-[10px] text-[#6B7280] font-light">
                        {p.timezone || 'UTC timezone'}
                      </p>
                    </div>

                  </div>

                  <span className={`font-mono text-[9px] font-semibold px-2 py-0.5 rounded border ${
                    p.role === 'admin' 
                      ? 'text-[#E056FD] bg-[#E056FD]/5 border-[#E056FD]/10' 
                      : p.role === 'operator' 
                      ? 'text-[#0F7AF3] bg-[#0F7AF3]/5 border-[#0F7AF3]/10' 
                      : 'text-[#6B7280] bg-gray-50 border-[#E5E7EB]'
                  }`}>
                    {p.role.toUpperCase()}
                  </span>
                </div>

                {/* Risk and Audit Details */}
                <div className="border-t border-[#E5E7EB]/60 pt-4 flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                  
                  {/* Risk Indicator */}
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                    <span className={risk.text}>{risk.label.toUpperCase()}</span>
                  </div>

                  {/* Registered Timestamp */}
                  <div className="text-right">
                    <span>SINCE {formatDate(p.created_at).toUpperCase()}</span>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3 border border-dashed border-[#E5E7EB] rounded-2xl">
            <p className="text-3xl">👥</p>
            <h4 className="font-display font-medium text-base text-[#111827]">
              No matching profiles found
            </h4>
            <p className="text-xs text-[#6B7280] font-light max-w-xs mx-auto">
              Refine your filters or search criteria.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
