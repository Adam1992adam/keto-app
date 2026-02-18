import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const { password } = await request.json();

    // 1. جلب كلمة المرور من بيئة تشغيل كلوفلار (Cloudflare Runtime)
    // @ts-ignore
    const runtimeEnv = locals.runtime?.env;
    
    // يحاول الجلب من كلوفلار أولاً، وإذا فشل (في الجهاز المحلي مثلاً) يستخدم import.meta.env
    const ADMIN_PASSWORD = runtimeEnv?.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || 'admin123';

    // 2. التحقق من كلمة المرور
    if (password === ADMIN_PASSWORD) {
      // تعيين الكوكي (Expires in 24 hours)
      cookies.set('admin-session', 'verified', {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 ساعة
        httpOnly: true,
        // تأكد أن الكوكي آمن في بيئة الإنتاج
        secure: true, 
        sameSite: 'lax'
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Access granted'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};