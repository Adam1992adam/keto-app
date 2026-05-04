import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function adminDb() {
  const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin-session')?.value !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  const body = await request.json();
  const {
    id, title, slug, description = '', cover_image_url = '',
    ingredients = '', instructions = '',
    prep_time = 0, cook_time = 0, servings = 4,
    calories = 0, protein = 0, fat = 0, carbs = 0, fiber = 0, net_carbs = 0,
    difficulty = 'Easy', tags = [],
    seo_title = '', seo_description = '', published = false,
  } = body;

  if (!title?.trim()) return json({ error: 'Title is required' }, 400);
  if (!slug?.trim())  return json({ error: 'Slug is required' }, 400);

  const db = adminDb();
  const now = new Date().toISOString();
  const row: any = {
    title: title.trim().slice(0, 200),
    slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    description: description.trim().slice(0, 1000),
    cover_image_url: cover_image_url.trim().slice(0, 500),
    ingredients: ingredients.trim(),
    instructions: instructions.trim(),
    prep_time:  Math.max(0, parseInt(prep_time)  || 0),
    cook_time:  Math.max(0, parseInt(cook_time)  || 0),
    servings:   Math.max(1, parseInt(servings)   || 4),
    calories:   Math.max(0, parseInt(calories)   || 0),
    protein:    Math.max(0, parseFloat(protein)  || 0),
    fat:        Math.max(0, parseFloat(fat)      || 0),
    carbs:      Math.max(0, parseFloat(carbs)    || 0),
    fiber:      Math.max(0, parseFloat(fiber)    || 0),
    net_carbs:  Math.max(0, parseFloat(net_carbs)|| 0),
    difficulty: ['Easy','Medium','Hard'].includes(difficulty) ? difficulty : 'Easy',
    tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
    seo_title: seo_title.trim().slice(0, 160),
    seo_description: seo_description.trim().slice(0, 300),
    published,
    updated_at: now,
  };

  if (published) row.published_at = now;

  let result;
  if (id) {
    result = await db.from('blog_recipes').update(row).eq('id', id).select('id').single();
  } else {
    row.created_at = now;
    result = await db.from('blog_recipes').insert(row).select('id').single();
  }

  if (result.error) {
    if (result.error.code === '23505') return json({ error: 'Slug already exists. Choose a different slug.' }, 409);
    return json({ error: result.error.message }, 500);
  }

  return json({ success: true, id: result.data.id });
};
