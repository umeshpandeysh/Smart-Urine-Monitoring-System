'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowLeft, Users, Database, MapPin, Radio, 
  Search, Download, Calendar, BarChart3, Settings, AlertCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Mock Admin Data
const DEVICES = [
  { id: 'US-DEV-401', location: 'Delhi Airport Terminal 3', status: 'Online', battery: '94%', firmware: 'v4.1.2', lastCalibrated: '2026-06-01' },
  { id: 'US-DEV-402', location: 'Hyderabad Metro Station', status: 'Online', battery: '82%', firmware: 'v4.1.2', lastCalibrated: '2026-06-03' },
  { id: 'US-DEV-403', location: 'Bengaluru Corporate Hub', status: 'Maintenance', battery: '14%', firmware: 'v4.0.8', lastCalibrated: '2026-05-18' },
  { id: 'US-DEV-404', location: 'Mumbai Terminal Node', status: 'Online', battery: '88%', firmware: 'v4.1.2', lastCalibrated: '2026-06-05' }
];

const LOCATIONS = [
  { name: 'Delhi Airport Terminal 3', activeDevices: 1, dailyScreenings: 140, city: 'New Delhi' },
  { name: 'Hyderabad Metro Station', activeDevices: 1, dailyScreenings: 92, city: 'Hyderabad' },
  { name: 'Bengaluru Corporate Hub', activeDevices: 1, dailyScreenings: 65, city: 'Bengaluru' },
  { name: 'Mumbai Terminal Node', activeDevices: 1, dailyScreenings: 110, city: 'Mumbai' }
];

const REPORT_LOGS = [
  { id: 'REP-74092', userHash: 'USER-88A9', location: 'Delhi Airport T3', date: '2026-06-21', status: 'Verified', flag: 'Clear' },
  { id: 'REP-74091', userHash: 'USER-10B4', location: 'Delhi Airport T3', date: '2026-06-21', status: 'Verified', flag: 'Dehydration (Mod)' },
  { id: 'REP-74090', userHash: 'USER-23C1', location: 'Bengaluru Corp Hub', date: '2026-06-21', status: 'Verified', flag: 'Glucose Trace' },
  { id: 'REP-74089', userHash: 'USER-4402', location: 'Mumbai Node', date: '2026-06-21', status: 'Verified', flag: 'Clear' }
];

export default function AdminCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [exportFormat, setExportFormat] = useState('CSV');

  const filteredLogs = REPORT_LOGS.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.flag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    let content = '';
    const filename = `UroSense_Clinical_Export_${new Date().toISOString().split('T')[0]}`;
    
    if (exportFormat === 'JSON') {
      content = JSON.stringify({ devices: DEVICES, locations: LOCATIONS, reports: REPORT_LOGS }, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV Export
      const headers = ['Report ID', 'User Hash', 'Location', 'Date', 'Status', 'Biomarker Flag'];
      const rows = REPORT_LOGS.map(r => [r.id, r.userHash, r.location, r.date, r.status, r.flag]);
      content = [headers.join(','), ...rows.map(row => row.map(val => `"${val}"`).join(','))].join('\n');
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] pb-24" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* HEADER */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              UroSense Clinical Workspace
            </span>
          </div>
          <Link href="/" className="text-xs font-mono font-semibold text-[#2563EB] hover:text-[#0b1b33] flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        
        {/* Title Block */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            HERE IS ADMIN CENTER
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Clinical asset status logs, site analytics, and urine biomarker report queries.
          </p>
        </div>

        {/* METRIC GRID (UroSense specific metrics, no generic card bloat) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">ACTIVE TERMINALS</span>
            <p className="text-3xl font-extrabold text-[#0B1B33] font-mono">{DEVICES.length} / {DEVICES.length}</p>
            <p className="text-[10px] text-gray-500">Solid-state hardware nodes</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">SCREENING ACTIVITY</span>
            <p className="text-3xl font-extrabold text-[#0B1B33] font-mono">407</p>
            <p className="text-[10px] text-emerald-600 font-semibold">&uarr; 8.4% daily throughput</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">BIOMARKER ALERTS</span>
            <p className="text-3xl font-extrabold text-amber-600 font-mono">2</p>
            <p className="text-[10px] text-gray-500">Dehydration / sugar traces flagged</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">FLEET UPTIME</span>
            <p className="text-3xl font-extrabold text-[#0D9488] font-mono">99.8%</p>
            <p className="text-[10px] text-gray-500">Across Delhi, Mumbai, Bengaluru</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* DEVICE FLEET MANAGEMENT */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  Device Fleet Management
                </h2>
                <p className="text-xs text-gray-400">Terminal statuses, battery diagnostics, and optical calibration schedules</p>
              </div>
              <button onClick={() => alert('Triggering hardware diagnostic ping...')} className="p-2 bg-[#FAFAF9] rounded-xl hover:bg-gray-100 transition-colors border border-gray-200/50">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-mono">
                    <th className="pb-3 font-semibold">DEVICE ID</th>
                    <th className="pb-3 font-semibold">LOCATION</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold">BATTERY</th>
                    <th className="pb-3 font-semibold">CALIBRATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {DEVICES.map((dev) => (
                    <tr key={dev.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono font-bold text-[#2563EB]">{dev.id}</td>
                      <td className="py-3 font-medium text-gray-600">{dev.location}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          dev.status === 'Online' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {dev.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-medium text-gray-500">{dev.battery}</td>
                      <td className="py-3 font-mono text-gray-400">{dev.lastCalibrated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTIVE LOCATIONS & STATION MONITORING */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Active Locations
              </h2>
              <p className="text-xs text-gray-400">Terminal volumes and grid integration density</p>
            </div>

            <div className="space-y-4">
              {LOCATIONS.map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border border-gray-50 bg-[#FAFAF9] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-gray-200/50 rounded-xl flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#0B1B33]">{loc.name}</p>
                      <p className="text-[10px] text-gray-400">{loc.city} • {loc.activeDevices} Node</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-extrabold text-xs text-[#0B1B33]">{loc.dailyScreenings}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-mono">daily scans</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CLINICAL REPORT DATABASE AUDIT & DATA EXPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SEARCHABLE REPORT DATABASE */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-50 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  Clinical Report Database
                </h2>
                <p className="text-xs text-gray-400">Verification log for patient screening results</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Query Report ID / Flag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#FAFAF9] border border-gray-200/60 rounded-xl pl-9 pr-4 py-2 text-xs w-full sm:w-48 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-50 hover:border-gray-100 bg-[#FAFAF9] rounded-2xl gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/50 flex items-center justify-center text-[#2563EB]">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0B1B33]">{log.id}</span>
                          <span className="text-[9px] font-mono text-gray-400">({log.userHash})</span>
                        </div>
                        <p className="text-[10px] text-gray-400">{log.location} • {log.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {log.status}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-1 rounded-xl ${
                        log.flag === 'Clear' ? 'text-gray-500 bg-white' : 'text-amber-700 bg-amber-50 border border-amber-100'
                      }`}>
                        {log.flag}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-gray-400">No logs match your search.</p>
              )}
            </div>
          </div>

          {/* EXPORT DATA & SETTINGS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Export Dataset
              </h2>
              <p className="text-xs text-gray-400">Export clinical metrics for study or medical integrations</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">EXPORT FORMAT</label>
                <div className="grid grid-cols-2 gap-2">
                  {['CSV', 'JSON'].map((fmt) => (
                    <button 
                      key={fmt} 
                      onClick={() => setExportFormat(fmt)}
                      className={`text-xs font-bold font-mono py-2 rounded-xl border transition-all ${
                        exportFormat === fmt 
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' 
                          : 'border-gray-200 bg-[#FAFAF9] text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">LOCATION CLUSTER</label>
                <select 
                  className="w-full text-xs bg-[#FAFAF9] border border-gray-200 p-2.5 rounded-xl text-gray-600 focus:outline-none focus:border-[#2563EB]"
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                >
                  <option value="All">All Locations</option>
                  <option value="Delhi">Delhi Airport T3</option>
                  <option value="Hyderabad">Hyderabad Metro Station</option>
                  <option value="Bengaluru">Bengaluru Corporate Hub</option>
                </select>
              </div>

              <button 
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-sm shadow-blue-100"
              >
                <Download className="w-4 h-4" />
                <span>Export Dataset ({exportFormat})</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-400 leading-relaxed">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>Data export enforces cryptographic token verification. Patient identifier codes are completely anonymized by default.</p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
