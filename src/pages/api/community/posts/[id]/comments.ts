// src/pages/api/community/posts/[id]/comments.ts
// GET  /api/community/posts/[id]/comments  → list comments for post
// POST /api/community/posts/[id]/comments  { content } → add comment
import type { APIRoute } from 'astro';
import sanitizeHtml from 'sanitize-html';
import { requireApiAuth } from '../../../../../lib/auth';
import { json } from '../../../../../lib/apiResponse';

const SANITIZE_OPTS: sanitizeHtml.IOptions = { allowedTags: [], allowedAttributes: {} };

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
      .eq('is_hidden', false)
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

    // Block community-banned users
    const { data: commenterProfile } = await db
      .from('profiles').select('community_banned').eq('id', user.id).maybeSingle();
    if (commenterProfile?.community_banned)
      return json({ error: 'You are banned from the community.' }, 403);

    if (!content || typeof content !== 'string' || content.trim().length < 1)
      return json({ error: 'Content required' }, 400);
    if (content.length > 500)
      return json({ error: 'Comment too long (max 500 characters)' }, 400);

    // Strip all HTML tags before storing — defence-in-depth against XSS
    const safe = sanitizeHtml(content.trim(), SANITIZE_OPTS).trim();
    if (safe.length < 1)
      return json({ error: 'Content required' }, 400);

    const { data: comment, error } = await db
      .from('community_comments')
      .insert({ post_id, user_id: user.id, content: safe })
      .select('id, content, created_at')
      .maybeSingle();

    if (error) return json({ error: 'Server error' }, 500);
    return json({ success: true, comment }, 201);
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

