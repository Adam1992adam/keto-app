// src/pages/api/profile/update-language.ts
// POST /api/profile/update-language
// Saves the user's preferred display language to the DB and sets a cookie.

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { normaliseLang } from '../../../lib/i18n';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const lang = normaliseLang(body?.lang);

  const { error } = await db
    .from('profiles')
    .update({ preferred_language: lang, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return json({ error: error.message }, 500);

  // Set cookie so DashNav picks it up immediately on next render
  cookies.set('keto-lang', lang, {
    path:    '/',
    maxAge:  60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return json({ success: true, lang });
};

