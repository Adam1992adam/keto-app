// src/pages/api/export/[type].ts
// GET /api/export/[type]  — streams CSV data for the authenticated user
// type: weight | checkins | food | measurements
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json } from '../../../lib/apiResponse';

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db } = auth;

  // ── Read unit preference ──────────────────────────────────────────────────
  const { data: profile } = await db
    .from('profiles').select('preferred_units').eq('id', user.id).maybeSingle();
  const imperial = (profile?.preferred_units || 'imperial') === 'imperial';

  const type = params.type;

  // ── Route to correct export handler ──────────────────────────────────────
  if (type === 'weight')       return exportWeight(db, user.id, imperial);
  if (type === 'checkins')     return exportCheckins(db, user.id);
  if (type === 'food')         return exportFood(db, user.id);
  if (type === 'measurements') return exportMeasurements(db, user.id, imperial);
  if (type === 'fasting')      return exportFasting(db, user.id);

  return json({ error: 'Unknown export type' }, 400);
};

// ── Weight Log ───────────────────────────────────────────────────────────────
async function exportWeight(db: any, userId: string, imperial: boolean) {
  const { data, error } = await db
    .from('weight_logs')
    .select('logged_date, weight')
    .eq('user_id', userId)
    .order('logged_date', { ascending: true });

  if (error) return json({ error: 'Server error' }, 500);

  const unit = imperial ? 'lbs' : 'kg';
  const headers = ['Date', `Weight (${unit})`];
  const rows = (data || []).map((r) => [
    r.logged_date,
    imperial ? Math.round(r.weight * 2.20462 * 10) / 10 : r.weight,
  ]);
  return csvResponse(headers, rows, 'keto-weight.csv');
}

// ── Daily Check-ins ──────────────────────────────────────────────────────────
async function exportCheckins(db: any, userId: string) {
  const { data, error } = await db
    .from('daily_checkins')
    .select(
      'checkin_date, energy_level, mood_level, hunger_level, water_glasses, ' +
      'had_headache, had_fatigue, had_cravings, brain_fog, ' +
      'fasted_today, followed_meals, xp_earned, note'
    )
    .eq('user_id', userId)
    .order('checkin_date', { ascending: true });

  if (error) return json({ error: 'Server error' }, 500);

  const headers = [
    'Date', 'Energy (1-10)', 'Mood (1-10)', 'Hunger (1-10)', 'Water Glasses',
    'Headache', 'Fatigue', 'Cravings', 'Brain Fog',
    'Fasted', 'Followed Meals', 'XP Earned', 'Note',
  ];
  const rows = (data || []).map((r) => [
    r.checkin_date,
    r.energy_level,
    r.mood_level,
    r.hunger_level,
    r.water_glasses,
    r.had_headache   ? 'Yes' : 'No',
    r.had_fatigue    ? 'Yes' : 'No',
    r.had_cravings   ? 'Yes' : 'No',
    r.brain_fog      ? 'Yes' : 'No',
    r.fasted_today   ? 'Yes' : 'No',
    r.followed_meals ? 'Yes' : 'No',
    r.xp_earned,
    csvEscape(r.note || ''),
  ]);
  return csvResponse(headers, rows, 'keto-checkins.csv');
}

// ── Food Log ─────────────────────────────────────────────────────────────────
async function exportFood(db: any, userId: string) {
  const { data, error } = await db
    .from('food_logs')
    .select('logged_date, food_name, calories, protein_g, carbs_g, fat_g, meal_type, serving_size, serving_unit')
    .eq('user_id', userId)
    .order('logged_date', { ascending: true });

  if (error) return json({ error: 'Server error' }, 500);

  const headers = [
    'Date', 'Food Name', 'Meal Type',
    'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)',
    'Serving Size', 'Serving Unit',
  ];
  const rows = (data || []).map((r) => [
    r.logged_date,
    csvEscape(r.food_name || ''),
    r.meal_type || '',
    r.calories,
    r.protein_g ?? '',
    r.carbs_g   ?? '',
    r.fat_g     ?? '',
    r.serving_size || '',
    r.serving_unit || '',
  ]);
  return csvResponse(headers, rows, 'keto-food-log.csv');
}

// ── Body Measurements ────────────────────────────────────────────────────────
async function exportMeasurements(db: any, userId: string, imperial: boolean) {
  const { data, error } = await db
    .from('body_measurements')
    .select('logged_date, neck_cm, waist_cm, hips_cm, chest_cm, arm_cm, thigh_cm, notes')
    .eq('user_id', userId)
    .order('logged_date', { ascending: true });

  if (error) return json({ error: 'Server error' }, 500);

  const unit = imperial ? 'in' : 'cm';
  const conv = (v: number | null) => {
    if (v === null || v === undefined) return '';
    return imperial ? Math.round((v / 2.54) * 10) / 10 : v;
  };

  const headers = [
    'Date', `Neck (${unit})`, `Waist (${unit})`, `Hips (${unit})`,
    `Chest (${unit})`, `Arm (${unit})`, `Thigh (${unit})`, 'Notes',
  ];
  const rows = (data || []).map((r) => [
    r.logged_date,
    conv(r.neck_cm),
    conv(r.waist_cm),
    conv(r.hips_cm),
    conv(r.chest_cm),
    conv(r.arm_cm),
    conv(r.thigh_cm),
    csvEscape(r.notes || ''),
  ]);
  return csvResponse(headers, rows, 'keto-measurements.csv');
}

// ── Fasting Sessions ─────────────────────────────────────────────────────────
async function exportFasting(db: any, userId: string) {
  const { data, error } = await db
    .from('fasting_sessions')
    .select('started_at, ended_at, target_hours, protocol')
    .eq('user_id', userId)
    .order('started_at', { ascending: true });

  if (error) return json({ error: 'Server error' }, 500);

  const headers = ['Started At', 'Ended At', 'Duration (h)', 'Target Hours', 'Protocol'];
  const rows = (data || []).map((r: any) => {
    const durationH = r.ended_at
      ? Math.round(((new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()) / 3600000) * 10) / 10
      : '';
    return [
      r.started_at ? new Date(r.started_at).toISOString().replace('T', ' ').slice(0, 16) : '',
      r.ended_at   ? new Date(r.ended_at).toISOString().replace('T', ' ').slice(0, 16)   : 'Active',
      durationH,
      r.target_hours || '',
      r.protocol || '',
    ];
  });
  return csvResponse(headers, rows, 'keto-fasting.csv');
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function csvEscape(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

function csvResponse(headers: string[], rows: (string | number | null | undefined)[][], filename: string) {
  const lines: string[] = [headers.join(',')];
  for (const row of rows) {
    lines.push(row.map((v) => (v === null || v === undefined ? '' : String(v))).join(','));
  }
  const csv = lines.join('\r\n');
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

