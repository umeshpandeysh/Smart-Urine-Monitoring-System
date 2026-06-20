import type { Metadata } from 'next';
import { requireOperator } from '@/lib/auth/guards';
import { getAllDevices } from '@/lib/supabase/queries';

export const metadata: Metadata = { title: 'Maintenance Queue' };

export default async function OpsMaintenancePage() {
  await requireOperator();
  const devices = await getAllDevices();
  const maintenanceDevices = devices.filter((d) => d.status === 'maintenance');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Maintenance Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {maintenanceDevices.length} device{maintenanceDevices.length !== 1 ? 's' : ''} scheduled for maintenance.
        </p>
      </div>

      {maintenanceDevices.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🔧</p>
          <p className="font-display text-xl font-semibold text-foreground mb-2">Queue empty</p>
          <p className="text-muted-foreground text-sm">No devices currently scheduled for maintenance.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {maintenanceDevices.map((device, idx) => (
            <div key={device.id} className="glass rounded-xl p-5 border border-health-caution/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-health-caution/10 border border-health-caution/30 flex items-center justify-center">
                    <span className="text-sm text-health-caution font-bold">#{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{device.model}</p>
                    <p className="font-mono text-xs text-muted-foreground">{device.serial_number}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-health-caution/10 text-health-caution text-xs font-semibold border border-health-caution/30">
                  Maintenance
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Firmware</p>
                  <p className="font-mono text-xs text-foreground">{device.firmware_version ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Battery</p>
                  <p className="font-mono text-xs text-foreground">
                    {device.battery_level !== null ? `${device.battery_level}%` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Action</p>
                  <button className="text-xs text-primary hover:underline">Mark Complete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
