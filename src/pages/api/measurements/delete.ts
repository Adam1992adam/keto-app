// src/pages/api/measurements/delete.ts
// DELETE /api/measurements/delete  { id }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const { id } = await request.json();
    if (!id) return json({ error: 'Missing id' }, 400);

    const { error } = await db
      .from('body_measurements')
      .delete()
      .eq('user_id', user.id)
      .eq('id', id);

    if (error) throw error;
    return json({ success: true });

  } catch (err: any) {
    return json({ error: 'Server error' }, 500);
  }
};

