import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../../../renderers.mjs';

const POST = async ({ request, cookies, params }) => {
  try {
    const token = cookies.get("sb-access-token")?.value;
    if (!token) return json({ error: "Unauthorized" }, 401);
    const db = createClient(
      "https://ltgxafioalbkjdfkkpxy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3hhZmlvYWxia2pkZmtrcHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODkzMDQsImV4cCI6MjA4NjE2NTMwNH0.9Tf5TcNBdOBQb58aqdHPlk0_qJ2TzrgVLHhy0ItU80o",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: ae } = await db.auth.getUser();
    if (ae || !user) return json({ error: "Unauthorized" }, 401);
    const post_id = params.id;
    if (!post_id) return json({ error: "Post ID required" }, 400);
    const body = await request.json();
    const { reaction_type } = body;
    if (!["like", "fire", "clap"].includes(reaction_type))
      return json({ error: "reaction_type must be like, fire, or clap" }, 400);
    const { data: existing } = await db.from("community_reactions").select("id").eq("post_id", post_id).eq("user_id", user.id).eq("reaction_type", reaction_type).maybeSingle();
    if (existing) {
      await db.from("community_reactions").delete().eq("id", existing.id);
      return json({ success: true, action: "removed", reaction_type });
    } else {
      await db.from("community_reactions").insert({ post_id, user_id: user.id, reaction_type });
      return json({ success: true, action: "added", reaction_type });
    }
  } catch (e) {
    return json({ error: e.message }, 500);
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
