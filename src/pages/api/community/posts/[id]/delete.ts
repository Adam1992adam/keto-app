// src/pages/api/community/posts/[id]/delete.ts
// DELETE /api/community/posts/[id]/delete  → soft-delete post (owner only)
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../../../lib/auth';
import { json } from '../../../../../lib/apiResponse';

export const POST: APIRoute = async ({ cookies, params }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const post_id = params.id;
    if (!post_id) return json({ error: 'Post ID required' }, 400);

    // Verify ownership
    const { data: post } = await db
      .from('community_posts')
      .select('user_id')
      .eq('id', post_id)
      .maybeSingle();

    if (!post) return json({ error: 'Post not found' }, 404);
    if (post.user_id !== user.id) return json({ error: 'Not authorized' }, 403);

    const { error } = await db
      .from('community_posts')
      .update({ is_deleted: true })
      .eq('id', post_id);

    if (error) return json({ error: 'Server error' }, 500);
    return json({ success: true });
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

