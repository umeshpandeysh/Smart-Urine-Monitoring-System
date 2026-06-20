import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOperator } from '@/lib/auth/guards';
import { getAllDevices, getAllLocations } from '@/lib/supabase/queries';

export const metadata: Metadata = { title: 'Operations Dashboard' };

export default async function OperationsDashboardPage() {
  await requireOperator();
  const [devices, locations] = await Promise.all([
    getAllDevices(),
    getAllLocations(),
  ]);

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const errorCount = devices.filter((d) => d.status === 'error').length;
  const maintenanceCount = devices.filter((d) => d.status === 'maintenance').length;
  const offlineCount = devices.filter((d) => d.status === 'offline').length;

  const fleetHealth = devices.length > 0
    ? Math.round((onlineCount / devices.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Operations Center</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time device fleet monitoring and maintenance coordination.</p>
      </div>

      {/* Fleet health */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Fleet Health</h2>
          <Link href="/operations/devices" className="text-sm text-primary hover:underline">View all devices</Link>
        </div>
        <div className="flex items-end gap-4 mb-4">
          <p className={`font-display text-5xl font-bold ${
            fleetHealth >= 80 ? 'text-health-optimal' :
            fleetHealth >= 50 ? 'text-health-caution' :
            'text-health-critical'
          }`}>{fleetHealth}%</p>
          <p className="text-muted-foreground text-sm mb-2">devices online</p>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              fleetHealth >= 80 ? 'bg-health-optimal' :
              fleetHealth >= 50 ? 'bg-health-caution' :
              'bg-health-critical'
            }`}
            style={{ width: `${fleetHealth}%` }}
          />
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Online', count: onlineCount, color: 'text-health-optimal', dot: 'bg-health-optimal', href: '/operations/devices' },
          { label: 'Offline', count: offlineCount, color: 'text-muted-foreground', dot: 'bg-muted-foreground', href: '/operations/devices' },
          { label: 'Maintenance', count: maintenanceCount, color: 'text-health-caution', dot: 'bg-health-caution', href: '/operations/maintenance' },
          { label: 'Errors', count: errorCount, color: 'text-health-critical', dot: 'bg-health-critical', href: '/operations/alerts' },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="glass rounded-xl p-5 card-hover">
            <div className={`w-2.5 h-2.5 rounded-full ${item.dot} mb-2`} />
            <p className={`font-display text-3xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Locations */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Deployment Locations</h2>
          <span className="text-sm text-muted-foreground">{locations.length} locations</span>
        </div>
        <div className="space-y-3">
          {locations.slice(0, 8).map((location) => {
            const locationDevices = devices.filter((d) => d.location_id === location.id);
            const locationOnline = locationDevices.filter((d) => d.status === 'online').length;
            return (
              <div key={location.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{location.name}</p>
                  <p className="text-xs text-muted-foreground">{location.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-foreground">
                    {locationOnline}/{locationDevices.length}
                  </p>
                  <p className="text-xs text-muted-foreground">online</p>
                </div>
              </div>
            );
          })}
          {locations.length === 0 && (
            <p className="text-sm text-muted-foreground">No locations configured</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/operations/devices', icon: '📡', title: 'Device Monitor', desc: 'Real-time device health and telemetry.' },
          { href: '/operations/alerts', icon: '🚨', title: 'Active Alerts', desc: `${errorCount} device${errorCount !== 1 ? 's' : ''} require attention.` },
          { href: '/operations/maintenance', icon: '🔧', title: 'Maintenance Queue', desc: `${maintenanceCount} device${maintenanceCount !== 1 ? 's' : ''} scheduled.` },
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
