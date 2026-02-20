import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    
    console.log('🔔 Webhook received:', JSON.stringify(payload, null, 2));
    
    const { buyer_email, amount, variant_name } = payload;
    
    if (!buyer_email) {
      return new Response(JSON.stringify({ error: 'No email' }), { status: 400 });
    }
    
    // Get env
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('No Supabase credentials');
      return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Determine tier
    let tier = 'basic_30';
    let days = 30;
    
    const price = parseFloat(amount) || 0;
    const variant = (variant_name || '').toLowerCase();
    
    console.log('Price:', price, 'Variant:', variant);
    
    // IMPORTANT: When using 100% coupon, amount = 0, so we MUST use variant_name
    if (variant.includes('elite')) {
      tier = 'elite_12';
      days = 365;
    } else if (variant.includes('pro')) {
      tier = 'pro_6';
      days = 180;
    } else if (variant.includes('basic')) {
      tier = 'basic_30';
      days = 30;
    } 
    // Fallback to price (only if amount > 0)
    else if (price > 0) {
      if (price >= 8) {
        tier = 'elite_12';
        days = 365;
      } else if (price >= 3) {
        tier = 'pro_6';
        days = 180;
      }
    }
    
    console.log('Determined tier:', tier);
    
    const start = new Date().toISOString();
    const end = new Date();
    end.setDate(end.getDate() + days);
    
    // Find user
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', buyer_email)
      .single();
    
    if (!user) {
      console.log('User not found, saving to pending');
      await supabase.from('pending_activations').insert({
        email: buyer_email,
        subscription_tier: tier,
        subscription_start_date: start,
        subscription_end_date: end.toISOString(),
        payhip_sale_id: payload.sale_id,
        payhip_data: payload
      });
      return new Response(JSON.stringify({ success: true, status: 'pending' }), { status: 200 });
    }
    
    // Update user
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_start_date: start,
        subscription_end_date: end.toISOString(),
        payhip_sale_id: payload.sale_id
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Update error:', error);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }
    
    console.log('✅ Updated:', buyer_email, 'to', tier);
    
    return new Response(JSON.stringify({ 
      success: true, 
      tier,
      email: buyer_email 
    }), { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown' 
    }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    message: 'Payhip webhook endpoint is working',
    hint: 'This endpoint should be called by Payhip via POST request'
  }), { status: 200 });
};