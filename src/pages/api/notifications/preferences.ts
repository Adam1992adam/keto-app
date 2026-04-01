// src/pages/api/notifications/preferences.ts
// GET  /api/notifications/preferences — fetch user notification preferences
// POST /api/notifications/preferences — upsert user notification preferences

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

const DEFAULTS = {
  checkin_reminder:  true,
  streak_warning:    true,
  incomplete_tasks:  true,
  weight_reminder:   true,
  fasting_active:    true,
  weekly_review:     true,
  milestone:         true,
  level_up:          true,
};

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return json({ preferences: prefs || { user_id: user.id, ...DEFAULTS } });
};

export const POST: APIRoute = async ({ cookies, request }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const row = {
    user_id:           user.id,
    checkin_reminder:  body.checkin_reminder  ?? true,
    streak_warning:    body.streak_warning    ?? true,
    incomplete_tasks:  body.incomplete_tasks  ?? true,
    weight_reminder:   body.weight_reminder   ?? true,
    fasting_active:    body.fasting_active    ?? true,
    weekly_review:     body.weekly_review     ?? true,
    milestone:         body.milestone         ?? true,
    level_up:          body.level_up          ?? true,
    updated_at:        new Date().toISOString(),
  };

  const { error } = await supabase
    .from('notification_preferences')
    .upsert(row, { onConflict: 'user_id' });

  if (error) return json({ error: error.message }, 500);

  return json({ success: true, preferences: row });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
