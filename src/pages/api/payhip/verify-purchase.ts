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
    
    console.log('🔍 POST - Verifying:', email);
    
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const PAYHIP_API_KEY = env.PAYHIP_API_KEY || import.meta.env.PAYHIP_API_KEY;
    
    if (!PAYHIP_API_KEY) {
      console.error('❌ No API Key');
      return new Response(JSON.stringify({ 
        error: 'API Key not configured'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('📡 Calling Payhip API...');
    
    const payhipResponse = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: { 'payhip-api-key': PAYHIP_API_KEY }
    });
    
    if (!payhipResponse.ok) {
      console.error('❌ Payhip error:', payhipResponse.status);
      return new Response(JSON.stringify({ 
        error: 'Payhip API error',
        status: payhipResponse.status 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await payhipResponse.json();
    const sales = data.sales || [];
    const userSales = sales.filter((s: any) => 
      s.buyer_email?.toLowerCase() === email.toLowerCase()
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
    
    const sale = userSales[0];
    let tier = 'basic_30';
    let days = 30;
    
    const variant = (sale.variant_name || '').toLowerCase();
    const product = (sale.product_name || '').toLowerCase();
    const amount = parseFloat(sale.sale_price || 0);
    
    console.log('🔍 Variant:', variant);
    console.log('🔍 Product:', product);
    console.log('💰 Amount:', amount);
    
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
    
    console.log(`🎯 Final: ${tier}`);
    
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
      error: error instanceof Error ? error.message : 'Unknown'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  const email = url.searchParams.get('email');
  
  if (!email) {
    return new Response(JSON.stringify({
      message: 'Payhip Verification API v2.0',
      status: 'ready',
      test_url: 'Add ?email=YOUR_EMAIL to test',
      post_body: '{"email":"user@example.com"}'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  console.log('🔍 GET - Verifying:', email);
  
  try {
    // @ts-ignore
    const runtime = locals?.runtime || {};
    // @ts-ignore
    const env = runtime?.env || {};
    const PAYHIP_API_KEY = env.PAYHIP_API_KEY || import.meta.env.PAYHIP_API_KEY;
    
    if (!PAYHIP_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'API Key not configured'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const payhipResponse = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: { 'payhip-api-key': PAYHIP_API_KEY }
    });
    
    if (!payhipResponse.ok) {
      return new Response(JSON.stringify({ 
        error: 'Payhip API error'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await payhipResponse.json();
    const sales = data.sales || [];
    const userSales = sales.filter((s: any) => 
      s.buyer_email?.toLowerCase() === email.toLowerCase()
    );
    
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
    
    const sale = userSales[0];
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
    }
    
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
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};