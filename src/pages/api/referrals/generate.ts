// POST /api/referrals/generate
// Gets the user's existing referral code, or creates one if none exists.
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeCode(userId: string): string {
  // KETO + 6 alphanumeric chars derived from userId + random salt
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seed   = userId.replace(/-/g, '').slice(0, 8);
  let code = 'KETO';
  for (let i = 0; i < 6; i++) {
    const byte = parseInt(seed[i] || '0', 16);
    code += chars[(byte + Math.floor(Math.random() * 8)) % chars.length];
  }
  return code;
}

export const POST: APIRoute = async ({ cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  // Check existing code
  const { data: existing } = await db
    .from('referral_codes')
    .select('code, uses_count')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) return json({ code: existing.code, uses_count: existing.uses_count });

  // Generate a unique code (retry on collision)
  let code = '';
  let attempts = 0;
  while (attempts < 5) {
    code = makeCode(user.id);
    const { data: collision } = await db
      .from('referral_codes')
      .select('id')
      .eq('code', code)
      .maybeSingle();
    if (!collision) break;
    attempts++;
  }

  const { error: insertErr } = await db
    .from('referral_codes')
    .insert({ user_id: user.id, code });

  if (insertErr) return json({ error: 'Failed to generate code' }, 500);

  return json({ code, uses_count: 0 });
};
