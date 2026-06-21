import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllProfiles, getAllDevices, getAllLocations } from '@/lib/supabase/queries';
import PopulationHealth from '@/components/admin/population-health';

export const metadata: Metadata = { title: 'Admin Overview' };

export default async function AdminDashboardPage() {
  await requireAdmin();
  
  const [profiles, devices, locations] = await Promise.all([
    getAllProfiles(),
    getAllDevices(),
    getAllLocations(),
  ]);

  return (
    <div className="space-y-8 pb-20 md:pb-0" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0B1B33] tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Executive Command Console
          </h1>
          <p className="text-xs text-[#6B7280] font-light mt-1">
            Global healthcare assets, population analytics, and security baselines.
          </p>
        </div>
        <span className="font-mono text-[9px] text-[#9CA3AF] tracking-wider uppercase bg-[#FAFAF8] border border-[#E5E7EB] px-2 py-0.5 rounded">
          SYSTEM ADMINISTRATOR
        </span>
      </div>

      {/* Admin specific stats block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-2">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Clinical Accounts</p>
          <p className="text-4xl font-extrabold text-[#0B1B33]" style={{ fontFamily: 'var(--font-mono), monospace' }}>{profiles.length}</p>
          <p className="text-xs text-emerald-600 font-semibold">&uarr; 12% registration expansion</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-2">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Device Anchors</p>
          <p className="text-4xl font-extrabold text-[#0B1B33]" style={{ fontFamily: 'var(--font-mono), monospace' }}>{devices.length}</p>
          <p className="text-xs text-gray-500 font-medium">{locations.length} clinics and transit clusters</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-2">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Compliance Registry</p>
          <p className="text-4xl font-extrabold text-emerald-600" style={{ fontFamily: 'var(--font-mono), monospace' }}>100%</p>
          <p className="text-xs text-gray-500 font-medium">All data nodes encrypted under AES-256</p>
        </div>
      </div>

      {/* Population Health Analytics Section */}
      <PopulationHealth />

      {/* Quick Console Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { href: '/admin/users', title: 'User Operations Console', desc: 'Trace population enrollment, risk indicators, and access roles.', code: 'SYS-USER' },
          { href: '/admin/devices', title: 'Asset Fleet Control', desc: 'Monitor device calibration intervals, batteries, and firmware compliance.', code: 'SYS-DEV' },
          { href: '/admin/reports', title: 'Clinical Report Registry', desc: 'Moderate and audit generated reports, PDF downloads, and verifications.', code: 'SYS-REP' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#2563EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-200"
          >
            <span className="font-mono text-[8px] text-gray-400 tracking-widest block mb-2 group-hover:text-[#2563EB] transition-colors">
              {item.code}
            </span>
            <h4 className="font-bold text-sm text-[#111827] mb-1.5 group-hover:text-[#2563EB] transition-colors" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              {item.title}
            </h4>
            <p className="text-xs text-[#6B7280] font-light leading-relaxed">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}
