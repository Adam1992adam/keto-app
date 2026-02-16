// src/pages/api/auth/signup.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const fullName = formData.get('fullName')?.toString();
  const plan = formData.get('plan')?.toString() || 'basic_30';

  if (!email || !password || !fullName) {
    return redirect('/signup?error=auth');
  }

  if (password.length < 6) {
    return redirect('/signup?error=weak');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    console.error('Signup error:', error);
    if (error.message.includes('already registered')) {
      return redirect('/signup?error=exists');
    }
    return redirect('/signup?error=auth');
  }

  if (!data.user) {
    return redirect('/signup?error=auth');
  }

  const endDate = new Date();
  switch (plan) {
    case 'advanced_6m':
      endDate.setDate(endDate.getDate() + 180);
      break;
    case 'pro_12m':
      endDate.setDate(endDate.getDate() + 365);
      break;
    default:
      endDate.setDate(endDate.getDate() + 30);
  }

  try {
    // 1. Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      subscription_tier: plan,
      subscription_status: 'active',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: endDate.toISOString(),
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // 🆕 2. Create journey
    const { error: journeyError } = await supabase.from('user_journey').insert({
      user_id: data.user.id,
      start_date: new Date().toISOString().split('T')[0],
      current_day: 1,
      status: 'active',
      total_xp: 0,
      level: 1,
    });

    if (journeyError) {
      console.error('Journey creation error:', journeyError);
    }

    // 🆕 3. Initialize Day 1 tasks
    await supabase.rpc('initialize_daily_tasks', {
      user_id_param: data.user.id,
      day_number_param: 1
    });

  } catch (err) {
    console.error('Setup failed:', err);
  }

  if (data.session) {
    cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return redirect('/dashboard?welcome=true');
  }

  return redirect('/login?message=Account created! Please check your email to confirm.');
};