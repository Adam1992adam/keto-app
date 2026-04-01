// src/pages/api/ketones/log.ts
// POST /api/ketones/log  { ketone_mmol, measurement_type, logged_date, notes }
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);

    const db = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );

    const { data: { user }, error: authErr } = await db.auth.getUser();
    if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

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
    }).select().single();

    if (error) throw error;
    return json({ success: true, entry: data });

  } catch (err: any) {
    return json({ error: err.message || 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
