// POST /api/shopping/custom  → add item  { name, quantity, category }
// DELETE /api/shopping/custom → delete item  { id }
// PATCH /api/shopping/custom  → toggle checked { id, is_checked }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;
  const { name, quantity, category } = await request.json();
  if (!name?.trim()) return json({ error: 'Name required' }, 400);
  const { data, error } = await supabase.from('custom_shopping_items').insert({
    user_id: user.id, name: name.trim(), quantity: quantity || null, category: category || 'other',
  }).select().maybeSingle();
  if (error) return json({ error: 'Server error' }, 500);
  return json({ success: true, item: data });
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;
  const { id } = await request.json();
  const { error } = await supabase.from('custom_shopping_items').delete().eq('id', id).eq('user_id', user.id);
  if (error) return json({ error: 'Server error' }, 500);
  return json({ success: true });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const auth = await requireApiAuth(cookies);
  if (!auth.ok) return auth.response;
  const { user, db: supabase } = auth;
  const { id, is_checked } = await request.json();
  const { error } = await supabase.from('custom_shopping_items')
    .update({ is_checked }).eq('id', id).eq('user_id', user.id);
  if (error) return json({ error: 'Server error' }, 500);
  return json({ success: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
