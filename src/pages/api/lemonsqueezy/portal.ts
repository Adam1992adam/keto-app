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

  // process.env (Vercel) → import.meta.env (Astro SSR) → Cloudflare locals
  const cfEnv    = (locals as any)?.runtime?.env || {};
  const API_KEY  = process.env.LEMONSQUEEZY_API_KEY  || import.meta.env.LEMONSQUEEZY_API_KEY  || cfEnv.LEMONSQUEEZY_API_KEY;
  const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || import.meta.env.LEMONSQUEEZY_STORE_ID || cfEnv.LEMONSQUEEZY_STORE_ID;

  if (!API_KEY || !STORE_ID) {
    return json({ error: 'Customer portal not configured' }, 503);
  }

  const email = user.email;
  if (!email) return json({ error: 'No email on account' }, 400);

  // Get Supabase to look up ls_customer_id stored on the profile
  const cfEnvSB     = (locals as any)?.runtime?.env || {};
  const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL       || import.meta.env.PUBLIC_SUPABASE_URL       || cfEnvSB.PUBLIC_SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || cfEnvSB.SUPABASE_SERVICE_ROLE_KEY;

  let lsCustomerId: string | null = null;
  if (SUPABASE_URL && SERVICE_KEY) {
    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: profile } = await db
      .from('profiles')
      .select('ls_customer_id')
      .eq('id', user.id)
      .maybeSingle();
    lsCustomerId = profile?.ls_customer_id || null;
  }

  try {
    let customer: any = null;

    // Fast path — fetch directly by stored customer ID
    if (lsCustomerId) {
      const res = await fetch(
        `https://api.lemonsqueezy.com/v1/customers/${lsCustomerId}`,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/vnd.api+json',
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        customer = data?.data || null;
      }
    }

    // Slow path — search by email
    if (!customer) {
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
      customer = data?.data?.[0] || null;
    }

    if (!customer) {
      // Customer not found — they haven't purchased through LemonSqueezy yet,
      // or purchased under a different email. Return the store's generic billing page.
      const STORE_SLUG = process.env.LEMONSQUEEZY_STORE_SLUG || import.meta.env.LEMONSQUEEZY_STORE_SLUG || cfEnv.LEMONSQUEEZY_STORE_SLUG || '';
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
