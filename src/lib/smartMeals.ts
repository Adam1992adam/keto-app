// src/lib/smartMeals.ts
// ═══════════════════════════════════════════════════════
// Smart Meal Intelligence Engine
// يختار الوجبات المناسبة لكل مستخدم بناءاً على:
// 1. dietary restrictions (onboarding)
// 2. check-in history (آخر 3 أيام — طاقة/ماء/التزام)
// 3. meal swap history (وصفات سبق رفضها)
// 4. يوم الأسبوع (عطلة vs يوم عمل)
// ═══════════════════════════════════════════════════════

import { supabase, getMealCycleDays } from './supabase';

// ── أنواع البيانات
interface MealContext {
  userId:       string;
  planType:     string;   // 'basic_30'
  dayNumber:    number;   // 1-30
  restrictions: string[]; // ['no_pork', 'vegetarian', ...]
  avgEnergy:    number;   // 1-5 من آخر 3 check-ins
  avgWater:     number;   // glasses
  compliance:   number;   // 0-1
  rejectedIds:  string[]; // recipe IDs سبق swap-ها
  isWeekend:    boolean;
  weekNumber:   number;   // 1-4
}

interface SmartMeal {
  meal_type:    string;
  recipe:       any;
  is_adapted:   boolean;  // هل تم تغيير الوصفة الأصلية؟
  reason?:      string;   // لماذا تم التغيير؟
}

// ── جلب السياق الكامل للمستخدم
export async function getUserMealContext(userId: string): Promise<MealContext> {
  const today = new Date();
  const isWeekend = today.getDay() === 5 || today.getDay() === 6; // جمعة وسبت

  // 1. بيانات الـ profile و onboarding
  const [{ data: profile }, { data: onboarding }, { data: journey }] = await Promise.all([
    supabase.from('profiles').select('subscription_tier, xp_total').eq('id', userId).single(),
    supabase.from('onboarding_data').select('dietary_restrictions, fasting_protocol').eq('user_id', userId).single(),
    supabase.from('user_journey').select('current_day').eq('user_id', userId).single(),
  ]);

  const planType  = profile?.subscription_tier || 'basic_30';
  const dayNumber = journey?.current_day || 1;
  const weekNumber = Math.ceil(dayNumber / 7);

  // 2. آخر 3 check-ins
  const { data: recentCheckins } = await supabase
    .from('daily_checkins')
    .select('energy_level, water_glasses, followed_meals')
    .eq('user_id', userId)
    .order('checkin_date', { ascending: false })
    .limit(3);

  const avgEnergy = recentCheckins?.length
    ? recentCheckins.reduce((s, c) => s + (c.energy_level || 3), 0) / recentCheckins.length
    : 3;
  const avgWater = recentCheckins?.length
    ? recentCheckins.reduce((s, c) => s + (c.water_glasses || 6), 0) / recentCheckins.length
    : 6;
  const compliance = recentCheckins?.length
    ? recentCheckins.filter(c => c.followed_meals).length / recentCheckins.length
    : 1;

  // 3. وصفات تم رفضها (آخر 14 يوم)
  const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];
  const { data: swaps } = await supabase
    .from('meal_swaps')
    .select('original_recipe_id')
    .eq('user_id', userId)
    .gte('swap_date', twoWeeksAgo);

  const rejectedIds = swaps?.map(s => s.original_recipe_id) || [];

  // 4. dietary restrictions
  const restrictions: string[] = onboarding?.dietary_restrictions || [];

  return {
    userId, planType, dayNumber, restrictions,
    avgEnergy, avgWater, compliance,
    rejectedIds, isWeekend, weekNumber,
  };
}

// ── منطق اختيار الوصفة الذكي
export async function getSmartDayMeals(ctx: MealContext): Promise<SmartMeal[]> {

  // جلب الخطة الأصلية لهذا اليوم
  const { data: basePlan } = await supabase
    .from('meal_plans')
    .select('*, recipe:recipes(*)')
    .eq('plan_type', ctx.planType)
    .eq('day_number', ctx.dayNumber)
    .order('meal_type');

  if (!basePlan || basePlan.length === 0) return [];

  const meals: SmartMeal[] = [];

  for (const meal of basePlan) {
    const result = await adaptMeal(meal, ctx);
    meals.push(result);
  }

  return meals;
}

// ── تكييف وجبة واحدة
async function adaptMeal(meal: any, ctx: MealContext): Promise<SmartMeal> {
  const recipe = meal.recipe;
  if (!recipe) return { meal_type: meal.meal_type, recipe: null, is_adapted: false };

  // ─ سبب التغيير المحتمل
  let changeReason: string | null = null;

  // 1. هل الوصفة مرفوضة؟
  if (ctx.rejectedIds.includes(recipe.id)) {
    changeReason = 'previously_rejected';
  }

  // 2. dietary restrictions
  if (!changeReason) {
    const tags: string[] = recipe.tags || [];
    const title: string  = recipe.title?.toLowerCase() || '';

    if (ctx.restrictions.includes('no_pork') && (tags.includes('pork') || title.includes('pork') || title.includes('bacon') || title.includes('prosciutto') || title.includes('ham') || title.includes('chorizo') || title.includes('sausage'))) {
      changeReason = 'dietary_restriction_pork';
    }
    if (ctx.restrictions.includes('vegetarian') && (tags.includes('meat') || tags.includes('chicken') || tags.includes('beef') || tags.includes('seafood') || title.includes('chicken') || title.includes('beef') || title.includes('steak') || title.includes('salmon') || title.includes('tuna') || title.includes('shrimp'))) {
      changeReason = 'dietary_restriction_vegetarian';
    }
    if (ctx.restrictions.includes('no_seafood') && (tags.includes('seafood') || tags.includes('omega-3') || title.includes('salmon') || title.includes('tuna') || title.includes('shrimp') || title.includes('cod') || title.includes('fish'))) {
      changeReason = 'dietary_restriction_seafood';
    }
  }

  // 3. طاقة منخفضة جداً → وصفات سريعة وبسيطة فقط
  if (!changeReason && ctx.avgEnergy < 2.5 && meal.meal_type !== 'snack') {
    const tags: string[] = recipe.tags || [];
    const isQuick = tags.includes('quick') || tags.includes('no-cook') || (recipe.prep_time + recipe.cook_time) <= 15;
    if (!isQuick) {
      changeReason = 'low_energy_need_quick';
    }
  }

  // 4. إذا لا يوجد سبب للتغيير → ارجع الوصفة الأصلية
  if (!changeReason) {
    return { meal_type: meal.meal_type, recipe, is_adapted: false };
  }

  // ─ ابحث عن بديل مناسب
  const alternative = await findAlternative(recipe, meal.meal_type, ctx, changeReason);

  if (alternative) {
    return {
      meal_type:  meal.meal_type,
      recipe:     alternative,
      is_adapted: true,
      reason:     changeReason,
    };
  }

  // لا يوجد بديل → ارجع الأصل
  return { meal_type: meal.meal_type, recipe, is_adapted: false };
}

// ── البحث عن بديل
async function findAlternative(
  original: any,
  mealType: string,
  ctx: MealContext,
  reason: string,
): Promise<any | null> {

  // تحديد الـ meal category من tags
  const originalTags: string[] = original.tags || [];
  const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'];
  const category = mealCategories.find(c => originalTags.includes(c)) || mealType;

  let query = supabase
    .from('recipes')
    .select('id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags')
    .contains('tags', [category])
    .neq('id', original.id)
    // ±25% سعرات
    .gte('calories', (original.calories || 400) * 0.75)
    .lte('calories', (original.calories || 400) * 1.25);

  // فلتر dietary restrictions
  if (ctx.restrictions.includes('vegetarian')) {
    query = query.contains('tags', ['vegetarian']);
  }
  if (ctx.restrictions.includes('no_pork')) {
    // استبعد بالـ tags - heuristic
    query = query.not('tags', 'cs', '{"pork"}');
  }
  if (ctx.restrictions.includes('no_seafood')) {
    query = query.not('tags', 'cs', '{"seafood"}').not('tags', 'cs', '{"omega-3"}').not('tags', 'cs', '{"pescatarian"}');
  }

  // طاقة منخفضة → بسيط وسريع
  if (reason === 'low_energy_need_quick') {
    query = query.lte('prep_time', 10).lte('cook_time', 10);
  }

  const { data: candidates } = await query.limit(15);
  if (!candidates || candidates.length === 0) return null;

  // استبعد المرفوضة مسبقاً
  const filtered = candidates.filter(r => !ctx.rejectedIds.includes(r.id));
  if (filtered.length === 0) return candidates[0]; // fallback

  // اختر الأنسب — أقرب بروتين للأصل
  const best = filtered.sort((a, b) => {
    const scoreA = Math.abs((a.protein || 0) - (original.protein || 30));
    const scoreB = Math.abs((b.protein || 0) - (original.protein || 30));
    return scoreA - scoreB;
  })[0];

  return best;
}

// ── واجهة API للاستخدام من الصفحات
export async function getAdaptedMeals(userId: string) {
  const ctx = await getUserMealContext(userId);
  const meals = await getSmartDayMeals(ctx);

  return {
    meals,
    context: {
      dayNumber:   ctx.dayNumber,
      weekNumber:  ctx.weekNumber,
      avgEnergy:   Math.round(ctx.avgEnergy * 10) / 10,
      adaptedCount: meals.filter(m => m.is_adapted).length,
      totalMeals:  meals.length,
    },
  };
}

// ═══════════════════════════════════════════════════════
// 1. SEEDED VARIETY ROTATION
// ═══════════════════════════════════════════════════════

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function userCycleSeed(userId: string, cycleNum: number): number {
  let hash = cycleNum * 31337;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return hash || 1;
}

// Check dietary restrictions on a recipe (same logic as adaptMeal)
function passesRestrictions(recipe: any, restrictions: string[]): boolean {
  const tags: string[] = recipe.tags || [];
  const title: string  = recipe.title?.toLowerCase() || '';

  if (restrictions.includes('no_pork') && (
    tags.includes('pork') || title.includes('pork') || title.includes('bacon') ||
    title.includes('prosciutto') || title.includes('ham') || title.includes('chorizo') || title.includes('sausage')
  )) return false;

  if (restrictions.includes('vegetarian') && (
    tags.includes('meat') || tags.includes('chicken') || tags.includes('beef') ||
    tags.includes('seafood') || title.includes('chicken') || title.includes('beef') ||
    title.includes('steak') || title.includes('salmon') || title.includes('tuna') || title.includes('shrimp')
  )) return false;

  if (restrictions.includes('no_seafood') && (
    tags.includes('seafood') || tags.includes('omega-3') || tags.includes('pescatarian') ||
    title.includes('salmon') || title.includes('tuna') || title.includes('shrimp') ||
    title.includes('cod') || title.includes('fish')
  )) return false;

  return true;
}

export async function getVariedSmartMeals(
  userId: string,
  dayNumber: number,
  planType: string,
  restrictions: string[],
  goal: string,
  avgEnergy: number,
): Promise<SmartMeal[]> {
  const cycleDays = getMealCycleDays(planType);
  const cycleNum  = Math.floor((dayNumber - 1) / cycleDays);
  const baseDay   = ((dayNumber - 1) % cycleDays) + 1;

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const results: SmartMeal[] = [];

  for (const mealType of mealTypes) {
    if (cycleNum === 0) {
      // Cycle 0: use the existing DB meal plan order
      const { data: planned } = await supabase
        .from('meal_plans')
        .select('*, recipe:recipes(*)')
        .eq('plan_type', planType)
        .eq('day_number', baseDay)
        .eq('meal_type', mealType)
        .limit(1)
        .maybeSingle();

      if (planned?.recipe) {
        results.push({ meal_type: mealType, recipe: planned.recipe, is_adapted: false });
      }
    } else {
      // Cycle 1+: fetch the full recipe pool for this meal type, shuffle with seed, pick by day
      const { data: pool } = await supabase
        .from('recipes')
        .select('id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags')
        .contains('tags', [mealType]);

      if (!pool || pool.length === 0) continue;

      // Apply dietary restriction filtering
      let filtered = pool.filter(r => passesRestrictions(r, restrictions));
      if (filtered.length === 0) filtered = pool; // fallback: no filter

      // Apply goal-based sorting before shuffle
      if (goal === 'weight_loss') {
        filtered = filtered.filter(r => (r.calories || 9999) < 400);
        if (filtered.length === 0) filtered = pool.filter(r => passesRestrictions(r, restrictions));
        filtered = [...filtered].sort((a, b) => (a.calories || 0) - (b.calories || 0));
      } else if (goal === 'muscle_gain') {
        filtered = filtered.filter(r => (r.protein || 0) > 30);
        if (filtered.length === 0) filtered = pool.filter(r => passesRestrictions(r, restrictions));
        filtered = [...filtered].sort((a, b) => (b.protein || 0) - (a.protein || 0));
      }

      // Shuffle deterministically using user + cycle seed
      const seed = userCycleSeed(userId, cycleNum);
      const shuffled = seededShuffle(filtered, seed);
      const recipe = shuffled[(baseDay - 1) % shuffled.length];

      results.push({ meal_type: mealType, recipe, is_adapted: cycleNum > 0, reason: 'varied_rotation' });
    }
  }

  return results;
}

// ═══════════════════════════════════════════════════════
// 2. INGREDIENT DERIVATION
// ═══════════════════════════════════════════════════════

export function deriveIngredients(recipe: any): string[] {
  const title = (recipe?.title || '').toLowerCase();
  const tags: string[] = recipe?.tags || [];
  const ingredients: string[] = [];

  // Title-based ingredient mapping
  if (title.includes('eggs') || title.includes('omelette') || title.includes('frittata')) {
    ingredients.push('Eggs', 'Butter', 'Salt & pepper');
  }
  if (title.includes('omelette')) {
    ingredients.push('Cheese');
  }
  if (title.includes('bacon')) {
    ingredients.push('Bacon strips');
  }
  if (title.includes('salmon')) {
    ingredients.push('Salmon fillet', 'Lemon', 'Butter');
  }
  if (title.includes('chicken')) {
    ingredients.push('Chicken breast/thighs', 'Olive oil', 'Garlic');
  }
  if (title.includes('beef') || title.includes('steak')) {
    ingredients.push('Ground beef/steak', 'Garlic', 'Salt & pepper');
  }
  if (title.includes('shrimp')) {
    ingredients.push('Shrimp', 'Butter', 'Garlic', 'Lemon');
  }
  if (title.includes('tuna')) {
    ingredients.push('Canned tuna', 'Mayonnaise', 'Lemon');
  }
  if (title.includes('lamb')) {
    ingredients.push('Lamb chops/ground', 'Garlic', 'Rosemary');
  }
  if (title.includes('pork') || title.includes('sausage')) {
    ingredients.push('Pork', 'Herbs', 'Garlic');
  }
  if (title.includes('cod') || title.includes('fish')) {
    ingredients.push('White fish fillet', 'Lemon', 'Butter', 'Herbs');
  }
  if (title.includes('duck')) {
    ingredients.push('Duck breast', 'Orange/herbs', 'Salt');
  }
  if (title.includes('smoothie') || title.includes('shake')) {
    ingredients.push('Heavy cream', 'Protein powder', 'Ice');
  }
  if (title.includes('pancake') || title.includes('waffle')) {
    ingredients.push('Almond flour', 'Eggs', 'Butter', 'Baking powder');
  }
  if (title.includes('cauliflower')) {
    ingredients.push('Cauliflower', 'Butter', 'Cream');
  }
  if (title.includes('zucchini')) {
    ingredients.push('Zucchini', 'Olive oil', 'Garlic');
  }
  if (title.includes('avocado')) {
    ingredients.push('Avocados', 'Lemon juice', 'Salt');
  }
  if (title.includes('salad')) {
    ingredients.push('Mixed greens', 'Olive oil', 'Vinegar');
  }
  if (title.includes('soup')) {
    ingredients.push('Broth/stock', 'Cream', 'Butter');
  }
  if (title.includes('broccoli')) {
    ingredients.push('Broccoli', 'Butter', 'Garlic');
  }
  if (title.includes('asparagus')) {
    ingredients.push('Asparagus', 'Olive oil', 'Lemon');
  }
  if (title.includes('mushroom')) {
    ingredients.push('Mushrooms', 'Butter', 'Garlic', 'Thyme');
  }
  if (title.includes('spinach')) {
    ingredients.push('Spinach', 'Olive oil', 'Garlic');
  }
  if (title.includes('feta')) {
    ingredients.push('Feta cheese');
  }
  if (title.includes('parmesan')) {
    ingredients.push('Parmesan', 'Olive oil');
  }
  if (title.includes('cream cheese')) {
    ingredients.push('Cream cheese');
  }
  if (title.includes('cheddar') || title.includes('cheese')) {
    ingredients.push('Cheese', 'Butter');
  }
  if (title.includes('coconut')) {
    ingredients.push('Coconut cream/milk', 'Coconut oil');
  }
  if (title.includes('almond')) {
    ingredients.push('Almond flour', 'Almonds');
  }
  if (title.includes('chia')) {
    ingredients.push('Chia seeds', 'Coconut milk');
  }
  if (title.includes('chocolate')) {
    ingredients.push('Dark chocolate/cocoa powder', 'Butter');
  }
  if (title.includes('cinnamon')) {
    ingredients.push('Cinnamon', 'Almond flour', 'Eggs');
  }

  // Tag-based additions
  if (tags.includes('meal-prep')) {
    ingredients.push('Meal prep containers');
  }
  if (tags.includes('baking')) {
    ingredients.push('Almond flour', 'Eggs', 'Baking powder', 'Butter');
  }
  if (tags.includes('no-cook')) {
    ingredients.push('No cooking required');
  }

  // Always add base staples
  ingredients.push('Salt', 'Black pepper', 'Olive oil/Butter');

  // Deduplicate (case-insensitive key, preserve first occurrence casing)
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const item of ingredients) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  // Return 4–8 items
  return unique.slice(0, 8);
}

// ═══════════════════════════════════════════════════════
// 3. WEEK SHOPPING HELPER
// ═══════════════════════════════════════════════════════

export function getWeekIngredients(
  recipes: any[],
): Map<string, { item: string; count: number; meals: string[] }> {
  const map = new Map<string, { item: string; count: number; meals: string[] }>();

  for (const entry of recipes) {
    const recipe    = entry.recipe || entry;
    const mealType  = entry.meal_type || '';
    const dayNumber = entry.day_number;
    const mealLabel = mealType
      ? (dayNumber ? `Day ${dayNumber} ${mealType}` : mealType)
      : (recipe?.title || 'Unknown meal');

    const items = deriveIngredients(recipe);
    for (const item of items) {
      const key = item.toLowerCase();
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.count++;
        if (!existing.meals.includes(mealLabel)) {
          existing.meals.push(mealLabel);
        }
      } else {
        map.set(key, { item, count: 1, meals: [mealLabel] });
      }
    }
  }

  return map;
}