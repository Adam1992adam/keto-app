import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { a as autoCompleteTask, c as checkAchievements } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return json({ error: "Unauthorized" }, 401);
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) return json({ error: "Unauthorized" }, 401);
    const body = await request.json();
    const serverDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const today = body.client_date && /^\d{4}-\d{2}-\d{2}$/.test(body.client_date) ? body.client_date : serverDate;
    const {
      energy_level,
      mood_level,
      hunger_level,
      brain_fog,
      had_headache,
      had_fatigue,
      had_cravings,
      followed_meals,
      water_glasses,
      fasted_today,
      note,
      xp_earned,
      symptoms,
      electrolytes,
      sleep_hours,
      sleep_quality,
      took_sodium,
      took_potassium,
      took_magnesium
    } = body;
    if (energy_level !== void 0 && (energy_level < 1 || energy_level > 5)) return json({ error: "energy_level must be 1–5" }, 400);
    if (mood_level !== void 0 && (mood_level < 1 || mood_level > 5)) return json({ error: "mood_level must be 1–5" }, 400);
    if (hunger_level !== void 0 && (hunger_level < 1 || hunger_level > 5)) return json({ error: "hunger_level must be 1–5" }, 400);
    if (water_glasses !== void 0 && (water_glasses < 0 || water_glasses > 20)) return json({ error: "water_glasses must be 0–20" }, 400);
    if (sleep_hours !== void 0 && sleep_hours !== null && (sleep_hours < 0 || sleep_hours > 24)) return json({ error: "sleep_hours must be 0–24" }, 400);
    if (sleep_quality !== void 0 && sleep_quality !== null && (sleep_quality < 1 || sleep_quality > 5)) return json({ error: "sleep_quality must be 1–5" }, 400);
    const { error: checkinError } = await supabase.from("daily_checkins").upsert({
      user_id: user.id,
      checkin_date: today,
      energy_level: energy_level || 3,
      mood_level: mood_level || 3,
      hunger_level: hunger_level || 3,
      brain_fog: brain_fog || false,
      had_headache: had_headache || false,
      had_fatigue: had_fatigue || false,
      had_cravings: had_cravings || false,
      followed_meals: followed_meals ?? true,
      water_glasses: water_glasses || 0,
      fasted_today: fasted_today || false,
      note: note || "",
      xp_earned: xp_earned || 30,
      sleep_hours: sleep_hours || null,
      sleep_quality: sleep_quality || null,
      took_sodium: took_sodium || false,
      took_potassium: took_potassium || false,
      took_magnesium: took_magnesium || false
    }, { onConflict: "user_id,checkin_date" });
    if (checkinError) throw checkinError;
    const { error: xpRpcErr } = await supabase.rpc("award_xp", {
      user_id_param: user.id,
      action_type_param: "daily_checkin",
      xp_amount_param: xp_earned || 30,
      description_param: `Daily check-in — ${today}`,
      day_number_param: null
    });
    if (xpRpcErr) {
      console.warn("award_xp RPC failed, updating user_journey directly:", xpRpcErr.message);
      const { data: journey } = await supabase.from("user_journey").select("total_xp, level").eq("user_id", user.id).maybeSingle();
      if (journey) {
        const newXP = (journey.total_xp || 0) + (xp_earned || 30);
        const newLvl = Math.floor(newXP / 500) + 1;
        await supabase.from("user_journey").update({ total_xp: newXP, level: newLvl }).eq("user_id", user.id);
      }
    }
    try {
      await supabase.from("xp_transactions").insert({
        user_id: user.id,
        action_type: "daily_checkin",
        xp_amount: xp_earned || 30,
        description: `Daily check-in — ${today}`
      });
    } catch (err) {
      console.warn("xp_transactions insert warn:", err?.message);
    }
    let currentDay = 1;
    try {
      const newDay = await supabase.rpc("update_current_day", { user_id_param: user.id });
      if (newDay.data) currentDay = newDay.data;
      else {
        const { data: uj } = await supabase.from("user_journey").select("current_day").eq("user_id", user.id).maybeSingle();
        if (uj) currentDay = uj.current_day;
      }
    } catch (e) {
      console.warn("update_current_day warn:", e?.message);
    }
    await autoCompleteTask(user.id, "checkin", currentDay);
    if ((water_glasses || 0) >= 8) {
      await autoCompleteTask(user.id, "water", currentDay);
    }
    if (electrolytes && (electrolytes.sodium || electrolytes.potassium || electrolytes.magnesium)) {
      const elecNote = `[Electrolytes: Na=${electrolytes.sodium}, K=${electrolytes.potassium}, Mg=${electrolytes.magnesium}]`;
      try {
        await supabase.from("daily_checkins").update({ note: (note ? note + "\n" : "") + elecNote }).eq("user_id", user.id).eq("checkin_date", today);
      } catch (err) {
        console.warn("Electrolyte note update warn:", err?.message);
      }
    }
    const dangerSymptoms = (symptoms || []).filter(
      (s) => ["headache", "dizziness", "cramps", "fatigue"].includes(s)
    );
    const autoAdvice = dangerSymptoms.length >= 2 ? "KETO_FLU_ALERT" : null;
    checkAchievements(user.id, accessToken);
    return json({ success: true, xp_earned: xp_earned || 30, autoAdvice });
  } catch (error) {
    console.error("Checkin save error:", error);
    return json({ error: error.message || "Failed to save" }, 500);
  }
};
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
