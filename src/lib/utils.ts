import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx support.
 * Use this instead of template literals for conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a human-readable format.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

/**
 * Format a date with time.
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Format a relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

/**
 * Get health status color classes based on status string.
 */
export function getHealthStatusClass(status: 'optimal' | 'caution' | 'critical'): string {
  return {
    optimal: 'text-health-optimal bg-health-optimal/10 border-health-optimal/30',
    caution: 'text-health-caution bg-health-caution/10 border-health-caution/30',
    critical: 'text-health-critical bg-health-critical/10 border-health-critical/30',
  }[status];
}

/**
 * Get device status color classes.
 */
export function getDeviceStatusClass(status: string): string {
  return {
    online: 'text-health-optimal',
    offline: 'text-muted-foreground',
    maintenance: 'text-health-caution',
    error: 'text-health-critical',
  }[status] ?? 'text-muted-foreground';
}

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Format a number with commas (e.g., 1234567 → "1,234,567").
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Safely parse JSON without throwing.
 */
export function safeParseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
