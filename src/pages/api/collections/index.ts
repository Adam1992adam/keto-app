// src/pages/api/collections/index.ts
// GET  /api/collections        → list user's collections (with recipe count)
// POST /api/collections        → create a new collection
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json, captureError } from '../../../lib/apiResponse';

export const GET: APIRoute = async ({ cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const { data, error } = await db
      .from('recipe_collections')
      .select('id, name, emoji, created_at, recipe_collection_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      await captureError('collections GET', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    const collections = (data || []).map((c: any) => ({
      id:         c.id,
      name:       c.name,
      emoji:      c.emoji,
      created_at: c.created_at,
      count:      c.recipe_collection_items?.[0]?.count ?? 0,
    }));

    return json({ collections });
  } catch (e: any) {
    await captureError('collections GET', userId, e);
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

    const body = await request.json().catch(() => ({}));
    const name  = (body.name  || '').trim().slice(0, 60);
    const emoji = (body.emoji || '📚').slice(0, 4);

    if (!name) return json({ error: 'Name is required' }, 400);

    // Cap at 20 collections per user
    const { count } = await db
      .from('recipe_collections')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    if ((count || 0) >= 20) return json({ error: 'Maximum 20 collections allowed' }, 400);

    const { data, error } = await db
      .from('recipe_collections')
      .insert({ user_id: userId, name, emoji })
      .select('id, name, emoji, created_at')
      .single();

    if (error) {
      await captureError('collections/index POST', userId, error);
      return json({ error: 'Server error' }, 500);
    }

    return json({ collection: { ...data, count: 0 } }, 201);
  } catch (e: any) {
    await captureError('collections POST', userId, e);
    return json({ error: 'Server error' }, 500);
  }
};

