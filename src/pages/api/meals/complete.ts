import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json, captureError } from '../../../lib/apiResponse';
import { localDate } from '../../../lib/dates';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const { data: profileTz } = await db.from('profiles').select('timezone').eq('id', user.id).maybeSingle();
    const tz = profileTz?.timezone || 'UTC';

    const body = await request.json();
    const { meal_type, recipe_id, day_number, action = 'complete', client_date } = body;

    if (!meal_type || !day_number) return json({ error: 'meal_type and day_number are required' }, 400);

    const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!VALID_MEAL_TYPES.includes(meal_type)) {
      return json({ error: 'Invalid meal_type' }, 400);
    }

    const parsedDay = parseInt(day_number, 10);
    if (!Number.isInteger(parsedDay) || parsedDay < 1) {
      return json({ error: 'day_number must be a positive integer' }, 400);
    }

    // Validate day_number against the user's actual progress — prevents marking
    // future days complete before they're reached
    const { data: journey } = await db
      .from('user_journey')
      .select('current_day')
      .eq('user_id', user.id)
      .maybeSingle();

    const currentDay = journey?.current_day ?? 1;
    if (parsedDay > currentDay) {
      return json({ error: 'Cannot complete meals for a future day' }, 403);
    }

    if (action === 'uncomplete') {
      await db
        .from('meal_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('day_number', day_number)
        .eq('meal_type', meal_type);

      return json({ success: true, xp_earned: 0, action: 'uncomplete' });
    }

    // Check if already completed before upserting — award_xp must only fire once per meal
    const { data: existing } = await db
      .from('meal_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('day_number', day_number)
      .eq('meal_type', meal_type)
      .maybeSingle();

    const isNew = !existing;

    // Upsert completion
    const { error: upsertErr } = await db
      .from('meal_completions')
      .upsert(
        { user_id: user.id, day_number, meal_type, recipe_id: recipe_id || null, xp_earned: 10 },
        { onConflict: 'user_id,day_number,meal_type', ignoreDuplicates: true }
      );

    if (upsertErr) return json({ error: upsertErr.message }, 500);

    // Award XP only on first completion — not on duplicate calls
    if (isNew) {
      await db.rpc('award_xp', {
        user_id_param:     user.id,
        action_type_param: 'meal_complete',
        xp_amount_param:   10,
        description_param: `Ate ${meal_type}`,
        day_number_param:  day_number,
      });
    }

    // Mark the specific meal task (breakfast/lunch/dinner/snack) as complete
    const { error: rpcErr } = await db.rpc('complete_task', {
      user_id_param:    user.id,
      day_number_param: day_number,
      task_type_param:  meal_type,
    });
    if (rpcErr) {
      // Fallback: direct update if RPC fails or task type doesn't match
      await db.from('daily_tasks')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('day_number', day_number)
        .eq('task_type', meal_type);
    }

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
      const serverDate = localDate(tz);
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

    return json({ success: true, xp_earned: isNew ? 10 : 0, meals_today: mealsToday, followed, macros });

  } catch (err: any) {
    await captureError('meals/complete', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

