/**
 * Shared JSON response helper — used by all API routes.
 */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Log an error with user context AND forward it to Sentry (when DSN is configured).
 * Drop-in replacement for console.error in API catch blocks.
 */
export async function captureError(label: string, userId: string, err: unknown): Promise<void> {
  console.error(`[${label}] user:`, userId, err);
  try {
    const Sentry = await import('@sentry/astro');
    Sentry.withScope((scope) => {
      scope.setUser({ id: userId });
      scope.setTag('endpoint', label);
      Sentry.captureException(err);
    });
  } catch {
    // Sentry not available — console.error above is the fallback
  }
}
