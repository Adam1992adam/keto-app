// POST /api/auth/change-email
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }

  const { newEmail } = body;

  if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.'))
    return json({ error: 'Please enter a valid email address' }, 400);

  if (newEmail.toLowerCase() === user.email?.toLowerCase())
    return json({ error: 'New email must be different from your current email' }, 400);

  // Supabase sends a confirmation link to the NEW address before switching
  const { error } = await db.auth.updateUser({ email: newEmail });
  if (error) return json({ error: error.message }, 400);

  return json({
    success: true,
    message: `Confirmation email sent to ${newEmail}. Click the link in that email to confirm the change.`,
  });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
