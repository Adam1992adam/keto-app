import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// SIGNUP AFTER PURCHASE VERIFICATION
// Called from signup.astro after verifying the purchase
// ═══════════════════════════════════════

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email, password, fullName, tier, startDate, endDate, saleId } =
      await request.json();

    // ── Validate required fields ──────────────
    if (!email || !password || !fullName || !tier) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validTiers = ['basic_30', 'pro_6', 'elite_12'];
    if (!validTiers.includes(tier)) {
      return new Response(JSON.stringify({ error: 'Invalid tier' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Read Supabase credentials ─────────────
    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const cleanEmail = email.trim().toLowerCase();

    // ── Check email not already registered ────
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Create Supabase Auth account ──────────
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError.message);
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ error: 'Failed to create user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = authData.user.id;

    // ── Calculate subscription dates ──────────
    const tierDays: Record<string, number> = {
      basic_30:  30,
      pro_6:    180,
      elite_12: 365,
    };

    const subStart = startDate ? new Date(startDate) : new Date();
    const subEnd   = endDate
      ? new Date(endDate)
      : new Date(Date.now() + tierDays[tier] * 86400000);

    // ── Insert profile row ────────────────────
    const { error: profileError } = await supabase.from('profiles').insert({
      id:                      userId,
      email:                   cleanEmail,
      full_name:               fullName,
      subscription_tier:       tier,
      subscription_status:     'active',
      subscription_start_date: subStart.toISOString(),
      subscription_end_date:   subEnd.toISOString(),
      payhip_sale_id:          saleId || null,
      preferred_units:         'imperial',
      created_at:              new Date().toISOString(),
      updated_at:              new Date().toISOString(),
    });

    if (profileError) {
      console.error('Profile insert error:', profileError.message);
      // Account was created — log error but don't fail
    }

    // ── Mark pending_activations as activated ─
    await supabase
      .from('pending_activations')
      .update({
        activated:    true,
        activated_at: new Date().toISOString(),
      })
      .eq('email', cleanEmail)
      .eq('activated', false);

    console.log(`✅ New user registered: ${cleanEmail} | tier: ${tier}`);

    // ── Send welcome email (fire-and-forget) ──────────
    try {
      const { sendWelcomeEmail } = await import('../../../lib/email');
      await sendWelcomeEmail(cleanEmail, fullName, tier).catch(() => {});
    } catch { /* email failure must never block signup */ }

    return new Response(JSON.stringify({
      success: true,
      message: 'Account created successfully',
      user: {
        id:    userId,
        email: cleanEmail,
        tier,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('signup-purchase error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
