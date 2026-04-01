// src/pages/api/photos/upload.ts
// POST /api/photos/upload
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const { photo_data, taken_date, notes } = body;

  if (!photo_data || typeof photo_data !== 'string') {
    return json({ error: 'photo_data is required' }, 400);
  }

  // Rough size check: base64 string length * 0.75 ≈ bytes
  const approxBytes = photo_data.length * 0.75;
  if (approxBytes > 500 * 1024) {
    return json({ error: 'Image too large. Maximum size is 500KB after compression.' }, 400);
  }

  const today = new Date().toISOString().split('T')[0];
  const takenDate = taken_date || today;

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({
      user_id:    user.id,
      photo_data: photo_data,
      taken_date: takenDate,
      notes:      notes || null,
    })
    .select('id, taken_date, notes, created_at')
    .single();

  if (error) {
    console.error('Photo upload error:', error);
    return json({ error: error.message }, 500);
  }

  return json({ success: true, photo: data });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
