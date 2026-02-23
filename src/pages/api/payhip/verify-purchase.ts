import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// VERIFY PURCHASE v5
// يتحقق من pending_activations في Supabase
// بدل Payhip API (غير متاح للمبيعات)
// ═══════════════════════════════════════

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body  = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(JSON.stringify({ error: 'Server config error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── 1. تحقق أن المستخدم غير مسجل مسبقاً ─
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email, subscription_tier')
      .eq('email', email)
      .single();

    if (existingProfile) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        reason: 'already_registered',
        message: 'This email is already registered. Please login instead.',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── 2. ابحث في pending_activations ────────
    const { data: pending } = await supabase
      .from('pending_activations')
      .select('*')
      .eq('email', email)
      .eq('activated', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!pending) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        reason: 'no_purchase',
        message: 'No purchase found for this email.',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── 3. شراء موجود ✅ ──────────────────────
    const tierDays: Record<string, number> = {
      basic_30:  30,
      pro_6:    180,
      elite_12: 365,
    };

    const tier = pending.subscription_tier || 'basic_30';
    const days = tierDays[tier] || 30;

    const startDate = new Date();
    const endDate   = new Date();
    endDate.setDate(endDate.getDate() + days);

    console.log(`✅ Purchase verified: ${email} → ${tier}`);

    return new Response(JSON.stringify({
      success: true,
      canSignup: true,
      purchase: {
        email,
        tier,
        days,
        start_date:  startDate.toISOString(),
        end_date:    endDate.toISOString(),
        sale_id:     pending.payhip_sale_id || '',
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('verify-purchase error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Verify Purchase API v5',
    usage:   'POST {"email":"buyer@example.com"}',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};