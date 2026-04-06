// src/pages/api/food-log/delete.ts
// DELETE /api/food-log/delete  { id }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const { id } = await request.json();
    if (!id) return json({ error: 'id required' }, 400);

    await db.from('food_logs').delete()
      .eq('id', id).eq('user_id', user.id);

    return json({ success: true });

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
