// src/pages/api/cron/daily-push.ts
// GET /api/cron/daily-push
// Scheduled daily — sends push notifications for:
//   • Morning reminder (if no check-in yet today)
//   • Evening streak warning (if streak > 0 and still no check-in)
//
// Call twice per day from Cloudflare Cron Triggers:
//   • 8:00 UTC  → morning=true
//   • 18:00 UTC → morning=false (streak warning)

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendPushToUser } from '../../../lib/push';

export const GET: APIRoute = async ({ request, locals }) => {
  // ── Auth ────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  // @ts-ignore
  const env = locals?.runtime?.env || {};
  const CRON_SECRET = env.CRON_SECRET || import.meta.env.CRON_SECRET;

  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return json({ error: 'Forbidden' }, 403);
  }

  const url      = new URL(request.url);
  const morning  = url.searchParams.get('morning') !== 'false';
  const today    = new Date().toISOString().split('T')[0];

  // ── Service-role client ─────────────────────────────────────
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
  const serviceKey  = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return json({ error: 'Supabase not configured' }, 500);

  const db = createClient(supabaseUrl, serviceKey);

  // ── Get all users who have push subscriptions ───────────────
  const { data: subs } = await db
    .from('push_subscriptions')
    .select('user_id')
    .order('user_id');

  if (!subs?.length) return json({ success: true, sent: 0, note: 'no subscribers' });

  // Deduplicate user IDs
  const userIds = [...new Set(subs.map(s => s.user_id))];

  let sent = 0;
  let skipped = 0;

  for (const userId of userIds) {
    try {
      // Check if user already checked in today
      const { data: checkin } = await db
        .from('daily_checkins')
        .select('id')
        .eq('user_id', userId)
        .eq('checkin_date', today)
        .maybeSingle();

      if (checkin) {
        skipped++;
        continue; // Already checked in — no need to remind
      }

      // Check notification preferences
      const { data: prefs } = await db
        .from('notification_preferences')
        .select('push_enabled, checkin_reminders, streak_warnings')
        .eq('user_id', userId)
        .maybeSingle();

      // Default: push enabled for everything
      const pushEnabled       = prefs?.push_enabled !== false;
      const checkinEnabled    = prefs?.checkin_reminders !== false;
      const streakEnabled     = prefs?.streak_warnings !== false;

      if (!pushEnabled) { skipped++; continue; }

      if (morning && checkinEnabled) {
        // Morning: gentle daily reminder
        const { data: journey } = await db
          .from('user_journey')
          .select('current_day, streak_days')
          .eq('user_id', userId)
          .maybeSingle();

        const day    = journey?.current_day || 1;
        const streak = journey?.streak_days || 0;

        const streakNote = streak > 1 ? ` You're on a ${streak}-day streak — keep it going!` : '';
        const result = await sendPushToUser(userId, {
          title:    `Day ${day} Check-in ☀️`,
          body:     `Good morning! Log your daily check-in to earn 30 XP.${streakNote}`,
          url:      '/dashboard/checkin',
          tag:      'checkin_reminder',
          priority: 'normal',
        });
        if (result.sent > 0) sent++;

      } else if (!morning && streakEnabled) {
        // Evening: streak warning if they haven't checked in
        const { data: journey } = await db
          .from('user_journey')
          .select('streak_days')
          .eq('user_id', userId)
          .maybeSingle();

        const streak = journey?.streak_days || 0;

        // Only send streak warning if they have a streak to protect
        if (streak > 0) {
          const result = await sendPushToUser(userId, {
            title:    `⚠️ Streak at risk!`,
            body:     `Your ${streak}-day streak expires at midnight. Check in now to protect it!`,
            url:      '/dashboard/checkin',
            tag:      'streak_warning',
            priority: 'urgent',
          });
          if (result.sent > 0) sent++;
        } else {
          skipped++;
        }
      }
    } catch (err: any) {
      console.error(`Push cron error for user ${userId}:`, err?.message || err);
    }
  }

  return json({
    success: true,
    mode: morning ? 'morning_reminder' : 'evening_streak_warning',
    total_subscribers: userIds.length,
    sent,
    skipped,
  });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
