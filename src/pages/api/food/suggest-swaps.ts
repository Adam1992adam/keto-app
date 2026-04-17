// src/pages/api/food/suggest-swaps.ts
// GET /api/food/suggest-swaps?calories=X&protein_g=Y&fat_g=Z&carbs_g=W&meal_type=M
// Returns up to 5 recipes with similar macros as swap suggestions
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { db } = auth;

  const url    = new URL(request.url);
  const cal    = parseFloat(url.searchParams.get('calories')  || '0') || 0;
  const prot   = parseFloat(url.searchParams.get('protein_g') || '0') || 0;
  const fat    = parseFloat(url.searchParams.get('fat_g')     || '0') || 0;
  const carbs  = parseFloat(url.searchParams.get('carbs_g')   || '0') || 0;

  // Fetch a broad pool of recipes (up to 80) to score client-side
  const calLow  = Math.max(0, cal * 0.4);
  const calHigh = cal < 50 ? 800 : cal * 2.5;

  const { data: recipes, error } = await db
    .from('recipes')
    .select('id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags')
    .gte('calories', calLow)
    .lte('calories', calHigh)
    .limit(80);

  if (error) return json({ error: 'Failed to fetch recipes' }, 500);
  if (!recipes || recipes.length === 0) {
    // Fallback: return any recipes when no calorie match
    const { data: fallback } = await db
      .from('recipes')
      .select('id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags')
      .limit(10);
    return json({ suggestions: fallback || [] });
  }

  // Score each recipe by macro similarity
  const calW  = 2.0;  // calorie match weighted more
  const protW = 1.0;
  const fatW  = 1.0;
  const carbW = 1.5;  // carbs matter most on keto

  const scored = recipes.map(r => {
    const dCal  = cal  > 0 ? Math.abs((r.calories  || 0) - cal)  / cal  : 0;
    const dProt = prot > 0 ? Math.abs((r.protein   || 0) - prot) / prot : 0;
    const dFat  = fat  > 0 ? Math.abs((r.fat       || 0) - fat)  / fat  : 0;
    const dCarb = carbs> 0 ? Math.abs((r.net_carbs || 0) - carbs)/ carbs: 0;
    const score = dCal * calW + dProt * protW + dFat * fatW + dCarb * carbW;
    return { ...r, _score: score };
  });

  scored.sort((a, b) => a._score - b._score);
  const suggestions = scored.slice(0, 5).map(({ _score, ...r }) => r);

  return json({ suggestions });
};

