import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const { protocol, target_hours, started_at } = await request.json();

    // Idempotency guard: if an active session was started within the last 60 s,
    // return it directly — prevents double-click / retry from creating duplicates.
    const { data: existing } = await supabase
      .from('fasting_sessions')
      .select('id, started_at')
      .eq('user_id', user.id)
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const ageMs = Date.now() - new Date(existing.started_at).getTime();
      if (ageMs < 60_000) {
        // Same fast — return the existing session (idempotent)
        return json({ success: true, id: existing.id });
      }
      // Intentional restart: close the old session then fall through to insert
      await supabase
        .from('fasting_sessions')
        .update({ ended_at: new Date().toISOString(), completed: false })
        .eq('id', existing.id);
    }

    const { data, error } = await supabase
      .from('fasting_sessions')
      .insert({
        user_id:      user.id,
        protocol:     protocol || '16_8',
        target_hours: target_hours || 16,
        started_at:   started_at || new Date().toISOString(),
        completed:    false,
      })
      .select('id')
      .maybeSingle();

    if (error) throw error;

    return json({ success: true, id: data?.id });

  } catch (err: any) {
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
