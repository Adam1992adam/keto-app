import type { APIRoute } from 'astro';


// ═══════════════════════════════════════
// LEMON SQUEEZY WEBHOOK - Cloudflare compatible
// ═══════════════════════════════════════

async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const digest = Array.from(new Uint8Array(sig)).map((b: number) => b.toString(16).padStart(2,'0')).join('');
    return digest === signature;
  } catch { return false; }
}

function determineTier(variantName: string, price: number): { tier: string; days: number } {
  const name = (variantName || '').toLowerCase().trim();

  if (name.includes('elite'))  return { tier: 'elite_12', days: 360 };
  if (name.includes('pro'))    return { tier: 'pro_6',    days: 90  };
  if (name.includes('basic') || name.includes('basec')) return { tier: 'basic_30', days: 30 };

  // fallback by price (cents) — $149→Elite, $69→Pro, $29→Basic
  if (price >= 13000) return { tier: 'elite_12', days: 360 };
  if (price >= 5000)  return { tier: 'pro_6',    days: 90  };
  return { tier: 'basic_30', days: 30 };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // ── 1. قراءة الـ body كـ text للتحقق من الـ signature ──
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // ── 2. التحقق من الـ signature ──
    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const secret = env.LEMONSQUEEZY_SECRET || import.meta.env.LEMONSQUEEZY_SECRET || '';

    if (secret) {
      const valid = await verifySignature(secret, rawBody, signature);
      if (!valid) {
        console.error('❌ Invalid signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // ── 3. Parse payload ──
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    console.log('🍋 LEMONSQUEEZY WEBHOOK:', eventName);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // نتعامل فقط مع order_created
    if (eventName !== 'order_created') {
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── 4. استخراج البيانات ──
    const orderData    = payload.data?.attributes || {};
    const buyerEmail   = (orderData.user_email || '').trim().toLowerCase();
    const saleId       = payload.data?.id || '';
    const price        = orderData.total || 0; // بالسنتات
    const status       = orderData.status; // 'paid' | 'refunded' etc

    // الـ variant اسمه في first_order_item
    const firstItem    = orderData.first_order_item || {};
    const variantName  = firstItem.variant_name || firstItem.product_name || '';
    const variantId    = String(firstItem.variant_id || '');

    console.log('📧 Email:', buyerEmail);
    console.log('💰 Total (cents):', price);
    console.log('🏷️  Variant:', variantName, '| ID:', variantId);
    console.log('📊 Status:', status);

    if (!buyerEmail) {
      console.error('❌ No email in payload');
      return new Response(JSON.stringify({ error: 'No email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (status !== 'paid') {
      console.log('⚠️ Order not paid, skipping. Status:', status);
      return new Response(JSON.stringify({ received: true, skipped: true, reason: 'not_paid' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── 5. تحديد الخطة ──
    const { tier, days } = determineTier(variantName, price);
    console.log(`🎯 Tier: ${tier} | Days: ${days}`);

    // ── 6. نوع المنتج: جديد أم ترقية؟ ──
    const productName = (orderData.first_order_item?.product_name || '').toLowerCase();
    const isUpgrade = productName.includes('upgrade');
    console.log(`📦 Product: "${productName}" → ${isUpgrade ? 'UPGRADE' : 'NEW USER'}`);

    // ── 7. Supabase ──
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

    const startDate = new Date().toISOString();
    const endDate   = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endISO = endDate.toISOString();

    // ══════════════════════════════════════
    // مسار الترقية — يحدّث profiles مباشرة
    // ══════════════════════════════════════
    if (isUpgrade) {
      const { data: users, error: searchErr } = await supabase
        .from('profiles')
        .select('id, email, subscription_tier')
        .ilike('email', buyerEmail);

      console.log('🔍 Upgrade search:', users?.length ? `Found: ${users[0].email} (${users[0].subscription_tier})` : 'Not found');

      if (searchErr) console.error('Search error:', searchErr.message);

      if (users && users.length > 0) {
        const { error: updateErr } = await supabase.from('profiles').update({
          subscription_tier:       tier,
          subscription_status:     'active',
          subscription_start_date: startDate,
          subscription_end_date:   endISO,
          payhip_sale_id:          saleId,
          updated_at:              new Date().toISOString(),
        }).eq('id', users[0].id);

        if (updateErr) {
          console.error('❌ Upgrade update error:', updateErr.message);
          return new Response(JSON.stringify({ error: updateErr.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }

        console.log(`✅ UPGRADED: ${buyerEmail} → ${tier}`);
        return new Response(JSON.stringify({ success: true, status: 'upgraded', tier, email: buyerEmail }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // المستخدم دفع للترقية لكن ليس لديه حساب — نحفظه كـ pending
        console.log('⚠️ Upgrade but no profile found — saving to pending');
      }
    }

    // ══════════════════════════════════════
    // مسار المستخدم الجديد — pending_activations
    // ══════════════════════════════════════
    const { error: upsertError } = await supabase.from('pending_activations').upsert({
      email:                   buyerEmail,
      subscription_tier:       tier,
      subscription_start_date: startDate,
      subscription_end_date:   endISO,
      payhip_sale_id:          saleId,
      payhip_data:             payload,
      activated:               false,
      created_at:              new Date().toISOString(),
    }, { onConflict: 'email' });

    if (upsertError) {
      console.error('❌ Upsert error:', upsertError.message);
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Saved to pending_activations: ${buyerEmail} → ${tier}`);
    return new Response(JSON.stringify({ success: true, status: 'pending', tier, email: buyerEmail }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('❌ LemonSqueezy webhook error:', err);
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
    message: 'LemonSqueezy webhook endpoint',
    status:  'ready',
    event:   'order_created',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};