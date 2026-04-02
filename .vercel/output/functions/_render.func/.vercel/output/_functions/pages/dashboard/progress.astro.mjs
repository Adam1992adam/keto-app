/* empty css                                          */
import { c as createComponent, d as renderTemplate, g as addAttribute, f as defineScriptVars, r as renderComponent, F as Fragment, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, e as getMaxJourneyDays, s as supabase, l as getAchievements, m as kgToLbs, n as cmToInches } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Progress = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Progress;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const journey = await getUserJourney(user.id);
  if (!journey) return Astro2.redirect("/dashboard");
  const currentDay = journey.current_day || 1;
  const totalXP = journey.total_xp || 0;
  const xpLevel = journey.level || 1;
  const streakDays = journey.streak_days || 0;
  const longestStreak = journey.longest_streak || 0;
  const perfectDays = journey.perfect_days || 0;
  const maxDays = getMaxJourneyDays(planType);
  const xpInLevel = totalXP % 500;
  const xpPct = Math.round(xpInLevel / 500 * 100);
  const journeyPct = Math.min(100, Math.round(currentDay / maxDays * 100));
  const userName = profile.full_name?.split(" ")[0] || "there";
  const units = profile.preferred_units || "imperial";
  const wUnit = units === "imperial" ? "lbs" : "kg";
  const mUnit = units === "imperial" ? "in" : "cm";
  const toW = (kg) => units === "imperial" ? kgToLbs(kg) : Math.round(kg * 10) / 10;
  const toM = (cm) => units === "imperial" ? cmToInches(cm) : Math.round(cm * 10) / 10;
  const { data: weightLogs } = await supabase.from("weight_logs").select("weight, logged_date").eq("user_id", user.id).order("logged_date", { ascending: true }).limit(30);
  const { data: onboarding } = await supabase.from("onboarding_data").select("*").eq("user_id", user.id).single();
  const startWeight = onboarding?.current_weight || profile.weight_kg || 0;
  const targetWeight = onboarding?.target_weight || profile.target_weight_kg || 0;
  const latestWeight = weightLogs?.[weightLogs.length - 1]?.weight || startWeight;
  const weightLost = Math.max(0, startWeight - latestWeight);
  const weightGoalPct = targetWeight && startWeight > targetWeight ? Math.min(100, Math.round(weightLost / (startWeight - targetWeight) * 100)) : 0;
  const { data: checkins } = await supabase.from("daily_checkins").select("checkin_date, energy_level, followed_meals, water_glasses, mood_level, sleep_hours, sleep_quality").eq("user_id", user.id).order("checkin_date", { ascending: false }).limit(14);
  const { data: xpTxns } = await supabase.from("xp_transactions").select("action_type, xp_amount, description, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
  const { data: completedTasksData } = await supabase.from("daily_tasks").select("id").eq("user_id", user.id).eq("completed", true);
  const totalCompletedTasks = completedTasksData?.length || 0;
  const avgEnergy = checkins?.length ? (checkins.reduce((s, c) => s + (c.energy_level || 3), 0) / checkins.length).toFixed(1) : "\u2014";
  const mealAdherence = checkins?.length ? Math.round(checkins.filter((c) => c.followed_meals).length / checkins.length * 100) : 0;
  const avgWater = checkins?.length ? (checkins.reduce((s, c) => s + (c.water_glasses || 0), 0) / checkins.length).toFixed(1) : "\u2014";
  const bcWeight = latestWeight || profile.weight_kg || 0;
  const bcHeight = profile.height_cm || 0;
  const bcAge = profile.age || 0;
  const bcGender = profile.gender || "male";
  const bcBMI = bcWeight && bcHeight ? Math.round(bcWeight / Math.pow(bcHeight / 100, 2) * 10) / 10 : null;
  const bcBMIcat = !bcBMI ? null : bcBMI < 18.5 ? { label: "Underweight", color: "#3b82f6"} : bcBMI < 25 ? { label: "Healthy", color: "#10b981"} : bcBMI < 30 ? { label: "Overweight", color: "#f59e0b"} : { label: "Obese", color: "#ef4444"};
  const bcBodyFat = bcBMI && bcAge ? Math.round((1.2 * bcBMI + 0.23 * bcAge - 10.8 * (bcGender === "male" ? 1 : 0) - 5.4) * 10) / 10 : null;
  const bcHealthyMin = bcHeight ? Math.round(18.5 * Math.pow(bcHeight / 100, 2) * 10) / 10 : null;
  const bcHealthyMax = bcHeight ? Math.round(24.9 * Math.pow(bcHeight / 100, 2) * 10) / 10 : null;
  const bcKgToHealthy = bcWeight && bcHealthyMax && bcWeight > bcHealthyMax ? Math.round((bcWeight - bcHealthyMax) * 10) / 10 : 0;
  const bcGaugePct = bcBMI ? Math.min(100, Math.max(0, (bcBMI - 15) / 25 * 100)) : 0;
  const { data: ketoneLogs } = await supabase.from("ketone_logs").select("id, ketone_mmol, measurement_type, logged_date, notes").eq("user_id", user.id).order("logged_date", { ascending: false }).limit(14);
  const latestKetone = ketoneLogs?.[0] ?? null;
  const ketoneStatus = !latestKetone ? null : latestKetone.ketone_mmol < 0.5 ? { label: "Not in ketosis", color: "#ef4444", tip: "Keep carbs under 20g net to enter ketosis." } : latestKetone.ketone_mmol < 1.5 ? { label: "Light ketosis", color: "#f59e0b", tip: "You're in ketosis! Aim for 1.5\u20133.0 mmol/L for optimal fat burning." } : latestKetone.ketone_mmol < 3 ? { label: "Optimal ketosis \u{1F525}", color: "#10b981", tip: "Optimal range! This is where fat burning peaks." } : latestKetone.ketone_mmol < 5 ? { label: "Deep ketosis", color: "#8b5cf6", tip: "Deep ketosis \u2014 great for therapeutic or athletic use." } : { label: "Very high \u2014 check health", color: "#ef4444", tip: "Levels above 5 mmol/L should be discussed with a doctor." };
  const wMinRaw = weightLogs?.length ? Math.min(...weightLogs.map((w) => w.weight)) : 0;
  const wMaxRaw = weightLogs?.length ? Math.max(...weightLogs.map((w) => w.weight)) : 0;
  const wRange = wMaxRaw - wMinRaw || 1;
  const wPad = wRange * 0.12;
  const wLow = Math.max(0, wMinRaw - wPad);
  const wHigh = wMaxRaw + wPad;
  const wSpan = wHigh - wLow || 1;
  const SVG_W = 560;
  const SVG_H = 160;
  const SVG_PL = 48;
  const SVG_PR = 12;
  const SVG_PT = 14;
  const SVG_PB = 32;
  const wChartPts = (weightLogs || []).map((w, i) => ({
    weight: w.weight,
    date: new Date(w.logged_date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    rawDate: w.logged_date,
    x: weightLogs.length > 1 ? SVG_PL + Math.round(i / (weightLogs.length - 1) * (SVG_W - SVG_PL - SVG_PR)) : SVG_PL + Math.round((SVG_W - SVG_PL - SVG_PR) / 2),
    y: SVG_PT + Math.round((wHigh - w.weight) / wSpan * (SVG_H - SVG_PT - SVG_PB)),
    isLatest: i === (weightLogs || []).length - 1
  }));
  const buildBezierPath = (pts) => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    const d = [`M ${pts[0].x} ${pts[0].y}`];
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const cpx = Math.round((prev.x + cur.x) / 2);
      d.push(`C ${cpx} ${prev.y} ${cpx} ${cur.y} ${cur.x} ${cur.y}`);
    }
    return d.join(" ");
  };
  const wLinePath = buildBezierPath(wChartPts);
  const buildFillPath = (pts, svgH, svgPB) => {
    if (!pts || pts.length === 0) return "";
    const bottom = svgH - svgPB + 2;
    const line = buildBezierPath(pts);
    return `${line} L ${pts[pts.length - 1].x} ${bottom} L ${pts[0].x} ${bottom} Z`;
  };
  const wFillPath = buildFillPath(wChartPts, SVG_H, SVG_PB);
  const wTickCount = 5;
  const wTicks = Array.from({ length: wTickCount }, (_, i) => {
    const val = wLow + wSpan * i / (wTickCount - 1);
    const y = SVG_PT + Math.round(i / (wTickCount - 1) * (SVG_H - SVG_PT - SVG_PB));
    return { val: Math.round(val * 10) / 10, y };
  }).reverse();
  const wDateLabels = wChartPts.length > 1 ? [wChartPts[0], wChartPts[Math.floor((wChartPts.length - 1) / 2)], wChartPts[wChartPts.length - 1]] : wChartPts.slice(0, 1);
  journey.start_date ? Math.max(1, Math.floor((Date.now() - new Date(journey.start_date).getTime()) / 864e5) + 1) : currentDay;
  checkins?.length ? (await supabase.from("daily_checkins").select("id", { count: "exact", head: true }).eq("user_id", user.id)).count || checkins.length : 0;
  const dispWeight = latestWeight ? toW(latestWeight) : null;
  const dispStartWeight = startWeight ? toW(startWeight) : null;
  const dispTargetWeight = targetWeight ? toW(targetWeight) : null;
  const dispWeightLost = weightLost ? toW(weightLost) : 0;
  const dispHealthyMin = bcHealthyMin ? toW(bcHealthyMin) : null;
  const dispHealthyMax = bcHealthyMax ? toW(bcHealthyMax) : null;
  const dispToHealthy = bcKgToHealthy ? toW(bcKgToHealthy) : 0;
  const wTicksLbs = wTicks.map((t) => ({ ...t, valLbs: toW(t.val) }));
  const wChartPtsLbs = wChartPts.map((p) => ({ ...p, weightLbs: toW(p.weight) }));
  (weightLogs || []).map((w) => ({
    weight: w.weight,
    date: new Date(w.logged_date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    height: Math.max(8, Math.round((w.weight - wMinRaw) / wRange * 80 + 10)),
    isLatest: w.logged_date === weightLogs?.[weightLogs.length - 1]?.logged_date
  }));
  const energyChart = (checkins || []).slice(0, 7).reverse().map((c) => ({
    day: new Date(c.checkin_date).toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
    energy: c.energy_level || 0,
    pct: Math.round((c.energy_level || 0) / 5 * 100),
    water: c.water_glasses || 0,
    meals: c.followed_meals
  }));
  const sleepChart = (checkins || []).slice(0, 7).reverse().filter((c) => c.sleep_hours != null).map((c) => ({
    day: new Date(c.checkin_date).toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
    hours: c.sleep_hours || 0,
    quality: c.sleep_quality || 0,
    pct: Math.round((c.sleep_hours || 0) / 9 * 100),
    color: (c.sleep_hours || 0) >= 7 ? "#10b981" : (c.sleep_hours || 0) >= 5 ? "#f59e0b" : "#ef4444"
  }));
  const avgSleepHours = sleepChart.length ? (sleepChart.reduce((s, c) => s + c.hours, 0) / sleepChart.length).toFixed(1) : null;
  const { data: macroGoals } = await supabase.from("macro_goals").select("daily_calories, protein_g, fat_g, carbs_g").eq("user_id", user.id).maybeSingle();
  const fourteenAgo = new Date(Date.now() - 13 * 864e5).toISOString().split("T")[0];
  const { data: foodLogTrend } = await supabase.from("food_logs").select("logged_date, calories, protein_g, fat_g, carbs_g").eq("user_id", user.id).gte("logged_date", fourteenAgo).order("logged_date", { ascending: true });
  const macroByDay = {};
  for (const f of foodLogTrend || []) {
    const d = f.logged_date;
    if (!macroByDay[d]) macroByDay[d] = { cal: 0, prot: 0, fat: 0, carb: 0 };
    macroByDay[d].cal += f.calories || 0;
    macroByDay[d].prot += parseFloat(f.protein_g || 0);
    macroByDay[d].fat += parseFloat(f.fat_g || 0);
    macroByDay[d].carb += parseFloat(f.carbs_g || 0);
  }
  const macroTrend = Array.from({ length: 14 }, (_, i) => {
    const dd = new Date(Date.now() - (13 - i) * 864e5).toISOString().split("T")[0];
    const m = macroByDay[dd] || { cal: 0, prot: 0, fat: 0, carb: 0 };
    return {
      date: dd,
      day: (/* @__PURE__ */ new Date(dd + "T12:00:00")).toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
      cal: Math.round(m.cal),
      prot: Math.round(m.prot),
      fat: Math.round(m.fat),
      carb: Math.round(m.carb),
      hasData: m.cal > 0
    };
  });
  const macroGoalCal = macroGoals?.daily_calories || 1800;
  const maxTrendCal = Math.max(...macroTrend.map((d) => d.cal), macroGoalCal, 1);
  const waterHistory = (checkins || []).slice(0, 14).reverse().map((c) => ({
    day: (/* @__PURE__ */ new Date(c.checkin_date + "T12:00:00")).toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
    glasses: c.water_glasses || 0,
    pct: Math.min(100, Math.round((c.water_glasses || 0) / 8 * 100)),
    met: (c.water_glasses || 0) >= 8
  }));
  const avgWaterAll = waterHistory.length ? (waterHistory.reduce((s, d) => s + d.glasses, 0) / waterHistory.length).toFixed(1) : null;
  const goalMetDays = waterHistory.filter((d) => d.met).length;
  const ketoneTrendBars = (ketoneLogs || []).slice(0, 7).reverse().map((k) => ({
    pct: Math.min(100, Math.round(k.ketone_mmol / 5 * 100)),
    color: k.ketone_mmol < 0.5 ? "#ef4444" : k.ketone_mmol < 1.5 ? "#f59e0b" : k.ketone_mmol < 3 ? "#10b981" : "#8b5cf6",
    label: (/* @__PURE__ */ new Date(k.logged_date + "T12:00:00")).toLocaleDateString("en", { month: "short", day: "numeric" }),
    val: k.ketone_mmol
  }));
  const milestones = [
    { day: 1, icon: "\u{1F680}", label: "Journey Started", done: currentDay >= 1 },
    { day: 3, icon: "\u{1F4A7}", label: "3 Days Strong", done: currentDay >= 3 },
    { day: 7, icon: "\u{1F525}", label: "First Week Complete", done: currentDay >= 7 },
    { day: 10, icon: "\u26A1", label: "Keto Adapted", done: currentDay >= 10 },
    { day: 14, icon: "\u{1F3C5}", label: "2 Weeks Champion", done: currentDay >= 14 },
    { day: 21, icon: "\u{1F4AA}", label: "21-Day Habit Formed", done: currentDay >= 21 },
    { day: 30, icon: "\u{1F3C6}", label: "30-Day Hero", done: currentDay >= 30 }
  ];
  const planLabel = tierLabel;
  const achievements = await getAchievements(user.id);
  const { data: measurements } = await supabase.from("body_measurements").select("logged_date, neck_cm, waist_cm, hips_cm, chest_cm, arm_cm, thigh_cm").eq("user_id", user.id).order("logged_date", { ascending: false }).limit(2);
  const latestMeasurements = measurements?.[0] || null;
  const prevMeasurements = measurements?.[1] || null;
  const ninetyDaysAgo = new Date(Date.now() - 89 * 864e5).toISOString().split("T")[0];
  const { data: checkin90 } = await supabase.from("daily_checkins").select("checkin_date, energy_level").eq("user_id", user.id).gte("checkin_date", ninetyDaysAgo).order("checkin_date", { ascending: true });
  const checkinMap = {};
  for (const c of checkin90 || []) {
    checkinMap[c.checkin_date] = c.energy_level || 0;
  }
  const calStartRaw = /* @__PURE__ */ new Date(ninetyDaysAgo + "T12:00:00");
  const calStartDow = calStartRaw.getDay();
  const calGridStart = new Date(calStartRaw.getTime() - calStartDow * 864e5);
  const calDays = [];
  const calToday = /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toISOString().split("T")[0] + "T12:00:00");
  const calTodayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  calGridStart.toISOString().split("T")[0];
  const calTotalDays = Math.round((calToday - calGridStart) / 864e5) + 1;
  for (let i = 0; i < calTotalDays; i++) {
    const d = new Date(calGridStart.getTime() + i * 864e5);
    const ds = d.toISOString().split("T")[0];
    const isFuture = ds > calTodayStr;
    const energyVal = checkinMap[ds];
    const hasCheckin = ds in checkinMap;
    const colorClass = isFuture ? "cal-future" : !hasCheckin ? "cal-none" : energyVal >= 5 ? "cal-5" : energyVal >= 4 ? "cal-4" : energyVal === 3 ? "cal-3" : energyVal >= 1 ? "cal-12" : "cal-none";
    calDays.push({ date: ds, energy: energyVal || 0, colorClass, isFuture, hasCheckin });
  }
  const calMonthLabels = [];
  for (let i = 0; i < calDays.length; i++) {
    const ds = calDays[i].date;
    const dayOfMonth = parseInt(ds.split("-")[2], 10);
    if (dayOfMonth === 1 || i === 0) {
      const monthName = (/* @__PURE__ */ new Date(ds + "T12:00:00")).toLocaleDateString("en", { month: "short" });
      const colIndex = Math.floor(i / 7);
      if (!calMonthLabels.length || calMonthLabels[calMonthLabels.length - 1].col !== colIndex) {
        calMonthLabels.push({ month: monthName, col: colIndex });
      }
    }
  }
  const calNumCols = Math.ceil(calDays.length / 7);
  const goalStartWeight = onboarding?.current_weight || weightLogs?.[0]?.weight || profile.weight_kg || 0;
  const goalWeight = onboarding?.target_weight || profile.target_weight_kg || 0;
  const goalCurrentWeight = weightLogs?.[weightLogs?.length - 1]?.weight || goalStartWeight;
  const goalTotalToLose = goalStartWeight - goalWeight;
  const goalLost = goalStartWeight - goalCurrentWeight;
  const goalPctDone = goalTotalToLose !== 0 ? Math.min(100, Math.max(0, Math.round(goalLost / goalTotalToLose * 100))) : 0;
  const goalKgToGo = Math.max(0, Math.round(Math.abs(goalCurrentWeight - goalWeight) * 10) / 10);
  const goalLostAbs = Math.round(Math.abs(goalLost) * 10) / 10;
  const goalMs25Weight = toW(Math.round((goalStartWeight - goalTotalToLose * 0.25) * 10) / 10);
  const goalMs50Weight = toW(Math.round((goalStartWeight - goalTotalToLose * 0.5) * 10) / 10);
  const goalMs75Weight = toW(Math.round((goalStartWeight - goalTotalToLose * 0.75) * 10) / 10);
  const goalMs100Weight = toW(Math.round(goalWeight * 10) / 10);
  const goalKgToGoLbs = toW(goalKgToGo);
  const goalLostAbsLbs = toW(goalLostAbs);
  const goalStartLbs = toW(goalStartWeight);
  const goalWeightLbs = toW(goalWeight);
  const goalMs25Done = goalPctDone >= 25;
  const goalMs50Done = goalPctDone >= 50;
  const goalMs75Done = goalPctDone >= 75;
  const goalMs100Done = goalPctDone >= 100;
  const goalBarColor = goalPctDone >= 75 ? "linear-gradient(90deg,#ef4444,#f59e0b,#10b981)" : goalPctDone >= 50 ? "linear-gradient(90deg,#ef4444,#f59e0b,#34d399)" : goalPctDone >= 25 ? "linear-gradient(90deg,#ef4444,#f59e0b)" : "linear-gradient(90deg,#ef4444,#f87171)";
  const goalHasTarget = goalWeight > 0 && goalStartWeight > 0 && goalTotalToLose !== 0;
  const achievementsDisplay = achievements.map((a) => ({
    icon: a.icon || "\u{1F3C5}",
    name: a.achievement_name || a.name || "",
    desc: a.description || a.desc || "",
    earnedDate: a.earned_at || a.created_at || "",
    isGreen: a.type === "streak" || a.type === "journey" || a.type === "compliance"
  }));
  const { data: progressPhotos } = await supabase.from("progress_photos").select("id, photo_data, taken_date, notes").eq("user_id", user.id).order("taken_date", { ascending: false }).limit(4);
  const initialPhotos = progressPhotos || [];
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-efqp3qre> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>My Progress \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, '</head> <body data-astro-cid-efqp3qre> <div class="bg-wrap" data-astro-cid-efqp3qre><div class="orb o1" data-astro-cid-efqp3qre></div><div class="orb o2" data-astro-cid-efqp3qre></div><div class="orb o3" data-astro-cid-efqp3qre></div></div> ', ' <div id="calTip" class="cal-tip" data-astro-cid-efqp3qre></div> <div class="page" data-astro-cid-efqp3qre> <!-- HEADER --> <div class="pg-header" data-astro-cid-efqp3qre> <div class="pg-eyebrow" data-astro-cid-efqp3qre>\u{1F4C8} Progress Tracker</div> <h1 class="pg-title" data-astro-cid-efqp3qre>Your Journey, <em data-astro-cid-efqp3qre>', '</em></h1> <p class="pg-sub" data-astro-cid-efqp3qre>Day ', " of 30 \xB7 ", ' \xB7 Tracking your transformation in real time</p> </div> <!-- HERO STATS --> <div class="hero-stats" data-astro-cid-efqp3qre> <div class="hstat g" style="animation-delay:.04s;" data-astro-cid-efqp3qre> <div class="hstat-icon" data-astro-cid-efqp3qre>\u2696\uFE0F</div> <div class="hstat-val" style="color:var(--green);" data-astro-cid-efqp3qre>', '</div> <div class="hstat-lbl" data-astro-cid-efqp3qre>', ' Lost</div> <div class="hstat-sub" style="background:rgba(16,185,129,.1);color:var(--green);" data-astro-cid-efqp3qre>', '% of goal</div> </div> <div class="hstat gold" style="animation-delay:.08s;" data-astro-cid-efqp3qre> <div class="hstat-icon" data-astro-cid-efqp3qre>\u{1F525}</div> <div class="hstat-val" style="color:var(--gold);" data-astro-cid-efqp3qre>', '</div> <div class="hstat-lbl" data-astro-cid-efqp3qre>Day Streak</div> <div class="hstat-sub" style="background:rgba(245,158,11,.1);color:var(--gold);" data-astro-cid-efqp3qre>Best: ', 'd</div> </div> <div class="hstat blue" style="animation-delay:.12s;" data-astro-cid-efqp3qre> <div class="hstat-icon" data-astro-cid-efqp3qre>\u2B50</div> <div class="hstat-val" style="color:var(--purple);" data-astro-cid-efqp3qre>Lv.', '</div> <div class="hstat-lbl" data-astro-cid-efqp3qre>', ' XP</div> <div class="hstat-sub" style="background:rgba(139,92,246,.1);color:var(--purple);" data-astro-cid-efqp3qre>', '/500 to next</div> </div> <div class="hstat purple" style="animation-delay:.16s;" data-astro-cid-efqp3qre> <div class="hstat-icon" data-astro-cid-efqp3qre>\u2705</div> <div class="hstat-val" style="color:var(--cyan);" data-astro-cid-efqp3qre>', '</div> <div class="hstat-lbl" data-astro-cid-efqp3qre>Tasks Done</div> <div class="hstat-sub" style="background:rgba(6,182,212,.1);color:var(--cyan);" data-astro-cid-efqp3qre>', " perfect days</div> </div> </div> <!-- GOAL WEIGHT MILESTONE TIMELINE --> ", ' <!-- MAIN GRID --> <div class="grid2" data-astro-cid-efqp3qre> <!-- LEFT --> <div style="display:flex;flex-direction:column;gap:1.25rem;" data-astro-cid-efqp3qre> <!-- JOURNEY PROGRESS --> <div class="card" style="animation-delay:.05s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 10px rgba(16,185,129,.2);" data-astro-cid-efqp3qre>\u{1F4C5}</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Journey Progress</div><div class="ch-sub" data-astro-cid-efqp3qre>Day ', ' of 30</div></div> </div> <div class="cb" data-astro-cid-efqp3qre> <div class="prog" data-astro-cid-efqp3qre> <div class="prog-hd" data-astro-cid-efqp3qre> <span class="prog-lbl" data-astro-cid-efqp3qre>30-Day Plan</span> <span class="prog-val" style="color:var(--green);" data-astro-cid-efqp3qre>', '% complete</span> </div> <div class="prog-trk" data-astro-cid-efqp3qre> <div class="prog-fill"', ' data-astro-cid-efqp3qre></div> </div> </div> <div class="prog" data-astro-cid-efqp3qre> <div class="prog-hd" data-astro-cid-efqp3qre> <span class="prog-lbl" data-astro-cid-efqp3qre>Level ', " \u2192 ", '</span> <span class="prog-val" style="color:var(--purple);" data-astro-cid-efqp3qre>', '%</span> </div> <div class="prog-trk" data-astro-cid-efqp3qre> <div class="prog-fill"', " data-astro-cid-efqp3qre></div> </div> </div> ", ' </div> </div> <!-- WEIGHT CHART --> <div class="card" style="animation-delay:.1s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 4px 10px rgba(59,130,246,.2);" data-astro-cid-efqp3qre>\u2696\uFE0F</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Weight History</div><div class="ch-sub" data-astro-cid-efqp3qre>', ' measurements logged</div></div> <button id="openWeightModal" style="font-size:.72rem;font-weight:800;color:var(--green);background:none;border:none;cursor:pointer;padding:0;" data-astro-cid-efqp3qre>+ Log weight</button> </div> <div class="cb" data-astro-cid-efqp3qre> ', ' </div> </div> <!-- ACTIVITY HEATMAP CALENDAR --> <div class="card" style="animation-delay:.12s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 10px rgba(16,185,129,.2);" data-astro-cid-efqp3qre>\u{1F4C6}</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Activity Calendar</div><div class="ch-sub" data-astro-cid-efqp3qre>90-day check-in history</div></div> <div style="font-size:.72rem;font-weight:800;color:var(--green);" data-astro-cid-efqp3qre>', ' days logged</div> </div> <div class="cb" data-astro-cid-efqp3qre> <div class="cal-wrap" data-astro-cid-efqp3qre> <div class="cal-grid-area" data-astro-cid-efqp3qre> <!-- Month label row --> <div class="cal-month-row" data-astro-cid-efqp3qre> ', ' </div> <!-- Columns (each col = one week, rows = days Sun\u2013Sat) --> <div class="cal-cols" data-astro-cid-efqp3qre> ', ' </div> </div> </div> <!-- Legend --> <div class="cal-legend" data-astro-cid-efqp3qre> <span class="cal-legend-sq cal-none" data-astro-cid-efqp3qre></span><span class="cal-legend-lbl" data-astro-cid-efqp3qre>None</span> <span class="cal-legend-sq cal-12" data-astro-cid-efqp3qre></span><span class="cal-legend-lbl" data-astro-cid-efqp3qre>Low (1\u20132)</span> <span class="cal-legend-sq cal-3" data-astro-cid-efqp3qre></span><span class="cal-legend-lbl" data-astro-cid-efqp3qre>OK (3)</span> <span class="cal-legend-sq cal-4" data-astro-cid-efqp3qre></span><span class="cal-legend-lbl" data-astro-cid-efqp3qre>Good (4)</span> <span class="cal-legend-sq cal-5" data-astro-cid-efqp3qre></span><span class="cal-legend-lbl" data-astro-cid-efqp3qre>Great (5)</span> </div> </div> </div> <!-- ENERGY / COMPLIANCE CHART --> ', ' <!-- SLEEP TREND --> <div class="card" style="animation-delay:.18s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#6366f1,#4f46e5);box-shadow:0 4px 10px rgba(99,102,241,.2);" data-astro-cid-efqp3qre>\u{1F319}</div> <div data-astro-cid-efqp3qre> <div class="ch-title" data-astro-cid-efqp3qre>Sleep Trend</div> <div class="ch-sub" data-astro-cid-efqp3qre>', "</div> </div> ", " </div> ", " </div> <!-- MACRO TREND (14 days) --> ", ' </div> <!-- RIGHT --> <div style="display:flex;flex-direction:column;gap:1.25rem;" data-astro-cid-efqp3qre> <!-- RINGS --> <div class="card" style="animation-delay:.08s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 4px 10px rgba(139,92,246,.2);" data-astro-cid-efqp3qre>\u{1F3AF}</div> <div class="ch-tt" data-astro-cid-efqp3qre>Goal Rings</div> </div> <div class="cb" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" data-astro-cid-efqp3qre> ', " </div> </div> <!-- WATER HISTORY --> ", ' <!-- MILESTONES --> <div class="card" style="animation-delay:.12s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.2);" data-astro-cid-efqp3qre>\u{1F3C6}</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Milestones</div><div class="ch-sub" data-astro-cid-efqp3qre>', "/", ' achieved</div></div> </div> <div class="cb" data-astro-cid-efqp3qre> <div class="milestones" data-astro-cid-efqp3qre> ', " </div> </div> </div> <!-- XP HISTORY --> ", ' </div> </div> <!-- BODY MEASUREMENTS --> <div class="card" style="animation-delay:.2s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#f97316,#ea580c);box-shadow:0 4px 10px rgba(249,115,22,.2);" data-astro-cid-efqp3qre>\u{1F4CF}</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Body Measurements</div><div class="ch-sub" data-astro-cid-efqp3qre>', '</div></div> <button id="openMeasModal" style="font-size:.72rem;font-weight:800;color:var(--green);background:none;border:none;cursor:pointer;padding:0;" data-astro-cid-efqp3qre>+ Log</button> </div> <div class="cb" data-astro-cid-efqp3qre> ', ' </div> </div> <!-- KETONE TRACKER --> <div class="card" style="animation-delay:.28s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);box-shadow:0 4px 10px rgba(139,92,246,.2);" data-astro-cid-efqp3qre>\u{1FA78}</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Ketone Tracker</div><div class="ch-sub" data-astro-cid-efqp3qre>', '</div></div> <button id="openKetoneModal" style="font-size:.72rem;font-weight:800;color:var(--purple2);background:none;border:none;cursor:pointer;padding:0;" data-astro-cid-efqp3qre>+ Log</button> </div> <div class="cb" data-astro-cid-efqp3qre> ', " ", " ", ' <!-- Ketone scale legend --> <div style="margin-top:1rem;display:flex;gap:.4rem;flex-wrap:wrap;" data-astro-cid-efqp3qre> ', " </div> </div> </div> <!-- BODY COMPOSITION --> ", " <!-- ACHIEVEMENTS --> ", ' <!-- PROGRESS PHOTOS --> <div class="card" style="animation-delay:.28s;margin-bottom:1.5rem;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#ec4899,#db2777);box-shadow:0 4px 10px rgba(236,72,153,.2);" data-astro-cid-efqp3qre>\u{1F4F8}</div> <div style="flex:1;" data-astro-cid-efqp3qre> <div class="ch-tt" data-astro-cid-efqp3qre>Progress Photos</div> <div class="ch-sub" id="photoCount" data-astro-cid-efqp3qre>', '</div> </div> <button id="openPhotoModal" style="padding:.4rem .9rem;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;border:none;border-radius:9px;font-size:.75rem;font-weight:800;cursor:pointer;" data-astro-cid-efqp3qre>+ Add Photo</button> </div> <div class="cb" data-astro-cid-efqp3qre> <div id="photoGrid" data-astro-cid-efqp3qre> ', ` </div> </div> </div> <!-- BOTTOM CTA --> <div style="background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(59,130,246,.07));border:1.5px solid rgba(16,185,129,.25);border-radius:20px;padding:2rem;text-align:center;animation:fadeUp .4s .3s ease both;" data-astro-cid-efqp3qre> <div style="font-size:2.5rem;margin-bottom:.75rem;" data-astro-cid-efqp3qre>\u{1F680}</div> <div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Keep Pushing, `, `!</div> <div style="font-size:.83rem;color:var(--soft);margin-bottom:1.25rem;line-height:1.6;" data-astro-cid-efqp3qre>You're on Day `, " of ", ". ", ` days left to complete your transformation.</div> <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;" data-astro-cid-efqp3qre> <a href="/dashboard/checkin" style="padding:.7rem 1.5rem;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;border-radius:12px;font-weight:800;font-size:.82rem;text-decoration:none;box-shadow:0 4px 14px rgba(16,185,129,.3);" data-astro-cid-efqp3qre>\u{1F4CB} Daily Check-in</a> <a href="/dashboard/recipes" style="padding:.7rem 1.5rem;background:var(--card);border:1px solid var(--border);color:var(--text);border-radius:12px;font-weight:800;font-size:.82rem;text-decoration:none;" data-astro-cid-efqp3qre>\u{1F373} View Recipes</a> <a href="/dashboard" style="padding:.7rem 1.5rem;background:var(--card);border:1px solid var(--border);color:var(--text);border-radius:12px;font-weight:800;font-size:.82rem;text-decoration:none;" data-astro-cid-efqp3qre>\u{1F3E0} Dashboard</a> </div> </div> </div> <!-- BODY MEASUREMENTS MODAL --> <div id="measModal" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:1rem;" data-astro-cid-efqp3qre> <div style="background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:1.75rem;width:100%;max-width:400px;max-height:90vh;overflow-y:auto;" data-astro-cid-efqp3qre> <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;" data-astro-cid-efqp3qre> <div id="measModalTitle" style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:900;" data-astro-cid-efqp3qre>\u{1F4CF} Log Measurements</div> <button id="closeMeasModal" style="background:none;border:none;color:var(--soft);font-size:1.4rem;cursor:pointer;line-height:1;" data-astro-cid-efqp3qre>\xD7</button> </div> <div id="measModalError" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:.6rem .9rem;font-size:.78rem;color:#ef4444;margin-bottom:1rem;" data-astro-cid-efqp3qre></div> <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.75rem;" data-astro-cid-efqp3qre> <div data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Waist (`, ')</label><input id="mWaist" type="number" step="0.1"', "", "", ' style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> <div data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Hips (', ')</label><input id="mHips" type="number" step="0.1"', "", "", ' style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> <div data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Chest (', ')</label><input id="mChest" type="number" step="0.1"', "", "", ' style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> <div data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Neck (', ')</label><input id="mNeck" type="number" step="0.1"', "", "", ' style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> <div data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Arm (', ')</label><input id="mArm" type="number" step="0.1"', "", "", ' style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> <div data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Thigh (', ')</label><input id="mThigh" type="number" step="0.1"', "", "", ` style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> </div> <div style="margin-bottom:.75rem;" data-astro-cid-efqp3qre><label style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Date</label><input id="mDate" type="date" style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-size:.88rem;box-sizing:border-box;" data-astro-cid-efqp3qre></div> <button id="saveMeasBtn" style="width:100%;padding:.85rem;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border:none;border-radius:12px;font-weight:800;font-size:.9rem;cursor:pointer;" data-astro-cid-efqp3qre>Save Measurements</button> </div> </div> <!-- WEIGHT LOG MODAL --> <div id="weightModal" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:1rem;" data-astro-cid-efqp3qre> <div style="background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:1.75rem;width:100%;max-width:360px;" data-astro-cid-efqp3qre> <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:900;" data-astro-cid-efqp3qre>\u2696\uFE0F Log Weight</div> <button id="closeWeightModal" style="background:none;border:none;color:var(--soft);font-size:1.4rem;cursor:pointer;line-height:1;" data-astro-cid-efqp3qre>\xD7</button> </div> <div id="weightModalError" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:.6rem .9rem;font-size:.78rem;color:#ef4444;margin-bottom:1rem;" data-astro-cid-efqp3qre></div> <div style="display:flex;flex-direction:column;gap:.9rem;" data-astro-cid-efqp3qre> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Weight (`, ')</label> <input id="weightInput" type="number" step="0.1"', "", "", ` style="width:100%;padding:.7rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.95rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;" data-astro-cid-efqp3qre> </div> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Date</label> <input id="weightDate" type="date" style="width:100%;padding:.7rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.95rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;" data-astro-cid-efqp3qre> </div> <button id="saveWeightBtn" style="width:100%;padding:.85rem;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;border:none;border-radius:12px;font-weight:800;font-size:.9rem;cursor:pointer;margin-top:.25rem;" data-astro-cid-efqp3qre>Save Weight</button> </div> </div> </div> <script>(function(){`, "\n(function() {\n  var modal    = document.getElementById('weightModal');\n  var errBox   = document.getElementById('weightModalError');\n  var weightIn = document.getElementById('weightInput');\n  var dateIn   = document.getElementById('weightDate');\n  var saveBtn  = document.getElementById('saveWeightBtn');\n  var isImperial = units === 'imperial';\n\n  // Set today as default date\n  var today = new Date().toISOString().split('T')[0];\n  if (dateIn) dateIn.value = today;\n\n  function openModal() {\n    modal.style.display = 'flex';\n    if (errBox) errBox.style.display = 'none';\n    if (weightIn) weightIn.focus();\n  }\n\n  var openBtn1 = document.getElementById('openWeightModal');\n  var openBtn2 = document.getElementById('openWeightModalEmpty');\n  var closeBtn = document.getElementById('closeWeightModal');\n\n  if (openBtn1) openBtn1.addEventListener('click', openModal);\n  if (openBtn2) openBtn2.addEventListener('click', openModal);\n  if (closeBtn) closeBtn.addEventListener('click', function() { modal.style.display = 'none'; });\n  modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });\n\n  if (saveBtn) saveBtn.addEventListener('click', function() {\n    var wVal = parseFloat(weightIn.value);\n    var minW = isImperial ? 66  : 30;\n    var maxW = isImperial ? 660 : 300;\n    if (!wVal || wVal < minW || wVal > maxW) {\n      errBox.textContent = isImperial\n        ? 'Please enter a valid weight between 66 and 660 lbs.'\n        : 'Please enter a valid weight between 30 and 300 kg.';\n      errBox.style.display = 'block';\n      return;\n    }\n    // Convert to kg for storage\n    var wKg = isImperial\n      ? Math.round((wVal / 2.20462) * 10) / 10\n      : Math.round(wVal * 10) / 10;\n    saveBtn.textContent = 'Saving\u2026';\n    saveBtn.disabled = true;\n    fetch('/api/profile/add-weight', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ weight: wKg, logged_date: dateIn.value || today }),\n    })\n    .then(function(r) { return r.json(); })\n    .then(function(data) {\n      if (data.success) {\n        modal.style.display = 'none';\n        window.location.reload();\n      } else {\n        errBox.textContent = data.error || 'Failed to save. Please try again.';\n        errBox.style.display = 'block';\n        saveBtn.textContent = 'Save Weight';\n        saveBtn.disabled = false;\n      }\n    })\n    .catch(function() {\n      errBox.textContent = 'Network error. Please try again.';\n      errBox.style.display = 'block';\n      saveBtn.textContent = 'Save Weight';\n      saveBtn.disabled = false;\n    });\n  });\n})();\n})();<\/script> <script>(function(){", `
(function() {
  var modal    = document.getElementById('measModal');
  var errBox   = document.getElementById('measModalError');
  var saveBtn  = document.getElementById('saveMeasBtn');
  var dateIn   = document.getElementById('mDate');
  var titleEl  = document.getElementById('measModalTitle');
  var today    = new Date().toISOString().split('T')[0];
  var isImperial = units === 'imperial';
  if (dateIn) dateIn.value = today;

  // Convert cm \u2192 display unit for pre-filling inputs
  function toDisplay(cm) {
    if (!cm) return '';
    var n = parseFloat(cm);
    if (isNaN(n)) return '';
    return isImperial ? Math.round((n / 2.54) * 10) / 10 : Math.round(n * 10) / 10;
  }

  function clearForm() {
    ['mWaist','mHips','mChest','mNeck','mArm','mThigh'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (dateIn) dateIn.value = today;
    if (titleEl) titleEl.textContent = '\u{1F4CF} Log Measurements';
  }

  function openModal() {
    clearForm();
    modal.style.display = 'flex';
    if (errBox) errBox.style.display = 'none';
  }

  window.editMeasurement = function(btn) {
    var d = btn.dataset;
    clearForm();
    if (dateIn) dateIn.value = d.date || today;
    var map = { mWaist: d.waist, mHips: d.hips, mChest: d.chest, mNeck: d.neck, mArm: d.arm, mThigh: d.thigh };
    Object.keys(map).forEach(function(id) {
      var el = document.getElementById(id);
      if (el && map[id]) el.value = toDisplay(map[id]);
    });
    if (titleEl) titleEl.textContent = '\u{1F4CF} Edit Measurements';
    modal.style.display = 'flex';
    if (errBox) errBox.style.display = 'none';
  };

  // Wire up Edit buttons (delegated)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-meas-btn')) {
      window.editMeasurement(e.target);
    }
  });

  var openBtn1 = document.getElementById('openMeasModal');
  var openBtn2 = document.getElementById('openMeasModalEmpty');
  var closeBtn = document.getElementById('closeMeasModal');
  if (openBtn1) openBtn1.addEventListener('click', openModal);
  if (openBtn2) openBtn2.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', function() { modal.style.display = 'none'; });
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });

  // Convert input \u2192 cm for storage
  function toCm(val) {
    if (!val) return null;
    var n = parseFloat(val);
    if (isNaN(n)) return null;
    return isImperial
      ? Math.round(n * 2.54 * 10) / 10
      : Math.round(n * 10) / 10;
  }

  if (saveBtn) saveBtn.addEventListener('click', function() {
    var payload = {
      logged_date: dateIn.value || today,
      waist_cm:  toCm(document.getElementById('mWaist').value),
      hips_cm:   toCm(document.getElementById('mHips').value),
      chest_cm:  toCm(document.getElementById('mChest').value),
      neck_cm:   toCm(document.getElementById('mNeck').value),
      arm_cm:    toCm(document.getElementById('mArm').value),
      thigh_cm:  toCm(document.getElementById('mThigh').value),
    };
    var hasValue = ['waist_cm','hips_cm','chest_cm','neck_cm','arm_cm','thigh_cm'].some(function(k) { return payload[k]; });
    if (!hasValue) {
      errBox.textContent = 'Please enter at least one measurement.';
      errBox.style.display = 'block';
      return;
    }
    saveBtn.textContent = 'Saving\u2026';
    saveBtn.disabled = true;
    fetch('/api/measurements/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        modal.style.display = 'none';
        window.location.reload();
      } else {
        errBox.textContent = data.error || 'Failed to save. Please try again.';
        errBox.style.display = 'block';
        saveBtn.textContent = 'Save Measurements';
        saveBtn.disabled = false;
      }
    })
    .catch(function() {
      errBox.textContent = 'Network error. Please try again.';
      errBox.style.display = 'block';
      saveBtn.textContent = 'Save Measurements';
      saveBtn.disabled = false;
    });
  });
})();
})();<\/script> <!-- KETONE MODAL --> <div id="ketoneModal" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:1rem;" data-astro-cid-efqp3qre> <div style="background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:1.75rem;width:100%;max-width:360px;" data-astro-cid-efqp3qre> <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.05rem;font-weight:900;" data-astro-cid-efqp3qre>\u{1FA78} Log Ketone Reading</div> <button id="closeKetoneModal" style="background:none;border:none;color:var(--soft);font-size:1.4rem;cursor:pointer;line-height:1;" data-astro-cid-efqp3qre>\xD7</button> </div> <div id="ketoneModalError" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:.6rem .9rem;font-size:.78rem;color:#ef4444;margin-bottom:1rem;" data-astro-cid-efqp3qre></div> <div style="display:flex;flex-direction:column;gap:.9rem;" data-astro-cid-efqp3qre> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Ketone Level (mmol/L)</label> <input id="ketoneValue" type="number" step="0.1" min="0" max="30" placeholder="e.g. 1.8" style="width:100%;padding:.7rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:1.1rem;font-weight:700;font-family:'DM Sans',sans-serif;box-sizing:border-box;" data-astro-cid-efqp3qre> </div> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Measurement Type</label> <div style="display:flex;gap:.5rem;" data-astro-cid-efqp3qre> `, ` </div> </div> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Date</label> <input id="ketoneDate" type="date" style="width:100%;padding:.7rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.9rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;" data-astro-cid-efqp3qre> </div> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Notes (optional)</label> <input id="ketoneNotes" type="text" placeholder="e.g. fasted 16h, after workout" style="width:100%;padding:.65rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.85rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;" data-astro-cid-efqp3qre> </div> <button id="saveKetoneBtn" style="width:100%;padding:.85rem;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;border:none;border-radius:12px;font-weight:800;font-size:.9rem;cursor:pointer;margin-top:.1rem;" data-astro-cid-efqp3qre>\u{1F4BE} Save Reading</button> </div> </div> </div> <script>
(function() {
  var modal    = document.getElementById('ketoneModal');
  var errBox   = document.getElementById('ketoneModalError');
  var valIn    = document.getElementById('ketoneValue');
  var dateIn   = document.getElementById('ketoneDate');
  var saveBtn  = document.getElementById('saveKetoneBtn');
  var selType  = 'blood';

  var today = new Date().toISOString().split('T')[0];
  if (dateIn) dateIn.value = today;

  // Type selector
  document.querySelectorAll('.ktype-btn').forEach(function(btn) {
    if (btn.getAttribute('data-type') === 'blood') {
      btn.style.borderColor = '#8b5cf6';
      btn.style.color = '#a78bfa';
    }
    btn.addEventListener('click', function() {
      selType = btn.getAttribute('data-type');
      document.querySelectorAll('.ktype-btn').forEach(function(b) {
        b.style.borderColor = 'var(--border)';
        b.style.color = 'var(--soft)';
      });
      btn.style.borderColor = '#8b5cf6';
      btn.style.color = '#a78bfa';
    });
  });

  function openModal() {
    modal.style.display = 'flex';
    if (errBox) errBox.style.display = 'none';
    if (valIn) valIn.focus();
  }

  var openBtn1 = document.getElementById('openKetoneModal');
  var openBtn2 = document.getElementById('openKetoneModalEmpty');
  var closeBtn = document.getElementById('closeKetoneModal');
  if (openBtn1) openBtn1.addEventListener('click', openModal);
  if (openBtn2) openBtn2.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', function() { modal.style.display = 'none'; });
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });

  if (saveBtn) saveBtn.addEventListener('click', function() {
    var v = parseFloat(valIn.value);
    if (isNaN(v) || v < 0 || v > 30) {
      errBox.textContent = 'Please enter a valid ketone level (0\u201330 mmol/L).';
      errBox.style.display = 'block';
      return;
    }
    saveBtn.textContent = 'Saving\u2026';
    saveBtn.disabled = true;
    fetch('/api/ketones/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ketone_mmol:      v,
        measurement_type: selType,
        logged_date:      dateIn.value || today,
        notes:            document.getElementById('ketoneNotes').value || null,
      }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        modal.style.display = 'none';
        window.location.reload();
      } else {
        errBox.textContent = data.error || 'Failed to save.';
        errBox.style.display = 'block';
        saveBtn.textContent = 'Save Reading';
        saveBtn.disabled = false;
      }
    })
    .catch(function() {
      errBox.textContent = 'Network error. Please try again.';
      errBox.style.display = 'block';
      saveBtn.textContent = 'Save Reading';
      saveBtn.disabled = false;
    });
  });
})();
<\/script> <!-- PROGRESS PHOTO MODAL --> <div id="photoModal" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:1rem;" data-astro-cid-efqp3qre> <div style="background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:1.75rem;width:100%;max-width:400px;max-height:90vh;overflow-y:auto;" data-astro-cid-efqp3qre> <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.05rem;font-weight:900;" data-astro-cid-efqp3qre>\u{1F4F8} Add Progress Photo</div> <button id="closePhotoModal" style="background:none;border:none;color:var(--soft);font-size:1.4rem;cursor:pointer;line-height:1;" data-astro-cid-efqp3qre>\xD7</button> </div> <div id="photoModalError" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:.6rem .9rem;font-size:.78rem;color:#ef4444;margin-bottom:1rem;" data-astro-cid-efqp3qre></div> <div id="photoPreviewWrap" style="display:none;margin-bottom:1rem;text-align:center;" data-astro-cid-efqp3qre> <img id="photoPreview" src="" alt="Preview" style="max-width:100%;max-height:200px;border-radius:12px;border:1px solid var(--border2);object-fit:cover;" data-astro-cid-efqp3qre> </div> <div style="display:flex;flex-direction:column;gap:.9rem;" data-astro-cid-efqp3qre> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Photo (images only, max 5MB)</label> <input id="photoFileInput" type="file" accept="image/*" style="width:100%;padding:.6rem .8rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.85rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;cursor:pointer;" data-astro-cid-efqp3qre> </div> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Date</label> <input id="photoDateInput" type="date" style="width:100%;padding:.7rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.9rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;" data-astro-cid-efqp3qre> </div> <div data-astro-cid-efqp3qre> <label style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);display:block;margin-bottom:.4rem;" data-astro-cid-efqp3qre>Notes (optional)</label> <textarea id="photoNotesInput" placeholder="e.g. Front view, Week 4" rows="2" style="width:100%;padding:.65rem 1rem;background:var(--bg);border:1.5px solid var(--border2);border-radius:12px;color:var(--text);font-size:.85rem;font-family:'DM Sans',sans-serif;box-sizing:border-box;resize:vertical;" data-astro-cid-efqp3qre></textarea> </div> <button id="savePhotoBtn" style="width:100%;padding:.85rem;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;border:none;border-radius:12px;font-weight:800;font-size:.9rem;cursor:pointer;" data-astro-cid-efqp3qre>Upload Photo</button> </div> </div> </div> <script>
(function() {
  var modal      = document.getElementById('photoModal');
  var errBox     = document.getElementById('photoModalError');
  var fileInput  = document.getElementById('photoFileInput');
  var dateInput  = document.getElementById('photoDateInput');
  var notesInput = document.getElementById('photoNotesInput');
  var saveBtn    = document.getElementById('savePhotoBtn');
  var preview    = document.getElementById('photoPreview');
  var previewWrap= document.getElementById('photoPreviewWrap');
  var today      = new Date().toISOString().split('T')[0];

  if (dateInput) dateInput.value = today;

  var compressedDataUrl = null;

  function openModal() {
    modal.style.display = 'flex';
    if (errBox) errBox.style.display = 'none';
    compressedDataUrl = null;
    if (previewWrap) previewWrap.style.display = 'none';
    if (fileInput) fileInput.value = '';
    if (notesInput) notesInput.value = '';
    if (dateInput) dateInput.value = today;
    if (saveBtn) { saveBtn.textContent = 'Upload Photo'; saveBtn.disabled = false; }
  }

  var openBtn1 = document.getElementById('openPhotoModal');
  var openBtn2 = document.getElementById('openPhotoModalEmpty');
  var closeBtn = document.getElementById('closePhotoModal');
  if (openBtn1) openBtn1.addEventListener('click', openModal);
  if (openBtn2) openBtn2.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', function() { modal.style.display = 'none'; });
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });

  // File selection: validate + compress + preview
  if (fileInput) fileInput.addEventListener('change', function() {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      errBox.textContent = 'Please select an image file.';
      errBox.style.display = 'block';
      fileInput.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errBox.textContent = 'Image must be under 5MB.';
      errBox.style.display = 'block';
      fileInput.value = '';
      return;
    }
    errBox.style.display = 'none';
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var maxSide = 800;
        var w = img.width;
        var h = img.height;
        if (w > maxSide || h > maxSide) {
          if (w > h) { h = Math.round(h * maxSide / w); w = maxSide; }
          else       { w = Math.round(w * maxSide / h); h = maxSide; }
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        if (preview) { preview.src = compressedDataUrl; }
        if (previewWrap) previewWrap.style.display = 'block';
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  function refreshPhotoGrid() {
    fetch('/api/photos/list?limit=4')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.success) return;
        var grid = document.getElementById('photoGrid');
        var countEl = document.getElementById('photoCount');
        if (!grid) return;
        var photos = data.photos || [];
        if (countEl) {
          countEl.textContent = photos.length > 0
            ? photos.length + ' photo' + (photos.length !== 1 ? 's' : '')
            : 'No photos yet';
        }
        if (photos.length === 0) {
          grid.innerHTML = '<div class="photo-empty"><div class="photo-empty-icon">\u{1F4F7}</div><div class="photo-empty-msg">No photos yet</div><div class="photo-empty-sub">Capture your transformation! Adding weekly photos is the most motivating way to see your keto progress.</div></div>';
          return;
        }
        var html = '<div class="photo-grid">';
        for (var i = 0; i < photos.length; i++) {
          var p = photos[i];
          var dateStr = new Date(p.taken_date + 'T12:00:00').toLocaleDateString('en', {month:'short', day:'numeric'});
          var altText = p.notes ? p.notes.replace(/"/g, '&quot;') : 'Progress photo';
          html += '<div class="photo-thumb-wrap">';
          html += '<img class="photo-thumb" src="' + p.photo_data + '" alt="' + altText + '" />';
          html += '<div class="photo-date">' + dateStr + '</div>';
          html += '</div>';
        }
        html += '</div>';
        grid.innerHTML = html;
      })
      .catch(function() {});
  }

  if (saveBtn) saveBtn.addEventListener('click', function() {
    if (!compressedDataUrl) {
      errBox.textContent = 'Please select an image first.';
      errBox.style.display = 'block';
      return;
    }
    // Check compressed size (~500KB limit)
    var approxBytes = compressedDataUrl.length * 0.75;
    if (approxBytes > 500 * 1024) {
      errBox.textContent = 'Image is still too large after compression. Please choose a smaller image.';
      errBox.style.display = 'block';
      return;
    }
    saveBtn.textContent = 'Uploading\u2026';
    saveBtn.disabled = true;
    fetch('/api/photos/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photo_data: compressedDataUrl,
        taken_date: dateInput.value || today,
        notes:      notesInput.value || null,
      }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        modal.style.display = 'none';
        refreshPhotoGrid();
      } else {
        errBox.textContent = data.error || 'Upload failed. Please try again.';
        errBox.style.display = 'block';
        saveBtn.textContent = 'Upload Photo';
        saveBtn.disabled = false;
      }
    })
    .catch(function() {
      errBox.textContent = 'Network error. Please try again.';
      errBox.style.display = 'block';
      saveBtn.textContent = 'Upload Photo';
      saveBtn.disabled = false;
    });
  });
})();
<\/script> <script>
(function() {
  var tip = document.getElementById('calTip');
  window.showCalTip = function(text, e) {
    if (!tip) return;
    tip.textContent = text;
    tip.classList.add('visible');
    var x = e.clientX + 12;
    var y = e.clientY - 36;
    if (x + 180 > window.innerWidth) x = e.clientX - 190;
    if (y < 8) y = e.clientY + 16;
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
  };
  window.hideCalTip = function() {
    if (!tip) return;
    tip.classList.remove('visible');
  };
})();
<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "progress", "data-astro-cid-efqp3qre": true }), userName, currentDay, planLabel, dispWeightLost > 0 ? `-${dispWeightLost}` : "\u2014", wUnit, weightGoalPct, streakDays, longestStreak, xpLevel, totalXP.toLocaleString(), xpInLevel, totalCompletedTasks, perfectDays, goalHasTarget && renderTemplate`<div class="card" style="animation-delay:.2s;margin-bottom:1.75rem;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#ef4444,#f59e0b,#10b981);box-shadow:0 4px 10px rgba(16,185,129,.2);" data-astro-cid-efqp3qre>🎯</div> <div style="flex:1;" data-astro-cid-efqp3qre> <div class="ch-tt" data-astro-cid-efqp3qre>Goal Timeline</div> <div class="ch-sub" data-astro-cid-efqp3qre>${goalStartLbs} ${wUnit} → ${goalWeightLbs} ${wUnit} · ${goalPctDone}% complete</div> </div> <div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:var(--green);" data-astro-cid-efqp3qre>${goalPctDone}%</div> </div> <div class="cb" data-astro-cid-efqp3qre> <!-- Progress bar --> <div class="goal-bar-wrap" data-astro-cid-efqp3qre> <div class="goal-bar-fill"${addAttribute(`width:${goalPctDone}%;background:${goalBarColor};`, "style")} data-astro-cid-efqp3qre></div> </div> <!-- Milestone markers --> <div class="goal-markers" data-astro-cid-efqp3qre> <!-- 25% --> <div class="gm" data-astro-cid-efqp3qre> <div class="gm-icon" data-astro-cid-efqp3qre>${goalMs25Done ? "\u2705" : "\u2B1C"}</div> <div${addAttribute(`gm-weight ${goalMs25Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>${goalMs25Weight} ${wUnit}</div> <div${addAttribute(`gm-label ${goalMs25Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>25% goal</div> </div> <!-- 50% --> <div class="gm" data-astro-cid-efqp3qre> <div class="gm-icon" data-astro-cid-efqp3qre>${goalMs50Done ? "\u2705" : "\u2B1C"}</div> <div${addAttribute(`gm-weight ${goalMs50Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>${goalMs50Weight} ${wUnit}</div> <div${addAttribute(`gm-label ${goalMs50Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>Halfway!</div> </div> <!-- 75% --> <div class="gm" data-astro-cid-efqp3qre> <div class="gm-icon" data-astro-cid-efqp3qre>${goalMs75Done ? "\u2705" : "\u2B1C"}</div> <div${addAttribute(`gm-weight ${goalMs75Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>${goalMs75Weight} ${wUnit}</div> <div${addAttribute(`gm-label ${goalMs75Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>75% there</div> </div> <!-- 100% --> <div class="gm" data-astro-cid-efqp3qre> <div class="gm-icon" data-astro-cid-efqp3qre>${goalMs100Done ? "\u2705" : "\u2B1C"}</div> <div${addAttribute(`gm-weight ${goalMs100Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>${goalMs100Weight} ${wUnit}</div> <div${addAttribute(`gm-label ${goalMs100Done ? "done" : ""}`, "class")} data-astro-cid-efqp3qre>Goal! 🎉</div> </div> </div> <!-- Summary stats --> <div class="goal-stats" data-astro-cid-efqp3qre> <span class="gs-item" data-astro-cid-efqp3qre>Lost <strong data-astro-cid-efqp3qre>${goalLostAbsLbs} ${wUnit}</strong> so far</span> <span class="gs-item" data-astro-cid-efqp3qre><strong data-astro-cid-efqp3qre>${goalKgToGoLbs} ${wUnit}</strong> to goal</span> <span class="gs-item" data-astro-cid-efqp3qre><strong data-astro-cid-efqp3qre>${goalPctDone}%</strong> complete</span> </div> </div> </div>`, currentDay, journeyPct, addAttribute(`width:${journeyPct}%;background:linear-gradient(90deg,var(--green),var(--green2));`, "style"), xpLevel, xpLevel + 1, xpPct, addAttribute(`width:${xpPct}%;background:linear-gradient(90deg,#8b5cf6,#a78bfa);`, "style"), targetWeight > 0 && renderTemplate`<div class="prog" data-astro-cid-efqp3qre> <div class="prog-hd" data-astro-cid-efqp3qre> <span class="prog-lbl" data-astro-cid-efqp3qre>Weight Goal (${dispTargetWeight} ${wUnit})</span> <span class="prog-val" style="color:var(--blue);" data-astro-cid-efqp3qre>${weightGoalPct}%</span> </div> <div class="prog-trk" data-astro-cid-efqp3qre> <div class="prog-fill"${addAttribute(`width:${weightGoalPct}%;background:linear-gradient(90deg,#3b82f6,#10b981);`, "style")} data-astro-cid-efqp3qre></div> </div> </div>`, wChartPts.length, wChartPts.length > 0 ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-efqp3qre": true }, { "default": async ($$result2) => renderTemplate` <div style="display:flex;justify-content:space-between;margin-bottom:1rem;" data-astro-cid-efqp3qre> <div style="text-align:center;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:900;color:var(--blue);" data-astro-cid-efqp3qre>${dispStartWeight}<span style="font-size:.75rem;color:var(--soft);" data-astro-cid-efqp3qre>${wUnit}</span></div> <div style="font-size:.62rem;color:var(--soft);font-weight:700;" data-astro-cid-efqp3qre>START</div> </div> <div style="text-align:center;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:900;color:var(--green);" data-astro-cid-efqp3qre>${dispWeight}<span style="font-size:.75rem;color:var(--soft);" data-astro-cid-efqp3qre>${wUnit}</span></div> <div style="font-size:.62rem;color:var(--soft);font-weight:700;" data-astro-cid-efqp3qre>CURRENT</div> </div> ${targetWeight > 0 && renderTemplate`<div style="text-align:center;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:900;color:var(--gold);" data-astro-cid-efqp3qre>${dispTargetWeight}<span style="font-size:.75rem;color:var(--soft);" data-astro-cid-efqp3qre>${wUnit}</span></div> <div style="font-size:.62rem;color:var(--soft);font-weight:700;" data-astro-cid-efqp3qre>GOAL</div> </div>`} ${weightLost > 0 && renderTemplate`<div style="text-align:center;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:900;color:var(--green);" data-astro-cid-efqp3qre>-${dispWeightLost}<span style="font-size:.75rem;color:var(--soft);" data-astro-cid-efqp3qre>${wUnit}</span></div> <div style="font-size:.62rem;color:var(--soft);font-weight:700;" data-astro-cid-efqp3qre>LOST</div> </div>`} </div> <svg width="100%"${addAttribute(`0 0 ${SVG_W} ${SVG_H}`, "viewBox")} preserveAspectRatio="xMidYMid meet" style="overflow:visible;display:block;margin-top:.5rem;" data-astro-cid-efqp3qre> <defs data-astro-cid-efqp3qre> <linearGradient id="wAreaGrad" x1="0" y1="0" x2="0" y2="1" data-astro-cid-efqp3qre> <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35" data-astro-cid-efqp3qre></stop> <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" data-astro-cid-efqp3qre></stop> </linearGradient> <linearGradient id="wLineGrad" x1="0" y1="0" x2="1" y2="0" data-astro-cid-efqp3qre> <stop offset="0%" stop-color="#3b82f6" data-astro-cid-efqp3qre></stop> <stop offset="100%" stop-color="#10b981" data-astro-cid-efqp3qre></stop> </linearGradient> </defs> ${wChartPts.length > 1 && renderTemplate`<path${addAttribute(wFillPath, "d")} fill="url(#wAreaGrad)" data-astro-cid-efqp3qre></path>`} ${wChartPts.length > 1 && renderTemplate`<path${addAttribute(wLinePath, "d")} fill="none" stroke="url(#wLineGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-efqp3qre></path>`} ${wTicksLbs.map((t) => renderTemplate`<g${addAttribute(t.y, "key")} data-astro-cid-efqp3qre> <line${addAttribute(SVG_PL, "x1")}${addAttribute(t.y, "y1")}${addAttribute(SVG_W - SVG_PR, "x2")}${addAttribute(t.y, "y2")} stroke="rgba(255,255,255,0.05)" stroke-width="1" data-astro-cid-efqp3qre></line> <text${addAttribute(SVG_PL - 5, "x")}${addAttribute(t.y + 4, "y")} text-anchor="end" font-size="9" fill="var(--soft)" data-astro-cid-efqp3qre>${t.valLbs}</text> </g>`)} ${wChartPtsLbs.map((p) => renderTemplate`<circle${addAttribute(p.rawDate, "key")}${addAttribute(p.x, "cx")}${addAttribute(p.y, "cy")}${addAttribute(p.isLatest ? 5 : 3.5, "r")}${addAttribute(p.isLatest ? "#10b981" : "#3b82f6", "fill")}${addAttribute(p.isLatest ? "#34d399" : "#60a5fa", "stroke")} stroke-width="1.5" data-astro-cid-efqp3qre> <title>${p.weightLbs} ${wUnit} — ${p.date}</title> </circle>`)} ${wDateLabels.map((p) => renderTemplate`<text${addAttribute(p.rawDate, "key")}${addAttribute(p.x, "x")}${addAttribute(SVG_H - SVG_PB + 18, "y")} text-anchor="middle" font-size="9" fill="var(--soft)" data-astro-cid-efqp3qre>${p.date}</text>`)} </svg> ` })}` : renderTemplate`<div style="text-align:center;padding:2rem;color:var(--soft);" data-astro-cid-efqp3qre> <div style="font-size:2.5rem;margin-bottom:.75rem;" data-astro-cid-efqp3qre>⚖️</div> <div style="font-weight:700;margin-bottom:.3rem;" data-astro-cid-efqp3qre>No weight logs yet</div> <div style="font-size:.78rem;" data-astro-cid-efqp3qre>Log your first weight to start tracking progress</div> <button id="openWeightModalEmpty" style="display:inline-block;margin-top:1rem;padding:.6rem 1.4rem;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;border-radius:10px;font-weight:800;font-size:.8rem;border:none;cursor:pointer;" data-astro-cid-efqp3qre>+ Log First Weight</button> </div>`, Object.keys(checkinMap).length, Array.from({ length: calNumCols }, (_, ci) => {
    const label = calMonthLabels.find((m) => m.col === ci);
    return renderTemplate`<div class="cal-month-cell" data-astro-cid-efqp3qre>${label ? label.month : ""}</div>`;
  }), Array.from({ length: calNumCols }, (_, ci) => renderTemplate`<div class="cal-col" data-astro-cid-efqp3qre> ${Array.from({ length: 7 }, (_2, ri) => {
    const idx = ci * 7 + ri;
    const sq = calDays[idx];
    const tipText = sq ? sq.isFuture ? sq.date + " \xB7 future" : sq.hasCheckin ? sq.date + " \xB7 Energy: " + sq.energy + "/5" : sq.date + " \xB7 no check-in" : "";
    return sq ? renderTemplate`<div${addAttribute(`cal-sq ${sq.colorClass}`, "class")}${addAttribute(`window.showCalTip('${tipText}',event)`, "onmouseenter")} onmouseleave="window.hideCalTip()" data-astro-cid-efqp3qre></div>` : renderTemplate`<div class="cal-sq cal-future" data-astro-cid-efqp3qre></div>`;
  })} </div>`), energyChart.length > 0 && renderTemplate`<div class="card" style="animation-delay:.15s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.2);" data-astro-cid-efqp3qre>⚡</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Energy & Compliance</div><div class="ch-sub" data-astro-cid-efqp3qre>Last 7 days</div></div> </div> <div class="cb" data-astro-cid-efqp3qre> <div class="mini3" data-astro-cid-efqp3qre> <div class="mini-c" data-astro-cid-efqp3qre> <div class="mini-val" style="color:var(--gold);" data-astro-cid-efqp3qre>${avgEnergy}/5</div> <div class="mini-lbl" data-astro-cid-efqp3qre>Avg Energy</div> </div> <div class="mini-c" data-astro-cid-efqp3qre> <div class="mini-val" style="color:var(--green);" data-astro-cid-efqp3qre>${mealAdherence}%</div> <div class="mini-lbl" data-astro-cid-efqp3qre>Meal Adherence</div> </div> <div class="mini-c" data-astro-cid-efqp3qre> <div class="mini-val" style="color:var(--blue);" data-astro-cid-efqp3qre>${avgWater}</div> <div class="mini-lbl" data-astro-cid-efqp3qre>Avg Water/day</div> </div> </div> <div class="echart" data-astro-cid-efqp3qre> ${energyChart.map((d) => renderTemplate`<div class="ebar-wrap" data-astro-cid-efqp3qre> <div class="ebar"${addAttribute(`height:${d.pct}%;background:${d.energy >= 4 ? "linear-gradient(to top,#10b981,#34d399)" : d.energy >= 2 ? "linear-gradient(to top,#f59e0b,#fbbf24)" : "linear-gradient(to top,#ef4444,#f87171)"};`, "style")}${addAttribute(`Energy ${d.energy}/5 \xB7 ${d.water} glasses`, "title")} data-astro-cid-efqp3qre></div> <div class="ebar-day" data-astro-cid-efqp3qre>${d.day}</div> </div>`)} </div> <div style="display:flex;gap:1rem;font-size:.68rem;color:var(--soft);justify-content:center;" data-astro-cid-efqp3qre> <span data-astro-cid-efqp3qre><span style="color:var(--green);" data-astro-cid-efqp3qre>■</span> High (4-5)</span> <span data-astro-cid-efqp3qre><span style="color:var(--gold);" data-astro-cid-efqp3qre>■</span> Mid (2-3)</span> <span data-astro-cid-efqp3qre><span style="color:var(--red);" data-astro-cid-efqp3qre>■</span> Low (0-1)</span> </div> </div> </div>`, sleepChart.length > 0 ? `Last ${sleepChart.length} logged nights` : "No data yet", avgSleepHours && renderTemplate`<div style="margin-left:auto;text-align:right;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.5rem;font-weight:900;color:#a5b4fc;" data-astro-cid-efqp3qre>${avgSleepHours}h</div> <div style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>avg / night</div> </div>`, sleepChart.length > 0 ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-efqp3qre": true }, { "default": async ($$result2) => renderTemplate` <div class="echart" style="margin-top:.75rem;" data-astro-cid-efqp3qre> ${sleepChart.map((d) => renderTemplate`<div class="ebar-wrap" data-astro-cid-efqp3qre> <div class="ebar"${addAttribute(`height:${Math.max(8, d.pct)}%;background:linear-gradient(to top,${d.color},${d.color}88);`, "style")}${addAttribute(`${d.hours}h sleep \xB7 Quality ${d.quality || "\u2014"}/5`, "title")} data-astro-cid-efqp3qre></div> <div class="ebar-day" data-astro-cid-efqp3qre>${d.day}</div> </div>`)} </div> <div style="display:flex;align-items:center;gap:1rem;font-size:.68rem;color:var(--soft);justify-content:center;margin-top:.6rem;" data-astro-cid-efqp3qre> <span data-astro-cid-efqp3qre><span style="color:var(--green);" data-astro-cid-efqp3qre>■</span> 7+ hrs</span> <span data-astro-cid-efqp3qre><span style="color:var(--gold);" data-astro-cid-efqp3qre>■</span> 5–7 hrs</span> <span data-astro-cid-efqp3qre><span style="color:var(--red);" data-astro-cid-efqp3qre>■</span> Under 5 hrs</span> </div> ${avgSleepHours && parseFloat(avgSleepHours) < 6 && renderTemplate`<div style="margin-top:.75rem;padding:.65rem .85rem;border-radius:11px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);font-size:.75rem;color:var(--red);" data-astro-cid-efqp3qre>
⚠️ Low average sleep may slow fat loss and increase keto flu symptoms. Aim for 7–9 hours.
</div>`}` })}` : renderTemplate`<div style="text-align:center;padding:1.5rem 1rem;" data-astro-cid-efqp3qre> <div style="font-size:2.5rem;margin-bottom:.6rem;" data-astro-cid-efqp3qre>😴</div> <div style="font-size:.82rem;font-weight:700;color:var(--soft);margin-bottom:.35rem;" data-astro-cid-efqp3qre>No sleep data logged yet</div> <div style="font-size:.72rem;color:var(--muted);margin-bottom:1rem;" data-astro-cid-efqp3qre>Track your sleep hours in your daily check-in to see trends here.</div> <a href="/dashboard/checkin" style="display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1.1rem;border-radius:10px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;font-size:.75rem;font-weight:700;text-decoration:none;" data-astro-cid-efqp3qre>📝 Go to Check-in</a> </div>`, macroTrend.some((d) => d.hasData) && renderTemplate`<div class="card" style="animation-delay:.2s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.2);" data-astro-cid-efqp3qre>📊</div> <div data-astro-cid-efqp3qre> <div class="ch-tt" data-astro-cid-efqp3qre>Calorie Trend</div> <div class="ch-sub" data-astro-cid-efqp3qre>Last 14 days from food log</div> </div> <div style="margin-left:auto;text-align:right;" data-astro-cid-efqp3qre> <div style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>goal</div> <div style="font-weight:800;font-size:.9rem;color:var(--gold);" data-astro-cid-efqp3qre>${macroGoalCal} kcal</div> </div> </div> <div class="echart" style="margin-top:.75rem;" data-astro-cid-efqp3qre> ${macroTrend.map((d) => renderTemplate`<div class="ebar-wrap" data-astro-cid-efqp3qre> <div class="ebar"${addAttribute(`height:${d.hasData ? Math.max(5, Math.round(d.cal / maxTrendCal * 100)) : 3}%;background:${!d.hasData ? "var(--muted)" : d.cal > macroGoalCal * 1.1 ? "linear-gradient(to top,#ef4444,#f87171)" : d.cal > 0 ? "linear-gradient(to top,#f59e0b,#fbbf24)" : "var(--muted)"};`, "style")}${addAttribute(d.hasData ? `${d.cal} kcal` : "No data", "title")} data-astro-cid-efqp3qre></div> <div class="ebar-day" data-astro-cid-efqp3qre>${d.day}</div> </div>`)} </div> <div style="display:flex;gap:.75rem;font-size:.68rem;color:var(--soft);justify-content:center;margin-top:.5rem;" data-astro-cid-efqp3qre> <span data-astro-cid-efqp3qre><span style="color:var(--gold);" data-astro-cid-efqp3qre>■</span> On target</span> <span data-astro-cid-efqp3qre><span style="color:var(--red);" data-astro-cid-efqp3qre>■</span> Over goal</span> <span data-astro-cid-efqp3qre><span style="color:var(--muted);" data-astro-cid-efqp3qre>■</span> Not logged</span> </div> </div>`, [
    { pct: journeyPct, color: "#10b981", stroke: "url(#g1)", lbl: "Journey", val: `${currentDay}d` },
    { pct: xpPct, color: "#8b5cf6", stroke: "url(#g2)", lbl: "Level XP", val: `Lv${xpLevel}` },
    { pct: weightGoalPct || 0, color: "#3b82f6", stroke: "url(#g3)", lbl: "Weight", val: `${weightGoalPct}%` },
    { pct: mealAdherence, color: "#f59e0b", stroke: "url(#g4)", lbl: "Meals", val: `${mealAdherence}%` }
  ].map((r, ri) => renderTemplate`<div style="text-align:center;" data-astro-cid-efqp3qre> <div class="ring-wrap" data-astro-cid-efqp3qre> <svg class="rsvg" width="90" height="90" viewBox="0 0 90 90" data-astro-cid-efqp3qre> <defs data-astro-cid-efqp3qre> <linearGradient${addAttribute(`g${ri + 1}`, "id")} x1="0%" y1="0%" x2="100%" y2="100%" data-astro-cid-efqp3qre> <stop offset="0%"${addAttribute(r.color, "stop-color")} data-astro-cid-efqp3qre></stop> <stop offset="100%"${addAttribute(r.color, "stop-color")} stop-opacity=".6" data-astro-cid-efqp3qre></stop> </linearGradient> </defs> <circle class="r-trk" cx="45" cy="45" r="39" data-astro-cid-efqp3qre></circle> <circle class="r-fill" cx="45" cy="45" r="39"${addAttribute(r.stroke, "stroke")}${addAttribute(`stroke-dashoffset:${245 - 245 * r.pct / 100};`, "style")} data-astro-cid-efqp3qre></circle> </svg> <div class="ring-c" data-astro-cid-efqp3qre> <div class="ring-pct"${addAttribute(`color:${r.color};`, "style")} data-astro-cid-efqp3qre>${r.val}</div> <div class="ring-lbl" data-astro-cid-efqp3qre>${r.lbl}</div> </div> </div> </div>`), waterHistory.length > 0 && renderTemplate`<div class="card" style="animation-delay:.1s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 4px 10px rgba(59,130,246,.2);" data-astro-cid-efqp3qre>💧</div> <div data-astro-cid-efqp3qre> <div class="ch-tt" data-astro-cid-efqp3qre>Water History</div> <div class="ch-sub" data-astro-cid-efqp3qre>Goal: 8 glasses/day</div> </div> ${avgWaterAll && renderTemplate`<div style="margin-left:auto;text-align:right;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:var(--blue);" data-astro-cid-efqp3qre>${avgWaterAll}</div> <div style="font-size:.62rem;color:var(--soft);" data-astro-cid-efqp3qre>avg glasses</div> </div>`} </div> <div class="echart" style="margin-top:.75rem;" data-astro-cid-efqp3qre> ${waterHistory.map((d) => renderTemplate`<div class="ebar-wrap" data-astro-cid-efqp3qre> <div class="ebar"${addAttribute(`height:${Math.max(5, d.pct)}%;background:${d.met ? "linear-gradient(to top,#3b82f6,#60a5fa)" : "linear-gradient(to top,#6b7280,#9ca3af)"};`, "style")}${addAttribute(`${d.glasses} glasses`, "title")} data-astro-cid-efqp3qre></div> <div class="ebar-day" data-astro-cid-efqp3qre>${d.day}</div> </div>`)} </div> <div style="text-align:center;margin-top:.5rem;font-size:.7rem;color:var(--soft);" data-astro-cid-efqp3qre>
🎯 ${goalMetDays}/${waterHistory.length} days hit 8-glass goal
</div> </div>`, milestones.filter((m) => m.done).length, milestones.length, milestones.map((m, i) => renderTemplate`<div${addAttribute(`ms ${m.done ? "done" : i === milestones.findIndex((x) => !x.done) ? "next" : ""}`, "class")} data-astro-cid-efqp3qre> <div class="ms-icon" data-astro-cid-efqp3qre>${m.icon}</div> <div class="ms-info" data-astro-cid-efqp3qre> <div class="ms-lbl"${addAttribute(m.done ? "color:var(--green);" : "", "style")} data-astro-cid-efqp3qre>${m.label}</div> <div class="ms-day" data-astro-cid-efqp3qre>Day ${m.day}</div> </div> <div class="ms-check" data-astro-cid-efqp3qre>${m.done ? "\u2713" : i === milestones.findIndex((x) => !x.done) ? "\u27F3" : ""}</div> </div>`), xpTxns && xpTxns.length > 0 && renderTemplate`<div class="card" style="animation-delay:.18s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.2);" data-astro-cid-efqp3qre>⭐</div> <div class="ch-tt" data-astro-cid-efqp3qre>Recent XP</div> </div> <div class="cb" data-astro-cid-efqp3qre> ${xpTxns.slice(0, 8).map((x) => renderTemplate`<div class="xp-row" data-astro-cid-efqp3qre> <div style="flex:1;" data-astro-cid-efqp3qre> <div class="xp-type" data-astro-cid-efqp3qre>${x.description || x.action_type}</div> <div class="xp-date" data-astro-cid-efqp3qre>${new Date(x.created_at).toLocaleDateString("en", { month: "short", day: "numeric" })}</div> </div> <div class="xp-pts" data-astro-cid-efqp3qre>+${x.xp_amount} XP</div> </div>`)} </div> </div>`, latestMeasurements ? `Last logged ${new Date(latestMeasurements.logged_date).toLocaleDateString("en", { month: "short", day: "numeric" })}` : "No measurements yet", latestMeasurements ? renderTemplate`<div style="display:flex;flex-direction:column;gap:1rem;" data-astro-cid-efqp3qre> <!-- Latest entry --> <div data-astro-cid-efqp3qre> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;" data-astro-cid-efqp3qre> <span style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);" data-astro-cid-efqp3qre>${new Date(latestMeasurements.logged_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span> <button class="edit-meas-btn"${addAttribute(latestMeasurements.logged_date, "data-date")}${addAttribute(latestMeasurements.waist_cm || "", "data-waist")}${addAttribute(latestMeasurements.hips_cm || "", "data-hips")}${addAttribute(latestMeasurements.chest_cm || "", "data-chest")}${addAttribute(latestMeasurements.neck_cm || "", "data-neck")}${addAttribute(latestMeasurements.arm_cm || "", "data-arm")}${addAttribute(latestMeasurements.thigh_cm || "", "data-thigh")} style="font-size:.68rem;font-weight:800;color:#f97316;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.25);border-radius:7px;padding:.2rem .55rem;cursor:pointer;" data-astro-cid-efqp3qre>✏️ Edit</button> </div> <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;" data-astro-cid-efqp3qre> ${latestMeasurements.waist_cm && renderTemplate`<div style="text-align:center;padding:.75rem;background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:12px;" data-astro-cid-efqp3qre><div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(latestMeasurements.waist_cm)}<span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Waist</div></div>`} ${latestMeasurements.hips_cm && renderTemplate`<div style="text-align:center;padding:.75rem;background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:12px;" data-astro-cid-efqp3qre><div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(latestMeasurements.hips_cm)}<span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Hips</div></div>`} ${latestMeasurements.chest_cm && renderTemplate`<div style="text-align:center;padding:.75rem;background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:12px;" data-astro-cid-efqp3qre><div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(latestMeasurements.chest_cm)}<span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Chest</div></div>`} ${latestMeasurements.neck_cm && renderTemplate`<div style="text-align:center;padding:.75rem;background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:12px;" data-astro-cid-efqp3qre><div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(latestMeasurements.neck_cm)}<span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Neck</div></div>`} ${latestMeasurements.arm_cm && renderTemplate`<div style="text-align:center;padding:.75rem;background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:12px;" data-astro-cid-efqp3qre><div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(latestMeasurements.arm_cm)}<span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Arm</div></div>`} ${latestMeasurements.thigh_cm && renderTemplate`<div style="text-align:center;padding:.75rem;background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:12px;" data-astro-cid-efqp3qre><div style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(latestMeasurements.thigh_cm)}<span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Thigh</div></div>`} </div> </div> <!-- Previous entry (if any) --> ${prevMeasurements && renderTemplate`<div style="border-top:1px solid var(--border);padding-top:.9rem;" data-astro-cid-efqp3qre> <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;" data-astro-cid-efqp3qre> <span style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--soft);" data-astro-cid-efqp3qre>${new Date(prevMeasurements.logged_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span> <button class="edit-meas-btn"${addAttribute(prevMeasurements.logged_date, "data-date")}${addAttribute(prevMeasurements.waist_cm || "", "data-waist")}${addAttribute(prevMeasurements.hips_cm || "", "data-hips")}${addAttribute(prevMeasurements.chest_cm || "", "data-chest")}${addAttribute(prevMeasurements.neck_cm || "", "data-neck")}${addAttribute(prevMeasurements.arm_cm || "", "data-arm")}${addAttribute(prevMeasurements.thigh_cm || "", "data-thigh")} style="font-size:.68rem;font-weight:800;color:#f97316;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.25);border-radius:7px;padding:.2rem .55rem;cursor:pointer;" data-astro-cid-efqp3qre>✏️ Edit</button> </div> <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;" data-astro-cid-efqp3qre> ${prevMeasurements.waist_cm && renderTemplate`<div style="text-align:center;padding:.5rem;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.1);border-radius:10px;" data-astro-cid-efqp3qre><div style="font-size:1rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(prevMeasurements.waist_cm)}<span style="font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Waist</div></div>`} ${prevMeasurements.hips_cm && renderTemplate`<div style="text-align:center;padding:.5rem;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.1);border-radius:10px;" data-astro-cid-efqp3qre><div style="font-size:1rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(prevMeasurements.hips_cm)}<span style="font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Hips</div></div>`} ${prevMeasurements.chest_cm && renderTemplate`<div style="text-align:center;padding:.5rem;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.1);border-radius:10px;" data-astro-cid-efqp3qre><div style="font-size:1rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(prevMeasurements.chest_cm)}<span style="font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Chest</div></div>`} ${prevMeasurements.neck_cm && renderTemplate`<div style="text-align:center;padding:.5rem;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.1);border-radius:10px;" data-astro-cid-efqp3qre><div style="font-size:1rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(prevMeasurements.neck_cm)}<span style="font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Neck</div></div>`} ${prevMeasurements.arm_cm && renderTemplate`<div style="text-align:center;padding:.5rem;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.1);border-radius:10px;" data-astro-cid-efqp3qre><div style="font-size:1rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(prevMeasurements.arm_cm)}<span style="font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Arm</div></div>`} ${prevMeasurements.thigh_cm && renderTemplate`<div style="text-align:center;padding:.5rem;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.1);border-radius:10px;" data-astro-cid-efqp3qre><div style="font-size:1rem;font-weight:900;color:#f97316;" data-astro-cid-efqp3qre>${toM(prevMeasurements.thigh_cm)}<span style="font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre>${mUnit}</span></div><div style="font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Thigh</div></div>`} </div> </div>`} </div>` : renderTemplate`<div style="text-align:center;padding:1.5rem;color:var(--soft);" data-astro-cid-efqp3qre> <div style="font-size:2rem;margin-bottom:.5rem;" data-astro-cid-efqp3qre>📏</div> <div style="font-weight:700;font-size:.85rem;margin-bottom:.3rem;" data-astro-cid-efqp3qre>No measurements yet</div> <div style="font-size:.76rem;margin-bottom:1rem;" data-astro-cid-efqp3qre>Track neck, waist, hips and more to see body changes beyond the scale.</div> <button id="openMeasModalEmpty" style="padding:.55rem 1.2rem;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border:none;border-radius:10px;font-weight:800;font-size:.78rem;cursor:pointer;" data-astro-cid-efqp3qre>+ Log First Measurement</button> </div>`, latestKetone ? `Last: ${latestKetone.ketone_mmol} mmol/L \xB7 ${new Date(latestKetone.logged_date).toLocaleDateString("en", { month: "short", day: "numeric" })}` : "No readings yet", ketoneStatus && renderTemplate`<div${addAttribute(`display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:12px;background:${ketoneStatus.color}18;border:1px solid ${ketoneStatus.color}30;margin-bottom:1rem;`, "style")} data-astro-cid-efqp3qre> <div${addAttribute(`font-size:1.8rem;font-family:'Fraunces',serif;font-weight:900;color:${ketoneStatus.color};`, "style")} data-astro-cid-efqp3qre>${latestKetone.ketone_mmol}</div> <div data-astro-cid-efqp3qre> <div${addAttribute(`font-weight:800;font-size:.85rem;color:${ketoneStatus.color};`, "style")} data-astro-cid-efqp3qre>${ketoneStatus.label}</div> <div style="font-size:.72rem;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>${ketoneStatus.tip}</div> </div> </div>`, ketoneTrendBars.length > 1 && renderTemplate`<div class="echart" style="margin:.75rem 0;height:70px;" data-astro-cid-efqp3qre> ${ketoneTrendBars.map((k) => renderTemplate`<div class="ebar-wrap" data-astro-cid-efqp3qre> <div class="ebar"${addAttribute(`height:${Math.max(5, k.pct)}%;background:linear-gradient(to top,${k.color},${k.color}88);`, "style")}${addAttribute(`${k.val} mmol/L`, "title")} data-astro-cid-efqp3qre></div> <div class="ebar-day" style="font-size:.52rem;" data-astro-cid-efqp3qre>${k.label}</div> </div>`)} </div>`, ketoneLogs && ketoneLogs.length > 0 ? renderTemplate`<div style="display:flex;flex-direction:column;gap:.4rem;max-height:220px;overflow-y:auto;" data-astro-cid-efqp3qre> ${ketoneLogs.slice(0, 10).map((k) => renderTemplate`<div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .8rem;background:var(--bg);border:1px solid var(--border);border-radius:10px;" data-astro-cid-efqp3qre> <div style="display:flex;align-items:center;gap:.6rem;" data-astro-cid-efqp3qre> <span${addAttribute(`font-size:.7rem;font-weight:800;padding:.15rem .45rem;border-radius:6px;background:${k.ketone_mmol >= 1.5 && k.ketone_mmol < 3 ? "rgba(16,185,129,.15)" : k.ketone_mmol >= 0.5 ? "rgba(245,158,11,.15)" : "rgba(239,68,68,.15)"};color:${k.ketone_mmol >= 1.5 && k.ketone_mmol < 3 ? "var(--green)" : k.ketone_mmol >= 0.5 ? "var(--gold)" : "var(--red)"};`, "style")} data-astro-cid-efqp3qre>${k.measurement_type}</span> <span style="font-weight:800;font-size:.85rem;" data-astro-cid-efqp3qre>${k.ketone_mmol} <span style="font-size:.65rem;color:var(--soft);" data-astro-cid-efqp3qre>mmol/L</span></span> </div> <span style="font-size:.72rem;color:var(--soft);" data-astro-cid-efqp3qre>${new Date(k.logged_date).toLocaleDateString("en", { month: "short", day: "numeric" })}</span> </div>`)} </div>` : renderTemplate`<div style="text-align:center;padding:1.25rem;color:var(--soft);" data-astro-cid-efqp3qre> <div style="font-size:1.8rem;margin-bottom:.4rem;" data-astro-cid-efqp3qre>🩸</div> <div style="font-weight:700;font-size:.82rem;margin-bottom:.25rem;" data-astro-cid-efqp3qre>No readings yet</div> <div style="font-size:.74rem;margin-bottom:.8rem;" data-astro-cid-efqp3qre>Track blood, urine or breath ketones to monitor your ketosis depth.</div> <button id="openKetoneModalEmpty" style="padding:.5rem 1.1rem;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;border:none;border-radius:9px;font-weight:800;font-size:.76rem;cursor:pointer;" data-astro-cid-efqp3qre>+ Log First Reading</button> </div>`, [
    { range: "< 0.5", label: "No ketosis", color: "#ef4444" },
    { range: "0.5\u20131.5", label: "Light", color: "#f59e0b" },
    { range: "1.5\u20133.0", label: "Optimal \u{1F525}", color: "#10b981" },
    { range: "3.0\u20135.0", label: "Deep", color: "#8b5cf6" }
  ].map((s) => renderTemplate`<div${addAttribute(`font-size:.65rem;font-weight:700;padding:.2rem .5rem;border-radius:6px;background:${s.color}15;color:${s.color};border:1px solid ${s.color}25;`, "style")} data-astro-cid-efqp3qre>${s.range} ${s.label}</div>`), bcBMI && renderTemplate`<div class="card" style="animation-delay:.32s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 4px 10px rgba(59,130,246,.2);" data-astro-cid-efqp3qre>🧬</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Body Composition</div><div class="ch-sub" data-astro-cid-efqp3qre>Based on your current stats</div></div> </div> <div class="cb" data-astro-cid-efqp3qre> <!-- BMI Gauge --> <div style="margin-bottom:1.5rem;" data-astro-cid-efqp3qre> <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.5rem;" data-astro-cid-efqp3qre> <span style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);" data-astro-cid-efqp3qre>BMI</span> <span${addAttribute(`font-family:'Fraunces',serif;font-size:1.5rem;font-weight:900;color:${bcBMIcat?.color};`, "style")} data-astro-cid-efqp3qre>${bcBMI}</span> </div> <!-- Gradient bar with marker --> <div style="position:relative;height:10px;border-radius:99px;background:linear-gradient(90deg,#3b82f6 0%,#10b981 30%,#f59e0b 65%,#ef4444 100%);margin-bottom:.3rem;" data-astro-cid-efqp3qre> <div${addAttribute(`position:absolute;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff;border:2.5px solid ${bcBMIcat?.color};box-shadow:0 0 0 2px rgba(0,0,0,.2);left:${bcGaugePct}%;`, "style")} data-astro-cid-efqp3qre></div> </div> <div style="display:flex;justify-content:space-between;font-size:.6rem;color:var(--soft);" data-astro-cid-efqp3qre> <span data-astro-cid-efqp3qre>Underweight</span><span data-astro-cid-efqp3qre>Healthy</span><span data-astro-cid-efqp3qre>Overweight</span><span data-astro-cid-efqp3qre>Obese</span> </div> <div${addAttribute(`margin-top:.6rem;display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .7rem;border-radius:8px;background:${bcBMIcat?.color}18;border:1px solid ${bcBMIcat?.color}30;`, "style")} data-astro-cid-efqp3qre> <span${addAttribute(`font-size:.78rem;font-weight:800;color:${bcBMIcat?.color};`, "style")} data-astro-cid-efqp3qre>${bcBMIcat?.label}</span> </div> </div> <!-- Stats grid --> <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;margin-bottom:1rem;" data-astro-cid-efqp3qre> ${bcBodyFat !== null && renderTemplate`<div style="padding:.85rem;background:var(--bg);border:1px solid var(--border);border-radius:12px;text-align:center;" data-astro-cid-efqp3qre> <div${addAttribute(`font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:${bcBodyFat > 30 ? "var(--red)" : bcBodyFat > 20 ? "var(--gold)" : "var(--green)"};`, "style")} data-astro-cid-efqp3qre>${bcBodyFat}%</div> <div style="font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Est. Body Fat</div> <div style="font-size:.65rem;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>${bcGender === "male" ? "Ideal: 10\u201320%" : "Ideal: 18\u201328%"}</div> </div>`} ${bcBodyFat !== null && bcWeight > 0 && renderTemplate`<div style="padding:.85rem;background:var(--bg);border:1px solid var(--border);border-radius:12px;text-align:center;" data-astro-cid-efqp3qre> <div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;color:var(--blue);" data-astro-cid-efqp3qre>${toW(Math.round(bcWeight * (1 - bcBodyFat / 100) * 10) / 10)} ${wUnit}</div> <div style="font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--soft);margin-top:.2rem;" data-astro-cid-efqp3qre>Lean Mass</div> <div style="font-size:.65rem;color:var(--soft);margin-top:.15rem;" data-astro-cid-efqp3qre>Protect with protein</div> </div>`} </div> <!-- Healthy weight range --> ${bcHealthyMin && bcHealthyMax && renderTemplate`<div style="padding:.75rem 1rem;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);border-radius:11px;" data-astro-cid-efqp3qre> <div style="font-size:.7rem;font-weight:800;color:var(--soft);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.35rem;" data-astro-cid-efqp3qre>Healthy Weight Range for Your Height</div> <div style="display:flex;align-items:center;justify-content:space-between;" data-astro-cid-efqp3qre> <span style="font-weight:800;font-size:.92rem;color:var(--green);" data-astro-cid-efqp3qre>${dispHealthyMin} – ${dispHealthyMax} ${wUnit}</span> ${bcKgToHealthy > 0 ? renderTemplate`<span style="font-size:.75rem;font-weight:700;color:var(--gold);" data-astro-cid-efqp3qre>${dispToHealthy} ${wUnit} to go</span>` : renderTemplate`<span style="font-size:.75rem;font-weight:700;color:var(--green);" data-astro-cid-efqp3qre>✓ In range</span>`} </div> </div>`} <p style="font-size:.68rem;color:var(--muted);margin-top:.75rem;line-height:1.5;" data-astro-cid-efqp3qre>* BMI and body fat % are estimates. Not a substitute for professional medical assessment.</p> </div> </div>`, achievements.length > 0 && renderTemplate`<div class="card" style="animation-delay:.25s;" data-astro-cid-efqp3qre> <div class="ch" data-astro-cid-efqp3qre> <div class="ch-ic" style="background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 10px rgba(245,158,11,.2);" data-astro-cid-efqp3qre>🏆</div> <div style="flex:1;" data-astro-cid-efqp3qre><div class="ch-tt" data-astro-cid-efqp3qre>Achievements Earned</div><div class="ch-sub" data-astro-cid-efqp3qre>${achievements.length} badge${achievements.length !== 1 ? "s" : ""} unlocked</div></div> </div> <div class="cb" data-astro-cid-efqp3qre> <div class="ach-grid" data-astro-cid-efqp3qre> ${achievementsDisplay.map((a) => renderTemplate`<div${addAttribute(`ach-card ${a.isGreen ? "green-ach" : ""}`, "class")} data-astro-cid-efqp3qre> <div class="ach-icon" data-astro-cid-efqp3qre>${a.icon}</div> <div class="ach-body" data-astro-cid-efqp3qre> <div class="ach-name" data-astro-cid-efqp3qre>${a.name}</div> ${a.desc && renderTemplate`<div class="ach-desc" data-astro-cid-efqp3qre>${a.desc}</div>`} ${a.earnedDate && renderTemplate`<div class="ach-date" data-astro-cid-efqp3qre>Earned ${new Date(a.earnedDate).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</div>`} </div> </div>`)} </div> </div> </div>`, initialPhotos.length > 0 ? `${initialPhotos.length} photo${initialPhotos.length !== 1 ? "s" : ""}` : "No photos yet", initialPhotos.length > 0 ? renderTemplate`<div class="photo-grid" data-astro-cid-efqp3qre> ${initialPhotos.map((p) => renderTemplate`<div class="photo-thumb-wrap" data-astro-cid-efqp3qre> <img class="photo-thumb"${addAttribute(p.photo_data, "src")}${addAttribute(p.notes || "Progress photo", "alt")}${addAttribute(p.notes || new Date(p.taken_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }), "title")} data-astro-cid-efqp3qre> <div class="photo-date" data-astro-cid-efqp3qre>${(/* @__PURE__ */ new Date(p.taken_date + "T12:00:00")).toLocaleDateString("en", { month: "short", day: "numeric" })}</div> </div>`)} </div>` : renderTemplate`<div class="photo-empty" data-astro-cid-efqp3qre> <div class="photo-empty-icon" data-astro-cid-efqp3qre>📷</div> <div class="photo-empty-msg" data-astro-cid-efqp3qre>No photos yet</div> <div class="photo-empty-sub" data-astro-cid-efqp3qre>Capture your transformation! Adding weekly photos is the most motivating way to see your keto progress.</div> <button id="openPhotoModalEmpty" style="margin-top:.9rem;padding:.5rem 1.1rem;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;border:none;border-radius:9px;font-weight:800;font-size:.76rem;cursor:pointer;" data-astro-cid-efqp3qre>📸 Add First Photo</button> </div>`, userName, currentDay, maxDays, maxDays - currentDay, mUnit, addAttribute(units === "imperial" ? "16" : "40", "min"), addAttribute(units === "imperial" ? "79" : "200", "max"), addAttribute(units === "imperial" ? "e.g. 32" : "e.g. 81", "placeholder"), mUnit, addAttribute(units === "imperial" ? "16" : "40", "min"), addAttribute(units === "imperial" ? "79" : "200", "max"), addAttribute(units === "imperial" ? "e.g. 38" : "e.g. 97", "placeholder"), mUnit, addAttribute(units === "imperial" ? "16" : "40", "min"), addAttribute(units === "imperial" ? "79" : "200", "max"), addAttribute(units === "imperial" ? "e.g. 35" : "e.g. 89", "placeholder"), mUnit, addAttribute(units === "imperial" ? "8" : "20", "min"), addAttribute(units === "imperial" ? "32" : "81", "max"), addAttribute(units === "imperial" ? "e.g. 15" : "e.g. 38", "placeholder"), mUnit, addAttribute(units === "imperial" ? "6" : "15", "min"), addAttribute(units === "imperial" ? "32" : "81", "max"), addAttribute(units === "imperial" ? "e.g. 13" : "e.g. 33", "placeholder"), mUnit, addAttribute(units === "imperial" ? "8" : "20", "min"), addAttribute(units === "imperial" ? "47" : "120", "max"), addAttribute(units === "imperial" ? "e.g. 22" : "e.g. 56", "placeholder"), wUnit, addAttribute(units === "imperial" ? 66 : 30, "min"), addAttribute(units === "imperial" ? 660 : 300, "max"), addAttribute(units === "imperial" ? "e.g. 185" : "e.g. 84", "placeholder"), defineScriptVars({ units }), defineScriptVars({ units }), ["blood", "urine", "breath"].map((t) => renderTemplate`<button class="ktype-btn"${addAttribute(t, "data-type")} style="flex:1;padding:.5rem .3rem;border:1.5px solid var(--border);background:var(--bg);border-radius:9px;font-size:.72rem;font-weight:700;color:var(--soft);cursor:pointer;transition:all .15s;text-transform:capitalize;" data-astro-cid-efqp3qre>${t === "blood" ? "\u{1FA78}" : t === "urine" ? "\u{1F9EA}" : "\u{1F4A8}"} ${t}</button>`));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/progress.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/progress.astro";
const $$url = "/dashboard/progress";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Progress,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
