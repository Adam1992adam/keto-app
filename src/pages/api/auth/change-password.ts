// POST /api/auth/change-password
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }

  const { currentPassword, newPassword, confirmPassword } = body;

  if (!currentPassword || !newPassword || !confirmPassword)
    return json({ error: 'All fields are required' }, 400);

  if (newPassword.length < 8)
    return json({ error: 'New password must be at least 8 characters' }, 400);

  if (newPassword !== confirmPassword)
    return json({ error: 'New passwords do not match' }, 400);

  if (currentPassword === newPassword)
    return json({ error: 'New password must be different from current password' }, 400);

  // Verify current password by re-authenticating against Supabase
  const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const verifyClient = createClient(SUPABASE_URL!, SUPABASE_KEY!);

  const { error: verifyError } = await verifyClient.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (verifyError) return json({ error: 'Current password is incorrect' }, 400);

  // All checks passed — update the password
  const { error } = await db.auth.updateUser({ password: newPassword });
  if (error) return json({ error: error.message }, 400);

  return json({ success: true });
};

