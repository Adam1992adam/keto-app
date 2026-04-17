// src/pages/api/photos/list.ts
// GET /api/photos/list
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

const BUCKET = 'progress-photos';

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50);

  const { data: photos, error } = await db
    .from('progress_photos')
    .select('id, photo_data, taken_date, notes, created_at')
    .eq('user_id', user.id)
    .order('taken_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Photo list error:', error);
    return json({ error: 'Server error' }, 500);
  }

  // Resolve each photo to a usable URL.
  // photo_data holds either:
  //   - a storage path like "{user_id}/filename.jpg"  (new format)
  //   - a legacy base64 data URL like "data:image/jpeg;base64,..."  (old format)
  const resolved = await Promise.all((photos || []).map(async (photo) => {
    const { photo_data, ...rest } = photo;

    if (!photo_data) return { ...rest, photo_url: null };

    // Legacy base64 entries — return as-is so existing photos still render
    if (photo_data.startsWith('data:')) {
      return { ...rest, photo_url: photo_data };
    }

    // New storage path entries — generate a fresh signed URL
    const { data: signed, error: signErr } = await db.storage
      .from(BUCKET)
      .createSignedUrl(photo_data, 60 * 60 * 24); // 24-hour signed URL

    if (signErr || !signed?.signedUrl) {
      console.error('Signed URL error for photo', photo.id, signErr);
      return { ...rest, photo_url: null };
    }

    return { ...rest, photo_url: signed.signedUrl };
  }));

  return json({ success: true, photos: resolved });
};

