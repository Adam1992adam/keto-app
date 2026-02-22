import type { APIRoute } from 'astro';

/**
 * Payhip Purchase Verification API
 * Checks if user has purchased using Payhip API
 * Called when user tries to signup
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 });
    }
    
    console.log('🔍 Checking Payhip purchases for:', email);
    
    // Get Payhip API Key
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const PAYHIP_API_KEY = env.PAYHIP_API_KEY || import.meta.env.PAYHIP_API_KEY;
    
    if (!PAYHIP_API_KEY) {
      console.error('❌ PAYHIP_API_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error',
        hint: 'Add PAYHIP_API_KEY in Cloudflare Pages Settings'
      }), { status: 500 });
    }
    
    // Call Payhip API to get sales
    console.log('📡 Calling Payhip API...');
    
    const response = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: {
        'payhip-api-key': PAYHIP_API_KEY
      }
    });
    
    if (!response.ok) {
      console.error('❌ Payhip API error:', response.status);
      return new Response(JSON.stringify({ 
        error: 'Payhip API error',
        status: response.status 
      }), { status: 500 });
    }
    
    const data = await response.json();
    console.log('📦 Payhip response:', JSON.stringify(data, null, 2));
    
    // Find purchases for this email
    const sales = data.sales || [];
    const userPurchases = sales.filter((sale: any) => 
      sale.buyer_email?.toLowerCase() === email.toLowerCase()
    );
    
    console.log(`✅ Found ${userPurchases.length} purchase(s) for ${email}`);
    
    if (userPurchases.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No purchase found for this email',
        canSignup: false
      }), { status: 200 });
    }
    
    // Get the most recent purchase
    const latestPurchase = userPurchases[0];
    
    console.log('📋 Latest purchase:', JSON.stringify(latestPurchase, null, 2));
    
    // Determine tier from product/variant
    let tier = 'basic_30';
    let days = 30;
    
    const productName = (latestPurchase.product_name || '').toLowerCase();
    const variantName = (latestPurchase.variant_name || '').toLowerCase();
    const amount = parseFloat(latestPurchase.sale_price || 0);
    
    console.log('🔍 Detection:');
    console.log('  Product:', productName);
    console.log('  Variant:', variantName);
    console.log('  Amount:', amount);
    
    // Detect tier
    if (variantName.includes('elite') || productName.includes('elite')) {
      tier = 'elite_12';
      days = 365;
    } else if (variantName.includes('pro') || productName.includes('pro')) {
      tier = 'pro_6';
      days = 180;
    } else if (variantName.includes('basic') || productName.includes('basic')) {
      tier = 'basic_30';
      days = 30;
    } else if (amount >= 8) {
      tier = 'elite_12';
      days = 365;
    } else if (amount >= 3) {
      tier = 'pro_6';
      days = 180;
    }
    
    console.log(`🎯 Determined: ${tier} (${days} days)`);
    
    // Calculate dates
    const start = new Date().toISOString();
    const end = new Date();
    end.setDate(end.getDate() + days);
    
    return new Response(JSON.stringify({
      success: true,
      canSignup: true,
      purchase: {
        email: latestPurchase.buyer_email,
        tier,
        days,
        start_date: start,
        end_date: end.toISOString(),
        sale_id: latestPurchase.sale_id,
        product_name: latestPurchase.product_name,
        variant_name: latestPurchase.variant_name,
        amount: latestPurchase.sale_price
      }
    }), { status: 200 });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};