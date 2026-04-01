// src/pages/api/community/posts/[id]/delete.ts
// DELETE /api/community/posts/[id]/delete  → soft-delete post (owner only)
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ cookies, params }) => {
  try {
    const token = cookies.get('sb-access-token')?.value;
    if (!token) return json({ error: 'Unauthorized' }, 401);

    const db = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: ae } = await db.auth.getUser();
    if (ae || !user) return json({ error: 'Unauthorized' }, 401);

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

    if (error) return json({ error: error.message }, 500);
    return json({ success: true });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
