// src/pages/api/meals/swap.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const { original_recipe_id, reason } = await request.json();
    if (!original_recipe_id) return json({ error: 'original_recipe_id required' }, 400);

    // Get original recipe
    const { data: original } = await supabase
      .from('recipes')
      .select('id, calories, protein, fat, net_carbs, tags')
      .eq('id', original_recipe_id)
      .single();

    if (!original) return json({ error: 'Recipe not found' }, 404);

    // Get user dietary restrictions
    const { data: onboarding } = await supabase
      .from('onboarding_data')
      .select('dietary_restrictions')
      .eq('user_id', user.id)
      .single();

    const restrictions: string[] = onboarding?.dietary_restrictions || [];

    // Recently swapped IDs (last 7 days) — avoid repeating
    const { data: recentSwaps } = await supabase
      .from('meal_swaps')
      .select('original_recipe_id')
      .eq('user_id', user.id)
      .gte('swap_date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]);

    const recentIds = [
      original_recipe_id,
      ...(recentSwaps?.map(s => s.original_recipe_id) || []),
    ];

    // Find meal category from original tags
    const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'];
    const category = original.tags?.find((t: string) => mealCategories.includes(t)) || 'lunch';

    // Query candidates — same meal category, ±25% calories
    const { data: candidates } = await supabase
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
    await supabase.from('meal_swaps').insert({
      user_id:           user.id,
      original_recipe_id,
      swap_recipe_id:    best.id,
      reason:            reason || 'flagged',
      swap_date:         new Date().toISOString().split('T')[0],
    });

    return json({ success: true, new_recipe: best });

  } catch (err: any) {
    console.error('Swap error:', err);
    return json({ error: err.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
