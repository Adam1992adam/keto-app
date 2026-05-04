import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin-session')?.value !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  const { imageBase64, imageType } = await request.json();
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(imageType)) return json({ error: 'Only JPEG, PNG, WebP allowed' }, 400);

  const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.byteLength > 5 * 1024 * 1024) return json({ error: 'Image must be under 5 MB' }, 400);

  const ext = imageType.split('/')[1].replace('jpeg', 'jpg');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  const db = createClient(url, key);

  const { error } = await db.storage.from('blog-images').upload(filename, buffer, {
    contentType: imageType,
    upsert: false,
  });

  if (error) return json({ error: error.message }, 500);

  const { data: { publicUrl } } = db.storage.from('blog-images').getPublicUrl(filename);
  return json({ url: publicUrl });
};
