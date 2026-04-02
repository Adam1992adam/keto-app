export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals, cookies }) => {
  const adminSession = cookies.get("admin-session")?.value;
  if (adminSession !== "authenticated") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { id, email, tier } = await request.json();
    const env = locals?.runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || "https://ltgxafioalbkjdfkkpxy.supabase.co";
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o";
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const days = tier === "basic_30" ? 30 : tier === "pro_6" ? 180 : 365;
    const endDate = /* @__PURE__ */ new Date();
    endDate.setDate(endDate.getDate() + days);
    const { data: users } = await supabase.from("profiles").select("id").ilike("email", email);
    if (users && users.length > 0) {
      await supabase.from("profiles").update({
        subscription_tier: tier,
        subscription_status: "active",
        subscription_start_date: (/* @__PURE__ */ new Date()).toISOString(),
        subscription_end_date: endDate.toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", users[0].id);
    }
    await supabase.from("pending_activations").update({
      activated: true,
      activated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
