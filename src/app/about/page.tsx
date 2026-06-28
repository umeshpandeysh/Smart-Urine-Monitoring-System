import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import {
  Target, Eye, AlertCircle, Sparkles, TrendingUp,
  FlaskConical, Compass, ArrowRight, CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — UroSense Product Story',
  description: 'The UroSense story: Reimagining preventive healthcare through non-invasive, automated urinalysis kiosks across public infrastructure.',
};

export default function AboutPage() {
  const storyBlocks = [
    {
      badge: 'THE PROBLEM',
      title: 'Healthcare Begins Too Late',
      desc: 'Traditional healthcare models rely on symptomatic detection — individuals visit hospitals only after physical illness manifests. Crucial early indicators of metabolic stress, kidney strain, and dehydration remain undetected for months.',
      icon: AlertCircle,
      color: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      badge: 'THE SOLUTION',
      title: 'Automated Biomonitoring Kiosks',
      desc: 'UroSense embeds medical-grade spectrograph sensors directly into everyday transit hubs, corporate campuses, and clinics. Users receive instant, touchless urinalysis trend reports in under 60 seconds.',
      icon: Sparkles,
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      badge: 'THE INNOVATION',
      title: 'Zero-Touch Micro-Fluidics',
      desc: 'Combining optical spectrophotometry with solid-state pH and TDS sensors. Self-cleaning pathways reset in under 800 milliseconds, ensuring zero physical contact and absolute session privacy.',
      icon: FlaskConical,
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      badge: 'THE IMPACT',
      title: 'Continuous Preventive Baseline',
      desc: 'Shifting population health from reactive treatment to proactive monitoring. Early biological feedback empowers individuals and healthcare operators to address wellness risks before clinical hospitalization.',
      icon: TrendingUp,
      color: '#059669',
      bg: '#ECFDF5',
    },
  ];

  const roadmapPillars = [
    { phase: 'Phase 1', title: 'Municipal Kiosk Infrastructure', detail: 'Deploying solid-state hardware across 10 major transit hubs and airport terminals.' },
    { phase: 'Phase 2', title: 'AI Predictive Analysis', detail: 'Cross-referencing multi-month biomarker trends with personalized hydration targets.' },
    { phase: 'Phase 3', title: 'Unified Digital Health Interoperability', detail: 'Seamless integration with national digital health accounts (ABDM / ABHA ID).' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B33]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />

      <main className="pt-28 pb-24 max-w-6xl mx-auto px-6 md:px-12 space-y-20">

        {/* Hero Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0B1B33]"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            About UroSense
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Transforming everyday biological indicators into actionable health insights before symptoms appear.
          </p>
        </div>

        {/* Mission & Vision Twin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0B1B33] text-white rounded-3xl p-8 md:p-10 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block">OUR MISSION</span>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Democratize Preventive Biomonitoring
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              To make high-precision physiological monitoring accessible to everyone by integrating non-invasive diagnostic checkpoints into existing daily routines.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#EFF6FF] to-white border border-blue-100 rounded-3xl p-8 md:p-10 space-y-4 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-[#2563EB]">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-[#2563EB] uppercase tracking-widest block">OUR VISION</span>
            <h2 className="text-2xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              A World of Early Health Clarity
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A future where metabolic risks, kidney strain, and hydration deficiencies are identified weeks before clinical hospitalization becomes necessary.
            </p>
          </div>
        </div>

        {/* Problem → Solution → Innovation → Impact Matrix */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              The Four Pillars of UroSense
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storyBlocks.map((block) => {
              const Icon = block.icon;
              return (
                <div key={block.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full" style={{ background: block.bg, color: block.color }}>
                      {block.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: block.bg }}>
                      <Icon className="w-5 h-5" style={{ color: block.color }} />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#0B1B33] text-xl" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                    {block.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {block.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Roadmap Section */}
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#2563EB] uppercase tracking-widest mb-1">
                <Compass className="w-4 h-4" /> Strategic Horizon
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Technology & Execution Roadmap
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmapPillars.map((pillar) => (
              <div key={pillar.phase} className="bg-white border border-gray-200/60 rounded-2xl p-6 space-y-3 shadow-sm">
                <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                  {pillar.phase}
                </span>
                <h4 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  {pillar.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {pillar.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirational Vision Callout */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] border border-blue-100/60 rounded-3xl p-8 sm:p-12 text-center">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1B33] max-w-2xl mx-auto leading-snug tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            &ldquo;Healthcare shouldn&apos;t begin after symptoms appear. It should begin before they do.&rdquo;
          </blockquote>
          <p className="text-xs font-mono text-[#2563EB] font-bold uppercase tracking-widest mt-6">
            — The UroSense Vision
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
