export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, locals }) => {
  const startTime = Date.now();
  try {
    const authHeader = request.headers.get("authorization");
    const runtime = locals?.runtime || {};
    const env = runtime?.env || {};
    const CRON_SECRET = env.CRON_SECRET || "4a282bfba3717aaa347998c82c8d720963482573b28d459aa970329afbf9394c";
    if (!CRON_SECRET) ;
    const expectedAuth = `Bearer ${CRON_SECRET}`;
    if (authHeader !== expectedAuth) {
      console.error("❌ Unauthorized. Expected:", expectedAuth.substring(0, 20) + "...");
      console.error("❌ Received:", authHeader ? authHeader.substring(0, 20) + "..." : "none");
      return new Response(JSON.stringify({
        success: false,
        error: "Unauthorized"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("✅ Authorization verified");
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || "https://ltgxafioalbkjdfkkpxy.supabase.co";
    const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || undefined                                         ;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("❌ Supabase credentials missing");
      return new Response(JSON.stringify({
        success: false,
        error: "Database configuration error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("✅ Supabase credentials found");
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    console.log(`🔍 Checking for expired subscriptions at ${now}`);
    const { data: expiredUsers, error: fetchError } = await supabase.from("profiles").select("id, email, full_name, subscription_tier, subscription_end_date, subscription_status").eq("subscription_status", "active").lt("subscription_end_date", now);
    if (fetchError) {
      console.error("❌ Database fetch error:", fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "Database fetch failed",
        details: fetchError.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(`📊 Found ${expiredUsers?.length || 0} expired subscription(s)`);
    if (!expiredUsers || expiredUsers.length === 0) {
      const executionTime2 = Date.now() - startTime;
      console.log(`✅ No subscriptions to expire (took ${executionTime2}ms)`);
      return new Response(JSON.stringify({
        success: true,
        message: "No subscriptions to expire",
        expired_count: 0,
        execution_time_ms: executionTime2,
        timestamp: now
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userIds = expiredUsers.map((u) => u.id);
    console.log("🔄 Updating subscription statuses...");
    const { error: updateError } = await supabase.from("profiles").update({
      subscription_status: "expired"
    }).in("id", userIds);
    if (updateError) {
      console.error("❌ Database update error:", updateError);
      return new Response(JSON.stringify({
        success: false,
        error: "Database update failed",
        details: updateError.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const executionTime = Date.now() - startTime;
    console.log(`✅ Successfully expired ${expiredUsers.length} subscription(s):`);
    expiredUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.email} - ${u.subscription_tier}`);
    });
    console.log(`⏱️  Execution time: ${executionTime}ms`);
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully expired ${expiredUsers.length} subscription(s)`,
      expired_count: expiredUsers.length,
      expired_users: expiredUsers.map((u) => ({
        email: u.email,
        name: u.full_name,
        tier: u.subscription_tier,
        end_date: u.subscription_end_date
      })),
      execution_time_ms: executionTime,
      timestamp: now
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error("❌ Fatal error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      execution_time_ms: executionTime
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = GET;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
