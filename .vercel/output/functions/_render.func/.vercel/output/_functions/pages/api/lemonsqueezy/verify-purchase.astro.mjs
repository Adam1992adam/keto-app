export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
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
    const { data: existingProfile } = await supabase.from("profiles").select("id, email, subscription_tier").eq("email", email).maybeSingle();
    if (existingProfile) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        reason: "already_registered",
        message: "This email is already registered. Please login instead."
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: pending } = await supabase.from("pending_activations").select("*").eq("email", email).eq("activated", false).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!pending) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        reason: "no_purchase",
        message: "No purchase found for this email."
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const tierDays = {
      basic_30: 30,
      pro_6: 180,
      elite_12: 365
    };
    const tier = pending.subscription_tier || "basic_30";
    const days = tierDays[tier] || 30;
    const startDate = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setDate(endDate.getDate() + days);
    console.log(`✅ Purchase verified: ${email} → ${tier}`);
    return new Response(JSON.stringify({
      success: true,
      canSignup: true,
      purchase: {
        email,
        tier,
        days,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        sale_id: pending.payhip_sale_id || pending.sale_id || ""
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("verify-purchase error:", err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async () => {
  return new Response(JSON.stringify({
    message: "Verify Purchase API",
    usage: 'POST {"email":"buyer@example.com"}'
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
