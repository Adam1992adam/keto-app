// src/pages/api/recipes/favorite.ts
// POST /api/recipes/favorite  { recipeId }
// Toggles favorite status. Returns { favorited: bool }

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

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

