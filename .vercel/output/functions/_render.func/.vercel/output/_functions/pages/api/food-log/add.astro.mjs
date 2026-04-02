import { createClient } from '@supabase/supabase-js';
import { a as autoCompleteTask } from '../../../chunks/autoTask_56RvAK6X.mjs';
export { renderers } from '../../../renderers.mjs';

const MEAL_TASK_TYPES = /* @__PURE__ */ new Set(["breakfast", "lunch", "dinner", "snack"]);
const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return json({ error: "Unauthorized" }, 401);
    const db = createClient(
      "https://ltgxafioalbkjdfkkpxy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );
    const { data: { user }, error: authErr } = await db.auth.getUser();
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);
    const body = await request.json();
    const { food_name, calories, protein_g, fat_g, carbs_g, meal_type, notes } = body;
    if (!food_name?.trim()) return json({ error: "Food name is required" }, 400);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { data: journey } = await db.from("user_journey").select("current_day").eq("user_id", user.id).maybeSingle();
    const dayNumber = journey?.current_day || 1;
    const { data, error } = await db.from("food_logs").insert({
      user_id: user.id,
      logged_date: today,
      day_number: dayNumber,
      meal_type: meal_type || "other",
      food_name: food_name.trim(),
      calories: Math.round(Math.max(0, calories || 0)),
      protein_g: Math.max(0, parseFloat(protein_g) || 0),
      fat_g: Math.max(0, parseFloat(fat_g) || 0),
      carbs_g: Math.max(0, parseFloat(carbs_g) || 0),
      notes: notes || null
    }).select().single();
    if (error) throw error;
    const mt = meal_type || "other";
    if (MEAL_TASK_TYPES.has(mt)) {
      await autoCompleteTask(user.id, mt, dayNumber);
    }
    return json({ success: true, entry: data });
  } catch (err) {
    console.error("Food log add error:", err);
    return json({ error: err.message || "Server error" }, 500);
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
