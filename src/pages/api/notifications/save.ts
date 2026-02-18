import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        breakfast_enabled: body.breakfast_enabled ?? true,
        breakfast_time: body.breakfast_time ?? '08:00',
        lunch_enabled: body.lunch_enabled ?? true,
        lunch_time: body.lunch_time ?? '13:00',
        dinner_enabled: body.dinner_enabled ?? true,
        dinner_time: body.dinner_time ?? '19:00',
        snack_enabled: body.snack_enabled ?? true,
        snack_time: body.snack_time ?? '16:00',
        water_enabled: body.water_enabled ?? true,
        water_interval: body.water_interval ?? 120,
        water_start_time: body.water_start_time ?? '08:00',
        water_end_time: body.water_end_time ?? '22:00',
        weight_enabled: body.weight_enabled ?? true,
        weight_day: body.weight_day ?? 0,
        weight_time: body.weight_time ?? '07:00',
        streak_enabled: body.streak_enabled ?? true,
        streak_time: body.streak_time ?? '21:00',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('DB Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Server Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};