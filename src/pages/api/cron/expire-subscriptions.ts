import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

/**
 * Cron Job API Endpoint
 * Called daily by Cloudflare Worker to expire subscriptions
 */

export const GET: APIRoute = async ({ request }) => {
  try {
    // Security: Verify CRON_SECRET
    const authHeader = request.headers.get('authorization');
    const CRON_SECRET = import.meta.env.CRON_SECRET;
    
    if (!CRON_SECRET) {
      console.error('CRON_SECRET not configured');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Server configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify authorization
    const expectedAuth = `Bearer ${CRON_SECRET}`;
    if (authHeader !== expectedAuth) {
      console.error('Unauthorized cron request');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const now = new Date().toISOString();
    
    // Find all active subscriptions that have expired
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, full_name, subscription_tier, subscription_end_date')
      .eq('subscription_status', 'active')
      .lt('subscription_end_date', now);

    if (fetchError) {
      console.error('Error fetching expired subscriptions:', fetchError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database fetch error',
        details: fetchError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If no expired subscriptions, return success
    if (!expiredUsers || expiredUsers.length === 0) {
      console.log('✅ No subscriptions to expire');
      return new Response(JSON.stringify({ 
        success: true,
        message: 'No subscriptions to expire',
        expired_count: 0,
        timestamp: now
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update all expired subscriptions
    const userIds = expiredUsers.map(u => u.id);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'expired'
      })
      .in('id', userIds);

    if (updateError) {
      console.error('Error updating expired subscriptions:', updateError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database update error',
        details: updateError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Success! Log the results
    console.log(`✅ Successfully expired ${expiredUsers.length} subscription(s):`);
    expiredUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.subscription_tier})`);
    });

    // Return success response
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
      timestamp: now
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Cron job error:', error);
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

// Support POST method for manual testing
export const POST: APIRoute = GET;