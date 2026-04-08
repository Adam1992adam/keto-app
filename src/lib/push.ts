// src/lib/push.ts
// Web Push notification helper — server-side only
// Uses web-push (VAPID) to send notifications to subscribed browsers

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// ── VAPID setup ───────────────────────────────────────────────
function getWebPush() {
  const publicKey  = import.meta.env.PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = import.meta.env.VAPID_PRIVATE_KEY;
  const email      = import.meta.env.VAPID_EMAIL || 'mailto:admin@ketojourney.fun';

  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys not configured. Add PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to .env');
  }

  webpush.setVapidDetails(email, publicKey, privateKey);
  return webpush;
}

// ── Service-role client for push (bypasses RLS to read subscriptions) ──
function getServiceClient() {
  const url     = import.meta.env.PUBLIC_SUPABASE_URL;
  const roleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !roleKey) throw new Error('Supabase service role key not configured');
  return createClient(url, roleKey);
}

// ── Payload shape ─────────────────────────────────────────────
export interface PushPayload {
  title:    string;
  body:     string;
  icon?:    string;
  badge?:   string;
  url?:     string;
  tag?:     string;
  priority?: 'low' | 'normal' | 'urgent';
}

// ── Send push to a single user (all their subscribed browsers) ─
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  const db = getServiceClient();
  const wp = getWebPush();

  const { data: subs, error } = await db
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth_key')
    .eq('user_id', userId);

  if (error || !subs?.length) return { sent: 0, failed: 0 };

  const message = JSON.stringify({
    title:  payload.title,
    body:   payload.body,
    icon:   payload.icon  || '/icon-192.png',
    badge:  payload.badge || '/icon-72.png',
    url:    payload.url   || '/dashboard',
    tag:    payload.tag   || 'keto',
    priority: payload.priority || 'normal',
  });

  const staleIds: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await wp.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          message,
          { TTL: 86400, urgency: payload.priority === 'urgent' ? 'high' : 'normal' }
        );
        sent++;
        // Update last_used timestamp
        await db.from('push_subscriptions').update({ last_used: new Date().toISOString() }).eq('id', sub.id);
      } catch (err: any) {
        // 404/410 = subscription expired, remove it
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          staleIds.push(sub.id);
        }
        failed++;
      }
    })
  );

  // Clean up stale subscriptions
  if (staleIds.length > 0) {
    await db.from('push_subscriptions').delete().in('id', staleIds);
  }

  return { sent, failed };
}

// ── Send push to multiple users (e.g. cron broadcast) ─────────
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload
): Promise<{ total_sent: number; total_failed: number }> {
  let total_sent = 0;
  let total_failed = 0;

  // Process in batches of 10 to avoid overwhelming the push service
  const batchSize = 10;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(uid => sendPushToUser(uid, payload))
    );
    results.forEach(r => {
      if (r.status === 'fulfilled') {
        total_sent   += r.value.sent;
        total_failed += r.value.failed;
      }
    });
  }

  return { total_sent, total_failed };
}
