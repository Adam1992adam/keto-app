import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;
    userId = user.id;

    const body = await request.json();
    const { full_name, weight_kg, height_cm, target_weight_kg } = body;

    // Validate weight/height ranges before writing
    if (weight_kg !== undefined) {
      const w = parseFloat(weight_kg);
      if (isNaN(w) || w < 20 || w > 500)
        return json({ error: 'Weight must be between 20 and 500 kg' }, 400);
    }
    if (height_cm !== undefined) {
      const h = parseInt(height_cm);
      if (isNaN(h) || h < 50 || h > 300)
        return json({ error: 'Height must be between 50 and 300 cm' }, 400);
    }
    if (target_weight_kg !== undefined) {
      const tw = parseFloat(target_weight_kg);
      if (isNaN(tw) || tw < 20 || tw > 500)
        return json({ error: 'Target weight must be between 20 and 500 kg' }, 400);
    }

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = String(full_name).trim().slice(0, 100);
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
    console.error('[profile/update] user:', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}