import React from 'react';
import { requireAuth, getCurrentProfile } from '@/lib/auth/guards';
import PortalNavigation from '@/components/navigation/portal-navigation';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const profile = await getCurrentProfile();

  const initials = `${profile?.first_name?.[0] || 'U'}${profile?.last_name?.[0] || 'P'}`.toUpperCase();
  const fullName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}` 
    : 'UroSense Patient';
  const role = profile?.role || 'patient';

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Client Side Navigation System */}
      <PortalNavigation
        initials={initials}
        fullName={fullName}
        role={role}
      />

      {/* Main Content Pane */}
      <main className="flex-1 md:ml-64 min-h-screen pb-20 md:pb-6">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
