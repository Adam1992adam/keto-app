import { s as supabase, d as getUserJourney } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { a as autoCompleteTask } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: "Unauthorized" }, 401);
  try {
    const body = await request.json();
    const {
      mood,
      mood_level,
      energy_level,
      hunger_level,
      notes,
      note,
      highlights,
      challenges,
      reflection_date,
      client_date
    } = body;
    if (mood_level !== void 0 && (mood_level < 1 || mood_level > 5)) return json({ error: "mood_level must be 1–5" }, 400);
    if (energy_level !== void 0 && (energy_level < 1 || energy_level > 5)) return json({ error: "energy_level must be 1–5" }, 400);
    if (hunger_level !== void 0 && (hunger_level < 1 || hunger_level > 5)) return json({ error: "hunger_level must be 1–5" }, 400);
    const serverDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const safeClientDate = (d) => d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
    const today = safeClientDate(client_date) || serverDate;
    const reflDate = safeClientDate(reflection_date) || today;
    const serverTs = new Date(serverDate).getTime();
    const reflTs = new Date(reflDate).getTime();
    if (reflTs > serverTs + 864e5) return json({ error: "Cannot save a future reflection" }, 400);
    if (serverTs - reflTs > 90 * 864e5) return json({ error: "Reflection date is too far in the past" }, 400);
    const journey = await getUserJourney(user.id);
    if (!journey) return json({ error: "Journey not found" }, 404);
    const { error } = await supabase.from("daily_reflections").upsert({
      user_id: user.id,
      day_number: journey.current_day,
      reflection_date: reflDate,
      mood: mood || null,
      mood_level: mood_level || null,
      energy_level: energy_level || null,
      hunger_level: hunger_level || null,
      notes: notes || note || null,
      note: note || notes || null,
      highlights: highlights || null,
      challenges: challenges || null
    }, {
      onConflict: "user_id,reflection_date"
    });
    if (error) throw error;
    if (reflDate === today) {
      await supabase.rpc("award_xp", {
        user_id_param: user.id,
        action_type_param: "reflection",
        xp_amount_param: 15,
        description_param: "Daily Reflection",
        day_number_param: journey.current_day
      });
      await autoCompleteTask(user.id, "reflection", journey.current_day);
    }
    return json({ success: true });
  } catch (error) {
    console.error("Error saving reflection:", error);
    return json({ error: "Failed to save" }, 500);
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
