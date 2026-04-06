// src/pages/api/measurements/save.ts
// POST /api/measurements/save
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const today = new Date().toISOString().split('T')[0];
  const logged_date = body.logged_date || today;

  // Build row — only include fields that were provided
  const row: Record<string, any> = { user_id: user.id, logged_date };
  const fields = ['neck_cm', 'waist_cm', 'hips_cm', 'chest_cm', 'arm_cm', 'thigh_cm', 'notes'];
  for (const f of fields) {
    if (body[f] !== undefined && body[f] !== null && body[f] !== '') {
      row[f] = f === 'notes' ? body[f] : parseFloat(body[f]);
    }
  }

  if (Object.keys(row).length <= 2) {
    return json({ error: 'Provide at least one measurement' }, 400);
  }

  const { error } = await supabase
    .from('body_measurements')
    .upsert(row, { onConflict: 'user_id,logged_date' });

  if (error) {
    console.error('Measurements save error:', error);
    return json({ error: 'Server error' }, 500);
  }

  return json({ success: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
