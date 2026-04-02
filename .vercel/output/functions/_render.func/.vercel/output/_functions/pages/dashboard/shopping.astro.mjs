/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, f as defineScriptVars, g as addAttribute, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, e as getMaxJourneyDays, s as supabase, a as getMealCycleDays } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$ShoppingCart } from '../../chunks/ShoppingCart_CxlP89GQ.mjs';
import { $ as $$CheckSquare } from '../../chunks/CheckSquare_DW0yTG8K.mjs';
import { $ as $$ } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$Target } from '../../chunks/Target_DD7DYwGV.mjs';
import { $ as $$AlertTriangle } from '../../chunks/AlertTriangle_CZmKUJtJ.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Tag = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Tag;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "tag", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path> <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Tag.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Shopping = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Shopping;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const journey = await getUserJourney(user.id);
  if (!journey) return Astro2.redirect("/dashboard");
  const currentDay = journey.current_day || 1;
  const currentWeek = Math.ceil(currentDay / 7);
  const userName = profile.full_name?.split(" ")[0] || "there";
  const maxDays = getMaxJourneyDays(planType);
  const maxWeeks = Math.ceil(maxDays / 7);
  const weekParam = Astro2.url.searchParams.get("week");
  const viewWeek = Math.min(Math.max(parseInt(weekParam || String(currentWeek)), 1), maxWeeks);
  const startDay = (viewWeek - 1) * 7 + 1;
  const endDay = Math.min(startDay + 6, maxDays);
  const mealCycleDays = getMealCycleDays(planType);
  const cycledDays = Array.from({ length: endDay - startDay + 1 }, (_, i) => (startDay + i - 1) % mealCycleDays + 1);
  const { data: mealPlansDirect } = await supabase.from("meal_plans").select("day_number, meal_type, recipe:recipes(id, title, calories, protein, fat, net_carbs, tags)").eq("plan_type", planType).in("day_number", cycledDays).order("day_number");
  const { data: mealPlansFallback } = mealPlansDirect?.length ? { data: null } : await supabase.from("meal_plans").select("day_number, meal_type, recipe:recipes(id, title, calories, protein, fat, net_carbs, tags)").eq("plan_type", "basic_30").in("day_number", cycledDays).order("day_number");
  const mealPlans = mealPlansDirect?.length ? mealPlansDirect : mealPlansFallback || [];
  const { data: onboarding } = await supabase.from("onboarding_data").select("dietary_restrictions, goal, current_weight, target_weight").eq("user_id", user.id).maybeSingle();
  const restrictions = onboarding?.dietary_restrictions || [];
  const userGoal = onboarding?.goal || "weight_loss";
  const isAllowed = (recipe) => {
    if (!recipe) return true;
    const tags = recipe.tags || [];
    const title = (recipe.title || "").toLowerCase();
    if (restrictions.includes("no_pork") && (tags.includes("pork") || ["bacon", "ham", "prosciutto", "chorizo", "sausage"].some((w) => title.includes(w)))) return false;
    if (restrictions.includes("vegetarian") && ["chicken", "beef", "steak", "lamb", "duck", "salmon", "tuna", "shrimp", "cod"].some((w) => title.includes(w))) return false;
    if (restrictions.includes("no_seafood") && (tags.includes("seafood") || tags.includes("omega-3") || ["salmon", "tuna", "shrimp", "cod", "fish"].some((w) => title.includes(w)))) return false;
    return true;
  };
  const filteredMealPlans = mealPlans.filter((m) => isAllowed(m.recipe));
  const deriveIngredients = (recipe) => {
    if (!recipe) return [];
    const t = (recipe.title || "").toLowerCase();
    const tags = recipe.tags || [];
    const items = [];
    if (t.includes("egg") || t.includes("omelette") || t.includes("frittata")) {
      items.push("Eggs");
      items.push("Butter");
    } else if (t.includes("bacon")) {
      items.push("Bacon");
      items.push("Eggs");
    } else if (t.includes("salmon")) {
      items.push("Salmon");
      items.push("Lemon");
      items.push("Butter");
      items.push("Fresh herbs");
    } else if (t.includes("chicken")) {
      items.push("Chicken");
      items.push("Olive oil");
      items.push("Garlic");
    } else if (t.includes("beef") || t.includes("steak") || t.includes("meatloaf") || t.includes("chili")) {
      items.push("Ground beef/steak");
      items.push("Onion");
      items.push("Garlic");
    } else if (t.includes("shrimp")) {
      items.push("Shrimp");
      items.push("Butter");
      items.push("Garlic");
      items.push("Lemon");
    } else if (t.includes("tuna")) {
      items.push("Canned tuna");
      items.push("Mayonnaise");
      items.push("Celery");
    } else if (t.includes("lamb")) {
      items.push("Lamb");
      items.push("Garlic");
      items.push("Rosemary");
      items.push("Olive oil");
    } else if (t.includes("pork") || t.includes("sausage")) {
      items.push("Pork");
      items.push("Garlic");
      items.push("Herbs");
    } else if (t.includes("cod") || t.includes("fish")) {
      items.push("White fish");
      items.push("Lemon");
      items.push("Butter");
      items.push("Herbs");
    } else if (t.includes("duck")) {
      items.push("Duck breast");
      items.push("Orange/herbs");
      items.push("Salt");
    } else if (t.includes("smoothie")) {
      items.push("Heavy cream");
      items.push("Ice");
      items.push("Protein powder");
    } else if (t.includes("pancake") || t.includes("waffle")) {
      items.push("Almond flour");
      items.push("Eggs");
      items.push("Baking powder");
    }
    if (t.includes("cauliflower")) {
      items.push("Cauliflower");
      items.push("Butter");
      items.push("Cream");
    }
    if (t.includes("zucchini")) {
      items.push("Zucchini");
      items.push("Olive oil");
      items.push("Garlic");
    }
    if (t.includes("avocado")) {
      items.push("Avocados");
      items.push("Lemon");
    }
    if (t.includes("salad")) {
      items.push("Mixed greens");
      items.push("Olive oil");
      items.push("Vinegar");
    }
    if (t.includes("soup")) {
      items.push("Broth");
      items.push("Cream");
      items.push("Vegetables");
    }
    if (t.includes("broccoli")) {
      items.push("Broccoli");
      items.push("Butter");
    }
    if (t.includes("asparagus")) {
      items.push("Asparagus");
      items.push("Olive oil");
    }
    if (t.includes("mushroom")) {
      items.push("Mushrooms");
      items.push("Butter");
      items.push("Garlic");
    }
    if (t.includes("spinach")) {
      items.push("Spinach");
      items.push("Olive oil");
    }
    if (t.includes("cheese") || t.includes("feta") || t.includes("parmesan") || t.includes("mozzarella")) {
      items.push("Cheese (per recipe type)");
    }
    if (t.includes("coconut")) {
      items.push("Coconut cream");
      items.push("Coconut oil");
    }
    if (t.includes("almond")) {
      items.push("Almond flour");
      items.push("Almonds");
    }
    if (t.includes("chia")) {
      items.push("Chia seeds");
      items.push("Coconut milk");
    }
    if (t.includes("chocolate")) {
      items.push("Dark cocoa powder");
      items.push("Butter");
    }
    if (tags.includes("baking") && !items.includes("Almond flour")) {
      items.push("Almond flour");
      items.push("Eggs");
      items.push("Baking powder");
    }
    if (!items.includes("Salt & pepper")) items.push("Salt & pepper");
    if (!items.includes("Olive oil")) items.push("Olive oil");
    const unique = [...new Set(items)];
    return unique.slice(0, 7);
  };
  const budgetAltsDb = {
    "salmon": { alt: "canned tuna", save: "60%", tip: "Same omega-3, a fraction of the cost \u2014 great hot or cold" },
    "ribeye": { alt: "chuck steak", save: "50%", tip: "Slow cook or marinate 2h for same tenderness" },
    "lamb": { alt: "ground beef", save: "45%", tip: "Season identically \u2014 barely any taste difference" },
    "shrimp": { alt: "canned sardines", save: "55%", tip: "Excellent protein source, rich in omega-3" },
    "parmesan": { alt: "pecorino romano", save: "30%", tip: "Stronger taste \u2014 use less and save more" },
    "macadamia": { alt: "sunflower seeds", save: "70%", tip: "Same healthy fats, toast for extra flavor" },
    "pine nuts": { alt: "pumpkin seeds", save: "65%", tip: "Similar texture, even more nutrients" },
    "almond flour": { alt: "coconut flour", save: "40%", tip: "Use \xBC the amount \u2014 absorbs 4x more liquid" },
    "mozzarella": { alt: "string cheese", save: "35%", tip: "Same protein profile, easy to portion" },
    "heavy cream": { alt: "coconut cream", save: "25%", tip: "Perfect dairy-free swap, same richness" },
    "ghee": { alt: "unsalted butter", save: "50%", tip: "Make your own ghee by simmering butter 15min" },
    "avocado oil": { alt: "olive oil", save: "30%", tip: "Both are perfect keto high-smoke oils" },
    "grass-fed beef": { alt: "regular ground beef", save: "40%", tip: "Still excellent lean keto protein source" },
    "fresh herbs": { alt: "dried herbs", save: "80%", tip: "Use \u2153 the amount \u2014 dried herbs are more concentrated" },
    "cream cheese": { alt: "ricotta (strained)", save: "35%", tip: "Strain ricotta overnight for same thick texture" },
    "bone broth": { alt: "regular beef broth", save: "60%", tip: "Add a splash of apple cider vinegar to boost nutrition" }
  };
  const catDefs = {
    "Protein & Meat": { icon: "\u{1F969}", color: "#ef4444", bg: "rgba(239,68,68,.1)", keywords: ["egg", "chicken", "beef", "lamb", "pork", "salmon", "tuna", "shrimp", "steak", "bacon", "sausage", "ham", "turkey", "sardine", "cod", "fish", "duck", "venison"] },
    "Dairy & Cheese": { icon: "\u{1F9C0}", color: "#f59e0b", bg: "rgba(245,158,11,.1)", keywords: ["cheese", "butter", "cream", "yogurt", "feta", "parmesan", "mozzarella", "cheddar", "ricotta", "ghee", "milk", "kefir", "brie", "gouda", "manchego"] },
    "Fresh Vegetables": { icon: "\u{1F96C}", color: "#10b981", bg: "rgba(16,185,129,.1)", keywords: ["avocado", "spinach", "lettuce", "broccoli", "asparagus", "cauliflower", "zucchini", "tomato", "cucumber", "pepper", "mushroom", "onion", "celery", "cabbage", "kale", "arugula", "leek", "artichoke", "eggplant", "fennel"] },
    "Nuts & Seeds": { icon: "\u{1F95C}", color: "#8b5cf6", bg: "rgba(139,92,246,.1)", keywords: ["almond", "macadamia", "walnut", "pecan", "pine nut", "chia", "flax", "pumpkin seed", "sunflower", "hazelnut", "cashew", "pistachio", "hemp seed", "sesame"] },
    "Pantry & Oils": { icon: "\u{1F3FA}", color: "#6b7280", bg: "rgba(107,114,128,.1)", keywords: ["olive oil", "coconut oil", "avocado oil", "almond flour", "coconut flour", "soy sauce", "mustard", "mayo", "vinegar", "stock", "broth", "coconut milk", "coconut cream", "tomato paste", "protein", "tahini", "hot sauce"] },
    "Herbs & Spices": { icon: "\u{1F33F}", color: "#06b6d4", bg: "rgba(6,182,212,.1)", keywords: ["salt", "pepper", "garlic", "paprika", "thyme", "basil", "oregano", "ginger", "chives", "dill", "rosemary", "cinnamon", "cumin", "turmeric", "cayenne", "bay leaf", "mint", "parsley", "cilantro", "coriander", "cardamom", "sumac"] }
  };
  const ingMap = /* @__PURE__ */ new Map();
  filteredMealPlans.forEach((meal) => {
    const ings = deriveIngredients(meal.recipe);
    const label = "Day " + meal.day_number;
    ings.forEach((ingItem) => {
      const key = ingItem.toLowerCase().trim();
      if (!key) return;
      if (ingMap.has(key)) {
        const ex = ingMap.get(key);
        ingMap.set(key, { ...ex, count: ex.count + 1, meals: [.../* @__PURE__ */ new Set([...ex.meals, label])] });
      } else {
        ingMap.set(key, { item: ingItem, amount: 0, unit: "", count: 1, meals: [label] });
      }
    });
  });
  const allItems = Array.from(ingMap.values()).map((ing) => {
    const lower = ing.item.toLowerCase();
    const budgetKey = Object.keys(budgetAltsDb).find((k) => lower.includes(k));
    const isPork = ["bacon", "pork", "ham", "sausage"].some((w) => lower.includes(w));
    const isMeat = ["chicken", "beef", "lamb", "fish", "salmon", "tuna", "shrimp"].some((w) => lower.includes(w));
    const isSeafood = ["salmon", "tuna", "shrimp", "cod", "fish", "sardine"].some((w) => lower.includes(w));
    const flag = restrictions.includes("no_pork") && isPork ? "\u26A0\uFE0F Pork" : restrictions.includes("vegetarian") && isMeat ? "\u26A0\uFE0F Meat" : restrictions.includes("no_seafood") && isSeafood ? "\u26A0\uFE0F Seafood" : "";
    return { ...ing, budgetAlt: budgetKey ? budgetAltsDb[budgetKey] : void 0, flag };
  });
  const catMap = {};
  Object.keys(catDefs).forEach((c) => {
    catMap[c] = [];
  });
  catMap["Other"] = [];
  allItems.forEach((ing) => {
    const lower = ing.item.toLowerCase();
    const matchCat = Object.keys(catDefs).find((cat) => catDefs[cat].keywords.some((kw) => lower.includes(kw)));
    if (matchCat) catMap[matchCat].push(ing);
    else catMap["Other"].push(ing);
  });
  const activeCats = Object.entries(catMap).filter(([, items]) => items.length > 0);
  const { data: shoppingChecks } = await supabase.from("shopping_checks").select("item_key").eq("user_id", user.id).eq("week_number", viewWeek);
  const checkedKeysArr = (shoppingChecks || []).map((r) => r.item_key);
  const checkedKeySet = new Set(checkedKeysArr);
  const totalItems = allItems.length;
  const budgetCount = allItems.filter((i) => i.budgetAlt).length;
  const flaggedCount = allItems.filter((i) => i.flag).length;
  const sharedCount = allItems.filter((i) => i.count > 1).length;
  const uniqueMeals = new Set((filteredMealPlans || []).map((m) => m.day_number)).size;
  const weekTabs = Array.from({ length: maxWeeks }, (_, i) => i + 1).map((w) => ({
    w,
    label: `Week ${w}`,
    days: `Day ${(w - 1) * 7 + 1}\u2013${Math.min(w * 7, maxDays)}`,
    active: w === viewWeek,
    current: w === currentWeek,
    past: w < currentWeek
  }));
  const { data: customItems } = await supabase.from("custom_shopping_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  const myItems = customItems || [];
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-5zea3vv2> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Smart Shopping List \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, '</head> <body data-astro-cid-5zea3vv2> <div class="bg-wrap" data-astro-cid-5zea3vv2><div class="orb o1" data-astro-cid-5zea3vv2></div><div class="orb o2" data-astro-cid-5zea3vv2></div></div> ', ' <div class="page" data-astro-cid-5zea3vv2> <!-- HEADER --> <div class="pg-header" data-astro-cid-5zea3vv2> <div class="pg-eyebrow" data-astro-cid-5zea3vv2>', ' Smart Shopping</div> <h1 class="pg-title" data-astro-cid-5zea3vv2>Week ', " Groceries, <em data-astro-cid-5zea3vv2>", '</em></h1> <p class="pg-sub" data-astro-cid-5zea3vv2>\nAuto-generated from your Week ', " meal plan (Day ", "\u2013", ") \xB7\n", " items \xB7 ", " shared across recipes\n", " ", ' </p> </div> <!-- STATS BAR --> <div class="stats-bar" data-astro-cid-5zea3vv2> <div class="sbar" style="animation-delay:.04s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--green);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Total Items</div></div> <div class="sbar" style="animation-delay:.08s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--gold);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Budget Swaps</div></div> <div class="sbar" style="animation-delay:.12s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--blue);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Meals Covered</div></div> <div class="sbar" style="animation-delay:.16s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--purple);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Shared Items</div></div> </div> <!-- WEEK TABS --> <div class="week-tabs" data-astro-cid-5zea3vv2> ', ' <button onclick="window.print()" class="wtab" style="border-style:dashed;cursor:pointer;background:none;border-color:var(--border);margin-left:auto;" data-astro-cid-5zea3vv2> <span class="wtab-label" data-astro-cid-5zea3vv2>Print</span> <span class="wtab-days" data-astro-cid-5zea3vv2>Full list</span> </button> </div> <!-- PERSONALIZATION BANNER --> <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1rem 1.4rem;margin-bottom:1.25rem;display:flex;align-items:center;flex-wrap:wrap;gap:.75rem;" data-astro-cid-5zea3vv2> <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0;" data-astro-cid-5zea3vv2> ', " ", " ", " ", " </div> ", " ", " ", ' <span style="margin-left:auto;font-size:.75rem;color:var(--soft);font-weight:600;" data-astro-cid-5zea3vv2>', " recipes \xB7 ", " unique ingredients</span> </div> <!-- THIS WEEK'S MEALS SUMMARY --> ", ' <!-- TOOLBAR --> <div class="toolbar" data-astro-cid-5zea3vv2> <div class="tool-search" data-astro-cid-5zea3vv2> <span style="color:var(--soft);" data-astro-cid-5zea3vv2>\u{1F50D}</span> <input type="text" id="searchInput" placeholder="Search ingredient\u2026" autocomplete="off" data-astro-cid-5zea3vv2> </div> <button class="tbtn gold" id="budgetBtn" data-astro-cid-5zea3vv2>', ' Budget Mode</button> <button class="tbtn" id="clearBtn" data-astro-cid-5zea3vv2>\u21BA Reset</button> <button class="tbtn" id="copyBtn" data-astro-cid-5zea3vv2>', ' Copy</button> <button class="tbtn g" onclick="window.print()" data-astro-cid-5zea3vv2>Print</button> </div> <!-- DIETARY CONFLICT ALERT --> ', ' <!-- MAIN LAYOUT --> <div class="main-layout" data-astro-cid-5zea3vv2> <!-- CATEGORIES --> <div id="shoppingList" data-astro-cid-5zea3vv2> ', ' </div> <!-- SIDEBAR --> <div class="sidebar" data-astro-cid-5zea3vv2> <!-- PROGRESS RING --> <div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>Shopping Progress</div> <div class="side-body" style="text-align:center;" data-astro-cid-5zea3vv2> <div class="ring-wrap" data-astro-cid-5zea3vv2> <svg class="rsvg" width="80" height="80" viewBox="0 0 80 80" data-astro-cid-5zea3vv2> <circle class="r-trk" cx="40" cy="40" r="35" data-astro-cid-5zea3vv2></circle> <circle class="r-fill" id="progressRing" cx="40" cy="40" r="35" style="stroke-dashoffset:220;" data-astro-cid-5zea3vv2></circle> </svg> <div class="ring-c" data-astro-cid-5zea3vv2> <div class="ring-pct" id="progressPct" data-astro-cid-5zea3vv2>0%</div> <div class="ring-lbl" data-astro-cid-5zea3vv2>bought</div> </div> </div> <div style="font-size:.75rem;color:var(--soft);" id="progressText" data-astro-cid-5zea3vv2>0 / ', ` items</div> <div style="margin-top:.875rem;font-size:.72rem;font-weight:700;color:var(--soft);" id="progressTip" data-astro-cid-5zea3vv2>Start checking off items as you shop!</div> </div> </div> <!-- BUDGET SUMMARY --> <div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>\u{1F4B0} Budget Intelligence</div> <div class="side-body" data-astro-cid-5zea3vv2> <div style="background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.15);border-radius:12px;padding:.875rem;margin-bottom:.875rem;" data-astro-cid-5zea3vv2> <div style="font-size:.73rem;font-weight:800;color:var(--green);margin-bottom:.25rem;" data-astro-cid-5zea3vv2>\u{1F9E0} Smart Tip</div> <div style="font-size:.71rem;color:var(--soft);line-height:1.6;" data-astro-cid-5zea3vv2>Buy proteins in bulk \u2014 freeze portions you won't use this week. Keto proteins repeat across your plan, so bulk buying cuts costs 30\u201350%.</div> </div> <div class="brow" data-astro-cid-5zea3vv2><span class="brow-lbl" data-astro-cid-5zea3vv2>Budget swaps available</span><span class="brow-val" style="color:var(--gold);" data-astro-cid-5zea3vv2>`, '</span></div> <div class="brow" data-astro-cid-5zea3vv2><span class="brow-lbl" data-astro-cid-5zea3vv2>Shared ingredients</span><span class="brow-val" style="color:var(--blue);" data-astro-cid-5zea3vv2>', '</span></div> <div class="brow" data-astro-cid-5zea3vv2><span class="brow-lbl" data-astro-cid-5zea3vv2>Potential savings</span><span class="brow-val" style="color:var(--green);" data-astro-cid-5zea3vv2>30\u201370%</span></div> </div> </div> <!-- CATEGORY JUMPS --> <div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>Jump to Category</div> <div class="side-body" data-astro-cid-5zea3vv2> ', " </div> </div> <!-- DIETARY PROFILE --> ", ' </div> </div> <!-- MY CUSTOM ITEMS --> <div class="custom-section" id="customSection" data-astro-cid-5zea3vv2> <div class="custom-header" data-astro-cid-5zea3vv2> <span style="font-size:1.4rem;" data-astro-cid-5zea3vv2>\u{1F4DD}</span> <h2 class="custom-title" data-astro-cid-5zea3vv2>My Custom Items</h2> <span style="font-size:.72rem;font-weight:700;color:var(--soft);background:var(--card);border:1px solid var(--border);padding:.15rem .55rem;border-radius:99px;" id="customCount" data-astro-cid-5zea3vv2>', '</span> </div> <div class="custom-add-form" data-astro-cid-5zea3vv2> <input type="text" id="ciName" class="inp-name" placeholder="Item name (e.g. Coconut oil)\u2026" autocomplete="off" data-astro-cid-5zea3vv2> <input type="text" id="ciQty" class="inp-qty" placeholder="Qty (e.g. 2 cups)" data-astro-cid-5zea3vv2> <select id="ciCat" class="inp-cat" data-astro-cid-5zea3vv2> <option value="produce" data-astro-cid-5zea3vv2>\u{1F96C} Produce</option> <option value="meat" data-astro-cid-5zea3vv2>\u{1F969} Meat</option> <option value="dairy" data-astro-cid-5zea3vv2>\u{1F9C0} Dairy</option> <option value="pantry" data-astro-cid-5zea3vv2>\u{1F3FA} Pantry</option> <option value="other" selected data-astro-cid-5zea3vv2>\u{1F4E6} Other</option> </select> <button class="btn-add" onclick="window.addCustomItem()" data-astro-cid-5zea3vv2>+ Add</button> </div> <div class="custom-list" id="customList" data-astro-cid-5zea3vv2> ', " </div> </div> </div> <script>(function(){", `
/* CHECKED STATE \u2014 DB-backed, localStorage as fallback */
var SK    = 'keto-shop-w' + weekNum;
/* seed bought set from DB-loaded keys (by item-key attr) */
var bought = new Set();
/* map itemKey \u2192 elementId for fast lookup */
var keyToId = {};
document.querySelectorAll('.shop-item[data-item-key]').forEach(function(el) {
  var k = el.getAttribute('data-item-key');
  var id = el.id.replace('item-', '');
  keyToId[k] = id;
});
/* initialize from server-rendered DB state */
(checkedKeysArr || []).forEach(function(k) {
  var id = keyToId[k];
  if (id) bought.add(id);
});
/* also restore any localStorage keys not in DB (offline resilience) */
var lsKeys = JSON.parse(localStorage.getItem(SK) || '[]');
lsKeys.forEach(function(id) { bought.add(id); });
updateRing();

/* TOGGLE ITEM */
function toggleItem(id) {
  var el  = document.getElementById('item-' + id);
  var chk = document.getElementById('chk-'  + id);
  if (!el || !chk) return;
  var itemKey = el.getAttribute('data-item-key') || id;
  var isChecked = bought.has(id);
  if (isChecked) {
    bought.delete(id);
    el.classList.remove('bought');
    chk.textContent = '';
  } else {
    bought.add(id);
    el.classList.add('bought');
    chk.textContent = '\u2713';
  }
  localStorage.setItem(SK, JSON.stringify([...bought]));
  updateRing();
  if (!isChecked && bought.size === totalCount) showToast('\u{1F389} All items checked \u2014 time to cook!', 'green');
  /* Sync to DB */
  fetch('/api/shopping/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ week_number: weekNum, item_key: itemKey, is_checked: !isChecked }),
  }).catch(function() { /* silently fail \u2014 localStorage keeps state */ });
}
window.toggleItem = toggleItem;

/* PROGRESS RING */
function updateRing() {
  const CIRC = 220;
  const pct  = totalCount > 0 ? Math.round((bought.size / totalCount) * 100) : 0;
  const ring = document.getElementById('progressRing');
  const pEl  = document.getElementById('progressPct');
  const tEl  = document.getElementById('progressText');
  const tipEl= document.getElementById('progressTip');
  if (ring) ring.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
  if (pEl)  pEl.textContent  = pct + '%';
  if (tEl)  tEl.textContent  = bought.size + ' / ' + totalCount + ' items';
  if (tipEl) {
    const tips = ['Start checking off items!','Keep going!','Halfway there \u{1F4AA}','Almost done!','All done! \u{1F389}'];
    tipEl.textContent = pct === 100 ? '\u{1F389} Shopping complete!' : tips[Math.floor(pct/25)] || tips[0];
  }
}

/* CATEGORY TOGGLE */
function toggleCat(id) {
  const card = document.getElementById('cat-' + id);
  if (card) card.classList.toggle('collapsed');
}
window.toggleCat = toggleCat;

/* BUDGET ALT TOOLTIP */
function toggleAlt(id) {
  document.querySelectorAll('.alt-tt.show').forEach(el => { if (el.id !== id) el.classList.remove('show'); });
  const tt = document.getElementById(id);
  if (tt) tt.classList.toggle('show');
}
window.toggleAlt = toggleAlt;
document.addEventListener('click', e => {
  if (!e.target.closest('.budget-badge') && !e.target.closest('.alt-tt')) {
    document.querySelectorAll('.alt-tt.show').forEach(el => el.classList.remove('show'));
  }
});

/* SEARCH */
document.getElementById('searchInput')?.addEventListener('input', function() {
  const q = this.value.toLowerCase().trim();
  document.querySelectorAll('.shop-item').forEach(el => {
    const name = el.querySelector('.item-name')?.textContent?.toLowerCase() || '';
    el.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
  document.querySelectorAll('.cat-card').forEach(card => {
    const vis = [...card.querySelectorAll('.shop-item')].filter(el => el.style.display !== 'none');
    card.style.display = (vis.length === 0 && q) ? 'none' : '';
  });
});

/* BUDGET MODE \u2014 dim non-budget items */
let budgetMode = false;
document.getElementById('budgetBtn')?.addEventListener('click', function() {
  budgetMode = !budgetMode;
  document.querySelectorAll('.shop-item').forEach(el => {
    el.style.opacity = (budgetMode && !el.querySelector('.budget-badge')) ? '.25' : '';
  });
  this.textContent = budgetMode ? '\u2715 All Items' : '\u{1F4B0} Budget Mode';
  this.style.background = budgetMode ? 'rgba(245,158,11,.15)' : '';
});

/* RESET */
document.getElementById('clearBtn')?.addEventListener('click', function() {
  if (!confirm('Reset all checked items?')) return;
  bought.clear();
  localStorage.removeItem(SK);
  document.querySelectorAll('.shop-item').forEach(function(el) { el.classList.remove('bought'); });
  document.querySelectorAll('[id^="chk-"]').forEach(function(el) { el.textContent = ''; });
  updateRing();
  showToast('\u21BA List reset', 'blue');
  /* Clear DB checks for this week */
  (checkedKeysArr || []).forEach(function(k) {
    fetch('/api/shopping/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week_number: weekNum, item_key: k, is_checked: false }),
    }).catch(function() {});
  });
});

/* COPY */
document.getElementById('copyBtn')?.addEventListener('click', () => {
  const lines = [\`\u{1F6D2} Keto Week \${weekNum} Shopping List\\n\`];
  document.querySelectorAll('.cat-card').forEach(card => {
    const catName = card.querySelector('.cat-name')?.textContent;
    const items   = [...card.querySelectorAll('.shop-item')];
    if (items.length > 0) {
      lines.push(\`\u2500\u2500 \${catName} \u2500\u2500\`);
      items.forEach(el => {
        const name = el.querySelector('.item-name')?.textContent || '';
        const qty  = el.querySelector('.item-qty')?.textContent  || '';
        const alt  = el.querySelector('.alt-name')?.textContent  || '';
        const done = el.classList.contains('bought') ? '\u2713' : '\u25CB';
        lines.push(\`\${done} \${name}\${qty ? '  ('+qty+')' : ''}\${alt ? '  \u2192 budget: '+alt.replace('\u2192 ','') : ''}\`);
      });
      lines.push('');
    }
  });
  navigator.clipboard?.writeText(lines.join('\\n')).then(() => showToast('\u{1F4CB} Copied to clipboard!', 'green'));
});

/* TOAST */
function showToast(msg, color) {
  const colors = { green:'linear-gradient(135deg,#10b981,#34d399)', blue:'linear-gradient(135deg,#3b82f6,#60a5fa)', gold:'linear-gradient(135deg,#f59e0b,#fbbf24)' };
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, { position:'fixed', top:'5rem', right:'1.5rem', zIndex:'9999', background:colors[color]||colors.green, color:'#fff', padding:'.875rem 1.5rem', borderRadius:'12px', fontWeight:'700', fontSize:'.875rem', boxShadow:'0 10px 30px rgba(0,0,0,.3)', animation:'fadeUp .35s ease both' });
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3200);
}

/* \u2500\u2500\u2500 CUSTOM ITEMS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

var catEmoji = { produce:'\u{1F96C}', meat:'\u{1F969}', dairy:'\u{1F9C0}', pantry:'\u{1F3FA}', other:'\u{1F4E6}' };

function refreshCustomCount() {
  var list = document.getElementById('customList');
  var countEl = document.getElementById('customCount');
  var emptyEl = document.getElementById('customEmpty');
  if (!list) return;
  var rows = list.querySelectorAll('.custom-item');
  if (countEl) countEl.textContent = rows.length;
  if (emptyEl) emptyEl.style.display = rows.length === 0 ? '' : 'none';
}

window.addCustomItem = function() {
  var nameEl = document.getElementById('ciName');
  var qtyEl  = document.getElementById('ciQty');
  var catEl  = document.getElementById('ciCat');
  if (!nameEl) return;
  var name = nameEl.value.trim();
  var qty  = qtyEl ? qtyEl.value.trim() : '';
  var cat  = catEl ? catEl.value : 'other';
  if (!name) { nameEl.focus(); return; }

  var btn = document.querySelector('.btn-add');
  if (btn) { btn.textContent = '\u2026'; btn.disabled = true; }

  fetch('/api/shopping/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, quantity: qty || null, category: cat }),
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (btn) { btn.textContent = '+ Add'; btn.disabled = false; }
    if (res.error) { showToast('Error: ' + res.error, 'gold'); return; }
    var item = res.item;
    var list = document.getElementById('customList');
    var emptyEl = document.getElementById('customEmpty');
    if (emptyEl) emptyEl.style.display = 'none';

    var row = document.createElement('div');
    row.className = 'custom-item';
    row.id = 'ci-' + item.id;
    row.innerHTML =
      '<div class="ci-chk" onclick="window.toggleCustomItem(\\'' + item.id + '\\',this)"></div>' +
      '<div class="ci-info">' +
        '<span class="ci-name">' + item.name + '</span>' +
        (item.quantity ? '<span class="ci-qty">' + item.quantity + '</span>' : '') +
        '<div><span class="ci-cat cat-' + (item.category||'other') + '">' + (item.category||'other') + '</span></div>' +
      '</div>' +
      '<button class="ci-del" onclick="window.deleteCustomItem(\\'' + item.id + '\\',this)" title="Remove">\xD7</button>';

    if (list) list.appendChild(row);
    nameEl.value = '';
    if (qtyEl) qtyEl.value = '';
    refreshCustomCount();
    showToast('\u2713 ' + item.name + ' added', 'green');
  })
  .catch(function() {
    if (btn) { btn.textContent = '+ Add'; btn.disabled = false; }
    showToast('Failed to add item', 'gold');
  });
};

window.toggleCustomItem = function(id, el) {
  var row = document.getElementById('ci-' + id);
  if (!row) return;
  var isDone = row.classList.contains('ci-done');
  var newState = !isDone;
  row.classList.toggle('ci-done', newState);
  if (el) el.textContent = newState ? '\u2713' : '';

  fetch('/api/shopping/custom', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, is_checked: newState }),
  }).catch(function() {
    row.classList.toggle('ci-done', isDone);
    if (el) el.textContent = isDone ? '\u2713' : '';
  });
};

window.deleteCustomItem = function(id, el) {
  var row = document.getElementById('ci-' + id);
  if (!row) return;
  row.style.opacity = '0.4';

  fetch('/api/shopping/custom', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id }),
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (res.error) { row.style.opacity = ''; showToast('Error: ' + res.error, 'gold'); return; }
    row.remove();
    refreshCustomCount();
    showToast('Removed', 'blue');
  })
  .catch(function() {
    row.style.opacity = '';
    showToast('Failed to remove', 'gold');
  });
};

refreshCustomCount();
})();<\/script> </body> </html>`], [`<html lang="en" data-astro-cid-5zea3vv2> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Smart Shopping List \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, '</head> <body data-astro-cid-5zea3vv2> <div class="bg-wrap" data-astro-cid-5zea3vv2><div class="orb o1" data-astro-cid-5zea3vv2></div><div class="orb o2" data-astro-cid-5zea3vv2></div></div> ', ' <div class="page" data-astro-cid-5zea3vv2> <!-- HEADER --> <div class="pg-header" data-astro-cid-5zea3vv2> <div class="pg-eyebrow" data-astro-cid-5zea3vv2>', ' Smart Shopping</div> <h1 class="pg-title" data-astro-cid-5zea3vv2>Week ', " Groceries, <em data-astro-cid-5zea3vv2>", '</em></h1> <p class="pg-sub" data-astro-cid-5zea3vv2>\nAuto-generated from your Week ', " meal plan (Day ", "\u2013", ") \xB7\n", " items \xB7 ", " shared across recipes\n", " ", ' </p> </div> <!-- STATS BAR --> <div class="stats-bar" data-astro-cid-5zea3vv2> <div class="sbar" style="animation-delay:.04s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--green);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Total Items</div></div> <div class="sbar" style="animation-delay:.08s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--gold);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Budget Swaps</div></div> <div class="sbar" style="animation-delay:.12s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--blue);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Meals Covered</div></div> <div class="sbar" style="animation-delay:.16s;" data-astro-cid-5zea3vv2><div class="sbar-val" style="color:var(--purple);" data-astro-cid-5zea3vv2>', '</div><div class="sbar-lbl" data-astro-cid-5zea3vv2>Shared Items</div></div> </div> <!-- WEEK TABS --> <div class="week-tabs" data-astro-cid-5zea3vv2> ', ' <button onclick="window.print()" class="wtab" style="border-style:dashed;cursor:pointer;background:none;border-color:var(--border);margin-left:auto;" data-astro-cid-5zea3vv2> <span class="wtab-label" data-astro-cid-5zea3vv2>Print</span> <span class="wtab-days" data-astro-cid-5zea3vv2>Full list</span> </button> </div> <!-- PERSONALIZATION BANNER --> <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1rem 1.4rem;margin-bottom:1.25rem;display:flex;align-items:center;flex-wrap:wrap;gap:.75rem;" data-astro-cid-5zea3vv2> <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0;" data-astro-cid-5zea3vv2> ', " ", " ", " ", " </div> ", " ", " ", ' <span style="margin-left:auto;font-size:.75rem;color:var(--soft);font-weight:600;" data-astro-cid-5zea3vv2>', " recipes \xB7 ", " unique ingredients</span> </div> <!-- THIS WEEK'S MEALS SUMMARY --> ", ' <!-- TOOLBAR --> <div class="toolbar" data-astro-cid-5zea3vv2> <div class="tool-search" data-astro-cid-5zea3vv2> <span style="color:var(--soft);" data-astro-cid-5zea3vv2>\u{1F50D}</span> <input type="text" id="searchInput" placeholder="Search ingredient\u2026" autocomplete="off" data-astro-cid-5zea3vv2> </div> <button class="tbtn gold" id="budgetBtn" data-astro-cid-5zea3vv2>', ' Budget Mode</button> <button class="tbtn" id="clearBtn" data-astro-cid-5zea3vv2>\u21BA Reset</button> <button class="tbtn" id="copyBtn" data-astro-cid-5zea3vv2>', ' Copy</button> <button class="tbtn g" onclick="window.print()" data-astro-cid-5zea3vv2>Print</button> </div> <!-- DIETARY CONFLICT ALERT --> ', ' <!-- MAIN LAYOUT --> <div class="main-layout" data-astro-cid-5zea3vv2> <!-- CATEGORIES --> <div id="shoppingList" data-astro-cid-5zea3vv2> ', ' </div> <!-- SIDEBAR --> <div class="sidebar" data-astro-cid-5zea3vv2> <!-- PROGRESS RING --> <div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>Shopping Progress</div> <div class="side-body" style="text-align:center;" data-astro-cid-5zea3vv2> <div class="ring-wrap" data-astro-cid-5zea3vv2> <svg class="rsvg" width="80" height="80" viewBox="0 0 80 80" data-astro-cid-5zea3vv2> <circle class="r-trk" cx="40" cy="40" r="35" data-astro-cid-5zea3vv2></circle> <circle class="r-fill" id="progressRing" cx="40" cy="40" r="35" style="stroke-dashoffset:220;" data-astro-cid-5zea3vv2></circle> </svg> <div class="ring-c" data-astro-cid-5zea3vv2> <div class="ring-pct" id="progressPct" data-astro-cid-5zea3vv2>0%</div> <div class="ring-lbl" data-astro-cid-5zea3vv2>bought</div> </div> </div> <div style="font-size:.75rem;color:var(--soft);" id="progressText" data-astro-cid-5zea3vv2>0 / ', ` items</div> <div style="margin-top:.875rem;font-size:.72rem;font-weight:700;color:var(--soft);" id="progressTip" data-astro-cid-5zea3vv2>Start checking off items as you shop!</div> </div> </div> <!-- BUDGET SUMMARY --> <div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>\u{1F4B0} Budget Intelligence</div> <div class="side-body" data-astro-cid-5zea3vv2> <div style="background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.15);border-radius:12px;padding:.875rem;margin-bottom:.875rem;" data-astro-cid-5zea3vv2> <div style="font-size:.73rem;font-weight:800;color:var(--green);margin-bottom:.25rem;" data-astro-cid-5zea3vv2>\u{1F9E0} Smart Tip</div> <div style="font-size:.71rem;color:var(--soft);line-height:1.6;" data-astro-cid-5zea3vv2>Buy proteins in bulk \u2014 freeze portions you won't use this week. Keto proteins repeat across your plan, so bulk buying cuts costs 30\u201350%.</div> </div> <div class="brow" data-astro-cid-5zea3vv2><span class="brow-lbl" data-astro-cid-5zea3vv2>Budget swaps available</span><span class="brow-val" style="color:var(--gold);" data-astro-cid-5zea3vv2>`, '</span></div> <div class="brow" data-astro-cid-5zea3vv2><span class="brow-lbl" data-astro-cid-5zea3vv2>Shared ingredients</span><span class="brow-val" style="color:var(--blue);" data-astro-cid-5zea3vv2>', '</span></div> <div class="brow" data-astro-cid-5zea3vv2><span class="brow-lbl" data-astro-cid-5zea3vv2>Potential savings</span><span class="brow-val" style="color:var(--green);" data-astro-cid-5zea3vv2>30\u201370%</span></div> </div> </div> <!-- CATEGORY JUMPS --> <div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>Jump to Category</div> <div class="side-body" data-astro-cid-5zea3vv2> ', " </div> </div> <!-- DIETARY PROFILE --> ", ' </div> </div> <!-- MY CUSTOM ITEMS --> <div class="custom-section" id="customSection" data-astro-cid-5zea3vv2> <div class="custom-header" data-astro-cid-5zea3vv2> <span style="font-size:1.4rem;" data-astro-cid-5zea3vv2>\u{1F4DD}</span> <h2 class="custom-title" data-astro-cid-5zea3vv2>My Custom Items</h2> <span style="font-size:.72rem;font-weight:700;color:var(--soft);background:var(--card);border:1px solid var(--border);padding:.15rem .55rem;border-radius:99px;" id="customCount" data-astro-cid-5zea3vv2>', '</span> </div> <div class="custom-add-form" data-astro-cid-5zea3vv2> <input type="text" id="ciName" class="inp-name" placeholder="Item name (e.g. Coconut oil)\u2026" autocomplete="off" data-astro-cid-5zea3vv2> <input type="text" id="ciQty" class="inp-qty" placeholder="Qty (e.g. 2 cups)" data-astro-cid-5zea3vv2> <select id="ciCat" class="inp-cat" data-astro-cid-5zea3vv2> <option value="produce" data-astro-cid-5zea3vv2>\u{1F96C} Produce</option> <option value="meat" data-astro-cid-5zea3vv2>\u{1F969} Meat</option> <option value="dairy" data-astro-cid-5zea3vv2>\u{1F9C0} Dairy</option> <option value="pantry" data-astro-cid-5zea3vv2>\u{1F3FA} Pantry</option> <option value="other" selected data-astro-cid-5zea3vv2>\u{1F4E6} Other</option> </select> <button class="btn-add" onclick="window.addCustomItem()" data-astro-cid-5zea3vv2>+ Add</button> </div> <div class="custom-list" id="customList" data-astro-cid-5zea3vv2> ', " </div> </div> </div> <script>(function(){", `
/* CHECKED STATE \u2014 DB-backed, localStorage as fallback */
var SK    = 'keto-shop-w' + weekNum;
/* seed bought set from DB-loaded keys (by item-key attr) */
var bought = new Set();
/* map itemKey \u2192 elementId for fast lookup */
var keyToId = {};
document.querySelectorAll('.shop-item[data-item-key]').forEach(function(el) {
  var k = el.getAttribute('data-item-key');
  var id = el.id.replace('item-', '');
  keyToId[k] = id;
});
/* initialize from server-rendered DB state */
(checkedKeysArr || []).forEach(function(k) {
  var id = keyToId[k];
  if (id) bought.add(id);
});
/* also restore any localStorage keys not in DB (offline resilience) */
var lsKeys = JSON.parse(localStorage.getItem(SK) || '[]');
lsKeys.forEach(function(id) { bought.add(id); });
updateRing();

/* TOGGLE ITEM */
function toggleItem(id) {
  var el  = document.getElementById('item-' + id);
  var chk = document.getElementById('chk-'  + id);
  if (!el || !chk) return;
  var itemKey = el.getAttribute('data-item-key') || id;
  var isChecked = bought.has(id);
  if (isChecked) {
    bought.delete(id);
    el.classList.remove('bought');
    chk.textContent = '';
  } else {
    bought.add(id);
    el.classList.add('bought');
    chk.textContent = '\u2713';
  }
  localStorage.setItem(SK, JSON.stringify([...bought]));
  updateRing();
  if (!isChecked && bought.size === totalCount) showToast('\u{1F389} All items checked \u2014 time to cook!', 'green');
  /* Sync to DB */
  fetch('/api/shopping/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ week_number: weekNum, item_key: itemKey, is_checked: !isChecked }),
  }).catch(function() { /* silently fail \u2014 localStorage keeps state */ });
}
window.toggleItem = toggleItem;

/* PROGRESS RING */
function updateRing() {
  const CIRC = 220;
  const pct  = totalCount > 0 ? Math.round((bought.size / totalCount) * 100) : 0;
  const ring = document.getElementById('progressRing');
  const pEl  = document.getElementById('progressPct');
  const tEl  = document.getElementById('progressText');
  const tipEl= document.getElementById('progressTip');
  if (ring) ring.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
  if (pEl)  pEl.textContent  = pct + '%';
  if (tEl)  tEl.textContent  = bought.size + ' / ' + totalCount + ' items';
  if (tipEl) {
    const tips = ['Start checking off items!','Keep going!','Halfway there \u{1F4AA}','Almost done!','All done! \u{1F389}'];
    tipEl.textContent = pct === 100 ? '\u{1F389} Shopping complete!' : tips[Math.floor(pct/25)] || tips[0];
  }
}

/* CATEGORY TOGGLE */
function toggleCat(id) {
  const card = document.getElementById('cat-' + id);
  if (card) card.classList.toggle('collapsed');
}
window.toggleCat = toggleCat;

/* BUDGET ALT TOOLTIP */
function toggleAlt(id) {
  document.querySelectorAll('.alt-tt.show').forEach(el => { if (el.id !== id) el.classList.remove('show'); });
  const tt = document.getElementById(id);
  if (tt) tt.classList.toggle('show');
}
window.toggleAlt = toggleAlt;
document.addEventListener('click', e => {
  if (!e.target.closest('.budget-badge') && !e.target.closest('.alt-tt')) {
    document.querySelectorAll('.alt-tt.show').forEach(el => el.classList.remove('show'));
  }
});

/* SEARCH */
document.getElementById('searchInput')?.addEventListener('input', function() {
  const q = this.value.toLowerCase().trim();
  document.querySelectorAll('.shop-item').forEach(el => {
    const name = el.querySelector('.item-name')?.textContent?.toLowerCase() || '';
    el.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
  document.querySelectorAll('.cat-card').forEach(card => {
    const vis = [...card.querySelectorAll('.shop-item')].filter(el => el.style.display !== 'none');
    card.style.display = (vis.length === 0 && q) ? 'none' : '';
  });
});

/* BUDGET MODE \u2014 dim non-budget items */
let budgetMode = false;
document.getElementById('budgetBtn')?.addEventListener('click', function() {
  budgetMode = !budgetMode;
  document.querySelectorAll('.shop-item').forEach(el => {
    el.style.opacity = (budgetMode && !el.querySelector('.budget-badge')) ? '.25' : '';
  });
  this.textContent = budgetMode ? '\u2715 All Items' : '\u{1F4B0} Budget Mode';
  this.style.background = budgetMode ? 'rgba(245,158,11,.15)' : '';
});

/* RESET */
document.getElementById('clearBtn')?.addEventListener('click', function() {
  if (!confirm('Reset all checked items?')) return;
  bought.clear();
  localStorage.removeItem(SK);
  document.querySelectorAll('.shop-item').forEach(function(el) { el.classList.remove('bought'); });
  document.querySelectorAll('[id^="chk-"]').forEach(function(el) { el.textContent = ''; });
  updateRing();
  showToast('\u21BA List reset', 'blue');
  /* Clear DB checks for this week */
  (checkedKeysArr || []).forEach(function(k) {
    fetch('/api/shopping/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week_number: weekNum, item_key: k, is_checked: false }),
    }).catch(function() {});
  });
});

/* COPY */
document.getElementById('copyBtn')?.addEventListener('click', () => {
  const lines = [\\\`\u{1F6D2} Keto Week \\\${weekNum} Shopping List\\\\n\\\`];
  document.querySelectorAll('.cat-card').forEach(card => {
    const catName = card.querySelector('.cat-name')?.textContent;
    const items   = [...card.querySelectorAll('.shop-item')];
    if (items.length > 0) {
      lines.push(\\\`\u2500\u2500 \\\${catName} \u2500\u2500\\\`);
      items.forEach(el => {
        const name = el.querySelector('.item-name')?.textContent || '';
        const qty  = el.querySelector('.item-qty')?.textContent  || '';
        const alt  = el.querySelector('.alt-name')?.textContent  || '';
        const done = el.classList.contains('bought') ? '\u2713' : '\u25CB';
        lines.push(\\\`\\\${done} \\\${name}\\\${qty ? '  ('+qty+')' : ''}\\\${alt ? '  \u2192 budget: '+alt.replace('\u2192 ','') : ''}\\\`);
      });
      lines.push('');
    }
  });
  navigator.clipboard?.writeText(lines.join('\\\\n')).then(() => showToast('\u{1F4CB} Copied to clipboard!', 'green'));
});

/* TOAST */
function showToast(msg, color) {
  const colors = { green:'linear-gradient(135deg,#10b981,#34d399)', blue:'linear-gradient(135deg,#3b82f6,#60a5fa)', gold:'linear-gradient(135deg,#f59e0b,#fbbf24)' };
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, { position:'fixed', top:'5rem', right:'1.5rem', zIndex:'9999', background:colors[color]||colors.green, color:'#fff', padding:'.875rem 1.5rem', borderRadius:'12px', fontWeight:'700', fontSize:'.875rem', boxShadow:'0 10px 30px rgba(0,0,0,.3)', animation:'fadeUp .35s ease both' });
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3200);
}

/* \u2500\u2500\u2500 CUSTOM ITEMS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

var catEmoji = { produce:'\u{1F96C}', meat:'\u{1F969}', dairy:'\u{1F9C0}', pantry:'\u{1F3FA}', other:'\u{1F4E6}' };

function refreshCustomCount() {
  var list = document.getElementById('customList');
  var countEl = document.getElementById('customCount');
  var emptyEl = document.getElementById('customEmpty');
  if (!list) return;
  var rows = list.querySelectorAll('.custom-item');
  if (countEl) countEl.textContent = rows.length;
  if (emptyEl) emptyEl.style.display = rows.length === 0 ? '' : 'none';
}

window.addCustomItem = function() {
  var nameEl = document.getElementById('ciName');
  var qtyEl  = document.getElementById('ciQty');
  var catEl  = document.getElementById('ciCat');
  if (!nameEl) return;
  var name = nameEl.value.trim();
  var qty  = qtyEl ? qtyEl.value.trim() : '';
  var cat  = catEl ? catEl.value : 'other';
  if (!name) { nameEl.focus(); return; }

  var btn = document.querySelector('.btn-add');
  if (btn) { btn.textContent = '\u2026'; btn.disabled = true; }

  fetch('/api/shopping/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, quantity: qty || null, category: cat }),
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (btn) { btn.textContent = '+ Add'; btn.disabled = false; }
    if (res.error) { showToast('Error: ' + res.error, 'gold'); return; }
    var item = res.item;
    var list = document.getElementById('customList');
    var emptyEl = document.getElementById('customEmpty');
    if (emptyEl) emptyEl.style.display = 'none';

    var row = document.createElement('div');
    row.className = 'custom-item';
    row.id = 'ci-' + item.id;
    row.innerHTML =
      '<div class="ci-chk" onclick="window.toggleCustomItem(\\\\'' + item.id + '\\\\',this)"></div>' +
      '<div class="ci-info">' +
        '<span class="ci-name">' + item.name + '</span>' +
        (item.quantity ? '<span class="ci-qty">' + item.quantity + '</span>' : '') +
        '<div><span class="ci-cat cat-' + (item.category||'other') + '">' + (item.category||'other') + '</span></div>' +
      '</div>' +
      '<button class="ci-del" onclick="window.deleteCustomItem(\\\\'' + item.id + '\\\\',this)" title="Remove">\xD7</button>';

    if (list) list.appendChild(row);
    nameEl.value = '';
    if (qtyEl) qtyEl.value = '';
    refreshCustomCount();
    showToast('\u2713 ' + item.name + ' added', 'green');
  })
  .catch(function() {
    if (btn) { btn.textContent = '+ Add'; btn.disabled = false; }
    showToast('Failed to add item', 'gold');
  });
};

window.toggleCustomItem = function(id, el) {
  var row = document.getElementById('ci-' + id);
  if (!row) return;
  var isDone = row.classList.contains('ci-done');
  var newState = !isDone;
  row.classList.toggle('ci-done', newState);
  if (el) el.textContent = newState ? '\u2713' : '';

  fetch('/api/shopping/custom', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, is_checked: newState }),
  }).catch(function() {
    row.classList.toggle('ci-done', isDone);
    if (el) el.textContent = isDone ? '\u2713' : '';
  });
};

window.deleteCustomItem = function(id, el) {
  var row = document.getElementById('ci-' + id);
  if (!row) return;
  row.style.opacity = '0.4';

  fetch('/api/shopping/custom', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id }),
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (res.error) { row.style.opacity = ''; showToast('Error: ' + res.error, 'gold'); return; }
    row.remove();
    refreshCustomCount();
    showToast('Removed', 'blue');
  })
  .catch(function() {
    row.style.opacity = '';
    showToast('Failed to remove', 'gold');
  });
};

refreshCustomCount();
})();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "shopping", "data-astro-cid-5zea3vv2": true }), renderComponent($$result, "ShoppingCart", $$ShoppingCart, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-5zea3vv2": true }), viewWeek, userName, viewWeek, startDay, endDay, totalItems, sharedCount, budgetCount > 0 && ` \xB7 ${budgetCount} budget swaps available`, restrictions.length > 0 && ` \xB7 Adjusted for your dietary preferences`, totalItems, budgetCount, uniqueMeals, sharedCount, weekTabs.map((w) => renderTemplate`<a${addAttribute(`/dashboard/shopping?week=${w.w}`, "href")}${addAttribute(`wtab ${w.active ? "active" : ""} ${w.past ? "past" : ""}`, "class")} data-astro-cid-5zea3vv2> <span class="wtab-label" data-astro-cid-5zea3vv2>${w.label}</span> <span class="wtab-days" data-astro-cid-5zea3vv2>${w.days}</span> ${w.current && renderTemplate`<span class="wtab-badge" data-astro-cid-5zea3vv2>now</span>`} ${w.past && renderTemplate`<span class="wtab-badge" data-astro-cid-5zea3vv2>done</span>`} </a>`), userGoal === "weight_loss" && renderTemplate`<span style="font-size:.8rem;font-weight:800;color:var(--green);background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);padding:.25rem .75rem;border-radius:99px;" data-astro-cid-5zea3vv2>${renderComponent($$result, "Target", $$Target, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-5zea3vv2": true })} Weight Loss Plan</span>`, userGoal === "muscle_gain" && renderTemplate`<span style="font-size:.8rem;font-weight:800;color:var(--blue);background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);padding:.25rem .75rem;border-radius:99px;" data-astro-cid-5zea3vv2>Muscle Gain Plan</span>`, userGoal === "maintenance" && renderTemplate`<span style="font-size:.8rem;font-weight:800;color:var(--purple);background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);padding:.25rem .75rem;border-radius:99px;" data-astro-cid-5zea3vv2>Maintenance</span>`, userGoal !== "weight_loss" && userGoal !== "muscle_gain" && userGoal !== "maintenance" && renderTemplate`<span style="font-size:.8rem;font-weight:800;color:var(--green);background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);padding:.25rem .75rem;border-radius:99px;" data-astro-cid-5zea3vv2>${renderComponent($$result, "Target", $$Target, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-5zea3vv2": true })} Keto Plan</span>`, restrictions.includes("no_pork") && renderTemplate`<span style="font-size:.75rem;font-weight:800;color:var(--soft);background:var(--card2);border:1px solid var(--border);padding:.2rem .65rem;border-radius:99px;" data-astro-cid-5zea3vv2>🐷 No Pork</span>`, restrictions.includes("vegetarian") && renderTemplate`<span style="font-size:.75rem;font-weight:800;color:var(--soft);background:var(--card2);border:1px solid var(--border);padding:.2rem .65rem;border-radius:99px;" data-astro-cid-5zea3vv2>🌱 Vegetarian</span>`, restrictions.includes("no_seafood") && renderTemplate`<span style="font-size:.75rem;font-weight:800;color:var(--soft);background:var(--card2);border:1px solid var(--border);padding:.2rem .65rem;border-radius:99px;" data-astro-cid-5zea3vv2>🦐 No Seafood</span>`, filteredMealPlans.length, totalItems, filteredMealPlans.length > 0 && renderTemplate`<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1rem 1.4rem;margin-bottom:1.25rem;" data-astro-cid-5zea3vv2> <div style="font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--soft);margin-bottom:.875rem;" data-astro-cid-5zea3vv2>This Week's Meals</div> <div style="display:flex;flex-wrap:wrap;gap:.5rem;" data-astro-cid-5zea3vv2> ${filteredMealPlans.map((meal) => renderTemplate`<div style="background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:.4rem .75rem;flex-shrink:0;" data-astro-cid-5zea3vv2> <span style="font-size:.65rem;font-weight:800;color:var(--green);text-transform:uppercase;margin-right:.35rem;" data-astro-cid-5zea3vv2>Day ${meal.day_number}</span> <span style="font-size:.72rem;color:var(--text);" data-astro-cid-5zea3vv2>${meal.recipe && meal.recipe.title ? meal.recipe.title : "Meal"}</span> </div>`)} </div> </div>`, renderComponent($$result, "Tag", $$Tag, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-5zea3vv2": true }), renderComponent($$result, "CheckSquare", $$CheckSquare, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-5zea3vv2": true }), flaggedCount > 0 && renderTemplate`<div class="alert" data-astro-cid-5zea3vv2> <div class="alert-icon" data-astro-cid-5zea3vv2>${renderComponent($$result, "AlertTriangle", $$AlertTriangle, { "size": 20, "data-astro-cid-5zea3vv2": true })}</div> <div data-astro-cid-5zea3vv2> <div class="alert-title" data-astro-cid-5zea3vv2>${flaggedCount} item${flaggedCount > 1 ? "s" : ""} conflict with your dietary preferences</div> <div class="alert-text" data-astro-cid-5zea3vv2>Flagged items appear in the list below. Use budget swaps or contact support to adjust your plan.</div> </div> </div>`, totalItems === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-5zea3vv2> <div class="es-icon" data-astro-cid-5zea3vv2>${renderComponent($$result, "ShoppingCart", $$ShoppingCart, { "size": 48, "color": "var(--soft)", "data-astro-cid-5zea3vv2": true })}</div> <div class="es-title" data-astro-cid-5zea3vv2>No meals found for Week ${viewWeek}</div> <div class="es-sub" data-astro-cid-5zea3vv2>Your meal plan doesn't have recipes for Day ${startDay}–${endDay} yet.<br data-astro-cid-5zea3vv2>Check back once your plan is fully loaded.</div> </div>` : activeCats.map(([catName, items]) => renderTemplate`<div class="cat-card"${addAttribute(`cat-${catName.replace(/[\s&]+/g, "-")}`, "id")} data-astro-cid-5zea3vv2> <div class="cat-head"${addAttribute(`toggleCat('${catName.replace(/[\s&]+/g, "-")}')`, "onclick")} data-astro-cid-5zea3vv2> <div class="cat-ico"${addAttribute(`background:${catDefs[catName]?.bg || "rgba(107,114,128,.1)"};`, "style")} data-astro-cid-5zea3vv2>${catDefs[catName]?.icon || "\u{1F4E6}"}</div> <span class="cat-name" data-astro-cid-5zea3vv2>${catName}</span> <span class="cat-count"${addAttribute(`background:${catDefs[catName]?.bg || "rgba(107,114,128,.1)"};color:${catDefs[catName]?.color || "var(--soft)"};`, "style")} data-astro-cid-5zea3vv2>${items.length}</span> <span class="cat-arrow" data-astro-cid-5zea3vv2>▾</span> </div> <div class="cat-body" data-astro-cid-5zea3vv2> ${items.map((ing, idx) => renderTemplate`<div${addAttribute(`shop-item${checkedKeySet.has(ing.item.toLowerCase().trim()) ? " bought" : ""}`, "class")}${addAttribute(`item-${catName.replace(/[\s&]+/g, "-")}-${idx}`, "id")}${addAttribute(ing.item.toLowerCase().trim(), "data-item-key")}${addAttribute(`toggleItem('${catName.replace(/[\s&]+/g, "-")}-${idx}')`, "onclick")} data-astro-cid-5zea3vv2> <div class="item-chk"${addAttribute(`chk-${catName.replace(/[\s&]+/g, "-")}-${idx}`, "id")} data-astro-cid-5zea3vv2>${checkedKeySet.has(ing.item.toLowerCase().trim()) ? "\u2713" : ""}</div> <div class="item-info" data-astro-cid-5zea3vv2> <div class="item-name" data-astro-cid-5zea3vv2>${ing.item}</div> <div class="item-meta" data-astro-cid-5zea3vv2> ${(ing.amount > 0 || ing.unit) && renderTemplate`<span class="item-qty" data-astro-cid-5zea3vv2>${ing.amount > 0 ? ing.amount : ""}${ing.unit ? ` ${ing.unit}` : ""}</span>`} ${ing.count > 1 && renderTemplate`<span class="item-uses" data-astro-cid-5zea3vv2>× ${ing.count} recipes</span>`} ${ing.flag && renderTemplate`<span class="item-flag" data-astro-cid-5zea3vv2>${ing.flag}</span>`} </div> </div> ${ing.budgetAlt && renderTemplate`<div class="budget-wrap" data-astro-cid-5zea3vv2> <div class="budget-badge"${addAttribute(`event.stopPropagation();toggleAlt('alt-${catName.replace(/[\s&]+/g, "-")}-${idx}')`, "onclick")} data-astro-cid-5zea3vv2>
💰 -${ing.budgetAlt.save} </div> <div class="alt-tt"${addAttribute(`alt-${catName.replace(/[\s&]+/g, "-")}-${idx}`, "id")} data-astro-cid-5zea3vv2> <div class="alt-tt-lbl" data-astro-cid-5zea3vv2>💰 Budget Alternative</div> <div class="alt-name" data-astro-cid-5zea3vv2>→ ${ing.budgetAlt.alt}</div> <div class="alt-save" data-astro-cid-5zea3vv2>Up to ${ing.budgetAlt.save} cheaper</div> <div class="alt-tip" data-astro-cid-5zea3vv2>💡 ${ing.budgetAlt.tip}</div> </div> </div>`} </div>`)} </div> </div>`), totalItems, budgetCount, sharedCount, activeCats.map(([catName]) => renderTemplate`<a${addAttribute(`#cat-${catName.replace(/[\s&]+/g, "-")}`, "href")} class="cat-jump"${addAttribute(`background:${catDefs[catName]?.bg || "rgba(107,114,128,.07)"};color:${catDefs[catName]?.color || "var(--soft)"};`, "style")} data-astro-cid-5zea3vv2> <span data-astro-cid-5zea3vv2>${catDefs[catName]?.icon || "\u{1F4E6}"}</span> <span style="color:var(--text);" data-astro-cid-5zea3vv2>${catName}</span> </a>`), restrictions.length > 0 && renderTemplate`<div class="side-card" data-astro-cid-5zea3vv2> <div class="side-head" data-astro-cid-5zea3vv2>Your Dietary Profile</div> <div class="side-body" data-astro-cid-5zea3vv2> <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem;" data-astro-cid-5zea3vv2> ${restrictions.map((r) => renderTemplate`<span style="padding:.25rem .65rem;border-radius:99px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);font-size:.7rem;font-weight:800;color:var(--green);" data-astro-cid-5zea3vv2>✓ ${r.replace(/_/g, " ")}</span>`)} </div> <div style="font-size:.7rem;color:var(--soft);line-height:1.55;" data-astro-cid-5zea3vv2>Items conflicting with your preferences are flagged ⚠️ in the list.</div> </div> </div>`, myItems.length, myItems.length === 0 ? renderTemplate`<div class="custom-empty" id="customEmpty" data-astro-cid-5zea3vv2>Add your own items above</div>` : myItems.map((it) => renderTemplate`<div${addAttribute(`custom-item${it.is_checked ? " ci-done" : ""}`, "class")}${addAttribute(`ci-${it.id}`, "id")} data-astro-cid-5zea3vv2> <div class="ci-chk"${addAttribute(`window.toggleCustomItem('${it.id}',this)`, "onclick")} data-astro-cid-5zea3vv2>${it.is_checked ? "\u2713" : ""}</div> <div class="ci-info" data-astro-cid-5zea3vv2> <span class="ci-name" data-astro-cid-5zea3vv2>${it.name}</span> ${it.quantity && renderTemplate`<span class="ci-qty" data-astro-cid-5zea3vv2>${it.quantity}</span>`} <div data-astro-cid-5zea3vv2><span${addAttribute(`ci-cat cat-${it.category || "other"}`, "class")} data-astro-cid-5zea3vv2>${it.category || "other"}</span></div> </div> <button class="ci-del"${addAttribute(`window.deleteCustomItem('${it.id}',this)`, "onclick")} title="Remove" data-astro-cid-5zea3vv2>×</button> </div>`), defineScriptVars({ totalCount: totalItems, weekNum: viewWeek, checkedKeysArr }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/shopping.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/shopping.astro";
const $$url = "/dashboard/shopping";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Shopping,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
