import { createClient } from '@supabase/supabase-js';
import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return json({ error: "Unauthorized" }, 401);
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return json({ error: "Unauthorized" }, 401);
    const db = createClient(
      "https://ltgxafioalbkjdfkkpxy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );
    const body = await request.json();
    const { meal_type, recipe_id, day_number, action = "complete", client_date } = body;
    if (!meal_type || !day_number) return json({ error: "meal_type and day_number are required" }, 400);
    if (action === "uncomplete") {
      await db.from("meal_completions").delete().eq("user_id", user.id).eq("day_number", day_number).eq("meal_type", meal_type);
      return json({ success: true, xp_earned: 0, action: "uncomplete" });
    }
    const { error: upsertErr } = await db.from("meal_completions").upsert(
      { user_id: user.id, day_number, meal_type, recipe_id: recipe_id || null, xp_earned: 10 },
      { onConflict: "user_id,day_number,meal_type", ignoreDuplicates: true }
    );
    if (upsertErr) return json({ error: upsertErr.message }, 500);
    await db.rpc("award_xp", {
      user_id_param: user.id,
      action_type_param: "meal_complete",
      xp_amount_param: 10,
      description_param: `Ate ${meal_type}`,
      day_number_param: day_number
    });
    await db.rpc("complete_task", {
      user_id_param: user.id,
      day_number_param: day_number,
      task_type_param: "meal"
    });
    const { data: completions } = await db.from("meal_completions").select("meal_type, recipe_id").eq("user_id", user.id).eq("day_number", day_number);
    const mealsToday = completions?.length || 0;
    const followed = mealsToday >= 3;
    if (followed) {
      const serverDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const today = client_date && /^\d{4}-\d{2}-\d{2}$/.test(client_date) ? client_date : serverDate;
      await db.from("daily_checkins").upsert(
        { user_id: user.id, checkin_date: today, followed_meals: true },
        { onConflict: "user_id,checkin_date", ignoreDuplicates: false }
      );
    }
    const completedRecipeIds = (completions || []).map((c) => c.recipe_id).filter(Boolean);
    let macros = { calories: 0, protein: 0, fat: 0, net_carbs: 0 };
    if (completedRecipeIds.length > 0) {
      const { data: recipes } = await db.from("recipes").select("calories, protein, fat, net_carbs").in("id", completedRecipeIds);
      macros = (recipes || []).reduce((acc, r) => ({
        calories: acc.calories + (r.calories || 0),
        protein: acc.protein + parseFloat(r.protein || 0),
        fat: acc.fat + parseFloat(r.fat || 0),
        net_carbs: acc.net_carbs + parseFloat(r.net_carbs || 0)
      }), macros);
    }
    return json({ success: true, xp_earned: 10, meals_today: mealsToday, followed, macros });
  } catch (err) {
    console.error("Meal complete error:", err);
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
