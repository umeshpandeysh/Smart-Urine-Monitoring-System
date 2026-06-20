import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { UserRole, Profile } from '@/types';

/**
 * Get the current authenticated user's session and profile.
 * Returns null if unauthenticated.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Get the current user's profile including role.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile as unknown as Profile;
}

/**
 * Require authentication. Redirects to /login if unauthenticated.
 * Use in Server Components and Route Handlers.
 */
export async function requireAuth() {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Require a specific role. Redirects to /login or returns 403 if unauthorized.
 */
export async function requireRole(requiredRole: UserRole | UserRole[]) {
  const user = await requireAuth();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/login');
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(profile.role as UserRole)) {
    redirect('/dashboard');
  }

  return { user, profile };
}

/**
 * Require admin role.
 */
export async function requireAdmin() {
  return requireRole('admin');
}

/**
 * Require operator role (or admin).
 */
export async function requireOperator() {
  return requireRole(['operator', 'admin']);
}

/**
 * Check if the current user has a specific role without redirecting.
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(profile.role as UserRole);
}
