import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// VERIFY PURCHASE
// Checks pending_activations in Supabase
// (populated by LemonSqueezy webhook)
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
    const SUPABASE_URL  = process.env.PUBLIC_SUPABASE_URL       || import.meta.env.PUBLIC_SUPABASE_URL       || env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return new Response(JSON.stringify({ error: 'Server config error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Service role key required — pending_activations has RLS enabled with no anon policy
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // ── 1. Check email not already registered ─
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email, subscription_tier')
      .eq('email', email)
      .maybeSingle();

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

    // ── 2. Look up pending_activations ────────
    const { data: pending } = await supabase
      .from('pending_activations')
      .select('*')
      .eq('email', email)
      .eq('activated', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

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

    // ── 3. Purchase found ✅ ──────────────────
    const tierDays: Record<string, number> = {
      basic_30:  30,
      pro_6:     90,
      elite_12: 360,
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
        start_date: startDate.toISOString(),
        end_date:   endDate.toISOString(),
        sale_id:    pending.payhip_sale_id || pending.sale_id || '',
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
    message: 'Verify Purchase API',
    usage:   'POST {"email":"buyer@example.com"}',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
