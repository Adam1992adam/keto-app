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
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

// ── GET — return latest saved plan ──────────────────────────────────────────
export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;

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
    return json({ error: 'Server error' }, 500);
  }

  return json({ success: true, plan: data });
};

// ── POST — upsert plan ───────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;

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
    return json({ error: 'Server error' }, 500);
  }

  return json({ success: true, plan: data });
};

// ── Helper ───────────────────────────────────────────────────────────────────
