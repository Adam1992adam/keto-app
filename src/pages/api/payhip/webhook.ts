import type { APIRoute } from 'astro';

/**
 * FINAL WEBHOOK - Uses variant_id mapping
 * Payhip doesn't send variant_name, only variant_id!
 */

// CRITICAL: Map Payhip variant IDs to subscription tiers
// Get these IDs from Payhip product page or webhook logs
const VARIANT_MAP: Record<string, { tier: string; days: number }> = {
  // Replace with YOUR actual variant IDs from Payhip
  // Example format:
  // 'variant_123abc': { tier: 'basic_30', days: 30 },
  // 'variant_456def': { tier: 'pro_6', days: 180 },
  // 'variant_789ghi': { tier: 'elite_12', days: 365 },
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    
    console.log('═══════════════════════════════════════════');
    console.log('🔔 PAYHIP WEBHOOK');
    console.log('═══════════════════════════════════════════');
    console.log('📦 Full Payload:', JSON.stringify(payload, null, 2));
    
    const { sale_id, buyer_email, amount, variant_name, variant_id, product_id } = payload;
    
    console.log('📧 Email:', buyer_email);
    console.log('💰 Amount:', amount);
    console.log('🏷️  Variant Name:', variant_name);
    console.log('🆔 Variant ID:', variant_id);
    console.log('📦 Product ID:', product_id);
    
    if (!buyer_email) {
      console.error('❌ No email');
      return new Response(JSON.stringify({ error: 'No email' }), { status: 400 });
    }
    
    // Get Supabase
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ No Supabase config');
      return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Determine tier
    let tier = 'basic_30';
    let days = 30;
    
    console.log('🔍 Determining tier...');
    
    // METHOD 1: Use variant_id mapping (most reliable)
    if (variant_id && VARIANT_MAP[variant_id]) {
      const mapped = VARIANT_MAP[variant_id];
      tier = mapped.tier;
      days = mapped.days;
      console.log(`✅ Matched by variant_id: ${variant_id} → ${tier}`);
    }
    // METHOD 2: Use variant_name if available
    else if (variant_name) {
      const v = variant_name.toLowerCase().trim();
      console.log(`🔍 Checking variant_name: "${v}"`);
      
      if (v.includes('elite')) {
        tier = 'elite_12';
        days = 365;
        console.log('✅ Matched: Elite (by name)');
      } else if (v.includes('pro')) {
        tier = 'pro_6';
        days = 180;
        console.log('✅ Matched: Pro (by name)');
      } else if (v.includes('basic')) {
        tier = 'basic_30';
        days = 30;
        console.log('✅ Matched: Basic (by name)');
      } else {
        console.log('⚠️ No name match, using price fallback');
        const price = parseFloat(amount) || 0;
        if (price >= 8) {
          tier = 'elite_12';
          days = 365;
        } else if (price >= 3) {
          tier = 'pro_6';
          days = 180;
        }
        console.log(`✅ Matched by price: $${price} → ${tier}`);
      }
    }
    // METHOD 3: Fallback to price (not reliable with coupons!)
    else {
      console.log('⚠️ No variant info, using price (unreliable with coupons!)');
      const price = parseFloat(amount) || 0;
      if (price >= 8) {
        tier = 'elite_12';
        days = 365;
      } else if (price >= 3) {
        tier = 'pro_6';
        days = 180;
      }
      console.log(`⚠️ Price-based: $${price} → ${tier}`);
      
      // IMPORTANT: Log variant_id for mapping
      if (variant_id) {
        console.log('⚠️⚠️⚠️ IMPORTANT: Add this to VARIANT_MAP:');
        console.log(`  '${variant_id}': { tier: '${tier}', days: ${days} },`);
      }
    }
    
    console.log(`🎯 FINAL: ${tier} (${days} days)`);
    
    // Calculate dates
    const start = new Date().toISOString();
    const end = new Date();
    end.setDate(end.getDate() + days);
    const endISO = end.toISOString();
    
    // Clean email
    const cleanEmail = buyer_email.trim().toLowerCase();
    
    // Find user
    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', cleanEmail);
    
    const user = users && users.length > 0 ? users[0] : null;
    
    if (!user) {
      console.log('⚠️ User not found, saving to pending');
      
      await supabase.from('pending_activations').insert({
        email: cleanEmail,
        subscription_tier: tier,
        subscription_start_date: start,
        subscription_end_date: endISO,
        payhip_sale_id: sale_id,
        payhip_data: payload,
        created_at: new Date().toISOString()
      });
      
      console.log('✅ Saved to pending');
      console.log('═══════════════════════════════════════════');
      
      return new Response(JSON.stringify({
        success: true,
        status: 'pending',
        tier,
        email: cleanEmail
      }), { status: 200 });
    }
    
    console.log(`✅ User found: ${user.email}`);
    
    // Update subscription
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_start_date: start,
        subscription_end_date: endISO,
        payhip_sale_id: sale_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }
    
    console.log('✅✅✅ SUCCESS ✅✅✅');
    console.log(`   User: ${user.email}`);
    console.log(`   Tier: ${tier}`);
    console.log('═══════════════════════════════════════════');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription activated',
      user: { email: user.email },
      subscription: { tier, start_date: start, end_date: endISO }
    }), { status: 200 });
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown'
    }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Payhip webhook endpoint',
    status: 'ready',
    note: 'Check logs to get variant_id values for VARIANT_MAP'
  }), { status: 200 });
};