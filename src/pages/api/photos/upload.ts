// src/pages/api/photos/upload.ts
// POST /api/photos/upload
//
// REQUIRED SETUP (one-time, in Supabase dashboard → Storage):
//   1. Create bucket: "progress-photos" (public: false)
//   2. Add RLS policies on storage.objects for the bucket:
//      INSERT: bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text
//      SELECT: bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text
//      DELETE: bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
};

const BUCKET = 'progress-photos';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;
  const userId = user.id;

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const { photo_data, taken_date, notes } = body;

  if (!photo_data || typeof photo_data !== 'string') {
    return json({ error: 'photo_data is required' }, 400);
  }

  // Validate it's a proper image data URL and extract MIME type
  const dataUrlMatch = photo_data.match(/^data:(image\/[a-z]+);base64,/);
  if (!dataUrlMatch) {
    return json({ error: 'photo_data must be a base64 image data URL' }, 400);
  }

  const mimeType = dataUrlMatch[1];
  const ext = ALLOWED_MIME_TYPES[mimeType];
  if (!ext) {
    return json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, 400);
  }

  // Decode base64 to binary — using Web APIs (atob) for edge compatibility
  const base64Payload = photo_data.slice(dataUrlMatch[0].length);
  let bytes: Uint8Array;
  try {
    const binary = atob(base64Payload);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  } catch {
    return json({ error: 'Invalid base64 data' }, 400);
  }

  // Size check on the actual decoded bytes
  if (bytes.length > 500 * 1024) {
    return json({ error: 'Image too large. Maximum size is 500KB.' }, 400);
  }

  // Per-user lifetime cap + daily rate limit — both checked in parallel
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [{ count: totalCount }, { count: todayCount }] = await Promise.all([
    db.from('progress_photos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    db.from('progress_photos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString()),
  ]);

  if ((totalCount ?? 0) >= 50) {
    return json({ error: 'Maximum of 50 photos allowed. Delete older photos to upload new ones.' }, 400);
  }
  if ((todayCount ?? 0) >= 5) {
    return json({ error: 'Daily upload limit reached (5 per day). Try again tomorrow.' }, 429);
  }

  const today = new Date().toISOString().split('T')[0];
  const takenDate = (taken_date && /^\d{4}-\d{2}-\d{2}$/.test(taken_date)) ? taken_date : today;

  // Upload to Supabase Storage — path scoped to user_id so Storage RLS can enforce ownership
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `${user.id}/${filename}`;

  const { error: storageErr } = await db.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType: mimeType, upsert: false });

  if (storageErr) {
    console.error('[photos/upload] user:', userId, 'storage error:', storageErr);
    return json({ error: 'Server error' }, 500);
  }

  // Get a long-lived signed URL (1 year) — avoids exposing public bucket
  const { data: signedData, error: signedErr } = await db.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

  if (signedErr || !signedData?.signedUrl) {
    // Clean up the orphaned storage object
    await db.storage.from(BUCKET).remove([storagePath]);
    console.error('[photos/upload] user:', userId, 'signed URL error:', signedErr);
    return json({ error: 'Server error' }, 500);
  }

  // Store the storage path (not base64) in photo_data — URL reconstructed on read
  const { data, error: dbErr } = await db
    .from('progress_photos')
    .insert({
      user_id:    user.id,
      photo_data: storagePath,   // storage path replaces raw base64
      taken_date: takenDate,
      notes:      notes || null,
    })
    .select('id, taken_date, notes, created_at')
    .maybeSingle();

  if (dbErr) {
    // Clean up the orphaned storage object
    await db.storage.from(BUCKET).remove([storagePath]);
    console.error('[photos/upload] user:', userId, 'DB insert error:', dbErr);
    return json({ error: 'Server error' }, 500);
  }

  return json({ success: true, photo: { ...data, photo_url: signedData.signedUrl } });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
