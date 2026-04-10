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
      const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];

      const [
        { data: journey },
        { data: weekCheckins },
        { data: weekXp },
        { data: latestWeight },
        { data: startData },
        { data: weekTasks },
        { data: weekFoodLogs },
        { data: weekWeightLogs },
        { data: prevWeightLog },
        { data: fastingSessions },
      ] = await Promise.all([
        db.from('user_journey').select('current_day, streak_days, total_xp, level').eq('user_id', profile.id).maybeSingle(),
        db.from('daily_checkins').select('energy_level, mood_level, water_glasses, brain_fog').eq('user_id', profile.id).gte('checkin_date', weekAgo).lte('checkin_date', today),
        db.from('xp_transactions').select('xp_amount').eq('user_id', profile.id).gte('created_at', weekAgoIso),
        db.from('weight_logs').select('weight').eq('user_id', profile.id).order('logged_date', { ascending: false }).limit(1).maybeSingle(),
        db.from('onboarding_data').select('current_weight').eq('user_id', profile.id).maybeSingle(),
        db.from('daily_tasks').select('completed').eq('user_id', profile.id).gte('created_at', weekAgoIso),
        db.from('food_logs').select('food_name').eq('user_id', profile.id).gte('logged_date', weekAgo).lte('logged_date', today),
        db.from('weight_logs').select('weight, logged_date').eq('user_id', profile.id).gte('logged_date', weekAgo).lte('logged_date', today).order('logged_date', { ascending: true }),
        db.from('weight_logs').select('weight').eq('user_id', profile.id).gte('logged_date', twoWeeksAgo).lt('logged_date', weekAgo).order('logged_date', { ascending: false }).limit(1).maybeSingle(),
        db.from('fasting_sessions').select('id').eq('user_id', profile.id).gte('started_at', weekAgoIso).not('ended_at', 'is', null),
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

      const avgMood = checkins > 0
        ? (weekCheckins || []).reduce((s: number, c: any) => s + (c.mood_level || 3), 0) / checkins
        : 0;

      const waterAvg = checkins > 0
        ? (weekCheckins || []).reduce((s: number, c: any) => s + (c.water_glasses || 0), 0) / checkins
        : 0;

      const startWeight   = startData?.current_weight || 0;
      const currentWeight = latestWeight?.weight || startWeight;
      const weightLost    = Math.max(0, startWeight - currentWeight);

      const tasksTotal     = weekTasks?.length || 0;
      const tasksCompleted = (weekTasks || []).filter((t: any) => t.completed).length;

      // Top foods this week (top 3 by frequency)
      const foodCounts: Record<string, number> = {};
      for (const f of (weekFoodLogs || [])) {
        if (f.food_name) foodCounts[f.food_name] = (foodCounts[f.food_name] || 0) + 1;
      }
      const topFoods = Object.entries(foodCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      // Week-over-week weight delta
      let weekWeightDelta: number | undefined;
      const thisWeekWeights = weekWeightLogs || [];
      if (thisWeekWeights.length >= 1) {
        const weekEndWeight   = thisWeekWeights[thisWeekWeights.length - 1]?.weight;
        const weekStartWeight = prevWeightLog?.weight || (thisWeekWeights.length >= 2 ? thisWeekWeights[0].weight : undefined);
        if (weekEndWeight && weekStartWeight) {
          weekWeightDelta = parseFloat((weekEndWeight - weekStartWeight).toFixed(2));
        }
      }

      const fasCount = fastingSessions?.length || 0;

      // Single most actionable insight for the email
      const topInsight = getEmailInsight({ checkins, avgEnergy, avgMood, waterAvg, weekWeightDelta, fastingSessions: fasCount, streak, currentDay });

      await sendWeeklySummaryEmail(profile.email, profile.full_name || 'there', {
        weekNum, currentDay, streak, checkins, xpEarned, totalXp, level, weightLost, weekWeightDelta,
        avgEnergy, avgMood, tasksCompleted, tasksTotal, waterAvg, topFoods,
        fastingSessions: fasCount, topInsight,
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

function getEmailInsight(p: {
  checkins: number; avgEnergy: number; avgMood: number; waterAvg: number;
  weekWeightDelta?: number; fastingSessions: number; streak: number; currentDay: number;
}): { icon: string; title: string; body: string } | undefined {
  const { checkins, avgEnergy, waterAvg, weekWeightDelta, fastingSessions, streak, currentDay } = p;
  if (checkins < 2) return undefined; // not enough data

  // Warnings first (most actionable)
  if (waterAvg < 4)
    return { icon: '💧', title: 'Hydration needs attention',
      body: `Your average was ${waterAvg.toFixed(1)} glasses/day this week. Keto increases fluid loss — aim for 8+ glasses daily to avoid fatigue and support electrolyte balance.` };

  if (avgEnergy < 2.5)
    return { icon: '⚠️', title: 'Energy was low this week',
      body: `Average energy of ${avgEnergy.toFixed(1)}/5 suggests your body may be under-fuelled. Check you're hitting your fat macro (70%+ of calories) and consider adding a pinch of sea salt to meals.` };

  if (weekWeightDelta !== undefined && weekWeightDelta > 1.0)
    return { icon: '📈', title: 'Weight increase this week',
      body: `You gained ${weekWeightDelta.toFixed(1)} kg this week. This is often water retention — check your carb intake and sodium levels, and don't be discouraged. One week doesn't define your trend.` };

  // Positives
  if (weekWeightDelta !== undefined && weekWeightDelta < -0.8)
    return { icon: '🎯', title: 'Strong weight loss this week!',
      body: `You lost ${Math.abs(weekWeightDelta).toFixed(1)} kg in 7 days — well above the typical 0.5 kg/week on keto. Your consistency with meals and tracking is paying off.` };

  if (fastingSessions >= 4)
    return { icon: '⚡', title: 'Fasting superstar!',
      body: `${fastingSessions} fasting sessions this week. Combining intermittent fasting with keto accelerates fat adaptation and autophagy — you're doing everything right.` };

  if (streak >= 21)
    return { icon: '🔥', title: `${streak}-day habit locked in`,
      body: `At ${streak} days, your check-in habit is now automatic. Research shows 21+ days cements a behaviour change. This consistency is what makes the difference long-term.` };

  if (avgEnergy >= 4.5 && checkins >= 5)
    return { icon: '✨', title: 'Peak energy week!',
      body: `Averaging ${avgEnergy.toFixed(1)}/5 energy across ${checkins} days means your body is fully keto-adapted. This is what optimal fat-burning feels like — stay consistent.` };

  if (currentDay >= 14 && currentDay <= 21)
    return { icon: '🧠', title: 'Keto adaptation almost complete',
      body: `You're in the 14–21 day window where most people achieve full keto adaptation. Mental clarity, stable energy, and reduced hunger should be increasing. You're right on track.` };

  return undefined;
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
