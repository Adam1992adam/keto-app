import type { APIRoute } from 'astro';
import { getUserJourney } from '../../../lib/supabase';
import { autoCompleteTask } from '../../../lib/autoTask';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase, accessToken } = auth;

  try {
    const body = await request.json();
    const {
      mood,
      mood_level,
      energy_level,
      hunger_level,
      notes,
      note,
      highlights,
      challenges,
      reflection_date,
      client_date,
    } = body;

    // ── Input validation ──────────────────────────────────────
    if (mood_level   !== undefined && (mood_level   < 1 || mood_level   > 5)) return json({ error: 'mood_level must be 1–5' }, 400);
    if (energy_level !== undefined && (energy_level < 1 || energy_level > 5)) return json({ error: 'energy_level must be 1–5' }, 400);
    if (hunger_level !== undefined && (hunger_level < 1 || hunger_level > 5)) return json({ error: 'hunger_level must be 1–5' }, 400);

    // ── Timezone-aware date ───────────────────────────────────
    // Prefer explicit reflection_date > client_date > server UTC date
    const serverDate = new Date().toISOString().split('T')[0];
    const safeClientDate = (d: string | undefined) =>
      d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;

    const today   = safeClientDate(client_date) || serverDate;
    const reflDate = safeClientDate(reflection_date) || today;

    // Prevent future reflections (> 1 day ahead of server, allows timezone buffer)
    const serverTs   = new Date(serverDate).getTime();
    const reflTs     = new Date(reflDate).getTime();
    if (reflTs > serverTs + 86400000) return json({ error: 'Cannot save a future reflection' }, 400);

    // Prevent reflections more than 90 days in the past
    if (serverTs - reflTs > 90 * 86400000) return json({ error: 'Reflection date is too far in the past' }, 400);

    const journey = await getUserJourney(user.id);
    if (!journey) return json({ error: 'Journey not found' }, 404);

    // ── Upsert on (user_id, reflection_date) — one per calendar day ──
    const { error } = await supabase
      .from('daily_reflections')
      .upsert({
        user_id:         user.id,
        day_number:      journey.current_day,
        reflection_date: reflDate,
        mood:            mood         || null,
        mood_level:      mood_level   || null,
        energy_level:    energy_level || null,
        hunger_level:    hunger_level || null,
        notes:           notes        || note || null,
        note:            note         || notes || null,
        highlights:      highlights   || null,
        challenges:      challenges   || null,
      }, {
        onConflict: 'user_id,reflection_date',
      });

    if (error) throw error;

    // ── Award XP only for today's reflection ─────────────────
    if (reflDate === today) {
      await supabase.rpc('award_xp', {
        user_id_param:     user.id,
        action_type_param: 'reflection',
        xp_amount_param:   15,
        description_param: 'Daily Reflection',
        day_number_param:  journey.current_day,
      });

      // Auto-complete the 'reflection' daily task
      await autoCompleteTask(user.id, 'reflection', journey.current_day);
    }

    return json({ success: true });
  } catch (error) {
    console.error('[reflection/save] user:', user.id, error);
    return json({ error: 'Failed to save' }, 500);
  }
};

