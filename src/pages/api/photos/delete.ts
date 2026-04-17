// src/pages/api/photos/delete.ts
// DELETE /api/photos/delete
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

const BUCKET = 'progress-photos';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const { photo_id } = body;
  if (!photo_id) return json({ error: 'photo_id is required' }, 400);

  // Fetch the record first to get the storage path — and confirm ownership via user_id filter
  const { data: photo, error: fetchErr } = await db
    .from('progress_photos')
    .select('id, photo_data')
    .eq('id', photo_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchErr) {
    console.error('Photo fetch error:', fetchErr);
    return json({ error: 'Server error' }, 500);
  }

  if (!photo) return json({ error: 'Photo not found' }, 404);

  // Delete from Storage if photo_data holds a storage path (not legacy base64)
  const storagePath = photo.photo_data;
  if (storagePath && !storagePath.startsWith('data:')) {
    const { error: storageErr } = await db.storage
      .from(BUCKET)
      .remove([storagePath]);

    if (storageErr) {
      // Log but don't abort — still delete the DB record so the UI stays consistent
      console.error('Storage delete error for photo', photo_id, storageErr);
    }
  }

  const { error: dbErr } = await db
    .from('progress_photos')
    .delete()
    .eq('id', photo_id)
    .eq('user_id', user.id);

  if (dbErr) {
    console.error('Photo DB delete error:', dbErr);
    return json({ error: 'Server error' }, 500);
  }

  return json({ success: true });
};

