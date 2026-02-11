import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 1. جلب التوكنات من الكوكيز
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Session expired. Please login again.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. تعيين الجلسة يدوياً (هذا يحل مشكلة الـ ECONNRESET غالباً)
    if (refreshToken) {
        await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }

    // 3. التحقق من المستخدم
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. جلب البيانات من الطلب
    const body = await request.json();
    const { full_name, weight_kg, height_cm, target_weight_kg } = body;

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (weight_kg !== undefined) updateData.weight_kg = parseFloat(weight_kg);
    if (height_cm !== undefined) updateData.height_cm = parseInt(height_cm);
    if (target_weight_kg !== undefined) updateData.target_weight_kg = parseFloat(target_weight_kg);

    // 5. تحديث قاعدة البيانات
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. تسجيل الوزن إذا تم تغييره (مع منع التكرار في نفس اليوم)
    if (weight_kg !== undefined) {
      await supabase
        .from('weight_logs')
        .upsert({
          user_id: user.id,
          weight_kg: parseFloat(weight_kg),
          date: new Date().toISOString().split('T')[0]
        }, { onConflict: 'user_id,date' });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};