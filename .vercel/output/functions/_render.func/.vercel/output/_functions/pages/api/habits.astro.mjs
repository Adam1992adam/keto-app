import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

function db(token) {
  return createClient(
    "https://ltgxafioalbkjdfkkpxy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}
const GET = async ({ cookies, url }) => {
  try {
    const token = cookies.get("sb-access-token")?.value;
    if (!token) return json({ error: "Unauthorized" }, 401);
    const supabase = db(token);
    const { data: { user }, error: ae } = await supabase.auth.getUser();
    if (ae || !user) return json({ error: "Unauthorized" }, 401);
    const dateParam = url.searchParams.get("date") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { data: habits, error: he } = await supabase.from("habits").select("*").eq("user_id", user.id).eq("is_active", true).order("sort_order").order("created_at");
    if (he) throw he;
    const { data: completions } = await supabase.from("habit_completions").select("habit_id, completed_date").eq("user_id", user.id).gte("completed_date", new Date(Date.now() - 29 * 864e5).toISOString().split("T")[0]);
    return json({ habits: habits || [], completions: completions || [], date: dateParam });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
const POST = async ({ request, cookies }) => {
  try {
    const token = cookies.get("sb-access-token")?.value;
    if (!token) return json({ error: "Unauthorized" }, 401);
    const supabase = db(token);
    const { data: { user }, error: ae } = await supabase.auth.getUser();
    if (ae || !user) return json({ error: "Unauthorized" }, 401);
    const { title, icon, category, frequency, target_streak } = await request.json();
    if (!title?.trim()) return json({ error: "Title required" }, 400);
    const { data, error } = await supabase.from("habits").insert({
      user_id: user.id,
      title: title.trim(),
      icon: icon || "✅",
      category: category || "general",
      frequency: frequency || "daily",
      target_streak: target_streak || 7
    }).select().single();
    if (error) throw error;
    return json({ success: true, habit: data });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
