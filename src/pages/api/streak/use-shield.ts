// POST /api/streak/use-shield
// Activates a streak shield to cover a missed yesterday.
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;

    const { data, error } = await db.rpc('use_streak_shield', {
      user_id_param: user.id,
    });

    if (error) return json({ error: 'Server error' }, 500);

    const result = data as { success: boolean; error?: string; shields_remaining?: number; new_streak?: number };

    if (!result.success) return json({ error: result.error || 'Shield failed' }, 400);

    return json({
      success:           true,
      shields_remaining: result.shields_remaining ?? 0,
      new_streak:        result.new_streak ?? 1,
    });
  } catch {
    return json({ error: 'Server error' }, 500);
  }
};

