// src/pages/api/ketones/delete.ts
// DELETE /api/ketones/delete  { id }
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const DELETE: APIRoute = async ({ request, cookies }) => {
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

    const { id } = await request.json();
    if (!id) return json({ error: 'Missing id' }, 400);

    const { error } = await db
      .from('ketone_logs')
      .delete()
      .eq('user_id', user.id)
      .eq('id', id);

    if (error) throw error;
    return json({ success: true });

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
