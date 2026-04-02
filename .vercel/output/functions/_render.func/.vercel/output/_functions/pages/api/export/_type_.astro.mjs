import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params, cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);
  const { data: profile } = await supabase.from("profiles").select("preferred_units").eq("id", user.id).single();
  const imperial = (profile?.preferred_units || "imperial") === "imperial";
  const type = params.type;
  if (type === "weight") return exportWeight(user.id, imperial);
  if (type === "checkins") return exportCheckins(user.id);
  if (type === "food") return exportFood(user.id);
  if (type === "measurements") return exportMeasurements(user.id, imperial);
  return json({ error: "Unknown export type" }, 400);
};
async function exportWeight(userId, imperial) {
  const { data, error } = await supabase.from("weight_logs").select("logged_date, weight").eq("user_id", userId).order("logged_date", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  const unit = imperial ? "lbs" : "kg";
  const headers = ["Date", `Weight (${unit})`];
  const rows = (data || []).map((r) => [
    r.logged_date,
    imperial ? Math.round(r.weight * 2.20462 * 10) / 10 : r.weight
  ]);
  return csvResponse(headers, rows, "keto-weight.csv");
}
async function exportCheckins(userId) {
  const { data, error } = await supabase.from("daily_checkins").select(
    "checkin_date, energy_level, mood_level, hunger_level, water_glasses, had_headache, had_fatigue, had_cravings, brain_fog, fasted_today, followed_meals, xp_earned, note"
  ).eq("user_id", userId).order("checkin_date", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  const headers = [
    "Date",
    "Energy (1-10)",
    "Mood (1-10)",
    "Hunger (1-10)",
    "Water Glasses",
    "Headache",
    "Fatigue",
    "Cravings",
    "Brain Fog",
    "Fasted",
    "Followed Meals",
    "XP Earned",
    "Note"
  ];
  const rows = (data || []).map((r) => [
    r.checkin_date,
    r.energy_level,
    r.mood_level,
    r.hunger_level,
    r.water_glasses,
    r.had_headache ? "Yes" : "No",
    r.had_fatigue ? "Yes" : "No",
    r.had_cravings ? "Yes" : "No",
    r.brain_fog ? "Yes" : "No",
    r.fasted_today ? "Yes" : "No",
    r.followed_meals ? "Yes" : "No",
    r.xp_earned,
    csvEscape(r.note || "")
  ]);
  return csvResponse(headers, rows, "keto-checkins.csv");
}
async function exportFood(userId) {
  const { data, error } = await supabase.from("food_logs").select("logged_date, food_name, calories, protein_g, carbs_g, fat_g, meal_type, serving_size, serving_unit").eq("user_id", userId).order("logged_date", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  const headers = [
    "Date",
    "Food Name",
    "Meal Type",
    "Calories",
    "Protein (g)",
    "Carbs (g)",
    "Fat (g)",
    "Serving Size",
    "Serving Unit"
  ];
  const rows = (data || []).map((r) => [
    r.logged_date,
    csvEscape(r.food_name || ""),
    r.meal_type || "",
    r.calories,
    r.protein_g ?? "",
    r.carbs_g ?? "",
    r.fat_g ?? "",
    r.serving_size || "",
    r.serving_unit || ""
  ]);
  return csvResponse(headers, rows, "keto-food-log.csv");
}
async function exportMeasurements(userId, imperial) {
  const { data, error } = await supabase.from("body_measurements").select("logged_date, neck_cm, waist_cm, hips_cm, chest_cm, arm_cm, thigh_cm, notes").eq("user_id", userId).order("logged_date", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  const unit = imperial ? "in" : "cm";
  const conv = (v) => {
    if (v === null || v === void 0) return "";
    return imperial ? Math.round(v / 2.54 * 10) / 10 : v;
  };
  const headers = [
    "Date",
    `Neck (${unit})`,
    `Waist (${unit})`,
    `Hips (${unit})`,
    `Chest (${unit})`,
    `Arm (${unit})`,
    `Thigh (${unit})`,
    "Notes"
  ];
  const rows = (data || []).map((r) => [
    r.logged_date,
    conv(r.neck_cm),
    conv(r.waist_cm),
    conv(r.hips_cm),
    conv(r.chest_cm),
    conv(r.arm_cm),
    conv(r.thigh_cm),
    csvEscape(r.notes || "")
  ]);
  return csvResponse(headers, rows, "keto-measurements.csv");
}
function csvEscape(val) {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}
function csvResponse(headers, rows, filename) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map((v) => v === null || v === void 0 ? "" : String(v)).join(","));
  }
  const csv = lines.join("\r\n");
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
