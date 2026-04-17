// POST /api/community/posts/[id]/report  { reason }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../../../lib/auth';
import { json } from '../../../../../lib/apiResponse';

const VALID_REASONS = ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'];

export const POST: APIRoute = async ({ request, cookies, params }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const post_id = params.id;
    if (!post_id) return json({ error: 'Post ID required' }, 400);

    const body = await request.json().catch(() => ({}));
    const { reason = 'other' } = body;
    if (!VALID_REASONS.includes(reason)) return json({ error: 'Invalid reason' }, 400);

    // Verify post exists and is not already deleted/hidden
    const { data: post } = await db
      .from('community_posts')
      .select('id, user_id')
      .eq('id', post_id)
      .eq('is_deleted', false)
      .maybeSingle();
    if (!post) return json({ error: 'Post not found' }, 404);
    if (post.user_id === user.id) return json({ error: 'Cannot report your own post' }, 400);

    const { error } = await db.from('community_reports').insert({
      reporter_id: user.id,
      post_id,
      reason,
    });

    // Unique constraint violation = already reported
    if (error?.code === '23505') return json({ error: 'Already reported' }, 409);
    if (error) return json({ error: 'Server error' }, 500);

    return json({ success: true });
  } catch {
    return json({ error: 'Server error' }, 500);
  }
};

