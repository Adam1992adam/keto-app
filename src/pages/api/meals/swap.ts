// src/pages/api/meals/swap.ts
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const { original_recipe_id, reason } = await request.json();
    if (!original_recipe_id) return json({ error: 'original_recipe_id required' }, 400);

    // Fetch original recipe, user restrictions, and recent swaps in parallel
    const [originalRes, onboardingRes, recentSwapsRes] = await Promise.all([
      db.from('recipes')
        .select('id, calories, protein, fat, net_carbs, tags')
        .eq('id', original_recipe_id)
        .maybeSingle(),
      db.from('onboarding_data')
        .select('dietary_restrictions')
        .eq('user_id', user.id)
        .maybeSingle(),
      db.from('meal_swaps')
        .select('original_recipe_id')
        .eq('user_id', user.id)
        .gte('swap_date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
    ]);

    const original = originalRes.data;
    if (!original) return json({ error: 'Recipe not found' }, 404);

    const restrictions: string[] = onboardingRes.data?.dietary_restrictions || [];

    const recentIds = [
      original_recipe_id,
      ...(recentSwapsRes.data?.map((s: any) => s.original_recipe_id) || []),
    ];

    // Find meal category from original tags
    const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'];
    const category = original.tags?.find((t: string) => mealCategories.includes(t)) || 'lunch';

    // Query candidates — same meal category, ±25% calories
    const { data: candidates } = await db
      .from('recipes')
      .select('id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags')
      .contains('tags', [category])
      .gte('calories', (original.calories || 400) * 0.75)
      .lte('calories', (original.calories || 400) * 1.25)
      .limit(20);

    if (!candidates || candidates.length === 0) {
      return json({ error: 'No alternatives found' }, 404);
    }

    // Filter: not recently swapped + dietary restrictions
    const filtered = candidates.filter(r => {
      if (recentIds.includes(r.id)) return false;
      const tags: string[] = r.tags || [];
      const title = (r.title || '').toLowerCase();
      if (restrictions.includes('no_pork') &&
        (tags.includes('pork') || ['bacon','ham','prosciutto','chorizo','sausage'].some(w => title.includes(w))))
        return false;
      if (restrictions.includes('vegetarian') &&
        (tags.includes('meat') || ['chicken','beef','steak','lamb'].some(w => title.includes(w))))
        return false;
      if (restrictions.includes('no_seafood') &&
        (tags.includes('seafood') || ['salmon','tuna','shrimp','fish','cod','crab'].some(w => title.includes(w))))
        return false;
      return true;
    });

    const pool = filtered.length > 0 ? filtered : candidates.filter(r => !recentIds.includes(r.id));
    if (pool.length === 0) return json({ error: 'No alternatives found' }, 200);

    // Pick best match — closest protein to original
    const best = pool.sort((a, b) =>
      Math.abs((a.protein || 0) - (original.protein || 30)) -
      Math.abs((b.protein || 0) - (original.protein || 30))
    )[0];

    // Record swap
    const { error: insertErr } = await db.from('meal_swaps').insert({
      user_id:           user.id,
      original_recipe_id,
      swap_recipe_id:    best.id,
      reason:            reason || 'flagged',
      swap_date:         new Date().toISOString().split('T')[0],
    });
    if (insertErr) console.warn('meal_swaps insert warn:', insertErr.message);

    return json({ success: true, new_recipe: best });

  } catch (err: any) {
    console.error('[meals/swap] user:', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
