import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;

    const body = await request.json();

    // Update avatar
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_url: body.avatar,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Avatar update error:', error);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Avatar update error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};