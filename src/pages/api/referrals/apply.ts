// POST /api/referrals/apply
// Called after a new user completes signup.
// Body: { referral_code: string }
// Looks up the referrer, records the referral, awards 150 XP to referrer.
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

const REFERRAL_XP = 150;


export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  const { referral_code } = await request.json();
  if (!referral_code) return json({ error: 'Missing referral_code' }, 400);

  const code = String(referral_code).trim().toUpperCase();

  // Look up the referral code — SELECT policy allows any authenticated user to read codes
  const { data: codeRow } = await db
    .from('referral_codes')
    .select('user_id')
    .eq('code', code)
    .maybeSingle();

  if (!codeRow) return json({ error: 'Invalid referral code' }, 404);

  // Prevent self-referral
  if (codeRow.user_id === user.id) return json({ error: 'Cannot use your own code' }, 400);

  // Check if this user was already referred
  const { data: existing } = await db
    .from('referrals')
    .select('id')
    .eq('referred_user_id', user.id)
    .maybeSingle();

  if (existing) return json({ error: 'Already applied a referral code' }, 409);

  // Record the referral — INSERT policy requires auth.uid() = referred_user_id
  const { error: insertErr } = await db
    .from('referrals')
    .insert({
      referrer_id:      codeRow.user_id,
      referred_user_id: user.id,
      status:           'completed',
      xp_awarded:       REFERRAL_XP,
    });

  if (insertErr) return json({ error: 'Server error' }, 500);

  // Increment uses_count via SECURITY DEFINER RPC — bypasses RLS to update another user's code
  await db.rpc('increment_referral_count', { code_val: code });

  // Award XP to referrer via the existing award_xp RPC
  await db.rpc('award_xp', {
    user_id_param:     codeRow.user_id,
    action_type_param: 'referral',
    xp_amount_param:   REFERRAL_XP,
    description_param: 'Friend joined using your referral code',
    day_number_param:  1,
  });

  return json({ success: true, xp_awarded: REFERRAL_XP });
};
