import type { Metadata } from 'next';
import { requireOperator } from '@/lib/auth/guards';
import { getAllDevices } from '@/lib/supabase/queries';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Active Alerts' };

export default async function OpsAlertsPage() {
  await requireOperator();
  const devices = await getAllDevices();
  const errorDevices = devices.filter((d) => d.status === 'error');
  const offlineDevices = devices.filter((d) => d.status === 'offline');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Active Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {errorDevices.length + offlineDevices.length} device{errorDevices.length + offlineDevices.length !== 1 ? 's' : ''} require attention.
        </p>
      </div>

      {errorDevices.length === 0 && offlineDevices.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">✅</p>
          <p className="font-display text-xl font-semibold text-health-optimal mb-2">All clear</p>
          <p className="text-muted-foreground text-sm">No active device alerts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {errorDevices.length > 0 && (
            <div>
              <h2 className="font-display text-base font-semibold text-health-critical mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-health-critical animate-pulse" />
                Device Errors ({errorDevices.length})
              </h2>
              <div className="space-y-3">
                {errorDevices.map((device) => (
                  <div key={device.id} className="glass rounded-xl p-5 border border-health-critical/30 bg-health-critical/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{device.model}</p>
                        <p className="font-mono text-xs text-muted-foreground">{device.serial_number}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-health-critical/20 text-health-critical text-xs font-semibold border border-health-critical/30">
                        ERROR
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Last seen: {device.last_seen_at ? formatRelativeTime(device.last_seen_at) : 'Never'}
                    </p>
                    {device.metadata && (typeof device.metadata === 'object') && 'error_message' in device.metadata && (
                      <p className="text-xs text-health-critical mt-1 font-mono">
                        {String((device.metadata as Record<string, unknown>).error_message)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {offlineDevices.length > 0 && (
            <div>
              <h2 className="font-display text-base font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                Offline Devices ({offlineDevices.length})
              </h2>
              <div className="space-y-3">
                {offlineDevices.map((device) => (
                  <div key={device.id} className="glass rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{device.model}</p>
                        <p className="font-mono text-xs text-muted-foreground">{device.serial_number}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last seen: {device.last_seen_at ? formatRelativeTime(device.last_seen_at) : 'Never'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
