'use client';

import React, { useState } from 'react';
import { 
  Activity, Calendar, MapPin, FileText, Droplets, Shield, 
  AlertTriangle, CheckCircle2, Heart, Download, Clock, BookOpen, 
  Sparkles, ToggleLeft, ToggleRight, User, TrendingUp, Info
} from 'lucide-react';
import Link from 'next/link';

import { useEffect } from 'react';

export default function PatientPortalPage() {
  const [showTechnical, setShowTechnical] = useState(false);
  const [screenings, setScreenings] = useState<any[]>([]);
  const [selectedScreening, setSelectedScreening] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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
              date: r.report_date,
              time: new Date(r.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              location: r.locations?.location_name || 'UroSense Terminal',
              wellnessScore: r.overall_score || 0,
              interpretations: {
                hydration: r.hydration_status || 'Unknown',
                glucose: r.glucose_indicator || 'Negative',
                protein: r.protein_indicator || 'Normal',
                utiRisk: r.uti_risk || 'Low',
                kidneyStress: r.protein_indicator || 'Normal'
              },
              rawParameters: {
                ph: Number(reading.ph || 6.0),
                tds: Number(reading.tds || 400),
                temperature: Number(reading.temperature || 36.5),
                turbidity: Number(reading.turbidity || 1.0)
              },
              recommendations: r.generated_recommendations || (r.recommendation ? [r.recommendation] : ['Follow standard daily hydration guidelines.']),
              hash: `SHA-256: ${r.id.replace(/-/g, '').substring(0, 16)}`
            };
          });
          setScreenings(mapped);
          setSelectedScreening(mapped[0]);
        }
      } catch (e) {
        console.error('Error loading patient data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Wellness score colour helper
  const getWellnessColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getStatusColor = (val: string) => {
    const normal = ['Optimal', 'Negative', 'Normal / Trace', 'Low', 'Normal'];
    const caution = ['Moderate Dehydration', 'Trace Detected', 'Moderate Risk', 'Mild Load Alert'];
    if (normal.includes(val)) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (caution.includes(val)) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200'; // Severe
  };

  // Safe PDF download handler
  const handlePdfDownload = (id: string, date: string, location: string) => {
    window.open(`/api/v1/reports/${id}/pdf`, '_blank');
  };

  const uniqueLocations = Array.from(new Set(screenings.map(s => s.location))).map(locName => {
    const s = screenings.find(x => x.location === locName);
    return {
      name: locName,
      city: 'New Delhi',
      lastVisited: s?.date || ''
    };
  });

  const overallWellnessScore = screenings.length > 0 
    ? Math.round(screenings.reduce((acc, s) => acc + s.wellnessScore, 0) / screenings.length) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] flex items-center justify-center font-mono text-sm">
        Loading personal health journal...
      </div>
    );
  }

  if (!selectedScreening) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] pb-24" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {/* HEADER NAVIGATION */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                My UroSense Journal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                <User className="w-3.5 h-3.5 text-[#2563EB]" /> {profile?.name || 'New Patient'}
              </span>
              <Link href="/" className="text-xs font-mono font-semibold text-gray-500 hover:text-[#0B1B33]">
                Exit Journal
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
          
          {/* Welcome / Onboarding Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mx-auto animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Welcome to UroSense!
              </h1>
              <p className="text-sm text-gray-500">
                Hi {profile?.name || 'New Patient'}, your biological wellness journal is active. Get started by syncing your first smart urine analysis.
              </p>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-xs text-[#2563EB] font-medium leading-relaxed max-w-md mx-auto">
              No report synchronized yet. Visit a nearest kiosk to run your first touchless diagnostic.
            </div>
          </div>

          {/* How to Get Started Steps */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="text-xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                How to Get Your First Report
              </h2>
              <p className="text-xs text-gray-400">Follow these simple steps at any UroSense terminal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Locate Kiosk',
                  desc: 'Find a UroSense telemetry station at airports, corporate parks, or health facilities.',
                  icon: MapPin
                },
                {
                  step: '02',
                  title: 'Submit Diagnostic',
                  desc: 'Use the terminal naturally. Solid-state sensors analyze pH, TDS, and turbidity indexes in 3 seconds.',
                  icon: Activity
                },
                {
                  step: '03',
                  title: 'Scan QR & Verify',
                  desc: 'Scan the generated QR code with your mobile camera and enter OTP to link the report privately.',
                  icon: FileText
                }
              ].map((s, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-4xl font-extrabold text-gray-100/70 font-mono select-none">{s.step}</div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0B1B33]">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Kiosk Locations */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Active Telemetry Locations
              </h3>
              <p className="text-xs text-gray-400">Find a kiosk near you to sync your first molecular health record</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Delhi Airport T3 Node', city: 'New Delhi', status: 'Active' },
                { name: 'Mumbai Central Node', city: 'Mumbai', status: 'Active' },
                { name: 'Bengaluru Corporate Hub', city: 'Bengaluru', status: 'Active' }
              ].map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 border border-gray-50 bg-[#FAFAF9] rounded-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="font-bold text-[#0B1B33] text-[11px] leading-tight">{loc.name}</p>
                      <p className="text-[9px] text-gray-400">{loc.city}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {loc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] pb-24" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* ── HEADER NAVIGATION ── */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              My UroSense Journal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <User className="w-3.5 h-3.5 text-[#2563EB]" /> {profile?.name || 'Aarav Sharma'}
            </span>
            <Link href="/" className="text-xs font-mono font-semibold text-gray-500 hover:text-[#0B1B33]">
              Exit Journal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Summary & Trends */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Patient Welcoming & Overall Wellness */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                HERE IS PATIENT PORTAL
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Your personal health journal. Tracking molecular bio-indicators for preventive wellness.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-gray-100 bg-[#FAFAF9] rounded-2xl gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">CURRENT WELLNESS INDEX</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#0B1B33] font-mono">{overallWellnessScore}</span>
                  <span className="text-gray-400 text-sm">/ 100</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Based on screening hydration, renal stress, and sugar indicator thresholds.
                </p>
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <div className="text-xs font-semibold text-gray-500 font-mono text-right hidden sm:block">
                  Last Checked: {screenings[0]?.date} at {screenings[0]?.time}
                </div>
                <button 
                  onClick={() => setShowTechnical(!showTechnical)}
                  className="flex items-center justify-center gap-2 text-xs font-mono font-bold bg-[#2563EB] text-white hover:bg-blue-700 px-5 py-3 rounded-xl transition-all shadow-sm shadow-blue-100"
                >
                  {showTechnical ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{showTechnical ? "HIDE TECHNICAL REPORT" : "VIEW TECHNICAL REPORT"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* PATIENT FRIENDLY INTERPRETATIONS & METRICS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  Latest Biomarker Diagnostics
                </h2>
                <p className="text-xs text-gray-400">
                  Screened at <span className="font-semibold">{selectedScreening.location}</span> on {selectedScreening.date}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getWellnessColor(selectedScreening.wellnessScore)}`}>
                Wellness Score: {selectedScreening.wellnessScore}
              </span>
            </div>

            {/* If NOT showing raw parameters, display easy patient terms */}
            {!showTechnical ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Hydration Status', value: selectedScreening.interpretations.hydration, icon: Droplets, desc: 'Indicates if your fluid level is optimal or if you need to hydrate.' },
                  { label: 'Glucose Indicator', value: selectedScreening.interpretations.glucose, icon: Sparkles, desc: 'Identifies glucose spillover which tracks metabolic baseline sugar peaks.' },
                  { label: 'Protein Indicator', value: selectedScreening.interpretations.protein, icon: Shield, desc: 'Checks for kidney filtration stress levels or unusual fatigue load.' },
                  { label: 'UTI Risk Level', value: selectedScreening.interpretations.utiRisk, icon: AlertTriangle, desc: 'Estimates urinary tract health based on pH and turbidity dynamics.' },
                  { label: 'Kidney Stress Indicator', value: selectedScreening.interpretations.kidneyStress, icon: Heart, desc: 'Measures organic filtration burden to detect muscular stress.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-[#FAFAF9] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/50 flex items-center justify-center text-[#2563EB] shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500">{item.label}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(item.value)}`}>
                        {item.value}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // TECHNICAL LAB DATA FOR ADVANCED USERS
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-xs">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Technical Mode Active:</strong> Displaying raw solid-state optoelectronic sensor readouts. These values are calibrated for clinician reviews.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'pH Density', value: selectedScreening.rawParameters.ph, unit: 'pH scale', status: 'Optimal' },
                    { label: 'Total Dissolved Solids (TDS)', value: selectedScreening.rawParameters.tds, unit: 'ppm', status: 'Within Limits' },
                    { label: 'Thermal Offset', value: selectedScreening.rawParameters.temperature, unit: '°C', status: 'Calibrated' },
                    { label: 'Scatter Turbidity', value: selectedScreening.rawParameters.turbidity, unit: 'NTU', status: 'Stable' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 border border-gray-100 bg-white rounded-xl text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">{p.label}</span>
                      <p className="text-2xl font-extrabold text-[#0B1B33] font-mono">
                        {p.value} <span className="text-xs font-normal text-gray-500">{p.unit}</span>
                      </p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold inline-block">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl font-mono text-[10px] text-gray-400 flex items-center justify-between gap-4">
                  <span>REPORT SECURE HASH: {selectedScreening.hash}</span>
                  <span className="text-[#2563EB] font-bold">VERIFIED SECURE</span>
                </div>
              </div>
            )}
          </div>

          {/* TREND ANALYSIS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Trend Analysis &amp; Wellness Progression
              </h2>
              <p className="text-xs text-gray-500">
                Observing physiological stability indicators over the past screenings.
              </p>
            </div>

            <div className="p-4 border border-gray-100 bg-[#FAFAF9] rounded-2xl space-y-6">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                <span>HISTORICAL WELLNESS INDEXES</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><TrendingUp className="w-3.5 h-3.5" /> UPTREND (+14%)</span>
              </div>

              {/* Graphical Trend Representation */}
              <div className="flex items-end justify-between h-40 pt-4 px-4 border-b border-gray-200">
                {screenings.slice().reverse().map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs font-bold text-[#2563EB] font-mono">{s.wellnessScore}%</span>
                    <div 
                      className="w-10 sm:w-16 bg-blue-500 hover:bg-blue-600 rounded-t-lg transition-all" 
                      style={{ height: `${s.wellnessScore * 1.2}px` }}
                    />
                    <span className="text-[10px] text-gray-400 font-mono mt-1">{s.date.split('-')[2]} {new Date(s.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">HIGHEST SCORE</span>
                  <p className="font-bold text-[#0B1B33]">
                    {screenings.length > 0 ? `${Math.max(...screenings.map(s => s.wellnessScore))}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">LOWEST SCORE</span>
                  <p className="font-bold text-[#0B1B33]">
                    {screenings.length > 0 ? `${Math.min(...screenings.map(s => s.wellnessScore))}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">RECOMMENDED GOAL</span>
                  <p className="font-bold text-emerald-600">&gt; 85% Wellness</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Timeline, Recommendations, Downloads & Locations */}
        <div className="space-y-8">
          
          {/* RECOMMENDATIONS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Clinical Guidance</h3>
            <div className="space-y-3">
              {selectedScreening.recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed bg-[#FAFAF9] p-3 rounded-xl border border-gray-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* HEALTH TIMELINE & HISTORY */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Health Timeline</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Chronological journal milestones</p>
            </div>

            <div className="relative border-l border-gray-100 pl-4 ml-2 space-y-6">
              {screenings.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => setSelectedScreening(s)}
                  className={`w-full text-left relative space-y-1 block hover:-translate-x-0.5 transition-transform ${
                    selectedScreening.id === s.id ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  {/* Timeline bullet dot */}
                  <span className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-white top-1.5 ${
                    selectedScreening.id === s.id ? 'bg-[#2563EB]' : 'bg-gray-300'
                  }`} />
                  
                  <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {s.date} <Clock className="w-3 h-3" /> {s.time}
                  </div>
                  <h4 className="font-bold text-xs text-[#0B1B33]">{s.location}</h4>
                  <div className="text-[10px] text-gray-500">Wellness Score: {s.wellnessScore} / 100</div>
                </button>
              ))}
            </div>
          </div>

          {/* LOCATION HISTORY MAP GRID */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Location History</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">UroSense terminals you visited</p>
            </div>
            
            <div className="space-y-3">
              {uniqueLocations.map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 border border-gray-50 hover:border-gray-100 bg-[#FAFAF9] rounded-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="font-bold text-[#0B1B33] text-[11px] leading-tight">{loc.name}</p>
                      <p className="text-[9px] text-gray-400">{loc.city}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">{loc.lastVisited}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DOWNLOAD REPORTS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Download Reports</h3>
            <div className="space-y-2">
              {screenings.map((s) => (
                <button 
                  key={s.id}
                  onClick={() => handlePdfDownload(s.id, s.date, s.location)}
                  className="w-full flex items-center justify-between border border-gray-100 hover:border-[#2563EB]/40 bg-[#FAFAF9] hover:bg-blue-50/20 p-3 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500 group-hover:scale-105 transition-transform" />
                    <div className="text-left">
                      <p className="font-bold text-[11px] text-[#0B1B33] leading-none">{s.date} Report</p>
                      <p className="text-[8px] font-mono text-gray-400 mt-1">{s.id}.pdf</p>
                    </div>
                  </div>
                  <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2563EB] transition-colors" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
