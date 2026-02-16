import type { APIRoute } from 'astro';
import { supabase, getUserJourney } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { mood, energy_level, hunger_level, notes } = await request.json();
    
    const journey = await getUserJourney(user.id);
    if (!journey) {
      return new Response(JSON.stringify({ error: 'Journey not found' }), { status: 404 });
    }

    // Save reflection
    const { error } = await supabase
      .from('daily_reflections')
      .upsert({
        user_id: user.id,
        day_number: journey.current_day,
        mood,
        energy_level,
        hunger_level,
        notes
      }, {
        onConflict: 'user_id,day_number'
      });

    if (error) throw error;

    // Award XP
    await supabase.rpc('award_xp', {
      user_id_param: user.id,
      action_type_param: 'reflection',
      xp_amount_param: 15,
      description_param: 'Daily Reflection',
      day_number_param: journey.current_day
    });

    // Mark task as complete
    await supabase.rpc('complete_task', {
      user_id_param: user.id,
      day_number_param: journey.current_day,
      task_type_param: 'reflection'
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving reflection:', error);
    return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 });
  }
};