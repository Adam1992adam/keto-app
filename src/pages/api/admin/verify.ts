import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { password } = await request.json();

    // Get admin password from environment
    const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'admin123';

    // Verify password
    if (password === ADMIN_PASSWORD) {
      // Set admin session cookie (expires in 24 hours)
      cookies.set('admin-session', 'verified', {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: import.meta.env.PROD,
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