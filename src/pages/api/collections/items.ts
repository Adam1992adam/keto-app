// src/pages/api/collections/items.ts
// POST   /api/collections/items  → add recipe to collection (body: { collectionId, recipeId })
// DELETE /api/collections/items  → remove recipe from collection (body: { collectionId, recipeId })
// DELETE /api/collections/items?deleteCollection=1 → delete entire collection (body: { collectionId })
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const body = await request.json().catch(() => ({}));
    const collectionId = body.collectionId || '';
    const recipeId     = body.recipeId     || '';

    if (!collectionId || !recipeId) return json({ error: 'collectionId and recipeId required' }, 400);

    // Ownership check
    const { data: col } = await db
      .from('recipe_collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!col) return json({ error: 'Collection not found' }, 404);

    // Cap at 200 items per collection
    const { count } = await db
      .from('recipe_collection_items')
      .select('id', { count: 'exact', head: true })
      .eq('collection_id', collectionId);
    if ((count || 0) >= 200) return json({ error: 'Collection is full (max 200 recipes)' }, 400);

    const { error } = await db
      .from('recipe_collection_items')
      .upsert({ collection_id: collectionId, recipe_id: recipeId }, { onConflict: 'collection_id,recipe_id' });

    if (error) {
      console.error('[collections/items POST] user:', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    return json({ success: true });
  } catch (e: any) {
    console.error('[collections/items POST] user:', userId, e);
    return json({ error: 'Server error' }, 500);
  }
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const body = await request.json().catch(() => ({}));
    const collectionId = body.collectionId || '';
    const recipeId     = body.recipeId     || '';
    const deleteCollection = url.searchParams.get('deleteCollection') === '1';

    if (!collectionId) return json({ error: 'collectionId required' }, 400);

    // Ownership check
    const { data: col } = await db
      .from('recipe_collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!col) return json({ error: 'Collection not found' }, 404);

    if (deleteCollection) {
      const { error } = await db.from('recipe_collections').delete().eq('id', collectionId).eq('user_id', userId);
      if (error) {
        console.error('[collections/items DELETE collection] user:', userId, error);
        return json({ error: 'Server error' }, 500);
      }
      return json({ success: true, deleted: 'collection' });
    }

    if (!recipeId) return json({ error: 'recipeId required' }, 400);

    const { error } = await db
      .from('recipe_collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('recipe_id', recipeId);

    if (error) {
      console.error('[collections/items DELETE item] user:', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    return json({ success: true, deleted: 'item' });
  } catch (e: any) {
    console.error('[collections/items DELETE] user:', userId, e);
    return json({ error: 'Server error' }, 500);
  }
};

