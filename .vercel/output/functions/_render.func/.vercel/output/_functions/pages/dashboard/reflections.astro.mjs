/* empty css                                          */
import { c as createComponent, r as renderComponent, m as maybeRenderHead, d as renderTemplate, e as createAstro, F as Fragment, h as renderHead, g as addAttribute } from '../../chunks/astro/server_DusAYKlQ.mjs';
import 'kleur/colors';
import { s as supabase } from '../../chunks/supabase_D4h9lf_Y.mjs';
import { r as requireAuth } from '../../chunks/auth_DxNH3rhr.mjs';
import { a as $$DashNav, d as $$Moon } from '../../chunks/DashNav_DqRIYqYD.mjs';
import { $ as $$BookOpen } from '../../chunks/BookOpen_CQB9IXtW.mjs';
import { $ as $$Star } from '../../chunks/Star_D1SG2E9R.mjs';
import { $ as $$Droplets } from '../../chunks/Droplets_D_Q7yuSH.mjs';
import { $ as $$CheckCircle } from '../../chunks/CheckCircle_QKR1qvhr.mjs';
import { $ as $$, a as $$Zap } from '../../chunks/Utensils_DbwmzDI-.mjs';
/* empty css                                          */
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$X = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$X;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "x", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M18 6 6 18"></path> <path d="m6 6 12 12"></path> ` })}`;
}, "C:/Users/abdellatif/Videos/keto-app/node_modules/lucide-astro/dist/X.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Reflections = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Reflections;
  const auth = await requireAuth(Astro2);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { user, profile } = auth;
  const planType = profile.subscription_tier || "basic_30";
  const tierLabel = planType === "elite_12" ? "\u{1F451} Elite" : planType === "pro_6" ? "\u26A1 Pro" : "\u{1F951} Basic";
  const userName = profile.full_name?.split(" ")[0] || "Friend";
  const { data: reflections } = await supabase.from("daily_reflections").select("*").eq("user_id", user.id).order("reflection_date", { ascending: false }).limit(30);
  const thirtyAgo = new Date(Date.now() - 29 * 864e5).toISOString().split("T")[0];
  const { data: checkins } = await supabase.from("daily_checkins").select("checkin_date, energy_level, mood_level, water_glasses, followed_meals, note, sleep_hours, sleep_quality").eq("user_id", user.id).gte("checkin_date", thirtyAgo).order("checkin_date", { ascending: false });
  const reflMap = /* @__PURE__ */ new Map();
  (reflections || []).forEach((r) => {
    reflMap.set(r.reflection_date, r);
  });
  const checkinMap = /* @__PURE__ */ new Map();
  (checkins || []).forEach((c) => {
    checkinMap.set(c.checkin_date, c);
  });
  const allDates = Array.from(/* @__PURE__ */ new Set([
    ...(reflections || []).map((r) => r.reflection_date),
    ...(checkins || []).map((c) => c.checkin_date)
  ])).sort((a, b) => a < b ? 1 : -1);
  const hasData = allDates.length > 0;
  const last7Checkins = (checkins || []).slice(0, 7);
  const avg7Energy = last7Checkins.length ? (last7Checkins.reduce((s, c) => s + (c.energy_level || 3), 0) / last7Checkins.length).toFixed(1) : null;
  const avg7Mood = last7Checkins.length ? (last7Checkins.reduce((s, c) => s + (c.mood_level || 3), 0) / last7Checkins.length).toFixed(1) : null;
  const avg7Water = last7Checkins.length ? (last7Checkins.reduce((s, c) => s + (c.water_glasses || 0), 0) / last7Checkins.length).toFixed(1) : null;
  const avg7Meals = last7Checkins.length ? Math.round(last7Checkins.filter((c) => c.followed_meals).length / last7Checkins.length * 100) : null;
  const moodEmojis = ["", "\u{1F614}", "\u{1F610}", "\u{1F60A}", "\u{1F604}", "\u{1F929}"];
  const energyMax = 5;
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = /* @__PURE__ */ new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  const entries = allDates.map((date) => {
    const refl = reflMap.get(date);
    const checkin = checkinMap.get(date);
    const energy = refl?.energy_level || checkin?.energy_level || 0;
    const mood = refl?.mood_level || checkin?.mood_level || 0;
    const water = checkin?.water_glasses || 0;
    const mealOk = checkin?.followed_meals;
    const note = refl?.note || checkin?.note || "";
    const highlights = refl?.highlights || "";
    const challenges = refl?.challenges || "";
    const sleepH = checkin?.sleep_hours || 0;
    const sleepQ = checkin?.sleep_quality || 0;
    const moodEmoji = moodEmojis[mood] || "";
    const energyStars = energy > 0 ? "\u2B50".repeat(energy) + "\u2606".repeat(Math.max(0, energyMax - energy)) : "";
    return { date, dateLabel: formatDate(date), energy, mood, water, mealOk, note, highlights, challenges, sleepH, sleepQ, moodEmoji, energyStars };
  });
  const energyPct = avg7Energy ? Math.round(parseFloat(avg7Energy) / 5 * 100) : 0;
  const moodPct = avg7Mood ? Math.round(parseFloat(avg7Mood) / 5 * 100) : 0;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-tidkmpae> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Daily Reflections \u2014 Keto Journey</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">', "</head> <body data-astro-cid-tidkmpae> ", ' <div class="page-wrap" data-astro-cid-tidkmpae> <div class="page-header" data-astro-cid-tidkmpae> <h1 data-astro-cid-tidkmpae>', " Daily Reflections</h1> ", " </div> ", ` </div> <!-- \u2500\u2500 Add Reflection FAB \u2500\u2500 --> <button class="fab" onclick="openReflModal()" title="Add today's reflection" data-astro-cid-tidkmpae>\uFF0B Reflect</button> <!-- \u2500\u2500 Reflection Modal \u2500\u2500 --> <div id="reflModal" style="display:none;position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);overflow-y:auto;padding:1.5rem;" onclick="closeReflModal(event)" data-astro-cid-tidkmpae> <div style="background:var(--card,#0d1a0f);border:1px solid var(--border2,rgba(16,185,129,.22));border-radius:24px;max-width:500px;margin:3rem auto;padding:2rem;" onclick="event.stopPropagation()" data-astro-cid-tidkmpae> <h2 style="font-family:'Fraunces',serif;font-size:1.4rem;margin-bottom:1.5rem;" data-astro-cid-tidkmpae>`, ` Today's Reflection</h2> <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;" data-astro-cid-tidkmpae> <div data-astro-cid-tidkmpae> <label style="display:block;font-size:.78rem;color:var(--soft);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-tidkmpae>Energy (1\u20135)</label> <input id="rf_energy" type="number" min="1" max="5" placeholder="3" style="width:100%;background:var(--card2,#111f13);border:1px solid var(--border);border-radius:10px;padding:.6rem .9rem;color:var(--text);font-size:.95rem;" data-astro-cid-tidkmpae> </div> <div data-astro-cid-tidkmpae> <label style="display:block;font-size:.78rem;color:var(--soft);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-tidkmpae>Mood (1\u20135)</label> <input id="rf_mood" type="number" min="1" max="5" placeholder="3" style="width:100%;background:var(--card2,#111f13);border:1px solid var(--border);border-radius:10px;padding:.6rem .9rem;color:var(--text);font-size:.95rem;" data-astro-cid-tidkmpae> </div> </div> <div style="margin-bottom:1.25rem;" data-astro-cid-tidkmpae> <label style="display:block;font-size:.78rem;color:var(--soft);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-tidkmpae>Notes</label> <textarea id="rf_notes" rows="3" placeholder="How was your day on keto?" style="width:100%;background:var(--card2,#111f13);border:1px solid var(--border);border-radius:10px;padding:.7rem .9rem;color:var(--text);font-size:.9rem;resize:vertical;font-family:inherit;" data-astro-cid-tidkmpae></textarea> </div> <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;" data-astro-cid-tidkmpae> <div data-astro-cid-tidkmpae> <label style="display:block;font-size:.78rem;color:var(--soft);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-tidkmpae>Win / Highlight</label> <input id="rf_highlights" type="text" placeholder="Something that went well\u2026" style="width:100%;background:var(--card2,#111f13);border:1px solid var(--border);border-radius:10px;padding:.6rem .9rem;color:var(--text);font-size:.9rem;" data-astro-cid-tidkmpae> </div> <div data-astro-cid-tidkmpae> <label style="display:block;font-size:.78rem;color:var(--soft);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em;" data-astro-cid-tidkmpae>Challenge</label> <input id="rf_challenges" type="text" placeholder="Something difficult\u2026" style="width:100%;background:var(--card2,#111f13);border:1px solid var(--border);border-radius:10px;padding:.6rem .9rem;color:var(--text);font-size:.9rem;" data-astro-cid-tidkmpae> </div> </div> <div id="rf_error" style="display:none;color:#ef4444;font-size:.85rem;margin-bottom:1rem;" data-astro-cid-tidkmpae></div> <div style="display:flex;gap:.75rem;" data-astro-cid-tidkmpae> <button onclick="saveReflection()" style="flex:1;background:var(--green,#10b981);color:#fff;border:none;border-radius:12px;padding:.8rem;font-size:.95rem;font-weight:600;cursor:pointer;" data-astro-cid-tidkmpae>Save Reflection +15 XP</button> <button onclick="closeReflModal()" style="background:var(--card2,#111f13);border:1px solid var(--border);color:var(--soft);border-radius:12px;padding:.8rem 1.2rem;cursor:pointer;" data-astro-cid-tidkmpae>Cancel</button> </div> </div> </div>  <script>
    function openReflModal() {
      document.getElementById('reflModal').style.display = 'block';
      document.getElementById('rf_error').style.display = 'none';
    }
    function closeReflModal(e) {
      if (!e || e.target === document.getElementById('reflModal')) {
        document.getElementById('reflModal').style.display = 'none';
      }
    }
    function saveReflection() {
      var energy     = parseInt(document.getElementById('rf_energy').value) || null;
      var mood       = parseInt(document.getElementById('rf_mood').value) || null;
      var notes      = document.getElementById('rf_notes').value.trim() || null;
      var highlights = document.getElementById('rf_highlights').value.trim() || null;
      var challenges = document.getElementById('rf_challenges').value.trim() || null;
      var errEl      = document.getElementById('rf_error');

      if (energy && (energy < 1 || energy > 5)) { errEl.textContent = 'Energy must be 1\u20135'; errEl.style.display='block'; return; }
      if (mood   && (mood   < 1 || mood   > 5)) { errEl.textContent = 'Mood must be 1\u20135';   errEl.style.display='block'; return; }
      if (!energy && !mood && !notes && !highlights && !challenges) {
        errEl.textContent = 'Please fill in at least one field.'; errEl.style.display='block'; return;
      }

      fetch('/api/reflection/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energy_level:    energy,
          mood_level:      mood,
          notes:           notes,
          highlights:      highlights,
          challenges:      challenges,
          client_date:     new Date().toLocaleDateString('en-CA'),
        }),
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { errEl.textContent = data.error; errEl.style.display='block'; return; }
        document.getElementById('reflModal').style.display = 'none';
        window.location.reload();
      })
      .catch(function() { errEl.textContent = 'Failed to save. Please try again.'; errEl.style.display='block'; });
    }
  <\/script> </body> </html>`])), renderHead(), renderComponent($$result, "DashNav", $$DashNav, { "userId": user.id, "userName": userName, "tierLabel": tierLabel, "planType": planType, "activePage": "reflections", "data-astro-cid-tidkmpae": true }), renderComponent($$result, "BookOpen", $$BookOpen, { "size": 28, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true }), hasData && renderTemplate`<p class="subtitle" data-astro-cid-tidkmpae>Your last 30 days of check-ins and reflections</p>`, !hasData ? renderTemplate`<div class="empty-state" data-astro-cid-tidkmpae> <div class="empty-icon" data-astro-cid-tidkmpae>${renderComponent($$result, "BookOpen", $$BookOpen, { "size": 48, "color": "var(--soft)", "data-astro-cid-tidkmpae": true })}</div> <h2 data-astro-cid-tidkmpae>Nothing logged yet</h2> <p data-astro-cid-tidkmpae>Complete your first daily check-in to start your reflection history.</p> <a href="/dashboard/checkin" class="btn-checkin" data-astro-cid-tidkmpae>Start Check-in</a> </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-tidkmpae": true }, { "default": async ($$result2) => renderTemplate`${last7Checkins.length > 0 && renderTemplate`<div class="summary-bar" data-astro-cid-tidkmpae> <h3 data-astro-cid-tidkmpae>7-day averages</h3> <div class="summary-stats" data-astro-cid-tidkmpae> <div class="stat-item" data-astro-cid-tidkmpae> <span class="stat-label" data-astro-cid-tidkmpae>Energy</span> <span class="stat-value" data-astro-cid-tidkmpae>${avg7Energy} / 5</span> <div class="stat-bar-wrap" data-astro-cid-tidkmpae> <div class="stat-bar-fill"${addAttribute(`width:${energyPct}%`, "style")} data-astro-cid-tidkmpae></div> </div> </div> <div class="stat-item" data-astro-cid-tidkmpae> <span class="stat-label" data-astro-cid-tidkmpae>Mood</span> <span class="stat-value" data-astro-cid-tidkmpae>${avg7Mood} / 5</span> <div class="stat-bar-wrap" data-astro-cid-tidkmpae> <div class="stat-bar-fill mood"${addAttribute(`width:${moodPct}%`, "style")} data-astro-cid-tidkmpae></div> </div> </div> <div class="stat-item" data-astro-cid-tidkmpae> <span class="stat-label" data-astro-cid-tidkmpae>Water (glasses)</span> <span class="stat-value" data-astro-cid-tidkmpae>${avg7Water}</span> <div class="stat-bar-wrap" data-astro-cid-tidkmpae> <div class="stat-bar-fill water"${addAttribute(`width:${Math.min(100, Math.round(parseFloat(avg7Water || "0") / 10 * 100))}%`, "style")} data-astro-cid-tidkmpae></div> </div> </div> <div class="stat-item" data-astro-cid-tidkmpae> <span class="stat-label" data-astro-cid-tidkmpae>Meal adherence</span> <span class="stat-value" data-astro-cid-tidkmpae>${avg7Meals}%</span> <div class="stat-bar-wrap" data-astro-cid-tidkmpae> <div class="stat-bar-fill meals"${addAttribute(`width:${avg7Meals}%`, "style")} data-astro-cid-tidkmpae></div> </div> </div> </div> </div>`}<div class="timeline" data-astro-cid-tidkmpae> ${entries.map((entry, idx) => {
    const delay = (0.06 + idx * 0.05).toFixed(2);
    return renderTemplate`<div class="timeline-entry"${addAttribute(`animation-delay:${delay}s`, "style")} data-astro-cid-tidkmpae> <div class="timeline-dot" data-astro-cid-tidkmpae></div> <div class="entry-card" data-astro-cid-tidkmpae> <div class="entry-date" data-astro-cid-tidkmpae>${entry.dateLabel}</div> <div class="entry-vitals" data-astro-cid-tidkmpae> ${entry.energy > 0 && renderTemplate`<div class="vital-item" data-astro-cid-tidkmpae> <span class="vital-label" data-astro-cid-tidkmpae>Energy</span> <span class="vital-stars" data-astro-cid-tidkmpae>${entry.energyStars}</span> </div>`} ${entry.mood > 0 && renderTemplate`<div class="vital-item" data-astro-cid-tidkmpae> <span class="vital-label" data-astro-cid-tidkmpae>Mood</span> <span class="vital-value" data-astro-cid-tidkmpae>${entry.moodEmoji}</span> </div>`} ${entry.water > 0 && renderTemplate`<div class="vital-item" data-astro-cid-tidkmpae> <span class="vital-label" data-astro-cid-tidkmpae>Water</span> <span class="vital-value" data-astro-cid-tidkmpae>${renderComponent($$result2, "Droplets", $$Droplets, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true })} ${entry.water}</span> </div>`} <div class="vital-item" data-astro-cid-tidkmpae> <span class="vital-label" data-astro-cid-tidkmpae>Meals</span> ${entry.mealOk ? renderTemplate`<span class="vital-value badge-ok" data-astro-cid-tidkmpae>${renderComponent($$result2, "CheckCircle", $$CheckCircle, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true })} Followed</span>` : renderTemplate`<span class="vital-value badge-no" data-astro-cid-tidkmpae>${renderComponent($$result2, "X", $$X, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true })} Skipped</span>`} </div> ${entry.sleepH > 0 && renderTemplate`<div class="vital-item" data-astro-cid-tidkmpae> <span class="vital-label" data-astro-cid-tidkmpae>Sleep</span> <span class="vital-value" data-astro-cid-tidkmpae>${renderComponent($$result2, "Moon", $$Moon, { "size": 13, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true })} ${entry.sleepH}h</span> </div>`} </div> ${(entry.note || entry.highlights || entry.challenges) && renderTemplate`<div class="entry-divider" data-astro-cid-tidkmpae></div>`} ${entry.note && renderTemplate`<div class="entry-note" data-astro-cid-tidkmpae>"${entry.note}"</div>`} ${(entry.highlights || entry.challenges) && renderTemplate`<div class="entry-extras" data-astro-cid-tidkmpae> ${entry.highlights && renderTemplate`<span class="extra-chip" data-astro-cid-tidkmpae>${renderComponent($$result2, "Star", $$Star, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true })} <strong data-astro-cid-tidkmpae>Win:</strong> ${entry.highlights}</span>`} ${entry.challenges && renderTemplate`<span class="extra-chip" data-astro-cid-tidkmpae>${renderComponent($$result2, "Zap", $$Zap, { "size": 12, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true })} <strong data-astro-cid-tidkmpae>Challenge:</strong> ${entry.challenges}</span>`} </div>`} </div> </div>`;
  })} </div> ` })}`, renderComponent($$result, "BookOpen", $$BookOpen, { "size": 20, "style": "display:inline;vertical-align:middle;", "data-astro-cid-tidkmpae": true }));
}, "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/reflections.astro", void 0);

const $$file = "C:/Users/abdellatif/Videos/keto-app/src/pages/dashboard/reflections.astro";
const $$url = "/dashboard/reflections";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Reflections,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
