import type { APIRoute } from 'astro';

// هذا السطر ضروري جداً لإخبار Astro و Cloudflare أن هذا الرابط ديناميكي (Server-side)
// لمنع ظهور خطأ 404 عند رفع المشروع
export const prerender = false;

/**
 * Payhip Purchase Verification API
 * وظيفتها التحقق من إيميل العميل عبر واجهة برمجة تطبيقات Payhip
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. استلام البيانات والتأكد من أنها JSON
    const body = await request.json().catch(() => null);
    
    if (!body || !body.email) {
      return new Response(JSON.stringify({ error: 'Email required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const email = body.email.toLowerCase();
    console.log('🔍 Checking Payhip purchases for:', email);
    
    // 2. جلب مفتاح API من إعدادات Cloudflare (البيئة الحية) أو من .env (التطوير المحلي)
    // @ts-ignore
    const runtime = locals?.runtime || {};
    const env = runtime?.env || {};
    
    // يحاول الجلب من إعدادات Cloudflare Pages أولاً، ثم من ملف .env المحلي ثانياً
    const PAYHIP_API_KEY = env.PAYHIP_API_KEY || import.meta.env.PAYHIP_API_KEY;
    
    if (!PAYHIP_API_KEY) {
      console.error('❌ PAYHIP_API_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error',
        hint: 'Please add PAYHIP_API_KEY in Cloudflare Pages Settings -> Functions -> Variables'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 3. الاتصال بـ Payhip لجلب قائمة المبيعات
    console.log('📡 Calling Payhip API...');
    const response = await fetch('https://payhip.com/api/v1/sales', {
      method: 'GET',
      headers: {
        'payhip-api-key': PAYHIP_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Payhip API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Payhip API connection failed',
        status: response.status 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    
    // 4. البحث عن عمليات الشراء المرتبطة بهذا البريد الإلكتروني
    const sales = data.sales || [];
    const userPurchases = sales.filter((sale: any) => 
      sale.buyer_email?.toLowerCase() === email
    );
    
    console.log(`✅ Found ${userPurchases.length} purchase(s) for ${email}`);
    
    if (userPurchases.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        canSignup: false,
        message: 'No purchase found for this email'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 5. تحليل أحدث عملية شراء لتحديد "الرتبة" (Tier) والمدة
    const latestPurchase = userPurchases[0];
    let tier = 'basic_30';
    let days = 30;
    
    const productName = (latestPurchase.product_name || '').toLowerCase();
    const variantName = (latestPurchase.variant_name || '').toLowerCase();
    const amount = parseFloat(latestPurchase.sale_price || 0);
    
    // منطق تحديد النوع بناءً على اسم المنتج أو المتغير أو السعر
    if (variantName.includes('elite') || productName.includes('elite') || amount >= 8) {
      tier = 'elite_12';
      days = 365;
    } else if (variantName.includes('pro') || productName.includes('pro') || amount >= 3) {
      tier = 'pro_6';
      days = 180;
    }
    
    // 6. حساب التواريخ
    const start = new Date().toISOString();
    const end = new Date();
    end.setDate(end.getDate() + days);
    
    // 7. إرسال النتيجة النهائية بنجاح
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
        variant_name: latestPurchase.variant_name
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Crash Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};