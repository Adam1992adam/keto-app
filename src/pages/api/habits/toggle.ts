// src/pages/api/habits/toggle.ts
// POST /api/habits/toggle  { habit_id, date }  → toggle completion for that day
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('sb-access-token')?.value;
    if (!token) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: ae } = await supabase.auth.getUser();
    if (ae || !user) return json({ error: 'Unauthorized' }, 401);

    const { habit_id, date, day_number } = await request.json();
    if (!habit_id) return json({ error: 'habit_id required' }, 400);
    const today = date || new Date().toISOString().split('T')[0];

    // Check if already completed
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habit_id)
      .eq('completed_date', today)
      .maybeSingle();

    if (existing) {
      // Un-complete
      await supabase.from('habit_completions').delete().eq('id', existing.id);
      return json({ success: true, completed: false });
    } else {
      // Complete
      await supabase.from('habit_completions').insert({
        user_id: user.id, habit_id, completed_date: today,
      });

      // Award 5 XP for completing a habit
      await supabase.rpc('award_xp', {
        user_id_param:     user.id,
        action_type_param: 'habit_complete',
        xp_amount_param:   5,
        description_param: 'Completed a daily habit',
        day_number_param:  day_number || 1,
      });

      return json({ success: true, completed: true, xp_earned: 5 });
    }
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
