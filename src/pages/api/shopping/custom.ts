// POST /api/shopping/custom  → add item  { name, quantity, category }
// DELETE /api/shopping/custom → delete item  { id }
// PATCH /api/shopping/custom  → toggle checked { id, is_checked }
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

function db(token: string) {
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

async function getUser(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  return error ? null : user;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return json({ error: 'Unauthorized' }, 401);
  const supabase = db(token);
  const user = await getUser(supabase);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { name, quantity, category } = await request.json();
  if (!name?.trim()) return json({ error: 'Name required' }, 400);
  const { data, error } = await supabase.from('custom_shopping_items').insert({
    user_id: user.id, name: name.trim(), quantity: quantity || null, category: category || 'other',
  }).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ success: true, item: data });
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return json({ error: 'Unauthorized' }, 401);
  const supabase = db(token);
  const user = await getUser(supabase);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { id } = await request.json();
  const { error } = await supabase.from('custom_shopping_items').delete().eq('id', id).eq('user_id', user.id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return json({ error: 'Unauthorized' }, 401);
  const supabase = db(token);
  const user = await getUser(supabase);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { id, is_checked } = await request.json();
  const { error } = await supabase.from('custom_shopping_items')
    .update({ is_checked }).eq('id', id).eq('user_id', user.id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
