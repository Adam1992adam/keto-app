// src/pages/api/chat/gemini.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, full_name, weight_kg, target_weight_kg, height_cm, age, gender, goal, activity_level')
      .eq('id', user.id)
      .single();

    if (!profile || profile.subscription_tier !== 'elite_12') {
      return new Response(JSON.stringify({ error: 'Elite plan required' }), { status: 403 });
    }

    const { data: journey } = await supabase
      .from('user_journeys')
      .select('current_day, streak_days, total_xp, level')
      .eq('user_id', user.id)
      .single();

    const { data: todayTasks } = await supabase
      .from('daily_tasks')
      .select('task_type, task_title, completed')
      .eq('user_id', user.id)
      .eq('day_number', journey?.current_day || 1);

    const { data: waterToday } = await supabase
      .from('water_intake')
      .select('glasses_count')
      .eq('user_id', user.id)
      .eq('day_number', journey?.current_day || 1)
      .single();

    const { data: recentWeight } = await supabase
      .from('weight_logs')
      .select('weight_kg, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    const body = await request.json();
    const { message, imageBase64, imageType } = body;

    if (!message && !imageBase64) {
      return new Response(JSON.stringify({ error: 'Message or image required' }), { status: 400 });
    }

    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const chatHistory = (history || []).reverse();

    await supabase.from('chat_messages').insert({
      user_id:   user.id,
      role:      'user',
      content:   message || '📸 Sent an image',
      image_url: imageBase64 ? 'image_attached' : null,
    });

    const completedTasks = todayTasks?.filter((t: any) => t.completed) || [];
    const pendingTasks   = todayTasks?.filter((t: any) => !t.completed) || [];

    const systemPrompt = `You are Keto AI Coach — a personal, friendly, and knowledgeable keto diet assistant.

## User Profile
- Name: ${profile.full_name?.split(' ')[0] || 'Friend'}
- Age: ${profile.age || 'unknown'} | Gender: ${profile.gender || 'unknown'}
- Current weight: ${recentWeight?.weight_kg || profile.weight_kg || 'unknown'} kg
- Target weight: ${profile.target_weight_kg || 'unknown'} kg
- Height: ${profile.height_cm || 'unknown'} cm
- Goal: ${profile.goal || 'lose_weight'}
- Activity level: ${profile.activity_level || 'moderate'}

## Today's Journey (Day ${journey?.current_day || 1}/30)
- Streak: ${journey?.streak_days || 0} days
- XP: ${journey?.total_xp || 0} | Level: ${journey?.level || 1}
- Water today: ${waterToday?.glasses_count || 0}/8 glasses
- Completed tasks: ${completedTasks.map((t: any) => t.task_title).join(', ') || 'none yet'}
- Pending tasks: ${pendingTasks.map((t: any) => t.task_title).join(', ') || 'all done!'}

## Instructions
- Give personalized keto advice based on this exact user data
- When you see a food image: identify it, check if keto-friendly, estimate macros (calories, protein, fat, carbs)
- When you see fridge/ingredient images: suggest a keto recipe using those ingredients
- Be encouraging, specific, and concise (3-5 sentences max unless asked for a recipe)
- Occasionally mention the user's name to feel personal
- Always respond in English only
- For recipes: include ingredients, steps, and macros estimate`;

    const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    const contents: any[] = [];

    for (const msg of chatHistory) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    const currentParts: any[] = [];
    if (imageBase64) {
      currentParts.push({
        inline_data: {
          mime_type: imageType || 'image/jpeg',
          data: imageBase64,
        },
      });
    }
    currentParts.push({ text: message || 'Please analyze this image and suggest a keto recipe.' });
    contents.push({ role: 'user', parts: currentParts });

    // Use v1beta which supports system_instruction
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.75,
            topP: 0.9,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', errText);
      return new Response(JSON.stringify({ error: 'Gemini API error' }), { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return new Response(JSON.stringify({ error: 'No response from Gemini' }), { status: 500 });
    }

    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role:    'assistant',
      content: reply,
    });

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Chat endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};