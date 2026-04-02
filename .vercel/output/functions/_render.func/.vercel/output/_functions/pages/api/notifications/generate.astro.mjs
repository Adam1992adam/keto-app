import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: "Unauthorized" }, 401);
  try {
    const count = await generate(user.id);
    return json({ success: true, generated: count });
  } catch (e) {
    console.error("Generate error:", e?.message || e);
    return json({ error: "Failed", detail: e?.message }, 500);
  }
};
async function generate(userId) {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const now = /* @__PURE__ */ new Date();
  const { data: journeyFirst } = await supabase.from("user_journey").select("current_day").eq("user_id", userId).maybeSingle();
  const currentDayFirst = journeyFirst?.current_day || 1;
  const [
    { data: profile },
    { data: journey },
    { data: todayCheckin },
    { data: recentCheckins },
    { data: todayTasks },
    { data: weightLogs },
    { data: activeFast },
    { data: onboarding },
    { data: existingToday },
    { data: todayMealCompletions },
    { data: profileForPlan },
    { data: userPrefs }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_journey").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("daily_checkins").select("*").eq("user_id", userId).eq("checkin_date", today).maybeSingle(),
    supabase.from("daily_checkins").select("checkin_date,energy_level,water_glasses").eq("user_id", userId).order("checkin_date", { ascending: false }).limit(7),
    supabase.from("daily_tasks").select("*").eq("user_id", userId).eq("day_number", currentDayFirst),
    supabase.from("weight_logs").select("weight,logged_date").eq("user_id", userId).order("logged_date", { ascending: false }).limit(5),
    supabase.from("fasting_sessions").select("*").eq("user_id", userId).is("ended_at", null).order("started_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("onboarding_data").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("notifications").select("type").eq("user_id", userId).eq("is_dismissed", false).gte("created_at", new Date(Date.now() - 12 * 36e5).toISOString()),
    supabase.from("meal_completions").select("meal_type").eq("user_id", userId).eq("day_number", currentDayFirst),
    supabase.from("profiles").select("subscription_tier").eq("id", userId).maybeSingle(),
    supabase.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle()
  ]);
  const prefs = {
    checkin_reminder: userPrefs?.checkin_reminder ?? true,
    streak_warning: userPrefs?.streak_warning ?? true,
    incomplete_tasks: userPrefs?.incomplete_tasks ?? true,
    weight_reminder: userPrefs?.weight_reminder ?? true,
    fasting_active: userPrefs?.fasting_active ?? true,
    weekly_review: userPrefs?.weekly_review ?? true,
    milestone: userPrefs?.milestone ?? true,
    level_up: userPrefs?.level_up ?? true
  };
  const MILESTONE_TYPES = /* @__PURE__ */ new Set([
    "welcome",
    "day1_start",
    "weight_progress"
  ]);
  const done = new Set(
    (existingToday || []).map((n) => n.type).filter(
      (t) => MILESTONE_TYPES.has(t) || t.startsWith("milestone_") || t.startsWith("streak_") || t.startsWith("level_up_")
    )
  );
  const DAILY_TYPES = [
    "checkin_reminder",
    "streak_warning",
    "incomplete_tasks",
    "weight_reminder",
    "fasting_active",
    "low_water",
    "weekly_review",
    "energy_trend",
    "meal_breakfast",
    "meal_lunch",
    "meal_snack",
    "meal_dinner",
    "task_water",
    "task_weight",
    "task_reflection",
    "task_checkin"
  ];
  await supabase.from("notifications").delete().eq("user_id", userId).in("type", DAILY_TYPES).eq("is_read", false).eq("is_dismissed", false);
  const userName = profile?.full_name?.split(" ")[0] || "there";
  const currentDay = journey?.current_day || 1;
  const streak = journey?.streak_days || 0;
  const totalXP = journey?.total_xp || 0;
  const level = journey?.level || 1;
  const startW = onboarding?.current_weight || profile?.weight_kg || 0;
  const goalW = onboarding?.target_weight || profile?.target_weight_kg || 0;
  const latestW = weightLogs?.[0]?.weight || startW;
  const weightLost = Math.max(0, startW - latestW);
  const midnight = /* @__PURE__ */ new Date();
  midnight.setHours(23, 59, 59, 0);
  const tomorrow = new Date(now.getTime() + 864e5);
  tomorrow.setHours(23, 59, 59, 0);
  const notifs = [];
  const add = (n) => notifs.push(n);
  if (prefs.checkin_reminder && !todayCheckin && !done.has("checkin_reminder")) {
    add({
      user_id: userId,
      type: "checkin_reminder",
      priority: "normal",
      icon: "✏️",
      title: `Daily Check-in Ready`,
      body: `${userName}, track your energy, water, and meals to keep your streak alive!`,
      action_url: "/dashboard/checkin",
      action_label: "Check in now",
      expires_at: midnight.toISOString()
    });
  }
  if (prefs.streak_warning && !todayCheckin && streak > 0 && !done.has("streak_warning")) {
    add({
      user_id: userId,
      type: "streak_warning",
      priority: "urgent",
      icon: "🔥",
      title: `${streak}-Day Streak at Risk!`,
      body: `Don't break your ${streak}-day streak! Check in before midnight.`,
      action_url: "/dashboard/checkin",
      action_label: "Protect streak",
      expires_at: midnight.toISOString()
    });
  }
  if (prefs.incomplete_tasks) {
    const pending = (todayTasks || []).filter((t) => !t.completed);
    if (pending.length > 0) {
      const waterGlasses = todayCheckin?.water_glasses || 0;
      const lastWeight = weightLogs?.[0]?.logged_date;
      const weightedToday = lastWeight === today;
      const waterTask = pending.find((t) => t.task_type === "water");
      if (waterTask && !done.has("task_water")) {
        const need = Math.max(0, 8 - waterGlasses);
        add({
          user_id: userId,
          type: "task_water",
          priority: waterGlasses === 0 ? "urgent" : "normal",
          icon: "💧",
          title: waterGlasses === 0 ? "No Water Logged Yet!" : `Water: ${waterGlasses}/8 Glasses`,
          body: waterGlasses === 0 ? `${userName}, staying hydrated is key on keto! Log your water intake.` : `${need} more glass${need !== 1 ? "es" : ""} to hit your daily goal and earn XP!`,
          action_url: "/dashboard/food-log",
          action_label: "Log water",
          expires_at: midnight.toISOString()
        });
      }
      const weightTask = pending.find((t) => t.task_type === "weight");
      if (weightTask && !weightedToday && !done.has("task_weight")) {
        add({
          user_id: userId,
          type: "task_weight",
          priority: "normal",
          icon: "⚖️",
          title: "Weigh Yourself Today",
          body: `${userName}, log your weight to track your keto progress and earn XP!`,
          action_url: "/dashboard/progress",
          action_label: "Log weight",
          expires_at: midnight.toISOString()
        });
      }
      const reflTask = pending.find((t) => t.task_type === "reflection");
      if (reflTask && !done.has("task_reflection")) {
        add({
          user_id: userId,
          type: "task_reflection",
          priority: "normal",
          icon: "📝",
          title: "Write Your Daily Reflection",
          body: `${userName}, take 2 minutes to reflect on today's keto journey and earn XP!`,
          action_url: "/dashboard/reflections",
          action_label: "Reflect now",
          expires_at: midnight.toISOString()
        });
      }
      const checkinTask = pending.find((t) => t.task_type === "checkin");
      if (checkinTask && !todayCheckin && !done.has("task_checkin")) {
        add({
          user_id: userId,
          type: "task_checkin",
          priority: "urgent",
          icon: "✏️",
          title: "Daily Check-in Not Done Yet",
          body: `${userName}, complete your check-in to earn ${checkinTask.xp_earned || 30} XP and keep your streak alive!`,
          action_url: "/dashboard/checkin",
          action_label: "Check in now",
          expires_at: midnight.toISOString()
        });
      }
      const otherPending = pending.filter(
        (t) => !["water", "weight", "reflection", "checkin"].includes(t.task_type)
      );
      if (otherPending.length > 0 && !done.has("incomplete_tasks")) {
        const names = otherPending.slice(0, 2).map((t) => t.task_title).join(", ");
        add({
          user_id: userId,
          type: "incomplete_tasks",
          priority: "normal",
          icon: "✅",
          title: `${otherPending.length} Task${otherPending.length > 1 ? "s" : ""} Pending`,
          body: `Remaining: ${names}${otherPending.length > 2 ? ` +${otherPending.length - 2} more` : ""}`,
          action_url: "/dashboard",
          action_label: "View tasks",
          expires_at: midnight.toISOString()
        });
      }
    }
  }
  if (prefs.weight_reminder && !done.has("weight_reminder")) {
    const lastLog = weightLogs?.[0]?.logged_date;
    const daysSince = lastLog ? Math.floor((now.getTime() - new Date(lastLog).getTime()) / 864e5) : currentDay;
    if (daysSince >= 2) {
      add({
        user_id: userId,
        type: "weight_reminder",
        priority: daysSince >= 5 ? "urgent" : "normal",
        icon: "⚖️",
        title: daysSince >= 5 ? "Weight Log Overdue!" : "Log Your Weight Today",
        body: lastLog ? `It's been ${daysSince} days since you weighed in. Keep tracking your progress!` : `You haven't logged your weight yet. Start tracking to see your keto results!`,
        action_url: "/dashboard/progress",
        action_label: "Log weight",
        expires_at: tomorrow.toISOString()
      });
    }
  }
  const milestones = {
    1: { icon: "🚀", title: "Your Keto Journey Begins!", body: `Welcome ${userName}! Day 1 starts now. Every expert was once a beginner!` },
    3: { icon: "💪", title: "Keto Flu Survivor!", body: `3 days done ${userName}! The hardest part is behind you.` },
    7: { icon: "🎉", title: "One Full Week Complete!", body: `${userName}, you just finished your first keto week. That's incredible!` },
    10: { icon: "⚡", title: "Keto-Adapted!", body: `Day 10! Your body is now efficiently burning fat for fuel.` },
    14: { icon: "🏆", title: "2-Week Champion!", body: `Two weeks of consistent keto ${userName}. Your metabolism has shifted!` },
    21: { icon: "🧠", title: "21-Day Habit Formed!", body: `Science says habits form in 21 days. Keto is now part of you!` },
    30: { icon: "👑", title: "30-DAY KETO HERO!", body: `${userName}, you completed the FULL 30-day keto challenge! LEGENDARY!` }
  };
  const key = `milestone_${currentDay}`;
  if (prefs.milestone && milestones[currentDay] && !done.has(key)) {
    const m = milestones[currentDay];
    add({
      user_id: userId,
      type: key,
      priority: "urgent",
      icon: m.icon,
      title: m.title,
      body: m.body,
      action_url: "/dashboard/progress",
      action_label: "View progress",
      expires_at: tomorrow.toISOString()
    });
  }
  const streakMsgs = {
    3: `3 days in a row ${userName}! You're building a great habit!`,
    7: `A full week streak! ${userName}, you're on fire! 🔥`,
    14: `14-day streak! ${userName}, you're a consistency machine!`,
    21: `21 days straight! ${userName}, this is legendary dedication!`,
    30: `30-DAY STREAK! ${userName}, you are absolutely UNSTOPPABLE! 👑`
  };
  const sKey = `streak_${streak}`;
  if (prefs.milestone && streakMsgs[streak] && !done.has(sKey)) {
    add({
      user_id: userId,
      type: sKey,
      priority: "urgent",
      icon: "🔥",
      title: `${streak}-Day Streak! 🔥`,
      body: streakMsgs[streak],
      action_url: "/dashboard",
      action_label: "View streak",
      expires_at: tomorrow.toISOString()
    });
  }
  const xpInLevel = totalXP % 500;
  const lvKey = `level_up_${level}`;
  if (prefs.level_up && totalXP > 0 && xpInLevel < 100 && level > 1 && !done.has(lvKey)) {
    add({
      user_id: userId,
      type: lvKey,
      priority: "urgent",
      icon: "⭐",
      title: `Level Up! You're Level ${level} 🎉`,
      body: `Amazing ${userName}! You've earned ${totalXP.toLocaleString()} XP. Keep going!`,
      action_url: "/dashboard",
      action_label: "View XP",
      expires_at: tomorrow.toISOString()
    });
  }
  if (prefs.milestone && goalW && startW > goalW && weightLost > 0 && !done.has("weight_progress")) {
    const totalNeed = startW - goalW;
    const pct = Math.round(weightLost / totalNeed * 100);
    const hit = [75, 50, 25].find((m) => pct >= m);
    if (hit) {
      add({
        user_id: userId,
        type: "weight_progress",
        priority: "normal",
        icon: "🎯",
        title: `${hit}% to Your Goal Weight!`,
        body: `You've lost ${(weightLost * 2.20462).toFixed(1)} lbs — ${hit}% of the way to your goal. Keep it up!`,
        action_url: "/dashboard/progress",
        action_label: "See progress",
        expires_at: tomorrow.toISOString()
      });
    }
  }
  if (prefs.fasting_active && activeFast && !done.has("fasting_active")) {
    const elapsed = (now.getTime() - new Date(activeFast.started_at).getTime()) / 36e5;
    add({
      user_id: userId,
      type: "fasting_active",
      priority: "low",
      icon: "⏱️",
      title: elapsed >= 16 ? "Autophagy Activated! 🧬" : `Fasting in Progress — ${Math.floor(elapsed)}h`,
      body: elapsed >= 16 ? "You've hit 16h! Cellular cleaning is kicking in. Keep going!" : `You've been fasting ${Math.floor(elapsed)}h. Stay strong ${userName}!`,
      action_url: "/dashboard/fasting",
      action_label: "View fasting",
      expires_at: tomorrow.toISOString()
    });
  }
  if (todayCheckin && !done.has("low_water")) {
    const glasses = todayCheckin.water_glasses || 0;
    if (glasses < 6) {
      add({
        user_id: userId,
        type: "low_water",
        priority: "normal",
        icon: "💧",
        title: "Stay Hydrated!",
        body: `Only ${glasses} glasses today. Aim for ${8 - glasses} more — water is key for keto!`,
        action_url: "/dashboard/checkin",
        action_label: "Update check-in",
        expires_at: midnight.toISOString()
      });
    }
  }
  if (prefs.weekly_review && currentDay >= 7 && !done.has("weekly_review")) {
    const weekNum = Math.ceil(currentDay / 7);
    const dayInWeek = (currentDay - 1) % 7 + 1;
    if (dayInWeek >= 6) {
      add({
        user_id: userId,
        type: "weekly_review",
        priority: "normal",
        icon: "📊",
        title: `Week ${weekNum} Review Ready!`,
        body: `Review your Week ${weekNum} performance and plan for the next!`,
        action_url: "/dashboard/weekly",
        action_label: "View weekly",
        expires_at: tomorrow.toISOString()
      });
    }
  }
  if (recentCheckins && recentCheckins.length >= 3 && !done.has("energy_trend")) {
    const last3 = recentCheckins.slice(0, 3);
    const avgE = last3.reduce((s, c) => s + (c.energy_level || 3), 0) / 3;
    if (avgE <= 2) {
      add({
        user_id: userId,
        type: "energy_trend",
        priority: "normal",
        icon: "⚡",
        title: "Low Energy Detected",
        body: `Your energy has been low. Make sure you're eating enough healthy fats and staying hydrated!`,
        action_url: "/dashboard/recipes",
        action_label: "High-energy recipes",
        expires_at: tomorrow.toISOString()
      });
    }
  }
  if (!activeFast) {
    const planType = profileForPlan?.subscription_tier || "basic_30";
    const eatenTypes = new Set((todayMealCompletions || []).map((c) => c.meal_type));
    const hour = now.getHours();
    const mealSchedule = [
      { type: "breakfast", hour: 7, label: "Breakfast", emoji: "🍳", tip: "A keto breakfast keeps energy stable all morning." },
      { type: "lunch", hour: 12, label: "Lunch", emoji: "🥗", tip: "Fuel your afternoon with healthy fats and protein." },
      { type: "snack", hour: 15, label: "Snack", emoji: "🥜", tip: "A quick keto snack prevents afternoon cravings." },
      { type: "dinner", hour: 18, label: "Dinner", emoji: "🍽️", tip: "Complete your macros with a satisfying keto dinner." }
    ];
    const { data: todayPlan } = await supabase.from("meal_plans").select("meal_type").eq("plan_type", planType).eq("day_number", currentDayFirst);
    const plannedTypes = new Set((todayPlan || []).map((m) => m.meal_type));
    for (const meal of mealSchedule) {
      const notifKey = `meal_${meal.type}`;
      if (!done.has(notifKey) && hour >= meal.hour && !eatenTypes.has(meal.type) && plannedTypes.has(meal.type)) {
        add({
          user_id: userId,
          type: notifKey,
          priority: "normal",
          icon: meal.emoji,
          title: `Time for ${meal.label}! ${meal.emoji}`,
          body: `${userName}, you haven't logged ${meal.label.toLowerCase()} yet. ${meal.tip}`,
          action_url: "/dashboard",
          action_label: "Log meal",
          expires_at: midnight.toISOString()
        });
      }
    }
  }
  const { count: totalNotifs } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId);
  if ((totalNotifs || 0) === 0 && !done.has("welcome")) {
    notifs.unshift({
      user_id: userId,
      type: "welcome",
      priority: "urgent",
      icon: "🥑",
      title: `Welcome to Keto Journey, ${userName}! 🎉`,
      body: `Day ${currentDay} of your 30-day challenge. Complete your first check-in to earn 30 XP!`,
      action_url: "/dashboard/checkin",
      action_label: "Start check-in",
      expires_at: tomorrow.toISOString()
    });
  }
  if (currentDay === 1 && notifs.length === 0 && !done.has("day1_start")) {
    notifs.push({
      user_id: userId,
      type: "day1_start",
      priority: "urgent",
      icon: "🚀",
      title: `Day 1 — Your Journey Starts Now!`,
      body: `Welcome ${userName}! Complete your check-in, log your meals and track your water to build your first streak.`,
      action_url: "/dashboard/checkin",
      action_label: "Begin Day 1",
      expires_at: tomorrow.toISOString()
    });
  }
  if (notifs.length === 0) return 0;
  const { error } = await supabase.from("notifications").insert(notifs);
  if (error) {
    console.error("Insert error:", JSON.stringify(error));
    return 0;
  }
  try {
    const urgentNotifs = notifs.filter((n) => n.priority === "urgent");
    if (urgentNotifs.length > 0) {
      const { sendPushToUser } = await import('../../../chunks/push_Okp6OHEm.mjs');
      const top = urgentNotifs[0];
      await sendPushToUser(userId, {
        title: top.title,
        body: top.body,
        url: top.action_url || "/dashboard",
        tag: top.type,
        priority: "urgent"
      }).catch(() => {
      });
    }
  } catch {
  }
  try {
    const milestoneNotif = notifs.find((n) => n.type?.startsWith("milestone_"));
    if (milestoneNotif) {
      const day = parseInt(milestoneNotif.type.split("_")[1] || "0", 10);
      if ([7, 14, 21, 30, 60, 90].includes(day)) {
        const { data: userProfile } = await supabase.from("profiles").select("email, full_name").eq("id", userId).maybeSingle();
        if (userProfile?.email) {
          const { sendMilestoneEmail } = await import('../../../chunks/email_CChWb1pC.mjs');
          await sendMilestoneEmail(
            userProfile.email,
            userProfile.full_name || "there",
            day,
            journey?.streak_days || 0,
            journey?.total_xp || 0
          ).catch(() => {
          });
        }
      }
    }
  } catch {
  }
  return notifs.length;
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
