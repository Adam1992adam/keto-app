import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

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
      .maybeSingle();

    if (error) return json({ error: 'Server error' }, 500);

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