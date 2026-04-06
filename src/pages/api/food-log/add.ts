// src/pages/api/food-log/add.ts
// POST /api/food-log/add
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { autoCompleteTask } from '../../../lib/autoTask';

const MEAL_TASK_TYPES = new Set(['breakfast', 'lunch', 'dinner', 'snack']);

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db, accessToken } = auth;

    const body = await request.json();
    const { food_name, calories, protein_g, fat_g, carbs_g, meal_type, notes } = body;

    if (!food_name?.trim()) return json({ error: 'Food name is required' }, 400);

    const today = new Date().toISOString().split('T')[0];
    const { data: journey } = await db
      .from('user_journey').select('current_day').eq('user_id', user.id).maybeSingle();
    const dayNumber = journey?.current_day || 1;

    const { data, error } = await db.from('food_logs').insert({
      user_id:     user.id,
      logged_date: today,
      day_number:  dayNumber,
      meal_type:   meal_type || 'other',
      food_name:   food_name.trim(),
      calories:    Math.round(Math.max(0, calories || 0)),
      protein_g:   Math.max(0, parseFloat(protein_g) || 0),
      fat_g:       Math.max(0, parseFloat(fat_g)     || 0),
      carbs_g:     Math.max(0, parseFloat(carbs_g)   || 0),
      notes:       notes || null,
    }).select().maybeSingle();

    if (error) throw error;

    // Auto-complete the matching daily task when a meal is logged
    const mt = meal_type || 'other';
    if (MEAL_TASK_TYPES.has(mt)) {
      await autoCompleteTask(user.id, mt, dayNumber, accessToken);
    }

    return json({ success: true, entry: data });

  } catch (err: any) {
    console.error('Food log add error:', err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
