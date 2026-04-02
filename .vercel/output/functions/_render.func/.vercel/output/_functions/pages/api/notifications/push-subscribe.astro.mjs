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
    return json({ error: "Invalid JSON" }, 400);
  }
  const { endpoint, keys } = body || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return json({ error: "Missing endpoint or keys" }, 400);
  }
  const userAgent = request.headers.get("user-agent") || "";
  const { error } = await db.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth_key: keys.auth,
      user_agent: userAgent.slice(0, 300),
      last_used: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "endpoint" }
  );
  if (error) {
    console.error("push-subscribe error:", error.message);
    return json({ error: "Failed to save subscription" }, 500);
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
