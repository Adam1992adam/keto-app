import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ request, cookies }) => {
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
    const { habit_id } = await request.json();
    if (!habit_id) return json({ error: "habit_id required" }, 400);
    const { error } = await supabase.from("habits").update({ is_active: false }).eq("id", habit_id).eq("user_id", user.id);
    if (error) throw error;
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
