import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/guards';
import { getCurrentProfile } from '@/lib/auth/guards';
import { getNotifications, markNotificationsRead } from '@/lib/supabase/queries';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Notifications' };

export default async function NotificationsPage() {
  await requireAuth();
  const profile = await getCurrentProfile();
  const notifications = profile ? await getNotifications(profile.id) : [];
  if (profile) await markNotificationsRead(profile.id);

  const typeConfig = {
    info: { icon: 'ℹ', color: 'text-primary border-primary/30 bg-primary/5' },
    warning: { icon: '⚠', color: 'text-health-caution border-health-caution/30 bg-health-caution/5' },
    critical: { icon: '🚨', color: 'text-health-critical border-health-critical/30 bg-health-critical/5' },
    success: { icon: '✓', color: 'text-health-optimal border-health-optimal/30 bg-health-optimal/5' },
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Health alerts and system messages from UroSense.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🔔</p>
          <p className="font-display text-xl font-semibold text-foreground mb-2">All clear</p>
          <p className="text-muted-foreground text-sm">No notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const config = typeConfig[notif.type];
            return (
              <div key={notif.id} className={`glass rounded-xl p-4 border ${config.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{notif.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatRelativeTime(notif.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
