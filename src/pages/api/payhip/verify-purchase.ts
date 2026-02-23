import type { APIRoute } from 'astro';

// ═══════════════════════════════════════
// PAYHIP VERIFY PURCHASE
// المنتج: https://payhip.com/b/OEQk9
// الخطط: basic plan / pro plan / elite plan
// ═══════════════════════════════════════

function determineTier(sale: any): { tier: string; days: number } {
  const variant = (sale.variant_name || '').toLowerCase().trim();
  const product  = (sale.product_name  || '').toLowerCase().trim();
  const amount   = parseFloat(sale.sale_price || '0');

  // 1️⃣ من اسم الـ variant (الأدق)
  if (variant.includes('elite'))       return { tier: 'elite_12', days: 365 };
  if (variant.includes('pro'))         return { tier: 'pro_6',    days: 180 };
  if (variant.includes('basic'))       return { tier: 'basic_30', days: 30  };

  // 2️⃣ من اسم المنتج
  if (product.includes('elite'))       return { tier: 'elite_12', days: 365 };
  if (product.includes('pro'))         return { tier: 'pro_6',    days: 180 };
  if (product.includes('basic'))       return { tier: 'basic_30', days: 30  };

  // 3️⃣ من السعر (fallback)
  // elite = $199.99 / pro = $99.99 / basic = $29.99
  if (amount >= 150) return { tier: 'elite_12', days: 365 };
  if (amount >= 50)  return { tier: 'pro_6',    days: 180 };

  return { tier: 'basic_30', days: 30 };
}

// ─── POST ───────────────────────────────
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

    // قراءة API Key
    // @ts-ignore
    const env = locals?.runtime?.env || {};
    const PAYHIP_API_KEY = env.PAYHIP_API_KEY || import.meta.env.PAYHIP_API_KEY;

    if (!PAYHIP_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // استدعاء Payhip API
    const payhipRes = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: { 'payhip-api-key': PAYHIP_API_KEY },
    });

    if (!payhipRes.ok) {
      return new Response(JSON.stringify({ error: 'Payhip API error', status: payhipRes.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data  = await payhipRes.json();
    const sales = (data.data || data.sales || []) as any[];

    // فلترة بالإيميل
    const userSales = sales.filter(
      (s) => (s.buyer_email || '').toLowerCase() === email
    );

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

    // نأخذ أحدث عملية شراء
    const sale = userSales[0];
    const { tier, days } = determineTier(sale);

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

// ─── GET (اختبار سريع) ──────────────────
export const GET: APIRoute = async ({ url, locals }) => {
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({
      message: 'Payhip Verify Purchase API v3',
      usage: 'GET ?email=buyer@example.com  |  POST {"email":"..."}',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // نعيد استخدام نفس منطق POST
  const fakeRequest = new Request(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  // @ts-ignore
  return POST({ request: fakeRequest, locals, url, cookies: null, redirect: null, params: {} });
};