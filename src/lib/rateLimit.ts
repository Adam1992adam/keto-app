/**
 * rateLimit.ts — In-process sliding-window rate limiter
 *
 * Works per Vercel function instance. Rapid burst attacks (the main threat
 * for brute-force) are always routed to the same warm instance, so this
 * provides effective protection with zero extra latency or DB cost.
 * Supabase Auth's own server-side throttling acts as a second layer.
 */

interface Entry {
  count:   number;
  resetAt: number;
}

// One shared Map per module instance (persists across requests on a warm Lambda)
const store = new Map<string, Entry>();

// Purge expired keys every 10 minutes to prevent memory growth
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 10 * 60 * 1000);
}

/**
 * Check whether a keyed action is within its allowed rate.
 *
 * @param key         Unique key, e.g. `login:1.2.3.4`
 * @param max         Max requests allowed in the window
 * @param windowMs    Window size in milliseconds
 * @returns           `{ allowed, retryAfterSec }`
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec: number } {
  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Extract the real client IP from a Vercel/Astro request.
 * Prefers the rightmost trusted hop in X-Forwarded-For.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    // Vercel sets x-forwarded-for to a single value (the real client IP)
    return xff.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
