import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  // التحقق من صلاحية الأدمين
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id, full_name, subscription_tier, subscription_end_date, subscription_status } = await request.json();

    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { error } = await supabase.from('profiles').update({
      full_name,
      subscription_tier,
      subscription_end_date,
      subscription_status,
      updated_at: new Date().toISOString(),
    }).eq('id', id);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};