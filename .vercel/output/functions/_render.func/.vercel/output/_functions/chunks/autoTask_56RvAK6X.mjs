import { s as supabase } from './supabase_D4h9lf_Y.mjs';
import { createClient } from '@supabase/supabase-js';

const ACHIEVEMENTS = [
  { type: "streak_3", name: "3-Day Streak", icon: "🔥" },
  { type: "streak_7", name: "Week Streak", icon: "🌟" },
  { type: "streak_14", name: "2-Week Streak", icon: "💎" },
  { type: "streak_30", name: "30-Day Streak", icon: "👑" },
  { type: "day_7", name: "Week 1 Complete!", icon: "📅" },
  { type: "day_14", name: "Two Weeks Strong", icon: "💪" },
  { type: "day_21", name: "Three Weeks!", icon: "🚀" },
  { type: "day_30", name: "First Month Done!", icon: "🏆" },
  { type: "first_checkin", name: "First Check-in", icon: "✅" },
  { type: "checkin_7", name: "7 Check-ins", icon: "📋" },
  { type: "checkin_30", name: "Check-in Master", icon: "🎯" },
  { type: "first_meal", name: "First Meal Tracked", icon: "🍽️" },
  { type: "meals_10", name: "10 Meals Logged", icon: "🥗" },
  { type: "first_weight", name: "First Weigh-in", icon: "⚖️" },
  { type: "lost_1kg", name: "First Kilo Gone!", icon: "🎉" },
  { type: "lost_3kg", name: "3kg Down!", icon: "🔥" },
  { type: "lost_5kg", name: "5kg Champion!", icon: "💪" },
  { type: "goal_25", name: "25% to Goal", icon: "🎯" },
  { type: "goal_50", name: "Halfway There!", icon: "🏃" },
  { type: "goal_75", name: "75% to Goal!", icon: "🚀" },
  { type: "first_fast", name: "First Fast Done!", icon: "⏱️" },
  { type: "fast_3", name: "3 Fasts Completed", icon: "🧘" },
  { type: "fast_7", name: "Fasting Veteran", icon: "⚡" },
  { type: "xp_100", name: "100 XP Earned", icon: "⭐" },
  { type: "xp_500", name: "500 XP Legend", icon: "🌟" },
  { type: "xp_1000", name: "1000 XP Master", icon: "💎" },
  { type: "level_3", name: "Level 3", icon: "📈" },
  { type: "level_5", name: "Level 5 Veteran", icon: "🏅" },
  { type: "level_10", name: "Level 10 Legend", icon: "👑" },
  { type: "hydrated", name: "Hydration Hero", icon: "💧" }
];
async function checkAchievements(userId, accessToken) {
  try {
    const db = createClient(
      "https://ltgxafioalbkjdfkkpxy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );
    const { data: existing } = await db.from("achievements").select("achievement_type").eq("user_id", userId);
    const earned = new Set((existing || []).map((a) => a.achievement_type));
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const [journeyRes, checkinsRes, weightRes, fastingRes, mealCompRes, onboardingRes, todayCheckinRes] = await Promise.all([
      db.from("user_journey").select("current_day,streak_days,total_xp,level").eq("user_id", userId).single(),
      db.from("daily_checkins").select("id", { count: "exact", head: true }).eq("user_id", userId),
      db.from("weight_logs").select("weight,logged_date").eq("user_id", userId).order("logged_date", { ascending: false }).limit(2),
      db.from("fasting_sessions").select("id", { count: "exact", head: true }).eq("user_id", userId).not("ended_at", "is", null),
      db.from("meal_completions").select("id", { count: "exact", head: true }).eq("user_id", userId),
      db.from("onboarding_data").select("current_weight,target_weight").eq("user_id", userId).single(),
      db.from("daily_checkins").select("water_glasses").eq("user_id", userId).eq("checkin_date", today).maybeSingle()
    ]);
    const journey = journeyRes.data;
    const checkinCount = checkinsRes.count || 0;
    const weightLogs = weightRes.data || [];
    const fastingCount = fastingRes.count || 0;
    const mealCount = mealCompRes.count || 0;
    const onboarding = onboardingRes.data;
    const todayCheckin = todayCheckinRes.data;
    const streak = journey?.streak_days || 0;
    const currentDay = journey?.current_day || 1;
    const totalXP = journey?.total_xp || 0;
    const level = journey?.level || 1;
    const startW = onboarding?.current_weight || 0;
    const goalW = onboarding?.target_weight || 0;
    const latestW = weightLogs[0]?.weight || startW;
    const lost = Math.max(0, startW - latestW);
    const toGoal = Math.max(0.1, startW - goalW);
    const goalPct = Math.min(100, lost / toGoal * 100);
    const conditions = {
      streak_3: streak >= 3,
      streak_7: streak >= 7,
      streak_14: streak >= 14,
      streak_30: streak >= 30,
      day_7: currentDay >= 7,
      day_14: currentDay >= 14,
      day_21: currentDay >= 21,
      day_30: currentDay >= 30,
      first_checkin: checkinCount >= 1,
      checkin_7: checkinCount >= 7,
      checkin_30: checkinCount >= 30,
      first_meal: mealCount >= 1,
      meals_10: mealCount >= 10,
      first_weight: weightLogs.length >= 1,
      lost_1kg: lost >= 1,
      lost_3kg: lost >= 3,
      lost_5kg: lost >= 5,
      goal_25: goalPct >= 25,
      goal_50: goalPct >= 50,
      goal_75: goalPct >= 75,
      first_fast: fastingCount >= 1,
      fast_3: fastingCount >= 3,
      fast_7: fastingCount >= 7,
      xp_100: totalXP >= 100,
      xp_500: totalXP >= 500,
      xp_1000: totalXP >= 1e3,
      level_3: level >= 3,
      level_5: level >= 5,
      level_10: level >= 10,
      hydrated: (todayCheckin?.water_glasses || 0) >= 8
    };
    const newlyEarned = ACHIEVEMENTS.filter((a) => !earned.has(a.type) && conditions[a.type]);
    if (newlyEarned.length > 0) {
      await db.from("achievements").insert(
        newlyEarned.map((a) => ({
          user_id: userId,
          achievement_type: a.type,
          achievement_name: a.name,
          icon: a.icon,
          earned_at: (/* @__PURE__ */ new Date()).toISOString()
        }))
      );
    }
  } catch {
  }
}
async function autoCompleteTask(userId, taskType, dayNumber) {
  try {
    const { data: task } = await supabase.from("daily_tasks").select("id, xp_earned, completed").eq("user_id", userId).eq("day_number", dayNumber).eq("task_type", taskType).maybeSingle();
    if (!task || task.completed) return;
    await supabase.from("daily_tasks").update({ completed: true, completed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", task.id);
    if (task.xp_earned) {
      await supabase.rpc("award_xp", {
        user_id_param: userId,
        action_type_param: `task_${taskType}`,
        xp_amount_param: task.xp_earned,
        description_param: `Auto-completed task: ${taskType}`,
        day_number_param: dayNumber
      });
    }
  } catch {
  }
}

export { autoCompleteTask as a, checkAchievements as c };
