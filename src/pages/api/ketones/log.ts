// src/pages/api/ketones/log.ts
// POST /api/ketones/log  { ketone_mmol, measurement_type, logged_date, notes }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const { ketone_mmol, measurement_type, logged_date, notes } = await request.json();

    const val = parseFloat(ketone_mmol);
    if (isNaN(val) || val < 0 || val > 30)
      return json({ error: 'Invalid ketone value (0–30 mmol/L)' }, 400);

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await db.from('ketone_logs').insert({
      user_id:          user.id,
      ketone_mmol:      val,
      measurement_type: measurement_type || 'blood',
      logged_date:      logged_date || today,
      notes:            notes || null,
    }).select().maybeSingle();

    if (error) throw error;
    return json({ success: true, entry: data });

  } catch (err: any) {
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
