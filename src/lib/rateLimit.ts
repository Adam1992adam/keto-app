/**
 * rateLimit.ts — Postgres-backed sliding-window rate limiter.
 *
 * Uses the check_rate_limit(p_key, p_max, p_window_ms) RPC function which
 * runs SECURITY DEFINER, making it safe to call with the anon key.
 * Falls open on DB error so auth is never broken by a rate-limit outage.
 */
import { supabase } from './supabase';

export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfterSec: number }> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key:       key,
      p_max:       max,
      p_window_ms: windowMs,
    });

    if (error || !data?.[0]) {
      console.warn('[rateLimit] DB error — failing open:', error?.message);
      return { allowed: true, retryAfterSec: 0 };
    }

    return {
      allowed:        data[0].allowed,
      retryAfterSec:  data[0].retry_after_sec ?? 0,
    };
  } catch (err) {
    console.warn('[rateLimit] unexpected error — failing open:', err);
    return { allowed: true, retryAfterSec: 0 };
  }
}

/** Extract the real client IP from a Vercel/Astro request. */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
