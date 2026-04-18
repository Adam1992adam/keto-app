import type { APIRoute } from 'astro';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  // Rate limit: 5 attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = await checkRateLimit(`admin-verify:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return new Response(JSON.stringify({ success: false, error: `Too many attempts. Try again in ${retryAfterSec}s.` }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfterSec) },
    });
  }

  try {
    const env = (locals as any)?.runtime?.env || {};
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;
    const APP_URL = process.env.PUBLIC_APP_URL || import.meta.env.PUBLIC_APP_URL || '';

    // CSRF: verify request originates from our own domain
    const origin  = request.headers.get('origin')  || '';
    const referer = request.headers.get('referer') || '';
    const allowed = APP_URL
      ? (origin.startsWith(APP_URL) || referer.startsWith(APP_URL))
      : (origin.includes('localhost') || origin.includes('ketojourney'));
    if (!allowed) {
      return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { password } = await request.json();

    // Constant-time comparison — prevents timing attacks that === leaks.
    // timingSafeEqual requires equal-length buffers; pad both to the same
    // length so the loop always runs regardless of length mismatch.
    const { timingSafeEqual } = await import('crypto');
    const enc    = new TextEncoder();
    const a      = enc.encode(String(password       ?? ''));
    const b      = enc.encode(String(ADMIN_PASSWORD ?? ''));
    const maxLen = Math.max(a.length, b.length);
    const pa = new Uint8Array(maxLen); pa.set(a);
    const pb = new Uint8Array(maxLen); pb.set(b);
    const passwordsMatch = a.length === b.length && timingSafeEqual(pa, pb);

    if (!ADMIN_PASSWORD || !passwordsMatch) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // حفظ session cookie
    cookies.set('admin-session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 ساعات
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete('admin-session', { path: '/' });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};