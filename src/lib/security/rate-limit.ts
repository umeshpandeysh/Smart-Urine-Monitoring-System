import { createServiceClient } from '@/lib/supabase/server';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // in seconds
}

/**
 * Checks rate limiting against a persistent PostgreSQL database store.
 * Supports cooldown periods (brute-force lockout blocks).
 *
 * @param key unique key identifier (e.g. "ip:127.0.0.1" or "phone:+919999999999")
 * @param limit maximum request threshold allowed within window
 * @param windowSeconds duration of validation window in seconds
 * @param cooldownMinutes duration of account lockout period if threshold is breached
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  cooldownMinutes = 15
): Promise<RateLimitResult> {
  const supabase = createServiceClient() as any;
  const now = new Date();

  try {
    // 1. Fetch current rate limit logs for key
    const { data, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      // If code is not "no rows found", log query error and fallback to allowed state
      console.error('Rate limit query warning:', error.message);
      return { allowed: true, remaining: 1, reset: windowSeconds };
    }

    // 2. Key does not exist in logs: create first record
    if (!data) {
      const { error: insertError } = await supabase
        .from('rate_limits')
        .insert({
          key,
          request_count: 1,
          window_started_at: now.toISOString(),
        });

      if (insertError) {
        console.error('Rate limit creation warning:', insertError.message);
      }
      return { allowed: true, remaining: limit - 1, reset: windowSeconds };
    }

    // 3. Key is blocked in active cooldown/lockout period
    if (data.blocked_until && new Date(data.blocked_until) > now) {
      const blockedMs = new Date(data.blocked_until).getTime() - now.getTime();
      return {
        allowed: false,
        remaining: 0,
        reset: Math.ceil(blockedMs / 1000),
      };
    }

    const windowStart = new Date(data.window_started_at);
    const diffSeconds = (now.getTime() - windowStart.getTime()) / 1000;

    // 4. Rate limit window has expired: reset count
    if (diffSeconds > windowSeconds) {
      const { error: resetError } = await supabase
        .from('rate_limits')
        .update({
          request_count: 1,
          window_started_at: now.toISOString(),
          blocked_until: null,
          updated_at: now.toISOString()
        })
        .eq('key', key);

      if (resetError) {
        console.error('Rate limit reset warning:', resetError.message);
      }
      return { allowed: true, remaining: limit - 1, reset: windowSeconds };
    }

    // 5. Rate limit threshold exceeded: initiate lockout cooldown
    if (data.request_count >= limit) {
      const blockedTime = new Date(now.getTime() + cooldownMinutes * 60 * 1000);
      const { error: blockError } = await supabase
        .from('rate_limits')
        .update({
          blocked_until: blockedTime.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('key', key);

      if (blockError) {
        console.error('Rate limit lockout warning:', blockError.message);
      }
      return {
        allowed: false,
        remaining: 0,
        reset: cooldownMinutes * 60,
      };
    }

    // 6. Threshold not met: increment request counter
    const { error: updateError } = await supabase
      .from('rate_limits')
      .update({
        request_count: data.request_count + 1,
        updated_at: now.toISOString()
      })
      .eq('key', key);

    if (updateError) {
      console.error('Rate limit increment warning:', updateError.message);
    }

    return {
      allowed: true,
      remaining: limit - (data.request_count + 1),
      reset: Math.ceil(windowSeconds - diffSeconds),
    };
  } catch (err: any) {
    console.error('Rate limiting failure, failing open to prevent system block:', err.message);
    return { allowed: true, remaining: 1, reset: windowSeconds };
  }
}
