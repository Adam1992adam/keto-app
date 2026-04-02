import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const logged_date = body.logged_date || today;
  const row = { user_id: user.id, logged_date };
  const fields = ["neck_cm", "waist_cm", "hips_cm", "chest_cm", "arm_cm", "thigh_cm", "notes"];
  for (const f of fields) {
    if (body[f] !== void 0 && body[f] !== null && body[f] !== "") {
      row[f] = f === "notes" ? body[f] : parseFloat(body[f]);
    }
  }
  if (Object.keys(row).length <= 2) {
    return json({ error: "Provide at least one measurement" }, 400);
  }
  const { error } = await supabase.from("body_measurements").upsert(row, { onConflict: "user_id,logged_date" });
  if (error) {
    console.error("Measurements save error:", error);
    return json({ error: error.message }, 500);
  }
  return json({ success: true });
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
