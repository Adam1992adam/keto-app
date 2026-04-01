// src/pages/api/cron/winback-email.ts
// GET /api/cron/winback-email
// Runs daily at 10am UTC — sends win-back email to users who haven't checked in for 3 days

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendWinbackEmail } from '../../../lib/email';

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = import.meta.env.CRON_SECRET;
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return json({ error: 'Forbidden' }, 403);
  }

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceKey  = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return json({ error: 'Supabase not configured' }, 500);

  const db = createClient(supabaseUrl, serviceKey);

  const today    = new Date().toISOString().split('T')[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
  const tenDaysAgo   = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];

  // Active users who have at least one check-in ever (so they started)
  const { data: profiles } = await db
    .from('profiles')
    .select('id, email, full_name, subscription_status')
    .eq('subscription_status', 'active');

  if (!profiles?.length) return json({ success: true, sent: 0 });

  let sent = 0;
  let skipped = 0;

  for (const profile of profiles) {
    if (!profile.email) { skipped++; continue; }

    try {
      // Find their most recent check-in
      const { data: lastCheckin } = await db
        .from('daily_checkins')
        .select('checkin_date')
        .eq('user_id', profile.id)
        .order('checkin_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Skip if: never checked in, checked in within 3 days, or last checkin was 10+ days ago
      // (10+ days = already sent win-back, avoid repeat spam)
      if (!lastCheckin) { skipped++; continue; }
      if (lastCheckin.checkin_date >= threeDaysAgo) { skipped++; continue; }
      if (lastCheckin.checkin_date < tenDaysAgo) { skipped++; continue; }

      // Check we haven't already sent a win-back in last 7 days
      // We do this by checking if there's a win-back notification in that window
      const { data: recentWinback } = await db
        .from('notifications')
        .select('id')
        .eq('user_id', profile.id)
        .eq('type', 'winback_email')
        .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
        .maybeSingle();

      if (recentWinback) { skipped++; continue; }

      // Get journey for context
      const { data: journey } = await db
        .from('user_journey')
        .select('current_day')
        .eq('user_id', profile.id)
        .maybeSingle();

      const currentDay = journey?.current_day || 1;
      const daysMissed = Math.floor(
        (new Date(today).getTime() - new Date(lastCheckin.checkin_date).getTime()) / 86400000
      );

      await sendWinbackEmail(profile.email, profile.full_name || 'there', daysMissed, currentDay);

      // Record that we sent the win-back (to avoid repeat sends)
      await db.from('notifications').insert({
        user_id:    profile.id,
        type:       'winback_email',
        title:      'Win-back email sent',
        body:       `Sent after ${daysMissed} days of inactivity`,
        priority:   'low',
        is_read:    true,
        is_dismissed: true,
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      });

      sent++;
      await new Promise(r => setTimeout(r, 150));

    } catch (err: any) {
      console.error(`Win-back error for ${profile.email}:`, err?.message);
    }
  }

  return json({ success: true, sent, skipped });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
