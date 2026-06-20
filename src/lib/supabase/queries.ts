import { createClient } from '@/lib/supabase/server';
import type { Profile, SensorReading, Report, Notification, Device, Location } from '@/types';

// ============================================================
// Profile Queries
// ============================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, first_name, last_name, role, weight_kg, timezone, risk_level, location_id, metadata, created_at, updated_at')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, first_name, last_name, role, weight_kg, timezone, risk_level, location_id, metadata, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as Profile[];
}

// ============================================================
// Sensor Reading Queries
// ============================================================

export async function getRecentReadings(profileId: string, limit = 10): Promise<SensorReading[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('profile_id', profileId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as SensorReading[];
}

export async function getReadingById(id: string): Promise<SensorReading | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as SensorReading;
}

// ============================================================
// Report Queries
// ============================================================

export async function getReports(profileId: string, page = 1, pageSize = 10): Promise<Report[]> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const { data, error } = await supabase
    .from('reports')
    .select('id, profile_id, sensor_reading_id, title, summary, ai_summary, status, pdf_url, verification_hash, parameters, created_at, updated_at')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) return [];
  return (data ?? []) as Report[];
}

export async function getReportById(id: string): Promise<Report | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reports')
    .select('id, profile_id, sensor_reading_id, title, summary, ai_summary, status, pdf_url, verification_hash, parameters, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Report;
}

export async function getAllReports(page = 1, pageSize = 20): Promise<Report[]> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const { data, error } = await supabase
    .from('reports')
    .select('id, profile_id, sensor_reading_id, title, summary, ai_summary, status, pdf_url, verification_hash, parameters, created_at, updated_at')
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) return [];
  return (data ?? []) as Report[];
}

// ============================================================
// Notification Queries
// ============================================================

export async function getNotifications(profileId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return [];
  return (data ?? []) as Notification[];
}

export async function getUnreadNotificationCount(profileId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .eq('read', false);

  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationsRead(profileId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('notifications')
    // @ts-expect-error - Type inference bug with Supabase SSR
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ read: true } as any)
    .eq('profile_id', profileId)
    .eq('read', false);
}

// ============================================================
// Device Queries
// ============================================================

export async function getAllDevices(): Promise<Device[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devices')
    .select('id, location_id, serial_number, model, firmware_version, status, battery_level, last_seen_at, metadata, created_at, updated_at')
    .order('last_seen_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as Device[];
}

export async function getDevicesByLocation(locationId: string): Promise<Device[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('devices')
    .select('id, location_id, serial_number, model, firmware_version, status, battery_level, last_seen_at, metadata, created_at, updated_at')
    .eq('location_id', locationId)
    .order('status');

  if (error) return [];
  return (data ?? []) as Device[];
}

// ============================================================
// Location Queries
// ============================================================

export async function getAllLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('locations')
    .select('id, organization_id, name, address, city, country, latitude, longitude, active_device_count, created_at, updated_at')
    .order('name');

  if (error) return [];
  return (data ?? []) as Location[];
}

// ============================================================
// Dashboard Stats
// ============================================================

export async function getDashboardStats(profileId: string) {
  const supabase = await createClient();

  const [readingsResult, reportsResult, notifResult] = await Promise.all([
    supabase
      .from('sensor_readings')
      .select('hydration_index, recorded_at', { count: 'exact' })
      .eq('profile_id', profileId)
      .order('recorded_at', { ascending: false })
      .limit(1),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('read', false),
  ]);

  const latestReading = (readingsResult.data ?? [])[0] as { hydration_index: number | null; recorded_at: string } | undefined;

  return {
    totalReadings: readingsResult.count ?? 0,
    totalReports: reportsResult.count ?? 0,
    lastReadingAt: latestReading?.recorded_at ?? null,
    hydrationIndex: latestReading?.hydration_index ?? null,
    unreadNotifications: notifResult.count ?? 0,
  };
}
