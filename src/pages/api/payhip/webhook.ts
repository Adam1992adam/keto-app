import type { APIRoute } from 'astro';

/**
 * DEBUG VERSION - Payhip Webhook
 * This version logs EVERYTHING to help debug variant matching
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log('🔔 ========== PAYHIP WEBHOOK RECEIVED ==========');

    // Get raw body
    const payload = await request.json();
    
    // LOG EVERYTHING
    console.log('📦 FULL PAYLOAD:');
    console.log(JSON.stringify(payload, null, 2));
    
    console.log('🔍 EXTRACTED FIELDS:');
    console.log('  sale_id:', payload.sale_id);
    console.log('  product_id:', payload.product_id);
    console.log('  product_name:', payload.product_name);
    console.log('  buyer_email:', payload.buyer_email);
    console.log('  amount:', payload.amount);
    console.log('  currency:', payload.currency);
    console.log('  variant_name:', payload.variant_name);
    console.log('  variant_id:', payload.variant_id);
    
    // Check all possible variant fields
    console.log('🔍 CHECKING ALL POSSIBLE VARIANT FIELDS:');
    const possibleVariantFields = [
      'variant_name',
      'variant',
      'variant_title',
      'option_name',
      'option',
      'product_variant',
      'plan_name',
      'plan'
    ];
    
    possibleVariantFields.forEach(field => {
      if (payload[field]) {
        console.log(`  ✅ ${field}: "${payload[field]}"`);
      }
    });

    const {
      sale_id,
      product_id,
      product_name,
      buyer_email,
      amount,
      currency,
      variant_name,
      variant_id,
    } = payload;

    if (!buyer_email || !product_id) {
      console.error('❌ Missing required fields');
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields',
        received: { buyer_email, product_id }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Supabase credentials
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ Supabase not configured');
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // IMPROVED TIER DETECTION
    let subscription_tier = 'basic_30';
    let duration_days = 30;
    
    console.log('🎯 STARTING TIER DETECTION...');
    
    const price = parseFloat(amount) || 0;
    console.log(`  💰 Amount: $${price}`);
    
    // PRIMARY: Match by variant_name
    if (variant_name) {
      const variantLower = variant_name.toLowerCase().trim();
      console.log(`  🏷️  Variant name (lowercase): "${variantLower}"`);
      
      // Elite (check first - most expensive)
      if (variantLower.includes('elite')) {
        subscription_tier = 'elite_12';
        duration_days = 365;
        console.log('  ✅ MATCHED: Elite (by variant name "elite")');
      }
      // Pro
      else if (variantLower.includes('pro')) {
        subscription_tier = 'pro_6';
        duration_days = 180;
        console.log('  ✅ MATCHED: Pro (by variant name "pro")');
      }
      // Basic
      else if (variantLower.includes('basic')) {
        subscription_tier = 'basic_30';
        duration_days = 30;
        console.log('  ✅ MATCHED: Basic (by variant name "basic")');
      }
      // No match - try by price
      else {
        console.log('  ⚠️ Variant name did not match known plans, trying by price...');
        if (price >= 8) {
          subscription_tier = 'elite_12';
          duration_days = 365;
          console.log(`  ✅ MATCHED: Elite (by price $${price} >= $8)`);
        } else if (price >= 3) {
          subscription_tier = 'pro_6';
          duration_days = 180;
          console.log(`  ✅ MATCHED: Pro (by price $${price} >= $3)`);
        } else {
          subscription_tier = 'basic_30';
          duration_days = 30;
          console.log(`  ✅ MATCHED: Basic (by price $${price} < $3)`);
        }
      }
    } 
    // FALLBACK: Match by price only
    else {
      console.log('  ⚠️ NO variant_name provided, using price only');
      if (price >= 8) {
        subscription_tier = 'elite_12';
        duration_days = 365;
        console.log(`  ✅ MATCHED: Elite (by price $${price} >= $8)`);
      } else if (price >= 3) {
        subscription_tier = 'pro_6';
        duration_days = 180;
        console.log(`  ✅ MATCHED: Pro (by price $${price} >= $3)`);
      } else {
        subscription_tier = 'basic_30';
        duration_days = 30;
        console.log(`  ✅ MATCHED: Basic (by price $${price} < $3)`);
      }
    }

    console.log(`🎯 FINAL DECISION: ${subscription_tier} (${duration_days} days)`);

    // Calculate dates
    const start_date = new Date().toISOString();
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + duration_days);
    const end_date_iso = end_date.toISOString();

    console.log(`📅 Start: ${start_date}`);
    console.log(`📅 End: ${end_date_iso}`);

    // Find user
    const { data: user, error: findError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', buyer_email)
      .single();

    if (findError || !user) {
      console.log('⚠️ User not found, saving to pending_activations');
      
      const { error: pendingError } = await supabase
        .from('pending_activations')
        .insert({
          email: buyer_email,
          subscription_tier,
          subscription_start_date: start_date,
          subscription_end_date: end_date_iso,
          payhip_sale_id: sale_id,
          payhip_data: payload,
          created_at: new Date().toISOString()
        });

      if (pendingError) {
        console.error('❌ Pending activation error:', pendingError);
      } else {
        console.log('✅ Saved to pending_activations');
      }
      
      return new Response(JSON.stringify({
        success: true,
        status: 'pending',
        message: 'Purchase recorded. User needs to sign up.',
        tier: subscription_tier,
        email: buyer_email
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ Found user: ${user.email}`);

    // Update subscription
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_tier,
        subscription_status: 'active',
        subscription_start_date: start_date,
        subscription_end_date: end_date_iso,
        payhip_sale_id: sale_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Update failed',
        details: updateError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ ========== SUBSCRIPTION UPDATED SUCCESSFULLY ==========');
    console.log(`   Email: ${user.email}`);
    console.log(`   Tier: ${subscription_tier}`);
    console.log(`   Until: ${end_date_iso}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription activated',
      user: { email: user.email, name: user.full_name },
      subscription: { tier: subscription_tier, start_date, end_date: end_date_iso }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ WEBHOOK ERROR:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Payhip webhook (DEBUG VERSION)',
    status: 'ready'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};