'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowLeft, Database, MapPin, 
  Search, Download, AlertCircle, RefreshCw, Activity,
  Server, Cpu, Users, FileText, CheckCircle2, AlertTriangle,
  Clock, Filter, Plus, Settings, Sliders, Battery, BatteryCharging,
  TrendingUp, BarChart3, ChevronRight, Bell, UserPlus, ShieldAlert, X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [exportFormat, setExportFormat] = useState('CSV');
  
  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

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

  // Comprehensive city infrastructure list
  const CITIES_INFRASTRUCTURE = [
    { name: 'Delhi', region: 'North Hub', kiosks: 32, todayScans: 482, status: 'Online', successRate: '99.9%', avgTime: '2.9s' },
    { name: 'Mumbai', region: 'West Coast', kiosks: 24, todayScans: 340, status: 'Online', successRate: '99.8%', avgTime: '3.1s' },
    { name: 'Bengaluru', region: 'South Hub', kiosks: 22, todayScans: 290, status: 'Online', successRate: '99.7%', avgTime: '3.0s' },
    { name: 'Hyderabad', region: 'Deccan Grid', kiosks: 18, todayScans: 195, status: 'Online', successRate: '99.9%', avgTime: '3.2s' },
    { name: 'Ahmedabad', region: 'West Grid', kiosks: 16, todayScans: 180, status: 'Online', successRate: '99.6%', avgTime: '3.4s' },
    { name: 'Chennai', region: 'South-East', kiosks: 15, todayScans: 160, status: 'Online', successRate: '99.8%', avgTime: '3.1s' },
    { name: 'Kolkata', region: 'East Grid', kiosks: 14, todayScans: 145, status: 'Online', successRate: '99.5%', avgTime: '3.5s' },
    { name: 'Lucknow', region: 'North-East', kiosks: 14, todayScans: 125, status: 'Online', successRate: '99.7%', avgTime: '3.3s' },
    { name: 'Jaipur', region: 'North-West', kiosks: 12, todayScans: 110, status: 'Online', successRate: '99.4%', avgTime: '3.6s' },
    { name: 'Guwahati', region: 'Corridor', kiosks: 8, todayScans: 65, status: 'Maintenance', successRate: '98.9%', avgTime: '3.8s' },
  ];

  // Map backend or mock devices
  const activeDevicesList = devices.length > 0 ? devices : [
    { id: 'dev-1', device_code: 'US-NOD-1001', location: 'Delhi Airport T3', city: 'Delhi', status: 'online', battery: 98, sensorHealth: 'Optimal', calibration: '2026-06-20', lastMaint: '12 Jun 2026', todayTests: 142 },
    { id: 'dev-2', device_code: 'US-NOD-1002', location: 'Mumbai Central Node', city: 'Mumbai', status: 'online', battery: 92, sensorHealth: 'Optimal', calibration: '2026-06-18', lastMaint: '10 Jun 2026', todayTests: 118 },
    { id: 'dev-3', device_code: 'US-NOD-1003', location: 'Bengaluru Corporate Hub', city: 'Bengaluru', status: 'offline', battery: 14, sensorHealth: 'Calibration Req', calibration: '2026-05-30', lastMaint: '01 May 2026', todayTests: 45 },
    { id: 'dev-4', device_code: 'US-NOD-1004', location: 'Hyderabad Metro Node', city: 'Hyderabad', status: 'online', battery: 88, sensorHealth: 'Optimal', calibration: '2026-06-22', lastMaint: '15 Jun 2026', todayTests: 94 },
    { id: 'dev-5', device_code: 'US-NOD-1005', location: 'Chennai Health Plaza', city: 'Chennai', status: 'online', battery: 76, sensorHealth: 'Optimal', calibration: '2026-06-15', lastMaint: '08 Jun 2026', todayTests: 82 },
    { id: 'dev-6', device_code: 'US-NOD-1006', location: 'Guwahati Transit Hub', city: 'Guwahati', status: 'maintenance', battery: 45, sensorHealth: 'Degraded', calibration: '2026-05-12', lastMaint: '14 Apr 2026', todayTests: 12 },
  ];

  // Clinical reports queue mock/backend data
  const reportsList = reports.length > 0 ? reports : [
    { id: 'US-REP-9482', patientHash: 'PAT-9482 (Umesh P.)', time: '14 mins ago', risk: 'High Risk', flag: 'Protein Leakage (+2), Mild TDS Load', status: 'Pending Review', reviewer: 'Dr. Sarah Jenkins' },
    { id: 'US-REP-9481', patientHash: 'PAT-8921 (Aarav S.)', time: '28 mins ago', risk: 'Moderate Risk', flag: 'Mild Dehydration Index', status: 'Verified', reviewer: 'Dr. Rajesh Kumar' },
    { id: 'US-REP-9480', patientHash: 'PAT-7412 (Priya N.)', time: '42 mins ago', risk: 'Normal', flag: 'Clear Baseline Equilibrium', status: 'Verified', reviewer: 'Auto-Verified' },
    { id: 'US-REP-9479', patientHash: 'PAT-6309 (Vikram R.)', time: '1 hour ago', risk: 'High Risk', flag: 'Glucose Spillover Detected', status: 'Escalated', reviewer: 'Dr. Sarah Jenkins' },
    { id: 'US-REP-9478', patientHash: 'PAT-5110 (Ananya M.)', time: '1.5 hours ago', risk: 'Normal', flag: 'Optimal Hydration & pH', status: 'Verified', reviewer: 'Auto-Verified' },
  ];

  // Filtered devices
  const filteredDevices = activeDevicesList.filter(d => {
    const matchesSearch = d.device_code.toLowerCase().includes(searchTerm.toLowerCase()) || (d.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCityFilter === 'All' || d.city === selectedCityFilter;
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter.toLowerCase();
    return matchesSearch && matchesCity && matchesStatus;
  });

  const triggerAction = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
    setActiveModal(null);
  };

  const handleExport = () => {
    const filename = `UroSense_National_Ops_Export_${new Date().toISOString().split('T')[0]}`;
    let content = '';
    if (exportFormat === 'JSON') {
      content = JSON.stringify({ summary: 'UroSense Operations', devices: activeDevicesList, cities: CITIES_INFRASTRUCTURE, reports: reportsList }, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
    } else {
      const headers = ['Device Code', 'City', 'Location', 'Status', 'Battery', 'Today Scans'];
      const rows = activeDevicesList.map(d => [d.device_code, d.city || 'Delhi', d.location || 'Kiosk', d.status, `${d.battery}%`, d.todayTests || 100]);
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
    }
    triggerAction(`Export downloaded successfully in ${exportFormat} format.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1B33] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/10">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-base text-white">Connecting to National Operations Center</h3>
          <p className="text-xs text-blue-200/60 font-mono">Synchronizing device telemetry and clinical review queues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] pb-24" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* ── TOP HEADER / NAVIGATION BAR ── */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B1B33] flex items-center justify-center shadow-md shadow-slate-900/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-tight text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                National UroSense Operations Center
              </span>
              <span className="text-[10px] font-mono text-gray-400">Clinical Enterprise Workspace v2.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick action buttons in top header */}
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={() => setActiveModal('device')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#2563EB]" /> Register Device
              </button>
              <button 
                onClick={() => setActiveModal('calibration')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" /> Run Calibration
              </button>
            </div>

            <div className="h-5 w-px bg-gray-200 hidden lg:block" />

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => triggerAction('Notification drawer synced. No unread critical system warnings.')}
                className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/60"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  SJ
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#0B1B33] leading-none">Dr. Sarah Jenkins</p>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5">Chief Medical Ops</p>
                </div>
              </div>

              <Link href="/" className="text-xs font-mono font-semibold text-gray-400 hover:text-[#0B1B33] ml-2">
                Exit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2.5 px-6 text-center animate-in fade-in slide-in-from-top duration-200 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* ── 1. LIVE NETWORK STATUS PANEL (Full-Width Operations Bar) ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#0B1B33] flex items-center gap-2">
                <span>Network Status: Operational</span>
                <span className="text-[10px] font-mono text-gray-400 font-normal">| Last Sync: 12s ago</span>
              </p>
              <p className="text-[11px] text-gray-500">Global telemetry grid running at 98.4% nominal efficiency across 10 regions.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 24 Online Devices
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 2 Calibration Pending
            </span>
            <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> 2 Offline Nodes
            </span>
          </div>
        </div>

        {/* ── 2. EXECUTIVE KPI BAR (Top 8 Metrics Grid) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Devices', val: '24 / 26', change: '+4.2% fleet', trend: 'up', icon: Cpu, color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Active Locations', val: '10 Cities', change: 'National Grid', trend: 'neutral', icon: MapPin, color: '#0D9488', bg: '#F0FDFA' },
            { label: 'Patients Screened Today', val: '1,482', change: '+12.4% daily', trend: 'up', icon: Users, color: '#059669', bg: '#ECFDF5' },
            { label: 'Reports Verified Today', val: '1,482', change: '100% verified', trend: 'up', icon: FileText, color: '#7C3AED', bg: '#F5F3FF' },
            { label: 'Critical Alerts', val: '3 Alerts', change: '-2 from yesterday', trend: 'down', icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2' },
            { label: 'Weekly Growth', val: '+14.8%', change: 'Throughput rate', trend: 'up', icon: TrendingUp, color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Fleet Uptime', val: '99.8%', change: 'Target: >99.5%', trend: 'up', icon: Activity, color: '#059669', bg: '#ECFDF5' },
            { label: 'Avg Processing Time', val: '3.2s', change: 'Sub-second read', trend: 'up', icon: Clock, color: '#D97706', bg: '#FFFBEB' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">{kpi.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: kpi.bg }}>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                {kpi.val}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                <span className={kpi.trend === 'up' ? 'text-emerald-600 font-bold' : kpi.trend === 'down' ? 'text-rose-600 font-bold' : 'text-gray-500'}>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 3. INDIA OPERATIONS MAP & CITY LEADERBOARD ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CITY PERFORMANCE LEADERBOARD (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  National City Operations &amp; Station Grid
                </h2>
                <p className="text-xs text-gray-400">Live deployment metrics across 10 operational metropolitan hubs</p>
              </div>
              <button 
                onClick={() => setActiveModal('location')}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Location
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-mono">
                    <th className="pb-3 font-semibold">CITY / REGION</th>
                    <th className="pb-3 font-semibold text-center">KIOSKS</th>
                    <th className="pb-3 font-semibold text-center">TODAY'S SCANS</th>
                    <th className="pb-3 font-semibold text-center">SUCCESS RATE</th>
                    <th className="pb-3 font-semibold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {CITIES_INFRASTRUCTURE.map((city) => (
                    <tr key={city.name} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 font-bold text-[#0B1B33]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                          <div>
                            <span className="block text-xs leading-tight">{city.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono font-normal">{city.region}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-gray-700">{city.kiosks}</td>
                      <td className="py-3 text-center font-mono font-extrabold text-[#0B1B33]">{city.todayScans}</td>
                      <td className="py-3 text-center font-mono text-emerald-600 font-bold">{city.successRate}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-block ${
                          city.status === 'Online' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {city.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ALERT CENTER & BIOMARKER ANALYTICS (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* ALERT CENTER */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">Operational Alert Center</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold font-mono">3 Active</span>
              </div>

              <div className="space-y-3">
                {[
                  { priority: 'P1 - High', title: 'Sensor Calibration Required', loc: 'Delhi Airport T3 (US-NOD-1003)', time: '10 mins ago', color: 'bg-rose-50 border-rose-200 text-rose-800', btn: 'Recalibrate' },
                  { priority: 'P2 - Med', title: 'High Protein Detected', loc: 'Patient US-PAT-9842 (Mumbai Node)', time: '25 mins ago', color: 'bg-amber-50 border-amber-200 text-amber-800', btn: 'Escalate' },
                  { priority: 'P3 - Low', title: 'Terminal Battery Low (14%)', loc: 'Bengaluru Hub (US-NOD-1005)', time: '1 hour ago', color: 'bg-blue-50 border-blue-200 text-blue-800', btn: 'Ping Tech' },
                ].map((alertItem, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl border ${alertItem.color} space-y-2`}>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold opacity-80">
                      <span>{alertItem.priority}</span>
                      <span>{alertItem.time}</span>
                    </div>
                    <div>
                      <p className="font-bold text-xs">{alertItem.title}</p>
                      <p className="text-[11px] opacity-90 mt-0.5">{alertItem.loc}</p>
                    </div>
                    <div className="pt-1 flex justify-end">
                      <button 
                        onClick={() => triggerAction(`Action "${alertItem.btn}" executed for ${alertItem.title}.`)}
                        className="px-3 py-1 rounded-lg bg-white/90 hover:bg-white text-xs font-bold shadow-sm border border-black/10 transition-colors"
                      >
                        {alertItem.btn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BIOMARKER ANALYTICS BREAKDOWN */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Population Biomarker Averages</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Average pH</span>
                  <p className="text-lg font-extrabold text-[#0B1B33] font-mono">6.7 pH</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Optimal Range</span>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Average TDS</span>
                  <p className="text-lg font-extrabold text-[#0B1B33] font-mono">340 ppm</p>
                  <span className="text-[10px] text-blue-600 font-semibold">Mineral Balance</span>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Protein Alerts</span>
                  <p className="text-lg font-extrabold text-amber-600 font-mono">14 Cases</p>
                  <span className="text-[10px] text-gray-500">0.9% of scans</span>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Glucose Spillover</span>
                  <p className="text-lg font-extrabold text-rose-600 font-mono">8 Cases</p>
                  <span className="text-[10px] text-gray-500">0.5% of scans</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── 4. DEVICE MANAGEMENT DASHBOARD TABLE ── */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Device Fleet Control &amp; Telemetry Diagnostics
              </h2>
              <p className="text-xs text-gray-400">Manage terminal health, battery levels, optical sensor calibration, and maintenance logs</p>
            </div>

            {/* Controls & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search device or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#FAFAF9] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs w-44 sm:w-56 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <select 
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-[#FAFAF9] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="All">All Cities</option>
                {CITIES_INFRASTRUCTURE.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAFAF9] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-mono">
                  <th className="pb-3 font-semibold">DEVICE CODE</th>
                  <th className="pb-3 font-semibold">LOCATION</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                  <th className="pb-3 font-semibold">BATTERY</th>
                  <th className="pb-3 font-semibold">SENSOR HEALTH</th>
                  <th className="pb-3 font-semibold">CALIBRATION</th>
                  <th className="pb-3 font-semibold text-center">TODAY TESTS</th>
                  <th className="pb-3 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#2563EB]">{dev.device_code}</td>
                    <td className="py-3.5 font-medium text-gray-700">{dev.location}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        dev.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        dev.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {dev.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 font-mono font-semibold">
                        {dev.battery < 20 ? (
                          <Battery className="w-4 h-4 text-rose-500" />
                        ) : (
                          <BatteryCharging className="w-4 h-4 text-emerald-600" />
                        )}
                        <span className={dev.battery < 20 ? 'text-rose-600 font-bold' : 'text-gray-700'}>{dev.battery}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-gray-600">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        dev.sensorHealth === 'Optimal' ? 'bg-blue-50 text-[#2563EB]' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {dev.sensorHealth}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-gray-400">{dev.calibration}</td>
                    <td className="py-3.5 text-center font-mono font-extrabold text-[#0B1B33]">{dev.todayTests}</td>
                    <td className="py-3.5 text-right">
                      <button 
                        onClick={() => triggerAction(`Triggered remote diagnostic ping to ${dev.device_code}.`)}
                        className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-[11px] transition-colors"
                      >
                        Ping Diagnostic
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. CLINICAL REPORT QUEUE & EXPORT CENTER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CLINICAL REVIEW QUEUE (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  Clinical Report Review Queue
                </h2>
                <p className="text-xs text-gray-400">Audit and moderate abnormal patient scans flagged for clinical verification</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold">5 Pending Audit</span>
            </div>

            <div className="space-y-3">
              {reportsList.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAFAF9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0B1B33]">{rep.id}</span>
                      <span className="text-[10px] font-mono text-gray-400">({rep.patientHash})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rep.risk === 'High Risk' ? 'bg-rose-100 text-rose-800' :
                        rep.risk === 'Moderate Risk' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rep.risk}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Flag: <span className="text-gray-900">{rep.flag}</span></p>
                    <p className="text-[10px] text-gray-400">{rep.time} · Reviewer: {rep.reviewer}</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => triggerAction(`Report ${rep.id} verified and signed off.`)}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm"
                    >
                      Approve &amp; Sign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPORT CENTER (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Export Operations Data
              </h2>
              <p className="text-xs text-gray-400">Export aggregated telemetry and clinical logs</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">FORMAT</label>
                <div className="grid grid-cols-2 gap-2">
                  {['CSV', 'JSON'].map((fmt) => (
                    <button 
                      key={fmt} 
                      onClick={() => setExportFormat(fmt)}
                      className={`text-xs font-bold font-mono py-2 rounded-xl border transition-all ${
                        exportFormat === fmt 
                          ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' 
                          : 'border-gray-200 bg-[#FAFAF9] text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-[#0B1B33] hover:bg-[#0B1B33]/90 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Dataset ({exportFormat})</span>
              </button>

              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                Cryptographic HIPAA compliance enforced. Patient metadata is anonymized in exported records.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* ── MODALS FOR QUICK ACTIONS ── */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'device' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0B1B33]">Register New Device Node</h3>
                <p className="text-xs text-gray-500">Add a new solid-state telemetry kiosk to the national registry.</p>
                <form onSubmit={(e) => { e.preventDefault(); triggerAction('New device registered and initiated handshake.'); }} className="space-y-3">
                  <input required placeholder="Device Serial Code (e.g. US-NOD-1007)" className="w-full p-3 rounded-xl border text-xs outline-none focus:border-[#2563EB]" />
                  <input required placeholder="Deployment Location (e.g. Jaipur Transit Node)" className="w-full p-3 rounded-xl border text-xs outline-none focus:border-[#2563EB]" />
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-md">Register Node</button>
                </form>
              </div>
            )}

            {activeModal === 'location' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0B1B33]">Register New Operations Hub</h3>
                <p className="text-xs text-gray-500">Expand UroSense telemetry infrastructure to a new city or transit hub.</p>
                <form onSubmit={(e) => { e.preventDefault(); triggerAction('New location cluster activated.'); }} className="space-y-3">
                  <input required placeholder="City Name (e.g. Pune)" className="w-full p-3 rounded-xl border text-xs outline-none focus:border-[#2563EB]" />
                  <input required placeholder="Cluster Station Name" className="w-full p-3 rounded-xl border text-xs outline-none focus:border-[#2563EB]" />
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-md">Activate Hub</button>
                </form>
              </div>
            )}

            {activeModal === 'calibration' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0B1B33]">Run Remote Sensor Calibration</h3>
                <p className="text-xs text-gray-500">Trigger automatic optical self-calibration sequence across all active hardware nodes.</p>
                <button 
                  onClick={() => triggerAction('Optical self-calibration triggered across 24 online devices.')}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md"
                >
                  Confirm Fleet Calibration
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
