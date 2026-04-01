// src/pages/api/notifications/index.ts
// GET  /api/notifications      — جلب الإشعارات
// POST /api/notifications      — mark as read / dismiss

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies, url }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const limit = parseInt(url.searchParams.get('limit') || '20');

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_dismissed', false)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(limit);

  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  return json({ notifications: notifications || [], unreadCount });
};

export const POST: APIRoute = async ({ cookies, request }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const body = await request.json();
  const { action, notificationId, all } = body;

  if (action === 'read') {
    if (all) {
      await supabase.from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    } else if (notificationId) {
      await supabase.from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
    }
  }

  if (action === 'dismiss' && notificationId) {
    await supabase.from('notifications')
      .update({ is_dismissed: true, is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);
  }

  if (action === 'dismiss_all') {
    await supabase.from('notifications')
      .update({ is_dismissed: true, is_read: true })
      .eq('user_id', user.id);
  }

  return json({ success: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}