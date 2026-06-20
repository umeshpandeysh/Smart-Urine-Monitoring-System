import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth, getCurrentProfile } from '@/lib/auth/guards';
import { getDashboardStats, getRecentReadings, getReports } from '@/lib/supabase/queries';

import HealthStatusCard from '@/components/dashboard/health-status-card';
import HydrationRing from '@/components/dashboard/hydration-ring';
import WellnessTimeline from '@/components/dashboard/wellness-timeline';
import AIHealthNarrative from '@/components/dashboard/ai-health-narrative';
import RecentReports from '@/components/dashboard/recent-reports';
import Recommendations from '@/components/dashboard/recommendations';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  await requireAuth();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/login');
  }

  // Fetch stats, readings, and reports using profile.id (Fixes the Profile ID mismatch bug)
  const [stats, readings, reports] = await Promise.all([
    getDashboardStats(profile.id),
    getRecentReadings(profile.id, 5),
    getReports(profile.id, 1, 3),
  ]);

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      
      {/* Personalized Greeting */}
      <div>
        <h1 className="font-display text-3xl font-light text-[#111827] tracking-tight">
          Good{' '}
          {new Date().getHours() < 12
            ? 'morning'
            : new Date().getHours() < 18
            ? 'afternoon'
            : 'evening'}
          {profile.first_name ? `, ${profile.first_name}` : ''}
        </h1>
        <p className="text-xs text-[#6B7280] font-light mt-1">
          Today&apos;s biological health overview.
        </p>
      </div>

      {/* Health Status Block */}
      <HealthStatusCard hydrationIndex={stats.hydrationIndex} />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Hydration Ring */}
        <div className="lg:col-span-4">
          <HydrationRing hydrationIndex={stats.hydrationIndex} />
        </div>

        {/* Center: Weekly Wellness Timeline */}
        <div className="lg:col-span-8">
          <WellnessTimeline readings={readings} />
        </div>

      </div>

      {/* AI Health Narrative slip */}
      <AIHealthNarrative hydrationIndex={stats.hydrationIndex} />

      {/* Action Plan Recommendations */}
      <Recommendations hydrationIndex={stats.hydrationIndex} />

      {/* Recent Diagnostic Records */}
      <RecentReports reports={reports} />

    </div>
  );
}
