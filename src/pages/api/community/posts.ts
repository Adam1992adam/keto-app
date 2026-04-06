// src/pages/api/community/posts.ts
// GET  /api/community/posts?category=all&page=1  → paginated posts
// POST /api/community/posts  { content, category } → create post
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

const PAGE_SIZE = 20;
const ALLOWED_CATEGORIES = ['progress', 'recipes', 'tips', 'motivation', 'general'];

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'all';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const offset = (page - 1) * PAGE_SIZE;

    let query = db
      .from('community_posts')
      .select('id, user_id, content, category, like_count, fire_count, clap_count, comment_count, is_pinned, created_at, updated_at')
      .eq('is_deleted', false)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (category !== 'all' && ALLOWED_CATEGORIES.includes(category)) {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query;
    if (error) return json({ error: 'Server error' }, 500);

    const postIds = (posts || []).map((p: any) => p.id);
    const authorIds = [...new Set((posts || []).map((p: any) => p.user_id))];

    // Fetch author profiles and user reactions in parallel
    const [profilesRes, reactionsRes] = await Promise.all([
      authorIds.length > 0
        ? db.from('profiles').select('id, full_name, subscription_tier').in('id', authorIds)
        : Promise.resolve({ data: [] }),
      postIds.length > 0
        ? db.from('community_reactions').select('post_id, reaction_type').eq('user_id', user.id).in('post_id', postIds)
        : Promise.resolve({ data: [] }),
    ]);

    const profileMap: Record<string, any> = {};
    for (const p of (profilesRes.data || [])) profileMap[p.id] = p;

    const myReactions: Record<string, string[]> = {};
    for (const r of (reactionsRes.data || [])) {
      if (!myReactions[r.post_id]) myReactions[r.post_id] = [];
      myReactions[r.post_id].push(r.reaction_type);
    }

    const enriched = (posts || []).map((p: any) => ({
      id: p.id,
      content: p.content,
      category: p.category,
      like_count: p.like_count,
      fire_count: p.fire_count,
      clap_count: p.clap_count,
      comment_count: p.comment_count,
      is_pinned: p.is_pinned,
      created_at: p.created_at,
      author_name: profileMap[p.user_id]?.full_name || 'Member',
      author_tier: profileMap[p.user_id]?.subscription_tier || '',
      my_reactions: myReactions[p.id] || [],
      is_own: p.user_id === user.id,
    }));

    return json({ posts: enriched, page, has_more: (posts || []).length === PAGE_SIZE });
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const body = await request.json();
    const { content, category = 'general' } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 3)
      return json({ error: 'Content must be at least 3 characters' }, 400);
    if (content.length > 2000)
      return json({ error: 'Content too long (max 2000 characters)' }, 400);
    if (!ALLOWED_CATEGORIES.includes(category))
      return json({ error: 'Invalid category' }, 400);

    // Rate limit: max 10 posts per user per day
    const today = new Date().toISOString().split('T')[0];
    const { count } = await db
      .from('community_posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today + 'T00:00:00Z');
    if ((count || 0) >= 10)
      return json({ error: 'Daily post limit reached (10/day)' }, 429);

    const { data: post, error } = await db
      .from('community_posts')
      .insert({ user_id: user.id, content: content.trim(), category })
      .select('id, content, category, like_count, fire_count, clap_count, comment_count, created_at')
      .maybeSingle();

    if (error) return json({ error: 'Server error' }, 500);
    return json({ success: true, post }, 201);
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
