/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, r as renderComponent, g as addAttribute, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$UtensilsCrossed } from '../../chunks/UtensilsCrossed_CmfPppog.mjs';
import { $ as $$ShoppingCart } from '../../chunks/ShoppingCart_CxlP89GQ.mjs';
import { $ as $$CheckSquare } from '../../chunks/CheckSquare_DW0yTG8K.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$MealPrep = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MealPrep;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const { data: savedPlan, error: loadError } = await supabase.from("meal_prep_plans").select("id, week_start_date, plan_data, created_at").eq("user_id", user.id).order("week_start_date", { ascending: false }).limit(1).maybeSingle();
  const planData = savedPlan?.plan_data || {};
  const savedDate = savedPlan?.week_start_date || "";
  const loadErrMsg = loadError ? loadError.message : "";
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const SLOTS = ["breakfast", "lunch", "dinner"];
  const SLOT_LABELS = { breakfast: "\u{1F305} Breakfast", lunch: "\u2600\uFE0F Lunch", dinner: "\u{1F319} Dinner" };
  const planDataJson = JSON.stringify(planData);
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-pg2wspgb> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Meal Prep Planner \xB7 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,700&family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">', "</head> <body data-astro-cid-pg2wspgb> ", ' <main class="mp-page" data-astro-cid-pg2wspgb> <!-- \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <header class="mp-hero" data-astro-cid-pg2wspgb> <div class="mp-hero-inner" data-astro-cid-pg2wspgb> <div data-astro-cid-pg2wspgb> <h1 class="mp-title" data-astro-cid-pg2wspgb>', ' Meal Prep Planner</h1> <p class="mp-sub" data-astro-cid-pg2wspgb>Plan your full week of keto meals \u2014 then save &amp; shop smarter.</p> ', " ", ' </div> <button class="mp-btn-save" onclick="window.savePlan()" data-astro-cid-pg2wspgb> ', ' Save Plan\n</button> </div> </header> <!-- \u2500\u2500 Status messages \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div id="mpStatus" class="mp-status" style="display:none" data-astro-cid-pg2wspgb></div> <!-- \u2500\u2500 Weekly Grid \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <section class="mp-grid-section" data-astro-cid-pg2wspgb> <div class="mp-grid" id="mpGrid" data-astro-cid-pg2wspgb> ', ' </div> </section> <!-- \u2500\u2500 Shopping Needs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <section class="mp-shop-section" data-astro-cid-pg2wspgb> <div class="mp-shop-header" data-astro-cid-pg2wspgb> <h2 class="mp-shop-title" data-astro-cid-pg2wspgb>', ' Shopping Needs</h2> <p class="mp-shop-sub" data-astro-cid-pg2wspgb>Auto-generated from your typed meal names. Fill in your plan above to see suggestions.</p> </div> <div id="mpShopList" class="mp-shop-grid" data-astro-cid-pg2wspgb> <p class="mp-shop-empty" data-astro-cid-pg2wspgb>Start filling in meals above \u2014 ingredient suggestions will appear here.</p> </div> </section> </main>  <script>(function(){', `
(function () {

  /* \u2500\u2500 State: live plan in memory \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  var plan = {};
  try { plan = JSON.parse(planDataJson) || {}; } catch(e) { plan = {}; }

  var days = JSON.parse(DAYS);

  /* \u2500\u2500 Ingredient hints (mirrors server-side map) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  var hints = {
    eggs:         ['Eggs (1 doz)', 'Butter (2 tbsp)', 'Salt & pepper'],
    omelette:     ['Eggs (3)', 'Cheese (30g)', 'Spinach (handful)', 'Butter'],
    bacon:        ['Bacon (200g)', 'Parchment paper'],
    avocado:      ['Avocado (2)', 'Lemon (1)', 'Salt'],
    salad:        ['Lettuce/greens (1 bag)', 'Olive oil (2 tbsp)', 'Cucumber', 'Cherry tomatoes'],
    chicken:      ['Chicken breast/thighs (500g)', 'Olive oil', 'Garlic (3 cloves)', 'Herbs'],
    beef:         ['Ground beef / steak (400g)', 'Olive oil', 'Garlic', 'Salt & pepper'],
    salmon:       ['Salmon fillet (2\xD7150g)', 'Lemon (1)', 'Butter (2 tbsp)', 'Dill'],
    steak:        ['Steak (300g)', 'Butter (30g)', 'Garlic (2 cloves)', 'Rosemary'],
    soup:         ['Bone broth / stock (500ml)', 'Cream (100ml)', 'Onion (1)', 'Garlic'],
    cauliflower:  ['Cauliflower (1 head)', 'Butter (2 tbsp)', 'Cream (50ml)'],
    zucchini:     ['Zucchini (2)', 'Olive oil', 'Parmesan (20g)'],
    shrimp:       ['Shrimp (250g)', 'Butter (2 tbsp)', 'Garlic (3 cloves)', 'Lemon (1)'],
    tuna:         ['Tuna (1 can)', 'Mayo (2 tbsp)', 'Celery (1 stalk)', 'Mustard'],
    burger:       ['Ground beef (400g)', 'Lettuce leaves', 'Cheese (40g)', 'Pickles', 'Mustard'],
    wrap:         ['Lettuce wraps (8 leaves)', 'Chicken (300g)', 'Avocado (1)', 'Cream cheese'],
    bowl:         ['Mixed greens (1 bag)', 'Protein of choice (200g)', 'Olive oil', 'Lemon'],
    stir:         ['Broccoli (1 head)', 'Soy sauce (3 tbsp)', 'Sesame oil (1 tbsp)', 'Garlic'],
    casserole:    ['Ground beef (400g)', 'Cream (200ml)', 'Cheese (100g)', 'Spinach'],
    smoothie:     ['Avocado (1)', 'Coconut milk (200ml)', 'Protein powder (1 scoop)', 'Ice'],
    pancakes:     ['Almond flour (120g)', 'Eggs (3)', 'Cream cheese (60g)', 'Butter'],
    muffins:      ['Almond flour (200g)', 'Eggs (3)', 'Butter (60g)', 'Baking powder'],
    coffee:       ['Coffee beans / grounds', 'Heavy cream (50ml)', 'Butter (1 tbsp)'],
  };

  /* \u2500\u2500 Category definitions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  var cats = {
    'Protein & Meat':   { icon: '\u{1F969}', kw: ['egg','chicken','beef','steak','bacon','salmon','tuna','shrimp','lamb','pork','turkey','fish'] },
    'Dairy & Cheese':   { icon: '\u{1F9C0}', kw: ['cheese','butter','cream','ghee','milk','parmesan','mozzarella','cheddar','ricotta','kefir'] },
    'Fresh Produce':    { icon: '\u{1F96C}', kw: ['avocado','spinach','lettuce','broccoli','cauliflower','zucchini','cucumber','tomato','celery','lemon','onion'] },
    'Pantry & Oils':    { icon: '\u{1F3FA}', kw: ['olive oil','coconut','almond flour','soy sauce','mustard','mayo','broth','stock','vinegar','baking'] },
    'Herbs & Spices':   { icon: '\u{1F33F}', kw: ['salt','pepper','garlic','dill','rosemary','herbs','paprika','thyme','basil','oregano','ginger'] },
  };

  /* \u2500\u2500 Listen to inputs already rendered in the DOM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  document.querySelectorAll('.mp-input').forEach(function(inp) {
    inp.addEventListener('input', function() { window.onMealInput(inp); });
  });

  /* \u2500\u2500 onMealInput: update plan state + refresh shopping \u2500\u2500\u2500\u2500 */
  window.onMealInput = function(el) {
    var day   = el.getAttribute('data-day');
    var slot  = el.getAttribute('data-slot');
    var field = el.getAttribute('data-field');
    var val   = el.value.trim();

    if (!plan[day]) plan[day] = {};
    if (!plan[day][slot]) plan[day][slot] = { name: '', prepTime: '' };
    plan[day][slot][field] = val;

    refreshShopping();
  };

  /* \u2500\u2500 Gather ingredient suggestions from typed meal names \u2500\u2500 */
  function buildShoppingList() {
    var collected = {}; // category \u2192 Set of items

    Object.keys(plan).forEach(function(day) {
      Object.keys(plan[day]).forEach(function(slot) {
        var name = (plan[day][slot].name || '').toLowerCase();
        if (!name) return;

        var matched = false;
        Object.keys(hints).forEach(function(kw) {
          if (name.indexOf(kw) !== -1) {
            matched = true;
            var items = hints[kw];
            items.forEach(function(item) {
              var catKey = categorizItem(item);
              if (!collected[catKey]) collected[catKey] = {};
              collected[catKey][item] = true;
            });
          }
        });

        // Always add base keto pantry if any meal is typed
        if (matched) {
          var baseItems = ['Olive oil (general)', 'Salt & pepper', 'Garlic (bulb)'];
          baseItems.forEach(function(item) {
            var catKey = categorizItem(item);
            if (!collected[catKey]) collected[catKey] = {};
            collected[catKey][item] = true;
          });
        }
      });
    });

    return collected;
  }

  function categorizItem(item) {
    var lower = item.toLowerCase();
    var found = 'Other';
    Object.keys(cats).forEach(function(catName) {
      cats[catName].kw.forEach(function(kw) {
        if (lower.indexOf(kw) !== -1) { found = catName; }
      });
    });
    return found;
  }

  function refreshShopping() {
    var container = document.getElementById('mpShopList');
    if (!container) return;

    var list = buildShoppingList();
    var catKeys = Object.keys(list);

    if (catKeys.length === 0) {
      container.innerHTML = '<p class="mp-shop-empty">Start filling in meals above \u2014 ingredient suggestions will appear here.</p>';
      return;
    }

    var html = '';
    catKeys.forEach(function(cat) {
      var catDef = cats[cat] || { icon: '\u{1F4E6}' };
      var items = Object.keys(list[cat]);
      if (!items.length) return;

      html += '<div class="mp-shop-cat">';
      html += '<div class="mp-shop-cat-title">' + catDef.icon + ' ' + cat + '</div>';
      items.forEach(function(itm) {
        html += '<div class="mp-shop-item"><span class="mp-shop-dot"></span>' + itm + '</div>';
      });
      html += '</div>';
    });

    container.innerHTML = html || '<p class="mp-shop-empty">No suggestions yet \u2014 type some meal names above.</p>';
  }

  /* \u2500\u2500 savePlan: POST to /api/meal-prep/save \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  window.savePlan = function() {
    var btn = document.querySelector('.mp-btn-save');
    var statusEl = document.getElementById('mpStatus');

    // Collect current values directly from DOM inputs
    var freshPlan = {};
    document.querySelectorAll('.mp-input').forEach(function(inp) {
      var day   = inp.getAttribute('data-day');
      var slot  = inp.getAttribute('data-slot');
      var field = inp.getAttribute('data-field');
      var val   = inp.value.trim();
      if (!freshPlan[day]) freshPlan[day] = {};
      if (!freshPlan[day][slot]) freshPlan[day][slot] = { name: '', prepTime: '' };
      freshPlan[day][slot][field] = val;
    });

    // Derive this-week Monday
    var now = new Date();
    var dow = now.getDay();
    var diff = (dow === 0) ? -6 : 1 - dow;
    var mon = new Date(now);
    mon.setDate(now.getDate() + diff);
    var weekStart = mon.toISOString().split('T')[0];

    if (btn) { btn.disabled = true; btn.textContent = '\u23F3 Saving\u2026'; }
    if (statusEl) { statusEl.style.display = 'none'; }

    fetch('/api/meal-prep/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_data: freshPlan, week_start_date: weekStart }),
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.textContent = '\u{1F4BE} Save Plan'; }
      if (statusEl) {
        statusEl.style.display = 'block';
        if (data.success) {
          statusEl.className = 'mp-status ok';
          statusEl.textContent = '\u2705 Meal prep plan saved for the week of ' + weekStart + '!';
          plan = freshPlan;
        } else {
          statusEl.className = 'mp-status error';
          statusEl.textContent = '\u274C Save failed: ' + (data.error || 'Unknown error');
        }
        // Auto-hide after 4s
        setTimeout(function() { statusEl.style.display = 'none'; }, 4000);
      }
    })
    .catch(function(err) {
      if (btn) { btn.disabled = false; btn.textContent = '\u{1F4BE} Save Plan'; }
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.className = 'mp-status error';
        statusEl.textContent = '\u274C Network error: ' + err.message;
        setTimeout(function() { statusEl.style.display = 'none'; }, 4000);
      }
    });
  };

  /* \u2500\u2500 Initial shopping render from saved plan \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  refreshShopping();

})();
})();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "meal-prep", "data-astro-cid-pg2wspgb": true }), renderComponent($$result, "UtensilsCrossed", $$UtensilsCrossed, { "size": 26, "style": "vertical-align:middle;margin-right:.5rem;", "data-astro-cid-pg2wspgb": true }), savedDate && renderTemplate`<p class="mp-saved-badge" data-astro-cid-pg2wspgb>Last saved: week of ${savedDate}</p>`, loadErrMsg && renderTemplate`<p class="mp-warn" data-astro-cid-pg2wspgb>Could not load saved plan: ${loadErrMsg}</p>`, renderComponent($$result, "CheckSquare", $$CheckSquare, { "size": 16, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-pg2wspgb": true }), DAYS.map((day, di) => renderTemplate`<div class="mp-day-card"${addAttribute(di, "data-day-index")} data-astro-cid-pg2wspgb> <div class="mp-day-header" data-astro-cid-pg2wspgb> <span class="mp-day-name" data-astro-cid-pg2wspgb>${day}</span> <span class="mp-day-num" data-astro-cid-pg2wspgb>Day ${di + 1}</span> </div> ${SLOTS.map((slot) => renderTemplate`<div class="mp-slot"${addAttribute(slot, "data-slot")} data-astro-cid-pg2wspgb> <div class="mp-slot-label" data-astro-cid-pg2wspgb>${SLOT_LABELS[slot]}</div> <input class="mp-input mp-input-name" type="text" placeholder="Meal name…"${addAttribute(planData[day]?.[slot]?.name || "", "value")}${addAttribute(day, "data-day")} data-field="name"${addAttribute(slot, "data-slot")} oninput="window.onMealInput(this)" data-astro-cid-pg2wspgb> <input class="mp-input mp-input-prep" type="text" placeholder="Prep time (e.g. 15 min)"${addAttribute(planData[day]?.[slot]?.prepTime || "", "value")}${addAttribute(day, "data-day")} data-field="prepTime"${addAttribute(slot, "data-slot")} oninput="window.onMealInput(this)" data-astro-cid-pg2wspgb> </div>`)} </div>`), renderComponent($$result, "ShoppingCart", $$ShoppingCart, { "size": 20, "style": "vertical-align:middle;margin-right:.4rem;", "data-astro-cid-pg2wspgb": true }), defineScriptVars({ planDataJson, DAYS: JSON.stringify(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/meal-prep.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/meal-prep.astro";
const $$url = "/dashboard/meal-prep";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MealPrep,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
