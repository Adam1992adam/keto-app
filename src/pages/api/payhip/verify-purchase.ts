import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(JSON.stringify({ 
        error: 'Email required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('🔍 Verifying purchase for:', email);
    
    // Get Payhip API Key
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const PAYHIP_API_KEY = env.PAYHIP_API_KEY || import.meta.env.PAYHIP_API_KEY;
    
    if (!PAYHIP_API_KEY) {
      console.error('❌ PAYHIP_API_KEY not found');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error',
        hint: 'Add PAYHIP_API_KEY in environment variables'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ API Key found');
    console.log('📡 Calling Payhip API...');
    
    // Call Payhip API
    const payhipResponse = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: {
        'payhip-api-key': PAYHIP_API_KEY
      }
    });
    
    if (!payhipResponse.ok) {
      console.error('❌ Payhip API error:', payhipResponse.status);
      return new Response(JSON.stringify({ 
        error: 'Payhip API error',
        status: payhipResponse.status 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const payhipData = await payhipResponse.json();
    console.log('✅ Payhip response received');
    
    // Find purchases for this email
    const sales = payhipData.sales || [];
    const userSales = sales.filter((sale: any) => 
      sale.buyer_email?.toLowerCase() === email.toLowerCase()
    );
    
    console.log(`📊 Found ${userSales.length} purchase(s)`);
    
    if (userSales.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        message: 'No purchase found'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get latest purchase
    const sale = userSales[0];
    
    console.log('📦 Sale:', sale.sale_id);
    console.log('   Product:', sale.product_name);
    console.log('   Variant:', sale.variant_name);
    console.log('   Amount:', sale.sale_price);
    
    // Determine tier
    let tier = 'basic_30';
    let days = 30;
    
    const variant = (sale.variant_name || '').toLowerCase();
    const product = (sale.product_name || '').toLowerCase();
    const amount = parseFloat(sale.sale_price || 0);
    
    if (variant.includes('elite') || product.includes('elite')) {
      tier = 'elite_12';
      days = 365;
    } else if (variant.includes('pro') || product.includes('pro')) {
      tier = 'pro_6';
      days = 180;
    } else if (variant.includes('basic') || product.includes('basic')) {
      tier = 'basic_30';
      days = 30;
    } else if (amount >= 8) {
      tier = 'elite_12';
      days = 365;
    } else if (amount >= 3) {
      tier = 'pro_6';
      days = 180;
    }
    
    console.log(`🎯 Tier: ${tier} (${days} days)`);
    
    // Calculate dates
    const start = new Date().toISOString();
    const end = new Date();
    end.setDate(end.getDate() + days);
    
    return new Response(JSON.stringify({
      success: true,
      canSignup: true,
      purchase: {
        email: sale.buyer_email,
        tier,
        days,
        start_date: start,
        end_date: end.toISOString(),
        sale_id: sale.sale_id,
        product_name: sale.product_name,
        variant_name: sale.variant_name,
        amount: sale.sale_price
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Payhip verification endpoint',
    status: 'ready',
    method: 'POST',
    body: '{"email":"user@example.com"}'
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};