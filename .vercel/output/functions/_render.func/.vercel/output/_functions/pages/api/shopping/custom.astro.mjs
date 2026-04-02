import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

function db(token) {
  return createClient(
    "https://ltgxafioalbkjdfkkpxy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}
async function getUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  return error ? null : user;
}
const POST = async ({ request, cookies }) => {
  const token = cookies.get("sb-access-token")?.value;
  if (!token) return json({ error: "Unauthorized" }, 401);
  const supabase = db(token);
  const user = await getUser(supabase);
  if (!user) return json({ error: "Unauthorized" }, 401);
  const { name, quantity, category } = await request.json();
  if (!name?.trim()) return json({ error: "Name required" }, 400);
  const { data, error } = await supabase.from("custom_shopping_items").insert({
    user_id: user.id,
    name: name.trim(),
    quantity: quantity || null,
    category: category || "other"
  }).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ success: true, item: data });
};
const DELETE = async ({ request, cookies }) => {
  const token = cookies.get("sb-access-token")?.value;
  if (!token) return json({ error: "Unauthorized" }, 401);
  const supabase = db(token);
  const user = await getUser(supabase);
  if (!user) return json({ error: "Unauthorized" }, 401);
  const { id } = await request.json();
  const { error } = await supabase.from("custom_shopping_items").delete().eq("id", id).eq("user_id", user.id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};
const PATCH = async ({ request, cookies }) => {
  const token = cookies.get("sb-access-token")?.value;
  if (!token) return json({ error: "Unauthorized" }, 401);
  const supabase = db(token);
  const user = await getUser(supabase);
  if (!user) return json({ error: "Unauthorized" }, 401);
  const { id, is_checked } = await request.json();
  const { error } = await supabase.from("custom_shopping_items").update({ is_checked }).eq("id", id).eq("user_id", user.id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PATCH,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
