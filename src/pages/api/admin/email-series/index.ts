// GET  /api/admin/email-series  — list all
// POST /api/admin/email-series  — create new email

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

export const GET: APIRoute = async ({ cookies, locals }) => {
  if (guard(cookies)) return json({ error: 'Unauthorized' }, 401);
  const { data, error } = await db(locals).from('lead_email_series').select('*').order('step_order');
  if (error) return json({ error: error.message }, 500);
  return json({ emails: data });
};

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  if (guard(cookies)) return json({ error: 'Unauthorized' }, 401);
  try {
    const body = await request.json() as Record<string, unknown>;
    const { name, subject, preheader, html_body, delay_days, is_active, step_order } = body;
    if (!name || !subject || delay_days === undefined || step_order === undefined) {
      return json({ error: 'name, subject, delay_days, step_order are required' }, 400);
    }
    const { data, error } = await db(locals)
      .from('lead_email_series')
      .insert({ name, subject, preheader: preheader || '', html_body: html_body || '', delay_days: Number(delay_days), is_active: is_active !== false, step_order: Number(step_order) })
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ email: data }, 201);
  } catch (err) {
    return json({ error: 'Invalid request body' }, 400);
  }
};
