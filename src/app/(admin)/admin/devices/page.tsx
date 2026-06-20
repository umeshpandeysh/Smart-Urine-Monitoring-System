import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllDevices } from '@/lib/supabase/queries';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Device Management' };

export default async function AdminDevicesPage() {
  await requireAdmin();
  const devices = await getAllDevices();

  const statusConfig: Record<string, { color: string; dot: string }> = {
    online: { color: 'text-health-optimal bg-health-optimal/10 border-health-optimal/30', dot: 'bg-health-optimal' },
    offline: { color: 'text-muted-foreground bg-muted border-border', dot: 'bg-muted-foreground' },
    maintenance: { color: 'text-health-caution bg-health-caution/10 border-health-caution/30', dot: 'bg-health-caution' },
    error: { color: 'text-health-critical bg-health-critical/10 border-health-critical/30', dot: 'bg-health-critical animate-pulse' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Devices</h1>
        <p className="text-muted-foreground text-sm mt-1">{devices.length} registered devices</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['online', 'offline', 'maintenance', 'error'] as const).map((status) => {
          const count = devices.filter((d) => d.status === status).length;
          const cfg = statusConfig[status];
          return (
            <div key={status} className="glass rounded-xl p-4 text-center">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} mx-auto mb-2`} />
              <p className="font-display text-2xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{status}</p>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Device</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Firmware</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last Seen</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Battery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    No devices registered
                  </td>
                </tr>
              ) : (
                devices.map((device) => {
                  const cfg = statusConfig[device.status] ?? statusConfig.offline;
                  return (
                    <tr key={device.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground font-mono text-xs">{device.serial_number}</p>
                        <p className="text-xs text-muted-foreground">{device.model}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {device.firmware_version ?? 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {device.last_seen_at ? formatRelativeTime(device.last_seen_at) : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        {device.battery_level !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  device.battery_level > 50 ? 'bg-health-optimal' :
                                  device.battery_level > 20 ? 'bg-health-caution' :
                                  'bg-health-critical'
                                }`}
                                style={{ width: `${device.battery_level}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{device.battery_level}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
