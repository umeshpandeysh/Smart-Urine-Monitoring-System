import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllProfiles, getAllDevices, getAllReports } from '@/lib/supabase/queries';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [profiles, devices, reports] = await Promise.all([
    getAllProfiles(),
    getAllDevices(),
    getAllReports(1, 5),
  ]);

  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const errorDevices = devices.filter((d) => d.status === 'error').length;

  const statCards = [
    { label: 'Total Users', value: profiles.length, icon: '👥', href: '/admin/users', color: 'text-primary' },
    { label: 'Total Devices', value: devices.length, icon: '📡', href: '/admin/devices', color: 'text-primary' },
    { label: 'Online Devices', value: onlineDevices, icon: '🟢', href: '/admin/devices', color: 'text-health-optimal' },
    { label: 'Device Errors', value: errorDevices, icon: '🔴', href: '/admin/devices', color: errorDevices > 0 ? 'text-health-critical' : 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform-wide health and operational metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="glass rounded-xl p-5 card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className={`font-display text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Device status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Device Status</h2>
            <Link href="/admin/devices" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { status: 'online', label: 'Online', count: onlineDevices, color: 'bg-health-optimal' },
              { status: 'offline', label: 'Offline', count: devices.filter((d) => d.status === 'offline').length, color: 'bg-muted-foreground' },
              { status: 'maintenance', label: 'Maintenance', count: devices.filter((d) => d.status === 'maintenance').length, color: 'bg-health-caution' },
              { status: 'error', label: 'Error', count: errorDevices, color: 'bg-health-critical' },
            ].map((row) => (
              <div key={row.status} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                <span className="text-sm text-foreground capitalize flex-1">{row.label}</span>
                <span className="font-mono font-bold text-sm text-foreground">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Reports</h2>
            <Link href="/admin/reports" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground truncate max-w-[200px]">{report.title}</span>
                <span className={`capitalize text-xs font-medium ${
                  report.status === 'complete' ? 'text-health-optimal' : 'text-health-caution'
                }`}>{report.status}</span>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-sm text-muted-foreground">No reports yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/users', icon: '👥', title: 'Manage Users', desc: 'View, edit, and manage patient and operator profiles.' },
          { href: '/admin/devices', icon: '📡', title: 'Manage Devices', desc: 'Monitor device fleet health and firmware versions.' },
          { href: '/admin/reports', icon: '📄', title: 'Manage Reports', desc: 'Review and moderate all generated health reports.' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="glass rounded-xl p-5 card-hover">
            <span className="text-3xl block mb-3">{item.icon}</span>
            <p className="font-display font-semibold text-foreground mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
