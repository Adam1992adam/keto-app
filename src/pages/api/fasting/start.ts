import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const { protocol, target_hours, started_at } = await request.json();

    // Close any open sessions first
    await supabase
      .from('fasting_sessions')
      .update({ ended_at: new Date().toISOString(), completed: false })
      .eq('user_id', user.id)
      .is('ended_at', null);

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

    return json({ success: true, id: data.id });

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
