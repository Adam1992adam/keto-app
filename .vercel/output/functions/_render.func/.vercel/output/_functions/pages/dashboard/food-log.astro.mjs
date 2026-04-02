/* empty css                                          */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, g as addAttribute, r as renderComponent, h as renderHead, e as createAstro } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { b as $$Utensils } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$BarChart2 } from '../../chunks/BarChart2_CbUm7GhP.mjs';
import { $ as $$BookOpen } from '../../chunks/BookOpen_CQB9IXtW.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$FoodLog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FoodLog;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const dateParam = Astro2.url.searchParams.get("date") || today;
  const viewDate = dateParam <= today ? dateParam : today;
  const d = /* @__PURE__ */ new Date(viewDate + "T12:00:00Z");
  const prevDay = new Date(d.getTime() - 864e5).toISOString().split("T")[0];
  const nextDay = new Date(d.getTime() + 864e5).toISOString().split("T")[0];
  const isToday = viewDate === today;
  const { data: foodLogs } = await supabase.from("food_logs").select("*").eq("user_id", user.id).eq("logged_date", viewDate).order("created_at", { ascending: true });
  const logs = foodLogs || [];
  const { data: macroGoals } = await supabase.from("macro_goals").select("*").eq("user_id", user.id).maybeSingle();
  const goalCal = macroGoals?.daily_calories || 1800;
  const goalProt = macroGoals?.protein_g || 120;
  const goalFat = macroGoals?.fat_g || 120;
  const goalCarb = macroGoals?.carbs_g || 25;
  const totals = logs.reduce((a, f) => ({
    cal: a.cal + (f.calories || 0),
    prot: a.prot + parseFloat(f.protein_g || 0),
    fat: a.fat + parseFloat(f.fat_g || 0),
    carb: a.carb + parseFloat(f.carbs_g || 0)
  }), { cal: 0, prot: 0, fat: 0, carb: 0 });
  Math.min(100, Math.round(totals.cal / goalCal * 100));
  const protPct = Math.min(100, Math.round(totals.prot / goalProt * 100));
  const fatPct = Math.min(100, Math.round(totals.fat / goalFat * 100));
  const carbPct = Math.min(100, Math.round(totals.carb / goalCarb * 100));
  const mealOrder = ["breakfast", "lunch", "dinner", "snack", "other"];
  const byMeal = {};
  for (const f of logs) {
    const mt = f.meal_type || "other";
    if (!byMeal[mt]) byMeal[mt] = [];
    byMeal[mt].push(f);
  }
  const sortedMeals = mealOrder.filter((m) => byMeal[m]);
  const displayDate = (/* @__PURE__ */ new Date(viewDate + "T12:00:00Z")).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const sevenDaysAgo = new Date(Date.now() - 6 * 864e5).toISOString().split("T")[0];
  const { data: weekLogs } = await supabase.from("food_logs").select("logged_date, calories").eq("user_id", user.id).gte("logged_date", sevenDaysAgo).lte("logged_date", today);
  const weekByDay = {};
  for (const l of weekLogs || []) {
    weekByDay[l.logged_date] = (weekByDay[l.logged_date] || 0) + (l.calories || 0);
  }
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(Date.now() - (6 - i) * 864e5).toISOString().split("T")[0];
    return { date: dd, cal: weekByDay[dd] || 0, day: (/* @__PURE__ */ new Date(dd + "T12:00:00")).toLocaleDateString("en", { weekday: "short" }).slice(0, 2) };
  });
  const maxWeekCal = Math.max(...last7.map((x) => x.cal), goalCal, 1);
  const mealIcons = {
    breakfast: "\u{1F305}",
    lunch: "\u2600\uFE0F",
    dinner: "\u{1F319}",
    snack: "\u{1F34E}",
    other: "\u{1F4E6}"
  };
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-aeanvnds> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Food Log \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){const t=localStorage.getItem('keto-theme')||'light';document.documentElement.setAttribute('data-theme',t);})();<\/script>`, "</head> <body data-astro-cid-aeanvnds> ", ' <div class="page" data-astro-cid-aeanvnds> <!-- DATE NAV --> <div class="date-nav" data-astro-cid-aeanvnds> <a', ' class="dn-btn" data-astro-cid-aeanvnds>\u2190</a> <div class="date-display" data-astro-cid-aeanvnds> <div class="date-big" data-astro-cid-aeanvnds> ', " ", ' </div> <div class="date-sub" data-astro-cid-aeanvnds>', " item", " logged</div> </div> <a", "", ' data-astro-cid-aeanvnds>\u2192</a> </div> <!-- MACRO SUMMARY --> <div class="macro-summary" data-astro-cid-aeanvnds> <div class="ms-header" data-astro-cid-aeanvnds> <div class="ms-title" data-astro-cid-aeanvnds>', ' Macros Summary</div> <div data-astro-cid-aeanvnds> <span class="ms-cal" data-astro-cid-aeanvnds>', '</span> <span class="ms-cal" data-astro-cid-aeanvnds><span data-astro-cid-aeanvnds>/ ', ' kcal</span></span> </div> </div> <div class="ms-bars" data-astro-cid-aeanvnds> <div class="mb" data-astro-cid-aeanvnds> <div class="mb-top" data-astro-cid-aeanvnds><span class="mb-lbl" data-astro-cid-aeanvnds>Protein</span><span class="mb-val" style="color:var(--blue);" data-astro-cid-aeanvnds>', 'g</span></div> <div class="mb-track" data-astro-cid-aeanvnds><div class="mb-fill"', ' data-astro-cid-aeanvnds></div></div> <div style="font-size:.62rem;color:var(--soft);" data-astro-cid-aeanvnds>of ', 'g goal</div> </div> <div class="mb" data-astro-cid-aeanvnds> <div class="mb-top" data-astro-cid-aeanvnds><span class="mb-lbl" data-astro-cid-aeanvnds>Fat</span><span class="mb-val" style="color:var(--gold);" data-astro-cid-aeanvnds>', 'g</span></div> <div class="mb-track" data-astro-cid-aeanvnds><div class="mb-fill"', ' data-astro-cid-aeanvnds></div></div> <div style="font-size:.62rem;color:var(--soft);" data-astro-cid-aeanvnds>of ', 'g goal</div> </div> <div class="mb" data-astro-cid-aeanvnds> <div class="mb-top" data-astro-cid-aeanvnds><span class="mb-lbl" data-astro-cid-aeanvnds>Net Carbs</span><span class="mb-val" style="color:var(--red);" data-astro-cid-aeanvnds>', 'g</span></div> <div class="mb-track" data-astro-cid-aeanvnds><div class="mb-fill"', ' data-astro-cid-aeanvnds></div></div> <div style="font-size:.62rem;color:var(--soft);" data-astro-cid-aeanvnds>of ', 'g limit</div> </div> </div> </div> <!-- 7-DAY SPARKLINE --> <div class="sparkline" data-astro-cid-aeanvnds> <div class="sp-title" data-astro-cid-aeanvnds>Calories \u2014 Last 7 Days</div> <div class="sp-bars" data-astro-cid-aeanvnds> ', " </div> </div> <!-- FOOD ENTRIES BY MEAL --> ", " </div> <!-- FAB (today only) --> ", ' <!-- \u2500\u2500 ADD MODAL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="modal-backdrop" id="addModal" data-astro-cid-aeanvnds> <div class="modal" data-astro-cid-aeanvnds> <div class="modal-handle" data-astro-cid-aeanvnds></div> <div class="modal-title" data-astro-cid-aeanvnds>Log Food</div> <!-- Search row --> <div class="search-row" data-astro-cid-aeanvnds> <div class="search-input-wrap" data-astro-cid-aeanvnds> <span class="search-icon" data-astro-cid-aeanvnds> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-aeanvnds><circle cx="11" cy="11" r="8" data-astro-cid-aeanvnds></circle><path d="m21 21-4.35-4.35" data-astro-cid-aeanvnds></path></svg> </span> <input class="fm-search" id="flSearch" placeholder="Search food (e.g. &quot;chicken breast&quot;)" autocomplete="off" oninput="window.onSearchInput(this.value)" data-astro-cid-aeanvnds> </div> <button class="btn-scan" id="scanBtn" onclick="window.openScanner()" title="Scan barcode" data-astro-cid-aeanvnds> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-aeanvnds><path d="M3 7V5a2 2 0 0 1 2-2h2" data-astro-cid-aeanvnds></path><path d="M17 3h2a2 2 0 0 1 2 2v2" data-astro-cid-aeanvnds></path><path d="M21 17v2a2 2 0 0 1-2 2h-2" data-astro-cid-aeanvnds></path><path d="M7 21H5a2 2 0 0 1-2-2v-2" data-astro-cid-aeanvnds></path><rect x="7" y="7" width="3" height="10" data-astro-cid-aeanvnds></rect><rect x="14" y="7" width="3" height="10" data-astro-cid-aeanvnds></rect></svg>\nScan\n</button> </div> <!-- Search results --> <div class="search-results" id="searchResults" data-astro-cid-aeanvnds></div> <!-- Serving size (shown after a result is selected) --> <div id="servingRow" class="serving-row" style="display:none;" data-astro-cid-aeanvnds> <span class="serving-label" data-astro-cid-aeanvnds>Serving:</span> <input class="serving-input" id="flServing" type="number" min="1" max="2000" value="100" oninput="window.recalcServing()" data-astro-cid-aeanvnds> <span class="serving-unit" data-astro-cid-aeanvnds>g / ml</span> </div> <div class="divider" data-astro-cid-aeanvnds>or enter manually</div> <!-- Manual fields --> <div data-astro-cid-aeanvnds> <label class="fm-label" data-astro-cid-aeanvnds>Food name *</label> <input class="fm-input" id="flName" placeholder="e.g. Scrambled eggs" autocomplete="off" data-astro-cid-aeanvnds> </div> <div class="fm-row" data-astro-cid-aeanvnds> <div data-astro-cid-aeanvnds> <label class="fm-label" data-astro-cid-aeanvnds>Meal type</label> <select class="fm-input" id="flMeal" data-astro-cid-aeanvnds> <option value="breakfast" data-astro-cid-aeanvnds>\u{1F305} Breakfast</option> <option value="lunch" data-astro-cid-aeanvnds>\u2600\uFE0F Lunch</option> <option value="dinner" data-astro-cid-aeanvnds>\u{1F319} Dinner</option> <option value="snack" data-astro-cid-aeanvnds>\u{1F34E} Snack</option> <option value="other" data-astro-cid-aeanvnds>\u{1F4E6} Other</option> </select> </div> <div data-astro-cid-aeanvnds> <label class="fm-label" data-astro-cid-aeanvnds>Calories</label> <input class="fm-input" id="flCal" type="number" min="0" placeholder="0" data-astro-cid-aeanvnds> </div> </div> <div data-astro-cid-aeanvnds> <label class="fm-label" data-astro-cid-aeanvnds>Macros (grams)</label> <div class="fm-row4" data-astro-cid-aeanvnds> <input class="fm-input" id="flProt" type="number" min="0" step="0.1" placeholder="Prot" data-astro-cid-aeanvnds> <input class="fm-input" id="flFat" type="number" min="0" step="0.1" placeholder="Fat" data-astro-cid-aeanvnds> <input class="fm-input" id="flCarb" type="number" min="0" step="0.1" placeholder="Carbs" data-astro-cid-aeanvnds> <input class="fm-input" id="flFiber" type="number" min="0" step="0.1" placeholder="Fiber" data-astro-cid-aeanvnds> </div> </div> <div class="fm-actions" data-astro-cid-aeanvnds> <button class="btn-cancel" onclick="window.closeAdd()" data-astro-cid-aeanvnds>Cancel</button> <button class="btn-save" id="flSaveBtn" onclick="window.saveEntry()" data-astro-cid-aeanvnds>Log Food</button> </div> </div> </div> <!-- \u2500\u2500 BARCODE SCANNER OVERLAY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="scanner-overlay" id="scannerOverlay" data-astro-cid-aeanvnds> <div id="scannerContent" style="display:flex;flex-direction:column;align-items:center;width:100%;padding:1.5rem;" data-astro-cid-aeanvnds> <!-- filled by JS --> </div> </div> <div class="toast" id="toast" data-astro-cid-aeanvnds></div> <script>(function(){', `
// \u2500\u2500 Per-100g data stored when a result is selected
var __selectedPer100 = null; // { cal, prot, fat, carb, fiber }

// \u2500\u2500 Toast \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

// \u2500\u2500 Modal open/close \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.openAdd = function() {
  document.getElementById('addModal').classList.add('open');
  setTimeout(function(){ document.getElementById('flSearch').focus(); }, 80);
};
window.closeAdd = function() {
  document.getElementById('addModal').classList.remove('open');
  resetModal();
};

function resetModal() {
  document.getElementById('flSearch').value = '';
  document.getElementById('searchResults').className = 'search-results';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('servingRow').style.display = 'none';
  __selectedPer100 = null;
  ['flName','flCal','flProt','flFat','flCarb','flFiber'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
}

// \u2500\u2500 Search (Open Food Facts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var __searchTimer = null;
window.onSearchInput = function(val) {
  clearTimeout(__searchTimer);
  var q = val.trim();
  if (!q) {
    document.getElementById('searchResults').className = 'search-results';
    document.getElementById('searchResults').innerHTML = '';
    return;
  }
  __searchTimer = setTimeout(function(){ doSearch(q); }, 420);
};

function doSearch(q) {
  var box = document.getElementById('searchResults');
  box.className = 'search-results visible';
  box.innerHTML = '<div class="sr-spin"><div class="spinner"></div> Searching\u2026</div>';

  var url = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms='
    + encodeURIComponent(q)
    + '&json=1&page_size=8&fields=product_name,brands,nutriments,serving_quantity&action=process&search_simple=1';

  fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(data) {
      var products = (data.products || []).filter(function(p){
        return p.product_name && p.nutriments;
      });
      if (!products.length) {
        box.innerHTML = '<div class="sr-empty">No results found \u2014 fill in manually below.</div>';
        return;
      }
      box.innerHTML = '';
      products.forEach(function(p) {
        var n    = p.nutriments;
        var cal  = Math.round(n['energy-kcal_100g'] || n['energy_100g'] / 4.184 || 0);
        var prot = roundMacro(n['proteins_100g']);
        var fat  = roundMacro(n['fat_100g']);
        var carb = roundMacro(n['carbohydrates_100g']);
        var fiber= roundMacro(n['fiber_100g']);
        var name = p.product_name || 'Unknown';
        var brand= p.brands ? '\xB7 ' + p.brands.split(',')[0].trim() : '';

        var item = document.createElement('div');
        item.className = 'sr-item';
        item.innerHTML =
          '<div class="sr-name">' + escHtml(name) + '</div>' +
          '<div class="sr-brand">per 100g ' + escHtml(brand) + '</div>' +
          '<div class="sr-macros">' +
          '<span class="sr-m sr-cal">' + cal + ' kcal</span>' +
          '<span class="sr-m sr-p">' + prot + 'g P</span>' +
          '<span class="sr-m sr-f">' + fat  + 'g F</span>' +
          '<span class="sr-m sr-c">' + carb + 'g C</span>' +
          '</div>';

        item.addEventListener('click', function(){
          selectProduct(name, { cal: cal, prot: prot, fat: fat, carb: carb, fiber: fiber });
        });
        box.appendChild(item);
      });
    })
    .catch(function() {
      box.innerHTML = '<div class="sr-empty">Search unavailable \u2014 fill in manually.</div>';
    });
}

function selectProduct(name, per100) {
  __selectedPer100 = per100;
  document.getElementById('searchResults').className = 'search-results';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('flSearch').value = name;
  document.getElementById('flName').value = name;
  document.getElementById('servingRow').style.display = 'flex';
  document.getElementById('flServing').value = 100;
  applyServing(100, per100);
}

window.recalcServing = function() {
  if (!__selectedPer100) return;
  var g = parseFloat(document.getElementById('flServing').value) || 100;
  applyServing(g, __selectedPer100);
};

function applyServing(g, per100) {
  var ratio = g / 100;
  document.getElementById('flCal').value   = Math.round(per100.cal  * ratio);
  document.getElementById('flProt').value  = roundMacro(per100.prot * ratio);
  document.getElementById('flFat').value   = roundMacro(per100.fat  * ratio);
  document.getElementById('flCarb').value  = roundMacro(per100.carb * ratio);
  document.getElementById('flFiber').value = roundMacro(per100.fiber* ratio);
}

// \u2500\u2500 Barcode scanner \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.openScanner = function() {
  var overlay = document.getElementById('scannerOverlay');
  var content = document.getElementById('scannerContent');

  if (typeof BarcodeDetector !== 'undefined') {
    // Native BarcodeDetector API
    overlay.classList.add('open');
    content.innerHTML =
      '<div style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;max-width:360px;">' +
      '<video id="scanVideo" autoplay playsinline muted style="width:100%;border-radius:14px;max-height:60vh;object-fit:cover;"></video>' +
      '<div class="scanner-guide"></div>' +
      '</div>' +
      '<p class="scanner-hint">Point camera at a product barcode</p>' +
      '<button class="btn-scanner-close" onclick="window.closeScanner()">Cancel</button>';

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(function(stream) {
        var video = document.getElementById('scanVideo');
        if (!video) return;
        video.srcObject = stream;
        window.__scanStream = stream;

        var detector = new BarcodeDetector({ formats: ['ean_13','ean_8','upc_a','upc_e','code_128','code_39','itf','qr_code'] });
        var found = false;

        function tick() {
          if (found || !document.getElementById('scanVideo')) return;
          detector.detect(video).then(function(codes) {
            if (codes.length && !found) {
              found = true;
              window.closeScanner();
              lookupBarcode(codes[0].rawValue);
            } else {
              requestAnimationFrame(tick);
            }
          }).catch(function(){ requestAnimationFrame(tick); });
        }
        video.addEventListener('play', function(){ requestAnimationFrame(tick); });
      })
      .catch(function() {
        showFallbackScanner(content);
      });

  } else {
    // Fallback: manual barcode entry
    overlay.classList.add('open');
    showFallbackScanner(content);
  }
};

function showFallbackScanner(content) {
  content.innerHTML =
    '<div class="scanner-fallback">' +
    '<p style="font-size:1.5rem;margin-bottom:.5rem;">\u{1F4F7}</p>' +
    '<p>Enter the barcode number from the product</p>' +
    '<input id="manualBarcode" type="text" inputmode="numeric" placeholder="e.g. 3017620422003"/>' +
    '<br/><button class="btn-scanner-lookup" onclick="window.lookupManualBarcode()">Look Up</button>' +
    '</div>' +
    '<button class="btn-scanner-close" style="margin-top:1.5rem;" onclick="window.closeScanner()">Cancel</button>';
  setTimeout(function(){ var el = document.getElementById('manualBarcode'); if (el) el.focus(); }, 100);
}

window.closeScanner = function() {
  if (window.__scanStream) {
    window.__scanStream.getTracks().forEach(function(t){ t.stop(); });
    window.__scanStream = null;
  }
  document.getElementById('scannerOverlay').classList.remove('open');
  document.getElementById('scannerContent').innerHTML = '';
};

window.lookupManualBarcode = function() {
  var val = (document.getElementById('manualBarcode')?.value || '').trim();
  if (!val) return;
  window.closeScanner();
  lookupBarcode(val);
};

function lookupBarcode(code) {
  showToast('\u{1F50D} Looking up barcode\u2026');
  var url = 'https://world.openfoodfacts.org/api/v0/product/' + encodeURIComponent(code) + '.json?fields=product_name,brands,nutriments,serving_quantity';

  fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(data) {
      if (data.status !== 1 || !data.product) {
        showToast('\u274C Product not found in database');
        return;
      }
      var p    = data.product;
      var n    = p.nutriments || {};
      var cal  = Math.round(n['energy-kcal_100g'] || n['energy_100g'] / 4.184 || 0);
      var prot = roundMacro(n['proteins_100g']);
      var fat  = roundMacro(n['fat_100g']);
      var carb = roundMacro(n['carbohydrates_100g']);
      var fiber= roundMacro(n['fiber_100g']);
      var name = p.product_name || 'Product ' + code;

      window.openAdd();
      selectProduct(name, { cal: cal, prot: prot, fat: fat, carb: carb, fiber: fiber });
      showToast('\u2705 ' + name + ' found!');
    })
    .catch(function() {
      showToast('\u274C Barcode lookup failed');
    });
}

// \u2500\u2500 Save entry \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.saveEntry = function() {
  var name = document.getElementById('flName').value.trim();
  if (!name) { document.getElementById('flName').focus(); return; }
  var cal   = parseFloat(document.getElementById('flCal').value)   || 0;
  var prot  = parseFloat(document.getElementById('flProt').value)  || 0;
  var fat   = parseFloat(document.getElementById('flFat').value)   || 0;
  var carb  = parseFloat(document.getElementById('flCarb').value)  || 0;
  var fiber = parseFloat(document.getElementById('flFiber').value) || 0;
  var meal  = document.getElementById('flMeal').value || 'other';
  var netCarb = Math.max(0, carb - fiber);
  var btn = document.getElementById('flSaveBtn');
  btn.disabled = true; btn.textContent = 'Logging\u2026';

  fetch('/api/food-log/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ food_name: name, calories: cal, protein_g: prot, fat_g: fat, carbs_g: netCarb, meal_type: meal }),
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if (d.success) {
      showToast('\u2705 Logged!');
      window.closeAdd();
      setTimeout(function(){ window.location.reload(); }, 500);
    } else {
      btn.disabled = false; btn.textContent = 'Log Food';
      showToast('\u274C ' + (d.error || 'Failed'));
    }
  })
  .catch(function(){
    btn.disabled = false; btn.textContent = 'Log Food';
    showToast('\u274C Connection error');
  });
};

// \u2500\u2500 Delete entry \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.deleteEntry = function(btn) {
  var id  = btn.getAttribute('data-id');
  var row = btn.closest('.fl-row');
  fetch('/api/food-log/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id }),
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if (d.success) {
      if (row) { row.style.opacity='0'; row.style.transform='translateX(10px)'; row.style.transition='all .25s'; }
      setTimeout(function(){ window.location.reload(); }, 300);
    } else { showToast('\u274C Could not delete'); }
  })
  .catch(function(){ showToast('\u274C Error'); });
};

// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function roundMacro(v) { return Math.round((v || 0) * 10) / 10; }

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Close modal on backdrop click
document.getElementById('addModal').addEventListener('click', function(e){
  if (e.target === this) window.closeAdd();
});

// Enter submits
document.addEventListener('keydown', function(e){
  if (e.key === 'Enter' && document.getElementById('addModal').classList.contains('open')) {
    window.saveEntry();
  }
  if (e.key === 'Escape') {
    window.closeAdd();
    window.closeScanner();
  }
});
})();<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "food-log", "data-astro-cid-aeanvnds": true }), addAttribute(`/dashboard/food-log?date=${prevDay}`, "href"), displayDate, isToday && renderTemplate`<span class="today-chip" data-astro-cid-aeanvnds>Today</span>`, logs.length, logs.length !== 1 ? "s" : "", addAttribute(`/dashboard/food-log?date=${nextDay}`, "href"), addAttribute(`dn-btn${isToday ? " disabled" : ""}`, "class"), renderComponent($$result, "BarChart2", $$BarChart2, { "size": 16, "style": "display:inline;vertical-align:middle;", "data-astro-cid-aeanvnds": true }), Math.round(totals.cal), goalCal, Math.round(totals.prot), addAttribute(`width:${protPct}%;background:var(--blue);`, "style"), goalProt, Math.round(totals.fat), addAttribute(`width:${fatPct}%;background:var(--gold);`, "style"), goalFat, Math.round(totals.carb), addAttribute(`width:${carbPct}%;background:var(--red);`, "style"), goalCarb, last7.map((item) => {
    const h = Math.max(3, Math.round(item.cal / maxWeekCal * 100));
    const isActive = item.date === viewDate;
    return renderTemplate`<a${addAttribute(`/dashboard/food-log?date=${item.date}`, "href")} class="sp-bar-wrap" style="text-decoration:none;" data-astro-cid-aeanvnds> <div class="sp-bar"${addAttribute(`height:${h}%;background:${isActive ? "var(--green)" : item.cal > 0 ? "rgba(16,185,129,.3)" : "var(--muted)"};${isActive ? "box-shadow:0 0 8px rgba(16,185,129,.4);" : ""}`, "style")}${addAttribute(`${item.cal} kcal`, "title")} data-astro-cid-aeanvnds></div> <div class="sp-day"${addAttribute(isActive ? "color:var(--green);" : "", "style")} data-astro-cid-aeanvnds>${item.day}</div> </a>`;
  }), logs.length > 0 ? sortedMeals.map((mt, idx) => {
    const items = byMeal[mt];
    const mealCal = items.reduce((s, f) => s + (f.calories || 0), 0);
    return renderTemplate`<div class="meal-group"${addAttribute(`animation-delay:${0.05 + idx * 0.04}s;`, "style")} data-astro-cid-aeanvnds> <div class="mg-head" data-astro-cid-aeanvnds> <div class="mg-icon" data-astro-cid-aeanvnds>${mealIcons[mt] || "\u{1F4E6}"}</div> <div class="mg-name" data-astro-cid-aeanvnds>${mt}</div> <div class="mg-cal" data-astro-cid-aeanvnds>${Math.round(mealCal)} kcal</div> </div> ${items.map((f) => renderTemplate`<div class="fl-row"${addAttribute(f.id, "data-id")} data-astro-cid-aeanvnds> <div class="fl-name" data-astro-cid-aeanvnds>${f.food_name}</div> <div class="fl-macros" data-astro-cid-aeanvnds> <span class="fl-m fl-mc" data-astro-cid-aeanvnds>${f.calories}cal</span> <span class="fl-m fl-mp" data-astro-cid-aeanvnds>${f.protein_g}P</span> <span class="fl-m fl-mf" data-astro-cid-aeanvnds>${f.fat_g}F</span> <span class="fl-m fl-mk" data-astro-cid-aeanvnds>${f.carbs_g}C</span> </div> <button class="fl-del"${addAttribute(f.id, "data-id")} onclick="window.deleteEntry(this)" title="Remove" data-astro-cid-aeanvnds>×</button> </div>`)} </div>`;
  }) : renderTemplate`<div class="empty" data-astro-cid-aeanvnds> <div class="empty-icon" data-astro-cid-aeanvnds>${renderComponent($$result, "Utensils", $$Utensils, { "size": 48, "color": "var(--soft)", "data-astro-cid-aeanvnds": true })}</div> <div class="empty-title" data-astro-cid-aeanvnds>No food logged ${isToday ? "today" : "on this day"}</div> <div class="empty-sub" data-astro-cid-aeanvnds>${isToday ? "Search any food, scan a barcode, or tap + to add manually." : "Nothing was logged for this date."}</div> ${isToday && renderTemplate`<a href="/dashboard/recipes" class="btn-green" data-astro-cid-aeanvnds>${renderComponent($$result, "BookOpen", $$BookOpen, { "size": 14, "style": "display:inline;vertical-align:middle;", "data-astro-cid-aeanvnds": true })} Browse Recipes</a>`} </div>`, isToday && renderTemplate`<button class="fab" onclick="window.openAdd()" title="Add food" data-astro-cid-aeanvnds>+</button>`, defineScriptVars({ viewDate }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/food-log.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/food-log.astro";
const $$url = "/dashboard/food-log";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FoodLog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
