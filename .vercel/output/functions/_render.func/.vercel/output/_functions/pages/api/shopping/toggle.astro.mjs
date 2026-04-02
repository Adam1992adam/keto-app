import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return json({ error: "Unauthorized" }, 401);
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return json({ error: "Unauthorized" }, 401);
    const { week_number, item_key, is_checked } = await request.json();
    if (!week_number || !item_key) return json({ error: "week_number and item_key are required" }, 400);
    if (!is_checked) {
      await supabase.from("shopping_checks").delete().eq("user_id", user.id).eq("week_number", week_number).eq("item_key", item_key.toLowerCase().trim());
    } else {
      await supabase.from("shopping_checks").upsert(
        {
          user_id: user.id,
          week_number,
          item_key: item_key.toLowerCase().trim(),
          is_checked: true,
          checked_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "user_id,week_number,item_key" }
      );
    }
    return json({ success: true, is_checked });
  } catch (err) {
    console.error("Shopping toggle error:", err);
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
