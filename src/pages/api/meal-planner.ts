// src/pages/api/meal-planner.ts
// GET    /api/meal-planner?week=YYYY-MM-DD  → all entries for that 7-day window (Mon–Sun)
// POST   /api/meal-planner  { plan_date, meal_type, recipe_id }
// DELETE /api/meal-planner  { id }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../lib/auth';
import { json, captureError } from '../../lib/apiResponse';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

function monday(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export const GET: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const url   = new URL(request.url);
    const week  = url.searchParams.get('week') || new Date().toISOString().slice(0, 10);
    const start = monday(week);
    const end   = (() => { const d = new Date(start + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 6); return d.toISOString().slice(0, 10); })();

    const { data, error } = await db
      .from('user_meal_plan')
      .select('id, plan_date, meal_type, recipe_id, recipes(id, title, calories, net_carbs, protein, image_url)')
      .eq('user_id', user.id)
      .gte('plan_date', start)
      .lte('plan_date', end)
      .order('plan_date', { ascending: true });

    if (error) {
      await captureError('meal-planner GET', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    return json({ entries: data || [], start, end });
  } catch (e: any) {
    await captureError('meal-planner GET', userId, e);
    return json({ error: 'Server error' }, 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const body      = await request.json().catch(() => ({}));
    const planDate  = (body.plan_date  || '').trim();
    const mealType  = (body.meal_type  || '').trim().toLowerCase();
    const recipeId  = (body.recipe_id  || '').trim();

    if (!planDate || !mealType || !recipeId) return json({ error: 'plan_date, meal_type, recipe_id required' }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(planDate)) return json({ error: 'Invalid date format' }, 400);
    if (!MEAL_TYPES.includes(mealType)) return json({ error: 'Invalid meal_type' }, 400);

    // Cap: 8 recipes per slot (date + meal_type)
    const { count } = await db
      .from('user_meal_plan')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('plan_date', planDate)
      .eq('meal_type', mealType);
    if ((count || 0) >= 8) return json({ error: 'Slot is full (max 8 recipes)' }, 400);

    const { data, error } = await db
      .from('user_meal_plan')
      .upsert({ user_id: userId, plan_date: planDate, meal_type: mealType, recipe_id: recipeId },
               { onConflict: 'user_id,plan_date,meal_type,recipe_id' })
      .select('id, plan_date, meal_type, recipe_id, recipes(id, title, calories, net_carbs, image_url)')
      .single();

    if (error) {
      await captureError('meal-planner POST', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    return json({ entry: data }, 201);
  } catch (e: any) {
    await captureError('meal-planner POST', userId, e);
    return json({ error: 'Server error' }, 500);
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const body = await request.json().catch(() => ({}));
    const id   = (body.id || '').trim();
    if (!id) return json({ error: 'id required' }, 400);

    const { error } = await db
      .from('user_meal_plan')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      await captureError('meal-planner DELETE', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    return json({ success: true });
  } catch (e: any) {
    await captureError('meal-planner DELETE', userId, e);
    return json({ error: 'Server error' }, 500);
  }
};

