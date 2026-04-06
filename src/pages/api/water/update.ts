import type { APIRoute } from 'astro';
import { getUserJourney } from '../../../lib/supabase';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;

  try {
    const { glasses } = await request.json();

    const journey = await getUserJourney(user.id);
    if (!journey) {
      return new Response(JSON.stringify({ error: 'Journey not found' }), { status: 404 });
    }

    // Update water intake
    const { error } = await supabase
      .from('water_intake')
      .upsert({
        user_id: user.id,
        day_number: journey.current_day,
        glasses_count: glasses,
        target_glasses: 8
      }, {
        onConflict: 'user_id,day_number'
      });

    if (error) throw error;

    // Award XP if goal reached
    if (glasses >= 8) {
      await supabase.rpc('complete_task', {
        user_id_param: user.id,
        day_number_param: journey.current_day,
        task_type_param: 'water'
      });
    }

    return new Response(JSON.stringify({ success: true, glasses }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating water:', error);
    return new Response(JSON.stringify({ error: 'Failed to update' }), { status: 500 });
  }
};