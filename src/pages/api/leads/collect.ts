import type { APIRoute } from 'astro';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export const POST: APIRoute = async ({ request, locals }) => {
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = await checkRateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) return json({ error: `Too many requests. Try again in ${retryAfterSec}s.` }, 429);

  try {
    const body  = await request.json();
    const { email, name } = body as { email?: string; name?: string };
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'A valid email address is required.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase().slice(0, 254);
    const cleanName  = (name || '').trim().slice(0, 100) || null;

    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'Server configuration error.' }, 500);

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Upsert — silently accept already-subscribed emails (no error shown to user)
    const { error: dbError } = await supabase.from('leads').upsert(
      { email: cleanEmail, name: cleanName, source: 'free_book' },
      { onConflict: 'email', ignoreDuplicates: false }
    );
    if (dbError) console.error('[leads/collect] db upsert:', cleanEmail, dbError.message);

    // Send the free book email — throws on Resend error so the caller sees it
    const { sendFreeBookEmail } = await import('../../../lib/email');
    try {
      await sendFreeBookEmail(cleanEmail, cleanName || undefined);
    } catch (emailErr) {
      console.error('[leads/collect] email send failed:', cleanEmail, emailErr);
      // Lead is saved; tell the user something went wrong so they know to retry
      return json({ error: 'Your email was saved but we could not deliver the book right now. Please try again in a moment.' }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('[leads/collect]', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
