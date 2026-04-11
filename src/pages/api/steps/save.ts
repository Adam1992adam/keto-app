// src/pages/api/steps/save.ts
// POST /api/steps/save  — upsert today's step count
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  const body = await request.json().catch(() => ({}));
  const steps  = parseInt(body.steps)  || 0;
  const goal   = parseInt(body.goal)   || 10000;
  const source = body.source || 'manual';
  const logged_date = body.date || new Date().toISOString().slice(0, 10);

  if (steps < 0 || steps > 100000) return json({ error: 'Invalid step count' }, 400);

  const { error } = await db
    .from('step_logs')
    .upsert(
      { user_id: user.id, logged_date, steps, goal, source, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,logged_date' }
    );

  if (error) return json({ error: 'Failed to save steps' }, 500);
  return json({ success: true, steps, logged_date });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
