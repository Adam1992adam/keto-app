// POST /api/auth/delete-account
// GDPR right to erasure — permanently deletes all user data and the auth account.
// Requires password verification + typed "DELETE" confirmation from the client.
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user } = auth;

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }

  const { password, confirmation } = body;

  if (!password) return json({ error: 'Password is required to confirm deletion' }, 400);
  if (confirmation !== 'DELETE') return json({ error: 'Please type DELETE to confirm' }, 400);

  const SUPABASE_URL  = process.env.PUBLIC_SUPABASE_URL        || import.meta.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON = process.env.PUBLIC_SUPABASE_ANON_KEY   || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY  || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON || !SERVICE_KEY) {
    return json({ error: 'Server configuration error' }, 500);
  }

  // ── Step 1: verify password by re-authenticating ─────────────────────────
  const verifyClient = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { error: verifyError } = await verifyClient.auth.signInWithPassword({
    email: user.email!,
    password,
  });
  if (verifyError) return json({ error: 'Incorrect password' }, 400);

  // ── Step 2: delete all user data (explicit — no reliance on cascade) ──────
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const uid   = user.id;

  const tables = [
    'push_subscriptions',
    'xp_transactions',
    'achievements',
    'notifications',
    'notification_preferences',
    'chat_messages',
    'meal_swaps',
    'water_intake',
    'body_measurements',
    'weight_logs',
    'weekly_reports',
    'daily_tasks',
    'daily_checkins',
    'daily_progress',
    'daily_reflections',
    'fasting_sessions',
    'completed_days',
    'macro_goals',
    'onboarding_data',
    'recipe_ratings',
    'referral_codes',
    'pending_activations',
    'user_journey',
    'profiles',
  ];

  for (const table of tables) {
    // profiles uses id = user.id, all others use user_id
    const col = table === 'profiles' ? 'id' : 'user_id';
    await admin.from(table).delete().eq(col, uid);
  }

  // referrals has two FK columns
  await admin.from('referrals').delete().eq('referrer_id', uid);
  await admin.from('referrals').delete().eq('referred_id', uid);

  // ── Step 3: delete auth user (admin API) ─────────────────────────────────
  const { error: deleteError } = await admin.auth.admin.deleteUser(uid);
  if (deleteError) {
    console.error('delete-account: auth.admin.deleteUser failed', deleteError);
    return json({ error: 'Failed to delete account. Please contact support.' }, 500);
  }

  // ── Step 4: clear session cookies ────────────────────────────────────────
  cookies.delete('sb-access-token',  { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });

  return json({ success: true });
};

