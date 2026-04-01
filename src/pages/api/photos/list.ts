// src/pages/api/photos/list.ts
// GET /api/photos/list
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);

  const { data: photos, error } = await supabase
    .from('progress_photos')
    .select('id, photo_data, taken_date, notes, created_at')
    .eq('user_id', user.id)
    .order('taken_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Photo list error:', error);
    return json({ error: error.message }, 500);
  }

  return json({ success: true, photos: photos || [] });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
