// src/pages/api/meals/today.ts
// ═══════════════════════════════════════════════════════
// يُستدعى من الداشبورد لجلب وجبات اليوم المخصصة
// GET /api/meals/today
// ═══════════════════════════════════════════════════════
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getAdaptedMeals } from '../../../lib/smartMeals';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const result = await getAdaptedMeals(user.id);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};