import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const DEFAULTS = {
  checkin_reminder: true,
  streak_warning: true,
  incomplete_tasks: true,
  weight_reminder: true,
  fasting_active: true,
  weekly_review: true,
  milestone: true,
  level_up: true
};
const GET = async ({ cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: "Unauthorized" }, 401);
  const { data: prefs } = await supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle();
  return json({ preferences: prefs || { user_id: user.id, ...DEFAULTS } });
};
const POST = async ({ cookies, request }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: "Unauthorized" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const row = {
    user_id: user.id,
    checkin_reminder: body.checkin_reminder ?? true,
    streak_warning: body.streak_warning ?? true,
    incomplete_tasks: body.incomplete_tasks ?? true,
    weight_reminder: body.weight_reminder ?? true,
    fasting_active: body.fasting_active ?? true,
    weekly_review: body.weekly_review ?? true,
    milestone: body.milestone ?? true,
    level_up: body.level_up ?? true,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { error } = await supabase.from("notification_preferences").upsert(row, { onConflict: "user_id" });
  if (error) return json({ error: error.message }, 500);
  return json({ success: true, preferences: row });
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
