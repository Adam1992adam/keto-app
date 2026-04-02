export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { email, password, fullName, adminPassword } = await request.json();
    if (!email || !password || !fullName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const env = locals?.runtime?.env || {};
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || "aouni0005@@@";
    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || "https://ltgxafioalbkjdfkkpxy.supabase.co";
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o";
    if (!SUPABASE_URL || !SUPABASE_KEY) ;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const cleanEmail = email.trim().toLowerCase();
    const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", cleanEmail).maybeSingle();
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!authData.user) {
      return new Response(JSON.stringify({ error: "Failed to create user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userId = authData.user.id;
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: cleanEmail,
      full_name: fullName,
      subscription_tier: "elite_12",
      // الأدمن يحصل على أعلى خطة
      subscription_status: "active",
      subscription_end_date: (/* @__PURE__ */ new Date("2099-12-31")).toISOString(),
      is_admin: true,
      preferred_units: "metric",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (profileError) {
      console.error("Admin profile insert error:", profileError.message);
    }
    console.log(`✅ Admin account created: ${cleanEmail}`);
    return new Response(JSON.stringify({
      success: true,
      message: "Admin account created successfully",
      user: {
        id: userId,
        email: cleanEmail,
        is_admin: true
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("signup error:", err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
