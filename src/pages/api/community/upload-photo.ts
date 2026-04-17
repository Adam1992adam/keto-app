// src/pages/api/community/upload-photo.ts
// POST /api/community/upload-photo
// Body: { imageBase64: string (raw base64, no data-URL prefix), imageType: string }
// Returns: { url: string } — stable public URL from the community-photos bucket
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

const BUCKET   = 'community-photos';
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const { imageBase64, imageType } = body;

  if (!imageBase64 || typeof imageBase64 !== 'string')
    return json({ error: 'imageBase64 is required' }, 400);

  const ext = ALLOWED[imageType];
  if (!ext)
    return json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, 400);

  // Decode base64 → binary — using Web APIs (atob) for Vercel Edge compatibility
  let bytes: Uint8Array;
  try {
    const binary = atob(imageBase64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  } catch {
    return json({ error: 'Invalid base64 data' }, 400);
  }

  if (bytes.length > MAX_BYTES)
    return json({ error: 'Image too large — maximum 2 MB' }, 400);

  // Daily rate limit: 5 photo posts per day
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count: todayCount } = await db
    .from('community_posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('post_type', 'photo')
    .gte('created_at', todayStart.toISOString());

  if ((todayCount ?? 0) >= 5)
    return json({ error: 'Daily photo post limit reached (5/day)' }, 429);

  // Upload to community-photos/{user_id}/{timestamp}-{random}.{ext}
  const filename    = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `${user.id}/${filename}`;

  const { error: storageErr } = await db.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType: imageType, upsert: false });

  if (storageErr) {
    console.error('[community/upload-photo] user:', user.id, storageErr);
    return json({ error: 'Upload failed. Please try again.' }, 500);
  }

  // Public bucket → stable URL, no signing needed
  const { data: pubData } = db.storage.from(BUCKET).getPublicUrl(storagePath);
  if (!pubData?.publicUrl) {
    await db.storage.from(BUCKET).remove([storagePath]);
    return json({ error: 'Failed to generate image URL' }, 500);
  }

  return json({ url: pubData.publicUrl });
};

