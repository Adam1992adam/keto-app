import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// SIGNUP AFTER PAYHIP PURCHASE VERIFICATION
// يُستدعى من signup.astro بعد التحقق من الشراء
// ═══════════════════════════════════════

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email, password, fullName, tier, startDate, endDate, saleId } =
      await request.json();

    // ── التحقق من الحقول المطلوبة ──────────
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

    // ── قراءة Supabase credentials ──────────
    // @ts-ignore
    const env = locals?.runtime?.env || {};
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

    // ── التحقق أن الإيميل غير مسجل مسبقاً ──
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .single();

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── إنشاء حساب في Supabase Auth ─────────
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

    // ── حساب تواريخ الاشتراك ────────────────
    const tierDays: Record<string, number> = {
      basic_30:  30,
      pro_6:    180,
      elite_12: 365,
    };

    const subStart = startDate ? new Date(startDate) : new Date();
    const subEnd   = endDate
      ? new Date(endDate)
      : new Date(Date.now() + tierDays[tier] * 86400000);

    // ── إنشاء profile في جدول profiles ──────
    const { error: profileError } = await supabase.from('profiles').insert({
      id:                     userId,
      email:                  cleanEmail,
      full_name:              fullName,
      subscription_tier:      tier,
      subscription_status:    'active',
      subscription_start_date: subStart.toISOString(),
      subscription_end_date:   subEnd.toISOString(),
      payhip_sale_id:          saleId || null,
      preferred_units:        'metric',
      created_at:             new Date().toISOString(),
      updated_at:             new Date().toISOString(),
    });

    if (profileError) {
      console.error('Profile insert error:', profileError.message);
      // لا نوقف العملية — الحساب تم إنشاؤه، فقط سجّل الخطأ
    }

    // ── تفعيل pending_activations إن وُجد ───
    await supabase
      .from('pending_activations')
      .update({
        activated:    true,
        activated_at: new Date().toISOString(),
      })
      .eq('email', cleanEmail)
      .eq('activated', false);

    console.log(`✅ New user registered: ${cleanEmail} | tier: ${tier}`);

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
    console.error('signup-payhip error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};