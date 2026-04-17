// POST /api/community/comments/[id]/report  { reason }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../../../lib/auth';
import { json } from '../../../../../lib/apiResponse';

const VALID_REASONS = ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'];

export const POST: APIRoute = async ({ request, cookies, params }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const comment_id = params.id;
    if (!comment_id) return json({ error: 'Comment ID required' }, 400);

    const body = await request.json().catch(() => ({}));
    const { reason = 'other' } = body;
    if (!VALID_REASONS.includes(reason)) return json({ error: 'Invalid reason' }, 400);

    const { data: comment } = await db
      .from('community_comments')
      .select('id, user_id')
      .eq('id', comment_id)
      .eq('is_deleted', false)
      .maybeSingle();
    if (!comment) return json({ error: 'Comment not found' }, 404);
    if (comment.user_id === user.id) return json({ error: 'Cannot report your own comment' }, 400);

    const { error } = await db.from('community_reports').insert({
      reporter_id: user.id,
      comment_id,
      reason,
    });

    if (error?.code === '23505') return json({ error: 'Already reported' }, 409);
    if (error) return json({ error: 'Server error' }, 500);

    return json({ success: true });
  } catch {
    return json({ error: 'Server error' }, 500);
  }
};

