// src/pages/api/notifications/push-subscribe.ts
// POST /api/notifications/push-subscribe
// Saves a browser's Web Push subscription to the database

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { endpoint, keys } = body || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return json({ error: 'Missing endpoint or keys' }, 400);
  }

  const userAgent = request.headers.get('user-agent') || '';

  const { error } = await db
    .from('push_subscriptions')
    .upsert(
      {
        user_id:    user.id,
        endpoint,
        p256dh:     keys.p256dh,
        auth_key:   keys.auth,
        user_agent: userAgent.slice(0, 300),
        last_used:  new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    );

  if (error) {
    console.error('push-subscribe error:', error.message);
    return json({ error: 'Failed to save subscription' }, 500);
  }

  return json({ success: true });
};

