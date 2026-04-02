import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../../../renderers.mjs';

const GET = async ({ cookies, params }) => {
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
    const { data: comments, error } = await db.from("community_comments").select("id, content, created_at, user_id").eq("post_id", post_id).eq("is_deleted", false).order("created_at", { ascending: true }).limit(100);
    if (error) return json({ error: error.message }, 500);
    const authorIds = [...new Set((comments || []).map((c) => c.user_id))];
    const profileMap = {};
    if (authorIds.length > 0) {
      const { data: profiles } = await db.from("profiles").select("id, full_name").in("id", authorIds);
      for (const p of profiles || []) profileMap[p.id] = p;
    }
    const result = (comments || []).map((c) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      author_name: profileMap[c.user_id]?.full_name || "Member",
      is_own: c.user_id === user.id
    }));
    return json({ comments: result });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
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
    const { content } = body;
    if (!content || typeof content !== "string" || content.trim().length < 1)
      return json({ error: "Content required" }, 400);
    if (content.length > 500)
      return json({ error: "Comment too long (max 500 characters)" }, 400);
    const { data: comment, error } = await db.from("community_comments").insert({ post_id, user_id: user.id, content: content.trim() }).select("id, content, created_at").single();
    if (error) return json({ error: error.message }, 500);
    return json({ success: true, comment }, 201);
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
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
