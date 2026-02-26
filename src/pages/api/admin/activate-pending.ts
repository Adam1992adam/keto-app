import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const adminSession = cookies.get('admin-session')?.value;
  if (adminSession !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id, email, tier } = await request.json();

    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const days = tier === 'basic_30' ? 30 : tier === 'pro_6' ? 180 : 365;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // تحديث profiles إذا موجود
    const { data: users } = await supabase.from('profiles').select('id').ilike('email', email);

    if (users && users.length > 0) {
      await supabase.from('profiles').update({
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: endDate.toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', users[0].id);
    }

    // تحديث pending_activations كـ activated
    await supabase.from('pending_activations').update({
      activated: true,
      activated_at: new Date().toISOString(),
    }).eq('id', id);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};