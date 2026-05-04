import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin-session')?.value !== 'authenticated') return json({ error: 'Unauthorized' }, 401);
  const { id } = await request.json();
  if (!id) return json({ error: 'ID required' }, 400);
  const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  const db = createClient(url, key);
  const { error } = await db.from('blog_posts').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};
