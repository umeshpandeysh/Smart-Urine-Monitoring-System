import { Tables } from './database.types';

// ============================================================
// Re-export table row types with friendly names
// ============================================================
export type Organization = Tables<'organizations'>;
export type Location = Tables<'locations'>;
export type Profile = Tables<'profiles'>;
export type Device = Tables<'devices'>;
export type SensorReading = Tables<'sensor_readings'>;
export type Report = Tables<'reports'>;
export type Notification = Tables<'notifications'>;
export type DeviceTelemetry = Tables<'device_telemetry'>;
export type BladderDiaryEntry = Tables<'bladder_diary_entries'>;

// ============================================================
// Role types
// ============================================================
export type UserRole = 'patient' | 'admin' | 'operator';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type ReportStatus = 'pending' | 'processing' | 'complete' | 'error';
export type NotificationType = 'info' | 'warning' | 'critical' | 'success';
export type RiskLevel = 'low' | 'medium' | 'high';
export type HealthStatus = 'optimal' | 'caution' | 'critical';

// ============================================================
// Composite / UI types
// ============================================================
export interface DashboardStats {
  totalReadings: number;
  totalReports: number;
  lastReadingAt: string | null;
  hydrationIndex: number | null;
  riskLevel: RiskLevel | null;
  unreadNotifications: number;
}

export interface DeviceHealthSummary {
  device: Device;
  lastTelemetry: DeviceTelemetry | null;
  location: Location | null;
  readingCount24h: number;
}

export interface ReportWithReading extends Report {
  sensor_reading: SensorReading | null;
}

export interface ParameterStatus {
  name: string;
  value: number | null;
  unit: string;
  status: HealthStatus;
  range: { min: number; max: number; optimal: { min: number; max: number } };
}

// ============================================================
// Telemetry / IoT payload types
// ============================================================
export interface TelemetryPayload {
  device_id: string;
  api_key: string;
  readings: {
    ph: number;
    tds_ppm: number;
    turbidity_ntu: number;
    temperature_c: number;
    flow_rate_ml_min: number;
    total_volume_ml: number;
    color_r: number;
    color_g: number;
    color_b: number;
    hydration_index: number;
  };
  device_health: {
    cpu_temp: number;
    wifi_rssi: number;
    free_heap: number;
    uptime_seconds: number;
  };
  recorded_at: string;
}

// ============================================================
// API response types
// ============================================================
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// Navigation types
// ============================================================
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  requiredRole?: UserRole;
}
