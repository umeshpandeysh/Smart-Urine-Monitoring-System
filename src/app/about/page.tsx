import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import {
  FlaskConical, Sparkles, Shield, Zap, Building2,
  TrendingUp, Globe2, Droplets, Activity, Eye, Info
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — UroSense',
  description: 'Learn about UroSense automated urinalysis monitoring, what it detects, how it works, and our privacy and security approach.',
};

export default function AboutPage() {
  const productHighlights = [
    {
      icon: FlaskConical,
      title: 'Medical-Grade Biosensors',
      desc: 'Five embedded sensors analyse every sample with laboratory-inspired precision in under 3 seconds.',
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      icon: Sparkles,
      title: 'AI Clinical Intelligence',
      desc: 'Transform raw sensor data into meaningful, plain-language health insights without medical jargon.',
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      icon: Shield,
      title: 'Privacy by Design',
      desc: 'Every report is encrypted via AES-256 protocols and securely linked only to the authenticated user.',
      color: '#0D9488',
      bg: '#F0FDFA',
    },
  ];

  const whyUrosense = [
    {
      icon: Zap,
      title: 'Results in Under 60 Seconds',
      desc: 'Instant biological feedback delivered directly to your smartphone.',
      color: '#D97706',
    },
    {
      icon: Building2,
      title: 'Hospitals & Public Spaces',
      desc: 'Touchless hardware deployed at clinics, airports, and corporate hubs.',
      color: '#2563EB',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Wellness Tracking',
      desc: 'Monitor long-term baseline metrics inside your private health journal.',
      color: '#059669',
    },
    {
      icon: Globe2,
      title: 'Scalable Healthcare Platform',
      desc: 'Empowering proactive, preventive wellness monitoring at national scale.',
      color: '#7C3AED',
    },
  ];

  const detectionChips = [
    { name: 'Hydration', icon: Droplets, desc: 'Fluid balance scoring', color: '#2563EB', bg: '#EFF6FF' },
    { name: 'pH Level', icon: FlaskConical, desc: 'Metabolic acidity screening', color: '#0D9488', bg: '#F0FDFA' },
    { name: 'Glucose', icon: Activity, desc: 'Early sugar spike indication', color: '#7C3AED', bg: '#F5F3FF' },
    { name: 'Protein', icon: Shield, desc: 'Kidney filtration health check', color: '#DB2777', bg: '#FDF2F8' },
    { name: 'TDS Load', icon: Zap, desc: 'Total dissolved mineral load', color: '#D97706', bg: '#FFFBEB' },
    { name: 'Turbidity', icon: Eye, desc: 'Infection & clarity screening', color: '#059669', bg: '#ECFDF5' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1B33]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />

      <main className="pt-28 pb-24 max-w-5xl mx-auto px-6 md:px-12 space-y-20">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0B1B33]"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            About UroSense
          </h1>
          <p className="text-xl md:text-2xl font-bold text-[#2563EB] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Healthcare Intelligence. Simplified.
          </p>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Turning everyday biological markers into actionable health insights before symptoms appear.
          </p>
        </div>

        {/* Product Highlights */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Core Technology</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Built for Clinical Precision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-[#0B1B33] text-lg" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why UroSense */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Platform Advantages</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Why UroSense
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyUrosense.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 space-y-3">
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                  <h4 className="font-bold text-[#0B1B33] text-sm" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detection Capabilities */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Biomarker Analysis</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Detection Capabilities
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {detectionChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <div key={chip.name} className="bg-white border border-gray-100 rounded-xl p-3.5 text-center space-y-2 shadow-sm hover:border-blue-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center" style={{ background: chip.bg }}>
                    <Icon className="w-4 h-4" style={{ color: chip.color }} />
                  </div>
                  <p className="font-bold text-[#0B1B33] text-xs" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                    {chip.name}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {chip.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] border border-blue-100/60 rounded-3xl p-8 sm:p-12 text-center my-8">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1B33] max-w-2xl mx-auto leading-snug tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            &ldquo;Healthcare shouldn&apos;t begin after symptoms appear. It should begin before they do.&rdquo;
          </blockquote>
          <p className="text-xs font-mono text-[#2563EB] font-bold uppercase tracking-widest mt-6">
            — The UroSense Vision
          </p>
        </div>

        {/* Clinical Disclaimer Block */}
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 flex gap-4 items-start">
          <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-gray-500 leading-relaxed">
            <p className="font-bold text-[#0B1B33]">Medical Disclaimer</p>
            <p>UroSense assessments represent physiological trends and biological baseline values for wellness tracking. Urinalysis metrics do not constitute formal diagnostic consultation or laboratory reports. Always contact your healthcare provider regarding physical symptoms or long-term concerns.</p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
