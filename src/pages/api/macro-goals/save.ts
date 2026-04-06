// src/pages/api/macro-goals/save.ts
// POST /api/macro-goals/save  { daily_calories, protein_g, fat_g, carbs_g }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const { daily_calories, protein_g, fat_g, carbs_g } = await request.json();

    if (!daily_calories || daily_calories < 500 || daily_calories > 10000)
      return json({ error: 'Invalid calorie value' }, 400);

    const { error } = await db.from('macro_goals').upsert(
      {
        user_id:        user.id,
        daily_calories: Math.round(daily_calories),
        protein_g:      Math.round(protein_g  || 0),
        fat_g:          Math.round(fat_g       || 0),
        carbs_g:        Math.round(carbs_g     || 0),
        updated_at:     new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) throw error;
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
