// src/pages/api/chat/gemini.ts
import type { APIRoute } from 'astro';
import { getMealCycleDays } from '../../../lib/supabase';
import { requireApiAuth } from '../../../lib/auth';
import { localDate, localDayStartISO } from '../../../lib/dates';
import { json, captureError } from '../../../lib/apiResponse';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db: supabase } = auth;
    userId = user.id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, full_name, weight_kg, target_weight_kg, height_cm, age, gender, goal, activity_level, timezone')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || profile.subscription_tier !== 'elite_12')
      return json({ error: 'Elite plan required' }, 403);

    const tz          = profile.timezone || 'UTC';
    const today       = localDate(tz);
    const now         = new Date();
    const windowStart = localDayStartISO(tz);
    const { count: msgCount } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('role', 'user')
      .gte('created_at', windowStart);
    if ((msgCount || 0) >= 20)
      return json({ error: 'Daily message limit reached (20/day). Try again tomorrow.' }, 429);

    // ── Fetch all user context in parallel ──────────────────
    const [
      journeyRes, checkinRes, recentCheckinsRes,
      weightRes, fastRes, onboardingRes,
      macroGoalsRes, mealCompRes,
    ] = await Promise.all([
      supabase.from('user_journey').select('current_day,streak_days,total_xp,level').eq('user_id', user.id).maybeSingle(),
      supabase.from('daily_checkins').select('*').eq('user_id', user.id).eq('checkin_date', today).maybeSingle(),
      supabase.from('daily_checkins').select('checkin_date,energy_level,mood_level,water_glasses,followed_meals,had_headache,had_fatigue,had_cravings,brain_fog').eq('user_id', user.id).order('checkin_date', { ascending: false }).limit(5),
      supabase.from('weight_logs').select('weight,logged_date').eq('user_id', user.id).order('logged_date', { ascending: false }).limit(8),
      supabase.from('fasting_sessions').select('started_at,ended_at,target_hours,protocol').eq('user_id', user.id).is('ended_at', null).order('started_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('onboarding_data').select('current_weight,target_weight,dietary_restrictions,fasting_protocol,goal').eq('user_id', user.id).maybeSingle(),
      supabase.from('macro_goals').select('daily_calories,protein_g,fat_g,carbs_g').eq('user_id', user.id).maybeSingle(),
      supabase.from('meal_completions').select('meal_type,recipe_id').eq('user_id', user.id).eq('day_number', (await supabase.from('user_journey').select('current_day').eq('user_id', user.id).maybeSingle()).data?.current_day || 1),
    ]);

    const journey      = journeyRes.data;
    const currentDay   = journey?.current_day || 1;
    const cycledDay    = ((currentDay - 1) % getMealCycleDays(profile.subscription_tier)) + 1;
    const todayCheckin = checkinRes.data;
    const recentCheckins = recentCheckinsRes.data || [];
    const weightLogs   = weightRes.data || [];
    const activeFast   = fastRes.data;
    const onboarding   = onboardingRes.data;
    const macroGoals   = macroGoalsRes.data;
    const mealComps    = mealCompRes.data || [];

    // ── Today's tasks ────────────────────────────────────────
    const { data: todayTasks } = await supabase
      .from('daily_tasks')
      .select('task_title, completed')
      .eq('user_id', user.id)
      .eq('day_number', currentDay);

    // ── Today's meal plan with recipes ───────────────────────
    const planType = profile.subscription_tier;
    const { data: mealPlanDirect } = await supabase
      .from('meal_plans')
      .select('meal_type, recipe:recipes(id,title,calories,protein,fat,net_carbs,tags)')
      .eq('plan_type', planType)
      .eq('day_number', cycledDay)
      .order('meal_type');

    const { data: mealPlanFallback } = mealPlanDirect?.length ? { data: null } : await supabase
      .from('meal_plans')
      .select('meal_type, recipe:recipes(id,title,calories,protein,fat,net_carbs,tags)')
      .eq('plan_type', 'basic_30')
      .eq('day_number', cycledDay)
      .order('meal_type');

    const mealPlan = (mealPlanDirect?.length ? mealPlanDirect : mealPlanFallback) || [];

    // ── Derived values ───────────────────────────────────────
    const userName   = profile.full_name?.split(' ')[0] || 'Friend';
    const startW     = onboarding?.current_weight || profile.weight_kg || 0;
    const goalW      = onboarding?.target_weight  || profile.target_weight_kg || 0;
    const latestW    = weightLogs[0]?.weight || startW;
    const lost       = Math.max(0, startW - latestW);
    const toGoal     = Math.max(0.1, startW - goalW);
    const goalPct    = Math.min(100, Math.round((lost / toGoal) * 100));
    const weekNum    = Math.ceil(currentDay / 7);
    const restrictions = onboarding?.dietary_restrictions || [];

    const fastHours = activeFast
      ? (now.getTime() - new Date(activeFast.started_at).getTime()) / 3600000
      : 0;

    const eatenSet = new Set(mealComps.map((c: any) => c.meal_type));
    const completedTasks = (todayTasks || []).filter((t: any) => t.completed);
    const pendingTasks   = (todayTasks || []).filter((t: any) => !t.completed);

    // Macros consumed from eaten meals
    const consumed = mealPlan
      .filter((m: any) => eatenSet.has(m.meal_type) && m.recipe)
      .reduce((acc: any, m: any) => {
        const r = m.recipe as any;
        return {
          cal:   acc.cal   + (r.calories   || 0),
          prot:  acc.prot  + parseFloat(r.protein  || 0),
          fat:   acc.fat   + parseFloat(r.fat       || 0),
          carbs: acc.carbs + parseFloat(r.net_carbs || 0),
        };
      }, { cal: 0, prot: 0, fat: 0, carbs: 0 });

    // Format sections for system prompt
    const mealPlanText = mealPlan.length
      ? mealPlan.map((m: any) => {
          const r  = m.recipe as any;
          const ok = eatenSet.has(m.meal_type) ? '✓' : '○';
          return `  ${ok} ${m.meal_type}: ${r?.title || '?'} — ${r?.calories || '?'}cal | ${r?.protein || '?'}g P | ${r?.fat || '?'}g F | ${r?.net_carbs || '?'}g C`;
        }).join('\n')
      : '  No meal plan loaded';

    const checkinText = recentCheckins.length
      ? recentCheckins.slice(0, 4).map((c: any) =>
          `  ${c.checkin_date}: Energy ${c.energy_level}/5 · Mood ${c.mood_level}/5 · Water ${c.water_glasses}gl · Meals ${c.followed_meals ? '✓' : '✗'}${c.had_headache ? ' · headache' : ''}${c.had_fatigue ? ' · fatigue' : ''}${c.had_cravings ? ' · cravings' : ''}`
        ).join('\n')
      : '  No check-in history';

    const toL = (kg: number) => Math.round(kg * 2.20462 * 10) / 10;
    const weightText = weightLogs.length
      ? weightLogs.slice(0, 5).map((w: any) =>
          `  ${w.logged_date}: ${toL(w.weight)} lbs`
        ).join('\n') + (weightLogs.length >= 2
          ? `\n  Trend: ${toL(Math.abs(weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight))} lbs over last ${weightLogs.length} logs`
          : '')
      : '  No weight logs yet';

    // ── Build system prompt ──────────────────────────────────
    const systemPrompt = `You are Keto AI Coach — an elite, hyper-personalized keto nutrition and lifestyle assistant inside the Keto Journey app. You have complete access to ${userName}'s health data and journey progress.

## ${userName}'s Profile
- Age: ${profile.age || '?'} | Gender: ${profile.gender || '?'} | Height: ${profile.height_cm ? (() => { const i = profile.height_cm / 2.54; return `${Math.floor(i/12)}'${Math.round(i%12)}"` })() : '?'}
- Start weight: ${toL(startW)} lbs → Current: ${toL(latestW)} lbs → Goal: ${toL(goalW)} lbs
- Weight lost: ${toL(lost).toFixed(1)} lbs (${goalPct}% to goal)
- Activity level: ${profile.activity_level || 'moderate'} | Primary goal: ${profile.goal || 'lose weight'}
- Dietary restrictions: ${restrictions.length ? restrictions.join(', ') : 'none'}
- Fasting protocol: ${onboarding?.fasting_protocol || 'not specified'}
- Plan: Elite 360-day (Day ${currentDay}, Week ${weekNum})

## Journey Status
- Streak: ${journey?.streak_days || 0} days | Level ${journey?.level || 1} | ${journey?.total_xp || 0} XP
- Tasks today: ${completedTasks.length}/${(todayTasks || []).length} done${pendingTasks.length > 0 ? ` (pending: ${pendingTasks.slice(0, 3).map((t: any) => t.task_title).join(', ')})` : ' — all complete!'}

## Today — ${today}
- Check-in: ${todayCheckin
    ? `Done ✓ — Energy ${(todayCheckin as any).energy_level}/5, Mood ${(todayCheckin as any).mood_level}/5, Water ${(todayCheckin as any).water_glasses || 0}/8 glasses${[(todayCheckin as any).had_headache && 'headache', (todayCheckin as any).had_fatigue && 'fatigue', (todayCheckin as any).had_cravings && 'cravings', (todayCheckin as any).brain_fog && 'brain fog'].filter(Boolean).length ? `, symptoms: ${[(todayCheckin as any).had_headache && 'headache', (todayCheckin as any).had_fatigue && 'fatigue', (todayCheckin as any).had_cravings && 'cravings', (todayCheckin as any).brain_fog && 'brain fog'].filter(Boolean).join(', ')}` : ''}`
    : 'Not done yet ✗'}
- Fasting: ${activeFast ? `Active ${Math.floor(fastHours)}h ${Math.round((fastHours % 1) * 60)}min (target: ${activeFast.target_hours || 16}h)` : 'Not fasting'}
- Macro goals: ${macroGoals?.daily_calories || '?'} cal | ${macroGoals?.protein_g || '?'}g protein | ${macroGoals?.fat_g || '?'}g fat | ${macroGoals?.carbs_g || '?'}g carbs
- Consumed so far: ${Math.round(consumed.cal)}cal | ${Math.round(consumed.prot)}g P | ${Math.round(consumed.fat)}g F | ${Math.round(consumed.carbs)}g C

## Today's Meal Plan (Day ${cycledDay} rotation)
${mealPlanText}

## Check-in History (recent trend)
${checkinText}

## Weight Log
${weightText}

## How You Help
- **Food photos**: Identify the food, estimate macros (cal/protein/fat/carbs), rate keto-friendliness (🥑🥑🥑🥑🥑 out of 5), say if it fits today's macro budget
- **Fridge/pantry photos**: Suggest 2-3 keto recipes using visible ingredients, respect dietary restrictions
- **Recipe requests**: Full recipe — ingredients with exact amounts, numbered steps, macros per serving
- **Progress questions**: Reference actual weight logs, check-in trends, streak, XP
- **Symptom questions**: Cross-reference check-in data, give specific keto-flu remedies with electrolyte amounts
- **Meal substitutions**: Respect restrictions (${restrictions.join(', ') || 'none'}), match macros closely
- **Fasting support**: Use actual fasting time, give protocol-specific tips

## Response Style
- Use ${userName}'s actual numbers — never be vague
- Format with **markdown**: bold key data, bullet lists for ingredients/steps, numbered steps for instructions
- Keep conversational replies to 2-4 sentences; recipes and analyses can be longer
- Use ${userName}'s name occasionally to feel personal
- Be encouraging but honest — if something isn't keto-friendly, say so clearly
- Respond in the same language the user writes in`;

    // ── Read request body ────────────────────────────────────
    const body = await request.json();
    const { message, imageBase64, imageType } = body;

    if (!message && !imageBase64)
      return json({ error: 'Message or image required' }, 400);

    // ── API key check — graceful fallback if not configured ──
    const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      await supabase.from('chat_messages').insert({
        user_id:   user.id,
        role:      'user',
        content:   message || '📸 Image sent',
        image_url: imageBase64 ? 'image_attached' : null,
      });
      const fallback = `I'm not fully connected right now, but here's what I know for you: **Stay strict with your macros** — under 20g net carbs, fat as your primary fuel, adequate protein. If you're feeling low energy, add electrolytes (sodium, magnesium, potassium). Drink at least 3L of water daily. Stay consistent — keto results compound with time. Ask me again in a moment and I'll have a more personalised answer for you!`;
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role:    'assistant',
        content: fallback,
      });
      return json({ reply: fallback });
    }

    // ── Chat history (last 14 messages for context) ──────────
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(14);

    const chatHistory = (history || []).reverse();

    // Save user message
    await supabase.from('chat_messages').insert({
      user_id:   user.id,
      role:      'user',
      content:   message || '📸 Image sent',
      image_url: imageBase64 ? 'image_attached' : null,
    });

    // ── Build OpenRouter request (OpenAI-compatible format) ──
    const messages: any[] = [{ role: 'system', content: systemPrompt }];

    for (const msg of chatHistory) {
      if (msg.content) {
        messages.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
      }
    }

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${imageType || 'image/jpeg'};base64,${imageBase64}` } },
          { type: 'text', text: message || 'Please analyze this image.' },
        ],
      });
    } else {
      messages.push({ role: 'user', content: message });
    }

    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer':  'https://ketojourney.fun',
        'X-Title':       'Keto Journey',
      },
      body: JSON.stringify({
        model:       'tencent/hy3-preview:free',
        messages,
        max_tokens:  4000,
        temperature: 0.8,
      }),
    });

    if (!orRes.ok) {
      const errText = await orRes.text();
      console.error('[chat/gemini] user:', userId, 'OpenRouter error:', errText);
      return json({ error: 'AI service temporarily unavailable. Please try again.' }, 500);
    }

    const orData = await orRes.json();
    const choice = orData?.choices?.[0];
    const reply = choice?.message?.content;

    if (!reply) {
      // Thinking model ran out of tokens before producing content
      if (choice?.finish_reason === 'length') {
        return json({ error: 'Your question needed a very long answer. Try asking something more specific.' }, 500);
      }
      console.error('[chat/gemini] user:', userId, 'null content, finish_reason:', choice?.finish_reason, 'raw:', JSON.stringify(orData).slice(0, 300));
      return json({ error: 'No response from AI. Please try again.' }, 500);
    }

    // Save AI reply
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role:    'assistant',
      content: reply,
    });

    return json({ reply });

  } catch (err: any) {
    await captureError('chat/gemini', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

