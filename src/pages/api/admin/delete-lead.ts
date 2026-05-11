import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') return json({ error: 'Unauthorized' }, 401);

  try {
    const { id } = await request.json() as { id?: string };
    if (!id || typeof id !== 'string') return json({ error: 'id required' }, 400);

    const env = (locals as any)?.runtime?.env || {};
    const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL  || env.PUBLIC_SUPABASE_URL  || import.meta.env.PUBLIC_SUPABASE_URL;
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(SUPABASE_URL, SERVICE_KEY);

    const { error } = await db.from('leads').delete().eq('id', id);
    if (error) return json({ error: error.message }, 500);

    return json({ success: true });
  } catch (err) {
    console.error('[admin/delete-lead]', err);
    return json({ error: 'Something went wrong' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
