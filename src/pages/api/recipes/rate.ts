// src/pages/api/recipes/rate.ts
// POST /api/recipes/rate  { recipeId, rating }  → { success, avg, count }
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);

    const db = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );

    const { data: { user }, error: authErr } = await db.auth.getUser();
    if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

    const { recipeId, rating } = await request.json();
    if (!recipeId) return json({ error: 'recipeId required' }, 400);
    const r = parseInt(rating, 10);
    if (!r || r < 1 || r > 5) return json({ error: 'rating must be 1–5' }, 400);

    // Upsert the rating
    const { error: upsertErr } = await db
      .from('recipe_ratings')
      .upsert(
        { user_id: user.id, recipe_id: recipeId, rating: r, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,recipe_id' }
      );

    if (upsertErr) throw upsertErr;

    // Fetch updated avg
    const { data: avgRow } = await db
      .from('recipe_avg_ratings')
      .select('avg_rating, rating_count')
      .eq('recipe_id', recipeId)
      .maybeSingle();

    return json({
      success: true,
      userRating: r,
      avg: avgRow?.avg_rating || r,
      count: avgRow?.rating_count || 1,
    });

  } catch (err: any) {
    console.error('Rate recipe error:', err);
    return json({ error: err.message || 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
