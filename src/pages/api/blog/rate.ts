import type { APIRoute } from 'astro';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export const POST: APIRoute = async ({ request, locals }) => {
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = await checkRateLimit(`blog-rate:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) return json({ error: `Too many requests. Try again in ${retryAfterSec}s.` }, 429);

  try {
    const { recipe_id, email, rating } = await request.json() as {
      recipe_id?: string; email?: string; rating?: number;
    };

    if (!recipe_id || typeof recipe_id !== 'string') return json({ error: 'recipe_id required.' }, 400);
    if (!email || typeof email !== 'string' || !email.includes('@')) return json({ error: 'A valid email is required.' }, 400);
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) return json({ error: 'Rating must be 1–5.' }, 400);

    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL  || env.PUBLIC_SUPABASE_URL  || import.meta.env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Server configuration error.' }, 500);

    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(SUPABASE_URL, SERVICE_KEY);

    // Upsert — update rating if same email rates again
    const { error } = await db.from('blog_recipe_ratings').upsert(
      { recipe_id, email: email.trim().toLowerCase().slice(0, 254), rating: Math.round(rating) },
      { onConflict: 'recipe_id,email' }
    );
    if (error) throw error;

    // Return updated average
    const { data: agg } = await db
      .from('blog_recipe_ratings')
      .select('rating')
      .eq('recipe_id', recipe_id);

    const ratings = agg || [];
    const avg = ratings.length ? ratings.reduce((s: number, r: any) => s + r.rating, 0) / ratings.length : rating;

    return json({ success: true, avg: Math.round(avg * 10) / 10, count: ratings.length });
  } catch (err) {
    console.error('[blog/rate]', err);
    return json({ error: 'Something went wrong.' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
