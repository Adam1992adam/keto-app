// src/pages/api/chat/history.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // آخر 30 رسالة مرتبة من الأقدم للأحدث
    const { data: messages, error: dbErr } = await supabase
      .from('chat_messages')
      .select('id, role, content, image_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(30);

    if (dbErr) {
      return new Response(JSON.stringify({ error: dbErr.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ messages: messages || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};

// DELETE — حذف تاريخ المحادثات
export const DELETE: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};