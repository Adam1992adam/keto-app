// src/pages/api/habits/delete.ts
// DELETE /api/habits/delete  { habit_id }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const { habit_id } = await request.json();
    if (!habit_id) return json({ error: 'habit_id required' }, 400);

    // Soft-delete: set is_active = false
    const { error } = await supabase
      .from('habits').update({ is_active: false })
      .eq('id', habit_id).eq('user_id', user.id);

    if (error) throw error;
    return json({ success: true });
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

