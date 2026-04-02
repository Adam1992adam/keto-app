/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as defineScriptVars, g as addAttribute, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { f as getPlan, d as getUserJourney, k as getDailyTasks, o as getWaterIntake, p as getWeightLogs, s as supabase, q as getXPTransactions, r as calculateBMI, t as calculateCalorieTarget, m as kgToLbs, l as getAchievements, j as formatWeight, w as weightLabel } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { e as $$User, a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$, a as $$Zap, b as $$Utensils } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Trophy } from '../../chunks/Trophy_B5AXSz5D.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
import { $ as $$BarChart3 } from '../../chunks/BarChart3_BX3FTjqm.mjs';
import { $ as $$Award } from '../../chunks/Award_DmLGcvZ_.mjs';
import { $ as $$Flame } from '../../chunks/Flame_EKYKv-jW.mjs';
import { $ as $$Calendar } from '../../chunks/Calendar_e7F6JL8S.mjs';
import { $ as $$TrendingUp } from '../../chunks/TrendingUp_BZiNmqs5.mjs';
import { $ as $$Droplets } from '../../chunks/Droplets_D_Q7yuSH.mjs';
import { $ as $$Lock } from '../../chunks/Lock_qAq--S7c.mjs';
import { $ as $$CheckCircle } from '../../chunks/CheckCircle_QKR1qvhr.mjs';
import { $ as $$ShoppingCart } from '../../chunks/ShoppingCart_CxlP89GQ.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro();
const $$Settings = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Settings;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "settings", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path> <circle cx="12" cy="12" r="3"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Settings.astro", void 0);

const $$Astro$1 = createAstro();
const $$LogOut = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$LogOut;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "log-out", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m16 17 5-5-5-5"></path> <path d="M21 12H9"></path> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/LogOut.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const units = profile.preferred_units || "imperial";
  const wLabel = weightLabel(units);
  const plan = getPlan(profile.subscription_tier);
  const journey = await getUserJourney(user.id);
  const currentDay = journey?.current_day || 1;
  const dailyTasks = await getDailyTasks(user.id, currentDay);
  await getWaterIntake(user.id, currentDay);
  dailyTasks?.filter(
    (t) => t.task_type !== "reflection" && t.task_type !== "weight" && !t.completed
  ) || [];
  const weightLogs = await getWeightLogs(user.id, 30);
  const { data: allTasks } = await supabase.from("daily_tasks").select("*").eq("user_id", user.id).order("day_number", { ascending: true });
  const xpTransactions = await getXPTransactions(user.id, 30);
  const maxDay = Math.min(journey?.current_day || 1, 30);
  const completionData = Array.from({ length: maxDay }, (_, i) => {
    const day = i + 1;
    const dt = allTasks?.filter((t) => t.day_number === day) || [];
    const dc = dt.filter((t) => t.completed).length;
    return { day, percentage: dt.length > 0 ? Math.round(dc / dt.length * 100) : 0 };
  });
  const xpData = Array.from({ length: maxDay }, (_, i) => {
    const day = i + 1;
    const dayXP = xpTransactions?.filter((t) => t.day_number === day).reduce((s, t) => s + (t.xp_amount || 0), 0) || 0;
    const prevXP = i > 0 ? xpTransactions?.slice(0, i).reduce((s, t) => s + (t.xp_amount || 0), 0) || 0 : 0;
    return { day, xp: prevXP + dayXP };
  });
  const totalDaysCompleted = journey?.current_day ? journey.current_day - 1 : 0;
  const currentStreak = journey?.streak_days || 0;
  const longestStreak = journey?.longest_streak || 0;
  const perfectDays = journey?.perfect_days || 0;
  const totalXP = journey?.total_xp || 0;
  const level = journey?.level || 1;
  const currentWeight = profile.weight_kg || 0;
  const startWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : currentWeight;
  const weightChange = startWeight - currentWeight;
  const targetWeight = profile.target_weight_kg || currentWeight - 5;
  const weightToLose = Math.max(1e-3, currentWeight - targetWeight);
  const progressPercent = Math.min(100, Math.max(0, (startWeight - currentWeight) / (startWeight - targetWeight) * 100));
  const bmi = profile.weight_kg && profile.height_cm ? await calculateBMI(profile.weight_kg, profile.height_cm) : null;
  const bmiCategory = !bmi ? { label: "Unknown", color: "#8a9ab0" } : bmi < 18.5 ? { label: "Underweight", color: "#3b82f6" } : bmi < 25 ? { label: "Normal", color: "#10b981" } : bmi < 30 ? { label: "Overweight", color: "#f59e0b" } : { label: "Obese", color: "#ef4444" };
  const calorieTarget = await calculateCalorieTarget(profile);
  const fatGrams = Math.round(calorieTarget * 0.7 / 9);
  const proteinGrams = Math.round(calorieTarget * 0.25 / 4);
  const carbGrams = Math.round(calorieTarget * 0.05 / 4);
  const daysLeft = profile.subscription_end_date ? Math.max(0, Math.ceil((new Date(profile.subscription_end_date).getTime() - Date.now()) / 864e5)) : 0;
  const totalTasksCompleted = allTasks?.filter((t) => t.completed).length || 0;
  const totalMealsCompleted = allTasks?.filter((t) => t.completed && ["breakfast", "lunch", "dinner", "snack"].includes(t.task_type)).length || 0;
  const { data: waterData } = await supabase.from("water_intake").select("glasses_count").eq("user_id", user.id);
  const totalWaterGlasses = waterData?.reduce((s, w) => s + w.glasses_count, 0) || 0;
  const displayWeight = formatWeight(currentWeight, units);
  const displayTargetWeight = formatWeight(targetWeight, units);
  const displayHeight = profile.height_cm ? units === "imperial" ? (() => {
    const ti = profile.height_cm / 2.54;
    return `${Math.floor(ti / 12)}'${Math.round(ti % 12)}"`;
  })() : `${profile.height_cm} cm` : "\u2014";
  const weightInputVal = profile.weight_kg ? units === "imperial" ? kgToLbs(profile.weight_kg) : profile.weight_kg : "";
  const targetInputVal = profile.target_weight_kg ? units === "imperial" ? kgToLbs(profile.target_weight_kg) : profile.target_weight_kg : "";
  const heightFtVal = profile.height_cm && units === "imperial" ? Math.floor(profile.height_cm / 2.54 / 12) : "";
  const heightInVal = profile.height_cm && units === "imperial" ? Math.round(profile.height_cm / 2.54 % 12) : "";
  const streakScore = Math.min(30, currentStreak) / 30 * 30;
  const tasksScore = totalTasksCompleted > 0 ? Math.min(20, totalTasksCompleted / Math.max(1, currentDay * 4) * 20) : 0;
  const waterScore = totalWaterGlasses > 0 ? Math.min(15, totalWaterGlasses / Math.max(1, currentDay * 8) * 15) : 0;
  const weightScore = weightChange > 0 ? Math.min(20, weightChange / Math.max(1, weightToLose) * 20) : 0;
  const perfectScore = Math.min(15, perfectDays / 30 * 15);
  const ketoScore = Math.round(streakScore + tasksScore + waterScore + weightScore + perfectScore);
  const milestones = [
    { day: 1, icon: "\u{1F680}", label: "Started the Journey", done: currentDay >= 1 },
    { day: 3, icon: "\u{1F6E1}\uFE0F", label: "Survived Keto Flu", done: currentDay >= 3 },
    { day: 7, icon: "\u{1F525}", label: "One Week Strong", done: currentDay >= 7 },
    { day: 10, icon: "\u{1F451}", label: "Beat Keto Flu", done: currentDay >= 10 },
    { day: 15, icon: "\u{1F31F}", label: "Halfway Hero", done: currentDay >= 15 },
    { day: 21, icon: "\u{1F48E}", label: "Three Weeks In", done: currentDay >= 21 },
    { day: 30, icon: "\u{1F3C6}", label: "30-Day Champion", done: currentDay >= 30 },
    ...weightChange >= 1 ? [{ day: 0, icon: "\u2696\uFE0F", label: `Lost ${weightChange.toFixed(1)} ${wLabel}`, done: true }] : [],
    ...totalXP >= 500 ? [{ day: 0, icon: "\u{1F3C5}", label: "500 XP Earned", done: true }] : []
  ];
  const dbAchievements = await getAchievements(user.id);
  const { data: macroGoals } = await supabase.from("macro_goals").select("*").eq("user_id", user.id).maybeSingle();
  const mgCal = macroGoals?.daily_calories || 1800;
  const mgProt = macroGoals?.protein_g || 120;
  const mgFat = macroGoals?.fat_g || 120;
  const mgCarb = macroGoals?.carbs_g || 25;
  const achievementsList = [
    { name: "First Step", desc: "Complete your first day", icon: "\u{1F3AF}", done: perfectDays >= 1 },
    { name: "Week Warrior", desc: "7 perfect days", icon: "\u{1F4C5}", done: perfectDays >= 7 },
    { name: "Two Weeks Strong", desc: "14 perfect days", icon: "\u{1F4AA}", done: perfectDays >= 14 },
    { name: "On Fire", desc: "7 day streak", icon: "\u{1F525}", done: currentStreak >= 7 },
    { name: "Level Master", desc: "Reach Level 5", icon: "\u2B50", done: level >= 5 },
    { name: "XP Hunter", desc: "Earn 500 XP", icon: "\u{1F3C5}", done: totalXP >= 500 },
    { name: "First Kilo", desc: "Lose 2.2 lbs", icon: "\u2696\uFE0F", done: weightChange >= 1 },
    { name: "Five Down", desc: "Lose 11 lbs", icon: "\u{1F3C6}", done: weightChange >= 5 },
    { name: "Halfway Hero", desc: "Reach Day 15", icon: "\u{1F31F}", done: currentDay >= 15 },
    { name: "Keto Champion", desc: "Complete 30 days", icon: "\u{1F451}", done: currentDay >= 30 }
  ];
  const chartDataJson = JSON.stringify(weightLogs.slice().reverse().map((log) => ({
    date: new Date(log.logged_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: units === "imperial" ? kgToLbs(log.weight) : log.weight
  })));
  const xpDataJson = JSON.stringify(xpData);
  const completionDataJson = JSON.stringify(completionData);
  const weightChartLabel = units === "imperial" ? "lbs" : "kg";
  const avatarLetter = profile.full_name?.charAt(0)?.toUpperCase() || "?";
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-rxvxkuhm> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Profile \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet"><script>(function(){ const t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();<\/script>`, '</head> <body data-astro-cid-rxvxkuhm> <div class="bg-mesh" aria-hidden="true" data-astro-cid-rxvxkuhm> <div class="orb o1" data-astro-cid-rxvxkuhm></div><div class="orb o2" data-astro-cid-rxvxkuhm></div><div class="orb o3" data-astro-cid-rxvxkuhm></div> </div> <!-- NAV --> ', ' <div class="page" data-astro-cid-rxvxkuhm> <!-- \u2550\u2550 HERO \u2550\u2550 --> <div class="profile-hero" data-astro-cid-rxvxkuhm> <div class="hero-gradient" data-astro-cid-rxvxkuhm></div> <div class="hero-glow" data-astro-cid-rxvxkuhm></div> <div class="hero-body" data-astro-cid-rxvxkuhm> <!-- Avatar --> <div class="hero-avatar" id="openAvatarBtn" title="Change avatar" data-astro-cid-rxvxkuhm> ', ' </div> <!-- Info --> <div data-astro-cid-rxvxkuhm> <div class="hero-greeting" data-astro-cid-rxvxkuhm>Your Keto Profile</div> <div class="hero-name" data-astro-cid-rxvxkuhm><span class="hl" data-astro-cid-rxvxkuhm>', '</span></div> <div class="hero-email" data-astro-cid-rxvxkuhm>', '</div> <div class="hero-tags" data-astro-cid-rxvxkuhm> <span class="htag" data-astro-cid-rxvxkuhm>', " ", '</span> <span class="htag" data-astro-cid-rxvxkuhm>', " ", 'd streak</span> <span class="htag" data-astro-cid-rxvxkuhm>', " Lv.", '</span> <span class="htag"', " data-astro-cid-rxvxkuhm>", " ", 'd left</span> <span class="htag" data-astro-cid-rxvxkuhm>', " ", "/", ' badges</span> </div> <div class="units-toggle" data-astro-cid-rxvxkuhm> <button', ` onclick="setUnits('imperial')" data-astro-cid-rxvxkuhm>\u{1F1FA}\u{1F1F8} lbs/ft</button> <button`, ` onclick="setUnits('metric')" data-astro-cid-rxvxkuhm>\u{1F30D} kg/cm</button> </div> </div> <!-- Keto Score --> <div class="score-wrap" data-astro-cid-rxvxkuhm> <div class="score-ring" data-astro-cid-rxvxkuhm> <svg viewBox="0 0 100 100" width="108" height="108" data-astro-cid-rxvxkuhm> <circle class="ring-bg" cx="50" cy="50" r="42" data-astro-cid-rxvxkuhm></circle> <circle class="ring-fill" cx="50" cy="50" r="42"`, "", "", ' id="scoreRing" data-astro-cid-rxvxkuhm></circle> </svg> <div class="score-center" data-astro-cid-rxvxkuhm> <div class="score-num"', " data-astro-cid-rxvxkuhm>", '</div> <div class="score-lbl" data-astro-cid-rxvxkuhm>Keto Score</div> </div> </div> <div class="score-tag" data-astro-cid-rxvxkuhm>', '</div> </div> </div> <!-- Stats bar --> <div class="stats-bar" data-astro-cid-rxvxkuhm> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--green),var(--green2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Current Day</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--red),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Day Streak</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--gold),#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Total XP</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Weight</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--purple),#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Perfect Days</div></div> </div> </div> <!-- TABS --> <div class="tabs-bar" data-astro-cid-rxvxkuhm> <button class="tab-btn active" data-tab="overview" data-astro-cid-rxvxkuhm>', ' Overview</button> <button class="tab-btn" data-tab="achievements" data-astro-cid-rxvxkuhm>', ' Achievements</button> <button class="tab-btn" data-tab="milestones" data-astro-cid-rxvxkuhm>', ' Milestones</button> <button class="tab-btn" data-tab="settings" data-astro-cid-rxvxkuhm>', ' Settings</button> </div> <!-- \u2550\u2550 OVERVIEW \u2550\u2550 --> <div id="tab-overview" class="tab-content active" data-astro-cid-rxvxkuhm> <div class="stats-row" data-astro-cid-rxvxkuhm> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--green);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(16,185,129,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Weight Lost</div><div class="scard-val" style="color:var(--green);" data-astro-cid-rxvxkuhm>', " ", '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>Goal: ', '</div><div class="mini-bar" data-astro-cid-rxvxkuhm><div class="mini-fill"', ' data-astro-cid-rxvxkuhm></div></div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--blue);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(59,130,246,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>BMI</div><div class="scard-val"', " data-astro-cid-rxvxkuhm>", '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>', " \xB7 ", '</div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--gold);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(245,158,11,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Perfect Days</div><div class="scard-val" style="color:var(--gold);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>Longest: ', 'd</div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--purple);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(139,92,246,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Water Logged</div><div class="scard-val" style="color:var(--purple);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>glasses total</div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--cyan);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(6,182,212,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Meals Done</div><div class="scard-val" style="color:var(--cyan);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>', ' tasks total</div></div> </div> <div class="g2" style="margin-bottom:1rem;" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="card-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Weight Progress</div> <button id="openWM" class="btn-save" style="padding:.45rem .9rem;font-size:.75rem;" data-astro-cid-rxvxkuhm>+ Log Weight</button> </div> ', ' </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', " XP Growth</div> ", ' </div> </div> <div class="g2" style="margin-bottom:1rem;" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', " Daily Completion</div> ", ' </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Daily Nutrition Targets</div> <div class="macro-grid" data-astro-cid-rxvxkuhm> ', ' </div> <div style="margin-top:1rem;padding:.75rem;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);border-radius:11px;text-align:center;font-size:.75rem;font-weight:700;color:var(--blue);" data-astro-cid-rxvxkuhm>70% Fat \xB7 25% Protein \xB7 5% Carbs</div> </div> </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Activity Summary</div> <div class="g3" data-astro-cid-rxvxkuhm> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#8b5cf6;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Meals</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#3b82f6;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Water Glasses</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#10b981;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Tasks Done</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#f59e0b;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>XP Earned</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#f093fb;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Perfect Days</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#ef4444;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Day Streak</div></div> </div> </div> </div> <!-- \u2550\u2550 ACHIEVEMENTS \u2550\u2550 --> <div id="tab-achievements" class="tab-content" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="card-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Your Achievements</div> <span style="font-size:.75rem;font-weight:700;color:var(--soft);" data-astro-cid-rxvxkuhm>', " / ", ' earned</span> </div> <div class="mini-bar" style="height:7px;margin-bottom:1.5rem;" data-astro-cid-rxvxkuhm><div class="mini-fill"', " data-astro-cid-rxvxkuhm></div></div> ", ' <div style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--green);margin-bottom:.75rem;" data-astro-cid-rxvxkuhm>', " Earned (", ')</div> <div class="ach-grid" style="margin-bottom:1.5rem;" data-astro-cid-rxvxkuhm> ', ' </div> <div style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:.75rem;" data-astro-cid-rxvxkuhm>', " Locked (", ')</div> <div class="ach-grid" data-astro-cid-rxvxkuhm> ', ' </div> </div> </div> <!-- \u2550\u2550 MILESTONES \u2550\u2550 --> <div id="tab-milestones" class="tab-content" data-astro-cid-rxvxkuhm> <div class="g2" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Journey Timeline</div> <div class="timeline" data-astro-cid-rxvxkuhm> ', ' </div> </div> <div style="display:flex;flex-direction:column;gap:1rem;" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="card-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Weight Log</div> <button id="openWM2" class="btn-save" style="padding:.4rem .85rem;font-size:.72rem;" data-astro-cid-rxvxkuhm>+ Add</button> </div> ', ' </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Journey Stats</div> <div style="display:flex;flex-direction:column;gap:.5rem;" data-astro-cid-rxvxkuhm> ', ' </div> </div> </div> </div> </div> <!-- \u2550\u2550 SETTINGS \u2550\u2550 --> <div id="tab-settings" class="tab-content" data-astro-cid-rxvxkuhm> <div class="g2" data-astro-cid-rxvxkuhm> <div data-astro-cid-rxvxkuhm> <div class="form-section" data-astro-cid-rxvxkuhm> <div class="fsec-title" data-astro-cid-rxvxkuhm>', ' Personal Information</div> <form id="editForm" data-astro-cid-rxvxkuhm> <div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Full Name</label><input type="text" name="full_name"', ' class="fi" required data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Age</label><input type="number" name="age"', ' class="fi" data-astro-cid-rxvxkuhm></div> </div> <div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Gender</label><select name="gender" class="fi" data-astro-cid-rxvxkuhm><option value="" data-astro-cid-rxvxkuhm>Select\u2026</option><option value="male"', ' data-astro-cid-rxvxkuhm>Male</option><option value="female"', ' data-astro-cid-rxvxkuhm>Female</option><option value="other"', ' data-astro-cid-rxvxkuhm>Other</option></select></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Goal</label><select name="goal" class="fi" data-astro-cid-rxvxkuhm><option value="" data-astro-cid-rxvxkuhm>Select\u2026</option><option value="lose_weight"', ' data-astro-cid-rxvxkuhm>Lose Weight</option><option value="maintain"', ' data-astro-cid-rxvxkuhm>Maintain</option><option value="gain_muscle"', ' data-astro-cid-rxvxkuhm>Gain Muscle</option></select></div> </div> <div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Weight (', ')</label><input type="number" name="weight_display"', ' step=".1" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Target (', ')</label><input type="number" name="target_weight_display"', ' step=".1" class="fi" data-astro-cid-rxvxkuhm></div> </div> ', ' <div class="fg" style="margin-bottom:1.25rem;" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Activity Level</label><select name="activity_level" class="fi" data-astro-cid-rxvxkuhm><option value="" data-astro-cid-rxvxkuhm>Select\u2026</option><option value="sedentary"', ' data-astro-cid-rxvxkuhm>Sedentary</option><option value="light"', ' data-astro-cid-rxvxkuhm>Light (1\u20133\xD7/wk)</option><option value="moderate"', ' data-astro-cid-rxvxkuhm>Moderate (3\u20135\xD7/wk)</option><option value="active"', ' data-astro-cid-rxvxkuhm>Active (6\u20137\xD7/wk)</option><option value="very_active"', ' data-astro-cid-rxvxkuhm>Very Active</option></select></div> <button type="submit" class="btn-save" data-astro-cid-rxvxkuhm>Save Changes</button> </form> </div> <!-- MACRO GOALS --> <div class="form-section" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="fsec-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Daily Macro Goals</div> <button type="button" id="calcMacrosBtn" class="btn-save" style="padding:.35rem .8rem;font-size:.72rem;background:linear-gradient(135deg,var(--purple),#7c3aed);" data-astro-cid-rxvxkuhm>', ' Auto-Calculate</button> </div> <div id="macroCalcMsg" style="display:none;margin-bottom:.75rem;padding:.5rem .75rem;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);border-radius:9px;font-size:.75rem;color:var(--purple2);" data-astro-cid-rxvxkuhm></div> <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.9rem;" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Calories / day</label><input type="number" id="mgCal"', ' min="500" max="6000" step="50" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Protein (g)</label> <input type="number" id="mgProt"', ' min="30" max="400" step="1" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Fat (g)</label> <input type="number" id="mgFat"', ' min="20" max="400" step="1" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Net Carbs (g)</label> <input type="number" id="mgCarb"', ' min="5" max="100" step="1" class="fi" data-astro-cid-rxvxkuhm></div> </div> <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.9rem;" data-astro-cid-rxvxkuhm> ', ' </div> <button type="button" id="saveMacroGoals" class="btn-save" style="width:100%;justify-content:center;" data-astro-cid-rxvxkuhm>Save Macro Goals</button> </div> </div> <div style="display:flex;flex-direction:column;gap:1rem;" data-astro-cid-rxvxkuhm> <div class="form-section" data-astro-cid-rxvxkuhm> <div class="fsec-title" data-astro-cid-rxvxkuhm>', ' Avatar</div> <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.25rem;" data-astro-cid-rxvxkuhm> <div id="avaPreview" style="width:60px;height:60px;border-radius:15px;background:linear-gradient(135deg,var(--green),var(--blue));display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:900;color:#fff;overflow:hidden;flex-shrink:0;" data-astro-cid-rxvxkuhm> ', ` </div> <div data-astro-cid-rxvxkuhm> <input type="file" id="avaUpload" accept="image/*" style="display:none;" data-astro-cid-rxvxkuhm> <button onclick="document.getElementById('avaUpload').click()" class="btn-save" style="padding:.45rem .9rem;font-size:.75rem;margin-bottom:.4rem;display:block;" data-astro-cid-rxvxkuhm>Upload Image</button> <p style="font-size:.68rem;color:var(--muted);" data-astro-cid-rxvxkuhm>JPG/PNG max 2MB</p> </div> </div> <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:.3rem;margin-bottom:1rem;" data-astro-cid-rxvxkuhm> `, ' </div> <button id="saveAva" class="btn-save" style="width:100%;justify-content:center;" data-astro-cid-rxvxkuhm>Save Avatar</button> </div> <div class="form-section" data-astro-cid-rxvxkuhm> <div class="fsec-title" data-astro-cid-rxvxkuhm>', ' Quick Actions</div> <a href="/dashboard" class="qa" data-astro-cid-rxvxkuhm>', ' Dashboard</a> <a href="/dashboard/recipes" class="qa" data-astro-cid-rxvxkuhm>', ' Recipes</a> <a href="/dashboard/shopping" class="qa" data-astro-cid-rxvxkuhm>', ' Shopping List</a> <a href="/dashboard/upgrade" class="qa" data-astro-cid-rxvxkuhm>', ' Upgrade Plan</a> <form action="/api/auth/logout" method="POST" style="margin:0;" data-astro-cid-rxvxkuhm> <button type="submit" class="qa danger" style="width:100%;text-align:left;border-color:rgba(239,68,68,.15);" data-astro-cid-rxvxkuhm>', ' Logout</button> </form> </div> </div> </div> </div> </div> <!-- Weight Modal --> <div id="weightModal" class="modal" data-astro-cid-rxvxkuhm> <div class="modal-box" data-astro-cid-rxvxkuhm> <div class="modal-head" data-astro-cid-rxvxkuhm> <div class="modal-title" data-astro-cid-rxvxkuhm>\u2696\uFE0F Log Weight</div> <button id="closeWM" class="modal-close" data-astro-cid-rxvxkuhm>\xD7</button> </div> <form id="weightForm" style="padding:1.25rem;display:flex;flex-direction:column;gap:.875rem;" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label style="font-size:.7rem;font-weight:700;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-rxvxkuhm>Weight (', ')</label><input type="number" name="weight_display" step=".1"', ' class="fi" style="font-size:1.05rem;font-weight:700;" required data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label style="font-size:.7rem;font-weight:700;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-rxvxkuhm>Date</label><input type="date" name="date"', "", ' class="fi" required data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label style="font-size:.7rem;font-weight:700;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-rxvxkuhm>Notes (optional)</label><textarea name="notes" rows="2" placeholder="How are you feeling?" class="fi" style="resize:none;" data-astro-cid-rxvxkuhm></textarea></div> <div style="display:flex;gap:.625rem;" data-astro-cid-rxvxkuhm> <button type="submit" class="btn-save" style="flex:1;justify-content:center;" data-astro-cid-rxvxkuhm>\u2705 Log Weight</button> <button type="button" id="cancelWM" class="btn-ghost" data-astro-cid-rxvxkuhm>Cancel</button> </div> </form> </div> </div> <div class="toast" id="toast" data-astro-cid-rxvxkuhm></div> <script>(function(){', `
const html = document.documentElement;

// TABS
function switchTab(n){document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.getElementById('tab-'+n)?.classList.add('active');document.querySelector(\`[data-tab="\${n}"]\`)?.classList.add('active');}
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{const t=b.getAttribute('data-tab');if(t)switchTab(t);}));

// WEIGHT MODAL
const wm=document.getElementById('weightModal');
['openWM','openWM2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>wm?.classList.add('open')));
['closeWM','cancelWM'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>wm?.classList.remove('open')));
wm?.addEventListener('click',e=>{if(e.target===wm)wm.classList.remove('open');});
document.getElementById('weightForm')?.addEventListener('submit',async function(e){
  e.preventDefault();
  const d=Object.fromEntries(new FormData(this).entries());
  const v=parseFloat(d.weight_display);
  d.weight_kg=currentUnits==='imperial'?(v/2.20462).toFixed(2):v;
  delete d.weight_display;
  const r=await fetch('/api/profile/add-weight',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
  if(r.ok){
    showToast('\u2696\uFE0F Weight logged!');
    wm?.classList.remove('open');
    fetch('/api/achievements/check',{method:'POST'}).catch(()=>{});
    setTimeout(()=>window.location.reload(),1000);
  } else showToast('\u274C Failed');
});

// AVATAR in settings
let avaData=null;
const avaPrev=document.getElementById('avaPreview');
document.getElementById('avaUpload')?.addEventListener('change',function(e){
  const f=e.target.files?.[0];if(!f)return;
  if(f.size>2*1024*1024){showToast('\u274C Max 2MB');return;}
  const r=new FileReader();
  r.onload=ev=>{avaData=ev.target.result;if(avaPrev)avaPrev.innerHTML=\`<img src="\${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;"/>\`;};
  r.readAsDataURL(f);
});
document.querySelectorAll('.epick').forEach(b=>b.addEventListener('click',function(){
  const e=this.getAttribute('data-emoji');avaData='emoji:'+e;
  if(avaPrev)avaPrev.innerHTML=\`<span style="font-size:1.6rem;">\${e}</span>\`;
  document.querySelectorAll('.epick').forEach(x=>x.style.borderColor='');
  this.style.borderColor='var(--green)';
}));
document.getElementById('saveAva')?.addEventListener('click',async function(){
  if(!avaData){showToast('\u274C Select an avatar first');return;}
  const r=await fetch('/api/profile/update-avatar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({avatar:avaData})});
  if(r.ok){showToast('\u2705 Avatar saved!');setTimeout(()=>window.location.reload(),1000);}else showToast('\u274C Failed');
});
// open avatar via hero click
document.getElementById('openAvatarBtn')?.addEventListener('click',()=>{switchTab('settings');setTimeout(()=>document.getElementById('saveAva')?.scrollIntoView({behavior:'smooth'}),200);});

// EDIT FORM
document.getElementById('editForm')?.addEventListener('submit',async function(e){
  e.preventDefault();
  const d=Object.fromEntries(new FormData(this).entries());
  const w=parseFloat(d.weight_display),t=parseFloat(d.target_weight_display);
  if(currentUnits==='imperial'){
    if(!isNaN(w))d.weight_kg=(w/2.20462).toFixed(2);
    if(!isNaN(t))d.target_weight_kg=(t/2.20462).toFixed(2);
    const ft=parseFloat(d.height_ft)||0,inch=parseFloat(d.height_in)||0;
    d.height_cm=Math.round((ft*12+inch)*2.54);
    delete d.height_ft;delete d.height_in;
  }else{if(!isNaN(w))d.weight_kg=w;if(!isNaN(t))d.target_weight_kg=t;}
  delete d.weight_display;delete d.target_weight_display;
  const r=await fetch('/api/profile/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
  if(r.ok){showToast('\u2705 Profile saved!');setTimeout(()=>window.location.reload(),1000);}else showToast('\u274C Failed');
});

// UNITS
async function setUnits(u){
  const r=await fetch('/api/profile/update-units',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({units:u})});
  if(r.ok)window.location.reload();else showToast('\u274C Failed');
}
window.setUnits=setUnits;

// TOAST
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.className='toast show';setTimeout(()=>t.classList.remove('show'),2800);}

// CHARTS
window.addEventListener('load',()=>{
  if(typeof Chart==='undefined')return;
  const dark=html.getAttribute('data-theme')==='dark';
  const tc=dark?'#e8edf5':'#0f172a',gc=dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.05)';
  Chart.defaults.color=tc;
  const wd=JSON.parse(chartDataJson||'[]');
  const wc=document.getElementById('weightChart');
  if(wc&&wd.length>1){
    const ws=wd.map(x=>x.weight),mn=Math.min(...ws),mx=Math.max(...ws),rng=mx-mn;
    new Chart(wc,{type:'line',data:{labels:wd.map(x=>x.date),datasets:[{data:ws,borderColor:'#10b981',backgroundColor:'rgba(16,185,129,.08)',fill:true,tension:.4,borderWidth:2.5,pointRadius:4,pointBackgroundColor:'#10b981'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>\`\${ctx.parsed.y.toFixed(1)} \${weightChartLabel}\`}}},scales:{y:{min:Math.floor(mn-rng*.2),max:Math.ceil(mx+rng*.2),grid:{color:gc},ticks:{callback:v=>v+' '+weightChartLabel}},x:{grid:{display:false}}}}});
  }
  const xd=JSON.parse(xpDataJson||'[]');
  const xc=document.getElementById('xpChart');
  if(xc&&xd.length>0)new Chart(xc,{type:'line',data:{labels:xd.map(x=>'D'+x.day),datasets:[{data:xd.map(x=>x.xp),borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,.08)',fill:true,tension:.4,borderWidth:2.5,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gc}},x:{grid:{display:false},ticks:{maxTicksLimit:8}}}}});
  const cd=JSON.parse(completionDataJson||'[]');
  const cc=document.getElementById('completionChart');
  if(cc&&cd.length>0)new Chart(cc,{type:'bar',data:{labels:cd.map(x=>'D'+x.day),datasets:[{data:cd.map(x=>x.percentage),backgroundColor:cd.map(x=>x.percentage===100?'rgba(16,185,129,.7)':x.percentage>=75?'rgba(59,130,246,.7)':x.percentage>=50?'rgba(245,158,11,.7)':'rgba(239,68,68,.7)'),borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,grid:{color:gc},ticks:{callback:v=>v+'%'}},x:{grid:{display:false},ticks:{maxTicksLimit:10,font:{size:10}}}}}});
  // Score ring animation
  const ring=document.getElementById('scoreRing');
  if(ring){const c=2*Math.PI*42;setTimeout(()=>{ring.style.strokeDashoffset=(c*(1-ketoScore/100)).toString();},400);}
});

/* \u2500\u2500 Macro Goals \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
function showMacroMsg(msg, color) {
  var el = document.getElementById('macroCalcMsg');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || 'var(--purple2)';
  el.style.display = 'block';
}

document.getElementById('calcMacrosBtn')?.addEventListener('click', function() {
  var w = profileWeightKg;
  var h = profileHeightCm;
  var a = profileAge;
  // Try reading live values from the edit form first
  var wInp = document.querySelector('[name="weight_display"]');
  var hInp = document.querySelector('[name="height_cm"]');
  var aInp = document.querySelector('[name="age"]');
  var gSel = document.querySelector('[name="gender"]');
  var actSel = document.querySelector('[name="activity_level"]');
  if (wInp && wInp.value) w = parseFloat(wInp.value) || w;
  if (hInp && hInp.value) h = parseFloat(hInp.value) || h;
  if (aInp && aInp.value) a = parseInt(aInp.value) || a;
  var gender   = (gSel && gSel.value) ? gSel.value : profileGender;
  var activity = (actSel && actSel.value) ? actSel.value : profileActivity;

  if (!w || !h || !a) {
    showMacroMsg('\u26A0\uFE0F Fill in your weight, height, and age in the form above first.', 'var(--gold)');
    return;
  }

  // Mifflin-St Jeor BMR
  var bmr = gender === 'female'
    ? (10 * w) + (6.25 * h) - (5 * a) - 161
    : (10 * w) + (6.25 * h) - (5 * a) + 5;

  var actMap = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };
  var multiplier = actMap[activity] || 1.375;
  var tdee = bmr * multiplier;
  // 15% caloric deficit for fat loss
  var cal = Math.round(tdee * 0.85 / 50) * 50;
  var fat  = Math.round((cal * 0.70) / 9);
  var prot = Math.round((cal * 0.25) / 4);
  var carb = Math.round((cal * 0.05) / 4);

  document.getElementById('mgCal').value  = cal;
  document.getElementById('mgProt').value = prot;
  document.getElementById('mgFat').value  = fat;
  document.getElementById('mgCarb').value = carb;

  showMacroMsg('\u2705 Calculated from your stats: TDEE ' + Math.round(tdee) + ' kcal \u2192 15% deficit = ' + cal + ' kcal/day (70% fat / 25% protein / 5% carbs)', 'var(--green2)');
});

// Preset buttons
document.querySelectorAll('.macro-preset').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.getElementById('mgCal').value  = btn.getAttribute('data-cal');
    document.getElementById('mgProt').value = btn.getAttribute('data-p');
    document.getElementById('mgFat').value  = btn.getAttribute('data-f');
    document.getElementById('mgCarb').value = btn.getAttribute('data-c');
    document.querySelectorAll('.macro-preset').forEach(function(b) { b.style.borderColor = 'var(--border)'; b.style.color = 'var(--soft)'; });
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green2)';
  });
});

document.getElementById('saveMacroGoals')?.addEventListener('click', function() {
  var btn = document.getElementById('saveMacroGoals');
  var cal  = parseInt(document.getElementById('mgCal').value);
  var prot = parseInt(document.getElementById('mgProt').value);
  var fat  = parseInt(document.getElementById('mgFat').value);
  var carb = parseInt(document.getElementById('mgCarb').value);
  if (!cal || cal < 500) { showMacroMsg('\u26A0\uFE0F Please enter a valid calorie goal (min 500).', 'var(--red)'); return; }
  btn.textContent = 'Saving\u2026';
  btn.disabled = true;
  fetch('/api/macro-goals/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ daily_calories: cal, protein_g: prot, fat_g: fat, carbs_g: carb }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      showMacroMsg('\u2705 Macro goals saved! Dashboard will use these targets.', 'var(--green2)');
    } else {
      showMacroMsg('\u274C ' + (data.error || 'Failed to save.'), 'var(--red)');
    }
    btn.textContent = '\u{1F4BE} Save Macro Goals';
    btn.disabled = false;
  })
  .catch(function() {
    showMacroMsg('\u274C Network error. Please try again.', 'var(--red)');
    btn.textContent = '\u{1F4BE} Save Macro Goals';
    btn.disabled = false;
  });
});
})();<\/script> </body> </html>`], [`<html lang="en" data-astro-cid-rxvxkuhm> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Profile \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet"><script>(function(){ const t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();<\/script>`, '</head> <body data-astro-cid-rxvxkuhm> <div class="bg-mesh" aria-hidden="true" data-astro-cid-rxvxkuhm> <div class="orb o1" data-astro-cid-rxvxkuhm></div><div class="orb o2" data-astro-cid-rxvxkuhm></div><div class="orb o3" data-astro-cid-rxvxkuhm></div> </div> <!-- NAV --> ', ' <div class="page" data-astro-cid-rxvxkuhm> <!-- \u2550\u2550 HERO \u2550\u2550 --> <div class="profile-hero" data-astro-cid-rxvxkuhm> <div class="hero-gradient" data-astro-cid-rxvxkuhm></div> <div class="hero-glow" data-astro-cid-rxvxkuhm></div> <div class="hero-body" data-astro-cid-rxvxkuhm> <!-- Avatar --> <div class="hero-avatar" id="openAvatarBtn" title="Change avatar" data-astro-cid-rxvxkuhm> ', ' </div> <!-- Info --> <div data-astro-cid-rxvxkuhm> <div class="hero-greeting" data-astro-cid-rxvxkuhm>Your Keto Profile</div> <div class="hero-name" data-astro-cid-rxvxkuhm><span class="hl" data-astro-cid-rxvxkuhm>', '</span></div> <div class="hero-email" data-astro-cid-rxvxkuhm>', '</div> <div class="hero-tags" data-astro-cid-rxvxkuhm> <span class="htag" data-astro-cid-rxvxkuhm>', " ", '</span> <span class="htag" data-astro-cid-rxvxkuhm>', " ", 'd streak</span> <span class="htag" data-astro-cid-rxvxkuhm>', " Lv.", '</span> <span class="htag"', " data-astro-cid-rxvxkuhm>", " ", 'd left</span> <span class="htag" data-astro-cid-rxvxkuhm>', " ", "/", ' badges</span> </div> <div class="units-toggle" data-astro-cid-rxvxkuhm> <button', ` onclick="setUnits('imperial')" data-astro-cid-rxvxkuhm>\u{1F1FA}\u{1F1F8} lbs/ft</button> <button`, ` onclick="setUnits('metric')" data-astro-cid-rxvxkuhm>\u{1F30D} kg/cm</button> </div> </div> <!-- Keto Score --> <div class="score-wrap" data-astro-cid-rxvxkuhm> <div class="score-ring" data-astro-cid-rxvxkuhm> <svg viewBox="0 0 100 100" width="108" height="108" data-astro-cid-rxvxkuhm> <circle class="ring-bg" cx="50" cy="50" r="42" data-astro-cid-rxvxkuhm></circle> <circle class="ring-fill" cx="50" cy="50" r="42"`, "", "", ' id="scoreRing" data-astro-cid-rxvxkuhm></circle> </svg> <div class="score-center" data-astro-cid-rxvxkuhm> <div class="score-num"', " data-astro-cid-rxvxkuhm>", '</div> <div class="score-lbl" data-astro-cid-rxvxkuhm>Keto Score</div> </div> </div> <div class="score-tag" data-astro-cid-rxvxkuhm>', '</div> </div> </div> <!-- Stats bar --> <div class="stats-bar" data-astro-cid-rxvxkuhm> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--green),var(--green2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Current Day</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--red),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Day Streak</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--gold),#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Total XP</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Weight</div></div> <div class="sbar" data-astro-cid-rxvxkuhm><div class="sbar-val" style="background:linear-gradient(135deg,var(--purple),#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;" data-astro-cid-rxvxkuhm>', '</div><div class="sbar-lbl" data-astro-cid-rxvxkuhm>Perfect Days</div></div> </div> </div> <!-- TABS --> <div class="tabs-bar" data-astro-cid-rxvxkuhm> <button class="tab-btn active" data-tab="overview" data-astro-cid-rxvxkuhm>', ' Overview</button> <button class="tab-btn" data-tab="achievements" data-astro-cid-rxvxkuhm>', ' Achievements</button> <button class="tab-btn" data-tab="milestones" data-astro-cid-rxvxkuhm>', ' Milestones</button> <button class="tab-btn" data-tab="settings" data-astro-cid-rxvxkuhm>', ' Settings</button> </div> <!-- \u2550\u2550 OVERVIEW \u2550\u2550 --> <div id="tab-overview" class="tab-content active" data-astro-cid-rxvxkuhm> <div class="stats-row" data-astro-cid-rxvxkuhm> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--green);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(16,185,129,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Weight Lost</div><div class="scard-val" style="color:var(--green);" data-astro-cid-rxvxkuhm>', " ", '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>Goal: ', '</div><div class="mini-bar" data-astro-cid-rxvxkuhm><div class="mini-fill"', ' data-astro-cid-rxvxkuhm></div></div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--blue);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(59,130,246,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>BMI</div><div class="scard-val"', " data-astro-cid-rxvxkuhm>", '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>', " \xB7 ", '</div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--gold);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(245,158,11,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Perfect Days</div><div class="scard-val" style="color:var(--gold);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>Longest: ', 'd</div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--purple);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(139,92,246,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Water Logged</div><div class="scard-val" style="color:var(--purple);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>glasses total</div></div> <div class="scard" data-astro-cid-rxvxkuhm><div class="gl" style="background:var(--cyan);" data-astro-cid-rxvxkuhm></div><div class="scard-icon" style="background:rgba(6,182,212,.1);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-lbl" data-astro-cid-rxvxkuhm>Meals Done</div><div class="scard-val" style="color:var(--cyan);" data-astro-cid-rxvxkuhm>', '</div><div class="scard-sub" data-astro-cid-rxvxkuhm>', ' tasks total</div></div> </div> <div class="g2" style="margin-bottom:1rem;" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="card-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Weight Progress</div> <button id="openWM" class="btn-save" style="padding:.45rem .9rem;font-size:.75rem;" data-astro-cid-rxvxkuhm>+ Log Weight</button> </div> ', ' </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', " XP Growth</div> ", ' </div> </div> <div class="g2" style="margin-bottom:1rem;" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', " Daily Completion</div> ", ' </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Daily Nutrition Targets</div> <div class="macro-grid" data-astro-cid-rxvxkuhm> ', ' </div> <div style="margin-top:1rem;padding:.75rem;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);border-radius:11px;text-align:center;font-size:.75rem;font-weight:700;color:var(--blue);" data-astro-cid-rxvxkuhm>70% Fat \xB7 25% Protein \xB7 5% Carbs</div> </div> </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Activity Summary</div> <div class="g3" data-astro-cid-rxvxkuhm> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#8b5cf6;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Meals</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#3b82f6;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Water Glasses</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#10b981;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Tasks Done</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#f59e0b;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>XP Earned</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#f093fb;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Perfect Days</div></div> <div style="text-align:center;padding:1rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:13px;" data-astro-cid-rxvxkuhm><div style="margin-bottom:.35rem;" data-astro-cid-rxvxkuhm>', `</div><div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:#ef4444;margin-bottom:.15rem;" data-astro-cid-rxvxkuhm>`, '</div><div style="font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;" data-astro-cid-rxvxkuhm>Day Streak</div></div> </div> </div> </div> <!-- \u2550\u2550 ACHIEVEMENTS \u2550\u2550 --> <div id="tab-achievements" class="tab-content" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="card-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Your Achievements</div> <span style="font-size:.75rem;font-weight:700;color:var(--soft);" data-astro-cid-rxvxkuhm>', " / ", ' earned</span> </div> <div class="mini-bar" style="height:7px;margin-bottom:1.5rem;" data-astro-cid-rxvxkuhm><div class="mini-fill"', " data-astro-cid-rxvxkuhm></div></div> ", ' <div style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--green);margin-bottom:.75rem;" data-astro-cid-rxvxkuhm>', " Earned (", ')</div> <div class="ach-grid" style="margin-bottom:1.5rem;" data-astro-cid-rxvxkuhm> ', ' </div> <div style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:.75rem;" data-astro-cid-rxvxkuhm>', " Locked (", ')</div> <div class="ach-grid" data-astro-cid-rxvxkuhm> ', ' </div> </div> </div> <!-- \u2550\u2550 MILESTONES \u2550\u2550 --> <div id="tab-milestones" class="tab-content" data-astro-cid-rxvxkuhm> <div class="g2" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Journey Timeline</div> <div class="timeline" data-astro-cid-rxvxkuhm> ', ' </div> </div> <div style="display:flex;flex-direction:column;gap:1rem;" data-astro-cid-rxvxkuhm> <div class="card" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="card-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Weight Log</div> <button id="openWM2" class="btn-save" style="padding:.4rem .85rem;font-size:.72rem;" data-astro-cid-rxvxkuhm>+ Add</button> </div> ', ' </div> <div class="card" data-astro-cid-rxvxkuhm> <div class="card-title" data-astro-cid-rxvxkuhm>', ' Journey Stats</div> <div style="display:flex;flex-direction:column;gap:.5rem;" data-astro-cid-rxvxkuhm> ', ' </div> </div> </div> </div> </div> <!-- \u2550\u2550 SETTINGS \u2550\u2550 --> <div id="tab-settings" class="tab-content" data-astro-cid-rxvxkuhm> <div class="g2" data-astro-cid-rxvxkuhm> <div data-astro-cid-rxvxkuhm> <div class="form-section" data-astro-cid-rxvxkuhm> <div class="fsec-title" data-astro-cid-rxvxkuhm>', ' Personal Information</div> <form id="editForm" data-astro-cid-rxvxkuhm> <div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Full Name</label><input type="text" name="full_name"', ' class="fi" required data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Age</label><input type="number" name="age"', ' class="fi" data-astro-cid-rxvxkuhm></div> </div> <div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Gender</label><select name="gender" class="fi" data-astro-cid-rxvxkuhm><option value="" data-astro-cid-rxvxkuhm>Select\u2026</option><option value="male"', ' data-astro-cid-rxvxkuhm>Male</option><option value="female"', ' data-astro-cid-rxvxkuhm>Female</option><option value="other"', ' data-astro-cid-rxvxkuhm>Other</option></select></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Goal</label><select name="goal" class="fi" data-astro-cid-rxvxkuhm><option value="" data-astro-cid-rxvxkuhm>Select\u2026</option><option value="lose_weight"', ' data-astro-cid-rxvxkuhm>Lose Weight</option><option value="maintain"', ' data-astro-cid-rxvxkuhm>Maintain</option><option value="gain_muscle"', ' data-astro-cid-rxvxkuhm>Gain Muscle</option></select></div> </div> <div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Weight (', ')</label><input type="number" name="weight_display"', ' step=".1" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Target (', ')</label><input type="number" name="target_weight_display"', ' step=".1" class="fi" data-astro-cid-rxvxkuhm></div> </div> ', ' <div class="fg" style="margin-bottom:1.25rem;" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Activity Level</label><select name="activity_level" class="fi" data-astro-cid-rxvxkuhm><option value="" data-astro-cid-rxvxkuhm>Select\u2026</option><option value="sedentary"', ' data-astro-cid-rxvxkuhm>Sedentary</option><option value="light"', ' data-astro-cid-rxvxkuhm>Light (1\u20133\xD7/wk)</option><option value="moderate"', ' data-astro-cid-rxvxkuhm>Moderate (3\u20135\xD7/wk)</option><option value="active"', ' data-astro-cid-rxvxkuhm>Active (6\u20137\xD7/wk)</option><option value="very_active"', ' data-astro-cid-rxvxkuhm>Very Active</option></select></div> <button type="submit" class="btn-save" data-astro-cid-rxvxkuhm>Save Changes</button> </form> </div> <!-- MACRO GOALS --> <div class="form-section" data-astro-cid-rxvxkuhm> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> <div class="fsec-title" style="margin:0;" data-astro-cid-rxvxkuhm>', ' Daily Macro Goals</div> <button type="button" id="calcMacrosBtn" class="btn-save" style="padding:.35rem .8rem;font-size:.72rem;background:linear-gradient(135deg,var(--purple),#7c3aed);" data-astro-cid-rxvxkuhm>', ' Auto-Calculate</button> </div> <div id="macroCalcMsg" style="display:none;margin-bottom:.75rem;padding:.5rem .75rem;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);border-radius:9px;font-size:.75rem;color:var(--purple2);" data-astro-cid-rxvxkuhm></div> <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.9rem;" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Calories / day</label><input type="number" id="mgCal"', ' min="500" max="6000" step="50" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Protein (g)</label> <input type="number" id="mgProt"', ' min="30" max="400" step="1" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Fat (g)</label> <input type="number" id="mgFat"', ' min="20" max="400" step="1" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Net Carbs (g)</label> <input type="number" id="mgCarb"', ' min="5" max="100" step="1" class="fi" data-astro-cid-rxvxkuhm></div> </div> <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.9rem;" data-astro-cid-rxvxkuhm> ', ' </div> <button type="button" id="saveMacroGoals" class="btn-save" style="width:100%;justify-content:center;" data-astro-cid-rxvxkuhm>Save Macro Goals</button> </div> </div> <div style="display:flex;flex-direction:column;gap:1rem;" data-astro-cid-rxvxkuhm> <div class="form-section" data-astro-cid-rxvxkuhm> <div class="fsec-title" data-astro-cid-rxvxkuhm>', ' Avatar</div> <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.25rem;" data-astro-cid-rxvxkuhm> <div id="avaPreview" style="width:60px;height:60px;border-radius:15px;background:linear-gradient(135deg,var(--green),var(--blue));display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:900;color:#fff;overflow:hidden;flex-shrink:0;" data-astro-cid-rxvxkuhm> ', ` </div> <div data-astro-cid-rxvxkuhm> <input type="file" id="avaUpload" accept="image/*" style="display:none;" data-astro-cid-rxvxkuhm> <button onclick="document.getElementById('avaUpload').click()" class="btn-save" style="padding:.45rem .9rem;font-size:.75rem;margin-bottom:.4rem;display:block;" data-astro-cid-rxvxkuhm>Upload Image</button> <p style="font-size:.68rem;color:var(--muted);" data-astro-cid-rxvxkuhm>JPG/PNG max 2MB</p> </div> </div> <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:.3rem;margin-bottom:1rem;" data-astro-cid-rxvxkuhm> `, ' </div> <button id="saveAva" class="btn-save" style="width:100%;justify-content:center;" data-astro-cid-rxvxkuhm>Save Avatar</button> </div> <div class="form-section" data-astro-cid-rxvxkuhm> <div class="fsec-title" data-astro-cid-rxvxkuhm>', ' Quick Actions</div> <a href="/dashboard" class="qa" data-astro-cid-rxvxkuhm>', ' Dashboard</a> <a href="/dashboard/recipes" class="qa" data-astro-cid-rxvxkuhm>', ' Recipes</a> <a href="/dashboard/shopping" class="qa" data-astro-cid-rxvxkuhm>', ' Shopping List</a> <a href="/dashboard/upgrade" class="qa" data-astro-cid-rxvxkuhm>', ' Upgrade Plan</a> <form action="/api/auth/logout" method="POST" style="margin:0;" data-astro-cid-rxvxkuhm> <button type="submit" class="qa danger" style="width:100%;text-align:left;border-color:rgba(239,68,68,.15);" data-astro-cid-rxvxkuhm>', ' Logout</button> </form> </div> </div> </div> </div> </div> <!-- Weight Modal --> <div id="weightModal" class="modal" data-astro-cid-rxvxkuhm> <div class="modal-box" data-astro-cid-rxvxkuhm> <div class="modal-head" data-astro-cid-rxvxkuhm> <div class="modal-title" data-astro-cid-rxvxkuhm>\u2696\uFE0F Log Weight</div> <button id="closeWM" class="modal-close" data-astro-cid-rxvxkuhm>\xD7</button> </div> <form id="weightForm" style="padding:1.25rem;display:flex;flex-direction:column;gap:.875rem;" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label style="font-size:.7rem;font-weight:700;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-rxvxkuhm>Weight (', ')</label><input type="number" name="weight_display" step=".1"', ' class="fi" style="font-size:1.05rem;font-weight:700;" required data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label style="font-size:.7rem;font-weight:700;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-rxvxkuhm>Date</label><input type="date" name="date"', "", ' class="fi" required data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label style="font-size:.7rem;font-weight:700;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-rxvxkuhm>Notes (optional)</label><textarea name="notes" rows="2" placeholder="How are you feeling?" class="fi" style="resize:none;" data-astro-cid-rxvxkuhm></textarea></div> <div style="display:flex;gap:.625rem;" data-astro-cid-rxvxkuhm> <button type="submit" class="btn-save" style="flex:1;justify-content:center;" data-astro-cid-rxvxkuhm>\u2705 Log Weight</button> <button type="button" id="cancelWM" class="btn-ghost" data-astro-cid-rxvxkuhm>Cancel</button> </div> </form> </div> </div> <div class="toast" id="toast" data-astro-cid-rxvxkuhm></div> <script>(function(){', `
const html = document.documentElement;

// TABS
function switchTab(n){document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.getElementById('tab-'+n)?.classList.add('active');document.querySelector(\\\`[data-tab="\\\${n}"]\\\`)?.classList.add('active');}
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{const t=b.getAttribute('data-tab');if(t)switchTab(t);}));

// WEIGHT MODAL
const wm=document.getElementById('weightModal');
['openWM','openWM2'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>wm?.classList.add('open')));
['closeWM','cancelWM'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>wm?.classList.remove('open')));
wm?.addEventListener('click',e=>{if(e.target===wm)wm.classList.remove('open');});
document.getElementById('weightForm')?.addEventListener('submit',async function(e){
  e.preventDefault();
  const d=Object.fromEntries(new FormData(this).entries());
  const v=parseFloat(d.weight_display);
  d.weight_kg=currentUnits==='imperial'?(v/2.20462).toFixed(2):v;
  delete d.weight_display;
  const r=await fetch('/api/profile/add-weight',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
  if(r.ok){
    showToast('\u2696\uFE0F Weight logged!');
    wm?.classList.remove('open');
    fetch('/api/achievements/check',{method:'POST'}).catch(()=>{});
    setTimeout(()=>window.location.reload(),1000);
  } else showToast('\u274C Failed');
});

// AVATAR in settings
let avaData=null;
const avaPrev=document.getElementById('avaPreview');
document.getElementById('avaUpload')?.addEventListener('change',function(e){
  const f=e.target.files?.[0];if(!f)return;
  if(f.size>2*1024*1024){showToast('\u274C Max 2MB');return;}
  const r=new FileReader();
  r.onload=ev=>{avaData=ev.target.result;if(avaPrev)avaPrev.innerHTML=\\\`<img src="\\\${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;"/>\\\`;};
  r.readAsDataURL(f);
});
document.querySelectorAll('.epick').forEach(b=>b.addEventListener('click',function(){
  const e=this.getAttribute('data-emoji');avaData='emoji:'+e;
  if(avaPrev)avaPrev.innerHTML=\\\`<span style="font-size:1.6rem;">\\\${e}</span>\\\`;
  document.querySelectorAll('.epick').forEach(x=>x.style.borderColor='');
  this.style.borderColor='var(--green)';
}));
document.getElementById('saveAva')?.addEventListener('click',async function(){
  if(!avaData){showToast('\u274C Select an avatar first');return;}
  const r=await fetch('/api/profile/update-avatar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({avatar:avaData})});
  if(r.ok){showToast('\u2705 Avatar saved!');setTimeout(()=>window.location.reload(),1000);}else showToast('\u274C Failed');
});
// open avatar via hero click
document.getElementById('openAvatarBtn')?.addEventListener('click',()=>{switchTab('settings');setTimeout(()=>document.getElementById('saveAva')?.scrollIntoView({behavior:'smooth'}),200);});

// EDIT FORM
document.getElementById('editForm')?.addEventListener('submit',async function(e){
  e.preventDefault();
  const d=Object.fromEntries(new FormData(this).entries());
  const w=parseFloat(d.weight_display),t=parseFloat(d.target_weight_display);
  if(currentUnits==='imperial'){
    if(!isNaN(w))d.weight_kg=(w/2.20462).toFixed(2);
    if(!isNaN(t))d.target_weight_kg=(t/2.20462).toFixed(2);
    const ft=parseFloat(d.height_ft)||0,inch=parseFloat(d.height_in)||0;
    d.height_cm=Math.round((ft*12+inch)*2.54);
    delete d.height_ft;delete d.height_in;
  }else{if(!isNaN(w))d.weight_kg=w;if(!isNaN(t))d.target_weight_kg=t;}
  delete d.weight_display;delete d.target_weight_display;
  const r=await fetch('/api/profile/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
  if(r.ok){showToast('\u2705 Profile saved!');setTimeout(()=>window.location.reload(),1000);}else showToast('\u274C Failed');
});

// UNITS
async function setUnits(u){
  const r=await fetch('/api/profile/update-units',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({units:u})});
  if(r.ok)window.location.reload();else showToast('\u274C Failed');
}
window.setUnits=setUnits;

// TOAST
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.className='toast show';setTimeout(()=>t.classList.remove('show'),2800);}

// CHARTS
window.addEventListener('load',()=>{
  if(typeof Chart==='undefined')return;
  const dark=html.getAttribute('data-theme')==='dark';
  const tc=dark?'#e8edf5':'#0f172a',gc=dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.05)';
  Chart.defaults.color=tc;
  const wd=JSON.parse(chartDataJson||'[]');
  const wc=document.getElementById('weightChart');
  if(wc&&wd.length>1){
    const ws=wd.map(x=>x.weight),mn=Math.min(...ws),mx=Math.max(...ws),rng=mx-mn;
    new Chart(wc,{type:'line',data:{labels:wd.map(x=>x.date),datasets:[{data:ws,borderColor:'#10b981',backgroundColor:'rgba(16,185,129,.08)',fill:true,tension:.4,borderWidth:2.5,pointRadius:4,pointBackgroundColor:'#10b981'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>\\\`\\\${ctx.parsed.y.toFixed(1)} \\\${weightChartLabel}\\\`}}},scales:{y:{min:Math.floor(mn-rng*.2),max:Math.ceil(mx+rng*.2),grid:{color:gc},ticks:{callback:v=>v+' '+weightChartLabel}},x:{grid:{display:false}}}}});
  }
  const xd=JSON.parse(xpDataJson||'[]');
  const xc=document.getElementById('xpChart');
  if(xc&&xd.length>0)new Chart(xc,{type:'line',data:{labels:xd.map(x=>'D'+x.day),datasets:[{data:xd.map(x=>x.xp),borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,.08)',fill:true,tension:.4,borderWidth:2.5,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gc}},x:{grid:{display:false},ticks:{maxTicksLimit:8}}}}});
  const cd=JSON.parse(completionDataJson||'[]');
  const cc=document.getElementById('completionChart');
  if(cc&&cd.length>0)new Chart(cc,{type:'bar',data:{labels:cd.map(x=>'D'+x.day),datasets:[{data:cd.map(x=>x.percentage),backgroundColor:cd.map(x=>x.percentage===100?'rgba(16,185,129,.7)':x.percentage>=75?'rgba(59,130,246,.7)':x.percentage>=50?'rgba(245,158,11,.7)':'rgba(239,68,68,.7)'),borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,grid:{color:gc},ticks:{callback:v=>v+'%'}},x:{grid:{display:false},ticks:{maxTicksLimit:10,font:{size:10}}}}}});
  // Score ring animation
  const ring=document.getElementById('scoreRing');
  if(ring){const c=2*Math.PI*42;setTimeout(()=>{ring.style.strokeDashoffset=(c*(1-ketoScore/100)).toString();},400);}
});

/* \u2500\u2500 Macro Goals \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
function showMacroMsg(msg, color) {
  var el = document.getElementById('macroCalcMsg');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || 'var(--purple2)';
  el.style.display = 'block';
}

document.getElementById('calcMacrosBtn')?.addEventListener('click', function() {
  var w = profileWeightKg;
  var h = profileHeightCm;
  var a = profileAge;
  // Try reading live values from the edit form first
  var wInp = document.querySelector('[name="weight_display"]');
  var hInp = document.querySelector('[name="height_cm"]');
  var aInp = document.querySelector('[name="age"]');
  var gSel = document.querySelector('[name="gender"]');
  var actSel = document.querySelector('[name="activity_level"]');
  if (wInp && wInp.value) w = parseFloat(wInp.value) || w;
  if (hInp && hInp.value) h = parseFloat(hInp.value) || h;
  if (aInp && aInp.value) a = parseInt(aInp.value) || a;
  var gender   = (gSel && gSel.value) ? gSel.value : profileGender;
  var activity = (actSel && actSel.value) ? actSel.value : profileActivity;

  if (!w || !h || !a) {
    showMacroMsg('\u26A0\uFE0F Fill in your weight, height, and age in the form above first.', 'var(--gold)');
    return;
  }

  // Mifflin-St Jeor BMR
  var bmr = gender === 'female'
    ? (10 * w) + (6.25 * h) - (5 * a) - 161
    : (10 * w) + (6.25 * h) - (5 * a) + 5;

  var actMap = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };
  var multiplier = actMap[activity] || 1.375;
  var tdee = bmr * multiplier;
  // 15% caloric deficit for fat loss
  var cal = Math.round(tdee * 0.85 / 50) * 50;
  var fat  = Math.round((cal * 0.70) / 9);
  var prot = Math.round((cal * 0.25) / 4);
  var carb = Math.round((cal * 0.05) / 4);

  document.getElementById('mgCal').value  = cal;
  document.getElementById('mgProt').value = prot;
  document.getElementById('mgFat').value  = fat;
  document.getElementById('mgCarb').value = carb;

  showMacroMsg('\u2705 Calculated from your stats: TDEE ' + Math.round(tdee) + ' kcal \u2192 15% deficit = ' + cal + ' kcal/day (70% fat / 25% protein / 5% carbs)', 'var(--green2)');
});

// Preset buttons
document.querySelectorAll('.macro-preset').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.getElementById('mgCal').value  = btn.getAttribute('data-cal');
    document.getElementById('mgProt').value = btn.getAttribute('data-p');
    document.getElementById('mgFat').value  = btn.getAttribute('data-f');
    document.getElementById('mgCarb').value = btn.getAttribute('data-c');
    document.querySelectorAll('.macro-preset').forEach(function(b) { b.style.borderColor = 'var(--border)'; b.style.color = 'var(--soft)'; });
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green2)';
  });
});

document.getElementById('saveMacroGoals')?.addEventListener('click', function() {
  var btn = document.getElementById('saveMacroGoals');
  var cal  = parseInt(document.getElementById('mgCal').value);
  var prot = parseInt(document.getElementById('mgProt').value);
  var fat  = parseInt(document.getElementById('mgFat').value);
  var carb = parseInt(document.getElementById('mgCarb').value);
  if (!cal || cal < 500) { showMacroMsg('\u26A0\uFE0F Please enter a valid calorie goal (min 500).', 'var(--red)'); return; }
  btn.textContent = 'Saving\u2026';
  btn.disabled = true;
  fetch('/api/macro-goals/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ daily_calories: cal, protein_g: prot, fat_g: fat, carbs_g: carb }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      showMacroMsg('\u2705 Macro goals saved! Dashboard will use these targets.', 'var(--green2)');
    } else {
      showMacroMsg('\u274C ' + (data.error || 'Failed to save.'), 'var(--red)');
    }
    btn.textContent = '\u{1F4BE} Save Macro Goals';
    btn.disabled = false;
  })
  .catch(function() {
    showMacroMsg('\u274C Network error. Please try again.', 'var(--red)');
    btn.textContent = '\u{1F4BE} Save Macro Goals';
    btn.disabled = false;
  });
});
})();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "profile", "data-astro-cid-rxvxkuhm": true }), profile.avatar_url?.startsWith("emoji:") ? profile.avatar_url.replace("emoji:", "") : profile.avatar_url ? renderTemplate`<img${addAttribute(profile.avatar_url, "src")}${addAttribute(profile.full_name, "alt")} style="width:100%;height:100%;object-fit:cover;" data-astro-cid-rxvxkuhm>` : avatarLetter, profile.full_name, profile.email, plan.emoji, plan.name, renderComponent($$result, "Flame", $$Flame, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), currentStreak, renderComponent($$result, "Zap", $$Zap, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), level, addAttribute(daysLeft <= 7 ? "color:var(--red);border-color:rgba(239,68,68,.3);" : "", "style"), renderComponent($$result, "Calendar", $$Calendar, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), daysLeft, renderComponent($$result, "Trophy", $$Trophy, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), achievementsList.filter((a) => a.done).length, achievementsList.length, addAttribute(`units-btn${units === "imperial" ? " active" : ""}`, "class"), addAttribute(`units-btn${units === "metric" ? " active" : ""}`, "class"), addAttribute(ketoScore >= 80 ? "#10b981" : ketoScore >= 60 ? "#f59e0b" : "#3b82f6", "stroke"), addAttribute(`${2 * Math.PI * 42}`, "stroke-dasharray"), addAttribute(`${2 * Math.PI * 42}`, "stroke-dashoffset"), addAttribute(`color:${ketoScore >= 80 ? "#10b981" : ketoScore >= 60 ? "#f59e0b" : "#3b82f6"}`, "style"), ketoScore, ketoScore >= 80 ? "\u{1F525} Excellent!" : ketoScore >= 60 ? "\u{1F4AA} Good" : ketoScore >= 40 ? "\u{1F4C8} Growing" : "\u{1F680} Starting", currentDay, currentStreak, totalXP, displayWeight, perfectDays, renderComponent($$result, "BarChart3", $$BarChart3, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Trophy", $$Trophy, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Target", $$Target, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Settings", $$Settings, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 18, "color": "var(--green)", "data-astro-cid-rxvxkuhm": true }), weightChange > 0 ? `-${weightChange.toFixed(1)}` : "0.0", wLabel, displayTargetWeight, addAttribute(`width:${progressPercent}%;background:linear-gradient(90deg,var(--green),var(--green2));`, "style"), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 18, "color": "var(--blue)", "data-astro-cid-rxvxkuhm": true }), addAttribute(`color:${bmiCategory.color};`, "style"), bmi ? bmi.toFixed(1) : "\u2014", bmiCategory.label, displayHeight, renderComponent($$result, "Trophy", $$Trophy, { "size": 18, "color": "var(--gold)", "data-astro-cid-rxvxkuhm": true }), perfectDays, longestStreak, renderComponent($$result, "Droplets", $$Droplets, { "size": 18, "color": "var(--purple)", "data-astro-cid-rxvxkuhm": true }), totalWaterGlasses, renderComponent($$result, "Utensils", $$Utensils, { "size": 18, "color": "var(--cyan)", "data-astro-cid-rxvxkuhm": true }), totalMealsCompleted, totalTasksCompleted, renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), weightLogs.length > 1 ? renderTemplate`<div class="chart-wrap" data-astro-cid-rxvxkuhm><canvas id="weightChart" data-astro-cid-rxvxkuhm></canvas></div>` : renderTemplate`<div style="height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1.5px dashed var(--border);border-radius:12px;gap:.5rem;" data-astro-cid-rxvxkuhm><span style="font-size:2.5rem;" data-astro-cid-rxvxkuhm>⚖️</span><p style="font-size:.82rem;color:var(--soft);" data-astro-cid-rxvxkuhm>Log weight to see progress</p></div>`, renderComponent($$result, "Zap", $$Zap, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), xpData.length > 0 ? renderTemplate`<div class="chart-wrap" data-astro-cid-rxvxkuhm><canvas id="xpChart" data-astro-cid-rxvxkuhm></canvas></div>` : renderTemplate`<div style="height:180px;display:flex;align-items:center;justify-content:center;border:1.5px dashed var(--border);border-radius:12px;color:var(--soft);font-size:.82rem;" data-astro-cid-rxvxkuhm>Complete tasks to earn XP</div>`, renderComponent($$result, "BarChart3", $$BarChart3, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), completionData.length > 0 ? renderTemplate`<div class="chart-wrap" data-astro-cid-rxvxkuhm><canvas id="completionChart" data-astro-cid-rxvxkuhm></canvas></div>` : renderTemplate`<div style="height:180px;display:flex;align-items:center;justify-content:center;border:1.5px dashed var(--border);border-radius:12px;color:var(--soft);font-size:.82rem;" data-astro-cid-rxvxkuhm>Start your journey!</div>`, renderComponent($$result, "Target", $$Target, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), [{ lbl: "Calories", val: `${calorieTarget}`, unit: "kcal", color: "#f093fb" }, { lbl: "Protein", val: `${proteinGrams}`, unit: "g", color: "#4facfe" }, { lbl: "Fat", val: `${fatGrams}`, unit: "g", color: "#10b981" }, { lbl: "Carbs", val: `${carbGrams}`, unit: "g", color: "#f59e0b" }].map((m) => renderTemplate`<div class="mring" data-astro-cid-rxvxkuhm><div class="mring-val"${addAttribute(`color:${m.color};`, "style")} data-astro-cid-rxvxkuhm>${m.val}<span style="font-size:.75rem;opacity:.65;" data-astro-cid-rxvxkuhm>${m.unit}</span></div><div class="mring-lbl" data-astro-cid-rxvxkuhm>${m.lbl}</div></div>`), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Utensils", $$Utensils, { "size": 24, "color": "#8b5cf6", "data-astro-cid-rxvxkuhm": true }), totalMealsCompleted, renderComponent($$result, "Droplets", $$Droplets, { "size": 24, "color": "#3b82f6", "data-astro-cid-rxvxkuhm": true }), totalWaterGlasses, renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 24, "color": "#10b981", "data-astro-cid-rxvxkuhm": true }), totalTasksCompleted, renderComponent($$result, "Zap", $$Zap, { "size": 24, "color": "#f59e0b", "data-astro-cid-rxvxkuhm": true }), totalXP, renderComponent($$result, "Trophy", $$Trophy, { "size": 24, "color": "#f093fb", "data-astro-cid-rxvxkuhm": true }), perfectDays, renderComponent($$result, "Flame", $$Flame, { "size": 24, "color": "#ef4444", "data-astro-cid-rxvxkuhm": true }), currentStreak, renderComponent($$result, "Trophy", $$Trophy, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), achievementsList.filter((a) => a.done).length, achievementsList.length, addAttribute(`width:${Math.round(achievementsList.filter((a) => a.done).length / achievementsList.length * 100)}%;background:linear-gradient(90deg,var(--green),var(--green2));`, "style"), dbAchievements.length > 0 && renderTemplate`<div style="margin-bottom:1.5rem;" data-astro-cid-rxvxkuhm> <div style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:.75rem;" data-astro-cid-rxvxkuhm>${renderComponent($$result, "Award", $$Award, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true })} Unlocked Badges (${dbAchievements.length})</div> <div style="display:flex;flex-wrap:wrap;gap:.5rem;" data-astro-cid-rxvxkuhm> ${dbAchievements.map((a) => renderTemplate`<div style="display:flex;align-items:center;gap:.4rem;padding:.4rem .75rem;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:99px;" data-astro-cid-rxvxkuhm> <span style="font-size:.95rem;" data-astro-cid-rxvxkuhm>${a.icon || "\u{1F3C5}"}</span> <span style="font-size:.73rem;font-weight:700;color:var(--gold);" data-astro-cid-rxvxkuhm>${a.achievement_name}</span> </div>`)} </div> </div>`, renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), achievementsList.filter((a) => a.done).length, achievementsList.filter((a) => a.done).length === 0 ? renderTemplate`<p style="color:var(--soft);font-size:.82rem;grid-column:1/-1;" data-astro-cid-rxvxkuhm>Complete tasks to earn your first badge!</p>` : achievementsList.filter((a) => a.done).map((a) => renderTemplate`<div class="ach on" data-astro-cid-rxvxkuhm><div class="ach-ico" data-astro-cid-rxvxkuhm>${a.icon}</div><div data-astro-cid-rxvxkuhm><div class="ach-name" data-astro-cid-rxvxkuhm>${a.name}</div><div class="ach-desc" data-astro-cid-rxvxkuhm>${a.desc}</div></div><span style="margin-left:auto;color:var(--green);" data-astro-cid-rxvxkuhm>${renderComponent($$result, "CheckCircle", $$CheckCircle, { "size": 16, "data-astro-cid-rxvxkuhm": true })}</span></div>`), renderComponent($$result, "Lock", $$Lock, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), achievementsList.filter((a) => !a.done).length, achievementsList.filter((a) => !a.done).map((a) => renderTemplate`<div class="ach" style="opacity:.5;" data-astro-cid-rxvxkuhm><div class="ach-ico" style="filter:grayscale(1);" data-astro-cid-rxvxkuhm>${a.icon}</div><div data-astro-cid-rxvxkuhm><div class="ach-name" style="color:var(--soft);" data-astro-cid-rxvxkuhm>${a.name}</div><div class="ach-desc" data-astro-cid-rxvxkuhm>${a.desc}</div></div><span style="margin-left:auto;color:var(--muted);" data-astro-cid-rxvxkuhm>${renderComponent($$result, "Lock", $$Lock, { "size": 14, "data-astro-cid-rxvxkuhm": true })}</span></div>`), renderComponent($$result, "Target", $$Target, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), [...milestones].sort((a, b) => a.day - b.day).map((m) => renderTemplate`<div class="tl-item" data-astro-cid-rxvxkuhm> <div${addAttribute(`tl-dot${m.done ? " on" : ""}`, "class")} data-astro-cid-rxvxkuhm>${m.done ? "\u2713" : "\xB7"}</div> <div${addAttribute(`tl-body${m.done ? " on" : ""}`, "class")} data-astro-cid-rxvxkuhm> <div class="tl-label" data-astro-cid-rxvxkuhm>${m.icon} ${m.label}</div> ${m.day > 0 && renderTemplate`<div class="tl-day" data-astro-cid-rxvxkuhm>Day ${m.day}</div>`} </div> </div>`), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), weightLogs.length > 0 ? renderTemplate`<div style="display:flex;flex-direction:column;gap:.4rem;max-height:280px;overflow-y:auto;" data-astro-cid-rxvxkuhm> ${weightLogs.slice(0, 10).map((log) => renderTemplate`<div style="display:flex;align-items:center;justify-content:space-between;padding:.625rem .875rem;background:var(--surface);border:1px solid var(--border);border-radius:10px;" data-astro-cid-rxvxkuhm> <div data-astro-cid-rxvxkuhm><div style="font-weight:700;font-size:.82rem;" data-astro-cid-rxvxkuhm>${formatWeight(log.weight, units)}</div><div style="font-size:.7rem;color:var(--soft);" data-astro-cid-rxvxkuhm>${new Date(log.logged_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div></div> ${log.notes && renderTemplate`<div style="font-size:.7rem;color:var(--muted);max-width:110px;text-align:right;" data-astro-cid-rxvxkuhm>${log.notes}</div>`} </div>`)} </div>` : renderTemplate`<p style="color:var(--soft);font-size:.82rem;text-align:center;padding:1.5rem 0;" data-astro-cid-rxvxkuhm>No entries yet</p>`, renderComponent($$result, "BarChart3", $$BarChart3, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), [{ lbl: "Days Completed", val: `${totalDaysCompleted}/30` }, { lbl: "Start Weight", val: formatWeight(startWeight, units) }, { lbl: "Current Weight", val: displayWeight }, { lbl: "Target Weight", val: displayTargetWeight }, { lbl: "Progress", val: `${progressPercent.toFixed(0)}%` }].map((s) => renderTemplate`<div style="display:flex;justify-content:space-between;align-items:center;padding:.55rem .875rem;background:var(--surface);border-radius:10px;" data-astro-cid-rxvxkuhm> <span style="font-size:.8rem;color:var(--soft);" data-astro-cid-rxvxkuhm>${s.lbl}</span> <span style="font-size:.85rem;font-weight:800;" data-astro-cid-rxvxkuhm>${s.val}</span> </div>`), renderComponent($$result, "User", $$User, { "size": 15, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), addAttribute(profile.full_name, "value"), addAttribute(profile.age || "", "value"), addAttribute(profile.gender === "male", "selected"), addAttribute(profile.gender === "female", "selected"), addAttribute(profile.gender === "other", "selected"), addAttribute(profile.goal === "lose_weight", "selected"), addAttribute(profile.goal === "maintain", "selected"), addAttribute(profile.goal === "gain_muscle", "selected"), wLabel, addAttribute(weightInputVal, "value"), wLabel, addAttribute(targetInputVal, "value"), units === "imperial" ? renderTemplate`<div class="fgrid" data-astro-cid-rxvxkuhm> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Height (ft)</label><input type="number" name="height_ft"${addAttribute(heightFtVal, "value")} min="3" max="8" class="fi" data-astro-cid-rxvxkuhm></div> <div class="fg" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Height (in)</label><input type="number" name="height_in"${addAttribute(heightInVal, "value")} min="0" max="11" class="fi" data-astro-cid-rxvxkuhm></div> </div>` : renderTemplate`<div class="fg" style="margin-bottom:1rem;" data-astro-cid-rxvxkuhm><label data-astro-cid-rxvxkuhm>Height (cm)</label><input type="number" name="height_cm"${addAttribute(profile.height_cm || "", "value")} class="fi" data-astro-cid-rxvxkuhm></div>`, addAttribute(profile.activity_level === "sedentary", "selected"), addAttribute(profile.activity_level === "light", "selected"), addAttribute(profile.activity_level === "moderate", "selected"), addAttribute(profile.activity_level === "active", "selected"), addAttribute(profile.activity_level === "very_active", "selected"), renderComponent($$result, "Target", $$Target, { "size": 15, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Zap", $$Zap, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), addAttribute(mgCal, "value"), addAttribute(mgProt, "value"), addAttribute(mgFat, "value"), addAttribute(mgCarb, "value"), [
    { lbl: "Strict Keto (20g)", cal: 1700, p: 110, f: 120, c: 20 },
    { lbl: "Standard (25g)", cal: 1900, p: 130, f: 135, c: 25 },
    { lbl: "Liberal (50g)", cal: 2100, p: 140, f: 140, c: 50 }
  ].map((preset) => renderTemplate`<button type="button" class="macro-preset"${addAttribute(preset.cal, "data-cal")}${addAttribute(preset.p, "data-p")}${addAttribute(preset.f, "data-f")}${addAttribute(preset.c, "data-c")} style="padding:.3rem .7rem;font-size:.7rem;font-weight:700;border:1px solid var(--border);background:var(--surface);color:var(--soft);border-radius:7px;cursor:pointer;transition:all .15s;" data-astro-cid-rxvxkuhm>${preset.lbl}</button>`), renderComponent($$result, "User", $$User, { "size": 15, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), profile.avatar_url?.startsWith("emoji:") ? profile.avatar_url.replace("emoji:", "") : profile.avatar_url ? renderTemplate`<img${addAttribute(profile.avatar_url, "src")} style="width:100%;height:100%;object-fit:cover;" data-astro-cid-rxvxkuhm>` : avatarLetter, ["\u{1F464}", "\u{1F60A}", "\u{1F60E}", "\u{1F920}", "\u{1F468}", "\u{1F469}", "\u{1F9D4}", "\u{1F471}", "\u{1F9B8}", "\u{1F9D9}", "\u{1F916}", "\u{1F47E}", "\u{1F63A}", "\u{1F98A}", "\u{1F43A}", "\u{1F981}"].map((e) => renderTemplate`<button type="button"${addAttribute(e, "data-emoji")} class="epick" style="font-size:1.3rem;padding:.3rem;border:1.5px solid var(--border);background:var(--surface);border-radius:7px;cursor:pointer;transition:all .15s;" data-astro-cid-rxvxkuhm>${e}</button>`), renderComponent($$result, "Zap", $$Zap, { "size": 15, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Utensils", $$Utensils, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "ShoppingCart", $$ShoppingCart, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "Zap", $$Zap, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), renderComponent($$result, "LogOut", $$LogOut, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-rxvxkuhm": true }), wLabel, addAttribute(units === "imperial" ? "e.g. 165" : "e.g. 75", "placeholder"), addAttribute((/* @__PURE__ */ new Date()).toISOString().split("T")[0], "value"), addAttribute((/* @__PURE__ */ new Date()).toISOString().split("T")[0], "max"), defineScriptVars({ chartDataJson, xpDataJson, completionDataJson, weightChartLabel, currentUnits: units, ketoScore, profileWeightKg: profile.weight_kg || 0, profileHeightCm: profile.height_cm || 0, profileAge: profile.age || 0, profileGender: profile.gender || "male", profileActivity: profile.activity_level || "sedentary" }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/profile.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/profile.astro";
const $$url = "/dashboard/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Profile,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
