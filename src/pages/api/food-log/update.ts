// src/pages/api/food-log/update.ts
// PATCH /api/food-log/update
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const PATCH: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const body = await request.json();
    const { id, food_name, calories, protein_g, fat_g, carbs_g, meal_type } = body;

    if (!id)              return json({ error: 'id is required' }, 400);
    if (!food_name?.trim()) return json({ error: 'Food name is required' }, 400);

    // Reasonable upper bounds — prevent bogus data from breaking charts
    const cal  = Math.min(Math.round(Math.max(0, calories  || 0)), 9999);
    const prot = Math.min(Math.max(0, parseFloat(protein_g) || 0), 500);
    const fat  = Math.min(Math.max(0, parseFloat(fat_g)     || 0), 500);
    const carb = Math.min(Math.max(0, parseFloat(carbs_g)   || 0), 500);

    const validMeals = new Set(['breakfast', 'lunch', 'dinner', 'snack', 'other']);
    const meal = validMeals.has(meal_type) ? meal_type : 'other';

    // .eq('user_id') ensures users can only edit their own entries
    const { data, error } = await db
      .from('food_logs')
      .update({
        food_name: food_name.trim(),
        calories:  cal,
        protein_g: prot,
        fat_g:     fat,
        carbs_g:   carb,
        meal_type: meal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return json({ error: 'Entry not found or access denied' }, 404);

    return json({ success: true, entry: data });

  } catch (err: any) {
    console.error('[food-log/update] user:', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
