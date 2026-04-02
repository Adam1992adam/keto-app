import { b as getUserClient } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return json({ error: "Unauthorized" }, 401);
  const db = getUserClient(accessToken);
  const { data: { user } } = await db.auth.getUser(accessToken);
  if (!user) return json({ error: "Unauthorized" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const { endpoint } = body || {};
  if (endpoint) {
    await db.from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", endpoint);
  } else {
    await db.from("push_subscriptions").delete().eq("user_id", user.id);
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
