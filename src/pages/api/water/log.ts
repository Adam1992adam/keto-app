// src/pages/api/water/log.ts
// POST /api/water/log  { delta: 1 | -1 }
// Increments or decrements today's water intake on daily_checkins.water_glasses.
// Also updates water_intake table for history.

import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { autoCompleteTask } from '../../../lib/autoTask';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db, accessToken } = auth;

    const body = await request.json();
    const delta: number = body.delta === -1 ? -1 : 1;
    const today = new Date().toISOString().split('T')[0];

    // Get current count from today's checkin (if any)
    const { data: existing } = await db
      .from('daily_checkins')
      .select('water_glasses')
      .eq('user_id', user.id)
      .eq('checkin_date', today)
      .maybeSingle();

    const current = existing?.water_glasses ?? 0;
    const newCount = Math.max(0, Math.min(20, current + delta));

    // Upsert into daily_checkins
    await db.from('daily_checkins').upsert({
      user_id:       user.id,
      checkin_date:  today,
      water_glasses: newCount,
    }, { onConflict: 'user_id,checkin_date' });

    // Also update water_intake table for the journey day
    const { data: journey } = await db
      .from('user_journey').select('current_day').eq('user_id', user.id).maybeSingle();
    const dayNumber = journey?.current_day || 1;

    await db.from('water_intake').upsert({
      user_id:      user.id,
      day_number:   dayNumber,
      date:         today,
      glasses_count: newCount,
      target_glasses: 8,
      updated_at:   new Date().toISOString(),
    }, { onConflict: 'user_id,day_number' });

    // Auto-complete 'water' task when 8 glasses reached
    if (newCount >= 8) {
      await autoCompleteTask(user.id, 'water', dayNumber, accessToken);
    }

    return json({ success: true, glasses: newCount });

  } catch (err: any) {
    console.error('Water log error:', err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
