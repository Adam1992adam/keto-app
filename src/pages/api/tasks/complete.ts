import type { APIRoute } from 'astro';
import { supabase, completeTask, getUserJourney } from '../../../lib/supabase';

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
    const { taskType } = await request.json();
    
    const journey = await getUserJourney(user.id);
    if (!journey) {
      return new Response(JSON.stringify({ error: 'Journey not found' }), { status: 404 });
    }

    const result = await completeTask(user.id, journey.current_day, taskType);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return new Response(JSON.stringify({ error: 'Failed to complete task' }), { status: 500 });
  }
};