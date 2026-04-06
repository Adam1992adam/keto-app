// src/pages/api/weekly/save.ts
import type { APIRoute } from 'astro';
import { getMaxJourneyDays } from '../../../lib/supabase';
import { autoCompleteTask, checkAchievements } from '../../../lib/autoTask';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase, accessToken } = auth;

    const body = await request.json();
    const {
      week_number, weight_now, weight_start, mood, challenges,
      week_win, improvement, checkin_count, compliance_rate,
      avg_energy, avg_water, xp_earned, meals_completed,
    } = body;

    // Validate week_number against user's plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle();
    const maxDays  = getMaxJourneyDays(profile?.subscription_tier);
    const maxWeeks = Math.ceil(maxDays / 7);
    if (!week_number || week_number < 1 || week_number > maxWeeks) {
      return new Response(JSON.stringify({ error: `Week number must be between 1 and ${maxWeeks} for your plan.` }), { status: 400 });
    }

    // Check if this week's report already exists — award_xp must only fire once per week
    const { data: existingReport } = await supabase
      .from('weekly_reports')
      .select('id')
      .eq('user_id', user.id)
      .eq('week_number', week_number)
      .maybeSingle();

    const isNewReport = !existingReport;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);

    // Smart AI recommendation based on data
    let ai_recommendation = '';
    let ai_adjustment     = '';

    if (compliance_rate >= 80 && avg_energy >= 4) {
      ai_recommendation = 'Exceptional week. You\'re building the habits that will define your transformation. Keep this momentum.';
      ai_adjustment     = 'Consider adding 15 minutes of morning walking next week to accelerate fat oxidation.';
    } else if (compliance_rate < 60) {
      ai_recommendation = 'Compliance was a challenge this week. The fix is preparation, not willpower.';
      ai_adjustment     = 'Meal prep 4 meals on Sunday. Remove non-keto foods from home. Make the right choice the easy choice.';
    } else if (avg_energy < 3) {
      ai_recommendation = 'Low energy signals insufficient fat or electrolytes. Your macros need adjustment.';
      ai_adjustment     = 'Increase daily fat by 15g. Add salt to every meal. Take magnesium at night.';
    } else {
      ai_recommendation = 'Steady progress. Consistency is the most underrated fat-loss tool.';
      ai_adjustment     = 'Focus on sleep quality this week — 7-9 hours boosts fat burning and reduces cravings.';
    }

    const weight_lost = weight_start && weight_now ? Math.max(0, weight_start - weight_now) : null;

    const { error } = await supabase
      .from('weekly_reports')
      .upsert({
        user_id:            user.id,
        week_number,
        week_start_date:    weekStart.toISOString().split('T')[0],
        week_end_date:      now.toISOString().split('T')[0],
        weight_start,
        weight_end:         weight_now,
        weight_lost,
        meals_completed,
        tasks_completed:    checkin_count,
        checkins_completed: checkin_count,
        avg_water_glasses:  avg_water,
        avg_energy_level:   avg_energy,
        xp_earned_this_week: xp_earned,
        ai_recommendation,
        ai_adjustment,
        generated_at:       now.toISOString(),
      }, { onConflict: 'user_id,week_number' });

    if (error) throw error;

    // Award XP only on first submission — not on re-saves of the same week
    if (!isNewReport) {
      return new Response(JSON.stringify({ success: true, ai_recommendation, ai_adjustment, xp_earned: 0 }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Award XP via RPC → updates user_journey.total_xp
    const { error: xpRpcErr } = await supabase.rpc('award_xp', {
      user_id_param:     user.id,
      action_type_param: 'weekly_report',
      xp_amount_param:   100,
      description_param: `Week ${week_number} report submitted`,
      day_number_param:  null,
    });

    if (xpRpcErr) {
      console.warn('award_xp RPC failed:', xpRpcErr.message);
      const { data: journey } = await supabase
        .from('user_journey').select('total_xp, level').eq('user_id', user.id).maybeSingle();
      if (journey) {
        const newXP = (journey.total_xp || 0) + 100;
        await supabase.from('user_journey')
          .update({ total_xp: newXP, level: Math.floor(newXP / 500) + 1 })
          .eq('user_id', user.id);
      }
    }

    // Log new weight
    if (weight_now) {
      await supabase.from('weight_logs').upsert({
        user_id:     user.id,
        weight:      weight_now,
        logged_date: now.toISOString().split('T')[0],
        notes:       `Week ${week_number} weigh-in`,
      }, { onConflict: 'user_id,logged_date' });
    }

    // Auto-complete the weekly_review daily task
    const { data: journey } = await supabase
      .from('user_journey').select('current_day').eq('user_id', user.id).maybeSingle();
    if (journey?.current_day) {
      await autoCompleteTask(user.id, 'weekly_review', journey.current_day, accessToken);
    }

    checkAchievements(user.id, accessToken); // fire-and-forget
    return new Response(JSON.stringify({ success: true, ai_recommendation, ai_adjustment }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};