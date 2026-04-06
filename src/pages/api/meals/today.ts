// src/pages/api/meals/today.ts
// ═══════════════════════════════════════════════════════
// يُستدعى من الداشبورد لجلب وجبات اليوم المخصصة
// GET /api/meals/today
// ═══════════════════════════════════════════════════════
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { getAdaptedMeals } from '../../../lib/smartMeals';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user } = auth;

    const result = await getAdaptedMeals(user.id);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};