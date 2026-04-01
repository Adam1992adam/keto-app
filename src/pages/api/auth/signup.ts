import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// ADMIN SIGNUP — no purchase verification required
// Used only for creating admin accounts
// ═══════════════════════════════════════

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email, password, fullName, adminPassword } = await request.json();

    // ── التحقق من الحقول المطلوبة ──────────
    if (!email || !password || !fullName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── التحقق من كلمة سر الأدمن ───────────
    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── قراءة Supabase credentials ──────────
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const cleanEmail = email.trim().toLowerCase();

    // ── التحقق أن الإيميل غير مسجل مسبقاً ──
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── إنشاء حساب في Supabase Auth ─────────
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ error: 'Failed to create user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = authData.user.id;

    // ── إنشاء profile بصلاحيات أدمن ─────────
    const { error: profileError } = await supabase.from('profiles').insert({
      id:                  userId,
      email:               cleanEmail,
      full_name:           fullName,
      subscription_tier:   'elite_12',   // الأدمن يحصل على أعلى خطة
      subscription_status: 'active',
      subscription_end_date: new Date('2099-12-31').toISOString(),
      is_admin:            true,
      preferred_units:     'metric',
      created_at:          new Date().toISOString(),
      updated_at:          new Date().toISOString(),
    });

    if (profileError) {
      console.error('Admin profile insert error:', profileError.message);
    }

    console.log(`✅ Admin account created: ${cleanEmail}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id:       userId,
        email:    cleanEmail,
        is_admin: true,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('signup error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};