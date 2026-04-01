// src/pages/api/community/posts/[id]/react.ts
// POST /api/community/posts/[id]/react  { reaction_type: 'like'|'fire'|'clap' }
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies, params }) => {
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

    const body = await request.json();
    const { reaction_type } = body;
    if (!['like', 'fire', 'clap'].includes(reaction_type))
      return json({ error: 'reaction_type must be like, fire, or clap' }, 400);

    // Toggle: if exists remove, else add
    const { data: existing } = await db
      .from('community_reactions')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_id', user.id)
      .eq('reaction_type', reaction_type)
      .maybeSingle();

    if (existing) {
      await db.from('community_reactions').delete().eq('id', existing.id);
      return json({ success: true, action: 'removed', reaction_type });
    } else {
      await db.from('community_reactions').insert({ post_id, user_id: user.id, reaction_type });
      return json({ success: true, action: 'added', reaction_type });
    }
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
