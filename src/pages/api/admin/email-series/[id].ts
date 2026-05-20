// PATCH  /api/admin/email-series/[id]  — update
// DELETE /api/admin/email-series/[id]  — delete

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function db(locals: any) {
  const env = locals?.runtime?.env || {};
  const url = process.env.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}

function guard(cookies: any) {
  return cookies.get('admin-session')?.value !== 'authenticated';
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export const PATCH: APIRoute = async ({ params, request, cookies, locals }) => {
  if (guard(cookies)) return json({ error: 'Unauthorized' }, 401);
  const { id } = params;
  if (!id) return json({ error: 'id required' }, 400);
  try {
    const body = await request.json() as Record<string, unknown>;
    const allowed = ['name', 'subject', 'preheader', 'html_body', 'delay_days', 'is_active', 'step_order'];
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (key in body) patch[key] = body[key];
    }
    const { data, error } = await db(locals)
      .from('lead_email_series')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ email: data });
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }
};

export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  if (guard(cookies)) return json({ error: 'Unauthorized' }, 401);
  const { id } = params;
  if (!id) return json({ error: 'id required' }, 400);
  const { error } = await db(locals).from('lead_email_series').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};
