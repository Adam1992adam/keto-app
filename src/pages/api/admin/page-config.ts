// GET  /api/admin/page-config?page=home  → load saved GrapeJS content
// POST /api/admin/page-config            → save draft or publish

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

export async function GET({ url, cookies }: any) {
  if (!isAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);

  const page = url.searchParams.get('page');
  if (!page) return json({ error: 'page param required' }, 400);

  const db = adminDb();
  const { data, error } = await db
    .from('page_configs')
    .select('*')
    .eq('page_slug', page)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500);
  return json({ config: data });
}

export async function POST({ request, cookies }: any) {
  if (!isAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { page, html, css, publish } = body;
  if (!page) return json({ error: 'page required' }, 400);

  const db = adminDb();

  const upsertData: any = {
    page_slug:  page,
    gjs_html:   html   ?? '',
    gjs_css:    css    ?? '',
    updated_at: new Date().toISOString(),
    updated_by: 'admin',
  };
  if (publish !== undefined) upsertData.published = publish;

  const { error } = await db
    .from('page_configs')
    .upsert(upsertData, { onConflict: 'page_slug' });

  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
}
