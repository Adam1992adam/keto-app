import type { APIRoute } from 'astro';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = await checkRateLimit(`trial:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) return json({ error: `Too many requests. Try again in ${retryAfterSec}s.` }, 429);

  try {
    const { fullName, email, password, quizAnswers, recommendedPlan, referral_code } = await request.json();

    if (!fullName?.trim()) return json({ error: 'Name is required' }, 400);
    if (!email?.trim() || !email.includes('@')) return json({ error: 'Valid email is required' }, 400);
    if (!password || password.length < 6) return json({ error: 'Password must be at least 6 characters' }, 400);

    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const SUPABASE_ANON = process.env.PUBLIC_SUPABASE_ANON_KEY || env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Server configuration error' }, 500);

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON || '');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName  = fullName.trim().slice(0, 100);

    // Check email not already registered
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', cleanEmail).maybeSingle();
    if (existing) return json({ error: 'This email is already registered. Please log in instead.' }, 409);

    // Create auth account (auto-confirm — no email verification friction for trial)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email:          cleanEmail,
      password,
      email_confirm:  true,
      user_metadata:  { full_name: cleanName },
    });
    if (authError) return json({ error: authError.message }, 400);
    if (!authData.user) return json({ error: 'Failed to create account' }, 500);

    const userId   = authData.user.id;
    const now      = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Insert profile — trial users get basic_30 tier for 7 days + is_trial flag
    const { error: profileError } = await supabase.from('profiles').insert({
      id:                      userId,
      email:                   cleanEmail,
      full_name:               cleanName,
      subscription_tier:       'basic_30',
      subscription_status:     'trial',
      subscription_start_date: now.toISOString(),
      subscription_end_date:   trialEnd.toISOString(),
      is_trial:                true,
      preferred_units:         'imperial',
      created_at:              now.toISOString(),
      updated_at:              now.toISOString(),
    });

    if (profileError) {
      console.error('[signup-trial] profile insert user:', userId, profileError);
      // Auth account created — try to clean up but don't fail the whole request
    }

    // Save quiz answers
    if (quizAnswers) {
      const plan = typeof recommendedPlan === 'string' ? recommendedPlan.slice(0, 20) : 'basic';
      const { error: quizErr } = await supabase.from('quiz_responses').insert({
        user_id:          userId,
        goal:             quizAnswers.goal             || null,
        experience:       quizAnswers.experience       || null,
        challenges:       Array.isArray(quizAnswers.challenges)    ? quizAnswers.challenges    : [],
        dietary_restrictions: Array.isArray(quizAnswers.restrictions) ? quizAnswers.restrictions : [],
        activity_level:   quizAnswers.activity         || null,
        commitment:       quizAnswers.commitment        || null,
        recommended_plan: plan,
        created_at:       now.toISOString(),
      });
      if (quizErr) console.error('[signup-trial] quiz save user:', userId, quizErr);
    }

    // Apply referral code (fire-and-forget)
    if (referral_code && typeof referral_code === 'string') {
      void (async () => {
        try {
          const code = referral_code.trim().toUpperCase();
          const { data: codeRow } = await supabase.from('referral_codes').select('user_id').eq('code', code).maybeSingle();
          if (codeRow && codeRow.user_id !== userId) {
            await supabase.from('referrals').insert({ referrer_id: codeRow.user_id, referred_user_id: userId, status: 'completed', xp_awarded: 150 });
            await supabase.rpc('award_xp', { user_id_param: codeRow.user_id, action_type_param: 'referral', xp_amount_param: 150, description_param: 'Friend joined via referral', day_number_param: 1 });
          }
        } catch(e) { /* silent */ }
      })();
    }

    // Sign in the user and set auth cookies
    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({ email: cleanEmail, password });
    if (signInError || !signInData?.session) {
      console.error('[signup-trial] sign-in after create user:', userId, signInError);
      return json({ error: 'Account created but could not log you in automatically. Please log in manually.' }, 500);
    }

    // Mark lead as converted if they came via free-book flow (fire-and-forget)
    void supabase.from('leads').update({ converted: true }).eq('email', cleanEmail);

    console.log(`✅ Trial signup: ${cleanEmail}`);

    cookies.set('sb-access-token', signInData.session.access_token, {
      path: '/', httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7,
    });
    cookies.set('sb-refresh-token', signInData.session.refresh_token, {
      path: '/', httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 30,
    });

    return json({ success: true });

  } catch (err) {
    console.error('[signup-trial]', err);
    return json({ error: 'An unexpected error occurred' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
