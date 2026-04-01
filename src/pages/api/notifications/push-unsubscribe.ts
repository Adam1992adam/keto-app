// src/pages/api/notifications/push-unsubscribe.ts
// POST /api/notifications/push-unsubscribe
// Removes a push subscription (user turned off notifications)

import type { APIRoute } from 'astro';
import { getUserClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const db = getUserClient(accessToken);
  const { data: { user } } = await db.auth.getUser(accessToken);
  if (!user) return json({ error: 'Unauthorized' }, 401);

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

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
