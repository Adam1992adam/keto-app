import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { autoCompleteTask, checkAchievements } from '../../../lib/autoTask';
import { json, captureError } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase, accessToken } = auth;
    userId = user.id;

    const body = await request.json();
    // Accept both field name variants: weight/weight_kg, logged_date/date
    const weight = parseFloat(body.weight ?? body.weight_kg);
    const logged_date = body.logged_date || body.date || new Date().toISOString().split('T')[0];

    if (isNaN(weight) || weight <= 0) return json({ error: 'Invalid weight value' }, 400);

    const { error: logError } = await supabase
      .from('weight_logs')
      .upsert(
        { user_id: user.id, weight, logged_date, notes: body.notes || null },
        { onConflict: 'user_id,logged_date' }
      );

    if (logError) {
      console.error('[profile/add-weight] user:', userId, logError);
      return json({ error: 'Failed to add weight' }, 500);
    }

    // Keep profile weight in sync
    await supabase
      .from('profiles')
      .update({ weight_kg: weight, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    // Check weight-loss achievements
    const { data: logs } = await supabase
      .from('weight_logs')
      .select('weight')
      .eq('user_id', user.id)
      .order('logged_date', { ascending: true })
      .limit(2);

    if (logs && logs.length >= 2) {
      const weightLost = logs[0].weight - weight;
      if (weightLost >= 1) {
        await supabase.from('achievements').upsert(
          { user_id: user.id, achievement_type: 'weight_loss_1kg', achievement_name: 'First Kilo Lost' },
          { onConflict: 'user_id,achievement_type,achievement_name' }
        );
      }
      if (weightLost >= 5) {
        await supabase.from('achievements').upsert(
          { user_id: user.id, achievement_type: 'weight_loss_5kg', achievement_name: 'Five Kilos Down' },
          { onConflict: 'user_id,achievement_type,achievement_name' }
        );
      }
    }

    // Auto-complete the 'weight' daily task
    const { data: uj } = await supabase.from('user_journey').select('current_day').eq('user_id', user.id).maybeSingle();
    if (uj) await autoCompleteTask(user.id, 'weight', uj.current_day, accessToken);

    checkAchievements(user.id, accessToken); // fire-and-forget
    return json({ success: true });
  } catch (err) {
    await captureError('profile/add-weight', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

