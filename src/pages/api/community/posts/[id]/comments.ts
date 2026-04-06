// src/pages/api/community/posts/[id]/comments.ts
// GET  /api/community/posts/[id]/comments  → list comments for post
// POST /api/community/posts/[id]/comments  { content } → add comment
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../../../lib/auth';

export const GET: APIRoute = async ({ cookies, params }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const post_id = params.id;
    if (!post_id) return json({ error: 'Post ID required' }, 400);

    const { data: comments, error } = await db
      .from('community_comments')
      .select('id, content, created_at, user_id')
      .eq('post_id', post_id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) return json({ error: 'Server error' }, 500);

    const authorIds = [...new Set((comments || []).map((c: any) => c.user_id))];
    const profileMap: Record<string, any> = {};
    if (authorIds.length > 0) {
      const { data: profiles } = await db.from('profiles').select('id, full_name').in('id', authorIds);
      for (const p of profiles || []) profileMap[p.id] = p;
    }

    const result = (comments || []).map((c: any) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      author_name: profileMap[c.user_id]?.full_name || 'Member',
      is_own: c.user_id === user.id,
    }));

    return json({ comments: result });
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

export const POST: APIRoute = async ({ request, cookies, params }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const post_id = params.id;
    if (!post_id) return json({ error: 'Post ID required' }, 400);

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 1)
      return json({ error: 'Content required' }, 400);
    if (content.length > 500)
      return json({ error: 'Comment too long (max 500 characters)' }, 400);

    const { data: comment, error } = await db
      .from('community_comments')
      .insert({ post_id, user_id: user.id, content: content.trim() })
      .select('id, content, created_at')
      .maybeSingle();

    if (error) return json({ error: 'Server error' }, 500);
    return json({ success: true, comment }, 201);
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
