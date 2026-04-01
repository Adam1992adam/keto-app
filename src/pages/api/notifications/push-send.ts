// src/pages/api/notifications/push-send.ts
// POST /api/notifications/push-send
// Internal endpoint — sends a push notification to a specific user
// Protected by CRON_SECRET (same as cron jobs)

import type { APIRoute } from 'astro';
import { sendPushToUser } from '../../../lib/push';

export const POST: APIRoute = async ({ request, locals }) => {
  // Auth: CRON_SECRET or same-origin request
  const authHeader = request.headers.get('authorization');
  // @ts-ignore
  const env = locals?.runtime?.env || {};
  const CRON_SECRET = env.CRON_SECRET || import.meta.env.CRON_SECRET;

  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    // Also allow calls from within the same Cloudflare Pages function
    const origin = request.headers.get('origin') || '';
    const host   = new URL(request.url).host;
    if (!origin.includes(host)) {
      return json({ error: 'Forbidden' }, 403);
    }
  }

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { userId, title, message, url, tag, priority } = body || {};
  if (!userId || !title || !message) {
    return json({ error: 'userId, title, and message are required' }, 400);
  }

  try {
    const result = await sendPushToUser(userId, {
      title,
      body: message,
      url:  url   || '/dashboard',
      tag:  tag   || 'keto',
      priority: priority || 'normal',
    });

    return json({ success: true, ...result });
  } catch (err: any) {
    console.error('push-send error:', err?.message || err);
    return json({ error: err?.message || 'Failed' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
