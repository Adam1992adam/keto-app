/* empty css                                       */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as defineScriptVars, g as addAttribute, u as unescapeHTML, h as renderHead } from '../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { e as getMaxJourneyDays, s as supabase, d as getUserJourney, a as getMealCycleDays } from '../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../chunks/auth_DxNH3rhr.mjs';
import { c as $$Activity, a as $$DashNav } from '../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$, a as $$Zap, b as $$Utensils } from '../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Flame } from '../chunks/Flame_EKYKv-jW.mjs';
import { $ as $$ClipboardCheck } from '../chunks/ClipboardCheck_Cbv7JTJ_.mjs';
import { $ as $$Timer } from '../chunks/Timer_ceHoeydv.mjs';
import { $ as $$BarChart3 } from '../chunks/BarChart3_BX3FTjqm.mjs';
import { $ as $$TrendingUp } from '../chunks/TrendingUp_BZiNmqs5.mjs';
import { $ as $$ShoppingCart } from '../chunks/ShoppingCart_CxlP89GQ.mjs';
import { $ as $$Droplets } from '../chunks/Droplets_D_Q7yuSH.mjs';
import { $ as $$Target } from '../chunks/Target_DD7DYwGV.mjs';
import { $ as $$Info } from '../chunks/Info_uBFi0AyP.mjs';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$6 = createAstro();
const $$Scale = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Scale;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "scale", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M12 3v18"></path> <path d="m19 8 3 8a5 5 0 0 1-6 0zV7"></path> <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"></path> <path d="m5 8 3 8a5 5 0 0 1-6 0zV7"></path> <path d="M7 21h10"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Scale.astro", void 0);

const $$Astro$5 = createAstro();
const $$CalendarDays = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$CalendarDays;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "calendar-days", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M8 2v4"></path> <path d="M16 2v4"></path> <rect width="18" height="18" x="3" y="4" rx="2"></rect> <path d="M3 10h18"></path> <path d="M8 14h.01"></path> <path d="M12 14h.01"></path> <path d="M16 14h.01"></path> <path d="M8 18h.01"></path> <path d="M12 18h.01"></path> <path d="M16 18h.01"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/CalendarDays.astro", void 0);

const $$Astro$4 = createAstro();
const $$CheckCircle2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$CheckCircle2;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "circle-check", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="12" cy="12" r="10"></circle> <path d="m9 12 2 2 4-4"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/CheckCircle2.astro", void 0);

const $$Astro$3 = createAstro();
const $$Pill = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Pill;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "pill", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path> <path d="m8.5 8.5 7 7"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Pill.astro", void 0);

const $$Astro$2 = createAstro();
const $$LineChart = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$LineChart;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "chart-line", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M3 3v16a2 2 0 0 0 2 2h16"></path> <path d="m19 9-5 5-4-4-3 3"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/LineChart.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro();
const $$AppTour = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AppTour;
  const { userName = "there" } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<!-- Pass server prop to client --><script>(function(){", "\nwindow.__tourUserName = __tn;\n})();<\/script> <!-- Tour engine (Vite-bundled, can use ES imports) --> "])), defineScriptVars({ __tn: userName }));
}, "C:/Users/abdellatif/Videos/keto-app/src/components/AppTour.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const maxDays = getMaxJourneyDays(planType);
  const tierLabel = planType === "elite_12" ? "Elite" : planType === "pro_6" ? "Pro" : "Basic";
  const { data: onboarding } = await supabase.from("onboarding_data").select("*").eq("user_id", user.id).single();
  if (!onboarding) return Astro2.redirect("/dashboard/onboarding");
  const journey = await getUserJourney(user.id);
  const currentDay = journey?.current_day || 1;
  const currentWeek = Math.ceil(currentDay / 7);
  const totalXP = journey?.total_xp || 0;
  const xpLevel = journey?.level || 1;
  const streakDays = journey?.streak_days || 0;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const { data: rawTasksCurrent } = await supabase.from("daily_tasks").select("id, task_title, task_type, completed, xp_earned").eq("user_id", user.id).eq("day_number", currentDay).order("created_at");
  const { data: rawTasksDay1 } = await supabase.from("daily_tasks").select("id, task_title, task_type, completed, xp_earned").eq("user_id", user.id).eq("day_number", 1).order("created_at");
  const usingFallback = !(rawTasksCurrent && rawTasksCurrent.length > 0);
  const tasks = !usingFallback ? rawTasksCurrent : rawTasksDay1 || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskPct = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
  const { data: todayCheckin } = await supabase.from("daily_checkins").select("*").eq("user_id", user.id).eq("checkin_date", today).maybeSingle();
  const { data: weightLogs } = await supabase.from("weight_logs").select("weight, logged_date").eq("user_id", user.id).order("logged_date", { ascending: false }).limit(8);
  const { data: activeFast } = await supabase.from("fasting_sessions").select("*").eq("user_id", user.id).is("ended_at", null).order("started_at", { ascending: false }).limit(1).maybeSingle();
  const { data: recentCheckins } = await supabase.from("daily_checkins").select("checkin_date, energy_level, followed_meals, water_glasses").eq("user_id", user.id).order("checkin_date", { ascending: false }).limit(7);
  const { data: weekReport } = await supabase.from("weekly_reports").select("id").eq("user_id", user.id).eq("week_number", currentWeek).maybeSingle();
  const mealCycleDays = getMealCycleDays(planType);
  const mealDayTarget = (currentDay - 1) % mealCycleDays + 1;
  const { data: rawMealsDirect } = await supabase.from("meal_plans").select("*, recipe:recipes(id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags)").eq("plan_type", planType).eq("day_number", mealDayTarget).order("meal_type");
  const rawMeals = rawMealsDirect && rawMealsDirect.length > 0 ? rawMealsDirect : await supabase.from("meal_plans").select("*, recipe:recipes(id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags)").eq("plan_type", "basic_30").eq("day_number", mealDayTarget).order("meal_type").then(({ data }) => data || []);
  const restrictions = onboarding?.dietary_restrictions || [];
  const userGoal = onboarding?.goal || "weight_loss";
  const twoWeeksAgo = new Date(Date.now() - 14 * 864e5).toISOString().split("T")[0];
  const { data: recentSwaps } = await supabase.from("meal_swaps").select("original_recipe_id").eq("user_id", user.id).gte("swap_date", twoWeeksAgo);
  const rejectedIds = recentSwaps?.map((s) => s.original_recipe_id) || [];
  const avgEnergy = recentCheckins?.length ? recentCheckins.reduce((s, c) => s + (c.energy_level || 3), 0) / recentCheckins.length : 3;
  const filteredMealTypes = /* @__PURE__ */ new Set();
  const allTodayMeals = (rawMeals || []).filter((meal) => {
    const recipe = meal.recipe;
    if (!recipe) return true;
    recipe.tags || [];
    const title = (recipe.title || "").toLowerCase();
    if (restrictions.includes("no_pork") && ["bacon", "ham", "prosciutto", "chorizo", "sausage", "pork"].some((w) => title.includes(w))) {
      filteredMealTypes.add(meal.meal_type);
      return false;
    }
    if (restrictions.includes("vegetarian") && ["chicken", "beef", "steak", "lamb", "duck", "salmon", "tuna", "shrimp", "cod", "fish"].some((w) => title.includes(w))) {
      filteredMealTypes.add(meal.meal_type);
      return false;
    }
    if (restrictions.includes("no_seafood") && ["salmon", "tuna", "shrimp", "cod", "fish"].some((w) => title.includes(w))) {
      filteredMealTypes.add(meal.meal_type);
      return false;
    }
    return true;
  });
  const todayMeals = allTodayMeals.map((meal) => {
    const r = meal.recipe;
    const mt0 = meal.meal_type;
    meal.icon = mt0;
    meal.slot_adapted = restrictions.length > 0 && filteredMealTypes.has(mt0);
    if (!r) {
      meal.is_adapted = false;
      meal.adapt_reason = "";
      return meal;
    }
    const totalTime = (r.prep_time || 0) + (r.cook_time || 0);
    const adaptReason = rejectedIds.includes(r.id) ? "Previously swapped" : avgEnergy < 2.5 && totalTime > 20 && meal.meal_type !== "snack" ? "Try something quicker" : "";
    meal.is_adapted = !!adaptReason;
    meal.adapt_reason = adaptReason;
    return meal;
  });
  const adaptedCount = todayMeals.filter((m) => m.is_adapted || m.slot_adapted).length;
  const cycleNum = Math.floor((currentDay - 1) / mealCycleDays);
  const cycleWeek = Math.ceil(((currentDay - 1) % mealCycleDays + 1) / 7);
  const totalCalToday = todayMeals.reduce((s, m) => s + (m.recipe?.calories || 0), 0);
  const totalProteinToday = todayMeals.reduce((s, m) => s + parseFloat(m.recipe?.protein || "0"), 0);
  const { data: mealCompletions } = await supabase.from("meal_completions").select("meal_type, recipe_id").eq("user_id", user.id).eq("day_number", currentDay);
  const completedMealTypesArr = (mealCompletions || []).map((c) => c.meal_type);
  const completedMealSet = new Set(completedMealTypesArr);
  const consumedMacros = todayMeals.filter((m) => completedMealSet.has(m.meal_type) && m.recipe).reduce((acc, m) => ({
    calories: acc.calories + (m.recipe.calories || 0),
    protein: acc.protein + parseFloat(m.recipe.protein || "0"),
    fat: acc.fat + parseFloat(m.recipe.fat || "0"),
    net_carbs: acc.net_carbs + parseFloat(m.recipe.net_carbs || "0")
  }), { calories: 0, protein: 0, fat: 0, net_carbs: 0 });
  const { data: macroGoals } = await supabase.from("macro_goals").select("daily_calories, protein_g, fat_g, carbs_g").eq("user_id", user.id).maybeSingle();
  const goalCal = macroGoals?.daily_calories || 1800;
  const goalProt = macroGoals?.protein_g || 120;
  const goalFat = macroGoals?.fat_g || 120;
  const goalCarb = macroGoals?.carbs_g || 25;
  const { data: foodLogs } = await supabase.from("food_logs").select("*").eq("user_id", user.id).eq("logged_date", today).order("created_at", { ascending: true });
  const todayFoodLogs = foodLogs || [];
  const foodLogMacros = todayFoodLogs.reduce((acc, f) => ({
    calories: acc.calories + (f.calories || 0),
    protein: acc.protein + parseFloat(f.protein_g || "0"),
    fat: acc.fat + parseFloat(f.fat_g || "0"),
    net_carbs: acc.net_carbs + parseFloat(f.carbs_g || "0")
  }), { calories: 0, protein: 0, fat: 0, net_carbs: 0 });
  const totalConsumed = {
    calories: consumedMacros.calories + foodLogMacros.calories,
    protein: consumedMacros.protein + foodLogMacros.protein,
    fat: consumedMacros.fat + foodLogMacros.fat,
    net_carbs: consumedMacros.net_carbs + foodLogMacros.net_carbs
  };
  const calPct = Math.min(100, Math.round(totalConsumed.calories / goalCal * 100));
  const protPct = Math.min(100, Math.round(totalConsumed.protein / goalProt * 100));
  const fatPct = Math.min(100, Math.round(totalConsumed.fat / goalFat * 100));
  const carbPct = Math.min(100, Math.round(totalConsumed.net_carbs / goalCarb * 100));
  const startWeight = onboarding?.current_weight || profile.weight_kg || 0;
  const latestWeight = weightLogs?.[0]?.weight || startWeight;
  const weightLost = Math.max(0, startWeight - latestWeight);
  const targetWeight = onboarding?.target_weight || profile.target_weight_kg || 0;
  const progressPct = targetWeight && startWeight > targetWeight ? Math.min(100, Math.round(weightLost / (startWeight - targetWeight) * 100)) : 0;
  const xpInLevel = totalXP % 500;
  const xpPct = Math.round(xpInLevel / 500 * 100);
  const journeyPct = Math.min(100, Math.round(currentDay / maxDays * 100));
  const streakPct = Math.min(100, Math.round(streakDays / 30 * 100));
  const userName = profile.full_name?.split(" ")[0] || "there";
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const daysToGo = Math.max(0, maxDays - currentDay);
  const xpDisplay = totalXP >= 1e3 ? (totalXP / 1e3).toFixed(1) + "k" : String(totalXP);
  const units = profile.preferred_units || "imperial";
  const wUnit = units === "imperial" ? "lbs" : "kg";
  const dispLatest = latestWeight ? units === "imperial" ? Math.round(latestWeight * 2.20462 * 10) / 10 : latestWeight : 0;
  const weekNum = currentWeek;
  const streak = streakDays;
  const level = xpLevel;
  const checkinDone = !!todayCheckin;
  const weeklyDone = !!weekReport;
  const fastingActive = !!activeFast;
  const weightLogToday = weightLogs?.[0]?.logged_date === today;
  const waterGlasses = todayCheckin?.water_glasses || 0;
  const waterPct = Math.min(100, Math.round(waterGlasses / 8 * 100));
  const smartTaskPct = usingFallback ? Math.min(100, (checkinDone ? 40 : 0) + (fastingActive ? 20 : 0) + (completedTasks > 0 ? 40 : 0)) : taskPct;
  const weekPhase = currentDay <= 7 ? "adapt" : currentDay <= 14 ? "burn" : "thrive";
  const progressMsg = smartTaskPct === 0 ? "Start your day!" : smartTaskPct < 50 ? "Keep going!" : smartTaskPct < 100 ? "Almost there!" : "Perfect day!";
  const streakDotMax = Math.min(streakDays + 3, 14);
  const milestoneInterval = planType === "basic_30" ? 7 : 30;
  const milestoneCount = Math.floor(maxDays / milestoneInterval);
  const journeyMilestones = Array.from({ length: milestoneCount }, (_, i) => {
    const d = (i + 1) * milestoneInterval;
    return { day: d, pct: Math.round(d / maxDays * 100), reached: currentDay >= d };
  });
  const mealTypeConfig = {
    breakfast: { label: "Breakfast", color: "#b45309", bg: "linear-gradient(135deg,#92400e,#b45309)" },
    lunch: { label: "Lunch", color: "#059669", bg: "linear-gradient(135deg,#065f46,#059669)" },
    dinner: { label: "Dinner", color: "#7c3aed", bg: "linear-gradient(135deg,#3730a3,#6d28d9)" },
    snack: { label: "Snack", color: "#0284c7", bg: "linear-gradient(135deg,#0c4a6e,#0369a1)" }
  };
  const fastingData = activeFast ? {
    started_at: activeFast.started_at,
    target_hours: activeFast.target_hours || 16,
    protocol: activeFast.protocol || "IF"
  } : null;
  const recentAvgEnergy = recentCheckins?.length ? recentCheckins.reduce((s, c) => s + (c.energy_level || 3), 0) / recentCheckins.length : 3;
  const week1Tips = [
    { icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', color: "#f59e0b", title: "Salt is your best friend this week", body: "Your kidneys dump sodium on keto. Add \xBD tsp of salt to a glass of water each morning. This alone fixes most keto flu symptoms within hours." },
    { icon: '<path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"/>', color: "#3b82f6", title: "Drink before you feel thirsty", body: "On keto, thirst response lags behind. Aim for 2.5\u20133L of water per day. Set phone reminders if needed \u2014 dehydration causes false hunger cravings." },
    { icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', color: "#10b981", title: "Fat doesn't make you fat on keto", body: 'The old "dietary fat = body fat" myth is wrong. On keto, dietary fat is your primary fuel. Eating fat turns OFF fat storage hormones and keeps you satiated for hours.' },
    { icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', color: "#ef4444", title: "Keto flu is temporary \u2014 push through", body: "Headaches, fatigue, and brain fog in days 1\u20135 are normal. Your brain is switching fuel sources. Electrolytes + hydration + sleep will cut this phase short." },
    { icon: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>', color: "#8b5cf6", title: "Your brain runs on ketones now", body: "The brain is 25% of your energy budget. It's learning to use ketones instead of glucose. By week 2, most people report sharper mental clarity than they've had in years." },
    { icon: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>', color: "#10b981", title: "Protein protects your muscle", body: "Aim for 1.2\u20131.7g of protein per kg of bodyweight per day. Too little = muscle loss. Too much = gluconeogenesis. For a 75kg person: 90\u2013130g protein/day." },
    { icon: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>', color: "#8b5cf6", title: "Sleep is a keto superpower", body: "During sleep, growth hormone surges and fat burning peaks. Poor sleep raises cortisol \u2192 raises blood sugar \u2192 kicks you out of ketosis. Protect your sleep this week." }
  ];
  const week2Tips = [
    { icon: '<path d="M12 2c0 0-5 4.5-5 9a5 5 0 0010 0c0-4.5-5-9-5-9zm0 14a3 3 0 01-3-3c0-2 2-4.5 3-6 1 1.5 3 4 3 6a3 3 0 01-3 3z"/>', color: "#f97316", title: "You're building fat-burning machinery", body: "Week 2 is when your mitochondria start multiplying and fat-oxidation enzymes upregulate. Energy will stabilize. The keto flu is behind you \u2014 the real benefits are ahead." },
    { icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>', color: "#3b82f6", title: "Scale stall? That's normal.", body: "After week 1's water loss, the scale often stalls for 3\u20135 days. Your body is adapting internally. Waist circumference is shrinking even when weight doesn't move. Keep going." },
    { icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', color: "#10b981", title: "You can exercise now \u2014 but go easy", body: "Light weights and walking are perfect this week. High-intensity training is best saved for week 4+ when fat adaptation is complete. Your muscles are still learning." },
    { icon: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>', color: "#f59e0b", title: "Meal prep is the #1 habit", body: "People who succeed on keto have one thing in common: they cook in batches. Spend 90 minutes on Sunday preparing proteins and vegetables. It removes daily willpower decisions." }
  ];
  const week3Tips = [
    { icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', color: "#10b981", title: "You've entered fat-adaptation", body: "By week 3, your fat-burning enzymes are maximized. Energy is stable all day. This is why keto feels so different from calorie restriction \u2014 you're running on a clean, abundant fuel." },
    { icon: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>', color: "#f59e0b", title: "Try combining keto + intermittent fasting", body: "Now that you're adapted, 16:8 fasting is effortless. Skip breakfast, eat noon\u20138pm. The synergy between keto and IF burns fat at a rate neither achieves alone." },
    { icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>', color: "#8b5cf6", title: "Your inflammation is dropping", body: "Ketones are anti-inflammatory. By week 3, many people notice less joint pain, better skin, reduced bloating, and clearer sinuses. This is your body healing systemically." }
  ];
  const tipPool = weekPhase === "adapt" ? week1Tips : weekPhase === "burn" ? week2Tips : week3Tips;
  const { data: habitsRaw } = await supabase.from("habits").select("id, title, icon, category").eq("user_id", user.id).eq("is_active", true).order("sort_order").order("created_at").limit(6);
  const dashHabits = habitsRaw || [];
  const { data: habitDoneRaw } = await supabase.from("habit_completions").select("habit_id").eq("user_id", user.id).eq("completed_date", today);
  const habitDoneIds = new Set((habitDoneRaw || []).map((h) => h.habit_id));
  const habitsDoneCount = dashHabits.filter((h) => habitDoneIds.has(h.id)).length;
  const dailyTip = (() => {
    if (!checkinDone && currentDay > 1)
      return { icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>', color: "#10b981", title: "Complete your daily check-in", body: "Tracking energy, mood, and water takes 60 seconds but gives you weeks of insight. Your streak depends on it \u2014 don't break it today!" };
    if (waterGlasses === 0 && currentDay > 1)
      return { icon: '<path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"/>', color: "#3b82f6", title: "Start drinking water now", body: "You haven't logged any water today. Keto demands more hydration than a standard diet. Low water = false hunger, headaches, and reduced fat burning. Drink a glass right now." };
    if (recentAvgEnergy < 2.5 && recentCheckins && recentCheckins.length >= 3)
      return { icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', color: "#f59e0b", title: "Low energy? Check your electrolytes", body: "3+ days of low energy usually means electrolyte deficiency, not a keto problem. Add sodium, potassium (avocado), and magnesium glycinate at bedtime. Results are felt within 24 hours." };
    if (streakDays >= 7)
      return { icon: '<path d="M12 2c0 0-5 4.5-5 9a5 5 0 0010 0c0-4.5-5-9-5-9zm0 14a3 3 0 01-3-3c0-2 2-4.5 3-6 1 1.5 3 4 3 6a3 3 0 01-3 3z"/>', color: "#f97316", title: `${streakDays}-day streak \u2014 you're on fire!`, body: "Consistency is the #1 predictor of long-term keto success. Your body is adapting more deeply every day you stay on track. Each day now compounds the results of every day before it." };
    if (fastingActive)
      return { icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', color: "#8b5cf6", title: "Fasting + keto: the ultimate combo", body: "While you fast, your already-low glycogen burns away in hours instead of days. You'll reach deep fat-burning mode today faster than any non-keto faster. Stay strong \u2014 the hardest part is hour 10\u201314." };
    return tipPool[(currentDay - 1) % tipPool.length];
  })();
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-y55gmoyq> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dashboard \xB7 Day ', ` \xB7 Keto</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, "</head> <body data-astro-cid-y55gmoyq> ", ' <!-- PAGE --> <div class="page" data-astro-cid-y55gmoyq> <!-- HERO --> <div class="dash-hero" data-astro-cid-y55gmoyq> <div class="dh-left" data-astro-cid-y55gmoyq> <div class="dh-greeting" data-astro-cid-y55gmoyq>', ", <em data-astro-cid-y55gmoyq>", '</em></div> <div class="dh-sub" data-astro-cid-y55gmoyq>Day ', " of your keto journey &middot; Week ", '</div> <div class="dh-stats" data-astro-cid-y55gmoyq> <span class="dh-pill dh-fire" data-astro-cid-y55gmoyq> <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-y55gmoyq><path d="M12 23c6.075 0 11-4.925 11-11 0-3.63-1.756-6.852-4.474-8.882C18.526 3.118 18 3.5 18 4c0 1.657-1.343 3-3 3-1.657 0-3-1.343-3-3 0-.552-.447-1-.999-.955C7.137 3.517 4 7.41 4 12c0 6.075 4.925 11 8 11z" data-astro-cid-y55gmoyq></path></svg> ', ' day streak\n</span> <span class="dh-pill dh-xp" data-astro-cid-y55gmoyq> <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" data-astro-cid-y55gmoyq></polygon></svg> ', ' XP\n</span> <span class="dh-pill dh-lvl" data-astro-cid-y55gmoyq> <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq><circle cx="12" cy="8" r="6" data-astro-cid-y55gmoyq></circle><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" data-astro-cid-y55gmoyq></path></svg>\nLevel ', ' </span> </div> </div> <div class="dh-progress" data-astro-cid-y55gmoyq> <div class="dh-prog-label" data-astro-cid-y55gmoyq> <span data-astro-cid-y55gmoyq>', "% complete</span> <span data-astro-cid-y55gmoyq>", ' days to go</span> </div> <div class="dh-prog-track" style="position:relative;" data-astro-cid-y55gmoyq> <div class="dh-prog-fill"', " data-astro-cid-y55gmoyq></div> ", ' </div> <div style="display:flex;justify-content:space-between;margin-top:.3rem;" data-astro-cid-y55gmoyq> ', ' </div> </div> </div> <!-- DAILY TIP --> <div class="daily-tip"', ' data-astro-cid-y55gmoyq> <div class="dt-icon" data-astro-cid-y55gmoyq><svg width="20" height="20" viewBox="0 0 24 24" fill="none"', ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq>', '</svg></div> <div class="dt-body" data-astro-cid-y55gmoyq> <div class="dt-title" data-astro-cid-y55gmoyq>', '</div> <div class="dt-text" data-astro-cid-y55gmoyq>', `</div> </div> <button class="dt-close" onclick="this.closest('.daily-tip').style.display='none'" title="Dismiss" data-astro-cid-y55gmoyq>\xD7</button> </div> <!-- STATS --> <div class="stats-row" id="tour-stats" data-astro-cid-y55gmoyq> <div class="stat-card" style="--glow:rgba(16,185,129,.09);--glow-color:rgba(16,185,129,.6);--icon-bg:rgba(16,185,129,.1);animation-delay:.04s" data-astro-cid-y55gmoyq> <div class="sc-shimmer" data-astro-cid-y55gmoyq></div> <div class="stat-icon" style="color:var(--green)" data-astro-cid-y55gmoyq>`, '</div> <div class="stat-val" style="color:var(--green)" data-astro-cid-y55gmoyq>', '</div> <div class="stat-lbl" data-astro-cid-y55gmoyq>Weight Lost</div> ', ' <div class="stat-mini-bar" data-astro-cid-y55gmoyq><div class="stat-mini-fill"', ' data-astro-cid-y55gmoyq></div></div> </div> <div class="stat-card" style="--glow:rgba(245,158,11,.09);--glow-color:rgba(245,158,11,.6);--icon-bg:rgba(245,158,11,.1);animation-delay:.08s" data-astro-cid-y55gmoyq> <div class="sc-shimmer" data-astro-cid-y55gmoyq></div> <div class="stat-icon" style="color:var(--amber)" data-astro-cid-y55gmoyq>', '</div> <div class="stat-val" style="color:var(--amber)" data-astro-cid-y55gmoyq>', '</div> <div class="stat-lbl" data-astro-cid-y55gmoyq>Day Streak</div> ', ' <div class="stat-mini-bar" data-astro-cid-y55gmoyq><div class="stat-mini-fill"', ' data-astro-cid-y55gmoyq></div></div> </div> <div class="stat-card" style="--glow:rgba(139,92,246,.09);--glow-color:rgba(139,92,246,.6);--icon-bg:rgba(139,92,246,.1);animation-delay:.12s" data-astro-cid-y55gmoyq> <div class="sc-shimmer" data-astro-cid-y55gmoyq></div> <div class="stat-icon" style="color:var(--purple)" data-astro-cid-y55gmoyq>', '</div> <div class="stat-val" style="color:var(--purple2)" id="xpLevelDisplay" data-astro-cid-y55gmoyq>Lv.', '</div> <div class="stat-lbl" id="xpTotalDisplay" data-astro-cid-y55gmoyq>', ' XP</div> <span class="stat-badge bg-b" id="xpInLevelDisplay" data-astro-cid-y55gmoyq>\u2192 ', '/500</span> <div class="stat-mini-bar" data-astro-cid-y55gmoyq><div class="stat-mini-fill" id="xpMiniBar"', ' data-astro-cid-y55gmoyq></div></div> </div> <div class="stat-card" style="--glow:rgba(59,130,246,.09);--glow-color:rgba(59,130,246,.6);--icon-bg:rgba(59,130,246,.1);animation-delay:.16s" data-astro-cid-y55gmoyq> <div class="sc-shimmer" data-astro-cid-y55gmoyq></div> <div class="stat-icon" style="color:var(--blue)" data-astro-cid-y55gmoyq>', '</div> <div class="stat-val" style="color:var(--blue2)" data-astro-cid-y55gmoyq>', '</div> <div class="stat-lbl" data-astro-cid-y55gmoyq>of ', " days</div> ", " ", " ", ' <div class="stat-mini-bar" data-astro-cid-y55gmoyq><div class="stat-mini-fill"', ' data-astro-cid-y55gmoyq></div></div> </div> </div> <!-- QUICK ACTIONS --> <div class="qa-grid" id="tour-quick-actions" data-astro-cid-y55gmoyq> <a href="/dashboard/checkin"', ' data-astro-cid-y55gmoyq> <div class="qa-icon-wrap" data-astro-cid-y55gmoyq>', '</div> <span class="qa-lbl" data-astro-cid-y55gmoyq>Check-in</span> <span class="qa-sub" data-astro-cid-y55gmoyq>', '</span> </a> <a href="/dashboard/fasting"', ' data-astro-cid-y55gmoyq> <div class="qa-icon-wrap" data-astro-cid-y55gmoyq>', '</div> <span class="qa-lbl" data-astro-cid-y55gmoyq>Fasting</span> <span class="qa-sub" data-astro-cid-y55gmoyq>', '</span> </a> <a href="/dashboard/weekly"', ' data-astro-cid-y55gmoyq> <div class="qa-icon-wrap" data-astro-cid-y55gmoyq>', '</div> <span class="qa-lbl" data-astro-cid-y55gmoyq>Weekly</span> <span class="qa-sub" data-astro-cid-y55gmoyq>', '</span> </a> <a href="/dashboard/recipes" class="qa-btn" data-astro-cid-y55gmoyq> <div class="qa-icon-wrap" data-astro-cid-y55gmoyq>', '</div> <span class="qa-lbl" data-astro-cid-y55gmoyq>Recipes</span> <span class="qa-sub" data-astro-cid-y55gmoyq>', '</span> </a> <a href="/dashboard/progress" class="qa-btn" data-astro-cid-y55gmoyq> <div class="qa-icon-wrap" data-astro-cid-y55gmoyq>', '</div> <span class="qa-lbl" data-astro-cid-y55gmoyq>Progress</span> <span class="qa-sub" data-astro-cid-y55gmoyq>Charts</span> </a> <a href="/dashboard/shopping" class="qa-btn" data-astro-cid-y55gmoyq> <div class="qa-icon-wrap" data-astro-cid-y55gmoyq>', '</div> <span class="qa-lbl" data-astro-cid-y55gmoyq>Shopping</span> <span class="qa-sub" data-astro-cid-y55gmoyq>Week ', '</span> </a> </div> <!-- MAIN GRID --> <div class="main-grid" data-astro-cid-y55gmoyq> <div data-astro-cid-y55gmoyq> <!-- TASKS CARD --> <div class="card" id="tour-tasks" style="border-left:3px solid rgba(16,185,129,.35);" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', "\nToday's Tasks \u2014 Day ", ' <span class="ct-badge bg-g" id="tasksBadge" data-astro-cid-y55gmoyq>', "/", ' done</span> </div> <div class="ring-row" data-astro-cid-y55gmoyq> <div class="ring-wrap" data-astro-cid-y55gmoyq> <svg width="72" height="72" viewBox="0 0 72 72" data-astro-cid-y55gmoyq> <defs data-astro-cid-y55gmoyq> <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%" data-astro-cid-y55gmoyq> <stop offset="0%" stop-color="#10b981" data-astro-cid-y55gmoyq></stop><stop offset="100%" stop-color="#34d399" data-astro-cid-y55gmoyq></stop> </linearGradient> </defs> <circle fill="none" stroke="var(--muted)" stroke-width="6" cx="36" cy="36" r="32" data-astro-cid-y55gmoyq></circle> <circle id="ringSmall" fill="none" stroke="url(#rg1)" stroke-width="6" stroke-linecap="round" cx="36" cy="36" r="32" stroke-dasharray="201"', ' data-astro-cid-y55gmoyq></circle> </svg> <div class="ring-inner" data-astro-cid-y55gmoyq> <span class="ring-pct" id="ringPct" data-astro-cid-y55gmoyq>', '%</span> <span class="ring-lbl" data-astro-cid-y55gmoyq>done</span> </div> </div> <div class="ring-stats" data-astro-cid-y55gmoyq> <div class="rs-row" data-astro-cid-y55gmoyq> <div class="rs-dot" style="background:var(--green)" data-astro-cid-y55gmoyq></div> <span class="rs-num" id="completedCount" data-astro-cid-y55gmoyq>', '</span> <span class="rs-txt" data-astro-cid-y55gmoyq>Completed</span> </div> <div class="rs-row" data-astro-cid-y55gmoyq> <div class="rs-dot" style="background:var(--muted)" data-astro-cid-y55gmoyq></div> <span class="rs-num" id="remainingCount" data-astro-cid-y55gmoyq>', '</span> <span class="rs-txt" data-astro-cid-y55gmoyq>Remaining</span> </div> </div> </div> ', ' </div> <!-- MEALS CARD --> <div class="card" id="tour-meals" style="border-left:3px solid rgba(245,158,11,.3);" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', "\nToday's Meals\n", ' </div> <!-- Cycle variety info line --> <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.85rem;flex-wrap:wrap;" data-astro-cid-y55gmoyq> <span style="font-size:.7rem;color:var(--soft);font-weight:700;" data-astro-cid-y55gmoyq>Week ', " \xB7 Cycle ", "</span> ", " </div> ", " ", " <!-- Goal-aware macro tip --> ", ` </div> </div> <!-- SIDEBAR --> <div class="sidebar" data-astro-cid-y55gmoyq> <!-- Today's Progress --> <div class="card" style="text-align:center;" data-astro-cid-y55gmoyq> <div class="card-title" style="justify-content:center;" data-astro-cid-y55gmoyq> `, `
Today's Progress
</div> <div class="big-ring" data-astro-cid-y55gmoyq> <svg width="120" height="120" viewBox="0 0 120 120" data-astro-cid-y55gmoyq> <defs data-astro-cid-y55gmoyq> <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%" data-astro-cid-y55gmoyq> <stop offset="0%" stop-color="#10b981" data-astro-cid-y55gmoyq></stop><stop offset="100%" stop-color="#34d399" data-astro-cid-y55gmoyq></stop> </linearGradient> </defs> <circle fill="none" stroke="var(--muted)" stroke-width="8" cx="60" cy="60" r="52" data-astro-cid-y55gmoyq></circle> <circle id="ringBig" fill="none" stroke="url(#rg2)" stroke-width="8" stroke-linecap="round" cx="60" cy="60" r="52" stroke-dasharray="327"`, ' data-astro-cid-y55gmoyq></circle> </svg> <div class="big-ring-inner" data-astro-cid-y55gmoyq> <div class="big-ring-pct" id="bigRingPct" data-astro-cid-y55gmoyq>', '%</div> <div class="big-ring-lbl" data-astro-cid-y55gmoyq>done today</div> </div> </div> <p class="prog-sub" id="progMsg" data-astro-cid-y55gmoyq>', '</p> <div class="prog-bars" data-astro-cid-y55gmoyq> <div class="pb-row" data-astro-cid-y55gmoyq> <div class="pb-top" data-astro-cid-y55gmoyq><span class="pb-lbl" data-astro-cid-y55gmoyq>Check-in</span><span class="pb-val" data-astro-cid-y55gmoyq>', '</span></div> <div class="pb-track" data-astro-cid-y55gmoyq><div class="pb-fill"', ' data-astro-cid-y55gmoyq></div></div> </div> <div class="pb-row" data-astro-cid-y55gmoyq> <div class="pb-top" data-astro-cid-y55gmoyq><span class="pb-lbl" data-astro-cid-y55gmoyq>Tasks</span><span class="pb-val" id="tasksPbVal" data-astro-cid-y55gmoyq>', "/", '</span></div> <div class="pb-track" data-astro-cid-y55gmoyq><div class="pb-fill" id="tasksPbFill"', ' data-astro-cid-y55gmoyq></div></div> </div> <div class="pb-row" data-astro-cid-y55gmoyq> <div class="pb-top" data-astro-cid-y55gmoyq><span class="pb-lbl" data-astro-cid-y55gmoyq>Weight goal</span><span class="pb-val" data-astro-cid-y55gmoyq>', '%</span></div> <div class="pb-track" data-astro-cid-y55gmoyq><div class="pb-fill"', ' data-astro-cid-y55gmoyq></div></div> </div> </div> </div> <!-- XP & Level --> <div class="card" style="border-left:3px solid rgba(139,92,246,.3);" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', '\nXP & Level\n</div> <div class="xp-row" data-astro-cid-y55gmoyq> <div class="xp-badge" id="xpBadge" data-astro-cid-y55gmoyq>', '</div> <div class="xp-info" data-astro-cid-y55gmoyq> <div class="xp-lv" id="xpLvText" data-astro-cid-y55gmoyq>Level ', " \u2014 ", '/500 XP</div> <div class="xp-bar-track" data-astro-cid-y55gmoyq><div class="xp-bar-fill" id="xpBarFill"', ' data-astro-cid-y55gmoyq></div></div> <div class="xp-next" id="xpNextText" data-astro-cid-y55gmoyq>', " XP to Level ", '</div> </div> </div> <div class="xp-rows" data-astro-cid-y55gmoyq> <div', ' data-astro-cid-y55gmoyq> <div class="xp-dot" data-astro-cid-y55gmoyq></div><span class="xp-txt" data-astro-cid-y55gmoyq>Daily Check-in</span><span class="xp-pts" data-astro-cid-y55gmoyq>+30 XP</span> </div> <div', ' data-astro-cid-y55gmoyq> <div class="xp-dot" data-astro-cid-y55gmoyq></div><span class="xp-txt" data-astro-cid-y55gmoyq>Complete a Fast</span><span class="xp-pts" data-astro-cid-y55gmoyq>+50 XP</span> </div> <div', ' data-astro-cid-y55gmoyq> <div class="xp-dot" data-astro-cid-y55gmoyq></div><span class="xp-txt" data-astro-cid-y55gmoyq>Weekly Report</span><span class="xp-pts" data-astro-cid-y55gmoyq>+100 XP</span> </div> <div', ' data-astro-cid-y55gmoyq> <div class="xp-dot" data-astro-cid-y55gmoyq></div><span class="xp-txt" data-astro-cid-y55gmoyq>Log Weight</span><span class="xp-pts" data-astro-cid-y55gmoyq>+15 XP</span> </div> </div> </div> <!-- Fasting --> <div class="card" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', " ", " </div> ", ' </div> <!-- Water Tracker --> <div class="card" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', `
Water Today
</div> <div style="text-align:center;margin:.25rem 0 .75rem;" data-astro-cid-y55gmoyq> <span id="waterNum" style="font-family:'Fraunces',serif;font-size:2.4rem;font-weight:900;color:var(--blue);" data-astro-cid-y55gmoyq>`, '</span> <span style="font-size:.85rem;color:var(--soft);font-weight:600;" data-astro-cid-y55gmoyq>/ 8 glasses</span> </div> <!-- Glass icons --> <div id="waterGlasses" style="display:flex;justify-content:center;gap:.3rem;flex-wrap:wrap;margin-bottom:.85rem;" data-astro-cid-y55gmoyq> ', ' </div> <!-- Progress bar --> <div style="height:5px;border-radius:99px;background:rgba(255,255,255,.07);margin-bottom:.85rem;overflow:hidden;" data-astro-cid-y55gmoyq> <div id="waterBar"', ' data-astro-cid-y55gmoyq></div> </div> <!-- Buttons --> <div style="display:flex;gap:.5rem;" data-astro-cid-y55gmoyq> <button onclick="logWater(-1)" style="flex:1;padding:.55rem;border-radius:10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;font-size:1.1rem;font-weight:800;cursor:pointer;transition:all .18s;" title="Remove glass" data-astro-cid-y55gmoyq>\u2212</button> <button onclick="logWater(1)" style="flex:2;padding:.55rem;border-radius:10px;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);color:#60a5fa;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .18s;" data-astro-cid-y55gmoyq>+ Add Glass</button> </div> ', ' </div> <!-- Supplement Tracker --> <div class="card" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', '\nElectrolytes Today\n</div> <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.65rem;" data-astro-cid-y55gmoyq> ', " </div> ", " ", " </div> <!-- Habits Widget --> ", " ", " <!-- Weight Trend --> ", ' <!-- Log Weight Widget --> <div class="card" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ', '\nLog Weight\n</div> <div class="wl-row" data-astro-cid-y55gmoyq> <span class="wl-current" id="wlCurrentVal" data-astro-cid-y55gmoyq>', '</span> <span class="wl-unit" data-astro-cid-y55gmoyq>', ' current</span> </div> <div class="wl-inputs" data-astro-cid-y55gmoyq> <input id="wlWeightInput" class="wl-input" type="number" step="0.1"', "", "", "", ' data-astro-cid-y55gmoyq> <input id="wlDateInput" class="wl-input" type="date"', ' data-astro-cid-y55gmoyq> </div> <button class="wl-btn" id="wlBtn" onclick="window.logWeight()" data-astro-cid-y55gmoyq>Log Weight</button> <div class="wl-confirm" id="wlConfirm" data-astro-cid-y55gmoyq>\u2713 Logged!</div> <a href="/dashboard/progress" class="wl-history" data-astro-cid-y55gmoyq>View history \u2192</a> </div> <!-- Streak --> <div class="card streak-card" style="border-left:3px solid rgba(245,158,11,.35);" data-astro-cid-y55gmoyq> <div class="card-title" style="justify-content:center;" data-astro-cid-y55gmoyq> ', '\nStreak\n</div> <div class="streak-num" data-astro-cid-y55gmoyq>', '</div> <div class="streak-lbl" data-astro-cid-y55gmoyq>days in a row</div> <div class="streak-dots" data-astro-cid-y55gmoyq> ', ' </div> </div> </div> </div> </div> <div class="toast-wrap" id="toastWrap" data-astro-cid-y55gmoyq></div> <script>(function(){', `
/* \u2500\u2500 FASTING TIMER \u2500\u2500 */
if (fastingData) {
  var t0 = new Date(fastingData.started_at).getTime();
  var tgt = fastingData.target_hours * 3600000;
  var timerEl = document.getElementById('fastTimer');
  var barEl   = document.getElementById('fastBar');
  function tick() {
    var ms = Date.now() - t0;
    var h  = Math.floor(ms / 3600000);
    var m  = Math.floor((ms % 3600000) / 60000);
    var s  = Math.floor((ms % 60000) / 1000);
    if (timerEl) timerEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    if (barEl)   barEl.style.width = Math.min(100, (ms / tgt) * 100) + '%';
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  tick(); setInterval(tick, 1000);
}

/* \u2500\u2500 TASK TOGGLE \u2500\u2500 */
var _completed = initCompleted;
var _total     = totalTasks;
var _taskPct   = initTaskPct;

window.toggleTask = function toggleTask(el) {
  var id   = el.getAttribute('data-task-id');
  var done = el.getAttribute('data-completed') === 'true';
  var newDone = !done;

  // Optimistic UI update
  el.classList.toggle('done', newDone);
  el.setAttribute('data-completed', newDone ? 'true' : 'false');
  el.classList.add('loading');
  // Re-trigger SVG draw animation by cloning the path
  if (newDone) {
    var path = el.querySelector('.task-chk-path');
    if (path) { var p2 = path.cloneNode(true); path.parentNode.replaceChild(p2, path); }
  }

  fetch('/api/tasks/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: id, completed: newDone }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    el.classList.remove('loading');
    if (!data.success) {
      // Revert on failure
      el.classList.toggle('done', done);
      el.setAttribute('data-completed', done ? 'true' : 'false');
      return;
    }
    // Update counts
    _completed = newDone ? _completed + 1 : _completed - 1;
    _completed = Math.max(0, Math.min(_total, _completed));
    _taskPct   = _total > 0 ? Math.round((_completed / _total) * 100) : 0;
    updateTaskUI();

    // Toast when all tasks complete
    if (newDone && _taskPct === 100) showToast('Perfect day! All tasks done!');
    // Check achievements
    if (newDone) checkAchievements();

    // Update XP display + celebration if awarded
    if (data.xpAwarded && newDone) {
      var prevLevel = Math.floor(totalXP / 500) + 1;
      var newTotal  = totalXP + data.xpAwarded;
      var newInLvl  = newTotal % 500;
      var newLevel  = Math.floor(newTotal / 500) + 1;
      var newPct    = Math.round((newInLvl / 500) * 100);
      var leveledUp = newLevel > prevLevel;
      totalXP = newTotal;
      updateXPDisplay(newTotal, newInLvl, newLevel, newPct);
      showXP('+' + data.xpAwarded + ' XP', leveledUp, leveledUp ? newLevel : null);
    }
  })
  .catch(function() {
    el.classList.remove('loading');
    el.classList.toggle('done', done);
    el.setAttribute('data-completed', done ? 'true' : 'false');
  });
}

function updateTaskUI() {
  var badge   = document.getElementById('tasksBadge');
  var pctEl   = document.getElementById('ringPct');
  var bigPct  = document.getElementById('bigRingPct');
  var compEl  = document.getElementById('completedCount');
  var remEl   = document.getElementById('remainingCount');
  var pbVal   = document.getElementById('tasksPbVal');
  var pbFill  = document.getElementById('tasksPbFill');
  var rSmall  = document.getElementById('ringSmall');
  var rBig    = document.getElementById('ringBig');
  var msgEl   = document.getElementById('progMsg');

  if (badge)  badge.textContent  = _completed + '/' + _total + ' done';
  if (pctEl)  pctEl.textContent  = _taskPct + '%';
  if (bigPct) bigPct.textContent = _taskPct + '%';
  if (compEl) compEl.textContent = String(_completed);
  if (remEl)  remEl.textContent  = String(_total - _completed);
  if (pbVal)  pbVal.textContent  = _completed + '/' + _total;
  if (pbFill) pbFill.style.width = _taskPct + '%';
  if (rSmall) rSmall.style.strokeDashoffset = String(201 - (201 * _taskPct / 100));
  if (rBig)   rBig.style.strokeDashoffset   = String(327 - (327 * _taskPct / 100));
  if (msgEl)  msgEl.textContent = _taskPct === 0 ? 'Start your day!' : (_taskPct < 50 ? 'Keep going!' : (_taskPct < 100 ? 'Almost there!' : 'Perfect day!'));
}

function updateXPDisplay(newTotal, newInLvl, newLevel, newPct) {
  var lvDisp = document.getElementById('xpLevelDisplay');
  var ttDisp = document.getElementById('xpTotalDisplay');
  var ilDisp = document.getElementById('xpInLevelDisplay');
  var badge  = document.getElementById('xpBadge');
  var lvTxt  = document.getElementById('xpLvText');
  var bar    = document.getElementById('xpBarFill');
  var nxt    = document.getElementById('xpNextText');

  var mini = document.getElementById('xpMiniBar');
  if (lvDisp) lvDisp.textContent = 'Lv.' + newLevel;
  if (ttDisp) ttDisp.textContent = newTotal.toLocaleString() + ' XP';
  if (ilDisp) ilDisp.textContent = '\u2192 ' + newInLvl + '/500';
  if (badge)  badge.textContent  = String(newLevel);
  if (lvTxt)  lvTxt.textContent  = 'Level ' + newLevel + ' \u2014 ' + newInLvl + '/500 XP';
  if (bar)    bar.style.width    = newPct + '%';
  if (mini)   mini.style.width   = newPct + '%';
  if (nxt)    nxt.textContent    = (500 - newInLvl) + ' XP to Level ' + (newLevel + 1);
}

function showXP(msg, isLevelUp, newLevel) {
  // Floating XP burst
  var wrap = document.createElement('div');
  wrap.className = 'xp-float';
  var txt = document.createElement('div');
  txt.className = 'xp-float-txt';
  txt.textContent = msg;
  var sub = document.createElement('div');
  sub.className = 'xp-float-sub';
  sub.textContent = 'XP earned!';
  wrap.appendChild(txt);
  wrap.appendChild(sub);
  document.body.appendChild(wrap);
  setTimeout(function() { wrap.remove(); }, 2100);

  // Particle sparks
  var colors = ['#f59e0b','#fcd34d','#34d399','#a78bfa','#f87171'];
  for (var i = 0; i < 14; i++) {
    var spark = document.createElement('div');
    spark.className = 'xp-spark';
    var angle = (i / 14) * 360;
    var dist  = 60 + Math.random() * 80;
    var tx    = Math.round(Math.cos(angle * Math.PI / 180) * dist);
    var ty    = Math.round(Math.sin(angle * Math.PI / 180) * dist - 120);
    spark.style.cssText = 'left:50%;bottom:30%;margin-left:-3px;background:' + colors[i % colors.length] + ';--tx:' + tx + 'px;--ty:' + ty + 'px;--d:' + (0.8 + Math.random() * 0.6) + 's;';
    document.body.appendChild(spark);
    setTimeout(function(s) { s.remove(); }, 1500, spark);
  }

  // Level-up overlay if leveled up
  if (isLevelUp && newLevel) {
    setTimeout(function() {
      var ov = document.createElement('div');
      ov.className = 'lvlup-overlay';
      ov.innerHTML = '<div class="lvlup-ring"><div class="lvlup-num">' + newLevel + '</div><div class="lvlup-lbl">Level</div></div><div class="lvlup-title">Level Up!</div><div class="lvlup-sub">You reached Level ' + newLevel + '</div>';
      document.body.appendChild(ov);
      setTimeout(function() { ov.remove(); }, 3400);
    }, 300);
  }
}

/* \u2500\u2500 MEAL EATEN \u2500\u2500 */
var _eatenTypes;
try { _eatenTypes = new Set(completedMealTypesArr || []); } catch(e) { _eatenTypes = new Set(); }
var _macros = { calories: initConsumedMacros.calories, protein: initConsumedMacros.protein, fat: initConsumedMacros.fat, net_carbs: initConsumedMacros.net_carbs };

window.toggleMealEaten = function toggleMealEaten(btn) {
  var mealType = btn.getAttribute('data-meal-type');
  var recipeId = btn.getAttribute('data-recipe-id') || null;
  var isEaten  = _eatenTypes.has(mealType);
  var action   = isEaten ? 'uncomplete' : 'complete';

  btn.disabled = true;
  btn.textContent = '\u23F3';

  fetch('/api/meals/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meal_type: mealType, recipe_id: recipeId || undefined, day_number: currentDay, action: action, client_date: new Date().toLocaleDateString('en-CA') }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    btn.disabled = false;
    if (!data.success) {
      btn.textContent = isEaten ? '\u2713 Eaten' : 'Mark Eaten';
      showToast(data.error || 'Failed');
      return;
    }
    // Update eaten state
    if (action === 'complete') {
      _eatenTypes.add(mealType);
      btn.textContent = '\u2713 Eaten';
      btn.classList.add('eaten');
      btn.closest('.meal-item').classList.add('meal-eaten');
      if (data.xp_earned) showXP('+' + data.xp_earned + ' XP');
      showToast(mealType.charAt(0).toUpperCase() + mealType.slice(1) + ' logged!');
      checkAchievements();
    } else {
      _eatenTypes.delete(mealType);
      btn.textContent = 'Mark Eaten';
      btn.classList.remove('eaten');
      btn.closest('.meal-item').classList.remove('meal-eaten');
    }
    // Update macros display
    if (data.macros) {
      _macros = data.macros;
      updateMacroBars();
    }
    // XP display update
    if (data.xp_earned && action === 'complete') {
      var newTotal = totalXP + data.xp_earned;
      var newInLvl = newTotal % 500;
      var newLevel = Math.floor(newTotal / 500) + 1;
      var newPct   = Math.round((newInLvl / 500) * 100);
      updateXPDisplay(newTotal, newInLvl, newLevel, newPct);
    }
  })
  .catch(function() {
    btn.disabled = false;
    btn.textContent = isEaten ? '\u2713 Eaten' : 'Mark Eaten';
    showToast('Connection error');
  });
}

function updateMacroBars() {
  var cPct = Math.min(100, Math.round((_macros.calories  / goalCal)  * 100));
  var pPct = Math.min(100, Math.round((_macros.protein   / goalProt) * 100));
  var fPct = Math.min(100, Math.round((_macros.fat       / goalFat)  * 100));
  var kPct = Math.min(100, Math.round((_macros.net_carbs / goalCarb) * 100));

  var calFill = document.getElementById('mbCalFill'); if (calFill) calFill.style.width = cPct + '%';
  var prtFill = document.getElementById('mbProtFill'); if (prtFill) prtFill.style.width = pPct + '%';
  var fatFill = document.getElementById('mbFatFill'); if (fatFill) fatFill.style.width = fPct + '%';
  var crbFill = document.getElementById('mbCarbFill'); if (crbFill) crbFill.style.width = kPct + '%';
  var calVal  = document.getElementById('mbCalVal');  if (calVal)  calVal.textContent  = Math.round(_macros.calories);
  var prtVal  = document.getElementById('mbProtVal'); if (prtVal)  prtVal.textContent  = Math.round(_macros.protein) + 'g';
  var fatVal  = document.getElementById('mbFatVal');  if (fatVal)  fatVal.textContent  = Math.round(_macros.fat) + 'g';
  var crbVal  = document.getElementById('mbCarbVal'); if (crbVal)  crbVal.textContent  = Math.round(_macros.net_carbs) + 'g';
  // Update calorie ring
  var ring = document.getElementById('macroRingCircle');
  if (ring) ring.style.strokeDashoffset = (144.5 - 144.5 * cPct / 100).toFixed(1);
  var ringPct = document.getElementById('macroRingPct');
  if (ringPct) ringPct.textContent = cPct + '%';
  var calsDisp = document.getElementById('macroCalsDisplay');
  if (calsDisp) calsDisp.firstChild.textContent = Math.round(_macros.calories) + ' ';
}

/* \u2500\u2500 MEAL SWAP \u2500\u2500 */
window.swapMeal = function swapMeal(btn) {
  var recipeId = btn.getAttribute('data-recipe-id');
  var reason   = btn.getAttribute('data-reason');
  btn.disabled = true;
  btn.textContent = '\u23F3';
  fetch('/api/meals/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original_recipe_id: recipeId, reason: reason }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success && data.new_recipe) {
      showToast('Meal swapped!');
      setTimeout(function() { window.location.reload(); }, 800);
    } else {
      btn.disabled = false;
      btn.textContent = 'Swap';
      showToast(data.error || 'No alternatives found');
    }
  })
  .catch(function() {
    btn.disabled = false;
    btn.textContent = 'Swap';
    showToast('Swap failed');
  });
}

/* \u2500\u2500 FOOD LOG \u2500\u2500 */
var _foodLogs = (initFoodLogs || []).map(function(f) { return Object.assign({}, f); });

window.openFoodModal = function openFoodModal() {
  var m = document.getElementById('foodModal');
  if (m) { m.style.display = 'flex'; document.getElementById('flName').focus(); }
};
window.closeFoodModal = function closeFoodModal() {
  var m = document.getElementById('foodModal');
  if (m) m.style.display = 'none';
  ['flName','flCal','flProt','flFat','flCarb'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
};

window.saveFoodLog = function saveFoodLog() {
  var name = document.getElementById('flName').value.trim();
  if (!name) { document.getElementById('flName').focus(); return; }
  var cal  = parseFloat(document.getElementById('flCal').value)  || 0;
  var prot = parseFloat(document.getElementById('flProt').value) || 0;
  var fat  = parseFloat(document.getElementById('flFat').value)  || 0;
  var carb = parseFloat(document.getElementById('flCarb').value) || 0;
  var meal = document.getElementById('flMeal').value || 'other';

  var btn = document.getElementById('flSaveBtn');
  btn.disabled = true; btn.textContent = 'Saving\u2026';

  fetch('/api/food-log/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ food_name: name, calories: cal, protein_g: prot, fat_g: fat, carbs_g: carb, meal_type: meal }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    btn.disabled = false; btn.textContent = 'Add to Log';
    if (data.success && data.entry) {
      _foodLogs.push(data.entry);
      addFoodLogItemToUI(data.entry);
      // Update macro totals
      _macros.calories  += cal;
      _macros.protein   += prot;
      _macros.fat       += fat;
      _macros.net_carbs += carb;
      updateMacroBars();
      closeFoodModal();
      showToast(name + ' logged!');
    } else {
      showToast(data.error || 'Failed');
    }
  })
  .catch(function() {
    btn.disabled = false; btn.textContent = 'Add to Log';
    showToast('Connection error');
  });
};

function addFoodLogItemToUI(f) {
  var list = document.getElementById('foodLogList');
  if (!list) return;
  var el = document.createElement('div');
  el.className = 'fl-item';
  el.setAttribute('data-id', f.id);
  el.style.cssText = 'display:flex;align-items:center;gap:.5rem;padding:.35rem .6rem;background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.18);border-radius:8px;';
  el.innerHTML = '<span style="font-size:.72rem;font-weight:700;color:#a78bfa;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(f.food_name) + '</span>'
    + '<span style="font-size:.67rem;color:var(--soft);white-space:nowrap;">' + f.calories + 'cal \xB7 ' + f.protein_g + 'P \xB7 ' + f.carbs_g + 'C</span>'
    + '<button onclick="deleteFoodLog(this)" data-id="' + f.id + '" style="background:none;border:none;color:var(--soft);cursor:pointer;font-size:.9rem;padding:0 .1rem;line-height:1;" title="Remove">\xD7</button>';
  list.appendChild(el);
}

window.deleteFoodLog = function deleteFoodLog(btn) {
  var id = btn.getAttribute('data-id');
  var item = btn.closest('.fl-item');
  var entry = _foodLogs.find(function(f) { return f.id === id; });

  fetch('/api/food-log/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      if (item) item.remove();
      if (entry) {
        _macros.calories  -= (entry.calories  || 0);
        _macros.protein   -= parseFloat(entry.protein_g  || 0);
        _macros.fat       -= parseFloat(entry.fat_g      || 0);
        _macros.net_carbs -= parseFloat(entry.carbs_g    || 0);
        _macros.calories   = Math.max(0, _macros.calories);
        _macros.protein    = Math.max(0, _macros.protein);
        _macros.fat        = Math.max(0, _macros.fat);
        _macros.net_carbs  = Math.max(0, _macros.net_carbs);
        _foodLogs = _foodLogs.filter(function(f) { return f.id !== id; });
        updateMacroBars();
      }
    }
  })
  .catch(function() {});
};

// Close modal on overlay click
document.getElementById('foodModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeFoodModal();
});

// Enter key submits food log form
document.getElementById('flName')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') window.saveFoodLog();
});

/* \u2500\u2500 WATER TRACKER \u2500\u2500 */
var _water = initWaterGlasses;

window.logWater = function logWater(delta) {
  var newVal = Math.max(0, Math.min(20, _water + delta));
  if (newVal === _water) return;
  _water = newVal;
  updateWaterUI();

  fetch('/api/water/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta: delta }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      _water = data.glasses;
      updateWaterUI();
      if (data.glasses >= 8) {
        showToast('8 glasses reached \u2014 great hydration!');
        checkAchievements();
      }
    }
  })
  .catch(function() {});
};

function updateWaterUI() {
  var numEl   = document.getElementById('waterNum');
  var barEl   = document.getElementById('waterBar');
  var glEl    = document.getElementById('waterGlasses');
  if (numEl)  numEl.textContent = String(_water);
  if (barEl)  barEl.style.width = Math.min(100, Math.round((_water / 8) * 100)) + '%';
  if (glEl) {
    var divs = glEl.querySelectorAll('div');
    divs.forEach(function(d, i) {
      var filled = i < _water;
      d.style.borderColor  = filled ? 'var(--blue)' : 'rgba(255,255,255,.1)';
      d.style.background   = filled ? 'rgba(59,130,246,.35)' : 'transparent';
    });
  }
}

/* \u2500\u2500 ACHIEVEMENTS \u2500\u2500 */
function checkAchievements() {
  fetch('/api/achievements/check', { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.newAchievements && data.newAchievements.length > 0) {
        data.newAchievements.forEach(function(a) {
          showAchievement(a.icon, a.name, a.desc);
        });
      }
    })
    .catch(function() {});
}

function showAchievement(icon, name, desc) {
  var el = document.createElement('div');
  el.style.cssText = [
    'position:fixed;bottom:5rem;right:1.25rem;z-index:9999;',
    'background:linear-gradient(135deg,rgba(245,158,11,.18),rgba(139,92,246,.12));',
    'border:1.5px solid rgba(245,158,11,.45);border-radius:16px;',
    'padding:.875rem 1.1rem;max-width:280px;',
    'box-shadow:0 12px 40px rgba(0,0,0,.4),0 0 0 1px rgba(245,158,11,.12);',
    'animation:achIn .4s cubic-bezier(.4,0,.2,1);',
    'backdrop-filter:blur(16px);',
  ].join('');
  el.innerHTML = [
    '<div style="display:flex;align-items:center;gap:.6rem;">',
    '<span style="font-size:1.6rem;flex-shrink:0;">' + icon + '</span>',
    '<div>',
    '<div style="font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:rgba(245,158,11,.9);margin-bottom:.1rem;">Achievement Unlocked!</div>',
    '<div style="font-size:.85rem;font-weight:800;color:#fde68a;">' + name + '</div>',
    '<div style="font-size:.72rem;color:rgba(255,255,255,.6);margin-top:.1rem;">' + desc + '</div>',
    '</div></div>',
  ].join('');
  document.body.appendChild(el);
  setTimeout(function() {
    el.style.transition = 'all .4s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(function() { if (el.parentNode) el.remove(); }, 400);
  }, 4000);
}

// Add keyframe if not already present
if (!document.getElementById('achStyle')) {
  var s = document.createElement('style');
  s.id = 'achStyle';
  s.textContent = '@keyframes achIn{from{opacity:0;transform:translateY(20px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}';
  document.head.appendChild(s);
}

// Check achievements on load (catches any missed ones)
setTimeout(checkAchievements, 2000);

/* \u2500\u2500 TOAST \u2500\u2500 */
function showToast(msg) {
  var wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  var el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(function() { if (el.parentNode) el.remove(); }, 3200);
}
var _u = new URL(window.location.href);
if (_u.searchParams.get('welcome') === '1') {
  _u.searchParams.delete('welcome');
  history.replaceState({}, '', _u);
  var wm = document.getElementById('welcomeModal');
  if (wm) setTimeout(function() { wm.style.display = 'flex'; }, 400);
}
document.getElementById('welcomeClose')?.addEventListener('click', function() {
  document.getElementById('welcomeModal').style.display = 'none';
});
document.getElementById('welcomeStartBtn')?.addEventListener('click', function() {
  document.getElementById('welcomeModal').style.display = 'none';
});

/* \u2500\u2500 WEIGHT LOG WIDGET \u2500\u2500 */
window.logWeight = function logWeight() {
  var weightInput = document.getElementById('wlWeightInput');
  var dateInput   = document.getElementById('wlDateInput');
  var btn         = document.getElementById('wlBtn');
  var confirm     = document.getElementById('wlConfirm');
  var currentVal  = document.getElementById('wlCurrentVal');

  if (!weightInput || !dateInput) return;

  var weightDisp  = parseFloat(weightInput.value);
  var logged_date = dateInput.value;

  if (!weightDisp || weightDisp <= 0) {
    weightInput.focus();
    return;
  }
  if (!logged_date) {
    dateInput.focus();
    return;
  }

  // Convert to kg for storage
  var weightKg = units === 'imperial'
    ? Math.round((weightDisp / 2.20462) * 10) / 10
    : weightDisp;

  btn.disabled    = true;
  btn.textContent = 'Logging\u2026';

  fetch('/api/profile/add-weight', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ weight: weightKg, logged_date: logged_date }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    btn.disabled    = false;
    btn.textContent = 'Log Weight';
    if (data.success) {
      if (currentVal) currentVal.textContent = weightDisp.toFixed(1);
      confirm.style.display = 'block';
      setTimeout(function() { confirm.style.display = 'none'; }, 3000);
      showToast('Weight logged \u2014 ' + weightDisp + ' ' + wUnit);
    } else {
      showToast(data.error || 'Failed to log weight');
    }
  })
  .catch(function() {
    btn.disabled    = false;
    btn.textContent = 'Log Weight';
    showToast('Connection error');
  });
};

window.dashToggleHabit = function(habitId, el) {
  var done = el.style.background.includes('185,129');
  fetch('/api/habits/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habit_id: habitId, date: new Date().toISOString().split('T')[0] }),
  }).then(function(r){ return r.json(); }).then(function(d){
    if (d.success) {
      if (d.completed) {
        el.style.background = 'rgba(16,185,129,.08)';
        el.style.borderColor = 'rgba(16,185,129,.25)';
        var lbl = el.querySelector('span:nth-child(2)');
        var chk = el.querySelector('span:last-child');
        if (lbl) { lbl.style.textDecoration = 'line-through'; lbl.style.color = 'var(--soft)'; }
        if (chk) { chk.textContent = '\u2713'; chk.style.color = 'var(--green)'; }
      } else {
        el.style.background = 'var(--card2)';
        el.style.borderColor = 'var(--border)';
        var lbl2 = el.querySelector('span:nth-child(2)');
        var chk2 = el.querySelector('span:last-child');
        if (lbl2) { lbl2.style.textDecoration = 'none'; lbl2.style.color = ''; }
        if (chk2) { chk2.textContent = '\u25CB'; chk2.style.color = 'var(--muted)'; }
      }
    }
  });
};
})();<\/script> <!-- FOOD LOG MODAL --> <div id="foodModal" style="display:none;position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.65);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:1.5rem;" data-astro-cid-y55gmoyq> <div style="background:var(--card);border:1.5px solid rgba(99,102,241,.3);border-radius:22px;padding:1.75rem 1.75rem 1.5rem;max-width:400px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,.5);" data-astro-cid-y55gmoyq> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;" data-astro-cid-y55gmoyq> <div style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:900;display:flex;align-items:center;gap:.5rem;" data-astro-cid-y55gmoyq><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq><path d="M3 11l19-9-9 19-2-8-8-2z" data-astro-cid-y55gmoyq></path></svg> Log Custom Food</div> <button onclick="closeFoodModal()" style="background:none;border:none;color:var(--soft);font-size:1.3rem;cursor:pointer;line-height:1;" data-astro-cid-y55gmoyq>\xD7</button> </div> <div style="display:flex;flex-direction:column;gap:.65rem;" data-astro-cid-y55gmoyq> <input id="flName" type="text" placeholder="Food name (e.g. Greek Yogurt)" style="width:100%;padding:.6rem .85rem;border-radius:10px;background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.82rem;font-family:inherit;outline:none;" data-astro-cid-y55gmoyq> <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;" data-astro-cid-y55gmoyq> <input id="flCal" type="number" placeholder="Calories" min="0" style="padding:.6rem .7rem;border-radius:10px;background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.82rem;font-family:inherit;outline:none;" data-astro-cid-y55gmoyq> <input id="flProt" type="number" placeholder="Protein (g)" min="0" step="0.1" style="padding:.6rem .7rem;border-radius:10px;background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.82rem;font-family:inherit;outline:none;" data-astro-cid-y55gmoyq> <input id="flFat" type="number" placeholder="Fat (g)" min="0" step="0.1" style="padding:.6rem .7rem;border-radius:10px;background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.82rem;font-family:inherit;outline:none;" data-astro-cid-y55gmoyq> <input id="flCarb" type="number" placeholder="Net Carbs (g)" min="0" step="0.1" style="padding:.6rem .7rem;border-radius:10px;background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.82rem;font-family:inherit;outline:none;" data-astro-cid-y55gmoyq> </div> <select id="flMeal" style="padding:.6rem .7rem;border-radius:10px;background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.82rem;font-family:inherit;outline:none;" data-astro-cid-y55gmoyq> <option value="breakfast" data-astro-cid-y55gmoyq>Breakfast</option> <option value="lunch" data-astro-cid-y55gmoyq>Lunch</option> <option value="dinner" data-astro-cid-y55gmoyq>Dinner</option> <option value="snack" data-astro-cid-y55gmoyq>Snack</option> <option value="other" selected data-astro-cid-y55gmoyq>Other</option> </select> <button id="flSaveBtn" onclick="saveFoodLog()" style="padding:.7rem;border-radius:11px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;font-weight:800;font-size:.85rem;cursor:pointer;transition:all .18s;" data-astro-cid-y55gmoyq>Add to Log</button> </div> </div> </div> <!-- WELCOME MODAL (shown once after onboarding) --> <div id="welcomeModal" style="display:none;position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:1.5rem;" data-astro-cid-y55gmoyq> <div style="background:var(--card);border:1.5px solid rgba(16,185,129,.3);border-radius:24px;padding:2.25rem 2rem;max-width:420px;width:100%;text-align:center;position:relative;box-shadow:0 32px 80px rgba(0,0,0,.5);" data-astro-cid-y55gmoyq> <button id="welcomeClose" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--soft);font-size:1.3rem;cursor:pointer;line-height:1;" data-astro-cid-y55gmoyq>\xD7</button> <div style="width:64px;height:64px;border-radius:20px;background:var(--green-bg);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;" data-astro-cid-y55gmoyq>`, `</div> <div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:900;line-height:1.1;margin-bottom:.5rem;" data-astro-cid-y55gmoyq>Welcome, <em style="font-style:italic;background:linear-gradient(135deg,var(--green),var(--green2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-y55gmoyq>`, '</em>!</div> <div style="font-size:.85rem;color:var(--soft);margin-bottom:1.5rem;line-height:1.6;" data-astro-cid-y55gmoyq>Your <strong style="color:var(--text);" data-astro-cid-y55gmoyq>', '</strong> journey is set up and ready. Complete your first daily check-in to start earning XP and building your streak.</div> <div style="display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.5rem;" data-astro-cid-y55gmoyq> <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 1rem;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.15);border-radius:12px;text-align:left;" data-astro-cid-y55gmoyq> ', ' <div data-astro-cid-y55gmoyq><div style="font-size:.8rem;font-weight:700;" data-astro-cid-y55gmoyq>Daily Check-in</div><div style="font-size:.72rem;color:var(--soft);" data-astro-cid-y55gmoyq>Track energy, water &amp; meals \u2014 earn 30 XP</div></div> </div> <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 1rem;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.15);border-radius:12px;text-align:left;" data-astro-cid-y55gmoyq> ', ' <div data-astro-cid-y55gmoyq><div style="font-size:.8rem;font-weight:700;" data-astro-cid-y55gmoyq>Complete Daily Tasks</div><div style="font-size:.72rem;color:var(--soft);" data-astro-cid-y55gmoyq>Finish all tasks to build a perfect day</div></div> </div> <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 1rem;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.15);border-radius:12px;text-align:left;" data-astro-cid-y55gmoyq> ', ' <div data-astro-cid-y55gmoyq><div style="font-size:.8rem;font-weight:700;" data-astro-cid-y55gmoyq>Log Your Weight</div><div style="font-size:.72rem;color:var(--soft);" data-astro-cid-y55gmoyq>Track progress toward your goal weight</div></div> </div> </div> <button id="welcomeStartBtn" style="width:100%;padding:1rem;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;border:none;border-radius:14px;font-weight:900;font-size:.95rem;cursor:pointer;box-shadow:0 6px 20px rgba(16,185,129,.35);" data-astro-cid-y55gmoyq>Start Day 1 \u2192</button> </div> </div> <!-- \u2550\u2550 APEXCHARTS + GSAP \u2014 bundled by Vite \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->  <!-- Embed weight data for ApexCharts (server \u2192 client) --> <script>(function(){', "\nwindow.__weightData = weightLogsForChart;\nwindow.__wUnit      = wUnitForChart;\n})();<\/script> ", " </body></html>"])), currentDay, renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "dashboard", "data-astro-cid-y55gmoyq": true }), greeting, userName, currentDay, weekNum, streak, xpDisplay, level, journeyPct, daysToGo, addAttribute(`width:${journeyPct}%`, "style"), journeyMilestones.slice(0, 12).map((m) => renderTemplate`<div${addAttribute(`position:absolute;top:50%;transform:translate(-50%,-50%);left:${m.pct}%;width:${m.reached ? "9px" : "7px"};height:${m.reached ? "9px" : "7px"};border-radius:50%;background:${m.reached ? "var(--green2)" : "var(--soft)"};border:${m.reached ? "1.5px solid rgba(52,211,153,.5)" : "1.5px solid rgba(77,112,85,.4)"};z-index:2;transition:all .3s;`, "style")}${addAttribute(`Day ${m.day}`, "title")} data-astro-cid-y55gmoyq></div>`), journeyMilestones.slice(0, 6).map((m) => renderTemplate`<span${addAttribute(`font-size:.58rem;font-weight:700;color:${m.reached ? "var(--green)" : "var(--muted)"};`, "style")} data-astro-cid-y55gmoyq>D${m.day}</span>`), addAttribute(`border-left:3px solid ${dailyTip.color};`, "style"), addAttribute(dailyTip.color, "stroke"), unescapeHTML(dailyTip.icon), dailyTip.title, dailyTip.body, renderComponent($$result, "Scale", $$Scale, { "size": 20, "data-astro-cid-y55gmoyq": true }), weightLost > 0 ? `-${weightLost.toFixed(1)}kg` : "\u2014", weightLost > 0 ? renderTemplate`<span class="stat-badge bg-g" data-astro-cid-y55gmoyq>${progressPct}% to goal</span>` : renderTemplate`<span class="stat-badge bg-a" data-astro-cid-y55gmoyq>Log your weight</span>`, addAttribute(`width:${progressPct}%;background:linear-gradient(90deg,#10b981,#34d399);`, "style"), renderComponent($$result, "Flame", $$Flame, { "size": 20, "data-astro-cid-y55gmoyq": true }), streakDays, checkinDone ? renderTemplate`<span class="stat-badge bg-g" data-astro-cid-y55gmoyq>Streak safe</span>` : renderTemplate`<span class="stat-badge bg-a" data-astro-cid-y55gmoyq>Check in today</span>`, addAttribute(`width:${streakPct}%;background:linear-gradient(90deg,#f59e0b,#fcd34d);`, "style"), renderComponent($$result, "Zap", $$Zap, { "size": 20, "data-astro-cid-y55gmoyq": true }), xpLevel, totalXP.toLocaleString(), xpInLevel, addAttribute(`width:${xpPct}%;background:linear-gradient(90deg,#8b5cf6,#a78bfa);`, "style"), renderComponent($$result, "CalendarDays", $$CalendarDays, { "size": 20, "data-astro-cid-y55gmoyq": true }), currentDay, maxDays, weekPhase === "adapt" && renderTemplate`<span class="stat-badge bg-a" data-astro-cid-y55gmoyq>Week 1 · Adapt</span>`, weekPhase === "burn" && renderTemplate`<span class="stat-badge bg-b" data-astro-cid-y55gmoyq>Week 2 · Burn</span>`, weekPhase === "thrive" && renderTemplate`<span class="stat-badge bg-g" data-astro-cid-y55gmoyq>Week 3+ · Thrive</span>`, addAttribute(`width:${journeyPct}%;background:var(--blue);`, "style"), addAttribute(`qa-btn${checkinDone ? " done" : ""}`, "class"), renderComponent($$result, "ClipboardCheck", $$ClipboardCheck, { "size": 18, "data-astro-cid-y55gmoyq": true }), checkinDone ? "Done" : "+30 XP", addAttribute(`qa-btn${fastingActive ? " done" : ""}`, "class"), renderComponent($$result, "Timer", $$Timer, { "size": 18, "data-astro-cid-y55gmoyq": true }), fastingActive ? "Active" : "Start fast", addAttribute(`qa-btn${weeklyDone ? " done" : ""}`, "class"), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 18, "data-astro-cid-y55gmoyq": true }), weeklyDone ? "Done" : `Week ${currentWeek}`, renderComponent($$result, "Utensils", $$Utensils, { "size": 18, "data-astro-cid-y55gmoyq": true }), maxDays === 30 ? "30 meals" : maxDays === 180 ? "87+ meals" : "All meals", renderComponent($$result, "Activity", $$Activity, { "size": 18, "data-astro-cid-y55gmoyq": true }), renderComponent($$result, "ShoppingCart", $$ShoppingCart, { "size": 18, "data-astro-cid-y55gmoyq": true }), currentWeek, renderComponent($$result, "CheckCircle2", $$CheckCircle2, { "size": 16, "color": "var(--green)", "data-astro-cid-y55gmoyq": true }), currentDay, completedTasks, totalTasks, addAttribute(`stroke-dashoffset:${201 - 201 * smartTaskPct / 100};transition:stroke-dashoffset 1s ease;`, "style"), smartTaskPct, completedTasks, totalTasks - completedTasks, tasks.length > 0 ? renderTemplate`<div class="tasks-list" id="tasksList" data-astro-cid-y55gmoyq> ${tasks.slice(0, 7).map((t) => renderTemplate`<div${addAttribute(`task-item${t.completed ? " done" : ""}`, "class")}${addAttribute(t.id, "data-task-id")}${addAttribute(t.completed ? "true" : "false", "data-completed")} onclick="toggleTask(this)" data-astro-cid-y55gmoyq> <div class="task-cb" data-astro-cid-y55gmoyq> <svg class="task-chk" viewBox="0 0 12 12" data-astro-cid-y55gmoyq> <path class="task-chk-path" d="M2 6l3 3 5-5" data-astro-cid-y55gmoyq></path> </svg> </div> <span class="task-name" data-astro-cid-y55gmoyq>${t.task_title}</span> ${t.xp_earned && renderTemplate`<span class="task-xp" data-astro-cid-y55gmoyq>+${t.xp_earned} XP</span>`} </div>`)} </div>` : renderTemplate`<div class="empty-state" data-astro-cid-y55gmoyq> <div class="empty-icon" data-astro-cid-y55gmoyq><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--soft)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq><path d="M9 11l3 3L22 4" data-astro-cid-y55gmoyq></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" data-astro-cid-y55gmoyq></path></svg></div> <div class="empty-title" data-astro-cid-y55gmoyq>No tasks yet for Day ${currentDay}</div> <p class="empty-body" data-astro-cid-y55gmoyq>Your daily tasks will appear here once they're generated for today.</p> <a href="/dashboard/checkin" class="empty-cta" data-astro-cid-y55gmoyq>Start with a check-in →</a> </div>`, renderComponent($$result, "Utensils", $$Utensils, { "size": 16, "color": "var(--amber)", "data-astro-cid-y55gmoyq": true }), adaptedCount > 0 && renderTemplate`<span class="ct-badge bg-a" data-astro-cid-y55gmoyq>${adaptedCount} flagged</span>`, cycleWeek, cycleNum + 1, cycleNum > 0 && renderTemplate`<span style="font-size:.67rem;font-weight:800;padding:.12rem .4rem;border-radius:6px;background:rgba(16,185,129,.1);color:var(--green2);" data-astro-cid-y55gmoyq>Variety rotation active</span>`, todayMeals.length > 0 ? renderTemplate`<div class="meals-list" data-astro-cid-y55gmoyq> ${todayMeals.map((meal) => renderTemplate`<div${addAttribute(`meal-item${completedMealSet.has(meal.meal_type) ? " meal-eaten" : ""}`, "class")}${addAttribute(meal.meal_type, "data-meal-type")}${addAttribute(meal.recipe?.id || "", "data-recipe-id")} data-astro-cid-y55gmoyq> <div class="meal-img-card"${addAttribute(meal.recipe?.image_url ? `background-image:url('${meal.recipe.image_url}')` : `background:${mealTypeConfig[meal.meal_type]?.bg || "linear-gradient(135deg,#065f46,#059669)"}`, "style")} data-astro-cid-y55gmoyq> <div class="mic-overlay" data-astro-cid-y55gmoyq></div> <div class="mic-badge" data-astro-cid-y55gmoyq> ${mealTypeConfig[meal.meal_type]?.label || meal.meal_type} ${meal.slot_adapted && renderTemplate`<span class="mic-adapted" data-astro-cid-y55gmoyq>Adapted</span>`} </div> <div class="mic-body" data-astro-cid-y55gmoyq> <div class="mic-title" data-astro-cid-y55gmoyq>${meal.recipe?.title || "No meal planned"}</div> <div class="mic-macros" data-astro-cid-y55gmoyq> <span data-astro-cid-y55gmoyq>${meal.recipe?.calories || 0} cal</span> <span data-astro-cid-y55gmoyq>${meal.recipe?.protein || 0}g P</span> <span data-astro-cid-y55gmoyq>${meal.recipe?.net_carbs || 0}g C</span> </div> </div> </div> <div class="meal-actions mic-actions" data-astro-cid-y55gmoyq> ${meal.is_adapted && renderTemplate`<div class="meal-flag-row" data-astro-cid-y55gmoyq> <span class="meal-flag" data-astro-cid-y55gmoyq>${meal.adapt_reason}</span> ${meal.recipe && renderTemplate`<button class="meal-swap-btn"${addAttribute(meal.recipe.id, "data-recipe-id")}${addAttribute(meal.adapt_reason, "data-reason")} onclick="swapMeal(this)" data-astro-cid-y55gmoyq>Swap</button>`} </div>`} <div class="meal-btn-row" data-astro-cid-y55gmoyq> ${meal.recipe && !meal.is_adapted && renderTemplate`<a${addAttribute(`/dashboard/recipe/${meal.recipe.id}`, "href")} class="meal-link" data-astro-cid-y55gmoyq>View →</a>`} <button${addAttribute(`meal-eat-btn${completedMealSet.has(meal.meal_type) ? " eaten" : ""}`, "class")}${addAttribute(meal.meal_type, "data-meal-type")}${addAttribute(meal.recipe?.id || "", "data-recipe-id")} onclick="toggleMealEaten(this)" data-astro-cid-y55gmoyq> ${completedMealSet.has(meal.meal_type) ? "\u2713 Eaten" : "Mark Eaten"} </button> </div> </div> </div>`)} </div>` : restrictions.length > 0 ? renderTemplate`<div class="empty-state" data-astro-cid-y55gmoyq> <div class="empty-icon" data-astro-cid-y55gmoyq><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--soft)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq><path d="M3 11l19-9-9 19-2-8-8-2z" data-astro-cid-y55gmoyq></path></svg></div> <div class="empty-title" data-astro-cid-y55gmoyq>No meals match your preferences</div> <p class="empty-body" data-astro-cid-y55gmoyq>All meals for today were filtered by your dietary restrictions. Update your preferences to see meals.</p> <a href="/dashboard/profile" class="empty-cta" data-astro-cid-y55gmoyq>Set Preferences →</a> </div>` : renderTemplate`<div class="empty-state" data-astro-cid-y55gmoyq> <div class="empty-icon" data-astro-cid-y55gmoyq><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--soft)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq><path d="M3 11l19-9-9 19-2-8-8-2z" data-astro-cid-y55gmoyq></path></svg></div> <div class="empty-title" data-astro-cid-y55gmoyq>No meals for today</div> <p class="empty-body" data-astro-cid-y55gmoyq>Your ${tierLabel} meal plan for Day ${currentDay} hasn't loaded yet.</p> <a href="/dashboard/recipes" class="empty-cta" data-astro-cid-y55gmoyq>Browse recipes →</a> </div>`, todayMeals.length > 0 && renderTemplate`<div class="macro-bar-section" id="macroBarSection" data-astro-cid-y55gmoyq> <div class="macro-header" data-astro-cid-y55gmoyq> <div class="macro-ring-wrap" data-astro-cid-y55gmoyq> <svg width="56" height="56" viewBox="0 0 56 56" data-astro-cid-y55gmoyq> <circle fill="none" stroke="var(--muted)" stroke-width="5" cx="28" cy="28" r="23" data-astro-cid-y55gmoyq></circle> <circle id="macroRingCircle" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" cx="28" cy="28" r="23" stroke-dasharray="144.5"${addAttribute(`stroke-dashoffset:${(144.5 - 144.5 * calPct / 100).toFixed(1)};transition:stroke-dashoffset 1s ease;`, "style")} data-astro-cid-y55gmoyq></circle> </svg> <div class="macro-ring-center" data-astro-cid-y55gmoyq> <span class="macro-ring-pct" id="macroRingPct" data-astro-cid-y55gmoyq>${calPct}%</span> <span class="macro-ring-lbl" data-astro-cid-y55gmoyq>cal</span> </div> </div> <div class="macro-ring-info" data-astro-cid-y55gmoyq> <div class="macro-cal-total" id="macroCalsDisplay" data-astro-cid-y55gmoyq>${Math.round(totalConsumed.calories)} <span style="font-size:.75rem;font-weight:600;color:var(--soft);" data-astro-cid-y55gmoyq>/ ${goalCal}</span></div> <div class="macro-cal-label" data-astro-cid-y55gmoyq>calories consumed today</div> </div> </div> <div class="macro-bar-title" data-astro-cid-y55gmoyq>Macros breakdown</div> <div class="macro-bars" data-astro-cid-y55gmoyq> <div class="mbr" data-astro-cid-y55gmoyq> <div class="mb-top" data-astro-cid-y55gmoyq><span class="mb-lbl" data-astro-cid-y55gmoyq>Calories</span><span class="mb-val" id="mbCalVal" data-astro-cid-y55gmoyq>${Math.round(totalConsumed.calories)}</span><span class="mb-goal" data-astro-cid-y55gmoyq>/ ${goalCal}</span></div> <div class="mb-track" data-astro-cid-y55gmoyq><div class="mb-fill mb-cal" id="mbCalFill"${addAttribute(`width:${calPct}%`, "style")} data-astro-cid-y55gmoyq></div></div> </div> <div class="mbr" data-astro-cid-y55gmoyq> <div class="mb-top" data-astro-cid-y55gmoyq><span class="mb-lbl" data-astro-cid-y55gmoyq>Protein</span><span class="mb-val" id="mbProtVal" data-astro-cid-y55gmoyq>${Math.round(totalConsumed.protein)}g</span><span class="mb-goal" data-astro-cid-y55gmoyq>/ ${goalProt}g</span></div> <div class="mb-track" data-astro-cid-y55gmoyq><div class="mb-fill mb-prot" id="mbProtFill"${addAttribute(`width:${protPct}%`, "style")} data-astro-cid-y55gmoyq></div></div> </div> <div class="mbr" data-astro-cid-y55gmoyq> <div class="mb-top" data-astro-cid-y55gmoyq><span class="mb-lbl" data-astro-cid-y55gmoyq>Fat</span><span class="mb-val" id="mbFatVal" data-astro-cid-y55gmoyq>${Math.round(totalConsumed.fat)}g</span><span class="mb-goal" data-astro-cid-y55gmoyq>/ ${goalFat}g</span></div> <div class="mb-track" data-astro-cid-y55gmoyq><div class="mb-fill mb-fat" id="mbFatFill"${addAttribute(`width:${fatPct}%`, "style")} data-astro-cid-y55gmoyq></div></div> </div> <div class="mbr" data-astro-cid-y55gmoyq> <div class="mb-top" data-astro-cid-y55gmoyq><span class="mb-lbl" data-astro-cid-y55gmoyq>Net Carbs</span><span class="mb-val" id="mbCarbVal" data-astro-cid-y55gmoyq>${Math.round(totalConsumed.net_carbs)}g</span><span class="mb-goal" data-astro-cid-y55gmoyq>/ ${goalCarb}g</span></div> <div class="mb-track" data-astro-cid-y55gmoyq><div class="mb-fill mb-carb" id="mbCarbFill"${addAttribute(`width:${carbPct}%`, "style")} data-astro-cid-y55gmoyq></div></div> </div> </div> <!-- Food Log entries --> ${todayFoodLogs.length > 0 && renderTemplate`<div id="foodLogList" style="margin-top:.75rem;display:flex;flex-direction:column;gap:.3rem;" data-astro-cid-y55gmoyq> ${todayFoodLogs.map((f) => renderTemplate`<div class="fl-item"${addAttribute(f.id, "data-id")} style="display:flex;align-items:center;gap:.5rem;padding:.35rem .6rem;background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.18);border-radius:8px;" data-astro-cid-y55gmoyq> <span style="font-size:.72rem;font-weight:700;color:#a78bfa;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" data-astro-cid-y55gmoyq>${f.food_name}</span> <span style="font-size:.67rem;color:var(--soft);white-space:nowrap;" data-astro-cid-y55gmoyq>${f.calories}cal · ${f.protein_g}P · ${f.carbs_g}C</span> <button onclick="deleteFoodLog(this)"${addAttribute(f.id, "data-id")} style="background:none;border:none;color:var(--soft);cursor:pointer;font-size:.9rem;padding:0 .1rem;line-height:1;" title="Remove" data-astro-cid-y55gmoyq>×</button> </div>`)} </div>`} ${todayFoodLogs.length === 0 && renderTemplate`<div id="foodLogList" style="display:flex;flex-direction:column;gap:.3rem;" data-astro-cid-y55gmoyq></div>`} <div style="display:flex;gap:.5rem;margin-top:.65rem;" data-astro-cid-y55gmoyq> <button onclick="openFoodModal()" style="flex:1;padding:.5rem;border-radius:9px;background:rgba(99,102,241,.09);border:1px dashed rgba(99,102,241,.3);color:#a78bfa;font-size:.75rem;font-weight:700;cursor:pointer;transition:all .18s;" id="openFoodModalBtn" data-astro-cid-y55gmoyq>+ Log Custom Food</button> <a href="/dashboard/food-log" style="padding:.5rem .75rem;border-radius:9px;background:rgba(99,102,241,.07);border:1px solid rgba(99,102,241,.2);color:#a78bfa;font-size:.72rem;font-weight:700;text-decoration:none;white-space:nowrap;display:flex;align-items:center;" data-astro-cid-y55gmoyq>History</a> </div> </div>`, todayMeals.length > 0 && renderTemplate`<div style="margin-top:.85rem;padding:.75rem 1rem;border-radius:14px;background:var(--card2);border:1px solid var(--border);display:flex;align-items:flex-start;gap:.6rem;" data-astro-cid-y55gmoyq> ${renderComponent($$result, "Info", $$Info, { "size": 16, "color": "var(--green)", "style": "flex-shrink:0;margin-top:1px", "data-astro-cid-y55gmoyq": true })} <div data-astro-cid-y55gmoyq> ${userGoal === "muscle_gain" && renderTemplate`<span style="font-size:.76rem;font-weight:700;color:var(--text);" data-astro-cid-y55gmoyq>Today's tip: Hit your protein goal. Total protein from plan: <strong style="color:var(--green2);" data-astro-cid-y55gmoyq>${Math.round(totalProteinToday)}g</strong></span>`} ${userGoal === "maintenance" && renderTemplate`<span style="font-size:.76rem;font-weight:700;color:var(--text);" data-astro-cid-y55gmoyq>Today's tip: Balance your macros. Total cal from plan: <strong style="color:var(--gold);" data-astro-cid-y55gmoyq>${Math.round(totalCalToday)} cal</strong></span>`} ${userGoal !== "muscle_gain" && userGoal !== "maintenance" && renderTemplate`<span style="font-size:.76rem;font-weight:700;color:var(--text);" data-astro-cid-y55gmoyq>Today's tip: Stay under your calorie target. Total macros from plan: <strong style="color:var(--gold);" data-astro-cid-y55gmoyq>${Math.round(totalCalToday)} cal</strong></span>`} </div> </div>`, renderComponent($$result, "BarChart3", $$BarChart3, { "size": 16, "color": "var(--blue)", "data-astro-cid-y55gmoyq": true }), addAttribute(`stroke-dashoffset:${327 - 327 * smartTaskPct / 100};transition:stroke-dashoffset 1.2s ease;`, "style"), smartTaskPct, progressMsg, checkinDone ? "\u2713" : "\u25CB", addAttribute(`width:${checkinDone ? 100 : 0}%;background:var(--green);`, "style"), completedTasks, totalTasks, addAttribute(`width:${taskPct}%;background:var(--blue);`, "style"), progressPct, addAttribute(`width:${progressPct}%;background:var(--purple);`, "style"), renderComponent($$result, "Zap", $$Zap, { "size": 16, "color": "var(--purple)", "data-astro-cid-y55gmoyq": true }), xpLevel, xpLevel, xpInLevel, addAttribute(`width:${xpPct}%;`, "style"), 500 - xpInLevel, xpLevel + 1, addAttribute(`xp-item${checkinDone ? " done" : ""}`, "class"), addAttribute(`xp-item${fastingActive ? " done" : ""}`, "class"), addAttribute(`xp-item${weeklyDone ? " done" : ""}`, "class"), addAttribute(`xp-item${weightLogToday ? " done" : ""}`, "class"), renderComponent($$result, "Timer", $$Timer, { "size": 16, "color": fastingActive ? "var(--amber)" : "var(--soft)", "data-astro-cid-y55gmoyq": true }), fastingActive ? "Fasting Active" : "Intermittent Fasting", fastingActive ? renderTemplate`<div data-astro-cid-y55gmoyq> <div class="fast-timer" id="fastTimer" data-astro-cid-y55gmoyq>00:00:00</div> <div class="fast-bar-track" data-astro-cid-y55gmoyq><div class="fast-bar-fill" id="fastBar" style="width:0%;" data-astro-cid-y55gmoyq></div></div> <p class="fast-meta" data-astro-cid-y55gmoyq>Target: ${fastingData?.target_hours}h · ${fastingData?.protocol}</p> <a href="/dashboard/fasting" style="display:block;text-align:center;margin-top:.75rem;font-size:.78rem;font-weight:700;color:var(--gold);" data-astro-cid-y55gmoyq>View details →</a> </div>` : renderTemplate`<div data-astro-cid-y55gmoyq> <p style="font-size:.78rem;color:var(--soft);margin-bottom:.5rem;" data-astro-cid-y55gmoyq>Boost ketosis &amp; burn more fat with intermittent fasting.</p> <a href="/dashboard/fasting" class="fast-cta" data-astro-cid-y55gmoyq>Start Fasting</a> </div>`, renderComponent($$result, "Droplets", $$Droplets, { "size": 16, "color": "var(--blue)", "data-astro-cid-y55gmoyq": true }), waterGlasses, Array.from({ length: 8 }, (_, i) => renderTemplate`<div${addAttribute(`width:22px;height:28px;border-radius:4px 4px 6px 6px;border:2px solid ${i < waterGlasses ? "var(--blue)" : "rgba(255,255,255,.1)"};background:${i < waterGlasses ? "rgba(59,130,246,.35)" : "transparent"};transition:all .25s;`, "style")} data-astro-cid-y55gmoyq></div>`), addAttribute(`height:100%;border-radius:99px;background:linear-gradient(90deg,#3b82f6,#60a5fa);width:${waterPct}%;transition:width .4s;`, "style"), waterGlasses >= 8 && renderTemplate`<div style="text-align:center;margin-top:.6rem;font-size:.72rem;color:#60a5fa;font-weight:700;" data-astro-cid-y55gmoyq>Daily goal reached!</div>`, renderComponent($$result, "Pill", $$Pill, { "size": 16, "color": "var(--purple)", "data-astro-cid-y55gmoyq": true }), [
    { key: "took_sodium", svg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>', label: "Sodium", color: "#f59e0b" },
    { key: "took_potassium", svg: '<path d="M12 22V12M12 12C12 7 7 4 7 4s5 3 5 8M12 12c0-5 5-8 5-8s-5 3-5 8"/>', label: "Potassium", color: "#10b981" },
    { key: "took_magnesium", svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', label: "Magnesium", color: "#8b5cf6" }
  ].map((s) => {
    const taken = todayCheckin?.[s.key];
    return renderTemplate`<div${addAttribute(`text-align:center;padding:.6rem .3rem;border-radius:12px;border:1.5px solid ${taken ? s.color + "55" : "var(--border)"};background:${taken ? s.color + "11" : "var(--card2)"};transition:all .2s;`, "style")} data-astro-cid-y55gmoyq> <div${addAttribute(`margin-bottom:.2rem;display:flex;justify-content:center;`, "style")} data-astro-cid-y55gmoyq><svg width="18" height="18" viewBox="0 0 24 24" fill="none"${addAttribute(taken ? s.color : "var(--soft)", "stroke")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-y55gmoyq>${unescapeHTML(s.svg)}</svg></div> <div${addAttribute(`font-size:.62rem;font-weight:800;color:${taken ? s.color : "var(--soft)"};`, "style")} data-astro-cid-y55gmoyq>${s.label}</div> <div${addAttribute(`font-size:.58rem;margin-top:.1rem;color:${taken ? s.color : "var(--muted)"};font-weight:700;`, "style")} data-astro-cid-y55gmoyq>${taken ? "\u2713 Taken" : "\u2014"}</div> </div>`;
  }), !checkinDone && renderTemplate`<div style="font-size:.7rem;color:var(--soft);text-align:center;" data-astro-cid-y55gmoyq>Log in check-in to track</div>`, checkinDone && !todayCheckin?.took_sodium && !todayCheckin?.took_potassium && !todayCheckin?.took_magnesium && renderTemplate`<div style="font-size:.7rem;color:var(--soft);text-align:center;" data-astro-cid-y55gmoyq>None logged today — remember your electrolytes!</div>`, dashHabits.length > 0 && renderTemplate`<div class="card" data-astro-cid-y55gmoyq> <div class="card-title" style="justify-content:space-between;" data-astro-cid-y55gmoyq> <span style="display:flex;align-items:center;gap:.4rem;" data-astro-cid-y55gmoyq> ${renderComponent($$result, "Target", $$Target, { "size": 15, "color": "var(--green)", "data-astro-cid-y55gmoyq": true })}
Today's Habits
</span> <a href="/dashboard/habits" style="font-size:.68rem;color:var(--soft);font-weight:700;text-decoration:none;" data-astro-cid-y55gmoyq>View all →</a> </div> <div style="display:flex;flex-direction:column;gap:.4rem;margin-bottom:.6rem;" data-astro-cid-y55gmoyq> ${dashHabits.map((h) => {
    const done = habitDoneIds.has(h.id);
    return renderTemplate`<div${addAttribute(`display:flex;align-items:center;gap:.6rem;padding:.45rem .65rem;border-radius:10px;background:${done ? "rgba(16,185,129,.08)" : "var(--card2)"};border:1px solid ${done ? "rgba(16,185,129,.25)" : "var(--border)"};cursor:pointer;transition:all .2s;`, "style")}${addAttribute(`window.dashToggleHabit('${h.id}', this)`, "onclick")}${addAttribute(`dh-${h.id}`, "id")} data-astro-cid-y55gmoyq> <span style="font-size:1rem;" data-astro-cid-y55gmoyq>${h.icon}</span> <span${addAttribute(`font-size:.75rem;font-weight:700;flex:1;${done ? "text-decoration:line-through;color:var(--soft);" : ""}`, "style")} data-astro-cid-y55gmoyq>${h.title}</span> <span${addAttribute(`font-size:.75rem;${done ? "color:var(--green);" : "color:var(--muted);"}`, "style")} data-astro-cid-y55gmoyq>${done ? "\u2713" : "\u25CB"}</span> </div>`;
  })} </div> <div style="font-size:.7rem;color:var(--soft);text-align:center;" data-astro-cid-y55gmoyq>${habitsDoneCount}/${dashHabits.length} done today</div> </div>`, dashHabits.length === 0 && renderTemplate`<div class="card" style="text-align:center;padding:1rem;" data-astro-cid-y55gmoyq> <div style="margin-bottom:.4rem;display:flex;justify-content:center;" data-astro-cid-y55gmoyq>${renderComponent($$result, "Target", $$Target, { "size": 28, "color": "var(--soft)", "data-astro-cid-y55gmoyq": true })}</div> <div style="font-size:.75rem;color:var(--soft);margin-bottom:.5rem;" data-astro-cid-y55gmoyq>No habits set yet</div> <a href="/dashboard/habits" style="font-size:.72rem;font-weight:700;color:var(--green);text-decoration:none;" data-astro-cid-y55gmoyq>+ Add habits →</a> </div>`, weightLogs && weightLogs.length > 0 && renderTemplate`<div class="card" style="border-left:3px solid rgba(16,185,129,.3);" data-astro-cid-y55gmoyq> <div class="card-title" data-astro-cid-y55gmoyq> ${renderComponent($$result, "LineChart", $$LineChart, { "size": 16, "color": "var(--green)", "data-astro-cid-y55gmoyq": true })}
Weight Trend
</div> <div id="weightSparkline" style="margin:-.25rem -.5rem .25rem;" data-astro-cid-y55gmoyq></div> <div class="wt-stat" data-astro-cid-y55gmoyq> <span class="wt-val" data-astro-cid-y55gmoyq>${dispLatest} ${wUnit}</span> ${weightLost > 0 ? renderTemplate`<span class="wt-tag bg-g" data-astro-cid-y55gmoyq>-${units === "imperial" ? Math.round(weightLost * 2.20462 * 10) / 10 : weightLost.toFixed(1)} ${wUnit}</span>` : renderTemplate`<span class="wt-tag bg-a" data-astro-cid-y55gmoyq>Log weight</span>`} </div> </div>`, renderComponent($$result, "Scale", $$Scale, { "size": 16, "color": "var(--green)", "data-astro-cid-y55gmoyq": true }), dispLatest, wUnit, addAttribute(units === "imperial" ? 44 : 20, "min"), addAttribute(units === "imperial" ? 1100 : 500, "max"), addAttribute(`Weight (${wUnit})`, "placeholder"), addAttribute(dispLatest || "", "value"), addAttribute(today, "value"), renderComponent($$result, "Flame", $$Flame, { "size": 16, "color": "var(--amber)", "data-astro-cid-y55gmoyq": true }), streakDays, Array.from({ length: streakDotMax }, (_, i) => renderTemplate`<div${addAttribute(`sd${i < streakDays ? " done" : i === streakDays ? " today" : ""}`, "class")} data-astro-cid-y55gmoyq></div>`), defineScriptVars({ fastingData, totalTasks, initCompleted: completedTasks, initTaskPct: taskPct, xpLevel, xpInLevel, xpPct, totalXP, currentDay, completedMealTypesArr, initConsumedMacros: totalConsumed, goalCal, goalProt, goalFat, goalCarb, initWaterGlasses: waterGlasses, initFoodLogs: todayFoodLogs, units, wUnit }), renderComponent($$result, "Activity", $$Activity, { "size": 32, "color": "var(--green)", "data-astro-cid-y55gmoyq": true }), userName, tierLabel, renderComponent($$result, "ClipboardCheck", $$ClipboardCheck, { "size": 20, "color": "var(--green)", "style": "flex-shrink:0", "data-astro-cid-y55gmoyq": true }), renderComponent($$result, "CheckCircle2", $$CheckCircle2, { "size": 20, "color": "var(--green)", "style": "flex-shrink:0", "data-astro-cid-y55gmoyq": true }), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 20, "color": "var(--green)", "style": "flex-shrink:0", "data-astro-cid-y55gmoyq": true }), defineScriptVars({ weightLogsForChart: (weightLogs || []).map((w) => ({ w: w.weight, d: w.logged_date?.slice(5) || "" })).reverse(), wUnitForChart: profile.preferred_units === "imperial" ? "lbs" : "kg" }), renderComponent($$result, "AppTour", $$AppTour, { "userName": userName, "data-astro-cid-y55gmoyq": true }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/index.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
