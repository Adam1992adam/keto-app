import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const body = await request.json();

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id:           user.id,
        breakfast_enabled: body.breakfast_enabled ?? true,
        breakfast_time:    body.breakfast_time    ?? '08:00',
        lunch_enabled:     body.lunch_enabled     ?? true,
        lunch_time:        body.lunch_time        ?? '13:00',
        dinner_enabled:    body.dinner_enabled    ?? true,
        dinner_time:       body.dinner_time       ?? '19:00',
        snack_enabled:     body.snack_enabled     ?? true,
        snack_time:        body.snack_time        ?? '16:00',
        water_enabled:     body.water_enabled     ?? true,
        water_interval:    body.water_interval    ?? 120,
        water_start_time:  body.water_start_time  ?? '08:00',
        water_end_time:    body.water_end_time    ?? '22:00',
        weight_enabled:    body.weight_enabled    ?? true,
        weight_day:        body.weight_day        ?? 0,
        weight_time:       body.weight_time       ?? '07:00',
        streak_enabled:    body.streak_enabled    ?? true,
        streak_time:       body.streak_time       ?? '21:00',
        updated_at:        new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Notification prefs save error:', error);
      return json({ error: error.message }, 500);
    }

    return json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}