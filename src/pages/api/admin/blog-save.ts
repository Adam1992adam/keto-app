import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('admin-session')?.value !== 'authenticated') return json({ error: 'Unauthorized' }, 401);
  const env = (locals as any)?.runtime?.env || {};
  const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  const body = await request.json();
  const {
    id, title, slug, excerpt = '', content = '', cover_image_url = '',
    category = 'General', tags = [], seo_title = '', seo_description = '',
    read_time_min = 5, author_name = 'KetoJourney Team', published = false,
  } = body;

  if (!title?.trim()) return json({ error: 'Title is required' }, 400);
  if (!slug?.trim())  return json({ error: 'Slug is required' }, 400);

  const db = createClient(SUPABASE_URL, SERVICE_KEY);
  const now = new Date().toISOString();
  const row: any = {
    title: title.trim().slice(0, 200),
    slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    excerpt: excerpt.trim().slice(0, 500),
    content: content.trim(),
    cover_image_url: cover_image_url.trim().slice(0, 500),
    category: category.trim().slice(0, 50),
    tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
    seo_title: seo_title.trim().slice(0, 160),
    seo_description: seo_description.trim().slice(0, 300),
    read_time_min: Math.max(1, Math.min(60, parseInt(read_time_min) || 5)),
    author_name: author_name.trim().slice(0, 100),
    published,
    updated_at: now,
  };

  if (published) row.published_at = now;

  let result;
  if (id) {
    result = await db.from('blog_posts').update(row).eq('id', id).select('id').single();
  } else {
    row.created_at = now;
    result = await db.from('blog_posts').insert(row).select('id').single();
  }

  if (result.error) {
    if (result.error.code === '23505') return json({ error: 'Slug already exists. Choose a different slug.' }, 409);
    return json({ error: result.error.message }, 500);
  }

  return json({ success: true, id: result.data.id });
};
