// src/pages/api/food-log/add.ts
// POST /api/food-log/add
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { autoCompleteTask } from '../../../lib/autoTask';
import { json } from '../../../lib/apiResponse';

const MEAL_TASK_TYPES = new Set(['breakfast', 'lunch', 'dinner', 'snack']);

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db, accessToken } = auth;
    userId = user.id;

    const body = await request.json();
    const { food_name, calories, protein_g, fat_g, carbs_g, meal_type, notes, client_date } = body;

    if (!food_name?.trim()) return json({ error: 'Food name is required' }, 400);

    const today = (client_date && /^\d{4}-\d{2}-\d{2}$/.test(client_date))
      ? client_date
      : new Date().toISOString().split('T')[0];
    const { data: journey } = await db
      .from('user_journey').select('current_day').eq('user_id', user.id).maybeSingle();
    const dayNumber = journey?.current_day || 1;

    const validMeals = new Set(['breakfast', 'lunch', 'dinner', 'snack', 'other']);
    const meal = validMeals.has(meal_type) ? meal_type : 'other';

    const { data, error } = await db.from('food_logs').insert({
      user_id:     user.id,
      logged_date: today,
      day_number:  dayNumber,
      meal_type:   meal,
      food_name:   food_name.trim(),
      calories:    Math.min(Math.round(Math.max(0, calories  || 0)), 9999),
      protein_g:   Math.min(Math.max(0, parseFloat(protein_g) || 0), 500),
      fat_g:       Math.min(Math.max(0, parseFloat(fat_g)     || 0), 500),
      carbs_g:     Math.min(Math.max(0, parseFloat(carbs_g)   || 0), 500),
      notes:       notes || null,
    }).select().maybeSingle();

    if (error) throw error;

    // Auto-complete the matching daily task when a meal is logged
    if (MEAL_TASK_TYPES.has(meal)) {
      await autoCompleteTask(user.id, meal, dayNumber, accessToken);
    }

    return json({ success: true, entry: data });

  } catch (err: any) {
    console.error('[food-log/add] user:', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

