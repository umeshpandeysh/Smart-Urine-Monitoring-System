import type { Metadata } from 'next';
import { requireAuth, getCurrentProfile } from '@/lib/auth/guards';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  await requireAuth();
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and privacy preferences.</p>
      </div>

      {/* Profile info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Name', value: profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Not set' : '—' },
            { label: 'Role', value: profile?.role ?? '—' },
            { label: 'Risk Level', value: profile?.risk_level ?? 'Not assessed' },
            { label: 'Timezone', value: profile?.timezone ?? 'UTC' },
            { label: 'Member since', value: profile ? formatDate(profile.created_at) : '—' },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{row.label}</p>
              <p className="font-medium text-foreground capitalize">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Privacy & Data</h2>
        <div className="space-y-3">
          {[
            { title: 'Anonymous data contribution', desc: 'Your de-identified readings contribute to population health analytics.', enabled: true },
            { title: 'Notification preferences', desc: 'Receive health alerts and critical parameter warnings.', enabled: true },
          ].map((setting) => (
            <div key={setting.title} className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{setting.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
              </div>
              <div
                className={`w-10 h-5 rounded-full border transition-colors ${
                  setting.enabled ? 'bg-primary border-primary' : 'bg-muted-foreground/20 border-border'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white m-0.5 transition-transform ${
                    setting.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          UroSense uses passwordless OTP authentication. Your health data is encrypted at rest
          using AES-256 and transmitted over TLS 1.3.
        </p>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive text-sm hover:bg-destructive/10 transition-colors"
          >
            Sign out of all devices
          </button>
        </form>
      </div>
    </div>
  );
}
