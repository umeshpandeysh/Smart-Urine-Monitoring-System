import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      {/* Brand mark */}
      <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8">
        <Activity className="w-7 h-7 text-white" />
      </div>

      {/* 404 */}
      <p className="text-[7rem] md:text-[9rem] font-extrabold text-[#2563EB]/10 leading-none select-none font-mono mb-2">
        404
      </p>

      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1B33] tracking-tight mb-3"
        style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
        Page Not Found
      </h1>
      <p className="text-[#475569] text-base max-w-sm mx-auto leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] shadow-md shadow-blue-500/15 transition-all duration-200 hover:-translate-y-0.5"
      >
        Return Home <ArrowRight className="w-4 h-4" />
      </Link>

      <p className="mt-12 text-xs text-gray-400 font-mono">
        UroSense · Smart Urine Health Analysis
      </p>
    </div>
  );
}
