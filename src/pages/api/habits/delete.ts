// src/pages/api/habits/delete.ts
// DELETE /api/habits/delete  { habit_id }
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('sb-access-token')?.value;
    if (!token) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: ae } = await supabase.auth.getUser();
    if (ae || !user) return json({ error: 'Unauthorized' }, 401);

    const { habit_id } = await request.json();
    if (!habit_id) return json({ error: 'habit_id required' }, 400);

    // Soft-delete: set is_active = false
    const { error } = await supabase
      .from('habits').update({ is_active: false })
      .eq('id', habit_id).eq('user_id', user.id);

    if (error) throw error;
    return json({ success: true });
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
