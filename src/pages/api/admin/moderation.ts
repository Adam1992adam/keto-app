// POST /api/admin/moderation  { action, report_id, post_id?, comment_id?, user_id?, mod_note? }
// actions: dismiss | hide_post | hide_comment | ban_user | unban_user
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const VALID_ACTIONS = ['dismiss', 'hide_post', 'hide_comment', 'ban_user', 'unban_user'];

function getAdminDb() {
  const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await request.json();
    const { action, report_id, post_id, comment_id, user_id, mod_note } = body;

    if (!VALID_ACTIONS.includes(action)) return json({ error: 'Invalid action' }, 400);

    const db = getAdminDb();

    if (action === 'dismiss') {
      if (!report_id) return json({ error: 'report_id required' }, 400);
      const { error } = await db.from('community_reports')
        .update({ status: 'dismissed', reviewed_at: new Date().toISOString(), mod_note: mod_note || null })
        .eq('id', report_id);
      if (error) return json({ error: 'Server error' }, 500);
      return json({ success: true });
    }

    if (action === 'hide_post') {
      if (!post_id) return json({ error: 'post_id required' }, 400);
      const { error } = await db.from('community_posts')
        .update({ is_hidden: true })
        .eq('id', post_id);
      if (error) return json({ error: 'Server error' }, 500);
      // Mark associated reports as actioned
      if (report_id) {
        await db.from('community_reports')
          .update({ status: 'actioned', reviewed_at: new Date().toISOString(), mod_note: mod_note || null })
          .eq('id', report_id);
      }
      return json({ success: true });
    }

    if (action === 'hide_comment') {
      if (!comment_id) return json({ error: 'comment_id required' }, 400);
      const { error } = await db.from('community_comments')
        .update({ is_hidden: true })
        .eq('id', comment_id);
      if (error) return json({ error: 'Server error' }, 500);
      if (report_id) {
        await db.from('community_reports')
          .update({ status: 'actioned', reviewed_at: new Date().toISOString(), mod_note: mod_note || null })
          .eq('id', report_id);
      }
      return json({ success: true });
    }

    if (action === 'ban_user') {
      if (!user_id) return json({ error: 'user_id required' }, 400);
      const { error } = await db.from('profiles')
        .update({
          community_banned: true,
          community_banned_at: new Date().toISOString(),
          community_banned_reason: mod_note || 'Violation of community guidelines',
        })
        .eq('id', user_id);
      if (error) return json({ error: 'Server error' }, 500);
      if (report_id) {
        await db.from('community_reports')
          .update({ status: 'actioned', reviewed_at: new Date().toISOString(), mod_note: mod_note || null })
          .eq('id', report_id);
      }
      return json({ success: true });
    }

    if (action === 'unban_user') {
      if (!user_id) return json({ error: 'user_id required' }, 400);
      const { error } = await db.from('profiles')
        .update({ community_banned: false, community_banned_at: null, community_banned_reason: null })
        .eq('id', user_id);
      if (error) return json({ error: 'Server error' }, 500);
      return json({ success: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch {
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
