// src/pages/api/cron/weekly-email.ts
// GET /api/cron/weekly-email
// Runs every Monday at 9am UTC — sends weekly progress summary to all active users

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklySummaryEmail } from '../../../lib/email';

export const GET: APIRoute = async ({ request }) => {
  // ── Auth ─────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = process.env.CRON_SECRET || import.meta.env.CRON_SECRET;
  if (!CRON_SECRET) {
    console.error('CRON_SECRET env var is not set — cron job cannot run');
    return json({ error: 'Forbidden' }, 403);
  }
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return json({ error: 'Forbidden' }, 403);
  }

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return json({ error: 'Supabase not configured' }, 500);

  const db = createClient(supabaseUrl, serviceKey);

  // ── Get all active users ──────────────────────────────────────
  const { data: profiles, error } = await db
    .from('profiles')
    .select('id, email, full_name, subscription_status')
    .eq('subscription_status', 'active');

  if (error || !profiles?.length) return json({ success: true, sent: 0, note: 'no active users' });

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  // Idempotency: don't send to users who already got a weekly email in the last 5 days
  const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const profile of profiles) {
    try {
      // Skip if email missing
      if (!profile.email) { skipped++; continue; }

      // Idempotency: skip if we already sent a weekly email to this user in the last 5 days
      const { data: recentEmail } = await db
        .from('xp_transactions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('action_type', 'weekly_email_sent')
        .gte('created_at', fiveDaysAgo)
        .maybeSingle();
      if (recentEmail) { skipped++; continue; }

      // Fetch user stats for the past week in parallel
      const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString();
      const [
        { data: journey },
        { data: weekCheckins },
        { data: weekXp },
        { data: latestWeight },
        { data: startData },
        { data: weekTasks },
      ] = await Promise.all([
        db.from('user_journey').select('current_day, streak_days, total_xp, level').eq('user_id', profile.id).maybeSingle(),
        db.from('daily_checkins').select('energy_level, water_glasses').eq('user_id', profile.id).gte('checkin_date', weekAgo).lte('checkin_date', today),
        db.from('xp_transactions').select('xp_amount').eq('user_id', profile.id).gte('created_at', weekAgoIso),
        db.from('weight_logs').select('weight').eq('user_id', profile.id).order('logged_date', { ascending: false }).limit(1).maybeSingle(),
        db.from('onboarding_data').select('current_weight').eq('user_id', profile.id).maybeSingle(),
        db.from('daily_tasks').select('completed').eq('user_id', profile.id).gte('created_at', weekAgoIso),
      ]);

      const currentDay = journey?.current_day || 1;
      const streak     = journey?.streak_days  || 0;
      const totalXp    = journey?.total_xp     || 0;
      const level      = journey?.level        || 1;
      const weekNum    = Math.ceil(currentDay / 7);
      const checkins   = weekCheckins?.length || 0;

      // Skip users on Day 1 (nothing to summarise yet)
      if (currentDay <= 1) { skipped++; continue; }

      const xpEarned = (weekXp || []).reduce((s: number, x: any) => s + (x.xp_amount || 0), 0);

      const avgEnergy = checkins > 0
        ? (weekCheckins || []).reduce((s: number, c: any) => s + (c.energy_level || 3), 0) / checkins
        : 0;

      const waterAvg = checkins > 0
        ? (weekCheckins || []).reduce((s: number, c: any) => s + (c.water_glasses || 0), 0) / checkins
        : 0;

      const startWeight   = startData?.current_weight || 0;
      const currentWeight = latestWeight?.weight || startWeight;
      const weightLost    = Math.max(0, startWeight - currentWeight);

      const tasksTotal     = weekTasks?.length || 0;
      const tasksCompleted = (weekTasks || []).filter((t: any) => t.completed).length;

      await sendWeeklySummaryEmail(profile.email, profile.full_name || 'there', {
        weekNum, currentDay, streak, checkins, xpEarned, totalXp, level, weightLost, avgEnergy,
        tasksCompleted, tasksTotal, waterAvg,
      });

      sent++;

      // Log send so we don't double-send this week
      await db.from('xp_transactions').insert({
        user_id:     profile.id,
        action_type: 'weekly_email_sent',
        xp_amount:   0,
        description: `Weekly summary email — Week ${weekNum}`,
      }).catch(() => {});

      // Small delay to stay within Resend rate limits
      await new Promise(r => setTimeout(r, 100));

    } catch (err: any) {
      errors.push(`${profile.email}: ${err?.message || 'unknown'}`);
    }
  }

  return json({ success: true, sent, skipped, errors: errors.length ? errors : undefined });
};

export const POST: APIRoute = GET; // allow manual trigger

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
