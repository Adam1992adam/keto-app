import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    
    console.log('═══════════════════════════════════════════');
    console.log('🔔 PAYHIP WEBHOOK RECEIVED');
    console.log('═══════════════════════════════════════════');
    console.log('📦 Full Payload:', JSON.stringify(payload, null, 2));
    
    const { sale_id, buyer_email, amount, variant_name } = payload;
    
    console.log('📧 Buyer Email:', buyer_email);
    console.log('💰 Amount:', amount);
    console.log('🏷️  Variant:', variant_name);
    
    if (!buyer_email) {
      console.error('❌ No buyer_email provided');
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
      console.error('❌ No Supabase credentials');
      return new Response(JSON.stringify({ error: 'No DB config' }), { status: 500 });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Determine tier - VARIANT NAME FIRST (for coupons)
    let tier = 'basic_30';
    let days = 30;
    
    const price = parseFloat(amount) || 0;
    const variant = (variant_name || '').toLowerCase().trim();
    
    console.log('🔍 Analyzing purchase...');
    console.log('  Price:', price);
    console.log('  Variant (lowercase):', `"${variant}"`);
    
    // PRIORITY: Variant name (works with 100% coupons)
    if (variant) {
      if (variant.includes('elite')) {
        tier = 'elite_12';
        days = 365;
        console.log('  ✅ Matched: ELITE (by variant)');
      } else if (variant.includes('pro')) {
        tier = 'pro_6';
        days = 180;
        console.log('  ✅ Matched: PRO (by variant)');
      } else if (variant.includes('basic')) {
        tier = 'basic_30';
        days = 30;
        console.log('  ✅ Matched: BASIC (by variant)');
      } else {
        console.log('  ⚠️ Variant did not match, trying by price...');
        // Fallback to price
        if (price >= 8) {
          tier = 'elite_12';
          days = 365;
          console.log('  ✅ Matched: ELITE (by price >= $8)');
        } else if (price >= 3) {
          tier = 'pro_6';
          days = 180;
          console.log('  ✅ Matched: PRO (by price >= $3)');
        } else {
          tier = 'basic_30';
          days = 30;
          console.log('  ✅ Matched: BASIC (by price < $3)');
        }
      }
    } else {
      console.log('  ⚠️ No variant name, using price only');
      if (price >= 8) {
        tier = 'elite_12';
        days = 365;
      } else if (price >= 3) {
        tier = 'pro_6';
        days = 180;
      }
    }
    
    console.log('🎯 FINAL TIER:', tier, `(${days} days)`);
    
    // Calculate dates
    const start = new Date().toISOString();
    const end = new Date();
    end.setDate(end.getDate() + days);
    const endISO = end.toISOString();
    
    console.log('📅 Start:', start);
    console.log('📅 End:', endISO);
    
    // Clean email (remove spaces, lowercase)
    const cleanEmail = buyer_email.trim().toLowerCase();
    console.log('🔍 Searching for user:', cleanEmail);
    
    // Find user
    const { data: users, error: findError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', cleanEmail);
    
    if (findError) {
      console.error('❌ Database search error:', findError);
      return new Response(JSON.stringify({ error: 'DB error' }), { status: 500 });
    }
    
    console.log(`🔍 Found ${users?.length || 0} user(s)`);
    
    const user = users && users.length > 0 ? users[0] : null;
    
    if (!user) {
      console.log('⚠️ User not found, saving to pending_activations');
      
      const { error: pendingError } = await supabase
        .from('pending_activations')
        .insert({
          email: cleanEmail,
          subscription_tier: tier,
          subscription_start_date: start,
          subscription_end_date: endISO,
          payhip_sale_id: sale_id,
          payhip_data: payload,
          created_at: new Date().toISOString()
        });
      
      if (pendingError) {
        console.error('❌ Failed to save pending:', pendingError);
        return new Response(JSON.stringify({ 
          error: 'Failed to save',
          details: pendingError.message 
        }), { status: 500 });
      }
      
      console.log('✅ Saved to pending_activations');
      console.log('═══════════════════════════════════════════');
      
      return new Response(JSON.stringify({
        success: true,
        status: 'pending',
        message: 'User needs to sign up',
        tier,
        email: cleanEmail,
        next_step: `https://keto-app.pages.dev/signup?email=${encodeURIComponent(cleanEmail)}`
      }), { status: 200 });
    }
    
    console.log('✅ User found:', user.email, '(ID:', user.id, ')');
    console.log('🔄 Updating subscription...');
    
    // Update user
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
      console.log('═══════════════════════════════════════════');
      return new Response(JSON.stringify({
        error: 'Update failed',
        details: updateError.message
      }), { status: 500 });
    }
    
    console.log('✅✅✅ SUCCESS! Subscription updated ✅✅✅');
    console.log('   User:', user.email);
    console.log('   Name:', user.full_name);
    console.log('   Tier:', tier);
    console.log('   Valid until:', endISO);
    console.log('═══════════════════════════════════════════');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription activated',
      user: {
        email: user.email,
        name: user.full_name
      },
      subscription: {
        tier,
        start_date: start,
        end_date: endISO,
        duration_days: days
      }
    }), { status: 200 });
    
  } catch (error) {
    console.error('❌ WEBHOOK CRASHED:', error);
    console.log('═══════════════════════════════════════════');
    return new Response(JSON.stringify({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown'
    }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Payhip webhook endpoint is working',
    hint: 'This endpoint should be called by Payhip via POST request',
    test_url: 'Send POST request to test'
  }), { status: 200 });
};