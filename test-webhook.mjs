/**
 * test-webhook.mjs  — Full LemonSqueezy payment flow tester
 *
 * Usage:
 *   node test-webhook.mjs [event] [options]
 *
 * Events:
 *   order_created (default)        — one-time purchase → pending_activations
 *   order_refunded                 — cancel by order
 *   subscription_created           — recurring subscription activated
 *   subscription_updated           — tier/status change
 *   subscription_cancelled         — marks cancelled, stays active until ends_at
 *   subscription_expired           — deactivates account
 *   subscription_payment_success   — renews billing period
 *   subscription_payment_failed    — marks past_due
 *   subscription_payment_recovered — restores to active
 *   subscription_resumed           — uncancel
 *   verify_purchase                — test verify-purchase API (checks pending_activations)
 *   all                            — run the full order lifecycle in sequence
 *
 * Options:
 *   --tier basic|pro|elite         — which plan to simulate (default: pro)
 *   --email EMAIL                  — test email (default: webhook-test@ketotest.dev)
 *   --user-id UUID                 — simulate logged-in upgrade (optional)
 *   --local                        — target http://localhost:4321 instead of production
 *
 * Environment (required):
 *   LEMONSQUEEZY_WEBHOOK_SECRET    — must match your Vercel env var exactly
 *
 * Example:
 *   LEMONSQUEEZY_WEBHOOK_SECRET=your_secret node test-webhook.mjs order_created --tier pro
 *   LEMONSQUEEZY_WEBHOOK_SECRET=your_secret node test-webhook.mjs all
 *   LEMONSQUEEZY_WEBHOOK_SECRET=your_secret node test-webhook.mjs all --local
 */

import { createHmac } from 'crypto';

// ── Config ─────────────────────────────────────────────────────────────────────
const SIGNING_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
if (!SIGNING_SECRET) {
  console.error('\n❌ LEMONSQUEEZY_WEBHOOK_SECRET is not set.');
  console.error('   Run: LEMONSQUEEZY_WEBHOOK_SECRET=your_secret node test-webhook.mjs\n');
  process.exit(1);
}

// Parse args
const args      = process.argv.slice(2);
const eventName = args.find(a => !a.startsWith('--')) || 'order_created';
const isLocal   = args.includes('--local');

function getArg(name) {
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

const tierArg   = (getArg('--tier') || 'pro').toLowerCase();
const emailArg  = getArg('--email') || 'webhook-test@ketotest.dev';
const userIdArg = getArg('--user-id') || null;

const BASE_URL = isLocal ? 'http://localhost:4321' : 'https://ketojourney.fun';
const WEBHOOK_URL = `${BASE_URL}/api/lemonsqueezy/webhook`;
const VERIFY_URL  = `${BASE_URL}/api/lemonsqueezy/verify-purchase`;

const TIER_MAP = { basic: 'basic_30', pro: 'pro_6', elite: 'elite_12' };
const tier     = TIER_MAP[tierArg] || 'pro_6';

const PRODUCT_MAP = {
  basic_30: { name: 'Keto Journey Basic Plan', variant: '30-Day Access', price: 2900 },
  pro_6:    { name: 'Keto Journey Pro Plan',   variant: '90-Day Access', price: 4900 },
  elite_12: { name: 'Keto Journey Elite Plan', variant: '360-Day Access',price: 13000 },
};
const product = PRODUCT_MAP[tier];

const TS        = Date.now();
const ORDER_ID  = `TEST-ORDER-${TS}`;
const SUB_ID    = `TEST-SUB-${TS}`;
const CUST_ID   = `TEST-CUST-${TS}`;
const TEST_EMAIL = emailArg;
const CUSTOM_DATA = userIdArg ? { user_id: userIdArg } : {};

// ── Payload templates ──────────────────────────────────────────────────────────
const PAYLOADS = {
  order_created: {
    meta: { event_name: 'order_created', custom_data: CUSTOM_DATA },
    data: {
      id: ORDER_ID,
      attributes: {
        status:       'paid',
        user_email:   TEST_EMAIL,
        customer_id:  CUST_ID,
        total:        product.price,
        first_order_item: {
          product_name: product.name,
          variant_name: product.variant,
        },
      },
    },
  },

  order_refunded: {
    meta: { event_name: 'order_refunded', custom_data: CUSTOM_DATA },
    data: {
      id: ORDER_ID,
      attributes: {
        user_email:  TEST_EMAIL,
        customer_id: CUST_ID,
      },
    },
  },

  subscription_created: {
    meta: { event_name: 'subscription_created', custom_data: CUSTOM_DATA },
    data: {
      id: SUB_ID,
      attributes: {
        user_email:    TEST_EMAIL,
        customer_id:   CUST_ID,
        product_name:  product.name,
        variant_name:  product.variant,
        status:        'active',
        ends_at:       new Date(Date.now() + 30 * 86400000).toISOString(),
        first_subscription_item: { price: product.price },
      },
    },
  },

  subscription_updated: {
    meta: { event_name: 'subscription_updated', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: {
        user_email:   TEST_EMAIL,
        product_name: product.name,
        variant_name: product.variant,
        status:       'active',
        cancelled:    false,
        ends_at:      new Date(Date.now() + 30 * 86400000).toISOString(),
      },
    },
  },

  subscription_cancelled: {
    meta: { event_name: 'subscription_cancelled', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: {
        user_email: TEST_EMAIL,
        ends_at:    new Date(Date.now() + 15 * 86400000).toISOString(),
      },
    },
  },

  subscription_expired: {
    meta: { event_name: 'subscription_expired', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: { user_email: TEST_EMAIL },
    },
  },

  subscription_payment_success: {
    meta: { event_name: 'subscription_payment_success', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: {
        subscription_id:   SUB_ID,
        user_email:        TEST_EMAIL,
        next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
    },
  },

  subscription_payment_failed: {
    meta: { event_name: 'subscription_payment_failed', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: {
        subscription_id: SUB_ID,
        user_email:      TEST_EMAIL,
      },
    },
  },

  subscription_payment_recovered: {
    meta: { event_name: 'subscription_payment_recovered', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: {
        subscription_id:   SUB_ID,
        user_email:        TEST_EMAIL,
        next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
    },
  },

  subscription_resumed: {
    meta: { event_name: 'subscription_resumed', custom_data: {} },
    data: {
      id: SUB_ID,
      attributes: {
        user_email: TEST_EMAIL,
        ends_at:    new Date(Date.now() + 30 * 86400000).toISOString(),
      },
    },
  },
};

// ── Core: sign + send one webhook ─────────────────────────────────────────────
async function sendWebhook(evtName, customPayload) {
  const payload   = customPayload || PAYLOADS[evtName];
  if (!payload) {
    console.error(`\n❌ Unknown event: ${evtName}`);
    console.error('Available:', Object.keys(PAYLOADS).join(', '));
    return null;
  }

  const body      = JSON.stringify(payload);
  const signature = createHmac('sha256', SIGNING_SECRET).update(body).digest('hex');

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`► Sending [${evtName}]  →  ${WEBHOOK_URL}`);
  console.log(`  Email:  ${TEST_EMAIL}  |  Tier: ${tier}  |  ${isLocal ? 'LOCAL' : 'LIVE'}`);

  const res  = await fetch(WEBHOOK_URL, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature':  signature,
    },
    body,
  });

  const text = await res.text();
  let result;
  try { result = JSON.parse(text); } catch { result = text; }

  const ok = res.status === 200 && (result?.success || result?.received);
  console.log(`  Status: ${res.status}  →  ${ok ? '✅ OK' : '❌ FAIL'}`);
  console.log(`  Response:`, JSON.stringify(result));

  if (res.status === 401) {
    console.error('\n  ⚠️  Signature mismatch! Your LEMONSQUEEZY_WEBHOOK_SECRET does not match');
    console.error('     what is set in Vercel. Check both values are identical.\n');
  }

  return { ok, status: res.status, result };
}

// ── Core: test verify-purchase ─────────────────────────────────────────────────
async function testVerifyPurchase() {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`► Testing verify-purchase  →  ${VERIFY_URL}`);
  console.log(`  Email: ${TEST_EMAIL}`);

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL }),
  });

  const text = await res.text();
  let result;
  try { result = JSON.parse(text); } catch { result = text; }

  const ok = res.status === 200 && result?.success;
  console.log(`  Status: ${res.status}  →  ${ok ? '✅ Purchase found' : '⚠️  ' + (result?.reason || 'not found')}`);
  if (ok) console.log(`  Tier:   ${result?.purchase?.tier}  |  Ends: ${result?.purchase?.end_date?.split('T')[0]}`);
  else console.log(`  Message: ${result?.message || JSON.stringify(result)}`);
  return { ok, result };
}

// ── Full lifecycle test ────────────────────────────────────────────────────────
async function runAll() {
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  FULL PAYMENT LIFECYCLE TEST');
  console.log(`  Base URL : ${BASE_URL}`);
  console.log(`  Tier     : ${tier} (${product.name})`);
  console.log(`  Email    : ${TEST_EMAIL}`);
  console.log('══════════════════════════════════════════════════════════════');

  const results = {};

  // 1. One-time purchase
  results.order_created = await sendWebhook('order_created');
  await sleep(800);

  // 2. Verify the pending_activations row was created
  results.verify_purchase = await testVerifyPurchase();
  await sleep(800);

  // 3. Refund (cleans up)
  results.order_refunded = await sendWebhook('order_refunded');
  await sleep(800);

  // 4. Subscription flow
  results.subscription_created = await sendWebhook('subscription_created');
  await sleep(800);

  results.subscription_payment_success = await sendWebhook('subscription_payment_success');
  await sleep(800);

  results.subscription_payment_failed = await sendWebhook('subscription_payment_failed');
  await sleep(800);

  results.subscription_payment_recovered = await sendWebhook('subscription_payment_recovered');
  await sleep(800);

  results.subscription_cancelled = await sendWebhook('subscription_cancelled');
  await sleep(800);

  results.subscription_resumed = await sendWebhook('subscription_resumed');
  await sleep(800);

  results.subscription_expired = await sendWebhook('subscription_expired');

  // Summary
  console.log('\n\n══════════════════════════════════════════════════════════════');
  console.log('  RESULTS SUMMARY');
  console.log('══════════════════════════════════════════════════════════════');

  let passed = 0, failed = 0;
  for (const [name, r] of Object.entries(results)) {
    if (!r) continue;
    const ok = r.ok;
    if (ok) passed++; else failed++;
    console.log(`  ${ok ? '✅' : '❌'}  ${name.padEnd(36)} ${ok ? 'PASS' : 'FAIL — status ' + r.status}`);
  }

  console.log('──────────────────────────────────────────────────────────────');
  console.log(`  ${passed} passed · ${failed} failed`);
  if (failed === 0) {
    console.log('\n  🎉 All webhook events processed correctly!');
  } else {
    console.log('\n  ⚠️  Some events failed. Check Vercel logs for details.');
  }
  console.log('');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Entry point ────────────────────────────────────────────────────────────────
if (eventName === 'all') {
  await runAll();
} else if (eventName === 'verify_purchase') {
  await testVerifyPurchase();
} else {
  const r = await sendWebhook(eventName);
  if (r?.ok) {
    console.log('\n✅ Done.');
  } else {
    console.log('\n⚠️  Check response above.');
    process.exit(1);
  }
}
