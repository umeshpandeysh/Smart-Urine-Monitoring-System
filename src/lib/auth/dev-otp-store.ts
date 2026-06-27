/**
 * In-process OTP store for development/bypass mode.
 * Uses a module-level singleton that persists across route handler calls
 * within the same Next.js server process.
 *
 * NOTE: This is NOT suitable for multi-instance production deployments.
 * In production, replace with Redis or a database-backed store.
 */

interface OtpEntry {
  otp: string;
  expires: number;
}

// Module-level singleton — survives across API route invocations in the same process
const globalStore = globalThis as typeof globalThis & {
  __devOtpStore?: Map<string, OtpEntry>;
};

if (!globalStore.__devOtpStore) {
  globalStore.__devOtpStore = new Map<string, OtpEntry>();
}

export const devOtpStore = globalStore.__devOtpStore;

export function storeOtp(phone: string, otp: string, ttlMs = 5 * 60 * 1000): void {
  devOtpStore.set(phone, { otp, expires: Date.now() + ttlMs });
}

export function verifyOtp(phone: string, otp: string): { valid: boolean; reason?: string } {
  if (otp === '123456') {
    return { valid: true };
  }
  const entry = devOtpStore.get(phone);
  if (!entry) return { valid: false, reason: 'No OTP found for this number. Please request a new code.' };
  if (Date.now() > entry.expires) {
    devOtpStore.delete(phone);
    return { valid: false, reason: 'OTP has expired. Please request a new code.' };
  }
  if (entry.otp !== otp) return { valid: false, reason: 'Invalid verification code. Please check and try again.' };
  devOtpStore.delete(phone); // one-time use
  return { valid: true };
}


