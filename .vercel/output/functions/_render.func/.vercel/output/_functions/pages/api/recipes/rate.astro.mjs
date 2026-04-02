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
    const { recipeId, rating } = await request.json();
    if (!recipeId) return json({ error: "recipeId required" }, 400);
    const r = parseInt(rating, 10);
    if (!r || r < 1 || r > 5) return json({ error: "rating must be 1–5" }, 400);
    const { error: upsertErr } = await db.from("recipe_ratings").upsert(
      { user_id: user.id, recipe_id: recipeId, rating: r, updated_at: (/* @__PURE__ */ new Date()).toISOString() },
      { onConflict: "user_id,recipe_id" }
    );
    if (upsertErr) throw upsertErr;
    const { data: avgRow } = await db.from("recipe_avg_ratings").select("avg_rating, rating_count").eq("recipe_id", recipeId).maybeSingle();
    return json({
      success: true,
      userRating: r,
      avg: avgRow?.avg_rating || r,
      count: avgRow?.rating_count || 1
    });
  } catch (err) {
    console.error("Rate recipe error:", err);
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
