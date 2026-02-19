import type { APIRoute } from 'astro';

/**
 * Payhip Webhook Endpoint
 * 
 * Called by Payhip when a sale is completed
 * Automatically updates user subscription in database
 * 
 * Webhook URL: https://keto-app.pages.dev/api/payhip/webhook
 * Event: sale.completed
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log('🔔 Payhip webhook received');

    // Get data from Payhip
    const payload = await request.json();
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Extract sale details
    const {
      sale_id,
      product_id,
      product_name,
      buyer_email,
      amount,
      currency,
      // Payhip sends variant info in different formats
      variant_name,
      variant_id,
    } = payload;

    // Validate required fields
    if (!buyer_email || !product_id) {
      console.error('❌ Missing required fields');
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ Sale ID: ${sale_id}`);
    console.log(`📧 Buyer: ${buyer_email}`);
    console.log(`💰 Amount: ${currency} ${amount}`);
    console.log(`📦 Product: ${product_name || product_id}`);
    console.log(`🏷️  Variant: ${variant_name || 'N/A'}`);

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

    // Create Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Determine subscription tier based on variant name or amount
    let subscription_tier = 'basic_30';
    let duration_days = 30;

    // Match by variant name (most reliable)
    if (variant_name) {
      const variantLower = variant_name.toLowerCase();
      if (variantLower.includes('basic') || variantLower.includes('30')) {
        subscription_tier = 'basic_30';
        duration_days = 30;
      } else if (variantLower.includes('pro') || variantLower.includes('6')) {
        subscription_tier = 'pro_6';
        duration_days = 180;
      } else if (variantLower.includes('elite') || variantLower.includes('12')) {
        subscription_tier = 'elite_12';
        duration_days = 365;
      }
    } 
    // Fallback: match by amount
    else {
      const price = parseFloat(amount);
      if (price <= 5) {
        subscription_tier = 'basic_30';
        duration_days = 30;
      } else if (price <= 50) {
        subscription_tier = 'pro_6';
        duration_days = 180;
      } else {
        subscription_tier = 'elite_12';
        duration_days = 365;
      }
    }

    console.log(`🎯 Determined tier: ${subscription_tier} (${duration_days} days)`);

    // Calculate dates
    const start_date = new Date().toISOString();
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + duration_days);
    const end_date_iso = end_date.toISOString();

    console.log(`📅 Start: ${start_date}`);
    console.log(`📅 End: ${end_date_iso}`);

    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', buyer_email)
      .single();

    if (findError || !user) {
      console.error('❌ User not found:', buyer_email);
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found',
        details: 'Please make sure the user has signed up first'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ Found user: ${user.full_name} (${user.id})`);

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
        error: 'Database update failed',
        details: updateError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ Subscription updated successfully!`);
    console.log(`   User: ${user.email}`);
    console.log(`   Tier: ${subscription_tier}`);
    console.log(`   Until: ${end_date_iso}`);

    // Success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription activated',
      user: {
        email: user.email,
        name: user.full_name
      },
      subscription: {
        tier: subscription_tier,
        start_date,
        end_date: end_date_iso,
        duration_days
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET for testing
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Payhip webhook endpoint is working',
    hint: 'This endpoint should be called by Payhip via POST request'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};