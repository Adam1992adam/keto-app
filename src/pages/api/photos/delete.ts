// src/pages/api/photos/delete.ts
// DELETE /api/photos/delete
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const { photo_id } = body;
  if (!photo_id) return json({ error: 'photo_id is required' }, 400);

  const { error } = await supabase
    .from('progress_photos')
    .delete()
    .eq('id', photo_id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Photo delete error:', error);
    return json({ error: error.message }, 500);
  }

  return json({ success: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
