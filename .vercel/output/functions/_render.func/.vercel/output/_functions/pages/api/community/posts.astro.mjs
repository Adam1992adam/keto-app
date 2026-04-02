import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const PAGE_SIZE = 20;
const ALLOWED_CATEGORIES = ["progress", "recipes", "tips", "motivation", "general"];
const GET = async ({ request, cookies }) => {
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
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || "all";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const offset = (page - 1) * PAGE_SIZE;
    let query = db.from("community_posts").select("id, user_id, content, category, like_count, fire_count, clap_count, comment_count, is_pinned, created_at, updated_at").eq("is_deleted", false).order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).range(offset, offset + PAGE_SIZE - 1);
    if (category !== "all" && ALLOWED_CATEGORIES.includes(category)) {
      query = query.eq("category", category);
    }
    const { data: posts, error } = await query;
    if (error) return json({ error: error.message }, 500);
    const postIds = (posts || []).map((p) => p.id);
    const authorIds = [...new Set((posts || []).map((p) => p.user_id))];
    const [profilesRes, reactionsRes] = await Promise.all([
      authorIds.length > 0 ? db.from("profiles").select("id, full_name, subscription_tier").in("id", authorIds) : Promise.resolve({ data: [] }),
      postIds.length > 0 ? db.from("community_reactions").select("post_id, reaction_type").eq("user_id", user.id).in("post_id", postIds) : Promise.resolve({ data: [] })
    ]);
    const profileMap = {};
    for (const p of profilesRes.data || []) profileMap[p.id] = p;
    const myReactions = {};
    for (const r of reactionsRes.data || []) {
      if (!myReactions[r.post_id]) myReactions[r.post_id] = [];
      myReactions[r.post_id].push(r.reaction_type);
    }
    const enriched = (posts || []).map((p) => ({
      id: p.id,
      content: p.content,
      category: p.category,
      like_count: p.like_count,
      fire_count: p.fire_count,
      clap_count: p.clap_count,
      comment_count: p.comment_count,
      is_pinned: p.is_pinned,
      created_at: p.created_at,
      author_name: profileMap[p.user_id]?.full_name || "Member",
      author_tier: profileMap[p.user_id]?.subscription_tier || "",
      my_reactions: myReactions[p.id] || [],
      is_own: p.user_id === user.id
    }));
    return json({ posts: enriched, page, has_more: (posts || []).length === PAGE_SIZE });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
};
const POST = async ({ request, cookies }) => {
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
    const body = await request.json();
    const { content, category = "general" } = body;
    if (!content || typeof content !== "string" || content.trim().length < 3)
      return json({ error: "Content must be at least 3 characters" }, 400);
    if (content.length > 2e3)
      return json({ error: "Content too long (max 2000 characters)" }, 400);
    if (!ALLOWED_CATEGORIES.includes(category))
      return json({ error: "Invalid category" }, 400);
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const { count } = await db.from("community_posts").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", today + "T00:00:00Z");
    if ((count || 0) >= 10)
      return json({ error: "Daily post limit reached (10/day)" }, 429);
    const { data: post, error } = await db.from("community_posts").insert({ user_id: user.id, content: content.trim(), category }).select("id, content, category, like_count, fire_count, clap_count, comment_count, created_at").single();
    if (error) return json({ error: error.message }, 500);
    return json({ success: true, post }, 201);
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
