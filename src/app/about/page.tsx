import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import {
  Target, Eye, Shield, Cpu, Activity, ArrowRight,
  Database, Globe, HeartPulse, Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About UroSense — Preventive Health Technology',
  description: 'UroSense is a smart urine biomonitoring ecosystem making preventive health screening fast, accessible, and non-invasive through AI-powered public diagnostic stations.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1B33]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />

      <main className="pt-32 pb-28 max-w-6xl mx-auto px-6 md:px-12 space-y-24">

        {/* SECTION 1: Hero Section */}
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0B1B33]"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            About UroSense
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-normal">
            UroSense is a smart urine biomonitoring ecosystem designed to make preventive health screening fast, accessible, and non-invasive through AI-powered public diagnostic stations.
          </p>
        </div>

        {/* SECTION 2: Why We Built It */}
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Why We Built It
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0B1B33] text-xl" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                The Problem
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Traditional healthcare is reactive and delayed. Critical biological indicators of metabolic stress and hydration deficiencies go unnoticed until physical symptoms manifest.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0B1B33] text-xl" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                The Solution
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automated, non-invasive biomonitoring kiosks integrated into public infrastructure. Micro-fluidic sensors deliver accurate biological trend analysis in under 60 seconds.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0B1B33] text-xl" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                The Impact
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Shifting population wellness from reactive hospital visits to continuous preventive insights. Early detection empowers individuals to take proactive health ownership.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: How UroSense Works (Horizontal Timeline) */}
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            How UroSense Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Collect Sample', desc: 'Touchless optical micro-fluidic isolation' },
              { num: '02', title: 'Sensor Analysis', desc: 'Simultaneous 5-biomarker spectrograph pass' },
              { num: '03', title: 'AI Interpretation', desc: 'Clinical baseline evaluation in 3 seconds' },
              { num: '04', title: 'Health Report', desc: 'Ephemeral QR token encrypted delivery' },
              { num: '05', title: 'Personal Journal', desc: 'Long-term trend tracking in private profile' },
            ].map((step, idx) => (
              <div key={step.num} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 shadow-sm hover:border-blue-200 transition-colors">
                <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded-md">
                  {step.num}
                </span>
                <h4 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0B1B33] text-white rounded-3xl p-8 md:p-10 space-y-4 shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-blue-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Mission
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                To democratize preventive healthcare by deploying accessible, non-invasive biomonitoring checkpoints across daily public infrastructure.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8 md:p-10 space-y-4 shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Vision
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                A future where early biological indicators eliminate preventable metabolic conditions before hospital intervention is needed.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: Core Principles */}
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              <h4 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Preventive Healthcare
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Focusing on early biological detection to maintain health before clinical symptoms appear.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 shadow-sm">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Privacy First
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Zero-persistent hardware storage and AES-256 encrypted session transmission protect your records.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 shadow-sm">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                AI Clinical Intelligence
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Converting complex multi-sensor spectrograph data into clear, actionable wellness guidance.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 shadow-sm">
              <Globe className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Accessible Screening
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Touchless kiosks positioned in transit terminals and hubs for seamless routine health tracking.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 6: Future Vision */}
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B33] tracking-tight"
              style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Building India&apos;s Next Preventive Health Network
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our engineering roadmap expands smart biomonitoring across public transit, corporate centers, and smart city infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-[#0B1B33] text-sm" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Nationwide Kiosks
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Deploying solid-state hardware stations across major transit hubs.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-[#0B1B33] text-sm" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Smarter AI Diagnostics
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Refining predictive algorithms with multi-month hydration and metabolic baselines.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-[#0B1B33] text-sm" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Population Health
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Aggregating anonymous municipal trends for public health insights.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-[#0B1B33] text-sm" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                Digital Integration
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Linking seamlessly with national digital health records for unified care.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
