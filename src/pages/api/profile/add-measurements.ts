// src/pages/api/profile/add-measurements.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();

    // تنظيف البيانات — نحول القيم الفارغة إلى null
    const clean = (val: any) => {
      const n = parseFloat(val);
      return isNaN(n) ? null : n;
    };

    const { data, error } = await supabase
      .from('body_measurements')
      .insert({
        user_id:  user.id,
        waist_cm: clean(body.waist_cm),
        chest_cm: clean(body.chest_cm),
        hips_cm:  clean(body.hips_cm),
        arm_cm:   clean(body.arm_cm),
        thigh_cm: clean(body.thigh_cm),
        neck_cm:  clean(body.neck_cm),
        measured_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Measurements error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};