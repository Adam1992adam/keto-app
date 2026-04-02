/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, F as Fragment, h as renderHead, g as addAttribute } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$ } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$UtensilsCrossed } from '../../chunks/UtensilsCrossed_CmfPppog.mjs';
import { $ as $$Clock } from '../../chunks/Clock_jKl9HRKB.mjs';
import { $ as $$Flame } from '../../chunks/Flame_EKYKv-jW.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro();
const $$Heart = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Heart;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "heart", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Heart.astro", void 0);

const $$Astro$1 = createAstro();
const $$Search = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Search;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "search", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="m21 21-4.34-4.34"></path> <circle cx="11" cy="11" r="8"></circle> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Search.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Favorites = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Favorites;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "Friend";
  const { data: favs } = await supabase.from("recipe_favorites").select("recipe_id, recipes(id, title, calories, protein, fat, net_carbs, image_url, prep_time, cook_time, tags)").eq("user_id", user.id).order("created_at", { ascending: false });
  const favorites = (favs || []).map((f) => f.recipes).filter(Boolean);
  const favCount = favorites.length;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-kce3lcqb> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Favourite Recipes \u2014 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">', "</head> <body data-astro-cid-kce3lcqb> ", ' <div class="page-wrap" data-astro-cid-kce3lcqb> <div class="page-header" data-astro-cid-kce3lcqb> <h1 data-astro-cid-kce3lcqb>', " Favourite Recipes</h1> ", " </div> ", " ", " </div> <script>\n    // Search filter\n    var searchInput = document.getElementById('searchInput');\n    if (searchInput) {\n      searchInput.addEventListener('input', function() {\n        var query = this.value.toLowerCase().trim();\n        var cards = document.querySelectorAll('#recipeGrid .recipe-card');\n        var visible = 0;\n        cards.forEach(function(card) {\n          var title = card.getAttribute('data-title') || '';\n          var show = !query || title.includes(query);\n          card.style.display = show ? '' : 'none';\n          if (show) visible++;\n        });\n        var noResults = document.getElementById('noResults');\n        if (noResults) {\n          noResults.style.display = visible === 0 ? 'block' : 'none';\n        }\n      });\n    }\n\n    // Remove from favourites\n    window.removeFav = function(event, recipeId) {\n      event.preventDefault();\n      event.stopPropagation();\n      var btn = event.currentTarget;\n      btn.textContent = '\u{1F90D}';\n      btn.style.pointerEvents = 'none';\n\n      fetch('/api/recipes/favorite', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ recipeId: recipeId })\n      })\n      .then(function(res) { return res.json(); })\n      .then(function() {\n        var card = document.getElementById('card-' + recipeId);\n        if (card) {\n          card.style.transition = 'opacity .3s, transform .3s';\n          card.style.opacity = '0';\n          card.style.transform = 'scale(.92)';\n          setTimeout(function() {\n            card.remove();\n            // Update subtitle count\n            var remaining = document.querySelectorAll('#recipeGrid .recipe-card').length;\n            var subtitle = document.querySelector('.subtitle');\n            if (subtitle) {\n              subtitle.innerHTML = 'You have <strong>' + remaining + '</strong> saved recipe' + (remaining === 1 ? '' : 's');\n            }\n            if (remaining === 0) {\n              window.location.reload();\n            }\n          }, 320);\n        }\n      })\n      .catch(function() {\n        btn.textContent = '\u2764\uFE0F';\n        btn.style.pointerEvents = '';\n      });\n    };\n  <\/script> </body> </html>"])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "favorites", "data-astro-cid-kce3lcqb": true }), renderComponent($$result, "Heart", $$Heart, { "size": 26, "style": "vertical-align:middle;margin-right:.5rem;", "data-astro-cid-kce3lcqb": true }), favCount > 0 && renderTemplate`<p class="subtitle" data-astro-cid-kce3lcqb>
You have <strong data-astro-cid-kce3lcqb>${favCount}</strong> saved recipe${favCount === 1 ? "" : "s"} </p>`, favCount > 0 && renderTemplate`<div class="search-wrap" data-astro-cid-kce3lcqb> <div class="search-box" data-astro-cid-kce3lcqb> <span class="search-icon" data-astro-cid-kce3lcqb>${renderComponent($$result, "Search", $$Search, { "size": 16, "data-astro-cid-kce3lcqb": true })}</span> <input type="text" id="searchInput" placeholder="Search your favourites…" autocomplete="off" data-astro-cid-kce3lcqb> </div> </div>`, favCount === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-kce3lcqb> <div class="empty-icon" data-astro-cid-kce3lcqb>${renderComponent($$result, "Heart", $$Heart, { "size": 42, "data-astro-cid-kce3lcqb": true })}</div> <h2 data-astro-cid-kce3lcqb>No favourites yet</h2> <p data-astro-cid-kce3lcqb>Heart a recipe to save it here for quick access.</p> <a href="/dashboard/recipes" class="btn-browse" data-astro-cid-kce3lcqb>Browse Recipes</a> </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-kce3lcqb": true }, { "default": async ($$result2) => renderTemplate` <div class="no-results" id="noResults" data-astro-cid-kce3lcqb>No recipes match your search.</div> <div class="recipe-grid" id="recipeGrid" data-astro-cid-kce3lcqb> ${favorites.map((recipe, idx) => {
    const tags = Array.isArray(recipe.tags) ? recipe.tags.slice(0, 3) : [];
    const delay = (idx * 0.06).toFixed(2);
    return renderTemplate`<div class="recipe-card"${addAttribute(recipe.title?.toLowerCase(), "data-title")}${addAttribute(`animation-delay:${delay}s`, "style")}${addAttribute(`card-${recipe.id}`, "id")} data-astro-cid-kce3lcqb> <div class="card-image-wrap" data-astro-cid-kce3lcqb> ${recipe.image_url ? renderTemplate`<img${addAttribute(recipe.image_url, "src")}${addAttribute(recipe.title, "alt")} loading="lazy" data-astro-cid-kce3lcqb>` : renderTemplate`<div class="card-image-placeholder" data-astro-cid-kce3lcqb>${renderComponent($$result2, "UtensilsCrossed", $$UtensilsCrossed, { "size": 32, "data-astro-cid-kce3lcqb": true })}</div>`} <button class="unfav-btn" aria-label="Remove from favourites"${addAttribute(`window.removeFav(event, '${recipe.id}')`, "onclick")} data-astro-cid-kce3lcqb>${renderComponent($$result2, "Heart", $$Heart, { "size": 16, "data-astro-cid-kce3lcqb": true })}</button> </div> <div class="card-body" data-astro-cid-kce3lcqb> <a${addAttribute(`/dashboard/recipe/${recipe.id}`, "href")} class="card-title-link" data-astro-cid-kce3lcqb> <div class="card-title" data-astro-cid-kce3lcqb>${recipe.title}</div> </a> <div class="card-meta" data-astro-cid-kce3lcqb> ${recipe.prep_time && renderTemplate`<span data-astro-cid-kce3lcqb>${renderComponent($$result2, "Clock", $$Clock, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-kce3lcqb": true })} ${recipe.prep_time}m prep</span>`} ${recipe.cook_time && renderTemplate`<span data-astro-cid-kce3lcqb>${renderComponent($$result2, "Flame", $$Flame, { "size": 13, "style": "vertical-align:middle;margin-right:.2rem;", "data-astro-cid-kce3lcqb": true })} ${recipe.cook_time}m cook</span>`} </div> <div class="macro-row" data-astro-cid-kce3lcqb> ${recipe.calories && renderTemplate`<span class="macro-pill pill-cal" data-astro-cid-kce3lcqb>${recipe.calories} kcal</span>`} ${recipe.protein && renderTemplate`<span class="macro-pill pill-pro" data-astro-cid-kce3lcqb>${recipe.protein}g P</span>`} ${recipe.fat && renderTemplate`<span class="macro-pill pill-fat" data-astro-cid-kce3lcqb>${recipe.fat}g F</span>`} ${recipe.net_carbs && renderTemplate`<span class="macro-pill pill-carb" data-astro-cid-kce3lcqb>${recipe.net_carbs}g C</span>`} </div> ${tags.length > 0 && renderTemplate`<div class="tags-row" data-astro-cid-kce3lcqb> ${tags.map((tag) => renderTemplate`<span class="tag-chip" data-astro-cid-kce3lcqb>${tag}</span>`)} </div>`} </div> </div>`;
  })} </div> ` })}`);
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/favorites.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/favorites.astro";
const $$url = "/dashboard/favorites";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Favorites,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
