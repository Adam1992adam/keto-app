// src/pages/api/achievements/check.ts
// POST /api/achievements/check
// Called after any major user action to award newly unlocked achievements.

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const ACHIEVEMENTS = [
  // Streak
  { type: 'streak_3',      name: '3-Day Streak',        icon: '🔥', desc: 'Logged in 3 days in a row' },
  { type: 'streak_7',      name: 'Week Streak',          icon: '🌟', desc: '7 consecutive days' },
  { type: 'streak_14',     name: '2-Week Streak',        icon: '💎', desc: '14 consecutive days' },
  { type: 'streak_30',     name: '30-Day Streak',        icon: '👑', desc: '30 consecutive days — elite!' },
  // Journey milestones
  { type: 'day_7',         name: 'Week 1 Complete!',     icon: '📅', desc: 'Finished your first 7 days' },
  { type: 'day_14',        name: 'Two Weeks Strong',     icon: '💪', desc: 'Completed 14 days' },
  { type: 'day_21',        name: 'Three Weeks!',         icon: '🚀', desc: 'Completed 21 days' },
  { type: 'day_30',        name: 'First Month Done!',    icon: '🏆', desc: 'Completed 30 days on keto' },
  // Check-ins
  { type: 'first_checkin', name: 'First Check-in',       icon: '✅', desc: 'Logged your very first check-in' },
  { type: 'checkin_7',     name: '7 Check-ins',          icon: '📋', desc: 'Logged 7 daily check-ins' },
  { type: 'checkin_30',    name: 'Check-in Master',      icon: '🎯', desc: 'Logged 30 daily check-ins' },
  // Meals
  { type: 'first_meal',    name: 'First Meal Tracked',   icon: '🍽️', desc: 'Marked your first meal eaten' },
  { type: 'meals_10',      name: '10 Meals Logged',      icon: '🥗', desc: 'Tracked 10 meals total' },
  // Weight
  { type: 'first_weight',  name: 'First Weigh-in',       icon: '⚖️', desc: 'Logged your starting weight' },
  { type: 'lost_1kg',      name: 'First Kilo Gone!',     icon: '🎉', desc: 'Lost 1kg from start weight' },
  { type: 'lost_3kg',      name: '3kg Down!',            icon: '🔥', desc: '3kg lost — keep going!' },
  { type: 'lost_5kg',      name: '5kg Champion!',        icon: '💪', desc: '5kg lost — incredible!' },
  { type: 'goal_25',       name: '25% to Goal',          icon: '🎯', desc: 'Quarter of the way there' },
  { type: 'goal_50',       name: 'Halfway There!',       icon: '🏃', desc: '50% of your weight goal reached' },
  { type: 'goal_75',       name: '75% to Goal!',         icon: '🚀', desc: 'Almost at your goal weight!' },
  // Fasting
  { type: 'first_fast',    name: 'First Fast Done!',     icon: '⏱️', desc: 'Completed your first fasting session' },
  { type: 'fast_3',        name: '3 Fasts Completed',    icon: '🧘', desc: 'Completed 3 fasting sessions' },
  { type: 'fast_7',        name: 'Fasting Veteran',      icon: '⚡', desc: 'Completed 7 fasting sessions' },
  // XP & Level
  { type: 'xp_100',        name: '100 XP Earned',        icon: '⭐', desc: 'First 100 XP milestone' },
  { type: 'xp_500',        name: '500 XP Legend',        icon: '🌟', desc: 'Earned 500 total XP' },
  { type: 'xp_1000',       name: '1000 XP Master',       icon: '💎', desc: 'Earned 1000 total XP' },
  { type: 'level_3',       name: 'Level 3',              icon: '📈', desc: 'Reached Level 3' },
  { type: 'level_5',       name: 'Level 5 Veteran',      icon: '🏅', desc: 'Reached Level 5' },
  { type: 'level_10',      name: 'Level 10 Legend',      icon: '👑', desc: 'Reached Level 10' },
  // Hydration
  { type: 'hydrated',      name: 'Hydration Hero',       icon: '💧', desc: 'Drank 8 glasses of water in one day' },
];

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);

    const db = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );

    const { data: { user }, error: authErr } = await db.auth.getUser();
    if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

    // Get already-earned achievements
    const { data: existing } = await db
      .from('achievements').select('achievement_type').eq('user_id', user.id);
    const earned = new Set((existing || []).map((a: any) => a.achievement_type));

    // Fetch all state in parallel
    const today = new Date().toISOString().split('T')[0];
    const [journeyRes, checkinsRes, weightRes, fastingRes, mealCompRes, onboardingRes, todayCheckinRes] =
      await Promise.all([
        db.from('user_journey').select('current_day,streak_days,total_xp,level').eq('user_id', user.id).maybeSingle(),
        db.from('daily_checkins').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        db.from('weight_logs').select('weight,logged_date').eq('user_id', user.id).order('logged_date', { ascending: false }).limit(2),
        db.from('fasting_sessions').select('id', { count: 'exact', head: true }).eq('user_id', user.id).not('ended_at', 'is', null),
        db.from('meal_completions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        db.from('onboarding_data').select('current_weight,target_weight').eq('user_id', user.id).maybeSingle(),
        db.from('daily_checkins').select('water_glasses').eq('user_id', user.id).eq('checkin_date', today).maybeSingle(),
      ]);

    const journey       = journeyRes.data;
    const checkinCount  = checkinsRes.count  || 0;
    const weightLogs    = weightRes.data      || [];
    const fastingCount  = fastingRes.count    || 0;
    const mealCount     = mealCompRes.count   || 0;
    const onboarding    = onboardingRes.data;
    const todayCheckin  = todayCheckinRes.data;

    const streak     = journey?.streak_days || 0;
    const currentDay = journey?.current_day || 1;
    const totalXP    = journey?.total_xp    || 0;
    const level      = journey?.level       || 1;

    const startW   = onboarding?.current_weight || 0;
    const goalW    = onboarding?.target_weight  || 0;
    const latestW  = weightLogs[0]?.weight      || startW;
    const lost     = Math.max(0, startW - latestW);
    const toGoal   = Math.max(0.1, startW - goalW);
    const goalPct  = Math.min(100, (lost / toGoal) * 100);

    const conditions: Record<string, boolean> = {
      streak_3:      streak      >= 3,
      streak_7:      streak      >= 7,
      streak_14:     streak      >= 14,
      streak_30:     streak      >= 30,
      day_7:         currentDay  >= 7,
      day_14:        currentDay  >= 14,
      day_21:        currentDay  >= 21,
      day_30:        currentDay  >= 30,
      first_checkin: checkinCount >= 1,
      checkin_7:     checkinCount >= 7,
      checkin_30:    checkinCount >= 30,
      first_meal:    mealCount    >= 1,
      meals_10:      mealCount    >= 10,
      first_weight:  weightLogs.length >= 1,
      lost_1kg:      lost >= 1,
      lost_3kg:      lost >= 3,
      lost_5kg:      lost >= 5,
      goal_25:       goalPct >= 25,
      goal_50:       goalPct >= 50,
      goal_75:       goalPct >= 75,
      first_fast:    fastingCount >= 1,
      fast_3:        fastingCount >= 3,
      fast_7:        fastingCount >= 7,
      xp_100:        totalXP >= 100,
      xp_500:        totalXP >= 500,
      xp_1000:       totalXP >= 1000,
      level_3:       level >= 3,
      level_5:       level >= 5,
      level_10:      level >= 10,
      hydrated:      (todayCheckin?.water_glasses || 0) >= 8,
    };

    // Find newly unlocked
    const newlyEarned = ACHIEVEMENTS.filter(a => !earned.has(a.type) && conditions[a.type]);

    if (newlyEarned.length > 0) {
      try {
        await db.from('achievements').insert(
          newlyEarned.map(a => ({
            user_id:          user.id,
            achievement_type: a.type,
            achievement_name: a.name,
            icon:             a.icon,
            earned_at:        new Date().toISOString(),
          }))
        );
      } catch (err: any) {
        console.warn('Achievement insert error:', err?.message);
      }
    }

    return json({
      newAchievements: newlyEarned.map(a => ({ name: a.name, icon: a.icon, desc: a.desc })),
      totalEarned: earned.size + newlyEarned.length,
    });

  } catch (err: any) {
    console.error('Achievement check error:', err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
