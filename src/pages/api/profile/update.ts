import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken) return json({ error: 'Session expired. Please login again.' }, 401);

    // Set session manually to avoid ECONNRESET issues
    if (refreshToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    const { full_name, weight_kg, height_cm, target_weight_kg } = body;

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (weight_kg !== undefined) updateData.weight_kg = parseFloat(weight_kg);
    if (height_cm !== undefined) updateData.height_cm = parseInt(height_cm);
    if (target_weight_kg !== undefined) updateData.target_weight_kg = parseFloat(target_weight_kg);

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) return json({ error: error.message }, 500);

    // Also log weight if changed (upsert to avoid duplicates on same day)
    if (weight_kg !== undefined) {
      await supabase
        .from('weight_logs')
        .upsert({
          user_id: user.id,
          weight: parseFloat(weight_kg),
          logged_date: new Date().toISOString().split('T')[0],
        }, { onConflict: 'user_id,logged_date' });
    }

    return json({ success: true, data });

  } catch (err: any) {
    console.error('Profile update error:', err);
    return json({ error: 'Server error', details: err.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}