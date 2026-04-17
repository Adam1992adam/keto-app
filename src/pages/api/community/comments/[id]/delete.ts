// POST /api/community/comments/[id]/delete  → soft-delete comment (owner only)
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../../../lib/auth';
import { json } from '../../../../../lib/apiResponse';

export const POST: APIRoute = async ({ cookies, params }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const comment_id = params.id;
    if (!comment_id) return json({ error: 'Comment ID required' }, 400);

    const { data: comment } = await db
      .from('community_comments')
      .select('user_id')
      .eq('id', comment_id)
      .maybeSingle();

    if (!comment) return json({ error: 'Comment not found' }, 404);
    if (comment.user_id !== user.id) return json({ error: 'Not authorized' }, 403);

    const { error } = await db
      .from('community_comments')
      .update({ is_deleted: true })
      .eq('id', comment_id);

    if (error) return json({ error: 'Server error' }, 500);
    return json({ success: true });
  } catch {
    return json({ error: 'Server error' }, 500);
  }
};

