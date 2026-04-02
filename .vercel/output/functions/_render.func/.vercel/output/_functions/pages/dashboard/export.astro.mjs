/* empty css                                          */
import { c as createComponent, r as renderComponent, d as renderTemplate, e as createAstro, m as maybeRenderHead, h as renderHead } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { d as getUserJourney } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { a as $$DashNav } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$, b as $$Utensils } from '../../chunks/Utensils_DbwmzDI-.mjs';
import { $ as $$BarChart3 } from '../../chunks/BarChart3_BX3FTjqm.mjs';
import { $ as $$Info } from '../../chunks/Info_uBFi0AyP.mjs';
import { $ as $$TrendingUp } from '../../chunks/TrendingUp_BZiNmqs5.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro$2 = createAstro();
const $$Download = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Download;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "download", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M12 15V3"></path> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path> <path d="m7 10 5 5 5-5"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/Download.astro", void 0);

const $$Astro$1 = createAstro();
const $$FileText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FileText;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "file-text", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path> <path d="M14 2v5a1 1 0 0 0 1 1h5"></path> <path d="M10 9H8"></path> <path d="M16 13H8"></path> <path d="M16 17H8"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/FileText.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Export = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Export;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "there";
  const journey = await getUserJourney(user.id);
  journey?.current_day || 1;
  const imperial = (profile.preferred_units || "imperial") === "imperial";
  const wUnit = imperial ? "lbs" : "kg";
  const mUnit = imperial ? "in" : "cm";
  return renderTemplate(_a || (_a = __template([`<html lang="en" data-astro-cid-3xwu6ps3> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Export Data \u2014 Keto Journey</title><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"><script>
    (function(){ var t = localStorage.getItem('keto-theme') || 'dark'; document.documentElement.setAttribute('data-theme', t); })();
  <\/script>`, "</head> <body data-astro-cid-3xwu6ps3> ", ' <main class="page" data-astro-cid-3xwu6ps3> <!-- \u2500\u2500 Page header \u2500\u2500 --> <div class="page-header" data-astro-cid-3xwu6ps3> <h1 data-astro-cid-3xwu6ps3>Export <span data-astro-cid-3xwu6ps3>Your Data</span></h1> <p data-astro-cid-3xwu6ps3>Download your personal keto journey data as CSV files. Open them in Excel, Google Sheets, or any spreadsheet app.</p> </div> <!-- \u2500\u2500 Export cards \u2500\u2500 --> <div class="cards-grid" data-astro-cid-3xwu6ps3> <!-- Weight Log --> <div class="export-card" data-astro-cid-3xwu6ps3> <div class="card-icon-row" data-astro-cid-3xwu6ps3> <div class="card-icon icon-green" data-astro-cid-3xwu6ps3>', `</div> <div data-astro-cid-3xwu6ps3> <div class="card-title" data-astro-cid-3xwu6ps3>Weight Log</div> <div class="card-subtitle" data-astro-cid-3xwu6ps3>All your weigh-in records</div> </div> </div> <p class="card-desc" data-astro-cid-3xwu6ps3>
Every weight entry you've logged throughout your journey, sorted by date from oldest to newest.
</p> <div class="card-columns" data-astro-cid-3xwu6ps3> <span class="col-pill" data-astro-cid-3xwu6ps3>Date</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Weight (`, `)</span> </div> <button class="btn-download" onclick="window.downloadExport('weight', this)" data-astro-cid-3xwu6ps3> `, ' Download CSV\n</button> </div> <!-- Daily Check-ins --> <div class="export-card" data-astro-cid-3xwu6ps3> <div class="card-icon-row" data-astro-cid-3xwu6ps3> <div class="card-icon icon-blue" data-astro-cid-3xwu6ps3>', `</div> <div data-astro-cid-3xwu6ps3> <div class="card-title" data-astro-cid-3xwu6ps3>Daily Check-ins</div> <div class="card-subtitle" data-astro-cid-3xwu6ps3>Energy, mood, symptoms & habits</div> </div> </div> <p class="card-desc" data-astro-cid-3xwu6ps3>
Your daily check-in history including energy levels, mood, hydration, symptoms like headaches or cravings, and whether you followed your meals.
</p> <div class="card-columns" data-astro-cid-3xwu6ps3> <span class="col-pill" data-astro-cid-3xwu6ps3>Date</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Energy</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Mood</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Hunger</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Water</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Headache</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Fatigue</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Cravings</span> <span class="col-pill" data-astro-cid-3xwu6ps3>XP Earned</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Note</span> </div> <button class="btn-download" onclick="window.downloadExport('checkins', this)" data-astro-cid-3xwu6ps3> `, ' Download CSV\n</button> </div> <!-- Food Log --> <div class="export-card" data-astro-cid-3xwu6ps3> <div class="card-icon-row" data-astro-cid-3xwu6ps3> <div class="card-icon icon-purple" data-astro-cid-3xwu6ps3>', `</div> <div data-astro-cid-3xwu6ps3> <div class="card-title" data-astro-cid-3xwu6ps3>Food Log</div> <div class="card-subtitle" data-astro-cid-3xwu6ps3>Everything you've eaten</div> </div> </div> <p class="card-desc" data-astro-cid-3xwu6ps3>
Your complete food diary with full macro breakdown for every logged meal. Great for analysing your nutrition patterns over time.
</p> <div class="card-columns" data-astro-cid-3xwu6ps3> <span class="col-pill" data-astro-cid-3xwu6ps3>Date</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Food Name</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Meal Type</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Calories</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Protein (g)</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Carbs (g)</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Fat (g)</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Serving</span> </div> <button class="btn-download" onclick="window.downloadExport('food', this)" data-astro-cid-3xwu6ps3> `, ' Download CSV\n</button> </div> <!-- Body Measurements --> <div class="export-card" data-astro-cid-3xwu6ps3> <div class="card-icon-row" data-astro-cid-3xwu6ps3> <div class="card-icon icon-gold" data-astro-cid-3xwu6ps3>', '</div> <div data-astro-cid-3xwu6ps3> <div class="card-title" data-astro-cid-3xwu6ps3>Body Measurements</div> <div class="card-subtitle" data-astro-cid-3xwu6ps3>Neck, waist, hips & more</div> </div> </div> <p class="card-desc" data-astro-cid-3xwu6ps3>\nAll your body measurement snapshots over time. Track inches lost across six key measurement sites from the day you started.\n</p> <div class="card-columns" data-astro-cid-3xwu6ps3> <span class="col-pill" data-astro-cid-3xwu6ps3>Date</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Neck (', ')</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Waist (', ')</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Hips (', ')</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Chest (', ')</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Arm (', ')</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Thigh (', `)</span> <span class="col-pill" data-astro-cid-3xwu6ps3>Notes</span> </div> <button class="btn-download" onclick="window.downloadExport('measurements', this)" data-astro-cid-3xwu6ps3> `, ' Download CSV\n</button> </div> </div> <!-- \u2500\u2500 Info banner \u2500\u2500 --> <div class="info-banner" data-astro-cid-3xwu6ps3> <span class="info-banner-icon" data-astro-cid-3xwu6ps3>', `</span> <span data-astro-cid-3xwu6ps3>
CSV files open in Excel, Google Sheets, Numbers, or any text editor.
      Your data belongs to you \u2014 exported files contain only your personal records and are never shared.
</span> </div> </main> <!-- Toast notification --> <div id="export-toast" data-astro-cid-3xwu6ps3></div> <script>
(function () {
  /* \u2500\u2500 Show a brief toast message \u2500\u2500 */
  function showToast(msg, isError) {
    var toast = document.getElementById('export-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = isError ? 'error show' : 'show';
    setTimeout(function () { toast.className = isError ? 'error' : ''; }, 3000);
  }

  /* \u2500\u2500 Trigger a CSV download from a Blob \u2500\u2500 */
  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a   = document.createElement('a');
    a.href  = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 500);
  }

  /* \u2500\u2500 Filename map \u2500\u2500 */
  var filenames = {
    weight:       'keto-weight.csv',
    checkins:     'keto-checkins.csv',
    food:         'keto-food-log.csv',
    measurements: 'keto-measurements.csv',
  };

  /* \u2500\u2500 Main download handler \u2014 assigned to window so onclick can reach it \u2500\u2500 */
  window.downloadExport = function (type, btn) {
    if (!type || !filenames[type]) return;

    /* Show loading state */
    var originalHtml = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = 'Preparing\u2026';

    fetch('/api/export/' + type, { credentials: 'include' })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) {
            throw new Error(err.error || 'Export failed');
          });
        }
        return res.blob();
      })
      .then(function (blob) {
        triggerDownload(blob, filenames[type]);
        showToast('Download started!', false);
      })
      .catch(function (err) {
        showToast(err.message || 'Export failed. Please try again.', true);
      })
      .finally(function () {
        btn.classList.remove('loading');
        btn.innerHTML = originalHtml;
      });
  };
})();
<\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "profile", "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "TrendingUp", $$TrendingUp, { "size": 20, "data-astro-cid-3xwu6ps3": true }), wUnit, renderComponent($$result, "Download", $$Download, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "FileText", $$FileText, { "size": 20, "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "Download", $$Download, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "Utensils", $$Utensils, { "size": 20, "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "Download", $$Download, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "BarChart3", $$BarChart3, { "size": 20, "data-astro-cid-3xwu6ps3": true }), mUnit, mUnit, mUnit, mUnit, mUnit, mUnit, renderComponent($$result, "Download", $$Download, { "size": 15, "style": "vertical-align:middle;margin-right:.3rem;", "data-astro-cid-3xwu6ps3": true }), renderComponent($$result, "Info", $$Info, { "size": 18, "data-astro-cid-3xwu6ps3": true }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/export.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/export.astro";
const $$url = "/dashboard/export";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Export,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
