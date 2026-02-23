import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// PAYHIP WEBHOOK v3 — البنية الصحيحة
// payload من Payhip:
// {
//   "id": "ZGjVj5x4GN",
//   "email": "buyer@example.com",
//   "price": 9999,              ← بالسنتات
//   "currency": "USD",
//   "items": [{
//     "product_id": "OEQk9",
//     "product_name": "keto ebook",
//     "has_variant": true,
//     "variant_name": "pro plan",  ← هذا ما نحتاجه
//   }]
// }
// ═══════════════════════════════════════

function determineTier(price: number, variantName: string, productName: string): { tier: string; days: number } {
  const variant = (variantName || '').toLowerCase().trim();
  const product  = (productName  || '').toLowerCase().trim();

  // 1️⃣ من اسم الـ variant (الأدق)
  if (variant.includes('elite'))  return { tier: 'elite_12', days: 365 };
  if (variant.includes('pro'))    return { tier: 'pro_6',    days: 180 };
  if (variant.includes('basic'))  return { tier: 'basic_30', days: 30  };

  // 2️⃣ من اسم المنتج
  if (product.includes('elite'))  return { tier: 'elite_12', days: 365 };
  if (product.includes('pro'))    return { tier: 'pro_6',    days: 180 };
  if (product.includes('basic'))  return { tier: 'basic_30', days: 30  };

  // 3️⃣ من السعر بالسنتات
  // elite = $199.99 → 19999 | pro = $99.99 → 9999 | basic = $29.99 → 2999
  if (price >= 15000) return { tier: 'elite_12', days: 365 };
  if (price >= 5000)  return { tier: 'pro_6',    days: 180 };

  return { tier: 'basic_30', days: 30 };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // قراءة الـ body — يدعم JSON و form-encoded
    let payload: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      payload = Object.fromEntries(params.entries());
      // items تأتي كـ JSON string في form-encoded
      if (payload.items && typeof payload.items === 'string') {
        try { payload.items = JSON.parse(payload.items); } catch {}
      }
    } else {
      // محاولة JSON كـ fallback
      const text = await request.text();
      try { payload = JSON.parse(text); } catch {
        payload = Object.fromEntries(new URLSearchParams(text).entries());
      }
    }

    console.log('🔔 PAYHIP WEBHOOK RECEIVED');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // ── استخراج البيانات ────────────────────
    // Payhip يرسل "email" وليس "buyer_email"
    const buyerEmail = (payload.email || payload.buyer_email || '').trim().toLowerCase();
    const saleId     = payload.id || payload.sale_id || '';
    const price      = parseInt(payload.price || '0', 10); // بالسنتات

    // المنتج في items[0]
    const items       = Array.isArray(payload.items) ? payload.items : [];
    const firstItem   = items[0] || {};
    const variantName = firstItem.variant_name || payload.variant_name || '';
    const productName = firstItem.product_name || payload.product_name || '';

    console.log('📧 Email:', buyerEmail);
    console.log('💰 Price (cents):', price);
    console.log('🏷️  Variant:', variantName);
    console.log('📦 Product:', productName);

    if (!buyerEmail) {
      console.error('❌ No email in payload');
      return new Response(JSON.stringify({ error: 'No email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Supabase ────────────────────────────
    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ No Supabase config');
      return new Response(JSON.stringify({ error: 'Server config error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── تحديد الخطة ────────────────────────
    const { tier, days } = determineTier(price, variantName, productName);
    console.log(`🎯 Tier: ${tier} | Days: ${days}`);

    const startDate = new Date().toISOString();
    const endDate   = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endISO = endDate.toISOString();

    // ── البحث عن المستخدم ───────────────────
    const { data: users } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', buyerEmail);

    const user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      // المستخدم لم يسجل بعد — نحفظ في pending
      console.log('⏳ User not found — saving to pending_activations');

      await supabase.from('pending_activations').upsert({
        email:                   buyerEmail,
        subscription_tier:       tier,
        subscription_start_date: startDate,
        subscription_end_date:   endISO,
        payhip_sale_id:          saleId,
        payhip_data:             payload,
        activated:               false,
        created_at:              new Date().toISOString(),
      }, { onConflict: 'email' });

      console.log('✅ Saved to pending_activations');
      return new Response(JSON.stringify({
        success: true,
        status:  'pending',
        tier,
        email:   buyerEmail,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── المستخدم موجود — تحديث مباشر ────────
    console.log(`✅ User found: ${user.email} — updating subscription`);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier:       tier,
        subscription_status:     'active',
        subscription_start_date: startDate,
        subscription_end_date:   endISO,
        payhip_sale_id:          saleId,
        updated_at:              new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Update error:', updateError.message);
      return new Response(JSON.stringify({ error: 'DB update failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Subscription updated: ${buyerEmail} → ${tier}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription activated',
      email:   buyerEmail,
      tier,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('❌ Webhook error:', err);
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
    message:  'Payhip webhook endpoint v3',
    status:   'ready',
    endpoint: 'POST /api/payhip/webhook',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};