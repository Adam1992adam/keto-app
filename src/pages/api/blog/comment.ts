import type { APIRoute } from 'astro';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export const POST: APIRoute = async ({ request, locals }) => {
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = await checkRateLimit(`blog-comment:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) return json({ error: `Too many requests. Try again in ${retryAfterSec}s.` }, 429);

  try {
    const { recipe_id, name, email, body } = await request.json() as {
      recipe_id?: string; name?: string; email?: string; body?: string;
    };

    if (!recipe_id || typeof recipe_id !== 'string') return json({ error: 'recipe_id required.' }, 400);
    if (!name || typeof name !== 'string' || name.trim().length < 1) return json({ error: 'Name is required.' }, 400);
    if (!email || typeof email !== 'string' || !email.includes('@')) return json({ error: 'A valid email is required.' }, 400);
    if (!body || typeof body !== 'string' || body.trim().length < 10) return json({ error: 'Comment must be at least 10 characters.' }, 400);
    if (body.trim().length > 1500) return json({ error: 'Comment must be under 1500 characters.' }, 400);

    // Strip HTML
    const cleanBody = body.replace(/<[^>]*>/g, '').trim();
    const cleanName = name.replace(/<[^>]*>/g, '').trim().slice(0, 80);

    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL  || env.PUBLIC_SUPABASE_URL  || import.meta.env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Server configuration error.' }, 500);

    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await db.from('blog_recipe_comments').insert({
      recipe_id,
      name: cleanName,
      email: email.trim().toLowerCase().slice(0, 254),
      body: cleanBody,
      approved: true,
    }).select('id, name, body, created_at').single();

    if (error) throw error;

    return json({ success: true, comment: data });
  } catch (err) {
    console.error('[blog/comment]', err);
    return json({ error: 'Something went wrong.' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
