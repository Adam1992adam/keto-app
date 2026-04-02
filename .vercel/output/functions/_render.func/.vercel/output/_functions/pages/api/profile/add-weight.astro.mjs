import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { a as autoCompleteTask, c as checkAchievements } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return json({ error: "Unauthorized" }, 401);
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return json({ error: "Unauthorized" }, 401);
    const body = await request.json();
    const weight = parseFloat(body.weight ?? body.weight_kg);
    const logged_date = body.logged_date || body.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (isNaN(weight) || weight <= 0) return json({ error: "Invalid weight value" }, 400);
    const { error: logError } = await supabase.from("weight_logs").upsert(
      { user_id: user.id, weight, logged_date, notes: body.notes || null },
      { onConflict: "user_id,logged_date" }
    );
    if (logError) {
      console.error("Weight log error:", logError);
      return json({ error: "Failed to add weight" }, 500);
    }
    await supabase.from("profiles").update({ weight_kg: weight, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", user.id);
    const { data: logs } = await supabase.from("weight_logs").select("weight").eq("user_id", user.id).order("logged_date", { ascending: true });
    if (logs && logs.length >= 2) {
      const weightLost = logs[0].weight - weight;
      if (weightLost >= 1) {
        await supabase.from("achievements").upsert(
          { user_id: user.id, achievement_type: "weight_loss_1kg", achievement_name: "First Kilo Lost" },
          { onConflict: "user_id,achievement_type,achievement_name" }
        );
      }
      if (weightLost >= 5) {
        await supabase.from("achievements").upsert(
          { user_id: user.id, achievement_type: "weight_loss_5kg", achievement_name: "Five Kilos Down" },
          { onConflict: "user_id,achievement_type,achievement_name" }
        );
      }
    }
    const { data: uj } = await supabase.from("user_journey").select("current_day").eq("user_id", user.id).single();
    if (uj) await autoCompleteTask(user.id, "weight", uj.current_day);
    checkAchievements(user.id, accessToken);
    return json({ success: true });
  } catch (err) {
    console.error("Add weight error:", err);
    return json({ error: "Server error" }, 500);
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
