import { s as supabase, e as getMaxJourneyDays } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { a as autoCompleteTask, c as checkAchievements } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const body = await request.json();
    const {
      week_number,
      weight_now,
      weight_start,
      mood,
      challenges,
      week_win,
      improvement,
      checkin_count,
      compliance_rate,
      avg_energy,
      avg_water,
      xp_earned,
      meals_completed
    } = body;
    const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).maybeSingle();
    const maxDays = getMaxJourneyDays(profile?.subscription_tier);
    const maxWeeks = Math.ceil(maxDays / 7);
    if (!week_number || week_number < 1 || week_number > maxWeeks) {
      return new Response(JSON.stringify({ error: `Week number must be between 1 and ${maxWeeks} for your plan.` }), { status: 400 });
    }
    const now = /* @__PURE__ */ new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    let ai_recommendation = "";
    let ai_adjustment = "";
    if (compliance_rate >= 80 && avg_energy >= 4) {
      ai_recommendation = "Exceptional week. You're building the habits that will define your transformation. Keep this momentum.";
      ai_adjustment = "Consider adding 15 minutes of morning walking next week to accelerate fat oxidation.";
    } else if (compliance_rate < 60) {
      ai_recommendation = "Compliance was a challenge this week. The fix is preparation, not willpower.";
      ai_adjustment = "Meal prep 4 meals on Sunday. Remove non-keto foods from home. Make the right choice the easy choice.";
    } else if (avg_energy < 3) {
      ai_recommendation = "Low energy signals insufficient fat or electrolytes. Your macros need adjustment.";
      ai_adjustment = "Increase daily fat by 15g. Add salt to every meal. Take magnesium at night.";
    } else {
      ai_recommendation = "Steady progress. Consistency is the most underrated fat-loss tool.";
      ai_adjustment = "Focus on sleep quality this week — 7-9 hours boosts fat burning and reduces cravings.";
    }
    const weight_lost = weight_start && weight_now ? Math.max(0, weight_start - weight_now) : null;
    const { error } = await supabase.from("weekly_reports").upsert({
      user_id: user.id,
      week_number,
      week_start_date: weekStart.toISOString().split("T")[0],
      week_end_date: now.toISOString().split("T")[0],
      weight_start,
      weight_end: weight_now,
      weight_lost,
      meals_completed,
      tasks_completed: checkin_count,
      checkins_completed: checkin_count,
      avg_water_glasses: avg_water,
      avg_energy_level: avg_energy,
      xp_earned_this_week: xp_earned,
      ai_recommendation,
      ai_adjustment,
      generated_at: now.toISOString()
    }, { onConflict: "user_id,week_number" });
    if (error) throw error;
    const { error: xpRpcErr } = await supabase.rpc("award_xp", {
      user_id_param: user.id,
      action_type_param: "weekly_report",
      xp_amount_param: 100,
      description_param: `Week ${week_number} report submitted`,
      day_number_param: null
    });
    if (xpRpcErr) {
      console.warn("award_xp RPC failed:", xpRpcErr.message);
      const { data: journey2 } = await supabase.from("user_journey").select("total_xp, level").eq("user_id", user.id).maybeSingle();
      if (journey2) {
        const newXP = (journey2.total_xp || 0) + 100;
        await supabase.from("user_journey").update({ total_xp: newXP, level: Math.floor(newXP / 500) + 1 }).eq("user_id", user.id);
      }
    }
    if (weight_now) {
      await supabase.from("weight_logs").upsert({
        user_id: user.id,
        weight: weight_now,
        logged_date: now.toISOString().split("T")[0],
        notes: `Week ${week_number} weigh-in`
      }, { onConflict: "user_id,logged_date" });
    }
    const { data: journey } = await supabase.from("user_journey").select("current_day").eq("user_id", user.id).maybeSingle();
    if (journey?.current_day) {
      await autoCompleteTask(user.id, "weekly_review", journey.current_day);
    }
    checkAchievements(user.id, accessToken);
    return new Response(JSON.stringify({ success: true, ai_recommendation, ai_adjustment }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
