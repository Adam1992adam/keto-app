/* empty css                                             */
import { c as createComponent, d as renderTemplate, f as defineScriptVars, g as addAttribute, r as renderComponent, h as renderHead, e as createAstro } from '../../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { d as getUserJourney, s as supabase } from '../../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../../chunks/DashNav_DqRIYqYD.mjs';
/* empty css                                      */
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const journey = await getUserJourney(user.id);
  if (!journey) return Astro2.redirect("/dashboard");
  const currentDay = journey?.current_day || 1;
  const { data: rawTasks } = await supabase.from("daily_tasks").select("id, task_title, task_type, completed, xp_earned").eq("user_id", user.id).eq("day_number", currentDay);
  const dailyTasks = rawTasks || [];
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", id).single();
  if (!recipe) return Astro2.redirect("/dashboard/recipes");
  const { data: mealPlan } = await supabase.from("meal_plans").select("*").eq("recipe_id", id).eq("day_number", currentDay).eq("plan_type", planType).maybeSingle();
  const task = mealPlan ? dailyTasks.find((t) => t.task_type === mealPlan.meal_type) : null;
  const isCompleted = task?.completed || false;
  const canComplete = !!mealPlan && !isCompleted;
  const { data: favRow } = await supabase.from("recipe_favorites").select("id").eq("user_id", user.id).eq("recipe_id", recipe.id).maybeSingle();
  const isFavorited = !!favRow;
  const { data: userRatingRow } = await supabase.from("recipe_ratings").select("rating").eq("user_id", user.id).eq("recipe_id", recipe.id).maybeSingle();
  const userRating = userRatingRow?.rating || 0;
  const { data: avgRow } = await supabase.from("recipe_avg_ratings").select("avg_rating, rating_count").eq("recipe_id", recipe.id).maybeSingle();
  const avgRating = parseFloat(avgRow?.avg_rating || "0");
  const ratingCount = avgRow?.rating_count || 0;
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];
  const tips = recipe.tips || [];
  const tags = recipe.tags || [];
  const similarRaw = tags.length > 0 ? await supabase.from("recipes").select("id, title, calories, net_carbs, protein, image_url, tags").contains("tags", [tags[0]]).neq("id", recipe.id).limit(4) : { data: [] };
  const similarIds = (similarRaw.data || []).map((r) => r.id);
  const { data: simRatings } = similarIds.length ? await supabase.from("recipe_avg_ratings").select("recipe_id, avg_rating, rating_count").in("recipe_id", similarIds) : { data: [] };
  const simRatingMap = {};
  for (const r of simRatings || []) {
    simRatingMap[r.recipe_id] = { avg: parseFloat(r.avg_rating), count: r.rating_count };
  }
  const similarRecipes = (similarRaw.data || []).map((r) => ({
    ...r,
    avgRating: simRatingMap[r.id]?.avg || 0,
    ratingCount: simRatingMap[r.id]?.count || 0
  })).sort((a, b) => b.avgRating - a.avgRating);
  const mealType = mealPlan?.meal_type || tags[0] || "other";
  const categories = {
    breakfast: { name: "Breakfast", icon: "\u{1F373}", gradient: "linear-gradient(135deg,#f59e0b,#d97706)", glow: "rgba(245,158,11,.3)", accent: "#f59e0b" },
    lunch: { name: "Lunch", icon: "\u{1F957}", gradient: "linear-gradient(135deg,#10b981,#059669)", glow: "rgba(16,185,129,.3)", accent: "#10b981" },
    dinner: { name: "Dinner", icon: "\u{1F37D}\uFE0F", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", glow: "rgba(59,130,246,.3)", accent: "#3b82f6" },
    snack: { name: "Snack", icon: "\u{1F34E}", gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)", glow: "rgba(139,92,246,.3)", accent: "#8b5cf6" },
    other: { name: "Keto", icon: "\u{1F951}", gradient: "linear-gradient(135deg,#10b981,#059669)", glow: "rgba(16,185,129,.3)", accent: "#10b981" }
  };
  const cat = categories[mealType] || categories.other;
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const diffColor = recipe.difficulty === "Easy" ? "#10b981" : recipe.difficulty === "Medium" ? "#f59e0b" : "#ef4444";
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-fnj4sbw7> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', ` \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>(function(){ const t=localStorage.getItem('keto-theme')||'light'; document.documentElement.setAttribute('data-theme',t); })();<\/script>`, '</head> <body data-astro-cid-fnj4sbw7> <div class="bg-wrap" data-astro-cid-fnj4sbw7><div class="orb o1" data-astro-cid-fnj4sbw7></div><div class="orb o2" data-astro-cid-fnj4sbw7></div></div> ', ' <div class="page" data-astro-cid-fnj4sbw7> <div class="recipe-hero" data-astro-cid-fnj4sbw7> ', ' <div class="hero-overlay" data-astro-cid-fnj4sbw7></div> ', ' <button id="favBtn" onclick="toggleFav(this)"', "", "", "", " data-astro-cid-fnj4sbw7>", '</button> <div class="hero-content" data-astro-cid-fnj4sbw7> <div class="hero-meta" data-astro-cid-fnj4sbw7> <span class="hero-pill"', " data-astro-cid-fnj4sbw7>", " ", '</span> <span class="hero-pill" data-astro-cid-fnj4sbw7>\u23F1\uFE0F ', ' min</span> <span class="hero-pill" data-astro-cid-fnj4sbw7>\u{1F37D}\uFE0F ', " serving", "</span> ", " ", ' </div> <h1 class="recipe-title" data-astro-cid-fnj4sbw7>', "</h1> ", ' </div> </div> <div class="recipe-layout" data-astro-cid-fnj4sbw7> <div data-astro-cid-fnj4sbw7> <!-- NUTRITION --> <div class="sc" style="animation-delay:.04s;" data-astro-cid-fnj4sbw7> <div class="sc-head" data-astro-cid-fnj4sbw7> <div class="sc-ico" style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 12px rgba(239,68,68,.3);" data-astro-cid-fnj4sbw7>\u{1F4CA}</div> <div data-astro-cid-fnj4sbw7><div class="sc-title" data-astro-cid-fnj4sbw7>Nutrition Facts</div><div class="sc-sub" data-astro-cid-fnj4sbw7>Per serving</div></div> </div> <div class="sc-body" data-astro-cid-fnj4sbw7> <div class="macros-grid" data-astro-cid-fnj4sbw7> ', ' </div> </div> </div> <!-- INGREDIENTS --> <div class="sc" style="animation-delay:.08s;" data-astro-cid-fnj4sbw7> <div class="sc-head" data-astro-cid-fnj4sbw7> <div class="sc-ico" style="background:linear-gradient(135deg,var(--green),var(--green2));box-shadow:0 4px 12px rgba(16,185,129,.3);" data-astro-cid-fnj4sbw7>\u{1F6D2}</div> <div style="flex:1;" data-astro-cid-fnj4sbw7><div class="sc-title" data-astro-cid-fnj4sbw7>Ingredients</div><div class="sc-sub" data-astro-cid-fnj4sbw7>', ' items \xB7 tap to check off</div></div> <span id="ingCount" style="font-size:.72rem;font-weight:700;padding:.2rem .6rem;border-radius:99px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);color:var(--green);" data-astro-cid-fnj4sbw7>0 / ', '</span> </div> <div class="sc-body" data-astro-cid-fnj4sbw7> <div class="ing-list" data-astro-cid-fnj4sbw7> ', ' </div> <div class="ing-progress" data-astro-cid-fnj4sbw7> <div class="ip-hd" data-astro-cid-fnj4sbw7><span class="ip-lbl" data-astro-cid-fnj4sbw7>Ingredients prepared</span><span class="ip-val" id="ingPct" data-astro-cid-fnj4sbw7>0%</span></div> <div class="ip-track" data-astro-cid-fnj4sbw7><div class="ip-fill" id="ingBar" style="width:0%" data-astro-cid-fnj4sbw7></div></div> </div> </div> </div> <!-- INSTRUCTIONS --> <div class="sc" style="animation-delay:.12s;" data-astro-cid-fnj4sbw7> <div class="sc-head" data-astro-cid-fnj4sbw7> <div class="sc-ico" style="background:linear-gradient(135deg,var(--blue),#2563eb);box-shadow:0 4px 12px rgba(59,130,246,.3);" data-astro-cid-fnj4sbw7>\u{1F468}\u200D\u{1F373}</div> <div data-astro-cid-fnj4sbw7><div class="sc-title" data-astro-cid-fnj4sbw7>Instructions</div><div class="sc-sub" data-astro-cid-fnj4sbw7>', ' steps</div></div> </div> <div class="sc-body" data-astro-cid-fnj4sbw7> <div class="steps-list" data-astro-cid-fnj4sbw7> ', " </div> </div> </div> <!-- TIPS --> ", ' </div> <!-- SIDEBAR --> <div class="sidebar" data-astro-cid-fnj4sbw7> ', " ", ' <div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-head" data-astro-cid-fnj4sbw7>Time Required</div> <div class="side-body" data-astro-cid-fnj4sbw7> <div class="time-grid" data-astro-cid-fnj4sbw7> <div class="time-block" data-astro-cid-fnj4sbw7><div class="time-val" style="color:var(--blue);" data-astro-cid-fnj4sbw7>', '</div><div class="time-lbl" data-astro-cid-fnj4sbw7>Prep min</div></div> <div class="time-block" data-astro-cid-fnj4sbw7><div class="time-val" style="color:var(--gold);" data-astro-cid-fnj4sbw7>', '</div><div class="time-lbl" data-astro-cid-fnj4sbw7>Cook min</div></div> </div> <div class="time-total"', ` data-astro-cid-fnj4sbw7> <span data-astro-cid-fnj4sbw7>\u23F1\uFE0F Total</span> <span style="font-family:'Fraunces',serif;font-size:1.2rem;" data-astro-cid-fnj4sbw7>`, ' min</span> </div> </div> </div> <div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-head" data-astro-cid-fnj4sbw7>Details</div> <div class="side-body" data-astro-cid-fnj4sbw7> <div class="detail-row" data-astro-cid-fnj4sbw7><span class="detail-lbl" data-astro-cid-fnj4sbw7>Calories</span><span class="detail-val" style="color:var(--red);" data-astro-cid-fnj4sbw7>', ' kcal</span></div> <div class="detail-row" data-astro-cid-fnj4sbw7><span class="detail-lbl" data-astro-cid-fnj4sbw7>Net Carbs</span><span class="detail-val" style="color:var(--green);" data-astro-cid-fnj4sbw7>', 'g</span></div> <div class="detail-row" data-astro-cid-fnj4sbw7><span class="detail-lbl" data-astro-cid-fnj4sbw7>Protein</span><span class="detail-val" style="color:var(--blue);" data-astro-cid-fnj4sbw7>', 'g</span></div> <div class="detail-row" data-astro-cid-fnj4sbw7><span class="detail-lbl" data-astro-cid-fnj4sbw7>Fat</span><span class="detail-val" style="color:var(--gold);" data-astro-cid-fnj4sbw7>', "g</span></div> ", ' <div class="detail-row" data-astro-cid-fnj4sbw7><span class="detail-lbl" data-astro-cid-fnj4sbw7>Servings</span><span class="detail-val" data-astro-cid-fnj4sbw7>', "</span></div> </div> </div> ", ' <!-- Star Rating Card --> <div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-head" data-astro-cid-fnj4sbw7>Rate this Recipe</div> <div class="side-body" data-astro-cid-fnj4sbw7> <div class="stars-row" id="starsRow" data-astro-cid-fnj4sbw7> ', " </div> ", " ", ' <div id="ratingMsg" style="font-size:.72rem;color:var(--soft);margin-top:.3rem;min-height:1rem;" data-astro-cid-fnj4sbw7></div> </div> </div> <div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-head" data-astro-cid-fnj4sbw7>Actions</div> <div class="side-body" data-astro-cid-fnj4sbw7> <button id="foodLogBtn" onclick="window.logToFoodLog()" class="btn btn-green" style="width:100%;" data-astro-cid-fnj4sbw7>\u{1F4CB} Add to Food Log</button> <a href="/dashboard" class="btn btn-outline" data-astro-cid-fnj4sbw7>\u{1F3E0} Dashboard</a> <a href="/dashboard/recipes" class="btn btn-outline" data-astro-cid-fnj4sbw7>\u{1F4DA} All Recipes</a> <button onclick="window.print()" class="btn btn-outline" data-astro-cid-fnj4sbw7>\u{1F5A8}\uFE0F Print Recipe</button> </div> </div> </div> </div> </div> <!-- You might also like --> ', ' <div class="toast" id="toast" data-astro-cid-fnj4sbw7></div> <script>(function(){', `
window.__recipeId = recipeId;
var checked=0;
function updateIng(){
  const pct=totalIng>0?Math.round((checked/totalIng)*100):0;
  const bar=document.getElementById('ingBar');
  const pEl=document.getElementById('ingPct');
  const cEl=document.getElementById('ingCount');
  if(bar)bar.style.width=pct+'%';
  if(pEl)pEl.textContent=pct+'%';
  if(cEl)cEl.textContent=checked+' / '+totalIng;
  if(checked===totalIng&&totalIng>0)showToast('\u{1F389} All ingredients ready! Time to cook!');
}
function toggleIng(i){
  const row=document.getElementById('ing-'+i);
  const cb=document.getElementById('ingc-'+i);
  if(!row||!cb)return;
  cb.checked=!cb.checked;
  if(cb.checked){row.classList.add('checked');checked++;}
  else{row.classList.remove('checked');checked--;}
  updateIng();
}
window.toggleIng=toggleIng;

const completeBtn=document.getElementById('completeBtn');
if(completeBtn&&taskId){
  completeBtn.addEventListener('click',async()=>{
    completeBtn.disabled=true;
    completeBtn.textContent='\u23F3 Saving...';
    try{
      const res=await fetch('/api/tasks/complete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task_id:taskId,task_type:mealPlanType,day_number:dayNum})});
      if(res.ok){showToast('\u{1F389} Completed! +'+xpEarned+' XP earned!');setTimeout(()=>window.location.reload(),1500);}
      else{completeBtn.disabled=false;completeBtn.textContent='\u2713 Mark as Completed';showToast('\u274C Something went wrong.');}
    }catch(e){completeBtn.disabled=false;completeBtn.textContent='\u2713 Mark as Completed';showToast('\u274C Connection error.');}
  });
}

function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.className='toast show';setTimeout(()=>t.classList.remove('show'),3000);}

window.logToFoodLog = async function() {
  var btn = document.getElementById('foodLogBtn');
  if (btn) { btn.disabled=true; btn.textContent='\u23F3 Logging\u2026'; }
  try {
    var res = await fetch('/api/food-log/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        food_name:  recipeTitle,
        calories:   recipeCal,
        protein_g:  recipeProtein,
        fat_g:      recipeFat,
        carbs_g:    recipeCarbs,
        meal_type:  mealPlanType || 'other',
        notes:      'Added from recipe #' + recipeId,
      }),
    });
    var data = await res.json();
    if (res.ok && data.success) {
      showToast('\u{1F4CB} Added to food log!');
      if (btn) { btn.textContent='\u2705 Logged!'; btn.style.background='rgba(16,185,129,.2)'; }
    } else {
      showToast('\u274C ' + (data.error || 'Could not add to food log'));
      if (btn) { btn.disabled=false; btn.textContent='\u{1F4CB} Add to Food Log'; }
    }
  } catch(e) {
    showToast('\u274C Connection error');
    if (btn) { btn.disabled=false; btn.textContent='\u{1F4CB} Add to Food Log'; }
  }
};

window.toggleFav = function toggleFav(btn) {
  var recipeId  = btn.getAttribute('data-recipe-id');
  var favorited = btn.getAttribute('data-favorited') === 'true';
  btn.style.transform = 'scale(1.3)';
  setTimeout(function() { btn.style.transform = 'scale(1)'; }, 200);
  fetch('/api/recipes/favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId: recipeId }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (typeof data.favorited !== 'undefined') {
      btn.setAttribute('data-favorited', data.favorited ? 'true' : 'false');
      btn.textContent = data.favorited ? '\u2764\uFE0F' : '\u{1F90D}';
      btn.style.background = data.favorited ? 'rgba(239,68,68,.85)' : 'rgba(255,255,255,.15)';
      showToast(data.favorited ? '\u2764\uFE0F Added to favorites!' : '\u{1F90D} Removed from favorites');
    }
  })
  .catch(function() { showToast('\u274C Could not update favorite'); });
};

/* \u2500\u2500 Star Rating \u2500\u2500 */
var __userRating = 0;
(function(){
  document.querySelectorAll('.star-btn').forEach(function(b){
    if(b.classList.contains('active')) __userRating = parseInt(b.getAttribute('data-val'),10);
  });
})();

window.previewStars = function(n) {
  for(var i=1;i<=5;i++){
    var s=document.getElementById('star-'+i);
    if(!s) continue;
    s.classList.remove('preview','active');
    if(i<=n) s.classList.add('active','preview');
  }
};

window.resetStarPreview = function() {
  for(var i=1;i<=5;i++){
    var s=document.getElementById('star-'+i);
    if(!s) continue;
    s.classList.remove('preview','active');
    if(i<=__userRating) s.classList.add('active');
  }
};

window.rateRecipe = function(n) {
  __userRating = n;
  window.resetStarPreview();
  var msg = document.getElementById('ratingMsg');
  if(msg) msg.textContent = 'Saving\u2026';

  fetch('/api/recipes/rate', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ recipeId: window.__recipeId, rating: n }),
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.success){
      var labels = ['','\u2B50 Thanks!','\u2B50\u2B50 Fair enough','\u2B50\u2B50\u2B50 Good!','\u2B50\u2B50\u2B50\u2B50 Love it!','\u2B50\u2B50\u2B50\u2B50\u2B50 Perfect!'];
      if(msg) msg.textContent = labels[n] || 'Saved!';
      var info = document.getElementById('ratingInfo');
      if(info){
        info.style.display='';
        info.innerHTML='<span style="color:var(--gold);font-weight:800;">'+d.avg+'</span><span style="color:var(--soft);font-size:.72rem;"> / 5 \xB7 '+d.count+' rating'+(d.count!==1?'s':'')+'</span>';
      }
      setTimeout(function(){ if(msg) msg.textContent=''; }, 2500);
    } else {
      if(msg) msg.textContent = '\u274C Could not save';
    }
  })
  .catch(function(){ if(msg) msg.textContent='\u274C Error'; });
};
})();<\/script> </body> </html>`])), recipe.title, renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "recipes", "data-astro-cid-fnj4sbw7": true }), recipe.image_url ? renderTemplate`<img${addAttribute(recipe.image_url, "src")}${addAttribute(recipe.title, "alt")} class="recipe-hero-img" loading="lazy" data-astro-cid-fnj4sbw7>` : renderTemplate`<div class="hero-placeholder"${addAttribute(`background:${cat.gradient};`, "style")} data-astro-cid-fnj4sbw7> <span style="font-size:6rem;filter:drop-shadow(0 4px 16px rgba(0,0,0,.4));" data-astro-cid-fnj4sbw7>${cat.icon}</span> <span style="font-size:.9rem;font-weight:700;color:rgba(255,255,255,.75);letter-spacing:.06em;text-transform:uppercase;" data-astro-cid-fnj4sbw7>${cat.name}</span> </div>`, isCompleted && renderTemplate`<div class="done-ribbon" data-astro-cid-fnj4sbw7>✓ Completed Today</div>`, addAttribute(recipe.id, "data-recipe-id"), addAttribute(isFavorited ? "true" : "false", "data-favorited"), addAttribute(`position:absolute;top:1.5rem;left:1.5rem;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.3rem;transition:all .25s;backdrop-filter:blur(10px);background:${isFavorited ? "rgba(239,68,68,.85)" : "rgba(255,255,255,.15)"};box-shadow:0 4px 14px rgba(0,0,0,.3);`, "style"), addAttribute(isFavorited ? "Remove from favorites" : "Add to favorites", "title"), isFavorited ? "\u2764\uFE0F" : "\u{1F90D}", addAttribute(`background:${cat.accent}25;border-color:${cat.accent}50;`, "style"), cat.icon, cat.name, totalTime, recipe.servings || 1, (recipe.servings || 1) > 1 ? "s" : "", recipe.difficulty && renderTemplate`<span class="hero-pill"${addAttribute(`background:${diffColor}20;border-color:${diffColor}50;color:${diffColor};`, "style")} data-astro-cid-fnj4sbw7>${recipe.difficulty}</span>`, recipe.net_carbs && renderTemplate`<span class="hero-pill" style="background:rgba(16,185,129,.2);border-color:rgba(16,185,129,.4);color:#34d399;" data-astro-cid-fnj4sbw7>🥗 ${recipe.net_carbs}g net carbs</span>`, recipe.title, recipe.description && renderTemplate`<p class="recipe-desc" data-astro-cid-fnj4sbw7>${recipe.description}</p>`, [
    { val: recipe.calories, lbl: "Calories", unit: "", color: "#ef4444", bg: "rgba(239,68,68,.1)", bd: "#ef4444" },
    { val: recipe.protein, lbl: "Protein", unit: "g", color: "#3b82f6", bg: "rgba(59,130,246,.1)", bd: "#3b82f6" },
    { val: recipe.fat, lbl: "Fat", unit: "g", color: "#f59e0b", bg: "rgba(245,158,11,.1)", bd: "#f59e0b" },
    { val: recipe.net_carbs, lbl: "Net Carbs", unit: "g", color: "#10b981", bg: "rgba(16,185,129,.1)", bd: "#10b981" },
    { val: recipe.fiber, lbl: "Fiber", unit: "g", color: "#8b5cf6", bg: "rgba(139,92,246,.1)", bd: "#8b5cf6" }
  ].map((m) => renderTemplate`<div class="macro-card"${addAttribute(`background:${m.bg};border-color:${m.bd};color:${m.color};`, "style")} data-astro-cid-fnj4sbw7> <span class="macro-val" data-astro-cid-fnj4sbw7>${m.val}${m.unit}</span> <span class="macro-lbl" data-astro-cid-fnj4sbw7>${m.lbl}</span> </div>`), ingredients.length, ingredients.length, ingredients.map((ing, i) => renderTemplate`<div class="ing-row"${addAttribute(`toggleIng(${i})`, "onclick")}${addAttribute(`ing-${i}`, "id")} data-astro-cid-fnj4sbw7> <div class="ing-num"${addAttribute(`background:${cat.gradient};box-shadow:0 3px 8px ${cat.glow};`, "style")} data-astro-cid-fnj4sbw7>${i + 1}</div> <span class="ing-amount" data-astro-cid-fnj4sbw7>${ing.amount} ${ing.unit}</span> <span class="ing-name" data-astro-cid-fnj4sbw7>${ing.item}</span> <input type="checkbox" class="ing-chk"${addAttribute(`ingc-${i}`, "id")} onclick="event.stopPropagation();" data-astro-cid-fnj4sbw7> </div>`), instructions.length, instructions.map((step, i) => renderTemplate`<div class="step-row" data-astro-cid-fnj4sbw7> <div class="step-num" data-astro-cid-fnj4sbw7>${i + 1}</div> <div class="step-text" data-astro-cid-fnj4sbw7>${typeof step === "string" ? step : step.instruction || step.text || ""}</div> </div>`), tips.length > 0 && renderTemplate`<div class="sc" style="animation-delay:.16s;" data-astro-cid-fnj4sbw7> <div class="sc-head" data-astro-cid-fnj4sbw7> <div class="sc-ico" style="background:linear-gradient(135deg,var(--gold),#d97706);box-shadow:0 4px 12px rgba(245,158,11,.3);" data-astro-cid-fnj4sbw7>💡</div> <div data-astro-cid-fnj4sbw7><div class="sc-title" data-astro-cid-fnj4sbw7>Pro Tips</div><div class="sc-sub" data-astro-cid-fnj4sbw7>${tips.length} chef secrets</div></div> </div> <div class="sc-body" data-astro-cid-fnj4sbw7> <div class="tips-list" data-astro-cid-fnj4sbw7> ${tips.map((tip) => renderTemplate`<div class="tip-row" data-astro-cid-fnj4sbw7> <span class="tip-ico" data-astro-cid-fnj4sbw7>✨</span> <p class="tip-text" data-astro-cid-fnj4sbw7>${typeof tip === "string" ? tip : tip.text || ""}</p> </div>`)} </div> </div> </div>`, canComplete && renderTemplate`<div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-head" data-astro-cid-fnj4sbw7>Today's Task · Day ${currentDay}</div> <div class="side-body" data-astro-cid-fnj4sbw7> <p style="font-size:.8rem;color:var(--soft);margin-bottom:1rem;line-height:1.55;" data-astro-cid-fnj4sbw7>Your <strong style="color:var(--text);" data-astro-cid-fnj4sbw7>${mealPlan.meal_type}</strong> for today. Mark done to earn XP!</p> <button class="btn btn-complete" id="completeBtn" data-astro-cid-fnj4sbw7>✓ Mark as Completed</button> </div> </div>`, isCompleted && renderTemplate`<div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-body" data-astro-cid-fnj4sbw7> <div class="task-box" data-astro-cid-fnj4sbw7> <div class="task-box-icon" data-astro-cid-fnj4sbw7>🎉</div> <div class="task-box-title" data-astro-cid-fnj4sbw7>Completed!</div> <div class="task-box-sub" data-astro-cid-fnj4sbw7>+${task?.xp_earned || 25} XP earned today</div> </div> </div> </div>`, recipe.prep_time || 0, recipe.cook_time || 0, addAttribute(`background:${cat.gradient};box-shadow:0 4px 14px ${cat.glow};`, "style"), totalTime, recipe.calories, recipe.net_carbs, recipe.protein, recipe.fat, recipe.difficulty && renderTemplate`<div class="detail-row" data-astro-cid-fnj4sbw7><span class="detail-lbl" data-astro-cid-fnj4sbw7>Difficulty</span><span class="diff-pill"${addAttribute(`background:${diffColor}15;border-color:${diffColor}40;color:${diffColor};`, "style")} data-astro-cid-fnj4sbw7>${recipe.difficulty}</span></div>`, recipe.servings || 1, tags.length > 0 && renderTemplate`<div class="side-card" data-astro-cid-fnj4sbw7> <div class="side-head" data-astro-cid-fnj4sbw7>Tags</div> <div class="side-body" data-astro-cid-fnj4sbw7><div class="tags-wrap" data-astro-cid-fnj4sbw7>${tags.map((tag) => renderTemplate`<span class="tag-pill" data-astro-cid-fnj4sbw7>#${tag}</span>`)}</div></div> </div>`, [1, 2, 3, 4, 5].map((n) => renderTemplate`<button${addAttribute(`star-btn${n <= userRating ? " active" : ""}`, "class")}${addAttribute(n, "data-val")}${addAttribute(`star-${n}`, "id")}${addAttribute(`window.rateRecipe(${n})`, "onclick")}${addAttribute(`window.previewStars(${n})`, "onmouseenter")} onmouseleave="window.resetStarPreview()"${addAttribute(`${n} star${n !== 1 ? "s" : ""}`, "title")} data-astro-cid-fnj4sbw7>★</button>`), avgRating > 0 && renderTemplate`<div class="rating-info" id="ratingInfo" data-astro-cid-fnj4sbw7> <span style="color:var(--gold);font-weight:800;" data-astro-cid-fnj4sbw7>${avgRating.toFixed(1)}</span> <span style="color:var(--soft);font-size:.72rem;" data-astro-cid-fnj4sbw7> / 5 · ${ratingCount} rating${ratingCount !== 1 ? "s" : ""}</span> </div>`, avgRating === 0 && renderTemplate`<div class="rating-info" id="ratingInfo" style="display:none;" data-astro-cid-fnj4sbw7></div>`, similarRecipes.length > 0 && renderTemplate`<div style="max-width:1200px;margin:0 auto 3rem;padding:0 1.5rem;" data-astro-cid-fnj4sbw7> <h2 style="font-family:'Fraunces',serif;font-size:1.15rem;font-weight:900;margin-bottom:1rem;color:var(--text);" data-astro-cid-fnj4sbw7>
You might also like
<span style="font-size:.72rem;font-weight:600;color:var(--soft);font-family:'DM Sans',sans-serif;margin-left:.5rem;" data-astro-cid-fnj4sbw7>similar recipes</span> </h2> <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;" data-astro-cid-fnj4sbw7> ${similarRecipes.map((r) => renderTemplate`<a${addAttribute(`/dashboard/recipe/${r.id}`, "href")} style="text-decoration:none;" data-astro-cid-fnj4sbw7> <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .2s;" onmouseenter="this.style.transform='translateY(-3px)';this.style.borderColor='rgba(16,185,129,.3)'" onmouseleave="this.style.transform='';this.style.borderColor=''" data-astro-cid-fnj4sbw7> ${r.image_url && renderTemplate`<img${addAttribute(r.image_url, "src")}${addAttribute(r.title, "alt")} style="width:100%;aspect-ratio:4/3;object-fit:cover;" loading="lazy" data-astro-cid-fnj4sbw7>`} <div style="padding:.75rem;" data-astro-cid-fnj4sbw7> <div style="font-weight:700;font-size:.82rem;color:var(--text);margin-bottom:.3rem;line-height:1.3;" data-astro-cid-fnj4sbw7>${r.title}</div> <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;" data-astro-cid-fnj4sbw7> <span style="font-size:.68rem;font-weight:700;padding:.1rem .4rem;border-radius:5px;background:rgba(239,68,68,.1);color:#ef4444;" data-astro-cid-fnj4sbw7>${r.net_carbs}g C</span> <span style="font-size:.68rem;font-weight:700;padding:.1rem .4rem;border-radius:5px;background:rgba(16,185,129,.1);color:var(--green);" data-astro-cid-fnj4sbw7>${r.calories} cal</span> ${r.avgRating > 0 && renderTemplate`<span style="font-size:.68rem;font-weight:700;color:var(--gold);" data-astro-cid-fnj4sbw7>★ ${r.avgRating.toFixed(1)}</span>`} </div> </div> </div> </a>`)} </div> </div>`, defineScriptVars({ taskId: task?.id || null, mealPlanType: mealPlan?.meal_type || null, dayNum: currentDay, xpEarned: task?.xp_earned || 25, totalIng: ingredients.length, recipeTitle: recipe.title, recipeCal: recipe.calories || 0, recipeProtein: recipe.protein || 0, recipeFat: recipe.fat || 0, recipeCarbs: recipe.net_carbs || 0, recipeId: recipe.id }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/recipe/[id].astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/recipe/[id].astro";
const $$url = "/dashboard/recipe/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
