import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const { units } = await request.json();

    if (units !== 'imperial' && units !== 'metric') {
      return new Response(JSON.stringify({ error: 'Invalid units value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ preferred_units: units, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, units }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Error updating units:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};