import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ request, cookies }) => {
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
    const { id } = await request.json();
    if (!id) return json({ error: "id required" }, 400);
    await db.from("food_logs").delete().eq("id", id).eq("user_id", user.id);
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
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
