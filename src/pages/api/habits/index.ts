// src/pages/api/habits/index.ts
// GET  /api/habits        → list habits + today's completions
// POST /api/habits        → create habit
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const dateParam = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    const { data: habits, error: he } = await supabase
      .from('habits').select('*').eq('user_id', user.id).eq('is_active', true)
      .order('sort_order').order('created_at');
    if (he) throw he;

    const { data: completions } = await supabase
      .from('habit_completions').select('habit_id, completed_date')
      .eq('user_id', user.id)
      .gte('completed_date', new Date(Date.now() - 29 * 86400000).toISOString().split('T')[0]);

    return json({ habits: habits || [], completions: completions || [], date: dateParam });
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const { title, icon, category, frequency, target_streak } = await request.json();
    if (!title?.trim()) return json({ error: 'Title required' }, 400);

    const { data, error } = await supabase.from('habits').insert({
      user_id: user.id,
      title: title.trim(),
      icon: icon || '✅',
      category: category || 'general',
      frequency: frequency || 'daily',
      target_streak: target_streak || 7,
    }).select().maybeSingle();

    if (error) throw error;
    return json({ success: true, habit: data });
  } catch (e: any) {
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
