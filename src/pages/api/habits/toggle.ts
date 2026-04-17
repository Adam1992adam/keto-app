// src/pages/api/habits/toggle.ts
// POST /api/habits/toggle  { habit_id, date }  → toggle completion for that day
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const { habit_id, date, day_number } = await request.json();
    if (!habit_id) return json({ error: 'habit_id required' }, 400);
    const today = date || new Date().toISOString().split('T')[0];

    // Reject future day_number — prevents farming XP for days not yet reached
    if (day_number) {
      const parsed = parseInt(day_number, 10);
      if (!Number.isNaN(parsed)) {
        const { data: journey } = await supabase
          .from('user_journey')
          .select('current_day')
          .eq('user_id', user.id)
          .maybeSingle();
        const currentDay = journey?.current_day ?? 1;
        if (parsed > currentDay) {
          return json({ error: 'Cannot complete habits for a future day' }, 403);
        }
      }
    }

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
    return json({ error: 'Server error' }, 500);
  }
};

