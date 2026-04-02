import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const token = cookies.get("sb-access-token")?.value;
    if (!token) return json({ error: "Unauthorized" }, 401);
    const supabase = createClient(
      "https://ltgxafioalbkjdfkkpxy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: ae } = await supabase.auth.getUser();
    if (ae || !user) return json({ error: "Unauthorized" }, 401);
    const { habit_id, date, day_number } = await request.json();
    if (!habit_id) return json({ error: "habit_id required" }, 400);
    const today = date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { data: existing } = await supabase.from("habit_completions").select("id").eq("habit_id", habit_id).eq("completed_date", today).maybeSingle();
    if (existing) {
      await supabase.from("habit_completions").delete().eq("id", existing.id);
      return json({ success: true, completed: false });
    } else {
      await supabase.from("habit_completions").insert({
        user_id: user.id,
        habit_id,
        completed_date: today
      });
      await supabase.rpc("award_xp", {
        user_id_param: user.id,
        action_type_param: "habit_complete",
        xp_amount_param: 5,
        description_param: "Completed a daily habit",
        day_number_param: day_number || 1
      });
      return json({ success: true, completed: true, xp_earned: 5 });
    }
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
