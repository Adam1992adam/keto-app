export { renderers } from '../../../renderers.mjs';

async function verifySignature(secret, body, signature) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const digest = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return digest === signature;
  } catch {
    return false;
  }
}
function determineTier(variantName, price) {
  const name = (variantName || "").toLowerCase().trim();
  if (name.includes("elite")) return { tier: "elite_12", days: 365 };
  if (name.includes("pro")) return { tier: "pro_6", days: 180 };
  if (name.includes("basic") || name.includes("basec")) return { tier: "basic_30", days: 30 };
  if (price >= 15e3) return { tier: "elite_12", days: 365 };
  if (price >= 5e3) return { tier: "pro_6", days: 180 };
  return { tier: "basic_30", days: 30 };
}
const POST = async ({ request, locals }) => {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const env = locals?.runtime?.env || {};
    const secret = env.LEMONSQUEEZY_SECRET || undefined                                    || "";
    if (secret) {
      const valid = await verifySignature(secret, rawBody, signature);
      if (!valid) {
        console.error("❌ Invalid signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    console.log("🍋 LEMONSQUEEZY WEBHOOK:", eventName);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));
    if (eventName !== "order_created") {
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const orderData = payload.data?.attributes || {};
    const buyerEmail = (orderData.user_email || "").trim().toLowerCase();
    const saleId = payload.data?.id || "";
    const price = orderData.total || 0;
    const status = orderData.status;
    const firstItem = orderData.first_order_item || {};
    const variantName = firstItem.variant_name || firstItem.product_name || "";
    const variantId = String(firstItem.variant_id || "");
    console.log("📧 Email:", buyerEmail);
    console.log("💰 Total (cents):", price);
    console.log("🏷️  Variant:", variantName, "| ID:", variantId);
    console.log("📊 Status:", status);
    if (!buyerEmail) {
      console.error("❌ No email in payload");
      return new Response(JSON.stringify({ error: "No email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (status !== "paid") {
      console.log("⚠️ Order not paid, skipping. Status:", status);
      return new Response(JSON.stringify({ received: true, skipped: true, reason: "not_paid" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { tier, days } = determineTier(variantName, price);
    console.log(`🎯 Tier: ${tier} | Days: ${days}`);
    const productName = (orderData.first_order_item?.product_name || "").toLowerCase();
    const isUpgrade = productName.includes("upgrade");
    console.log(`📦 Product: "${productName}" → ${isUpgrade ? "UPGRADE" : "NEW USER"}`);
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || "https://ltgxafioalbkjdfkkpxy.supabase.co";
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o";
    if (!SUPABASE_URL || !SUPABASE_KEY) ;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const startDate = (/* @__PURE__ */ new Date()).toISOString();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setDate(endDate.getDate() + days);
    const endISO = endDate.toISOString();
    if (isUpgrade) {
      const { data: users, error: searchErr } = await supabase.from("profiles").select("id, email, subscription_tier").ilike("email", buyerEmail);
      console.log("🔍 Upgrade search:", users?.length ? `Found: ${users[0].email} (${users[0].subscription_tier})` : "Not found");
      if (searchErr) console.error("Search error:", searchErr.message);
      if (users && users.length > 0) {
        const { error: updateErr } = await supabase.from("profiles").update({
          subscription_tier: tier,
          subscription_status: "active",
          subscription_start_date: startDate,
          subscription_end_date: endISO,
          payhip_sale_id: saleId,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", users[0].id);
        if (updateErr) {
          console.error("❌ Upgrade update error:", updateErr.message);
          return new Response(JSON.stringify({ error: updateErr.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
        console.log(`✅ UPGRADED: ${buyerEmail} → ${tier}`);
        return new Response(JSON.stringify({ success: true, status: "upgraded", tier, email: buyerEmail }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        console.log("⚠️ Upgrade but no profile found — saving to pending");
      }
    }
    const { error: upsertError } = await supabase.from("pending_activations").upsert({
      email: buyerEmail,
      subscription_tier: tier,
      subscription_start_date: startDate,
      subscription_end_date: endISO,
      payhip_sale_id: saleId,
      payhip_data: payload,
      activated: false,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "email" });
    if (upsertError) {
      console.error("❌ Upsert error:", upsertError.message);
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(`✅ Saved to pending_activations: ${buyerEmail} → ${tier}`);
    return new Response(JSON.stringify({ success: true, status: "pending", tier, email: buyerEmail }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("❌ LemonSqueezy webhook error:", err);
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
    message: "LemonSqueezy webhook endpoint",
    status: "ready",
    event: "order_created"
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
