import { createHash, randomBytes } from 'crypto';

/**
 * Hash a plain text token using SHA-256 for secure storage.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a new random device token and its hashed counterpart.
 */
export function generateDeviceToken(): { rawToken: string; hashedToken: string } {
  // Generate 32 bytes cryptographically secure random token
  const rawToken = `US_DEV_${randomBytes(24).toString('hex')}`;
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
}
