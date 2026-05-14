// GET  /api/admin/site-settings          → all settings as { key: { value, label, category } }
// POST /api/admin/site-settings          → { settings: { key: value, ... } }

import { createClient } from '@supabase/supabase-js';

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function adminDb() {
  const url = process.env.PUBLIC_SUPABASE_URL  || import.meta.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}

function isAdmin(cookies: any) {
  return cookies.get('admin-session')?.value === 'authenticated';
}

export async function GET({ cookies }: any) {
  if (!isAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);

  const db = adminDb();
  const { data, error } = await db.from('site_settings').select('*').order('category').order('key');
  if (error) return json({ error: error.message }, 500);

  const settings: Record<string, any> = {};
  for (const row of data || []) {
    settings[row.key] = { value: row.value, label: row.label, category: row.category };
  }
  return json({ settings });
}

export async function POST({ request, cookies }: any) {
  if (!isAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const updates: Record<string, string> = body.settings || {};
  if (!Object.keys(updates).length) return json({ error: 'No settings provided' }, 400);

  const db = adminDb();
  const now = new Date().toISOString();

  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value: String(value),
    updated_at: now,
  }));

  const { error } = await db
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) return json({ error: error.message }, 500);
  return json({ success: true, updated: rows.length });
}
