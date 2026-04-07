// POST /api/lemonsqueezy/portal
// Returns the LemonSqueezy Customer Portal URL for the authenticated user.
// The portal lets customers view orders, download invoices, and request refunds.
//
// Required env vars:
//   LEMONSQUEEZY_API_KEY   — API key from LemonSqueezy dashboard
//   LEMONSQUEEZY_STORE_ID  — numeric store ID (find in Settings → Stores)

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, locals }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user } = auth;

  const env      = (locals as any)?.runtime?.env || {};
  const API_KEY  = env.LEMONSQUEEZY_API_KEY  || import.meta.env.LEMONSQUEEZY_API_KEY;
  const STORE_ID = env.LEMONSQUEEZY_STORE_ID || import.meta.env.LEMONSQUEEZY_STORE_ID;

  if (!API_KEY || !STORE_ID) {
    return json({ error: 'Customer portal not configured' }, 503);
  }

  const email = user.email;
  if (!email) return json({ error: 'No email on account' }, 400);

  try {
    // Look up the LemonSqueezy customer by email + store
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/customers?filter[store_id]=${STORE_ID}&filter[email]=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/vnd.api+json',
        },
      },
    );

    if (!res.ok) {
      console.error('[LS Portal] API error:', res.status, await res.text());
      return json({ error: 'Failed to reach LemonSqueezy API' }, 502);
    }

    const data = await res.json();
    const customer = data?.data?.[0];

    if (!customer) {
      // Customer not found — they haven't purchased through LemonSqueezy yet,
      // or purchased under a different email. Return the store's generic billing page.
      const STORE_SLUG = env.LEMONSQUEEZY_STORE_SLUG || import.meta.env.LEMONSQUEEZY_STORE_SLUG || '';
      const fallback   = STORE_SLUG
        ? `https://${STORE_SLUG}.lemonsqueezy.com/billing`
        : null;
      return json({ portal_url: fallback, not_found: true });
    }

    const portalUrl: string = customer.attributes?.urls?.customer_portal
      || customer.attributes?.portal_url
      || null;

    return json({ portal_url: portalUrl });

  } catch (err) {
    console.error('[LS Portal] Fetch error:', err);
    return json({ error: 'Portal lookup failed' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
