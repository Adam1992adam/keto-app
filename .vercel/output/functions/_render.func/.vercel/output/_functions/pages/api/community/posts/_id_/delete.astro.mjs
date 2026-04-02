import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../../../renderers.mjs';

const POST = async ({ cookies, params }) => {
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
    const { data: post } = await db.from("community_posts").select("user_id").eq("id", post_id).maybeSingle();
    if (!post) return json({ error: "Post not found" }, 404);
    if (post.user_id !== user.id) return json({ error: "Not authorized" }, 403);
    const { error } = await db.from("community_posts").update({ is_deleted: true }).eq("id", post_id);
    if (error) return json({ error: error.message }, 500);
    return json({ success: true });
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
