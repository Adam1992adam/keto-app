// src/pages/api/food/analyze-photo.ts
// POST /api/food/analyze-photo
// Accepts: { imageBase64, imageType, saveTo?, mealType?, date? }
// Returns: { food_name, serving_size, calories, protein_g, fat_g, carbs_g,
//            fiber_g, net_carbs_g, sugar_g, keto_verdict, confidence, notes,
//            ingredients }
import type { APIRoute } from 'astro';
import { requireApiAuth } from '../../../lib/auth';
import { json, captureError } from '../../../lib/apiResponse';
import { localDate } from '../../../lib/dates';

export const POST: APIRoute = async ({ request, cookies }) => {
  let userId = 'unknown';
  try {
    const auth = await requireApiAuth(cookies);
    if (!auth.ok) return auth.response;
    const { user, db } = auth;
    userId = user.id;

    const body = await request.json();
    const { imageBase64, imageType = 'image/jpeg', saveTo, mealType = 'other', date } = body;

    if (!imageBase64) return json({ error: 'Image required' }, 400);

    const { data: profileTz } = await db.from('profiles').select('timezone').eq('id', user.id).maybeSingle();
    const tz = profileTz?.timezone || 'UTC';

    const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) return json({ error: 'AI service not configured' }, 503);

    const prompt = `You are a nutritionist AI. Analyze this food photo and return ONLY a valid JSON object — no markdown, no explanation, just the raw JSON.

Estimate the nutritional content for the portion shown in the photo.

Required JSON format:
{
  "food_name": "descriptive name of the dish or food",
  "serving_size": "estimated portion (e.g. '1 plate ~350g', '2 slices ~120g')",
  "calories": <number>,
  "protein_g": <number>,
  "fat_g": <number>,
  "carbs_g": <number>,
  "fiber_g": <number>,
  "net_carbs_g": <number>,
  "sugar_g": <number>,
  "keto_verdict": "keto_friendly" | "caution" | "not_keto",
  "confidence": "low" | "medium" | "high",
  "notes": "brief keto-relevant note (e.g. hidden carbs, suitable substitutions)",
  "ingredients": ["main", "visible", "ingredients"]
}

Rules:
- keto_friendly = net_carbs_g <= 5
- caution = net_carbs_g > 5 and <= 15
- not_keto = net_carbs_g > 15
- All numbers must be integers or one decimal place
- If you cannot identify the food at all, use your best estimate and set confidence to "low"
- Return only the JSON object, nothing else`;

    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer':  'https://ketojourney.fun',
        'X-Title':       'Keto Journey',
      },
      body: JSON.stringify({
        model: 'tencent/hy3-preview:free',
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${imageType};base64,${imageBase64}` } },
            { type: 'text', text: prompt },
          ],
        }],
        max_tokens:  2000,
        temperature: 0.2,
      }),
    });

    if (!orRes.ok) {
      const err = await orRes.text();
      console.error('[food/analyze-photo] user:', userId, 'OpenRouter error:', err);
      return json({ error: 'AI analysis failed. Please try again.' }, 502);
    }

    const orData = await orRes.json();
    const rawText = orData?.choices?.[0]?.message?.content || orData?.choices?.[0]?.message?.reasoning || '';

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    let nutrition: any;
    try {
      nutrition = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON from within text
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try { nutrition = JSON.parse(match[0]); }
        catch { return json({ error: 'Could not parse AI response. Try a clearer photo.' }, 422); }
      } else {
        return json({ error: 'Could not parse AI response. Try a clearer photo.' }, 422);
      }
    }

    // Clamp helper — same bounds as food-log/add.ts (cal≤9999, macros≤500g)
    const clampCal   = (v: number) => Math.min(Math.max(Math.round(v),  0), 9999);
    const clampMacro = (v: number) => Math.min(Math.max(Math.round(v * 10) / 10, 0),  500);

    const n = {
      food_name:    String(nutrition.food_name    || 'Unknown Food').slice(0, 200),
      serving_size: String(nutrition.serving_size || '1 serving').slice(0, 100),
      calories:     clampCal(Number(nutrition.calories    || 0)),
      protein_g:    clampMacro(Number(nutrition.protein_g || 0)),
      fat_g:        clampMacro(Number(nutrition.fat_g     || 0)),
      carbs_g:      clampMacro(Number(nutrition.carbs_g   || 0)),
      fiber_g:      clampMacro(Number(nutrition.fiber_g   || 0)),
      net_carbs_g:  clampMacro(Number(nutrition.net_carbs_g || 0)),
      sugar_g:      clampMacro(Number(nutrition.sugar_g   || 0)),
      keto_verdict: ['keto_friendly','caution','not_keto'].includes(nutrition.keto_verdict)
        ? nutrition.keto_verdict : 'caution',
      confidence:   ['low','medium','high'].includes(nutrition.confidence)
        ? nutrition.confidence : 'medium',
      notes:        String(nutrition.notes || '').slice(0, 500),
      ingredients:  Array.isArray(nutrition.ingredients) ? nutrition.ingredients : [],
    };

    // Save to food_logs if requested
    if (saveTo) {
      const logDate = date || localDate(tz);
      const { error: saveErr } = await db.from('food_logs').insert({
        user_id:     user.id,
        logged_date: logDate,
        meal_type:   mealType,
        food_name:   n.food_name,
        calories:    n.calories,
        protein_g:   n.protein_g,
        fat_g:       n.fat_g,
        carbs_g:     n.net_carbs_g, // food_logs stores net carbs in carbs_g
        serving_size: n.serving_size,
        source:      'photo_ai',
      });
      if (saveErr) console.error('[food/analyze-photo] user:', userId, 'save error:', saveErr);
      return json({ success: true, nutrition: n, saved: !saveErr });
    }

    return json({ success: true, nutrition: n });

  } catch (err) {
    await captureError('food/analyze-photo', userId, err);
    return json({ error: 'Server error' }, 500);
  }
};

