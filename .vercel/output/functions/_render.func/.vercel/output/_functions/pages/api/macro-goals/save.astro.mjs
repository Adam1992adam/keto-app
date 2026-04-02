import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

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
    const { daily_calories, protein_g, fat_g, carbs_g } = await request.json();
    if (!daily_calories || daily_calories < 500 || daily_calories > 1e4)
      return json({ error: "Invalid calorie value" }, 400);
    const { error } = await db.from("macro_goals").upsert(
      {
        user_id: user.id,
        daily_calories: Math.round(daily_calories),
        protein_g: Math.round(protein_g || 0),
        fat_g: Math.round(fat_g || 0),
        carbs_g: Math.round(carbs_g || 0),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      { onConflict: "user_id" }
    );
    if (error) throw error;
    return json({ success: true });
  } catch (err) {
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
