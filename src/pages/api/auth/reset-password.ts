import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const json = (data: any, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  try {
    const { password, access_token } = await request.json();

    if (!password || password.length < 8)
      return json({ error: 'Password must be at least 8 characters.' }, 400);
    if (!access_token)
      return json({ error: 'Missing reset token.' }, 400);

    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY)
      return json({ error: 'Server configuration error.' }, 500);

    // Create a client authenticated with the recovery token
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${access_token}` } },
    });

    const { error } = await supabase.auth.updateUser({ password });

    if (error) return json({ error: error.message }, 400);

    return json({ success: true });
  } catch (err) {
    return json({ error: 'Unexpected error. Please try again.' }, 500);
  }
};
