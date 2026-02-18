import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

/**
 * Cron Job API Endpoint - Expire Subscriptions
 * 
 * Security: Uses Bearer token authentication
 * Schedule: Should be called daily at midnight
 * 
 * Usage:
 * - External Cron Service (cron-job.org): Call this endpoint with Authorization header
 * - Manual Test: GET https://your-site.pages.dev/api/cron/expire-subscriptions
 */

export const GET: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  
  try {
    // ============================================
    // 1️⃣ SECURITY CHECK
    // ============================================
    const authHeader = request.headers.get('authorization');
    const CRON_SECRET = import.meta.env.CRON_SECRET;
    
    // Check if CRON_SECRET is configured
    if (!CRON_SECRET) {
      console.error('❌ CRON_SECRET not configured in environment variables');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'CRON_SECRET not configured',
        hint: 'Add CRON_SECRET in Cloudflare Pages Settings > Environment variables'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify authorization header
    const expectedAuth = `Bearer ${CRON_SECRET}`;
    if (authHeader !== expectedAuth) {
      console.error('❌ Unauthorized cron request. Auth header:', authHeader ? 'present but invalid' : 'missing');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Unauthorized',
        hint: 'Include header: Authorization: Bearer YOUR_CRON_SECRET'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Authorization verified');

    // ============================================
    // 2️⃣ DATABASE CHECK
    // ============================================
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database client not initialized'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Database client ready');

    // ============================================
    // 3️⃣ FIND EXPIRED SUBSCRIPTIONS
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
    // 4️⃣ NO EXPIRED SUBSCRIPTIONS
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
    // 5️⃣ UPDATE EXPIRED SUBSCRIPTIONS
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
        details: updateError.message,
        affected_users: expiredUsers.length
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ============================================
    // 6️⃣ SUCCESS RESPONSE
    // ============================================
    const executionTime = Date.now() - startTime;
    
    console.log(`✅ Successfully expired ${expiredUsers.length} subscription(s):`);
    expiredUsers.forEach((u, index) => {
      console.log(`   ${index + 1}. ${u.email} - ${u.subscription_tier} (expired: ${u.subscription_end_date})`);
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
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('❌ Cron job crashed:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
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