import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return json({ error: "Unauthorized" }, 401);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);
    const { protocol, target_hours, started_at } = await request.json();
    await supabase.from("fasting_sessions").update({ ended_at: (/* @__PURE__ */ new Date()).toISOString(), completed: false }).eq("user_id", user.id).is("ended_at", null);
    const { data, error } = await supabase.from("fasting_sessions").insert({
      user_id: user.id,
      protocol: protocol || "16_8",
      target_hours: target_hours || 16,
      started_at: started_at || (/* @__PURE__ */ new Date()).toISOString(),
      completed: false
    }).select("id").single();
    if (error) throw error;
    return json({ success: true, id: data.id });
  } catch (err) {
    return json({ error: err.message }, 500);
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
