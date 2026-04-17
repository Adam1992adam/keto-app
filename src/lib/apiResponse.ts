/**
 * Shared JSON response helper — used by all API routes.
 * Centralised here to avoid duplicating 6 lines across 60+ files.
 */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
