// src/pages/api/meal-prep/save.ts
// POST /api/meal-prep/save  — upsert a week's meal prep plan
// GET  /api/meal-prep/save  — fetch latest plan for the authenticated user
//
// Required DB table (create if not exists):
//   meal_prep_plans (
//     id              uuid primary key default gen_random_uuid(),
//     user_id         uuid references auth.users not null,
//     week_start_date date not null,
//     plan_data       jsonb not null default '{}',
//     created_at      timestamptz default now(),
//     unique(user_id, week_start_date)
//   );

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

// ── Auth helper ─────────────────────────────────────────────────────────────
async function getAuthUser(cookies: any) {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ── GET — return latest saved plan ──────────────────────────────────────────
export const GET: APIRoute = async ({ cookies }) => {
  const user = await getAuthUser(cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { data, error } = await supabase
    .from('meal_prep_plans')
    .select('id, week_start_date, plan_data, created_at')
    .eq('user_id', user.id)
    .order('week_start_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Table may not exist yet — return empty gracefully
    console.error('meal-prep GET error:', error.message);
    return json({ error: error.message }, 500);
  }

  return json({ success: true, plan: data });
};

// ── POST — upsert plan ───────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getAuthUser(cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { plan_data, week_start_date } = body;

  if (!plan_data || typeof plan_data !== 'object') {
    return json({ error: 'plan_data is required and must be an object' }, 400);
  }

  // Default week_start_date to this Monday if not supplied
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun … 6=Sat
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMon);
  const weekDate = week_start_date || monday.toISOString().split('T')[0];

  const row = {
    user_id: user.id,
    week_start_date: weekDate,
    plan_data,
  };

  const { data, error } = await supabase
    .from('meal_prep_plans')
    .upsert(row, { onConflict: 'user_id,week_start_date' })
    .select()
    .maybeSingle();

  if (error) {
    console.error('meal-prep POST error:', error.message);
    return json({ error: error.message }, 500);
  }

  return json({ success: true, plan: data });
};

// ── Helper ───────────────────────────────────────────────────────────────────
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
