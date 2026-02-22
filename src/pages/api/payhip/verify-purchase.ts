import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Endpoint works!',
      email
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Test error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Verify purchase endpoint',
    status: 'ready'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};