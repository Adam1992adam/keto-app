// src/pages/api/notifications/push-unsubscribe.ts
// POST /api/notifications/push-unsubscribe
// Removes a push subscription (user turned off notifications)

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try { body = await request.json(); } catch { body = {}; }

  const { endpoint } = body || {};

  if (endpoint) {
    // Remove specific subscription (one browser)
    await db.from('push_subscriptions').delete()
      .eq('user_id', user.id).eq('endpoint', endpoint);
  } else {
    // Remove all subscriptions for this user
    await db.from('push_subscriptions').delete().eq('user_id', user.id);
  }

  return json({ success: true });
};

