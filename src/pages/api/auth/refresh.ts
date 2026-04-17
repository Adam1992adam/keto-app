// src/pages/api/auth/refresh.ts
// POST /api/auth/refresh — rotate access token using refresh token cookie
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ cookies }) => {
  const refreshToken = cookies.get('sb-refresh-token')?.value;
  if (!refreshToken) return json({ error: 'No refresh token' }, 401);

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) return json({ error: 'Session expired. Please log in again.' }, 401);

  cookies.set('sb-access-token', data.session.access_token, {
    path: '/', httpOnly: true, secure: true, sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  });
  cookies.set('sb-refresh-token', data.session.refresh_token, {
    path: '/', httpOnly: true, secure: true, sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  });

  return json({ success: true });
};

