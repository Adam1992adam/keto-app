import { s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
export { renderers } from '../../../renderers.mjs';

async function getUserMealContext(userId) {
  const today = /* @__PURE__ */ new Date();
  const isWeekend = today.getDay() === 5 || today.getDay() === 6;
  const [{ data: profile }, { data: onboarding }, { data: journey }] = await Promise.all([
    supabase.from("profiles").select("subscription_tier, xp_total").eq("id", userId).single(),
    supabase.from("onboarding_data").select("dietary_restrictions, fasting_protocol").eq("user_id", userId).single(),
    supabase.from("user_journey").select("current_day").eq("user_id", userId).single()
  ]);
  const planType = profile?.subscription_tier || "basic_30";
  const dayNumber = journey?.current_day || 1;
  const weekNumber = Math.ceil(dayNumber / 7);
  const { data: recentCheckins } = await supabase.from("daily_checkins").select("energy_level, water_glasses, followed_meals").eq("user_id", userId).order("checkin_date", { ascending: false }).limit(3);
  const avgEnergy = recentCheckins?.length ? recentCheckins.reduce((s, c) => s + (c.energy_level || 3), 0) / recentCheckins.length : 3;
  const avgWater = recentCheckins?.length ? recentCheckins.reduce((s, c) => s + (c.water_glasses || 6), 0) / recentCheckins.length : 6;
  const compliance = recentCheckins?.length ? recentCheckins.filter((c) => c.followed_meals).length / recentCheckins.length : 1;
  const twoWeeksAgo = new Date(Date.now() - 14 * 864e5).toISOString().split("T")[0];
  const { data: swaps } = await supabase.from("meal_swaps").select("original_recipe_id").eq("user_id", userId).gte("swap_date", twoWeeksAgo);
  const rejectedIds = swaps?.map((s) => s.original_recipe_id) || [];
  const restrictions = onboarding?.dietary_restrictions || [];
  return {
    userId,
    planType,
    dayNumber,
    restrictions,
    avgEnergy,
    avgWater,
    compliance,
    rejectedIds,
    isWeekend,
    weekNumber
  };
}
async function getSmartDayMeals(ctx) {
  const { data: basePlan } = await supabase.from("meal_plans").select("*, recipe:recipes(*)").eq("plan_type", ctx.planType).eq("day_number", ctx.dayNumber).order("meal_type");
  if (!basePlan || basePlan.length === 0) return [];
  const meals = [];
  for (const meal of basePlan) {
    const result = await adaptMeal(meal, ctx);
    meals.push(result);
  }
  return meals;
}
async function adaptMeal(meal, ctx) {
  const recipe = meal.recipe;
  if (!recipe) return { meal_type: meal.meal_type, recipe: null, is_adapted: false };
  let changeReason = null;
  if (ctx.rejectedIds.includes(recipe.id)) {
    changeReason = "previously_rejected";
  }
  if (!changeReason) {
    const tags = recipe.tags || [];
    const title = recipe.title?.toLowerCase() || "";
    if (ctx.restrictions.includes("no_pork") && (tags.includes("pork") || title.includes("pork") || title.includes("bacon") || title.includes("prosciutto") || title.includes("ham") || title.includes("chorizo") || title.includes("sausage"))) {
      changeReason = "dietary_restriction_pork";
    }
    if (ctx.restrictions.includes("vegetarian") && (tags.includes("meat") || tags.includes("chicken") || tags.includes("beef") || tags.includes("seafood") || title.includes("chicken") || title.includes("beef") || title.includes("steak") || title.includes("salmon") || title.includes("tuna") || title.includes("shrimp"))) {
      changeReason = "dietary_restriction_vegetarian";
    }
    if (ctx.restrictions.includes("no_seafood") && (tags.includes("seafood") || tags.includes("omega-3") || title.includes("salmon") || title.includes("tuna") || title.includes("shrimp") || title.includes("cod") || title.includes("fish"))) {
      changeReason = "dietary_restriction_seafood";
    }
  }
  if (!changeReason && ctx.avgEnergy < 2.5 && meal.meal_type !== "snack") {
    const tags = recipe.tags || [];
    const isQuick = tags.includes("quick") || tags.includes("no-cook") || recipe.prep_time + recipe.cook_time <= 15;
    if (!isQuick) {
      changeReason = "low_energy_need_quick";
    }
  }
  if (!changeReason) {
    return { meal_type: meal.meal_type, recipe, is_adapted: false };
  }
  const alternative = await findAlternative(recipe, meal.meal_type, ctx, changeReason);
  if (alternative) {
    return {
      meal_type: meal.meal_type,
      recipe: alternative,
      is_adapted: true,
      reason: changeReason
    };
  }
  return { meal_type: meal.meal_type, recipe, is_adapted: false };
}
async function findAlternative(original, mealType, ctx, reason) {
  const originalTags = original.tags || [];
  const mealCategories = ["breakfast", "lunch", "dinner", "snack"];
  const category = mealCategories.find((c) => originalTags.includes(c)) || mealType;
  let query = supabase.from("recipes").select("id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags").contains("tags", [category]).neq("id", original.id).gte("calories", (original.calories || 400) * 0.75).lte("calories", (original.calories || 400) * 1.25);
  if (ctx.restrictions.includes("vegetarian")) {
    query = query.contains("tags", ["vegetarian"]);
  }
  if (ctx.restrictions.includes("no_pork")) {
    query = query.not("tags", "cs", '{"pork"}');
  }
  if (ctx.restrictions.includes("no_seafood")) {
    query = query.not("tags", "cs", '{"seafood"}').not("tags", "cs", '{"omega-3"}').not("tags", "cs", '{"pescatarian"}');
  }
  if (reason === "low_energy_need_quick") {
    query = query.lte("prep_time", 10).lte("cook_time", 10);
  }
  const { data: candidates } = await query.limit(15);
  if (!candidates || candidates.length === 0) return null;
  const filtered = candidates.filter((r) => !ctx.rejectedIds.includes(r.id));
  if (filtered.length === 0) return candidates[0];
  const best = filtered.sort((a, b) => {
    const scoreA = Math.abs((a.protein || 0) - (original.protein || 30));
    const scoreB = Math.abs((b.protein || 0) - (original.protein || 30));
    return scoreA - scoreB;
  })[0];
  return best;
}
async function getAdaptedMeals(userId) {
  const ctx = await getUserMealContext(userId);
  const meals = await getSmartDayMeals(ctx);
  return {
    meals,
    context: {
      dayNumber: ctx.dayNumber,
      weekNumber: ctx.weekNumber,
      avgEnergy: Math.round(ctx.avgEnergy * 10) / 10,
      adaptedCount: meals.filter((m) => m.is_adapted).length,
      totalMeals: meals.length
    }
  };
}

const GET = async ({ cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const result = await getAdaptedMeals(user.id);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
