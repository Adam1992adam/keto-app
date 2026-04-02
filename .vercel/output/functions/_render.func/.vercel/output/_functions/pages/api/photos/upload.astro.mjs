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
  const { photo_data, taken_date, notes } = body;
  if (!photo_data || typeof photo_data !== "string") {
    return json({ error: "photo_data is required" }, 400);
  }
  const approxBytes = photo_data.length * 0.75;
  if (approxBytes > 500 * 1024) {
    return json({ error: "Image too large. Maximum size is 500KB after compression." }, 400);
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const takenDate = taken_date || today;
  const { data, error } = await supabase.from("progress_photos").insert({
    user_id: user.id,
    photo_data,
    taken_date: takenDate,
    notes: notes || null
  }).select("id, taken_date, notes, created_at").single();
  if (error) {
    console.error("Photo upload error:", error);
    return json({ error: error.message }, 500);
  }
  return json({ success: true, photo: data });
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
