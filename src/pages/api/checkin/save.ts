// src/pages/api/checkin/save.ts
// POST /api/checkin/save

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { autoCompleteTask, checkAchievements } from '../../../lib/autoTask';
import { json, captureError } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db, accessToken } = auth;
    userId = user.id;

    const body = await request.json();

    // ── Timezone-aware date (client sends local YYYY-MM-DD) ──
    const serverDate = new Date().toISOString().split('T')[0];
    const today = (body.client_date && /^\d{4}-\d{2}-\d{2}$/.test(body.client_date))
      ? body.client_date
      : serverDate;

    const {
      energy_level, mood_level, hunger_level, brain_fog,
      had_headache, had_fatigue, had_cravings,
      followed_meals, water_glasses, fasted_today, note,
      xp_earned, symptoms, electrolytes,
      sleep_hours, sleep_quality,
      took_sodium, took_potassium, took_magnesium,
    } = body;

    // ── Input validation ─────────────────────────────────────
    if (energy_level !== undefined && (energy_level < 1 || energy_level > 5)) return json({ error: 'energy_level must be 1–5' }, 400);
    if (mood_level   !== undefined && (mood_level   < 1 || mood_level   > 5)) return json({ error: 'mood_level must be 1–5' }, 400);
    if (hunger_level !== undefined && (hunger_level < 1 || hunger_level > 5)) return json({ error: 'hunger_level must be 1–5' }, 400);
    if (water_glasses !== undefined && (water_glasses < 0 || water_glasses > 20)) return json({ error: 'water_glasses must be 0–20' }, 400);
    if (sleep_hours !== undefined && sleep_hours !== null && (sleep_hours < 0 || sleep_hours > 24)) return json({ error: 'sleep_hours must be 0–24' }, 400);
    if (sleep_quality !== undefined && sleep_quality !== null && (sleep_quality < 1 || sleep_quality > 5)) return json({ error: 'sleep_quality must be 1–5' }, 400);

    // ── 1. Pre-compute electrolyte note so it's included in the initial upsert
    //       (eliminates a second daily_checkins UPDATE round-trip later)
    let finalNote = note || '';
    if (electrolytes && (electrolytes.sodium || electrolytes.potassium || electrolytes.magnesium)) {
      const elecNote = `[Electrolytes: Na=${electrolytes.sodium}, K=${electrolytes.potassium}, Mg=${electrolytes.magnesium}]`;
      finalNote = finalNote ? `${finalNote}\n${elecNote}` : elecNote;
    }

    // ── 2. Save daily check-in ──
    // ignoreDuplicates: true means a conflicting row is left untouched and the
    // returned data array will be empty — that empty result is our atomic signal
    // that this checkin already existed, with no separate SELECT round-trip.
    const { data: insertedRows, error: checkinError } = await db
      .from('daily_checkins')
      .upsert({
        user_id:        user.id,
        checkin_date:   today,
        energy_level:   energy_level   || 3,
        mood_level:     mood_level      || 3,
        hunger_level:   hunger_level   || 3,
        brain_fog:      brain_fog       || false,
        had_headache:   had_headache    || false,
        had_fatigue:    had_fatigue     || false,
        had_cravings:   had_cravings    || false,
        followed_meals: followed_meals  ?? true,
        water_glasses:  water_glasses   || 0,
        fasted_today:   fasted_today    || false,
        note:           finalNote,
        xp_earned:      xp_earned       || 30,
        sleep_hours:    sleep_hours     || null,
        sleep_quality:  sleep_quality   || null,
        took_sodium:    took_sodium     || false,
        took_potassium: took_potassium  || false,
        took_magnesium: took_magnesium  || false,
      }, { onConflict: 'user_id,checkin_date', ignoreDuplicates: true })
      .select('id');

    if (checkinError) throw checkinError;

    // insertedRows is non-empty only when the row was freshly inserted.
    // An existing checkin returns [] — the DB enforces this atomically.
    const isNewCheckin = Array.isArray(insertedRows) && insertedRows.length > 0;

    // ── 3. Award XP only on the FIRST check-in of the day ──
    if (!isNewCheckin) {
      return json({ success: true, xp_earned: 0, alreadyCheckedIn: true });
    }

    // ── 4. Parallel: award XP + log transaction + advance streak day ──
    // These three operations are fully independent — run them concurrently.
    const xpAmount = xp_earned || 30;
    const [xpResult, , dayResult] = await Promise.all([
      db.rpc('award_xp', {
        user_id_param:     user.id,
        action_type_param: 'daily_checkin',
        xp_amount_param:   xpAmount,
        description_param: `Daily check-in — ${today}`,
        day_number_param:  null,
      }),
      db.from('xp_transactions').insert({
        user_id:     user.id,
        action_type: 'daily_checkin',
        xp_amount:   xpAmount,
        description: `Daily check-in — ${today}`,
      }),
      db.rpc('update_current_day', { user_id_param: user.id }),
    ]);

    // XP fallback if RPC failed — direct update to user_journey
    if (xpResult.error) {
      console.warn('award_xp RPC failed, updating user_journey directly:', xpResult.error.message);
      const { data: journey } = await db
        .from('user_journey').select('total_xp, level').eq('user_id', user.id).maybeSingle();
      if (journey) {
        const newXP  = (journey.total_xp || 0) + xpAmount;
        await db.from('user_journey')
          .update({ total_xp: newXP, level: Math.floor(newXP / 500) + 1 })
          .eq('user_id', user.id);
      }
    }

    // currentDay from update_current_day RPC — default to 1 if unavailable
    // (avoids an extra user_journey SELECT on RPC failure)
    const currentDay: number = dayResult.data ?? 1;

    // Award a streak shield at every 7-day streak milestone (fire-and-forget)
    void Promise.resolve(db.rpc('award_streak_shield', { user_id_param: user.id })).catch(() => {});

    // ── 5. Auto-complete task entries for what was logged ──
    await autoCompleteTask(user.id, 'checkin', currentDay, accessToken);
    if ((water_glasses || 0) >= 8) {
      await autoCompleteTask(user.id, 'water', currentDay, accessToken);
    }

    // ── 6. Keto flu detection ──
    const dangerSymptoms = (symptoms || []).filter(
      (s: string) => ['headache', 'dizziness', 'cramps', 'fatigue'].includes(s)
    );
    const autoAdvice = dangerSymptoms.length >= 2 ? 'KETO_FLU_ALERT' : null;

    checkAchievements(user.id, accessToken); // fire-and-forget
    return json({ success: true, xp_earned: xpAmount, autoAdvice });

  } catch (error: any) {
    await captureError('checkin/save', userId, error);
    return json({ error: 'Server error' }, 500);
  }
};

