import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email, password, fullName, tier, startDate, endDate, saleId } = await request.json();
    
    if (!email || !password || !fullName || !tier) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    
    console.log('🆕 Creating account via Payhip API verification');
    console.log('   Email:', email);
    console.log('   Tier:', tier);
    
    // Get Supabase
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
    }
    
    if (!authData.user) {
      return new Response(JSON.stringify({ error: 'Failed to create account' }), { status: 500 });
    }
    
    console.log('✅ Auth account created:', authData.user.id);
    
    // Update profile with subscription
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        subscription_tier: tier,
        subscription_status: 'active',
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        payhip_sale_id: saleId,
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);
    
    if (updateError) {
      console.error('❌ Profile update error:', updateError);
    } else {
      console.log('✅ Profile updated with subscription');
    }
    
    console.log('✅✅✅ Account creation complete!');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Account created successfully'
    }), { status: 200 });
    
  } catch (error) {
    console.error('❌ Signup error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};