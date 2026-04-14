import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export const POST: APIRoute = async ({ request, redirect }) => {
  // Rate limit: 3 attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`forgot:${ip}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    return redirect('/forgot-password?error=ratelimited');
  }

  const formData = await request.formData();
  const email = formData.get('email')?.toString()?.trim().toLowerCase();

  if (!email) return redirect('/forgot-password?error=invalid');

  const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const APP_URL      = process.env.PUBLIC_APP_URL || import.meta.env.PUBLIC_APP_URL || 'http://localhost:4321';

  if (!SUPABASE_URL || !SUPABASE_KEY) return redirect('/forgot-password?error=server');

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Always redirect to sent — don't reveal whether email exists (security)
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/reset-password`,
  });

  return redirect('/forgot-password?sent=1');
};
