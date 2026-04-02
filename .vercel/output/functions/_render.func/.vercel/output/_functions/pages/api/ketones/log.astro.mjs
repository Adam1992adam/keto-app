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
    const { ketone_mmol, measurement_type, logged_date, notes } = await request.json();
    const val = parseFloat(ketone_mmol);
    if (isNaN(val) || val < 0 || val > 30)
      return json({ error: "Invalid ketone value (0–30 mmol/L)" }, 400);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { data, error } = await db.from("ketone_logs").insert({
      user_id: user.id,
      ketone_mmol: val,
      measurement_type: measurement_type || "blood",
      logged_date: logged_date || today,
      notes: notes || null
    }).select().single();
    if (error) throw error;
    return json({ success: true, entry: data });
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
