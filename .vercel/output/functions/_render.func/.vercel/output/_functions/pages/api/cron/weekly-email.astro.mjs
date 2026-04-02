import 'resend';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  const CRON_SECRET = "4a282bfba3717aaa347998c82c8d720963482573b28d459aa970329afbf9394c";
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return json({ error: "Forbidden" }, 403);
  }
  return json({ error: "Supabase not configured" }, 500);
};
const POST = GET;
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
