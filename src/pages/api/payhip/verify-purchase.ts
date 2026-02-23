import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// PAYHIP VERIFY PURCHASE v4
// ═══════════════════════════════════════

function determineTier(sale: any): { tier: string; days: number } {
  const variant = (sale.variant_name || '').toLowerCase().trim();
  const product  = (sale.product_name  || '').toLowerCase().trim();
  const amount   = parseFloat(sale.sale_price || '0');

  if (variant.includes('elite'))  return { tier: 'elite_12', days: 365 };
  if (variant.includes('pro'))    return { tier: 'pro_6',    days: 180 };
  if (variant.includes('basic'))  return { tier: 'basic_30', days: 30  };
  if (product.includes('elite'))  return { tier: 'elite_12', days: 365 };
  if (product.includes('pro'))    return { tier: 'pro_6',    days: 180 };
  if (product.includes('basic'))  return { tier: 'basic_30', days: 30  };
  if (amount >= 150) return { tier: 'elite_12', days: 365 };
  if (amount >= 50)  return { tier: 'pro_6',    days: 180 };
  return { tier: 'basic_30', days: 30 };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const PAYHIP_API_KEY =
      env.PAYHIP_API_KEY ||
      import.meta.env.PAYHIP_API_KEY;

    if (!PAYHIP_API_KEY) {
      console.error('PAYHIP_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Calling Payhip API...');

    const payhipRes = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: {
        'payhip-api-key': PAYHIP_API_KEY,
        'Accept': 'application/json',
      },
    });

    // تحقق أن الـ response هو JSON وليس HTML
    const contentType = payhipRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const rawText = await payhipRes.text();
      console.error('Payhip non-JSON response:', payhipRes.status, rawText.substring(0, 300));
      
      let hint = 'Payhip API error';
      if (payhipRes.status === 401) hint = 'Invalid API Key — check PAYHIP_API_KEY';
      if (payhipRes.status === 403) hint = 'API Key has no permission';
      if (payhipRes.status === 404) hint = 'Payhip API endpoint not found';

      return new Response(JSON.stringify({
        error: hint,
        http_status: payhipRes.status,
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!payhipRes.ok) {
      const errData = await payhipRes.json();
      return new Response(JSON.stringify({
        error: 'Payhip API error',
        status: payhipRes.status,
        details: errData,
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data  = await payhipRes.json();
    console.log('Payhip response keys:', Object.keys(data));

    const sales = (data.data || data.sales || []) as any[];
    console.log('Total sales from Payhip:', sales.length);

    const userSales = sales.filter(
      (s: any) => (s.buyer_email || '').toLowerCase() === email
    );

    console.log(`Sales for ${email}:`, userSales.length);

    if (userSales.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        message: 'No purchase found for this email',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sale = userSales[0];
    console.log('Sale found:', {
      variant: sale.variant_name,
      product: sale.product_name,
      amount:  sale.sale_price,
    });

    const { tier, days } = determineTier(sale);
    console.log('Tier:', tier, '| Days:', days);

    const startDate = new Date();
    const endDate   = new Date();
    endDate.setDate(endDate.getDate() + days);

    return new Response(JSON.stringify({
      success: true,
      canSignup: true,
      purchase: {
        email:        sale.buyer_email,
        tier,
        days,
        start_date:   startDate.toISOString(),
        end_date:     endDate.toISOString(),
        sale_id:      sale.sale_id,
        product_name: sale.product_name,
        variant_name: sale.variant_name,
        amount:       sale.sale_price,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('verify-purchase error:', err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  return new Response(JSON.stringify({
    message: 'Payhip Verify Purchase API v4',
    usage: 'POST {"email":"buyer@example.com"}',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};