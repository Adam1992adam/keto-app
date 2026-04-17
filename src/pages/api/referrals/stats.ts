// GET /api/referrals/stats
// Returns the user's referral code, total invites, XP earned, and referral history.
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';


export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  const [codeRes, referralsRes] = await Promise.all([
    db
      .from('referral_codes')
      .select('code, uses_count, created_at')
      .eq('user_id', user.id)
      .maybeSingle(),
    db
      .from('referrals')
      .select('status, xp_awarded, created_at')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const referrals    = referralsRes.data || [];
  const totalXP      = referrals.reduce((s, r) => s + (r.xp_awarded || 0), 0);
  const completed    = referrals.filter(r => r.status === 'completed').length;

  return json({
    code:       codeRes.data?.code       || null,
    uses_count: codeRes.data?.uses_count || 0,
    total:      referrals.length,
    completed,
    total_xp:   totalXP,
    referrals:  referrals.map(r => ({
      status:     r.status,
      xp_awarded: r.xp_awarded,
      date:       r.created_at?.slice(0, 10),
    })),
  });
};
