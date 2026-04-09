// POST /api/lemonsqueezy/webhook
// Handles LemonSqueezy order events and keeps subscriptions in sync.
//
// Supported events:
//   order_created   → activate subscription (direct if user_id in custom_data, else pending)
//   order_refunded  → cancel subscription
//
// All DB writes use the service role key to bypass RLS.

import type { APIRoute } from 'astro';

// ─── HMAC signature verification ─────────────────────────────────────────────
async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['sign'],
    );
    const sig    = await crypto.subtle.sign('HMAC', key, enc.encode(body));
    const digest = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
    return digest === signature;
  } catch { return false; }
}

// ─── Tier detection ───────────────────────────────────────────────────────────
function detectTier(variantName: string, priceCents: number): { tier: string; days: number } {
  const name = (variantName || '').toLowerCase();
  if (name.includes('elite'))               return { tier: 'elite_12', days: 360 };
  if (name.includes('pro'))                 return { tier: 'pro_6',    days: 90  };
  if (name.includes('basic'))               return { tier: 'basic_30', days: 30  };
  // Price fallback (cents): Elite ≥ $130, Pro ≥ $50, else Basic
  if (priceCents >= 13000)                  return { tier: 'elite_12', days: 360 };
  if (priceCents >= 5000)                   return { tier: 'pro_6',    days: 90  };
  return { tier: 'basic_30', days: 30 };
}

// ─── Route ───────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const rawBody  = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // Read env — process.env (Vercel runtime) → import.meta.env (build-time) → Cloudflare locals
    const cfEnv      = (locals as any)?.runtime?.env || {};
    const SECRET     = process.env.LEMONSQUEEZY_SECRET    || import.meta.env.LEMONSQUEEZY_SECRET    || cfEnv.LEMONSQUEEZY_SECRET    || '';
    const SUPABASE_URL  = process.env.PUBLIC_SUPABASE_URL       || import.meta.env.PUBLIC_SUPABASE_URL       || cfEnv.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || cfEnv.SUPABASE_SERVICE_ROLE_KEY;

    // Signature verification is MANDATORY — reject if secret is not configured
    if (!SECRET) {
      console.error('[LS Webhook] LEMONSQUEEZY_SECRET not configured — rejecting request');
      return json({ error: 'Server configuration error' }, 500);
    }
    const valid = await verifySignature(SECRET, rawBody, signature);
    if (!valid) {
      console.error('[LS Webhook] Invalid signature — possible spoofed request');
      return json({ error: 'Invalid signature' }, 401);
    }

    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error('[LS Webhook] Missing Supabase service role config');
      return json({ error: 'Server configuration error' }, 500);
    }

    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(SUPABASE_URL, SERVICE_KEY);

    const payload   = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name as string;
    console.log(`[LS Webhook] Event: ${eventName}`);

    // ── order_created ─────────────────────────────────────────────────────────
    if (eventName === 'order_created') {
      const attrs        = payload.data?.attributes || {};
      const buyerEmail   = (attrs.user_email || '').trim().toLowerCase();
      const orderId      = String(payload.data?.id || '');
      const customerId   = String(attrs.customer_id || '');
      const priceCents   = attrs.total || 0;
      const orderStatus  = attrs.status;
      const firstItem    = attrs.first_order_item || {};
      const variantName  = firstItem.variant_name || firstItem.product_name || '';
      const customData   = payload.meta?.custom_data || {};
      const userId       = customData.user_id || null;   // present when upgrading from dashboard

      if (!buyerEmail) return json({ error: 'Missing email' }, 400);
      if (orderStatus !== 'paid') {
        console.log(`[LS Webhook] Skipping — status: ${orderStatus}`);
        return json({ received: true, skipped: true, reason: 'not_paid' });
      }

      // Idempotency: skip if this exact order ID was already processed
      if (orderId) {
        const { data: alreadyDone } = await db
          .from('profiles')
          .select('id')
          .eq('sale_id', orderId)
          .maybeSingle();
        if (alreadyDone) {
          console.log(`[LS Webhook] Duplicate order ${orderId} — already processed, skipping`);
          return json({ received: true, skipped: true, reason: 'duplicate_order' });
        }
        const { data: alreadyPending } = await db
          .from('pending_activations')
          .select('id')
          .eq('payhip_sale_id', orderId)
          .maybeSingle();
        if (alreadyPending) {
          console.log(`[LS Webhook] Duplicate order ${orderId} — already in pending, skipping`);
          return json({ received: true, skipped: true, reason: 'duplicate_order' });
        }
      }

      const { tier, days } = detectTier(variantName, priceCents);
      const startDate      = new Date().toISOString();
      const endDate        = new Date();
      endDate.setDate(endDate.getDate() + days);
      const endISO = endDate.toISOString();

      console.log(`[LS Webhook] order_created → tier: ${tier}, email: ${buyerEmail}, user_id: ${userId || 'none'}`);

      // Path A — logged-in user upgrading (user_id in custom_data)
      if (userId) {
        const { error } = await db.from('profiles').update({
          subscription_tier:       tier,
          subscription_status:     'active',
          subscription_start_date: startDate,
          subscription_end_date:   endISO,
          sale_id:                 orderId,
          updated_at:              new Date().toISOString(),
        }).eq('id', userId);

        if (error) {
          console.error('[LS Webhook] Profile update error:', error.message);
          return json({ error: error.message }, 500);
        }
        console.log(`[LS Webhook] ✅ Upgraded user ${userId} → ${tier}`);
        return json({ success: true, status: 'upgraded', tier });
      }

      // Path B — new user (no account yet) or email-only upgrade
      // First check if an account already exists for this email
      const { data: existing } = await db
        .from('profiles')
        .select('id, subscription_tier')
        .ilike('email', buyerEmail)
        .maybeSingle();

      if (existing) {
        const { error } = await db.from('profiles').update({
          subscription_tier:       tier,
          subscription_status:     'active',
          subscription_start_date: startDate,
          subscription_end_date:   endISO,
          sale_id:                 orderId,
          updated_at:              new Date().toISOString(),
        }).eq('id', existing.id);

        if (error) {
          console.error('[LS Webhook] Email-based update error:', error.message);
          return json({ error: error.message }, 500);
        }
        console.log(`[LS Webhook] ✅ Email-matched upgrade: ${buyerEmail} → ${tier}`);
        return json({ success: true, status: 'upgraded_by_email', tier });
      }

      // No account found — save to pending_activations for when they sign up
      const { error: upsertErr } = await db.from('pending_activations').upsert({
        email:                   buyerEmail,
        subscription_tier:       tier,
        subscription_start_date: startDate,
        subscription_end_date:   endISO,
        payhip_sale_id:          orderId,
        payhip_data:             payload,
        activated:               false,
        created_at:              new Date().toISOString(),
      }, { onConflict: 'email' });

      if (upsertErr) {
        console.error('[LS Webhook] pending_activations upsert error:', upsertErr.message);
        return json({ error: upsertErr.message }, 500);
      }

      console.log(`[LS Webhook] ✅ Saved to pending: ${buyerEmail} → ${tier}`);
      return json({ success: true, status: 'pending', tier });
    }

    // ── order_refunded ────────────────────────────────────────────────────────
    if (eventName === 'order_refunded') {
      const attrs      = payload.data?.attributes || {};
      const buyerEmail = (attrs.user_email || '').trim().toLowerCase();
      const customData = payload.meta?.custom_data || {};
      const userId     = customData.user_id || null;

      console.log(`[LS Webhook] order_refunded → email: ${buyerEmail}, user_id: ${userId || 'none'}`);

      if (userId) {
        await db.from('profiles').update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
      } else if (buyerEmail) {
        await db.from('profiles').update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).ilike('email', buyerEmail);
      }

      // Also remove from pending_activations if they haven't signed up yet
      if (buyerEmail) {
        await db.from('pending_activations').delete().ilike('email', buyerEmail);
      }

      console.log(`[LS Webhook] ✅ Cancelled subscription for ${userId || buyerEmail}`);
      return json({ success: true, status: 'cancelled' });
    }

    // Unhandled event — acknowledge receipt so LS doesn't retry
    console.log(`[LS Webhook] Unhandled event: ${eventName}`);
    return json({ received: true, skipped: true });

  } catch (err) {
    console.error('[LS Webhook] Uncaught error:', err);
    return json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500);
  }
};

// Health-check endpoint
export const GET: APIRoute = async () =>
  json({ status: 'ready', endpoint: '/api/lemonsqueezy/webhook' });

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
