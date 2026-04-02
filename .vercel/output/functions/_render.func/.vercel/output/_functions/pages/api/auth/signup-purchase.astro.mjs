export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { email, password, fullName, tier, startDate, endDate, saleId } = await request.json();
    if (!email || !password || !fullName || !tier) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validTiers = ["basic_30", "pro_6", "elite_12"];
    if (!validTiers.includes(tier)) {
      return new Response(JSON.stringify({ error: "Invalid tier" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const env = locals?.runtime?.env || {};
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
      console.error("Auth signup error:", authError.message);
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
    const tierDays = {
      basic_30: 30,
      pro_6: 180,
      elite_12: 365
    };
    const subStart = startDate ? new Date(startDate) : /* @__PURE__ */ new Date();
    const subEnd = endDate ? new Date(endDate) : new Date(Date.now() + tierDays[tier] * 864e5);
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: cleanEmail,
      full_name: fullName,
      subscription_tier: tier,
      subscription_status: "active",
      subscription_start_date: subStart.toISOString(),
      subscription_end_date: subEnd.toISOString(),
      payhip_sale_id: saleId || null,
      preferred_units: "imperial",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (profileError) {
      console.error("Profile insert error:", profileError.message);
    }
    await supabase.from("pending_activations").update({
      activated: true,
      activated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("email", cleanEmail).eq("activated", false);
    console.log(`✅ New user registered: ${cleanEmail} | tier: ${tier}`);
    try {
      const { sendWelcomeEmail } = await import('../../../chunks/email_CChWb1pC.mjs');
      await sendWelcomeEmail(cleanEmail, fullName, tier).catch(() => {
      });
    } catch {
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        email: cleanEmail,
        tier
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("signup-purchase error:", err);
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
