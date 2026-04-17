// src/pages/api/recipes/search.ts
// GET /api/recipes/search?q=&tags=breakfast,dinner&difficulty=easy&maxCarbs=10&page=1
// Server-side recipe search across the full library. Returns paginated results.
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

const PAGE_SIZE = 24;
const ALLOWED_DIFFICULTIES = ['easy', 'medium', 'hard'];
const ALLOWED_TAGS = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'smoothie', 'baking',
  'dairy-free', 'nut-free', 'egg-free', 'vegetarian', 'pork-free'];

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const url        = new URL(request.url);
    const q          = (url.searchParams.get('q') || '').trim().slice(0, 100);
    const tagsParam  = url.searchParams.get('tags') || '';
    const difficulty = url.searchParams.get('difficulty') || '';
    const maxCarbs   = parseFloat(url.searchParams.get('maxCarbs') || '0') || 0;
    const page       = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const offset     = (page - 1) * PAGE_SIZE;

    // Validate difficulty
    const validDiff = difficulty && ALLOWED_DIFFICULTIES.includes(difficulty.toLowerCase())
      ? difficulty.toLowerCase() : '';

    // Validate tags
    const tags = tagsParam
      ? tagsParam.split(',').map(t => t.trim().toLowerCase()).filter(t => ALLOWED_TAGS.includes(t))
      : [];

    let query = db
      .from('recipes')
      .select('id, title, calories, protein, fat, net_carbs, prep_time, cook_time, image_url, tags, difficulty, servings, book_id', { count: 'exact' })
      .eq('is_deleted' as any, false)  // guard in case column exists
      .range(offset, offset + PAGE_SIZE - 1);

    // Full-text search on title
    if (q) {
      query = query.ilike('title', `%${q}%`);
    }

    // Difficulty filter
    if (validDiff) {
      query = query.ilike('difficulty', validDiff);
    }

    // Net carbs cap
    if (maxCarbs > 0) {
      query = query.lte('net_carbs', maxCarbs);
    }

    // Tag filter (contains ANY of the selected tags)
    if (tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    query = query.order('title', { ascending: true });

    const { data, error, count } = await query;
    if (error) {
      // Retry without the is_deleted filter if it doesn't exist
      let q2 = db
        .from('recipes')
        .select('id, title, calories, protein, fat, net_carbs, prep_time, cook_time, image_url, tags, difficulty, servings, book_id', { count: 'exact' })
        .range(offset, offset + PAGE_SIZE - 1);
      if (q)        q2 = q2.ilike('title', `%${q}%`);
      if (validDiff)q2 = q2.ilike('difficulty', validDiff);
      if (maxCarbs > 0) q2 = q2.lte('net_carbs', maxCarbs);
      if (tags.length > 0) q2 = q2.overlaps('tags', tags);
      q2 = q2.order('title', { ascending: true });
      const r2 = await q2;
      if (r2.error) return json({ error: 'Server error' }, 500);

      // Fetch user favorites to mark results
      const ids = (r2.data || []).map((r: any) => r.id);
      const favSet = await getFavSet(db, user.id, ids);
      return json({ recipes: enrich(r2.data || [], favSet), total: r2.count || 0, page, has_more: (r2.data||[]).length === PAGE_SIZE });
    }

    const ids = (data || []).map((r: any) => r.id);
    const favSet = await getFavSet(db, user.id, ids);
    return json({ recipes: enrich(data || [], favSet), total: count || 0, page, has_more: (data||[]).length === PAGE_SIZE });

  } catch (e: any) {
    console.error('[recipes/search] user: unknown', e);
    return json({ error: 'Server error' }, 500);
  }
};

async function getFavSet(db: any, userId: string, ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const { data } = await db.from('recipe_favorites').select('recipe_id').eq('user_id', userId).in('recipe_id', ids);
  return new Set((data || []).map((r: any) => r.recipe_id));
}

function enrich(recipes: any[], favSet: Set<string>) {
  return recipes.map((r: any) => ({
    id:         r.id,
    title:      r.title,
    calories:   r.calories   || 0,
    protein:    r.protein    || 0,
    fat:        r.fat        || 0,
    net_carbs:  r.net_carbs  || 0,
    prep_time:  r.prep_time  || 0,
    cook_time:  r.cook_time  || 0,
    image_url:  r.image_url  || null,
    tags:       r.tags       || [],
    difficulty: r.difficulty || null,
    servings:   r.servings   || 1,
    book_id:    r.book_id    || null,
    favorited:  favSet.has(r.id),
  }));
}

