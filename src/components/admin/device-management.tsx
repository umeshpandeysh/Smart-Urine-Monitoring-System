'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCw, Compass } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import type { Device, Location } from '@/types';

interface DeviceManagementProps {
  devices: Device[];
  locations: Location[];
}

export default function DeviceManagement({ devices, locations }: DeviceManagementProps) {
  const [filter, setFilter] = useState<'all' | 'online' | 'maintenance' | 'offline' | 'error'>('all');

  const filteredDevices = devices.filter((d) => {
    return filter === 'all' || d.status === filter;
  });

  const getStatusConfig = (status: string) => {
    return {
      online: { dot: 'bg-[#16A085]', label: 'Online', text: 'text-[#16A085]' },
      maintenance: { dot: 'bg-[#D97706]', label: 'Maintenance', text: 'text-[#D97706]' },
      offline: { dot: 'bg-[#9CA3AF]', label: 'Offline', text: 'text-[#6B7280]' },
      error: { dot: 'bg-[#C0392B] animate-pulse', label: 'Fault State', text: 'text-[#C0392B]' },
    }[status] || { dot: 'bg-[#9CA3AF]', label: 'Offline', text: 'text-[#6B7280]' };
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] select-none space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB]/60 pb-5">
        <div>
          <h3 className="font-display font-medium text-lg text-[#111827] tracking-tight">
            Device Asset Management
          </h3>
          <p className="text-xs text-[#6B7280] font-light mt-0.5">
            Trace device asset tags, firmware version controls, and spatial connection baselines.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'online', 'maintenance', 'offline', 'error'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono capitalize transition-all duration-200 shrink-0 ${
                filter === s
                  ? 'bg-[#111827] border-[#111827] text-white'
                  : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#9CA3AF]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <AnimatePresence mode="popLayout">
          {filteredDevices.map((d, idx) => {
            const status = getStatusConfig(d.status);
            const loc = locations.find((l) => l.id === d.location_id);
            const battery = d.battery_level ?? 0;

            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#0F7AF3]/30 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between space-y-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-all duration-200"
              >
                
                {/* Device Details */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[9px] text-[#9CA3AF] uppercase">Hardware Model</span>
                      <h4 className="font-display font-medium text-sm text-[#111827] tracking-tight">
                        {d.model || 'UroSense Terminal V2'}
                      </h4>
                      <p className="text-[10px] text-[#6B7280] font-light">
                        {loc?.name || 'Unmapped Location'}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase px-2 py-0.5 rounded border border-transparent ${
                      d.status === 'online' ? 'bg-[#16A085]/5 text-[#16A085]' : d.status === 'error' ? 'bg-[#C0392B]/5 text-[#C0392B]' : 'bg-gray-50 text-[#6B7280]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-[#6B7280] font-mono">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>TAG: US-{d.id.substring(0, 5).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>FW: v{d.firmware_version || '2.0.4'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="border-t border-[#E5E7EB]/60 pt-4 flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>
                      {d.last_seen_at ? `${formatRelativeTime(d.last_seen_at)}` : 'Never Synced'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span>BATTERY: {battery}%</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredDevices.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3 border border-dashed border-[#E5E7EB] rounded-2xl">
            <p className="text-3xl">📡</p>
            <h4 className="font-display font-medium text-base text-[#111827]">
              No devices found
            </h4>
            <p className="text-xs text-[#6B7280] font-light max-w-xs mx-auto">
              No deployed hardware nodes match this filter state.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
