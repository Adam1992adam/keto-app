import { s as supabase, c as initializeUserJourney } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const body = await request.json();
    const {
      goal,
      age,
      gender,
      height_cm,
      current_weight,
      target_weight,
      activity_level,
      dietary_restrictions,
      cook_time_pref,
      fasting_protocol,
      feature_electrolytes,
      feature_checkin,
      feature_report,
      feature_reminders,
      tdee,
      daily_calories,
      protein_g,
      fat_g,
      carbs_g
    } = body;
    if (!current_weight || current_weight < 20 || current_weight > 500)
      return new Response(JSON.stringify({ error: "current_weight must be between 20–500 kg" }), { status: 400 });
    if (target_weight !== void 0 && target_weight !== null && (target_weight < 20 || target_weight > 500))
      return new Response(JSON.stringify({ error: "target_weight must be between 20–500 kg" }), { status: 400 });
    if (height_cm !== void 0 && height_cm !== null && (height_cm < 100 || height_cm > 250))
      return new Response(JSON.stringify({ error: "height_cm must be between 100–250 cm" }), { status: 400 });
    if (age !== void 0 && age !== null && (age < 13 || age > 120))
      return new Response(JSON.stringify({ error: "age must be between 13–120" }), { status: 400 });
    if (daily_calories !== void 0 && daily_calories !== null && (daily_calories < 500 || daily_calories > 1e4))
      return new Response(JSON.stringify({ error: "daily_calories must be between 500–10000" }), { status: 400 });
    const { error: onboardError } = await supabase.from("onboarding_data").upsert({
      user_id: user.id,
      goal,
      age,
      gender,
      height_cm,
      current_weight,
      target_weight,
      activity_level,
      dietary_restrictions: dietary_restrictions || [],
      cook_time_pref,
      fasting_protocol,
      feature_electrolytes: feature_electrolytes ?? true,
      feature_checkin: feature_checkin ?? true,
      feature_report: feature_report ?? true,
      feature_reminders: feature_reminders ?? true,
      completed_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "user_id" });
    if (onboardError) throw onboardError;
    let macroCalories = daily_calories;
    let macroProtein = protein_g;
    let macroFat = fat_g;
    let macroCarbs = carbs_g;
    let macroTdee = tdee;
    if (!macroCalories && current_weight && height_cm && age && gender) {
      const bmr = gender === "female" ? 10 * current_weight + 6.25 * height_cm - 5 * age - 161 : 10 * current_weight + 6.25 * height_cm - 5 * age + 5;
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
        extreme: 1.9,
        active: 1.725,
        very_active: 1.9
      };
      const calcTdee = bmr * (activityMultipliers[activity_level] || 1.55);
      macroTdee = Math.round(calcTdee);
      let cal = calcTdee;
      if (goal === "lose_weight") cal = calcTdee - 500;
      else if (goal === "lose_fast") cal = calcTdee - 750;
      else if (goal === "build_muscle") cal = calcTdee + 200;
      else if (goal === "maintain") cal = calcTdee;
      else if (goal === "energy") cal = calcTdee - 200;
      else if (goal === "health") cal = calcTdee - 300;
      macroCalories = Math.round(Math.max(1200, cal));
      macroProtein = Math.round(macroCalories * 0.25 / 4);
      macroFat = Math.round(macroCalories * 0.7 / 9);
      macroCarbs = Math.round(macroCalories * 0.05 / 4);
    }
    const { error: macroError } = await supabase.from("macro_goals").upsert({
      user_id: user.id,
      tdee: macroTdee,
      daily_calories: macroCalories,
      protein_g: macroProtein,
      fat_g: macroFat,
      carbs_g: macroCarbs,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "user_id" });
    if (macroError) throw macroError;
    const activityMap = {
      sedentary: "sedentary",
      light: "light",
      moderate: "moderate",
      very: "active",
      extreme: "very_active"
    };
    const { error: profileError } = await supabase.from("profiles").update({
      weight_kg: current_weight,
      target_weight_kg: target_weight,
      height_cm,
      age,
      gender,
      goal,
      activity_level: activityMap[activity_level] || activity_level,
      onboarding_completed: true,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", user.id);
    if (profileError) throw profileError;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    await supabase.from("weight_logs").upsert({
      user_id: user.id,
      weight: current_weight,
      logged_date: today,
      notes: "Starting weight"
    }, { onConflict: "user_id,logged_date" });
    if (feature_reminders) {
      await supabase.from("notification_preferences").upsert({
        user_id: user.id,
        breakfast_enabled: true,
        breakfast_time: "08:00",
        lunch_enabled: true,
        lunch_time: "13:00",
        dinner_enabled: true,
        dinner_time: "19:00",
        snack_enabled: true,
        snack_time: "16:00",
        water_enabled: true,
        water_interval: 120,
        water_start_time: "08:00",
        water_end_time: "22:00",
        weight_enabled: true,
        weight_day: 1,
        weight_time: "07:00",
        streak_enabled: true,
        streak_time: "21:00"
      }, { onConflict: "user_id" });
    }
    await initializeUserJourney(user.id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Onboarding save error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to save" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
