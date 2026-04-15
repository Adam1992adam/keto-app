// POST /api/lemonsqueezy/webhook
// Handles all LemonSqueezy events for live production mode.
//
// One-time orders:
//   order_created   → activate subscription
//   order_refunded  → cancel subscription
//
// Recurring subscriptions:
//   subscription_created         → activate subscription
//   subscription_updated         → sync tier / status changes
//   subscription_cancelled       → mark cancelled (stays active until ends_at)
//   subscription_expired         → deactivate account
//   subscription_payment_success → extend subscription_end_date
//   subscription_payment_failed  → flag account (grace period)
//   subscription_payment_recovered → restore after failed payment
//   subscription_resumed         → restore after pause/cancel

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
// Matches product/variant name (case-insensitive) or falls back to price.
function detectTier(productName: string, variantName: string, priceCents: number): { tier: string; days: number } {
  const name = `${productName} ${variantName}`.toLowerCase();
  if (name.includes('elite'))  return { tier: 'elite_12', days: 360 };
  if (name.includes('pro'))    return { tier: 'pro_6',    days: 90  };
  if (name.includes('basic'))  return { tier: 'basic_30', days: 30  };
  // Price fallback (cents)
  if (priceCents >= 13000)     return { tier: 'elite_12', days: 360 };
  if (priceCents >= 5000)      return { tier: 'pro_6',    days: 90  };
  return { tier: 'basic_30', days: 30 };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

function getEnv(key: string, locals: any): string {
  const cfEnv = locals?.runtime?.env || {};
  return process.env[key] || import.meta.env[key] || cfEnv[key] || '';
}

// ─── Route ───────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, locals }) => {
  let rawBody = '';
  try {
    rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    const SECRET      = getEnv('LEMONSQUEEZY_WEBHOOK_SECRET', locals);
    const SUPABASE_URL = getEnv('PUBLIC_SUPABASE_URL', locals);
    const SERVICE_KEY  = getEnv('SUPABASE_SERVICE_ROLE_KEY', locals);

    if (!SECRET) {
      console.error('[LS Webhook] LEMONSQUEEZY_WEBHOOK_SECRET not set — rejecting');
      return json({ error: 'Server configuration error' }, 500);
    }

    const valid = await verifySignature(SECRET, rawBody, signature);
    if (!valid) {
      console.error('[LS Webhook] Invalid signature');
      return json({ error: 'Invalid signature' }, 401);
    }

    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error('[LS Webhook] Missing Supabase service role config');
      return json({ error: 'Server configuration error' }, 500);
    }

    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(SUPABASE_URL, SERVICE_KEY);

    const payload    = JSON.parse(rawBody);
    const eventName  = payload.meta?.event_name as string;
    const customData = payload.meta?.custom_data || {};
    const attrs      = payload.data?.attributes  || {};

    // ── Replay-attack protection ──────────────────────────────────────────────
    // The HMAC signature is unique per payload body. Inserting it into
    // processed_webhooks (UNIQUE constraint) atomically prevents replays:
    // a duplicate signature will fail with a 23505 unique violation.
    const { error: dupErr } = await db
      .from('processed_webhooks')
      .insert({ signature, event_name: eventName || 'unknown' });

    if (dupErr) {
      if (dupErr.code === '23505') {
        // Already processed — acknowledge so LemonSqueezy stops retrying
        console.log(`[LS Webhook] Duplicate signature for ${eventName} — skipping`);
        return json({ received: true, skipped: true, reason: 'duplicate' });
      }
      // Non-duplicate DB error — log but continue (don't block legitimate events)
      console.error('[LS Webhook] processed_webhooks insert error:', dupErr.message);
    }

    console.log(`[LS Webhook] Event: ${eventName}`);

    // ══════════════════════════════════════════════════════════════════════════
    // ORDER EVENTS (one-time purchases)
    // ══════════════════════════════════════════════════════════════════════════

    if (eventName === 'order_created') {
      const buyerEmail  = (attrs.user_email || '').trim().toLowerCase();
      const orderId     = String(payload.data?.id || '');
      const customerId  = String(attrs.customer_id || '');
      const priceCents  = attrs.total || 0;
      const orderStatus = attrs.status;
      const firstItem   = attrs.first_order_item || {};
      const productName = firstItem.product_name || '';
      const variantName = firstItem.variant_name || '';
      const userId      = customData.user_id || null;

      if (!buyerEmail) return json({ error: 'Missing email' }, 400);
      if (orderStatus !== 'paid') {
        return json({ received: true, skipped: true, reason: 'not_paid' });
      }

      // Idempotency — check both profiles and pending_activations
      if (orderId) {
        const [{ data: already }, { data: alreadyPending }] = await Promise.all([
          db.from('profiles').select('id').eq('ls_order_id', orderId).maybeSingle(),
          db.from('pending_activations').select('id').eq('ls_order_id', orderId).maybeSingle(),
        ]);
        if (already || alreadyPending) {
          console.log(`[LS Webhook] Duplicate order ${orderId} — skipping`);
          return json({ received: true, skipped: true, reason: 'duplicate' });
        }
      }

      const { tier, days } = detectTier(productName, variantName, priceCents);
      const startISO = new Date().toISOString();
      const endISO   = new Date(Date.now() + days * 86400000).toISOString();

      console.log(`[LS Webhook] order_created → tier: ${tier}, email: ${buyerEmail}, user_id: ${userId || 'none'}`);

      const profileUpdate = {
        subscription_tier:       tier,
        subscription_status:     'active',
        subscription_start_date: startISO,
        subscription_end_date:   endISO,
        payhip_sale_id:          orderId,   // keep legacy field populated
        ls_order_id:             orderId,
        ls_customer_id:          customerId || null,
        updated_at:              new Date().toISOString(),
      };

      // Path A — logged-in user upgrading (user_id passed in checkout custom_data)
      if (userId) {
        const { error } = await db.from('profiles').update(profileUpdate).eq('id', userId);
        if (error) {
          console.error('[LS Webhook] Profile update error:', error.message);
          return json({ error: error.message }, 500);
        }
        console.log(`[LS Webhook] ✅ Upgraded user ${userId} → ${tier}`);
        return json({ success: true, status: 'upgraded', tier });
      }

      // Path B — check if account already exists for this email
      const { data: existing } = await db
        .from('profiles').select('id').ilike('email', buyerEmail).maybeSingle();

      if (existing) {
        const { error } = await db.from('profiles').update(profileUpdate).eq('id', existing.id);
        if (error) {
          console.error('[LS Webhook] Email-based update error:', error.message);
          return json({ error: error.message }, 500);
        }
        console.log(`[LS Webhook] ✅ Email-matched upgrade: ${buyerEmail} → ${tier}`);
        return json({ success: true, status: 'upgraded_by_email', tier });
      }

      // Path C — new buyer, no account yet → pending
      const { error: pendingErr } = await db.from('pending_activations').upsert({
        email:                   buyerEmail,
        subscription_tier:       tier,
        subscription_start_date: startISO,
        subscription_end_date:   endISO,
        payhip_sale_id:          orderId,
        ls_order_id:             orderId,
        ls_customer_id:          customerId || null,
        payhip_data:             payload,
        activated:               false,
        created_at:              new Date().toISOString(),
      }, { onConflict: 'email' });

      if (pendingErr) {
        console.error('[LS Webhook] pending_activations error:', pendingErr.message);
        return json({ error: pendingErr.message }, 500);
      }

      console.log(`[LS Webhook] ✅ Saved to pending: ${buyerEmail} → ${tier}`);
      return json({ success: true, status: 'pending', tier });
    }

    // ─── order_refunded ───────────────────────────────────────────────────────
    if (eventName === 'order_refunded') {
      const buyerEmail = (attrs.user_email || '').trim().toLowerCase();
      const orderId    = String(payload.data?.id || '');
      const userId     = customData.user_id || null;

      console.log(`[LS Webhook] order_refunded → email: ${buyerEmail}`);

      const cancelUpdate = {
        subscription_status:       'cancelled',
        subscription_cancelled_at: new Date().toISOString(),
        updated_at:                new Date().toISOString(),
      };

      if (userId) {
        await db.from('profiles').update(cancelUpdate).eq('id', userId);
      } else if (buyerEmail) {
        await db.from('profiles').update(cancelUpdate).ilike('email', buyerEmail);
      }

      // Remove from pending if they never signed up
      if (buyerEmail) {
        await db.from('pending_activations').delete().ilike('email', buyerEmail);
      }

      console.log(`[LS Webhook] ✅ Cancelled order for ${userId || buyerEmail}`);
      return json({ success: true, status: 'cancelled' });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SUBSCRIPTION EVENTS (recurring billing)
    // ══════════════════════════════════════════════════════════════════════════

    if (eventName === 'subscription_created') {
      const buyerEmail    = (attrs.user_email || '').trim().toLowerCase();
      const subscriptionId = String(payload.data?.id || '');
      const customerId    = String(attrs.customer_id || '');
      const productName   = attrs.product_name || '';
      const variantName   = attrs.variant_name || '';
      const priceCents    = attrs.first_subscription_item?.price || 0;
      const endsAt        = attrs.ends_at || null;
      const userId        = customData.user_id || null;

      if (!buyerEmail) return json({ error: 'Missing email' }, 400);

      const { tier, days } = detectTier(productName, variantName, priceCents);
      const startISO = new Date().toISOString();
      const endISO   = endsAt || new Date(Date.now() + days * 86400000).toISOString();

      console.log(`[LS Webhook] subscription_created → tier: ${tier}, email: ${buyerEmail}`);

      const profileUpdate = {
        subscription_tier:       tier,
        subscription_status:     'active',
        subscription_start_date: startISO,
        subscription_end_date:   endISO,
        ls_subscription_id:      subscriptionId,
        ls_customer_id:          customerId || null,
        updated_at:              new Date().toISOString(),
      };

      if (userId) {
        await db.from('profiles').update(profileUpdate).eq('id', userId);
        console.log(`[LS Webhook] ✅ Subscription activated for user ${userId} → ${tier}`);
        return json({ success: true, status: 'activated', tier });
      }

      const { data: existing } = await db
        .from('profiles').select('id').ilike('email', buyerEmail).maybeSingle();

      if (existing) {
        await db.from('profiles').update(profileUpdate).eq('id', existing.id);
        console.log(`[LS Webhook] ✅ Subscription activated by email: ${buyerEmail} → ${tier}`);
        return json({ success: true, status: 'activated', tier });
      }

      // New buyer — store in pending
      await db.from('pending_activations').upsert({
        email:                   buyerEmail,
        subscription_tier:       tier,
        subscription_start_date: startISO,
        subscription_end_date:   endISO,
        ls_order_id:             subscriptionId,
        ls_customer_id:          customerId || null,
        payhip_sale_id:          subscriptionId,
        payhip_data:             payload,
        activated:               false,
        created_at:              new Date().toISOString(),
      }, { onConflict: 'email' });

      console.log(`[LS Webhook] ✅ Subscription pending: ${buyerEmail} → ${tier}`);
      return json({ success: true, status: 'pending', tier });
    }

    // ─── subscription_updated ─────────────────────────────────────────────────
    if (eventName === 'subscription_updated') {
      const subscriptionId = String(payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();
      const status         = attrs.status || 'active';
      const productName    = attrs.product_name || '';
      const variantName    = attrs.variant_name || '';
      const endsAt         = attrs.ends_at || null;
      const cancelled      = attrs.cancelled === true;

      console.log(`[LS Webhook] subscription_updated → sub: ${subscriptionId}, status: ${status}`);

      const { tier } = detectTier(productName, variantName, 0);

      const update: any = {
        subscription_tier:    tier,
        subscription_status:  cancelled ? 'cancelled' : status === 'active' ? 'active' : status,
        updated_at:           new Date().toISOString(),
      };
      if (endsAt) update.subscription_end_date = endsAt;
      if (cancelled) update.subscription_cancelled_at = new Date().toISOString();

      // Look up by subscription ID first, then email
      let matched = false;
      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
          matched = true;
        }
      }
      if (!matched && buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      console.log(`[LS Webhook] ✅ Subscription updated → ${tier} / ${update.subscription_status}`);
      return json({ success: true, status: 'updated' });
    }

    // ─── subscription_cancelled ───────────────────────────────────────────────
    if (eventName === 'subscription_cancelled') {
      const subscriptionId = String(payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();
      const endsAt         = attrs.ends_at || null;

      console.log(`[LS Webhook] subscription_cancelled → sub: ${subscriptionId}`);

      // Cancelled = still active until endsAt, just won't renew
      const update: any = {
        subscription_status:       'cancelled',
        subscription_cancelled_at: new Date().toISOString(),
        updated_at:                new Date().toISOString(),
      };
      if (endsAt) update.subscription_end_date = endsAt;

      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
          console.log(`[LS Webhook] ✅ Marked cancelled (active until ${endsAt})`);
          return json({ success: true, status: 'cancelled' });
        }
      }
      if (buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      return json({ success: true, status: 'cancelled' });
    }

    // ─── subscription_expired ─────────────────────────────────────────────────
    if (eventName === 'subscription_expired') {
      const subscriptionId = String(payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();

      console.log(`[LS Webhook] subscription_expired → sub: ${subscriptionId}`);

      const update = {
        subscription_status: 'expired',
        updated_at:          new Date().toISOString(),
      };

      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
          console.log(`[LS Webhook] ✅ Subscription expired for ${data.id}`);
          return json({ success: true, status: 'expired' });
        }
      }
      if (buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      return json({ success: true, status: 'expired' });
    }

    // ─── subscription_payment_success ─────────────────────────────────────────
    if (eventName === 'subscription_payment_success') {
      const subscriptionId = String(attrs.subscription_id || payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();
      const nextBillingAt  = attrs.next_billing_date || null;

      console.log(`[LS Webhook] subscription_payment_success → sub: ${subscriptionId}`);

      const update: any = {
        subscription_status: 'active',
        updated_at:          new Date().toISOString(),
      };
      // Extend end date to next billing cycle
      if (nextBillingAt) update.subscription_end_date = nextBillingAt;

      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
          console.log(`[LS Webhook] ✅ Payment success — renewed until ${nextBillingAt}`);
          return json({ success: true, status: 'renewed' });
        }
      }
      if (buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      return json({ success: true, status: 'renewed' });
    }

    // ─── subscription_payment_failed ─────────────────────────────────────────
    if (eventName === 'subscription_payment_failed') {
      const subscriptionId = String(attrs.subscription_id || payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();

      console.log(`[LS Webhook] subscription_payment_failed → sub: ${subscriptionId}, email: ${buyerEmail}`);

      // Mark as past_due — do not deactivate yet (LemonSqueezy retries)
      const update = {
        subscription_status: 'past_due',
        updated_at:          new Date().toISOString(),
      };

      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
        }
      } else if (buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      console.log(`[LS Webhook] ⚠️ Payment failed — marked past_due`);
      return json({ success: true, status: 'past_due' });
    }

    // ─── subscription_payment_recovered ──────────────────────────────────────
    if (eventName === 'subscription_payment_recovered') {
      const subscriptionId = String(attrs.subscription_id || payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();
      const nextBillingAt  = attrs.next_billing_date || null;

      console.log(`[LS Webhook] subscription_payment_recovered → sub: ${subscriptionId}`);

      const update: any = {
        subscription_status: 'active',
        updated_at:          new Date().toISOString(),
      };
      if (nextBillingAt) update.subscription_end_date = nextBillingAt;

      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
        }
      } else if (buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      console.log(`[LS Webhook] ✅ Payment recovered — restored to active`);
      return json({ success: true, status: 'recovered' });
    }

    // ─── subscription_resumed ─────────────────────────────────────────────────
    if (eventName === 'subscription_resumed') {
      const subscriptionId = String(payload.data?.id || '');
      const buyerEmail     = (attrs.user_email || '').trim().toLowerCase();
      const endsAt         = attrs.ends_at || null;

      console.log(`[LS Webhook] subscription_resumed → sub: ${subscriptionId}`);

      const update: any = {
        subscription_status:       'active',
        subscription_cancelled_at: null,
        updated_at:                new Date().toISOString(),
      };
      if (endsAt) update.subscription_end_date = endsAt;

      if (subscriptionId) {
        const { data } = await db.from('profiles').select('id').eq('ls_subscription_id', subscriptionId).maybeSingle();
        if (data) {
          await db.from('profiles').update(update).eq('id', data.id);
        }
      } else if (buyerEmail) {
        await db.from('profiles').update(update).ilike('email', buyerEmail);
      }

      console.log(`[LS Webhook] ✅ Subscription resumed`);
      return json({ success: true, status: 'resumed' });
    }

    // Unhandled — acknowledge so LemonSqueezy does not retry
    console.log(`[LS Webhook] Unhandled event: ${eventName}`);
    return json({ received: true, skipped: true, event: eventName });

  } catch (err) {
    console.error('[LS Webhook] Uncaught error:', err);
    return json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500);
  }
};

// Health check
export const GET: APIRoute = async () =>
  json({ status: 'ready', endpoint: '/api/lemonsqueezy/webhook', version: 'live-v2' });
