import type { Metadata } from 'next';
import { requireOperator } from '@/lib/auth/guards';
import { getAllDevices } from '@/lib/supabase/queries';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Device Monitor' };

export default async function OpsDevicesPage() {
  await requireOperator();
  const devices = await getAllDevices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Device Monitor</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time health of all deployed IoT nodes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.length === 0 ? (
          <div className="col-span-3 glass rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">📡</p>
            <p className="font-display text-lg text-foreground">No devices deployed</p>
          </div>
        ) : (
          devices.map((device) => {
            const statusColor = {
              online: 'border-health-optimal/30 bg-health-optimal/5',
              offline: 'border-border bg-card',
              maintenance: 'border-health-caution/30 bg-health-caution/5',
              error: 'border-health-critical/30 bg-health-critical/5',
            }[device.status] ?? 'border-border bg-card';

            const dotColor = {
              online: 'bg-health-optimal',
              offline: 'bg-muted-foreground',
              maintenance: 'bg-health-caution',
              error: 'bg-health-critical animate-pulse',
            }[device.status] ?? 'bg-muted-foreground';

            return (
              <div key={device.id} className={`rounded-xl border p-5 ${statusColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                    <span className="font-mono text-xs text-muted-foreground">{device.serial_number}</span>
                  </div>
                  <span className={`text-xs font-medium capitalize ${
                    device.status === 'online' ? 'text-health-optimal' :
                    device.status === 'error' ? 'text-health-critical' :
                    device.status === 'maintenance' ? 'text-health-caution' :
                    'text-muted-foreground'
                  }`}>{device.status}</span>
                </div>

                <p className="font-display font-semibold text-foreground text-sm mb-3">{device.model}</p>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Firmware</span>
                    <span className="font-mono text-foreground">{device.firmware_version ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last seen</span>
                    <span>{device.last_seen_at ? formatRelativeTime(device.last_seen_at) : 'Never'}</span>
                  </div>
                  {device.battery_level !== null && (
                    <div className="flex justify-between items-center">
                      <span>Battery</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              device.battery_level > 50 ? 'bg-health-optimal' :
                              device.battery_level > 20 ? 'bg-health-caution' :
                              'bg-health-critical'
                            }`}
                            style={{ width: `${device.battery_level}%` }}
                          />
                        </div>
                        <span className="font-mono text-foreground">{device.battery_level}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
