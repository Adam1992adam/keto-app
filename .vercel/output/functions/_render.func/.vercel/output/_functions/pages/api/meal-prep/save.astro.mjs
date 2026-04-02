import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

async function getAuthUser(cookies) {
  const token = cookies.get("sb-access-token")?.value;
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}
const GET = async ({ cookies }) => {
  const user = await getAuthUser(cookies);
  if (!user) return json({ error: "Unauthorized" }, 401);
  const { data, error } = await supabase.from("meal_prep_plans").select("id, week_start_date, plan_data, created_at").eq("user_id", user.id).order("week_start_date", { ascending: false }).limit(1).maybeSingle();
  if (error) {
    console.error("meal-prep GET error:", error.message);
    return json({ error: error.message }, 500);
  }
  return json({ success: true, plan: data });
};
const POST = async ({ request, cookies }) => {
  const user = await getAuthUser(cookies);
  if (!user) return json({ error: "Unauthorized" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const { plan_data, week_start_date } = body;
  if (!plan_data || typeof plan_data !== "object") {
    return json({ error: "plan_data is required and must be an object" }, 400);
  }
  const today = /* @__PURE__ */ new Date();
  const dayOfWeek = today.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMon);
  const weekDate = week_start_date || monday.toISOString().split("T")[0];
  const row = {
    user_id: user.id,
    week_start_date: weekDate,
    plan_data
  };
  const { data, error } = await supabase.from("meal_prep_plans").upsert(row, { onConflict: "user_id,week_start_date" }).select().maybeSingle();
  if (error) {
    console.error("meal-prep POST error:", error.message);
    return json({ error: error.message }, 500);
  }
  return json({ success: true, plan: data });
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
