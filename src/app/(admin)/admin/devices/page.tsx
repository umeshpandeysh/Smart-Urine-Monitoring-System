import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllDevices, getAllLocations } from '@/lib/supabase/queries';
import DeviceManagement from '@/components/admin/device-management';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'Device Management' };

export default async function AdminDevicesPage() {
  await requireAdmin();
  
  const [devices, locations] = await Promise.all([
    getAllDevices(),
    getAllLocations(),
  ]);

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      
      {/* Navigation Header */}
      <div className="space-y-1 border-b border-[#E5E7EB] pb-4">
        <Link
          href="/admin/dashboard"
          className="group flex items-center gap-1.5 text-xs font-mono text-[#9CA3AF] hover:text-[#111827] transition-colors mb-2"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
          <span>BACK TO OVERVIEW</span>
        </Link>
        <h1 className="font-display text-3xl font-light text-[#111827] tracking-tight">
          Hardware Inventory Assets
        </h1>
        <p className="text-xs text-[#6B7280] font-light">
          Monitor and configure UroSense node telemetry sensors, battery statistics, and locations.
        </p>
      </div>

      {/* Device Management Component */}
      <DeviceManagement devices={devices} locations={locations} />

    </div>
  );
}
