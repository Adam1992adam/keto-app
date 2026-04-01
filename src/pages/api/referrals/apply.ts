// POST /api/referrals/apply
// Called after a new user completes signup.
// Body: { referral_code: string }
// Looks up the referrer, records the referral, awards 150 XP to referrer.
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

const REFERRAL_XP = 150;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

  const { referral_code } = await request.json();
  if (!referral_code) return json({ error: 'Missing referral_code' }, 400);

  const code = String(referral_code).trim().toUpperCase();

  // Look up the referral code
  const { data: codeRow } = await supabase
    .from('referral_codes')
    .select('user_id')
    .eq('code', code)
    .maybeSingle();

  if (!codeRow) return json({ error: 'Invalid referral code' }, 404);

  // Prevent self-referral
  if (codeRow.user_id === user.id) return json({ error: 'Cannot use your own code' }, 400);

  // Check if this user was already referred
  const { data: existing } = await supabase
    .from('referrals')
    .select('id')
    .eq('referred_user_id', user.id)
    .maybeSingle();

  if (existing) return json({ error: 'Already applied a referral code' }, 409);

  // Record the referral
  const { error: insertErr } = await supabase
    .from('referrals')
    .insert({
      referrer_id:      codeRow.user_id,
      referred_user_id: user.id,
      status:           'completed',
      xp_awarded:       REFERRAL_XP,
    });

  if (insertErr) return json({ error: 'Failed to record referral' }, 500);

  // Increment uses_count on the code
  await supabase.rpc('increment_referral_count', { code_val: code }).catch(() => {
    // Fallback: direct update if RPC doesn't exist
    supabase
      .from('referral_codes')
      .update({ uses_count: (codeRow as any).uses_count + 1 })
      .eq('code', code);
  });

  // Award XP to referrer via the existing award_xp RPC
  await supabase.rpc('award_xp', {
    user_id_param:     codeRow.user_id,
    action_type_param: 'referral',
    xp_amount_param:   REFERRAL_XP,
    description_param: 'Friend joined using your referral code',
    day_number_param:  1,
  });

  return json({ success: true, xp_awarded: REFERRAL_XP });
};
