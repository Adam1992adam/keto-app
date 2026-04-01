// src/pages/api/recipes/favorite.ts
// POST /api/recipes/favorite  { recipeId }
// Toggles favorite status. Returns { favorited: bool }

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

    const { recipeId } = await request.json();
    if (!recipeId) return json({ error: 'recipeId required' }, 400);

    // Check if already favorited
    const { data: existing } = await db
      .from('recipe_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (existing) {
      await db.from('recipe_favorites').delete()
        .eq('user_id', user.id).eq('recipe_id', recipeId);
      return json({ favorited: false });
    } else {
      await db.from('recipe_favorites').insert({ user_id: user.id, recipe_id: recipeId });
      return json({ favorited: true });
    }

  } catch (err: any) {
    console.error('Favorite toggle error:', err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
