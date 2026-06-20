import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAuth, getCurrentProfile } from '@/lib/auth/guards';
import { getDashboardStats, getRecentReadings } from '@/lib/supabase/queries';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await requireAuth();
  const [profile, stats] = await Promise.all([
    getCurrentProfile(),
    getDashboardStats(user.id),
  ]);
  const readings = await getRecentReadings(user.id, 5);

  const hydrationLabel =
    stats.hydrationIndex === null
      ? 'No data'
      : stats.hydrationIndex >= 70
      ? 'Optimal'
      : stats.hydrationIndex >= 40
      ? 'Caution'
      : 'Critical';

  const hydrationColor =
    stats.hydrationIndex === null
      ? 'text-muted-foreground'
      : stats.hydrationIndex >= 70
      ? 'text-health-optimal'
      : stats.hydrationIndex >= 40
      ? 'text-health-caution'
      : 'text-health-critical';

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Good{' '}
          {new Date().getHours() < 12
            ? 'morning'
            : new Date().getHours() < 18
            ? 'afternoon'
            : 'evening'}
          {profile?.first_name ? `, ${profile.first_name}` : ''}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {stats.lastReadingAt
            ? `Last reading ${formatRelativeTime(stats.lastReadingAt)}`
            : 'No readings yet — visit a UroSense node to get started.'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5 card-hover">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Hydration</p>
          <p className={`font-display text-2xl font-bold ${hydrationColor}`}>
            {stats.hydrationIndex !== null ? `${stats.hydrationIndex}%` : '—'}
          </p>
          <p className={`text-xs font-medium mt-1 ${hydrationColor}`}>{hydrationLabel}</p>
        </div>

        <div className="glass rounded-xl p-5 card-hover">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Total Readings</p>
          <p className="font-display text-2xl font-bold text-foreground">{stats.totalReadings}</p>
          <p className="text-xs text-muted-foreground mt-1">lifetime scans</p>
        </div>

        <div className="glass rounded-xl p-5 card-hover">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Reports</p>
          <p className="font-display text-2xl font-bold text-foreground">{stats.totalReports}</p>
          <Link href="/reports" className="text-xs text-primary hover:underline mt-1 block">View all →</Link>
        </div>

        <div className="glass rounded-xl p-5 card-hover">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Alerts</p>
          <p className={`font-display text-2xl font-bold ${stats.unreadNotifications > 0 ? 'text-health-caution' : 'text-foreground'}`}>
            {stats.unreadNotifications}
          </p>
          <Link href="/notifications" className="text-xs text-primary hover:underline mt-1 block">View inbox →</Link>
        </div>
      </div>

      {/* Recent readings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent Readings</h2>
          <Link href="/reports" className="text-sm text-primary hover:underline">View all</Link>
        </div>

        {readings.length === 0 ? (
          <div className="glass rounded-xl p-10 text-center">
            <p className="text-4xl mb-3">🔬</p>
            <p className="font-display text-lg font-semibold text-foreground mb-2">No readings yet</p>
            <p className="text-sm text-muted-foreground">
              Visit a UroSense diagnostic node to get your first health analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {readings.map((reading) => {
              const hydStatus =
                (reading.hydration_index ?? 0) >= 70
                  ? 'optimal'
                  : (reading.hydration_index ?? 0) >= 40
                  ? 'caution'
                  : 'critical';

              return (
                <div key={reading.id} className="glass rounded-xl p-4 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        hydStatus === 'optimal'
                          ? 'bg-health-optimal'
                          : hydStatus === 'caution'
                          ? 'bg-health-caution'
                          : 'bg-health-critical animate-pulse'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        pH {reading.ph?.toFixed(1) ?? '—'} · TDS {reading.tds_ppm ?? '—'} ppm · Temp {reading.temperature_c?.toFixed(1) ?? '—'}°C
                      </p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(reading.recorded_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-foreground">
                      {reading.hydration_index !== null ? `${reading.hydration_index}%` : '—'}
                    </p>
                    <p className={`text-xs capitalize font-medium ${
                      hydStatus === 'optimal' ? 'text-health-optimal' : hydStatus === 'caution' ? 'text-health-caution' : 'text-health-critical'
                    }`}>{hydStatus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/reports" className="glass rounded-xl p-5 card-hover flex items-center gap-4">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-foreground">View Reports</p>
              <p className="text-xs text-muted-foreground">Download signed PDF reports</p>
            </div>
          </Link>
          <Link href="/notifications" className="glass rounded-xl p-5 card-hover flex items-center gap-4">
            <span className="text-3xl">🔔</span>
            <div>
              <p className="font-medium text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">{stats.unreadNotifications} unread messages</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
