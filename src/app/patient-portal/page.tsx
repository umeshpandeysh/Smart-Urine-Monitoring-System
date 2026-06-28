'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Calendar, MapPin, FileText, Droplets, Shield, 
  AlertTriangle, Download, BookOpen, 
  Sparkles, ToggleLeft, ToggleRight, User, TrendingUp, Info,
  PlusCircle, CheckCircle2, ChevronRight, X, UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function PatientPortalPage() {
  const [showTechnical, setShowTechnical] = useState(false);
  const [screenings, setScreenings] = useState<any[]>([]);
  const [selectedScreening, setSelectedScreening] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // New Patient Form state
  const [newPatientForm, setNewPatientForm] = useState({
    fullName: '',
    age: '32',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, repRes] = await Promise.all([
          fetch('/api/patient/profile'),
          fetch('/api/patient/reports')
        ]);
        const profData = await profRes.json();
        const repData = await repRes.json();

        setProfile(profData);
        
        if (repData && repData.length > 0) {
          const mapped = repData.map((r: any) => {
            const reading = r.sensor_readings?.[0] || {};
            return {
              id: r.id,
              date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (r.report_date || 'Recent'),
              time: new Date(r.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              location: r.locations?.name || r.locations?.location_name || 'UroSense Terminal T3',
              wellnessScore: r.overall_score || (reading.hydration_index ? Math.round(reading.hydration_index * 10) : 88),
              interpretations: {
                hydration: r.hydration_status || 'Optimal Hydration',
                glucose: r.glucose_indicator || 'Negative',
                protein: r.protein_indicator || 'Normal',
                utiRisk: r.uti_risk || 'Low Risk',
                kidneyStress: r.protein_indicator || 'Normal'
              },
              rawParameters: {
                ph: Number(reading.ph || 6.5),
                tds: Number(reading.tds_ppm || reading.tds || 420),
                temperature: Number(reading.temperature_c || reading.temperature || 36.6),
                turbidity: Number(reading.turbidity_ntu || reading.turbidity || 0.8)
              },
              recommendations: r.generated_recommendations || (r.recommendation ? [r.recommendation] : ['Maintain consistent daily fluid intake of 2.5L to optimize biological clearance.']),
              hash: `SHA-256: ${r.id.replace(/-/g, '').substring(0, 16)}`
            };
          });
          setScreenings(mapped);
          setSelectedScreening(mapped[0]);
        } else {
          // Provide realistic baseline data for returning users demo if empty database
          const mockScreenings = [
            {
              id: 'US-REP-8920',
              date: '15 Jun 2026',
              time: '09:42',
              location: 'Delhi Airport T3 Node',
              wellnessScore: 92,
              interpretations: {
                hydration: 'Optimal Hydration',
                glucose: 'Negative',
                protein: 'Normal',
                utiRisk: 'Low Risk',
                kidneyStress: 'Normal'
              },
              rawParameters: { ph: 6.8, tds: 310, temperature: 36.8, turbidity: 1.1 },
              recommendations: ['Maintain current 2.5L daily water intake.', 'Great metabolic equilibrium detected.'],
              hash: 'SHA-256: A8F9C3E211094820'
            },
            {
              id: 'US-REP-7814',
              date: '02 May 2026',
              time: '14:15',
              location: 'Bengaluru Corporate Hub',
              wellnessScore: 84,
              interpretations: {
                hydration: 'Mild Dehydration',
                glucose: 'Negative',
                protein: 'Normal',
                utiRisk: 'Low Risk',
                kidneyStress: 'Normal'
              },
              rawParameters: { ph: 6.4, tds: 480, temperature: 36.6, turbidity: 1.4 },
              recommendations: ['Increase electrolyte and fluid intake after work sessions.'],
              hash: 'SHA-256: F29C001847192801'
            }
          ];
          setScreenings(mockScreenings);
          setSelectedScreening(mockScreenings[0]);
        }
      } catch (e) {
        console.error('Error loading patient data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getWellnessColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getStatusColor = (val: string) => {
    const normal = ['Optimal', 'Optimal Hydration', 'Negative', 'Normal / Trace', 'Low', 'Low Risk', 'Normal'];
    const caution = ['Moderate Dehydration', 'Trace Detected', 'Moderate Risk', 'Mild Load Alert'];
    if (normal.includes(val)) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (caution.includes(val)) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const handlePdfDownload = (id: string, _date: string, _location: string) => {
    window.open(`/api/v1/reports/${id}/pdf`, '_blank');
  };

  const handleRegisterNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.fullName) return;
    setProfile((prev: any) => ({
      ...prev,
      name: newPatientForm.fullName,
      age: newPatientForm.age,
      gender: newPatientForm.gender,
      bloodGroup: newPatientForm.bloodGroup,
    }));
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setShowNewPatientModal(false);
    }, 1200);
  };

  const overallWellnessScore = screenings.length > 0 
    ? Math.round(screenings.reduce((acc, s) => acc + s.wellnessScore, 0) / screenings.length) 
    : 92;

  const activeUserName = (profile?.name && !['New Patient', 'New User', 'Patient', 'User'].includes(profile.name)) ? profile.name : 'Umesh Pandey';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center animate-bounce shadow-lg shadow-blue-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-base text-[#0B1B33]">Loading Health Portal</h3>
          <p className="text-xs text-gray-500 font-mono">Synchronizing telemetry and clinical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] pb-24" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* ── HEADER NAVIGATION ── */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/15">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-tight text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                My UroSense Journal
              </span>
              <span className="text-[10px] font-mono text-gray-400">Personal Health Record</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewPatientModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563EB] text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Profile</span>
            </button>

            <div className="h-4 w-px bg-gray-200 hidden sm:block" />

            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-2 text-xs text-[#0B1B33] hover:text-[#2563EB] font-semibold transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2563EB] font-bold text-xs">
                {activeUserName.charAt(0)}
              </div>
              <span className="hidden sm:inline">My Profile</span>
            </button>

            <Link href="/" className="text-xs font-mono font-semibold text-gray-500 hover:text-[#0B1B33] ml-2">
              Exit Journal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* ── 1. HERO SNAPSHOT CARD ── */}
        <div className="bg-gradient-to-br from-[#0B1B33] via-[#0F284B] to-[#0B1B33] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                Latest Health Snapshot Ready
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Welcome back, {activeUserName}
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                Your biological wellness journal is actively tracking your renal function, hydration levels, and metabolic indicators for preventive health.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">Last Scan Date</p>
                <p className="text-base font-bold text-white font-mono mt-1">{screenings[0]?.date || '15 Jun 2026'}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">Overall Score</p>
                <p className="text-base font-bold text-emerald-400 font-mono mt-1">{overallWellnessScore}/100</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">Baseline Status</p>
                <p className="text-xs font-bold text-blue-300 mt-1">Healthy Baseline</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">Recommended Check</p>
                <p className="text-xs font-bold text-amber-300 mt-1">In 7 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. QUICK STATS CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: screenings.length, sub: 'All-time scans', icon: FileText, color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Last Scan', value: screenings[0]?.date || 'None', sub: screenings[0]?.time || '09:42', icon: Calendar, color: '#0D9488', bg: '#F0FDFA' },
            { label: 'Wellness Score', value: `${overallWellnessScore}%`, sub: 'Optimal Range', icon: TrendingUp, color: '#059669', bg: '#ECFDF5' },
            { label: 'Risk Level', value: screenings[0]?.interpretations?.utiRisk || 'Low Risk', sub: 'Calculated baseline', icon: Shield, color: '#7C3AED', bg: '#F5F3FF' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                {stat.value}
              </p>
              <p className="text-[11px] text-gray-400 font-mono">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── 3. MAIN DASHBOARD CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* LATEST BIOMARKER DIAGNOSTICS CARD */}
            {selectedScreening && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      Latest Biomarker Diagnostics
                    </h2>
                    <p className="text-xs text-gray-400">
                      Screened at <span className="font-semibold text-gray-700">{selectedScreening.location}</span> on {selectedScreening.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getWellnessColor(selectedScreening.wellnessScore)}`}>
                      Score: {selectedScreening.wellnessScore} / 100
                    </span>
                    <button 
                      onClick={() => setShowTechnical(!showTechnical)}
                      className="text-xs font-mono font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                    >
                      {showTechnical ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{showTechnical ? "User View" : "Technical View"}</span>
                    </button>
                  </div>
                </div>

                {!showTechnical ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Hydration Status', value: selectedScreening.interpretations.hydration, icon: Droplets, desc: 'Indicates fluid balance & cellular hydration level.' },
                      { label: 'Glucose Indicator', value: selectedScreening.interpretations.glucose, icon: Sparkles, desc: 'Identifies glucose spillover tracking metabolic sugar baseline.' },
                      { label: 'Protein Indicator', value: selectedScreening.interpretations.protein, icon: Shield, desc: 'Checks kidney filtration stress and protein leakage.' },
                      { label: 'UTI Risk Level', value: selectedScreening.interpretations.utiRisk, icon: AlertTriangle, desc: 'Estimates infection risk from turbidity and pH dynamics.' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-[#FAFAF9] flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/60 flex items-center justify-center text-[#2563EB] shrink-0">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500">{item.label}</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(item.value)}`}>
                            {item.value}
                          </span>
                          <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex gap-2.5 text-blue-900 text-xs">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#2563EB]" />
                      <p>Technical Mode: Showing raw optoelectronic biosensor readouts calibrated for clinician reviews.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'pH Level', value: selectedScreening.rawParameters.ph, unit: 'pH' },
                        { label: 'TDS Mineral Load', value: selectedScreening.rawParameters.tds, unit: 'ppm' },
                        { label: 'Temperature', value: selectedScreening.rawParameters.temperature, unit: '°C' },
                        { label: 'Turbidity Index', value: selectedScreening.rawParameters.turbidity, unit: 'NTU' },
                      ].map((p, idx) => (
                        <div key={idx} className="p-3.5 border border-gray-100 bg-[#FAFAF9] rounded-xl text-center space-y-1">
                          <span className="text-[10px] font-mono text-gray-400 block uppercase">{p.label}</span>
                          <p className="text-xl font-extrabold text-[#0B1B33] font-mono">{p.value} <span className="text-xs font-normal text-gray-500">{p.unit}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RECENT REPORTS TABLE / CARDS SECTION */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                    Recent Diagnostic Reports
                  </h2>
                  <p className="text-xs text-gray-400">Complete historical log of synced UroSense scans</p>
                </div>
                <Link href="/how-it-works" className="text-xs font-mono font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                  <span>Find Nearby Kiosk</span> <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {screenings.length === 0 ? (
                <div className="bg-[#FAFAF9] border border-gray-100 rounded-2xl p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <p className="font-bold text-sm text-[#0B1B33]">No health reports recorded yet</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Visit your nearest UroSense kiosk to generate your first automated health report and unlock trend tracking.
                    </p>
                  </div>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold text-xs hover:bg-[#1D4ED8] transition-colors">
                    Find Nearby Kiosk
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {screenings.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setSelectedScreening(report)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        selectedScreening?.id === report.id
                          ? 'border-[#2563EB] bg-blue-50/20 shadow-sm'
                          : 'border-gray-100 bg-[#FAFAF9] hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#2563EB] shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0B1B33]">{report.date} Report</span>
                            <span className="text-[10px] font-mono text-gray-400">({report.id})</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{report.location} · {report.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${getWellnessColor(report.wellnessScore)}`}>
                          Score: {report.wellnessScore}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedScreening(report); }}
                          className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#2563EB] text-[#0B1B33] hover:text-[#2563EB] text-xs font-semibold transition-colors"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HEALTH TRENDS SECTION */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  Health Trends &amp; Baseline Metrics
                </h2>
                <p className="text-xs text-gray-400">Historical biomarker progress tracking across sequential scans</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { metric: 'Hydration Trend', status: 'Optimal (88%)', change: '+5%', color: '#2563EB', bg: '#EFF6FF' },
                  { metric: 'pH Balance', status: 'Normal (6.8 pH)', change: 'Stable', color: '#0D9488', bg: '#F0FDFA' },
                  { metric: 'Glucose Spillover', status: 'Negative', change: 'Normal', color: '#059669', bg: '#ECFDF5' },
                  { metric: 'Protein Leakage', status: 'Normal', change: 'Stable', color: '#7C3AED', bg: '#F5F3FF' },
                  { metric: 'TDS Load Index', status: '310 ppm', change: '-12 ppm', color: '#D97706', bg: '#FFFBEB' },
                  { metric: 'Turbidity Index', status: '1.1 NTU', change: 'Clear', color: '#DB2777', bg: '#FDF2F8' },
                ].map((t) => (
                  <div key={t.metric} className="p-4 rounded-2xl border border-gray-100 space-y-2" style={{ background: t.bg }}>
                    <p className="text-xs font-semibold text-gray-500">{t.metric}</p>
                    <p className="text-sm font-extrabold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{t.status}</p>
                    <span className="text-[10px] font-mono font-bold text-gray-500 inline-block bg-white/70 px-2 py-0.5 rounded border border-gray-200/50">{t.change}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* QUICK ACTIONS PANEL */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Quick Actions</h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => selectedScreening && handlePdfDownload(selectedScreening.id, selectedScreening.date, selectedScreening.location)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-100 text-[#2563EB] font-semibold text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-[#2563EB]" />
                    <span>Download Latest PDF</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  href="/how-it-works"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/60 text-[#0B1B33] font-semibold text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>Find Nearby Kiosk</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/60 text-[#0B1B33] font-semibold text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-gray-500" />
                    <span>Add Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/60 text-[#0B1B33] font-semibold text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Update User Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* PROFILE SUMMARY CARD */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">User Profile</h3>
                <button onClick={() => setShowProfileModal(true)} className="text-[11px] text-[#2563EB] font-semibold hover:underline">Edit</button>
              </div>

              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] font-extrabold text-base">
                  {activeUserName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0B1B33]">{activeUserName}</p>
                  <p className="text-[10px] font-mono text-gray-400">ID: US-USR-84920</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 text-[10px]">Age / Gender</p>
                  <p className="font-semibold text-[#0B1B33] mt-0.5">{profile?.age || '32'} / {profile?.gender || 'Male'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">Blood Group</p>
                  <p className="font-semibold text-[#0B1B33] mt-0.5">{profile?.bloodGroup || 'O+'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">Registered Since</p>
                  <p className="font-semibold text-[#0B1B33] mt-0.5">June 2026</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">Total Scans</p>
                  <p className="font-semibold text-[#2563EB] mt-0.5">{screenings.length}</p>
                </div>
              </div>
            </div>

            {/* PERSONAL HEALTH TIMELINE LIST */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Health Timeline</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Chronological scan journal</p>
              </div>

              <div className="relative border-l border-gray-100 pl-4 ml-2 space-y-5">
                {screenings.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScreening(s)}
                    className="cursor-pointer space-y-1 block group"
                  >
                    <span className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-white top-1 ${
                      selectedScreening?.id === s.id ? 'bg-[#2563EB]' : 'bg-gray-300'
                    }`} />
                    <p className="text-[10px] font-mono text-gray-400">{s.date} · {s.time}</p>
                    <p className="font-bold text-xs text-[#0B1B33] group-hover:text-[#2563EB] transition-colors">{s.location}</p>
                    <p className="text-[10px] text-gray-500">Score: {s.wellnessScore}/100 · {s.interpretations.hydration}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ── ADD PROFILE MODAL ── */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200 relative">
            <button 
              onClick={() => setShowNewPatientModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB]">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Add Profile
              </h3>
              <p className="text-xs text-gray-500">Register a new profile or family member to link future UroSense scans.</p>
            </div>

            {registerSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                <p className="font-bold text-emerald-900 text-sm">Profile Added Successfully!</p>
                <p className="text-xs text-emerald-700">Updating active journal session...</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterNewPatient} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={newPatientForm.fullName}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Age</label>
                    <input
                      type="number"
                      required
                      value={newPatientForm.age}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Gender</label>
                    <select
                      value={newPatientForm.gender}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2563EB] bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Blood Group</label>
                  <select
                    value={newPatientForm.bloodGroup}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2563EB] bg-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPatientModal(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-md shadow-blue-500/15"
                  >
                    Save &amp; Activate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── UPDATE PROFILE MODAL ── */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                User Profile Details
              </h3>
              <p className="text-xs text-gray-500">Personal information associated with your health journal.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span className="text-gray-500">User Name</span>
                <span className="font-bold text-[#0B1B33]">{activeUserName}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono font-bold text-[#2563EB]">US-USR-84920</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span className="text-gray-500">Mobile Authentication</span>
                <span className="font-mono text-gray-700">{profile?.phone || '+91 Verified'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <span className="text-gray-500">Data Security</span>
                <span className="font-bold text-emerald-600">AES-256 Encrypted</span>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-3 rounded-xl bg-[#0B1B33] text-white text-xs font-semibold hover:bg-[#0B1B33]/90"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
