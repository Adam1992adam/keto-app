import { sendPushToUser } from '../../../chunks/push_Okp6OHEm.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const authHeader = request.headers.get("authorization");
  const env = locals?.runtime?.env || {};
  const CRON_SECRET = env.CRON_SECRET || "4a282bfba3717aaa347998c82c8d720963482573b28d459aa970329afbf9394c";
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    const origin = request.headers.get("origin") || "";
    const host = new URL(request.url).host;
    if (!origin.includes(host)) {
      return json({ error: "Forbidden" }, 403);
    }
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const { userId, title, message, url, tag, priority } = body || {};
  if (!userId || !title || !message) {
    return json({ error: "userId, title, and message are required" }, 400);
  }
  try {
    const result = await sendPushToUser(userId, {
      title,
      body: message,
      url: url || "/dashboard",
      tag: tag || "keto",
      priority: priority || "normal"
    });
    return json({ success: true, ...result });
  } catch (err) {
    console.error("push-send error:", err?.message || err);
    return json({ error: err?.message || "Failed" }, 500);
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
