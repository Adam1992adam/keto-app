import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);

    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

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
      .single();

    if (error) throw error;

    return json({ success: true, id: data.id });

  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
