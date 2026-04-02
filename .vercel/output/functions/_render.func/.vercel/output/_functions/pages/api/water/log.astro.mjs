import { createClient } from '@supabase/supabase-js';
import { a as autoCompleteTask } from '../../../chunks/autoTask_56RvAK6X.mjs';
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
    const body = await request.json();
    const delta = body.delta === -1 ? -1 : 1;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { data: existing } = await db.from("daily_checkins").select("water_glasses").eq("user_id", user.id).eq("checkin_date", today).maybeSingle();
    const current = existing?.water_glasses ?? 0;
    const newCount = Math.max(0, Math.min(20, current + delta));
    await db.from("daily_checkins").upsert({
      user_id: user.id,
      checkin_date: today,
      water_glasses: newCount
    }, { onConflict: "user_id,checkin_date" });
    const { data: journey } = await db.from("user_journey").select("current_day").eq("user_id", user.id).single();
    const dayNumber = journey?.current_day || 1;
    await db.from("water_intake").upsert({
      user_id: user.id,
      day_number: dayNumber,
      date: today,
      glasses_count: newCount,
      target_glasses: 8,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "user_id,day_number" });
    if (newCount >= 8) {
      await autoCompleteTask(user.id, "water", dayNumber);
    }
    return json({ success: true, glasses: newCount });
  } catch (err) {
    console.error("Water log error:", err);
    return json({ error: "Server error" }, 500);
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
