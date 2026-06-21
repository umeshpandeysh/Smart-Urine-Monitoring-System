'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Globe, Cpu } from 'lucide-react';

interface ExecutiveOverviewProps {
  totalUsers: number;
  totalLocations: number;
  totalDevices: number;
  onlineDevices: number;
}

export default function ExecutiveOverview({
  totalUsers,
  totalLocations,
  totalDevices,
  onlineDevices,
}: ExecutiveOverviewProps) {
  const fleetPercentage = totalDevices > 0 
    ? Math.round((onlineDevices / totalDevices) * 100) 
    : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      
      {/* Executive User Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-[#9CA3AF] uppercase tracking-wider">Registered Population</p>
            <h3 className="font-display font-light text-3xl text-[#111827]">{totalUsers}</h3>
          </div>
          <div className="p-2.5 bg-[#0F7AF3]/5 rounded-xl border border-[#0F7AF3]/10 text-[#0F7AF3]">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[10px] text-[#6B7280]">
          <span className="font-mono">ACTIVE INDICES</span>
          <span className="font-mono text-[#16A085] font-semibold">+12% THIS MONTH</span>
        </div>
      </motion.div>

      {/* Executive Location Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-[#9CA3AF] uppercase tracking-wider">Network Infrastructure</p>
            <h3 className="font-display font-light text-3xl text-[#111827]">{totalLocations}</h3>
          </div>
          <div className="p-2.5 bg-[#0F7AF3]/5 rounded-xl border border-[#0F7AF3]/10 text-[#0F7AF3]">
            <Globe className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[10px] text-[#6B7280]">
          <span className="font-mono">CLINICAL NODES</span>
          <span className="font-mono font-medium text-[#111827]">GLOBAL DISTRIBUTION</span>
        </div>
      </motion.div>

      {/* Executive Device Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-[#9CA3AF] uppercase tracking-wider">Telemetry Fleet</p>
            <h3 className="font-display font-light text-3xl text-[#111827]">{totalDevices}</h3>
          </div>
          <div className="p-2.5 bg-[#0F7AF3]/5 rounded-xl border border-[#0F7AF3]/10 text-[#0F7AF3]">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[10px] text-[#6B7280]">
          <span className="font-mono">SYNCED DEVS</span>
          <span className="font-mono text-[#16A085] font-semibold">{onlineDevices} OPERATIONAL</span>
        </div>
      </motion.div>

      {/* Executive System Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-[#9CA3AF] uppercase tracking-wider">System Integrity</p>
            <h3 className="font-display font-light text-3xl text-[#111827]">{fleetPercentage}%</h3>
          </div>
          <div className="p-2.5 bg-[#16A085]/5 rounded-xl border border-[#16A085]/10 text-[#16A085]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[10px] text-[#6B7280]">
          <span className="font-mono">SECURE INGEST</span>
          <span className="font-mono font-medium text-[#16A085]">BASELINE PASS</span>
        </div>
      </motion.div>

    </div>
  );
}
