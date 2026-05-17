// POST /api/admin/delete-user  { userId: string }
// Permanently deletes a user from Supabase Auth — all linked data cascades via FK ON DELETE CASCADE
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await request.json() as { userId?: string };
    const { userId } = body;
    if (!userId || typeof userId !== 'string') return json({ error: 'userId required' }, 400);

    const env = (locals as any)?.runtime?.env || {};
    const url = process.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminDb = createClient(url, key);

    const { error } = await adminDb.auth.admin.deleteUser(userId);
    if (error) {
      console.error('[admin/delete-user]', userId, error);
      return json({ error: error.message }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('[admin/delete-user]', err);
    return json({ error: 'Server error' }, 500);
  }
};
