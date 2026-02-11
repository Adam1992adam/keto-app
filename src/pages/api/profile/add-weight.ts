import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    
    // Add weight log
    const { error: logError } = await supabase
      .from('weight_logs')
      .upsert({
        user_id: user.id,
        weight_kg: parseFloat(body.weight_kg),
        date: body.date,
        notes: body.notes || null
      }, {
        onConflict: 'user_id,date'
      });

    if (logError) {
      console.error('Weight log error:', logError);
      return new Response(JSON.stringify({ error: 'Failed to add weight' }), { status: 500 });
    }

    // Update profile current weight
    await supabase
      .from('profiles')
      .update({
        weight_kg: parseFloat(body.weight_kg),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    // Check for achievements
    const { data: logs } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (logs && logs.length >= 2) {
      const firstWeight = logs[0].weight_kg;
      const currentWeight = parseFloat(body.weight_kg);
      const weightLost = firstWeight - currentWeight;

      if (weightLost >= 1) {
        await supabase.from('achievements').upsert({
          user_id: user.id,
          achievement_type: 'weight_loss_1kg',
          achievement_name: 'First Kilo Lost'
        }, { onConflict: 'user_id,achievement_type,achievement_name' });
      }

      if (weightLost >= 5) {
        await supabase.from('achievements').upsert({
          user_id: user.id,
          achievement_type: 'weight_loss_5kg',
          achievement_name: 'Five Kilos Down'
        }, { onConflict: 'user_id,achievement_type,achievement_name' });
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Add weight error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};