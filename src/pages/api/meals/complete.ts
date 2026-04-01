import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return json({ error: 'Unauthorized' }, 401);

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return json({ error: 'Unauthorized' }, 401);

    // User-scoped client so RLS auth.uid() resolves correctly
    const db = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );

    const body = await request.json();
    const { meal_type, recipe_id, day_number, action = 'complete', client_date } = body;

    if (!meal_type || !day_number) return json({ error: 'meal_type and day_number are required' }, 400);

    if (action === 'uncomplete') {
      await db
        .from('meal_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('day_number', day_number)
        .eq('meal_type', meal_type);

      return json({ success: true, xp_earned: 0, action: 'uncomplete' });
    }

    // Upsert completion
    const { error: upsertErr } = await db
      .from('meal_completions')
      .upsert(
        { user_id: user.id, day_number, meal_type, recipe_id: recipe_id || null, xp_earned: 10 },
        { onConflict: 'user_id,day_number,meal_type', ignoreDuplicates: true }
      );

    if (upsertErr) return json({ error: upsertErr.message }, 500);

    // Award XP (10 per meal)
    await db.rpc('award_xp', {
      user_id_param:     user.id,
      action_type_param: 'meal_complete',
      xp_amount_param:   10,
      description_param: `Ate ${meal_type}`,
      day_number_param:  day_number,
    });

    // Mark the meal task as complete so the task list updates
    await db.rpc('complete_task', {
      user_id_param:    user.id,
      day_number_param: day_number,
      task_type_param:  'meal',
    });

    // Count how many meals completed today
    const { data: completions } = await db
      .from('meal_completions')
      .select('meal_type, recipe_id')
      .eq('user_id', user.id)
      .eq('day_number', day_number);

    const mealsToday = completions?.length || 0;
    const followed = mealsToday >= 3;

    // Auto-update today's checkin followed_meals if >= 3 meals eaten
    if (followed) {
      const serverDate = new Date().toISOString().split('T')[0];
      const today = (client_date && /^\d{4}-\d{2}-\d{2}$/.test(client_date)) ? client_date : serverDate;
      await db
        .from('daily_checkins')
        .upsert(
          { user_id: user.id, checkin_date: today, followed_meals: true },
          { onConflict: 'user_id,checkin_date', ignoreDuplicates: false }
        );
    }

    // Aggregate macros for all completed recipes today
    const completedRecipeIds = (completions || [])
      .map((c: any) => c.recipe_id)
      .filter(Boolean);

    let macros = { calories: 0, protein: 0, fat: 0, net_carbs: 0 };
    if (completedRecipeIds.length > 0) {
      const { data: recipes } = await db
        .from('recipes')
        .select('calories, protein, fat, net_carbs')
        .in('id', completedRecipeIds);

      macros = (recipes || []).reduce((acc, r) => ({
        calories:  acc.calories  + (r.calories   || 0),
        protein:   acc.protein   + parseFloat(r.protein   || 0),
        fat:       acc.fat       + parseFloat(r.fat       || 0),
        net_carbs: acc.net_carbs + parseFloat(r.net_carbs || 0),
      }), macros);
    }

    return json({ success: true, xp_earned: 10, meals_today: mealsToday, followed, macros });

  } catch (err: any) {
    console.error('Meal complete error:', err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
