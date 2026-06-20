import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllProfiles } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'User Management' };

export default async function AdminUsersPage() {
  await requireAdmin();
  const profiles = await getAllProfiles();

  const roleColor: Record<string, string> = {
    patient: 'text-primary bg-primary/10 border-primary/30',
    admin: 'text-health-caution bg-health-caution/10 border-health-caution/30',
    operator: 'text-health-optimal bg-health-optimal/10 border-health-optimal/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{profiles.length} registered users</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                          <span className="text-primary text-xs font-bold">
                            {profile.first_name?.[0] ?? 'U'}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {profile.first_name
                            ? `${profile.first_name} ${profile.last_name ?? ''}`
                            : 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${roleColor[profile.role] ?? 'text-muted-foreground bg-muted border-border'}`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`capitalize text-xs font-medium ${
                        profile.risk_level === 'high' ? 'text-health-critical' :
                        profile.risk_level === 'medium' ? 'text-health-caution' :
                        'text-health-optimal'
                      }`}>
                        {profile.risk_level ?? 'low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(profile.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
