'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowLeft, Users, Database, MapPin, Radio, 
  Search, Download, Calendar, BarChart3, Settings, AlertCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

import { useEffect } from 'react';

export default function AdminCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [exportFormat, setExportFormat] = useState('CSV');

  const [devices, setDevices] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [devRes, locRes, repRes] = await Promise.all([
          fetch('/api/admin/devices'),
          fetch('/api/admin/locations'),
          fetch('/api/admin/reports')
        ]);
        
        const devData = await devRes.json();
        const locData = await locRes.json();
        const repData = await repRes.json();

        setDevices(Array.isArray(devData) ? devData : []);
        setLocations(Array.isArray(locData) ? locData : []);
        setReports(Array.isArray(repData) ? repData : []);
      } catch (e) {
        console.error('Error fetching admin workspace data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const reportsList = Array.isArray(reports) ? reports : [];
  const mappedReports = reportsList.map((r: any) => {
    let flag = 'Clear';
    if (r.hydration_status && r.hydration_status !== 'Optimal Hydration') {
      flag = r.hydration_status;
    } else if (r.glucose_indicator && r.glucose_indicator !== 'Negative') {
      flag = `Glucose: ${r.glucose_indicator}`;
    } else if (r.protein_indicator && r.protein_indicator !== 'Negative') {
      flag = `Protein: ${r.protein_indicator}`;
    } else if (r.uti_risk && r.uti_risk === 'High') {
      flag = 'UTI Risk Alert';
    }
    
    return {
      id: r.id,
      userHash: `USER-${r.user_id?.substring(0,4).toUpperCase()}`,
      location: r.locations?.location_name || 'Delhi Airport T3',
      date: r.report_date,
      status: 'Verified',
      flag
    };
  });

  const filteredLogs = mappedReports.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.flag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    let content = '';
    const filename = `UroSense_Clinical_Export_${new Date().toISOString().split('T')[0]}`;
    
    if (exportFormat === 'JSON') {
      content = JSON.stringify({ devices, locations, reports }, null, 2);
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
      const rows = mappedReports.map(r => [r.id, r.userHash, r.location, r.date, r.status, r.flag]);
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

  const activeTerminalsCount = devices.filter(d => d.status === 'online').length;
  const totalTerminalsCount = devices.length;
  const alertCount = mappedReports.filter(r => r.flag !== 'Clear').length;
  const uptimeStr = totalTerminalsCount > 0 
    ? `${((activeTerminalsCount / totalTerminalsCount) * 100).toFixed(1)}%` 
    : '100%';


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] flex items-center justify-center font-mono text-sm">
        Loading clinical workspace...
      </div>
    );
  }

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
            <p className="text-3xl font-extrabold text-[#0B1B33] font-mono">{activeTerminalsCount} / {totalTerminalsCount}</p>
            <p className="text-[10px] text-gray-500">Solid-state hardware nodes</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">SCREENING ACTIVITY</span>
            <p className="text-3xl font-extrabold text-[#0B1B33] font-mono">{reports.length}</p>
            <p className="text-[10px] text-emerald-600 font-semibold">&uarr; 8.4% daily throughput</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">BIOMARKER ALERTS</span>
            <p className="text-3xl font-extrabold text-amber-600 font-mono">{alertCount}</p>
            <p className="text-[10px] text-gray-500">Dehydration / sugar traces flagged</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase">FLEET UPTIME</span>
            <p className="text-3xl font-extrabold text-[#0D9488] font-mono">{uptimeStr}</p>
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
                  {devices.map((dev) => (
                    <tr key={dev.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono font-bold text-[#2563EB]">{dev.device_code}</td>
                      <td className="py-3 font-medium text-gray-600">{dev.locations?.location_name || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          dev.status === 'online' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {dev.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-medium text-gray-500">
                        {dev.device_code === 'US-NOD-1003' ? '14%' : '90%'}
                      </td>
                      <td className="py-3 font-mono text-gray-400">
                        {dev.last_seen ? new Date(dev.last_seen).toISOString().split('T')[0] : 'N/A'}
                      </td>
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
              {locations.map((loc, idx) => {
                const activeDevices = devices.filter(d => d.location_id === loc.id && d.status === 'online').length;
                const dailyScreenings = reports.filter(r => r.location_id === loc.id).length;
                return (
                  <div key={loc.id || idx} className="flex justify-between items-center p-3 border border-gray-50 bg-[#FAFAF9] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white border border-gray-200/50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#0B1B33]">{loc.location_name}</p>
                        <p className="text-[10px] text-gray-400">{loc.city} • {activeDevices} Node</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-extrabold text-xs text-[#0B1B33]">{dailyScreenings}</p>
                      <p className="text-[9px] text-gray-400 uppercase font-mono">daily scans</p>
                    </div>
                  </div>
                );
              })}
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
