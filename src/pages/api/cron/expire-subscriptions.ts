import type { APIRoute } from 'astro';

/**
 * Cron Job API Endpoint - Expire Subscriptions
 * 
 * IMPORTANT: Works with Cloudflare Pages Environment Variables
 * Uses runtime.env instead of import.meta.env for Cloudflare compatibility
 */

export const GET: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();
  
  try {
    // ============================================
    // 1️⃣ SECURITY CHECK
    // ============================================
    const authHeader = request.headers.get('authorization');
    
    // Get CRON_SECRET from Cloudflare Pages runtime
    // @ts-ignore - Cloudflare Pages runtime
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    
    const CRON_SECRET = env.CRON_SECRET || import.meta.env.CRON_SECRET;
    
    if (!CRON_SECRET) {
      console.error('❌ CRON_SECRET not found in environment');
      console.log('Available env keys:', Object.keys(env));
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'CRON_SECRET not configured',
        debug: {
          hasRuntime: !!runtime,
          hasEnv: !!env,
          envKeys: Object.keys(env)
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify authorization header
    const expectedAuth = `Bearer ${CRON_SECRET}`;
    if (authHeader !== expectedAuth) {
      console.error('❌ Unauthorized. Expected:', expectedAuth.substring(0, 20) + '...');
      console.error('❌ Received:', authHeader ? authHeader.substring(0, 20) + '...' : 'none');
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Authorization verified');

    // ============================================
    // 2️⃣ GET SUPABASE CREDENTIALS
    // ============================================
    const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ Supabase credentials missing');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Supabase credentials found');

    // ============================================
    // 3️⃣ IMPORT SUPABASE CLIENT
    // ============================================
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ============================================
    // 4️⃣ FIND EXPIRED SUBSCRIPTIONS
    // ============================================
    const now = new Date().toISOString();
    console.log(`🔍 Checking for expired subscriptions at ${now}`);
    
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, full_name, subscription_tier, subscription_end_date, subscription_status')
      .eq('subscription_status', 'active')
      .lt('subscription_end_date', now);

    if (fetchError) {
      console.error('❌ Database fetch error:', fetchError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database fetch failed',
        details: fetchError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`📊 Found ${expiredUsers?.length || 0} expired subscription(s)`);

    // ============================================
    // 5️⃣ NO EXPIRED SUBSCRIPTIONS
    // ============================================
    if (!expiredUsers || expiredUsers.length === 0) {
      const executionTime = Date.now() - startTime;
      console.log(`✅ No subscriptions to expire (took ${executionTime}ms)`);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'No subscriptions to expire',
        expired_count: 0,
        execution_time_ms: executionTime,
        timestamp: now
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ============================================
    // 6️⃣ UPDATE EXPIRED SUBSCRIPTIONS
    // ============================================
    const userIds = expiredUsers.map(u => u.id);
    
    console.log('🔄 Updating subscription statuses...');
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'expired'
      })
      .in('id', userIds);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database update failed',
        details: updateError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ============================================
    // 7️⃣ SUCCESS
    // ============================================
    const executionTime = Date.now() - startTime;
    
    console.log(`✅ Successfully expired ${expiredUsers.length} subscription(s):`);
    expiredUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.email} - ${u.subscription_tier}`);
    });
    console.log(`⏱️  Execution time: ${executionTime}ms`);

    return new Response(JSON.stringify({ 
      success: true,
      message: `Successfully expired ${expiredUsers.length} subscription(s)`,
      expired_count: expiredUsers.length,
      expired_users: expiredUsers.map(u => ({
        email: u.email,
        name: u.full_name,
        tier: u.subscription_tier,
        end_date: u.subscription_end_date
      })),
      execution_time_ms: executionTime,
      timestamp: now
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('❌ Fatal error:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      execution_time_ms: executionTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Support POST for manual testing
export const POST: APIRoute = GET;